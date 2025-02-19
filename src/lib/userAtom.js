import { atom } from 'jotai'

// User atom
// isLoggedIn: boolean
// identifier: string | null
export const userAtom = atom({ 
    isLoggedIn: false, 
    id: 123,
    fullName: null,
    email: null,
    phone: null,
})