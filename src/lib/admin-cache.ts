import { unstable_cache } from "next/cache";

/**
 * Wraps an async data-fetching function with Next.js Data Cache.
 * Results are cached on the server and invalidated via revalidateTag().
 */
export function cached<T>(
  fn: () => Promise<T>,
  key: string,
  tags: string[],
  revalidate = 120
): Promise<T> {
  return unstable_cache(fn, [key], { tags, revalidate })();
}
