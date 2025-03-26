'use client'
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


import { useAtom } from 'jotai';
import { isPossiblePhoneNumber } from 'libphonenumber-js';

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"

import Link  from "next/link"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"

import { authenticateUser, readToken, getToken } from '@/lib/authenticate';
import { userAtom } from '@/lib/userAtom';

const NEXT_PUBLIC_API_URL = process.env.NEXT_PUBLIC_API_URL

// 1. Define the validation schema using Zod
const formSchema = z.object({
    identifier: z
        .string()
        .nonempty({ message: "Email or Phone Number is required." })
        .refine((value) => {
            // Email Regex
            const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
            const isEmail = emailRegex.test(value)

            // Phone Number
            console.log(value)
            const isPhone = isPossiblePhoneNumber(value, 'CA')

            return isEmail || isPhone
        }, {
            message: "Invalid Email or Phone Number.",
        })
        .transform((value) => {
            // If it's a phone number, strip all non-digit characters
            if (isPossiblePhoneNumber(value, 'CA')) {
                return value.replace(/\D/g, "")
            }
            return value;
        }),
    password: z
        .string()
        .nonempty({ message: "Password is required." })
        .min(2, { message: "Password must be at least 2 characters." })
        .max(50, { message: "Password must be at most 50 characters." }),
  })

export function LoginForm({
  className,
  ...props
}) {
    // 2. Set up state flags for the form
    const [ user, setUser ] = useAtom(userAtom);
    const [ isSubmitting, setIsSubmitting ] = useState(false);
    const [ errorMessage, setErrorMessage ] = useState(null);
    // const [ isLoggedIn, setIsLoggedIn ] = useState(false);

    // 3. Initialize the form
    const form = useForm({
      resolver: zodResolver(formSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    })

    const { push } = useRouter()

    // Redirect to dashboard if user is already logged in
    useEffect(() => {
        const storedToken = getToken();
        const currentPath = window.location.pathname;
      
        if (storedToken && currentPath === "/login") {
          const tokenData = readToken();
          setUser({
            isLoggedIn: true,
            id: tokenData.id,
            fullName: tokenData.fullName,
            email: tokenData.email,
            phone: tokenData.phone,
          });
          push('/account/details');
        }
      }, [setUser]);
      

    // 4. Handle form submission
    const onSubmit = async (data) => {
        setIsSubmitting(true)
        setErrorMessage(null)

        try {
            const response = await authenticateUser(data.identifier, data.password);
            if (response && response.success) {
                const tokenData = readToken();
                setUser({
                    isLoggedIn: true,
                    id: tokenData.id,
                    fullName: tokenData.fullName,
                    email: tokenData.email,
                    phone: tokenData.phone,
                })
                push('/account/details');
            } else {
                setErrorMessage("Invalid credentials.")
            }
        } catch (error) {
            console.error("An unexpected error occurred:", error)
            setErrorMessage(error.message)
        } finally {
            setIsSubmitting(false)
        }

    }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Log into your Tanken Go account to access the dashboard.
          </CardDescription>
        </CardHeader>
        <CardContent>

            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)}>
                <div className="flex flex-col gap-6">
                    {/* IDENTIFIER FIELD */}
                    <FormField 
                        control={form.control}
                        name="identifier"
                        render={({field}) => (
                            <FormItem>
                            <FormLabel>Email or Phone Number</FormLabel>
                            <FormControl>
                                <Input placeholder="you@example.com or 1234567890" {...field} disabled={isSubmitting}/>
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* PASSWORD FIELD */}
                    <FormField 
                        control={form.control}
                        name="password"
                        render={({field}) => (
                            <FormItem>
                            <div className="flex items-center justify-between">
                                <FormLabel>Password</FormLabel>
                                <Link
                                href="/forgot-password"
                                className="ml-auto text-sm underline-offset-4 hover:underline"
                                >
                                Forgot your password?
                                </Link>
                            </div>
                            <FormControl>
                                <Input type="password" {...field} disabled={isSubmitting} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />

                    {/* ERROR MESSAGE */}
                    { errorMessage && (
                        <p className="text-red-500 text-sm">
                            {errorMessage}
                        </p>
                    )}
                    
                    {/* SUBMIT BUTTON */}
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                </div>
                </form>
            </Form>

            {/* Sign Up Link */}
            <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <Link href='/register'>
                    Sign up
                </Link>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
