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

  const getRankStyle = (index) => {
    // Rank Style (Color Coding ok di-hardcode karena maknanya universal)
    if (index === 0) return { 
      container: "bg-yellow-500/10 border-yellow-500/50 shadow-sm", 
      iconColor: "text-yellow-600", 
      icon: "👑" 
    };
    if (index === 1) return { 
      container: "bg-slate-400/10 border-slate-400/50", 
      iconColor: "text-slate-500", 
      icon: "🥈" 
    };
    if (index === 2) return { 
      container: "bg-orange-500/10 border-orange-500/50", 
      iconColor: "text-orange-500", 
      icon: "🥉" 
    };
    
    // Default Rank (Gunakan Semantic Class)
    return { 
      container: "bg-transparent border-transparent hover:bg-hover", 
      iconColor: "text-muted font-bold", 
      icon: `#${index + 1}` 
    };
  };

  return (
    <div className="card h-full flex flex-col relative overflow-hidden">
      <div className="flex items-center justify-between mb-6 z-10 relative">
        <div>
          <h3 className="font-bold text-main text-lg">Top Champions</h3>
          <p className="text-xs text-muted">Sales terbaik bulan ini</p>
        </div>
        <div className="flex items-center gap-2 bg-emerald-500/10 px-2 py-1 rounded-full border border-emerald-500/20">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Live</span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto pr-1 custom-scrollbar space-y-3 z-10 relative">
        {loading && leaders.length === 0 && <div className="text-center text-muted text-sm py-10 animate-pulse">Memuat data...</div>}
        {!loading && leaders.length === 0 && (
          <div className="flex flex-col items-center justify-center py-10 opacity-60">
            <span className="text-4xl mb-2">💤</span>
            <p className="text-sm text-muted">Belum ada data.</p>
          </div>
        )}

        {leaders.slice(0, 10).map((leader, index) => {
          const style = getRankStyle(index);
          return (
            <div key={index} className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-300 ${style.container}`}>
              <div className={`w-8 flex-shrink-0 flex justify-center text-xl ${style.iconColor}`}>{style.icon}</div>
              <div className="relative">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-sm bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500`}>
                  {leader.avatar}
                </div>
              </div>
              <div className="flex-1 min-w-0 ml-1">
                <h4 className="font-bold text-main text-sm truncate leading-tight">{leader.name}</h4>
                <div className="text-xs text-muted flex items-center gap-1 mt-0.5">
                  <span className="font-bold text-main">{leader.deals}</span> Closing
                </div>
              </div>
              <div className="text-right">
                <div className="flex flex-col items-end">
                   <span className="font-extrabold text-sm text-indigo-600">{leader.score}</span>
                   <span className="text-[9px] text-muted font-bold uppercase tracking-wide opacity-70">PTS</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}