
import type { ReactNode } from 'react';
import { AppLogo } from '@/components/AppLogo';

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background p-4">
      <div className="mb-8">
        <AppLogo iconSize={36} textSize="text-3xl" />
      </div>
      <div className="w-full max-w-md">
        {children}
      </div>
    </div>
  );
}
