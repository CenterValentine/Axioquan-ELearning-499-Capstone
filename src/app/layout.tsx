
// /src/app/layout.tsx

import { Toaster } from '@/components/ui/sonner';
import './globals.css';
import type { Metadata } from 'next';
import { SessionRefresher } from '@/components/auth/session-refresher';

const baseUrl = 'https://axioquan-two.vercel.app';

export const metadata: Metadata = {
  title: {
    default: "AxioQuan - Learn, Grow, Succeed",
    template: "%s | AxioQuan"
  },
  description: "AxioQuan is a comprehensive learning platform offering expert-led courses, interactive curriculum, and career advancement opportunities. Join thousands of students learning today.",
  keywords: ["online courses", "learning platform", "education", "skills development", "career growth", "e-learning"],
  authors: [{ name: "AxioQuan Team" }],
  creator: "AxioQuan",
  publisher: "AxioQuan",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  
  // Icons configuration
  icons: {
    icon: [
      { url: `${baseUrl}/favicon.ico` },
      { url: `${baseUrl}/favicon-16x16.png`, sizes: "16x16", type: "image/png" },
      { url: `${baseUrl}/favicon-32x32.png`, sizes: "32x32", type: "image/png" },
    ],
    apple: [
      { url: `${baseUrl}/apple-touch-icon.png`, sizes: "180x180", type: "image/png" },
    ],
    other: [
      {
        rel: "android-chrome-192x192",
        url: `${baseUrl}/android-chrome-192x192.png`,
        sizes: "192x192",
        type: "image/png",
      },
      {
        rel: "android-chrome-512x512",
        url: `${baseUrl}/android-chrome-512x512.png`,
        sizes: "512x512",
        type: "image/png",
      },
    ],
  },

  // OpenGraph configuration
  openGraph: {
    type: "website",
    siteName: "AxioQuan",
    title: "AxioQuan - Learn, Grow, Succeed",
    description: "AxioQuan is a comprehensive learning platform offering expert-led courses, interactive curriculum, and career advancement opportunities.",
    url: baseUrl,
    images: [
      {
        url: `${baseUrl}/images/AxioQuan.jpg`,
        width: 1200,
        height: 630,
        alt: "AxioQuan - Comprehensive Learning Platform",
      },
    ],
    locale: "en_US",
  },

  // Twitter configuration
  twitter: {
    card: "summary_large_image",
    title: "AxioQuan - Learn, Grow, Succeed",
    description: "AxioQuan is a comprehensive learning platform offering expert-led courses, interactive curriculum, and career advancement opportunities.",
    creator: "@axioquan",
    images: [`${baseUrl}/images/AxioQuan.jpg`],
  },

  // Additional metadata
  metadataBase: new URL(baseUrl),
  alternates: {
    canonical: "/",
  },
  
  // App-like behavior for mobile
  manifest: `${baseUrl}/site.webmanifest`,
  themeColor: "#4f46e5",
  appleWebApp: {
    capable: true,
    statusBarStyle: "default",
    title: "AxioQuan",
  },
  viewport: {
    width: "device-width",
    initialScale: 1,
    maximumScale: 1,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        {/* Additional meta tags for PWA support */}
        <meta name="application-name" content="AxioQuan" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="AxioQuan" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="msapplication-TileColor" content="#4f46e5" />
        <meta name="msapplication-tap-highlight" content="no" />
        <meta name="theme-color" content="#4f46e5" />
        
        {/* Explicit OpenGraph tags for better compatibility */}
        <meta property="og:title" content="AxioQuan - Learn, Grow, Succeed" />
        <meta property="og:description" content="AxioQuan is a comprehensive learning platform offering expert-led courses, interactive curriculum, and career advancement opportunities." />
        <meta property="og:image" content={`${baseUrl}/images/AxioQuan.jpg`} />
        <meta property="og:url" content={baseUrl} />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="AxioQuan" />
        
        {/* Explicit Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content="AxioQuan - Learn, Grow, Succeed" />
        <meta name="twitter:description" content="AxioQuan is a comprehensive learning platform offering expert-led courses, interactive curriculum, and career advancement opportunities." />
        <meta name="twitter:image" content={`${baseUrl}/images/AxioQuan.jpg`} />
        <meta name="twitter:site" content="@axioquan" />
        
        {/* Additional link tags for icons */}
        <link rel="shortcut icon" href={`${baseUrl}/favicon.ico`} />
        <link rel="apple-touch-icon" sizes="180x180" href={`${baseUrl}/apple-touch-icon.png`} />
        <link rel="icon" type="image/png" sizes="32x32" href={`${baseUrl}/favicon-32x32.png`} />
        <link rel="icon" type="image/png" sizes="16x16" href={`${baseUrl}/favicon-16x16.png`} />
        <link rel="manifest" href={`${baseUrl}/site.webmanifest`} />
      </head>
      <body className="min-h-screen flex flex-col bg-background" suppressHydrationWarning={true}>
        {children}
        <SessionRefresher />
        <Toaster position="top-right" />
      </body>
    </html>
  );
}





















