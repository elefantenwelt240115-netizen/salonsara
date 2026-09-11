import "server-only";

import { randomUUID } from "node:crypto";
import { mkdir, readFile, rename, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import { Redis } from "@upstash/redis";

import {
  ANNOUNCEMENT_KINDS,
  DEFAULT_SITE_CONTENT,
  OPENING_HOURS_DAYS,
  type Announcement,
  type AnnouncementKind,
  type OpeningHoursDay,
  type OpeningHoursEntry,
  type ServiceCategory,
  type ServiceGroup,
  type ServiceItem,
  type SiteContent,
} from "./site-content.types";

export * from "./site-content.types";

const REDIS_KEY = process.env.SITE_CONTENT_REDIS_KEY?.trim() || "salon-sara:site-content:v1";
const MAX_SERIALIZED_BYTES = 256 * 1024;
const ID_PATTERN = /^[a-z0-9][a-z0-9_-]{1,79}$/;
const TIME_PATTERN = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
const CONTROL_CHARACTERS = /[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g;
const DIRECTIONAL_CONTROLS = /[\u061C\u200B-\u200F\u202A-\u202E\u2066-\u2069\uFEFF]/g;

type PlainObject = Record<string, unknown>;

interface RedisConfiguration {
  url: string;
  token: string;
}

export interface SaveSiteContentOptions {
  /** Reject the save if another request has already written a newer revision. */
  expectedRevision?: number;
}

export class SiteContentValidationError extends Error {
  readonly issues: readonly string[];

  constructor(issues: string | readonly string[]) {
    const normalizedIssues = typeof issues === "string" ? [issues] : [...issues];
    super(`Ungültige Website-Inhalte: ${normalizedIssues.join("; ")}`);
    this.name = "SiteContentValidationError";
    this.issues = normalizedIssues;
  }
}

export class SiteContentConflictError extends Error {
  readonly expectedRevision: number;
  readonly actualRevision: number;

  constructor(expectedRevision: number, actualRevision: number) {
    super(
      `Die Inhalte wurden zwischenzeitlich geändert (erwartete Revision ${expectedRevision}, aktuelle Revision ${actualRevision}). Bitte neu laden.`,
    );
    this.name = "SiteContentConflictError";
    this.expectedRevision = expectedRevision;
    this.actualRevision = actualRevision;
  }
}

export class SiteContentConfigurationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "SiteContentConfigurationError";
  }
}

export class SiteContentStorageError extends Error {
  readonly cause?: unknown;

  constructor(message: string, cause?: unknown) {
    super(message);
    this.name = "SiteContentStorageError";
    this.cause = cause;
  }
}

function validationError(pathName: string, message: string): never {
  throw new SiteContentValidationError(`${pathName}: ${message}`);
}

function isPlainObject(value: unknown): value is PlainObject {
  if (typeof value !== "object" || value === null || Array.isArray(value)) return false;

  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}

function readObject(value: unknown, pathName: string, allowedKeys: readonly string[]): PlainObject {
  if (!isPlainObject(value)) validationError(pathName, "muss ein Objekt sein");

  const unknownKeys = Object.keys(value).filter((key) => !allowedKeys.includes(key));
  if (unknownKeys.length > 0) {
    validationError(pathName, `enthält unbekannte Felder: ${unknownKeys.join(", ")}`);
  }

  return value;
}

function readArray(
  value: unknown,
  pathName: string,
  minimum: number,
  maximum: number,
): unknown[] {
  if (!Array.isArray(value)) validationError(pathName, "muss eine Liste sein");
  if (value.length < minimum || value.length > maximum) {
    validationError(pathName, `muss zwischen ${minimum} und ${maximum} Einträge enthalten`);
  }
  return value;
}

function readBoolean(value: unknown, pathName: string): boolean {
  if (typeof value !== "boolean") validationError(pathName, "muss true oder false sein");
  return value;
}

