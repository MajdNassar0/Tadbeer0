import { useState, useRef, useCallback } from "react";

const API_BASE = "https://tadbeer0.runasp.net/api";
const getImageUrl = (path) => {
  if (!path) return null;

  if (path.startsWith("http")) return path;

  // ensure leading slash
  const fixedPath = path.startsWith("/")
    ? path
    : `/${path}`;

  return `https://tadbeer0.runasp.net${fixedPath}`;
};

const THEME = {
  primaryDark: "#0B1E36",
  primary: "#F97316",
  primaryHover: "#EA580C",
  primaryLight: "#FFF7ED",
  primaryLightDark: "#1E293B",
  textMain: "#1F2937",
  textMuted: "#6B7280",
  bgCanvas: "#F8FAFC",
  bgCard: "#FFFFFF",
  border: "#E2E8F0",
  borderFocus: "#F97316",
  success: "#10B981",
  successLight: "#ECFDF5",
  errorBg: "#FCEBEB",
  errorBorder: "#F87171",
  errorText: "#991B1B",
};

/* ─── Tiny helpers ─── */
const STAR = ({ filled }) => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill={filled ? "#F59E0B" : "none"} stroke="#F59E0B" strokeWidth="2">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
  </svg>
);

const StarRating = ({ rating }) => (
  <div style={{ display: "flex", gap: 2 }}>
    {[1, 2, 3, 4, 5].map((s) => <STAR key={s} filled={s <= Math.round(rating || 0)} />)}
  </div>
);

const Spinner = ({ color = "#fff", size = 18 }) => (
  <span style={{
    display: "inline-block", width: size, height: size,
    border: `2.5px solid ${color}40`,
    borderTopColor: color,
    borderRadius: "50%",
    animation: "spin 0.7s linear infinite",
  }} />
);

