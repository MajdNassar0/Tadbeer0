import { useState, useRef, useCallback , useEffect } from "react";
import { useNavigate } from "react-router-dom";

const API_BASE = "https://tadbeer0.runasp.net/api";
const getImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  const fixedPath = path.startsWith("/") ? path : `/${path}`;
  return `https://tadbeer0.runasp.net${fixedPath}`;
};

const THEME = {
  primaryDark: "#0B1E36",
  primary: "#F97316",
  primaryHover: "#EA580C",
  primaryLight: "#FFF7ED",
  textMain: "#1F2937",
  textMuted: "#6B7280",
  bgCanvas: "#F8FAFC",
  bgCard: "#FFFFFF",
  border: "#E2E8F0",
  success: "#10B981",
  errorBg: "#FCEBEB",
  errorBorder: "#F87171",
  errorText: "#991B1B",
};

/* ── Extract array from any API response shape ── */
const extractArray = (data) => {
  if (!data) return [];
  if (Array.isArray(data)) return data;
  // try every known key (case-insensitive) in priority order
  const keys = Object.keys(data);
  const ordered = [
    "workers","Workers","services","Services","specialties","Specialties",
    "items","Items","data","Data","result","Result","results","Results","list","List",
  ];
  for (const k of ordered) {
    if (Array.isArray(data[k]) && data[k].length > 0) return data[k];
  }
  // last resort: first array-valued property
  for (const k of keys) {
    if (Array.isArray(data[k])) return data[k];
  }
  return [];
};

/* ── Fetch workers from multiple possible endpoints ── */
const fetchWorkers = async () => {
  const endpoints = [
    `${API_BASE}/General/Workers?pageSize=200`,
    `${API_BASE}/General/Worker?pageSize=200`,
    `${API_BASE}/Workers?pageSize=200`,
    `${API_BASE}/General/Workers`,
    `${API_BASE}/General/Worker`,
  ];
  for (const url of endpoints) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const raw = await res.json();
      const arr = extractArray(raw);
      if (arr.length > 0) return { arr, raw, url };
    } catch (_) { continue; }
  }
  // Return raw from first responding endpoint even if empty (for debug)
  for (const url of endpoints) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const raw = await res.json();
      return { arr: [], raw, url };
    } catch (_) { continue; }
  }
  return { arr: [], raw: null, url: null };
};

/* ── Fetch services from multiple possible endpoints ── */
const fetchServices = async () => {
  const endpoints = [
    `${API_BASE}/General/Specialties?pageSize=100`,
    `${API_BASE}/General/Services?pageSize=100`,
    `${API_BASE}/General/Specialties`,
    `${API_BASE}/General/Services`,
    `${API_BASE}/Specialties?pageSize=100`,
    `${API_BASE}/Services?pageSize=100`,
  ];
  for (const url of endpoints) {
    try {
      const res = await fetch(url);
      if (!res.ok) continue;
      const data = await res.json();
      const arr = extractArray(data);
      if (arr.length > 0) return arr;
    } catch (_) { continue; }
  }
  return [];
};

/* ─── Tiny helpers ─── */
const STAR = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#F59E0B" : "none"} stroke="#F59E0B" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);
const StarRating = ({ rating }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {[1,2,3,4,5].map((s) => <STAR key={s} filled={s <= Math.round(rating || 0)} />)}
  </div>
);
const Spinner = ({ color = "#fff", size = 18 }) => (
  <span style={{
    display: "inline-block", width: size, height: size,
    border: `2.5px solid ${color}40`, borderTopColor: color,
    borderRadius: "50%", animation: "spin 0.7s linear infinite",
  }} />
);

/* ─── Worker Card ─── */
const WorkerCard = ({ worker, onSelect }) => {
  const [hovered, setHovered] = useState(false);
  const specialtiesText = worker.specialtyNames?.join(" · ") || "خدمات عامة";
  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: THEME.bgCard,
        border: `1px solid ${hovered ? THEME.primaryDark : THEME.border}`,
        borderRadius: "20px", padding: "1.5rem",
        display: "flex", flexDirection: "column", gap: "1.25rem",
        transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
        boxShadow: hovered ? "0 12px 25px -5px rgba(11,30,54,0.15)" : "0 2px 6px rgba(0,0,0,0.03)",
        transform: hovered ? "translateY(-4px)" : "none",
        direction: "rtl", position: "relative", overflow: "hidden",
      }}
    >
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <div style={{ width: 64, height: 64, borderRadius: 14, overflow: "hidden", flexShrink: 0, background: THEME.bgCanvas, border: `1px solid ${THEME.border}` }}>
          {worker.profileImage ? (
            <img src={getImageUrl(worker.profileImage)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 20, color: THEME.primary, background: THEME.primaryLight }}>
              {worker.firstName?.[0]}
            </div>
          )}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ margin: 0, fontSize: 16, fontWeight: 700, color: THEME.textMain, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {worker.firstName} {worker.lastName}
          </h3>
          <p style={{ margin: "4px 0 6px", fontSize: 13, color: "#475569", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {specialtiesText}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <StarRating rating={worker.avgRating} />
            <span style={{ fontSize: 12, fontWeight: 700, color: THEME.textMuted, marginTop: 2 }}>({worker.avgRating || 0})</span>
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>
        <div style={{ background: THEME.bgCanvas, border: `1px solid ${THEME.border}`, padding: 10, borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: THEME.textMuted, fontWeight: 500, marginBottom: 2 }}>الخبرة</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: THEME.textMain }}>{worker.experienceYears || 0} سنوات</span>
        </div>
        <div style={{ background: THEME.bgCanvas, border: `1px solid ${THEME.border}`, padding: 10, borderRadius: 12, display: "flex", flexDirection: "column", alignItems: "center" }}>
          <span style={{ fontSize: 11, color: THEME.textMuted, fontWeight: 500, marginBottom: 2 }}>الموقع</span>
          <span style={{ fontSize: 13, fontWeight: 700, color: THEME.textMain, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%", textAlign: "center" }}>{worker.city || "غير محدد"}</span>
        </div>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: "auto" }}>
        <button
          onClick={(e) => { e.stopPropagation(); window.location.href = `/booking/${worker.id}`; }}
          style={{ width: "100%", padding: 11, background: THEME.primary, color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 13, cursor: "pointer", fontFamily: "'Cairo', sans-serif", transition: "background 0.2s" }}
          onMouseEnter={(e) => e.currentTarget.style.background = THEME.primaryHover}
          onMouseLeave={(e) => e.currentTarget.style.background = THEME.primary}
        >احجز موعد الآن</button>
        <button
          onClick={(e) => { e.stopPropagation(); window.location.href = `/worker-profile/${worker.id}`; }}
          style={{ width: "100%", padding: 11, background: "transparent", color: THEME.textMain, border: `1px solid ${THEME.border}`, borderRadius: 10, fontWeight: 600, fontSize: 13, cursor: "pointer", fontFamily: "'Cairo', sans-serif", transition: "all 0.2s" }}
          onMouseEnter={(e) => { e.currentTarget.style.background = THEME.bgCanvas; e.currentTarget.style.borderColor = THEME.primaryDark; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.borderColor = THEME.border; }}
        >عرض الملف الشخصي</button>
      </div>
    </div>
  );
};

