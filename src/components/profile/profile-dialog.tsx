'use client';

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/hooks/use-auth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Shield, User, Key, AlertTriangle } from 'lucide-react';

interface ProfileDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

export default function ProfileDialog({ isOpen, setIsOpen }: ProfileDialogProps) {
  const { user, updatePassword, deleteAccount } = useAuth();
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('As novas senhas não coincidem!');
      return;
    }

    setIsUpdating(true);
    const success = await updatePassword(currentPassword, newPassword);
    if (success) {
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    }
    setIsUpdating(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Minha Conta</DialogTitle>
          <DialogDescription>
            Gerencie suas informações e segurança da conta.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="info" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="info">
              <User className="w-4 h-4 mr-2" />
              Perfil
            </TabsTrigger>
            <TabsTrigger value="security">
              <Shield className="w-4 h-4 mr-2" />
              Segurança
            </TabsTrigger>
          </TabsList>

          <TabsContent value="info" className="space-y-4 py-4">
            <div className="space-y-2">
              <Label>Nome Completo</Label>
              <Input value={user?.name || ''} disabled className="bg-muted" />
            </div>
            <div className="space-y-2">
              <Label>Email</Label>
              <Input value={user?.email || ''} disabled className="bg-muted" />
            </div>
            <div className="pt-4 border-t border-destructive/10">
              <h4 className="text-sm font-bold text-destructive mb-2 flex items-center gap-2">
                <AlertTriangle className="w-4 h-4" />
                Zona de Perigo
              </h4>
              <p className="text-xs text-muted-foreground mb-4">
                Ao excluir sua conta, todos os seus dados de transações e investimentos serão apagados permanentemente.
              </p>
              
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="destructive" size="sm" className="w-full sm:w-auto">
                    Excluir minha conta
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Tem certeza absoluta?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta ação não pode ser desfeita. Isso excluirá permanentemente sua conta e todos os dados associados.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={deleteAccount} className="bg-red-600 hover:bg-red-700">
                      Sim, excluir tudo
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </TabsContent>

          <TabsContent value="security" className="space-y-4 py-4">
            <form onSubmit={handlePasswordChange} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="current">Senha Atual</Label>
                <Input
                  id="current"
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="new">Nova Senha</Label>
                <Input
                  id="new"
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="confirm">Confirmar Nova Senha</Label>
                <Input
                  id="confirm"
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  required
                />
              </div>
              <Button type="submit" className="w-full" disabled={isUpdating}>
                {isUpdating ? 'Atualizando...' : 'Alterar Senha'}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
