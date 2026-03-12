"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "About ClearMed", href: "/about" },
    { name: "Upload Bill", href: "/upload" },
    { name: "Policy", href: "/policy" },
  ];

  return (
    <nav className="bg-white shadow-md border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <div className="flex-shrink-0 flex items-center">
            <Link href="/" className="text-2xl font-black text-blue-600 tracking-tighter">
              ClearMed<span className="text-slate-400">.</span>
            </Link>
          </div>
          
          <div className="hidden md:flex space-x-8 items-center bg-slate-50 px-6 py-2 rounded-full border border-slate-100">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className={`text-sm font-semibold transition-colors ${
                  pathname === link.href ? "text-blue-600" : "text-slate-500 hover:text-slate-900"
                }`}
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            <Link 
              href="/login" 
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg font-bold text-sm shadow-sm transition-all"
            >
              Login / Register
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