/* ─── 🌟 كارد الخدمات العمودي (طويل، مرتب وممركز) 🌟 ─── */
const ServiceCard = ({ service, onClick }) => {
  const [hovered, setHovered] = useState(false);

  // دالة لتجهيز رابط الصورة للأيقونات من السيرفر
  const getCardImageUrl = (url) => {
    if (!url) return "https://tadbeer0.runasp.net/uploads/specialty-icons/default.png";
    let cleanUrl = url.replace(/\\/g, "/").trim();
    cleanUrl = cleanUrl.replace(/^\/+/, "");
    if (cleanUrl.startsWith("http")) return cleanUrl;
    if (cleanUrl.startsWith("uploads/")) return `https://tadbeer0.runasp.net/${cleanUrl}`;
    return `https://tadbeer0.runasp.net/uploads/${cleanUrl}`;
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick} // 🌟 هنا يتم تشغيل الـ Endpoint/Navigate الممرر من الـ map عند الضغط
      className="bg-white p-6 rounded-[1.8rem] border border-gray-100 shadow-sm flex flex-col items-center text-center transition-all duration-300 hover:shadow-lg cursor-pointer group relative min-h-[240px] justify-center"
      style={{ direction: "rtl" }}
    >
      {/* حاوية الأيقونة */}
      <div className="w-20 h-20 mb-4 flex items-center justify-center bg-gray-50 rounded-2xl overflow-hidden p-2 border border-gray-50">
        {service.iconUrl ? (
          <img
            src={getCardImageUrl(service.iconUrl)}
            alt={service.name}
            className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "https://tadbeer0.runasp.net/uploads/specialty-icons/default.png";
            }}
          />
        ) : (
          <div className="w-full h-full bg-[#f3eee3] flex items-center justify-center text-3xl">🔧</div>
        )}
      </div>

      {/* نصوص الكارد */}
      <div className="flex flex-col gap-2 w-full flex-1 justify-center">
        <h4 className="font-bold text-[#002b5b] text-base group-hover:text-yellow-600 transition-colors font-sans truncate px-2">
          {service.name}
        </h4>
        
        <p className="text-gray-500 text-xs leading-relaxed line-clamp-2 font-sans px-2">
          {service.description || "استكشف الفنيين المتاحين لهذه الخدمة."}
        </p>
      </div>

      {/* سهم التوجيه */}
      <div className="absolute bottom-3 text-yellow-500 text-xs font-bold font-sans opacity-0 transform translate-y-2 transition-all duration-300 group-hover:opacity-100 group-hover:translate-y-0">
        عرض الفنيين ←
      </div>
    </div>
  );
};

