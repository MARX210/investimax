
'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import AddTransactionSheet from '@/components/transactions/add-transaction-sheet';
import Logo from '../logo';
import { useAuth } from '@/hooks/use-auth';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { LogOut, User as UserIcon, Settings, Trash2 } from 'lucide-react';
import { useState } from 'react';
import ProfileDialog from '../profile/profile-dialog';
import { ModeToggle } from '../mode-toggle';

export default function Header() {
  const { user, logout } = useAuth();
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  const userInitials = user?.name
    ? user.name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2)
    : 'U';

  return (
    <header className="sticky top-0 z-10 flex h-16 items-center gap-4 border-b bg-background/80 px-4 backdrop-blur-sm sm:px-6 lg:px-8">
      <div className="md:hidden">
        <SidebarTrigger />
      </div>
      <div className="hidden md:block">
        <Logo small />
      </div>
      <div className="flex-1" />
      
      <div className="flex items-center gap-2 sm:gap-4">
        <AddTransactionSheet />
        <ModeToggle />
        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Avatar className="h-9 w-9 cursor-pointer border-2 border-primary/20 transition-all hover:border-primary/50">
              <AvatarFallback className="bg-primary text-primary-foreground font-bold">
                {userInitials}
              </AvatarFallback>
            </Avatar>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div className="flex flex-col">
                <span className="font-bold truncate">{user?.name}</span>
                <span className="text-xs text-muted-foreground truncate">{user?.email}</span>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => setIsProfileOpen(true)}>
              <Settings className="mr-2 h-4 w-4" />
              Configurações da Conta
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-red-500 focus:text-red-500">
              <LogOut className="mr-2 h-4 w-4" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <ProfileDialog isOpen={isProfileOpen} setIsOpen={setIsProfileOpen} />
    </header>
  );
}
