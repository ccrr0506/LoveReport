import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, Music, Lock, ChevronDown, MapPin, Calendar, Star, Coffee, Snowflake, Loader2 } from 'lucide-react';
import { useAudio } from 'react-use';

// ==========================================
// 1. 数据配置区 (你的故事都在这里)
// ==========================================
const ASSETS_PATH = '/assets';

const CONFIG = {
  // 音频配置 (确保文件在 public/assets/audio/ 下)
  audio: {
    bgm: `${ASSETS_PATH}/audio/bgm.mp3`,       // Taylor Swift - Love Story
    success: `${ASSETS_PATH}/audio/success.mp3`, // 乌萨其：呜啦呀哈呜啦
    fail: `${ASSETS_PATH}/audio/fail.mp3`,       // 小八：ぜんぜんわからない
  },
  // 装饰图片 (确保文件在 public/assets/images/ 下)
  deco: {
    chiikawa: `${ASSETS_PATH}/images/chiikawa_deco.png`,
    usagiDance: `${ASSETS_PATH}/images/usagi_dance.png`,
    hachiwareFail: `${ASSETS_PATH}/images/hachiware_fail.png`,
    loopy: `${ASSETS_PATH}/images/loopy_deco.png`,
  },
  // 封面配置
  cover: {
    names: "刘王睿 & 张诚",
    title: "Our Love Story",
    // 封面轮播图
    slideshow: [
      `${ASSETS_PATH}/images/cover1.jpg`,
      `${ASSETS_PATH}/images/cover2.jpg`,
      `${ASSETS_PATH}/images/cover3.jpg`,
    ],
  },
  // 聊天统计 (此处填入之前算好的数据)
  chatStats: {
    daysTogether: 320, 
    messageCount: "1w+", 
    callHours: 520,     
    mostUsedEmoji: "❤️",
    Keywords: ["宝宝", "想你", "吃什么", "哈哈哈"],
  },
  // 💖 完整时间线 (你的故事)
  // image 字段：如果是实况，请填 .mp4 路径；如果是照片，填 .jpg/.png 路径
  timeline: [
    {
      date: "2025.03.08",
      title: "故事开始",
      desc: "我们的恋爱第一天，春天和你一起来了。",
      icon: <Heart className="text-pink-500" />,
      tags: ["纪念日"],
    },
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
      image: `${ASSETS_PATH}/images/timeline_disney.jpg`, // 如果有实况，改成 .mp4
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

// ==========================================
// 2. 基础组件库
// ==========================================

// 动画配置
const pageVariants = {
  initial: { opacity: 0, y: '100%' },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: '-100%', scale: 0.9 },
};
const pageTransition = { type: 'tween', ease: 'anticipate', duration: 0.8 };
const bounceVariants = { hover: { scale: 1.1 }, tap: { scale: 0.9 } };

// 装饰图片组件
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

// 实况照片相框组件 (支持 .mp4 视频和普通图片)
const LivePhotoFrame = ({ src, className, rotate = 0 }: { src: string, className?: string, rotate?: number }) => {
  const isVideo = src.endsWith('.mp4') || src.endsWith('.webm');
  return (
    <motion.div 
      whileHover={{ scale: 1.05, rotate: 0, zIndex: 10 }}
      className={`relative rounded-3xl overflow-hidden shadow-md border-4 border-white ${className}`}
      style={{ rotate: rotate }}
    >
      {isVideo ? (
        <video
          src={src}
          autoPlay loop muted playsInline
          className="w-full h-full object-cover"
          style={{ display: 'block' }}
        />
      ) : (
        <img src={src} loading="lazy" className="w-full h-full object-cover" />
      )}
      {isVideo && (
        <div className="absolute top-2 right-2 bg-black/30 backdrop-blur-md px-2 py-0.5 rounded-full flex items-center gap-1">
          <div className="w-2 h-2 bg-yellow-400 rounded-full animate-pulse"></div>
          <span className="text-[10px] font-bold text-white tracking-wider">LIVE</span>
        </div>
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-pink-900/10 to-transparent pointer-events-none"></div>
    </motion.div>
  );
};

// ==========================================
// 3. 页面组件定义
// ==========================================

// (1) 预加载页
const Preloader = ({ onComplete }: { onComplete: () => void }) => {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("正在收集我们的回忆...");

  useEffect(() => {
    // 收集所有图片链接
    const imageUrls = [
      ...Object.values(CONFIG.deco),
      ...CONFIG.cover.slideshow,
      ...CONFIG.timeline.filter(t => t.image).map(t => t.image!),
    ];
    
    if (imageUrls.length === 0) {
      onComplete();
      return;
    }

    let loaded = 0;
    const total = imageUrls.length;
    
    const update = () => {
      loaded++;
      const percent = Math.floor((loaded / total) * 100);
      setProgress(percent);
      if (percent > 30) setLoadingText("正在打包浪漫...");
      if (percent > 60) setLoadingText("马上就好啦...");
      if (percent > 90) setLoadingText("最后整理一下...");
      if (loaded >= total) setTimeout(onComplete, 800);
    };

    imageUrls.forEach(url => {
      // 这里的逻辑：如果是图片用Image预加载，如果是视频则跳过(让视频流式播放)
      if (url.endsWith('.mp4')) {
        update(); 
      } else {
        const img = new Image();
        img.src = url;
        img.onload = update;
        img.onerror = update;
      }
    });
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-pink-50 flex flex-col items-center justify-center">
      <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 1.5 }} className="mb-8 relative">
        <Heart className="w-20 h-20 text-pink-500 fill-pink-500" />
        <div className="absolute inset-0 flex items-center justify-center text-white font-bold text-lg">{progress}%</div>
      </motion.div>
      <h2 className="text-pink-600 font-bold text-xl mb-2 font-serif animate-pulse">{loadingText}</h2>
      <p className="text-pink-400 text-sm">因为保留了高清画质，请耐心等待哦...</p>
      <div className="w-64 h-2 bg-pink-200 rounded-full mt-6 overflow-hidden">
        <motion.div className="h-full bg-pink-500 rounded-full" initial={{ width: 0 }} animate={{ width: `${progress}%` }} />
      </div>
    </div>
  );
};

// (2) 密码锁屏页
const PasswordPage = ({ onUnlock }: { onUnlock: () => void }) => {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'success' | 'fail'>('idle');
  const [audioSuccess, stateSuccess, controlsSuccess] = useAudio({ src: CONFIG.audio.success, autoPlay: false });
  const [audioFail, stateFail, controlsFail] = useAudio({ src: CONFIG.audio.fail, autoPlay: false });
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

      <div className="bg-white/80 backdrop-blur-md p-8 rounded-[3rem] shadow-xl border-4 border-pink-200 w-[90%] max-w-md text-center relative z-10">
        <motion.div animate={{ rotate: status === 'fail' ? [-5, 5, -5, 5, 0] : 0 }}>
          <Lock className={`w-12 h-12 mx-auto mb-4 ${status === 'success' ? 'text-green-400' : status === 'fail' ? 'text-red-400' : 'text-pink-400'}`} />
        </motion.div>
        
        <h2 className="text-xl font-bold text-pink-600 mb-6 font-serif">
          {status === 'idle' && "请输入我们的纪念日"}
          {status === 'success' && "呜啦呀哈呜啦！"}
          {status === 'fail' && "ぜんぜんわからない..."}
        </h2>

        <AnimatePresence mode='wait'>
          {status === 'success' && (
            <motion.img key="s" src={CONFIG.deco.usagiDance} initial={{ scale: 0 }} animate={{ scale: 1.2 }} exit={{scale:0}} className="w-32 h-32 mx-auto mb-4 object-contain" />
          )}
          {status === 'fail' && (
            <motion.img key="f" src={CONFIG.deco.hachiwareFail} initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{opacity:0}} className="w-32 h-32 mx-auto mb-4 object-contain" />
          )}
        </AnimatePresence>

        <div className="flex justify-center gap-2 mb-8">
          {Array.from({ length: 8 }).map((_, i) => (
            <motion.div key={i} className={`w-3 h-3 rounded-full border-2 ${i < input.length ? 'bg-pink-400 border-pink-400' : 'bg-transparent border-pink-200'}`} animate={{ scale: i < input.length ? [1, 1.2, 1] : 1 }} />
          ))}
        </div>

        <div className="grid grid-cols-3 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'DEL'].map((item, idx) => (
             item === null ? <div key={idx} /> :
             <motion.button key={idx} variants={bounceVariants} whileHover="hover" whileTap="tap"
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

// (3) 封面页
const CoverPage = () => {
  const [currentImage, setCurrentImage] = useState(0);
  useEffect(() => {
    const timer = setInterval(() => setCurrentImage((p) => (p + 1) % CONFIG.cover.slideshow.length), 3000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-full flex flex-col relative overflow-hidden bg-pink-50">
      <CuteDeco src={CONFIG.deco.usagiDance} className="top-10 right-5 w-24" />
      <div className="absolute inset-0 z-0">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} transition={{ duration: 1 }}
            className="w-full h-full bg-cover bg-center absolute top-0 left-0 brightness-[0.85]"
            style={{ backgroundImage: `url(${CONFIG.cover.slideshow[currentImage]})` }}
          />
        </AnimatePresence>
        <div className="absolute inset-0 bg-pink-500/10 backdrop-blur-[1px]"></div>
      </div>
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center text-white text-center px-6">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.5 }}>
           <Heart className="w-16 h-16 text-pink-400 fill-pink-400 drop-shadow-lg mx-auto mb-4 animate-pulse" />
        </motion.div>
        <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.8 }} className="text-5xl font-bold mb-4 font-serif drop-shadow-md">
          {CONFIG.cover.title}
        </motion.h1>
        <motion.h2 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 1.1 }} className="text-2xl font-medium tracking-wider drop-shadow-sm">
          {CONFIG.cover.names}
        </motion.h2>
      </div>
      <motion.div animate={{ y: [0, 10, 0] }} transition={{ repeat: Infinity, duration: 1.5 }} className="absolute bottom-8 left-0 right-0 flex justify-center text-white/80 z-20">
        <ChevronDown />
      </motion.div>
    </div>
  );
};

