// src/components/Navbar.js
"use client"; // Add this directive at the top of the file

import { useState } from "react";
import Link from 'next/link';
import { travel } from './ui/fonts'

// Atom
import { useAtom } from 'jotai';
import { userAtom } from '@/lib/userAtom';
import { removeToken } from '@/lib/authenticate';

import { useRouter } from 'next/navigation';


const Navbar = () => {
  const [user, setUser] = useAtom(userAtom);
  const { push } = useRouter();
  const [menuOpen, setMenuOpen] = useState(false); 

  // Logout function
  const handleLogout = () => {
    setUser({
      isLoggedIn: false, 
      id: null,
      fullName: null,
      email: null,
      phone: null,
    });
    removeToken();
    push('/login');
  };

  return (
    <nav className="flex items-center justify-between min-h-18 p-2 shadow-md" >
      <Link href='/'>
        <div className="flex items-center font-bold mr-10">
          <h1 className={`${travel.className} antialiased text-5xl`}>Tanken-GO</h1>
        </div>
      </Link>
      <div className="flex flex-grow justify-center text-xl text-center items-center space-x-16 mx-4">
            <Link href="/">Home</Link>
            <Link href="/explore">Explore Trips</Link>
            <Link href="/community">Community</Link>
            <Link href="/contact">Contact</Link>
            <Link href="/account/details">Account</Link>
      </div>
      <div className="nav-right flex items-center space-x-4">
        { user.isLoggedIn ? (
          <>
            <button className="rounded-lg bg-themePink text-white text-lg font-bold px-6 py-3 border-themePink border-2"><Link href="/explore">Start Planning</Link></button>
            <button className="rounded-lg text-themePink text-lg font-bold px-6 py-3 border-themePink border-2" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button className="rounded-lg bg-themePink text-white text-lg font-bold px-6 py-3 border-themePink border-2"><Link href="/explore">Start Planning</Link></button>
            <button className="rounded-lg text-themePink text-lg font-bold px-6 py-3 border-themePink border-2"><Link href="/login">Login</Link></button>
          </>
        )}
      </div>
    </nav>
  );
};

// Consider implementing hamburger menu when screen size is md or smaller

export default Navbar;
