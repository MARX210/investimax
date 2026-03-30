
'use client';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { TransactionsProvider } from '@/hooks/use-transactions';
import { InvestmentsProvider } from '@/hooks/use-investments';
import { AuthProvider, useAuth } from '@/hooks/use-auth';
import { SidebarProvider, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect } from 'react';
import type { User } from '@/lib/types';
import { ThemeProvider } from '@/components/theme-provider';

async function checkSession(): Promise<User | null> {
    try {
        const response = await fetch('/api/auth/session');
        if (response.ok) {
            return await response.json();
        }
        return null;
    } catch {
        return null;
    }
}

function AppLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user, setUser, isLoading, setIsLoading } = useAuth();
  const pathname = usePathname();
  const router = useRouter();

  const isAuthPage = pathname === '/login';

  useEffect(() => {
    checkSession().then(sessionUser => {
        setUser(sessionUser);
        setIsLoading(false);
    });
  }, [setUser, setIsLoading]);

  useEffect(() => {
    if (!isLoading && !user && !isAuthPage) {
      router.push('/login');
    }
  }, [isLoading, user, isAuthPage, router]);

  if (isAuthPage) {
    return <>{children}</>;
  }

  if (isLoading || (!user && !isAuthPage)) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <p>Carregando...</p>
        </div>
    );
  }

  return (
    <SidebarProvider>
      <TransactionsProvider>
        <InvestmentsProvider>
            <AppSidebar />
            <SidebarInset>
            <Header />
            <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
            </SidebarInset>
            <Toaster />
        </InvestmentsProvider>
      </TransactionsProvider>
    </SidebarProvider>
  );
}


export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=PT+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body
        className={cn(
          'min-h-screen bg-background font-body antialiased transition-colors duration-300'
        )}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <AuthProvider>
              <AppLayout>{children}</AppLayout>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
