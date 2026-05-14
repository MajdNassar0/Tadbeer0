import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  TrendingUp, ClipboardList, CheckCircle2, Clock,
  Star, XCircle, BarChart2, Calendar, Award, Loader2
} from "lucide-react";

const API_BASE = "https://tadbeer0.runasp.net/api";

const getKey = (s) => s?.toString().toLowerCase().trim().replace(/\s/g, "") ?? "";

const STATUS_MAP = {
  completed:  { label: "مكتمل",        color: "#22c55e", bg: "bg-green-50",  text: "text-green-600"  },
  pending:    { label: "قيد الانتظار", color: "#eab308", bg: "bg-yellow-50", text: "text-yellow-600" },
  inprogress: { label: "قيد التنفيذ",  color: "#f97316", bg: "bg-orange-50", text: "text-orange-600" },
  cancelled:  { label: "ملغى",          color: "#ef4444", bg: "bg-red-50",    text: "text-red-500"    },
  confirmed:  { label: "مقبول",         color: "#3b82f6", bg: "bg-blue-50",   text: "text-blue-600"   },
};

function Spinner() {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="w-7 h-7 border-2 border-[#F7A823] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

// Simple bar chart drawn with divs
function BarChart({ data, maxVal }) {
  if (!data?.length) return null;
  const max = maxVal || Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-1.5 h-24 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <div className="w-full relative flex items-end" style={{ height: "72px" }}>
            <div
              className="w-full rounded-t-lg transition-all duration-700"
              style={{
                height: `${Math.max((d.value / max) * 72, d.value > 0 ? 4 : 0)}px`,
                background: d.highlight
                  ? "linear-gradient(180deg, #F7A823, #e59a1d)"
                  : "linear-gradient(180deg, #e2e8f0, #cbd5e1)",
              }}
            />
          </div>
          <span className="text-[9px] text-gray-400 font-medium truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

// Donut chart with SVG
function DonutChart({ segments, size = 80 }) {
  const r = 28, cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  let offset = 0;
  const total = segments.reduce((s, sg) => s + sg.value, 0) || 1;

  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="rotate-[-90deg]">
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * circ;
        const gap = circ - dash;
        const el = (
          <circle
            key={i}
            cx={cx} cy={cy} r={r}
            fill="none"
            stroke={seg.color}
            strokeWidth="10"
            strokeDasharray={`${dash} ${gap}`}
            strokeDashoffset={-offset}
            strokeLinecap="round"
          />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
}

const MONTHS_AR = ["يناير","فبراير","مارس","أبريل","مايو","يونيو",
                   "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];

const Reports = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(undefined);
  const [reviews,  setReviews ] = useState(undefined);

  const workerUser = (() => {
    try { return JSON.parse(localStorage.getItem("user") ?? "null"); } catch { return null; }
  })();
  const workerId = workerUser?.id || workerUser?.userId;

  const load = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/auth/login"); return; }
    const h = { headers: { Authorization: `Bearer ${token}` } };

    try {
      const bkRes = await axios.get(`${API_BASE}/Worker/Bookings`, h);
      const raw = bkRes.data.items ?? bkRes.data.bookings ?? bkRes.data ?? [];
      setBookings(Array.isArray(raw) ? raw : []);
    } catch (err) {
      setBookings([]);
      if (err.response?.status === 401) { localStorage.clear(); navigate("/auth/login"); }
    }

    try {
      const revRes = await axios.get(`${API_BASE}/General/Reviews`, h);
      const raw = revRes.data.items ?? revRes.data ?? [];
      const mine = Array.isArray(raw)
        ? raw.filter(r => !workerId || r.workerId === workerId)
        : [];
      setReviews(mine);
    } catch { setReviews([]); }
  }, [navigate, workerId]);

  useEffect(() => { load(); }, [load]);

  // ── Derived stats ──────────────────────────────────────────────────────────
  const total      = bookings?.length ?? 0;
  const completed  = bookings?.filter(b => getKey(b.status) === "completed").length  ?? 0;
  const cancelled  = bookings?.filter(b => getKey(b.status) === "cancelled").length  ?? 0;
  const pending    = bookings?.filter(b => getKey(b.status) === "pending").length    ?? 0;
  const confirmed  = bookings?.filter(b => getKey(b.status) === "confirmed").length  ?? 0;
  const hours      = Math.round((bookings?.reduce((s, b) => s + (b.durationMinutes ?? 0), 0) ?? 0) / 60);
  const avgRating  = reviews?.length
    ? (reviews.reduce((s, r) => s + (r.rate ?? 0), 0) / reviews.length).toFixed(1)
    : "—";
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;

  // Monthly bookings (last 6 months)
  const now = new Date();
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const count = bookings?.filter(b => {
      const bd = new Date(b.bookingDate);
      return bd.getFullYear() === d.getFullYear() && bd.getMonth() === d.getMonth();
    }).length ?? 0;
    return { label: MONTHS_AR[d.getMonth()].slice(0, 3), value: count, highlight: i === 5 };
  });

  // Status distribution for donut
  const donutSegments = [
    { label: "مكتمل",  value: completed, color: "#22c55e" },
    { label: "مقبول",  value: confirmed, color: "#3b82f6" },
    { label: "انتظار", value: pending,   color: "#eab308" },
    { label: "ملغى",   value: cancelled, color: "#ef4444" },
  ].filter(s => s.value > 0);

  // Rating distribution
  const ratingDist = [5,4,3,2,1].map(star => ({
    star,
    count: reviews?.filter(r => Math.round(r.rate) === star).length ?? 0,
  }));
  const maxRatingCount = Math.max(...ratingDist.map(r => r.count), 1);

  const loading = bookings === undefined || reviews === undefined;

  return (
    <div dir="rtl" className="space-y-5">

      {/* ── KPI cards ─────────────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "إجمالي الحجوزات", value: total,           icon: <ClipboardList size={16}/>, bg: "bg-blue-50",   color: "text-blue-500",   sub: "حجز مسجّل"       },
          { label: "نسبة الإتمام",    value: `${completionRate}%`, icon: <TrendingUp    size={16}/>, bg: "bg-green-50",  color: "text-green-500",  sub: `${completed} مكتمل` },
          { label: "ساعات العمل",     value: hours,            icon: <Clock         size={16}/>, bg: "bg-orange-50", color: "text-orange-500", sub: "ساعة عمل"        },
          { label: "متوسط التقييم",   value: avgRating,        icon: <Star          size={16}/>, bg: "bg-yellow-50", color: "text-yellow-500", sub: `${reviews?.length ?? 0} تقييم` },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 p-4 flex items-center justify-between hover:shadow-sm transition-shadow">
            <div>
              <p className="text-[10px] text-gray-400 mb-0.5">{s.label}</p>
              <h4 className={`text-2xl font-semibold text-gray-800 ${loading ? "animate-pulse text-gray-200" : ""}`}>
                {loading ? "···" : s.value}
              </h4>
              <p className="text-[10px] text-gray-300 mt-0.5">{s.sub}</p>
            </div>
            <div className={`${s.bg} ${s.color} p-2.5 rounded-xl`}>{s.icon}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* ── Monthly bookings chart ─────────────────────────── */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-100 p-5">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-medium text-gray-800 flex items-center gap-2">
              <BarChart2 size={15} className="text-[#F7A823]" />
              الحجوزات الشهرية
            </h3>
            <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-1 rounded-lg">آخر 6 أشهر</span>
          </div>
          {loading ? <Spinner /> : <BarChart data={monthlyData} />}
        </div>

        {/* ── Status donut ───────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-sm font-medium text-gray-800 mb-4 flex items-center gap-2">
            <Award size={15} className="text-[#F7A823]" />
            توزيع الحالات
          </h3>
          {loading ? <Spinner /> : (
            <div className="flex flex-col items-center gap-4">
              {total === 0 ? (
                <p className="text-xs text-gray-300 py-6">لا توجد بيانات</p>
              ) : (
                <>
                  <div className="relative">
                    <DonutChart segments={donutSegments.length ? donutSegments : [{ value: 1, color: "#e5e7eb" }]} size={96} />
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-lg font-semibold text-gray-800">{total}</span>
                      <span className="text-[9px] text-gray-400">إجمالي</span>
                    </div>
                  </div>
                  <div className="w-full space-y-2">
                    {donutSegments.map((seg, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center gap-1.5">
                          <div className="w-2 h-2 rounded-full" style={{ background: seg.color }} />
                          <span className="text-[11px] text-gray-600">{seg.label}</span>
                        </div>
                        <span className="text-[11px] font-medium text-gray-800">{seg.value}</span>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* ── Rating distribution ────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-sm font-medium text-gray-800 mb-4 flex items-center gap-2">
            <Star size={15} className="text-[#F7A823]" />
            توزيع التقييمات
          </h3>
          {loading ? <Spinner /> : reviews?.length === 0 ? (
            <p className="text-xs text-gray-300 text-center py-6">لا توجد تقييمات بعد</p>
          ) : (
            <div className="space-y-2.5">
              {ratingDist.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5 w-14 justify-end">
                    <span className="text-[11px] text-gray-500">{star}</span>
                    <Star size={10} className="fill-amber-400 text-amber-400" />
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className="h-full rounded-full bg-amber-400 transition-all duration-700"
                      style={{ width: `${(count / maxRatingCount) * 100}%` }}
                    />
                  </div>
                  <span className="text-[11px] text-gray-400 w-4 text-left">{count}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                <span className="text-[10px] text-gray-400">المتوسط</span>
                <div className="flex items-center gap-1">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold text-gray-800">{avgRating}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* ── Recent completed bookings ──────────────────────── */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-sm font-medium text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle2 size={15} className="text-[#F7A823]" />
            آخر الحجوزات المكتملة
          </h3>
          {loading ? <Spinner /> : (
            (() => {
              const done = bookings?.filter(b => getKey(b.status) === "completed").slice(0, 5) ?? [];
              return done.length === 0 ? (
                <p className="text-xs text-gray-300 text-center py-6">لا توجد حجوزات مكتملة</p>
              ) : (
                <div className="space-y-2">
                  {done.map((b, i) => (
                    <div key={i} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                      <div className="flex items-center gap-2.5">
                        <div className="w-7 h-7 rounded-full bg-green-50 flex items-center justify-center text-green-600 text-[10px] font-bold flex-shrink-0">
                          {(b.userName || "ع").charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-medium text-gray-800">{b.userName || "عميل"}</p>
                          <p className="text-[10px] text-gray-400">
                            {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString("ar-EG") : "—"}
                          </p>
                        </div>
                      </div>
                      <span className="text-[10px] font-medium text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                        ✓ مكتمل
                      </span>
                    </div>
                  ))}
                </div>
              );
            })()
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
