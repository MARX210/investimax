'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import AddTransactionSheet from '@/components/transactions/add-transaction-sheet';
import Logo from '../logo';
import { useAuth } from '@/hooks/use-auth';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';

export default function Header() {
  const { logout } = useAuth();
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="hidden md:block">
        <Logo small />
      </div>
      <div className="flex-1" />
      <AddTransactionSheet />
      <Button variant="ghost" size="icon" onClick={logout}>
        <LogOut className="h-4 w-4" />
        <span className="sr-only">Sair</span>
      </Button>
    </header>
  );
}
