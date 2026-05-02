import type { Metadata } from "next";
import { Suspense } from "react";
import "./globals.css";
import { Header } from "@/components/Header";
import { StoreOverlays } from "@/components/StoreOverlays";
import { PixelBoot } from "@/components/PixelBoot";

export const metadata: Metadata = {
  title: "ليالي بيوتي | فخامة هادئة تليق بيومك",
  description: "متجر عربي فاخر للعناية اليومية داخل الإمارات مع الدفع عند الاستلام.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl">
      <body>
        <PixelBoot />
        <Header />
        {children}
        <Suspense fallback={null}>
          <StoreOverlays />
        </Suspense>
      </body>
    </html>
  );
}
