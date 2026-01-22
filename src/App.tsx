import React, { useState, useEffect } from 'react';
import { Music, MapPin, MessageCircle, Heart, Share2, ChevronUp, Star, Camera, Play, Lock, Sparkles, PenTool, Calendar, Clock } from 'lucide-react';

/**
 * --- 配置区域 ---
 * 在这里修改你的数据
 */
const MOCK_DATA = {
  names: ["张诚", "刘王睿"],
  startDate: "2024-05-20", // 建议修改为真实的开始日期
  totalDays: 320,
  messages: {
    total: 5210, // 稍微改大了一点，显得数据更丰富
    lateNight: 42,
    mostUsed: "想你",
    topEmoji: "❤️"
  },
  travel: {
    km: 2340,
    cities: ["南京", "哈尔滨", "上海", "长白山"],
    trips: 4
  },
  dimensions: [
    { label: "干饭力", value: 100 }, // 已修复：Max -> 100
    { label: "包容度", value: 99 },
    { label: "钞能力", value: 70 },
    { label: "粘人度", value: 99 },
    { label: "幽默感", value: 85 },
  ],
  moodCurve: [30, 45, 40, 60, 55, 70, 65, 80, 85, 80, 95, 100]
};

// --- Gemini API 集成 ---
const generateLoveLetter = async (setLetter: (s: string) => void, setLoading: (b: boolean) => void) => {
  const apiKey = ""; // ⚠️ 记得在这里填入你的 Gemini API Key，否则无法生成情书
  setLoading(true);
  setLetter(""); 

  const prompt = `
    你是一位深情且幽默的恋爱记录官。请为 ${MOCK_DATA.names[0]} 写一封给 ${MOCK_DATA.names[1]} 的简短情书（100字）：
    - 在一起 ${MOCK_DATA.totalDays} 天。
    - 去过 ${MOCK_DATA.travel.cities.join('、')}。
    - 关键词：${MOCK_DATA.messages.mostUsed}、粘人、干饭。
    要求：风格温馨带点幽默，无需标题，结尾升华。
  `;

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ contents: [{ parts: [{ text: prompt }] }] }),
      }
    );
    const data = await response.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text || "亲爱的，AI 害羞了，但我的心意不变。";
    
    let i = 0;
    setLoading(false);
    const interval = setInterval(() => {
      setLetter((prev) => prev + text.charAt(i));
      i++;
      if (i >= text.length) clearInterval(interval);
    }, 50); 
  } catch (error) {
    console.error("Gemini API Error:", error);
    setLetter("亲爱的，虽然网络断了，但我们的红线永远连着。❤️");
    setLoading(false);
  }
};

// --- 子组件 ---

