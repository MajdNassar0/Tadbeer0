import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import {
  ClipboardList, CheckCircle2, Clock, Star,
  X, Check, Loader2, MessageSquare, User
} from "lucide-react";
import { toast, Toaster } from "sonner";

const API_BASE = "https://tadbeer0.runasp.net/api";

const STATUS_MAP = {
  completed:  { label: "مكتمل",        cls: "bg-green-100  text-green-600"  },
  pending:    { label: "قيد الانتظار", cls: "bg-yellow-100 text-yellow-700" },
  inprogress: { label: "قيد التنفيذ",  cls: "bg-orange-100 text-orange-600" },
  cancelled:  { label: "ملغى",          cls: "bg-red-100    text-red-600"    },
  confirmed:  { label: "مقبول",         cls: "bg-blue-100   text-blue-600"   },
};

const ACTION_TO_STATUS = {
  accept:   "Confirmed",
  cancel:   "Cancelled",
  complete: "Completed",
};

const ACTION_LABELS = { accept: "قبول", cancel: "رفض", complete: "إتمام" };

const DAYS_AR = {
  saturday: "السبت",    sunday:    "الأحد",
  monday:   "الاثنين",  tuesday:   "الثلاثاء",
  wednesday:"الأربعاء", thursday:  "الخميس",
  friday:   "الجمعة",
};

const getKey = (s) => s?.toString().toLowerCase().trim().replace(/\s/g, "") ?? "";

function statusInfo(status) {
  const key = getKey(status);
  return STATUS_MAP[key] ?? { label: status || "—", cls: "bg-gray-100 text-gray-500" };
}