/* ─── Worker Detail Modal ─── */
const WorkerModal = ({ worker, onClose }) => {
  if (!worker) return null;
  const initials = `${worker.firstName?.[0] || ""}${worker.lastName?.[0] || ""}`.toUpperCase();
  return (
    <div onClick={onClose} style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16, backdropFilter: "blur(5px)" }}>
      <div onClick={(e) => e.stopPropagation()} style={{ background: THEME.bgCard, borderRadius: 18, padding: "1.75rem", width: "100%", maxWidth: 480, border: `1px solid ${THEME.border}`, boxShadow: "0 25px 50px -12px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            {worker.profileImage ? (
              <img src={getImageUrl(worker.profileImage)} alt="" style={{ width: 68, height: 68, borderRadius: "50%", objectFit: "cover", border: `3px solid ${THEME.primaryLight}` }} />
            ) : (
              <div style={{ width: 68, height: 68, borderRadius: "50%", background: THEME.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 22, color: THEME.primary }}>{initials}</div>
            )}
            <div>
              <h2 style={{ margin: 0, fontSize: 19, fontWeight: 700, color: THEME.textMain }}>{worker.firstName} {worker.lastName}</h2>
              {worker.city && <p style={{ margin: "4px 0 0", fontSize: 13, color: THEME.textMuted }}>📍 {worker.city}</p>}
              <div style={{ marginTop: 5 }}><StarRating rating={worker.avgRating} /></div>
            </div>
          </div>
          <button onClick={onClose} style={{ background: "none", border: "none", cursor: "pointer", fontSize: 22, color: THEME.textMuted, lineHeight: 1, padding: 4 }}>✕</button>
        </div>
        {worker.jobDescription && (
          <p style={{ fontSize: 14, color: THEME.textMuted, lineHeight: 1.65, margin: "0 0 18px", background: THEME.bgCanvas, padding: "10px 14px", borderRadius: 10, border: `1px solid ${THEME.border}` }}>{worker.jobDescription}</p>
        )}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
          {worker.experienceYears != null && (
            <div style={{ background: THEME.bgCanvas, borderRadius: 10, padding: "12px 14px", border: `1px solid ${THEME.border}` }}>
              <p style={{ fontSize: 11, color: THEME.textMuted, margin: "0 0 5px" }}>سنوات الخبرة</p>
              <p style={{ fontSize: 22, fontWeight: 700, margin: 0, color: THEME.primary }}>{worker.experienceYears}</p>
            </div>
          )}
          {worker.avgRating != null && (
            <div style={{ background: THEME.bgCanvas, borderRadius: 10, padding: "12px 14px", border: `1px solid ${THEME.border}` }}>
              <p style={{ fontSize: 11, color: THEME.textMuted, margin: "0 0 5px" }}>التقييم</p>
              <p style={{ fontSize: 22, fontWeight: 700, margin: 0, color: THEME.primary }}>{worker.avgRating?.toFixed(1)} ⭐</p>
            </div>
          )}
        </div>
        {worker.specialtyNames?.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <p style={{ fontSize: 12, color: THEME.textMuted, margin: "0 0 9px", fontWeight: 600 }}>التخصصات</p>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
              {worker.specialtyNames.map((s, i) => (
                <span key={i} style={{ fontSize: 12, padding: "5px 12px", background: THEME.primaryLight, color: THEME.primary, borderRadius: 20, fontWeight: 600, border: `1px solid rgba(249,115,22,0.2)` }}>{s}</span>
              ))}
            </div>
          </div>
        )}
        {worker.workImages?.length > 0 && (
          <div style={{ marginBottom: 18 }}>
            <p style={{ fontSize: 12, color: THEME.textMuted, margin: "0 0 9px", fontWeight: 600 }}>أعمال سابقة</p>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 7 }}>
              {worker.workImages.slice(0, 6).map((img, i) => (
                <img key={i} src={getImageUrl(img)} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 9 }} />
              ))}
            </div>
          </div>
        )}
        <button
          style={{ marginTop: 4, width: "100%", padding: 13, background: THEME.primary, color: "#fff", border: "none", borderRadius: 10, fontWeight: 700, fontSize: 15, cursor: "pointer", fontFamily: "'Cairo', sans-serif" }}
          onMouseEnter={(e) => e.currentTarget.style.background = THEME.primaryHover}
          onMouseLeave={(e) => e.currentTarget.style.background = THEME.primary}
        >📞 تواصل مع العامل</button>
      </div>
    </div>
  );
};

/* ─── label → icon + Arabic ─── */
const LABEL_MAP = {
  moisture:   { ar: "رطوبة وتسرب مياه",  icon: "💧" },
  crack:      { ar: "شقوق وتشققات",       icon: "🧱" },
  electrical: { ar: "مشكلة كهربائية",     icon: "⚡" },
  plumbing:   { ar: "مشكلة سباكة",        icon: "🔩" },
  paint:      { ar: "تلف دهانات",         icon: "🎨" },
  ceiling:    { ar: "تلف سقف",            icon: "🏠" },
  floor:      { ar: "تلف أرضية",          icon: "🟫" },
  door:       { ar: "مشكلة باب أو نافذة", icon: "🚪" },
  ac:         { ar: "مشكلة تكييف",        icon: "❄️" },
  roof:       { ar: "مشكلة سطح",          icon: "⛺" },
  mold:       { ar: "عفن وفطريات",        icon: "🟢" },
  insulation: { ar: "عزل مائي أو حراري",  icon: "🛡️" },
  iron:       { ar: "أعمال حدادة",        icon: "⚙️" },
};
const toLabelInfo = (raw) =>
  LABEL_MAP[raw?.toLowerCase()] || { ar: raw || "مشكلة غير محددة", icon: "🔍" };

