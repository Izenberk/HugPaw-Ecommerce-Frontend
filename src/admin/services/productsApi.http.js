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
    try { const j = await res.json(); if (j?.message) msg = j.message; } catch {/**/}
    throw new Error(msg);
  }
  return res.status === 204 ? null : res.json();
}

const qs = (obj={}) => {
  const p = new URLSearchParams();
  for (const [k,v] of Object.entries(obj)) if (v !== "" && v != null) p.set(k, v);
  return p.toString();
};

export const listProducts  = ({ q="", sort="-updatedAt", filters={} }={}) =>
  http("GET", `/products?${qs({ q, sort, ...filters })}`);

export const getProduct    = (id)     => http("GET", `/products/${id}`);
export const createProduct = (doc)    => http("POST", `/products`, doc);
export const updateProduct = (id,doc) => http("PUT", `/products/${id}`, doc);
export const deleteProduct = (id)     => http("DELETE", `/products/${id}`);
