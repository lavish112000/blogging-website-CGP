import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import { headers } from "next/headers";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { AuthProvider } from "@/components/auth/AuthProvider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieConsent } from "@/components/layout/CookieConsent";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  verification: {
    google: "xFq0YlVAHvByrrreIXbZo37PxtrJ5_j9Ypw3l9rzQsc",
  },
  title: {
    default: "Tech-Knowlogia - Premium Knowledge for Modern Professionals",
    template: "%s | Tech-Knowlogia",
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
    "Tech-Knowlogia"
  ],
  authors: [{ name: "Tech-Knowlogia Team", url: "https://tech-knowlogia.com" }],
  creator: "Tech-Knowlogia",
  publisher: "Tech-Knowlogia",
  metadataBase: new URL("https://tech-knowlogia.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://tech-knowlogia.com",
    title: "Tech-Knowlogia - Premium Knowledge for Modern Professionals",
    description: "Expert insights on web development, design, technology, lifestyle, and business. Stay ahead with our comprehensive guides and articles.",
    siteName: "Tech-Knowlogia",
    images: [
      {
        url: "/og-image.jpg", // Ensure this image exists or update path
        width: 1200,
        height: 630,
        alt: "Tech-Knowlogia - Premium Knowledge",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Tech-Knowlogia",
    description: "Premium knowledge for modern professionals. Web dev, design, tech, and more.",
    creator: "@techknowlogia",
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

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const requestHeaders = await headers();
  const pathname = requestHeaders.get("x-pathname") ?? "";
  const gaMeasurementId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
  const isAdminRoute =
    pathname === "/admin" ||
    pathname.startsWith("/admin/") ||
    pathname === "/admin-dashboard" ||
    pathname.startsWith("/admin-dashboard/");

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        {/* Google AdSense Meta Tag */}
        <meta name="google-adsense-account" content="ca-pub-4704600108238951" />
      </head>
      <body className={`${inter.variable} font-sans antialiased`}>
        {/* Google Consent Mode (default: denied unless user accepts) */}
        <Script
          id="google-consent-default"
          strategy="beforeInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              window.dataLayer = window.dataLayer || [];
              function gtag(){dataLayer.push(arguments);}

              (function() {
                function readCookie(name) {
                  try {
                    var parts = document.cookie.split(';');
                    for (var i = 0; i < parts.length; i++) {
                      var kv = parts[i].trim().split('=');
                      var key = decodeURIComponent(kv[0] || '');
                      if (key === name) {
                        return decodeURIComponent(kv.slice(1).join('='));
                      }
                    }
                  } catch (e) {}
                  return null;
                }

                var stored = null;
                try { stored = window.localStorage.getItem('tk_cookie_consent'); } catch (e) {}
                if (stored !== 'granted' && stored !== 'denied') {
                  stored = readCookie('tk_cookie_consent');
                }

                var granted = stored === 'granted';
                gtag('consent', 'default', {
                  ad_storage: granted ? 'granted' : 'denied',
                  analytics_storage: granted ? 'granted' : 'denied',
                  ad_user_data: granted ? 'granted' : 'denied',
                  ad_personalization: granted ? 'granted' : 'denied'
                });
              })();
            `,
          }}
        />
        {/* Google Analytics */}
        {gaMeasurementId ? (
          <>
            <Script
              async
              src={`https://www.googletagmanager.com/gtag/js?id=${gaMeasurementId}`}
              strategy="afterInteractive"
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  gtag('js', new Date());
                  gtag('config', '${gaMeasurementId}');
                `,
              }}
            />
          </>
        ) : null}
        {/* Google AdSense (avoid loading on admin routes) */}
        {!isAdminRoute && (
          <Script
            async
            src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-4704600108238951"
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}

        {/* Netlify Identity (needed for password recovery links) */}
        <Script
          src="https://identity.netlify.com/v1/netlify-identity-widget.js"
          strategy="afterInteractive"
        />
        <AuthProvider>
          <ThemeProvider
            attribute="class"
            defaultTheme="dark"
            enableSystem={false}
            disableTransitionOnChange
          >
            <div className="flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">{children}</main>
              <Footer />
            </div>
            <CookieConsent />
            <Analytics />
            <SpeedInsights />
          </ThemeProvider>
        </AuthProvider>
      </body>
    </html>
  );
}