/* ─── AI Result Panel ─── */
const AiResultPanel = ({ result, onSelectWorker, onNavigate }) => {
  const [activeSpec, setActiveSpec] = useState(null);
  const [aiWorkerPage, setAiWorkerPage] = useState(1);
  const [aiSpecPage, setAiSpecPage] = useState(1);
  const AI_PAGE_SIZE = 6;
  if (!result) return null;
  const { ar: labelAr, icon: labelIcon } = toLabelInfo(result.predictedLabel);
  const specialties = result.matchedSpecialties || [];
  const workers     = result.suggestedWorkers   || [];
  const confidence  = result.confidence != null ? Math.round(result.confidence * 100) : null;

  const totalWorkerPages = Math.ceil(workers.length / AI_PAGE_SIZE);
  const pagedAiWorkers = workers.slice((aiWorkerPage - 1) * AI_PAGE_SIZE, aiWorkerPage * AI_PAGE_SIZE);
  const totalSpecPages = Math.ceil(specialties.length / AI_PAGE_SIZE);
  const pagedSpecialties = specialties.slice((aiSpecPage - 1) * AI_PAGE_SIZE, aiSpecPage * AI_PAGE_SIZE);

  return (
    <div style={{ maxWidth: 960, margin: "1.5rem auto", padding: "0 1.5rem", animation: "fadeIn 0.4s ease" }}>
      {/* Hero diagnosis banner */}
      <div style={{
        position: "relative", borderRadius: 16, overflow: "hidden",
        marginBottom: 20, padding: "1.25rem 1.75rem",
        background: "linear-gradient(135deg, #0B1E36 0%, #0f2847 50%, #1a3352 100%)",
        boxShadow: "0 8px 24px -6px rgba(11,30,54,0.5)",
      }}>
        <div style={{ position:"absolute", top:0, left:0, right:0, height:3, background:"linear-gradient(90deg,#F97316,#FBBF24)" }} />
        <div style={{ position:"relative", display:"flex", alignItems:"center", gap:16, textAlign:"right" }}>
          <div style={{ width:56, height:56, borderRadius:14, background:"rgba(249,115,22,0.15)", border:"2px solid rgba(249,115,22,0.35)", display:"flex", alignItems:"center", justifyContent:"center", fontSize:30, flexShrink:0, boxShadow:"0 0 20px rgba(249,115,22,0.2)" }}>{labelIcon}</div>
          <div style={{ flex:1, minWidth:0 }}>
            <div style={{ display:"flex", alignItems:"center", gap:8, marginBottom:4, flexWrap:"wrap" }}>
              <span style={{ background:"rgba(249,115,22,0.2)", border:"1px solid rgba(249,115,22,0.4)", color:"#FB923C", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20, letterSpacing:"0.05em" }}>🤖 تحليل الذكاء الاصطناعي</span>
              {confidence !== null && (
                <span style={{ background:"rgba(16,185,129,0.15)", border:"1px solid rgba(16,185,129,0.3)", color:"#34D399", fontSize:10, fontWeight:700, padding:"3px 10px", borderRadius:20 }}>دقة {confidence}%</span>
              )}
            </div>
            <h3 style={{ margin:0, fontSize:20, fontWeight:800, color:"#fff", letterSpacing:"-0.02em" }}>{labelAr}</h3>
            <p style={{ margin:"3px 0 0", fontSize:12, color:"rgba(255,255,255,0.5)" }}>تم تحديد المشكلة بنجاح — اختر تخصصاً أو تواصل مع أحد العمال مباشرةً</p>
          </div>
          <div style={{ display:"flex", gap:4, flexShrink:0 }}>
            {[...Array(5)].map((_,i)=>(
              <div key={i} style={{ width:i===2?18:5, height:5, borderRadius:3, background: i===2 ? "#F97316" : "rgba(255,255,255,0.2)" }} />
            ))}
          </div>
        </div>
      </div>

      {/* Specialty cards */}
      {specialties.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:14 }}>
            <div style={{ height:2, flex:1, background:"linear-gradient(90deg,rgba(249,115,22,0.4),transparent)" }} />
            <span style={{ fontSize:13, fontWeight:700, color:THEME.textMuted, whiteSpace:"nowrap" }}>التخصصات المطلوبة</span>
            <div style={{ height:2, flex:1, background:"linear-gradient(270deg,rgba(249,115,22,0.4),transparent)" }} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(200px, 1fr))", gap:12 }}>
            {pagedSpecialties.map((s) => {
              const isActive = activeSpec === s.id;
              return (
                <button key={s.id}
                  onClick={() => { setActiveSpec(isActive ? null : s.id); onNavigate(`/workers?specialtyId=${s.id}`); }}
                  style={{ display:"flex", flexDirection:"column", alignItems:"center", gap:10, padding:"1.5rem 1rem", borderRadius:16, border:`2px solid ${isActive ? THEME.primary : THEME.border}`, background: isActive ? THEME.primaryLight : THEME.bgCard, cursor:"pointer", fontFamily:"'Cairo', sans-serif", transition:"all 0.2s", minHeight:140, boxShadow: isActive ? "0 8px 20px rgba(249,115,22,0.2)" : "0 1px 4px rgba(0,0,0,0.06)", transform: isActive ? "translateY(-3px)" : "none" }}
                  onMouseEnter={(e)=>{ e.currentTarget.style.borderColor=THEME.primary; e.currentTarget.style.transform="translateY(-3px)"; }}
                  onMouseLeave={(e)=>{ if(!isActive){ e.currentTarget.style.borderColor=THEME.border; e.currentTarget.style.transform="none"; } }}
                >
                  {s.iconUrl ? <img src={getImageUrl(s.iconUrl)} style={{ width:60, height:60, borderRadius:12, objectFit:"cover" }} alt="" /> : <span style={{ fontSize:40 }}>🔧</span>}
                  <span style={{ fontSize:15, fontWeight:700, color: isActive ? THEME.primary : THEME.textMain, textAlign:"center", lineHeight:1.3 }}>{s.name}</span>
                  <span style={{ fontSize:12, color: isActive ? THEME.primary : THEME.textMuted, fontWeight:500 }}>اعرض العمال ←</span>
                </button>
              );
            })}
          </div>
          {totalSpecPages > 1 && (
            <Pagination
              page={aiSpecPage} totalPages={totalSpecPages}
              onPrev={() => setAiSpecPage(p => p - 1)}
              onNext={() => setAiSpecPage(p => p + 1)}
            />
          )}
        </div>
      )}

      {/* Workers */}
      {workers.length > 0 && (
        <div>
          <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
            <div style={{ height:2, flex:1, background:"linear-gradient(90deg,rgba(249,115,22,0.4),transparent)" }} />
            <span style={{ fontSize:13, fontWeight:700, color:THEME.textMuted, whiteSpace:"nowrap" }}>👷 عمال يمكنهم حل هذه المشكلة ({workers.length})</span>
            <div style={{ height:2, flex:1, background:"linear-gradient(270deg,rgba(249,115,22,0.4),transparent)" }} />
          </div>
          <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:14 }}>
            {pagedAiWorkers.map((w) => <WorkerCard key={w.id} worker={w} onSelect={onSelectWorker} />)}
          </div>
          {totalWorkerPages > 1 && (
            <Pagination
              page={aiWorkerPage} totalPages={totalWorkerPages}
              onPrev={() => { setAiWorkerPage(p => p - 1); window.scrollTo(0,0); }}
              onNext={() => { setAiWorkerPage(p => p + 1); window.scrollTo(0,0); }}
            />
          )}
        </div>
      )}

      {workers.length === 0 && specialties.length > 0 && (
        <div style={{ textAlign:"center", padding:"2.5rem", background:THEME.bgCard, borderRadius:16, border:`1.5px dashed ${THEME.border}`, color:THEME.textMuted, fontSize:14 }}>
          <div style={{ fontSize:40, marginBottom:10 }}>🗺️</div>
          <p style={{ margin:0, fontWeight:600, color:THEME.textMain }}>لا يوجد عمال قريبون في الوقت الحالي</p>
          <p style={{ margin:"6px 0 0", fontSize:13 }}>اضغط على أحد التخصصات أعلاه لتصفح جميع العمال</p>
        </div>
      )}
    </div>
  );
};

