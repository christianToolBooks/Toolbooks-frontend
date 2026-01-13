"use client";

import Link from "next/link";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import Image from "next/image";
import useRecoveryPassword, {
  ChangePasswordFormValue,
  changePasswordSchema,
} from "../hooks/useRecoveryPassword";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { 
  Form, 
  FormControl,
  FormField, 
  FormItem, 
  FormLabel,
  FormMessage 
} from "@/src/components/ui/form";

export default function ResetPassword({ token }: { token: string }) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { defaultPasswordValues, onSubmitPasswordChange, validatePasswordRequirements } =
    useRecoveryPassword();

  const form = useForm<ChangePasswordFormValue>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: defaultPasswordValues,
    mode: "onChange",
  });

  const watchedPassword = form.watch('password');
  const passwordRequirements = validatePasswordRequirements(watchedPassword || '');

  return (
    <div className="min-h-screen bg-chart-5 flex items-center justify-center p-4">
      <div className="w-full max-w-md space-y-8">
        {/* Logo */}
        <div className="flex items-center justify-center space-x-3">
          <div className="relative">
            <div className="absolute rounded-full" />
            <Image
              alt="logo-ToolBooks"
              src="logo-toolBooks.jpg"
              className="h-13 w-13 rounded-full relative z-10 ring-4 ring-chart-2"
            />
          </div>
          <h1 className="text-3xl font-bold text-chart-1">ToolBooks</h1>
        </div>

        {/* Reset Password Card */}
        <Card className="bg-white border-0 shadow-xl">
          <CardHeader className="space-y-4 pb-6">
            <div className="space-y-2 text-center">
              <h2 className="text-2xl font-semibold text-chart-1">
                Reset your Password
              </h2>
              <p className="text-gray-600 text-sm">
                Enter your new password below to complete the reset process
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit(data => onSubmitPasswordChange(data, token))}
                className="space-y-4"
              >
                {/* New Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-chart-1 font-semibold text-base">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Enter your new password..."
                            type={showPassword ? "text" : "password"}
                            className="w-full h-12 px-3 text-base bg-gray-50/80 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300 placeholder:text-gray-400 shadow-sm hover:shadow-md focus:shadow-lg pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Confirm Password Field */}
                <FormField
                  control={form.control}
                  name="confirmPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-1">
                      <FormLabel className="text-chart-1 font-semibold text-base">
                        Confirm New Password
                      </FormLabel>
                      <FormControl>
                        <div className="relative">
                          <Input
                            placeholder="Confirm your new password..."
                            type={showConfirmPassword ? "text" : "password"}
                            className="w-full h-12 px-3 text-base bg-gray-50/80 border-2 border-gray-200 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300 placeholder:text-gray-400 shadow-sm hover:shadow-md focus:shadow-lg pr-10"
                            {...field}
                          />
                          <button
                            type="button"
                            onClick={() =>
                              setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="w-4 h-4" />
                            ) : (
                              <Eye className="w-4 h-4" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Requirements */}
                <div className="bg-gray-50 p-3 rounded-lg">
                  <p className="text-xs text-gray-600 mb-2 font-medium">
                    Password must contain:
                  </p>
                  <ul className="text-xs space-y-1">
                    <li className={`flex items-center ${passwordRequirements.minLength ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className="mr-2">{passwordRequirements.minLength ? '✓' : '•'}</span>
                      At least 8 characters
                    </li>
                    <li className={`flex items-center ${passwordRequirements.hasUppercase ? 'text-green-600' : 'text-gray-500'}`}>
                      <span className="mr-2">{passwordRequirements.hasUppercase ? '✓' : '•'}</span>
                      One uppercase letter
                    </li>
                    <li>
                      <span className={`flex items-center ${passwordRequirements.hasSpeclialChar ? 'text-green-600' : 'text-gray-500'}`}>
                        <span className="mr-2">{passwordRequirements.hasSpeclialChar ? '✓' : '•'}</span>
                        One special character
                      </span>
                    </li>
                  </ul>
                </div>

                <Button
                  className="w-full h-12 bg-primary hover:bg-primary/90 text-white font-medium"
                  type="submit"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? 'Updating Password...' : 'Update Password'}
                </Button>

                <div className="text-center">
                  <p className="text-sm text-gray-600">
                    Remember your password?{" "}
                    <Link
                      href="/auth"
                      className="font-medium text-gray-900 hover:text-primary underline"
                    >
                      Back to Login
                    </Link>
                  </p>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}