import type { Metadata } from "next";
import { IBM_Plex_Sans_Arabic, Inter } from "next/font/google";
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

export const metadata: Metadata = {
  title: "ليالي بيوتي | عود قصر دبي لجفاف البشرة في الإمارات",
  description:
    "عود قصر دبي روتين عناية للبشرة الجافة من المكيف والحر في الإمارات، مع عروض وحدة وجوج وثلاثة والدفع عند الاستلام.",
  metadataBase: new URL("https://layalibeauty.shop"),
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
      className={`${arabic.variable} ${inter.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <CartProvider>
          <SiteHeader />
          <main className="flex-1">{children}</main>
          <Footer />
        </CartProvider>
      </body>
    </html>
  );
}
