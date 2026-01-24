import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Music, Lock, ChevronDown, MapPin, Calendar, Star, Coffee, Snowflake, Loader2, Sparkles, Cloud, Home, Sun } from 'lucide-react';
import { useAudio } from 'react-use';
import { RoughCard } from './components/RoughCard';

// ==========================================
// 1. 数据配置区
// ==========================================
const ASSETS_PATH = 'https://ccrr0506.github.io/LoveReport/assets';
const CONFIG = {
  audio: {
    bgm: `${ASSETS_PATH}/audio/bgm.mp3`,
    success: `${ASSETS_PATH}/audio/success.mp3`,
    fail: `${ASSETS_PATH}/audio/fail.mp3`,
  },
  deco: {
    chiikawa: `${ASSETS_PATH}/images/chiikawa_deco.png`,
    usagiDance: `${ASSETS_PATH}/images/usagi_dance.gif`,
    hachiwareFail: `${ASSETS_PATH}/images/hachiware_fail.png`,
    loopy: `${ASSETS_PATH}/images/loopy_deco.png`,
    // 🟢 你的新素材
    bg: `${ASSETS_PATH}/images/bg_chiikawa.jpg`,      // 那张绿色的草地背景图
    weed: `${ASSETS_PATH}/images/weed.png`,           // 杂草
    flower: `${ASSETS_PATH}/images/flower.png`,       // 花朵
    chiikawaHappy: `${ASSETS_PATH}/images/chiikawa_happy.png`, 
  },
  cover: {
    names: "刘王睿 & 张诚",
    title: "Our Love Story",
    slideshow: [
      `${ASSETS_PATH}/images/cover1.jpg`,
      `${ASSETS_PATH}/images/cover2.jpg`,
      `${ASSETS_PATH}/images/cover3.jpg`,
    ],
  },
  // 🟢 调整杂草位置，避开底部的小可爱
  weeds: [
    { id: 1, text: "异地恋的辛苦", x: "15%", y: "40%", rotate: -8 },
    { id: 2, text: "减肥的焦虑", x: "75%", y: "35%", rotate: 12 },
    { id: 3, text: "某次吵架", x: "25%", y: "55%", rotate: -5 },
    { id: 4, text: "每一次躯体化的复发", x: "65%", y: "50%", rotate: 8 },
    { id: 5, text: "想你很难受", x: "45%", y: "45%", rotate: 4 },
  ],
  chatStats: {
    daysTogether: 320, 
    messageCount: "1w+", 
    callHours: 520,     
    mostUsedEmoji: "❤️",
    Keywords: ["宝宝", "想你", "吃什么", "哈哈哈"],
  },
  timeline: [
    {
      date: "2025.03.08",
      title: "故事开始",
      desc: "我们的恋爱第一天，春天和你一起来了。",
      icon: <Heart className="text-pink-500" />,
      tags: ["纪念日"],
    },
    // ... timeline items
    {
      date: "2025.04 - 06",
      title: "南京·武夷绿洲观竹苑",
      desc: "在江宁区一起生活的日子，是充满烟火气的幸福。",
      icon: <MapPin className="text-green-500" />,
      tags: ["同居生活", "南京"],
    },
    {
      date: "2025.05.01",
      title: "马鞍山之旅",
      desc: "一起去感受了神奇的洗浴文化，放松又开心。",
      icon: <Coffee className="text-blue-400" />,
    },
    {
      date: "2025.06.07",
      title: "上海迪士尼乐园",
      desc: "在童话世界里，你就是我的公主。",
      image: `${ASSETS_PATH}/images/timeline_disney.jpg`,
      icon: <Star className="text-yellow-400" />,
    },
    {
      date: "2025.07.01",
      title: "南京欢乐谷",
      desc: "夏日的尖叫与欢笑，和你一起冒险。",
      image: `${ASSETS_PATH}/images/timeline_happyvalley.jpg`,
      icon: <Star className="text-purple-400" />,
    },
    {
      date: "2025.08.29",
      title: "七夕节·异地开始",
      desc: "我开启了哈工大的研究生生活。虽然分开，心却更近了。",
      icon: <Calendar className="text-purple-500" />,
      tags: ["异地恋", "七夕"],
    },
    {
      date: "2025.09.20",
      title: "第一次奔赴",
      desc: "实在太想你了，我回南京找你，缓解相思之苦。",
      icon: <Heart className="text-red-500" />,
    },
    {
      date: "2025.10.01",
      title: "国庆节见面",
      desc: "国庆假期，我又飞奔回南京，只想和你多待一会。",
      icon: <Heart className="text-red-500" />,
    },
    {
      date: "2025.10.25",
      title: "你第一次来哈尔滨",
      desc: "汪志大碗肉、知音酒楼、中华巴洛克、极地公园、中央大街...带你吃遍逛遍北国。",
      image: `${ASSETS_PATH}/images/timeline_harbin1.jpg`,
      icon: <Snowflake className="text-blue-300" />,
      tags: ["初遇哈尔滨"],
    },
    {
      date: "2025.11.21",
      title: "一起回家",
      desc: "开学后第一次回家，身边有你陪伴。",
      icon: <MapPin className="text-green-500" />,
    },
    {
      date: "2025.12.22",
      title: "长春·中转",
      desc: "到达长春，准备开启我们的冰雪之旅。",
      icon: <MapPin className="text-gray-500" />,
    },
    {
      date: "2025.12.23-24",
      title: "长白山滑雪",
      desc: "脚下滑雪，山上看天池。纯白的世界里只有我们。",
      image: `${ASSETS_PATH}/images/timeline_changbaishan.jpg`,
      icon: <Snowflake className="text-white" />,
      tags: ["滑雪", "天池"],
    },
    {
      date: "2025.12.25",
      title: "圣诞节的魔法",
      desc: "虽然这天我要体测短暂分开，但我们在13号街对角巷魔法咖啡馆留下了回忆。",
      image: `${ASSETS_PATH}/images/timeline_harbin2.jpg`,
      icon: <Star className="text-red-500" />,
      tags: ["圣诞快乐"],
    },
    {
      date: "2025.12.26",
      title: "冰雪大世界",
      desc: "在零下20度的哈尔滨，牵着你的手也是热的。",
      image: `${ASSETS_PATH}/images/timeline_ice.jpg`,
      icon: <Snowflake className="text-blue-200" />,
    },
    {
      date: "2025.12.31",
      title: "一起跨年",
      desc: "再见2025，你好2026。新的一年，依然爱你。",
      icon: <Heart className="text-red-600" />,
      tags: ["跨年"],
    },
    {
      date: "2026.01.02 - 至今",
      title: "暂时的分别",
      desc: "你回去后，我们到现在还没见面。但每一次的分离，都是为了下一次更好的相聚。",
      icon: <Calendar className="text-gray-400" />,
    },
  ],
};

