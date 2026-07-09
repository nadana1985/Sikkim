import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { GoogleAnalytics } from "@next/third-parties/google";
import "./globals.css";
import "../../sentry.client.config";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import ThemeProvider from "@/components/ThemeProvider";
import WebVitalsReporter from "@/components/WebVitalsReporter";
import PageViewTracker from "@/components/PageViewTracker";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const baseUrl = process.env.NEXT_PUBLIC_APP_URL || "https://monastery360.com";

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: {
    default: "Monastery360 - Explore Sikkim's Sacred Monasteries",
    template: "%s | Monastery360",
  },
  description: "Discover the rich cultural heritage of Sikkim's monasteries through immersive 360° virtual tours and explore the spiritual essence of the Himalayas.",
  keywords: ["Sikkim", "monasteries", "virtual tours", "Buddhism", "Himalayan heritage", "360° tours", "cultural tourism"],
  authors: [{ name: "Monastery360" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "Monastery360",
    title: "Monastery360 - Explore Sikkim's Sacred Monasteries",
    description: "Discover the rich cultural heritage of Sikkim's monasteries through immersive 360° virtual tours and explore the spiritual essence of the Himalayas.",
  },
  twitter: {
    card: "summary_large_image",
    title: "Monastery360 - Explore Sikkim's Sacred Monasteries",
    description: "Discover the rich cultural heritage of Sikkim's monasteries through immersive 360° virtual tours.",
  },
  robots: {
    index: true,
    follow: true,
  },
  manifest: "/manifest.json",
  icons: {
    icon: "/favicon.ico",
    apple: "/icons/apple-touch-icon.png",
  },
};

export const viewport: Viewport = {
  themeColor: "#ea580c",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('monastery360-theme');
                  var dark = theme === 'dark' || (theme !== 'light' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                  if (dark) document.documentElement.classList.add('dark');
                  else document.documentElement.classList.remove('dark');
                } catch(e) {}
              })();
            `,
          }}
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased bg-background text-foreground`}>
        <ThemeProvider>
          {process.env.NEXT_PUBLIC_GA_ID && (
            <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
          )}
          <WebVitalsReporter />
          <PageViewTracker />
          <div className="min-h-screen flex flex-col">
            <a
              href="#main-content"
              className="sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-[100] focus:bg-orange-600 focus:text-white focus:px-4 focus:py-2 focus:rounded-lg focus:font-medium focus:shadow-lg"
            >
              Skip to main content
            </a>
            <Navbar />
            <main id="main-content" className="flex-grow">
              {children}
            </main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
