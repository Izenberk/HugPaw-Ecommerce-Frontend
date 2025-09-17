import Logo from "../Logo"
import FBLogo from "../../../assets/images/logo/facebook.png"
import IGLogo from "../../../assets/images/logo/instagram.png"
import { Link } from "react-router-dom"


const DesktopFooter = () => {
    return (
        <div className="max-w-6xl mx-auto hidden md:grid grid-cols-5 gap-6">
            <div className="hover:cursor-pointer">
                <Logo />
            </div>
            <div>
                <h3 className="font-bold mb-2">Company</h3>
                <ul className="space-y-1 text-sm ">
                    <li className="hover:text-white hover:cursor-pointer">
                        <Link>About Us</Link>
                    </li>
                    <li className="hover:text-white hover:cursor-pointer">
                        <Link>FAQ</Link>
                    </li>
                    <li className="hover:text-white hover:cursor-pointer">
                        <Link>Contact</Link>
                    </li>
                </ul>
            </div>
            <div>
                <h3 className="font-bold mb-2">Legal</h3>
                <ul className="space-y-1 text-sm">
                    <li className="hover:text-white hover:cursor-pointer">
                        <Link>Privacy Policy</Link>
                    </li>
                    <li className="hover:text-white hover:cursor-pointer">
                        <Link>Terms and Conditionsy</Link>
                    </li>
                    <li className="hover:text-white hover:cursor-pointer">
                        <Link>Cookie Policy</Link>
                    </li>
                </ul>
            </div>
            <div>
                <h3 className="font-bold mb-2">Help</h3>
                <ul className="space-y-1 text-sm">
                    <li className="hover:text-white hover:cursor-pointer">
                        <Link>Shipping and Delivery</Link>
                    </li>
                    <li className="hover:text-white hover:cursor-pointer">
                        <Link>Returns Policy</Link>
                    </li>
                    <li className="hover:text-white hover:cursor-pointer">
                        <Link>Security and Payment</Link>
                    </li>
                </ul>
            </div>
            <div>
                <h3 className="font-bold mb-2">Social</h3>
                <div className="flex gap-4">
                    <Link><img src={FBLogo} alt="Facebook" className="h-5 w-5"/></Link>
                    <Link><img src={IGLogo} alt="Instagram" className="h-5 w-5"/></Link>
                </div>
            </div>
        </div>
    )
}

export default DesktopFooter