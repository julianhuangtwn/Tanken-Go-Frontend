// src/components/Navbar.js
"use client"; // Add this directive at the top of the file


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
        { user.isLoggedIn ? (
          <>
            <button className="start-button"><Link href="/explore">Start Planning</Link></button>
            <button className="account-button" onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <button className="start-button"><Link href="/explore">Start Planning</Link></button>
            <button className="account-button"><Link href="/login">Login</Link></button>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
