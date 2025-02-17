"use client";

import { Button } from "@/components/ui/button"
import { removeToken } from "@/lib/authenticate"
import { useAtom } from "jotai"
import { userAtom } from "@/lib/userAtom"

import { useRouter } from 'next/navigation';

export default function Page() {
    const [user, setUser] = useAtom(userAtom);
    const { push } = useRouter();
    // Logout function
    const handleLogout = () => {
        console.log('Logging out...');
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
    <>
      <Button onClick={handleLogout}>Log Out</Button>
    </>
  );
}