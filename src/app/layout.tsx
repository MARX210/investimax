import type { Metadata } from 'next';
import './globals.css';
import { cn } from '@/lib/utils';
import { Toaster } from '@/components/ui/toaster';
import { TransactionsProvider } from '@/hooks/use-transactions';
import { InvestmentsProvider } from '@/hooks/use-investments';
import { AuthProvider } from '@/hooks/use-auth';
import AppContent from '@/components/layout/app-content';

export const metadata: Metadata = {
  title: 'Investimax',
  description: 'Seu gerente de investimentos pessoal, simples e inteligente.',
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
        <AuthProvider>
            <TransactionsProvider>
            <InvestmentsProvider>
                <AppContent>
                    {children}
                </AppContent>
                <Toaster />
            </InvestmentsProvider>
            </TransactionsProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