function sanitizePlainText(
  value: unknown,
  pathName: string,
  maximumLength: number,
  options: { allowEmpty?: boolean; multiline?: boolean } = {},
): string {
  if (typeof value !== "string") validationError(pathName, "muss Text sein");

  let sanitized = value
    .normalize("NFKC")
    .replace(/\r\n?/g, "\n")
    .replace(CONTROL_CHARACTERS, "")
    .replace(DIRECTIONAL_CONTROLS, "")
    .replace(/<[^>]*>/g, "")
    .replace(/[<>]/g, "");

  if (options.multiline) {
    sanitized = sanitized
      .split("\n")
      .map((line) => line.replace(/[\t ]+/g, " ").trim())
      .join("\n")
      .replace(/\n{3,}/g, "\n\n")
      .trim();
  } else {
    sanitized = sanitized.replace(/\s+/g, " ").trim();
  }

  if (!options.allowEmpty && sanitized.length === 0) {
    validationError(pathName, "darf nicht leer sein");
  }
  if (sanitized.length > maximumLength) {
    validationError(pathName, `darf höchstens ${maximumLength} Zeichen lang sein`);
  }

  return sanitized;
}

function readOptionalText(
  object: PlainObject,
  key: string,
  pathName: string,
  maximumLength: number,
  multiline = false,
): string | undefined {
  if (object[key] === undefined || object[key] === null || object[key] === "") return undefined;
  return sanitizePlainText(object[key], `${pathName}.${key}`, maximumLength, { multiline });
}

function readId(value: unknown, pathName: string, seenIds: Set<string>): string {
  if (typeof value !== "string") validationError(pathName, "muss Text sein");
  const id = value.trim();

  if (!ID_PATTERN.test(id)) {
    validationError(
      pathName,
      "muss 2–80 Zeichen lang sein und darf nur Kleinbuchstaben, Zahlen, _ und - enthalten",
    );
  }
  if (seenIds.has(id)) validationError(pathName, `ID „${id}“ wird mehrfach verwendet`);

  seenIds.add(id);
  return id;
}

function readPositiveInteger(value: unknown, pathName: string): number {
  if (!Number.isSafeInteger(value) || (value as number) < 1) {
    validationError(pathName, "muss eine positive ganze Zahl sein");
  }
  return value as number;
}

function readUpdatedAt(value: unknown, pathName: string): string {
  if (typeof value !== "string" || value.trim().length === 0) {
    validationError(pathName, "muss ein ISO-Zeitstempel sein");
  }

  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) validationError(pathName, "muss ein gültiger ISO-Zeitstempel sein");

  return new Date(timestamp).toISOString();
}

