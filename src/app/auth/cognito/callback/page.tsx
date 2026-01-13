// app/auth/cognito/callback/page.tsx
"use client";

import { Suspense, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn, useSession } from "next-auth/react";

function CognitoCallbackPage() {
  return (
    <Suspense>
      <CognitoCallbackLogic />
    </Suspense>
  );
}

const CognitoCallbackLogic = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { data: session, status } = useSession();

  // Estado para saber si estamos en medio de la llamada a signIn
  const [isSigningIn, setIsSigningIn] = useState(false);

  const code = searchParams.get("code");
  const error = searchParams.get("error"); // Cognito puede devolver 'error', 'error_description'

  useEffect(() => {
    if (code && status === "unauthenticated") {
      setIsSigningIn(true);

      signIn("cognito-code-exchange", {
        code: code,
        redirect: false, // No redirigir automáticamente, lo manejamos nosotros
      })
        .then((result) => {
          if (result?.ok) {
            // Inicio de sesión exitoso, redirigir al dashboard
            router.replace("/auth/post-login");
          } else {
            // Error durante el signIn de NextAuth (ej. el backend no pudo validar el código)
            console.error(
              "NextAuth signIn failed after Cognito code exchange:",
              result?.error,
            );
            router.replace(
              `/auth?error=${encodeURIComponent(result?.error || "SignInFailed")}`,
            );
          }
        })
        .catch((signInError) => {
          console.error(
            "Catastrophic error during signIn process:",
            signInError,
          );
          router.replace(`/auth?error=SignInProcessError`);
        })
        .finally(() => {
          setIsSigningIn(false); // Terminamos (aunque ya estaremos redirigiendo)
        });
    }
  }, [code, error, router, session, status, searchParams]);

  if (status === "loading" || isSigningIn) {
    return <LoadingFallback />;
  }

  return null;
};

const LoadingFallback = () => (
  <div className="min-h-screen flex flex-col items-center justify-center text-center p-4">
    <p className="text-xl font-semibold mb-2">Processing login...</p>
    <p className="text-sm text-gray-600">Please wait a moment.</p>
    <div className="mt-4 animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
  </div>
);

export default CognitoCallbackPage;
