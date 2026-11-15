import type { Metadata } from 'next';
import { Inter, Syne, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import { ThemeProvider } from '@/components/ThemeProvider';
import { ClientLayout } from '@/components/layout/ClientLayout';
import { PageTransition } from '@/components/layout/PageTransition';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const syne = Syne({
  subsets: ['latin'],
  variable: '--font-syne',
  display: 'swap',
});

const mono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'FitXxx — Premium Unisex Streetwear & 3D Custom Clothing Studio',
  description: 'Design. Wear. Own it. Premium Korean-inspired oversized hoodies, lowers, and streetwear uniforms with real-time 3D garment customization.',
  keywords: ['streetwear', 'custom hoodie', 'korean fashion', 'oversized hoodie', 'baggy lower', '3d clothing customizer', 'fitxxx'],
  openGraph: {
    title: 'FitXxx — Premium Streetwear & Custom Clothing Studio',
    description: 'Design. Wear. Own it. 450 GSM French Terry essentials and interactive 3D studio.',
    url: 'https://fitxxx.com',
    siteName: 'FitXxx',
    images: [
      {
        url: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1200&q=85',
        width: 1200,
        height: 630,
        alt: 'FitXxx Streetwear',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning className={`${inter.variable} ${syne.variable} ${mono.variable}`}>
      <body className="antialiased selection:bg-brand-crimson selection:text-white">
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false}>
          <ClientLayout>
            <PageTransition>{children}</PageTransition>
          </ClientLayout>
        </ThemeProvider>
      </body>
    </html>
  );
}
