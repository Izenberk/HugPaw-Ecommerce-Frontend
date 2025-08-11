import axios from "axios";

export const api = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL || "/api", // VITE_API_BASE_URL config at .env.local
    timeout: 15000,
    withCredentials: false,
})

api.interceptors.response.use(
    (res) => res,
    (err) => {
        const msg =
        err?.response?.data?.message ||
        err?.message ||
        "Unexpected error"
        return Promise.reject({ ...err, message: msg })
    }
)

export async function getProducts({ signal, params } = {}) {
    const res = await api.get("/products", { signal, params })

    return res.data?.items ?? res.data
}