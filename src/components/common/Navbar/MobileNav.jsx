import React from 'react'
import Logo from '../Logo'

const MobileNav = () => {
    return (
        <div className='flex items-center justify-between w-full'>
            <button className='flex items-center justify-center p-2'>
                <svg class="w-6 h-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                </svg>
            </button>
            <div className='absolute left-1/2 -translate-x-1/2'>
                <Logo />
            </div>
            <div className="w-6 h-6" />
        </div>
    )
}

export default MobileNav