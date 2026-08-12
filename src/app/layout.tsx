import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import './globals.css';
import QueryProvider from '@/components/providers/QueryProvider';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export const viewport: Viewport = {
  themeColor: '#0A0E1A',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  title: 'RailGaadi — Live Indian Train Tracker',
  description:
    'Track any Indian train in real-time with live location, interactive maps, journey analytics, station weather, and nearby landmarks. Powered by RailRadar.',
  keywords: [
    'RailGaadi', 'Indian Railways', 'Live Train Tracking',
    'Train Running Status', 'IRCTC', 'Train Map', 'Journey Analytics',
    'RailRadar', 'PNR Status', 'Live Train Location',
  ],
  authors: [{ name: 'RailGaadi' }],
  manifest: '/manifest.json',
  openGraph: {
    type: 'website',
    title: 'RailGaadi — Live Indian Train Tracker',
    description: 'Real-time Indian train tracking with interactive maps and journey analytics.',
    siteName: 'RailGaadi',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'RailGaadi — Live Indian Train Tracker',
    description: 'Real-time Indian train tracking with interactive maps and journey analytics.',
  },
  robots: {
    index: true,
    follow: true,
  },
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'RailGaadi',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} dark h-full`}
    >
      <head>
        {/* MapLibre GL CSS — loaded from CDN to avoid module resolution issues */}
        <link
          rel="stylesheet"
          href="https://unpkg.com/maplibre-gl@3.6.2/dist/maplibre-gl.css"
        />
        {/* Apple Touch Icon */}
        <link rel="apple-touch-icon" href="/favicon.ico" />
      </head>
      <body
        className="min-h-full flex flex-col"
        style={{
          background: '#0A0E1A',
          color: '#F8FAFC',
          fontFamily: 'var(--font-inter), system-ui, -apple-system, sans-serif',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        }}
      >
        <QueryProvider>{children}</QueryProvider>
      </body>
    </html>
  );
}
