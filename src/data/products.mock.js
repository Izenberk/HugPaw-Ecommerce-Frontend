import collar from "@assets/images/products/collar.jpg"
import dispenser from "@assets/images/products/water-dispenser.jpg"
import feeder from "@assets/images/products/feeder.jpg"

export const CATEGORIES = ["Accessories", "Hydration", "Feeding"]

export const PRODUCTS_MOCK = [
    {
        id: "p1",
        name: "Collar",
        price: 400,
        imageUrl: collar,
        category: "Accessories",
        description: "More than just a collar It's their identity… Give your pet a collar that reflects who they are. Customize the color, size, and even engrave their name. Want extra peace of mind? Add GPS tracking and app connectivity to keep them safe, wherever they roam."
    },
    {
        id: "p2",
        name: "Water Dispenser",
        price: 700,
        imageUrl: dispenser,
        category: "Hydration",
        description: "Their wellness starts with water… Designed to keep water clean, fresh, and flowing just the way they like it. Customize the look to match your home, and add smart features like automatic refill alerts and filter tracking."
    },
    {
        id: "p3",
        name: "Feeder",
        price: 750,
        imageUrl: feeder,
        category: "Feeding",
        description: "Mealtime made personal… Whether you're home or away, make sure your pet’s meals are always right in portion, timing, and style. Choose colors and finishes that suit your space, and add features like schedule control, app integration, and voice playback."
    },
]