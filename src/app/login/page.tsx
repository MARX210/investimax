
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useAuth } from '@/hooks/use-auth';
import Logo from '@/components/logo';
import { useRouter } from 'next/navigation';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import Image from 'next/image';

export default function LoginPage() {
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);
  const { login, register } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('login');
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const loginBg = PlaceHolderImages.find(img => img.id === 'login-bg');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    const success = await login(loginEmail, loginPassword);
    if (success) {
      router.push('/');
    } else {
      alert('Credenciais inválidas!');
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    const success = await register({ name: registerName, email: registerEmail, password: registerPassword });
    if (success) {
      setLoginEmail(registerEmail);
      setRegisterName('');
      setRegisterEmail('');
      setRegisterPassword('');
      setActiveTab('login');
    }
    setIsRegistering(false);
  };

  if (!isMounted) return null;

  const button3DClass = "relative border-b-4 border-primary-foreground/20 active:border-b-0 active:translate-y-1 transition-all duration-75 shadow-lg active:shadow-none";

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4 overflow-hidden">
      {/* Background Image with Overlay */}
      {loginBg && (
        <div className="absolute inset-0 z-0">
          <Image
            src={loginBg.imageUrl}
            alt={loginBg.description}
            fill
            className="object-cover scale-110 blur-[2px]"
            priority
            data-ai-hint={loginBg.imageHint}
          />
          <div className="absolute inset-0 bg-primary/40 backdrop-blur-[1px] mix-blend-multiply" />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent opacity-80" />
        </div>
      )}

      <div className="z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-8 duration-1000">
        <div className="flex justify-center mb-8 drop-shadow-xl">
          <Logo />
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 bg-background/50 backdrop-blur-md mb-4 border border-white/20">
            <TabsTrigger value="login" className="data-[state=active]:bg-primary data-[state=active]:text-white">Entrar</TabsTrigger>
            <TabsTrigger value="register" className="data-[state=active]:bg-primary data-[state=active]:text-white">Cadastrar</TabsTrigger>
          </TabsList>

          <TabsContent value="login" className="animate-in fade-in zoom-in-95 duration-300">
            <form onSubmit={handleLogin}>
              <Card className="bg-background/80 backdrop-blur-xl border-white/20 shadow-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Bem-vindo de volta</CardTitle>
                  <CardDescription className="text-foreground/70">
                    Acesse sua conta para gerenciar seu futuro.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input 
                      id="login-email" 
                      type="email" 
                      placeholder="seu@email.com" 
                      className="bg-white/50 border-white/30"
                      value={loginEmail} 
                      onChange={(e) => setLoginEmail(e.target.value)} 
                      required 
                      disabled={isLoggingIn} 
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="login-password">Senha</Label>
                    <Input 
                      id="login-password" 
                      type="password" 
                      className="bg-white/50 border-white/30"
                      value={loginPassword} 
                      onChange={(e) => setLoginPassword(e.target.value)} 
                      required 
                      disabled={isLoggingIn} 
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className={`w-full text-lg h-12 font-bold ${button3DClass}`} disabled={isLoggingIn}>
                    {isLoggingIn ? 'Autenticando...' : 'Acessar Carteira'}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>

          <TabsContent value="register" className="animate-in fade-in zoom-in-95 duration-300">
            <form onSubmit={handleRegister}>
              <Card className="bg-background/80 backdrop-blur-xl border-white/20 shadow-2xl overflow-hidden">
                <CardHeader>
                  <CardTitle className="text-2xl font-bold">Crie sua jornada</CardTitle>
                  <CardDescription className="text-foreground/70">
                    Comece hoje a investir de forma inteligente.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="register-name">Nome Completo</Label>
                    <Input 
                      id="register-name" 
                      placeholder="Seu Nome" 
                      className="bg-white/50 border-white/30"
                      value={registerName} 
                      onChange={(e) => setRegisterName(e.target.value)} 
                      required 
                      disabled={isRegistering}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-email">Email</Label>
                    <Input 
                      id="register-email" 
                      type="email" 
                      placeholder="seu@email.com" 
                      className="bg-white/50 border-white/30"
                      value={registerEmail} 
                      onChange={(e) => setRegisterEmail(e.target.value)} 
                      required 
                      disabled={isRegistering}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="register-password">Crie uma Senha</Label>
                    <Input 
                      id="register-password" 
                      type="password" 
                      className="bg-white/50 border-white/30"
                      value={registerPassword} 
                      onChange={(e) => setRegisterPassword(e.target.value)} 
                      required 
                      disabled={isRegistering}
                    />
                  </div>
                </CardContent>
                <CardFooter>
                  <Button type="submit" className={`w-full text-lg h-12 font-bold ${button3DClass}`} disabled={isRegistering}>
                    {isRegistering ? 'Preparando...' : 'Começar Agora'}
                  </Button>
                </CardFooter>
              </Card>
            </form>
          </TabsContent>
        </Tabs>

        <p className="text-center mt-8 text-white/60 text-sm">
          Sua segurança financeira é nossa prioridade.
        </p>
      </div>
    </div>
  );
}