function Spinner() {
  return (
    <div className="flex justify-center py-8">
      <div className="w-6 h-6 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// ── Mini review card (same style as Reviews page) ────────────────────────────
function MiniReviewCard({ review }) {
  return (
    <div className="bg-gray-50 rounded-2xl p-4 space-y-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-yellow-50 rounded-full flex items-center justify-center
                          text-yellow-600 font-medium text-xs flex-shrink-0">
            {review.userName?.charAt(0)?.toUpperCase() ?? "م"}
          </div>
          <p className="text-xs font-medium text-gray-800">{review.userName || "عميل"}</p>
        </div>
        <div className="flex gap-0.5">
          {[1,2,3,4,5].map(i => (
            <Star key={i} size={11}
              className={i <= (review.rate ?? 0)
                ? "fill-amber-400 text-amber-400"
                : "fill-gray-200 text-gray-200"
              }
            />
          ))}
        </div>
      </div>
      {review.comment && (
        <p className="text-[11px] text-gray-500 leading-relaxed line-clamp-2 pr-1
                      border-r-2 border-yellow-300 italic">
          "{review.comment}"
        </p>
      )}
      <p className="text-[10px] text-gray-300">
        {review.createdAt
          ? new Date(review.createdAt).toLocaleDateString("ar-EG", {
              day: "numeric", month: "long"
            })
          : ""}
      </p>
    </div>
  );
}

// ── Main ──────────────────────────────────────────────────────────────────────
const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useOutletContext();

  const [bookings,  setBookings ] = useState(undefined);
  const [reviews,   setReviews  ] = useState(null);
  const [actioning, setActioning] = useState({});

  // Get worker ID from saved user
  const workerUser = (() => {
    try { return JSON.parse(localStorage.getItem("user") ?? "null"); }
    catch { return null; }
  })();
  const workerId = workerUser?.id || workerUser?.userId;

  const load = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/auth/login"); return; }
    const h = { headers: { Authorization: `Bearer ${token}` } };

    // Fetch bookings
    try {
      const bkRes = await axios.get(`${API_BASE}/Worker/Bookings`, h);
      const bkRaw = bkRes.data.items ?? bkRes.data.bookings ?? bkRes.data ?? [];
      setBookings(Array.isArray(bkRaw) ? bkRaw : []);
    } catch (err) {
      setBookings([]);
      if (err.response?.status === 401) { localStorage.clear(); navigate("/auth/login"); }
    }

    // Fetch reviews WITH auth and filter to this worker
    try {
      const revRes = await axios.get(`${API_BASE}/General/Reviews`, h);
      const revRaw = revRes.data.items ?? revRes.data ?? [];
      const myReviews = Array.isArray(revRaw)
        ? revRaw.filter(r => !workerId || r.workerId === workerId)
        : [];
      setReviews(myReviews);
    } catch {
      setReviews([]);
    }
  }, [navigate, workerId]);

  useEffect(() => { load(); }, [load]);

  useEffect(() => {
    const id = setInterval(load, 8000);
    return () => clearInterval(id);
  }, [load]);

  const updateStatus = async (bookingId, action) => {
    setActioning(prev => ({ ...prev, [bookingId]: action }));
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `${API_BASE}/Worker/Bookings/${bookingId}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const newStatus = res.data?.status ?? ACTION_TO_STATUS[action];
      setBookings(prev => prev.map(b =>
        b.id === bookingId ? { ...b, status: newStatus } : b
      ));

      // 🔔 save notification for user when worker accepts
      if (action === "accept") {
        const booking = bookings.find(b => b.id === bookingId);
        if (booking?.userId) {
          const existing = JSON.parse(localStorage.getItem("userNotifications") || "[]");
          if (!existing.some(n => n.bookingId === bookingId)) {
            existing.push({
              bookingId,
              userId: booking.userId,
              message: `تم قبول حجزك مع ${booking.workerName || "العامل"}`,
              date: booking.bookingDate,
              read: false,
              createdAt: new Date().toISOString(),
            });
            localStorage.setItem("userNotifications", JSON.stringify(existing));
          }
        }
      }

      toast.success(`تم ${ACTION_LABELS[action]} الحجز بنجاح`);
    } catch (err) {
      toast.error(`فشل ${ACTION_LABELS[action]} الحجز`);
    } finally {
      setActioning(prev => { const n = { ...prev }; delete n[bookingId]; return n; });
    }
  };

  // Stats
  const total     = bookings?.length ?? 0;
  const completed = bookings?.filter(b => getKey(b.status) === "completed").length ?? 0;
  const pending   = bookings?.filter(b => getKey(b.status) === "pending").length   ?? 0;
  const hours     = Math.round(
    (bookings?.reduce((s, b) => s + (b.durationMinutes ?? 0), 0) ?? 0) / 60
  );
  const avgRating = reviews?.length
    ? (reviews.reduce((s, r) => s + (r.rate ?? 0), 0) / reviews.length).toFixed(1)
    : null;

  
  // Upcoming bookings
  const upcoming = (bookings ?? [])
    .filter(b => ["pending","confirmed"].includes(getKey(b.status)))
    .sort((a, b) => new Date(a.bookingDate) - new Date(b.bookingDate))
    .slice(0, 4);

  return (
    <div className="flex flex-col lg:flex-row gap-6" dir="rtl">
      <Toaster position="top-center" richColors />

      {/* ── Left: main content ── */}
      <div className="flex-1 space-y-6 min-w-0">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "إجمالي الحجوزات", value: total,     icon: <ClipboardList size={17}/>, bg: "bg-blue-50",   color: "text-blue-500"   },
            { label: "المكتملة",         value: completed, icon: <CheckCircle2  size={17}/>, bg: "bg-green-50",  color: "text-green-500"  },
            { label: "قيد الانتظار",    value: pending,   icon: <Clock         size={17}/>, bg: "bg-yellow-50", color: "text-yellow-600" },
            { label: "ساعات العمل",     value: hours,     icon: <Clock         size={17}/>, bg: "bg-orange-50", color: "text-orange-500" },
          ].map((s, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100
                                    flex items-center justify-between hover:shadow-sm transition-shadow">
              <div>
                <p className="text-[10px] text-gray-400 mb-0.5">{s.label}</p>
                <h4 className={`text-2xl font-medium text-gray-800
                  ${bookings === undefined ? "animate-pulse text-gray-200" : ""}`}>
                  {bookings === undefined ? "···" : s.value}
                </h4>
              </div>
              <div className={`${s.bg} ${s.color} p-2.5 rounded-xl`}>{s.icon}</div>
            </div>
          ))}
        </div>

      

        {/* Bookings table with actions */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-50">
            <h3 className="text-sm font-medium text-gray-800">
              آخر الحجوزات
              {bookings !== undefined && (
                <span className="mr-2 text-xs font-normal text-gray-400">({total})</span>
              )}
            </h3>
          </div>

          {bookings === undefined ? <Spinner /> :
           bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <ClipboardList size={20} className="text-gray-200" />
              <p className="text-sm text-gray-400">لا توجد حجوزات حالياً</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[560px]">
                <thead className="bg-gray-50/50 border-b border-gray-50">
                  <tr className="text-[10px] text-gray-400">
                    <th className="py-3 px-6 text-right font-medium">العميل</th>
                    <th className="py-3 px-4 text-right font-medium">التاريخ</th>
                    <th className="py-3 px-4 text-right font-medium">الوقت</th>
                    <th className="py-3 px-4 text-center font-medium">الحالة</th>
                    <th className="py-3 px-6 text-center font-medium">إجراء</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-gray-50">
                  {bookings.slice(0, 5).map((b, i) => {
                    const info  = statusInfo(b.status);
                    const sKey  = getKey(b.status);
                    const isAct = actioning[b.id];
                    return (
                      <tr key={b.id ?? i} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-4 px-6 font-medium text-gray-800">{b.userName || "—"}</td>
                        <td className="py-4 px-4 text-gray-400">
                          {b.bookingDate
                            ? new Date(b.bookingDate).toLocaleDateString("ar-EG")
                            : "—"}
                        </td>
                        <td className="py-4 px-4 text-gray-400">{b.startTime?.slice(0,5) || "—"}</td>
                        <td className="py-4 px-4 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-medium ${info.cls}`}>
                            {info.label}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center justify-center gap-1.5">
                            {sKey === "pending" && (
                              <>
                                <button
                                  onClick={() => updateStatus(b.id, "accept")}
                                  disabled={!!isAct}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg
                                             bg-green-50 text-green-600 hover:bg-green-100
                                             text-[10px] font-medium disabled:opacity-50"
                                >
                                  {isAct === "accept"
                                    ? <Loader2 size={10} className="animate-spin" />
                                    : <Check size={10} />}
                                  قبول
                                </button>
                                <button
                                  onClick={() => updateStatus(b.id, "cancel")}
                                  disabled={!!isAct}
                                  className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg
                                             bg-red-50 text-red-500 hover:bg-red-100
                                             text-[10px] font-medium disabled:opacity-50"
                                >
                                  {isAct === "cancel"
                                    ? <Loader2 size={10} className="animate-spin" />
                                    : <X size={10} />}
                                  رفض
                                </button>
                              </>
                            )}
                            {(sKey === "confirmed" || sKey === "inprogress") && (
                              <button
                                onClick={() => updateStatus(b.id, "complete")}
                                disabled={!!isAct}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg
                                           bg-[#001F3F] text-white hover:bg-[#002a52]
                                           text-[10px] font-medium disabled:opacity-50"
                              >
                                {isAct === "complete"
                                  ? <Loader2 size={10} className="animate-spin" />
                                  : <Check size={10} />}
                                إتمام
                              </button>
                            )}
                            {sKey === "completed" && (
                              <span className="text-[10px] text-green-500 font-medium">✓ مكتمل</span>
                            )}
                            {sKey === "cancelled" && (
                              <span className="text-[10px] text-gray-300">—</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* ── Right sidebar ── */}
      <div className="w-full lg:w-72 space-y-5 flex-shrink-0">

        {/* Upcoming bookings */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100">
          <h4 className="text-sm font-medium text-gray-800 mb-4">الحجوزات القادمة</h4>
          {bookings === undefined ? <Spinner /> :
           upcoming.length === 0 ? (
            <div className="flex flex-col items-center py-6 gap-2">
              <Clock size={18} className="text-gray-200" />
              <p className="text-xs text-gray-300">لا توجد حجوزات قادمة</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcoming.map((b, i) => {
                const info = statusInfo(b.status);
                return (
                  <div key={i} className="p-3 bg-gray-50 rounded-2xl space-y-1.5">
                    <div className="flex items-center justify-between">
                      <p className="text-xs font-medium text-gray-800">{b.userName || "عميل"}</p>
                      <span className={`text-[10px] font-medium px-2 py-0.5 rounded-full ${info.cls}`}>
                        {info.label}
                      </span>
                    </div>
                    <p className="text-[10px] text-gray-400">
                      {DAYS_AR[b.workingDay?.toLowerCase()] ?? b.workingDay}
                      {b.bookingDate
                        ? ` · ${new Date(b.bookingDate).toLocaleDateString("ar-EG")}`
                        : ""}
                    </p>
                    <p className="text-[10px] text-gray-400">
                      {b.startTime?.slice(0,5)} – {b.endTime?.slice(0,5)}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Recent activity */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100">
          <h4 className="text-sm font-medium text-gray-800 mb-4">النشاط الأخير</h4>
          <div className="relative space-y-5 before:absolute before:right-4 before:top-2
                          before:bottom-2 before:w-[1px] before:bg-gray-100">
            {bookings === undefined ? <Spinner /> :
             bookings.length === 0 ? (
              <p className="text-xs text-gray-300 text-center py-4">لا يوجد نشاط</p>
            ) : bookings.slice(0, 4).map((b, i) => {
              const info = statusInfo(b.status);
              return (
                <div key={i} className="relative pr-9">
                  <div className="absolute right-2 top-0.5 bg-white p-0.5 z-10">
                    <CheckCircle2 size={14} className="text-orange-400" />
                  </div>
                  <p className="text-[11px] font-medium text-gray-800 leading-tight">
                    حجز من {b.userName || "عميل"}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {b.bookingDate
                      ? new Date(b.bookingDate).toLocaleDateString("ar-EG")
                      : "—"}
                    {" · "}
                    <span className={`font-medium ${info.cls.split(" ")[1] ?? ""}`}>
                      {info.label}
                    </span>
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;