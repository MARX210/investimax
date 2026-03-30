import { Wallet } from 'lucide-react';
import { cn } from '@/lib/utils';

type LogoProps = {
  small?: boolean;
};

export default function Logo({ small = false }: LogoProps) {
  return (
    <div className="flex items-center gap-2 p-2 group-data-[collapsible=icon]:justify-center">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-[0_4px_0_rgb(0,0,0,0.2)]">
        <Wallet className="h-6 w-6" />
      </div>
      <h1
        className={cn(
          'font-black text-2xl tracking-tighter transition-opacity duration-200 group-data-[collapsible=icon]:opacity-0',
          'drop-shadow-[2px_2px_0px_rgba(0,0,0,0.15)]',
          small ? 'text-slate-900' : 'text-white'
        )}
      >
        Investimax
      </h1>
    </div>
  );
}