// (4) 数据统计页
const StatsPage = () => (
  <div className="h-full bg-[#FFF0F5] p-8 flex flex-col justify-center relative overflow-hidden">
     <CuteDeco src={CONFIG.deco.chiikawa} className="-top-5 -right-5 w-32" />
     <CuteDeco src={CONFIG.deco.hachiwareFail} className="bottom-10 -left-8 w-24" rotate={-20}/>

    <motion.h2 initial={{x:-50, opacity:0}} animate={{x:0, opacity:1}} className="text-3xl font-bold text-pink-800 mb-10 text-center font-serif relative z-10">
      我们的心动数据
    </motion.h2>

    <div className="grid grid-cols-2 gap-4 relative z-10">
      {[
        { label: "在一起", value: `${CONFIG.chatStats.daysTogether} 天`, icon: <Calendar className="text-pink-500" />, bg: "bg-pink-100" },
        { label: "爱的讯息", value: CONFIG.chatStats.messageCount, icon: <Heart className="text-red-500" />, bg: "bg-red-100" },
        { label: "最爱表情", value: CONFIG.chatStats.mostUsedEmoji, icon: <Star className="text-yellow-500" />, bg: "bg-yellow-100", isEmoji: true },
        { label: "甜蜜通话", value: `${CONFIG.chatStats.callHours} 小时`, icon: <Music className="text-purple-500" />, bg: "bg-purple-100" },
      ].map((stat, index) => (
        <motion.div
          key={index}
          initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ delay: index * 0.15, type: "spring" }}
          className={`${stat.bg} p-5 rounded-3xl shadow-sm border-2 border-white/50 flex flex-col items-center justify-center text-center`}
        >
          <div className="mb-2">{stat.icon}</div>
          <div className={`font-bold text-pink-900 ${stat.isEmoji ? 'text-4xl' : 'text-xl'}`}>{stat.value}</div>
          <div className="text-sm text-pink-600 mt-1">{stat.label}</div>
        </motion.div>
      ))}
    </div>

    <motion.div initial={{y:50, opacity:0}} animate={{y:0, opacity:1}} transition={{delay: 0.8}} className="mt-10 bg-white/70 backdrop-blur-sm p-6 rounded-3xl border-2 border-pink-200 shadow-md relative z-10">
      <h3 className="text-pink-800 font-bold mb-4 flex items-center justify-center gap-2">
        <Heart className="fill-pink-400 text-pink-400 w-5 h-5"/> 我们最爱说
      </h3>
      <div className="flex flex-wrap gap-3 justify-center">
        {CONFIG.chatStats.Keywords.map((kw, i) => (
          <motion.span whileHover={{scale: 1.1, rotate: i%2===0 ? 5 : -5}} key={i} className="px-4 py-2 bg-pink-200 text-pink-700 rounded-full font-medium text-sm shadow-sm">
            {kw}
          </motion.span>
        ))}
      </div>
    </motion.div>
  </div>
);

