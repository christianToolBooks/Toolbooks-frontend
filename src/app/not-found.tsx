import Link from 'next/link';
import { Button } from '@/src/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/src/components/ui/card';
import { AlertTriangle, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background px-4 py-12 sm:px-6 lg:px-8">
      <Card className="w-full max-w-md text-center shadow-2xl">
        <CardHeader>
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-destructive/10 mb-6">
            <AlertTriangle className="h-10 w-10 text-destructive" />
          </div>

          <CardTitle className="text-4xl font-extrabold tracking-tight text-foreground sm:text-5xl">
            Oops! Page Not Found
          </CardTitle>

          <CardDescription className="mt-4 text-lg text-muted-foreground">
            It seems you&#39;ve wandered off the map. The page you&#39;re
            looking for doesn&#39;t exist or has been moved.
          </CardDescription>
        </CardHeader>

        <CardContent className="mt-2">
          <p className="text-sm text-muted-foreground">Error code: 404</p>
        </CardContent>

        <CardFooter className="mt-6 flex flex-col items-center justify-center gap-4">
          <Link href="/" passHref>
            <Button size="lg" className="w-full max-w-xs">
              <Home className="mr-2 h-5 w-5" />
              Return Home
            </Button>
          </Link>

          <p className="text-xs text-muted-foreground">
            If you believe this is an error, please contact support.
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
