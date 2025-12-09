import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Vibrant Insights - Premium Knowledge for Modern Professionals",
  description: "Explore expert insights on web development, design, technology, lifestyle, and business. Research-backed articles for ambitious learners and professionals.",
  keywords: ["web development", "design", "technology", "lifestyle", "business", "programming", "UI/UX", "AI", "productivity"],
  authors: [{ name: "Vibrant Insights Team" }],
  creator: "Vibrant Insights",
  publisher: "Vibrant Insights",
  metadataBase: new URL("https://vibrantinsights.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://vibrantinsights.com",
    title: "Vibrant Insights - Premium Knowledge for Modern Professionals",
    description: "Expert insights on web development, design, technology, lifestyle, and business.",
    siteName: "Vibrant Insights",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vibrant Insights",
    description: "Premium knowledge for modern professionals",
    creator: "@vibrantinsights",
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
