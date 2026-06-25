import { Outlet, Link } from 'react-router-dom';
import { Home, Search, LayoutGrid, User } from 'lucide-react';

export default function GuestLayout() {
  return (
    <div className="min-h-screen bg-[#050505] text-white flex flex-col font-sans relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#120303] via-transparent to-[#050505] opacity-50 pointer-events-none"></div>
      
      {/* Desktop Header */}
      <header className="hidden md:flex fixed top-0 left-0 right-0 h-16 bg-gradient-to-b from-black/80 to-transparent items-center justify-between px-8 z-50">
        <div className="flex items-center space-x-10">
          <Link to="/" className="text-xl font-black tracking-tighter text-[#FF3E3E]">
            AYUSH MALIK <span className="text-white/20 ml-2 font-light">|</span> <span className="text-white text-sm font-bold ml-2 uppercase tracking-widest">Thrilling Anime</span>
          </Link>
          <nav className="flex space-x-6 text-sm font-medium text-white/60">
            <Link to="/" className="text-white border-b-2 border-[#FF3E3E] pb-1">Home</Link>
            <button className="hover:text-white transition-colors">Series</button>
            <button className="hover:text-white transition-colors">Movies</button>
          </nav>
        </div>
        <div className="flex items-center space-x-6">
          <Link to="/login" className="text-xs font-bold uppercase tracking-widest px-4 py-2 rounded glass border-white/20 hover:bg-white/10 transition-colors">
            Admin Login
          </Link>
        </div>
      </header>

      <main className="flex-1 overflow-x-hidden pb-16 md:pb-0 z-10 relative">
        <Outlet />
      </main>

      {/* Bottom Navigation for Mobile */}
      <nav className="fixed bottom-0 left-0 right-0 bg-black/80 backdrop-blur-xl border-t border-white/5 flex justify-around items-center h-20 md:hidden z-50 shadow-2xl">
        <Link to="/" className="flex flex-col items-center space-y-1 text-[#FF3E3E] transition-colors">
          <Home className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Home</span>
        </Link>
        <button className="flex flex-col items-center space-y-1 text-white/40 hover:text-white transition-colors">
          <Search className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Search</span>
        </button>
        <button className="flex flex-col items-center space-y-1 text-white/40 hover:text-white transition-colors">
          <LayoutGrid className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Browse</span>
        </button>
        <Link to="/login" className="flex flex-col items-center space-y-1 text-white/40 hover:text-white transition-colors">
          <User className="w-6 h-6" />
          <span className="text-[10px] font-bold uppercase tracking-widest">Login</span>
        </Link>
      </nav>
    </div>
  );
}
