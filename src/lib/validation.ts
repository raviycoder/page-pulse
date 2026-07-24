export type ValidationResult =
  | { valid: true; url: string }
  | { valid: false; error: string };

const BLOCKED_HOSTS = ["localhost", "127.0.0.1", "0.0.0.0"];

export function validateUrl(value: unknown): ValidationResult {
  if (typeof value !== "string" || !value.trim()) {
    return { valid: false, error: "URL is required." };
  }

  let parsed: URL;

  try {
    const normalizedValue = value.trim();
    const urlValue = normalizedValue.includes("://")
      ? normalizedValue
      : `https://${normalizedValue}`;
    parsed = new URL(urlValue);
  } catch {
    return {
      valid: false,
      error: "Please provide a valid URL, e.g. https://example.com.",
    };
  }

  if (!["http:", "https:"].includes(parsed.protocol)) {
    return { valid: false, error: "Only HTTP and HTTPS URLs are allowed." };
  }

  if (BLOCKED_HOSTS.includes(parsed.hostname)) {
    return { valid: false, error: "Local or internal addresses are not allowed." };
  }

  return { valid: true, url: parsed.toString() };
}