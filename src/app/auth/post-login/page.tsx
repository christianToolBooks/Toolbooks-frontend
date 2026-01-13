// app/auth/post-login/page.tsx
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { authOptions } from '@/src/app/api/auth/options';

export default async function PostLoginPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user) {
    // No debería ocurrir si el flujo es correcto, pero como fallback, redirige a login
    redirect('/auth');
  }
  // Aquí está la lógica centralizada de redirección
  if (session.user.isBusinessProfile) {
    redirect('/dashboard');
  } else {
    redirect('/onboarding');
  }

  // No es necesario retornar UI, pero es buena práctica para que React no se queje.
  // En la práctica, el redirect detiene la ejecución.
  return (
    <div className="min-h-screen flex items-center justify-center">
      <p>Redirecting...</p>
    </div>
  );
}