function sanitizeCtaUrl(value: unknown, pathName: string): string {
  if (typeof value !== "string") validationError(pathName, "muss eine URL sein");

  const url = value
    .normalize("NFKC")
    .replace(CONTROL_CHARACTERS, "")
    .replace(DIRECTIONAL_CONTROLS, "")
    .trim();

  if (url.length === 0 || url.length > 500 || /[\s\\<>]/.test(url)) {
    validationError(pathName, "enthält keine sichere URL");
  }

  if (/^#[A-Za-z][A-Za-z0-9_.:-]*$/.test(url)) return url;

  if (url.startsWith("/") && !url.startsWith("//")) {
    try {
      new URL(url, "https://salonsara.invalid");
      return url;
    } catch {
      validationError(pathName, "enthält keinen gültigen internen Pfad");
    }
  }

  if (/^tel:\+?[0-9().-]{3,30}$/i.test(url)) return url;
  if (/^mailto:[^@\s/?#]+@[^@\s/?#]+\.[^@\s/?#]+$/i.test(url)) return url;

  try {
    const parsed = new URL(url);
    if (parsed.protocol !== "https:") {
      validationError(pathName, "erlaubt sind nur interne Links, https, tel, mailto oder #Anker");
    }
    if (!parsed.hostname || parsed.username || parsed.password) {
      validationError(pathName, "enthält keine sichere Web-Adresse");
    }
    return parsed.toString();
  } catch (error) {
    if (error instanceof SiteContentValidationError) throw error;
    validationError(pathName, "enthält keine gültige URL");
  }
}

function parseServiceItem(
  value: unknown,
  pathName: string,
  seenIds: Set<string>,
  expectedPriceCount?: number,
): ServiceItem {
  const object = readObject(value, pathName, ["id", "name", "price", "prices", "note"]);
  const hasSinglePrice = object.price !== undefined && object.price !== null && object.price !== "";
  const hasMultiplePrices = object.prices !== undefined && object.prices !== null;

  if (hasSinglePrice === hasMultiplePrices) {
    validationError(pathName, "muss genau eines der Felder price oder prices enthalten");
  }

  const item: ServiceItem = {
    id: readId(object.id, `${pathName}.id`, seenIds),
    name: sanitizePlainText(object.name, `${pathName}.name`, 120),
  };

  if (hasSinglePrice) {
    item.price = sanitizePlainText(object.price, `${pathName}.price`, 80);
  } else {
    const prices = readArray(object.prices, `${pathName}.prices`, 1, 10).map((price, index) =>
      sanitizePlainText(price, `${pathName}.prices[${index}]`, 80),
    );
    if (expectedPriceCount === undefined) {
      validationError(pathName, "benötigt lengthLabels in der zugehörigen Kategorie");
    }
    if (prices.length !== expectedPriceCount) {
      validationError(
        `${pathName}.prices`,
        `muss genau ${expectedPriceCount} Preise passend zu lengthLabels enthalten`,
      );
    }
    item.prices = prices;
  }

  const note = readOptionalText(object, "note", pathName, 240, true);
  if (note !== undefined) item.note = note;

  return item;
}

function parseServiceGroup(
  value: unknown,
  pathName: string,
  seenIds: Set<string>,
  expectedPriceCount?: number,
): ServiceGroup {
  const object = readObject(value, pathName, ["id", "title", "items"]);

  return {
    id: readId(object.id, `${pathName}.id`, seenIds),
    title: sanitizePlainText(object.title, `${pathName}.title`, 100),
    items: readArray(object.items, `${pathName}.items`, 0, 100).map((item, index) =>
      parseServiceItem(item, `${pathName}.items[${index}]`, seenIds, expectedPriceCount),
    ),
  };
}

function parseServiceCategory(
  value: unknown,
  pathName: string,
  seenIds: Set<string>,
): ServiceCategory {
  const object = readObject(value, pathName, ["id", "label", "lengthLabels", "groups"]);
  let lengthLabels: string[] | undefined;

  if (object.lengthLabels !== undefined && object.lengthLabels !== null) {
    lengthLabels = readArray(object.lengthLabels, `${pathName}.lengthLabels`, 1, 10).map(
      (label, index) =>
        sanitizePlainText(label, `${pathName}.lengthLabels[${index}]`, 40),
    );

    if (new Set(lengthLabels).size !== lengthLabels.length) {
      validationError(`${pathName}.lengthLabels`, "darf keine doppelten Bezeichnungen enthalten");
    }
  }

  const category: ServiceCategory = {
    id: readId(object.id, `${pathName}.id`, seenIds),
    label: sanitizePlainText(object.label, `${pathName}.label`, 80),
    groups: readArray(object.groups, `${pathName}.groups`, 0, 30).map((group, index) =>
      parseServiceGroup(
        group,
        `${pathName}.groups[${index}]`,
        seenIds,
        lengthLabels?.length,
      ),
    ),
  };

  if (lengthLabels !== undefined) category.lengthLabels = lengthLabels;
  return category;
}

function parseOpeningHoursEntry(
  value: unknown,
  pathName: string,
  seenIds: Set<string>,
): OpeningHoursEntry {
  const object = readObject(value, pathName, [
    "id",
    "label",
    "value",
    "days",
    "opens",
    "closes",
    "closed",
  ]);
  const entry: OpeningHoursEntry = {
    id: readId(object.id, `${pathName}.id`, seenIds),
    label: sanitizePlainText(object.label, `${pathName}.label`, 100),
    value: sanitizePlainText(object.value, `${pathName}.value`, 120),
  };

  let days: OpeningHoursDay[] | undefined;
  if (object.days !== undefined && object.days !== null) {
    days = readArray(object.days, `${pathName}.days`, 1, 7).map((day, index) => {
      if (typeof day !== "string" || !(OPENING_HOURS_DAYS as readonly string[]).includes(day)) {
        validationError(`${pathName}.days[${index}]`, "enthält keinen gültigen Wochentag");
      }
      return day as OpeningHoursDay;
    });
    if (new Set(days).size !== days.length) {
      validationError(`${pathName}.days`, "darf keinen Wochentag mehrfach enthalten");
    }
    entry.days = days;
  }

  const closed = object.closed === undefined ? false : readBoolean(object.closed, `${pathName}.closed`);
  const opens = readOptionalText(object, "opens", pathName, 5);
  const closes = readOptionalText(object, "closes", pathName, 5);

  if ((opens === undefined) !== (closes === undefined)) {
    validationError(pathName, "opens und closes müssen gemeinsam angegeben werden");
  }
  if (opens !== undefined && (!TIME_PATTERN.test(opens) || !TIME_PATTERN.test(closes as string))) {
    validationError(pathName, "opens und closes müssen Uhrzeiten im Format HH:MM sein");
  }
  if (closed && opens !== undefined) {
    validationError(pathName, "ein geschlossener Eintrag darf keine Öffnungszeit enthalten");
  }
  if (days !== undefined && !closed && opens === undefined) {
    validationError(pathName, "Einträge mit Wochentagen benötigen Öffnungszeiten oder closed: true");
  }
  if (days === undefined && (closed || opens !== undefined)) {
    validationError(pathName, "strukturierte Öffnungszeiten benötigen mindestens einen Wochentag");
  }

  if (closed) entry.closed = true;
  if (opens !== undefined) {
    entry.opens = opens;
    entry.closes = closes;
  }

  return entry;
}

function parseAnnouncement(value: unknown, pathName: string): Announcement {
  const object = readObject(value, pathName, [
    "enabled",
    "kind",
    "title",
    "message",
    "ctaLabel",
    "ctaUrl",
  ]);
  const enabled = readBoolean(object.enabled, `${pathName}.enabled`);

  if (typeof object.kind !== "string" || !(ANNOUNCEMENT_KINDS as readonly string[]).includes(object.kind)) {
    validationError(`${pathName}.kind`, "muss promotion, info oder closure sein");
  }

  const title = sanitizePlainText(object.title, `${pathName}.title`, 120, {
    allowEmpty: !enabled,
  });
  const message = sanitizePlainText(object.message, `${pathName}.message`, 1_200, {
    allowEmpty: !enabled,
    multiline: true,
  });
  const ctaLabel = readOptionalText(object, "ctaLabel", pathName, 60);
  const ctaUrl =
    object.ctaUrl === undefined || object.ctaUrl === null || object.ctaUrl === ""
      ? undefined
      : sanitizeCtaUrl(object.ctaUrl, `${pathName}.ctaUrl`);

  if ((ctaLabel === undefined) !== (ctaUrl === undefined)) {
    validationError(pathName, "ctaLabel und ctaUrl müssen gemeinsam angegeben werden");
  }

  const announcement: Announcement = {
    enabled,
    kind: object.kind as AnnouncementKind,
    title,
    message,
  };
  if (ctaLabel !== undefined && ctaUrl !== undefined) {
    announcement.ctaLabel = ctaLabel;
    announcement.ctaUrl = ctaUrl;
  }

  return announcement;
}

/** Validate untrusted input and return a normalized, plain-text-only content object. */
export function validateSiteContent(value: unknown): SiteContent {
  const object = readObject(value, "content", [
    "revision",
    "updatedAt",
    "services",
    "openingHours",
    "announcement",
  ]);
  const seenIds = new Set<string>();

  const content: SiteContent = {
    revision: readPositiveInteger(object.revision, "content.revision"),
    updatedAt: readUpdatedAt(object.updatedAt, "content.updatedAt"),
    services: readArray(object.services, "content.services", 1, 20).map((category, index) =>
      parseServiceCategory(category, `content.services[${index}]`, seenIds),
    ),
    openingHours: readArray(object.openingHours, "content.openingHours", 0, 30).map(
      (entry, index) =>
        parseOpeningHoursEntry(entry, `content.openingHours[${index}]`, seenIds),
    ),
    announcement: parseAnnouncement(object.announcement, "content.announcement"),
  };

  if (Buffer.byteLength(JSON.stringify(content), "utf8") > MAX_SERIALIZED_BYTES) {
    validationError("content", `darf höchstens ${MAX_SERIALIZED_BYTES} Bytes groß sein`);
  }

  return content;
}

function cloneDefaultContent(): SiteContent {
  return JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT)) as SiteContent;
}

function redisConfiguration(): RedisConfiguration | null {
  const upstashUrl = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const upstashToken = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (upstashUrl && upstashToken) return { url: upstashUrl, token: upstashToken };

  const kvUrl = process.env.KV_REST_API_URL?.trim();
  const kvToken = process.env.KV_REST_API_TOKEN?.trim();
  if (kvUrl && kvToken) return { url: kvUrl, token: kvToken };

  // Vercel Marketplace prefixes Upstash's existing KV variable names when a
  // custom resource prefix is selected during project connection.
  const marketplaceUrl =
    process.env.UPSTASH_REDIS_REST_KV_REST_API_URL?.trim();
  const marketplaceToken =
    process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN?.trim();
  if (marketplaceUrl && marketplaceToken) {
    return { url: marketplaceUrl, token: marketplaceToken };
  }

  return null;
}

let cachedRedis: { signature: string; client: Redis } | null = null;

function redisClient(): Redis | null {
  const configuration = redisConfiguration();
  if (!configuration) return null;

  const signature = `${configuration.url}\u0000${configuration.token}`;
  if (cachedRedis?.signature !== signature) {
    cachedRedis = {
      signature,
      client: new Redis(configuration),
    };
  }

  return cachedRedis.client;
}

function isVercelRuntime(): boolean {
  const value = process.env.VERCEL?.toLowerCase();
  return value === "1" || value === "true";
}

function localContentPath(): string {
  const configuredPath = process.env.SITE_CONTENT_FILE?.trim();
  return configuredPath
    ? path.resolve(configuredPath)
    : path.join(process.cwd(), ".data", "site-content.json");
}

function parseStoredContent(value: unknown, source: string): SiteContent {
  try {
    const parsed = typeof value === "string" ? (JSON.parse(value) as unknown) : value;
    return validateSiteContent(parsed);
  } catch (error) {
    if (error instanceof SiteContentValidationError || error instanceof SyntaxError) {
      throw new SiteContentStorageError(`Gespeicherte Website-Inhalte in ${source} sind beschädigt.`, error);
    }
    throw error;
  }
}

async function readRedisContent(client: Redis): Promise<SiteContent | null> {
  const stored = await client.get<unknown>(REDIS_KEY);
  return stored === null ? null : parseStoredContent(stored, "Redis");
}

function isFileSystemError(error: unknown, code: string): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    (error as { code?: unknown }).code === code
  );
}

