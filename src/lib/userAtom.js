import { atom } from 'jotai'

// User atom
// isLoggedIn: boolean
// identifier: string | null
export const userAtom = atom({ 
    isLoggedIn: false, 
    identifier: null,
})