import React, { useState, useEffect } from "react";

const quotes = [
  "🚀 Menyiapkan data penjualan terbaik Anda...",
  "💰 Closing adalah seni, dan Anda senimannya...",
  "📈 Menganalisa peluang profit hari ini...",
  "☕ Seduh kopi dulu, data sedang dimuat...",
  "🔥 Sales yang hebat tidak menunggu peluang, tapi menciptakannya...",
  "💎 Menghubungkan ke Database Railway...",
];

export default function LoadingScreen() {
  const [quoteIndex, setQuoteIndex] = useState(0);
  const [isDark, setIsDark] = useState(false); // Default Light biar aman

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme"); 
    const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

    if (savedTheme === "dark" || (!savedTheme && systemDark)) {
      setIsDark(true);
    } else {
      setIsDark(false); 
    }
  }, []);


  useEffect(() => {
    const interval = setInterval(() => {
      setQuoteIndex((prev) => (prev + 1) % quotes.length);
    }, 2500);
    return () => clearInterval(interval);
  }, []);

  // 3. DEFINE WARNA MANUAL (Supaya tidak tergantung parent class)
  const colors = {
    bg: isDark ? "bg-slate-900" : "bg-white",
    textMain: isDark ? "text-slate-300" : "text-slate-600",
    textSub: isDark ? "text-slate-500" : "text-slate-400",
    ringOuter: isDark ? "border-indigo-900/30" : "border-indigo-100",
    circleInner: isDark ? "bg-slate-800 border-indigo-700" : "bg-indigo-50 border-indigo-100",
    barBg: isDark ? "bg-slate-800" : "bg-slate-100"
  };

  return (
    <div className={`fixed inset-0 z-[9999] flex flex-col items-center justify-center transition-colors duration-300 ${colors.bg}`}>
      
      {/* 1. ANIMASI LOGO */}
      <div className="relative flex items-center justify-center mb-8">
        {/* Ring Luar */}
        <div className={`absolute w-32 h-32 rounded-full border-4 border-t-indigo-600 animate-spin ${colors.ringOuter}`}></div>
        
        {/* Lingkaran Tengah */}
        <div className={`w-24 h-24 rounded-full flex items-center justify-center shadow-lg animate-pulse relative z-10 border ${colors.circleInner}`}>
          <span className="text-4xl">💎</span>
        </div>

        {/* Glow Effect */}
        <div className="absolute w-20 h-20 bg-indigo-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
      </div>

      {/* 2. LOADING BAR */}
      <div className={`w-64 h-1.5 rounded-full overflow-hidden mb-6 relative ${colors.barBg}`}>
        <div className="absolute top-0 left-0 h-full bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-500 w-1/2 rounded-full animate-indeterminate"></div>
      </div>

      {/* 3. KATA-KATA MOTIVASI */}
      <div className="h-10 flex items-center justify-center max-w-md px-4">
        <p className={`text-sm font-medium text-center animate-fade-in transition-all duration-500 ${colors.textMain}`}>
          {quotes[quoteIndex]}
        </p>
      </div>

      {/* Footer */}
      <div className={`absolute bottom-10 text-xs opacity-70 ${colors.textSub}`}>
        JMK Sales Dashboard
      </div>
    </div>
  );
}