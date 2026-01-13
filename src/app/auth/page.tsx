'use client';
import React from 'react';

import AuthFormClient from '@/src/app/auth/_components/AuthFormClient';

export default function AuthPage() {

  return (
    <main className="min-h-screen w-full flex items-center justify-center ">
      <AuthFormClient />
    </main>
  );
}

