// This file contains the functions to authenticate a user and manage the JWT token.

import { jwtDecode } from 'jwt-decode';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL

export async function authenticateUser (identifier, password) {
    const response = await fetch(NEXT_PUBLIC_API_URL + "/auth/login", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ identifier: identifier, password: password }),
    })

    const responseData = await response.json()

    if (response.status === 200) {
        console.log("Login successful!");
        setToken(responseData.token); // Save the token to local storage
        return { success: true, message: "Login Successful!" };
    } else if (response.status === 401) {
        console.log("Invalid credentials.");
        return { success: false, message: "Invalid credentials." };
    } else {
        console.error("An unexpected error occurred:", responseData);
        return { success: false, message: "An unexpected error occurred." };
    } 

}

function setToken(token) {
    localStorage.setItem("token", token);
}

export function getToken() {
    try {
      return localStorage.getItem('token');
    } catch (err) {
      return null;
    }
}

export function removeToken() {
    localStorage.removeItem('token');
}

export function readToken() {
    try {
      const token = getToken();
      return token ? jwtDecode(token) : null;
    } catch (err) {
      return null;
    }
}

export function isAuthenticated() {
    const token = readToken();
    if (!token) return false;

    // Check if the token is expired
    if (token.exp * 1000 < Date.now()) {
        removeToken(); // Remove expired token
        return false;
    }

    return true;
}