/* ─── 🌟 كارد العمال المربوط بمسارات صفحة التفاصيل الصحيحة 🌟 ─── */
const WorkerCard = ({ worker, onSelect, getImageUrl: passedGetImageUrl, THEME: passedTheme }) => {
  const [hovered, setHovered] = useState(false);
  const specialtiesText = worker.specialtyNames?.join(" · ") || "خدمات عامة";

  const currentTheme = passedTheme || THEME;
  
  const determineImageUrl = (path) => {
    if (typeof passedGetImageUrl === "function") return passedGetImageUrl(path);
    if (typeof getImageUrl === "function") return getImageUrl(path);
    return `https://tadbeer0.runasp.net/${path}`;
  };

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: currentTheme.bgCard,
        border: `1px solid ${hovered ? "#0B1E36" : currentTheme.border}`, // الهوفر الكحلي الراقي
        borderRadius: "20px",
        padding: "1.5rem",
        display: "flex",
        flexDirection: "column",
        gap: "1.25rem",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        boxShadow: hovered ? "0 12px 25px -5px rgba(11, 30, 54, 0.15)" : "0 2px 6px rgba(0,0,0,0.03)",
        transform: hovered ? "translateY(-4px)" : "none",
        direction: "rtl",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* الجزء العلوي: الصورة والبيانات الشخصية */}
      <div style={{ display: "flex", gap: "1rem", alignItems: "center" }}>
        <div style={{ width: "64px", height: "64px", borderRadius: "14px", overflow: "hidden", flexShrink: 0, background: currentTheme.bgCanvas, border: `1px solid ${currentTheme.border}` }}>
          {worker.profileImage ? (
            <img src={determineImageUrl(worker.profileImage)} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          ) : (
            <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: "20px", color: currentTheme.primary, background: currentTheme.primaryLight }}>
              {worker.firstName?.[0]}
            </div>
          )}
        </div>

        <div style={{ flex: 1, minWidth: 0 }}>
          <h3 style={{ margin: 0, fontSize: "16px", fontWeight: 700, color: currentTheme.textMain, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {worker.firstName} {worker.lastName}
          </h3>
          <p style={{ margin: "4px 0 6px", fontSize: "13px", color: hovered ? "#1E293B" : "#475569", fontWeight: 600, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
            {specialtiesText}
          </p>
          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <StarRating rating={worker.avgRating} />
            <span style={{ fontSize: "12px", fontWeight: 700, color: currentTheme.textMuted, marginTop: "2px" }}>
              ({worker.avgRating || 0})
            </span>
          </div>
        </div>
      </div>

      {/* بوكسات تفاصيل الخبرة والموقع */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" }}>
        <div style={{ background: currentTheme.bgCanvas, border: `1px solid ${currentTheme.border}`, padding: "10px", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", justifyWContent: "center" }}>
          <span style={{ fontSize: "11px", color: currentTheme.textMuted, fontWeight: 500, marginBottom: "2px" }}>الخبرة</span>
          <span style={{ fontSize: "13px", fontWeight: 700, color: currentTheme.textMain }}>{worker.experienceYears || 0} سنوات</span>
        </div>
        <div style={{ background: currentTheme.bgCanvas, border: `1px solid ${currentTheme.border}`, padding: "10px", borderRadius: "12px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: "11px", color: currentTheme.textMuted, fontWeight: 500, marginBottom: "2px" }}>الموقع</span>
          <span style={{ fontSize: "13px", fontWeight: 700, color: currentTheme.textMain, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", width: "100%", textAlign: "center" }}>{worker.city || "غير محدد"}</span>
        </div>
      </div>

      {/* الأزرار المربوطة بالـ Routes الشغالة بالملّي */}
      <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginTop: "auto" }}>
        
        {/* زر احجز موعد الآن -> يوجه إلى /booking/:id */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // منع التداخل نهائياً
            window.location.href = `/booking/${worker.id}`;
          }}
          style={{
            width: "100%", padding: "11px", background: currentTheme.primary, color: "#fff", border: "none",
            borderRadius: "10px", fontWeight: 700, fontSize: "13px", cursor: "pointer",
            fontFamily: "'Cairo', sans-serif", transition: "background 0.2s",
            boxShadow: "0 2px 4px rgba(249,115,22,0.15)"
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = currentTheme.primaryHover}
          onMouseLeave={(e) => e.currentTarget.style.background = currentTheme.primary}
        >
          احجز موعد الآن
        </button>

        {/* زر عرض الملف الشخصي -> يوجه إلى /worker-profile/:id */}
        <button
          onClick={(e) => {
            e.stopPropagation(); // منع التداخل نهائياً
            window.location.href = `/worker-profile/${worker.id}`;
          }}
          style={{
            width: "100%", padding: "11px", background: "transparent", color: currentTheme.textMain,
            border: `1px solid ${currentTheme.border}`, borderRadius: "10px", fontWeight: 600,
            fontSize: "13px", cursor: "pointer", fontFamily: "'Cairo', sans-serif", transition: "all 0.2s"
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = currentTheme.bgCanvas;
            e.currentTarget.style.borderColor = "#0B1E36"; // الهوفر الكحلي الراقي
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.borderColor = currentTheme.border;
          }}
        >
          عرض الملف الشخصي
        </button>
      </div>
    </div>
  );
};

/* ─── Service Card ─── */
const ServiceCard = ({ service }) => (
  <div style={{
    background: THEME.bgCard, border: `1px solid ${THEME.border}`, borderRadius: "12px",
    padding: "0.875rem 1rem", display: "flex", alignItems: "center", gap: 12,
    boxShadow: "0 1px 3px rgba(0,0,0,0.05)",
  }}>
    {service.iconUrl ? (
      <img src={getImageUrl(service.iconUrl)} alt={service.name} style={{ width: 38, height: 38, borderRadius: 9, objectFit: "cover" }} />
    ) : (
      <div style={{ width: 38, height: 38, borderRadius: 9, background: THEME.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 19 }}>
        🔧
      </div>
    )}
    <div>
      <p style={{ fontWeight: 700, fontSize: 14, margin: 0, color: THEME.textMain }}>{service.name}</p>
      {service.description && <p style={{ fontSize: 12, color: THEME.textMuted, margin: "3px 0 0" }}>{service.description}</p>}
    </div>
  </div>
);

/* ─── Worker Detail Modal ─── */
const WorkerModal = ({ worker, onClose }) => {
  if (!worker) return null;
  const initials = `${worker.firstName?.[0] || ""}${worker.lastName?.[0] || ""}`.toUpperCase();

  return (
    <div
      onClick={onClose}
      style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000, padding: 16, backdropFilter: "blur(5px)" }}
    >
      <div
        onClick={(e) => e.stopPropagation()}
        style={{
          background: THEME.bgCard, borderRadius: "18px", padding: "1.75rem",
          width: "100%", maxWidth: 480, border: `1px solid ${THEME.border}`,
          boxShadow: "0 25px 50px -12px rgba(0,0,0,0.2)", maxHeight: "90vh", overflowY: "auto",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 18 }}>
          <div style={{ display: "flex", gap: 14, alignItems: "center" }}>
            {worker.profileImage ? (
              <img src={getImageUrl(worker.profileImage)} alt="" style={{ width: 68, height: 68, borderRadius: "50%", objectFit: "cover", border: `3px solid ${THEME.primaryLight}` }} />
            ) : (
              <div style={{ width: 68, height: 68, borderRadius: "50%", background: THEME.primaryLight, display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 700, fontSize: 22, color: THEME.primary }}>
                {initials}
              </div>
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
          <p style={{ fontSize: 14, color: THEME.textMuted, lineHeight: 1.65, margin: "0 0 18px", background: THEME.bgCanvas, padding: "10px 14px", borderRadius: 10, border: `1px solid ${THEME.border}` }}>
            {worker.jobDescription}
          </p>
        )}

        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 18 }}>
          {worker.experienceYears != null && (
            <div style={{ background: THEME.bgCanvas, borderRadius: "10px", padding: "12px 14px", border: `1px solid ${THEME.border}` }}>
              <p style={{ fontSize: 11, color: THEME.textMuted, margin: "0 0 5px" }}>سنوات الخبرة</p>
              <p style={{ fontSize: 22, fontWeight: 700, margin: 0, color: THEME.primary }}>{worker.experienceYears}</p>
            </div>
          )}
          {worker.avgRating != null && (
            <div style={{ background: THEME.bgCanvas, borderRadius: "10px", padding: "12px 14px", border: `1px solid ${THEME.border}` }}>
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
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 7 }}>
              {worker.workImages.slice(0, 6).map((img, i) => (
                <img key={i} src={getImageUrl(img)} alt="" style={{ width: "100%", aspectRatio: "1", objectFit: "cover", borderRadius: 9 }} />
              ))}
            </div>
          </div>
        )}

        <button
          style={{
            marginTop: 4, width: "100%", padding: "13px",
            background: THEME.primary, color: "#fff", border: "none",
            borderRadius: "10px", fontWeight: 700, fontSize: 15, cursor: "pointer",
            fontFamily: "'Cairo', sans-serif", transition: "background 0.2s",
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = THEME.primaryHover}
          onMouseLeave={(e) => e.currentTarget.style.background = THEME.primary}
        >
          📞 تواصل مع العامل
        </button>
      </div>
    </div>
  );
};

/* ─── AI Result Panel ─── */
const AiResultPanel = ({ result, onSelectWorker }) => {
  if (!result) return null;

  // Try to extract workers list from various possible response shapes
  const detectedLabel = result.detectedLabel || result.label || result.prediction || result.class || result.detectedClass || null;
  const confidence = result.confidence ?? result.score ?? null;
  const workers = result.workers || result.nearbyWorkers || result.matchedWorkers || [];
  const services = result.services || result.matchedServices || [];
  const message = result.message || null;

  return (
    <div style={{ maxWidth: 900, margin: "1.5rem auto", padding: "0 1.5rem" }}>
      {/* Detection Summary */}
      <div style={{
        background: THEME.bgCard,
        border: `2px solid ${THEME.primary}`,
        borderRadius: "14px",
        padding: "1.25rem 1.5rem",
        marginBottom: 18,
        boxShadow: "0 4px 16px -4px rgba(249,115,22,0.15)",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: detectedLabel ? 14 : 0 }}>
          <span style={{ fontSize: 28 }}>🤖</span>
          <div>
            <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: THEME.primary }}>نتيجة تحليل الصورة بالذكاء الاصطناعي</h3>
            {message && <p style={{ margin: "3px 0 0", fontSize: 13, color: THEME.textMuted }}>{message}</p>}
          </div>
        </div>

        {detectedLabel && (
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12, alignItems: "center" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, background: THEME.primaryLight, padding: "8px 16px", borderRadius: 30, border: `1px solid rgba(249,115,22,0.2)` }}>
              <span style={{ fontSize: 14, color: THEME.textMuted }}>المشكلة المكتشفة:</span>
              <span style={{ fontSize: 15, fontWeight: 700, color: THEME.primary }}>{detectedLabel}</span>
            </div>
            {confidence != null && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, background: THEME.successLight, padding: "8px 16px", borderRadius: 30, border: `1px solid rgba(16,185,129,0.2)` }}>
                <span style={{ fontSize: 14, color: THEME.textMuted }}>دقة التحليل:</span>
                <span style={{ fontSize: 15, fontWeight: 700, color: THEME.success }}>
                  {(confidence * 100).toFixed(0)}%
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Matched Workers from AI */}
      {workers.length > 0 && (
        <div style={{ marginBottom: 18 }}>
          <h4 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700, color: THEME.textMain }}>
            👷 عمال مقترحون لهذه المشكلة ({workers.length})
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 12 }}>
            {workers.map((w) => <WorkerCard key={w.id} worker={w} onSelect={onSelectWorker} />)}
          </div>
        </div>
      )}

      {/* Matched Services from AI */}
      {services.length > 0 && (
        <div>
          <h4 style={{ margin: "0 0 12px", fontSize: 15, fontWeight: 700, color: THEME.textMain }}>
            🔧 خدمات ذات صلة ({services.length})
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(240px, 1fr))", gap: 10 }}>
            {services.map((s) => <ServiceCard key={s.id} service={s} />)}
          </div>
        </div>
      )}

      {/* Fallback: show raw if no structured data extracted */}
      {!detectedLabel && workers.length === 0 && services.length === 0 && (
        <div style={{ background: THEME.bgCanvas, border: `1px solid ${THEME.border}`, borderRadius: 10, padding: 14 }}>
          <p style={{ fontSize: 12, color: THEME.textMuted, margin: "0 0 8px", fontWeight: 600 }}>استجابة الخادم:</p>
          <pre style={{ margin: 0, fontSize: 13, color: THEME.textMain, whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

/* ─── Main Component ─── */
export default function TadbeerSearch() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [selectedWorker, setSelectedWorker] = useState(null);
  const [activeTab, setActiveTab] = useState("workers");

  // AI Detection state
  const [aiMode, setAiMode] = useState(false);
  const [aiImage, setAiImage] = useState(null);
  const [aiPreview, setAiPreview] = useState(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiResult, setAiResult] = useState(null);
  const [aiError, setAiError] = useState(null);
  const [userLat, setUserLat] = useState("");
  const [userLng, setUserLng] = useState("");
  const [maxDist, setMaxDist] = useState(10);
  const [locLoading, setLocLoading] = useState(false);

  const fileRef = useRef();
  const debounceRef = useRef(null);
  const PAGE_SIZE = 8;

  // Silently read the token saved by Login.jsx — user never sees this
  const getToken = () => localStorage.getItem("token") || "";

  /* ── Search ── */
  const doSearch = useCallback(async (q, p = 1) => {
    if (!q.trim()) { setResults(null); return; }
    setLoading(true);
    setError(null);
    try {
      const url = new URL(`${API_BASE}/General/Search`);
      url.searchParams.set("query", q);
      url.searchParams.set("page", p);
      url.searchParams.set("pageSize", PAGE_SIZE);
      const res = await fetch(url.toString());
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();

      console.log("SEARCH RESULT:", data);

      // ── Client-side filtering ──
      // Works for: single word (first name OR last name OR service name),
      // or full name with space (e.g. "أحمد محمود")
      const q_lower = q.trim().toLowerCase();

      const workerArr = data.workers || data.Workers || [];
      const filteredWorkers = workerArr.filter((w) => {
        const firstName = (w.firstName || "").toLowerCase();
        const lastName  = (w.lastName  || "").toLowerCase();
        const fullName  = `${firstName} ${lastName}`;
        const job       = (w.jobDescription || "").toLowerCase();
        const specs     = (w.specialtyNames || []).join(" ").toLowerCase();
        return (
          firstName.includes(q_lower) ||
          lastName.includes(q_lower)  ||
          fullName.includes(q_lower)  ||
          job.includes(q_lower)       ||
          specs.includes(q_lower)
        );
      });

      const serviceArr = data.services || data.Services || [];
      const filteredServices = serviceArr.filter((s) => {
        const name = (s.name || "").toLowerCase();
        const desc = (s.description || "").toLowerCase();
        return name.includes(q_lower) || desc.includes(q_lower);
      });

      // Replace arrays with filtered versions, keep totals accurate
      const patched = {
        ...data,
        workers:  filteredWorkers,
        services: filteredServices,
        workersTotalCount:  filteredWorkers.length,
        servicesTotalCount: filteredServices.length,
      };

      setResults(patched);
      setPage(p);
      // Auto-switch tab to whichever has results
      if (filteredWorkers.length === 0 && filteredServices.length > 0) {
        setActiveTab("services");
      } else {
        setActiveTab("workers");
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  /* ── Live search (debounced 400ms) ── */
  const handleQueryChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (debounceRef.current) clearTimeout(debounceRef.current);
    if (!val.trim()) { setResults(null); setError(null); return; }
    debounceRef.current = setTimeout(() => {
      doSearch(val, 1);
    }, 400);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (debounceRef.current) clearTimeout(debounceRef.current);
    doSearch(query, 1);
  };

  /* ── Geolocation ── */
  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert("المتصفح لا يدعم تحديد الموقع");
      return;
    }
    setLocLoading(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setUserLat(pos.coords.latitude.toFixed(6));
        setUserLng(pos.coords.longitude.toFixed(6));
        setLocLoading(false);
      },
      () => {
        alert("تعذّر الحصول على موقعك. تأكد من منح الإذن.");
        setLocLoading(false);
      }
    );
  };

  /* ── File select ── */
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setAiImage(file);
    setAiPreview(URL.createObjectURL(file));
    setAiResult(null);
    setAiError(null);
  };

  /* ── Drag & Drop ── */
  const handleDrop = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (!file || !file.type.startsWith("image/")) return;
    setAiImage(file);
    setAiPreview(URL.createObjectURL(file));
    setAiResult(null);
    setAiError(null);
  };

  /* ── AI Detect ── */
  const handleAiDetect = async () => {
    if (!aiImage) return;
    setAiLoading(true);
    setAiError(null);
    setAiResult(null);
    try {
      const form = new FormData();
      form.append("Image", aiImage);
      form.append("Latitude", userLat || "0");
      form.append("Longitude", userLng || "0");
      form.append("MaxDistanceKm", String(maxDist));

      // Auto-attach token from Login — user never sees this
      const token = getToken();
      const headers = token ? { Authorization: `Bearer ${token}` } : {};

      const res = await fetch(`${API_BASE}/General/AIDetection/predict`, {
        method: "POST",
        headers,
        body: form,
      });
      if (!res.ok) throw new Error(`HTTP ${res.status} — ${res.statusText}`);
      const data = await res.json();
      setAiResult(data);
    } catch (e) {
      setAiError(e.message);
    } finally {
      setAiLoading(false);
    }
  };

  const workers       = results?.workers  || [];
  const services      = results?.services || [];
  const totalWorkers  = results?.workersTotalCount  ?? workers.length;
  const totalServices = results?.servicesTotalCount ?? services.length;
  const totalPages    = Math.ceil(totalWorkers / PAGE_SIZE);

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
        padding: "3rem 1.5rem 2.5rem",
        textAlign: "center",
        borderBottom: `4px solid ${THEME.primary}`,
        position: "relative",
        overflow: "hidden",
      }}>
        {/* subtle bg rings */}
        <div style={{ position: "absolute", top: -60, right: -60, width: 220, height: 220, borderRadius: "50%", background: "rgba(249,115,22,0.07)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: -40, left: -40, width: 160, height: 160, borderRadius: "50%", background: "rgba(249,115,22,0.05)", pointerEvents: "none" }} />

        <h1 style={{ color: "#fff", fontSize: "clamp(22px,4vw,34px)", fontWeight: 800, margin: "0 0 8px", position: "relative" }}>
          ابحث عن الفني المناسب بلمح البصر
        </h1>
        <p style={{ color: "rgba(255,255,255,0.75)", fontSize: 15, margin: "0 0 2rem", position: "relative" }}>
          آلاف العمال المحترفين في خدمتك — نصًا أو صورة
        </p>

        {/* Mode Toggle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 22, position: "relative" }}>
          <div style={{
            display: "inline-flex", background: "rgba(255,255,255,0.1)",
            borderRadius: 32, padding: 4, backdropFilter: "blur(6px)",
            border: "1px solid rgba(255,255,255,0.12)",
          }}>
            {[
              { id: false, label: "🔍 بحث نصي" },
              { id: true, label: "🤖 كشف بالذكاء الاصطناعي" },
            ].map(({ id, label }) => (
              <button
                key={String(id)}
                onClick={() => setAiMode(id)}
                style={{
                  padding: "9px 22px", borderRadius: 28, border: "none", cursor: "pointer",
                  fontFamily: "'Cairo', sans-serif", fontWeight: 700, fontSize: 14,
                  background: aiMode === id ? THEME.primary : "transparent",
                  color: "#fff", transition: "all 0.2s",
                  boxShadow: aiMode === id ? "0 2px 8px rgba(249,115,22,0.4)" : "none",
                }}
              >{label}</button>
            ))}
          </div>
        </div>

        {/* ── Text Search ── */}
        {!aiMode ? (
          <form onSubmit={handleSearch} style={{ display: "flex", maxWidth: 620, margin: "0 auto", gap: 8 }}>
            <input
              type="text"
              value={query}
              onChange={handleQueryChange}
              placeholder="ابحث عن خدمة أو عامل... (مثال: كهربائي، سباك)"
              style={{
                flex: 1, padding: "14px 18px", borderRadius: "10px",
                border: "1.5px solid transparent", fontSize: 15,
                fontFamily: "'Cairo', sans-serif", background: "#fff", color: "#111",
                outline: "none", boxShadow: "0 4px 10px rgba(0,0,0,0.12)",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => e.currentTarget.style.borderColor = THEME.primary}
              onBlur={(e) => e.currentTarget.style.borderColor = "transparent"}
            />
            <button
              type="submit"
              disabled={loading}
              style={{
                padding: "14px 28px", background: THEME.primary, color: "#fff",
                border: "none", borderRadius: "10px", fontWeight: 700, fontSize: 15,
                cursor: loading ? "not-allowed" : "pointer",
                fontFamily: "'Cairo', sans-serif", whiteSpace: "nowrap",
                boxShadow: "0 4px 10px rgba(249,115,22,0.35)", transition: "background 0.2s",
                display: "flex", alignItems: "center", gap: 8,
              }}
              onMouseEnter={(e) => !loading && (e.currentTarget.style.background = THEME.primaryHover)}
              onMouseLeave={(e) => (e.currentTarget.style.background = THEME.primary)}
            >
              {loading ? <Spinner /> : "بحث"}
            </button>
          </form>
        ) : (
          /* ── AI Mode ── */
          <div style={{ maxWidth: 620, margin: "0 auto" }}>
            {/* Drop zone */}
            <div
              onClick={() => fileRef.current.click()}
              onDragOver={(e) => e.preventDefault()}
              onDrop={handleDrop}
              style={{
                border: "2px dashed rgba(255,255,255,0.3)", borderRadius: "14px",
                padding: aiPreview ? "10px" : "2.25rem",
                cursor: "pointer", background: "rgba(255,255,255,0.06)",
                transition: "all 0.2s", marginBottom: 10,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.11)";
                e.currentTarget.style.borderColor = THEME.primary;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "rgba(255,255,255,0.06)";
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.3)";
              }}
            >
              {aiPreview ? (
                <div style={{ position: "relative", display: "inline-block" }}>
                  <img src={aiPreview} alt="preview" style={{ maxHeight: 170, borderRadius: 11, display: "block", margin: "0 auto", border: `3px solid ${THEME.primary}` }} />
                  <span style={{
                    position: "absolute", top: 6, left: 6, background: "rgba(0,0,0,0.55)",
                    color: "#fff", fontSize: 11, padding: "3px 8px", borderRadius: 20,
                  }}>انقر للتغيير</span>
                </div>
              ) : (
                <div>
                  <div style={{ fontSize: 40, marginBottom: 10 }}>📷</div>
                  <p style={{ color: "rgba(255,255,255,0.9)", margin: 0, fontSize: 15, fontWeight: 600 }}>اضغط أو اسحب صورة المشكلة هنا</p>
                  <p style={{ color: "rgba(255,255,255,0.5)", margin: "6px 0 0", fontSize: 13 }}>JPG, PNG, WEBP — حتى 10 MB</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" accept="image/*" onChange={handleFileChange} style={{ display: "none" }} />

            {/* Location row */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr auto", gap: 8, marginBottom: 10 }}>
              <input
                type="number" placeholder="خط العرض" value={userLat}
                onChange={(e) => setUserLat(e.target.value)}
                style={inputStyle}
              />
              <input
                type="number" placeholder="خط الطول" value={userLng}
                onChange={(e) => setUserLng(e.target.value)}
                style={inputStyle}
              />
              <input
                type="number" placeholder="أقصى مسافة كم" value={maxDist}
                onChange={(e) => setMaxDist(e.target.value)}
                style={inputStyle}
              />
              <button
                onClick={handleGetLocation}
                disabled={locLoading}
                title="تحديد موقعي تلقائياً"
                style={{
                  padding: "10px 12px", borderRadius: "8px", border: "none",
                  background: "rgba(255,255,255,0.15)", color: "#fff",
                  cursor: locLoading ? "not-allowed" : "pointer", fontSize: 18,
                  fontFamily: "'Cairo', sans-serif", whiteSpace: "nowrap",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: 5,
                  transition: "background 0.2s", minWidth: 44,
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.25)"}
                onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.15)"}
              >
                {locLoading ? <Spinner size={16} /> : "📍"}
              </button>
            </div>

            {/* Detect button */}
            <button
              onClick={handleAiDetect}
              disabled={!aiImage || aiLoading}
              style={{
                width: "100%", padding: "13px",
                background: aiImage ? THEME.primary : "rgba(255,255,255,0.15)",
                color: "#fff", border: "none", borderRadius: "10px",
                fontWeight: 700, fontSize: 15, cursor: aiImage ? "pointer" : "not-allowed",
                fontFamily: "'Cairo', sans-serif",
                boxShadow: aiImage ? "0 4px 10px rgba(249,115,22,0.35)" : "none",
                transition: "background 0.2s",
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              }}
              onMouseEnter={(e) => aiImage && !aiLoading && (e.currentTarget.style.background = THEME.primaryHover)}
              onMouseLeave={(e) => aiImage && (e.currentTarget.style.background = THEME.primary)}
            >
              {aiLoading ? <><Spinner /> جاري التحليل...</> : "🤖 تحليل الصورة وإيجاد العمال"}
            </button>
          </div>
        )}
      </div>

      {/* ── AI Error ── */}
      {aiError && (
        <div style={{ maxWidth: 900, margin: "1rem auto", padding: "0 1.5rem" }}>
          <div style={{ background: THEME.errorBg, border: `1px solid ${THEME.errorBorder}`, borderRadius: "10px", padding: "12px 16px", color: THEME.errorText, fontSize: 14 }}>
            ❌ خطأ في التحليل: {aiError}
          </div>
        </div>
      )}

      {/* ── AI Result ── */}
      {aiResult && <AiResultPanel result={aiResult} onSelectWorker={setSelectedWorker} />}

      {/* ── Search Results ── */}
      {results && (
        <div style={{ maxWidth: 900, margin: "1.5rem auto", padding: "0 1.5rem", animation: "fadeIn 0.3s ease" }}>
          {/* Tab bar */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16, flexWrap: "wrap", gap: 8 }}>
            <div style={{ display: "flex", gap: 8 }}>
              {[
                { key: "workers", label: `👷 عمال (${totalWorkers})` },
                { key: "services", label: `🔧 خدمات (${totalServices})` },
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setActiveTab(key)}
                  style={{
                    padding: "8px 20px", borderRadius: 22, border: "1.5px solid",
                    borderColor: activeTab === key ? THEME.primary : THEME.border,
                    background: activeTab === key ? THEME.primaryLight : THEME.bgCard,
                    color: activeTab === key ? THEME.primary : THEME.textMuted,
                    fontWeight: 700, fontSize: 14, cursor: "pointer",
                    fontFamily: "'Cairo', sans-serif", transition: "all 0.15s",
                    boxShadow: activeTab === key ? "0 2px 8px rgba(249,115,22,0.12)" : "none",
                  }}
                >{label}</button>
              ))}
            </div>
            {query && <p style={{ fontSize: 13, color: THEME.textMuted, margin: 0 }}>نتائج لـ: <strong>"{query}"</strong></p>}
          </div>

          {/* Workers */}
          {activeTab === "workers" && (
            <>
              {workers.length === 0 ? (
                <EmptyState icon="🔍" text="لا يوجد عمال لهذا البحث" />
              ) : (
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 14 }}>
                  {workers.map((w) => <WorkerCard key={w.id} worker={w} onSelect={setSelectedWorker} />)}
                </div>
              )}
              {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPrev={() => doSearch(query, page - 1)} onNext={() => doSearch(query, page + 1)} />}
            </>
          )}

          {/* Services */}
          {activeTab === "services" && (
            services.length === 0 ? (
              <EmptyState icon="🔧" text="لا توجد خدمات لهذا البحث" />
            ) : (
              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(260px, 1fr))", gap: 12 }}>
                {services.map((s) => <ServiceCard key={s.id} service={s} />)}
              </div>
            )
          )}
        </div>
      )}

      {/* ── CTA banner (empty state) ── */}
      {!results && !aiResult && (
        <div style={{ margin: "3rem auto", maxWidth: 900, padding: "0 1.5rem" }}>
          <div style={{
            background: THEME.primaryDark, borderRadius: "18px", padding: "2.5rem 2rem",
            textAlign: "center", boxShadow: "0 10px 30px -6px rgba(0,0,0,0.15)",
            border: "1px solid rgba(255,255,255,0.05)",
          }}>
            <div style={{ fontSize: 48, marginBottom: 12 }}>🛠️</div>
            <h2 style={{ color: "#fff", fontSize: 22, fontWeight: 800, margin: "0 0 10px" }}>مشكلتك ما بتستنى... خلّينا نحلّها الآن.</h2>
            <p style={{ color: "rgba(255,255,255,0.7)", fontSize: 15, margin: "0 0 1.5rem" }}>
              سواء كانت كهرباء، سباكة، أو أي خدمة منزلية — عندنا الفني المناسب
            </p>
            <button
              onClick={() => document.querySelector("input[type=text]")?.focus()}
              style={{
                padding: "13px 40px", background: THEME.primary, color: "#fff",
                border: "none", borderRadius: "10px", fontWeight: 700, fontSize: 16,
                cursor: "pointer", fontFamily: "'Cairo', sans-serif",
                boxShadow: "0 4px 12px rgba(249,115,22,0.4)", transition: "background 0.2s",
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = THEME.primaryHover}
              onMouseLeave={(e) => e.currentTarget.style.background = THEME.primary}
            >
              اطلب الآن
            </button>
          </div>
        </div>
      )}

      {/* ── Search Error ── */}
      {error && (
        <div style={{ maxWidth: 900, margin: "1rem auto", padding: "0 1.5rem" }}>
          <div style={{ background: THEME.errorBg, border: `1px solid ${THEME.errorBorder}`, borderRadius: "10px", padding: "12px 16px", color: THEME.errorText, fontSize: 14 }}>
            ❌ خطأ في البحث: {error}
          </div>
        </div>
      )}

      {/* Worker Modal */}
      {selectedWorker && <WorkerModal worker={selectedWorker} onClose={() => setSelectedWorker(null)} />}
    </div>
  );
}

