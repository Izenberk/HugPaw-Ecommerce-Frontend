import DesktopFooter from "./DesktopFooter"

const Footer = () => {
    return (
        <div className="bg-gray-800 text-white px-6 py-8 h-[auto] md:h-[200px]">
            <div>
                <DesktopFooter />
            </div>
            <div className="md:pt-6 text-center text-sm text-primary-foreground">
                Copyright © HugPaw 2025
            </div>
        </div>
    )
}

export default Footer