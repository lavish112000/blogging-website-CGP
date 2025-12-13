import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "Vibrant Insights - Premium Knowledge for Modern Professionals",
    template: "%s | Vibrant Insights",
  },
  description: "Discover expert insights on web development, design, technology, lifestyle, and business. Your go-to source for research-backed articles and tutorials.",
  keywords: [
    "web development",
    "software engineering",
    "UI/UX design",
    "technology trends",
    "lifestyle tips",
    "business strategies",
    "programming tutorials",
    "career advice",
    "productivity hacks",
    "Vibrant Insights"
  ],
  authors: [{ name: "Vibrant Insights Team", url: "https://vibrantinsights.com" }],
  creator: "Vibrant Insights",
  publisher: "Vibrant Insights",
  metadataBase: new URL("https://vibrantinsights.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vibrantinsights.com",
    title: "Vibrant Insights - Premium Knowledge for Modern Professionals",
    description: "Expert insights on web development, design, technology, lifestyle, and business. Stay ahead with our comprehensive guides and articles.",
    siteName: "Vibrant Insights",
    images: [
      {
        url: "/og-image.jpg", // Ensure this image exists or update path
        width: 1200,
        height: 630,
        alt: "Vibrant Insights - Premium Knowledge",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibrant Insights",
    description: "Premium knowledge for modern professionals. Web dev, design, tech, and more.",
    creator: "@vibrantinsights",
    images: ["/og-image.jpg"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense Meta Tag */}
        <meta name="google-adsense-account" content="ca-pub-4704600108238951" />
        {/* Google Analytics */}
        <Script
          async
          src="https://www.googletagmanager.com/gtag/js?id=G-BFS1TSH6FK"
          strategy="afterInteractive"
        />
        <Script
          id="google-analytics"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}
              gtag('js', new Date());
              gtag('config', 'G-BFS1TSH6FK');
            `,
          }}
        />
        {/* Google AdSense */}
        <Script
          async
          src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4704600108238951"
          crossOrigin="anonymous"
          strategy="afterInteractive"
        />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <div className="flex min-h-screen flex-col">
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </div>
        </ThemeProvider>
      </body>
    </html>
  );
}
