import React, { useState, useEffect, useRef } from 'react';
import ReactMarkdown from 'react-markdown';
import { 
  Brain, Layout, CheckCircle2, AlertTriangle, Coffee, Calendar, 
  ArrowRight, Loader2, History, Plus, X, Save, CheckSquare, Square, Trash2, 
  Briefcase, User, MoreHorizontal, Mail, RefreshCw, Maximize2, Clock, Tag, Send, MapPin, 
  MessageCircle, RotateCcw, Filter, ChevronDown, ChevronUp, ChevronRight, // 여기에 ChevronRight를 꼭 넣어주세요!
  List, Layers, PenTool, Search, Edit2, BarChart2, PieChart, CornerDownRight, Copy, ClipboardCheck, Mic, MicOff, Cloud, Sun, CloudRain, Wind, Settings, ExternalLink, Smartphone, Sparkles, Check, Activity, AlertCircle, GanttChartSquare, AlignJustify, GripVertical, FileText, TrendingUp, Globe, Flag, Link, FilePlus, StickyNote, Upload, BookOpen, Bookmark, RotateCcw as ResetIcon,
  Network, ZoomIn, ZoomOut, Move,
  Star
} from 'lucide-react';

const API_URL = "https://script.google.com/macros/s/AKfycbzwqxkMSbhAZ0C_ro_AbHE8g8_zaNwCbH2l1kdu4Vxt_CWQCAEX_wZXKiYUW5YWo2vKJg/exec";

// [Constants] Shared Data
const DEPARTMENTS = ["생산부", "영업/무역부", "금형부", "총무부", "경리부", "포장실", "품질관리부", "제품관리부", "수리부", "개발부"];
const EMAIL_CATEGORIES = ["일일 브리핑", "품질 이슈", "프로젝트", "특정 이슈"];

// [Toast Component]
const Toast = ({ message, type, onClose }) => {
  if (!message) return null;
  const isError = type === 'error';
  return (
    <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[110] animate-slideDown flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl backdrop-blur-md border transition-all duration-300 bg-slate-900/90 border-white/10">
      <div className={`p-2 rounded-full ${isError ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'}`}>
        {isError ? <AlertTriangle size={20} /> : <CheckCircle2 size={20} />}
      </div>
      <span className="text-sm font-bold text-white">{message}</span>
      <button onClick={onClose} className="ml-2 text-slate-500 hover:text-white transition-colors"><X size={16}/></button>
    </div>
  );
};

// [Resource Input Modal Component]
const ResourceInputModal = ({ isOpen, onClose, onAdd, onUpload, isUploading }) => {
    if (!isOpen) return null;
    const [name, setName] = useState("");
    const [link, setLink] = useState("");
    const fileRef = useRef(null);

    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4 animate-fadeIn" onClick={onClose}>
            <div className="bg-slate-900 border border-white/10 p-5 rounded-2xl w-full max-w-sm shadow-2xl space-y-4 relative" onClick={e => e.stopPropagation()}>
                <h4 className="text-sm font-bold text-slate-200 mb-2">새 자료 추가</h4>
                <input type="text" value={name} onChange={e => setName(e.target.value)} placeholder="자료명 (예: 기획안)" className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-200 outline-none focus:border-blue-500"/>
                <input type="text" value={link} onChange={e => setLink(e.target.value)} placeholder="링크 URL (선택)" className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 text-sm text-slate-200 outline-none focus:border-blue-500"/>
                <div className="flex gap-2">
                    <button onClick={() => { onAdd(name, link); setName(""); setLink(""); onClose(); }} disabled={!name.trim()} className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold text-sm transition-colors disabled:opacity-50">링크 추가</button>
                </div>
                <div className="relative border-t border-white/10 pt-4 mt-2">
                    <p className="text-center text-xs text-slate-500 mb-2">- 또는 -</p>
                    <input type="file" ref={fileRef} className="hidden" onChange={(e) => { onUpload(e); onClose(); }} />
                    <button onClick={() => fileRef.current?.click()} disabled={isUploading} className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl font-bold text-sm flex items-center justify-center gap-2 border border-slate-700 transition-colors">
                        {isUploading ? <Loader2 size={16} className="animate-spin"/> : <Upload size={16}/>} 파일 업로드
                    </button>
                </div>
                <button onClick={onClose} className="absolute top-2 right-2 text-slate-500 hover:text-white p-2"><X size={18}/></button>
            </div>
        </div>
    );
};

const GlobalStatusWidget = () => {
  const [time, setTime] = useState(new Date());
  const [weather, setWeather] = useState({ kr: null, vn: null });
  
  useEffect(() => { const timer = setInterval(() => setTime(new Date()), 60000); return () => clearInterval(timer); }, []);
  
  useEffect(() => { 
    const fetchWeather = async () => { 
      try { 
        const res = await fetch("https://api.open-meteo.com/v1/forecast?latitude=37.63,11.15&longitude=127.21,106.60&current_weather=true&timezone=auto"); 
        const data = await res.json(); 
        if (data && data.length >= 2) { 
          setWeather({ 
            kr: { temp: Math.round(data[0].current_weather.temperature), code: data[0].current_weather.weathercode }, 
            vn: { temp: Math.round(data[1].current_weather.temperature), code: data[1].current_weather.weathercode } 
          }); 
        } 
      } catch (e) {} 
    }; 
    fetchWeather(); 
    const weatherTimer = setInterval(fetchWeather, 1800000); 
    return () => clearInterval(weatherTimer); 
  }, []);

  const getWeatherIcon = (code) => { 
    if (code === undefined) return <Loader2 size={14} className="animate-spin"/>;
    if (code <= 3) return <Sun size={16} className="text-amber-400"/>; 
    if (code <= 67) return <CloudRain size={16} className="text-blue-400"/>; 
    return <Cloud size={16} className="text-slate-400"/>;
  };
  
  const vnTime = new Date(time.getTime() - 2 * 60 * 60 * 1000);
  
  return (
    <div className="flex items-center gap-2 lg:gap-3 bg-slate-800/60 rounded-2xl p-1.5 border border-white/5 shadow-sm overflow-hidden">
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/50 border border-white/5">
        <span className="text-lg">🇰🇷</span>
        <div className="flex flex-col items-start leading-none">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">HQ</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-200 font-mono">{time.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
            <div className="hidden lg:flex items-center gap-1">
              <span className="w-px h-3 bg-slate-700"></span>
              {getWeatherIcon(weather.kr?.code)}
              <span className="text-xs font-bold text-slate-300">{weather.kr?.temp ?? '--'}°</span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/50 border border-white/5">
        <span className="text-lg">🇻🇳</span>
        <div className="flex flex-col items-start leading-none">
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">VN</span>
          <div className="flex items-center gap-2">
            <span className="text-sm font-bold text-slate-200 font-mono">{vnTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false })}</span>
            <div className="hidden lg:flex items-center gap-1">
              <span className="w-px h-3 bg-slate-700"></span>
              {getWeatherIcon(weather.vn?.code)}
              <span className="text-xs font-bold text-slate-300">{weather.vn?.temp ?? '--'}°</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const useSpeechRecognition = (onResult) => {
  const [isListening, setIsListening] = useState(false);
  const recognitionRef = useRef(null);
  useEffect(() => { 
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) { 
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition; 
      recognitionRef.current = new SpeechRecognition(); 
      recognitionRef.current.continuous = false; 
      recognitionRef.current.interimResults = false; 
      recognitionRef.current.lang = 'ko-KR'; 
      recognitionRef.current.onresult = (e) => { onResult(e.results[0][0].transcript); setIsListening(false); }; 
      recognitionRef.current.onerror = () => setIsListening(false); 
      recognitionRef.current.onend = () => setIsListening(false); 
    } 
  }, [onResult]);
  const startListening = () => { 
    if (recognitionRef.current && !isListening) { 
      try { recognitionRef.current.start(); setIsListening(true); } catch (e) {} 
    } 
  }; 
  return { isListening, startListening, isSupported: !!recognitionRef.current };
};

const getDday = (dateString) => { 
  if (!dateString) return null; 
  const target = new Date(dateString);
  const today = new Date();
  target.setHours(0,0,0,0); today.setHours(0,0,0,0); 
  const diff = Math.ceil((target - today) / (1000 * 60 * 60 * 24));
  if (diff === 0) return { label: "D-Day", color: "bg-red-500 text-white font-extrabold animate-pulse" };
  if (diff < 0) return { label: `지연 +${Math.abs(diff)}`, color: "bg-red-900/50 text-red-200 border border-red-500/30" };
  if (diff <= 3) return { label: `D-${diff}`, color: "bg-orange-400 text-slate-900 font-black border border-orange-500" };
  return { label: `D-${diff}`, color: "bg-slate-700 text-slate-400" }; 
};

// [Helper] Check Task Progress (Subtask based)
const getTaskProgress = (task) => {
    if (!task) return 0;
    if (task.status === 'Done') return 100;
    let subs = [];
    try {
        subs = typeof task.subTasks === 'string' ? JSON.parse(task.subTasks) : (task.subTasks || []);
    } catch(e) { subs = []; }
    if (!subs || subs.length === 0) return 0;
    const doneCount = subs.filter(s => s.done).length;
    return Math.round((doneCount / subs.length) * 100);
};

// [Helper] Get Task Health (Live Calculation for Modal)
const getTaskHealthLive = (task, currentSubTasks) => {
    if (!task || !task.dueDate) return null;
    const today = new Date();
    // Assuming task.date is creation date, or fallback to somewhat recent
    const createdDate = new Date(task.date || new Date(today.getTime() - 7 * 24 * 60 * 60 * 1000)); 
    const dueDate = new Date(task.dueDate);
    
    const totalDuration = (dueDate - createdDate) / (1000 * 60 * 60 * 24);
    const elapsed = (today - createdDate) / (1000 * 60 * 60 * 24);
    
    let timePercent = 0;
    if (totalDuration > 0) {
        timePercent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100));
    }

    let progress = 0;
    if (currentSubTasks && currentSubTasks.length > 0) {
        const doneCount = currentSubTasks.filter(s => s.done).length;
        progress = Math.round((doneCount / currentSubTasks.length) * 100);
    } else if (task.status === 'Done') {
        progress = 100;
    }

    let status = "NORMAL";
    let message = "일정에 맞춰 순조롭게 진행 중입니다.";
    let color = "text-emerald-400";
    let bg = "bg-emerald-500/10 border-emerald-500/20";
    const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

    if (task.status === 'Done' || progress === 100) {
        return { status: "DONE", message: "모든 항목이 완료되었습니다.", color: "text-emerald-400", bg: "bg-emerald-500/10 border-emerald-500/20", progress, timePercent };
    }

    if (diffDays < 0) {
        status = "OVERDUE";
        message = "마감일이 지났습니다. 우선적으로 처리하세요.";
        color = "text-red-500";
        bg = "bg-red-500/10 border-red-500/20";
    } else if (diffDays <= 3 && progress < 80) {
        status = "RISK";
        message = "마감이 임박했습니다. 속도를 내야 합니다!";
        color = "text-red-400";
        bg = "bg-red-500/10 border-red-500/20";
    } else if (timePercent > progress + 20) {
        status = "WARNING";
        message = "시간 경과 대비 진행률이 낮습니다.";
        color = "text-amber-400";
        bg = "bg-amber-500/10 border-amber-500/20";
    }
    
    return { status, message, color, bg, progress, timePercent };
};

const GlassCard = ({ children, className = "", title, icon: Icon, accentColor = "text-blue-400", rightElement, noPadding = false }) => (
  <div className={`relative overflow-hidden rounded-3xl bg-slate-800/40 backdrop-blur-xl border border-white/10 shadow-2xl transition-all duration-300 hover:shadow-indigo-500/10 hover:border-white/20 flex flex-col ${className} ${noPadding ? 'p-0' : 'p-6'}`}>
    {(title || Icon) && (
      <div className={`flex shrink-0 items-center justify-between mb-4 ${noPadding ? 'p-6 pb-0' : ''}`}>
        <div className="flex items-center gap-2">
          {Icon && <div className={`p-2 rounded-xl bg-white/5 ${accentColor}`}><Icon size={18} /></div>}
          {typeof title === 'string' ? <h3 className="font-bold text-slate-100 text-lg">{title}</h3> : title}
        </div>
        {rightElement}
      </div>
    )}
    <div className={`flex-1 min-h-0 flex flex-col relative lg:overflow-y-auto lg:overflow-x-hidden custom-scrollbar ${noPadding ? '' : 'p-1'}`}>
      {children}
    </div>
  </div>
);

