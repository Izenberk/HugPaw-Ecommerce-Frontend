import { Link } from 'react-router-dom'
import Logo from '../Logo'
import SearchBox from './SearchBox'
import UserSection from './UserSection'

const DesktopNav = () => {
    return (
        <div className='hidden md:flex items-center justify-between w-full gap-4'>
            <nav >
                <ul className="hidden md:flex md:items-center-safe gap-4 ml-4">
                    <li className='hover:text-white'>
                        <Link>
                            <Logo />
                        </Link>
                    </li>
                    <li className='hover:text-white'>
                        <Link>Catalog</Link>
                    </li>
                    <li className='hover:text-white'>
                        <Link>Feature</Link>
                    </li>
                    <li className='hover:text-white'>
                        <Link>Wishlist</Link>
                    </li>
                </ul>
            </nav>
            <SearchBox />
            <UserSection />
        </div>
    )
}

export default DesktopNav