// 隐私锁屏
const LockScreen = ({ onUnlock }: { onUnlock: () => void }) => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  const [shake, setShake] = useState(false);

  const handleUnlock = () => {
    if (password === "20050615") {
      onUnlock();
    } else {
      setError(true);
      setShake(true);
      setPassword("");
      setTimeout(() => { setError(false); setShake(false); }, 500);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black flex flex-col items-center justify-center p-6 text-white bg-[url('https://grainy-gradients.vercel.app/noise.svg')]">
      <div className={`mb-8 p-6 bg-white/5 rounded-full border border-white/10 backdrop-blur-xl ${shake ? 'animate-shake' : ''}`}>
        {error ? <Lock className="text-red-400" size={48} /> : <Lock className="text-white/80" size={48} />}
      </div>
      <div className="space-y-2 text-center mb-8">
        <h2 className="text-2xl font-light tracking-widest">PRIVATE MEMORY</h2>
        <p className="text-xs text-white/40 uppercase tracking-[0.2em]">Enter Passcode</p>
      </div>
      <div className="flex gap-4 mb-8">
        {[0, 1, 2, 3, 4, 5, 6, 7].map((i) => (
          <div key={i} className={`w-3 h-3 rounded-full transition-all duration-300 ${i < password.length ? 'bg-white scale-110' : 'bg-white/20'}`} />
        ))}
      </div>
      <div className="grid grid-cols-3 gap-6 w-full max-w-[280px]">
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((num) => (
          <button key={num} onClick={() => password.length < 8 && setPassword(p => p + num)} className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-xl font-light active:scale-95 transition-all">
            {num}
          </button>
        ))}
        <div className="w-16 h-16" />
        <button onClick={() => password.length < 8 && setPassword(p => p + 0)} className="w-16 h-16 rounded-full bg-white/5 hover:bg-white/10 border border-white/5 flex items-center justify-center text-xl font-light active:scale-95 transition-all">0</button>
        <button onClick={() => setPassword(p => p.slice(0, -1))} className="w-16 h-16 flex items-center justify-center text-sm text-white/50 active:scale-95">删除</button>
      </div>
      <button onClick={handleUnlock} disabled={password.length !== 8} className={`mt-10 px-12 py-3 rounded-full font-bold tracking-widest transition-all duration-300 ${password.length === 8 ? 'bg-white text-black hover:scale-105' : 'bg-white/10 text-white/30 cursor-not-allowed'}`}>UNLOCK</button>
      <style>{`@keyframes shake { 0%, 100% { transform: translateX(0); } 25% { transform: translateX(-10px); } 75% { transform: translateX(10px); } } .animate-shake { animation: shake 0.4s ease-in-out; }`}</style>
    </div>
  );
};

// 音乐播放器
const AudioPlayer = ({ isPlaying, togglePlay }: { isPlaying: boolean; togglePlay: () => void }) => (
  <div className="fixed top-4 right-4 z-50 flex items-center justify-center w-10 h-10 bg-black/30 backdrop-blur-md rounded-full border border-white/20 cursor-pointer hover:scale-110 transition-transform" onClick={togglePlay}>
    <div className={`w-full h-full flex items-center justify-center ${isPlaying ? 'animate-spin-slow' : ''}`}>
      {isPlaying ? <Music size={18} className="text-white" /> : <div className="w-0.5 h-4 bg-white/50 -rotate-45" />}
    </div>
  </div>
);

