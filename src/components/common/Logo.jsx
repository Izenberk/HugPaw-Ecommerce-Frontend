import BrandLogo from "../../assets/images/logo/brand-logo.png"

const Logo = () => {
    return (
        <div className="flex gap-2 m-4">
            <img src={BrandLogo} alt="HugPaw Logo" className="h-7 w-7 object-contain" />
            <div className="text-onPrimary font-bold text-xl">HugPaw</div>
        </div>
    )
}

export default Logo