import { cn } from '@/src/lib/utils/utils';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  className?: string;
}

export function Loader({ size = 'md', text, className }: LoaderProps) {
  const sizeClasses = {
    sm: 'h-4 w-4',
    md: 'h-8 w-8',
    lg: 'h-12 w-12',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={cn('flex items-center justify-center', className)}>
      <div className="text-center">
        <div
          className={cn(
            'animate-spin rounded-full border-b-2 border-blue-600 mx-auto mb-2',
            sizeClasses[size]
          )}
        />
        {text && (
          <p className={cn('text-gray-600', textSizeClasses[size])}>{text}</p>
        )}
      </div>
    </div>
  );
}

export function ModalLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="flex items-center justify-center h-40">
      <Loader size="md" text={text} />
    </div>
  );
}
