import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/Providers'; 
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });

export const metadata: Metadata = {
  title: 'Prooflight',
  description: 'Own Your Credentials. Verify Your Identity. On the Blockchain.',
  openGraph: {
    title: 'Prooflight',
    description: 'Own Your Credentials. Verify Your Identity. On the Blockchain.',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={inter.variable}>
      <head>
        {/* Removed Google Fonts link for Inter as next/font is used */}
      </head>
      <body className="font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
