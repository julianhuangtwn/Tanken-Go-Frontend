"use client"

import { usePathname, useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

import { isAuthenticated } from '@/lib/authenticate';
import { useAtom } from 'jotai';
import { userAtom } from '@/lib/userAtom';

const PUBLIC_PATHS = ['/login', '/', '/register','/_error'];

export default function RouteGuard({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  
  const [authorized, setAuthorized] = useState(false);

  useEffect(() => {
    authCheck(pathname);
  }, [pathname]);

  function authCheck(url) {
    const path = url.split('?')[0];
    if (!isAuthenticated() && !PUBLIC_PATHS.includes(path)) {
        setAuthorized(false);
        router.push('/login');
    } else {
        setAuthorized(true);
    }
  }

  return <>{authorized && children}</>
}