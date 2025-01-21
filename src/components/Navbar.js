// src/components/Navbar.js
"use client"; // Add this directive at the top of the file

import Link from 'next/link';
import { useRouter } from 'next/navigation';

const Navbar = () => {
  const router = useRouter();

  return (
    <nav className="navbar">
      <div className="logo">
        <h1>Tanken-Go</h1>
      </div>
      <ul className="nav-links">
        <li className={router.pathname === '/' ? 'active' : ''}>
          <Link href="/">Home</Link>
        </li>
        <li className={router.pathname === '/explore' ? 'active' : ''}>
          <Link href="/explore">Explore Trips</Link>
        </li>
        <li className={router.pathname === '/community' ? 'active' : ''}>
          <Link href="/community">Community</Link>
        </li>
        <li className={router.pathname === '/contact' ? 'active' : ''}>
          <Link href="/contact">Contact</Link>
        </li>
      </ul>
      <div className="nav-right">
        <button className="start-button"><Link href="/explore">Start Planning</Link></button>
        <button className="account-button"><Link href="/account">Account</Link></button>
      </div>
    </nav>
  );
};

export default Navbar;