// 幻灯片容器
const SlideContainer = ({ children, isActive }: { children: React.ReactNode; isActive: boolean }) => (
  <div className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out flex flex-col items-center justify-center p-6 overflow-hidden ${isActive ? 'opacity-100 translate-y-0 pointer-events-auto blur-0 scale-100' : 'opacity-0 translate-y-10 pointer-events-none blur-sm scale-95'}`}>
    {isActive && children}
  </div>
);

// --- 页面组件 ---

// 1. 封面页 (高级杂志风)
const CoverSlide = ({ start }: { start: () => void }) => (
  <div className="h-full flex flex-col items-center justify-between py-20 relative z-10 w-full">
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-pink-500/30 blur-[100px] rounded-full -z-10"></div>
    <div className="space-y-3 text-center animate-blur-in" style={{animationDelay: '0.2s'}}>
      <h2 className="text-xs font-light tracking-[0.5em] text-pink-200 uppercase">Love Report</h2>
      <h1 className="text-4xl font-serif font-bold text-white tracking-wider">
        {MOCK_DATA.names[0]} <span className="text-pink-400 font-light">&</span> {MOCK_DATA.names[1]}
      </h1>
    </div>
    
    {/* 拍立得效果：请替换 src 为你的合照 */}
    <div className="relative w-64 h-80 animate-float-slow group cursor-pointer">
      <div className="absolute inset-0 bg-white p-3 pb-12 rotate-[-3deg] shadow-2xl transition-transform group-hover:rotate-0 duration-700 ease-out">
         <img src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?q=80&w=600&fit=crop" alt="Cover" className="w-full h-full object-cover filter grayscale group-hover:grayscale-0 transition-all duration-700" />
         <div className="absolute bottom-4 left-0 w-full text-center font-serif text-black/60 text-xs italic">
            Since {MOCK_DATA.startDate}
         </div>
      </div>
    </div>

    <button onClick={start} className="animate-blur-in opacity-0" style={{animationDelay: '1s'}}>
      <div className="flex flex-col items-center gap-2">
        <span className="text-[10px] tracking-widest text-white/50 uppercase">Tap to open</span>
        <div className="w-14 h-14 rounded-full border border-white/20 bg-white/5 backdrop-blur-md flex items-center justify-center hover:bg-white hover:text-black transition-all duration-500 hover:scale-110">
          <Play size={20} className="ml-1 fill-current" />
        </div>
      </div>
    </button>
  </div>
);

// 2. 聊天统计
const ChatStatsSlide = () => (
  <div className="w-full max-w-md space-y-8">
    <div className="text-left space-y-2 animate-slide-in-left">
      <h3 className="text-3xl font-serif text-white flex items-center gap-3">
        <MessageCircle className="text-blue-400" /> 默契时刻
      </h3>
      <div className="h-0.5 w-16 bg-blue-400/50"></div>
    </div>
    <div className="grid grid-cols-2 gap-4">
      <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 animate-scale-up" style={{animationDelay: '0.2s'}}>
        <div className="text-3xl font-bold text-blue-300 font-serif">{MOCK_DATA.messages.total.toLocaleString()}</div>
        <div className="text-xs text-white/40 mt-1 uppercase tracking-wider">Messages</div>
      </div>
      <div className="bg-white/5 backdrop-blur-sm p-5 rounded-2xl border border-white/10 animate-scale-up" style={{animationDelay: '0.3s'}}>
        <div className="text-3xl font-bold text-purple-300 font-serif">{MOCK_DATA.messages.lateNight}</div>
        <div className="text-xs text-white/40 mt-1 uppercase tracking-wider">Late Nights</div>
      </div>
    </div>
    <div className="bg-white/5 backdrop-blur-md p-6 rounded-3xl border border-white/10 animate-blur-in" style={{animationDelay: '0.5s'}}>
      <p className="text-white/80 leading-loose text-sm font-light">
        这一年，我们的高频词是
        <span className="text-2xl font-serif text-pink-400 mx-2 italic">"{MOCK_DATA.messages.mostUsed}"</span>
        <br/>
        每一个字都是爱的证据。
      </p>
    </div>
  </div>
);

// 3. (新增) 时光轴
const TimelineSlide = () => {
  const events = [
    { date: "2024.03.08", title: "我们的故事开始", icon: <Calendar size={16}/> },
    { date: "2024.05.20", title: "第一个 520", icon: <Heart size={16}/> },
    { date: "2024.10.01", title: "长白山看雪", icon: <MapPin size={16}/> },
    { date: "2025.01.01", title: "跨年拥抱", icon: <Sparkles size={16}/> }
  ];
  return (
    <div className="w-full max-w-md px-4">
       <div className="text-left mb-8 animate-slide-in-left">
        <h3 className="text-3xl font-serif text-white">Timeline</h3>
        <p className="text-xs text-white/40 uppercase tracking-widest mt-1">Our Journey</p>
      </div>
      <div className="relative border-l border-white/10 ml-3 space-y-8 py-2">
        {events.map((ev, i) => (
          <div key={i} className="relative pl-8 animate-blur-in" style={{animationDelay: `${0.2 + i * 0.1}s`}}>
            <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 bg-pink-500 rounded-full ring-4 ring-black"></div>
            <div className="bg-white/5 border border-white/5 p-4 rounded-xl backdrop-blur-sm hover:bg-white/10 transition-colors">
              <div className="flex items-center gap-2 text-pink-300 text-xs font-mono mb-1">
                {ev.icon} {ev.date}
              </div>
              <div className="text-base font-bold text-white/90">{ev.title}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// 4. 足迹地图
const TravelSlide = () => (
  <div className="w-full max-w-md space-y-6">
    <div className="text-left space-y-2 animate-slide-in-left">
      <h3 className="text-3xl font-serif text-white flex items-center gap-3">
        <MapPin className="text-green-400" /> 共同足迹
      </h3>
      <div className="h-0.5 w-16 bg-green-400/50"></div>
    </div>
    <div className="relative h-64 w-full bg-white/5 rounded-3xl border border-white/10 overflow-hidden animate-blur-in" style={{animationDelay: '0.2s'}}>
      <svg className="absolute inset-0 w-full h-full opacity-30" viewBox="0 0 100 100">
        <path d="M20,50 Q40,20 60,40 T90,30" fill="none" stroke="white" strokeWidth="0.5" strokeDasharray="2,2" />
        <circle cx="20" cy="50" r="2" fill="#4ade80" className="animate-ping-slow" />
        <circle cx="90" cy="30" r="2" fill="#4ade80" className="animate-ping-slow" style={{animationDelay: '1s'}} />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-5xl font-serif font-bold text-white tracking-tighter">{MOCK_DATA.travel.km}</div>
        <div className="text-xs text-green-300 uppercase tracking-[0.3em] mt-2">Kilometers</div>
      </div>
    </div>
    <div className="flex flex-wrap gap-2 animate-fade-in-up" style={{animationDelay: '0.4s'}}>
      {MOCK_DATA.travel.cities.map((city) => (
        <span key={city} className="px-4 py-1.5 bg-white/10 rounded-full text-xs text-white/80 border border-white/5 backdrop-blur-md">
          {city}
        </span>
      ))}
    </div>
  </div>
);

// 5. (新增) 照片回忆墙
const PhotoGallerySlide = () => (
  <div className="w-full h-full flex flex-col justify-center px-4">
    <div className="mb-8 text-center animate-blur-in">
      <h3 className="text-2xl font-serif italic text-white/90">Frozen Moments</h3>
      <div className="w-8 h-0.5 bg-white/30 mx-auto mt-2"></div>
    </div>
    <div className="grid grid-cols-2 gap-3 rotate-1 hover:rotate-0 transition-transform duration-700 ease-out">
      {/* 记得替换这里的图片链接 */}
      <div className="col-span-2 h-48 bg-gray-800 rounded-2xl overflow-hidden relative shadow-lg animate-scale-up" style={{animationDelay: '0.1s'}}>
        <img src="https://images.unsplash.com/photo-1511895426328-dc8714191300?w=600&fit=crop" className="w-full h-full object-cover opacity-90 hover:scale-110 transition-transform duration-1000" />
        <span className="absolute bottom-3 right-3 text-[10px] bg-black/40 px-2 py-1 rounded backdrop-blur text-white/90">Best Memory</span>
      </div>
      <div className="h-36 bg-gray-800 rounded-2xl overflow-hidden shadow-lg animate-scale-up" style={{animationDelay: '0.3s'}}>
         <img src="https://images.unsplash.com/photo-1523438885200-e635ba2c371e?w=400&fit=crop" className="w-full h-full object-cover opacity-90 hover:scale-110 transition-transform duration-1000" />
      </div>
      <div className="h-36 bg-gray-800 rounded-2xl overflow-hidden shadow-lg animate-scale-up" style={{animationDelay: '0.5s'}}>
         <img src="https://images.unsplash.com/photo-1621621667797-e06afc217fb0?w=400&fit=crop" className="w-full h-full object-cover opacity-90 hover:scale-110 transition-transform duration-1000" />
      </div>
    </div>
    <p className="text-center text-[10px] text-white/30 mt-6 uppercase tracking-widest animate-blur-in" style={{animationDelay: '0.8s'}}>
      Collected {MOCK_DATA.travel.trips * 45} Moments
    </p>
  </div>
);

// 6. 情绪曲线
const MoodSlide = () => {
  const points = MOCK_DATA.moodCurve.map((val, i) => {
    const x = (i / (MOCK_DATA.moodCurve.length - 1)) * 100;
    const y = 100 - val;
    return `${x},${y}`;
  }).join(' ');
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-left space-y-2 animate-slide-in-left">
        <h3 className="text-3xl font-serif text-white flex items-center gap-3"><Star className="text-yellow-400" /> 心动频率</h3>
      </div>
      <div className="relative h-60 w-full bg-gradient-to-b from-white/10 to-transparent rounded-2xl border border-white/5 p-4 animate-blur-in" style={{animationDelay: '0.2s'}}>
        <svg className="w-full h-full" viewBox="0 0 100 100" preserveAspectRatio="none">
          <polygon points={`0,100 ${points} 100,100`} fill="url(#grad1)" opacity="0.4" />
          <polyline points={points} fill="none" stroke="#fbbf24" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
          <defs>
            <linearGradient id="grad1" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#fbbf24" stopOpacity="1" />
              <stop offset="100%" stopColor="#fbbf24" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
        <div className="absolute top-4 right-4 bg-yellow-400/20 text-yellow-300 text-[10px] px-2 py-1 rounded backdrop-blur-sm border border-yellow-400/30">Peak Love</div>
      </div>
      <p className="text-white/60 text-sm animate-fade-in-up" style={{animationDelay: '0.4s'}}>虽然有过波折，但爱意在磨合中螺旋上升。</p>
    </div>
  );
};

// 7. 雷达图
const RadarSlide = () => {
  const size = 200, center = size / 2, radius = 80, angleSlice = (Math.PI * 2) / 5;
  const points = MOCK_DATA.dimensions.map((d, i) => {
    const angle = i * angleSlice - Math.PI / 2;
    const r = (d.value / 100) * radius;
    return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
  }).join(' ');
  return (
    <div className="w-full max-w-md space-y-6 flex flex-col items-center">
      <div className="w-full text-left animate-slide-in-left">
        <h3 className="text-3xl font-serif text-white flex items-center gap-3"><Camera className="text-red-400" /> 恋爱六边形</h3>
      </div>
      <div className="relative w-64 h-64 flex items-center justify-center animate-scale-up" style={{animationDelay: '0.2s'}}>
        <svg width={size} height={size} className="overflow-visible">
          {[0.2, 0.4, 0.6, 0.8, 1].map((scale) => (
             <polygon key={scale} points={MOCK_DATA.dimensions.map((d, i) => {
                 const angle = i * angleSlice - Math.PI / 2;
                 const r = radius * scale;
                 return `${center + r * Math.cos(angle)},${center + r * Math.sin(angle)}`;
             }).join(' ')} fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />
          ))}
          <polygon points={points} fill="rgba(248, 113, 113, 0.5)" stroke="#f87171" strokeWidth="2" />
          {MOCK_DATA.dimensions.map((d, i) => {
             const angle = i * angleSlice - Math.PI / 2, r = radius + 25;
             return (
               <text key={i} x={center + r * Math.cos(angle)} y={center + r * Math.sin(angle)} textAnchor="middle" dominantBaseline="middle" fill="rgba(255,255,255,0.9)" fontSize="11" className="font-bold">{d.label}</text>
             );
          })}
        </svg>
      </div>
      <div className="bg-white/10 px-8 py-3 rounded-full text-sm text-white/90 animate-fade-in-up border border-white/5 backdrop-blur-md">
        结论：我们是 <span className="font-bold text-red-300">天生一对</span>
      </div>
    </div>
  );
};

// 8. AI 情书
const LoveLetterSlide = () => {
  const [letter, setLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);
  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-left animate-slide-in-left">
        <h3 className="text-3xl font-serif text-white flex items-center gap-3"><Sparkles className="text-purple-400" /> AI 专属情书</h3>
      </div>
      {!hasGenerated ? (
        <div className="h-64 flex flex-col items-center justify-center space-y-6 animate-fade-in-up">
           <p className="text-white/60 text-center text-sm px-8 font-light">AI 正在阅读我们 {MOCK_DATA.totalDays} 天的回忆...</p>
           <button onClick={() => { setHasGenerated(true); generateLoveLetter(setLetter, setLoading); }} className="group relative px-8 py-3 bg-white text-black rounded-full font-bold flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_20px_rgba(255,255,255,0.3)]">
             <Sparkles size={18} className="text-purple-600 group-hover:animate-spin" /> 生成情书
           </button>
        </div>
      ) : (
        <div className="bg-white/10 backdrop-blur-md p-8 rounded-xl border border-white/10 min-h-[300px] relative animate-blur-in">
          <PenTool size={16} className="absolute top-4 right-4 text-white/20" />
          {loading && letter.length === 0 && <div className="absolute inset-0 flex items-center justify-center"><div className="animate-pulse text-white/50 text-sm">正在构思...</div></div>}
          <div className="font-serif leading-loose text-white/90 whitespace-pre-wrap text-sm tracking-wide">
            {letter}{loading && <span className="inline-block w-1 h-4 bg-white ml-1 animate-pulse"/>}
          </div>
        </div>
      )}
    </div>
  );
}

// 9. 结尾
const EndingSlide = () => (
  <div className="w-full max-w-md h-full flex flex-col justify-between py-16 text-center">
    <div className="space-y-6 animate-blur-in">
      <div className="w-28 h-28 bg-gradient-to-tr from-pink-500 to-purple-600 rounded-full mx-auto flex items-center justify-center shadow-[0_0_40px_rgba(236,72,153,0.4)]">
        <span className="text-4xl font-serif font-bold text-white">{MOCK_DATA.totalDays}</span>
      </div>
      <div>
        <h2 className="text-2xl font-bold text-white tracking-wide">Days Together</h2>
        <p className="text-white/40 text-xs mt-2 uppercase tracking-widest">{MOCK_DATA.startDate} — FOREVER</p>
      </div>
      <p className="text-white/80 font-serif italic px-8">"斯人若彩虹，遇上方知有。"</p>
    </div>
    <div className="space-y-4 w-full animate-fade-in-up" style={{animationDelay: '0.4s'}}>
      <button className="w-full py-4 bg-white text-black rounded-xl font-bold shadow-lg flex items-center justify-center gap-2 hover:scale-[1.02] transition-transform">
        <Share2 size={18} /> 生成分享图
      </button>
      <p className="text-[10px] text-white/20 uppercase tracking-widest">Designed for Love · 2025</p>
    </div>
  </div>
);

// --- 主程序 ---
export default function App() {
  const [isLocked, setIsLocked] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [touchStart, setTouchStart] = useState(0);
  const [touchEnd, setTouchEnd] = useState(0);
  
  const slides = [
    { id: 0, component: <CoverSlide start={() => setCurrentSlide(1)} /> },
    { id: 1, component: <ChatStatsSlide /> },
    { id: 2, component: <TimelineSlide /> }, // 新页面
    { id: 3, component: <TravelSlide /> },
    { id: 4, component: <PhotoGallerySlide /> }, // 新页面
    { id: 5, component: <MoodSlide /> },
    { id: 6, component: <RadarSlide /> },
    { id: 7, component: <LoveLetterSlide /> },
    { id: 8, component: <EndingSlide /> },
  ];

  const handleTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    if (distance > 50 && currentSlide < slides.length - 1) setCurrentSlide(c => c + 1);
    if (distance < -50 && currentSlide > 0) setCurrentSlide(c => c - 1);
    setTouchEnd(0); setTouchStart(0);
  };

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown' && currentSlide < slides.length - 1) setCurrentSlide(c => c + 1);
      if (e.key === 'ArrowUp' && currentSlide > 0) setCurrentSlide(c => c - 1);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentSlide]);

  if (isLocked) return <LockScreen onUnlock={() => setIsLocked(false)} />;

  return (
    <div className="relative w-full h-screen bg-[#050505] overflow-hidden font-sans select-none text-white">
      {/* 动态背景 */}
      <div className="absolute inset-0 z-0">
        <div className={`absolute top-[-20%] left-[-20%] w-[80%] h-[80%] bg-purple-900/30 rounded-full blur-[120px] animate-blob transition-colors duration-1000 ${currentSlide % 2 === 0 ? 'bg-purple-900/30' : 'bg-blue-900/30'}`}></div>
        <div className={`absolute bottom-[-20%] right-[-20%] w-[80%] h-[80%] bg-pink-900/30 rounded-full blur-[120px] animate-blob animation-delay-2000 transition-colors duration-1000 ${currentSlide % 2 === 0 ? 'bg-pink-900/30' : 'bg-green-900/30'}`}></div>
        <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30 brightness-100 contrast-150 mix-blend-overlay"></div>
      </div>

      <AudioPlayer isPlaying={isPlaying} togglePlay={() => setIsPlaying(!isPlaying)} />
      
      <div className="fixed right-0 top-1/2 -translate-y-1/2 z-40 flex flex-col gap-4 px-4">
        {slides.map((_, idx) => (
          <div key={idx} className={`w-1 h-1 rounded-full transition-all duration-500 ${idx === currentSlide ? 'bg-white scale-150 opacity-100' : 'bg-white/30 opacity-50'}`} />
        ))}
      </div>

      <div className="relative z-10 w-full h-full" onTouchStart={(e) => setTouchStart(e.targetTouches[0].clientY)} onTouchMove={(e) => setTouchEnd(e.targetTouches[0].clientY)} onTouchEnd={handleTouchEnd}>
        {slides.map((slide, index) => (
          <SlideContainer key={slide.id} isActive={currentSlide === index}>
            {slide.component}
          </SlideContainer>
        ))}
      </div>

      <style>{`
        @keyframes blurIn { from { opacity: 0; filter: blur(20px); transform: scale(1.1); } to { opacity: 1; filter: blur(0); transform: scale(1); } }
        .animate-blur-in { animation: blurIn 1.2s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(40px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-in-up { animation: fadeInUp 1s cubic-bezier(0.16, 1, 0.3, 1) forwards; opacity: 0; }
        
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-50px); } to { opacity: 1; transform: translateX(0); } }
        .animate-slide-in-left { animation: slideInLeft 1s cubic-bezier(0.34, 1.56, 0.64, 1) forwards; opacity: 0; }
        
        @keyframes scaleUp { from { opacity: 0; transform: scale(0.8); } to { opacity: 1; transform: scale(1); } }
        .animate-scale-up { animation: scaleUp 0.8s ease-out forwards; opacity: 0; }
        
        @keyframes floatSlow { 0%, 100% { transform: rotate(-3deg) translateY(0); } 50% { transform: rotate(1deg) translateY(-10px); } }
        .animate-float-slow { animation: floatSlow 6s ease-in-out infinite; }
        
        @keyframes blob { 0% { transform: translate(0px, 0px) scale(1); } 33% { transform: translate(30px, -50px) scale(1.1); } 66% { transform: translate(-20px, 20px) scale(0.9); } 100% { transform: translate(0px, 0px) scale(1); } }
        .animate-blob { animation: blob 15s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        
        .animate-spin-slow { animation: spin 8s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        
        .animate-ping-slow { animation: ping 2s cubic-bezier(0, 0, 0.2, 1) infinite; }
        @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
      `}</style>
    </div>
  );
}