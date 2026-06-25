import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getPublishedSeries } from '../lib/firebase';
import { Series } from '../types';
import { Play, Info } from 'lucide-react';
import { motion } from 'motion/react';

export default function Home() {
  const [series, setSeries] = useState<Series[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPublishedSeries().then(data => {
      setSeries(data);
      setLoading(false);
    });
  }, []);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-[#FF3E3E] border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (series.length === 0) {
    return (
      <div className="h-screen flex flex-col items-center justify-center text-center px-4">
        <h2 className="text-3xl font-black text-white mb-2">No Content Yet</h2>
        <p className="text-gray-400 mb-6">Log in as Admin to add series and episodes.</p>
        <Link to="/login" className="bg-[#FF3E3E] text-white px-6 py-3 rounded-lg font-bold">Admin Login</Link>
      </div>
    );
  }

  const featured = series[0];
  const trending = series.slice(0, 10);
  const anime = series.filter(s => s.type === 'Anime');
  const movies = series.filter(s => s.type === 'Movie');

  return (
    <div className="pb-8">
      {/* Featured Banner */}
      {featured && (
        <div className="relative h-[60vh] md:h-[80vh] w-full">
          <div className="absolute inset-0">
            <img src={featured.poster_url} alt={featured.title} className="w-full h-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-transparent"></div>
          </div>
          <div className="absolute bottom-0 left-0 right-0 p-8 md:p-16 flex flex-col items-start justify-end h-full">
            <motion.h1 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-4xl md:text-7xl font-black text-white max-w-3xl leading-tight mb-4 tracking-tighter text-shadow"
            >
              {featured.title}
            </motion.h1>
            <motion.p 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-gray-300 max-w-xl text-sm md:text-lg mb-6 line-clamp-3"
            >
              {featured.description}
            </motion.p>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="flex space-x-4"
            >
              <Link to={`/series/${featured.id}`} className="bg-white text-black hover:bg-[#FF3E3E] hover:text-white px-6 py-3 rounded-md font-bold flex items-center transition-all transform hover:scale-105">
                <Play className="w-5 h-5 mr-2" />
                Play Now
              </Link>
              <Link to={`/series/${featured.id}`} className="glass hover:bg-white/10 text-white px-6 py-3 rounded-md font-bold flex items-center transition-colors">
                <Info className="w-5 h-5 mr-2" />
                More Info
              </Link>
            </motion.div>
          </div>
        </div>
      )}

      {/* Rows */}
      <div className="px-8 mt-[-30px] md:mt-[-60px] relative z-10 space-y-12">
        <Row title="Trending Now" items={trending} />
        {anime.length > 0 && <Row title="Anime Series" items={anime} />}
        {movies.length > 0 && <Row title="Blockbuster Movies" items={movies} />}
      </div>
    </div>
  );
}

function Row({ title, items }: { title: string, items: Series[] }) {
  if (!items.length) return null;
  return (
    <div>
      <h2 className="text-xl md:text-2xl font-bold text-white mb-4">{title}</h2>
      <div className="flex overflow-x-auto space-x-4 pb-4 scrollbar-hide snap-x">
        {items.map(item => (
          <Link key={item.id} to={`/series/${item.id}`} className="flex-none w-40 md:w-64 snap-start group relative transition-transform duration-300 hover:scale-105 hover:z-10">
            <div className="aspect-[2/3] rounded-lg overflow-hidden glass">
              <img src={item.poster_url} alt={item.title} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 opacity-80 group-hover:opacity-100" loading="lazy" />
            </div>
            <div className="mt-2 hidden md:block opacity-0 group-hover:opacity-100 transition-opacity absolute bottom-0 left-0 right-0 bg-black/80 backdrop-blur-sm p-4 rounded-b-lg transform translate-y-full group-hover:translate-y-0">
              <h3 className="text-white font-bold text-sm truncate">{item.title}</h3>
              <p className="text-[#FF3E3E]/80 text-xs mt-1 uppercase tracking-tighter font-medium">{item.genre}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