async function readLocalContent(): Promise<SiteContent | null> {
  const filePath = localContentPath();
  try {
    return parseStoredContent(await readFile(filePath, "utf8"), filePath);
  } catch (error) {
    if (isFileSystemError(error, "ENOENT")) return null;
    throw error;
  }
}

async function atomicWriteLocalContent(content: SiteContent): Promise<void> {
  const filePath = localContentPath();
  const directory = path.dirname(filePath);
  const temporaryPath = path.join(
    directory,
    `.${path.basename(filePath)}.${process.pid}.${randomUUID()}.tmp`,
  );

  await mkdir(directory, { recursive: true });
  try {
    await writeFile(temporaryPath, `${JSON.stringify(content, null, 2)}\n`, {
      encoding: "utf8",
      flag: "wx",
      mode: 0o600,
    });
    await rename(temporaryPath, filePath);
  } finally {
    await unlink(temporaryPath).catch((error: unknown) => {
      if (!isFileSystemError(error, "ENOENT")) throw error;
    });
  }
}

let localSaveQueue: Promise<void> = Promise.resolve();

function enqueueLocalSave<T>(operation: () => Promise<T>): Promise<T> {
  const result = localSaveQueue.then(operation, operation);
  localSaveQueue = result.then(
    () => undefined,
    () => undefined,
  );
  return result;
}

