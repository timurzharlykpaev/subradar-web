import type { Metadata } from 'next';
import './globals.css';
import { QueryProvider } from '@/providers/QueryProvider';
import { ThemeProvider } from '@/providers/ThemeProvider';
import { I18nProvider } from '@/providers/I18nProvider';
import { ToastProvider } from '@/providers/ToastProvider';

export const metadata: Metadata = {
  title: 'SubRadar AI — Know exactly where your money goes',
  description: 'AI-powered subscription tracker with smart reminders, receipt scanning, and tax reports.',
  openGraph: {
    title: 'SubRadar AI',
    description: 'Track all your subscriptions with AI',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark" suppressHydrationWarning>
      <body>
        <QueryProvider>
          <I18nProvider>
            <ThemeProvider>
              <ToastProvider>
                {children}
              </ToastProvider>
            </ThemeProvider>
          </I18nProvider>
        </QueryProvider>
      </body>
    </html>
  );
}
