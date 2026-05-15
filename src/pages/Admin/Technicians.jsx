import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { UserCog, Trash2, X, Star, ExternalLink } from "lucide-react";

const API_BASE = "https://tadbeer0.runasp.net/api";

function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="w-7 h-7 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function ConfirmModal({ name, onConfirm, onCancel, loading }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <div className="bg-white rounded-2xl p-6 w-80 shadow-xl border border-gray-100" dir="rtl">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-medium text-gray-800">تأكيد الحذف</h3>
          <button onClick={onCancel} className="text-gray-300 hover:text-gray-500">
            <X size={18} />
          </button>
        </div>
        <p className="text-xs text-gray-500 mb-1">هل أنت متأكد من حذف الفني؟</p>
        <p className="text-sm font-medium text-gray-800 mb-6">{name}</p>
        <div className="flex gap-3">
          <button
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 bg-red-500 hover:bg-red-600 text-white text-xs font-medium
                       py-2.5 rounded-xl transition-all disabled:opacity-60"
          >
            {loading ? "جارٍ الحذف..." : "نعم، احذف"}
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-600 text-xs
                       font-medium py-2.5 rounded-xl transition-all"
          >
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
}

const STATUS_COLORS = {
  active:      "bg-green-50 text-green-700",
  inactive:    "bg-gray-50  text-gray-500",
  banned:      "bg-red-50   text-red-600",
  available:   "bg-green-50 text-green-700",
  unavailable: "bg-orange-50 text-orange-500",
};
const STATUS_LABEL = {
  active:      "نشط",
  inactive:    "غير نشط",
  banned:      "محظور",
  available:   "متاح",
  unavailable: "غير متاح",
};

const IMAGE_BASE = "https://tadbeer0.runasp.net/";

const fullImg = (url) => {
  if (!url || url === "string") return null;
  return url.startsWith("http") ? url : `${IMAGE_BASE}${url}`;
};

// Confirmed field names from OverviewTab.jsx / WorkerProfile API
const resolveWorker = (t) => {
  const name = `${t.firstName ?? ""} ${t.lastName ?? ""}`.trim() || t.fullName || t.name || "—";

  // OverviewTab uses t.phoneNumber directly
  const phone = t.phoneNumber || t.primaryPhoneNumber || "—";

  // OverviewTab uses t.specialtyNames?.join(" ، ")
  const specialtyAll = Array.isArray(t.specialtyNames) && t.specialtyNames.length > 0
    ? t.specialtyNames.join(" ، ")
    : t.specialty || t.specialtyName || null;

  // OverviewTab uses t.city
  const city = t.city || "—";

  // OverviewTab uses t.experienceYears
  const experience = t.experienceYears != null ? `${t.experienceYears} سنوات` : "—";

  // OverviewTab uses t.avgRating
  const rating = t.avgRating != null ? Number(t.avgRating) : null;

  const reviewsCount = t.reviewsCount ?? null;

  // isAvailable bool (WorkerProfile) takes priority, fallback to status string
  const statusRaw =
    t.isAvailable === true  ? "available"   :
    t.isAvailable === false ? "unavailable" :
    (t.status?.toLowerCase() ?? "");

  const bio = t.jobDescription || t.bio || null;

  const completedJobs = t.completedJobsCount ?? t.completedJobs ?? null;

  const profileImage = fullImg(t.profileImage || t.ProfileImage || null);

  const joinDate = t.createdAt || t.joinedAt || null;

  return { id: t.id, name, email: t.email || "—", phone, specialtyAll, city, experience, rating, reviewsCount, statusRaw, bio, completedJobs, profileImage, joinDate };
};

