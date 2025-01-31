"use client";

export const dynamic = 'force-dynamic';

import { useState } from "react";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import { useRouter } from "next/navigation"; 

export default function Register() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    agreePolicy: false,
  });

  const [errors, setErrors] = useState({
    firstName: false,
    lastName: false,
    email: false,
    phone: false,
    password: false,
    confirmPassword: false,
    agreePolicy: false,
    passwordMatch: false,
  });

  const [successMessage, setSuccessMessage] = useState(false); 

  const validatePassword = (password) =>
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePhone = (phone) => /^\d{10,15}$/.test(phone);
  const validatePasswords = (password, confirmPassword) =>
    password === confirmPassword;

  const handleFieldChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    switch (field) {
      case "firstName":
        setErrors((prev) => ({ ...prev, firstName: !value }));
        break;
      case "lastName":
        setErrors((prev) => ({ ...prev, lastName: !value }));
        break;
      case "email":
        setErrors((prev) => ({ ...prev, email: !validateEmail(value) }));
        break;
      case "phone":
        setErrors((prev) => ({ ...prev, phone: !validatePhone(value) }));
        break;
      case "password":
        setErrors((prev) => ({
          ...prev,
          password: !validatePassword(value),
          passwordMatch: !validatePasswords(value, formData.confirmPassword), 
        }));
        break;
      case "confirmPassword":
        setErrors((prev) => ({
          ...prev,
          confirmPassword: !value,
          passwordMatch: !validatePasswords(formData.password, value), 
        }));
        break;
      default:
        break;
    }
  };
  
  const isFormValid =
    formData.firstName &&
    formData.lastName &&
    validateEmail(formData.email) &&
    validatePhone(formData.phone) &&
    validatePassword(formData.password) &&
    validatePasswords(formData.password, formData.confirmPassword) &&
    formData.agreePolicy;

    const handleSubmit = async (e) => {
      e.preventDefault();
    
      setErrors({
        firstName: !formData.firstName,
        lastName: !formData.lastName,
        email: !validateEmail(formData.email),
        phone: !validatePhone(formData.phone),
        password: !validatePassword(formData.password),
        confirmPassword: !formData.confirmPassword,
        agreePolicy: !formData.agreePolicy,
        passwordMatch: !validatePasswords(
          formData.password,
          formData.confirmPassword
        ),
      });
    
      if (!isFormValid) {
        return; 
      }
    
      const { firstName, lastName, email, phone, password } = formData;
    
      try {
        const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/register`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ firstName, lastName, email, phone, password }),
        });
    
        const data = await response.json();
        if (response.ok && data) {
          setSuccessMessage(true); 
          setFormData({
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            password: "",
            confirmPassword: "",
            agreePolicy: false,
          }); 
        } else if (response.status === 400 && data.error.includes("Invalid email domain")) {
          setErrors((prev) => ({
            ...prev,
            email: "Invalid email domain. Please use a reachable email.",
          }));
        } else if (response.status === 409 && data.error.includes("Email is already registered")) {
          setErrors((prev) => ({
            ...prev,
            email: "Email is already registered.",
          }));
        } else {
          setErrors((prev) => ({
            ...prev,
            email: "Email is already registered.",
          }));
        }
      } catch (error) {
        console.error("Error:", error);
        setErrors((prev) => ({
          ...prev,
          email: "Registration failed: Unable to connect to the server.",
        }));
      }
    };
    
  return (
    <div className="relative">
      {successMessage && (
        <div className="fixed top-0 left-0 right-0 bottom-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center w-96">
            <div className="mb-4 text-green-500 text-4xl">✔</div>
            <p className="text-lg text-gray-700 mb-4">Thank you for joining TakenGo!</p>
            <button
              className="px-4 py-1.5 text-white rounded-lg hover:opacity-90"
              style={{
                backgroundColor: "#d22a5e", 
                fontSize: "0.875rem",
              }}
              onClick={() => router.push("/login")}
            >
              Go to Login
            </button>
          </div>
        </div>
      )}
      <div className="max-w-2xl mx-auto mt-10 p-6 border rounded-lg shadow-lg">
        <h1 className="font-normal mb-2 text-center">Register</h1>
        <p className="text-base font-light font-sans mb-10 text-center">
          Let&apos;s start creating your account
        </p>
        <form className="space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <input
                type="text"
                placeholder="First Name"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
                value={formData.firstName}
                onChange={(e) => handleFieldChange("firstName", e.target.value)}
              />
              {errors.firstName && (
                <span className="text-red-500 text-sm">First Name is required</span>
              )}
            </div>
           <div>
              <input
                type="text"
                placeholder="Last Name"
                className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
                value={formData.lastName}
                onChange={(e) => handleFieldChange("lastName", e.target.value)}
              />
              {errors.lastName && (
                <span className="text-red-500 text-sm">Last Name is required</span>
              )}
            </div>
            </div>
            <div>
              <input
                type="email"
                placeholder="Email"
                className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                  errors.email ? "ring-red-500" : "focus:ring-gray-300"
                }`}
                value={formData.email}
                onChange={(e) => handleFieldChange("email", e.target.value)}
              />
              
              {errors.email && (
                <span className="text-red-500 text-sm">{errors.email}</span>
              )}
              {formData.email && (
                <div className="text-sm mt-2">
                  <ul className="list-disc ml-4 text-gray-600">
                    {!formData.email.includes("@") && (
                      <li className="text-red-500">Must include @ symbol</li>
                    )}
                    {!formData.email.includes(".") && (
                      <li className="text-red-500">Must include a domain (e.g., .com)</li>
                    )}
                    {!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email) && (
                      <li className="text-red-500">Must be a valid email format</li>
                    )}
                  </ul>
                </div>
              )}
              
            </div>
            <div>
              <PhoneInput
                country={"ca"}
                placeholder="Phone"
                value={formData.phone}
                onChange={(phone) => handleFieldChange("phone", phone)}
                inputClass={`!w-full !border !rounded-md ${
                  errors.phone ? "!ring-red-500" : ""
                }`}
                inputStyle={{
                  paddingLeft: "50px",
                  borderColor: "rgb(223, 228, 236)",
                  height: "2.62rem",
                  fontSize: "1rem",
                }}
              />
              {errors.phone && (
                <span className="text-red-500 text-sm">
                  Invalid phone number (10-15 digits required)
                </span>
              )}
            </div>
            <div>
            <input
              type="password"
              placeholder="Password"
              className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-gray-300"
              value={formData.password}
              onChange={(e) => handleFieldChange("password", e.target.value)}
            />
            {formData.password && (
              <div className="text-sm mt-2">
                <ul className="list-disc ml-4 text-gray-600">
                  {formData.password.length < 8 && (
                    <li className="text-red-500">Must be at least 8 characters long</li>
                  )}
                  {!/[A-Z]/.test(formData.password) && (
                    <li className="text-red-500">Must include an uppercase letter</li>
                  )}
                  {!/[a-z]/.test(formData.password) && (
                    <li className="text-red-500">Must include a lowercase letter</li>
                  )}
                  {!/[0-9]/.test(formData.password) && (
                    <li className="text-red-500">Must include a number</li>
                  )}
                  {!/[!@#$%^&*(),.?":{}|<>]/.test(formData.password) && (
                    <li className="text-red-500">Must include a special character</li>
                  )}
                </ul>
              </div>
            )}
          </div>
          <div>
            <input
              type="password"
              placeholder="Confirm Password"
              className={`w-full p-2 border rounded-md focus:outline-none focus:ring-2 ${
                errors.passwordMatch ? "ring-red-500" : "focus:ring-gray-300"
              }`}
              value={formData.confirmPassword}
              onChange={(e) => handleFieldChange("confirmPassword", e.target.value)}
            />
            {errors.confirmPassword && (
              <span className="text-red-500 text-sm">
                Confirm Password is required
              </span>
            )}
            {!errors.password && !errors.confirmPassword && errors.passwordMatch && (
              <span className="text-red-500 text-sm">Passwords do not match</span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={formData.agreePolicy}
              onChange={(e) => handleFieldChange("agreePolicy", e.target.checked)}
            />
            <label>I agree to the Privacy Policy</label>
            {!formData.agreePolicy && (
              <span className="text-red-500 text-sm">Required</span>
            )}
          </div>
          <button
            type="submit"
            className={`w-full p-2 px-4 py-1.5 text-white rounded-md shadow-md ${
              isFormValid
                ? "hover:opacity-90"
                : "bg-gray-200 text-gray-400 cursor-not-allowed"
            }`}
            style={{
              backgroundColor: isFormValid ? "#d22a5e" : "#e5e7eb",
            }}
            disabled={!isFormValid}
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}