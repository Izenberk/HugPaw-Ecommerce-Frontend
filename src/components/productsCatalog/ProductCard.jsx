import React from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { Button } from "../ui/button";
import { Link } from "react-router-dom";
import ProductTags from "./ProductTags";
import { formatTHB } from "@/lib/formatters";
import { paths } from "@/app/paths";

const PLACEHOLDER_IMG = "/images/placeholder-product.png";

const ProductCard = ({ id, name, price, imageUrl, description, to, tags = [] }) => {
  const href = to ?? paths.productDetail(id); // ✅ always customizable

    return (
        <Card className="group relative h-full overflow-hidden transition-all hover:shadow-lg">

        <CardHeader className="space-y-2">
            <CardTitle className="flex justify-center text-xl font-semibold leading-tight text-foreground">
            {name}
            </CardTitle>

            <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-card">
            <img
                src={imageUrl || PLACEHOLDER_IMG}
                alt={name}
                loading="lazy"
                decoding="async"
                className="absolute inset-0 h-full w-full object-contain p-2"
                onError={(e) => {
                if (e.currentTarget.src !== PLACEHOLDER_IMG) e.currentTarget.src = PLACEHOLDER_IMG;
                }}
            />
            <span className="absolute right-2 top-2 z-10 rounded-xl bg-primary px-2 py-1 text-xs text-">
                Customizable
            </span>
            </div>


            <ProductTags tags={tags} maxVisible={3} align="center" overflow="tooltip" />
        </CardHeader>

        <CardContent>
            <div className="mx-4 flex gap-4">
            <span className="flex items-center text-sm">Starting price:</span>
            <span className="text-lg font-semibold">{formatTHB(Number.isFinite(price) ? price : 0)}</span>
            </div>
            <p className="text-sm text-muted-foreground line-clamp-2" title={description}>
            {description}
            </p>
        </CardContent>

        <CardFooter className="flex items-center justify-center">
            <Button className="w-min" variant="black" asChild aria-label={`Customize ${name}`}>
            <Link to={href}>Let's customize</Link>
            </Button>
        </CardFooter>
        </Card>
    );
};

export default ProductCard;