import { Outlet, Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { LogOut, Film, Tv, LayoutDashboard } from 'lucide-react';

export default function AdminLayout() {
  const setAdmin = useStore((state) => state.setAdmin);
  const navigate = useNavigate();

  const handleLogout = () => {
    setAdmin(false);
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex">
      <div className="absolute inset-0 bg-gradient-to-br from-[#120303] via-transparent to-[#050505] opacity-50 pointer-events-none"></div>
      
      {/* Sidebar */}
      <aside className="w-64 glass border-r border-white/5 flex flex-col hidden md:flex relative z-10">
        <div className="p-6">
          <h1 className="text-xl font-black text-[#FF3E3E] tracking-tighter text-shadow">ADMIN PANEL</h1>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <Link to="/admin" className="flex items-center px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors font-bold">
            <LayoutDashboard className="w-5 h-5 mr-3" />
            Dashboard
          </Link>
          <button className="w-full flex items-center px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors font-bold">
            <Tv className="w-5 h-5 mr-3" />
            Manage Series
          </button>
          <button className="w-full flex items-center px-4 py-3 text-white/70 hover:text-white hover:bg-white/10 rounded-lg transition-colors font-bold">
            <Film className="w-5 h-5 mr-3" />
            Manage Episodes
          </button>
        </nav>
        <div className="p-4 border-t border-white/5">
          <button 
            onClick={handleLogout}
            className="flex items-center w-full px-4 py-2 text-[#FF3E3E] hover:bg-[#FF3E3E]/10 rounded-lg transition-colors font-bold"
          >
            <LogOut className="w-5 h-5 mr-3" />
            Logout
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden relative z-10">
        {/* Mobile Header */}
        <header className="md:hidden glass p-4 border-b border-white/5 flex items-center justify-between">
          <h1 className="text-lg font-black text-[#FF3E3E] tracking-tighter">ADMIN PANEL</h1>
          <button onClick={handleLogout} className="text-[#FF3E3E]"><LogOut className="w-6 h-6" /></button>
        </header>
        
        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