/* ─── Empty State ─── */
const EmptyState = ({ icon, text, sub }) => (
  <div style={{ textAlign:"center", padding:"3rem", color:THEME.textMuted, background:THEME.bgCard, borderRadius:14, border:`1px solid ${THEME.border}` }}>
    <div style={{ fontSize:52 }}>{icon}</div>
    <p style={{ marginTop:14, fontSize:16, fontWeight:600, color:THEME.textMain }}>{text}</p>
    {sub && <p style={{ margin:"6px 0 0", fontSize:13, color:THEME.textMuted }}>{sub}</p>}
  </div>
);

const Pagination = ({ page, totalPages, onPrev, onNext }) => (
  <div style={{ display:"flex", justifyContent:"center", alignItems:"center", gap:10, marginTop:26 }}>
    <button onClick={onPrev} disabled={page===1} style={{ padding:"9px 20px", borderRadius:10, border:`1px solid ${THEME.border}`, background:THEME.bgCard, cursor:page===1?"not-allowed":"pointer", opacity:page===1?0.4:1, fontFamily:"'Cairo',sans-serif", color:THEME.textMain, fontWeight:600, fontSize:14 }}>السابق</button>
    <span style={{ fontSize:14, color:THEME.textMuted, fontWeight:600 }}>{page} / {totalPages}</span>
    <button onClick={onNext} disabled={page>=totalPages} style={{ padding:"9px 20px", borderRadius:10, border:`1px solid ${THEME.border}`, background:THEME.bgCard, cursor:page>=totalPages?"not-allowed":"pointer", opacity:page>=totalPages?0.4:1, fontFamily:"'Cairo',sans-serif", color:THEME.textMain, fontWeight:600, fontSize:14 }}>التالي</button>
  </div>
);

/* ─── Section divider ─── */
const SectionTitle = ({ icon, text, count }) => (
  <div style={{ display:"flex", alignItems:"center", gap:10, marginBottom:16 }}>
    <div style={{ height:2, flex:1, background:"linear-gradient(90deg,rgba(249,115,22,0.35),transparent)" }} />
    <span style={{ fontSize:14, fontWeight:800, color:THEME.textMain, whiteSpace:"nowrap" }}>
      {icon} {text} {count !== undefined && <span style={{ color:THEME.textMuted, fontWeight:600 }}>({count})</span>}
    </span>
    <div style={{ height:2, flex:1, background:"linear-gradient(270deg,rgba(249,115,22,0.35),transparent)" }} />
  </div>
);

