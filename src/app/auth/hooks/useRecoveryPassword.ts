/* eslint-disable @typescript-eslint/no-explicit-any */
import { sendEmailVerificationToResetPassaword, resetPasswordWithToken } from '@/src/lib/services/auth.server';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { z } from 'zod';

// Schema to send email for password reset
export const sendEmailToResetPasswordSchema = z.object({
  email: z
    .string()
    .email('Please enter a valid Email')
    .min(5, 'Please enter a valid Email'),
});

// Schema to change password
export const changePasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password must contain at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[^A-Za-z0-9]/, 'You must include at least one special character'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

export type ResetPasswordFormValue = z.infer<typeof sendEmailToResetPasswordSchema>;
export type ChangePasswordFormValue = z.infer<typeof changePasswordSchema>;

export default function useRecoveryPassword() {
  const router = useRouter();

  /**
   * Logic to send email for recovery password
   */
  const defaultEmailValues: Partial<ResetPasswordFormValue> = {
    email: '',
  };

  const onSubmitEmail = async (data: ResetPasswordFormValue) => {
    if (!data.email) {
      toast.warning('You need to insert an email to get a Link');
      return;
    }
    
    try {
      const sendEmail = await sendEmailVerificationToResetPassaword(data.email);
      toast.success(sendEmail);
    } catch (error) {
      toast.error('Failed to send recovery email');
    }
  };

  /**
   * Logic to change the password
   */
  const defaultPasswordValues: Partial<ChangePasswordFormValue> = {
    password: '',
    confirmPassword: '',
  };

  const onSubmitPasswordChange = async (data: ChangePasswordFormValue, token?: string) => {
    if (!data.password || !data.confirmPassword) {
      toast.warning('Please fill in both password fields');
      return;
    }

    if (data.password !== data.confirmPassword) {
      toast.error("Passwords don't match");
      return;
    }

    if (!token) {
      toast.error('Reset token is missing');
      return;
    }

    try {
      const response = await resetPasswordWithToken(data.password, token);
      toast.success(response);
      router.push('/auth');
    } catch (error: any) {
      toast.error(error.message || 'Failed to change password');
    }
  };

  /**
   * function to validate password requirements
   */
  const validatePasswordRequirements = (password: string) => {
    const requirements = {
      minLength: password.length >= 8,
      hasUppercase: /[A-Z]/.test(password),
      hasSpeclialChar: /[^A-Za-z0-9]/.test(password),
    };

    return requirements;
  };

  return {
    // To send email for password reset
    defaultEmailValues,
    onSubmitEmail,
    sendEmailToResetPasswordSchema,
    
    // to change password
    defaultPasswordValues,
    onSubmitPasswordChange,
    changePasswordSchema,
    validatePasswordRequirements,
  };
}