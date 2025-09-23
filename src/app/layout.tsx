import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/app-sidebar';
import Header from '@/components/layout/header';
import { TransactionsProvider } from '@/hooks/use-transactions';

export const metadata: Metadata = {
  title: 'BolsoZen',
  description: 'Seu gerente financeiro pessoal, simples e inteligente.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
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
          'min-h-screen bg-background font-body antialiased'
        )}
      >
        <TransactionsProvider>
          <SidebarProvider>
            <AppSidebar />
            <SidebarInset className="flex flex-col">
              <Header />
              <main className="flex-1 p-4 sm:p-6 lg:p-8">{children}</main>
            </SidebarInset>
          </SidebarProvider>
          <Toaster />
        </TransactionsProvider>
      </body>
    </html>
  );
}
