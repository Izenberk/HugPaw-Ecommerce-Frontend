const KEY = "orders";
const LAST_KEY = "lastOrderId";

export function appendOrder(order) {
    const arr = getOrders();
    arr.unshift(order);
    localStorage.setItem(KEY, JSON.stringify(arr));
    localStorage.setItem(LAST_KEY, order.id);
    return order.id;
}

export function getOrders() {
    try {
        return JSON.parse(localStorage.getItem(KEY) || "[]");
    } catch {
        return [];
    }
}

export function getOrderById(id) {
    return getOrders().find((o) => o.id === id) || null;
}

export function getLastOrderId() {
    return localStorage.getItem(LAST_KEY) || null;
}
