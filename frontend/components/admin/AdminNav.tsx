"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { BarChart3, Package, LogOut } from "lucide-react";
import { clearAdminToken } from "@/lib/adminApi";
import clsx from "clsx";

const links = [
  { href: "/admin", label: "Dashboard", icon: BarChart3 },
  { href: "/admin/orders", label: "Leads / Orders", icon: Package },
];

export default function AdminNav() {
  const pathname = usePathname();
  const router = useRouter();

  const logout = () => {
    clearAdminToken();
    router.push("/admin/login");
  };

  return (
    <header className="bg-white border-b border-border sticky top-0 z-10">
      <div className="max-w-6xl mx-auto px-4 h-14 flex items-center justify-between">
        <div className="flex items-center gap-6">
          <span className="font-bold text-sage-dark">سفرا جلد · Admin</span>
          <nav className="flex gap-1">
            {links.map(({ href, label, icon: Icon }) => (
              <Link
                key={href}
                href={href}
                className={clsx(
                  "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-colors",
                  pathname === href || (href !== "/admin" && pathname?.startsWith(href))
                    ? "bg-sage/10 text-sage-dark"
                    : "text-gray-600 hover:bg-gray-100"
                )}
              >
                <Icon size={16} />
                {label}
              </Link>
            ))}
          </nav>
        </div>
        <button
          onClick={logout}
          className="flex items-center gap-1 text-sm text-gray-500 hover:text-gray-800"
        >
          <LogOut size={16} />
          خروج
        </button>
      </div>
    </header>
  );
}
