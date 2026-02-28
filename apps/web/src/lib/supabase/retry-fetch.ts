/* ========================================
   RETRY FETCH WRAPPER
   Custom fetch with exponential backoff
   to handle Cloudflare 5xx / SSL errors
   that intermittently occur on Supabase
======================================== */

const MAX_RETRIES = 3;
const BASE_DELAY_MS = 500; // 500ms, 1s, 2s

function isCloudflareError(text: string): boolean {
  return (
    text.includes("cloudflare") ||
    text.includes("SSL handshake failed") ||
    text.includes("cf-error-details") ||
    text.includes("525:")
  );
}

/**
 * A fetch wrapper that retries on transient Cloudflare / network errors.
 * Drop-in replacement for global fetch — same signature.
 */
export async function retryFetch(
  input: RequestInfo | URL,
  init?: RequestInit
): Promise<Response> {
  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const response = await fetch(input, init);

      // Cloudflare 5xx errors (520-530) return HTML instead of JSON.
      // We detect them and retry instead of returning garbage to the caller.
      if (response.status >= 520 && response.status <= 530) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt);
        console.warn(
          `[retryFetch] Cloudflare ${response.status} on attempt ${attempt + 1}/${MAX_RETRIES + 1}, retrying in ${delay}ms…`
        );
        await sleep(delay);
        continue;
      }

      // Some Cloudflare errors return 200 with HTML body (edge case).
      // Peek at content-type — Supabase always returns application/json.
      const contentType = response.headers.get("content-type") || "";
      if (
        !contentType.includes("application/json") &&
        contentType.includes("text/html")
      ) {
        // Clone so we can read the body without consuming the original
        const clone = response.clone();
        const text = await clone.text();
        if (isCloudflareError(text)) {
          const delay = BASE_DELAY_MS * Math.pow(2, attempt);
          console.warn(
            `[retryFetch] Cloudflare HTML error page on attempt ${attempt + 1}/${MAX_RETRIES + 1}, retrying in ${delay}ms…`
          );
          await sleep(delay);
          continue;
        }
      }

      // Successful or non-Cloudflare response — return as-is
      return response;
    } catch (err) {
      // Network-level failures (DNS, TLS, connection reset, etc.)
      lastError = err instanceof Error ? err : new Error(String(err));

      if (attempt < MAX_RETRIES) {
        const delay = BASE_DELAY_MS * Math.pow(2, attempt);
        console.warn(
          `[retryFetch] Network error on attempt ${attempt + 1}/${MAX_RETRIES + 1}: ${lastError.message}, retrying in ${delay}ms…`
        );
        await sleep(delay);
      }
    }
  }

  // All retries exhausted
  throw lastError ?? new Error("retryFetch: all retries exhausted");
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
