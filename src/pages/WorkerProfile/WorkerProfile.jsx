import React, { useState, useCallback, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin, Mail, Phone, Star, BadgeCheck, Briefcase,
  Wrench, MessageCircle, CalendarCheck, ChevronRight,
  X as IconX, ZoomIn, Shield, Clock, Award, ChevronLeft,
  CheckCircle, XCircle, Tag, DollarSign, Info, BookOpen,
  User, Edit3, Camera, Settings, Lock, LayoutDashboard,
  Save, Loader2, Menu, Bell, BarChart2, ToggleLeft,
  ToggleRight, AlertTriangle, Trash2, ImagePlus,
} from "lucide-react";

// ══════════════════════════════════════════════════════════════
// MOCK DATA
// ══════════════════════════════════════════════════════════════
const MOCK_WORKER = {
  id: "w-001",
  firstName: "أحمد",
  lastName: "الزعبي",
  category: "كهربائي",
  subcategory: "كهرباء منزلية ولوحات توزيع",
  city: "نابلس",
  email: "ahmed.zaubi@tadbeer.ps",
  phone: "+970 599 123 456",
  isVerified: true,
  status: "متاح",
  yearsOfExperience: 8,
  rating: 4.8,
  reviewsCount: 126,
  completedJobs: 214,
  bio: "كهربائي محترف بخبرة 8 سنوات في تركيب وصيانة الأنظمة الكهربائية المنزلية والتجارية. متخصص في لوحات التوزيع، تمديدات الإضاءة، وأنظمة الطاقة الشمسية. أعمل بدقة عالية وأضمن سلامة التنفيذ.",
  profileImage: null,
  portfolioImages: [
    { id: 1, url: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=300&fit=crop", caption: "لوحة توزيع رئيسية" },
    { id: 2, url: "https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=400&h=300&fit=crop", caption: "تمديدات كهربائية" },
    { id: 3, url: "https://images.unsplash.com/photo-1504328345606-18bbc8c9d7d1?w=400&h=300&fit=crop", caption: "تركيب إضاءة" },
    { id: 4, url: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop", caption: "مشروع تجاري" },
    { id: 5, url: "https://images.unsplash.com/photo-1565793298595-6a879b1d9492?w=400&h=300&fit=crop", caption: "ألواح شمسية" },
    { id: 6, url: "https://images.unsplash.com/photo-1581094794329-c8112a89af12?w=400&h=300&fit=crop", caption: "صيانة مولدات" },
  ],
  services: [
    { name: "تركيب لوحات كهربائية", price: "من 150₪" },
    { name: "تمديد أسلاك ومنافذ", price: "من 80₪" },
    { name: "تركيب إضاءة LED", price: "من 50₪" },
    { name: "صيانة مولدات", price: "من 120₪" },
    { name: "تركيب طاقة شمسية", price: "من 500₪" },
    { name: "كشف أعطال كهربائية", price: "من 60₪" },
  ],
  reviews: [
    { id: 1, name: "محمد العلي", rating: 5, comment: "عمل ممتاز وسريع، نظيف ودقيق جداً في عمله. أنصح به.", date: "2025-03-12" },
    { id: 2, name: "سارة ناصر", rating: 5, comment: "خدمة احترافية ومميزة، أنهى العمل في الوقت المحدد.", date: "2025-02-28" },
    { id: 3, name: "خالد حمدان", rating: 4, comment: "جيد جداً، سعر مناسب ونتيجة رائعة.", date: "2025-01-15" },
  ],
};

// Simulate current logged-in user — toggle .id to test RBAC:
// "w-001" → OWNER view  |  "u-999" → VISITOR view
const MOCK_CURRENT_USER = { id: "w-001", name: "أحمد الزعبي" };

// ══════════════════════════════════════════════════════════════
// CONSTANTS
// ══════════════════════════════════════════════════════════════
const AVAILABILITY_MAP = {
  "متاح":   { color: "#16a34a", bg: "#dcfce7", dot: "#22c55e" },
  "مشغول":  { color: "#dc2626", bg: "#fee2e2", dot: "#ef4444" },
  "إجازة":  { color: "#d97706", bg: "#fef3c7", dot: "#f59e0b" },
};

// Tabs visible only to owner
const OWNER_TABS = [
  { id: "overview",   label: "نظرة عامة",       icon: LayoutDashboard },
  { id: "portfolio",  label: "معرض الأعمال",    icon: BookOpen },
  { id: "services",   label: "الخدمات والأسعار", icon: Wrench },
  { id: "reviews",    label: "التقييمات",        icon: Star },
  { id: "settings",   label: "إعدادات الحساب",   icon: Settings },
];

// Tabs visible to visitor
const VISITOR_TABS = [
  { id: "overview",   label: "نظرة عامة",       icon: LayoutDashboard },
  { id: "portfolio",  label: "معرض الأعمال",    icon: BookOpen },
  { id: "services",   label: "الخدمات والأسعار", icon: Wrench },
  { id: "reviews",    label: "التقييمات",        icon: Star },
];

// ══════════════════════════════════════════════════════════════
// TOAST CONTEXT
// ══════════════════════════════════════════════════════════════
const ToastContext = createContext(null);
const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 flex-col gap-2" style={{ minWidth: 260 }}>
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div
              key={t.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-xl ${t.type === "success" ? "bg-[#001e3c]" : "bg-red-600"}`}
            >
              {t.type === "success" ? <CheckCircle size={16} className="text-orange-400" /> : <XCircle size={16} />}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
const useToast = () => useContext(ToastContext);

// ══════════════════════════════════════════════════════════════
// LIGHTBOX
// ══════════════════════════════════════════════════════════════
const Lightbox = ({ images, initialIndex, onClose }) => {
  const [current, setCurrent] = useState(initialIndex);
  const prev = () => setCurrent(i => (i - 1 + images.length) % images.length);
  const next = () => setCurrent(i => (i + 1) % images.length);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="relative w-full max-w-3xl"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute -top-10 right-0 text-white/70 hover:text-white transition">
          <IconX size={28} />
        </button>
        <img src={images[current].url} alt={images[current].caption} className="w-full max-h-[75vh] object-contain rounded-2xl" />
        <p className="text-center text-white/70 text-sm mt-3">{images[current].caption}</p>
        {images.length > 1 && (
          <div className="absolute inset-y-0 flex items-center justify-between w-full px-2 pointer-events-none">
            <button onClick={prev} className="pointer-events-auto bg-black/40 hover:bg-black/70 text-white rounded-full p-2 transition">
              <ChevronRight size={22} />
            </button>
            <button onClick={next} className="pointer-events-auto bg-black/40 hover:bg-black/70 text-white rounded-full p-2 transition">
              <ChevronLeft size={22} />
            </button>
          </div>
        )}
        <div className="flex justify-center gap-1.5 mt-3">
          {images.map((_, i) => (
            <button key={i} onClick={() => setCurrent(i)}
              className={`h-1.5 rounded-full transition-all ${i === current ? "w-6 bg-orange-400" : "w-1.5 bg-white/30"}`} />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

// ══════════════════════════════════════════════════════════════
// STAR RATING
// ══════════════════════════════════════════════════════════════
const StarRating = ({ rating, size = 14 }) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map(s => (
      <Star key={s} size={size}
        className={s <= Math.round(rating) ? "text-orange-400 fill-orange-400" : "text-gray-200 fill-gray-200"} />
    ))}
  </div>
);

// ══════════════════════════════════════════════════════════════
// PROFILE HEADER CARD (top of page)
// ══════════════════════════════════════════════════════════════
const WorkerHeader = ({ worker, isOwner, onUploadImage, saving }) => {
  const [imageHover, setImageHover] = useState(false);
  const fileInputRef = React.useRef(null);
  const availability = AVAILABILITY_MAP[worker.status] || AVAILABILITY_MAP["متاح"];
  const fullName = `${worker.firstName} ${worker.lastName}`;
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=001e3c&color=ff9800&size=200&bold=true`;

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative mb-6 overflow-hidden rounded-3xl shadow-2xl"
      style={{ background: "linear-gradient(135deg, #001e3c 0%, #003a6e 60%, #00285a 100%)" }}
    >
      {/* Decorative */}
      <div className="absolute -top-16 -left-16 h-48 w-48 rounded-full opacity-10" style={{ background: "#ff9800" }} />
      <div className="absolute -bottom-10 -right-10 h-36 w-36 rounded-full opacity-5" style={{ background: "#ff9800" }} />

      {isOwner && <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={e => e.target.files[0] && onUploadImage(e.target.files[0])} />}

      <div className="relative p-6 sm:p-8">
        <div className="flex flex-col items-center gap-6 sm:flex-row sm:items-end">
          {/* Avatar */}
          <div
            className={`relative shrink-0 ${isOwner ? "cursor-pointer" : ""}`}
            onClick={() => isOwner && !saving && fileInputRef.current?.click()}
            onMouseEnter={() => isOwner && setImageHover(true)}
            onMouseLeave={() => setImageHover(false)}
          >
            <div className="h-24 w-24 sm:h-28 sm:w-28 overflow-hidden rounded-2xl ring-4 ring-orange-400/50 relative">
              <img
                src={worker.profileImage || avatarUrl}
                alt={fullName}
                className={`h-full w-full object-cover transition-all duration-300 ${saving ? "blur-sm opacity-50" : ""}`}
                style={{ transform: imageHover && isOwner ? "scale(1.08)" : "scale(1)" }}
                onError={e => { e.target.src = avatarUrl; }}
              />
              {saving && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Loader2 className="animate-spin text-orange-400" size={24} />
                </div>
              )}
            </div>
            <AnimatePresence>
              {imageHover && isOwner && !saving && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                  className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 backdrop-blur-sm">
                  <Camera size={24} className="text-white" />
                </motion.div>
              )}
            </AnimatePresence>
            <span className="absolute -bottom-1 -left-1 h-5 w-5 rounded-full border-2 border-[#001e3c]"
              style={{ background: availability.dot }} />
          </div>

          {/* Info */}
          <div className="flex-1 text-center sm:text-right text-white">
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
              <h1 className="text-2xl sm:text-3xl font-black">{fullName}</h1>
              {worker.isVerified && <BadgeCheck size={22} className="text-orange-400 shrink-0" />}
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-2 mb-3">
              <span className="rounded-full px-3 py-0.5 text-xs font-bold" style={{ background: "rgba(255,152,0,0.2)", color: "#ffb74d" }}>
                {worker.category}
              </span>
              <span className="rounded-full px-3 py-0.5 text-xs font-bold" style={{ background: availability.bg, color: availability.color }}>
                {worker.status}
              </span>
              {isOwner && (
                <span className="rounded-full px-3 py-0.5 text-xs font-bold" style={{ background: "rgba(255,255,255,0.12)", color: "#fff" }}>
                  ملفك الشخصي
                </span>
              )}
            </div>
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 text-sm text-blue-200">
              {worker.city && <span className="flex items-center gap-1"><MapPin size={13} />{worker.city}</span>}
              <span className="flex items-center gap-1"><Mail size={13} />{worker.email}</span>
            </div>
          </div>

          {/* ── RBAC: Action Buttons ── */}
          <div className="flex flex-col gap-2.5 w-full sm:w-auto">
            {isOwner ? (
              /* OWNER buttons */
              <>
                <motion.button
                  whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition"
                  style={{ background: "linear-gradient(135deg, #ff9800, #f57c00)" }}
                >
                  <Edit3 size={16} />
                  تعديل الملف الشخصي
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  <BarChart2 size={16} />
                  إحصائيات الحساب
                </motion.button>
              </>
            ) : (
              /* VISITOR buttons */
              <>
                <motion.button
                  whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-center gap-2 rounded-xl px-6 py-3 text-sm font-bold text-white shadow-lg transition"
                  style={{ background: "linear-gradient(135deg, #ff9800, #f57c00)" }}
                >
                  <CalendarCheck size={16} />
                  احجز الآن
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.97 }} whileHover={{ scale: 1.02 }}
                  className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/10 px-6 py-3 text-sm font-bold text-white backdrop-blur-sm transition hover:bg-white/20"
                >
                  <MessageCircle size={16} />
                  راسل العامل
                </motion.button>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// ══════════════════════════════════════════════════════════════
// STATS BAR
// ══════════════════════════════════════════════════════════════
const StatsBar = ({ worker }) => {
  const stats = [
    { icon: Briefcase,    label: "سنوات الخبرة", value: `${worker.yearsOfExperience}+`, color: "#001e3c" },
    { icon: Star,         label: "التقييم العام", value: worker.rating,                 color: "#f59e0b", isRating: true },
    { icon: CheckCircle,  label: "مهام منجزة",   value: worker.completedJobs,           color: "#16a34a" },
    { icon: Award,        label: "عدد التقييمات", value: worker.reviewsCount,           color: "#7c3aed" },
  ];
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
      {stats.map((s, i) => (
        <motion.div
          key={s.label}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.07 }}
          className="flex flex-col items-center gap-2 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm text-center hover:shadow-md hover:border-orange-200 transition-all duration-300"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl" style={{ background: `${s.color}15` }}>
            <s.icon size={18} style={{ color: s.color }} />
          </div>
          {s.isRating ? (
            <div className="flex flex-col items-center gap-0.5">
              <span className="text-xl font-black text-gray-800">{s.value}</span>
              <StarRating rating={s.value} size={11} />
            </div>
          ) : (
            <span className="text-xl font-black text-gray-800">{s.value}</span>
          )}
          <span className="text-xs text-gray-400 font-medium">{s.label}</span>
        </motion.div>
      ))}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// SIDEBAR NAV
