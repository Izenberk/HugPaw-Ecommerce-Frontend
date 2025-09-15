const BASE = import.meta.env.VITE_API_BASE || "http://localhost:3030/api";

async function http(method, path, body) {
  const res = await fetch(`${BASE}${path}`, {
    method,
    headers: { "Content-Type": "application/json" },
    body: body ? JSON.stringify(body) : undefined,
    credentials: "include",
  });
  if (!res.ok) {
    let msg = `HTTP ${res.status}`;
    try { const j = await res.json(); if (j?.message) msg = j.message; } catch {}
    throw new Error(msg);
  }
  return res.status === 204 ? null : res.json();
}

export async function listItems({ q = "", status = "active", filters = {}, sort = "-updatedAt" } = {}) {
  const params = new URLSearchParams();
  if (q) params.set("q", q);
  if (status) params.set("status", status);
  if (sort) params.set("sort", sort);
  for (const [k, v] of Object.entries(filters)) {
    if (v == null || v === "") continue;
    // support attr[...] and simple keys
    if (k.includes("[")) params.set(k, v);
    else params.set(k, v);
  }
  return http("GET", `/items?${params.toString()}`);
}

export async function getItem(id) {
  return http("GET", `/items/${id}`);
}

export async function createItem(payload) {
  return http("POST", `/items`, payload);
}

export async function updateItem(id, payload) {
  return http("PUT", `/items/${id}`, payload);
}

export async function archiveItem(id) {
  return http("DELETE", `/items/${id}`);
}
