"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Link from "next/link";
import { userAtom } from "@/lib/userAtom";
import { useAtom } from "jotai";

export default function Page() {
  const [user, setUser] = useAtom(userAtom);

  const [name, setName] = useState(user.fullName || "");
  const [email, setEmail] = useState(user.email || "");
  const [phone, setPhone] = useState(user.phone || "");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const [errors, setErrors] = useState({
    email: "",
    phone: ""
  });

  const validateEmail = (email) =>
    /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

  const validatePhone = (phone) =>
    /^\d{10,15}$/.test(phone);

  const handleSave = async () => {
    const newErrors = {
      email: validateEmail(email) ? "" : "Invalid email format",
      phone: validatePhone(phone) ? "" : "Phone number must be 10-15 digits"
    };

    setErrors(newErrors);

    if (newErrors.email || newErrors.phone) return;

    try {
      const token = localStorage.getItem("token");

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/updateinfo`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          fullName: name,
          email,
          phone,
        }),
      });

      const text = await res.text();
      console.log("RAW RESPONSE:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch (err) {
        console.error("Failed to parse JSON:", err);
        throw new Error("Server did not return valid JSON");
      }

      if (res.ok) {
        setUser((prev) => ({
          ...prev,
          fullName: name,
          email,
          phone,
        }));
        setShowSuccess(true);
        setIsDialogOpen(false);
      } else {
        alert(data.message || "Update failed.");
      }
    } catch (error) {
      console.error("Error saving profile:", error);
      alert("An error occurred while saving changes.");
    }
  };

  return (
    <>
      {showSuccess && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
            <div className="mb-4 text-green-500 text-4xl">✔</div>
            <p className="text-lg text-gray-700 mb-4">Profile updated successfully!</p>
            <button
              className="px-4 py-1.5 text-white rounded-lg hover:opacity-90"
              style={{ backgroundColor: "#d22a5e", fontSize: "0.875rem" }}
              onClick={() => setShowSuccess(false)}
            >
              Close
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6">
        <div>
          <h1 className="text-3xl font-sans font-semibold mb-6">Account Details</h1>
          <div className="space-y-2">
            <p><strong>Name:</strong> {user.fullName}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Phone:</strong> {user.phone}</p>
          </div>

          <Link href="/forgot-password">
            <p className="mt-2 text-sm text-blue-500 underline hover:text-blue-700">
              Forgot Password
            </p>
          </Link>
        </div>

        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="heroButton font-bold">Edit Profile</Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Edit profile</DialogTitle>
              <DialogDescription>
                Make changes to your profile here. Click save when you're done.
              </DialogDescription>
            </DialogHeader>
            <div className="flex flex-col gap-4 py-4 items-center">
              <div className="w-full max-w-sm flex flex-col gap-1">
                <Label htmlFor="name">Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
              </div>
              <div className="w-full max-w-sm flex flex-col gap-1">
                <Label htmlFor="email">Email</Label>
                <Input id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>
              <div className="w-full max-w-sm flex flex-col gap-1">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" value={phone} onChange={(e) => setPhone(e.target.value)} />
                {errors.phone && <p className="text-red-500 text-sm">{errors.phone}</p>}
              </div>
            </div>
            <DialogFooter>
              <Button className="font-bold" type="button" onClick={handleSave}>
                Save changes
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </>
  );
}
