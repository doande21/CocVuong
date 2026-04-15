import { useState } from 'react';
import { db } from '../firebase';
import { collection, addDoc, updateDoc, doc, deleteDoc, setDoc } from 'firebase/firestore';
import { Performance, Match, GlobalSettings } from '../types';
import { Plus, Trash2, Play, Pause, Trophy, ArrowLeft, Users, Swords, Settings as SettingsIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface AdminDashboardProps {
  performances: Performance[];
  matches: Match[];
  settings: GlobalSettings | null;
  onBack: () => void;
}

export default function AdminDashboard({ performances, matches, settings, onBack }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState<'forms' | 'combat' | 'settings'>('forms');
  const [newPerf, setNewPerf] = useState({ name: '', competitor: '' });
  const [newMatch, setNewMatch] = useState({ 
    redName: '', 
    blueName: '', 
    redPhoto: '', 
    bluePhoto: '',
    redCelebration: '',
    blueCelebration: ''
  });

  const addPerformance = async () => {
    if (!newPerf.name || !newPerf.competitor) return;
    try {
      await addDoc(collection(db, 'performances'), {
        ...newPerf,
        scores: {},
        averageScore: 0,
        status: 'pending',
        order: performances.length + 1,
        createdAt: new Date().toISOString()
      });
      setNewPerf({ name: '', competitor: '' });
    } catch (error) {
      console.error("Error adding performance:", error);
    }
  };

  const addMatch = async () => {
    if (!newMatch.redName || !newMatch.blueName) return;
    try {
      await addDoc(collection(db, 'matches'), {
        redCorner: { 
          name: newMatch.redName, 
          photoUrl: newMatch.redPhoto || `https://picsum.photos/seed/${newMatch.redName}/400`,
          celebrationPhotoUrl: newMatch.redCelebration || newMatch.redPhoto || `https://picsum.photos/seed/${newMatch.redName}_win/800`
        },
        blueCorner: { 
          name: newMatch.blueName, 
          photoUrl: newMatch.bluePhoto || `https://picsum.photos/seed/${newMatch.blueName}/400`,
          celebrationPhotoUrl: newMatch.blueCelebration || newMatch.bluePhoto || `https://picsum.photos/seed/${newMatch.blueName}_win/800`
        },
        winner: null,
        status: 'pending',
        createdAt: new Date().toISOString()
      });
      setNewMatch({ redName: '', blueName: '', redPhoto: '', bluePhoto: '', redCelebration: '', blueCelebration: '' });
    } catch (error) {
      console.error("Error adding match:", error);
    }
  };

  const setLEDView = async (view: 'forms' | 'combat' | 'idle', id: string | null = null) => {
    await setDoc(doc(db, 'settings', 'global'), {
      activeView: view,
      activeId: id,
      showWinnerAnimation: false
    }, { merge: true });
  };

  const setWinner = async (matchId: string, winner: 'red' | 'blue') => {
    await updateDoc(doc(db, 'matches', matchId), { winner, status: 'completed' });
    await updateDoc(doc(db, 'settings', 'global'), { showWinnerAnimation: true });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-6xl mx-auto">
        <header className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <button onClick={onBack} className="p-2 hover:bg-slate-800 rounded-lg transition-colors">
              <ArrowLeft className="w-6 h-6" />
            </button>
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          </div>
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800">
            <TabButton active={activeTab === 'forms'} onClick={() => setActiveTab('forms')} icon={<Users className="w-4 h-4" />} label="Quyền" />
            <TabButton active={activeTab === 'combat'} onClick={() => setActiveTab('combat')} icon={<Swords className="w-4 h-4" />} label="Đối kháng" />
            <TabButton active={activeTab === 'settings'} onClick={() => setActiveTab('settings')} icon={<SettingsIcon className="w-4 h-4" />} label="Cài đặt" />
          </div>
        </header>

        {activeTab === 'forms' && (
          <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-blue-500" /> Thêm tiết mục mới
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input 
                  placeholder="Tên bài quyền" 
                  value={newPerf.name} 
                  onChange={e => setNewPerf({...newPerf, name: e.target.value})}
                  className="bg-slate-800 border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <input 
                  placeholder="Tên vận động viên / Đội" 
                  value={newPerf.competitor} 
                  onChange={e => setNewPerf({...newPerf, competitor: e.target.value})}
                  className="bg-slate-800 border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <button onClick={addPerformance} className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition-colors">
                  Thêm
                </button>
              </div>
            </div>

            <div className="grid gap-4">
              {performances.map(p => (
                <div key={p.id} className={`p-4 rounded-xl border flex items-center justify-between ${settings?.activeId === p.id ? 'bg-blue-900/20 border-blue-500' : 'bg-slate-900 border-slate-800'}`}>
                  <div>
                    <h3 className="font-bold text-lg">{p.name}</h3>
                    <p className="text-slate-400">{p.competitor}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="text-right mr-4">
                      <p className="text-[10px] text-slate-500 uppercase font-bold">{Object.keys(p.scores).length} giám khảo</p>
                      <p className="text-xl font-mono font-bold text-blue-400">{p.averageScore.toFixed(2)}</p>
                    </div>
                    <button 
                      onClick={() => setLEDView('forms', p.id)}
                      className={`p-2 rounded-lg transition-colors ${settings?.activeId === p.id ? 'bg-blue-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-400'}`}
                      title="Chiếu lên LED"
                    >
                      <Play className="w-5 h-5" />
                    </button>
                    <button onClick={() => deleteDoc(doc(db, 'performances', p.id))} className="p-2 bg-red-900/20 text-red-500 hover:bg-red-900/40 rounded-lg transition-colors">
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'combat' && (
          <div className="space-y-6">
            <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800">
              <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
                <Plus className="w-5 h-5 text-red-500" /> Thêm trận đấu mới
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <input 
                    placeholder="Tên võ sĩ Đỏ" 
                    value={newMatch.redName} 
                    onChange={e => setNewMatch({...newMatch, redName: e.target.value})}
                    className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-red-500 outline-none"
                  />
                  <input 
                    placeholder="URL ảnh đối mặt (Đỏ)" 
                    value={newMatch.redPhoto} 
                    onChange={e => setNewMatch({...newMatch, redPhoto: e.target.value})}
                    className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 text-xs outline-none"
                  />
                  <input 
                    placeholder="URL ảnh ăn mừng (Đỏ)" 
                    value={newMatch.redCelebration} 
                    onChange={e => setNewMatch({...newMatch, redCelebration: e.target.value})}
                    className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 text-xs outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <input 
                    placeholder="Tên võ sĩ Xanh" 
                    value={newMatch.blueName} 
                    onChange={e => setNewMatch({...newMatch, blueName: e.target.value})}
                    className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 focus:ring-2 focus:ring-blue-500 outline-none"
                  />
                  <input 
                    placeholder="URL ảnh đối mặt (Xanh)" 
                    value={newMatch.bluePhoto} 
                    onChange={e => setNewMatch({...newMatch, bluePhoto: e.target.value})}
                    className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 text-xs outline-none"
                  />
                  <input 
                    placeholder="URL ảnh ăn mừng (Xanh)" 
                    value={newMatch.blueCelebration} 
                    onChange={e => setNewMatch({...newMatch, blueCelebration: e.target.value})}
                    className="w-full bg-slate-800 border-slate-700 rounded-lg px-4 py-2 text-xs outline-none"
                  />
                </div>
              </div>
              <button onClick={addMatch} className="w-full bg-red-600 hover:bg-red-700 px-6 py-3 rounded-lg font-semibold transition-colors">
                Tạo trận đấu
              </button>
            </div>

            <div className="grid gap-4">
              {matches.map(m => (
                <div key={m.id} className={`p-6 rounded-xl border ${settings?.activeId === m.id ? 'bg-red-900/20 border-red-500' : 'bg-slate-900 border-slate-800'}`}>
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-8">
                      <div 
                        className={`text-center cursor-pointer group transition-transform hover:scale-105 ${m.winner === 'red' ? 'opacity-100' : m.winner ? 'opacity-40' : ''}`}
                        onClick={() => m.status !== 'completed' && setWinner(m.id, 'red')}
                      >
                        <div className={`w-16 h-16 rounded-full border-4 overflow-hidden mb-2 transition-all ${m.winner === 'red' ? 'border-yellow-500 ring-4 ring-yellow-500/20' : 'border-red-500 group-hover:border-red-400'}`}>
                          <img src={m.redCorner.photoUrl} alt={m.redCorner.name} className="w-full h-full object-cover" />
                        </div>
                        <p className={`font-bold ${m.winner === 'red' ? 'text-yellow-500' : ''}`}>{m.redCorner.name}</p>
                      </div>
                      <span className="text-2xl font-black text-slate-700">VS</span>
                      <div 
                        className={`text-center cursor-pointer group transition-transform hover:scale-105 ${m.winner === 'blue' ? 'opacity-100' : m.winner ? 'opacity-40' : ''}`}
                        onClick={() => m.status !== 'completed' && setWinner(m.id, 'blue')}
                      >
                        <div className={`w-16 h-16 rounded-full border-4 overflow-hidden mb-2 transition-all ${m.winner === 'blue' ? 'border-yellow-500 ring-4 ring-yellow-500/20' : 'border-blue-500 group-hover:border-blue-400'}`}>
                          <img src={m.blueCorner.photoUrl} alt={m.blueCorner.name} className="w-full h-full object-cover" />
                        </div>
                        <p className={`font-bold ${m.winner === 'blue' ? 'text-yellow-500' : ''}`}>{m.blueCorner.name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setLEDView('combat', m.id)}
                        className={`px-4 py-2 rounded-lg flex items-center gap-2 transition-colors ${settings?.activeId === m.id ? 'bg-red-600 text-white' : 'bg-slate-800 hover:bg-slate-700 text-slate-400'}`}
                      >
                        <Play className="w-4 h-4" /> Chiếu LED
                      </button>
                      <button onClick={() => deleteDoc(doc(db, 'matches', m.id))} className="p-2 bg-slate-800 text-slate-400 hover:bg-red-900/40 hover:text-red-500 rounded-lg transition-colors">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  
                  {m.status !== 'completed' && (
                    <div className="flex gap-2">
                      <button onClick={() => setWinner(m.id, 'red')} className="flex-1 bg-red-600/20 hover:bg-red-600 text-red-500 hover:text-white py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2">
                        <Trophy className="w-4 h-4" /> Thắng (Đỏ)
                      </button>
                      <button onClick={() => setWinner(m.id, 'blue')} className="flex-1 bg-blue-600/20 hover:bg-blue-600 text-blue-500 hover:text-white py-2 rounded-lg font-bold transition-all flex items-center justify-center gap-2">
                        <Trophy className="w-4 h-4" /> Thắng (Xanh)
                      </button>
                    </div>
                  )}
                  {m.status === 'completed' && (
                    <div className={`text-center py-2 rounded-lg font-bold ${m.winner === 'red' ? 'bg-red-600' : 'bg-blue-600'}`}>
                      WINNER: {m.winner === 'red' ? m.redCorner.name : m.blueCorner.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="bg-slate-900 p-8 rounded-2xl border border-slate-800 text-center">
            <h2 className="text-2xl font-bold mb-6">Điều khiển chung</h2>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setLEDView('idle')}
                className="bg-slate-800 hover:bg-slate-700 px-8 py-4 rounded-xl font-bold transition-all"
              >
                Màn hình chờ
              </button>
              <button 
                onClick={async () => {
                  const batch = performances.map(p => updateDoc(doc(db, 'performances', p.id), { scores: {}, averageScore: 0 }));
                  await Promise.all(batch);
                }}
                className="bg-red-900/20 hover:bg-red-600 text-red-500 hover:text-white px-8 py-4 rounded-xl font-bold transition-all"
              >
                Reset tất cả điểm
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button 
      onClick={onClick}
      className={`flex items-center gap-2 px-6 py-2 rounded-lg font-medium transition-all ${active ? 'bg-slate-800 text-white shadow-lg' : 'text-slate-500 hover:text-slate-300'}`}
    >
      {icon}
      {label}
    </button>
  );
}