let warnedAboutMissingVercelStore = false;

function warnAboutReadFallback(message: string, error?: unknown): void {
  console.error(`[site-content] ${message}`, error ?? "");
}

/** Read validated content from Redis or the atomic local-development fallback. */
export async function getSiteContent(): Promise<SiteContent> {
  const redis = redisClient();
  if (redis) {
    try {
      return (await readRedisContent(redis)) ?? cloneDefaultContent();
    } catch (error) {
      warnAboutReadFallback("Redis konnte nicht gelesen werden; Standardinhalte werden verwendet.", error);
      return cloneDefaultContent();
    }
  }

  if (isVercelRuntime()) {
    if (!warnedAboutMissingVercelStore) {
      warnedAboutMissingVercelStore = true;
      warnAboutReadFallback(
        "Kein dauerhafter Redis-Speicher konfiguriert; Standardinhalte werden verwendet.",
      );
    }
    return cloneDefaultContent();
  }

  try {
    return (await readLocalContent()) ?? cloneDefaultContent();
  } catch (error) {
    warnAboutReadFallback("Die lokale Inhaltsdatei konnte nicht gelesen werden; Standardinhalte werden verwendet.", error);
    return cloneDefaultContent();
  }
}

const REDIS_COMPARE_AND_SET = `
local current = redis.call("GET", KEYS[1])
local expected = tonumber(ARGV[1])
local default_revision = tonumber(ARGV[3])

if current then
  local ok, decoded = pcall(cjson.decode, current)
  if not ok or not decoded["revision"] then
    return "INVALID"
  end
  local current_revision = tonumber(decoded["revision"])
  if current_revision ~= expected then
    return tostring(current_revision)
  end
elseif expected ~= default_revision then
  return "MISSING"
end

redis.call("SET", KEYS[1], ARGV[2])
return "OK"
`;

