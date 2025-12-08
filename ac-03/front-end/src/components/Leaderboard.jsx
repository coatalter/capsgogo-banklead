import React, { useEffect, useState } from "react";
import { fetchLeaderboard } from "../services/leadsService";

export default function Leaderboard() {
  const [leaders, setLeaders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchLeaderboard();
        setLeaders(data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    load();
    const interval = setInterval(load, 15000); 
    return () => clearInterval(interval);
  }, []);

  // --- LOGIC STYLE BARU (TRANSPARAN / GLASS EFFECT) ---
  const getRankStyle = (index) => {
    // JUARA 1: Emas (Yellow/Amber)
    if (index === 0) return { 
      // Background transparan (10%), Border transparan (50%)
      container: "bg-yellow-500/10 border-yellow-500/50 shadow-[0_0_15px_rgba(234,179,8,0.1)]", 
      iconColor: "text-yellow-500", 
      ptsColor: "text-yellow-600 dark:text-yellow-400",
      icon: "👑" 
    };
    
    // JUARA 2: Perak (Slate/Gray)
    if (index === 1) return { 
      container: "bg-slate-400/10 border-slate-400/50", 
      iconColor: "text-slate-400", 
      ptsColor: "text-slate-600 dark:text-slate-300",
      icon: "🥈" 
    };
    
    // JUARA 3: Perunggu (Orange)
    if (index === 2) return { 
      container: "bg-orange-500/10 border-orange-500/50", 
      iconColor: "text-orange-500", 
      ptsColor: "text-orange-600 dark:text-orange-400",
      icon: "🥉" 
    };
    
    // SISANYA: Polos Transparan
    return { 
      container: "bg-transparent border-transparent hover:bg-slate-500/5", 
      iconColor: "text-slate-400 font-medium text-sm", 
      ptsColor: "text-indigo-600 dark:text-indigo-400",
      icon: `#${index + 1}` 
    };
  };

  return (
    // Container Utama: Pastikan class 'card' di CSS kamu mengatur background dasar (putih/hitam)
    <div className="card h-full flex flex-col relative overflow-hidden">
      
      {/* Header dengan Hiasan Dot */}
      <div className="flex items-center justify-between mb-6 z-10 relative">
        <div>
          <h3 className="font-bold text-main text-lg">Top Champions</h3>
          <p className="text-xs text-muted">Sales terbaik bulan ini</p>
        </div>
        
        {/* Indikator Live (Pulse Hijau) */}
        <div className="flex items-center gap-2 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">Live</span>
        </div>
      </div>

      {/* List Leaderboard */}
      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-3 z-10 relative">
        
        {loading && leaders.length === 0 && (
          <div className="text-center text-muted text-sm py-10 animate-pulse">Memuat data...</div>
        )}

        {!loading && leaders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 opacity-60">
            <span className="text-4xl mb-2">🏆</span>
            <p className="text-sm text-muted">Belum ada data.</p>
          </div>
        )}

        {leaders.slice(0, 10).map((leader, index) => {
          const style = getRankStyle(index);
          
          return (
            <div 
              key={index} 
              className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${style.container}`}
            >
              {/* Rank Icon */}
              <div className={`w-8 flex-shrink-0 flex justify-center text-xl ${style.iconColor}`}>
                {style.icon}
              </div>

              {/* Avatar (Inisial Nama) */}
              <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-sm bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500`}>
                  {leader.avatar}
                </div>
                {/* Border Ring untuk Avatar */}
                {index < 3 && (
                   <div className="absolute inset-0 rounded-full border-2 border-white/20"></div>
                )}
              </div>

              {/* Nama & Closing Info */}
              <div className="flex-1 min-w-0 ml-1">
                <h4 className="font-bold text-main text-sm truncate leading-tight">
                  {leader.name}
                </h4>
                <div className="text-xs text-muted flex items-center gap-1 mt-0.5">
                  <span className={`font-semibold ${style.ptsColor}`}>
                    {leader.deals}
                  </span> 
                  <span>Closing</span>
                </div>
              </div>

              {/* Points Badge */}
              <div className="text-right">
                <div className="flex flex-col items-end">
                   <span className={`font-extrabold text-sm ${style.ptsColor}`}>
                     {leader.score}
                   </span>
                   <span className="text-[9px] text-muted font-bold uppercase tracking-wide opacity-70">
                     PTS
                   </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}