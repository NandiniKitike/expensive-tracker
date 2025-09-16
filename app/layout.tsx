// import type { Metadata } from 'next';
// import { Inter } from 'next/font/google';
// import './globals.css';

// const inter = Inter({ subsets: ['latin'] });

// export const metadata: Metadata = {
//   title: 'Tea Expense Tracker',
//   description: 'Track and split tea expenses fairly among friends',
// };

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }): JSX.Element {
//   return (
//     <html lang="en">
//       <body className={inter.className}>{children}</body>
//     </html>
//   );
// }
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Tea Expense Tracker',
  description: 'Track and split tea expenses fairly among friends. Scan QR codes, auto-calculate splits, and manage group balances effortlessly.',
  keywords: 'tea, expense, tracker, split, QR, scanner, group, friends, money, balance',
  authors: [{ name: 'Tea Tracker Team' }],
  creator: 'Tea Expense Tracker',
  publisher: 'Tea Expense Tracker',
  
  // ✅ iOS App Configuration
  applicationName: 'Tea Tracker',
  
  // ✅ Icons for all platforms
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '16x16 32x32', type: 'image/x-icon' },
      { url: '/icon-192.png', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512.png', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    shortcut: '/favicon.ico',
  },
  
  // ✅ PWA Manifest
  manifest: '/manifest.json',
  
  // ✅ iOS Web App Configuration
  other: {
    'apple-mobile-web-app-capable': 'yes',
    'apple-mobile-web-app-status-bar-style': 'default',
    'apple-mobile-web-app-title': 'Tea Tracker',
    'mobile-web-app-capable': 'yes',
    
  },
  
  // ✅ Open Graph for Social Sharing
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yourapp.vercel.app',
    title: 'Tea Expense Tracker - Fair Group Expense Splitting',
    description: 'Track and split tea expenses fairly among friends. Scan QR codes, auto-calculate splits, and manage group balances effortlessly.',
    siteName: 'Tea Expense Tracker',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Tea Expense Tracker - Fair Group Expense Splitting',
      },
    ],
  },
  
  
  twitter: {
    card: 'summary_large_image',
    title: 'Tea Expense Tracker',
    description: 'Track and split tea expenses fairly among friends',
    creator: '@teatracker',
    images: ['/og-image.png'],
  },
  
  
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#1f2937' },
  ],
  
  
  viewport: {
    width: 'device-width',
    initialScale: 1,
    maximumScale: 1,
    userScalable: false,
    viewportFit: 'cover',
  },
  
  // ✅ robots and indexing
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
}): JSX.Element {
  return (
    <html lang="en">
      <head>
        {/* ✅ Essential Meta Tags */}
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover, user-scalable=no" />
        
        {/* ✅ iOS Specific Meta Tags */}
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Tea Tracker" />
        <meta name="apple-touch-fullscreen" content="yes" />
        
        {/* ✅ Android/Chrome Meta Tags */}
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#3b82f6" />
        <meta name="msapplication-TileColor" content="#3b82f6" />
        
        {/* ✅ Disable Phone Number Detection */}
        <meta name="format-detection" content="telephone=no" />
        <meta name="format-detection" content="date=no" />
        <meta name="format-detection" content="address=no" />
        <meta name="format-detection" content="email=no" />
        
        {/* ✅ Security Headers */}
        <meta httpEquiv="X-UA-Compatible" content="IE=edge" />
        <meta name="referrer" content="origin-when-cross-origin" />
        
        {/* ✅ iOS App Icons */}
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <link rel="apple-touch-icon" sizes="57x57" href="/apple-touch-icon-57x57.png" />
        <link rel="apple-touch-icon" sizes="72x72" href="/apple-touch-icon-72x72.png" />
        <link rel="apple-touch-icon" sizes="76x76" href="/apple-touch-icon-76x76.png" />
        <link rel="apple-touch-icon" sizes="114x114" href="/apple-touch-icon-114x114.png" />
        <link rel="apple-touch-icon" sizes="120x120" href="/apple-touch-icon-120x120.png" />
        <link rel="apple-touch-icon" sizes="144x144" href="/apple-touch-icon-144x144.png" />
        <link rel="apple-touch-icon" sizes="152x152" href="/apple-touch-icon-152x152.png" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        
        {/* ✅ iOS Splash Screens */}
        <link 
          rel="apple-touch-startup-image" 
          href="/apple-splash-2048-2732.png" 
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" 
        />
        <link 
          rel="apple-touch-startup-image" 
          href="/apple-splash-2732-2048.png" 
          media="(device-width: 1024px) and (device-height: 1366px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" 
        />
        <link 
          rel="apple-touch-startup-image" 
          href="/apple-splash-1668-2388.png" 
          media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" 
        />
        <link 
          rel="apple-touch-startup-image" 
          href="/apple-splash-2388-1668.png" 
          media="(device-width: 834px) and (device-height: 1194px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" 
        />
        <link 
          rel="apple-touch-startup-image" 
          href="/apple-splash-1536-2048.png" 
          media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" 
        />
        <link 
          rel="apple-touch-startup-image" 
          href="/apple-splash-2048-1536.png" 
          media="(device-width: 768px) and (device-height: 1024px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" 
        />
        <link 
          rel="apple-touch-startup-image" 
          href="/apple-splash-1125-2436.png" 
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" 
        />
        <link 
          rel="apple-touch-startup-image" 
          href="/apple-splash-2436-1125.png" 
          media="(device-width: 375px) and (device-height: 812px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" 
        />
        <link 
          rel="apple-touch-startup-image" 
          href="/apple-splash-1242-2208.png" 
          media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: portrait)" 
        />
        <link 
          rel="apple-touch-startup-image" 
          href="/apple-splash-2208-1242.png" 
          media="(device-width: 414px) and (device-height: 736px) and (-webkit-device-pixel-ratio: 3) and (orientation: landscape)" 
        />
        <link 
          rel="apple-touch-startup-image" 
          href="/apple-splash-750-1334.png" 
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" 
        />
        <link 
          rel="apple-touch-startup-image" 
          href="/apple-splash-1334-750.png" 
          media="(device-width: 375px) and (device-height: 667px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" 
        />
        <link 
          rel="apple-touch-startup-image" 
          href="/apple-splash-640-1136.png" 
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: portrait)" 
        />
        <link 
          rel="apple-touch-startup-image" 
          href="/apple-splash-1136-640.png" 
          media="(device-width: 320px) and (device-height: 568px) and (-webkit-device-pixel-ratio: 2) and (orientation: landscape)" 
        />
        
        {/* ✅ Standard Icons */}
        <link rel="icon" type="image/x-icon" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
        <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/icon-192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/icon-512.png" />
        
        {/* ✅ PWA Manifest */}
        <link rel="manifest" href="/manifest.json" />
        
        {/* ✅ Preconnect to External Domains */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        
        {/* ✅ DNS Prefetch for Performance */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="dns-prefetch" href="//fonts.gstatic.com" />
        
        {/* ✅ Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Tea Expense Tracker",
              "description": "Track and split tea expenses fairly among friends",
              "url": "https://yourapp.vercel.app",
              "applicationCategory": "FinanceApplication",
              "operatingSystem": "Any",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "author": {
                "@type": "Organization",
                "name": "Tea Tracker Team"
              }
            })
          }}
        />
      </head>
      <body className={`${inter.className} antialiased`}>
        {/* ✅ Accessibility Skip Link */}
        <a 
          href="#main-content" 
          className="sr-only focus:not-sr-only focus:absolute focus:top-0 focus:left-0 bg-blue-600 text-white p-2 z-50"
        >
          Skip to main content
        </a>
        
        {/* ✅ Main Content with ID for Skip Link */}
        <main id="main-content">
          {children}
        </main>
        
        {/* ✅ Service Worker Registration */}
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </body>
    </html>
  );
}