// (5) 时间线页
const TimelinePage = () => (
  <div className="min-h-full bg-gradient-to-b from-purple-50 via-pink-50 to-red-50 p-6 relative overflow-x-hidden">
    <CuteDeco src={CONFIG.deco.loopy} className="top-20 right-2 w-24" rotate={-15}/>
    <div className="max-w-2xl mx-auto pt-12 pb-20 relative z-10">
      <motion.div initial={{opacity:0, y:20}} animate={{opacity:1, y:0}} className="text-center mb-16">
         <h2 className="text-4xl font-bold text-pink-800 font-serif">我们的足迹</h2>
         <p className="text-pink-600 mt-3 text-lg">从江南到北国，爱在蔓延</p>
      </motion.div>

      <div className="relative">
        <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-pink-200 rounded-full"></div>
        {CONFIG.timeline.map((item, index) => {
          const isEven = index % 2 === 0;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: isEven ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className={`flex items-center mb-12 relative ${isEven ? 'flex-row-reverse' : ''}`}
            >
              <div className={`w-[45%] ${isEven ? 'text-right pr-8' : 'pl-8'}`}>
                <div className="bg-white/80 backdrop-blur-md p-5 rounded-3xl shadow-md border-2 border-pink-100 hover:shadow-lg transition-shadow">
                  <div className={`text-sm font-bold text-pink-500 mb-1 font-serif flex items-center gap-2 ${isEven ? 'justify-end' : ''}`}>
                    {!isEven && item.icon} {item.date} {isEven && item.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                  {item.tags && <div className={`flex flex-wrap gap-2 mt-3 ${isEven ? 'justify-end' : ''}`}>{item.tags.map((tag, i)=>(<span key={i} className="text-xs px-2 py-1 bg-pink-100 text-pink-600 rounded-full">{tag}</span>))}</div>}
                </div>
              </div>

              <div className="w-[10%] flex justify-center relative z-20">
                <motion.div whileHover={{scale: 1.2}} className="w-6 h-6 bg-pink-500 rounded-full border-4 border-white shadow-sm flex items-center justify-center">
                  <Heart className="w-3 h-3 text-white fill-white" />
                </motion.div>
              </div>

              <div className="w-[45%] pl-8 flex items-center justify-center">
                 {item.image ? (
                   <div className={isEven ? 'mr-8' : ''}>
                      <LivePhotoFrame src={item.image} rotate={isEven ? 3 : -3} className="w-full h-auto shadow-lg" />
                   </div>
                 ) : <div className={isEven ? 'mr-8' : ''}></div>}
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
    <div className="text-center text-pink-400 text-sm pb-10 animate-bounce">继续向下滑动...</div>
  </div>
);

// (6) 结尾页
const EndingPage = () => (
  <div className="h-full bg-pink-900 text-white flex flex-col items-center justify-center p-10 text-center relative overflow-hidden">
     <CuteDeco src={CONFIG.deco.usagiDance} className="top-20 left-10 w-32" rotate={-10} />
    <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ type: "spring", stiffness: 150 }} className="mb-10">
      <Heart className="w-24 h-24 text-pink-300 fill-pink-300 animate-pulse" />
    </motion.div>
    <motion.h2 initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.3 }} className="text-4xl font-bold mb-6 font-serif">
      未完待续...
    </motion.h2>
    <motion.p initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.6 }} className="text-lg text-pink-200 leading-relaxed max-w-md">
      异地只是暂时的，我们的未来是长久的。<br/>无论哈尔滨还是南京，<br/>有你的地方，就是家。
    </motion.p>
    <motion.p initial={{ y: 20, opacity: 0 }} whileInView={{ y: 0, opacity: 1 }} transition={{ delay: 0.9 }} className="mt-10 text-xl font-bold">
      永远爱你 ❤️
    </motion.p>
    <div className="absolute bottom-5 text-sm text-pink-400/50">Made for us @ 2026</div>
  </div>
);

