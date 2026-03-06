/**
 * Convert legacy JSON-array body format to HTML.
 * If already HTML (not a JSON array), returns as-is.
 */
export function bodyToHtml(body: string): string {
  if (!body || body === "[]") return "";
  try {
    const parsed = JSON.parse(body);
    if (Array.isArray(parsed)) {
      return parsed.map((p: string) => `<p>${p}</p>`).join("");
    }
    return body;
  } catch {
    // Not JSON — already HTML
    return body;
  }
}

/** Strip HTML tags for plain-text word counting */
export function htmlToPlainText(html: string): string {
  return html.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim();
}
