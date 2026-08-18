import type { Metadata } from "next";
import "./admin-panel.css";

export const metadata: Metadata = {
  title: "لوحة التحكم | سفراسكين",
  robots: { index: false, follow: false },
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
