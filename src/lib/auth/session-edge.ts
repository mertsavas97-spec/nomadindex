const COOKIE_NAME = "ni_admin_session";
const SESSION_MAX_AGE_MS = 7 * 24 * 60 * 60 * 1000;

function getSessionSecret() {
  return (
    process.env.ADMIN_SESSION_SECRET ??
    process.env.ADMIN_PASSWORD ??
    "nomadindex-dev-session-secret"
  );
}

async function signPayload(payload: string): Promise<string> {
  const enc = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    enc.encode(getSessionSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", key, enc.encode(payload));
  return Buffer.from(signature).toString("hex");
}

function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i += 1) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}

export async function createSessionToken(): Promise<string> {
  const payload = JSON.stringify({
    exp: Date.now() + SESSION_MAX_AGE_MS,
    v: 1,
  });
  const signature = await signPayload(payload);
  return `${Buffer.from(payload).toString("base64url")}.${signature}`;
}

export async function verifySessionToken(token: string | undefined): Promise<boolean> {
  if (!token) return false;

  const [encodedPayload, signature] = token.split(".");
  if (!encodedPayload || !signature) return false;

  try {
    const payload = Buffer.from(encodedPayload, "base64url").toString("utf8");
    const expected = await signPayload(payload);
    if (!timingSafeEqualHex(signature, expected)) return false;

    const data = JSON.parse(payload) as { exp?: number };
    if (!data.exp || Date.now() > data.exp) return false;

    return true;
  } catch {
    return false;
  }
}

export { COOKIE_NAME, SESSION_MAX_AGE_MS };
