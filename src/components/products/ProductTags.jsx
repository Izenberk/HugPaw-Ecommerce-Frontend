import { Badge } from "../ui/badge"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"

function justifyClass(align) {
    if (align === "start") return "justify-start"
    if (align === "end") return "justify-end"
    return "justify-center"
}

export default function ProductTags({
    tags = [],
    align = "center",
    className = "",
}) {
    if (!tags.length) return null

    const visibleSm = tags.slice(0, 2)
    const hiddenSm = Math.max(0, tags.length - visibleSm.length)

    const visibleMd = tags.slice(0, 3)
    const hiddenMd = Math.max(0, tags.length - visibleMd.length)

    const justify = justifyClass(align)

    return (
        <div className={className} aria-label="Product tags">
            {/* Small screens: show 2 */}
            <div className={`flex ${justify} items-center gap-2 sm:hidden`}>
                {visibleSm.map((t, i) => (
                <Badge
                    key={`sm-${t}-${i}`}
                    variant="secondary"
                    className="rounded-full text-xs px-2 py-0.5 whitespace-nowrap max-w-[7rem] truncate"
                    title={t}
                >
                    {t}
                </Badge>
                ))}
                {hiddenSm > 0 && (
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Badge variant="outline" className="rounded-full text-xs px-2 py-0.5 whitespace-nowrap">
                        +{hiddenSm}
                    </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs max-w-[16rem]">
                    {tags.slice(2).join(", ")}
                    </TooltipContent>
                </Tooltip>
                )}
            </div>

            {/* md and up: show 3 */}
            <div className={`hidden sm:flex ${justify} items-center gap-2`}>
                {visibleMd.map((t, i) => (
                <Badge
                    key={`md-${t}-${i}`}
                    variant="secondary"
                    className="rounded-full text-xs px-2 py-0.5 whitespace-nowrap max-w-[9rem] truncate"
                    title={t}
                >
                    {t}
                </Badge>
                ))}
                {hiddenMd > 0 && (
                <Tooltip>
                    <TooltipTrigger asChild>
                    <Badge variant="outline" className="rounded-full text-xs px-2 py-0.5 whitespace-nowrap">
                        +{hiddenMd}
                    </Badge>
                    </TooltipTrigger>
                    <TooltipContent className="text-xs max-w-[16rem]">
                    {tags.slice(3).join(", ")}
                    </TooltipContent>
                </Tooltip>
                )}
            </div>
        </div>
    )
}