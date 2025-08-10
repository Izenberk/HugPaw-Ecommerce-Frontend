import React from 'react'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'

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
                <CardTitle className="text-foreground leading-tight">{name}</CardTitle>
                <div className="relative w-full overflow-hidden rounded-xl bg-muted">
                    <img
                        src={imageUrl}
                        alt={name}
                        loading="lazy"
                        className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                        />
                </div>
            </CardHeader>
            <CardContent>
                <p className="text-lg font-semibold">{formatTHB(price)}</p>
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