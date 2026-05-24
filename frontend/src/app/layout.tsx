import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Inter, Dancing_Script } from "next/font/google";
import { AdClickBeacon } from "@/components/AdClickBeacon";
import { AdPixelsClient } from "@/components/AdPixelsClient";
import { CartProvider } from "@/components/CartProvider";
import { Footer, SiteHeader } from "@/components/SiteChrome";
import "./globals.css";

const arabic = IBM_Plex_Sans_Arabic({
  variable: "--font-arabic",
  subsets: ["arabic"],
  weight: ["400", "500", "600", "700"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const dancingScript = Dancing_Script({
  variable: "--font-script",
  subsets: ["latin"],
  weight: ["700"],
});

export const metadata: Metadata = {
  title: "ليالي بيوتي | عود قصر دبي لجفاف البشرة في الإمارات",
  description:
    "عود قصر دبي روتين عناية للبشرة الجافة من المكيف والحر في الإمارات، مع عروض عبوة وعبوتين وثلاث عبوات والدفع عند الاستلام.",
  metadataBase: new URL("https://layalibeauty.shop"),
  icons: {
    icon: [{ url: "/icon.svg", type: "image/svg+xml" }],
    apple: [{ url: "/apple-icon", sizes: "180x180" }],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={`${arabic.variable} ${inter.variable} ${dancingScript.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AdClickBeacon />
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
