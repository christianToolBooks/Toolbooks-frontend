import React from 'react';
import { Button } from '@/src/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

interface Props {
  showPassword: boolean;
  onPasswordVisibility: () => void;
  disabled?: boolean;
}

function PasswordButton({
  onPasswordVisibility,
  showPassword,
  disabled,
}: Props) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="sm"
      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
      onClick={onPasswordVisibility}
      disabled={disabled}
    >
      {showPassword ? (
        <EyeOff className="h-4 w-4" aria-hidden="true" />
      ) : (
        <Eye className="h-4 w-4" aria-hidden="true" />
      )}
      <span className="sr-only">
        {showPassword ? 'Hide password' : 'Show password'}
      </span>
    </Button>
  );
}

export default PasswordButton;
