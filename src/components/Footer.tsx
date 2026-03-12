import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 py-12 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-2 space-y-4">
            <Link href="/" className="text-2xl font-black text-white tracking-tighter">
              ClearMed<span className="text-blue-500">.</span>
            </Link>
            <p className="text-sm text-slate-400 max-w-sm">
              Demystifying healthcare costs through crowdsourced intelligence and AI. Find the best hospitals with complete transparency.
            </p>
          </div>
          
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Platform</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/" className="hover:text-blue-400 transition-colors">Home Dashboard</Link></li>
              <li><Link href="/upload" className="hover:text-blue-400 transition-colors">Upload a Bill</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">Company</h3>
            <ul className="space-y-2 text-sm">
              <li><Link href="/about" className="hover:text-blue-400 transition-colors">About Us</Link></li>
              <li><Link href="/policy" className="hover:text-blue-400 transition-colors">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="border-t border-slate-800 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500">
          <p>&copy; {new Date().getFullYear()} ClearMed. All rights reserved.</p>
          <p className="mt-2 md:mt-0">Built for Transparency.</p>
        </div>
      </div>
    </footer>
  );
}
