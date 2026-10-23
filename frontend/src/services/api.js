const API_BASE_URL = (
  import.meta.env.VITE_API_BASE_URL || "http://localhost:8000"
).replace(/\/+$/, "");

let csrfToken = null;
let csrfRequest = null;

export function setCsrfToken(token) {
  csrfToken = token;
}

async function getCsrfToken() {
  if (csrfToken) {
    return csrfToken;
  }

  if (!csrfRequest) {
    csrfRequest = fetch(`${API_BASE_URL}/api/auth/csrf`, {
      method: "GET",
      credentials: "include",
      headers: {
        Accept: "application/json",
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error("Unable to initialize secure requests.");
        }

        const data = await response.json();

        if (!data.csrf_token) {
          throw new Error("The server did not provide a CSRF token.");
        }

        csrfToken = data.csrf_token;
        return csrfToken;
      })
      .finally(() => {
        csrfRequest = null;
      });
  }

  return csrfRequest;
}

export async function apiRequest(path, options = {}) {
  const method = (options.method || "GET").toUpperCase();
  const headers = new Headers(options.headers || {});

  headers.set("Accept", "application/json");

  const isSafeMethod = ["GET", "HEAD", "OPTIONS"].includes(method);

  if (!isSafeMethod) {
    headers.set("X-CSRF-Token", await getCsrfToken());
  }

  return fetch(`${API_BASE_URL}${path}`, {
    ...options,
    method,
    headers,
    credentials: "include",
  });
}