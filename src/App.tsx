import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Music, Lock, ChevronDown, MapPin, Calendar, Star, Coffee, Snowflake, Loader2, Sparkles, X, ChevronLeft, Camera } from 'lucide-react';
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
    bg: `${ASSETS_PATH}/images/bg_chiikawa.jpg`,      
    weed: `${ASSETS_PATH}/images/weed.png`,           
    flower: `${ASSETS_PATH}/images/flower.png`, // 你的乌萨其图片
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
  // 🟢 配置每一株杂草背后的“回忆故事”
  weeds: [
    { 
      id: 1, 
      text: "异地恋的辛苦", 
      x: "15%", y: "45%", rotate: -8,
      memory: {
        title: "跨越1800公里的拥抱",
        date: "2025.09.20",
        desc: "异地恋真的很辛苦，隔着屏幕感受不到你的温度。但是，当我走出车站看到你的那一刻，所有的辛苦都变成了值得。这是我们第一次奔赴，也是我最心动的瞬间。",
        photo: `${ASSETS_PATH}/images/timeline_harbin1.jpg` // 换成你们见面的照片
      }
    },
    { 
      id: 2, 
      text: "加班的烦恼", 
      x: "75%", y: "40%", rotate: 12,
      memory: {
        title: "你的声音是最好的安慰",
        date: "2025.06.15",
        desc: "那天加班到很晚，心情特别差。是你一直陪我连麦，听我吐槽，还给我点了外卖。谢谢你做我情绪的垃圾桶，有你在真好。",
        photo: `${ASSETS_PATH}/images/cover1.jpg`
      }
    },
    { 
      id: 3, 
      text: "某次冷战", 
      x: "25%", y: "60%", rotate: -5,
      memory: {
        title: "雨过天晴的甜蜜",
        date: "2025.07.20",
        desc: "傻瓜，其实那时候我也很难受。冷战不是因为不爱，而是太在乎。还好我们都没有放弃，和好后的那个亲亲，比糖还甜。",
        photo: `${ASSETS_PATH}/images/cover2.jpg`
      }
    },
    { 
      id: 4, 
      text: "没抢到的票", 
      x: "65%", y: "55%", rotate: 8,
      memory: {
        title: "遗憾也是风景",
        date: "2025.10.01",
        desc: "虽然没去成想去的地方，但只要和你在一起，哪里都是风景。下次我们一定提前抢票，去更多地方！",
        photo: `${ASSETS_PATH}/images/cover3.jpg`
      }
    },
    { 
      id: 5, 
      text: "想你很难受", 
      x: "45%", y: "50%", rotate: 4,
      memory: {
        title: "攒够思念就见面",
        date: "Everyday",
        desc: "想你的时候，我就看看我们的聊天记录。每一句“晚安”，都是我爱你的证据。快点见面吧，我想抱抱你！",
        photo: `${ASSETS_PATH}/images/timeline_harbin2.jpg`
      }
    },
  ],
  chatStats: {
    daysTogether: 320, 
    messageCount: "1w+", 
    callHours: 520,     
    mostUsedEmoji: "❤️",
    Keywords: ["宝宝", "想你", "吃什么", "哈哈哈"],
  },
  timeline: [
    { date: "2025.03.08", title: "故事开始", desc: "我们的恋爱第一天...", icon: <Heart className="text-pink-500" /> },
    { date: "2025.10.25", title: "初遇哈尔滨", desc: "带你吃遍逛遍北国...", image: `${ASSETS_PATH}/images/timeline_harbin1.jpg`, icon: <Snowflake className="text-blue-300" /> },
  ],
};

// ==========================================
// 2. 基础组件库
// ==========================================
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

