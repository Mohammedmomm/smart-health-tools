import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/components/ThemeProvider';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: {
    default: 'Smart Health Tools - Age & BMI Calculator',
    template: '%s | Smart Health Tools',
  },
  description:
    'Calculate your exact age, birthday countdown, and body mass index instantly with Smart Health Tools. Fast, beautiful, accurate, and mobile friendly.',
  keywords: [
    'age calculator',
    'BMI calculator',
    'health tools',
    'body mass index',
    'birthday countdown',
    'حاسبة العمر',
    'مؤشر كتلة الجسم',
  ],
  authors: [{ name: 'Smart Health Tools' }],
  creator: 'Smart Health Tools',
  publisher: 'Smart Health Tools',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://smart-health-tools.vercel.app'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Smart Health Tools - Age & BMI Calculator',
    description:
      'Calculate your exact age, birthday countdown, and body mass index instantly. Fast, beautiful, accurate, and mobile friendly.',
    url: 'https://smart-health-tools.vercel.app',
    siteName: 'Smart Health Tools',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Smart Health Tools',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Smart Health Tools - Age & BMI Calculator',
    description:
      'Calculate your exact age, birthday countdown, and body mass index instantly with Smart Health Tools.',
    images: ['/og-image.png'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800;900&family=Cairo:wght@300;400;500;600;700;800;900&display=swap"
          rel="stylesheet"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              '@context': 'https://schema.org',
              '@type': 'WebApplication',
              name: 'Smart Health Tools',
              description:
                'Calculate your exact age, birthday countdown, and body mass index instantly.',
              url: 'https://smart-health-tools.vercel.app',
              applicationCategory: 'HealthApplication',
              offers: {
                '@type': 'Offer',
                price: '0',
                priceCurrency: 'USD',
              },
              featureList: ['Age Calculator', 'BMI Calculator', 'Birthday Countdown'],
            }),
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem>
          {children}
          <Toaster
            position="top-right"
            toastOptions={{
              duration: 4000,
              style: {
                background: '#1f2937',
                color: '#f9fafb',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
              },
            }}
          />
        </ThemeProvider>
      </body>
    </html>
  );
}