// ==========================================
// 4. 主程序 (入口)
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

  if (isLoading) return <Preloader onComplete={() => setIsLoading(false)} />;

  const handleUnlock = () => { setIsLocked(false); controls.play(); };

  const handleScroll = (e: React.WheelEvent | React.TouchEvent) => {
      if (isLocked || currentPage === 2) return;
      let deltaY = 0;
      if ('deltaY' in e) deltaY = e.deltaY;
      else if ('changedTouches' in e) deltaY = (e as any).changedTouches[0].clientY; // 简化处理
      
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
                  {currentPage === 2 ? (
                     <motion.div key="long" variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition} 
                        className="w-full h-full overflow-y-auto overflow-x-hidden" 
                        onWheel={(e) => e.stopPropagation()} onTouchEnd={(e) => e.stopPropagation()}>
                       {pages[2]}
                        <div className="bg-red-50 pb-20 pt-10 text-center">
                          <motion.button whileHover={{scale:1.05}} whileTap={{scale:0.95}} onClick={() => setCurrentPage(3)} className="px-8 py-3 bg-pink-500 text-white rounded-full font-bold shadow-md text-lg">
                            走向未来 ❤️
                          </motion.button>
                        </div>
                     </motion.div>
                  ) : (
                    <motion.div key={`page-${currentPage}`} variants={pageVariants} initial="initial" animate="in" exit="out" transition={pageTransition} className="w-full h-full absolute inset-0">
                        {pages[currentPage]}
                    </motion.div>
                  )}
              </AnimatePresence>
           </motion.div>
        )}
      </AnimatePresence>

      {!isLocked && currentPage !== 2 && (
        <div className="fixed right-4 top-1/2 transform -translate-y-1/2 flex flex-col gap-3 z-50">
          {pages.map((_, index) => (
             index !== 2 && (
              <motion.div key={index} animate={{ scale: currentPage === index ? 1.5 : 1, backgroundColor: currentPage === index ? '#EC4899' : '#DBEafe' }} className="w-3 h-3 rounded-full shadow-sm cursor-pointer" onClick={() => setCurrentPage(index)} />
             )
          ))}
        </div>
      )}
    </div>
  );
}

export default App;