// 🟢 新增：回忆详情页 (全屏覆盖)
const MemoryDetail = ({ data, onClose }: { data: any, onClose: () => void }) => {
  if (!data) return null;
  return (
    <motion.div 
      initial={{ x: '100%' }} 
      animate={{ x: 0 }} 
      exit={{ x: '100%' }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed inset-0 z-[200] bg-[#FFF5F7] flex flex-col overflow-y-auto"
    >
      {/* 顶部导航栏 */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-md p-4 flex items-center shadow-sm z-10">
        <button onClick={onClose} className="p-2 bg-pink-100 rounded-full text-pink-600 hover:bg-pink-200 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <span className="ml-4 font-bold text-pink-800 text-lg font-hand">爱的回忆录</span>
      </div>

      {/* 内容区 */}
      <div className="p-6 flex-1 flex flex-col items-center">
        <div className="w-full aspect-[4/3] rounded-3xl overflow-hidden shadow-xl mb-6 border-4 border-white relative">
           <img src={data.memory.photo} className="w-full h-full object-cover" />
           <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4 pt-10">
              <span className="text-white font-hand text-sm flex items-center gap-2">
                <Calendar size={14} /> {data.memory.date}
              </span>
           </div>
        </div>

        <h2 className="text-3xl font-bold text-[#5D4037] mb-4 text-center font-hand leading-tight">
          {data.memory.title}
        </h2>
        
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-pink-100 w-full">
          <p className="text-[#8B5A2B] text-base leading-relaxed font-hand text-justify">
            {data.memory.desc}
          </p>
        </div>

        <div className="mt-8 flex gap-2 opacity-50">
           <Heart className="text-pink-400 fill-pink-400 animate-pulse" />
           <Heart className="text-pink-300 fill-pink-300" />
           <Heart className="text-pink-200 fill-pink-200" />
        </div>
      </div>
    </motion.div>
  );
};

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
        <Lock className={`w-10 h-10 mx-auto mb-2 ${status === 'success' ? 'text-green-400' : 'text-pink-400'}`} />
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
             <motion.button key={idx} whileTap={{ scale: 0.9 }} onClick={() => item === 'DEL' ? setInput(p => p.slice(0, -1)) : input.length < 8 && setInput(p => p + item)} className="w-14 h-14 rounded-full font-bold text-lg flex items-center justify-center shadow-sm bg-pink-200 text-pink-700">{item}</motion.button>
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
// (3) StatsPage - 【状态保持版】
// ==========================================
const StatsPage = () => {
  // 🟢 这里的 state 负责保存游戏状态。即使弹窗打开，这里的数据也不会变。
  const [items, setItems] = useState(() => CONFIG.weeds.map(w => ({ ...w, status: 'weed' })));
  const [activeMemory, setActiveMemory] = useState<any>(null); 
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
      
      {/* 🟢 背景层 (始终显示) */}
      <div className="absolute inset-0 z-0">
        <img src={CONFIG.deco.bg} className="w-full h-full object-cover" alt="bg"/>
        <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-white/70 to-transparent" />
      </div>

      {/* 标题 */}
      <motion.div initial={{y:-20, opacity:0}} animate={{y:0, opacity:1}} className="absolute top-12 w-full text-center z-20 px-4">
        <h2 className="text-3xl font-bold drop-shadow-md tracking-wide text-[#5D4037]">
          {allCleared ? "好温暖，全是爱！" : "拔掉坏情绪 🌱"}
        </h2>
        <div className="mt-2 inline-block bg-white/60 px-4 py-1 rounded-full backdrop-blur-md shadow-sm border border-white/50">
          <p className="text-xs text-[#8B5A2B] font-bold">
            {allCleared ? "你已经收集了所有回忆 ❤️" : "点击杂草拔掉它，点击乌萨其看回忆"}
          </p>
        </div>
      </motion.div>

      {/* 交互层 */}
      <div className="absolute inset-0 z-30">
        {items.map((item) => (
          <div 
             key={item.id} 
             className="absolute flex flex-col items-center justify-center w-28 h-28"
             style={{ left: item.x, top: item.y }}
          >
            <AnimatePresence mode='wait'>
              {item.status === 'weed' ? (
                <motion.div 
                  key="weed"
                  initial={{ rotate: item.rotate }}
                  exit={{ scale: 0, opacity: 0 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => handleWeedClick(item.id)} // 🟢 点击拔草
                  className="relative group flex flex-col items-center cursor-pointer"
                >
                  {/* 杂草贴图：自动去白底 */}
                  <div className="relative">
                    <img 
                      src={CONFIG.deco.weed} 
                      className="w-24 h-24 object-contain"
                      style={{ mixBlendMode: 'multiply', filter: 'brightness(0.9)' }} 
                    />
                  </div>
                  <div className="absolute -bottom-2 bg-[#6D4C41] text-[#FFF8E1] text-[10px] px-2 py-1 rounded-full shadow-md border border-[#8D6E63] z-50 transform -rotate-2">
                    {item.text}
                  </div>
                </motion.div>
              ) : (
                <motion.div 
                  key="flower"
                  initial={{ scale: 0, y: 15 }}
                  animate={{ scale: 1, y: 0 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setActiveMemory(item)} // 🟢 点击看回忆
                  className="relative flex flex-col items-center cursor-pointer"
                >
                   {/* 坑洞光晕 */}
                   <div className="absolute bottom-4 w-20 h-20 bg-yellow-200/50 rounded-full blur-xl animate-pulse" />
                   
                   {/* 乌萨其 */}
                   <img src={CONFIG.deco.flower} className="w-20 h-20 object-contain drop-shadow-xl z-10" />
                   <Sparkles className="absolute -top-2 -right-2 w-6 h-6 text-yellow-400 fill-yellow-400 animate-pulse z-20"/>
                   
                   {/* 提示气泡 */}
                   <motion.div 
                     initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} delay={0.2}
                     className="absolute -top-8 right-[-10px] bg-white text-pink-500 text-[10px] px-2 py-1 rounded-lg shadow-sm border border-pink-100 whitespace-nowrap"
                   >
                     点我看回忆!
                   </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>

      {/* 庆祝动画 (只有当没有打开回忆弹窗时才显示) */}
      <AnimatePresence>
        {allCleared && !activeMemory && (
          <motion.div 
            initial={{ y: 100 }} animate={{ y: 0 }} 
            className="absolute bottom-0 left-0 right-0 h-48 flex items-end justify-center pointer-events-none z-40 pb-6"
          >
            <img src={CONFIG.deco.chiikawaHappy} className="w-36 h-36 object-contain drop-shadow-2xl animate-bounce" />
            <div className="bg-white/95 p-4 rounded-2xl rounded-bl-none border-2 border-pink-200 mb-24 shadow-xl ml-[-10px]">
               <p className="text-pink-600 font-bold font-hand text-sm">
                 全部收集齐啦！<br/>你真棒！ ❤️
               </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 🟢 回忆详情页弹窗 (覆盖在最上层) */}
      <AnimatePresence>
        {activeMemory && <MemoryDetail data={activeMemory} onClose={() => setActiveMemory(null)} />}
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