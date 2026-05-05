// src/pages/WorkerProfile/WorkerProfile.jsx
import React, {
  useState, useCallback, createContext, useContext,
  useRef, useEffect,
} from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext"; 

import { useWorkerProfile } from "../../Hooks/useWorkerProfile";
import { getFullImageUrl } from "../../Utils/imageHelper";
import {
  MapPin, Mail, Phone, Star, BadgeCheck, Briefcase,
  Wrench, MessageCircle, CalendarCheck, ChevronRight,
  X as IconX, ZoomIn, Shield, Clock, Award, ChevronLeft,
  CheckCircle, XCircle, Info, BookOpen,
  Edit3, Camera, Settings, Lock, LayoutDashboard,
  Save, Loader2, BarChart2, ToggleLeft, ToggleRight,
  AlertTriangle, Trash2, ImagePlus, Tag, AlertCircle,
  User, FileText, Hash, Navigation, Plus, Minus, Calendar,
} from "lucide-react";

// ══════════════════════════════════════════════════════════════
// CONSTANTS
// ══════════════════════════════════════════════════════════════
const AVAILABILITY_MAP = {
  Available: { color: "#16a34a", bg: "#dcfce7", dot: "#22c55e", label: "متاح"  },
  Busy:      { color: "#dc2626", bg: "#fee2e2", dot: "#ef4444", label: "مشغول" },
  OnLeave:   { color: "#d97706", bg: "#fef3c7", dot: "#f59e0b", label: "إجازة" },
  متاح:      { color: "#16a34a", bg: "#dcfce7", dot: "#22c55e", label: "متاح"  },
  مشغول:     { color: "#dc2626", bg: "#fee2e2", dot: "#ef4444", label: "مشغول" },
  إجازة:     { color: "#d97706", bg: "#fef3c7", dot: "#f59e0b", label: "إجازة" },
};
const getAvail = (s) =>
  AVAILABILITY_MAP[s] || { color:"#16a34a", bg:"#dcfce7", dot:"#22c55e", label: s || "متاح" };

// أيام الأسبوع بالترتيب (Scalar enum values)
const DAYS = [
  { key: "Saturday",  label: "السبت"    },
  { key: "Sunday",    label: "الأحد"    },
  { key: "Monday",    label: "الاثنين"  },
  { key: "Tuesday",   label: "الثلاثاء" },
  { key: "Wednesday", label: "الأربعاء" },
  { key: "Thursday",  label: "الخميس"  },
  { key: "Friday",    label: "الجمعة"  },
];

const OWNER_TABS = [
  { id: "overview",  label: "نظرة عامة",       icon: LayoutDashboard },
  { id: "portfolio", label: "معرض الأعمال",    icon: BookOpen        },
  { id: "services",  label: "الخدمات والأسعار", icon: Wrench          },
  { id: "reviews",   label: "التقييمات",        icon: Star            },
  { id: "settings",  label: "إعدادات الحساب",   icon: Settings        },
];
const VISITOR_TABS = OWNER_TABS.slice(0, 4);

