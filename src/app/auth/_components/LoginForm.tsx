// src/components/auth/LoginForm.tsx
'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import PasswordButton from '@/src/app/auth/_components/PasswordButton';
import { loginUser } from '@/src/store/authSlice';
import { useAuth } from '../hooks/redux';

const loginSchema = z.object({
  email: z.string().email({ message: 'Invalid email' }),
  password: z.string().min(6, { message: 'Minimum six characters' }),
});

type LoginSchema = z.infer<typeof loginSchema>;

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const { isLoading, error, dispatch } = useAuth();

  const form = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginSchema) => {
    try {
      await dispatch(loginUser(data)).unwrap();
      router.push('/dashboard');
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

        {error && (
          <div className="text-red-500 text-sm">
            {error}
          </div>
        )}

        <div className="text-right">
          <button 
            type="button" 
            className="text-sm text-primary hover:underline" 
            onClick={() => router.push("auth/forgotPassword")}
          >
            Forgot Password?
          </button>
        </div>

        <Button disabled={isLoading} type="submit" className="w-full">
          {isLoading ? "Logging in…" : "Login"}
        </Button>
      </form>
    </Form>
  );
}

export default LoginForm;