// onOpenMindMap prop 추가 및 버튼 렌더링
const ProjectItem = ({ data, onClick, onDoubleClick, isActive, onOpenMindMap }) => {
  const dDay = data.dueDate ? getDday(data.dueDate) : null;
  return ( 
    <div onClick={onClick} onDoubleClick={onDoubleClick} className={`p-4 rounded-2xl mb-3 border transition-all cursor-pointer group shadow-sm hover:scale-[1.01] relative select-none ${isActive ? 'bg-indigo-600/20 border-indigo-500 ring-1 ring-indigo-500/50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
      <div className="flex justify-between items-start mb-2">
        <div className="flex-1 pr-2 overflow-hidden">
          <div className="flex items-center gap-1.5 mb-2">
             <span className="text-base">{data.country === 'VN' ? '🇻🇳' : '🇰🇷'}</span>
             <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${data.status === 'Active' ? 'bg-blue-500/20 text-blue-300' : data.status === 'Done' ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-500/20 text-slate-400'}`}>{data.status}</span>
          </div>
          <h4 className="font-bold text-slate-200 text-sm leading-relaxed truncate">{data.title}</h4>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          
          {/* 마인드 맵 아이콘 버튼 (D-Day 왼쪽) */}
          <button 
             onClick={(e) => { e.stopPropagation(); onOpenMindMap(data); }}
             className="p-1.5 text-slate-400 hover:text-indigo-400 hover:bg-white/10 rounded-lg transition-colors"
             title="마인드 맵 보기"
          >
             <Network size={16}/>
          </button>

          {dDay && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${dDay.color}`}>{dDay.label}</span>}
          <span className={`text-xl font-black ${data.progress === 100 ? 'text-emerald-400' : 'text-blue-400'}`}>{data.progress}%</span>
        </div>
      </div>
      <div className="w-full bg-slate-700/50 rounded-full h-1.5 overflow-hidden mt-1">
        <div className={`h-full rounded-full transition-all duration-1000 ${data.progress === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-500 to-indigo-500'}`} style={{ width: `${data.progress}%` }}></div>
      </div>
    </div>
  );
};

const ScheduleItem = ({ event }) => ( <div className="flex gap-3 items-start p-3 bg-white/5 rounded-xl hover:bg-white/10 transition-colors border border-transparent hover:border-white/10 shrink-0"><div className="flex flex-col items-center min-w-[45px]"><span className="text-xs font-bold text-slate-400">{event.isAllDay ? 'ALL' : event.time}</span>{!event.isAllDay && <div className="h-full w-0.5 bg-slate-700 my-1 rounded-full"></div>}</div><div className="flex-1"><p className="font-bold text-sm text-slate-200 leading-tight">{event.title}</p>{event.location && <div className="flex items-center gap-1 text-[10px] text-slate-500 mt-1"><MapPin size={10} /> <span>{event.location}</span></div>}</div></div> );
const ChatBubble = ({ isUser, text }) => ( <div className={`flex w-full mb-3 ${isUser ? 'justify-end' : 'justify-start'}`}>{!isUser && <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center text-indigo-300 mr-2 shrink-0"><Brain size={16}/></div>}<div className={`max-w-[80%] p-3 rounded-2xl text-sm leading-relaxed shadow-sm ${isUser ? 'bg-indigo-600 text-white rounded-tr-none' : 'bg-slate-700/80 text-slate-200 rounded-tl-none border border-slate-600/50'}`}><ReactMarkdown>{text}</ReactMarkdown></div></div> );
const DetailModal = ({ isOpen, onClose, title, children, themeColor = "indigo", onCopy, onSendEmail, isSending, size = "default" }) => { if (!isOpen) return null;
  const [copied, setCopied] = useState(false); const handleCopy = () => { if(onCopy) { onCopy(); setCopied(true); setTimeout(() => setCopied(false), 2000); } }; 
  const maxWidthClass = size === "large" ? "max-w-[95vw] lg:max-w-[1400px]" : "max-w-2xl";
  const heightClass = size === "large" ? "h-[92vh]" : "max-h-[90vh]";

  return ( <div className="fixed inset-0 z-[150] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fadeIn" onClick={onClose}><div className={`bg-slate-900 rounded-2xl shadow-2xl w-full ${maxWidthClass} ${heightClass} overflow-hidden border border-white/10 scale-100 transition-transform flex flex-col`} onClick={e => e.stopPropagation()}><div className={`p-6 border-b border-white/5 flex justify-between items-center bg-${themeColor}-900/20`}><h3 className={`text-xl font-extrabold text-slate-100`}>{title}</h3><div className="flex gap-2">{onSendEmail && (<button onClick={onSendEmail} disabled={isSending} className={`p-2 rounded-full transition-colors flex items-center gap-1 px-3 ${isSending ? 'bg-slate-700 text-slate-400' : 'hover:bg-white/10 text-slate-400 hover:text-white'}`}>{isSending ? <Loader2 size={18} className="animate-spin"/> : <Mail size={18}/>}{isSending && <span className="text-xs font-bold">발송중</span>}</button>)}{onCopy && (<button onClick={handleCopy} className={`p-2 rounded-full transition-colors flex items-center gap-1 px-3 ${copied ? 'bg-emerald-500/20 text-emerald-400' : 'hover:bg-white/10 text-slate-400 hover:text-white'}`}>{copied ? <ClipboardCheck size={18}/> : <Copy size={18}/>}{copied && <span className="text-xs font-bold">복사됨</span>}</button>)}<button onClick={onClose} className="p-2 rounded-full hover:bg-white/10 text-slate-400 hover:text-white transition-colors"><X size={24}/></button></div></div><div className="p-0 overflow-hidden flex flex-col h-full bg-[#0f172a]">{children}</div></div></div> );
};

const FloatingActionButton = ({ onClick }) => ( <button onClick={onClick} className="lg:hidden fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-2xl flex items-center justify-center active:scale-90 transition-transform z-40 border-4 border-slate-900 hover:bg-indigo-500"><Plus size={28} /></button> );
const PriorityBadge = ({ priority }) => { const styles = { High: 'bg-red-500/20 text-red-300', Medium: 'bg-blue-500/20 text-blue-300', Low: 'bg-slate-500/20 text-slate-400', Hold: 'bg-amber-500/20 text-amber-300', Review: 'bg-purple-500/20 text-purple-300' };
  return <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${styles[priority] || styles.Medium} flex items-center gap-1 shrink-0`}>{priority}</span>; };
const CountBadge = ({ count, color = "blue" }) => (<span className={`ml-2 text-xs font-bold px-2 py-0.5 rounded-full bg-${color}-500/20 text-${color}-300`}>{count}</span>);
const VoiceButton = ({ onSpeech }) => { const { isListening, startListening, isSupported } = useSpeechRecognition(onSpeech); if (!isSupported) return null;
  return <button onClick={startListening} className={`p-3 rounded-xl transition-all ${isListening ? 'bg-red-500 text-white animate-pulse' : 'bg-slate-700 text-slate-300 hover:bg-slate-600'}`}>{isListening ? <MicOff size={18}/> : <Mic size={18}/>}</button>; };

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, type = 'danger' }) => { if (!isOpen) return null;
  const isDanger = type === 'danger'; return ( <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn" onClick={onClose}><div className="bg-slate-900 rounded-2xl shadow-2xl w-full max-w-sm border border-white/10 p-6 transform transition-all scale-100" onClick={e => e.stopPropagation()}><div className="flex items-center gap-3 mb-4"><div className={`p-3 rounded-full ${isDanger ? 'bg-red-500/20 text-red-500' : 'bg-indigo-500/20 text-indigo-400'}`}>{isDanger ? <AlertTriangle size={24}/> : <CheckCircle2 size={24}/>}</div><h3 className="text-lg font-bold text-slate-200">{title}</h3></div><p className="text-slate-400 text-sm mb-6 leading-relaxed whitespace-pre-wrap">{message}</p><div className="flex gap-3"><button onClick={onClose} className="flex-1 py-3 rounded-xl bg-slate-800 text-slate-400 font-bold hover:bg-slate-700 transition-colors">취소</button><button onClick={onConfirm} className={`flex-1 py-3 rounded-xl font-bold text-white transition-colors ${isDanger ? 'bg-red-600 hover:bg-red-500' : 'bg-indigo-600 hover:bg-indigo-500'}`}>확인</button></div></div></div> );
};

const TimelineView = ({ projects, onClick, onDoubleClick, activeProjectId }) => { const validProjects = projects ? projects.filter(p => p.startDate && p.dueDate) : []; if (validProjects.length === 0) { return ( <div className="w-full h-full min-h-[300px] flex flex-col items-center justify-center text-slate-500 bg-slate-900/30 rounded-xl border border-white/5 animate-fadeIn"><div className="p-4 bg-slate-800/50 rounded-full mb-3"><Calendar size={32} className="opacity-50"/></div><p className="text-sm font-bold text-slate-300">일정이 설정된 프로젝트가 없습니다.</p><p className="text-xs mt-2 opacity-70">리스트에서 프로젝트를 더블클릭 후 [수정]하여</p><p className="text-xs opacity-70">'시작일'과 '완료 예정일'을 입력해주세요.</p></div> );
} const dates = validProjects.map(p => [new Date(p.startDate), new Date(p.dueDate)]).flat(); const minDate = new Date(Math.min(...dates)); const maxDate = new Date(Math.max(...dates));
minDate.setDate(minDate.getDate() - 7); maxDate.setDate(maxDate.getDate() + 7); const totalDays = (maxDate - minDate) / (1000 * 60 * 60 * 24);
const today = new Date(); const todayPos = ((today - minDate) / (1000 * 60 * 60 * 24)) / totalDays * 100;
return ( <div className="relative w-full h-full min-h-[300px] overflow-hidden bg-slate-900/30 rounded-xl border border-white/5 p-4 flex flex-col"><div className="flex justify-between text-[10px] text-slate-500 pb-2 border-b border-white/5 mb-2 select-none"><span>{minDate.toLocaleDateString()}</span><span className="text-red-400 font-bold">Today</span><span>{maxDate.toLocaleDateString()}</span></div><div className="absolute top-10 bottom-0 w-px bg-red-500/50 z-0 dashed" style={{ left: `${todayPos}%`, borderLeft: '1px dashed rgba(248, 113, 113, 0.5)' }}></div><div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 relative z-10">{validProjects.map(p => { const start = new Date(p.startDate); const end = new Date(p.dueDate); const left = Math.max(0, ((start - minDate) / (1000 * 60 * 60 * 24)) / totalDays * 100); const width = Math.min(100, ((end - start) / (1000 * 60 * 60 * 24)) / totalDays * 100); 

  return ( <div key={p.id} onClick={() => onClick(p.id)} onDoubleClick={() => onDoubleClick(p)} className={`group relative h-10 rounded-lg transition-all cursor-pointer select-none hover:bg-white/5 ${activeProjectId === p.id ? 'ring-1 ring-blue-500 bg-blue-500/10' : ''}`}><div className="absolute top-2 h-6 rounded-md bg-slate-700/50 overflow-hidden flex items-center shadow-sm group-hover:shadow-md transition-all border border-white/5" style={{ left: `${left}%`, width: `${width}%`, minWidth: '4px' }}><div className={`h-full transition-all duration-1000 ${p.progress === 100 ? 'bg-emerald-500' : 'bg-blue-600'}`} style={{ width: `${p.progress}%` }}></div><span className="absolute left-2 text-[10px] font-bold text-white whitespace-nowrap drop-shadow-md truncate max-w-full px-1">{p.title}</span></div></div> ); })}</div></div> );
};

// props에 refLinks, emailAnalysisList 추가 (기본값 빈 배열 설정)
const StatsView = ({ projects, tasks, refLinks = [], emailAnalysisList = [] }) => {
  const activeProjects = projects.filter(p => p.status === 'Active');
  const doneProjects = projects.filter(p => p.status === 'Done');
  const holdProjects = projects.filter(p => p.status === 'OnHold');
  const pendingTasks = tasks.filter(t => t.status === 'Pending');
  const highPriorityTasks = pendingTasks.filter(t => t.priority === 'High');
  const deptCounts = activeProjects.reduce((acc, cur) => { const d = cur.department || "미지정"; acc[d] = (acc[d] || 0) + 1; return acc; }, {});
  const krProjects = activeProjects.filter(p => p.country === 'KR').length;
  const vnProjects = activeProjects.filter(p => p.country === 'VN').length;

  return (
    <div className="space-y-6 p-8 overflow-y-auto custom-scrollbar h-full">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {/* 1. 총 프로젝트 카드 (기존 유지) */}
        <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center">
           <span className="text-slate-400 text-xs font-bold uppercase mb-1">총 프로젝트</span>
           <span className="text-3xl font-black text-white">{projects.length}</span>
           <span className="text-[10px] text-slate-500 mt-1">Active: {activeProjects.length}</span>
        </div>
        {/* 2. 진행률 카드 (기존 유지) */}
        <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center">
           <span className="text-slate-400 text-xs font-bold uppercase mb-1">진행률(Avg)</span>
           <span className="text-3xl font-black text-blue-400">
             {projects.length ? Math.round(projects.reduce((acc, cur) => acc + (cur.progress||0), 0) / projects.length) : 0}%
           </span>
           <span className="text-[10px] text-slate-500 mt-1">완료: {doneProjects.length}건</span>
        </div>
        {/* 3. 남은 할 일 카드 (기존 유지) */}
        <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center">
           <span className="text-slate-400 text-xs font-bold uppercase mb-1">남은 할 일</span>
           <span className="text-3xl font-black text-indigo-400">{pendingTasks.length}</span>
           <span className="text-[10px] text-red-400 mt-1 font-bold">긴급: {highPriorityTasks.length}건</span>
        </div>
        
        {/*  4. 부서 가동률 -> 지식 자산 (자료+이메일 통계) */}
        <div className="bg-slate-800/50 p-4 rounded-2xl border border-white/5 flex flex-col items-center justify-center">
           <span className="text-slate-400 text-xs font-bold uppercase mb-1">지식 자산</span>
           <span className="text-3xl font-black text-emerald-400">{refLinks.length + emailAnalysisList.length}</span>
           <span className="text-[10px] text-slate-500 mt-1">자료 {refLinks.length} / 분석 {emailAnalysisList.length}</span>
        </div>
      </div>

      {/* 하단 차트 영역 (기존 유지) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-slate-800/30 p-5 rounded-2xl border border-white/5">
           <h4 className="font-bold text-slate-300 mb-4 flex items-center gap-2"><PieChart size={16}/> 프로젝트 상태 분포</h4>
           <div className="flex items-center justify-center gap-8">
             <div className="relative w-32 h-32 rounded-full" 
                  style={{ background: `conic-gradient(#3b82f6 0% ${activeProjects.length/projects.length*100}%, #10b981 ${activeProjects.length/projects.length*100}% ${(activeProjects.length+doneProjects.length)/projects.length*100}%, #64748b ${(activeProjects.length+doneProjects.length)/projects.length*100}% 100%)` }}>
               <div className="absolute inset-4 bg-slate-900 rounded-full flex items-center justify-center shadow-inner">
                  <span className="font-black text-xl text-white">{projects.length}</span>
               </div>
             </div>
             <div className="space-y-2 text-xs font-bold">
               <div className="flex items-center gap-2"><div className="w-3 h-3 bg-blue-500 rounded-full"></div><span className="text-slate-300">Active ({activeProjects.length})</span></div>
               <div className="flex items-center gap-2"><div className="w-3 h-3 bg-emerald-500 rounded-full"></div><span className="text-slate-300">Done ({doneProjects.length})</span></div>
               <div className="flex items-center gap-2"><div className="w-3 h-3 bg-slate-500 rounded-full"></div><span className="text-slate-300">Hold/Other ({holdProjects.length})</span></div>
             </div>
          </div>
        </div>
        <div className="bg-slate-800/30 p-5 rounded-2xl border border-white/5">
           <h4 className="font-bold text-slate-300 mb-4 flex items-center gap-2"><BarChart2 size={16}/> 할 일 우선순위 (Pending)</h4>
           <div className="flex items-end h-32 gap-3 pt-4 px-2">
             {['High', 'Review', 'Medium', 'Low', 'Hold'].map(p => {
               const count = pendingTasks.filter(t => t.priority === p).length;
               const max = Math.max(...['High', 'Review', 'Medium', 'Low', 'Hold'].map(pr => pendingTasks.filter(t => t.priority === pr).length), 1);
               const colors = { High: 'bg-red-500', Review: 'bg-purple-500', Medium: 'bg-blue-500', Low: 'bg-slate-500', Hold: 'bg-amber-500' };
               return (
                 <div key={p} className="flex-1 flex flex-col justify-end items-center gap-2 h-full group">
                   <span className="text-[10px] font-bold text-white opacity-0 group-hover:opacity-100 transition-opacity">{count}</span>
                   <div className={`w-full rounded-t-lg transition-all duration-700 ${colors[p]}`} style={{ height: `${(count/max)*100}%`, minHeight: '4px' }}></div>
                   <span className="text-[10px] text-slate-500 font-bold">{p.substring(0,3)}</span>
                 </div>
               )
             })}
           </div>
        </div>
        <div className="bg-slate-800/30 p-5 rounded-2xl border border-white/5">
           <h4 className="font-bold text-slate-300 mb-4 flex items-center gap-2"><Briefcase size={16}/> 부서별 활성 프로젝트</h4>
           <div className="space-y-3">
             {Object.entries(deptCounts).sort((a,b) => b[1] - a[1]).map(([dept, count], idx) => (
               <div key={dept} className="flex items-center gap-3">
                 <span className="text-xs font-bold text-slate-400 w-20 truncate">{dept}</span>
                 <div className="flex-1 h-3 bg-slate-700/50 rounded-full overflow-hidden">
                   <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${(count/activeProjects.length)*100}%` }}></div>
                 </div>
                 <span className="text-xs font-bold text-white w-6 text-right">{count}</span>
               </div>
             ))}
             {Object.keys(deptCounts).length === 0 && <p className="text-xs text-slate-500 text-center">활성 프로젝트 없음</p>}
           </div>
        </div>
        <div className="bg-slate-800/30 p-5 rounded-2xl border border-white/5">
           <h4 className="font-bold text-slate-300 mb-4 flex items-center gap-2"><Globe size={16}/> 국가별 프로젝트 분포</h4>
           <div className="flex gap-4">
              <div className="flex-1 bg-blue-500/10 border border-blue-500/20 rounded-xl p-4 flex flex-col items-center">
                <span className="text-2xl mb-2">🇰🇷</span>
                <span className="text-sm font-bold text-slate-300">Korea</span>
                <span className="text-2xl font-black text-blue-400 mt-1">{krProjects}</span>
                <span className="text-[10px] text-slate-500">Active Projects</span>
              </div>
              <div className="flex-1 bg-red-500/10 border border-red-500/20 rounded-xl p-4 flex flex-col items-center">
                <span className="text-2xl mb-2">🇻🇳</span>
                <span className="text-sm font-bold text-slate-300">Vietnam</span>
                <span className="text-2xl font-black text-red-400 mt-1">{vnProjects}</span>
                <span className="text-[10px] text-slate-500">Active Projects</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
};

const MindMapModal = ({ isOpen, onClose, project, tasks, onUpdateTask, onCreateTask, onDeleteTask, onOpenTaskDetail, onOpenProjectDetail }) => {
  if (!isOpen || !project) return null;
  
  // 상태 관리
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const containerRef = useRef(null);

  // 접힌 할 일 목록 상태 관리
  const [collapsedTasks, setCollapsedTasks] = useState({});

  // 토글 함수 (이 함수가 꼭 있어야 합니다)
  const toggleTaskCollapse = (taskId) => {
    setCollapsedTasks(prev => ({
      ...prev,
      [taskId]: !prev[taskId] 
    }));
  };

  // 줌 컨트롤
  const handleZoom = (delta) => setScale(prev => Math.min(2, Math.max(0.3, prev + delta)));

  // 👉 [추가됨] 마우스 휠 줌 핸들러 (요청사항 6)
  const handleWheel = (e) => {
    e.stopPropagation();
    // 휠을 올리면 확대, 내리면 축소 (deltaY가 음수일 때 위로 스크롤)
    const delta = e.deltaY < 0 ? 0.1 : -0.1;
    handleZoom(delta);
  };
  
  // 드래그(Pan) 로직
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - position.x, y: e.clientY - position.y });
  };
  const handleMouseMove = (e) => {
    if (isDragging) {
      setPosition({ x: e.clientX - dragStart.x, y: e.clientY - dragStart.y });
    }
  };
  const handleMouseUp = () => setIsDragging(false);

  // 🌟트리 구조 레이아웃 계산 알고리즘 (토글 기능 적용)
  const calculateLayout = () => {
    const nodes = [];
    const edges = [];
    
    const NODE_WIDTH = 320; 
    
    // Task(부모)와 Subtask(자식)의 높이/간격 설정을 분리
    const TASK_HEIGHT = 80;   // 할 일 카드 높이
    const TASK_GAP = 30;      // 할 일 카드 간격
    
    // 체크리스트 간격 70% 축소 (높이 34px + 간격 6px = 40px)
    const SUBTASK_HEIGHT = 34; 
    const SUBTASK_GAP = 6;     

    const LEVEL_GAP = 120;

    // 1. 데이터 계층화
    const projectNode = { id: 'root', type: 'project', data: project, x: 0, y: 0 };
    const taskNodes = tasks.filter(t => t.projectId === project.id).map(t => {
      let subTasks = [];
      try { subTasks = typeof t.subTasks === 'string' ? JSON.parse(t.subTasks) : (t.subTasks || []); } catch(e) {}
      return { ...t, subTasks };
    });

    // 2. 높이 계산 및 배치
    let currentY = 0;
    
    taskNodes.forEach((task, tIdx) => {
      const subTaskCount = task.subTasks.length;
      const isCollapsed = collapsedTasks[task.id]; 

      // 체크리스트 영역의 총 높이 계산
      // 체크리스트 개수 * (높이 + 간격)
      const subTasksTotalHeight = subTaskCount * (SUBTASK_HEIGHT + SUBTASK_GAP);

      // 해당 Task가 차지할 전체 높이 결정
      // 접힘(Collapsed): Task 높이만 차지
      // 펼침(!Collapsed): Task 높이와 체크리스트 총 높이 중 더 큰 값 사용 (최소 TASK_HEIGHT + TASK_GAP 보장)
      let taskAreaHeight = TASK_HEIGHT + TASK_GAP;
      
      if (!isCollapsed && subTaskCount > 0) {
          // 체크리스트가 펼쳐져 있을 때는, 체크리스트들이 차지하는 공간만큼 높이를 늘려줌
          // 단, 체크리스트가 적어서 Task 높이보다 작을 수 있으므로 max값 사용
          taskAreaHeight = Math.max(taskAreaHeight, subTasksTotalHeight); 
      }
      
      // Task 노드 Y좌표: 할당된 영역의 중앙
      const taskY = currentY + (taskAreaHeight / 2) - (TASK_HEIGHT / 2);

      const taskNodeObj = { 
        id: task.id, type: 'task', data: task, 
        x: NODE_WIDTH + LEVEL_GAP, 
        y: taskY 
      };
      nodes.push(taskNodeObj);
      edges.push({ from: projectNode, to: taskNodeObj });

      // SubTask 배치
      if (!isCollapsed && subTaskCount > 0) {
          // 체크리스트 시작 Y좌표: Task 영역의 시작점부터 차곡차곡 쌓음
          // 시각적 균형을 위해 약간의 오프셋 조정 (중앙 정렬 느낌)
          let subY = currentY + (taskAreaHeight - subTasksTotalHeight) / 2;

          task.subTasks.forEach((sub, sIdx) => {
            const subNodeObj = {
              id: `${task.id}-sub-${sIdx}`, type: 'subtask', 
              data: sub, parentId: task.id, index: sIdx,
              x: (NODE_WIDTH + LEVEL_GAP) * 2,
              y: subY
            };
            nodes.push(subNodeObj);
            edges.push({ from: taskNodeObj, to: subNodeObj });
            
            // 👉 [수정] 줄어든 간격만큼 이동
            subY += (SUBTASK_HEIGHT + SUBTASK_GAP);
          });
      }

      currentY += taskAreaHeight;
    });

    // Project 노드 배치
    projectNode.y = (currentY / 2) - (TASK_HEIGHT / 2);
    if (taskNodes.length === 0) projectNode.y = 300; 
    
    nodes.push(projectNode);
    return { nodes, edges };
  };

  const { nodes, edges } = calculateLayout();

  // 핸들러: Task 추가
  const addTask = () => {
    const title = prompt("새로운 할 일 제목:");
    if(title) onCreateTask(title);
  };

  // 핸들러: SubTask 추가
  const addSubTask = (taskId, currentSubTasks) => {
    const title = prompt("추가할 체크리스트 항목:");
    if(title) {
      const updated = [...currentSubTasks, { title, done: false }];
      onUpdateTask(taskId, 'subTasks', JSON.stringify(updated));
    }
  };

  // 핸들러: 완료 토글
  const toggleStatus = (node) => {
    if (node.type === 'task') {
      const newStatus = node.data.status === 'Done' ? 'Pending' : 'Done';
      onUpdateTask(node.data.id, 'status', newStatus);
    } else if (node.type === 'subtask') {
      const task = tasks.find(t => t.id === node.parentId);
      if(task) {
        let subs = [];
        try { subs = typeof task.subTasks === 'string' ? JSON.parse(task.subTasks) : task.subTasks; } catch(e){}
        const updated = subs.map((s, i) => i === node.index ? { ...s, done: !s.done } : s);
        onUpdateTask(node.parentId, 'subTasks', JSON.stringify(updated));
      }
    }
  };

  const animationStyle = `
    @keyframes dash-flow {
      to { stroke-dashoffset: -20; }
    }
    .animate-flow {
      animation: dash-flow 0.5s linear infinite;
    }
  `;

  return (
    <div className="fixed inset-0 z-[120] bg-slate-900/90 backdrop-blur-md flex flex-col animate-fadeIn">
      {/* 스타일 태그 삽입 */}
      <style>{animationStyle}</style>
      {/* 툴바 */}
      <div className="absolute top-4 left-4 z-10 flex items-center gap-2 p-2 bg-slate-800 rounded-xl border border-white/10 shadow-xl">
        <h3 className="text-slate-200 font-bold px-3 flex items-center gap-2"><Network size={18} className="text-indigo-400"/> {project.title} Map</h3>
        <div className="h-6 w-px bg-slate-700 mx-1"></div>
        <button onClick={() => handleZoom(-0.1)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400"><ZoomOut size={18}/></button>
        <span className="text-xs font-mono text-slate-500 w-10 text-center">{Math.round(scale * 100)}%</span>
        <button onClick={() => handleZoom(0.1)} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400"><ZoomIn size={18}/></button>
        <div className="h-6 w-px bg-slate-700 mx-1"></div>
        <button onClick={() => { setPosition({x:0, y:0}); setScale(1); }} className="p-2 hover:bg-slate-700 rounded-lg text-slate-400" title="Reset View"><Move size={18}/></button>
      </div>
      <button onClick={onClose} className="absolute top-4 right-4 z-10 p-3 bg-slate-800 hover:bg-red-500/20 text-slate-400 hover:text-red-400 rounded-full border border-white/10 transition-colors"><X size={24}/></button>

      {/* 캔버스 영역 */}
      <div 
        ref={containerRef}
        className={`flex-1 overflow-hidden cursor-${isDragging ? 'grabbing' : 'grab'} relative bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-slate-800/20 via-slate-900/50 to-slate-900`}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}  // 휠 줌 이벤트 연결
      >
        <div 
          className="absolute origin-top-left transition-transform duration-100 ease-out"
          style={{ transform: `translate(${position.x + 100}px, ${position.y + 100}px) scale(${scale})` }}
        >
          {/* 연결선 (SVG) */}
          <svg className="overflow-visible absolute top-0 left-0 pointer-events-none" style={{ width: 1, height: 1 }}>
            {edges.map((edge, i) => {
              const startX = edge.from.x + 320; 
              
              // 출발점 높이 조정: Subtask에서 나가는 선은 없지만, 만약 있다면 높이 조정 필요
              // 여기서는 Task -> Subtask로 가는 선이므로 startY는 Task 높이 기준(+25) 유지
              const startY = edge.from.y + 25;  
              
              const endX = edge.to.x;
              
              // 도착점(Target)이 Subtask면 높이 절반(약 17px) 지점으로 조정
              // Task는 +25px 유지 (높이가 크니까)
              const isSubTarget = edge.to.type === 'subtask';
              const endY = edge.to.y + (isSubTarget ? 17 : 25);
              
              // 곡선을 더 완만하게 만들기 위해 텐션도 약간 증가
              const tension = 100;
              const controlX1 = startX + tension;
              const controlX2 = endX - tension;

              // 상태별 연결선 스타일 로직
              let strokeColor = '#64748b'; // 기본: 회색 (slate-500)
              let strokeDash = '0';        // 기본: 실선
              let animationClass = '';     // 기본: 애니메이션 없음
              let strokeWidth = '2';

              const target = edge.to;

              if (target.type === 'task') {
                  const progress = getTaskProgress(target.data);
                  const isDone = target.data.status === 'Done';
                  
                  if (isDone) {
                      // 1. 완료: 밝은 초록 실선
                      strokeColor = '#10b981'; // emerald-500
                      strokeWidth = '3';
                  } else if (progress > 0) {
                      // 2. 진행 중: 밝은 초록 점선 + 전류 애니메이션
                      strokeColor = '#4ade80'; // green-400 (형광 초록)
                      strokeDash = '5,5';      // 점선 패턴
                      animationClass = 'animate-flow';
                      strokeWidth = '3';
                  } else {
                      // 3. 미진행: 붉은색 실선
                      strokeColor = '#ef4444'; // red-500
                      strokeWidth = '2';
                  }
              } else if (target.type === 'subtask') {
                  if (target.data.done) {
                      strokeColor = '#10b981'; // 완료: 초록
                  } else {
                      strokeColor = '#ef4444'; // 미완료: 빨강
                  }
              }

              return (
                <path 
                  key={i}
                  d={`M ${startX} ${startY} C ${controlX1} ${startY}, ${controlX2} ${endY}, ${endX} ${endY}`}
                  fill="none"
                  stroke={strokeColor}
                  strokeWidth={strokeWidth}
                  strokeDasharray={strokeDash}
                  className={`transition-all duration-300 opacity-80 ${animationClass}`}
                />
              );
            })}
          </svg>

          {/* 노드 렌더링 */}
          {nodes.map(node => {
            // 1. 데이터 계산 및 상태 준비
            let progress = 0;
            let totalTasks = 0;
            let doneTasks = 0;

            if (node.type === 'project') {
                progress = node.data.progress || 0;
                const projectTasks = tasks.filter(t => t.projectId === node.data.id);
                totalTasks = projectTasks.length;
                doneTasks = projectTasks.filter(t => t.status === 'Done').length;
            }
            if (node.type === 'task') progress = getTaskProgress(node.data);

            const isDone = node.data.status === 'Done' || node.data.done;
            const isStarted = !isDone && (progress > 0);
            
            // 토글 상태 확인
            const isCollapsed = collapsedTasks[node.data.id];
            const subTaskCount = node.data.subTasks ? (typeof node.data.subTasks === 'string' ? JSON.parse(node.data.subTasks).length : node.data.subTasks.length) : 0;
            const hasSubTasks = subTaskCount > 0;

            // 2. 카드 스타일 정의
            let cardStyle = "";      
            let contentStyle = "";   

            if (node.type === 'project') {
                cardStyle = "bg-gradient-to-br from-indigo-600 to-blue-700 border-2 border-indigo-300/50 z-20 hover:scale-105 shadow-xl shadow-indigo-900/50";
                contentStyle = "text-white";
            } else {
                if (isDone) {
                    cardStyle = "bg-slate-800 z-10 border-2 border-emerald-500/80 shadow-lg shadow-emerald-900/20";
                    contentStyle = "text-slate-400 line-through decoration-slate-600";
                } else if (isStarted && node.type === 'task') {
                    cardStyle = "bg-slate-800 z-10 border-2 border-green-400 shadow-lg shadow-green-900/30";
                    contentStyle = "text-white";
                } else {
                    cardStyle = "bg-slate-800 z-10 border-2 border-red-500/60 hover:border-red-500 shadow-md";
                    contentStyle = "text-slate-300";
                }
            }

            // 너비와 높이 클래스 분기 처리
            // Subtask: 너비 자동(w-auto), 높이 슬림(min-h-[34px]), 패딩 얇게(py-1)
            // Task/Project: 너비 고정(w-[320px]), 높이 일반(min-h-[50px]), 패딩 보통(py-3)
            const widthClass = node.type === 'subtask' ? 'w-auto min-w-[320px] pr-8' : 'w-[320px]';
            const heightClass = node.type === 'subtask' ? 'min-h-[34px] py-1' : 'min-h-[50px] py-3';

            return (
              <div
                key={node.id}
                //  위에서 정의한 widthClass, heightClass 적용
                className={`absolute ${widthClass} h-auto ${heightClass} rounded-xl flex flex-col justify-center transition-all duration-200 cursor-pointer group
                  ${cardStyle}
                  ${node.type === 'subtask' ? 'scale-95 opacity-90' : 'pr-8'}
                `}
                style={{ left: node.x, top: node.y }}
                onClick={(e) => {
                  e.stopPropagation();
                  if (node.type === 'task') onOpenTaskDetail(e, node.data);
                  if (node.type === 'project') onOpenProjectDetail();
                }}
              >
                <div className="flex flex-col gap-1 px-3 overflow-hidden justify-center h-full">
                  
                  {/* 상단: 아이콘 + 제목 + 토글버튼 */}
                  <div className="flex items-center gap-2.5">
                    <div className="shrink-0 flex items-center">
                        {node.type === 'project' && <Briefcase size={16} className="text-white/90"/>}
                        {(node.type === 'task' || node.type === 'subtask') && (
                            <div className={`p-0.5 rounded transition-colors`}>
                                {(node.data.status === 'Done' || node.data.done) ? 
                                    <CheckSquare size={16} className="text-emerald-500"/> : 
                                    <Square size={16} className={isStarted && node.type === 'task' ? "text-green-400" : "text-red-400"}/>
                                }
                            </div>
                        )}
                    </div>
                    
                    {/* 제목 텍스트 */}
                    <span 
                        className={`text-xs font-bold block whitespace-nowrap ${node.type === 'subtask' ? '' : 'truncate'} flex-1 ${contentStyle}`}
                        title={node.data.title || node.data.content}
                    >
                       {node.type === 'project' ? node.data.title : node.data.title || node.data.content}
                    </span>

                    {/* 토글 버튼 (Task이고 서브태스크가 있을 때만) */}
                    {node.type === 'task' && hasSubTasks && (
                        <button 
                            onClick={(e) => { e.stopPropagation(); toggleTaskCollapse(node.data.id); }}
                            className="p-1 rounded-md hover:bg-white/10 text-slate-400 transition-colors z-30 shrink-0"
                        >
                            {isCollapsed ? <ChevronRight size={16}/> : <ChevronDown size={16}/>}
                        </button>
                    )}
                  </div>

                  {/* 하단: 진행률 바 및 통계 (Subtask 제외) */}
                  {node.type !== 'subtask' && (
                    <div className="space-y-1 mt-1">
                        {/* 진행 바 */}
                        <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-black/30 rounded-full overflow-hidden border border-white/5">
                                <div 
                                    className={`h-full rounded-full transition-all duration-500 ${
                                        node.type === 'project' ? 'bg-white/90' :
                                        isDone ? 'bg-emerald-500' :
                                        isStarted ? 'bg-green-400' : 'bg-red-500'
                                    }`} 
                                    style={{ width: `${progress}%` }}
                                ></div>
                            </div>
                            <span className={`text-[9px] font-mono font-bold ${node.type==='project' ? 'text-white' : 'text-slate-400'}`}>
                                {progress}%
                            </span>
                        </div>

                        {/* 접혔을 때 체크리스트 수량 뱃지 */}
                        {node.type === 'task' && isCollapsed && hasSubTasks && (
                            <div className="flex items-center gap-1.5 animate-fadeIn">
                                <span className="bg-indigo-500/20 text-indigo-300 px-2 py-0.5 rounded text-[9px] font-bold border border-indigo-500/30 flex items-center gap-1">
                                    <Layers size={10}/> {subTaskCount} Checklists
                                </span>
                            </div>
                        )}

                        {/* 프로젝트 통계 */}
                        {node.type === 'project' && (
                            <div className="flex justify-between items-center text-[9px] font-bold text-white/80 border-t border-white/20 pt-1 mt-1 whitespace-nowrap">
                                <span>Tasks: {doneTasks}/{totalTasks}</span>
                                <span className="ml-2">{totalTasks > 0 ? Math.round((doneTasks/totalTasks)*100) : 0}% Done</span>
                            </div>
                        )}
                    </div>
                  )}
                </div>

                {/* 우측 상단 액션 버튼들 */}
                <div className="absolute -top-2 -right-2 flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-200 scale-90 z-30">
                  {node.type === 'project' && (
                    <button 
                      onClick={(e)=>{ e.stopPropagation(); onOpenProjectDetail(); }} 
                      className="p-1.5 bg-white text-indigo-600 rounded-full shadow-lg border border-indigo-100 hover:bg-indigo-50" 
                      title="프로젝트 상세"
                    >
                      <Plus size={12} strokeWidth={3}/>
                    </button>
                  )}
                  {node.type === 'task' && (
                     <button onClick={(e)=>{e.stopPropagation(); addSubTask(node.data.id, node.data.subTasks)}} className="p-1.5 bg-slate-700 text-slate-300 rounded-full border border-slate-600 hover:bg-indigo-500 hover:text-white hover:border-indigo-400 shadow-md"><List size={12}/></button>
                  )}
                  {node.type !== 'project' && (
                    <button onClick={(e)=>{e.stopPropagation(); if(confirm('삭제하시겠습니까?')) onDeleteTask(node)}} className="p-1.5 bg-slate-700 text-slate-300 rounded-full border border-slate-600 hover:bg-red-500 hover:text-white hover:border-red-400 shadow-md"><Trash2 size={12}/></button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default function App() {
  const [context, setContext] = useState('WORK'); 
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isAiPlanning, setIsAiPlanning] = useState(false); 
  const [modalMode, setModalMode] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);
  const [searchTerm, setSearchTerm] = useState(""); 
  const [activeProjectId, setActiveProjectId] = useState(null);
  const [projectViewMode, setProjectViewMode] = useState('LIST');
  const [confirmState, setConfirmState] = useState({ isOpen: false, type: null, task: null });
  const [returnToProjectId, setReturnToProjectId] = useState(null);
  const [localProjectTasks, setLocalProjectTasks] = useState([]);
  const dragItem = useRef(null);
  const dragOverItem = useRef(null);

  const [newProjectTitle, setNewProjectTitle] = useState("");
  const [projectStartDate, setProjectStartDate] = useState(new Date().toISOString().substring(0, 10)); 
  const [projectDueDate, setProjectDueDate] = useState(""); 
  const [projectDept, setProjectDept] = useState("생산부");
  const [projectRequester, setProjectRequester] = useState(""); 
  const [projectCountry, setProjectCountry] = useState("KR"); 

  const [newTaskTitle, setNewTaskTitle] = useState("");
  const [newTaskGuide, setNewTaskGuide] = useState("");
  const [selectedProjectId, setSelectedProjectId] = useState("");
  const [taskPriority, setTaskPriority] = useState("Medium");
  const [taskDueDate, setTaskDueDate] = useState("");
  const [projectStatus, setProjectStatus] = useState("Active");
  const [quickTaskTitle, setQuickTaskTitle] = useState("");
  const [quickTaskPriority, setQuickTaskPriority] = useState("Medium");
  const [quickTaskDueDate, setQuickTaskDueDate] = useState("");
  const [emailTopic, setEmailTopic] = useState("");
  const [emailRecipient, setEmailRecipient] = useState("");
  const [projectFilter, setProjectFilter] = useState("Active");
  const [taskFilter, setTaskFilter] = useState("Pending"); 
  const [taskLinkFilter, setTaskLinkFilter] = useState('All');
  // [NEW] Link Filter
  const [currentReport, setCurrentReport] = useState(null);
  const [isReportRefreshing, setIsReportRefreshing] = useState(false); 
  const [isSendingReport, setIsSendingReport] = useState(false);
  const [isChatMode, setIsChatMode] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState([{ role: 'ai', text: '안녕하세요, 황성민 부장님. 업무 현황에 대해 물어보세요.' }]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const chatEndRef = useRef(null);
  const [aiSuggestions, setAiSuggestions] = useState([]);
  const [selectedSuggestions, setSelectedSuggestions] = useState({});
  const [isBatchMode, setIsBatchMode] = useState(false);
  const [batchTasks, setBatchTasks] = useState("");
  const [toast, setToast] = useState({ show: false, message: '', type: 'error' });
  const showToast = (message, type = 'error') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ ...toast, show: false }), 3000);
  };

  // State for Project Detail & Task Detail
  const [projectNote, setProjectNote] = useState("");
  const [projectResources, setProjectResources] = useState([]);
  const [taskNote, setTaskNote] = useState("");
  const [taskResources, setTaskResources] = useState([]);
  const [taskSubTasks, setTaskSubTasks] = useState([]);
  const [newTaskSubTaskTitle, setNewTaskSubTaskTitle] = useState("");

  const [newResourceLink, setNewResourceLink] = useState("");
  const [newResourceName, setNewResourceName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef(null);
  const [isResourceOpen, setIsResourceOpen] = useState(true);
  const [isNoteOpen, setIsNoteOpen] = useState(true);
  const [isResourceInputModalOpen, setIsResourceInputModalOpen] = useState(false);
  // State for Link Manager
  const [refLinks, setRefLinks] = useState([]);
  const [linkName, setLinkName] = useState("");
  const [linkUrl, setLinkUrl] = useState("");
  const [linkDept, setLinkDept] = useState("생산부");
  const [linkCountry, setLinkCountry] = useState("KR");
  const [linkDesc, setLinkDesc] = useState("");
  // [NEW] Search & Edit States for Link Manager
  const [linkSearchTerm, setLinkSearchTerm] = useState("");
  const [editingLinkId, setEditingLinkId] = useState(null);
  // 🌟 [NEW] State for Email Analysis
  const [emailAnalysisList, setEmailAnalysisList] = useState([]);
  const [emailCategory, setEmailCategory] = useState("일일 브리핑");
  const [emailTitle, setEmailTitle] = useState("");
  const [emailUrl, setEmailUrl] = useState("");
  const [editingEmailId, setEditingEmailId] = useState(null);
  // 🌟 [NEW] State for Email Analysis Search
  const [emailSearchTerm, setEmailSearchTerm] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [bmCategories, setBmCategories] = useState([]); // 카테고리 목록
  const [bmContext, setBmContext] = useState("WORK");   // WORK or LIFE
  const [bmCategory, setBmCategory] = useState("");     // 선택된 카테고리
  const [bmTitle, setBmTitle] = useState("");
  const [bmUrl, setBmUrl] = useState("");
  const [bmDesc, setBmDesc] = useState("");
  const [editingBmId, setEditingBmId] = useState(null);
  const [bmSearchTerm, setBmSearchTerm] = useState("");
  const [isMindMapOpen, setIsMindMapOpen] = useState(false);
  const [mindMapTargetProject, setMindMapTargetProject] = useState(null);
  const fetchData = (isBackground = false) => { if(!isBackground) setLoading(true);
  fetch(API_URL).then(res => res.json()).then(json => { 
        setData(json); 
        if(!currentReport) setCurrentReport(json.latestReport);
        if(json.refLinks) setRefLinks(json.refLinks); // Load Ref Links
        if(json.emailAnalysis) setEmailAnalysisList(json.emailAnalysis); // 🌟 Load Email Analysis
        if(json.bookmarks) setBookmarks(json.bookmarks);
        if(json.bmCategories) {
            setBmCategories(json.bmCategories);
            if(json.bmCategories.length > 0 && !bmCategory) setBmCategory(json.bmCategories[0]);
        }
        setLoading(false); 
    }).catch(err => { console.error(err); setLoading(false); });
  };

  useEffect(() => { fetchData(); }, []);
  useEffect(() => { chatEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [chatHistory, isChatMode]);
  useEffect(() => {
    if (selectedItem) {
      if (modalMode === 'PROJECT_DETAIL' && data?.tasks) {
         // Project Setup
         const pTasks = data.tasks.filter(t => t.projectId === selectedItem.id);
         setLocalProjectTasks(pTasks);
         setProjectNote(selectedItem.note || "");
         // 리소스 파싱 안전 장치 추가
         try { 
            setProjectResources(typeof selectedItem.resources === 'string' ? JSON.parse(selectedItem.resources) : (selectedItem.resources || [])); 
         } catch(e) { setProjectResources([]); }
         
         setIsResourceOpen(true);
         setIsNoteOpen(true);

      } else if (modalMode === 'TASK_DETAIL') {
         // Task Setup
         setTaskNote(selectedItem.note || ""); 
         
         // 리소스가 문자열이면 파싱, 아니면 그대로 사용
         try { 
            setTaskResources(typeof selectedItem.resources === 'string' ? JSON.parse(selectedItem.resources) : (selectedItem.resources || [])); 
         } catch(e) { setTaskResources([]); }

         // 체크리스트(subTasks)가 문자열이면 파싱, 이미 배열이면 그대로 사용
         try { 
            setTaskSubTasks(typeof selectedItem.subTasks === 'string' ? JSON.parse(selectedItem.subTasks) : (selectedItem.subTasks || [])); 
         } catch(e) { setTaskSubTasks([]); }
        
         setIsResourceOpen(true);
         setIsNoteOpen(true);
      }
    }
  }, [selectedItem, data, modalMode]);

  const handleSendMessage = () => { if (!chatInput.trim()) return;
    const userMsg = chatInput;
    setChatHistory(prev => [...prev, { role: 'user', text: userMsg }]); setChatInput(""); setIsChatLoading(true);
    fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'chat', message: userMsg }) }).then(res => res.json()).then(json => { setChatHistory(prev => [...prev, { role: 'ai', text: json.reply }]); setIsChatLoading(false); }).catch(() => { setChatHistory(prev => [...prev, { role: 'ai', text: "오류 발생" }]); setIsChatLoading(false); });
  };
  const handleRefreshReport = () => { setIsReportRefreshing(true); fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'refresh_report' }) }).then(res => res.json()).then(json => { setCurrentReport(json.report); setIsReportRefreshing(false); fetchData(true); }).catch(() => { setIsReportRefreshing(false); alert("브리핑 생성 실패"); });
  };
  const handleSendReportEmail = () => { if(!selectedItem?.content) return; if(!confirm("이 브리핑 내용을 메일로 보내시겠습니까?")) return; setIsSendingReport(true);
    fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'send_report_email', content: selectedItem.content }) }).then(() => { showToast("메일이 발송되었습니다.", "success"); setIsSendingReport(false); }).catch(() => { showToast("발송 실패", "error"); setIsSendingReport(false); });
  };
  
  const openTaskDetailModal = (e, task) => {
      if(e) e.stopPropagation();
      setSelectedItem(task);
      setModalMode('TASK_DETAIL');
  }

  const openEditTaskModal = (e, task, returnPid = null) => { 
    if(e) e.stopPropagation();
    setReturnToProjectId(returnPid);
    setSelectedItem(task);
    setNewTaskTitle(task.title);
    setNewTaskGuide(task.description || "");
    setTaskPriority(task.priority); 
    setTaskDueDate(task.dueDate || ""); 
    setSelectedProjectId(task.projectId); 
    setModalMode('EDIT_TASK'); 
  };
  const handleSaveTask = () => { 
    if (!newTaskTitle.trim()) { showToast("할 일 제목을 입력해주세요."); return;
    }
    setIsSaving(true); 
    const action = modalMode === 'EDIT_TASK' ? 'update_task' : 'create_task';
    const body = { action: action, title: newTaskTitle, description: newTaskGuide, context: context, projectId: selectedProjectId, priority: taskPriority, dueDate: taskDueDate };
    if (modalMode === 'EDIT_TASK') body.taskId = selectedItem.id; 
    
    fetch(API_URL, { method: "POST", body: JSON.stringify(body) }).then(() => { 
      setLocalProjectTasks([]); 
      if (returnToProjectId) {
        const project = data.projects.find(p => p.id === returnToProjectId);
        if (project) { setSelectedItem(project); setModalMode('PROJECT_DETAIL'); } 
        else { setModalMode(null); }
        setReturnToProjectId(null);
      } else if (modalMode === 'EDIT_TASK' && selectedItem) {
          setModalMode(null); 
      } else { setModalMode(null); }
      setNewTaskTitle(""); setNewTaskGuide(""); setSelectedProjectId(""); setTaskPriority("Medium"); setTaskDueDate(""); 
      setIsSaving(false); 
      fetchData(true); showToast("저장되었습니다.", "success");
    });
  };
  const handleCloseEditTask = () => {
    if (returnToProjectId) {
      const project = data.projects.find(p => p.id === returnToProjectId);
      if (project) { setSelectedItem(project); setModalMode('PROJECT_DETAIL'); } 
      else { setModalMode(null);
      }
      setReturnToProjectId(null);
    } else { setModalMode(null); }
    setNewTaskTitle(""); setNewTaskGuide("");
  };
  const handleQuickAddTask = () => { if (!quickTaskTitle.trim()) { showToast("할 일 제목을 입력해주세요."); return; } setIsSaving(true);
    fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'create_task', title: quickTaskTitle, context: 'WORK', projectId: selectedItem.id, priority: quickTaskPriority, dueDate: quickTaskDueDate }) }).then(() => { setQuickTaskTitle(""); setQuickTaskPriority("Medium"); setQuickTaskDueDate(""); setIsSaving(false); setLocalProjectTasks([]); fetchData(true); showToast("할 일이 추가되었습니다.", "success"); });
  };
  const handleBatchAddTasks = () => { if (!batchTasks.trim()) { showToast("할 일을 하나 이상 입력해주세요."); return;
    } const taskList = batchTasks.split('\n').filter(t => t.trim() !== "").map(title => ({ title: title.trim(), priority: quickTaskPriority, dueDate: quickTaskDueDate }));
    if(taskList.length === 0) return; setIsSaving(true); fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'create_tasks_batch', tasks: taskList, projectId: selectedItem.id }) }).then(res => res.json()).then(json => { showToast(`${json.count}개의 할 일이 추가되었습니다!`, "success"); setBatchTasks(""); setIsSaving(false); setLocalProjectTasks([]); fetchData(true); }).catch(() => { showToast("일괄 등록 실패", "error"); setIsSaving(false); });
  };
  const handleAiSuggestTasks = () => { 
    setIsAiPlanning(true);
    fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'ai_suggest_tasks', projectTitle: selectedItem.title }) })
    .then(res => res.json()).then(json => { 
        if (json.result === 'success' && Array.isArray(json.suggestions)) {
            setAiSuggestions(json.suggestions); 
            const initialSelection = {}; 
            json.suggestions.forEach((_, idx) => initialSelection[idx] = true); 
            setSelectedSuggestions(initialSelection); 
            setModalMode('AI_PLAN_MODAL'); 
        } else { showToast("AI 응답을 분석할 수 없습니다.", "error"); }
        setIsAiPlanning(false); 
    }).catch(() => { showToast("AI 생성 실패", "error"); setIsAiPlanning(false); });
  };
  const handleConfirmAiTasks = () => { const tasksToSave = aiSuggestions.filter((_, idx) => selectedSuggestions[idx]);
    if (tasksToSave.length === 0) { showToast("선택된 항목이 없습니다."); return; } setIsSaving(true);
    fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'save_suggested_tasks', projectId: selectedItem.id, tasks: tasksToSave }) }).then(() => { showToast(`${tasksToSave.length}건의 할 일이 추가되었습니다.`, "success"); setModalMode('PROJECT_DETAIL'); setIsSaving(false); setLocalProjectTasks([]); fetchData(true); }).catch(() => { showToast("저장 실패", "error"); setIsSaving(false); });
  };
  const handleSaveProject = (openMindMapDirectly = false) => { 
    if (!newProjectTitle.trim()) { showToast("프로젝트 명을 입력해주세요."); return; } 
    if (!projectStartDate) { showToast("시작일을 선택해주세요."); return; } 
    if (!projectDueDate) { showToast("완료 예정일을 선택해주세요."); return; } 
    
    setIsSaving(true); 
    const action = modalMode === 'EDIT_PROJECT' ? 'update_project' : 'create_project'; 
    const body = { 
      action: action, 
      title: newProjectTitle, 
      status: projectStatus, 
      startDate: projectStartDate, 
      department: projectDept, 
      requester: projectRequester, 
      dueDate: projectDueDate, 
      country: projectCountry 
    };
    
    if (modalMode === 'EDIT_PROJECT') body.projectId = selectedItem.id; 
    
    fetch(API_URL, { method: "POST", body: JSON.stringify(body) })
      .then(res => res.json()) //  응답 JSON 파싱 필요
      .then((json) => {        //  json 응답 처리
        setModalMode(null); 
        setNewProjectTitle(""); 
        setProjectRequester(""); 
        setIsSaving(false); 
        
        // 👇 [추가] 마인드 맵 바로 열기 로직
        if (openMindMapDirectly && json.project) {
          // 백엔드에서 반환된 새 프로젝트 정보로 즉시 마인드 맵 오픈
          handleOpenMindMap(json.project);
          showToast("프로젝트 생성 완료! 마인드 맵을 시작합니다.", "success");
        } else {
          showToast("프로젝트가 저장되었습니다.", "success"); 
        }

        fetchData(true); 
    });
  };
  const handleDeleteProject = () => { 
    if(!confirm(`'${selectedItem.title}' 프로젝트를 삭제하시겠습니까?\n\n⚠️ 주의: 이 프로젝트에 연결된 모든 할 일(Task)과 캘린더 일정이 함께 영구 삭제됩니다.`)) return;
    fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'delete_project', projectId: selectedItem.id }) }).then(() => { 
        setModalMode(null); 
        setSelectedItem(null); 
        fetchData(true); 
        showToast("프로젝트와 관련 업무가 삭제되었습니다.", "success"); 
    });
  };
  const handleDraftEmail = () => { if (!emailRecipient.trim() || !emailRecipient.includes('@')) { showToast("올바른 이메일 주소를 입력해주세요."); return;
    } if (!emailTopic.trim()) { showToast("요청 사항을 입력해주세요."); return; } setIsSaving(true);
    fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'draft_email', topic: emailTopic, recipient: emailRecipient }) }).then(res => res.json()).then(json => { showToast(`✅ 생성 완료!\n${json.subject}`, "success"); setModalMode(null); setEmailTopic(""); setEmailRecipient(""); setIsSaving(false); });
  };
  const requestToggleTask = (task) => { setConfirmState({ isOpen: true, type: 'TOGGLE', task: task }); };
  const requestDeleteTask = (e, task) => { e.stopPropagation(); setConfirmState({ isOpen: true, type: 'DELETE', task: task }); };
  const executeConfirmAction = () => { const { type, task } = confirmState; if (!task) return;
    if (type === 'TOGGLE') { const updatedTasks = data.tasks.map(t => t.id === task.id ? { ...t, status: t.status === 'Done' ? 'Pending' : 'Done' } : t);
    setData({ ...data, tasks: updatedTasks }); fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'toggle', taskId: task.id }) }).then(() => fetchData(true));
    } else if (type === 'DELETE') { const updatedTasks = data.tasks.filter(t => t.id !== task.id); setData({ ...data, tasks: updatedTasks });
    fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'delete', taskId: task.id }) }).then(() => {
        setModalMode(null); 
        fetchData(true);
    });
    } setConfirmState({ isOpen: false, type: null, task: null }); };
  const openEditProjectModal = () => { setNewProjectTitle(selectedItem.title); setProjectStatus(selectedItem.status); setProjectCountry(selectedItem.country); setProjectDept(selectedItem.department);
    setProjectRequester(selectedItem.requester); setProjectStartDate(selectedItem.startDate || new Date().toISOString().substring(0,10)); setProjectDueDate(selectedItem.dueDate || ""); setModalMode('EDIT_PROJECT'); };
  const handleDragStart = (e, position) => { dragItem.current = position;
  };
  const handleDragOver = (e) => { e.preventDefault(); }; 
  const handleDragEnter = (e, position) => { dragOverItem.current = position;
  const copyListItems = [...localProjectTasks]; const dragItemContent = copyListItems[dragItem.current]; copyListItems.splice(dragItem.current, 1); copyListItems.splice(dragOverItem.current, 0, dragItemContent); dragItem.current = position; setLocalProjectTasks(copyListItems); };
  const handleDragEnd = () => { const taskIds = localProjectTasks.map(t => t.id);
    fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'reorder_tasks', projectId: selectedItem.id, taskIds: taskIds }) }).then(() => fetchData(true));
  };
  // ✅ New Sync Helper
  const updateGlobalTaskState = (taskId, field, value) => {
      // 1. Update Global Data
      const updatedTasks = data.tasks.map(t => t.id === taskId ? { ...t, [field]: value } : t);
      setData(prev => ({ ...prev, tasks: updatedTasks }));
      
      // 2. Update Local Project Tasks (if visible)
      setLocalProjectTasks(prev => prev.map(t => t.id === taskId ? { ...t, [field]: value } : t));
      // 3. Update Selected Item (to keep modal live)
      setSelectedItem(prev => ({ ...prev, [field]: value }));
  };

  // --- Unified Resource/Note/SubTask Logic ---
  const handleSaveNote = () => {
    if (modalMode === 'PROJECT_DETAIL') {
       fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'update_project', projectId: selectedItem.id, note: projectNote }) }).then(() => showToast("메모가 저장되었습니다.", "success"));
    } else {
       // Task Note
       updateGlobalTaskState(selectedItem.id, 'note', taskNote);
       // Sync Local
       fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'update_task', taskId: selectedItem.id, note: taskNote }) }).then(() => showToast("메모가 저장되었습니다.", "success"));
    }
  };

  const handleAddResource = (name, link) => {
    // [Modified] Now accepts name/link as args from Modal
    const isProject = modalMode === 'PROJECT_DETAIL';
    const currentList = isProject ? projectResources : taskResources;
    const updatedResources = [...currentList, { name: name, link: link, date: new Date().toISOString().substring(0,10) }];
    if (isProject) {
        setProjectResources(updatedResources);
        fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'update_project', projectId: selectedItem.id, resources: JSON.stringify(updatedResources) }) });
    } else {
        setTaskResources(updatedResources);
        updateGlobalTaskState(selectedItem.id, 'resources', JSON.stringify(updatedResources));
        // Sync Local
        fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'update_task', taskId: selectedItem.id, resources: JSON.stringify(updatedResources) }) });
    }
    showToast("자료가 추가되었습니다.", "success");
  };

  const handleDeleteResource = (idx) => {
    if(!confirm("이 자료를 목록에서 삭제하시겠습니까?")) return;
    const isProject = modalMode === 'PROJECT_DETAIL';
    const currentList = isProject ? projectResources : taskResources;
    const updatedResources = currentList.filter((_, i) => i !== idx);

    if (isProject) {
        setProjectResources(updatedResources);
        fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'update_project', projectId: selectedItem.id, resources: JSON.stringify(updatedResources) }) });
    } else {
        setTaskResources(updatedResources);
        updateGlobalTaskState(selectedItem.id, 'resources', JSON.stringify(updatedResources));
        // Sync Local
        fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'update_task', taskId: selectedItem.id, resources: JSON.stringify(updatedResources) }) });
    }
  };

  const handleOpenMindMap = (project) => {
    setMindMapTargetProject(project);
    setIsMindMapOpen(true);
  };

  const handleMindMapCreateTask = (title) => {
    if (!mindMapTargetProject) return;
    setIsSaving(true);
    fetch(API_URL, { 
      method: "POST", 
      body: JSON.stringify({ 
        action: 'create_task', 
        title: title, 
        context: 'WORK', 
        projectId: mindMapTargetProject.id, 
        priority: 'Medium', 
        dueDate: '' 
      }) 
    }).then(() => {
      setIsSaving(false);
      fetchData(true); // 새로고침
      showToast("마인드 맵에 할 일이 추가되었습니다.", "success");
    });
  };
  
  const handleMindMapDeleteNode = (node) => {
     if (node.type === 'task') {
       fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'delete', taskId: node.data.id }) }).then(() => fetchData(true));
     } else if (node.type === 'subtask') {
       // 서브태스크 삭제 로직
       const task = data.tasks.find(t => t.id === node.parentId);
       if(task) {
         let subs = typeof task.subTasks === 'string' ? JSON.parse(task.subTasks) : task.subTasks || [];
         const updated = subs.filter((_, i) => i !== node.index);
         updateGlobalTaskState(task.id, 'subTasks', JSON.stringify(updated));
         fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'update_task', taskId: task.id, subTasks: JSON.stringify(updated) }) });
       }
     }
  };

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) { showToast("5MB 이하의 파일만 업로드 가능합니다.", "error"); return;
    }
    setIsUploading(true);
    const reader = new FileReader();
    reader.onload = function(e) {
      const base64 = e.target.result.split(',')[1];
      fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'upload_file', fileName: file.name, mimeType: file.type, base64: base64 }) })
      .then(res => res.json()).then(json => {
          if(json.result === 'success') {
              const isProject = modalMode === 'PROJECT_DETAIL';
              const currentList = isProject ? projectResources : taskResources;
              const updatedResources = [...currentList, { name: json.name, link: 
                json.link, date: new Date().toISOString().substring(0,10) }];
              
              if (isProject) {
                  setProjectResources(updatedResources);
                  fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'update_project', projectId: selectedItem.id, resources: JSON.stringify(updatedResources) }) });
              } else {
                  setTaskResources(updatedResources);
                  updateGlobalTaskState(selectedItem.id, 'resources', JSON.stringify(updatedResources));
                  // Sync Local
                  fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'update_task', taskId: selectedItem.id, resources: JSON.stringify(updatedResources) }) });
              }
              showToast("파일 업로드 완료!", "success");
              setIsUploading(false);
          } else { showToast("업로드 실패: " + (json.msg || "서버 오류"), "error"); setIsUploading(false);
          }
      }).catch((err) => { console.error(err); showToast("통신 오류", "error"); setIsUploading(false); });
    };
    reader.readAsDataURL(file);
  };
  // Task SubTasks Logic
  const handleAddTaskSubTask = () => {
      if(!newTaskSubTaskTitle.trim()) return;
      const newSub = { title: newTaskSubTaskTitle, done: false };
      const updated = [...taskSubTasks, newSub];
      setTaskSubTasks(updated);
      setNewTaskSubTaskTitle("");
      // Sync & Save
      updateGlobalTaskState(selectedItem.id, 'subTasks', JSON.stringify(updated));
      fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'update_task', taskId: selectedItem.id, subTasks: JSON.stringify(updated) }) });
  };
  const handleToggleTaskSubTask = (idx) => {
      const updated = taskSubTasks.map((t, i) => i === idx ? { ...t, done: !t.done } : t);
      setTaskSubTasks(updated);
      // Sync & Save
      updateGlobalTaskState(selectedItem.id, 'subTasks', JSON.stringify(updated));
      fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'update_task', taskId: selectedItem.id, subTasks: JSON.stringify(updated) }) });
  };
  const handleDeleteTaskSubTask = (idx) => {
      const updated = taskSubTasks.filter((_, i) => i !== idx);
      setTaskSubTasks(updated);
      // Sync & Save
      updateGlobalTaskState(selectedItem.id, 'subTasks', JSON.stringify(updated));
      fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'update_task', taskId: selectedItem.id, subTasks: JSON.stringify(updated) }) });
  };
  // --- Ref Link Manager Logic ---
  const handleSaveLink = () => {
      if(!linkName.trim() || !linkUrl.trim()) { showToast("이름과 링크 주소는 필수입니다.", "error");
      return; }
      setIsSaving(true);
      const newLinkObj = { country: linkCountry, department: linkDept, name: linkName, url: linkUrl, description: linkDesc };
      const action = editingLinkId ? 'update_link' : 'create_link';
      const payload = editingLinkId ?
      { ...newLinkObj, action, linkId: editingLinkId } : { ...newLinkObj, action };
      fetch(API_URL, { method: "POST", body: JSON.stringify(payload) })
      .then(res => res.json()).then(json => {
          if(json.result === 'success') {
              showToast(editingLinkId ? "링크가 수정되었습니다." : "링크가 추가되었습니다.", "success");
              // Reset Form
              handleCancelEdit();
              fetchData(true); // Background refresh
           } else { showToast("저장 실패", "error"); }
          setIsSaving(false);
      }).catch(() => { setIsSaving(false); showToast("통신 오류", "error"); });
  };
  const handleDeleteLink = (linkId) => {
      if(!confirm("이 링크를 삭제하시겠습니까?")) return;
      setRefLinks(prev => prev.filter(l => l.id !== linkId));
      if(editingLinkId === linkId) handleCancelEdit();
      fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'delete_link', linkId }) });
  };
  const handleEditLink = (link) => {
      setEditingLinkId(link.id);
      setLinkName(link.name);
      setLinkUrl(link.url);
      setLinkDept(link.department);
      setLinkCountry(link.country);
      setLinkDesc(link.description);
  };
  const handleCancelEdit = () => {
      setEditingLinkId(null);
      setLinkName("");
      setLinkUrl("");
      setLinkDesc("");
      setLinkCountry("KR");
      setLinkDept("생산부");
  };
  // --- 🌟 Email Analysis Logic ---
  const handleSaveEmail = () => {
    if(!emailTitle.trim() || !emailUrl.trim()) { showToast("제목과 링크 URL은 필수입니다.", "error");
    return; }
    setIsSaving(true);
    const action = editingEmailId ? 'update_email' : 'create_email';
    const payload = { action, category: emailCategory, title: emailTitle, url: emailUrl };
    if(editingEmailId) payload.emailId = editingEmailId;
    fetch(API_URL, { method: "POST", body: JSON.stringify(payload) })
      .then(res => res.json()).then(json => {
          if(json.result === 'success') {
             showToast(editingEmailId ? "분석 내용이 수정되었습니다." : "분석 내용이 추가되었습니다.", "success");
             handleCancelEmailEdit();
             fetchData(true);
          } else { showToast("저장 실패", "error"); }
           setIsSaving(false);
      }).catch(() => { setIsSaving(false); showToast("통신 오류", "error"); });
  };
  const handleEditEmail = (item) => {
    setEditingEmailId(item.id);
    setEmailCategory(item.category);
    setEmailTitle(item.title);
    setEmailUrl(item.url);
  };
  const handleCancelEmailEdit = () => {
    setEditingEmailId(null);
    setEmailTitle("");
    setEmailUrl("");
    setEmailCategory("일일 브리핑");
  };
  const handleDeleteEmail = (emailId) => {
      if(!confirm("이 항목을 삭제하시겠습니까?")) return;
      setEmailAnalysisList(prev => prev.filter(e => e.id !== emailId));
      if(editingEmailId === emailId) handleCancelEmailEdit();
      fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'delete_email', emailId }) });
  };
  const handleSaveBookmark = () => {
    if(!bmTitle.trim() || !bmUrl.trim()) { showToast("제목과 URL은 필수입니다.", "error"); return; }
    if(!bmCategory) { showToast("카테고리를 선택하거나 추가해주세요.", "error"); return; }
    
    setIsSaving(true);
    const action = editingBmId ? 'update_bookmark' : 'create_bookmark';
    const payload = { action, context: bmContext, category: bmCategory, title: bmTitle, url: bmUrl, description: bmDesc };
    if(editingBmId) payload.bmId = editingBmId;

    fetch(API_URL, { method: "POST", body: JSON.stringify(payload) })
    .then(res => res.json()).then(json => {
        if(json.result === 'success') {
           showToast(editingBmId ? "북마크가 수정되었습니다." : "북마크가 추가되었습니다.", "success");
           handleCancelBmEdit();
           fetchData(true);
        } else { showToast("저장 실패", "error"); }
        setIsSaving(false);
    }).catch(() => { setIsSaving(false); showToast("통신 오류", "error"); });
};

const handleEditBookmark = (item) => {
    setEditingBmId(item.id);
    setBmContext(item.context);
    setBmCategory(item.category);
    setBmTitle(item.title);
    setBmUrl(item.url);
    setBmDesc(item.description);
};

const handleCancelBmEdit = () => {
    setEditingBmId(null);
    setBmTitle("");
    setBmUrl("");
    setBmDesc("");
    // Context와 Category는 유지하여 연속 입력 편의성 제공
};

const handleDeleteBookmark = (bmId) => {
    if(!confirm("정말 삭제하시겠습니까?")) return;
    setBookmarks(prev => prev.filter(b => b.id !== bmId));
    if(editingBmId === bmId) handleCancelBmEdit();
    fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'delete_bookmark', bmId }) });
};

const handleAddBmCategory = () => {
    const newCat = prompt("추가할 구분(카테고리) 명을 입력하세요:");
    if(newCat && newCat.trim()) {
        const trimmed = newCat.trim();
        if(bmCategories.includes(trimmed)) { showToast("이미 존재하는 구분입니다.", "error"); return; }
        
        setBmCategories(prev => [...prev, trimmed]);
        setBmCategory(trimmed); // 새로 만든 걸 자동 선택
        fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'add_bm_category', category: trimmed }) });
    }
};

const handleDeleteBmCategory = () => {
    if(!bmCategory) return;
    if(!confirm(`'${bmCategory}' 구분을 삭제하시겠습니까?\n(해당 구분의 북마크들은 그대로 유지됩니다.)`)) return;
    
    const target = bmCategory;
    const updated = bmCategories.filter(c => c !== target);
    setBmCategories(updated);
    if(updated.length > 0) setBmCategory(updated[0]);
    else setBmCategory("");
    
    fetch(API_URL, { method: "POST", body: JSON.stringify({ action: 'delete_bm_category', category: target }) });
};
  // --- 🔍 Helper: Multi-keyword Search Logic ---
  const checkSearchMatch = (itemText, searchText) => {
      const searchLower = searchText.toLowerCase();
      const terms = searchLower.split(/\s+/).filter(t => t.length > 0);
      if (terms.length === 0) return true;
      const textLower = (itemText || "").toLowerCase();
      return terms.every(term => textLower.includes(term));
  };

  const theme = context === 'WORK' ?
  { bg: 'from-slate-900 to-slate-800', accent: 'text-indigo-400', activeTab: 'bg-white/10 text-white shadow-sm' } : { bg: 'from-slate-900 to-amber-900/30', accent: 'text-amber-400', activeTab: 'bg-white/10 text-white shadow-sm' };
  const allTasks = data?.tasks || [];
  const filteredTasks = allTasks
    .filter(task => task.context === context)
    .filter(task => task.status === taskFilter)
    .filter(task => !activeProjectId || task.projectId === activeProjectId)
    // [FIXED] Task Link Filter Logic
    .filter(task => {
        const rawPid = String(task.projectId || "").trim();
        const hasProject = rawPid !== "" && rawPid !== "null" && rawPid !== "undefined" && rawPid !== "PROJ_DEF"; 
        if (taskLinkFilter === 'Linked') return hasProject;
        if (taskLinkFilter === 'Unlinked') return !hasProject;
        return true;
    })
    .filter(task => checkSearchMatch(task.title + " " + (task.description||""), searchTerm))
    .sort((a, b) => { if (a.dueDate && b.dueDate) { return new Date(a.dueDate) - new Date(b.dueDate); } if (a.dueDate && !b.dueDate) return -1; if (!a.dueDate && b.dueDate) return 1; const priorityScore = { 'High': 5, 'Review': 4, 'Medium': 3, 
    'Low': 2, 'Hold': 1 }; return priorityScore[b.priority] 
    - priorityScore[a.priority];
    });
  
  const projects = data?.projects || [];
  const visibleProjects = projects
    .filter(p => projectFilter === 'All' ? true : p.status === projectFilter)
    .filter(p => checkSearchMatch(p.title + " " + p.department + " " + p.country + " " + p.requester, searchTerm));
  const schedule = data?.schedule || [];
  const avgProgress = projects.length > 0 ?
  Math.round(projects.reduce((acc, cur) => acc + (cur.progress || 0), 0) / projects.length) : 0;
  const getProjectName = (pid) => { if (!pid || pid === 'PROJ_DEF') return null; return projects.find(p => p.id === pid)?.title;
  };
  const reportContent = (currentReport || data?.latestReport || { content: "데이터 대기 중..." }).content.replace(/<br\s*\/?>/gi, '\n');
  const getProjectHealth = (project) => { if (!project || !project.startDate || !project.dueDate || typeof project.progress === 'undefined') return null;
  const start = new Date(project.startDate); const end = new Date(project.dueDate); const today = new Date();
  const totalDuration = (end - start) / (1000 * 60 * 60 * 24); if (totalDuration <= 0) return null;
  const elapsed = (today - start) / (1000 * 60 * 60 * 24);
  const timePercent = Math.min(100, Math.max(0, (elapsed / totalDuration) * 100)); let status = "NORMAL";
  let message = "일정에 맞춰 순조롭게 진행 중입니다."; let color = "text-emerald-400"; let bg = "bg-emerald-500/10 border-emerald-500/20";
  if (project.progress >= 100) { status = "DONE"; message = "프로젝트가 완료되었습니다.";
  } else if (timePercent > 100 && project.progress < 100) { status = "OVERDUE";
  message = "마감일이 지났습니다! 긴급 조치가 필요합니다."; color = "text-red-500"; bg = "bg-red-500/10 border-red-500/20";
  } else if (timePercent > project.progress + 20) { status = "RISK";
  message = "주의: 진행률이 시간 경과 대비 20% 이상 지연되고 있습니다."; color = "text-red-400"; bg = "bg-red-500/10 border-red-500/20";
  } else if (timePercent > project.progress + 10) { status = "WARNING";
  message = "진척도가 시간 흐름보다 약간 늦습니다. 속도를 내야 합니다."; color = "text-amber-400"; bg = "bg-amber-500/10 border-amber-500/20";
  } return { timePercent, status, message, color, bg }; };
  // Link Manager Filtering
  const filteredRefLinks = refLinks.filter(link => 
      checkSearchMatch(link.name + " " + (link.description||"") + " " + link.department + " " + link.country, linkSearchTerm)
  );
  // 🌟 [NEW] Email Analysis Filtering
  const filteredEmailList = emailAnalysisList.filter(item =>
      checkSearchMatch(item.title + " " + item.category + " " + (item.url||""), emailSearchTerm)
  );
  const filteredBookmarks = bookmarks.filter(item => 
    checkSearchMatch(item.title + " " + item.category + " " + item.description, bmSearchTerm)
);
  return (
    <div className={`min-h-[100dvh] lg:h-screen w-full p-4 lg:p-6 transition-colors duration-700 bg-gradient-to-br ${theme.bg} font-sans text-slate-200 flex flex-col lg:overflow-hidden`}>
      {toast.show && <Toast message={toast.message} type={toast.type} onClose={() => setToast({ ...toast, show: false })} />}
      
      <div className="max-w-[1600px] w-full mx-auto mb-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 shrink-0">
        <div className="md:col-span-1 lg:col-span-3 relative h-full"><Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} /><input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="검색..." className="w-full h-full pl-11 pr-4 py-3 rounded-2xl bg-slate-800/60 border border-white/5 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 text-sm font-medium transition-all shadow-sm text-slate-200 placeholder-slate-500" />{searchTerm && <button onClick={() => setSearchTerm("")} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"><X size={16}/></button>}</div>
        <div className="md:col-span-1 lg:col-span-9 flex items-center justify-between gap-4">
            <div className="flex gap-2">
                <button onClick={() => setModalMode('STATS')} className="h-full py-3 px-6 bg-slate-800/60 hover:bg-slate-700 rounded-2xl shadow-sm transition-all text-slate-400 hover:text-indigo-400 flex items-center gap-2 font-bold text-sm border border-white/5 whitespace-nowrap"><BarChart2 size={18}/> 업무 분석</button>
                <button onClick={() => setModalMode('LINK_MANAGER')} className="h-full py-3 px-6 bg-slate-800/60 hover:bg-slate-700 rounded-2xl shadow-sm transition-all text-slate-400 hover:text-emerald-400 flex items-center gap-2 font-bold text-sm border border-white/5 whitespace-nowrap"><Bookmark size={18}/> 자료 관리</button>
                {/* 🌟 New E-mail Analysis Button */}
                <button onClick={() => setModalMode('EMAIL_ANALYSIS')} className="h-full py-3 px-6 bg-slate-800/60 hover:bg-slate-700 rounded-2xl shadow-sm transition-all text-slate-400 hover:text-pink-400 flex items-center gap-2 font-bold text-sm border border-white/5 whitespace-nowrap"><Mail size={18}/> e-mail 분석</button>
                <button onClick={() => setModalMode('BOOKMARK_MANAGER')} className="h-full py-3 px-6 bg-slate-800/60 hover:bg-slate-700 rounded-2xl shadow-sm transition-all text-slate-400 hover:text-yellow-400 flex items-center gap-2 font-bold text-sm border border-white/5 whitespace-nowrap"><Star size={18}/> 북마크</button>
                <button onClick={() => setModalMode('SETTINGS')} className="h-full py-3 px-4 bg-slate-800/60 hover:bg-slate-700 rounded-2xl shadow-sm transition-all text-slate-400 hover:text-white border border-white/5"><Settings size={18}/></button>
            </div>
            <GlobalStatusWidget />
        </div>
      </div>

      <div className="max-w-[1600px] w-full mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-5 flex-1 min-h-0">
          <div className="md:col-span-1 lg:col-span-3 flex flex-col gap-5 lg:h-full lg:min-h-0">
          <GlassCard className="shrink-0 h-auto" noPadding><div className="p-2 flex bg-slate-900/30 rounded-3xl m-2 relative"><button onClick={() => setContext('WORK')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all duration-300 z-10 ${context === 'WORK' ? theme.activeTab : 'text-slate-500 hover:text-slate-300'}`}><Briefcase size={16}/> 업무</button><button onClick={() => setContext('LIFE')} className={`flex-1 flex items-center justify-center gap-2 py-3 rounded-2xl text-sm font-bold transition-all duration-300 z-10 ${context === 'LIFE' ? theme.activeTab : 'text-slate-500 hover:text-slate-300'}`}><User size={16}/> 개인</button></div></GlassCard>
          <GlassCard className="flex-1 min-h-[400px] lg:min-h-0" title={<div className="flex items-center text-slate-200">프로젝트 <CountBadge count={visibleProjects.length} color="blue"/></div>} icon={Layout} accentColor="text-blue-400" rightElement={<div className="flex gap-2"><button onClick={() => setProjectViewMode(projectViewMode === 'LIST' ? 'TIMELINE' : 'LIST')} className="p-1.5 bg-slate-800 hover:bg-slate-700 rounded-lg text-slate-400 hover:text-white transition-all border border-slate-700" title={projectViewMode === 'LIST' ? "타임라인 보기" : "리스트 보기"}>{projectViewMode === 'LIST' ? <GanttChartSquare size={16}/> : <AlignJustify size={16}/>}</button><button onClick={() => { setModalMode('CREATE_PROJECT'); setNewProjectTitle("");
            }} className="p-1.5 bg-white/10 hover:bg-indigo-500 text-slate-300 hover:text-white rounded-full transition-all" title="프로젝트 추가"><Plus size={16}/></button></div>}>
             {projectViewMode === 'LIST' ?
            (<><div className="shrink-0 mb-4 mt-2"><div className="flex justify-between text-sm font-medium mb-2 opacity-90 text-slate-400"><span>평균 진행률</span><span>{avgProgress}%</span></div><div className="w-full bg-slate-700/50 rounded-full h-2"><div className="bg-indigo-500 h-2 rounded-full shadow-[0_0_15px_rgba(99,102,241,0.5)]" style={{ width: `${avgProgress}%` }}></div></div></div><div className="shrink-0 flex flex-wrap gap-1 mb-4">{['Active', 'OnHold', 'Done', 'All'].map(status => (<button key={status} onClick={() => setProjectFilter(status)} className={`px-3 py-1 rounded-full text-[10px] font-bold transition-colors whitespace-nowrap ${projectFilter === status ? 'bg-indigo-500 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}>{status === 'Active' ? '진행중' : status === 'OnHold' ? '대기' : status === 'Done' ? '완료' : '전체'}</button>))}</div><div className="flex-1 lg:overflow-y-auto overflow-x-hidden pr-1 custom-scrollbar -mr-2 pb-2">{visibleProjects.length === 0 ? <div className="text-center text-slate-500 text-sm mt-10">프로젝트 없음</div> : visibleProjects.map(p => (<ProjectItem key={p.id} data={p} onClick={() => setActiveProjectId(activeProjectId === p.id 
            ? null : p.id)} onDoubleClick={() => { setSelectedItem(p); setModalMode('PROJECT_DETAIL'); }} isActive={activeProjectId === p.id} onOpenMindMap={handleOpenMindMap} />))}</div></>) : (<TimelineView projects={visibleProjects} onClick={(id) => setActiveProjectId(activeProjectId === id ? null : id)} onDoubleClick={(p) => { setSelectedItem(p); setModalMode('PROJECT_DETAIL'); }} activeProjectId={activeProjectId} />)}
          </GlassCard>
        </div>
        <div className="md:col-span-1 lg:col-span-5 lg:h-full lg:min-h-0"><GlassCard className="min-h-[500px] lg:h-full lg:min-h-0" title={<div className="flex items-center text-slate-200">할 일 목록 <CountBadge count={filteredTasks.length} color="indigo"/></div>} icon={CheckSquare} accentColor={theme.accent} rightElement={
            <div className="flex items-center gap-3">
                 {/* [NEW] Large Tab Selector for Link Filtering - Fixed Logic & Design */}
                 <div className="flex bg-slate-700/50 rounded-xl p-1 shadow-inner border border-white/5">
                    <button onClick={() => { setTaskLinkFilter('All'); setActiveProjectId(null); }} className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all ${taskLinkFilter === 'All' ? 'bg-slate-500 text-white shadow-lg scale-105' : 'text-slate-400 hover:text-slate-200'}`}>전체</button>
                    <button onClick={() => { setTaskLinkFilter('Linked'); setActiveProjectId(null); }} className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all ${taskLinkFilter === 'Linked' ? 'bg-indigo-600 text-white shadow-lg scale-105' : 'text-slate-400 hover:text-slate-200'}`}>프로젝트</button>
                    <button onClick={() => { setTaskLinkFilter('Unlinked'); setActiveProjectId(null); }} className={`px-4 py-2 rounded-lg text-xs font-extrabold transition-all ${taskLinkFilter === 'Unlinked' ? 'bg-orange-500 text-white shadow-lg scale-105' : 'text-slate-400 hover:text-slate-200'}`}>일반</button>
                 </div>

                <div className="flex bg-slate-800/50 rounded-lg p-1 border border-white/5">
                    <button onClick={() => setTaskFilter('Pending')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${taskFilter === 'Pending' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>진행</button>
                    <button onClick={() => setTaskFilter('Done')} className={`px-3 py-1.5 rounded-md text-xs font-bold transition-colors ${taskFilter === 'Done' ? 'bg-white/10 text-white shadow-sm' : 'text-slate-500 hover:text-slate-300'}`}>완료</button>
                </div>
            </div>
            }><div className="flex-1 lg:overflow-y-auto pr-2 custom-scrollbar space-y-3 mt-2 pb-4">{loading && !data ?
            <div className="flex flex-col items-center justify-center h-40 text-slate-500"><Loader2 className="animate-spin mb-2"/> 로딩 중...</div> : filteredTasks.length === 0 ?
            <div className="flex flex-col items-center justify-center h-full text-slate-500 opacity-60"><CheckCircle2 size={48} className="mb-4 text-slate-600"/><p>{searchTerm ? "검색 결과가 없습니다."
            : (taskFilter === 'Pending' ? "할 일이 없습니다!" : "완료된 일이 없습니다.")}</p></div> : filteredTasks.map(task => { const dDay = task.dueDate && task.status === 'Pending' ? getDday(task.dueDate) : null; 
            const taskProgress = getTaskProgress(task);
            
            let hasSubTasks = false;
            try {
                const parsed = typeof task.subTasks === 'string' ? JSON.parse(task.subTasks) : task.subTasks;
                if (parsed && parsed.length > 0) hasSubTasks = true;
            } catch(e) {}

            return ( 
            <div key={task.id} onClick={(e) => openTaskDetailModal(e, task)} className={`group flex items-center gap-3 p-4 rounded-2xl transition-all cursor-pointer border hover:shadow-md hover:scale-[1.01] ${task.status === 'Done' ? 'bg-slate-800/30 border-transparent opacity-50' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}>
              <div onClick={(e) => { e.stopPropagation(); requestToggleTask(task); }} className={`shrink-0 transition-colors p-1 rounded-lg hover:bg-white/10 ${task.status === 'Done' ? 'text-slate-600' : (context === 'WORK' ? 'text-indigo-400' : 'text-orange-400')}`}>{task.status === 'Done' ? <CheckSquare size={24}/> : <Square size={24}/>}</div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between mb-0.5">
                   <div className="flex items-center gap-2 truncate pr-2">
                     <p className={`font-bold text-base truncate ${task.status === 'Done' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{task.title}</p>
                     {hasSubTasks && task.status !== 'Done' && <span className="text-xs font-bold text-indigo-400">{taskProgress}%</span>}
                   </div>
                   <PriorityBadge priority={task.priority} />
              </div>
                 {hasSubTasks && task.status !== 'Done' && (
                 <div className="w-full bg-slate-700/50 rounded-full h-1.5 mt-1 mb-2">
      <div className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500" style={{ width: `${taskProgress}%` }}></div>
                  </div>
                )}
                <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                 {dDay && <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${dDay.color}`}><Clock size={10}/> {dDay.label}</span>}
                   {!dDay && task.dueDate && <span className="text-[10px] font-bold bg-slate-700 text-slate-400 px-1.5 py-0.5 rounded flex items-center gap-1"><Clock size={10}/> 
                    {task.dueDate.substring(5)}</span>}
                  {getProjectName(task.projectId) && <><span className="w-1 h-1 rounded-full bg-slate-600"></span><span className="text-indigo-400 font-bold">{getProjectName(task.projectId)}</span></>}
                </div>
              </div>
        </div> );
        })}</div></GlassCard></div>
        <div className="md:col-span-2 lg:col-span-4 flex flex-col gap-5 lg:h-full lg:min-h-0"><GlassCard className={`flex-[2] min-h-[400px] lg:min-h-0 transition-all ${isChatMode ? 'ring-2 ring-purple-500 ring-offset-2 ring-offset-slate-900' : ''}`} title={isChatMode ? "AI 채팅 비서" : `AI 브리핑 (${currentReport?.date || 'Today'})`} icon={Brain} accentColor="text-purple-400" rightElement={<div className="flex gap-2">{!isChatMode && <button onClick={handleRefreshReport} disabled={isReportRefreshing} className={`p-2 rounded-lg transition-colors text-purple-400 ${isReportRefreshing ? 'animate-spin bg-purple-500/10' : 'hover:bg-white/10'}`}><RefreshCw size={18}/></button>}<button onClick={() => setIsChatMode(!isChatMode)} className={`p-2 rounded-lg transition-colors flex items-center gap-1 text-xs font-bold ${isChatMode ? 'bg-slate-700 text-white' : 'bg-white/10 text-purple-400 hover:bg-white/20'}`}>{isChatMode ? <><RotateCcw size={14}/> 브리핑</> : <><MessageCircle size={14}/> 채팅</>}</button></div>}>{isChatMode ?
        (<div className="flex flex-col h-full overflow-hidden mt-2"><div className="flex-1 lg:overflow-y-auto pr-2 custom-scrollbar">{chatHistory.map((msg, i) => <ChatBubble key={i} isUser={msg.role === 'user'} text={msg.text} />)}{isChatLoading && <div className="flex gap-2 text-slate-500 text-xs p-2 items-center"><Loader2 className="animate-spin" size={14}/> 답변 생성 중...</div>}<div ref={chatEndRef}></div></div><div className="shrink-0 mt-3 flex gap-2"><input type="text" value={chatInput} onChange={(e) => setChatInput(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="질문 입력..." className="flex-1 p-3 rounded-xl bg-slate-900/50 border border-white/10 focus:outline-none focus:ring-2 focus:ring-purple-500 text-sm" disabled={isChatLoading} autoFocus /><VoiceButton onSpeech={(text) => setChatInput(text)} /><button onClick={handleSendMessage} disabled={isChatLoading || !chatInput.trim()} className="p-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 disabled:opacity-50 transition-colors"><Send size={18}/></button></div></div>) : (<div className="flex-1 flex flex-col h-full lg:overflow-hidden mt-2"><div onClick={() => { setSelectedItem(currentReport); setModalMode('REPORT_DETAIL');
            }} className="flex-1 bg-white/5 p-4 rounded-2xl border border-white/5 shadow-sm hover:bg-white/10 transition-all cursor-pointer group lg:overflow-y-auto custom-scrollbar">{isReportRefreshing ?
            (<div className="flex flex-col items-center justify-center h-full text-purple-400 gap-2"><Loader2 size={32} className="animate-spin"/><span className="text-sm font-bold">최신 브리핑 작성 중...</span></div>) : (<div className="flex items-start gap-3"><div className="mt-1 min-w-[32px] h-[32px] rounded-full bg-slate-700 overflow-hidden flex items-center justify-center font-bold text-xs text-slate-400 group-hover:bg-purple-500/20 group-hover:text-purple-300 transition-colors">AI</div><div>
              {/* ✨ [MODIFIED] Dashboard Widget Readability Improvement ✨ */}
              <div className="text-sm text-slate-200 leading-relaxed cursor-pointer">
                <ReactMarkdown
                 components={{
                    h1: ({node, ...props}) => <h1 className="text-sm font-bold text-indigo-400 mt-2 mb-1" {...props} />,
                    h2: ({node, ...props}) => <h2 className="text-sm font-bold text-indigo-400 mt-2 mb-1" {...props} />,
                    h3: ({node, ...props}) => <h3 className="text-sm font-bold text-indigo-400 mt-2 mb-1" {...props} />,
                    strong: ({node, ...props}) => <strong className="text-amber-400 font-extrabold" {...props} />,
                    p: ({node, ...props}) => <p className="mb-2" {...props} />,
                    li: ({node, ...props}) => <li className="mb-1 text-slate-300" {...props} />,
                  }}
                >
                  {reportContent}
                </ReactMarkdown>
              </div>
            </div></div>)}</div></div>)}</GlassCard><GlassCard className="flex-1 min-h-[300px] lg:min-h-0" title="오늘의 일정" icon={Calendar} accentColor="text-emerald-400" rightElement={<button onClick={() => window.open('https://calendar.google.com', '_blank')} className="text-xs font-bold text-slate-400 hover:text-slate-200 flex items-center gap-1">전체보기 
            <ArrowRight size={12}/></button>}><div className="flex flex-col h-full"><div className="flex-1 lg:overflow-y-auto pr-1 custom-scrollbar space-y-2 mb-3">{schedule.length === 0 ?
            <div className="text-center text-slate-500 text-xs py-4">일정 없음</div> : schedule.map((ev, i) => (<ScheduleItem key={i} event={ev} />))}</div><div className="shrink-0 grid grid-cols-2 gap-2 mt-auto pt-3 border-t border-white/5"><button onClick={() => setModalMode('CREATE_TASK')} className="flex items-center justify-center gap-2 p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-xs font-bold text-slate-300"><Plus size={14}/> 새 할 일</button><button onClick={() => setModalMode('DRAFT_EMAIL')} className="flex items-center justify-center gap-2 p-2 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-xs font-bold text-slate-300"><Mail size={14}/> 메일 작성</button></div></div></GlassCard></div>
      </div>

      <FloatingActionButton onClick={() => setModalMode('CREATE_TASK')} />
      <ConfirmModal isOpen={confirmState.isOpen} onClose={() => setConfirmState({ ...confirmState, isOpen: false })} onConfirm={executeConfirmAction} title={confirmState.type === 'DELETE' ? '업무 삭제' : '상태 변경'} message={confirmState.type === 'DELETE' ? `"${confirmState.task?.title}" 업무를 영구 삭제하시겠습니까?` : `"${confirmState.task?.title}" 업무 상태를 변경하시겠습니까?`} type={confirmState.type === 'DELETE' ? 'danger' : 'info'} />
      
      {/* Detail Modal: Project Create/Edit */}
      <DetailModal isOpen={modalMode === 'CREATE_PROJECT' || modalMode === 'EDIT_PROJECT'} onClose={() => setModalMode(null)} title={modalMode === 'EDIT_PROJECT' ? "프로젝트 수정" : "새 프로젝트 시작"} themeColor="blue">
        <div className="space-y-6 p-6">
          <div><label className="block text-xs font-bold text-slate-500 mb-2 uppercase">상태 (Status)</label><div className="flex bg-slate-800 rounded-xl border border-slate-700 p-1">{['Active', 'OnHold', 'Done'].map(st => (<button key={st} onClick={() => setProjectStatus(st)} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${projectStatus === st ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-slate-200'}`}>{st}</button>))}</div></div>
          <div><label className="block text-xs font-bold text-slate-500 mb-2 uppercase">프로젝트 명</label><div className="flex gap-2"><input type="text" value={newProjectTitle} onChange={(e) => setNewProjectTitle(e.target.value)} placeholder="예: 베트남 2공장 증설" className="flex-1 p-4 rounded-xl bg-slate-800 border-2 border-slate-700 focus:border-blue-500 focus:bg-slate-700 transition-colors outline-none font-medium text-slate-200" autoFocus /><VoiceButton onSpeech={(text) => setNewProjectTitle(text)} /></div></div>
          <div className="grid grid-cols-2 gap-4"><div><label className="block text-xs font-bold text-slate-500 mb-2 uppercase">등록 날짜</label><input type="date" value={projectStartDate} onChange={(e) => setProjectStartDate(e.target.value)} className="w-full p-4 rounded-xl bg-slate-800 border-2 border-slate-700 focus:border-blue-500 text-slate-200" /></div><div><label className="block text-xs font-bold text-slate-500 mb-2 uppercase">완료 예정일</label><input type="date" value={projectDueDate} onChange={(e) => setProjectDueDate(e.target.value)} className="w-full p-4 rounded-xl bg-slate-800 border-2 border-slate-700 focus:border-blue-500 text-slate-200" /></div></div><div className="grid grid-cols-2 gap-4"><div><label className="block text-xs font-bold text-slate-500 mb-2 uppercase">관련 부서</label><select value={projectDept} onChange={(e) => setProjectDept(e.target.value)} className="w-full p-4 rounded-xl bg-slate-800 border-2 border-slate-700 focus:border-blue-500 text-slate-200 appearance-none">{DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}</select></div><div><label className="block text-xs font-bold text-slate-500 mb-2 uppercase">국가</label><div className="flex p-1 bg-slate-800 rounded-xl border border-slate-700"><button onClick={() => setProjectCountry('KR')} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${projectCountry === 'KR' ? 'bg-blue-600 text-white' : 'text-slate-400'}`}>🇰🇷 KR</button><button onClick={() => setProjectCountry('VN')} className={`flex-1 py-3 rounded-lg text-sm font-bold transition-all ${projectCountry === 'VN' ? 'bg-red-600 text-white' : 'text-slate-400'}`}>🇻🇳 VN</button></div></div></div><div><label className="block text-xs font-bold text-slate-500 mb-2 uppercase">프로젝트 요청자</label><input type="text" value={projectRequester} onChange={(e) => setProjectRequester(e.target.value)} placeholder="요청자 이름" className="w-full p-4 rounded-xl bg-slate-800 border-2 border-slate-700 focus:border-blue-500 text-slate-200" /></div><div className="flex gap-2 mt-2">
            {/* 1. 기본 저장 버튼 (기존 기능) */}
            <button onClick={() => handleSaveProject(false)} disabled={isSaving} className="flex-1 py-4 bg-blue-600 text-white font-bold rounded-2xl hover:bg-blue-700 flex justify-center items-center gap-2 disabled:opacity-50">
              {isSaving ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>} 
              {modalMode === 'EDIT_PROJECT' ? "수정 완료" : "프로젝트 생성"}
            </button>

            {/* 2. 👇 [추가] 생성 후 바로 마인드 맵으로 가는 버튼 (신규 생성일 때만 표시) */}
            {modalMode === 'CREATE_PROJECT' && (
              <button 
                onClick={() => handleSaveProject(true)} 
                disabled={isSaving} 
                className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 flex justify-center items-center gap-2 disabled:opacity-50 border border-indigo-400/30"
              >
                {isSaving ? <Loader2 className="animate-spin" size={20}/> : <Network size={20}/>}
                생성 및 설계 (Map)
              </button>
            )}
          </div>
        </div>
      </DetailModal>
      
      {/* Project Detail Modal */}
      <DetailModal isOpen={modalMode === 'PROJECT_DETAIL' && selectedItem} onClose={() => setModalMode(null)} title={selectedItem?.title} themeColor="blue" size="large">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 h-full">
            <div className="lg:col-span-3 bg-slate-900/50 border-r border-white/5 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 h-full">
                {selectedItem && (() => {
                    const health = getProjectHealth(selectedItem);
                    if (!health) return null;
                    return (
                     <div className={`p-5 rounded-2xl border-2 flex flex-col gap-4 ${health.bg}`}>
                             <div className="flex items-center gap-3"><div className={`p-2 rounded-full bg-white/10 ${health.color}`}><Activity size={24}/></div><div><h4 className={`text-base font-extrabold ${health.color}`}>프로젝트 진단</h4></div></div>
                             <p className="text-sm text-slate-200 font-medium leading-relaxed">{health.message}</p>
                             <div className="relative h-4 bg-slate-900/50 rounded-full overflow-hidden border border-white/10 shadow-inner mt-2"> 
                                <div className={`absolute top-0 left-0 h-full shadow-lg transition-all duration-1000 ${selectedItem.progress === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-blue-600 to-cyan-400'}`} style={{ width: `${selectedItem.progress}%` }}></div>
                                <div className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10" style={{ left: `${health.timePercent}%` }}></div>
                             </div>
                             <div className="flex justify-between text-[10px] font-bold text-slate-400"><span>진행: {selectedItem.progress}%</span><span>시간: {Math.round(health.timePercent)}%</span></div>
                       </div>
                    );
                  })()}
                
                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${selectedItem?.status === 'Active' ? 'bg-blue-500' : 'bg-slate-600'}`}>{selectedItem?.progress}%</div>
                    <div><p className="text-xs text-slate-500 font-bold mb-1 uppercase">Current Status</p><p className="text-lg font-bold text-slate-200">{selectedItem?.status}</p></div>
                </div>

                {/* Connected Tasks Stats */}
                <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5 space-y-3">
                   <h4 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2"><GanttChartSquare size={14}/> 연결된 할 일 현황</h4>
                   <div className="flex gap-2 text-center">
                      <div className="flex-1 bg-white/5 p-2 rounded-xl"><div className="text-lg font-bold text-white">{localProjectTasks.length}</div><div className="text-[10px] text-slate-500">Total</div></div>
                      <div className="flex-1 bg-emerald-500/10 p-2 rounded-xl"><div className="text-lg font-bold text-emerald-400">{localProjectTasks.filter(t => t.status === 'Done').length}</div><div className="text-[10px] text-emerald-500/50">Done</div></div>
                      <div className="flex-1 bg-amber-500/10 p-2 rounded-xl"><div className="text-lg font-bold text-amber-400">{localProjectTasks.filter(t => t.status !== 'Done').length}</div><div className="text-[10px] text-amber-500/50">Pending</div></div>
                   </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-slate-800/30 rounded-xl border border-white/5 space-y-3">
                        <div className="flex items-center gap-3"><Calendar size={16} className="text-slate-500"/><div className="flex-1"><p className="text-[10px] text-slate-500 font-bold uppercase">등록일 / 완료예정일</p><p className="text-sm text-slate-300 font-bold">{selectedItem?.startDate} ~ {selectedItem?.dueDate}</p></div></div>
                        <div className="flex items-center gap-3"><Briefcase size={16} className="text-slate-500"/><div className="flex-1"><p className="text-[10px] text-slate-500 font-bold uppercase">관련 부서</p><p className="text-sm text-slate-300 font-bold">{selectedItem?.department}</p></div></div>
                        <div className="flex items-center gap-3"><Globe size={16} className="text-slate-500"/><div className="flex-1"><p className="text-[10px] text-slate-500 font-bold uppercase">국가</p><p className="text-sm text-slate-300 font-bold">{selectedItem?.country === 'KR' ? '🇰🇷 대한민국' : '🇻🇳 베트남'}</p></div></div>
                        <div className="flex items-center gap-3"><User size={16} className="text-slate-500"/><div className="flex-1"><p className="text-[10px] text-slate-500 font-bold uppercase">요청자</p><p className="text-sm text-slate-300 font-bold">{selectedItem?.requester || "미지정"}</p></div></div>
                    </div>
                    <div className="mt-auto pt-4 border-t border-white/5">
                        <div className="flex gap-2"><button onClick={openEditProjectModal} className="flex-1 bg-slate-800 text-blue-400 font-bold rounded-xl hover:bg-slate-700 py-3 flex justify-center items-center gap-2 transition-colors border border-slate-700 text-sm"><Edit2 size={16}/> 수정</button><button onClick={handleDeleteProject} className="flex-1 bg-slate-800 text-red-400 font-bold rounded-xl hover:bg-slate-700 py-3 flex justify-center items-center gap-2 transition-colors border border-slate-700 text-sm"><Trash2 size={16}/> 삭제</button></div>
                    </div>
                </div>
            </div>
            {/* Middle Column: Tasks */}
            <div className="lg:col-span-5 flex flex-col h-full bg-[#0f172a] border-r border-white/5 relative min-h-0">
               <div className="flex items-center justify-between p-4 sticky top-0 bg-[#0f172a] z-10 border-b border-white/5">
                   <h4 className="text-base font-bold text-slate-200 flex items-center gap-2"><CheckSquare size={18} className="text-indigo-400"/> 연결된 할 일 <CountBadge count={localProjectTasks.length} color="indigo"/></h4>
                {/* 버튼들을 감싸는 div를 추가하여 정렬합니다. */}
                <div className="flex items-center gap-2">
                       {/* 👉 [추가됨] 마인드 맵 버튼 이동 완료 */}
                       <button 
                           onClick={() => handleOpenMindMap(selectedItem)}
                           className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 text-slate-300 border border-slate-600 hover:bg-slate-700 hover:text-white rounded-lg text-xs font-bold transition-all"
                           title="마인드 맵 보기"
                       >
                           <Network size={12}/> <span className="hidden sm:inline">Map</span>
                       </button>

                       <button onClick={handleAiSuggestTasks} disabled={isAiPlanning} className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500 to-purple-500 text-white rounded-lg text-xs font-bold hover:shadow-lg hover:shadow-purple-500/30 transition-all disabled:opacity-50">
                           {isAiPlanning ? <Loader2 size={12} className="animate-spin"/> : <Sparkles size={12}/>} AI 제안
                       </button>
                   </div>
                </div>
                <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-2" onDragOver={handleDragOver}>
                  {localProjectTasks.length === 0 ?
                  (<div className="flex flex-col items-center justify-center h-40 text-slate-500 border-2 border-dashed border-slate-800 rounded-xl"><p className="text-sm">아직 등록된 할 일이 없습니다.</p></div>) : (
                    localProjectTasks.map((t, index) => {
                      const dDay = t.dueDate && t.status === 'Pending' ? getDday(t.dueDate) : null;
                      const tProgress = getTaskProgress(t);
  
                      return (
                        <div key={t.id} draggable onDragStart={(e) => handleDragStart(e, index)} onDragEnter={(e) => handleDragEnter(e, index)} onDragEnd={handleDragEnd} onClick={(e) => openTaskDetailModal(e, t)} 
                          className="flex items-start gap-3 p-3 bg-slate-800/40 rounded-xl border border-white/5 cursor-move hover:bg-slate-700/50 transition-colors group select-none hover:border-indigo-500/30">
                          <div className="flex flex-col items-center gap-1 text-slate-500 w-6 mt-1"><GripVertical size={14} className="opacity-0 group-hover:opacity-100 transition-opacity"/><span className="text-[10px] font-bold font-mono">{index + 1}</span></div>
                          <div className={`mt-1.5 w-2.5 h-2.5 rounded-full shrink-0 ${t.status === 'Done' ? 'bg-emerald-500' : 'bg-slate-500'}`}></div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                                <span className={`text-sm font-bold truncate ${t.status === 'Done' ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{t.title}</span>
                                <PriorityBadge priority={t.priority} />
                            </div>
                            {t.description && (<p className="text-xs text-slate-400 mt-1 line-clamp-2"><span className="text-indigo-400 font-bold mr-1">GUIDE:</span>{t.description}</p>)}
                            {tProgress > 0 && t.status !== 'Done' && (
                                <div className="flex items-center gap-2 mt-2">
                                     <div className="flex-1 h-1 bg-slate-700 rounded-full overflow-hidden">
                                        <div className="h-full bg-indigo-500" style={{width: `${tProgress}%`}}></div>
                                    </div>
                                    <span className="text-[10px] font-bold text-indigo-400">{tProgress}%</span>
                                </div>
                            )}
                            </div>
                          {dDay ? (<span className={`text-[10px] font-bold px-2 py-1 rounded-lg whitespace-nowrap mt-0.5 ${dDay.color}`}>{dDay.label}</span>) : (t.dueDate && <span className="text-[10px] font-bold text-slate-500 bg-slate-700/50 px-2 py-1 rounded-lg whitespace-nowrap mt-0.5">{t.dueDate.substring(5)}</span>)}
                        </div>
                      );
                    })
                  )}
                </div>
                <div className="shrink-0 bg-slate-800/50 p-4 border-t border-white/5 space-y-3 sticky bottom-0 backdrop-blur-md">
                    <div className="flex justify-between items-center mb-1">
                        <p className="text-[10px] font-bold text-slate-500 uppercase flex items-center gap-1"><Plus size={10}/> 할 일 추가</p>
                        <button onClick={() => setIsBatchMode(!isBatchMode)} className={`text-[10px] font-bold px-2 py-1 rounded transition-colors ${isBatchMode ? 'bg-blue-500 text-white' : 'bg-slate-700 text-slate-400 hover:text-white'}`}>{isBatchMode ? "일괄 모드 ON" : "일괄 모드 전환"}</button>
                    </div>
                    {isBatchMode ?
                    (
                        <div className="space-y-2 animate-fadeIn">
                          <textarea value={batchTasks} onChange={(e) => setBatchTasks(e.target.value)} placeholder={`할 일을 줄바꿈(Enter)으로 구분해 입력하세요.\n예시:\n시장 조사\n경쟁사 분석\n보고서 작성`} className="w-full p-3 h-24 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 focus:bg-slate-800 text-sm text-slate-200 outline-none transition-colors resize-none leading-relaxed" autoFocus/>
                          <div className="flex gap-2">
                             <select value={quickTaskPriority} onChange={(e) => setQuickTaskPriority(e.target.value)} className="flex-1 p-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 text-xs text-slate-300 outline-none"><option value="High">🔴 긴급</option><option value="Review">🟣 검토</option><option value="Medium">🔵 보통</option><option value="Hold">🟠 보류</option><option value="Low">⚪ 낮음</option></select>
                            <input type="date" value={quickTaskDueDate} onChange={(e) => setQuickTaskDueDate(e.target.value)} className="flex-1 p-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 text-xs text-slate-300 outline-none" />
                            <button onClick={handleBatchAddTasks} disabled={!batchTasks.trim() || isSaving} className="px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center font-bold text-xs gap-1">{isSaving ? <Loader2 className="animate-spin" size={16}/> : <><List size={16}/> 등록</>}</button>
                          </div>
                        </div>
                    ) : (
                      <div className="space-y-2 animate-fadeIn">
                          <div className="flex gap-2"><input type="text" value={quickTaskTitle} onChange={(e) => setQuickTaskTitle(e.target.value)} placeholder="할 일 제목..." className="flex-1 p-3 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 focus:bg-slate-800 text-sm text-slate-200 outline-none transition-colors" onKeyPress={(e) => e.key === 'Enter' && handleQuickAddTask()} /><VoiceButton onSpeech={(text) => setQuickTaskTitle(text)} /></div>
                          <div className="flex gap-2">
                              <input type="date" value={quickTaskDueDate} onChange={(e) => setQuickTaskDueDate(e.target.value)} className="flex-1 p-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 text-xs text-slate-300 outline-none" />
                            <select value={quickTaskPriority} onChange={(e) => setQuickTaskPriority(e.target.value)} className="flex-1 p-2 rounded-lg bg-slate-900 border border-slate-700 focus:border-blue-500 text-xs text-slate-300 outline-none"><option value="High">🔴 긴급</option><option value="Review">🟣 검토</option><option value="Medium">🔵 보통</option><option value="Hold">🟠 보류</option><option value="Low">⚪ 낮음</option></select>
                            <button onClick={handleQuickAddTask} disabled={!quickTaskTitle.trim() || isSaving} className="px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg disabled:opacity-50 transition-colors flex items-center justify-center">{isSaving ? <Loader2 className="animate-spin" size={16}/> : <Plus size={16}/>}</button>
                          </div>
                        </div>
                    )}
                </div>
           </div>
            
            {/* Right Column: Resources/Notes (Project) */}
            <div className="lg:col-span-4 bg-slate-900/50 border-l border-white/5 p-6 flex flex-col h-full gap-4">
                {/* Resources Section */}
                <div className={`flex flex-col min-h-0 transition-all duration-300 ${isResourceOpen ? 'flex-1' : 'shrink-0'}`}>
                    <div className="flex items-center justify-between mb-2 p-2 rounded-xl bg-slate-800/30 border border-white/5">
                        <div onClick={() => setIsResourceOpen(!isResourceOpen)} className="flex-1 flex items-center gap-2 cursor-pointer">
                            <Link size={16} className="text-blue-400"/> 
                              <h4 className="text-sm font-bold text-slate-200">자료실</h4>
                            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">{projectResources.length}</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <button onClick={() => setIsResourceInputModalOpen(true)} className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"><Plus size={14}/></button>
                            <button onClick={() => setIsResourceOpen(!isResourceOpen)} className="text-slate-500 hover:text-slate-300 transition-colors">{isResourceOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</button>
                        </div>
                    </div>
                    {isResourceOpen && (
                        <div className="flex-1 bg-slate-800/30 rounded-xl border border-white/5 p-3 overflow-y-auto custom-scrollbar space-y-2 animate-fadeIn min-h-0">
                            {projectResources.length === 0 ?
                                <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2"><FilePlus size={24} className="opacity-50"/><p className="text-xs">등록된 자료가 없습니다.</p></div> : 
                                projectResources.map((res, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-transparent hover:border-white/10 group">
                                       <div className="p-2 bg-slate-700 rounded-lg text-slate-300"><ExternalLink size={14}/></div>
                                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => window.open(res.link, '_blank')}>
                                            <p className="text-sm font-bold text-slate-200 hover:text-blue-400 truncate">{res.name}</p>
                                            <p className="text-[10px] text-slate-500 truncate">{res.link}</p>
                                      </div>
                                       <button onClick={() => handleDeleteResource(idx)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded-lg transition-all"><Trash2 size={14}/></button>
                                    </div>
                                ))
                            }
                        </div>
                    )}
                </div>
                 {/* Note Section */}
                <div className={`flex flex-col min-h-0 transition-all duration-300 ${isNoteOpen ? 'flex-1' : 'shrink-0'}`}>
                    <div onClick={() => setIsNoteOpen(!isNoteOpen)} className="flex items-center justify-between cursor-pointer p-2 rounded-xl bg-slate-800/30 border border-white/5 mb-2 hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-2">
                            <StickyNote size={16} className="text-amber-400"/> 
                              <h4 className="text-sm font-bold text-slate-200">메모</h4>
                        </div>
                        <div className="text-slate-500">{isNoteOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</div>
                    </div>
                    {isNoteOpen && (
                        <div className="flex-1 relative animate-fadeIn min-h-0">
                            <textarea value={projectNote} onChange={(e) => setProjectNote(e.target.value)} className="w-full h-full p-4 bg-yellow-50/5 text-slate-200 border border-white/10 rounded-xl resize-none focus:outline-none focus:border-amber-500/50 focus:bg-slate-800 transition-colors leading-relaxed custom-scrollbar" placeholder="자유롭게 메모하세요." spellCheck="false" />
                            <button onClick={handleSaveNote} className="absolute bottom-4 right-4 p-3 bg-amber-600 hover:bg-amber-500 text-white rounded-full shadow-lg hover:scale-110 transition-all" title="메모 저장"><Save size={18}/></button>
                        </div>
                      )}
                </div>
            </div>
        </div>
      </DetailModal>

      {/* AI Planning Modal */}
      <DetailModal isOpen={modalMode === 'AI_PLAN_MODAL'} onClose={() => setModalMode(null)} title="AI 업무 제안" themeColor="purple">
        <div className="space-y-4 p-6">
          <div className="bg-purple-500/10 p-4 rounded-xl border border-purple-500/20 mb-4"><h4 className="font-bold text-purple-300 mb-1 flex items-center gap-2"><Sparkles size={16}/> AI의 제안</h4><p className="text-sm text-slate-400">프로젝트 "{selectedItem?.title}"의 성공을 위한 추천 업무 리스트입니다.<br/>필요한 항목을 선택해 프로젝트에 추가하세요.</p></div>
          <div className="space-y-3 max-h-[50vh] overflow-y-auto custom-scrollbar">
           {aiSuggestions.map((item, idx) => (
              <div key={idx} onClick={() => setSelectedSuggestions(prev => ({...prev, [idx]: !prev[idx]}))} className={`p-4 rounded-xl border transition-all cursor-pointer flex items-start gap-3 group ${selectedSuggestions[idx] ? 'bg-purple-500/10 border-purple-500/50 ring-1 ring-purple-500/30' : 'bg-slate-800/50 border-white/5 hover:bg-white/5'}`}>
                <div className={`mt-1 w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${selectedSuggestions[idx] ? 'bg-purple-500 border-purple-500' : 'border-slate-500 group-hover:border-slate-400'}`}>{selectedSuggestions[idx] && <Check size={14} className="text-white"/>}</div>
                <div className="flex-1"><div className="flex items-center gap-2 mb-1"><span className="font-bold text-slate-200">{item.title}</span><PriorityBadge priority={item.priority} /></div><p className="text-xs text-slate-400 leading-relaxed"><span className="text-purple-400 font-bold mr-1">[GUIDE]</span>{item.description}</p></div>
              </div>
            ))}
          </div>
          <button onClick={handleConfirmAiTasks} disabled={isSaving} className="w-full py-4 bg-purple-600 hover:bg-purple-500 text-white font-bold rounded-2xl shadow-lg shadow-purple-900/20 transition-all flex justify-center items-center gap-2 disabled:opacity-50">{isSaving ? <Loader2 className="animate-spin" size={20}/> : <Plus size={20}/>} 선택한 업무 추가하기</button>
        </div>
      </DetailModal>

      {/* 🌟🌟 [NEW] UPDATED TASK DETAIL MODAL with 3-Columns & Diagnostics 🌟🌟 */}
      <DetailModal isOpen={modalMode === 'TASK_DETAIL' && selectedItem} onClose={() => setModalMode(null)} title={selectedItem?.title} themeColor="indigo" size="large">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-0 h-full">
            
            {/* 1. Left Column: Dashboard & Stats (lg:col-span-3) */}
            <div className="lg:col-span-3 bg-slate-900/50 border-r border-white/5 p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 h-full">
                {selectedItem && (() => {
                    const health = getTaskHealthLive(selectedItem, taskSubTasks);
                    return (
                        <div className={`p-5 rounded-2xl border-2 flex flex-col gap-4 ${health?.bg || 'bg-slate-800/50 border-white/10'}`}>
                             <div className="flex items-center gap-3">
                                 <div className={`p-2 rounded-full bg-white/10 ${health?.color || 'text-slate-400'}`}><Activity size={24}/></div>
                                 <div><h4 className={`text-base font-extrabold ${health?.color || 'text-slate-300'}`}>업무 진단</h4></div>
                             </div>
                             <p className="text-sm text-slate-200 font-medium leading-relaxed">{health?.message || "진단 정보가 없습니다."}</p>
                             
                             {health && (
                                 <>
                                 <div className="relative h-4 bg-slate-900/50 rounded-full overflow-hidden border border-white/10 shadow-inner mt-2"> 
                                    <div className={`absolute top-0 left-0 h-full shadow-lg transition-all duration-1000 ${health.progress === 100 ? 'bg-emerald-500' : 'bg-gradient-to-r from-indigo-600 to-purple-400'}`} style={{ width: `${health.progress}%` }}></div>
                                    <div className="absolute top-0 bottom-0 w-0.5 bg-red-500 z-10" style={{ left: `${health.timePercent}%` }}></div>
                                 </div>
                                 <div className="flex justify-between text-[10px] font-bold text-slate-400"><span>진행: {health.progress}%</span><span>시간: {Math.round(health.timePercent)}%</span></div>
                                 </>
                             )}
                       </div>
                    );
                })()}

                <div className="flex items-center gap-4 p-4 bg-slate-800/50 rounded-2xl border border-white/5">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${selectedItem?.status === 'Done' ? 'bg-emerald-500' : 'bg-indigo-500'}`}>
                        {getTaskProgress(selectedItem)}%
                    </div>
                    <div>
                        <p className="text-xs text-slate-500 font-bold mb-1 uppercase">Current Status</p>
                        <div onClick={() => requestToggleTask(selectedItem)} className={`text-lg font-bold cursor-pointer hover:underline ${selectedItem?.status === 'Done' ? 'text-emerald-400' : 'text-indigo-400'}`}>
                            {selectedItem?.status}
                        </div>
                    </div>
                </div>

                {/* Subtask Stats Box */}
                <div className="p-4 bg-slate-800/50 rounded-2xl border border-white/5 space-y-3">
                   <h4 className="text-xs font-bold text-slate-400 uppercase flex items-center gap-2"><List size={14}/> 세부 항목 현황</h4>
                   <div className="flex gap-2 text-center">
                      <div className="flex-1 bg-white/5 p-2 rounded-xl"><div className="text-lg font-bold text-white">{taskSubTasks.length}</div><div className="text-[10px] text-slate-500">Total</div></div>
                      <div className="flex-1 bg-emerald-500/10 p-2 rounded-xl"><div className="text-lg font-bold text-emerald-400">{taskSubTasks.filter(t => t.done).length}</div><div className="text-[10px] text-emerald-500/50">Done</div></div>
                      <div className="flex-1 bg-amber-500/10 p-2 rounded-xl"><div className="text-lg font-bold text-amber-400">{taskSubTasks.filter(t => !t.done).length}</div><div className="text-[10px] text-amber-500/50">To Do</div></div>
                   </div>
                </div>

                <div className="space-y-4">
                    <div className="p-4 bg-slate-800/30 rounded-xl border border-white/5 space-y-3">
                        <div className="flex items-center gap-3"><Clock size={16} className="text-slate-500"/><div className="flex-1"><p className="text-[10px] text-slate-500 font-bold uppercase">마감일 (Due Date)</p><p className="text-sm text-slate-300 font-bold">{selectedItem?.dueDate || "미설정"}</p></div></div>
                        <div className="flex items-center gap-3"><Flag size={16} className="text-slate-500"/><div className="flex-1"><p className="text-[10px] text-slate-500 font-bold uppercase">우선순위</p><div className="mt-1"><PriorityBadge priority={selectedItem?.priority}/></div></div></div>
                        <div className="flex items-center gap-3"><Briefcase size={16} className="text-slate-500"/><div className="flex-1"><p className="text-[10px] text-slate-500 font-bold uppercase">Context</p><span className={`text-xs font-bold px-2 py-0.5 rounded-full ${selectedItem?.context === 'WORK' ? 'bg-indigo-500/20 text-indigo-300' : 'bg-orange-500/20 text-orange-300'}`}>{selectedItem?.context}</span></div></div>
                        {getProjectName(selectedItem?.projectId) && (
                            <div className="flex items-center gap-3"><Layout size={16} className="text-slate-500"/><div className="flex-1"><p className="text-[10px] text-slate-500 font-bold uppercase">연결된 프로젝트</p><p className="text-sm text-indigo-400 font-bold truncate">{getProjectName(selectedItem?.projectId)}</p></div></div>
                        )}
                    </div>
                    <div className="mt-auto pt-4 border-t border-white/5">
                        <div className="flex gap-2"><button onClick={() => openEditTaskModal(null, selectedItem)} className="flex-1 bg-slate-800 text-blue-400 font-bold rounded-xl hover:bg-slate-700 py-3 flex justify-center items-center gap-2 transition-colors border border-slate-700 text-sm"><Edit2 size={16}/> 수정</button><button onClick={(e) => requestDeleteTask(e, selectedItem)} className="flex-1 bg-slate-800 text-red-400 font-bold rounded-xl hover:bg-slate-700 py-3 flex justify-center items-center gap-2 transition-colors border border-slate-700 text-sm"><Trash2 size={16}/> 삭제</button></div>
                    </div>
                </div>
            </div>

            {/* 2. Middle Column: Guide & Checklist (lg:col-span-5) */}
            <div className="lg:col-span-5 bg-[#0f172a] p-6 overflow-y-auto custom-scrollbar flex flex-col gap-6 h-full border-r border-white/5 relative">
                {/* Description / Guide Area */}
                <div className="space-y-2">
                     {/* 헤더를 flex와 justify-between으로 변경하여 버튼 배치 공간 확보 */}
                     <div className="flex items-center justify-between">
                        <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2"><FileText size={16}/> 상세 가이드 (Guide)</h4>
                        
                        {/* 연결된 프로젝트가 있을 경우 마인드 맵 버튼 표시 */}
                        {selectedItem?.projectId && (
                            <button 
                                onClick={() => {
                                    const parentProject = projects.find(p => p.id === selectedItem.projectId);
                                    if(parentProject) handleOpenMindMap(parentProject);
                                    else showToast("연결된 프로젝트 정보를 찾을 수 없습니다.");
                                }}
                                className="text-xs font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 bg-indigo-500/10 px-2 py-1 rounded transition-colors"
                            >
                                <Network size={12}/> 프로젝트 Map
                            </button>
                        )}
                     </div>

                     <div className="p-4 bg-slate-800/30 rounded-xl border border-white/5 min-h-[120px] text-sm text-slate-300 leading-relaxed whitespace-pre-wrap">
                        {selectedItem?.description || "등록된 상세 가이드가 없습니다."}
                     </div>
                </div>

                {/* SubTasks Checklist */}
                <div className="flex-1 min-h-0 flex flex-col">
                    <div className="flex items-center justify-between mb-3">
                        <h4 className="text-sm font-bold text-slate-300 flex items-center gap-2"><List size={16}/> 체크리스트 ({taskSubTasks.filter(t=>t.done).length}/{taskSubTasks.length})</h4>
                    </div>
                    
                    <div className="space-y-2 mb-4 overflow-y-auto custom-scrollbar pr-1 flex-1 min-h-[200px]">
                       {taskSubTasks.length === 0 ? 
                       <div className="h-20 flex items-center justify-center text-slate-600 text-xs border border-dashed border-slate-800 rounded-xl">체크리스트가 없습니다. 아래에서 추가하세요.</div> :
                       taskSubTasks.map((sub, idx) => (
                            <div key={idx} className="flex items-center gap-3 p-3 bg-slate-800/30 rounded-xl border border-white/5 group hover:bg-slate-800/50 transition-colors">
                                <button onClick={() => handleToggleTaskSubTask(idx)} className={`p-1 rounded-lg transition-colors ${sub.done ? 'text-emerald-400' : 'text-slate-600 hover:text-slate-400'}`}>
                                    {sub.done ? <CheckSquare size={20}/> : <Square size={20}/>}
                                </button>
                                <span className={`flex-1 text-sm transition-all ${sub.done ? 'text-slate-500 line-through' : 'text-slate-200'}`}>{sub.title}</span>
                                <button onClick={() => handleDeleteTaskSubTask(idx)} className="text-slate-600 hover:text-red-400 opacity-0 group-hover:opacity-100 transition-opacity"><Trash2 size={16}/></button>
                            </div>
                        ))}
                     </div>

                    <div className="flex gap-2 mt-auto pt-4 border-t border-white/5 sticky bottom-0 bg-[#0f172a]">
                        <input type="text" value={newTaskSubTaskTitle} onChange={(e) => setNewTaskSubTaskTitle(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && handleAddTaskSubTask()} placeholder="새 항목 추가..." className="flex-1 p-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-indigo-500 text-sm text-slate-200 outline-none"/>
                        <button onClick={handleAddTaskSubTask} disabled={!newTaskSubTaskTitle.trim()} className="px-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl disabled:opacity-50 transition-colors"><Plus size={20}/></button>
                    </div>
                </div>
            </div>

            {/* 3. Right Column: Resources & Notes (lg:col-span-4) */}
            <div className="lg:col-span-4 bg-slate-900/50 border-l border-white/5 p-6 flex flex-col h-full gap-4">
                 {/* Resources Section */}
                <div className={`flex flex-col min-h-0 transition-all duration-300 ${isResourceOpen ? 'flex-1' : 'shrink-0'}`}>
                    <div className="flex items-center justify-between mb-2 p-2 rounded-xl bg-slate-800/30 border border-white/5">
                        <div onClick={() => setIsResourceOpen(!isResourceOpen)} className="flex-1 flex items-center gap-2 cursor-pointer">
                            <Link size={16} className="text-blue-400"/> 
                              <h4 className="text-sm font-bold text-slate-200">자료실</h4>
                            <span className="text-xs bg-blue-500/20 text-blue-300 px-2 py-0.5 rounded-full">{taskResources.length}</span>
                        </div>
                         <div className="flex items-center gap-2">
                            <button onClick={() => setIsResourceInputModalOpen(true)} className="p-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg transition-colors"><Plus size={14}/></button>
                            <button onClick={() => setIsResourceOpen(!isResourceOpen)} className="text-slate-500 hover:text-slate-300 transition-colors">{isResourceOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</button>
                        </div>
                    </div>
                    {isResourceOpen && (
                        <div className="flex-1 bg-slate-800/30 rounded-xl border border-white/5 p-3 overflow-y-auto custom-scrollbar space-y-2 animate-fadeIn min-h-0">
                            {taskResources.length === 0 ?
                                <div className="h-full flex flex-col items-center justify-center text-slate-600 gap-2"><FilePlus size={24} className="opacity-50"/><p className="text-xs">등록된 자료가 없습니다.</p></div> : 
                                taskResources.map((res, idx) => (
                                    <div key={idx} className="flex items-center gap-3 p-3 bg-white/5 rounded-lg border border-transparent hover:border-white/10 group">
                                       <div className="p-2 bg-slate-700 rounded-lg text-slate-300"><ExternalLink size={14}/></div>
                                      <div className="flex-1 min-w-0 cursor-pointer" onClick={() => window.open(res.link, '_blank')}>
                                            <p className="text-sm font-bold text-slate-200 hover:text-blue-400 truncate">{res.name}</p>
                                            <p className="text-[10px] text-slate-500 truncate">{res.link}</p>
                                      </div>
                                       <button onClick={() => handleDeleteResource(idx)} className="opacity-0 group-hover:opacity-100 p-1.5 hover:bg-red-500/20 text-slate-500 hover:text-red-400 rounded-lg transition-all"><Trash2 size={14}/></button>
                                    </div>
                                ))
                            }
                        </div>
                    )}
                </div>
                 {/* Note Section */}
                <div className={`flex flex-col min-h-0 transition-all duration-300 ${isNoteOpen ? 'flex-1' : 'shrink-0'}`}>
                    <div onClick={() => setIsNoteOpen(!isNoteOpen)} className="flex items-center justify-between cursor-pointer p-2 rounded-xl bg-slate-800/30 border border-white/5 mb-2 hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-2">
                            <StickyNote size={16} className="text-amber-400"/> 
                              <h4 className="text-sm font-bold text-slate-200">메모</h4>
                        </div>
                        <div className="text-slate-500">{isNoteOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}</div>
                    </div>
                    {isNoteOpen && (
                        <div className="flex-1 relative animate-fadeIn min-h-0">
                            <textarea value={taskNote} onChange={(e) => setTaskNote(e.target.value)} className="w-full h-full p-4 bg-yellow-50/5 text-slate-200 border border-white/10 rounded-xl resize-none focus:outline-none focus:border-amber-500/50 focus:bg-slate-800 transition-colors leading-relaxed custom-scrollbar" placeholder="자유롭게 메모하세요." spellCheck="false" />
                            <button onClick={handleSaveNote} className="absolute bottom-4 right-4 p-3 bg-amber-600 hover:bg-amber-500 text-white rounded-full shadow-lg hover:scale-110 transition-all" title="메모 저장"><Save size={18}/></button>
                        </div>
                      )}
                </div>
            </div>
        </div>
      </DetailModal>

      {/* Task Create/Edit Modal */}
      <DetailModal isOpen={modalMode === 'CREATE_TASK' || modalMode === 'EDIT_TASK'} onClose={handleCloseEditTask} title={modalMode === 'EDIT_TASK' ? "할 일 수정" : "새로운 할 일"} themeColor="indigo">
        <div className="space-y-6 p-6">
          <div>
            <label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Category</label>
            <div className="flex gap-2">
              <button onClick={() => setContext('WORK')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border-2 ${context === 'WORK' ? 'border-indigo-500 bg-indigo-500/20 text-indigo-300' : 'border-slate-700 bg-slate-800 text-slate-500'}`}>Work</button>
              <button onClick={() => setContext('LIFE')} className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all border-2 ${context === 'LIFE' ? 'border-orange-500 bg-orange-500/20 text-orange-300' : 'border-slate-700 bg-slate-800 text-slate-500'}`}>Life</button>
            </div>
          </div>
          {context === 'WORK' && (<div><label className="block text-xs font-bold text-slate-500 mb-2 uppercase">연관 프로젝트</label><select value={selectedProjectId} onChange={(e) => setSelectedProjectId(e.target.value)} className="w-full p-4 rounded-xl bg-slate-800 border-2 border-slate-700 focus:border-indigo-500 outline-none font-medium text-slate-200 appearance-none"><option value="">(연결 안 함)</option>{projects.map(p => <option key={p.id} value={p.id}>{p.title}</option>)}</select></div>)}
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-xs font-bold text-slate-500 mb-2 uppercase">마감일</label><input type="date" value={taskDueDate} onChange={(e) => setTaskDueDate(e.target.value)} className="w-full p-4 rounded-xl bg-slate-800 border-2 border-slate-700 focus:border-indigo-500 outline-none font-medium text-slate-200" /></div>
            <div><label className="block text-xs font-bold text-slate-500 mb-2 uppercase">중요도</label><select value={taskPriority} onChange={(e) => setTaskPriority(e.target.value)} className="w-full p-4 rounded-xl bg-slate-800 border-2 border-slate-700 focus:border-indigo-500 outline-none font-medium text-slate-200"><option value="High">🔴 긴급 (High)</option><option value="Review">🟣 검토 (Review)</option><option value="Medium">🔵 보통 (Medium)</option><option value="Hold">🟠 보류 (Hold)</option><option value="Low">⚪ 낮음 (Low)</option></select></div>
          </div>
          <div><label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Task Name</label><div className="flex gap-2"><input type="text" value={newTaskTitle} onChange={(e) => setNewTaskTitle(e.target.value)} placeholder="할 일 입력" className="flex-1 p-4 rounded-xl bg-slate-800 border-2 border-slate-700 focus:border-indigo-500 focus:bg-slate-700 transition-colors outline-none font-medium text-slate-200" autoFocus /><VoiceButton onSpeech={(text) => setNewTaskTitle(text)} /></div></div>
          {/* Guide Input Area */}
          <div><label className="block text-xs font-bold text-slate-500 mb-2 uppercase">Detailed Guide</label><textarea value={newTaskGuide} onChange={(e) => setNewTaskGuide(e.target.value)} placeholder="업무 실행 방법, 참고 사항 등 상세 내용을 입력하세요." className="w-full p-4 h-24 rounded-xl bg-slate-800 border-2 border-slate-700 focus:border-indigo-500 focus:bg-slate-700 transition-colors outline-none font-medium text-slate-200 resize-none leading-relaxed" /></div>
          
          <div className="flex gap-2">
            {modalMode === 'EDIT_TASK' && (
              <button onClick={(e) => requestDeleteTask(e, selectedItem)} className="p-4 bg-red-600/20 text-red-500 border border-red-500/50 font-bold rounded-2xl hover:bg-red-600 hover:text-white flex justify-center items-center transition-all"><Trash2 size={20}/></button>
            )}
            <button onClick={handleSaveTask} disabled={isSaving} className="flex-1 py-4 bg-indigo-600 text-white font-bold rounded-2xl hover:bg-indigo-700 flex justify-center items-center gap-2 disabled:opacity-50">{isSaving ? <Loader2 className="animate-spin" size={20}/> : <Save size={20}/>} {modalMode === 'EDIT_TASK' ? "수정 완료" : "저장하기"}</button>
          </div>
        </div>
      </DetailModal>
      
      {/* Email Draft Modal */}
      <DetailModal isOpen={modalMode === 'DRAFT_EMAIL'} onClose={() => setModalMode(null)} title="AI 이메일 작성" themeColor="amber"><div className="space-y-6 p-6"><div><label className="block text-xs font-bold text-slate-500 mb-2 uppercase">받는 사람</label><input type="email" value={emailRecipient} onChange={(e) => setEmailRecipient(e.target.value)} placeholder="example@email.com" className="w-full p-4 rounded-xl bg-slate-800 border-2 border-slate-700 focus:border-amber-500 focus:bg-slate-700 text-slate-200" /></div><div><label className="block text-xs font-bold text-slate-500 mb-2 uppercase">요청 사항</label><div className="flex gap-2 h-32"><textarea value={emailTopic} onChange={(e) => setEmailTopic(e.target.value)} placeholder="요청 사항 입력" className="flex-1 p-4 rounded-xl bg-slate-800 border-2 border-slate-700 focus:border-amber-500 focus:bg-slate-700 text-slate-200 resize-none" autoFocus /><div className="h-full"><VoiceButton onSpeech={(text) => setEmailTopic(prev => prev + " " + text)} /></div></div></div><button onClick={handleDraftEmail} disabled={isSaving} className="w-full py-4 bg-amber-600 text-white font-bold rounded-2xl hover:bg-amber-700 flex justify-center items-center gap-2 disabled:opacity-50">{isSaving ? <Loader2 className="animate-spin" size={20}/> : <Send size={20}/>} 초안 생성하기</button></div></DetailModal>
      
      {/* ✨ [MODIFIED] Report Modal View with Markdown Customization ✨ */}
      <DetailModal isOpen={modalMode === 'REPORT_DETAIL' && selectedItem} onClose={() => setModalMode(null)} title={`AI 브리핑 (${selectedItem?.date || 'Today'})`} themeColor="purple" onCopy={() => navigator.clipboard.writeText(selectedItem?.content || "")} onSendEmail={handleSendReportEmail} isSending={isSendingReport}>
          <div className="p-8 h-full overflow-y-auto custom-scrollbar">
            <ReactMarkdown
              components={{
                h1: ({node, ...props}) => <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400 mt-6 mb-4 pb-2 border-b border-white/10" {...props} />,
                h2: ({node, ...props}) => <h2 className="text-2xl font-bold text-indigo-300 mt-8 mb-4 flex items-center gap-2" {...props} />,
                h3: ({node, ...props}) => <h3 className="text-xl font-bold text-purple-300 mt-6 mb-3" {...props} />,
                strong: ({node, ...props}) => <strong className="text-amber-400 font-black" {...props} />,
                p: ({node, ...props}) => <p className="mb-4 text-lg leading-loose text-slate-300" {...props} />,
                ul: ({node, ...props}) => <ul className="list-disc pl-6 space-y-2 mb-6 text-slate-300" {...props} />,
                ol: ({node, ...props}) => <ol className="list-decimal pl-6 space-y-2 mb-6 text-slate-300" {...props} />,
                li: ({node, ...props}) => <li className="pl-1 marker:text-slate-500 leading-loose" {...props} />,
                blockquote: ({node, ...props}) => <blockquote className="border-l-4 border-purple-500 pl-4 py-1 my-4 text-slate-400 italic bg-purple-500/10 rounded-r-lg" {...props} />,
              }}
            >
              {(selectedItem?.content || "").replace(/<br\s*\/?>/gi, '\n')}
            </ReactMarkdown>
          </div>
      </DetailModal>

      {/* Stats Dashboard Modal */}
      <DetailModal isOpen={modalMode === 'STATS'} onClose={() => setModalMode(null)} title="업무 현황 분석" themeColor="indigo" size="large">
        {data ? <StatsView projects={data.projects} tasks={data.tasks} refLinks={refLinks} emailAnalysisList={emailAnalysisList} /> : <div className="p-10 flex justify-center"><Loader2 className="animate-spin text-indigo-500"/></div>}
      </DetailModal>
      
      {/* 🌟 New Link Manager Modal */}
      <DetailModal isOpen={modalMode === 'LINK_MANAGER'} onClose={() => { setModalMode(null); handleCancelEdit(); }} title="자료/링크 관리" themeColor="emerald" size="large">
          <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
            {/* Left: Input Form */}
            <div className="lg:col-span-4 bg-slate-900/50 p-6 border-r border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-2">
                     {editingLinkId ? <Edit2 size={16} className="text-emerald-400"/> : <Plus size={16}/>} 
                      {editingLinkId ? "자료 정보 수정" : "새 자료 등록"}
                    </h4>
                    {editingLinkId && <button onClick={handleCancelEdit} className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1"><ResetIcon size={12}/> 취소</button>}
                </div>
                
                <div className="flex gap-2 p-1 bg-slate-800 rounded-xl border border-slate-700 mb-4">
                   <button onClick={() => setLinkCountry('KR')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${linkCountry === 'KR' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>🇰🇷 KR</button>
                   <button onClick={() => setLinkCountry('VN')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${linkCountry === 'VN' ? 'bg-red-600 text-white' : 'text-slate-400'}`}>🇻🇳 VN</button>
                </div>
                
                <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1">관련 부서</label>
                   <select value={linkDept} onChange={(e) => setLinkDept(e.target.value)} className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-emerald-500 text-sm text-slate-200 outline-none">
                      {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                   </select>
                </div>
                
                <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1">자료/링크 명</label>
                   <input type="text" value={linkName} onChange={(e) => setLinkName(e.target.value)} className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-emerald-500 text-sm text-slate-200 outline-none" placeholder="예: 2024년 생산 계획서"/>
                </div>

                <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1">링크 주소 (URL)</label>
                   <input type="text" value={linkUrl} onChange={(e) => setLinkUrl(e.target.value)} className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-emerald-500 text-sm text-slate-200 outline-none" placeholder="https://..."/>
                </div>

                 <div>
                    <label className="block text-xs font-bold text-slate-500 mb-1">설명 (선택)</label>
                   <textarea value={linkDesc} onChange={(e) => setLinkDesc(e.target.value)} className="w-full p-3 h-20 rounded-xl bg-slate-800 border border-slate-700 focus:border-emerald-500 text-sm text-slate-200 outline-none resize-none" placeholder="간단한 설명..."/>
                </div>

                <button onClick={handleSaveLink} disabled={isSaving} className="w-full py-3 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-xl transition-colors flex justify-center items-center gap-2">
                   {isSaving ? <Loader2 size={16} className="animate-spin"/> : (editingLinkId ? <Edit2 size={16}/> : <Save size={16}/>)} 
                   {editingLinkId ? "수정 저장" : "등록하기"}
                </button>
            </div>

            {/* Right: List View */}
            <div className="lg:col-span-8 p-6 bg-[#0f172a] flex flex-col h-full overflow-hidden">
                <div className="shrink-0 mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-slate-200 flex items-center gap-2"><List size={16}/> 자료 목록 <CountBadge count={filteredRefLinks.length} color="emerald"/></h4>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16}/>
                        <input type="text" value={linkSearchTerm} onChange={(e) => setLinkSearchTerm(e.target.value)} placeholder="자료명, 부서, 설명, 국가 검색..." className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/60 border border-white/5 focus:outline-none focus:border-emerald-500/50 text-sm text-slate-200 placeholder-slate-500"/>
                        {linkSearchTerm && <button onClick={() => setLinkSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"><X size={14}/></button>}
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pb-2">
                   {filteredRefLinks.length === 0 ? <div className="text-center text-slate-500 py-10">{linkSearchTerm ? "검색 결과가 없습니다." : "등록된 자료가 없습니다."}</div> : 
                    filteredRefLinks.map((link) => {
                       const isKR = link.country === 'KR';
                       return (
                           <div key={link.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all group ${editingLinkId === link.id ? 'bg-emerald-500/10 border-emerald-500/50 ring-1 ring-emerald-500/30' : 'bg-slate-800/40 border-white/5 hover:bg-slate-800/60'} border-l-4 ${isKR ? 'border-l-blue-500' : 'border-l-red-500'}`}>
                               <div className="flex flex-col items-center w-8 shrink-0">
                                   <span className="text-lg">{isKR ? '🇰🇷' : '🇻🇳'}</span>
                                   <span className={`text-[10px] font-bold ${isKR ? 'text-blue-400' : 'text-red-400'}`}>{isKR ? 'KR' : 'VN'}</span>
                               </div>
                               <span className="text-xs font-bold text-slate-500 w-16 truncate">{link.department}</span>
                               <div className="flex-1 min-w-0">
                                   <a href={link.url} target="_blank" rel="noreferrer" className={`text-sm font-bold hover:underline truncate block flex items-center gap-1 ${isKR ? 'text-blue-300 hover:text-blue-200' : 'text-red-300 hover:text-red-200'}`}>
                                       <ExternalLink size={12}/> {link.name}
                                   </a>
                                   {link.description && <p className="text-xs text-slate-400 truncate mt-0.5">{link.description}</p>}
                               </div>
                               <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <button onClick={() => handleEditLink(link)} className="p-2 text-slate-500 hover:text-white bg-slate-700/50 hover:bg-slate-600 rounded-lg transition-colors"><Edit2 size={14}/></button>
                                   <button onClick={() => handleDeleteLink(link.id)} className="p-2 text-slate-500 hover:text-red-400 bg-slate-700/50 hover:bg-slate-600 rounded-lg transition-colors"><Trash2 size={14}/></button>
                               </div>
                           </div>
                        );
                    })
                   }
                </div>
            </div>
          </div>
      </DetailModal>

      {/* 🌟 New EMAIL ANALYSIS Modal */}
      <DetailModal isOpen={modalMode === 'EMAIL_ANALYSIS'} onClose={() => { setModalMode(null); handleCancelEmailEdit(); }} title="e-mail 분석 관리" themeColor="pink" size="large">
          <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
            {/* Left: Input Form */}
            <div className="lg:col-span-4 bg-slate-900/50 p-6 border-r border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-2">
                     {editingEmailId ? <Edit2 size={16} className="text-pink-400"/> : <Plus size={16}/>} 
                      {editingEmailId ? "분석 내용 수정" : "새 분석 추가"}
                    </h4>
                    {editingEmailId && <button onClick={handleCancelEmailEdit} className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1"><ResetIcon size={12}/> 취소</button>}
                </div>
                
                <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1">구분</label>
                   <select value={emailCategory} onChange={(e) => setEmailCategory(e.target.value)} className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-pink-500 text-sm text-slate-200 outline-none">
                      {EMAIL_CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                </div>
                
                <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1">제목</label>
                   <input type="text" value={emailTitle} onChange={(e) => setEmailTitle(e.target.value)} className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-pink-500 text-sm text-slate-200 outline-none" placeholder="제목 입력..."/>
                </div>

                <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1">링크 주소 (URL)</label>
                   <input type="text" value={emailUrl} onChange={(e) => setEmailUrl(e.target.value)} className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-pink-500 text-sm text-slate-200 outline-none" placeholder="https://..."/>
                </div>

                <div className="pt-2 text-xs text-slate-500">
                    * 업데이트 일자는 저장 시 자동으로 기록됩니다.
                </div>

                <button onClick={handleSaveEmail} disabled={isSaving} className="w-full py-3 bg-pink-600 hover:bg-pink-500 text-white font-bold rounded-xl transition-colors flex justify-center items-center gap-2">
                   {isSaving ? <Loader2 size={16} className="animate-spin"/> : (editingEmailId ? <Edit2 size={16}/> : <Save size={16}/>)} 
                   {editingEmailId ? "수정 저장" : "등록하기"}
                </button>
            </div>

            {/* Right: List View (Custom One-line Card) */}
            <div className="lg:col-span-8 p-6 bg-[#0f172a] flex flex-col h-full overflow-hidden">
                <div className="shrink-0 mb-4">
                     <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-slate-200 flex items-center gap-2"><Mail size={16}/> 분석 목록 <CountBadge count={filteredEmailList.length} color="pink"/></h4>
                    </div>
                    {/* 🌟 New Search Bar for Email Analysis */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16}/>
                        <input type="text" value={emailSearchTerm} onChange={(e) => setEmailSearchTerm(e.target.value)} placeholder="제목, 카테고리 검색..." className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/60 border border-white/5 focus:outline-none focus:border-pink-500/50 text-sm text-slate-200 placeholder-slate-500"/>
                        {emailSearchTerm && <button onClick={() => setEmailSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"><X size={14}/></button>}
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pb-2">
                   {filteredEmailList.length === 0 ? <div className="text-center text-slate-500 py-10">{emailSearchTerm ? "검색 결과가 없습니다." : "등록된 분석 내역이 없습니다."}</div> : 
                    filteredEmailList.map((item) => (
                        <div key={item.id} className={`flex items-center justify-between gap-4 p-4 rounded-xl border transition-all group ${editingEmailId === item.id ? 'bg-pink-500/10 border-pink-500/50 ring-1 ring-pink-500/30' : 'bg-slate-800/40 border-white/5 hover:bg-slate-800/60'}`}>
                            {/* Left: Category */}
                            <div className="w-24 shrink-0">
                                <span className={`text-xs font-bold px-2 py-1 rounded-md ${item.category === '특정 이슈' ? 'bg-red-500/20 text-red-300' : item.category === '품질 이슈' ? 'bg-orange-500/20 text-orange-300' : 'bg-slate-600/30 text-slate-400'}`}>{item.category}</span>
                             </div>

                            {/* Center: Title (Clickable) */}
                            <div className="flex-1 text-center min-w-0">
                                <a href={item.url} target="_blank" rel="noreferrer" className="text-base font-extrabold text-slate-200 hover:text-pink-400 hover:underline truncate block transition-colors">
                                    {item.title}
                                </a>
                            </div>

                            {/* Right: Date */}
                            <div className="w-24 shrink-0 text-right">
                                 <span className="text-sm font-bold text-slate-400">{item.updateDate}</span>
                            </div>

                            {/* Far Right: Actions */}
                            <div className="flex items-center gap-1 w-16 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                                <button onClick={() => handleEditEmail(item)} className="p-2 text-slate-500 hover:text-white bg-slate-700/50 hover:bg-slate-600 rounded-lg transition-colors"><Edit2 size={14}/></button>
                                <button onClick={() => handleDeleteEmail(item.id)} className="p-2 text-slate-500 hover:text-red-400 bg-slate-700/50 hover:bg-slate-600 rounded-lg transition-colors"><Trash2 size={14}/></button>
                            </div>
                        </div>
                    ))
                   }
               </div>
            </div>
          </div>
      </DetailModal>

      <DetailModal isOpen={modalMode === 'BOOKMARK_MANAGER'} onClose={() => { setModalMode(null); handleCancelBmEdit(); }} title="북마크 관리" themeColor="yellow" size="large">
          <div className="grid grid-cols-1 lg:grid-cols-12 h-full">
            {/* Left: Input Form */}
            <div className="lg:col-span-4 bg-slate-900/50 p-6 border-r border-white/5 space-y-4">
                <div className="flex items-center justify-between">
                    <h4 className="font-bold text-slate-200 mb-2 flex items-center gap-2">
                      {editingBmId ? <Edit2 size={16} className="text-yellow-400"/> : <Plus size={16}/>} 
                      {editingBmId ? "북마크 수정" : "새 북마크 추가"}
                    </h4>
                    {editingBmId && <button onClick={handleCancelBmEdit} className="text-xs text-red-400 hover:text-red-300 font-bold flex items-center gap-1"><ResetIcon size={12}/> 취소</button>}
                </div>
                
                {/* 1. 업무/개인 선택 (KR/VN 대신) */}
                <div className="flex gap-2 p-1 bg-slate-800 rounded-xl border border-slate-700 mb-4">
                   <button onClick={() => setBmContext('WORK')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${bmContext === 'WORK' ? 'bg-indigo-600 text-white' : 'text-slate-400'}`}>🏢 업무 (Work)</button>
                   <button onClick={() => setBmContext('LIFE')} className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all ${bmContext === 'LIFE' ? 'bg-orange-600 text-white' : 'text-slate-400'}`}>🏠 개인 (Life)</button>
                </div>
                
                {/* 2. 구분(Category) 콤보박스 + 추가/삭제 기능 */}
                <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1">구분 (Category)</label>
                   <div className="flex gap-2">
                       <div className="relative flex-1">
                           <select value={bmCategory} onChange={(e) => setBmCategory(e.target.value)} className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-yellow-500 text-sm text-slate-200 outline-none appearance-none">
                              {bmCategories.length === 0 && <option value="">구분 없음</option>}
                              {bmCategories.map(c => <option key={c} value={c}>{c}</option>)}
                           </select>
                           <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 pointer-events-none"/>
                       </div>
                       <button onClick={handleAddBmCategory} className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-white hover:border-slate-500" title="구분 추가"><Plus size={16}/></button>
                       <button onClick={handleDeleteBmCategory} className="p-3 bg-slate-800 border border-slate-700 rounded-xl text-slate-400 hover:text-red-400 hover:border-red-500" title="현재 구분 삭제"><Trash2 size={16}/></button>
                   </div>
                </div>
                
                {/* 3. 제목 & URL & 설명 */}
                <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1">사이트 명</label>
                   <input type="text" value={bmTitle} onChange={(e) => setBmTitle(e.target.value)} className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-yellow-500 text-sm text-slate-200 outline-none" placeholder="예: 디자인 레퍼런스 사이트"/>
                </div>

                <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1">링크 주소 (URL)</label>
                   <input type="text" value={bmUrl} onChange={(e) => setBmUrl(e.target.value)} className="w-full p-3 rounded-xl bg-slate-800 border border-slate-700 focus:border-yellow-500 text-sm text-slate-200 outline-none" placeholder="https://..."/>
                </div>

                <div>
                   <label className="block text-xs font-bold text-slate-500 mb-1">설명 (메모)</label>
                   <textarea value={bmDesc} onChange={(e) => setBmDesc(e.target.value)} className="w-full p-3 h-20 rounded-xl bg-slate-800 border border-slate-700 focus:border-yellow-500 text-sm text-slate-200 outline-none resize-none" placeholder="간단한 설명..."/>
                </div>

                <button onClick={handleSaveBookmark} disabled={isSaving} className="w-full py-3 bg-yellow-600 hover:bg-yellow-500 text-white font-bold rounded-xl transition-colors flex justify-center items-center gap-2">
                   {isSaving ? <Loader2 size={16} className="animate-spin"/> : (editingBmId ? <Edit2 size={16}/> : <Save size={16}/>)} 
                   {editingBmId ? "수정 저장" : "북마크 등록"}
                </button>
            </div>

            {/* Right: List View */}
            <div className="lg:col-span-8 p-6 bg-[#0f172a] flex flex-col h-full overflow-hidden">
                <div className="shrink-0 mb-4">
                    <div className="flex items-center justify-between mb-2">
                        <h4 className="font-bold text-slate-200 flex items-center gap-2"><Star size={16}/> 북마크 목록 <CountBadge count={filteredBookmarks.length} color="yellow"/></h4>
                    </div>
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={16}/>
                        <input type="text" value={bmSearchTerm} onChange={(e) => setBmSearchTerm(e.target.value)} placeholder="사이트명, 구분, 설명 검색..." className="w-full pl-10 pr-4 py-3 rounded-xl bg-slate-800/60 border border-white/5 focus:outline-none focus:border-yellow-500/50 text-sm text-slate-200 placeholder-slate-500"/>
                        {bmSearchTerm && <button onClick={() => setBmSearchTerm("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300"><X size={14}/></button>}
                    </div>
                </div>
                
                <div className="flex-1 overflow-y-auto custom-scrollbar space-y-2 pb-2">
                   {filteredBookmarks.length === 0 ?
                     <div className="text-center text-slate-500 py-10">{bmSearchTerm ? "검색 결과가 없습니다." : "등록된 북마크가 없습니다."}</div> : 
                     filteredBookmarks.map((bm) => {
                       const isWork = bm.context === 'WORK';
                       return (
                          <div key={bm.id} className={`flex items-center gap-4 p-4 rounded-xl border transition-all group ${editingBmId === bm.id ? 'bg-yellow-500/10 border-yellow-500/50 ring-1 ring-yellow-500/30' : 'bg-slate-800/40 border-white/5 hover:bg-slate-800/60'} border-l-4 ${isWork ? 'border-l-indigo-500' : 'border-l-orange-500'}`}>
                               <div className="flex flex-col items-center w-10 shrink-0">
                                   <span className="text-lg">{isWork ? '🏢' : '🏠'}</span>
                                   <span className={`text-[9px] font-bold ${isWork ? 'text-indigo-400' : 'text-orange-400'}`}>{isWork ? 'WORK' : 'LIFE'}</span>
                               </div>
                               <span className="text-xs font-bold text-slate-400 w-20 truncate bg-slate-700/30 px-2 py-1 rounded text-center">{bm.category}</span>
                               <div className="flex-1 min-w-0">
                                   <a href={bm.url} target="_blank" rel="noreferrer" className={`text-sm font-bold hover:underline truncate block flex items-center gap-1 text-slate-200 hover:text-yellow-400`}>
                                       <ExternalLink size={12}/> {bm.title}
                                   </a>
                                   {bm.description && <p className="text-xs text-slate-500 truncate mt-0.5">{bm.description}</p>}
                               </div>
                               <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                   <button onClick={() => handleEditBookmark(bm)} className="p-2 text-slate-500 hover:text-white bg-slate-700/50 hover:bg-slate-600 rounded-lg transition-colors"><Edit2 size={14}/></button>
                                   <button onClick={() => handleDeleteBookmark(bm.id)} className="p-2 text-slate-500 hover:text-red-400 bg-slate-700/50 hover:bg-slate-600 rounded-lg transition-colors"><Trash2 size={14}/></button>
                               </div>
                           </div>
                        );
                     })
                   }
                </div>
            </div>
          </div>
      </DetailModal>

      {/* Resource Input Overlay Modal */}
      <ResourceInputModal isOpen={isResourceInputModalOpen} onClose={() => setIsResourceInputModalOpen(false)} onAdd={handleAddResource} onUpload={handleFileUpload} isUploading={isUploading} />

      <MindMapModal 
        isOpen={isMindMapOpen}
        onClose={() => setIsMindMapOpen(false)}
        project={mindMapTargetProject}
        tasks={data?.tasks || []}
        onUpdateTask={(taskId, field, val) => {
          updateGlobalTaskState(taskId, field, val);
          const body = { action: 'update_task', taskId: taskId };
          body[field] = val;
          fetch(API_URL, { method: "POST", body: JSON.stringify(body) });
        }}
        onCreateTask={handleMindMapCreateTask}
        onDeleteTask={handleMindMapDeleteNode}
        
        // 할 일 카드 클릭 시 실행될 함수 연결
        onOpenTaskDetail={openTaskDetailModal}
        
        // 프로젝트 상세 버튼 클릭 시 실행될 함수 연결
        onOpenProjectDetail={() => {
            setSelectedItem(mindMapTargetProject);
            setModalMode('PROJECT_DETAIL');
        }}
      />

    </div>
  );
}