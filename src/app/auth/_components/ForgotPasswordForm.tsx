/* eslint-disable react/no-unescaped-entities */
'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Image from 'next/image';
import { Card, CardHeader, CardTitle } from '@/src/components/ui/card';
import { Form, FormField, FormItem, FormLabel } from '@/src/components/ui/form';
import { Input } from '@/src/components/ui/input';
import { Button } from '@/src/components/ui/button';
import { useRouter } from 'next/navigation';
import UseRecoveryPassword, {
  ResetPasswordFormValue,
  sendEmailToResetPasswordSchema,
} from '../hooks/useRecoveryPassword';

export default function ForgotPasswordForm() {
  const router = useRouter();
  const { defaultEmailValues, onSubmitEmail } = UseRecoveryPassword();

  const form = useForm<ResetPasswordFormValue>({
    resolver: zodResolver(sendEmailToResetPasswordSchema),
    defaultValues: defaultEmailValues,
    mode: 'onChange',
  });

  return (
    <div className="min-h-screen w-full bg-chart-5 flex flex-col items-center justify-center relative overflow-hidden">
      <div className="flex flex-col items-center justify-center w-full max-w-2xl gap-10 relative z-10">

        <Card className="p-12 w-full max-w-xl flex flex-col items-center gap-10 bg-white/94 backdrop-blur-xl border-0 shadow-2xl rounded-3xl relative overflow-hidden">
        <CardHeader className="w-full  flex justify-center items-center gap-4 backdrop-blur-sm rounded-2xl">
          <div className="relative">
            <div className="absolute rounded-full" />
            <Image
              alt="logo-ToolBooks"
              width={52}
              height={52}
              src="/logo-toolBooks.svg"
              className="h-13 w-13 rounded-full relative z-10 ring-4 "
            />
          </div>
          <CardTitle>
            <h2 className="text-3xl font-bold text-chart-1 tracking-wide">
              ToolBooks
            </h2>
          </CardTitle>
        </CardHeader>
          <CardHeader className="self-start w-full relative z-10 p-0">
            <CardTitle className="text-2xl font-bold text-chart-1 mb-3 tracking-tight">
              Forgot your Password?
            </CardTitle>
            <p className="text-gray-600 text-sm leading-relaxed">
              No worries, we'll send you reset instructions to get you back on
              track
            </p>
          </CardHeader>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmitEmail)}
              className="w-full space-y-8 relative z-10"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem className="space-y-1">
                    <FormLabel className="text-chart-1-700 font-semibold text-base">
                      Email Address
                    </FormLabel>
                    <div className="relative">
                      <Input
                        placeholder="Enter your email address..."
                        className="w-full h-12 px-3 text-base bg-gray-50/80 border-2 border-chart-5 rounded-xl focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all duration-300 placeholder:text-gray-400 shadow-sm hover:shadow-md focus:shadow-lg"
                        {...field}
                      />
                      <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-primary/5 to-transparent opacity-0 hover:opac<ity-100 t>ransition-opacity duration-300 pointer-events-none" />
                    </div>
                  </FormItem>
                )}
              />

              <div className="pt-4">
                <Button className="w-full h-14 text-base font-semibold bg-chart-1 text-white rounded-xl shadow-lg hover:shadow-xl transform hover:scale-[1.01] transition-all duration-300 relative overflow-hidden group">
                  <div className="absolute" />
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    Send Reset Email
                    <svg
                      className="w-5 h-5 transform group-hover:translate-x-1 transition-transform duration-300"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
                      />
                    </svg>
                  </span>
                </Button>
              </div>
            </form>
          </Form>

          <div className="w-full text-center pt-4 border-t border-gray-200/50 relative z-10">
            <p className="text-gray-600 text-sm">
              Remember your password?
              <button
                onClick={() => router.push('/auth')}
                className="text-primary font-semibold hover:text-primary/80 transition-colors duration-200 hover:underline ml-2"
              >
              Back to Login
              </button>
            </p>
          </div>
        </Card>
      </div>
    </div>
  );
}