/* ─── Main Component ─── */
export default function TadbeerSearch() {
  const navigate = useNavigate();
const [query, setQuery] = useState(() => {
  return sessionStorage.getItem("tadbeer_search_query") || "";
});
  const [allWorkers, setAllWorkers]     = useState([]);   // full unfiltered list
  const [allServices, setAllServices]   = useState([]);   // full unfiltered list
  const [debugInfo, setDebugInfo]       = useState(null); // raw API debug info
  const [results, setResults]           = useState(null); // filtered results (null = show all)
  const [loading, setLoading]           = useState(false);
  const [error, setError]               = useState(null);
  const [page, setPage]                 = useState(1);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [activeTab, setActiveTab]       = useState("workers");
  const [servicePage, setServicePage]   = useState(1);

  // AI state
  const [aiMode, setAiMode]       = useState(false);
  const [aiImage, setAiImage]     = useState(null);
  const [aiPreview, setAiPreview] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult]   = useState(null);
  const [aiError, setAiError]     = useState(null);

  const fileRef     = useRef();
  const debounceRef = useRef(null);
  const PAGE_SIZE   = 6;

  const getToken = () => localStorage.getItem("token") || "";

  /* ── Load everything on mount ── */
  useEffect(() => { loadAll(); }, []);

  const loadAll = async () => {
    setLoading(true);
    setError(null);
    try {
      const [workerResult, services] = await Promise.all([
        fetchWorkers(),
        fetchServices(),
      ]);
      setDebugInfo({
        workerUrl: workerResult.url,
        workerCount: workerResult.arr.length,
        workerRawKeys: workerResult.raw ? Object.keys(workerResult.raw) : [],
        workerRawSample: workerResult.raw ? JSON.stringify(workerResult.raw).slice(0, 300) : "null",
        serviceCount: services.length,
      });
      setAllWorkers(workerResult.arr);
      setAllServices(services);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  };

  /* ── Switch mode ── */
  const switchMode = (toAi) => {
    if (toAi) {
      setQuery(""); setResults(null); setError(null);
    } else {
      setAiImage(null); setAiPreview(null); setAiResult(null); setAiError(null);
    }
    setAiMode(toAi);
  };

   useEffect(() => {
    sessionStorage.setItem("tadbeer_search_query", query);
  }, [query]);

  /* ── Text Search ── */
  const doSearch = useCallback(async (q, p = 1) => {
    if (!q.trim()) { setResults(null); return; }
    setLoading(true); setError(null);
    try {
      const q_lower = q.trim().toLowerCase();

      // Also try the search API for workers (it may return better/more results)
      let searchWorkers = [];
      try {
        const url = new URL(`${API_BASE}/General/Search`);
        url.searchParams.set("query", q);
        url.searchParams.set("page", p);
        url.searchParams.set("pageSize", 100);
        const res = await fetch(url.toString());
        if (res.ok) {
          const data = await res.json();
          searchWorkers = data.workers || data.Workers || extractArray(data);
        }
      } catch (_) {}

      // Client-side filter on allWorkers as fallback / merge
      const localFiltered = allWorkers.filter((w) => {
        const fn   = (w.firstName || "").toLowerCase();
        const ln   = (w.lastName  || "").toLowerCase();
        const job  = (w.jobDescription || "").toLowerCase();
        const specs = (w.specialtyNames || []).join(" ").toLowerCase();
        const city = (w.city || "").toLowerCase();
        return fn.includes(q_lower) || ln.includes(q_lower)
          || `${fn} ${ln}`.includes(q_lower)
          || job.includes(q_lower) || specs.includes(q_lower) || city.includes(q_lower);
      });

      // Merge: prefer search API results, fall back to local filter
      const mergedWorkers = searchWorkers.length > 0 ? searchWorkers : localFiltered;

      // Filter services client-side
      const filteredServices = allServices.filter((s) => {
        const name = (s.name || "").toLowerCase();
        const desc = (s.description || "").toLowerCase();
        return name.includes(q_lower) || desc.includes(q_lower);
      });

      setResults({ workers: mergedWorkers, services: filteredServices });
      setPage(p);
      setServicePage(1);
      // auto-switch tab: if no workers but has services, show services
      setActiveTab(mergedWorkers.length === 0 && filteredServices.length > 0 ? "services" : "workers");
    } catch (e) { setError(e.message); }
    finally { setLoading(false); }
  }, [allWorkers, allServices]);

   useEffect(() => {
    const savedQuery = sessionStorage.getItem("tadbeer_search_query");
    if (savedQuery && savedQuery.trim()) {
      doSearch(savedQuery, 1);
    }
  }, [doSearch]);

  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) { setResults(null); return; }
    debounceRef.current = setTimeout(() => doSearch(val, 1), 400);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!query.trim()) { setResults(null); return; }
    doSearch(query, 1);
  };

  /* ── File handlers ── */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAiImage(file); setAiPreview(URL.createObjectURL(file));
    setAiResult(null); setAiError(null);
  };
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    setAiImage(file); setAiPreview(URL.createObjectURL(file));
    setAiResult(null); setAiError(null);
  };

  /* ── AI Detect ── */
  const handleAiDetect = async () => {
    if (!aiImage) return;
    setAiLoading(true); setAiError(null); setAiResult(null);
    try {
      const form = new FormData();
      form.append("Image", aiImage);
      form.append("Latitude", "0");
      form.append("Longitude", "0");
      form.append("MaxDistanceKm", "50");
      const token = getToken();
      const res = await fetch(`${API_BASE}/General/AIDetection/predict`, {
        method: "POST",
        headers: token ? { Authorization: `Bearer ${token}` } : {},
        body: form,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} — ${res.statusText}`);
      setAiResult(await res.json());
    } catch (e) { setAiError(e.message); }
    finally { setAiLoading(false); }
  };

  /* ── Derived display data ── */
  // When results is null → show ALL; when not null → show filtered
  const displayWorkers  = results ? results.workers  : allWorkers;
  const displayServices = results ? results.services : allServices;
  const totalPages = Math.ceil(displayWorkers.length / PAGE_SIZE);
  // Paginate workers
  const pagedWorkers = displayWorkers.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  // Paginate services
  const totalServicePages = Math.ceil(displayServices.length / PAGE_SIZE);
  const pagedServices = displayServices.slice((servicePage - 1) * PAGE_SIZE, servicePage * PAGE_SIZE);

  return (
    <div dir="rtl" style={{ fontFamily: "'Cairo', 'Segoe UI', sans-serif", minHeight: "100vh", background: THEME.bgCanvas, color: THEME.textMain }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cairo:wght@400;500;600;700;800&display=swap');
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: none; } }
        * { box-sizing: border-box; }
      `}</style>

      {/* ── Hero ── */}
      <div style={{
        background: `linear-gradient(140deg, ${THEME.primaryDark} 0%, #1E293B 100%)`,
        padding: "3rem 1.5rem 2.5rem", textAlign: "center",
        borderBottom: `4px solid ${THEME.primary}`, position: "relative", overflow: "hidden",
      }}>
        <div style={{ position:"absolute", top:-60, right:-60, width:220, height:220, borderRadius:"50%", background:"rgba(249,115,22,0.07)", pointerEvents:"none" }} />
        <div style={{ position:"absolute", bottom:-40, left:-40, width:160, height:160, borderRadius:"50%", background:"rgba(249,115,22,0.05)", pointerEvents:"none" }} />

        <h1 style={{ color:"#fff", fontSize:"clamp(22px,4vw,34px)", fontWeight:800, margin:"0 0 8px", position:"relative" }}>
          ابحث عن الفني المناسب بلمح البصر
        </h1>
        <p style={{ color:"rgba(255,255,255,0.75)", fontSize:15, margin:"0 0 2rem", position:"relative" }}>
          آلاف العمال المحترفين في خدمتك — نصًا أو صورة
        </p>

        {/* Mode Toggle */}
        <div style={{ display:"flex", justifyContent:"center", marginBottom:22, position:"relative" }}>
          <div style={{ display:"inline-flex", background:"rgba(255,255,255,0.1)", borderRadius:32, padding:4, backdropFilter:"blur(6px)", border:"1px solid rgba(255,255,255,0.12)" }}>
            {[{ id: false, label: "🔍 بحث نصي" }, { id: true, label: "🤖 كشف بالذكاء الاصطناعي" }].map(({ id, label }) => (
              <button key={String(id)} onClick={() => switchMode(id)} style={{
                padding:"9px 22px", borderRadius:28, border:"none", cursor:"pointer",
                fontFamily:"'Cairo',sans-serif", fontWeight:700, fontSize:14,
                background: aiMode===id ? THEME.primary : "transparent", color:"#fff",
                transition:"all 0.2s", boxShadow: aiMode===id ? "0 2px 8px rgba(249,115,22,0.4)" : "none",
              }}>{label}</button>
            ))}
          </div>
        </div>

        {/* Text Search input */}
        {!aiMode && (
          <form onSubmit={handleSearch} style={{ display:"flex", maxWidth:620, margin:"0 auto", gap:8 }}>
            <input
              type="text" value={query} onChange={handleQueryChange}
              placeholder="ابحث عن خدمة أو عامل... (مثال: كهربائي، سباك)"
              style={{ flex:1, padding:"14px 18px", borderRadius:10, border:"1.5px solid transparent", fontSize:15, fontFamily:"'Cairo',sans-serif", background:"#fff", color:"#111", outline:"none", boxShadow:"0 4px 10px rgba(0,0,0,0.12)", transition:"border-color 0.2s" }}
              onFocus={(e) => e.currentTarget.style.borderColor = THEME.primary}
              onBlur={(e) => e.currentTarget.style.borderColor = "transparent"}
            />
            <button type="submit" disabled={loading} style={{
              padding:"14px 28px", background:THEME.primary, color:"#fff", border:"none",
              borderRadius:10, fontWeight:700, fontSize:15, cursor:loading?"not-allowed":"pointer",
              fontFamily:"'Cairo',sans-serif", whiteSpace:"nowrap",
              boxShadow:"0 4px 10px rgba(249,115,22,0.35)", transition:"background 0.2s",
              display:"flex", alignItems:"center", gap:8,
            }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = THEME.primaryHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = THEME.primary)}
            >{loading ? <Spinner /> : "بحث"}</button>
          </form>
        )}

        {/* AI upload */}
        {aiMode && (
          <div style={{ maxWidth:520, margin:"0 auto" }}>
            <div
              onClick={() => fileRef.current.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              style={{ border:"2px dashed rgba(255,255,255,0.3)", borderRadius:14, padding: aiPreview ? "10px" : "2.25rem", cursor:"pointer", background:"rgba(255,255,255,0.06)", transition:"all 0.2s", marginBottom:12 }}
              onMouseEnter={(e) => { e.currentTarget.style.background="rgba(255,255,255,0.11)"; e.currentTarget.style.borderColor=THEME.primary; }}
              onMouseLeave={(e) => { e.currentTarget.style.background="rgba(255,255,255,0.06)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.3)"; }}
            >
              {aiPreview ? (
                <div style={{ position:"relative", display:"inline-block" }}>
                  <img src={aiPreview} alt="preview" style={{ maxHeight:180, borderRadius:11, display:"block", margin:"0 auto", border:`3px solid ${THEME.primary}` }} />
                  <span style={{ position:"absolute", top:6, left:6, background:"rgba(0,0,0,0.55)", color:"#fff", fontSize:11, padding:"3px 8px", borderRadius:20 }}>انقر للتغيير</span>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize:40, marginBottom:10 }}>📷</div>
                  <p style={{ color:"rgba(255,255,255,0.9)", margin:0, fontSize:15, fontWeight:600 }}>اضغط أو اسحب صورة المشكلة هنا</p>
                  <p style={{ color:"rgba(255,255,255,0.5)", margin:"6px 0 0", fontSize:13 }}>JPG, PNG, WEBP — حتى 10 MB</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display:"none" }} />
            <button onClick={handleAiDetect} disabled={!aiImage || aiLoading} style={{
              width:"100%", padding:14,
              background: aiImage ? THEME.primary : "rgba(255,255,255,0.15)",
              color:"#fff", border:"none", borderRadius:10,
              fontWeight:700, fontSize:15, cursor: aiImage ? "pointer" : "not-allowed",
              fontFamily:"'Cairo',sans-serif",
              boxShadow: aiImage ? "0 4px 10px rgba(249,115,22,0.35)" : "none", transition:"background 0.2s",
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            }}
              onMouseEnter={(e) => aiImage && !aiLoading && (e.currentTarget.style.background = THEME.primaryHover)}
              onMouseLeave={(e) => aiImage && (e.currentTarget.style.background = THEME.primary)}
            >{aiLoading ? <><Spinner /> جاري التحليل...</> : "🤖 تحليل الصورة وإيجاد العمال"}</button>
          </div>
        )}
      </div>

      {/* AI Error */}
      {aiError && (
        <div style={{ maxWidth:900, margin:"1rem auto", padding:"0 1.5rem" }}>
          <div style={{ background:THEME.errorBg, border:`1px solid ${THEME.errorBorder}`, borderRadius:10, padding:"12px 16px", color:THEME.errorText, fontSize:14 }}>
            ❌ خطأ في التحليل: {aiError}
          </div>
        </div>
      )}

      

      {/* AI Result */}
      {aiMode && aiResult && (
        <AiResultPanel result={aiResult} onSelectWorker={setSelectedWorker} onNavigate={navigate} />
      )}

      {/* ── Browse / Search Results (search mode only) ── */}
      {!aiMode && (
        <div style={{ maxWidth:960, margin:"1.5rem auto", padding:"0 1.5rem", animation:"fadeIn 0.3s ease" }}>

          {/* Status bar */}
          <div style={{ display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:16, flexWrap:"wrap", gap:8 }}>
            <div style={{ display:"flex", gap:8, alignItems:"center" }}>
              {/* Tabs */}
              {[
                { key:"workers",  label:`👷 عمال`, count: displayWorkers.length },
                { key:"services", label:`🔧 خدمات`, count: displayServices.length },
              ].map(({ key, label, count }) => (
                <button key={key} onClick={() => setActiveTab(key)} style={{
                  padding:"8px 18px", borderRadius:22, border:"1.5px solid",
                  borderColor: activeTab===key ? THEME.primary : THEME.border,
                  background: activeTab===key ? THEME.primaryLight : THEME.bgCard,
                  color: activeTab===key ? THEME.primary : THEME.textMuted,
                  fontWeight:700, fontSize:14, cursor:"pointer",
                  fontFamily:"'Cairo',sans-serif", transition:"all 0.15s",
                  boxShadow: activeTab===key ? "0 2px 8px rgba(249,115,22,0.12)" : "none",
                  display:"flex", alignItems:"center", gap:6,
                }}>
                  {label}
                  <span style={{ background: activeTab===key ? THEME.primary : THEME.border, color: activeTab===key ? "#fff" : THEME.textMuted, borderRadius:12, padding:"1px 8px", fontSize:12, fontWeight:700 }}>{count}</span>
                </button>
              ))}
            </div>
            {query
              ? <p style={{ fontSize:13, color:THEME.textMuted, margin:0 }}>نتائج البحث عن: <strong>"{query}"</strong></p>
              : <p style={{ fontSize:13, color:THEME.textMuted, margin:0 }}>عرض جميع العمال والخدمات المتاحة</p>
            }
          </div>

          {/* Loading */}
          {loading && (
            <div style={{ textAlign:"center", padding:"3rem", color:THEME.textMuted }}>
              <Spinner color={THEME.primary} size={36} />
              <p style={{ marginTop:14, fontSize:14, fontWeight:600 }}>جاري التحميل...</p>
            </div>
          )}

          {/* Workers tab */}
          {!loading && activeTab === "workers" && (
            <>
              {pagedWorkers.length === 0 ? (
                <EmptyState icon="🔍" text={query ? `لا يوجد عمال يطابقون "${query}"` : "لا يوجد عمال حالياً"} sub={query ? "جرّب اسماً مختلفاً أو تصفح الخدمات" : ""} />
              ) : (
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:14 }}>
                  {pagedWorkers.map((w) => <WorkerCard key={w.id} worker={w} onSelect={setSelectedWorker} />)}
                </div>
              )}
              {totalPages > 1 && (
                <Pagination
                  page={page} totalPages={totalPages}
                  onPrev={() => { setPage(p => p - 1); window.scrollTo(0, 0); }}
                  onNext={() => { setPage(p => p + 1); window.scrollTo(0, 0); }}
                />
              )}
            </>
          )}

          {/* Services tab */}
          {!loading && activeTab === "services" && (
            displayServices.length === 0 ? (
              <EmptyState icon="🔧" text={query ? `لا توجد خدمات تطابق "${query}"` : "لا توجد خدمات حالياً"} sub={query ? "جرّب كلمة بحث مختلفة" : "لم يتم تحميل الخدمات بعد"} />
            ) : (
              <>
                <div style={{ display:"grid", gridTemplateColumns:"repeat(auto-fill, minmax(260px, 1fr))", gap:12 }}>
                  {pagedServices.map((s) => (
                    <ServiceCard key={s.id} service={s} onClick={() => navigate(`/workers?specialtyId=${s.id}`)} />
                  ))}
                </div>
                {totalServicePages > 1 && (
                  <Pagination
                    page={servicePage} totalPages={totalServicePages}
                    onPrev={() => { setServicePage(p => p - 1); window.scrollTo(0, 0); }}
                    onNext={() => { setServicePage(p => p + 1); window.scrollTo(0, 0); }}
                  />
                )}
              </>
            )
          )}
        </div>
      )}

      {/* Search Error */}
      {error && (
        <div style={{ maxWidth:900, margin:"1rem auto", padding:"0 1.5rem" }}>
          <div style={{ background:THEME.errorBg, border:`1px solid ${THEME.errorBorder}`, borderRadius:10, padding:"12px 16px", color:THEME.errorText, fontSize:14 }}>
            ❌ خطأ: {error}
          </div>
        </div>
      )}

      {selectedWorker && <WorkerModal worker={selectedWorker} onClose={() => setSelectedWorker(null)} />}
    </div>
  );
}