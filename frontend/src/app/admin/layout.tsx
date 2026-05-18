import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Admin | Layali Beauty",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <div className="admin-root min-h-screen">{children}</div>;
}
