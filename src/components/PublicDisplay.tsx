import { Performance, Match, GlobalSettings } from '../types';
import { motion, AnimatePresence } from 'motion/react';
import { Trophy, Star, ArrowLeft } from 'lucide-react';

interface PublicDisplayProps {
  performances: Performance[];
  matches: Match[];
  settings: GlobalSettings | null;
  onBack: () => void;
}

export default function PublicDisplay({ performances, matches, settings, onBack }: PublicDisplayProps) {
  const activePerformance = performances.find(p => p.id === settings?.activeId);
  const activeMatch = matches.find(m => m.id === settings?.activeId);

  const sortedPerformances = [...performances].sort((a, b) => b.averageScore - a.averageScore);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background Glow */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-900/20 blur-[120px] rounded-full" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-red-900/20 blur-[120px] rounded-full" />
      </div>

      <button onClick={onBack} className="absolute top-4 left-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-all">
        <ArrowLeft className="w-6 h-6" />
      </button>

      <AnimatePresence mode="wait">
        {settings?.activeView === 'forms' && activePerformance && (
          <motion.div 
            key="forms"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen flex flex-col p-12"
          >
            <div className="grid grid-cols-12 gap-12 h-full">
              {/* Active Performance Info */}
              <div className="col-span-7 flex flex-col justify-center">
                <motion.div
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="mb-12"
                >
                  <span className="inline-block px-4 py-1 bg-blue-600 text-xs font-black uppercase tracking-[0.3em] rounded-full mb-6">
                    Đang thi đấu
                  </span>
                  <h1 className="text-8xl font-black mb-4 leading-tight tracking-tighter">
                    {activePerformance.name}
                  </h1>
                  <p className="text-4xl text-slate-400 font-medium">
                    {activePerformance.competitor}
                  </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                  {Object.entries(activePerformance.scores).map(([judgeId, scoreData], idx) => (
                    <motion.div 
                      key={judgeId}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white/5 border border-white/10 p-4 rounded-3xl text-center backdrop-blur-md"
                    >
                      <p className="text-[10px] text-slate-500 uppercase font-bold mb-1 truncate px-2">
                        {scoreData.name}
                      </p>
                      <p className="text-4xl font-black text-blue-400">{scoreData.score.toFixed(1)}</p>
                    </motion.div>
                  ))}
                </div>

                <motion.div 
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  className="mt-12 bg-gradient-to-r from-blue-600 to-blue-400 p-1 rounded-3xl"
                >
                  <div className="bg-black/40 backdrop-blur-xl p-8 rounded-[22px] flex items-center justify-between">
                    <div>
                      <p className="text-xl text-blue-200 font-bold uppercase tracking-widest">Điểm trung bình</p>
                      <p className="text-2xl text-blue-100 opacity-60">Average Score</p>
                    </div>
                    <p className="text-9xl font-black tracking-tighter">
                      {activePerformance.averageScore.toFixed(2)}
                    </p>
                  </div>
                </motion.div>
              </div>

              {/* Leaderboard */}
              <div className="col-span-5 bg-white/5 rounded-[40px] border border-white/10 p-8 backdrop-blur-md flex flex-col">
                <h2 className="text-3xl font-black mb-8 flex items-center gap-3">
                  <Trophy className="w-8 h-8 text-yellow-500" /> BẢNG XẾP HẠNG
                </h2>
                <div className="flex-1 space-y-4 overflow-hidden">
                  {sortedPerformances.slice(0, 6).map((p, idx) => (
                    <motion.div 
                      key={p.id}
                      initial={{ x: 30, opacity: 0 }}
                      animate={{ x: 0, opacity: 1 }}
                      transition={{ delay: idx * 0.05 }}
                      className={`flex items-center justify-between p-5 rounded-2xl border ${p.id === activePerformance.id ? 'bg-blue-600/20 border-blue-500' : 'bg-white/5 border-white/5'}`}
                    >
                      <div className="flex items-center gap-4">
                        <span className={`w-10 h-10 rounded-full flex items-center justify-center font-black text-xl ${idx === 0 ? 'bg-yellow-500 text-black' : idx === 1 ? 'bg-slate-300 text-black' : idx === 2 ? 'bg-amber-600 text-black' : 'bg-white/10'}`}>
                          {idx + 1}
                        </span>
                        <div>
                          <p className="font-bold text-lg leading-none mb-1">{p.competitor}</p>
                          <p className="text-xs text-slate-500 uppercase tracking-wider">{p.name}</p>
                        </div>
                      </div>
                      <p className="text-2xl font-black text-blue-400">{p.averageScore.toFixed(2)}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {settings?.activeView === 'combat' && activeMatch && (
          <motion.div 
            key="combat"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="h-screen relative overflow-hidden bg-black"
          >
            {/* UFC Style Combat Display */}
            <div className="flex h-full">
              {/* Red Corner Fighter */}
              <div className="relative flex-1 overflow-hidden">
                <motion.div 
                  initial={{ x: -100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="h-full w-full"
                >
                  <img 
                    src={activeMatch.redCorner.photoUrl} 
                    alt="" 
                    className="h-full w-full object-cover object-center scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-red-950/80 via-red-900/40 to-transparent" />
                </motion.div>
                
                {/* Red Label */}
                <div className="absolute bottom-12 left-12 z-20">
                  <p className="text-4xl font-black text-red-500 tracking-[0.2em] mb-2">ĐỎ / RED</p>
                  <h2 className="text-8xl font-black text-white uppercase leading-none tracking-tighter">{activeMatch.redCorner.name}</h2>
                </div>
              </div>

              {/* Center VS and Names Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center z-30 pointer-events-none">
                <div className="bg-black/40 backdrop-blur-sm px-12 py-6 border-y border-white/10 flex flex-col items-center">
                  <span className="text-9xl font-black text-white tracking-tighter leading-none mb-4">
                    {activeMatch.redCorner.name.split(' ').pop()}
                  </span>
                  <span className="text-4xl font-black text-yellow-500 border-2 border-yellow-500 px-4 py-1 mb-4">VS</span>
                  <span className="text-9xl font-black text-white tracking-tighter leading-none">
                    {activeMatch.blueCorner.name.split(' ').pop()}
                  </span>
                </div>
              </div>

              {/* Blue Corner Fighter */}
              <div className="relative flex-1 overflow-hidden">
                <motion.div 
                  initial={{ x: 100, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  className="h-full w-full"
                >
                  <img 
                    src={activeMatch.blueCorner.photoUrl} 
                    alt="" 
                    className="h-full w-full object-cover object-center scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-l from-blue-950/80 via-blue-900/40 to-transparent" />
                </motion.div>

                {/* Blue Label */}
                <div className="absolute bottom-12 right-12 z-20 text-right">
                  <p className="text-4xl font-black text-blue-500 tracking-[0.2em] mb-2">XANH / BLUE</p>
                  <h2 className="text-8xl font-black text-white uppercase leading-none tracking-tighter">{activeMatch.blueCorner.name}</h2>
                </div>
              </div>
            </div>

            {/* Winner Overlays */}
            {activeMatch.winner === 'red' && settings.showWinnerAnimation && (
              <WinnerOverlay name={activeMatch.redCorner.name} photoUrl={activeMatch.redCorner.celebrationPhotoUrl} />
            )}
            {activeMatch.winner === 'blue' && settings.showWinnerAnimation && (
              <WinnerOverlay name={activeMatch.blueCorner.name} photoUrl={activeMatch.blueCorner.celebrationPhotoUrl} />
            )}
          </motion.div>
        )}

        {settings?.activeView === 'idle' && (
          <motion.div 
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="h-screen flex flex-col items-center justify-center text-center p-12"
          >
            <div className="relative">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                className="absolute inset-0 bg-gradient-to-r from-blue-500 to-red-500 blur-[100px] opacity-20"
              />
              <h1 className="text-[12vw] font-black leading-none tracking-tighter mb-8 relative z-10">
                VOVINAM<br/>VIỆT VÕ ĐẠO
              </h1>
            </div>
            <p className="text-4xl text-slate-500 font-medium tracking-[0.5em] uppercase">Hệ Thống Chấm Điểm Điện Tử</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function WinnerOverlay({ name, photoUrl }: { name: string; photoUrl: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-40 bg-black/90 backdrop-blur-md flex flex-col items-center justify-center overflow-hidden"
    >
      {/* Background Celebration Photo */}
      <motion.div 
        initial={{ scale: 1.2, opacity: 0 }}
        animate={{ scale: 1, opacity: 0.4 }}
        className="absolute inset-0 z-0"
      >
        <img src={photoUrl} alt="" className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-black" />
      </motion.div>

      <motion.div
        initial={{ scale: 0.5, y: 50, opacity: 0 }}
        animate={{ scale: 1, y: 0, opacity: 1 }}
        className="text-center relative z-10"
      >
        <div className="relative inline-block mb-8">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
            className="absolute inset-0 bg-yellow-500/20 blur-3xl rounded-full"
          />
          <Trophy className="w-32 h-32 text-yellow-500 mx-auto relative z-10 animate-bounce" />
        </div>
        
        <h3 className="text-6xl font-black text-white mb-4 uppercase tracking-[0.2em]">CHÚC MỪNG</h3>
        
        <div className="relative mb-8">
          <h2 className="text-[12vw] font-black text-yellow-500 drop-shadow-[0_0_50px_rgba(234,179,8,0.8)] uppercase leading-none tracking-tighter">
            {name}
          </h2>
        </div>

        <div className="flex items-center justify-center gap-8">
          <div className="h-px w-32 bg-gradient-to-r from-transparent to-white/50" />
          <p className="text-5xl text-white font-black uppercase tracking-[0.5em]">CHIẾN THẮNG</p>
          <div className="h-px w-32 bg-gradient-to-l from-transparent to-white/50" />
        </div>
      </motion.div>
      
      {/* Confetti-like elements */}
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          initial={{ 
            top: "50%", 
            left: "50%", 
            opacity: 1,
            scale: 0
          }}
          animate={{ 
            top: `${Math.random() * 100}%`, 
            left: `${Math.random() * 100}%`,
            opacity: 0,
            scale: Math.random() * 2,
            rotate: Math.random() * 360
          }}
          transition={{ 
            duration: 2, 
            repeat: Infinity, 
            delay: Math.random() * 2,
            ease: "easeOut"
          }}
          className="absolute w-4 h-4 bg-yellow-500 rounded-sm"
        />
      ))}
    </motion.div>
  );
}