// import { Toaster } from '@/components/ui/sonner';
// import './globals.css';
// import type { Metadata } from 'next';
// import { SessionRefresher } from '@/components/auth/session-refresher';
// import DynamicFooterWrapper from '@/components/layout/dynamic-footer-wrapper';

// const baseUrl = 'https://axioquan-two.vercel.app';

// export const metadata: Metadata = {
//   title: {
//     default: "AxioQuan - Learn, Grow, Succeed",
//     template: "%s | AxioQuan"
//   },
//   description: "AxioQuan is a comprehensive learning platform offering expert-led courses, interactive curriculum, and career advancement opportunities. Join thousands of students learning today.",
//   keywords: ["online courses", "learning platform", "education", "skills development", "career growth", "e-learning"],
//   authors: [{ name: "AxioQuan Team" }],
//   creator: "AxioQuan",
//   publisher: "AxioQuan",
//   formatDetection: {
//     email: false,
//     address: false,
//     telephone: false,
//   },

//   icons: {
//     icon: [
//       { url: `${baseUrl}/favicon.ico` },
//       { url: `${baseUrl}/favicon-16x16.png`, sizes: "16x16", type: "image/png" },
//       { url: `${baseUrl}/favicon-32x32.png`, sizes: "32x32", type: "image/png" },
//     ],
//     apple: [
//       { url: `${baseUrl}/apple-touch-icon.png`, sizes: "180x180", type: "image/png" },
//     ],
//     other: [
//       {
//         rel: "android-chrome-192x192",
//         url: `${baseUrl}/android-chrome-192x192.png`,
//         sizes: "192x192",
//         type: "image/png",
//       },
//       {
//         rel: "android-chrome-512x512",
//         url: `${baseUrl}/android-chrome-512x512.png`,
//         sizes: "512x512",
//         type: "image/png",
//       },
//     ],
//   },

//   openGraph: {
//     type: "website",
//     siteName: "AxioQuan",
//     title: "AxioQuan - Learn, Grow, Succeed",
//     description: "AxioQuan is a comprehensive learning platform offering expert-led courses, interactive curriculum, and career advancement opportunities.",
//     url: baseUrl,
//     images: [
//       {
//         url: `${baseUrl}/images/AxioQuan.jpg`,
//         width: 1200,
//         height: 630,
//         alt: "AxioQuan - Comprehensive Learning Platform",
//       },
//     ],
//     locale: "en_US",
//   },

//   twitter: {
//     card: "summary_large_image",
//     title: "AxioQuan - Learn, Grow, Succeed",
//     description: "AxioQuan is a comprehensive learning platform offering expert-led courses, interactive curriculum, and career advancement opportunities.",
//     creator: "@axioquan",
//     images: [`${baseUrl}/images/AxioQuan.jpg`],
//   },

//   metadataBase: new URL(baseUrl),
//   alternates: {
//     canonical: "/",
//   },

//   manifest: `${baseUrl}/site.webmanifest`,
//   themeColor: "#4f46e5",
//   appleWebApp: {
//     capable: true,
//     statusBarStyle: "default",
//     title: "AxioQuan",
//   },
//   viewport: {
//     width: "device-width",
//     initialScale: 1,
//     maximumScale: 1,
//   },
// };

// export default function RootLayout({ children }: { children: React.ReactNode }) {
//   return (
//     <html lang="en">
//       <head />
//       <body className="min-h-screen flex flex-col bg-background" suppressHydrationWarning={true}>
        
//         {/* Wrap children + footer inside a client component */}
//         <DynamicFooterWrapper>
//           {children}
//         </DynamicFooterWrapper>

//         <SessionRefresher />
//         <Toaster position="top-right" />
//       </body>
//     </html>
//   );
// }
