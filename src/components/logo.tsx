import { Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

type LogoProps = {
  small?: boolean;
};

export default function Logo({ small = false }: LogoProps) {
  return (
    <div className="flex items-center gap-2 p-2 group-data-[collapsible=icon]:justify-center">
      <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
        <Wallet className="h-5 w-5" />
      </div>
      <h1
        className={cn(
          'font-bold text-xl text-sidebar-foreground transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0',
          small && 'text-primary'
        )}
      >
        BolsoZen
      </h1>
    </div>
  );
}
