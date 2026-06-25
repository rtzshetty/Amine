import { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { db, getEpisodes } from '../lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { Series, Episode } from '../types';
import { Play, ArrowLeft, Clock, History, Maximize, Minimize } from 'lucide-react';
import ReactPlayer from 'react-player';
import { useStore } from '../store';
import { motion } from 'motion/react';

export default function SeriesDetails() {
  const { id } = useParams<{ id: string }>();
  const [series, setSeries] = useState<Series | null>(null);
  const [episodes, setEpisodes] = useState<Episode[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [activeEpisode, setActiveEpisode] = useState<Episode | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  const watchHistory = useStore(state => state.watchHistory);
  const updateWatchHistory = useStore(state => state.updateWatchHistory);
  const playerRef = useRef<any>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, []);

  const toggleFullScreen = () => {
    if (!document.fullscreenElement) {
      playerContainerRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable full-screen mode: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    if (!id) return;
    const fetchData = async () => {
      try {
        const sDoc = await getDoc(doc(db, 'series', id));
        if (sDoc.exists()) {
          setSeries({ id: sDoc.id, ...sDoc.data() } as Series);
          const eps = await getEpisodes(id);
          setEpisodes(eps);

          // Check if there's history for this series
          const history = watchHistory[id];
          if (history && eps.length > 0) {
            const ep = eps.find(e => e.id === history.episodeId);
            if (ep) {
              setActiveEpisode(ep);
            }
          }
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [id]);

  const handleProgress = (state: { playedSeconds: number, played: number, loadedSeconds: number, loaded: number }) => {
    if (activeEpisode && series) {
      updateWatchHistory(series.id, activeEpisode.id, state.playedSeconds, playerRef.current?.getDuration() || 0);
    }
  };

  const handleReady = () => {
    if (series && activeEpisode) {
      const history = watchHistory[series.id];
      if (history && history.episodeId === activeEpisode.id && playerRef.current) {
        // Resume from last watched time if less than 90% complete
        if (history.duration > 0 && history.progress / history.duration < 0.9) {
           playerRef.current.seekTo(history.progress, 'seconds');
        }
      }
    }
  };

  if (loading) return <div className="h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-[#FF3E3E] border-t-transparent rounded-full animate-spin"></div></div>;
  if (!series) return <div className="h-screen flex items-center justify-center text-white">Series not found</div>;

  return (
    <div className="min-h-screen bg-[#050505] pb-24 md:pb-8">
      {/* Back button */}
      <div className="absolute top-0 left-0 p-4 z-50">
        <Link to="/" className="w-10 h-10 rounded-full bg-black/50 backdrop-blur-md flex items-center justify-center text-white hover:bg-[#FF3E3E] transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </Link>
      </div>

      {/* Video Player Area */}
      <div ref={playerContainerRef} className="w-full bg-black aspect-video md:h-[60vh] relative group">
        {activeEpisode ? (
          <div className="w-full h-full relative">
            {(() => {
              const Player = ReactPlayer as any;

              let isDriveUrl = false;
              let driveId = '';
              if (activeEpisode.video_url.includes('drive.google.com/uc')) {
                isDriveUrl = true;
                const url = new URL(activeEpisode.video_url);
                driveId = url.searchParams.get('id') || '';
              } else if (activeEpisode.video_url.includes('drive.google.com/file/d/')) {
                isDriveUrl = true;
                const match = activeEpisode.video_url.match(/\/d\/([^/]+)/);
                if (match) driveId = match[1];
              }

              if (isDriveUrl && driveId) {
                return (
                  <div className="w-full h-full relative group/drive">
                    <iframe
                      src={`https://drive.google.com/file/d/${driveId}/preview`}
                      width="100%"
                      height="100%"
                      allow="autoplay; fullscreen"
                      allowFullScreen
                      style={{ border: 'none' }}
                    ></iframe>
                    <button 
                      onClick={toggleFullScreen}
                      className="absolute bottom-4 right-4 z-50 p-3 md:p-2 bg-[#FF3E3E] hover:bg-[#E63535] rounded-xl md:rounded-lg text-white shadow-lg backdrop-blur-md transition-all flex items-center gap-2 transform active:scale-95"
                      title={isFullscreen ? "Exit Fullscreen" : "Fullscreen"}
                    >
                      {isFullscreen ? <Minimize className="w-6 h-6 md:w-5 md:h-5" /> : <Maximize className="w-6 h-6 md:w-5 md:h-5" />}
                      <span className="text-sm font-bold md:text-xs">{isFullscreen ? 'Exit' : 'Fullscreen'}</span>
                    </button>
                  </div>
                );
              }

              return (
                <Player 
                  ref={playerRef}
                  url={activeEpisode.video_url}
                  width="100%"
                  height="100%"
                  controls
                  playing={isPlaying}
                  onProgress={handleProgress}
                  onReady={handleReady}
                  config={{
                    file: {
                      forceHLS: activeEpisode.video_url.includes('.m3u8'),
                      attributes: {
                        crossOrigin: 'anonymous'
                      }
                    }
                  }}
                />
              );
            })()}
          </div>
        ) : (
          <div className="w-full h-full relative">
            <img src={series.poster_url} alt={series.title} className="w-full h-full object-cover opacity-50" />
            <div className="absolute inset-0 flex items-center justify-center">
              <button 
                onClick={() => setEpisodes.length > 0 && setActiveEpisode(episodes[0])}
                className="w-20 h-20 bg-[#FF3E3E] rounded-full flex items-center justify-center hover:scale-110 transition-transform accent-glow"
              >
                <Play className="w-8 h-8 fill-white text-white ml-1" />
              </button>
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-[#050505] to-transparent pointer-events-none"></div>
          </div>
        )}
      </div>

      {/* Details */}
      <div className="px-4 md:px-8 max-w-6xl mx-auto mt-6">
        <div className="flex flex-col md:flex-row gap-8">
          <div className="flex-1">
            <h1 className="text-3xl md:text-5xl font-black text-white mb-2 text-shadow tracking-tighter">{series.title}</h1>
            <div className="flex items-center space-x-4 text-sm text-[#FF3E3E]/80 mb-6 font-bold uppercase tracking-widest">
              <span className="glass px-2 py-1 rounded text-white">{series.type}</span>
              <span>{series.genre}</span>
            </div>
            <p className="text-gray-300 leading-relaxed text-lg">{series.description}</p>
          </div>
          
          <div className="w-full md:w-1/3">
            <div className="glass rounded-xl p-6">
              <h3 className="text-xl font-bold text-white mb-4">Episodes</h3>
              {episodes.length === 0 ? (
                <p className="text-white/40">No episodes available yet.</p>
              ) : (
                <div className="space-y-3 max-h-[400px] overflow-y-auto pr-2 scrollbar-hide">
                  {episodes.map(ep => {
                    const isActive = activeEpisode?.id === ep.id;
                    const history = watchHistory[series.id];
                    const isWatched = history && history.episodeId === ep.id && (history.progress / history.duration > 0.9);
                    const progressPercent = (history && history.episodeId === ep.id) ? (history.progress / history.duration) * 100 : 0;
                    
                    return (
                      <button
                        key={ep.id}
                        onClick={() => setActiveEpisode(ep)}
                        className={`w-full text-left p-3 rounded-lg flex items-start transition-colors ${isActive ? 'bg-[#FF3E3E]/10 border border-[#FF3E3E]' : 'bg-white/5 hover:bg-white/10 border border-transparent'}`}
                      >
                        <div className="relative w-24 aspect-video bg-white/10 rounded-md overflow-hidden flex-shrink-0 mr-3">
                          <img src={series.poster_url} className="w-full h-full object-cover opacity-50" />
                          <div className="absolute inset-0 flex items-center justify-center">
                             <Play className={`w-6 h-6 ${isActive ? 'text-[#FF3E3E] fill-[#FF3E3E]' : 'text-white/70'}`} />
                          </div>
                          {/* Progress bar */}
                          {progressPercent > 0 && progressPercent < 100 && (
                            <div className="absolute bottom-0 left-0 h-1 bg-[#FF3E3E]" style={{ width: `${progressPercent}%` }}></div>
                          )}
                        </div>
                        <div>
                          <h4 className={`font-bold text-sm ${isActive ? 'text-[#FF3E3E]' : 'text-white'}`}>
                            {ep.episode_number}. {ep.episode_title}
                          </h4>
                          <p className="text-xs text-white/50 mt-1 line-clamp-2">{ep.description}</p>
                          {isWatched && <span className="text-[10px] font-bold text-[#FF3E3E] uppercase mt-1 block tracking-widest flex items-center"><History className="w-3 h-3 mr-1"/> Watched</span>}
                        </div>
                      </button>
                    )
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