/* ─── Small shared components ─── */
const inputStyle = {
  padding: "10px 12px", borderRadius: "8px", border: "none",
  fontSize: 13, fontFamily: "'Cairo', sans-serif",
  textAlign: "center", outline: "none", background: "#fff", color: "#111",
};

const EmptyState = ({ icon, text }) => (
  <div style={{
    textAlign: "center", padding: "3rem", color: THEME.textMuted,
    background: THEME.bgCard, borderRadius: 14, border: `1px solid ${THEME.border}`,
  }}>
    <div style={{ fontSize: 52 }}>{icon}</div>
    <p style={{ marginTop: 14, fontSize: 16, fontWeight: 500 }}>{text}</p>
  </div>
);

const Pagination = ({ page, totalPages, onPrev, onNext }) => (
  <div style={{ display: "flex", justifyContent: "center", alignItems: "center", gap: 10, marginTop: 26 }}>
    <button onClick={onPrev} disabled={page === 1} style={pageBtnStyle(page === 1)}>السابق</button>
    <span style={{ fontSize: 14, color: THEME.textMuted, fontWeight: 600 }}>{page} / {totalPages}</span>
    <button onClick={onNext} disabled={page >= totalPages} style={pageBtnStyle(page >= totalPages)}>التالي</button>
  </div>
);

const pageBtnStyle = (disabled) => ({
  padding: "9px 20px", borderRadius: "10px", border: `1px solid ${THEME.border}`,
  background: THEME.bgCard, cursor: disabled ? "not-allowed" : "pointer",
  opacity: disabled ? 0.4 : 1, fontFamily: "'Cairo', sans-serif", color: THEME.textMain,
  fontWeight: 600, fontSize: 14, transition: "all 0.15s",
});
