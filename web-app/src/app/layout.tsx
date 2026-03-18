import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Image Background Remover - Remove Backgrounds from Images',
  description: 'AI-powered background removal tool. Remove backgrounds from your images with advanced algorithms. Supports PNG, JPG, WebP formats.',
  keywords: [
    'background removal',
    'image editing',
    'AI',
    'machine learning',
    'photo editing',
    'remove background',
    'transparent background',
    'PNG',
    'JPG',
    'WebP'
  ],
  authors: [{ name: 'Lummyyl' }],
  creator: 'Lummyyl',
  publisher: 'Lummyyl',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://image-background-remover.vercel.app'),
  openGraph: {
    title: 'Image Background Remover',
    description: 'Remove backgrounds from images with AI-powered technology',
    url: 'https://image-background-remover.vercel.app',
    siteName: 'Image Background Remover',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Image Background Remover',
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Image Background Remover',
    description: 'Remove backgrounds from images with AI-powered technology',
    images: ['/og-image.png'],
    creator: '@Lummyyl',
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
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          {children}
        </div>
      </body>
    </html>
  );
}