import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Music, Lock, ChevronDown, MapPin, Calendar, Star, Coffee, Snowflake, Loader2, Sparkles } from 'lucide-react';
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
    pop: `${ASSETS_PATH}/audio/pop.mp3`, 
  },
  deco: {
    chiikawa: `${ASSETS_PATH}/images/chiikawa_deco.png`,
    usagiDance: `${ASSETS_PATH}/images/usagi_dance.gif`,
    hachiwareFail: `${ASSETS_PATH}/images/hachiware_fail.png`,
    loopy: `${ASSETS_PATH}/images/loopy_deco.png`,
    // 🟢 修改点：这里引入了你找到的新素材
    weed: `${ASSETS_PATH}/images/weed.png`,           // 杂草图片
    flower: `${ASSETS_PATH}/images/flower.png`,       // 变成的花朵/爱心
    chiikawaHappy: `${ASSETS_PATH}/images/chiikawa_happy.png`, // 开心庆祝
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
  // 这里的坐标稍微调整了一下，防止图片遮挡文字
  weeds: [
    { id: 1, text: "异地恋的辛苦", x: "10%", y: "20%", rotate: -10 },
    { id: 2, text: "加班的烦恼", x: "65%", y: "15%", rotate: 15 },
    { id: 3, text: "某次冷战", x: "15%", y: "60%", rotate: -5 },
    { id: 4, text: "没抢到的票", x: "70%", y: "55%", rotate: 10 },
    { id: 5, text: "想你很难受", x: "40%", y: "45%", rotate: 5 },
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
    // ... 其他时间线数据
    {
      date: "2025.12.23-24",
      title: "长白山滑雪",
      desc: "脚下滑雪，山上看天池。纯白的世界里只有我们。",
      image: `${ASSETS_PATH}/images/timeline_changbaishan.jpg`,
      icon: <Snowflake className="text-white" />,
      tags: ["滑雪", "天池"],
    },
  ],
};

// ==========================================
// 2. 基础组件库
// ==========================================
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

