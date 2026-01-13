import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { logout, clearError, logoutUser } from '@/src/store/authSlice';
import { useAuth } from './redux';

export const useAuthActions = () => {
  const { dispatch } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logoutUser()).unwrap();
    
    toast.success('Logged out successfully');
    router.push('/auth');
  };

  const handleClearError = () => {
    dispatch(clearError());
  };

  return {
    handleLogout,
    handleClearError,
  };
};