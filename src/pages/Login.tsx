import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '../store';
import { User, ShieldAlert } from 'lucide-react';
import { motion } from 'motion/react';

export default function Login() {
  const [isAdminMode, setIsAdminMode] = useState(false);
  const [adminId, setAdminId] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  
  const setAdmin = useStore(state => state.setAdmin);
  const navigate = useNavigate();

  const handleGuestLogin = () => {
    // Guest just browses directly
    navigate('/');
  };

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (adminId === '7788' && password === '123') {
      setAdmin(true);
      navigate('/admin');
    } else {
      setError('Invalid Admin Credentials');
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center p-4 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#120303] via-transparent to-[#050505] opacity-50 pointer-events-none"></div>
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md glass rounded-2xl p-8 shadow-2xl relative z-10 accent-glow"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-[#FF3E3E] tracking-tighter mb-2 text-shadow">AYUSH MALIK</h1>
          <p className="text-gray-400 text-sm">Welcome to Thrilling Anime</p>
        </div>

        {!isAdminMode ? (
          <div className="space-y-4">
            <button 
              onClick={handleGuestLogin}
              className="w-full bg-[#FF3E3E] hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all flex items-center justify-center transform hover:scale-105"
            >
              <User className="w-5 h-5 mr-2" />
              Guest Login
            </button>
            <button 
              onClick={() => setIsAdminMode(true)}
              className="w-full bg-white/5 border border-white/10 hover:bg-white/10 text-white font-bold py-3 rounded-xl transition-colors flex items-center justify-center"
            >
              <ShieldAlert className="w-5 h-5 mr-2" />
              Admin Login
            </button>
            <p className="text-xs text-center text-gray-500 mt-4">
              Guests can watch content without an account.
            </p>
          </div>
        ) : (
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Admin ID</label>
              <input 
                type="text" 
                value={adminId}
                onChange={(e) => setAdminId(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF3E3E]/50"
                placeholder="Enter Admin ID"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Password</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#FF3E3E]/50"
                placeholder="Enter Password"
              />
            </div>
            
            {error && <p className="text-[#FF3E3E] text-sm text-center font-bold">{error}</p>}

            <button 
              type="submit"
              className="w-full bg-[#FF3E3E] hover:bg-red-600 text-white font-bold py-3 rounded-xl transition-all transform hover:scale-105"
            >
              Login as Admin
            </button>
            <button 
              type="button"
              onClick={() => setIsAdminMode(false)}
              className="w-full text-gray-400 text-sm hover:text-white transition-colors"
            >
              Back to options
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
}