// ==========================================
// 3. 页面组件定义
// ==========================================

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
          {status === 'idle' && "请输入我们的纪念日"}
          {status === 'success' && "呜啦呀哈呜啦！"}
          {status === 'fail' && "ぜんぜんわからない..."}
        </h2>

        <div className="h-32 mb-4 flex items-center justify-center">
          <AnimatePresence mode='wait'>
            {status === 'success' && (
              <motion.img key="s" src={CONFIG.deco.usagiDance} initial={{ scale: 0 }} animate={{ scale: 1.2 }} exit={{scale:0}} className="h-full object-contain" />
            )}
            {status === 'fail' && (
              <motion.img key="f" src={CONFIG.deco.hachiwareFail} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{opacity:0}} className="h-full object-contain" />
            )}
            {status === 'idle' && (
               <div className="text-pink-200 text-6xl animate-pulse">🔒</div>
            )}
          </AnimatePresence>
        </div>

        <div className="flex justify-center gap-2 mb-6">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div key={i} className={`w-3 h-3 rounded-full border-2 ${i < input.length ? 'bg-pink-400 border-pink-400' : 'bg-transparent border-pink-200'}`} animate={{ scale: i < input.length ? [1, 1.2, 1] : 1 }} />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'DEL'].map((item, idx) => (
             item === null ? <div key={idx} /> :
             <motion.button key={idx} whileTap={{ scale: 0.9 }}
                onClick={() => item === 'DEL' ? setInput(p => p.slice(0, -1)) : handleNum(item.toString())}
                className={`w-14 h-14 rounded-full font-bold text-lg flex items-center justify-center shadow-sm ${item === 'DEL' ? 'bg-pink-100 text-pink-400' : 'bg-pink-200 text-pink-700'}`}>
                {item}
             </motion.button>
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
// (3) StatsPage - 杂草变鲜花 (图片版)
// ==========================================
const StatsPage = () => {
  const [items, setItems] = useState(() => CONFIG.weeds.map(w => ({ ...w, status: 'weed' })));
  const allCleared = items.every(i => i.status === 'flower');

  const handleWeedClick = (id: number) => {
    // 这里播放你的 POP 音效
    const audio = new Audio(CONFIG.audio.success); 
    audio.volume = 0.5;
    // audio.play().catch(() => {});
    if (navigator.vibrate) navigator.vibrate(50);

    setItems(prev => prev.map(item => 
      item.id === id ? { ...item, status: 'flower' } : item
    ));
  };

  return (
    <div className="h-full bg-[#FFFFF7] p-6 flex flex-col relative overflow-hidden transition-colors duration-700">
      <motion.div initial={{y:-20, opacity:0}} animate={{y:0, opacity:1}} className="mt-8 text-center relative z-10">
        <h2 className="text-3xl font-bold text-[#4B5B76] font-hand">
          {allCleared ? "哇！原来它们都是养分！" : "拔掉坏情绪 🌱"}
        </h2>
        <p className="text-sm text-pink-400 mt-2 font-hand">
          {allCleared ? "这一年，我们把烦恼都变成了爱。" : "点击杂草，看看会发生什么..."}
        </p>
      </motion.div>

      <div className="flex-1 relative mt-4">
        {/* 背景卡片 */}
        <div className="absolute inset-0 grid grid-cols-2 gap-4 content-center opacity-40 blur-[1px] scale-90 pointer-events-none">
           <RoughCard color="#FFE4E1" className="h-32 flex items-center justify-center"><Heart className="text-red-400"/></RoughCard>
           <RoughCard color="#E0FFFF" className="h-32 flex items-center justify-center"><Calendar className="text-blue-400"/></RoughCard>
           <RoughCard color="#FFFACD" className="h-32 flex items-center justify-center"><Star className="text-yellow-400"/></RoughCard>
           <RoughCard color="#E6E6FA" className="h-32 flex items-center justify-center"><Music className="text-purple-400"/></RoughCard>
        </div>

        {/* 交互层 */}
        {items.map((item) => (
          <motion.div
            key={item.id}
            initial={{ scale: 0 }}
            animate={{ scale: 1, rotate: item.rotate }}
            className="absolute cursor-pointer flex flex-col items-center justify-center w-28" // 稍微调大了尺寸
            style={{ left: item.x, top: item.y }}
            onClick={() => item.status === 'weed' && handleWeedClick(item.id)}
          >
            <AnimatePresence mode='wait'>
              {item.status === 'weed' ? (
                <motion.div 
                  key="weed"
                  exit={{ scale: 0, opacity: 0, rotate: 180 }}
                  transition={{ duration: 0.3 }}
                  className="relative group flex flex-col items-center"
                >
                  {/* 🟢 修改点：使用 weed.png */}
                  <img 
                    src={CONFIG.deco.weed} 
                    alt="bad mood" 
                    className="w-16 h-16 object-contain drop-shadow-md filter grayscale-[30%] group-hover:grayscale-0 transition-all group-hover:scale-110"
                  />
                  
                  {/* 标签 */}
                  <div className="mt-1 bg-gray-800/80 text-white text-[10px] px-2 py-1 rounded-full whitespace-nowrap backdrop-blur-sm border border-white/20">
                    {item.text}
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="flower"
                  initial={{ scale: 0, y: 10 }}
                  animate={{ scale: 1.2, y: 0 }}
                  transition={{ type: "spring", bounce: 0.5 }}
                  className="relative"
                >
                   {/* 🟢 修改点：使用 flower.png */}
                   <img src={CONFIG.deco.flower} alt="love" className="w-20 h-20 object-contain drop-shadow-xl" />
                   
                   <motion.div 
                      initial={{opacity:0, y:10}} animate={{opacity:1, y:-20}} 
                      className="absolute -top-4 -right-4"
                   >
                     <Sparkles className="w-6 h-6 text-yellow-400 fill-yellow-400 animate-pulse"/>
                   </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

      {/* 底部庆祝动画：使用新的 Chiikawa Happy 图片 */}
      <AnimatePresence>
        {allCleared && (
          <motion.div 
            initial={{ y: 100 }} animate={{ y: 0 }} 
            className="absolute bottom-0 left-0 right-0 h-48 flex items-end justify-center pointer-events-none z-50 pb-4"
          >
            {/* 🟢 修改点：使用 chiikawaHappy.png */}
            <img src={CONFIG.deco.chiikawaHappy} className="w-40 h-40 object-contain drop-shadow-2xl animate-bounce" />
            
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.5 }}
              className="bg-white/90 p-4 rounded-2xl rounded-bl-none border-4 border-pink-200 mb-24 shadow-xl ml-[-30px] z-50"
            >
               <p className="text-pink-600 font-bold font-hand text-base leading-relaxed">
                 哇！坏运气都跑光啦！<br/>
                 留下的都是爱~ ❤️
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