const pageVariants = {
  initial: { opacity: 0, y: '100%' },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: '-100%', scale: 0.9 },
};
const pageTransition = { type: 'tween', ease: 'anticipate', duration: 0.8 };

const CuteDeco = ({ src, className, rotate = 12 }: { src: string, className?: string, rotate?: number }) => (
  <motion.img
    src={src}
    alt="cute deco"
    className={`absolute drop-shadow-lg pointer-events-none z-20 ${className}`}
    initial={{ rotate: rotate - 5, scale: 0.9 }}
    animate={{ rotate: rotate + 5, scale: 1.05, y: [0, -10, 0] }}
    transition={{ duration: 3, repeat: Infinity, repeatType: "reverse", ease: "easeInOut" }}
    onError={(e:any) => e.target.style.display = 'none'} 
  />
);

const PasswordPage = ({ onUnlock }: { onUnlock: () => void }) => {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'fail'>('idle');
  const [audioSuccess, _s, controlsSuccess] = useAudio({ src: CONFIG.audio.success, autoPlay: false });
  const [audioFail, _f, controlsFail] = useAudio({ src: CONFIG.audio.fail, autoPlay: false });
  const correctPassword = "20050615";

  useEffect(() => {
    if (input.length === correctPassword.length) {
      if (input === correctPassword) {
        setStatus('success');
        controlsSuccess.play();
        setTimeout(onUnlock, 2500);
      } else {
        setStatus('fail');
        controlsFail.play();
        setInput('');
        setTimeout(() => setStatus('idle'), 2000);
      }
    }
  }, [input, onUnlock]);

  const handleNum = (n: string) => { if (input.length < 8 && status === 'idle') setInput(p => p + n); };

  return (
    <div className="h-full flex flex-col items-center justify-center bg-pink-50 relative overflow-hidden">
      {audioSuccess}{audioFail}
      <CuteDeco src={CONFIG.deco.chiikawa} className="-top-10 -left-10 w-32" rotate={-20} />
      <CuteDeco src={CONFIG.deco.loopy} className="-bottom-5 -right-5 w-28" rotate={15} />

      <div className="bg-white/80 backdrop-blur-md p-6 rounded-[3rem] shadow-xl border-4 border-pink-200 w-[90%] max-w-md text-center relative z-10">
        <motion.div animate={{ rotate: status === 'fail' ? [-5, 5, -5, 5, 0] : 0 }}>
          <Lock className={`w-10 h-10 mx-auto mb-2 ${status === 'success' ? 'text-green-400' : status === 'fail' ? 'text-red-400' : 'text-pink-400'}`} />
        </motion.div>
        
        <h2 className="text-xl font-bold text-pink-600 mb-4 font-hand h-8">
          {status === 'idle' ? "请输入我们的纪念日" : status === 'success' ? "呜啦呀哈呜啦！" : "ぜんぜんわからない..."}
        </h2>
        
        <div className="h-32 mb-4 flex items-center justify-center">
          <AnimatePresence mode='wait'>
            {status === 'success' && <motion.img key="s" src={CONFIG.deco.usagiDance} initial={{ scale: 0 }} animate={{ scale: 1.2 }} className="h-full object-contain" />}
            {status === 'fail' && <motion.img key="f" src={CONFIG.deco.hachiwareFail} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="h-full object-contain" />}
            {status === 'idle' && <div className="text-pink-200 text-6xl animate-pulse">🔒</div>}
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className={`w-3 h-3 rounded-full border-2 ${i < input.length ? 'bg-pink-400 border-pink-400' : 'bg-transparent border-pink-200'}`} />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'DEL'].map((item, idx) => (
             item === null ? <div key={idx} /> :
             <motion.button key={idx} whileTap={{ scale: 0.9 }} onClick={() => item === 'DEL' ? setInput(p => p.slice(0, -1)) : handleNum(item.toString())} className="w-14 h-14 rounded-full font-bold text-lg flex items-center justify-center shadow-sm bg-pink-200 text-pink-700">{item}</motion.button>
          ))}
        </div>
      </div>
    </div>
  );
};