// ══════════════════════════════════════════════════════════════
const WorkerSidebar = ({ worker, isOwner, activeTab, setActiveTab }) => {
  const fullName = `${worker.firstName} ${worker.lastName}`;
  const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName)}&background=ff9800&color=fff&size=200&bold=true`;
  const tabs = isOwner ? OWNER_TABS : VISITOR_TABS;

  return (
    <aside className="lg:col-span-1">
      <div className="sticky top-6 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        {/* Mini profile */}
        <div className="border-b border-gray-50 p-5 text-center">
          <img
            src={worker.profileImage || avatarUrl}
            alt={fullName}
            className="mx-auto mb-2 h-14 w-14 rounded-full object-cover ring-2 ring-orange-200"
            onError={e => { e.target.src = avatarUrl; }}
          />
          <p className="text-sm font-bold text-gray-800">{fullName}</p>
          <p className="text-xs text-gray-400">{worker.category}</p>
          <div className="mt-2 flex justify-center">
            <StarRating rating={worker.rating} size={12} />
          </div>
        </div>

        {/* Tabs */}
        <nav className="p-3">
          {tabs.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${activeTab === tab.id ? "bg-[#001e3c] text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}
            >
              <tab.icon size={16} className={activeTab === tab.id ? "text-orange-400" : ""} />
              <span className="flex-1 text-right">{tab.label}</span>
              <ChevronRight size={14} className={activeTab === tab.id ? "rotate-180 text-orange-400" : "text-gray-300"} />
            </button>
          ))}
        </nav>

        {/* ── RBAC: Visitor quick-book card ── */}
        {!isOwner && (
          <div className="border-t border-gray-50 p-4 flex flex-col gap-2">
            <button
              className="flex items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-bold text-white transition hover:opacity-90"
              style={{ background: "linear-gradient(135deg, #ff9800, #f57c00)" }}
            >
              <CalendarCheck size={15} />
              احجز الآن
            </button>
            <button className="flex items-center justify-center gap-2 rounded-xl border border-gray-200 py-2.5 text-sm font-bold text-gray-600 transition hover:bg-gray-50">
              <Phone size={15} />
              اتصل بالعامل
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
const OverviewTab = ({ worker, isOwner }) => (
  <div className="flex flex-col gap-5">
    {/* Bio */}
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-50">
          <Info size={13} className="text-green-600" />
        </div>
        <h3 className="text-sm font-bold text-gray-800">نبذة عني</h3>
      </div>
      <p className="text-sm text-gray-600 leading-relaxed">{worker.bio}</p>
    </div>

    {/* Info grid */}
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[
        { icon: Phone,    label: "الهاتف",     value: worker.phone },
        { icon: MapPin,   label: "الموقع",     value: worker.city },
        { icon: Clock,    label: "الخبرة",     value: `${worker.yearsOfExperience} سنوات` },
        { icon: Shield,   label: "التخصص",    value: worker.subcategory },
        { icon: Mail,     label: "البريد",     value: worker.email },
        { icon: Briefcase,label: "المهام المنجزة", value: `${worker.completedJobs} مهمة` },
      ].map(item => (
        <div key={item.label} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
          <item.icon size={14} className="text-orange-400 shrink-0" />
          <div>
            <p className="text-xs text-gray-400 font-medium">{item.label}</p>
            <p className="text-xs font-semibold text-gray-700">{item.value}</p>
          </div>
        </div>
      ))}
    </div>

    {/* ── RBAC: Trust badges for visitor ── */}
    {!isOwner && (
      <div className="rounded-2xl border border-gray-100 bg-orange-50/40 p-4">
        <p className="text-xs font-bold text-gray-700 mb-3">ضمانات تدبير</p>
        <div className="flex flex-col gap-2">
          {[
            { icon: Shield,    text: "ضمان جودة العمل" },
            { icon: BadgeCheck,text: "عامل موثق ومعتمد" },
            { icon: Clock,     text: "دفع بعد اكتمال الخدمة" },
          ].map(item => (
            <div key={item.text} className="flex items-center gap-2 text-xs text-gray-600">
              <item.icon size={13} className="text-green-500 shrink-0" />
              {item.text}
            </div>
          ))}
        </div>
      </div>
    )}

    {/* ── RBAC: Owner sees quick-stats panel instead ── */}
    {isOwner && (
      <div className="rounded-2xl border border-blue-100 bg-blue-50/40 p-4">
        <p className="text-xs font-bold text-gray-700 mb-3">ملخص الأداء هذا الشهر</p>
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "طلبات جديدة", value: "12" },
            { label: "مكتملة",      value: "9" },
            { label: "ملغاة",       value: "1" },
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
const PortfolioTab = ({ images, isOwner }) => {
  const [lightboxIndex, setLightboxIndex] = useState(null);
  return (
    <div>
      {/* ── RBAC: Owner sees upload button ── */}
      {isOwner && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="mb-4 flex items-center gap-2 rounded-xl border border-dashed border-orange-300 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-500 hover:bg-orange-100 transition"
        >
          <ImagePlus size={15} />
          إضافة صورة جديدة
        </motion.button>
      )}

      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
        {images.map((img, i) => (
          <motion.div
            key={img.id}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.05 }}
            className="group relative cursor-pointer overflow-hidden rounded-2xl aspect-[4/3] bg-gray-100"
            onClick={() => setLightboxIndex(i)}
          >
            <img src={img.url} alt={img.caption}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-3">
              <p className="text-white text-xs font-semibold">{img.caption}</p>
            </div>
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90">
                <ZoomIn size={13} className="text-gray-700" />
              </div>
            </div>
            {/* ── RBAC: Delete button for owner ── */}
            {isOwner && (
              <div className="absolute top-2 left-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                <button
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-red-500/90 text-white hover:bg-red-600"
                  onClick={e => { e.stopPropagation(); }}
                >
                  <Trash2 size={12} />
                </button>
              </div>
            )}
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {lightboxIndex !== null && (
          <Lightbox images={images} initialIndex={lightboxIndex} onClose={() => setLightboxIndex(null)} />
        )}
      </AnimatePresence>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// TAB: SERVICES
// ══════════════════════════════════════════════════════════════
const ServicesTab = ({ services, isOwner }) => (
  <div>
    {/* ── RBAC: Owner can add a service ── */}
    {isOwner && (
      <motion.button
        whileTap={{ scale: 0.97 }}
        className="mb-4 flex items-center gap-2 rounded-xl border border-dashed border-orange-300 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-500 hover:bg-orange-100 transition"
      >
        <Tag size={15} />
        إضافة خدمة جديدة
      </motion.button>
    )}

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {services.map((s, i) => (
        <motion.div
          key={s.name}
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.06 }}
          className="group flex items-center justify-between gap-3 rounded-2xl border border-gray-100 bg-gray-50 px-4 py-3 hover:border-orange-200 hover:bg-orange-50/30 transition-all duration-200"
        >
          <div className="flex items-center gap-2.5">
            <div className="h-2 w-2 rounded-full bg-orange-400 shrink-0" />
            <span className="text-sm font-semibold text-gray-700">{s.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-orange-500 whitespace-nowrap">{s.price}</span>
            {/* ── RBAC: Edit icon for owner ── */}
            {isOwner && (
              <button className="opacity-0 group-hover:opacity-100 transition text-gray-400 hover:text-orange-500">
                <Edit3 size={13} />
              </button>
            )}
          </div>
        </motion.div>
      ))}
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════
// TAB: REVIEWS
// ══════════════════════════════════════════════════════════════
const ReviewsTab = ({ reviews, rating, reviewsCount, isOwner }) => (
  <div>
    <div className="flex items-center justify-between mb-4">
      <div className="flex items-center gap-1.5">
        <span className="text-2xl font-black text-gray-800">{rating}</span>
        <div className="flex flex-col gap-0.5">
          <StarRating rating={rating} size={13} />
          <span className="text-xs text-gray-400">{reviewsCount} تقييم</span>
        </div>
      </div>
      {/* ── RBAC: Visitor can add review, owner cannot ── */}
      {!isOwner && (
        <motion.button
          whileTap={{ scale: 0.97 }}
          className="flex items-center gap-1.5 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow-md"
        >
          <Star size={13} />
          أضف تقييمك
        </motion.button>
      )}
    </div>

    <div className="flex flex-col gap-3">
      {reviews.map((r, i) => (
        <motion.div
          key={r.id}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: i * 0.08 }}
          className="rounded-2xl border border-gray-100 bg-gray-50 p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#001e3c] text-xs font-bold text-orange-400">
                {r.name.charAt(0)}
              </div>
              <span className="text-sm font-bold text-gray-700">{r.name}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <StarRating rating={r.rating} size={12} />
              <span className="text-xs text-gray-400">{new Date(r.date).toLocaleDateString("ar-SA")}</span>
            </div>
          </div>
          <p className="text-xs text-gray-600 leading-relaxed">{r.comment}</p>
        </motion.div>
      ))}
    </div>
  </div>
);

// ══════════════════════════════════════════════════════════════
// TAB: SETTINGS (Owner only)
// ══════════════════════════════════════════════════════════════
const SettingsTab = ({ worker }) => {
  const toast = useToast();
  const [availability, setAvailability] = useState(worker.status);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1200));
    setSaving(false);
    toast("تم حفظ الإعدادات بنجاح ✓");
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Availability */}
      <div>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">حالة التوفر</h4>
        <div className="flex gap-2 flex-wrap">
          {Object.entries(AVAILABILITY_MAP).map(([status, meta]) => (
            <button
              key={status}
              onClick={() => setAvailability(status)}
              className="flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-bold transition border"
              style={availability === status
                ? { background: meta.bg, color: meta.color, borderColor: meta.color }
                : { background: "#f9fafb", color: "#6b7280", borderColor: "#e5e7eb" }}
            >
              <span className="h-2 w-2 rounded-full" style={{ background: meta.dot }} />
              {status}
            </button>
          ))}
        </div>
      </div>

      {/* Notification prefs */}
      <div>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">الإشعارات</h4>
        <div className="flex flex-col gap-3">
          {[
            { label: "إشعارات الطلبات الجديدة", defaultOn: true },
            { label: "إشعارات التقييمات",       defaultOn: true },
            { label: "نشرة الأسبوعية",           defaultOn: false },
          ].map(pref => {
            const [on, setOn] = useState(pref.defaultOn);
            return (
              <div key={pref.label} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-4 py-3">
                <span className="text-sm font-medium text-gray-700">{pref.label}</span>
                <button onClick={() => setOn(v => !v)} className="text-gray-400 hover:text-orange-500 transition">
                  {on ? <ToggleRight size={24} className="text-orange-500" /> : <ToggleLeft size={24} />}
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security */}
      <div>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">الأمان</h4>
        <div className="flex flex-col gap-2">
          <button className="flex items-center gap-2 rounded-xl border border-gray-100 bg-gray-50 px-4 py-3 text-sm font-medium text-gray-700 hover:border-orange-200 hover:bg-orange-50/30 transition text-right w-full">
            <Lock size={14} className="text-orange-400 shrink-0" />
            تغيير كلمة المرور
          </button>
          <button className="flex items-center gap-2 rounded-xl border border-red-100 bg-red-50/40 px-4 py-3 text-sm font-medium text-red-500 hover:bg-red-50 transition text-right w-full">
            <AlertTriangle size={14} className="shrink-0" />
            تعطيل الحساب مؤقتاً
          </button>
        </div>
      </div>

      {/* Save */}
      <div className="flex justify-end border-t border-gray-50 pt-4">
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 rounded-xl px-6 py-2.5 text-sm font-bold text-white shadow-md transition disabled:opacity-60"
          style={{ background: "linear-gradient(135deg, #ff9800, #f57c00)" }}
        >
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />}
          {saving ? "جاري الحفظ..." : "حفظ الإعدادات"}
        </button>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// MOBILE FLOATING ACTIONS — RBAC-aware
// ══════════════════════════════════════════════════════════════
const FloatingActions = ({ isOwner, activeTab, setActiveTab }) => {
  if (isOwner) {
    return (
      <div className="fixed bottom-0 left-0 right-0 z-40 flex gap-3 border-t border-gray-100 bg-white/95 p-4 backdrop-blur-md sm:hidden">
        <button
          onClick={() => setActiveTab("settings")}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-50"
        >
          <Settings size={15} />
          الإعدادات
        </button>
        <button
          onClick={() => setActiveTab("overview")}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow-lg transition"
          style={{ background: "linear-gradient(135deg, #ff9800, #f57c00)" }}
        >
          <Edit3 size={15} />
          تعديل الملف
        </button>
      </div>
    );
  }
  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 flex gap-3 border-t border-gray-100 bg-white/95 p-4 backdrop-blur-md sm:hidden">
      <button className="flex flex-1 items-center justify-center gap-2 rounded-xl border border-gray-200 py-3 text-sm font-bold text-gray-600 transition hover:bg-gray-50">
        <MessageCircle size={15} />
        رسالة
      </button>
      <button
        className="flex flex-1 items-center justify-center gap-2 rounded-xl py-3 text-sm font-bold text-white shadow-lg transition"
        style={{ background: "linear-gradient(135deg, #ff9800, #f57c00)" }}
      >
        <CalendarCheck size={15} />
        احجز الآن
      </button>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// MOBILE TAB BAR (small screens)
// ══════════════════════════════════════════════════════════════
const MobileTabBar = ({ activeTab, setActiveTab, isOwner }) => {
  const tabs = isOwner ? OWNER_TABS : VISITOR_TABS;
  return (
    <div className="flex gap-1 mb-5 overflow-x-auto pb-1 lg:hidden">
      {tabs.map(tab => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold whitespace-nowrap transition ${activeTab === tab.id ? "bg-[#001e3c] text-white" : "bg-white border border-gray-100 text-gray-500"}`}
        >
          <tab.icon size={13} className={activeTab === tab.id ? "text-orange-400" : ""} />
          {tab.label}
        </button>
      ))}
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// MAIN EXPORT
// ══════════════════════════════════════════════════════════════
const WorkerProfileContent = ({ worker = MOCK_WORKER, currentUser = MOCK_CURRENT_USER }) => {
  const isOwner = currentUser?.id === worker.id;
  const [activeTab, setActiveTab] = useState("overview");
  const [saving, setSaving] = useState(false);
  const toast = useToast();

  const handleUploadImage = async (file) => {
    setSaving(true);
    await new Promise(r => setTimeout(r, 1500)); // simulate API call
    setSaving(false);
    toast("تم تحديث الصورة الشخصية بنجاح ✓");
  };

  const tabContent = {
    overview:  <OverviewTab  worker={worker} isOwner={isOwner} />,
    portfolio: <PortfolioTab images={worker.portfolioImages} isOwner={isOwner} />,
    services:  <ServicesTab  services={worker.services} isOwner={isOwner} />,
    reviews:   <ReviewsTab   reviews={worker.reviews} rating={worker.rating} reviewsCount={worker.reviewsCount} isOwner={isOwner} />,
    settings:  isOwner ? <SettingsTab worker={worker} /> : null,
  };

  return (
    <div dir="rtl" className="min-h-screen bg-[#f8f6f3] p-4 pb-28 sm:p-6 sm:pb-6 lg:p-10">
      <div className="mx-auto max-w-5xl">

        {/* Profile Header */}
        <WorkerHeader worker={worker} isOwner={isOwner} onUploadImage={handleUploadImage} saving={saving} />

        {/* Stats Bar */}
        <StatsBar worker={worker} />

        {/* Mobile Tab Scroll */}
        <MobileTabBar activeTab={activeTab} setActiveTab={setActiveTab} isOwner={isOwner} />

        {/* Main Grid: Sidebar + Content */}
        <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">

          {/* Sidebar (hidden on mobile, uses MobileTabBar instead) */}
          <div className="hidden lg:block lg:col-span-1">
            <WorkerSidebar
              worker={worker}
              isOwner={isOwner}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
            />
          </div>

          {/* Content Panel */}
          <main className="lg:col-span-3">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm min-h-[400px]">
              {/* Panel heading */}
              <div className="mb-5 border-b border-gray-50 pb-4 flex items-center justify-between">
                <h2 className="text-base font-black text-gray-800">
                  {(isOwner ? OWNER_TABS : VISITOR_TABS).find(t => t.id === activeTab)?.label}
                </h2>
                {/* RBAC tag */}
                <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${isOwner ? "bg-orange-50 text-orange-500" : "bg-blue-50 text-blue-600"}`}>
                  {isOwner ? "أنت المالك" : "زائر"}
                </span>
              </div>

              {/* Animated Tab Content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {tabContent[activeTab]}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>

      {/* Mobile Floating Actions */}
      <FloatingActions isOwner={isOwner} activeTab={activeTab} setActiveTab={setActiveTab} />
    </div>
  );
};

const WorkerProfile = ({ worker, currentUser }) => (
  <ToastProvider>
   
    <WorkerProfileContent worker={worker} currentUser={currentUser} />
  </ToastProvider>
);

export default WorkerProfile;
