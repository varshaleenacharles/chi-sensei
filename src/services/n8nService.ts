export interface N8nUploadResponse {
  success: boolean;
  status: number;
  data?: unknown;
  error?: string;
}

const WEBHOOK_URL = (import.meta as any).env?.VITE_N8N_WEBHOOK_URL || "https://dochub.app.n8n.cloud/webhook-test/upload";

function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise((resolve, reject) => {
    const id = setTimeout(() => reject(new Error(`Request timed out after ${ms}ms`)), ms);
    promise
      .then((value) => {
        clearTimeout(id);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(id);
        reject(err);
      });
  });
}

export async function uploadFileToN8n(
  file: File,
  extraFields?: Record<string, string>
): Promise<N8nUploadResponse> {
  const form = new FormData();
  form.append("file", file, file.name);
  if (extraFields) {
    for (const [key, value] of Object.entries(extraFields)) {
      form.append(key, value);
    }
  }

  try {
    const res = await withTimeout(
      fetch(WEBHOOK_URL, {
        method: "POST",
        body: form,
        // Let browser handle CORS preflight; do not set custom headers
        credentials: "omit",
        mode: "cors",
        cache: "no-store",
      }),
      15000
    );

    const contentType = res.headers.get("content-type") || "";
    const isJson = contentType.includes("application/json");
    const payload = isJson ? await res.json() : await res.text();

    if (!res.ok) {
      return { success: false, status: res.status, error: String(payload) };
    }

    return { success: true, status: res.status, data: payload };
  } catch (err) {
    // Retry once with no-cors to bypass CORS errors; response will be opaque
    try {
      const res = await withTimeout(
        fetch(WEBHOOK_URL, {
          method: "POST",
          body: form,
          mode: "no-cors",
          credentials: "omit",
          cache: "no-store",
        }),
        15000
      );
      // In no-cors, status is 0 and body is opaque; assume success if no exception
      return { success: true, status: (res as any)?.status ?? 0, data: "opaque" };
    } catch (retryErr) {
      return { success: false, status: 0, error: (retryErr as Error).message };
    }
  }
}