function assertExpectedRevision(value: unknown): number {
  if (!Number.isSafeInteger(value) || (value as number) < 1) {
    throw new SiteContentValidationError("expectedRevision muss eine positive ganze Zahl sein");
  }
  return value as number;
}

async function saveToRedis(
  client: Redis,
  candidate: SiteContent,
  expectedRevision: number,
): Promise<SiteContent> {
  const current = (await readRedisContent(client)) ?? cloneDefaultContent();
  if (current.revision !== expectedRevision) {
    throw new SiteContentConflictError(expectedRevision, current.revision);
  }

  const nextContent: SiteContent = {
    ...candidate,
    revision: current.revision + 1,
    updatedAt: new Date().toISOString(),
  };
  const result = String(
    await client.eval(REDIS_COMPARE_AND_SET, [REDIS_KEY], [
      String(expectedRevision),
      JSON.stringify(nextContent),
      String(DEFAULT_SITE_CONTENT.revision),
    ]),
  );

  if (result === "OK") return nextContent;
  if (result === "INVALID") {
    throw new SiteContentStorageError("Gespeicherte Website-Inhalte in Redis sind beschädigt.");
  }
  if (result === "MISSING") {
    throw new SiteContentConflictError(expectedRevision, DEFAULT_SITE_CONTENT.revision);
  }

  const actualRevision = Number(result);
  if (Number.isSafeInteger(actualRevision) && actualRevision > 0) {
    throw new SiteContentConflictError(expectedRevision, actualRevision);
  }
  throw new SiteContentStorageError("Redis hat beim Speichern eine unerwartete Antwort geliefert.");
}

async function saveToLocalFile(
  candidate: SiteContent,
  expectedRevision: number,
): Promise<SiteContent> {
  return enqueueLocalSave(async () => {
    const current = (await readLocalContent()) ?? cloneDefaultContent();
    if (current.revision !== expectedRevision) {
      throw new SiteContentConflictError(expectedRevision, current.revision);
    }

    const nextContent: SiteContent = {
      ...candidate,
      revision: current.revision + 1,
      updatedAt: new Date().toISOString(),
    };
    await atomicWriteLocalContent(nextContent);
    return nextContent;
  });
}

/**
 * Validate, sanitize and persist content. The incoming revision is used as an
 * optimistic concurrency guard unless expectedRevision is supplied explicitly.
 */
export async function saveSiteContent(
  value: unknown,
  options: SaveSiteContentOptions | number = {},
): Promise<SiteContent> {
  const candidate = validateSiteContent(value);
  const expectedRevision = assertExpectedRevision(
    (typeof options === "number" ? options : options.expectedRevision) ?? candidate.revision,
  );
  const redis = redisClient();

  if (redis) {
    try {
      return await saveToRedis(redis, candidate, expectedRevision);
    } catch (error) {
      if (
        error instanceof SiteContentConflictError ||
        error instanceof SiteContentValidationError ||
        error instanceof SiteContentStorageError
      ) {
        throw error;
      }
      throw new SiteContentStorageError("Website-Inhalte konnten nicht in Redis gespeichert werden.", error);
    }
  }

  if (isVercelRuntime()) {
    throw new SiteContentConfigurationError(
      "Website-Inhalte können auf Vercel nicht gespeichert werden, solange kein dauerhafter Speicher konfiguriert ist. Setze UPSTASH_REDIS_REST_URL und UPSTASH_REDIS_REST_TOKEN (alternativ KV_REST_API_URL und KV_REST_API_TOKEN).",
    );
  }

  try {
    return await saveToLocalFile(candidate, expectedRevision);
  } catch (error) {
    if (
      error instanceof SiteContentConflictError ||
      error instanceof SiteContentValidationError ||
      error instanceof SiteContentStorageError
    ) {
      throw error;
    }
    throw new SiteContentStorageError("Website-Inhalte konnten lokal nicht gespeichert werden.", error);
  }
}
