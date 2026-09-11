"use server";

import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  checkOwnerLoginRateLimit,
  clearOwnerSession,
  createOwnerSession,
  isOwnerAuthenticated,
  recordOwnerLoginFailure,
  resetOwnerLoginRateLimit,
  verifyOwnerCredentials,
} from "@/lib/owner-auth";
import {
  saveSiteContent,
  SiteContentConfigurationError,
  SiteContentConflictError,
  SiteContentStorageError,
  SiteContentValidationError,
} from "@/lib/site-content";

function redirectToLogin(status: string): never {
  redirect(`/hallo?status=${encodeURIComponent(status)}`);
}

async function getLoginFingerprint() {
  const requestHeaders = await headers();
  const forwardedFor = requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim();
  const realIp = requestHeaders.get("x-real-ip")?.trim();
  const userAgent = requestHeaders.get("user-agent")?.slice(0, 180) ?? "unknown";

  return `${forwardedFor || realIp || "unknown"}:${userAgent}`;
}

export async function loginAction(formData: FormData) {
  const username = formData.get("username");
  const password = formData.get("password");
  const fingerprint = await getLoginFingerprint();
  const rateLimit = checkOwnerLoginRateLimit(fingerprint);

  if (!rateLimit.allowed) {
    redirectToLogin("login-failed");
  }

  const credentialsAreValid = await verifyOwnerCredentials(username, password);

  if (!credentialsAreValid) {
    recordOwnerLoginFailure(fingerprint);
    redirectToLogin("login-failed");
  }

  resetOwnerLoginRateLimit(fingerprint);

  try {
    await createOwnerSession();
  } catch (error) {
    console.error("Owner session configuration failed", error);
    redirectToLogin("configuration");
  }

  redirect("/hallo");
}

export async function logoutAction() {
  await clearOwnerSession();
  redirect("/hallo");
}

export async function saveContentAction(formData: FormData) {
  if (!(await isOwnerAuthenticated())) {
    redirectToLogin("session-expired");
  }

  const payload = formData.get("content");

  if (typeof payload !== "string" || payload.length > 750_000) {
    redirectToLogin("invalid-content");
  }

  let parsedContent: unknown;

  try {
    parsedContent = JSON.parse(payload);
  } catch {
    redirectToLogin("invalid-content");
  }

  try {
    const expectedRevision =
      typeof parsedContent === "object" &&
      parsedContent !== null &&
      "revision" in parsedContent &&
      typeof parsedContent.revision === "number"
        ? parsedContent.revision
        : undefined;

    await saveSiteContent(parsedContent, expectedRevision);
  } catch (error) {
    if (error instanceof SiteContentConflictError) {
      redirectToLogin("conflict");
    }

    if (
      error instanceof SiteContentConfigurationError ||
      error instanceof SiteContentStorageError
    ) {
      console.error("Site content storage is not configured", error);
      redirectToLogin("storage");
    }

    if (!(error instanceof SiteContentValidationError)) {
      console.error("Unexpected site content save failure", error);
    }
    redirectToLogin("invalid-content");
  }

  revalidatePath("/");
  revalidatePath("/hallo");
  redirectToLogin("saved");
}
