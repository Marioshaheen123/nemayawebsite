/**
 * Fetch wrapper that adds CSRF header for admin API mutations.
 * Use this in admin components for all API calls.
 */
export function adminFetch(
  url: string,
  options: RequestInit = {}
): Promise<Response> {
  const headers = new Headers(options.headers);
  headers.set("X-Requested-With", "XMLHttpRequest");
  if (
    !headers.has("Content-Type") &&
    options.body &&
    typeof options.body === "string"
  ) {
    headers.set("Content-Type", "application/json");
  }
  return fetch(url, { ...options, headers, credentials: "same-origin" });
}
