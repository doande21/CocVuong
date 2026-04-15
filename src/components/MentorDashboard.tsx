import { useState, useEffect } from 'react';
import { db } from '../firebase';
import { doc, updateDoc } from 'firebase/firestore';
import { Performance, GlobalSettings } from '../types';
import { ArrowLeft, Star, Send, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User } from 'firebase/auth';

interface MentorDashboardProps {
  performances: Performance[];
  settings: GlobalSettings | null;
  user: User;
  onBack: () => void;
}

export default function MentorDashboard({ performances, settings, user, onBack }: MentorDashboardProps) {
  const [score, setScore] = useState<number | ''>('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const activePerformance = performances.find(p => p.id === settings?.activeId);

  useEffect(() => {
    // Reset submission state when active performance changes
    setIsSubmitted(false);
    setScore('');
  }, [settings?.activeId]);

  const submitScore = async () => {
    if (!activePerformance || score === '' || score < 0 || score > 10) return;

    const newScores = { 
      ...activePerformance.scores, 
      [user.uid]: { 
        score: Number(score), 
        name: user.displayName || 'Giám khảo' 
      } 
    };
    const scoreValues = Object.values(newScores).map(s => s.score);
    const average = scoreValues.reduce((a, b) => a + b, 0) / scoreValues.length;

    await updateDoc(doc(db, 'performances', activePerformance.id), {
      scores: newScores,
      averageScore: average
    });

    setIsSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-2xl mx-auto">
        <header className="flex items-center gap-4 mb-12">
          <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-2xl font-bold">Bảng chấm điểm</h1>
        </header>

        <AnimatePresence mode="wait">
          {!activePerformance ? (
            <motion.div 
              key="idle"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="text-center py-20 bg-slate-900 rounded-3xl border border-slate-800"
            >
              <div className="bg-slate-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-slate-600" />
              </div>
              <h2 className="text-xl font-semibold text-slate-400">Đang chờ Admin bắt đầu tiết mục...</h2>
            </motion.div>
          ) : isSubmitted ? (
            <motion.div 
              key="submitted"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-center py-20 bg-green-900/20 rounded-3xl border border-green-500/50"
            >
              <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-green-400 mb-2">Đã gửi điểm thành công!</h2>
              <p className="text-slate-400">Điểm của bạn: <span className="text-white font-bold">{score}</span></p>
              <p className="mt-4 text-sm text-slate-500">Vui lòng chờ tiết mục tiếp theo</p>
            </motion.div>
          ) : (
            <motion.div 
              key="active"
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className="bg-slate-900 p-8 rounded-3xl border border-slate-800 shadow-2xl"
            >
              <div className="mb-8">
                <span className="text-blue-500 font-bold uppercase tracking-widest text-xs">Đang diễn ra</span>
                <h2 className="text-3xl font-bold mt-1">{activePerformance.name}</h2>
                <p className="text-slate-400 text-lg">{activePerformance.competitor}</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-slate-400 mb-2 font-medium">Nhập điểm (0 - 10)</label>
                  <input 
                    type="number" 
                    step="0.1"
                    min="0"
                    max="10"
                    value={score}
                    onChange={e => setScore(e.target.value === '' ? '' : Number(e.target.value))}
                    placeholder="Ví dụ: 9.5"
                    className="w-full bg-slate-800 border-2 border-slate-700 rounded-2xl px-6 py-4 text-3xl font-bold focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 outline-none transition-all"
                  />
                </div>

                <div className="grid grid-cols-5 gap-2">
                  {[7, 8, 8.5, 9, 9.5].map(v => (
                    <button 
                      key={v}
                      onClick={() => setScore(v)}
                      className="py-2 bg-slate-800 hover:bg-slate-700 rounded-lg font-bold transition-colors"
                    >
                      {v}
                    </button>
                  ))}
                </div>

                <button 
                  onClick={submitScore}
                  disabled={score === '' || score < 0 || score > 10}
                  className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-slate-800 disabled:text-slate-600 py-4 rounded-2xl font-bold text-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-blue-500/20"
                >
                  <Send className="w-6 h-6" /> Gửi điểm số
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="mt-12 p-6 bg-slate-900/50 rounded-2xl border border-slate-800/50">
          <h3 className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-4">Giám khảo</h3>
          <div className="flex items-center gap-4">
            <img src={user.photoURL || ''} className="w-12 h-12 rounded-full border-2 border-blue-500" alt="" />
            <div>
              <p className="font-bold">{user.displayName}</p>
              <p className="text-xs text-slate-500">{user.email}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
