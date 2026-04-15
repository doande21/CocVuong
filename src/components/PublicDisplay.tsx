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

                <div className="grid grid-cols-5 gap-4">
                  {Object.entries(activePerformance.scores).map(([judgeId, score], idx) => (
                    <motion.div 
                      key={judgeId}
                      initial={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ delay: idx * 0.1 }}
                      className="bg-white/5 border border-white/10 p-6 rounded-3xl text-center backdrop-blur-md"
                    >
                      <p className="text-xs text-slate-500 uppercase font-bold mb-2">GK {idx + 1}</p>
                      <p className="text-5xl font-black text-blue-400">{score.toFixed(1)}</p>
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
                    <p className="text-9xl font-black italic tracking-tighter">
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
            className="h-screen flex flex-col"
          >
            <div className="flex-1 flex items-stretch">
              {/* Red Corner */}
              <div className="flex-1 bg-gradient-to-br from-red-950 to-red-900 flex flex-col items-center justify-center p-12 relative overflow-hidden">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`relative z-10 text-center ${activeMatch.winner === 'red' && settings.showWinnerAnimation ? 'scale-110' : ''}`}
                >
                  <div className="w-80 h-80 rounded-full border-[12px] border-red-500 overflow-hidden mb-8 shadow-2xl shadow-red-500/50 mx-auto">
                    <img src={activeMatch.redCorner.photoUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <h2 className="text-7xl font-black mb-2 tracking-tighter uppercase">{activeMatch.redCorner.name}</h2>
                  <p className="text-3xl text-red-300 font-bold uppercase tracking-[0.5em]">ĐỎ / RED</p>
                </motion.div>
                
                {activeMatch.winner === 'red' && settings.showWinnerAnimation && (
                  <WinnerOverlay name={activeMatch.redCorner.name} />
                )}
              </div>

              {/* VS Divider */}
              <div className="w-32 bg-black flex items-center justify-center relative z-20">
                <div className="h-full w-px bg-white/20 absolute left-1/2 -translate-x-1/2" />
                <div className="bg-black px-4 py-8 relative z-30">
                  <span className="text-7xl font-black italic tracking-tighter text-white/20">VS</span>
                </div>
              </div>

              {/* Blue Corner */}
              <div className="flex-1 bg-gradient-to-bl from-blue-950 to-blue-900 flex flex-col items-center justify-center p-12 relative overflow-hidden">
                <motion.div 
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className={`relative z-10 text-center ${activeMatch.winner === 'blue' && settings.showWinnerAnimation ? 'scale-110' : ''}`}
                >
                  <div className="w-80 h-80 rounded-full border-[12px] border-blue-500 overflow-hidden mb-8 shadow-2xl shadow-blue-500/50 mx-auto">
                    <img src={activeMatch.blueCorner.photoUrl} alt="" className="w-full h-full object-cover" />
                  </div>
                  <h2 className="text-7xl font-black mb-2 tracking-tighter uppercase">{activeMatch.blueCorner.name}</h2>
                  <p className="text-3xl text-blue-300 font-bold uppercase tracking-[0.5em]">XANH / BLUE</p>
                </motion.div>

                {activeMatch.winner === 'blue' && settings.showWinnerAnimation && (
                  <WinnerOverlay name={activeMatch.blueCorner.name} />
                )}
              </div>
            </div>
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

function WinnerOverlay({ name }: { name: string }) {
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="absolute inset-0 z-40 bg-black/60 backdrop-blur-sm flex flex-col items-center justify-center"
    >
      <motion.div
        initial={{ scale: 0.5, y: 50 }}
        animate={{ scale: 1, y: 0 }}
        className="text-center"
      >
        <Trophy className="w-32 h-32 text-yellow-500 mx-auto mb-8 animate-bounce" />
        <h3 className="text-6xl font-black text-white mb-4 uppercase tracking-widest">CHÚC MỪNG</h3>
        <h2 className="text-9xl font-black text-yellow-500 drop-shadow-[0_0_30px_rgba(234,179,8,0.5)] uppercase tracking-tighter">
          {name}
        </h2>
        <p className="text-4xl text-white/60 mt-8 font-bold uppercase tracking-[1em]">CHIẾN THẮNG</p>
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
