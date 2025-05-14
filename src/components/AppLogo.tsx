
import { Dumbbell } from 'lucide-react';
import Link from 'next/link';

interface AppLogoProps {
  className?: string;
  iconSize?: number;
  textSize?: string;
}

export function AppLogo({ className, iconSize = 28, textSize = "text-2xl" }: AppLogoProps) {
  return (
    <Link href="/dashboard" className={`flex items-center gap-2 ${className}`}>
      <Dumbbell size={iconSize} className="text-primary" />
      <h1 className={`font-bold ${textSize} text-foreground`}>FitLife Journal</h1>
    </Link>
  );
}
