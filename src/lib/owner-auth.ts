import "server-only";

import {
  createHash,
  createHmac,
  randomBytes,
  scrypt as nodeScrypt,
  timingSafeEqual,
} from "node:crypto";
import { cookies } from "next/headers";

const OWNER_USERNAME = "Samir";
const PASSWORD_SALT = Buffer.from("2EQ0x6KKAN1NEfFbD7aO9Q", "base64url");
const PASSWORD_HASH = Buffer.from(
  "hHNmNjNCzdt8qif3zsHlAiMoHQ-Wb5fcDwN8Ro6m33MDyQsTTyT1BsJhA8YX2ebcIifWA2rrnGgUQiN15v2IMg",
  "base64url",
);

const SESSION_MAX_AGE_SECONDS = 12 * 60 * 60;
const SESSION_COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Host-salon-sara-owner"
    : "salon-sara-owner";

const LOGIN_WINDOW_MS = 15 * 60 * 1_000;
const LOGIN_BLOCK_MS = 15 * 60 * 1_000;
const MAX_LOGIN_FAILURES = 5;
const MAX_RATE_LIMIT_ENTRIES = 1_000;

interface OwnerSessionPayload {
  version: 1;
  subject: "owner";
  issuedAt: number;
  expiresAt: number;
  nonce: string;
}

interface LoginRateLimitEntry {
  failures: number;
  windowStartedAt: number;
  blockedUntil: number;
  lastSeenAt: number;
}

export interface OwnerLoginRateLimitStatus {
  allowed: boolean;
  remainingAttempts: number;
  retryAfterSeconds: number;
}

type OwnerAuthGlobals = typeof globalThis & {
  __salonSaraOwnerSessionSecret?: Buffer;
  __salonSaraOwnerLoginAttempts?: Map<string, LoginRateLimitEntry>;
};

const ownerAuthGlobals = globalThis as OwnerAuthGlobals;

function derivePasswordKey(password: string): Promise<Buffer> {
  return new Promise((resolve, reject) => {
    nodeScrypt(password, PASSWORD_SALT, PASSWORD_HASH.length, (error, key) => {
      if (error) {
        reject(error);
        return;
      }

      resolve(key);
    });
  });
}

function timingSafeStringEqual(left: string, right: string): boolean {
  const leftDigest = createHash("sha256").update(left, "utf8").digest();
  const rightDigest = createHash("sha256").update(right, "utf8").digest();

  return timingSafeEqual(leftDigest, rightDigest);
}

function getSessionSecret(): Buffer {
  const configuredSecret = process.env.OWNER_SESSION_SECRET;

  if (configuredSecret?.trim()) {
    if (Buffer.byteLength(configuredSecret, "utf8") < 32) {
      throw new Error(
        "OWNER_SESSION_SECRET must contain at least 32 bytes.",
      );
    }

    return Buffer.from(configuredSecret, "utf8");
  }

  if (process.env.NODE_ENV === "production") {
    throw new Error(
      "OWNER_SESSION_SECRET must be configured in the production environment.",
    );
  }

  ownerAuthGlobals.__salonSaraOwnerSessionSecret ??= randomBytes(64);
  return ownerAuthGlobals.__salonSaraOwnerSessionSecret;
}

function encodeSession(payload: OwnerSessionPayload): string {
  const encodedPayload = Buffer.from(JSON.stringify(payload), "utf8").toString(
    "base64url",
  );
  const signature = createHmac("sha256", getSessionSecret())
    .update(encodedPayload, "utf8")
    .digest("base64url");

  return `${encodedPayload}.${signature}`;
}

function decodeAndVerifySession(token: string): OwnerSessionPayload | null {
  if (token.length > 2_048) {
    return null;
  }

  const parts = token.split(".");
  if (
    parts.length !== 2 ||
    !parts[0] ||
    !parts[1] ||
    !/^[A-Za-z0-9_-]+$/.test(parts[0]) ||
    !/^[A-Za-z0-9_-]+$/.test(parts[1])
  ) {
    return null;
  }

  const [encodedPayload, encodedSignature] = parts;
  const expectedSignature = createHmac("sha256", getSessionSecret())
    .update(encodedPayload, "utf8")
    .digest();
  const suppliedSignature = Buffer.from(encodedSignature, "base64url");

  if (
    suppliedSignature.length !== expectedSignature.length ||
    !timingSafeEqual(suppliedSignature, expectedSignature)
  ) {
    return null;
  }

  try {
    const candidate = JSON.parse(
      Buffer.from(encodedPayload, "base64url").toString("utf8"),
    ) as Partial<OwnerSessionPayload>;
    const now = Math.floor(Date.now() / 1_000);

    if (
      candidate.version !== 1 ||
      candidate.subject !== "owner" ||
      !Number.isSafeInteger(candidate.issuedAt) ||
      !Number.isSafeInteger(candidate.expiresAt) ||
      typeof candidate.nonce !== "string" ||
      !/^[A-Za-z0-9_-]{16,64}$/.test(candidate.nonce) ||
      candidate.issuedAt! > now + 60 ||
      candidate.expiresAt! <= now ||
      candidate.expiresAt! <= candidate.issuedAt! ||
      candidate.expiresAt! - candidate.issuedAt! >
        SESSION_MAX_AGE_SECONDS + 60
    ) {
      return null;
    }

    return candidate as OwnerSessionPayload;
  } catch {
    return null;
  }
}

function sessionCookieOptions(maxAge: number) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict" as const,
    path: "/",
    maxAge,
  };
}

