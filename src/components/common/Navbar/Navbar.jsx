import DesktopNav from "./DesktopNav"
import MobileNav from "./MobileNav"



const Navbar = () => {
    return (
        <div className="bg-primary text-primary-foreground h-[80px] px-4 flex">
            <div className='hidden md:flex items-center justify-between w-full'>
                <DesktopNav />
            </div>
            <div className='flex items-center justify-between w-full md:hidden'>
                <MobileNav />
            </div>
        </div>
    )
}

export default Navbar