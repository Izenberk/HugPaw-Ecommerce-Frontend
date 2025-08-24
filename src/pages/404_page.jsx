import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Home, ShoppingBag, ArrowLeft } from "lucide-react";

export default function NotFound() {
    const navigate = useNavigate();

    return (
        <main className="min-h-[80vh] grid place-items-center px-4 py-10">
            <section className="relative w-full max-w-5xl overflow-hidden rounded-2xl border bg-card text-card-foreground">
                {/* Content grid */}
                <div className="grid gap-8 p-6 md:grid-cols-2 md:p-10">
                    {/* Text */}
                    <div className="flex flex-col gap-4">
                        <p className="text-xs uppercase tracking-widest text-muted-foreground">Error</p>
                        <h1 className="text-3xl font-bold leading-tight md:text-4xl">
                        404 — Page not found
                        </h1>
                        <p className="text-muted-foreground">
                        The page scampered off. Let’s head back before the cat judges us harder. 🐾
                        </p>

                        <div className="mt-2 flex flex-col gap-2 sm:flex-row">
                        <Button variant="secondary" onClick={() => navigate(-1)}>
                            <ArrowLeft className="mr-2 h-4 w-4" />
                            Go back
                        </Button>
                        <Button asChild>
                            <Link to="/">
                            <Home className="mr-2 h-4 w-4" />
                            Home
                            </Link>
                        </Button>
                        <Button variant="outline" asChild>
                            <Link to="/products">
                            <ShoppingBag className="mr-2 h-4 w-4" />
                            Shop
                            </Link>
                        </Button>
                        </div>
                    </div>

                    {/* Image: vertical on mobile, anchored bottom-right on desktop */}
                    <div className="relative overflow-hidden rounded-xl min-h-[260px] md:min-h-[360px]">
                        <img
                            src="/images/cat-404.png"
                            alt="Confused cat peeking"
                            className="
                                min-h-[260px] md:min-h-[360px]
                                rounded-xl overflow-hidden
                                bg-[url('/images/cat-404.png')] bg-no-repeat
                                bg-cover bg-[right_bottom]
                            "
                            onError={(e) => { e.currentTarget.src = "/images/placeholder-product.png"; }}
                        />
                    </div>
                </div>
            </section>
        </main>
    );
}