function WorkerAvatar({ src, name, initial }) {
  const [err, setErr] = React.useState(false);
  if (src && !err) {
    return (
      <img
        src={src}
        alt={name}
        onError={() => setErr(true)}
        className="w-8 h-8 rounded-full object-cover flex-shrink-0 border border-gray-100"
      />
    );
  }
  return (
    <div className="w-8 h-8 rounded-full bg-[#001F3F] flex items-center justify-center
                    text-[#F7A823] text-[11px] font-bold flex-shrink-0">
      {initial}
    </div>
  );
}

const Technicians = () => {
  const navigate = useNavigate();
  const [techs,    setTechs   ] = useState(null);   // null = loading, [] = empty
  const [profiles, setProfiles] = useState({});      // id → full profile data
  const [toDelete, setToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/auth/login"); return; }
      const headers = { Authorization: `Bearer ${token}` };

      // Step 1 — fetch the user list
      let list = [];
      try {
        const res = await axios.get(`${API_BASE}/Admin/Users?role=Worker`, { headers });
        const raw = res.data?.items ?? res.data?.data ?? res.data ?? [];
        list = Array.isArray(raw) ? raw : [];
        // Filter to workers only if mixed roles returned
        const workers = list.filter(u =>
          !u.role ||
          u.role?.toLowerCase().includes("worker") ||
          u.role?.toLowerCase().includes("technician")
        );
        list = workers.length > 0 ? workers : list;
      } catch (err) {
        console.warn("[Technicians] Admin/Users failed:", err.response?.status);
        if (err.response?.status === 401) { localStorage.clear(); navigate("/auth/login"); return; }
        if (err.response?.status === 403) {
          setErrorMsg("ليس لديك صلاحية الوصول إلى هذه البيانات (403)");
          setTechs([]);
          return;
        }
        // Fallback to General/Workers
        try {
          const res2 = await axios.get(`${API_BASE}/General/Workers`, { headers });
          const raw2 = res2.data?.items ?? res2.data?.data ?? res2.data ?? [];
          list = Array.isArray(raw2) ? raw2 : [];
        } catch (err2) {
          const s = err2.response?.status;
          setErrorMsg(`فشل تحميل البيانات (${s ?? "خطأ في الشبكة"})`);
          setTechs([]);
          return;
        }
      }

      setTechs(list);

      // Step 2 — enrich each worker with full profile (specialty, city, experience, rating…)
      // Uses the same endpoint WorkerProfile uses: General/Workers/{id}
      const enrichAll = async () => {
        const enriched = {};
        await Promise.allSettled(
          list.map(async (u) => {
            if (!u.id) return;
            try {
              const r = await axios.get(`${API_BASE}/General/Workers/${u.id}`, { headers });
              enriched[u.id] = r.data?.data ?? r.data ?? {};
            } catch {
              // silently skip — row will show base data
            }
          })
        );
        setProfiles(enriched);
      };

      enrichAll();
    };

    load();
  }, [navigate]);

  const handleDelete = async () => {
    if (!toDelete) return;
    setDeleting(true);
    setErrorMsg("");
    try {
      const token = localStorage.getItem("token");
      await axios.delete(
        `${API_BASE}/Admin/Users/${toDelete.id}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setTechs(prev => prev.filter(t => t.id !== toDelete.id));
      setProfiles(prev => { const n = { ...prev }; delete n[toDelete.id]; return n; });
      setToDelete(null);
    } catch {
      setErrorMsg("فشل الحذف، يرجى المحاولة مجدداً");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <>
      {toDelete && (
        <ConfirmModal
          name={toDelete.name}
          onConfirm={handleDelete}
          onCancel={() => { setToDelete(null); setErrorMsg(""); }}
          loading={deleting}
        />
      )}

      <div className="space-y-4">
        <div className="pb-3 border-b border-gray-100">
          <h2 className="text-base font-medium text-gray-700">
            إدارة الفنيين
            <span className="mr-2 text-xs font-normal text-gray-400">({techs?.length ?? 0})</span>
          </h2>
        </div>

        {errorMsg && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-xs p-3 rounded-xl space-y-1">
            <p className="font-medium">⚠️ {errorMsg}</p>
            <p className="text-red-400">افتح Console (F12) للتفاصيل الكاملة</p>
          </div>
        )}

        {techs === null ? <Spinner /> : techs.length === 0 && !errorMsg ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
              <UserCog size={20} className="text-gray-300" />
            </div>
            <p className="text-sm text-gray-400">لا يوجد فنيون مسجلون حالياً</p>
            <p className="text-xs text-gray-300">سيظهرون هنا فور تسجيلهم</p>
          </div>
        ) : techs.length > 0 ? (
          <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
            <table className="w-full">
              <thead>
                <tr className="text-[10px] text-gray-400 border-b border-gray-100">
                  <th className="py-3 px-6 text-right font-medium">الاسم</th>
                  <th className="py-3 px-4 text-right font-medium">البريد</th>
                  <th className="py-3 px-4 text-right font-medium">رقم الهاتف</th>
                  <th className="py-3 px-4 text-right font-medium">التخصص</th>
                  <th className="py-3 px-4 text-right font-medium">المدينة</th>
                  <th className="py-3 px-4 text-right font-medium">الخبرة</th>
                  <th className="py-3 px-4 text-right font-medium">التقييم</th>
                  <th className="py-3 px-4 text-right font-medium">الوظائف المكتملة</th>
                  <th className="py-3 px-4 text-right font-medium">تاريخ الانضمام</th>
                  <th className="py-3 px-4 text-center font-medium">الحالة</th>
                  <th className="py-3 px-4 text-center font-medium">الملف</th>
                  <th className="py-3 px-6 text-center font-medium">حذف</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-gray-50">
                {techs.map((base, i) => {
                  // Merge base list data with the enriched full profile (if loaded)
                  const full = profiles[base.id] ?? {};
                  const merged = { ...base, ...full };
                  const t = resolveWorker(merged);
                  const statusCls = STATUS_COLORS[t.statusRaw] ?? "bg-gray-50 text-gray-400";
                  const isEnriched = !!profiles[base.id];

                  return (
                    <tr key={t.id ?? i} className="hover:bg-gray-50/60 transition-colors">

                      {/* Name + avatar */}
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <WorkerAvatar
                            src={t.profileImage}
                            name={t.name}
                            initial={base.firstName?.[0] ?? base.name?.[0] ?? "ف"}
                          />
                          <div>
                            <span className="font-medium text-gray-800 block">{t.name}</span>
                            {t.bio && (
                              <span className="text-[10px] text-gray-400 line-clamp-1 max-w-[140px]">
                                {t.bio}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-gray-500">{t.email}</td>
                      <td className="py-4 px-4 text-gray-400">{t.phone}</td>

                      {/* Specialty */}
                      <td className="py-4 px-4">
                        {isEnriched ? (
                          t.specialtyAll ? (
                            <span className="px-2 py-1 rounded-full text-[10px] bg-yellow-50 text-yellow-700">
                              {t.specialtyAll}
                            </span>
                          ) : <span className="text-gray-300">—</span>
                        ) : (
                          <span className="inline-block w-16 h-3 bg-gray-100 rounded animate-pulse" />
                        )}
                      </td>

                      {/* City */}
                      <td className="py-4 px-4 text-gray-400">
                        {isEnriched ? t.city : <span className="inline-block w-12 h-3 bg-gray-100 rounded animate-pulse" />}
                      </td>

                      {/* Experience */}
                      <td className="py-4 px-4 text-gray-400">
                        {isEnriched ? t.experience : <span className="inline-block w-14 h-3 bg-gray-100 rounded animate-pulse" />}
                      </td>

                      {/* Rating */}
                      <td className="py-4 px-4">
                        {isEnriched ? (
                          t.rating != null ? (
                            <div className="flex items-center gap-1">
                              <Star size={11} className="fill-yellow-400 text-yellow-400" />
                              <span className="text-gray-600">{t.rating.toFixed(1)}</span>
                              {t.reviewsCount != null && (
                                <span className="text-gray-300">({t.reviewsCount})</span>
                              )}
                            </div>
                          ) : <span className="text-gray-300">—</span>
                        ) : <span className="inline-block w-10 h-3 bg-gray-100 rounded animate-pulse" />}
                      </td>

                      {/* Completed jobs */}
                      <td className="py-4 px-4 text-gray-400">
                        {isEnriched
                          ? (t.completedJobs != null ? t.completedJobs : "—")
                          : <span className="inline-block w-8 h-3 bg-gray-100 rounded animate-pulse" />}
                      </td>

                      {/* Join date */}
                      <td className="py-4 px-4 text-gray-400">
                        {t.joinDate ? new Date(t.joinDate).toLocaleDateString("ar-EG") : "—"}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-4 text-center">
                        <span className={`px-2 py-1 rounded-full text-[10px] font-medium ${statusCls}`}>
                          {STATUS_LABEL[t.statusRaw] || base.status || "—"}
                        </span>
                      </td>

                      {/* View profile */}
                      <td className="py-4 px-4 text-center">
                        <button
                          onClick={() => navigate(`/worker-profile/${t.id}`)}
                          className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg
                                     bg-blue-50 text-blue-500 hover:bg-blue-100 transition-colors
                                     text-[10px] font-medium"
                        >
                          <ExternalLink size={11} />
                          الملف
                        </button>
                      </td>

                      {/* Delete */}
                      <td className="py-4 px-6 text-center">
                        <button
                          onClick={() => setToDelete({ id: t.id, name: t.name })}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg
                                     bg-red-50 text-red-500 hover:bg-red-100 transition-colors
                                     text-[10px] font-medium"
                        >
                          <Trash2 size={12} />
                          حذف
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        ) : null}
      </div>
    </>
  );
};

export default Technicians;
