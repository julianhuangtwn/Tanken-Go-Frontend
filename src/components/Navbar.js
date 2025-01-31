// src/components/Navbar.js
"use client"; // Add this directive at the top of the file

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { travel } from './ui/fonts'


const Navbar = () => {
  return (
    <nav className="navbar">
      <Link href='/'>
        <div className="flex logo items-center">
          <h1 className={`${travel.className} antialiased text-6xl`}>Tanken-GO</h1>
        </div>
      </Link>
      <ul className="flex items-center nav-links text-center">
        <li>
          <Link href="/">Home</Link>
        </li>
        <li>
          <Link href="/explore">Explore Trips</Link>
        </li>
        <li>
          <Link href="/community">Community</Link>
        </li>
        <li>
          <Link href="/contact">Contact</Link>
        </li>
      </ul>
      <div className="nav-right">
        <button className="start-button"><Link href="/explore">Start Planning</Link></button>
        <button className="account-button"><Link href="/login">Login</Link></button>
      </div>
    </nav>
  );
};

export default Navbar;
