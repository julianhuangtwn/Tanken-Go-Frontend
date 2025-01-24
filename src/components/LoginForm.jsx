'use client'

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useState } from "react"

import { Link } from "next/link"

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


// 1. Define the validation schema using Zod
const formSchema = z.object({
    identifier: z
        .string()
        .nonempty({ message: "Email or Phone Number is required." })
        .refine((value) => {
            // Email Regex
            const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i
            const isEmail = emailRegex.test(value)

            // Phone Regex
            const phoneRegex = /^[0-9]{10}$/
            const sanitizedValue = value.replace(/[\s()-]/g, "") // Remove spaces, parentheses, and hyphens
            const isPhone = phoneRegex.test(sanitizedValue)

            return isEmail || isPhone
        }, {
            message: "Invalid Email or Phone Number.",
        }),
    password: z
        .string()
        .nonempty({ message: "Password is required." })
        .min(8, { message: "Password must be at least 8 characters." })
        .max(50, { message: "Password must be at most 50 characters." }),
  })

export function LoginForm({
  className,
  ...props
}) {
    // 2. Set up state flags for the form
    const [ isSubmitting, setIsSubmitting ] = useState(false);

    // 3. Initialize the form
    const form = useForm({
      resolver: zodResolver(formSchema),
        defaultValues: {
            identifier: "",
            password: "",
        },
    })

    // 4. Handle form submission
    const onSubmit = (data) => {
        setIsSubmitting(true)
        console.log(data)
    }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Log into your Tanken Go accoun to access the dashboard.
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
                                <a
                                href="./forgot-password"
                                className="ml-auto text-sm underline-offset-4 hover:underline"
                                >
                                Forgot your password?
                                </a>
                            </div>
                            <FormControl>
                                <Input type="password" {...field} disabled={isSubmitting} />
                            </FormControl>
                            <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type="submit" className="w-full" disabled={isSubmitting}>
                        {isSubmitting ? "Logging in..." : "Login"}
                    </Button>
                </div>
                </form>
            </Form>

            {/* Sign Up Link */}
            <div className="mt-4 text-center text-sm">
                Don&apos;t have an account?{" "}
                <a href="#" className="underline underline-offset-4">
                Sign up
                </a>
            </div>
        </CardContent>
      </Card>
    </div>
  )
}
