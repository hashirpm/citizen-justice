import React from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
    return (
        <div className="w-full flex justify-center items-center">
            <Link href="/" className="text-black text-center w-1/3 hover:text-gray-300">
                Home
            </Link>
            <Link href="/about" className="text-black text-center w-1/3 hover:text-gray-300">
                Create Event
            </Link>
            <Link href="/services" className="text-black text-center w-1/3 hover:text-gray-300">
                Profile
            </Link>
        </div>
    );
};

export default Navbar;