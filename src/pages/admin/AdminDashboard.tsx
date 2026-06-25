import { useState, useEffect } from 'react';
import { addSeries, addEpisode, getAllSeries, db } from '../../lib/firebase';
import { Series } from '../../types';
import { PlusCircle, Upload, Film, Video, X } from 'lucide-react';
import { motion } from 'motion/react';
import { getAccessToken, googleSignIn } from '../../lib/workspace';
import { fetchDriveVideos } from '../../lib/picker';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'series' | 'episode'>('series');
  const [seriesList, setSeriesList] = useState<Series[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Series form state
  const [sTitle, setSTitle] = useState('');
  const [sDesc, setSDesc] = useState('');
  const [sPoster, setSPoster] = useState('');
  const [sType, setSType] = useState<'Anime' | 'Movie'>('Anime');
  const [sGenre, setSGenre] = useState('');
  const [sStatus, setSStatus] = useState<'draft' | 'published'>('published');

  // Episode form state
  const [eSeriesId, setESeriesId] = useState('');
  const [eNum, setENum] = useState('');
  const [eTitle, setETitle] = useState('');
  const [eVideo, setEVideo] = useState('');
  const [eDesc, setEDesc] = useState('');

  // Drive state
  const [isDriveModalOpen, setIsDriveModalOpen] = useState(false);
  const [driveVideos, setDriveVideos] = useState<any[]>([]);
  const [loadingDrive, setLoadingDrive] = useState(false);

  useEffect(() => {
    fetchSeries();
  }, []);

  const fetchSeries = async () => {
    try {
      const list = await getAllSeries();
      setSeriesList(list);
    } catch (err) {
      console.error(err);
    }
  };

  const handleSeriesSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await addSeries({
        title: sTitle,
        description: sDesc,
        poster_url: sPoster,
        type: sType,
        genre: sGenre,
        publish_status: sStatus,
      });
      setSuccess('Series added successfully!');
      setSTitle(''); setSDesc(''); setSPoster(''); setSGenre('');
      fetchSeries();
    } catch (err: any) {
      setError(err.message || 'Error adding series');
    } finally {
      setLoading(false);
    }
  };

  const handleEpisodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    try {
      await addEpisode({
        series_id: eSeriesId,
        episode_number: Number(eNum),
        episode_title: eTitle,
        video_url: eVideo,
        description: eDesc,
      });
      setSuccess('Episode added successfully!');
      setENum(''); setETitle(''); setEVideo(''); setEDesc('');
    } catch (err: any) {
      setError(err.message || 'Error adding episode');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-white">Content Management</h2>
      
      <div className="flex space-x-4 mb-8">
        <button 
          onClick={() => setActiveTab('series')}
          className={`flex items-center px-4 py-2 rounded-lg font-bold transition-colors ${activeTab === 'series' ? 'bg-[#FF3E3E] text-white' : 'glass text-white/70 hover:text-white'}`}
        >
          <Film className="w-5 h-5 mr-2" />
          Add Series / Movie
        </button>
        <button 
          onClick={() => setActiveTab('episode')}
          className={`flex items-center px-4 py-2 rounded-lg font-bold transition-colors ${activeTab === 'episode' ? 'bg-[#FF3E3E] text-white' : 'glass text-white/70 hover:text-white'}`}
        >
          <Video className="w-5 h-5 mr-2" />
          Add Episode
        </button>
      </div>

      {error && <div className="bg-red-500/10 border border-red-500 text-red-500 p-4 rounded-lg mb-6">{error}</div>}
      {success && <div className="bg-green-500/10 border border-green-500 text-green-500 p-4 rounded-lg mb-6">{success}</div>}

      <div className="glass rounded-2xl p-6 relative">
        {activeTab === 'series' ? (
          <form onSubmit={handleSeriesSubmit} className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <PlusCircle className="w-5 h-5 mr-2 text-[#FF3E3E]" /> New Series
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-white/70 mb-1 uppercase tracking-wider text-[10px]">Title</label>
                <input required type="text" value={sTitle} onChange={e => setSTitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#FF3E3E]/50" />
              </div>
              <div>
                <label className="block text-sm font-bold text-white/70 mb-1 uppercase tracking-wider text-[10px]">Type</label>
                <select value={sType} onChange={e => setSType(e.target.value as any)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#FF3E3E]/50">
                  <option value="Anime" className="bg-[#050505]">Anime</option>
                  <option value="Movie" className="bg-[#050505]">Movie</option>
                </select>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-white/70 mb-1 uppercase tracking-wider text-[10px]">Description</label>
                <textarea required rows={3} value={sDesc} onChange={e => setSDesc(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#FF3E3E]/50" />
              </div>
              <div>
                <label className="block text-sm font-bold text-white/70 mb-1 uppercase tracking-wider text-[10px]">Poster Image URL</label>
                <input required type="url" value={sPoster} onChange={e => setSPoster(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#FF3E3E]/50" placeholder="https://..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-white/70 mb-1 uppercase tracking-wider text-[10px]">Genre</label>
                <input required type="text" value={sGenre} onChange={e => setSGenre(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#FF3E3E]/50" placeholder="Action, Fantasy..." />
              </div>
              <div>
                <label className="block text-sm font-bold text-white/70 mb-1 uppercase tracking-wider text-[10px]">Status</label>
                <select value={sStatus} onChange={e => setSStatus(e.target.value as any)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#FF3E3E]/50">
                  <option value="published" className="bg-[#050505]">Published</option>
                  <option value="draft" className="bg-[#050505]">Draft</option>
                </select>
              </div>
            </div>
            <button disabled={loading} type="submit" className="mt-6 flex items-center justify-center w-full bg-[#FF3E3E] hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105">
              <Upload className="w-5 h-5 mr-2" /> {loading ? 'Saving...' : 'Upload Series'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleEpisodeSubmit} className="space-y-4">
            <h3 className="text-lg font-bold text-white mb-4 flex items-center">
              <PlusCircle className="w-5 h-5 mr-2 text-[#FF3E3E]" /> New Episode
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-white/70 mb-1 uppercase tracking-wider text-[10px]">Select Series</label>
                <select required value={eSeriesId} onChange={e => setESeriesId(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#FF3E3E]/50">
                  <option value="" className="bg-[#050505]">-- Choose Series --</option>
                  {seriesList.map(s => (
                    <option key={s.id} value={s.id} className="bg-[#050505]">{s.title}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-white/70 mb-1 uppercase tracking-wider text-[10px]">Episode Number</label>
                <input required type="number" min="1" value={eNum} onChange={e => setENum(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#FF3E3E]/50" />
              </div>
              <div>
                <label className="block text-sm font-bold text-white/70 mb-1 uppercase tracking-wider text-[10px]">Episode Title</label>
                <input required type="text" value={eTitle} onChange={e => setETitle(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#FF3E3E]/50" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-white/70 mb-1 uppercase tracking-wider text-[10px]">Video Source Link (.mp4, .m3u8, Drive)</label>
                <div className="flex gap-2">
                  <input required type="url" value={eVideo} onChange={e => setEVideo(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#FF3E3E]/50" placeholder="https://..." />
                  <button 
                    type="button" 
                    onClick={async () => {
                      try {
                        let token = await getAccessToken();
                        if (!token) {
                          const result = await googleSignIn();
                          token = result?.accessToken || null;
                        }
                        if (token) {
                          setIsDriveModalOpen(true);
                          setLoadingDrive(true);
                          const files = await fetchDriveVideos();
                          setDriveVideos(files);
                          setLoadingDrive(false);
                        }
                      } catch (err: any) {
                        setError('Drive picker error: ' + err.message);
                        setLoadingDrive(false);
                      }
                    }}
                    className="whitespace-nowrap px-4 py-3 bg-[#4285F4] hover:bg-[#3367D6] text-white font-bold rounded-lg transition-colors flex items-center"
                  >
                    Pick from Drive
                  </button>
                </div>
                <p className="text-xs text-white/40 mt-1">Provide a direct video link or pick from Drive.</p>
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-white/70 mb-1 uppercase tracking-wider text-[10px]">Description</label>
                <textarea required rows={2} value={eDesc} onChange={e => setEDesc(e.target.value)} className="w-full bg-white/5 border border-white/10 rounded-lg p-3 text-white focus:outline-none focus:border-[#FF3E3E]/50" />
              </div>
            </div>
            <button disabled={loading} type="submit" className="mt-6 flex items-center justify-center w-full bg-[#FF3E3E] hover:bg-red-600 text-white font-bold py-3 rounded-lg transition-all transform hover:scale-105">
              <Upload className="w-5 h-5 mr-2" /> {loading ? 'Saving...' : 'Upload Episode'}
            </button>
          </form>
        )}
      </div>

      {isDriveModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="glass w-full max-w-2xl rounded-2xl border border-white/10 p-6 max-h-[80vh] flex flex-col">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-bold text-white flex items-center">
                <Video className="w-5 h-5 mr-2 text-[#4285F4]" />
                Select Video from Drive
              </h2>
              <button onClick={() => setIsDriveModalOpen(false)} className="text-white/50 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto space-y-2 pr-2 scrollbar-hide">
              {loadingDrive ? (
                <div className="flex justify-center py-10">
                  <div className="w-8 h-8 border-4 border-[#4285F4] border-t-transparent rounded-full animate-spin"></div>
                </div>
              ) : driveVideos.length === 0 ? (
                <p className="text-white/40 text-center py-10">No videos found in your Google Drive.</p>
              ) : (
                driveVideos.map(file => (
                  <button
                    key={file.id}
                    onClick={() => {
                      setEVideo(`https://drive.google.com/uc?export=download&id=${file.id}`);
                      setIsDriveModalOpen(false);
                    }}
                    className="w-full text-left p-3 rounded-lg flex items-center transition-colors bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/20"
                  >
                    {file.thumbnailLink ? (
                      <img src={file.thumbnailLink} alt={file.name} className="w-12 h-12 object-cover rounded mr-4 bg-black/50" />
                    ) : (
                      <div className="w-12 h-12 rounded bg-black/50 flex items-center justify-center mr-4">
                        <Video className="w-5 h-5 text-white/50" />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-white font-bold truncate text-sm">{file.name}</p>
                    </div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
