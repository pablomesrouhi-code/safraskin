export const metadata = {
  title: "Admin | سفرا جلد",
  robots: "noindex, nofollow",
};

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="fixed inset-0 z-[300] bg-slate-50 overflow-auto font-arabic" dir="rtl">
      {children}
    </div>
  );
}