// ══════════════════════════════════════════════════════════════
// TOAST
// ══════════════════════════════════════════════════════════════
const ToastCtx = createContext(null);
const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((msg, type = "success") => {
    const id = Date.now();
    setToasts(p => [...p, { id, msg, type }]);
    setTimeout(() => setToasts(p => p.filter(t => t.id !== id)), 3500);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 flex-col gap-2"
        style={{ minWidth: 260 }}>
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div key={t.id}
              initial={{ opacity:0, y:20, scale:0.95 }}
              animate={{ opacity:1, y:0,  scale:1    }}
              exit={{ opacity:0, y:10, scale:0.95 }}
              className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-xl
                ${t.type === "success" ? "bg-[#001e3c]" : "bg-red-600"}`}>
              {t.type === "success"
                ? <CheckCircle size={16} className="text-orange-400"/>
                : <XCircle size={16}/>}
              {t.msg}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastCtx.Provider>
  );
};
const useToast = () => useContext(ToastCtx);

// ══════════════════════════════════════════════════════════════
// PRIMITIVES
// ══════════════════════════════════════════════════════════════
const Sk = ({ className = "" }) => (
  <div className={`rounded-lg animate-pulse bg-gray-200 ${className}`}/>
);

const StarRating = ({ rating, size = 14 }) => (
  <div className="flex items-center gap-0.5">
    {[1,2,3,4,5].map(s => (
      <Star key={s} size={size}
        className={s <= Math.round(rating)
          ? "text-orange-400 fill-orange-400"
          : "text-gray-200 fill-gray-200"}/>
    ))}
  </div>
);

const ErrorState = ({ message, onRetry }) => (
  <div className="flex flex-col items-center gap-4 py-20 text-center">
    <div className="flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
      <AlertCircle size={32} className="text-red-400"/>
    </div>
    <p className="text-lg font-bold text-gray-700">{message || "حدث خطأ ما"}</p>
    <button onClick={onRetry}
      className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-bold text-white hover:bg-orange-600 transition">
      إعادة المحاولة
    </button>
  </div>
);

// Generic field wrapper (input / textarea)
const Field = ({
  icon: Icon, label, name, value, onChange, error,
  placeholder = "", type = "text", as = "input", rows = 3,
  min, max, step,
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
      <Icon size={13} className="text-orange-400"/>
      {label}
    </label>
    {as === "textarea" ? (
      <textarea name={name} value={value} onChange={onChange}
        placeholder={placeholder} rows={rows}
        className={`w-full resize-none rounded-xl border px-4 py-2.5 text-sm font-medium text-gray-800
          outline-none transition-all duration-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100
          ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white hover:border-gray-300"}`}
        dir="rtl"/>
    ) : (
      <input type={type} name={name} value={value} onChange={onChange}
        placeholder={placeholder} min={min} max={max} step={step}
        className={`w-full rounded-xl border px-4 py-2.5 text-sm font-medium text-gray-800
          outline-none transition-all duration-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100
          ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white hover:border-gray-300"}`}
        dir="rtl"/>
    )}
    <AnimatePresence>
      {error && (
        <motion.p initial={{ opacity:0, y:-4 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}
          className="text-xs text-red-500 font-medium">
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

// ══════════════════════════════════════════════════════════════
// LIGHTBOX
// ══════════════════════════════════════════════════════════════
const Lightbox = ({ images, initialIndex, onClose }) => {
  const [cur, setCur] = useState(initialIndex);
  const img = images[cur];
  return (
    <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}>
      <motion.div initial={{ scale:0.9, opacity:0 }} animate={{ scale:1, opacity:1 }}
        exit={{ scale:0.9, opacity:0 }} className="relative w-full max-w-3xl"
        onClick={e => e.stopPropagation()}>
        <button onClick={onClose} className="absolute -top-10 right-0 text-white/70 hover:text-white">
          <IconX size={28}/>
        </button>
        <img src={getFullImageUrl(img.imageUrl || img.url) || img.url}
          alt={img.caption || ""}
          className="w-full max-h-[75vh] object-contain rounded-2xl"/>
        {images.length > 1 && (
          <div className="absolute inset-y-0 flex items-center justify-between w-full px-2 pointer-events-none">
            <button onClick={() => setCur(i => (i-1+images.length)%images.length)}
              className="pointer-events-auto bg-black/40 hover:bg-black/70 text-white rounded-full p-2">
              <ChevronRight size={22}/>
            </button>
            <button onClick={() => setCur(i => (i+1)%images.length)}
              className="pointer-events-auto bg-black/40 hover:bg-black/70 text-white rounded-full p-2">
              <ChevronLeft size={22}/>
            </button>
          </div>
        )}
        <div className="flex justify-center gap-1.5 mt-3">
          {images.map((_,i) => (
            <button key={i} onClick={() => setCur(i)}
              className={`h-1.5 rounded-full transition-all ${i===cur?"w-6 bg-orange-400":"w-1.5 bg-white/30"}`}/>
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ══════════════════════════════════════════════════════════════
// WORKING HOURS EDITOR
// Each row: dayOfWeek (enum) + startTime + endTime
// ══════════════════════════════════════════════════════════════
const WorkingHoursEditor = ({ value = [], onChange }) => {
  const addRow = () => onChange([...value, { dayOfWeek: "Saturday", startTime: "08:00", endTime: "17:00" }]);
  const removeRow = (i) => onChange(value.filter((_,idx) => idx !== i));
  const updateRow = (i, field, val) => {
    const next = value.map((r, idx) => idx === i ? { ...r, [field]: val } : r);
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
          <Clock size={13} className="text-orange-400"/>
          ساعات العمل
        </label>
        <button type="button" onClick={addRow}
          className="flex items-center gap-1 rounded-lg bg-orange-50 border border-orange-200 px-2.5 py-1 text-xs font-bold text-orange-500 hover:bg-orange-100 transition">
          <Plus size={12}/>إضافة يوم
        </button>
      </div>

      {value.length === 0 && (
        <p className="text-xs text-gray-400 italic text-center py-3 border border-dashed border-gray-200 rounded-xl">
          لم تُضف أي ساعات عمل بعد
        </p>
      )}

      {value.map((row, i) => (
        <motion.div key={i}
          initial={{ opacity:0, x:8 }} animate={{ opacity:1, x:0 }}
          className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
          {/* Day */}
          <select value={row.dayOfWeek}
            onChange={e => updateRow(i, "dayOfWeek", e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-semibold text-gray-700 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100">
            {DAYS.map(d => (
              <option key={d.key} value={d.key}>{d.label}</option>
            ))}
          </select>
          {/* Start */}
          <input type="time" value={row.startTime}
            onChange={e => updateRow(i, "startTime", e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-semibold text-gray-700 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"/>
          {/* End */}
          <input type="time" value={row.endTime}
            onChange={e => updateRow(i, "endTime", e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-semibold text-gray-700 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"/>
          {/* Remove */}
          <button type="button" onClick={() => removeRow(i)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 transition">
            <Minus size={14}/>
          </button>
        </motion.div>
      ))}

      {/* Legend */}
      {value.length > 0 && (
        <div className="flex items-center gap-4 text-xs text-gray-400 px-1">
          <span>اليوم</span>
          <span className="mr-auto">من</span>
          <span>إلى</span>
          <span className="w-7"/>
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// SPECIALTY TAGS EDITOR (SpecialtyIds[])
// ══════════════════════════════════════════════════════════════
const SpecialtyEditor = ({ value = [], onChange }) => {
  const [input, setInput] = useState("");

  const add = () => {
    const trimmed = input.trim();
    if (trimmed && !value.includes(trimmed)) {
      onChange([...value, trimmed]);
    }
    setInput("");
  };

  const remove = (id) => onChange(value.filter(v => v !== id));

  return (
    <div className="flex flex-col gap-2">
      <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
        <Tag size={13} className="text-orange-400"/>
        التخصصات (Specialty IDs)
      </label>
      <div className="flex gap-2">
        <input value={input} onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && (e.preventDefault(), add())}
          placeholder="أدخل معرف التخصص واضغط Enter"
          className="flex-1 rounded-xl border border-gray-200 bg-white px-4 py-2.5 text-sm font-medium text-gray-800 outline-none focus:border-orange-400 focus:ring-2 focus:ring-orange-100"
          dir="rtl"/>
        <button type="button" onClick={add}
          className="flex items-center gap-1 rounded-xl bg-orange-50 border border-orange-200 px-3 py-2 text-xs font-bold text-orange-500 hover:bg-orange-100 transition">
          <Plus size={13}/>إضافة
        </button>
      </div>
      {value.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-1">
          {value.map(id => (
            <span key={id}
              className="flex items-center gap-1 rounded-full bg-orange-50 border border-orange-200 px-3 py-1 text-xs font-bold text-orange-600">
              {id}
              <button type="button" onClick={() => remove(id)}
                className="ml-1 hover:text-red-500 transition">
                <IconX size={10}/>
              </button>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// HEADER
// ══════════════════════════════════════════════════════════════
const WorkerHeader = ({
  worker, isOwner, loading, saving, toggling,
  onUploadImage, onToggleStatus, onEditClick,
}) => {
  const [hover, setHover] = useState(false);
  const ref = useRef(null);
  const avail = getAvail(worker?.status);
  const fullName = worker ? `${worker.firstName||""} ${worker.lastName||""}`.trim() : "";
  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName||"W")}&background=001e3c&color=ff9800&size=200&bold=true`;

  return (
    <motion.div initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}
      className="relative mb-6 overflow-hidden rounded-3xl shadow-2xl"
      style={{ background:"linear-gradient(135deg,#001e3c 0%,#003a6e 60%,#00285a 100%)" }}>
      <div className="absolute -top-16 -left-16 h-48 w-48 rounded-full opacity-10 bg-orange-400"/>
      <div className="absolute -bottom-10 -right-10 h-36 w-36 rounded-full opacity-5 bg-orange-400"/>

      {isOwner && (
        <input ref={ref} type="file" className="hidden" accept="image/*"
          onChange={e => e.target.files[0] && onUploadImage(e.target.files[0])}/>
      )}

      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end">
          {/* Avatar */}
          <div
            className={`relative shrink-0 ${isOwner && !loading ? "cursor-pointer" : ""}`}
            onClick={() => isOwner && !saving && !loading && ref.current?.click()}
            onMouseEnter={() => isOwner && !loading && setHover(true)}
            onMouseLeave={() => setHover(false)}>
            <div className="h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-2xl ring-4 ring-orange-400/50 relative">
              {loading ? <Sk className="h-full w-full"/> : (
                <>
                  <img
                    src={getFullImageUrl(worker?.profileImage || worker?.ProfileImage) || avatar}
                    alt={fullName}
                    className={`h-full w-full object-cover transition-all duration-300 ${saving ? "blur-sm opacity-50" : ""}`}
                    style={{ transform: hover && isOwner ? "scale(1.08)" : "scale(1)" }}
                    onError={e => { e.target.src = avatar; }}
                  />
                  {saving && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Loader2 className="animate-spin text-orange-400" size={24}/>
                    </div>
                  )}
                </>
              )}
            </div>
            <AnimatePresence>
              {hover && isOwner && !loading && !saving && (
                <motion.div initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
                  className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 backdrop-blur-sm">
                  <Camera size={24} className="text-white"/>
                </motion.div>
              )}
            </AnimatePresence>
            {!loading && (
              <span className="absolute -bottom-1 -left-1 h-5 w-5 rounded-full border-2 border-[#001e3c]"
                style={{ background: avail.dot }}/>
            )}
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-right text-white">
            {loading ? (
              <div className="flex flex-col gap-2 items-center sm:items-start">
                <Sk className="h-8 w-52"/><Sk className="h-5 w-32"/><Sk className="h-4 w-40"/>
              </div>
            ) : (
              <>
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                  <h1 className="text-2xl sm:text-3xl font-black">{fullName || "—"}</h1>
                  {worker?.isVerified && <BadgeCheck size={22} className="text-orange-400 shrink-0"/>}
                </div>
                <div className="flex items-center justify-center sm:justify-start gap-2 mb-3 flex-wrap">
                  {worker?.category && (
                    <span className="rounded-full px-3 py-0.5 text-xs font-bold"
                      style={{ background:"rgba(255,152,0,0.2)", color:"#ffb74d" }}>
                      {worker.category}
                    </span>
                  )}
                  <span className="rounded-full px-3 py-0.5 text-xs font-bold"
                    style={{ background: avail.bg, color: avail.color }}>
                    {avail.label}
                  </span>
                  {isOwner && (
                    <span className="rounded-full px-3 py-0.5 text-xs font-bold"
                      style={{ background:"rgba(255,255,255,0.12)", color:"#fff" }}>
                      ملفك الشخصي
                    </span>
                  )}
                </div>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm text-blue-200">
                  {worker?.city  && <span className="flex items-center gap-1"><MapPin size={13}/>{worker.city}</span>}
                  {worker?.email && <span className="flex items-center gap-1"><Mail   size={13}/>{worker.email}</span>}
                </div>
              </>
            )}
          </div>

          {/* Buttons */}
          {!loading && (
            <div className="flex flex-col gap-2.5 w-full sm:w-auto">
              {isOwner ? (
                <>
                  <motion.button whileTap={{ scale:0.97 }} whileHover={{ scale:1.02 }}
                    onClick={onEditClick}
                    className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition"
                    style={{ background:"linear-gradient(135deg,#ff9800,#f57c00)" }}>
                    <Edit3 size={15}/>تعديل الملف الشخصي
                  </motion.button>
                  <motion.button whileTap={{ scale:0.97 }} whileHover={{ scale:1.02 }}
                    onClick={onToggleStatus} disabled={toggling}
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20 disabled:opacity-60">
                    {toggling ? <Loader2 size={15} className="animate-spin"/> : <ToggleRight size={15}/>}
                    تغيير حالة التوفر
                  </motion.button>
                </>
              ) : (
                <>
                  <motion.button whileTap={{ scale:0.97 }} whileHover={{ scale:1.02 }}
                    className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition"
                    style={{ background:"linear-gradient(135deg,#ff9800,#f57c00)" }}>
                    <CalendarCheck size={15}/>احجز الآن
                  </motion.button>
                  <motion.button whileTap={{ scale:0.97 }} whileHover={{ scale:1.02 }}
                    className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20">
                    <MessageCircle size={15}/>راسل العامل
                  </motion.button>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ══════════════════════════════════════════════════════════════
// STATS BAR
// ══════════════════════════════════════════════════════════════
const StatsBar = ({ worker, loading }) => {
  const stats = [
    { icon:Briefcase,   label:"سنوات الخبرة", value:`${worker?.experienceYears || worker?.yearsOfExperience || 0}+`, color:"#001e3c" },
    { icon:Star,        label:"التقييم العام", value:worker?.rating||0,                  color:"#f59e0b", isRating:true },
    { icon:CheckCircle, label:"مهام منجزة",   value:worker?.completedJobs||0,            color:"#16a34a" },
    { icon:Award,       label:"عدد التقييمات",value:worker?.reviewsCount||0,             color:"#7c3aed" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map((s,i) => (
        <motion.div key={s.label}
          initial={{ opacity:0, y:12 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.07 }}
          className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm text-center hover:shadow-md hover:border-orange-200 transition-all duration-300">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl"
            style={{ background:`${s.color}15` }}>
            <s.icon size={18} style={{ color:s.color }}/>
          </div>
          {loading ? <Sk className="h-6 w-12"/> : s.isRating ? (
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-xl font-black text-gray-800">{s.value}</span>
              <StarRating rating={s.value} size={11}/>
            </div>
          ) : <span className="text-xl font-black text-gray-800">{s.value}</span>}
          <span className="text-xs text-gray-400 font-medium">{s.label}</span>
        </motion.div>
      ))}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// SIDEBAR
// ══════════════════════════════════════════════════════════════
const WorkerSidebar = ({ worker, isOwner, loading, activeTab, setActiveTab }) => {
  const tabs = isOwner ? OWNER_TABS : VISITOR_TABS;
  const fullName = worker ? `${worker.firstName||""} ${worker.lastName||""}`.trim() : "";
  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName||"W")}&background=ff9800&color=fff&size=200&bold=true`;
  return (
    <aside className="lg:col-span-1">
      <div className="sticky top-6 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-50 p-5 text-center">
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <Sk className="h-14 w-14 rounded-full mx-auto"/>
              <Sk className="h-4 w-28"/><Sk className="h-3 w-20"/>
            </div>
          ) : (
            <>
              <img src={getFullImageUrl(worker?.profileImage||worker?.ProfileImage)||avatar}
                alt={fullName}
                className="mx-auto mb-2 h-14 w-14 rounded-full object-cover ring-2 ring-orange-200"
                onError={e=>{ e.target.src=avatar; }}/>
              <p className="text-sm font-bold text-gray-800">{fullName}</p>
              <p className="text-xs text-gray-400">{worker?.category || worker?.jobDescription}</p>
              <div className="mt-2 flex justify-center">
                <StarRating rating={worker?.rating||0} size={12}/>
              </div>
            </>
          )}
        </div>
        <nav className="p-3">
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition
                ${activeTab===tab.id ? "bg-[#001e3c] text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}>
              <tab.icon size={16} className={activeTab===tab.id ? "text-orange-400" : ""}/>
              <span className="flex-1 text-right">{tab.label}</span>
              <ChevronRight size={14} className={activeTab===tab.id ? "rotate-180 text-orange-400" : "text-gray-300"}/>
            </button>
          ))}
        </nav>
        {!isOwner && !loading && (
          <div className="border-t border-gray-50 p-4 flex flex-col gap-2">
            <button className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white hover:opacity-90 transition"
              style={{ background:"linear-gradient(135deg,#ff9800,#f57c00)" }}>
              <CalendarCheck size={15}/>احجز الآن
            </button>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-600 hover:bg-gray-50 transition">
              <Phone size={15}/>اتصل بالعامل
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};

// ══════════════════════════════════════════════════════════════
// TAB: OVERVIEW
// ══════════════════════════════════════════════════════════════
const OverviewTab = ({ worker, isOwner, loading }) => (
  <div className="flex flex-col gap-5">
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-50">
          <Info size={13} className="text-green-600"/>
        </div>
        <h3 className="text-sm font-bold text-gray-800">وصف العمل</h3>
      </div>
      {loading
        ? <div className="flex flex-col gap-2"><Sk className="h-4 w-full"/><Sk className="h-4 w-3/4"/></div>
        : <p className="text-sm text-gray-600 leading-relaxed">
            {worker?.jobDescription || worker?.bio || "لا يوجد وصف."}
          </p>
      }
    </div>
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[
        { icon:Phone,     label:"الهاتف",         value:worker?.phoneNumber },
        { icon:MapPin,    label:"الموقع",         value:worker?.city },
        { icon:Clock,     label:"سنوات الخبرة",   value:(worker?.experienceYears ?? worker?.yearsOfExperience) != null ? `${worker.experienceYears ?? worker.yearsOfExperience} سنوات` : null },
        { icon:Shield,    label:"التخصص",         value:worker?.subcategory },
        { icon:Mail,      label:"البريد",         value:worker?.email },
        { icon:Briefcase, label:"المهام المنجزة", value:worker?.completedJobs ? `${worker.completedJobs} مهمة` : null },
      ].map(item => (
        <div key={item.label} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
          <item.icon size={14} className="text-orange-400 shrink-0"/>
          <div>
            <p className="text-xs text-gray-400 font-medium">{item.label}</p>
            {loading ? <Sk className="h-3 w-20 mt-1"/> : (
              <p className="text-xs font-semibold text-gray-700">
                {item.value || <span className="italic text-gray-300">غير محدد</span>}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
    {!loading && !isOwner && (
      <div className="rounded-2xl border border-gray-100 bg-orange-50/40 p-4">
        <p className="text-xs font-bold text-gray-700 mb-3">ضمانات تدبير</p>
        <div className="flex flex-col gap-2">
          {[
            { icon:Shield,    text:"ضمان جودة العمل" },
            { icon:BadgeCheck,text:"عامل موثق ومعتمد" },
            { icon:Clock,     text:"دفع بعد اكتمال الخدمة" },
          ].map(item => (
            <div key={item.text} className="flex items-center gap-2 text-xs text-gray-600">
              <item.icon size={13} className="text-green-500 shrink-0"/>
              {item.text}
            </div>
          ))}
        </div>
      </div>
    )}
    {!loading && isOwner && (
      <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
        <p className="text-xs font-bold text-gray-700 mb-3">ملخص الأداء هذا الشهر</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label:"طلبات جديدة", value:worker?.monthlyNewJobs   ?? "—" },
            { label:"مكتملة",      value:worker?.monthlyCompleted ?? "—" },
            { label:"ملغاة",       value:worker?.monthlyCancelled ?? "—" },
          ].map(s => (
            <div key={s.label} className="text-center rounded-xl bg-white border border-gray-100 py-3">
              <p className="text-lg font-black text-gray-800">{s.value}</p>
              <p className="text-xs text-gray-400">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    )}
  </div>
);

// ══════════════════════════════════════════════════════════════
// TAB: PORTFOLIO
// ══════════════════════════════════════════════════════════════
const PortfolioTab = ({ images=[], isOwner, loading, onUploadImage, onDeleteImage, saving }) => {
  const [lbIdx, setLbIdx] = useState(null);
  const ref = useRef(null);
  return (
    <div>
      {isOwner && (
        <>
          <input ref={ref} type="file" className="hidden" accept="image/*"
            onChange={e => e.target.files[0] && onUploadImage(e.target.files[0])}/>
          <motion.button whileTap={{ scale:0.97 }} onClick={() => ref.current?.click()}
            disabled={saving}
            className="mb-4 flex items-center gap-2 rounded-xl border border-dashed border-orange-300 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-500 hover:bg-orange-100 transition disabled:opacity-60">
            {saving ? <Loader2 size={15} className="animate-spin"/> : <ImagePlus size={15}/>}
            {saving ? "جاري الرفع..." : "إضافة صورة جديدة"}
          </motion.button>
        </>
      )}
      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[...Array(6)].map((_,i) => <Sk key={i} className="aspect-[4/3] rounded-2xl"/>)}
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
            <BookOpen size={28} className="text-gray-300"/>
          </div>
          <p className="text-sm text-gray-400">لا توجد صور في معرض الأعمال</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((img,i) => (
            <motion.div key={img.id||i}
              initial={{ opacity:0, scale:0.95 }} animate={{ opacity:1, scale:1 }} transition={{ delay:i*0.05 }}
              className="group relative cursor-pointer overflow-hidden rounded-2xl aspect-[4/3] bg-gray-100"
              onClick={() => setLbIdx(i)}>
              <img src={getFullImageUrl(img.imageUrl||img.url)||img.url} alt={img.caption||""}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"/>
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
                <p className="text-white text-xs font-semibold">{img.caption}</p>
              </div>
              <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90">
                  <ZoomIn size={13} className="text-gray-700"/>
                </div>
              </div>
              {isOwner && (
                <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/90 text-white hover:bg-red-600"
                    onClick={e => { e.stopPropagation(); onDeleteImage(img.id); }}>
                    <Trash2 size={12}/>
                  </button>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      )}
      <AnimatePresence>
        {lbIdx !== null && images.length > 0 && (
          <Lightbox images={images} initialIndex={lbIdx} onClose={() => setLbIdx(null)}/>
        )}
      </AnimatePresence>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// TAB: SERVICES
// ══════════════════════════════════════════════════════════════
const ServicesTab = ({ services=[], isOwner, loading }) => (
  <div>
    {isOwner && (
      <motion.button whileTap={{ scale:0.97 }}
        className="mb-4 flex items-center gap-2 rounded-xl border border-dashed border-orange-300 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-500 hover:bg-orange-100 transition">
        <Tag size={15}/>إضافة خدمة جديدة
      </motion.button>
    )}
    {loading ? (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {[...Array(4)].map((_,i) => <Sk key={i} className="h-14 rounded-2xl"/>)}
      </div>
    ) : services.length === 0 ? (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <Wrench size={28} className="text-gray-300"/>
        <p className="text-sm text-gray-400">لا توجد خدمات مضافة</p>
      </div>
    ) : (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {services.map((s,i) => (
          <motion.div key={s.name||i}
            initial={{ opacity:0, x:-8 }} animate={{ opacity:1, x:0 }} transition={{ delay:i*0.06 }}
            className="group flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 hover:border-orange-200 hover:bg-orange-50/30 transition-all">
            <div className="flex items-center gap-2.5">
              <div className="h-2 w-2 rounded-full bg-orange-400 shrink-0"/>
              <span className="text-sm font-semibold text-gray-700">{s.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-orange-500 whitespace-nowrap">{s.price}</span>
              {isOwner && (
                <button className="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-orange-500">
                  <Edit3 size={13}/>
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    )}
  </div>
);

// ══════════════════════════════════════════════════════════════
// TAB: REVIEWS
// ══════════════════════════════════════════════════════════════
const ReviewsTab = ({ reviews=[], rating=0, reviewsCount=0, isOwner, loading }) => (
  <div>
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-1.5">
        {loading ? <Sk className="h-8 w-24"/> : (
          <>
            <span className="text-2xl font-black text-gray-800">{rating}</span>
            <div className="flex flex-col gap-0.5">
              <StarRating rating={rating} size={13}/>
              <span className="text-xs text-gray-400">{reviewsCount} تقييم</span>
            </div>
          </>
        )}
      </div>
      {!isOwner && !loading && (
        <motion.button whileTap={{ scale:0.97 }}
          className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow-md">
          <Star size={13}/>أضف تقييمك
        </motion.button>
      )}
    </div>
    {loading ? (
      <div className="flex flex-col gap-3">
        {[...Array(3)].map((_,i) => <Sk key={i} className="h-24 rounded-2xl"/>)}
      </div>
    ) : reviews.length === 0 ? (
      <div className="flex flex-col items-center gap-3 py-12 text-center">
        <Star size={28} className="text-gray-200"/>
        <p className="text-sm text-gray-400">لا توجد تقييمات بعد</p>
      </div>
    ) : (
      <div className="flex flex-col gap-3">
        {reviews.map((r,i) => (
          <motion.div key={r.id||i}
            initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} transition={{ delay:i*0.08 }}
            className="rounded-2xl border border-gray-100 bg-gray-50 p-4">
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#001e3c] text-xs font-bold text-orange-400">
                  {(r.name||r.userName||"?").charAt(0)}
                </div>
                <span className="text-sm font-bold text-gray-700">{r.name||r.userName}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <StarRating rating={r.rating} size={12}/>
                <span className="text-xs text-gray-400">
                  {r.date ? new Date(r.date).toLocaleDateString("ar-SA") : ""}
                </span>
              </div>
            </div>
            <p className="text-xs text-gray-600 leading-relaxed">{r.comment}</p>
          </motion.div>
        ))}
      </div>
    )}
  </div>
);

// ══════════════════════════════════════════════════════════════
// TAB: SETTINGS — Full form with ALL Scalar fields
// ══════════════════════════════════════════════════════════════
const SettingsTab = ({ worker, onToggleStatus, toggling, updateWorker, saving }) => {
  const toast = useToast();
  const avail = getAvail(worker?.status);

  // ── Form state pre-filled from worker ─────────────────────
  const blank = {
    FirstName:       "",
    LastName:        "",
    PhoneNumber:     "",
    JobDescription:  "",
    ExperienceYears: "",
    DateOfBirth:     "",
    Latitude:        "",
    Longitude:       "",
    SpecialtyIds:    [],
    WorkingHours:    [],
  };

  const [editMode,  setEditMode]  = useState(false);
  const [form,      setForm]      = useState(blank);
  const [errors,    setErrors]    = useState({});

  // Sync form when worker data arrives
  useEffect(() => {
    if (!worker) return;
    setForm({
      FirstName:       worker.firstName       || "",
      LastName:        worker.lastName        || "",
      PhoneNumber:     worker.phoneNumber     || "",
      JobDescription:  worker.jobDescription  || worker.bio || "",
      ExperienceYears: worker.experienceYears ?? worker.yearsOfExperience ?? "",
      DateOfBirth:     worker.dateOfBirth
        ? worker.dateOfBirth.split("T")[0]
        : "",
      Latitude:        worker.latitude  ?? "",
      Longitude:       worker.longitude ?? "",
      SpecialtyIds:    worker.specialtyIds    || [],
      WorkingHours:    worker.workingHours    || [],
    });
  }, [worker]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.FirstName.trim())  e.FirstName  = "الاسم الأول مطلوب";
    if (!form.LastName.trim())   e.LastName   = "الاسم الأخير مطلوب";
    if (form.PhoneNumber && !/^\+?[0-9\s\-]{7,15}$/.test(form.PhoneNumber))
      e.PhoneNumber = "رقم الهاتف غير صالح";
    if (form.ExperienceYears !== "" && isNaN(Number(form.ExperienceYears)))
      e.ExperienceYears = "يجب أن يكون رقماً";
    if (form.Latitude  !== "" && (isNaN(Number(form.Latitude))  || Number(form.Latitude)  < -90  || Number(form.Latitude)  > 90))
      e.Latitude  = "خط العرض بين -90 و 90";
    if (form.Longitude !== "" && (isNaN(Number(form.Longitude)) || Number(form.Longitude) < -180 || Number(form.Longitude) > 180))
      e.Longitude = "خط الطول بين -180 و 180";
    return e;
  };

 const handleSave = async () => {
  const errs = validate();
  if (Object.keys(errs).length) { setErrors(errs); return; }

  const payload = {
    ...form,
    ExperienceYears: form.ExperienceYears !== "" ? Number(form.ExperienceYears) : undefined,
    Latitude:        form.Latitude        !== "" ? Number(form.Latitude)        : undefined,
    Longitude:       form.Longitude       !== "" ? Number(form.Longitude)       : undefined,
  };

  const res = await updateWorker(payload);
  if (res?.ok) {
    // التعديل المطلوب هنا: تحديث الـ Context بالاسم الجديد
    updateUser({
      firstName: form.FirstName,
      lastName:  form.LastName
    });

    toast("تم حفظ البيانات بنجاح ✓");
    setEditMode(false);
    setErrors({});
  } else {
    toast(res?.error || "فشل الحفظ", "error");
  }
};

  const handleToggle = async () => {
    const res = await onToggleStatus();
    if (res?.ok) toast("تم تغيير حالة التوفر ✓");
    else toast(res?.error || "فشل تغيير الحالة", "error");
  };

  // Section header component
  const SectionHead = ({ title, subtitle }) => (
    <div className="flex flex-col gap-0.5 mb-4">
      <p className="text-sm font-bold text-gray-800">{title}</p>
      {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
    </div>
  );

  return (
    <div className="flex flex-col gap-8">

      {/* ══ SECTION 1: Personal Info ═══════════════════════════ */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <SectionHead title="البيانات الشخصية" subtitle="تعديل معلوماتك المهنية"/>
          {!editMode && (
            <motion.button whileTap={{ scale:0.97 }} onClick={() => setEditMode(true)}
              className="flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-500 hover:bg-orange-100 transition">
              <Edit3 size={12}/>تعديل
            </motion.button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {editMode ? (
            <motion.div key="edit-form"
              initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }} exit={{ opacity:0 }}>

              {/* ── Row 1: Name ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Field icon={User} label="الاسم الأول *" name="FirstName"
                  value={form.FirstName} onChange={handleChange} error={errors.FirstName}
                  placeholder="أدخل الاسم الأول"/>
                <Field icon={User} label="الاسم الأخير *" name="LastName"
                  value={form.LastName} onChange={handleChange} error={errors.LastName}
                  placeholder="أدخل الاسم الأخير"/>
              </div>

              {/* ── Row 2: Phone + Experience ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Field icon={Phone} label="رقم الهاتف" name="PhoneNumber"
                  value={form.PhoneNumber} onChange={handleChange} error={errors.PhoneNumber}
                  placeholder="+970 5XX XXX XXX"/>
                <Field icon={Hash} label="سنوات الخبرة" name="ExperienceYears"
                  value={form.ExperienceYears} onChange={handleChange} error={errors.ExperienceYears}
                  placeholder="مثال: 5" type="number" min="0" max="60"/>
              </div>

              {/* ── Row 3: DateOfBirth ── */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
                <Field icon={Calendar} label="تاريخ الميلاد" name="DateOfBirth"
                  value={form.DateOfBirth} onChange={handleChange} error={errors.DateOfBirth}
                  type="date"/>
              </div>

              {/* ── JobDescription ── */}
              <div className="mb-4">
                <Field icon={FileText} label="وصف العمل (JobDescription)"
                  name="JobDescription"
                  value={form.JobDescription} onChange={handleChange} error={errors.JobDescription}
                  placeholder="اكتب وصفاً لعملك وتخصصك..."
                  as="textarea" rows={3}/>
              </div>

              {/* ── Location: Latitude + Longitude ── */}
              <div className="mb-4">
                <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500 mb-2">
                  <Navigation size={13} className="text-orange-400"/>
                  الموقع الجغرافي (اختياري)
                </label>
                <div className="grid grid-cols-2 gap-4">
                  <Field icon={Navigation} label="خط العرض (Latitude)" name="Latitude"
                    value={form.Latitude} onChange={handleChange} error={errors.Latitude}
                    placeholder="-90 إلى 90" type="number" min="-90" max="90" step="any"/>
                  <Field icon={Navigation} label="خط الطول (Longitude)" name="Longitude"
                    value={form.Longitude} onChange={handleChange} error={errors.Longitude}
                    placeholder="-180 إلى 180" type="number" min="-180" max="180" step="any"/>
                </div>
              </div>

              {/* ── SpecialtyIds ── */}
              <div className="mb-4">
                <SpecialtyEditor
                  value={form.SpecialtyIds}
                  onChange={val => setForm(p => ({ ...p, SpecialtyIds: val }))}/>
              </div>

              {/* ── WorkingHours ── */}
              <div className="mb-6">
                <WorkingHoursEditor
                  value={form.WorkingHours}
                  onChange={val => setForm(p => ({ ...p, WorkingHours: val }))}/>
              </div>

              {/* ── Buttons ── */}
              <div className="flex items-center justify-end gap-3 border-t border-gray-50 pt-4">
                <button onClick={() => { setEditMode(false); setErrors({}); }}
                  className="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-500 hover:bg-gray-50 transition">
                  <IconX size={14}/>إلغاء
                </button>
                <button onClick={handleSave} disabled={saving}
                  className="flex items-center gap-2 rounded-xl px-6 py-2 text-sm font-bold text-white shadow-md transition disabled:opacity-60"
                  style={{ background:"linear-gradient(135deg,#ff9800,#f57c00)" }}>
                  {saving
                    ? <><Loader2 size={14} className="animate-spin"/>جاري الحفظ...</>
                    : <><Save size={14}/>حفظ التغييرات</>}
                </button>
              </div>
            </motion.div>

          ) : (
            /* ── READ VIEW ── */
            <motion.div key="read-view"
              initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }}
              className="flex flex-col gap-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {[
                  { icon:User,      label:"الاسم الأول",     value:worker?.firstName },
                  { icon:User,      label:"الاسم الأخير",    value:worker?.lastName },
                  { icon:Phone,     label:"رقم الهاتف",      value:worker?.phoneNumber },
                  { icon:Hash,      label:"سنوات الخبرة",    value:worker?.experienceYears ?? worker?.yearsOfExperience },
                  { icon:Calendar,  label:"تاريخ الميلاد",   value:worker?.dateOfBirth ? new Date(worker.dateOfBirth).toLocaleDateString("ar-SA") : null },
                  { icon:Mail,      label:"البريد",           value:worker?.email },
                  { icon:Navigation,label:"خط العرض",        value:worker?.latitude },
                  { icon:Navigation,label:"خط الطول",        value:worker?.longitude },
                ].map(item => (
                  <div key={item.label}
                    className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
                    <item.icon size={14} className="text-orange-400 shrink-0"/>
                    <div>
                      <p className="text-xs text-gray-400 font-medium">{item.label}</p>
                      <p className="text-xs font-semibold text-gray-700">
                        {item.value ?? <span className="italic text-gray-300">غير محدد</span>}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* JobDescription */}
              {(worker?.jobDescription || worker?.bio) && (
                <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
                  <FileText size={14} className="text-orange-400 shrink-0 mt-0.5"/>
                  <div>
                    <p className="text-xs text-gray-400 font-medium">وصف العمل</p>
                    <p className="text-xs font-semibold text-gray-700 leading-relaxed">
                      {worker.jobDescription || worker.bio}
                    </p>
                  </div>
                </div>
              )}

              {/* SpecialtyIds */}
              {worker?.specialtyIds?.length > 0 && (
                <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
                  <Tag size={14} className="text-orange-400 shrink-0 mt-0.5"/>
                  <div>
                    <p className="text-xs text-gray-400 font-medium mb-1.5">التخصصات</p>
                    <div className="flex flex-wrap gap-1.5">
                      {worker.specialtyIds.map(id => (
                        <span key={id} className="rounded-full bg-orange-50 border border-orange-200 px-2.5 py-0.5 text-xs font-bold text-orange-600">
                          {id}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* WorkingHours */}
              {worker?.workingHours?.length > 0 && (
                <div className="flex items-start gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
                  <Clock size={14} className="text-orange-400 shrink-0 mt-0.5"/>
                  <div className="flex-1">
                    <p className="text-xs text-gray-400 font-medium mb-2">ساعات العمل</p>
                    <div className="flex flex-col gap-1.5">
                      {worker.workingHours.map((wh, i) => {
                        const day = DAYS.find(d => d.key === wh.dayOfWeek);
                        return (
                          <div key={i} className="flex items-center gap-3 text-xs font-semibold text-gray-700">
                            <span className="w-16 text-orange-500">{day?.label || wh.dayOfWeek}</span>
                            <span className="text-gray-400">من</span>
                            <span>{wh.startTime}</span>
                            <span className="text-gray-400">إلى</span>
                            <span>{wh.endTime}</span>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ══ SECTION 2: Availability ════════════════════════════ */}
      <div>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">حالة التوفر</h4>
        <div className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
          <div>
            <p className="text-sm font-bold text-gray-700">الحالة الحالية</p>
            <p className="text-xs mt-0.5 font-semibold" style={{ color:avail.color }}>
              ● {avail.label}
            </p>
          </div>
          <motion.button whileTap={{ scale:0.97 }} onClick={handleToggle} disabled={toggling}
            className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold text-white transition disabled:opacity-60"
            style={{ background:"linear-gradient(135deg,#ff9800,#f57c00)" }}>
            {toggling ? <Loader2 size={14} className="animate-spin"/> : <ToggleRight size={14}/>}
            تغيير الحالة
          </motion.button>
        </div>
      </div>

      {/* ══ SECTION 3: Security ════════════════════════════════ */}
      <div>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">الأمان</h4>
        <div className="flex flex-col gap-2">
          <button className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:border-orange-200 hover:bg-orange-50/30 transition text-right w-full">
            <Lock size={14} className="text-orange-400 shrink-0"/>
            تغيير كلمة المرور
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50/40 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition text-right w-full">
            <AlertTriangle size={14} className="shrink-0"/>
            تعطيل الحساب مؤقتاً
          </button>
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// MOBILE BAR + FLOATING ACTIONS
// ══════════════════════════════════════════════════════════════
const MobileTabBar = ({ activeTab, setActiveTab, isOwner }) => {
  const tabs = isOwner ? OWNER_TABS : VISITOR_TABS;
  return (
    <div className="flex gap-1 mb-5 overflow-x-auto pb-1 lg:hidden">
      {tabs.map(tab => (
        <button key={tab.id} onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold whitespace-nowrap transition
            ${activeTab===tab.id ? "bg-[#001e3c] text-white" : "bg-white border border-gray-100 text-gray-500"}`}>
          <tab.icon size={13} className={activeTab===tab.id ? "text-orange-400" : ""}/>
          {tab.label}
        </button>
      ))}
    </div>
  );
};

const FloatingActions = ({ isOwner, setActiveTab }) => (
  <div className="fixed bottom-0 left-0 right-0 z-40 flex gap-3 border-t border-gray-100 bg-white/95 p-4 backdrop-blur-md sm:hidden">
    {isOwner ? (
      <>
        <button onClick={() => setActiveTab("settings")}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-600 hover:bg-gray-50">
          <Settings size={15}/>الإعدادات
        </button>
        <button onClick={() => setActiveTab("settings")}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow-lg transition"
          style={{ background:"linear-gradient(135deg,#ff9800,#f57c00)" }}>
          <Edit3 size={15}/>تعديل الملف
        </button>
      </>
    ) : (
      <>
        <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-600">
          <MessageCircle size={15}/>رسالة
        </button>
        <button className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow-lg"
          style={{ background:"linear-gradient(135deg,#ff9800,#f57c00)" }}>
          <CalendarCheck size={15}/>احجز الآن
        </button>
      </>
    )}
  </div>
);

// ══════════════════════════════════════════════════════════════
// MAIN CONTENT
// ══════════════════════════════════════════════════════════════
const WorkerProfileContent = () => {
  const { user, updateUser } = useAuth();
  const { workerId }       = useParams();
  const { user: authUser } = useAuth();
  const toast = useToast();

  const {
    worker, workImages, loading, saving, toggling, error,
    fetchWorker, updateWorker, toggleStatus,
    uploadProfileImage, uploadWorkImage, deleteWorkImage,
  } = useWorkerProfile(workerId || null);

  const isOwner = !workerId
    || (authUser?.id && worker?.id && String(authUser.id) === String(worker.id));

  const [activeTab, setActiveTab] = useState("overview");

  const handleEditClick     = () => setActiveTab("settings");

 const handleUploadProfile = async (file) => {
  const res = await uploadProfileImage(file, worker);
  if (res.ok) {
    // التعديل المطلوب هنا: تحديث الصورة في الـ Context
    // افترضنا أن الـ res يحتوي على رابط الصورة الجديد أو نأخذه من الـ worker بعد التحديث
    updateUser({
      profileImage: res.imageUrl || worker.profileImage 
    });
    toast("تم تحديث صورة الملف الشخصي ✓");
  } else {
    toast(res.error || "فشل رفع الصورة", "error");
  }
};

  const handleToggleStatus  = async () => {
    const res = await toggleStatus();
    if (res.ok) toast("تم تغيير حالة التوفر ✓");
    else toast(res.error || "فشل تغيير الحالة", "error");
  };

  const handleUploadWork    = async (file) => {
    const res = await uploadWorkImage(file);
    if (res.ok) toast("تمت إضافة الصورة للمعرض ✓");
    else toast(res.error || "فشل رفع الصورة", "error");
  };

  const handleDeleteWork    = async (id) => {
    const res = await deleteWorkImage(id);
    if (res.ok) toast("تم حذف الصورة ✓");
    else toast(res.error || "فشل حذف الصورة", "error");
  };

  const portfolioImages = workImages.length > 0
    ? workImages
    : (worker?.portfolioImages || worker?.workImages || []);

  const tabContent = {
    overview:  <OverviewTab  worker={worker} isOwner={isOwner} loading={loading}/>,
    portfolio: <PortfolioTab images={portfolioImages} isOwner={isOwner}
                 loading={loading} saving={saving}
                 onUploadImage={handleUploadWork} onDeleteImage={handleDeleteWork}/>,
    services:  <ServicesTab  services={worker?.services||[]} isOwner={isOwner} loading={loading}/>,
    reviews:   <ReviewsTab   reviews={worker?.reviews||[]} rating={worker?.rating||0}
                 reviewsCount={worker?.reviewsCount||0} isOwner={isOwner} loading={loading}/>,
    settings: isOwner ? (
      <SettingsTab
        worker={worker}
        onToggleStatus={handleToggleStatus}
        toggling={toggling}
        updateWorker={updateWorker}
        saving={saving}
      />
    ) : null,
  };

  if (error && !loading) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] p-4 sm:p-6 lg:p-10" dir="rtl">
        <div className="mx-auto max-w-5xl">
          <ErrorState message={error} onRetry={fetchWorker}/>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#f8f6f3] p-4 pb-28 sm:p-6 sm:pb-6 lg:p-10">
      <div className="mx-auto max-w-5xl">
        <WorkerHeader
          worker={worker} isOwner={isOwner}
          loading={loading} saving={saving} toggling={toggling}
          onUploadImage={handleUploadProfile}
          onToggleStatus={handleToggleStatus}
          onEditClick={handleEditClick}
        />
        <StatsBar worker={worker} loading={loading}/>
        <MobileTabBar activeTab={activeTab} setActiveTab={setActiveTab} isOwner={isOwner}/>

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
          <div className="hidden lg:block lg:col-span-1">
            <WorkerSidebar
              worker={worker} isOwner={isOwner} loading={loading}
              activeTab={activeTab} setActiveTab={setActiveTab}
            />
          </div>
          <main className="lg:col-span-3">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm min-h-[400px]">
              <div className="mb-5 border-b border-gray-50 pb-4 flex items-center justify-between">
                <h2 className="text-base font-black text-gray-800">
                  {(isOwner ? OWNER_TABS : VISITOR_TABS).find(t => t.id===activeTab)?.label}
                </h2>
                <span className={`rounded-full px-3 py-0.5 text-xs font-bold
                  ${isOwner ? "bg-orange-50 text-orange-500" : "bg-blue-50 text-blue-600"}`}>
                  {isOwner ? "أنت المالك" : "زائر"}
                </span>
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={activeTab}
                  initial={{ opacity:0, y:8 }} animate={{ opacity:1, y:0 }}
                  exit={{ opacity:0, y:-8 }} transition={{ duration:0.2 }}>
                  {tabContent[activeTab]}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
      <FloatingActions isOwner={isOwner} setActiveTab={setActiveTab}/>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// EXPORT
// ══════════════════════════════════════════════════════════════
const WorkerProfile = () => (
  <ToastProvider>
    <style>{`
      @import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap');
      *, *::before, *::after { font-family: 'Tajawal', sans-serif !important; }
    `}</style>
    <WorkerProfileContent/>
  </ToastProvider>
);

export default WorkerProfile;