const CoverPage = () => (
  <div className="h-full flex flex-col items-center justify-center bg-pink-50 relative overflow-hidden">
    <div className="absolute inset-0 z-0 opacity-50 bg-[url('https://ccrr0506.github.io/LoveReport/assets/images/cover1.jpg')] bg-cover bg-center" />
    <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} className="z-10 text-center relative bg-white/30 backdrop-blur-sm p-8 rounded-3xl border border-white/50 shadow-lg">
       <h1 className="text-5xl font-bold mb-4 font-hand text-pink-600 drop-shadow-md tracking-wider">{CONFIG.cover.title}</h1>
       <h2 className="text-3xl font-medium text-pink-500 font-hand">{CONFIG.cover.names}</h2>
    </motion.div>
  </div>
);

// ==========================================
// (3) StatsPage - 【最终图片版】
// ==========================================
const StatsPage = () => {
  const [items, setItems] = useState(() => CONFIG.weeds.map(w => ({ ...w, status: 'weed' })));
  const allCleared = items.every(i => i.status === 'flower');

  const handleWeedClick = (id: number) => {
    const audio = new Audio(CONFIG.audio.success); 
    audio.volume = 0.5;
    // audio.play().catch(() => {});
    if (navigator.vibrate) navigator.vibrate(50);
    setItems(prev => prev.map(item => item.id === id ? { ...item, status: 'flower' } : item));
  };

  return (
    <div className="h-full w-full relative overflow-hidden font-hand select-none text-[#5D4037]">
      
      {/* 🟢 背景层：直接使用 bg_chiikawa.jpg */}
      <div className="absolute inset-0 z-0">
        <img 
          src={CONFIG.deco.bg} 
          className="w-full h-full object-cover" 
          alt="bg"
        />
        {/* 顶部白色渐变，防止文字看不清 */}
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/70 to-transparent" />
      </div>

      {/* 🟢 标题 (居中顶部) */}
      <motion.div initial={{y:-20, opacity:0}} animate={{y:0, opacity:1}} className="absolute top-12 w-full text-center z-20 px-4">
        <h2 className="text-3xl font-bold drop-shadow-md tracking-wide text-[#5D4037]">
          {allCleared ? "好温暖，全是爱！" : "拔掉坏情绪 🌱"}
        </h2>
        <div className="mt-2 inline-block bg-white/60 px-4 py-1 rounded-full backdrop-blur-md shadow-sm border border-white/50">
          <p className="text-xs text-[#8B5A2B] font-bold">
            {allCleared ? "我们的幸福小天地 ❤️" : "把烦恼变成养分..."}
          </p>
        </div>
      </motion.div>

      {/* 🟢 交互层：杂草与花朵 */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        {items.map((item) => (
          <div 
             key={item.id} 
             className="absolute pointer-events-auto flex flex-col items-center justify-center w-28 h-28"
             style={{ left: item.x, top: item.y }}
             onClick={() => item.status === 'weed' && handleWeedClick(item.id)}
          >
            <AnimatePresence mode='wait'>
              {item.status === 'weed' ? (
                <motion.div 
                  key="weed"
                  initial={{ rotate: item.rotate }}
                  whileHover={{ scale: 1.1, rotate: 0 }}
                  exit={{ scale: 0, opacity: 0, y: -10 }}
                  className="relative group flex flex-col items-center cursor-pointer"
                >
                  {/* 杂草贴图：自动去白底 + 阴影 */}
                  <div className="relative">
                    <img 
                      src={CONFIG.deco.weed} 
                      alt="bad mood" 
                      className="w-20 h-20 object-contain transition-all"
                      style={{ mixBlendMode: 'multiply', filter: 'brightness(0.9)' }} 
                    />
                    {/* 接地阴影 */}
                    <div className="absolute bottom-2 left-2 w-16 h-2 bg-[#556B2F]/30 blur-[3px] rounded-full -z-10" />
                  </div>
                  {/* 标签 */}
                  <div className="absolute -bottom-2 bg-[#6D4C41] text-[#FFF8E1] text-[10px] px-2 py-1 rounded-full whitespace-nowrap shadow-md border border-[#8D6E63] z-50 transform -rotate-2">
                    {item.text}
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="flower"
                  initial={{ scale: 0, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  transition={{ type: "spring", bounce: 0.6 }}
                  className="relative flex flex-col items-center"
                >
                   {/* 坑洞光晕 */}
                   <div className="absolute bottom-2 w-16 h-4 bg-[#8B4513]/20 rounded-[100%] blur-[2px]" />
                   <div className="absolute bottom-4 w-20 h-20 bg-yellow-200/50 rounded-full blur-xl animate-pulse" />
                   
                   <img src={CONFIG.deco.flower} alt="love" className="w-20 h-20 object-contain drop-shadow-xl z-10" />
                   <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 fill-yellow-400 animate-pulse z-20"/>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* 庆祝动画 */}
      <AnimatePresence>
        {allCleared && (
          <motion.div 
            initial={{ y: 100 }} animate={{ y: 0 }} 
            className="absolute bottom-0 left-0 right-0 h-48 flex items-end justify-center pointer-events-none z-50 pb-6"
          >
            <img src={CONFIG.deco.chiikawaHappy} className="w-36 h-36 object-contain drop-shadow-2xl animate-bounce" />
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white/95 p-4 rounded-2xl rounded-bl-none border-2 border-pink-200 mb-24 shadow-xl ml-[-10px] z-50"
            >
               <p className="text-pink-600 font-bold font-hand text-sm leading-relaxed">
                 哇！坏运气都拔光啦！<br/>
                 这里好温暖~ ❤️
               </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const TimelinePage = () => (
  <div className="h-full bg-pink-50 p-6 flex flex-col items-center justify-center">
    <CuteDeco src={CONFIG.deco.loopy} className="top-20 right-2 w-24" />
    <h2 className="text-4xl font-bold text-pink-800 font-hand mb-10">时间线施工中...</h2>
    <p className="text-pink-600">下一章：Loopy 的发疯日记</p>
  </div>
);

const EndingPage = () => (
  <div className="h-full bg-pink-900 text-white flex flex-col items-center justify-center">
    <Heart className="w-24 h-24 text-pink-300 animate-pulse mb-4" />
    <h2 className="text-4xl font-bold font-hand">未完待续...</h2>
  </div>
);

// ==========================================
// 4. 主程序
// ==========================================
function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isLocked, setIsLocked] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [audio, state, controls] = useAudio({ src: CONFIG.audio.bgm, autoPlay: false, loop: true });

  const pages = [
    <CoverPage key="cover" />,
    <StatsPage key="stats" />,
    <TimelinePage key="timeline" />, 
    <EndingPage key="ending" />,
  ];

  const Preloader = ({ onComplete }: { onComplete: () => void }) => {
    useEffect(() => { setTimeout(onComplete, 1000); }, [onComplete]);
    return (
      <div className="fixed inset-0 z-[100] bg-pink-50 flex flex-col items-center justify-center">
        <Loader2 className="w-10 h-10 text-pink-500 animate-spin" />
        <p className="text-pink-400 mt-4 text-sm font-hand">正在加载浪漫...</p>
      </div>
    );
  };

  if (isLoading) return <Preloader onComplete={() => setIsLoading(false)} />;

  const handleUnlock = () => { setIsLocked(false); controls.play(); };

  const handleScroll = (e: React.WheelEvent | React.TouchEvent) => {
      if (isLocked) return;
      let deltaY = 0;
      if ('deltaY' in e) deltaY = e.deltaY;
      else if ('changedTouches' in e) deltaY = (e as any).changedTouches[0].clientY;
      
      if (deltaY > 50 && currentPage < pages.length - 1) setCurrentPage(c => c + 1);
      if (deltaY < -50 && currentPage > 0) setCurrentPage(c => c - 1);
  };

  return (
    <div className="fixed inset-0 w-full h-full bg-gray-100 font-sans" onWheel={handleScroll} onTouchEnd={handleScroll}>
      {audio}
      {!isLocked && (
        <button onClick={() => state.playing ? controls.pause() : controls.play()} className="fixed top-4 right-4 z-50 p-3 bg-white/50 backdrop-blur-md rounded-full shadow-md">
           <Music className={`w-5 h-5 ${state.playing ? 'text-pink-500 animate-spin-slow' : 'text-gray-400'}`} />
        </button>
      )}

      <AnimatePresence mode="wait" initial={false}>
        {isLocked ? (
          <motion.div key="lock" className="w-full h-full" exit={{ opacity: 0, y: -1000, transition: {duration: 1} }}>
             <PasswordPage onUnlock={handleUnlock} />
          </motion.div>
        ) : (
           <motion.div key="content" className="w-full h-full relative" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <AnimatePresence mode="wait" custom={currentPage}>
                <motion.div key={`page-${currentPage}`} variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition} className="w-full h-full absolute inset-0">
                    {pages[currentPage]}
                </motion.div>
              </AnimatePresence>
           </motion.div>
        )}
      </AnimatePresence>
      
      {!isLocked && (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-3 z-50">
          {pages.map((_, index) => (
              <motion.div key={index} animate={{ scale: currentPage === index ? 1.5 : 1, backgroundColor: currentPage === index ? '#EC4899' : '#DBEafe' }} className="w-3 h-3 rounded-full shadow-sm cursor-pointer" onClick={() => setCurrentPage(index)} />
          ))}
        </div>
      )}
    </div>
  );
}

export default App;