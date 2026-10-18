import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { MusicProvider, useMusic } from './context/MusicContext';
import { Navbar } from './components/Navbar';
import { Sidebar } from './components/Sidebar';
import { VinylPlayer } from './components/VinylPlayer';
import { MidnightView } from './components/MidnightView';
import { ExternalMusicSearch } from './components/ExternalMusicSearch';
import { LikedSongsView } from './components/LikedSongsView';
import { PlayerBar } from './components/PlayerBar';
import { AdminModal } from './components/AdminModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { Disc, Sparkles, Shield, Volume2 } from 'lucide-react';

const MainContent = () => {
  const [activeView, setActiveView] = useState('turntable'); // 'turntable' | 'midnight' | 'external' | 'liked'
  const [searchQuery, setSearchQuery] = useState('');
  const [isAdminStudioOpen, setIsAdminStudioOpen] = useState(false);
  const [isAdminLoginOpen, setIsAdminLoginOpen] = useState(false);

  const { isAdmin } = useAuth();
  const { tracks, loading } = useMusic();

  const handleOpenAdminStudio = () => {
    if (!isAdmin) {
      setIsAdminLoginOpen(true);
    } else {
      setIsAdminStudioOpen(true);
    }
  };

  return (
    <div className="min-h-screen bg-[#050811] text-slate-100 flex flex-col font-sans selection:bg-rose-500 selection:text-white pb-28">
      
      {/* Top Navigation */}
      <Navbar
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        onOpenAdminStudio={handleOpenAdminStudio}
      />

      {/* Main Content Area */}
      <div className="flex-1 max-w-7xl w-full mx-auto flex gap-6 px-4 lg:px-8 py-6">
        
        {/* Left Sidebar */}
        <Sidebar
          activeView={activeView}
          setActiveView={setActiveView}
          onOpenAdminStudio={handleOpenAdminStudio}
          onOpenAdminLogin={() => setIsAdminLoginOpen(true)}
        />

        {/* Dynamic Center View */}
        <main className="flex-1 min-w-0 space-y-6">
          
          {loading && tracks.length === 0 ? (
            <div className="h-96 flex flex-col items-center justify-center gap-3">
              <Disc className="w-12 h-12 text-sky-400 animate-spin" />
              <p className="text-xs font-mono text-slate-400">Loading Radiant Vinyl Deck...</p>
            </div>
          ) : (
            <>
              {activeView === 'turntable' && (
                <div className="space-y-8 animate-fadeIn">
                  <VinylPlayer />
                  <MidnightView />
                </div>
              )}

              {activeView === 'midnight' && (
                <div className="animate-fadeIn">
                  <MidnightView />
                </div>
              )}

              {activeView === 'external' && (
                <div className="animate-fadeIn">
                  <ExternalMusicSearch />
                </div>
              )}

              {activeView === 'liked' && (
                <div className="animate-fadeIn">
                  <LikedSongsView />
                </div>
              )}
            </>
          )}

        </main>

      </div>

      {/* Persistent Bottom Hi-Fi Player Bar */}
      <PlayerBar onOpenVinyl={() => setActiveView('turntable')} />

      {/* Admin Studio Modal (Multer file upload + catalog manager) */}
      <AdminModal
        isOpen={isAdminStudioOpen}
        onClose={() => setIsAdminStudioOpen(false)}
      />

      {/* Admin Login Modal (JWT auth + 1-click Demo Admin) */}
      <AdminLoginModal
        isOpen={isAdminLoginOpen}
        onClose={() => setIsAdminLoginOpen(false)}
      />

    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <MusicProvider>
        <MainContent />
      </MusicProvider>
    </AuthProvider>
  );
}
