"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/forgotpwd`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (res.ok) {
      setStatus("A reset link has been sent to your email.");
    } else {
      setStatus(data.message || "Something went wrong.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-24">
      <div className="flex flex-col gap-4 max-w-sm w-full mx-auto">
        <h1 className="text-2xl font-bold">Forgot Password</h1>
        <Input
          type="email"
          placeholder="Enter your registered email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Button onClick={handleSubmit}>Send Reset Link</Button>
        {status && <p className="text-sm text-center mt-2 font-bold">{status}</p>}
      </div>
    </div>
  );
}
