// Shared typed API client
export async function fetchJson<T>(url: string): Promise<T> {
  const res = await fetch(url);
  if (!res.ok) throw new Error('NetworkError');
  return (await res.json()) as T;
}

// <hex-web-client-exports>