function rateLimitKey(caller: string): string {
  const normalizedCaller = caller.trim().slice(0, 512) || "unknown";
  return createHash("sha256").update(normalizedCaller, "utf8").digest("hex");
}

function getLoginAttempts(): Map<string, LoginRateLimitEntry> {
  ownerAuthGlobals.__salonSaraOwnerLoginAttempts ??= new Map();
  return ownerAuthGlobals.__salonSaraOwnerLoginAttempts;
}

function pruneLoginAttempts(now: number): void {
  const attempts = getLoginAttempts();

  for (const [key, entry] of attempts) {
    const windowExpired = now - entry.windowStartedAt >= LOGIN_WINDOW_MS;
    const blockExpired = entry.blockedUntil <= now;

    if (windowExpired && blockExpired) {
      attempts.delete(key);
    }
  }

  while (attempts.size >= MAX_RATE_LIMIT_ENTRIES) {
    let oldestKey: string | undefined;
    let oldestSeenAt = Number.POSITIVE_INFINITY;

    for (const [key, entry] of attempts) {
      if (entry.lastSeenAt < oldestSeenAt) {
        oldestKey = key;
        oldestSeenAt = entry.lastSeenAt;
      }
    }

    if (!oldestKey) {
      break;
    }

    attempts.delete(oldestKey);
  }
}

export async function verifyOwnerCredentials(
  username: unknown,
  password: unknown,
): Promise<boolean> {
  const usernameIsValidInput =
    typeof username === "string" && Buffer.byteLength(username, "utf8") <= 128;
  const passwordIsValidInput =
    typeof password === "string" && Buffer.byteLength(password, "utf8") <= 1_024;
  const suppliedUsername = usernameIsValidInput ? username : "";
  const suppliedPassword = passwordIsValidInput ? password : "";

  const usernameMatches = timingSafeStringEqual(
    suppliedUsername,
    OWNER_USERNAME,
  );

  try {
    // Run scrypt even when the username is wrong to avoid a useful timing oracle.
    const suppliedHash = await derivePasswordKey(suppliedPassword);
    const passwordMatches =
      suppliedHash.length === PASSWORD_HASH.length &&
      timingSafeEqual(suppliedHash, PASSWORD_HASH);

    suppliedHash.fill(0);

    return (
      usernameIsValidInput &&
      passwordIsValidInput &&
      usernameMatches &&
      passwordMatches
    );
  } catch {
    return false;
  }
}

export async function createOwnerSession(): Promise<void> {
  const issuedAt = Math.floor(Date.now() / 1_000);
  const expiresAt = issuedAt + SESSION_MAX_AGE_SECONDS;
  const token = encodeSession({
    version: 1,
    subject: "owner",
    issuedAt,
    expiresAt,
    nonce: randomBytes(18).toString("base64url"),
  });
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, token, {
    ...sessionCookieOptions(SESSION_MAX_AGE_SECONDS),
    expires: new Date(expiresAt * 1_000),
  });
}

export async function clearOwnerSession(): Promise<void> {
  const cookieStore = await cookies();

  cookieStore.set(SESSION_COOKIE_NAME, "", {
    ...sessionCookieOptions(0),
    expires: new Date(0),
  });
}

export async function isOwnerAuthenticated(): Promise<boolean> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value;

  if (!token) {
    return false;
  }

  return decodeAndVerifySession(token) !== null;
}

export async function requireOwner(): Promise<void> {
  if (!(await isOwnerAuthenticated())) {
    throw new Error("Owner authentication required.");
  }
}

/**
 * Best-effort protection for a single process. Serverless instances do not share
 * this state, so production deployments should eventually use a shared limiter.
 */
export function checkOwnerLoginRateLimit(
  caller: string,
): OwnerLoginRateLimitStatus {
  const now = Date.now();
  const attempts = getLoginAttempts();
  const key = rateLimitKey(caller);
  const entry = attempts.get(key);

  if (!entry) {
    pruneLoginAttempts(now);
    return {
      allowed: true,
      remainingAttempts: MAX_LOGIN_FAILURES,
      retryAfterSeconds: 0,
    };
  }

  entry.lastSeenAt = now;

  if (entry.blockedUntil > now) {
    return {
      allowed: false,
      remainingAttempts: 0,
      retryAfterSeconds: Math.ceil((entry.blockedUntil - now) / 1_000),
    };
  }

  if (now - entry.windowStartedAt >= LOGIN_WINDOW_MS) {
    attempts.delete(key);
    return {
      allowed: true,
      remainingAttempts: MAX_LOGIN_FAILURES,
      retryAfterSeconds: 0,
    };
  }

  return {
    allowed: entry.failures < MAX_LOGIN_FAILURES,
    remainingAttempts: Math.max(0, MAX_LOGIN_FAILURES - entry.failures),
    retryAfterSeconds: 0,
  };
}

export function recordOwnerLoginFailure(caller: string): void {
  const now = Date.now();
  const attempts = getLoginAttempts();
  const key = rateLimitKey(caller);
  const current = attempts.get(key);
  const entry =
    current && now - current.windowStartedAt < LOGIN_WINDOW_MS
      ? current
      : {
          failures: 0,
          windowStartedAt: now,
          blockedUntil: 0,
          lastSeenAt: now,
        };

  entry.failures += 1;
  entry.lastSeenAt = now;

  if (entry.failures >= MAX_LOGIN_FAILURES) {
    entry.blockedUntil = now + LOGIN_BLOCK_MS;
  }

  attempts.set(key, entry);
  pruneLoginAttempts(now);
}

export function resetOwnerLoginRateLimit(caller: string): void {
  getLoginAttempts().delete(rateLimitKey(caller));
}
