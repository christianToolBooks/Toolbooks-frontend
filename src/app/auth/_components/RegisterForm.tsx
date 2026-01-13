// src/components/auth/RegisterForm.tsx
"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import PasswordButton from "@/src/app/auth/_components/PasswordButton";
import { registerUserAsync, loginUser } from "@/src/store/authSlice";
import { useAuth } from "../hooks/redux";
import { NotificationCardsDemo } from "./notification-cards-demo";

const registerSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least two characters" })
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
      message: "Name cannot contain numbers or special characters",
    }),
  lastName: z
    .string()
    .min(2, { message: "The last name must be at least two characters" })
    .regex(/^[A-Za-zÁÉÍÓÚáéíóúÑñ\s]+$/, {
      message: "Last name cannot contain numbers or special characters",
    }),

  email: z.string().email({ message: "Invalid email" }),
  password: z
    .string()
    .min(8, { message: "The password must be at least eight characters long" })
    .regex(/[A-Z]/, {
      message: "The password must contain at least one capital letter",
    })
    .regex(/[0-9]/, {
      message: "The password must contain at least one number",
    })
    .regex(/[\W_]/, {
      message: "The password must contain at least one symbol",
    }),
});

type RegisterSchema = z.infer<typeof registerSchema>;

function RegisterForm() {
  const router = useRouter();
  const { isLoading, error, dispatch } = useAuth();
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      lastName: "",
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: RegisterSchema) => {
    try {
      const registeredUser = await dispatch(registerUserAsync(data)).unwrap();

      toast.success(
        `User ${registeredUser.username} registered! Attempting to log in...`
      );

      try {
        await dispatch(
          loginUser({
            email: data.email,
            password: data.password,
          })
        ).unwrap();
        setTimeout(() => {
          router.push("/auth/get-started");
        }, 100);
      } catch (loginError) {
        console.error(loginError);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handlePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Your Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="lastName"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Your Last Name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@example.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          disabled={isLoading}
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <div className="relative">
                <FormControl>
                  <Input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    {...field}
                  />
                </FormControl>
                <PasswordButton
                  showPassword={showPassword}
                  onPasswordVisibility={handlePasswordVisibility}
                  disabled={isLoading}
                />
              </div>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="p-2">
          <NotificationCardsDemo />
        </div>

        {error && <div className="text-red-500 text-sm">{error}</div>}

        <Button disabled={isLoading} type="submit" className="w-full">
          {isLoading ? "Registering…" : "Register"}
        </Button>
      </form>
    </Form>
  );
}

export default RegisterForm;
