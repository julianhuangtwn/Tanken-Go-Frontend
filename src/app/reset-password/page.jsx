"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ResetPasswordPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [status, setStatus] = useState("");

  const validatePassword = (password) =>
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const passwordsMatch = password === confirmPassword;

  const handleReset = async () => {
    if (!password || !confirmPassword) {
      return setStatus("Please fill in all fields.");
    }
    if (!validatePassword(password)) {
      return setStatus("Password does not meet complexity requirements.");
    }
    if (!passwordsMatch) {
      return setStatus("Passwords do not match.");
    }

    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/resetpwd`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("Password updated successfully! Redirecting...");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        setStatus(data.message || "Something went wrong.");
      }
    } catch (err) {
      console.error("Reset failed:", err);
      setStatus("An error occurred.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-24 px-4">
      <div className="flex flex-col gap-4 max-w-sm w-full mx-auto px-6 py-10 bg-white rounded-lg shadow">
        <h1 className="text-2xl font-bold font-roboto">Change Password</h1>

        <Input
          type="password"
          placeholder="New password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {password && (
          <ul className="text-sm text-gray-600 list-disc ml-6">
            {password.length < 8 && <li className="text-red-500">At least 8 characters</li>}
            {!/[A-Z]/.test(password) && <li className="text-red-500">Include uppercase letter</li>}
            {!/[a-z]/.test(password) && <li className="text-red-500">Include lowercase letter</li>}
            {!/[0-9]/.test(password) && <li className="text-red-500">Include number</li>}
            {!/[!@#$%^&*(),.?":{}|<>]/.test(password) && (
              <li className="text-red-500">Include special character</li>
            )}
          </ul>
        )}

        <Input
          type="password"
          placeholder="Confirm password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {password && confirmPassword && !passwordsMatch && (
          <p className="text-red-500 text-sm">Passwords do not match</p>
        )}

        <Button className="font-bold mt-4" onClick={handleReset}>
          Reset Password
        </Button>

        {status && <p className="text-sm text-center mt-2 text-gray-700">{status}</p>}
      </div>
    </div>
  );
}
