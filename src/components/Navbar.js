// src/components/Navbar.js
"use client";

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { travel } from './ui/fonts';

const Navbar = () => {
  return (
    <nav className="navbar flex justify-between items-center px-8 py-4 w-full mx-auto">
      {/* Left Logo */}
      <div className="logo flex-shrink-0">
        <Link href="/">
          <h1 className={`${travel.className} antialiased text-6xl`}>Tanken-GO</h1>
        </Link>
      </div>

      {/* Centered Navigation Links */}
      <ul className="nav-links flex items-center text-center">
        <li><Link href="/">Home</Link></li>
        <li><Link href="/explore">Explore Trips</Link></li>
        <li><Link href="/community">Community</Link></li>
        <li><Link href="/contact">Contact</Link></li>
      </ul>

      {/* Right Buttons */}
      <div className="nav-right flex space-x-4 justify-end">
        <Link href="/explore">
          <button className="start-button">Start Planning</button>
        </Link>
        <Link href="/login">
          <button className="account-button">Login</button>
        </Link>
      </div>
    </nav>
  );
};

export default Navbar;