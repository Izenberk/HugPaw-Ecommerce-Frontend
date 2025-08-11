import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Link } from 'react-router-dom'

function formatTHB(value) {
    if (value === undefined || value === null) return ""
    try {
        return new Intl.NumberFormat("th-TH", { style: "currency", currency: "THB", maximumFractionDigits: 0 }).format(value)
    } catch {
        return `${value} ฿`
    }
}

const ProductCard = ({ id, name, price, imageUrl, description, to }) => {
    return (
        <Card className="group h-full overflow-hidden transition-all hover:shadow-lg">
            <CardHeader className="space-y-2">
                <CardTitle className="flex justify-center text-xl font-semi text-foreground leading-tight">{name}</CardTitle>
                <div className="relative aspect-[4/3] w-full overflow-hidden rounded-xl bg-white">
                    <img
                        src={imageUrl}
                        alt={name}
                        loading="lazy"
                        decoding="async"
                        className="absolute inset-0 h-full w-full object-contain p-2"
                    />
                </div>
            </CardHeader>
            <CardContent>
                <div className="flex mx-4 gap-4">
                    <span className="flex text-sm items-center">Starting price:</span><span className="text-lg font-semibold">{formatTHB(price)}</span>
                </div>
                <p
                    className="text-sm text-muted-foreground line-clamp-2"
                    title={description}
                >
                    {description}
                </p>
            </CardContent>
            <CardFooter>
                <Button className="w-full" asChild aria-label={`Customize ${name}`}>
                    <Link to={to ?? `/product/${id}`}>Let's customize</Link>
                </Button>
            </CardFooter>
        </Card>
    )
}

export default ProductCard