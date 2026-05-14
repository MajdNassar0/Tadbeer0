import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  BarChart2, TrendingUp, ClipboardList, CheckCircle2,
  Clock, Star, Users, XCircle
} from "lucide-react";

const API_BASE = "https://tadbeer0.runasp.net/api";
const getKey = (s) => s?.toString().toLowerCase().trim().replace(/\s/g, "") ?? "";
const MONTHS_AR = ["يناير","فبراير","مارس","أبريل","مايو","يونيو",
                   "يوليو","أغسطس","سبتمبر","أكتوبر","نوفمبر","ديسمبر"];

function Spinner() {
  return (
    <div className="flex justify-center items-center py-16">
      <div className="w-7 h-7 border-2 border-[#F7A823] border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

function BarChart({ data }) {
  const max = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="flex items-end gap-2 h-28 w-full">
      {data.map((d, i) => (
        <div key={i} className="flex flex-col items-center gap-1 flex-1">
          <span className="text-[9px] text-gray-400">{d.value || ""}</span>
          <div className="w-full flex items-end" style={{ height: "80px" }}>
            <div
              className="w-full rounded-t-lg transition-all duration-700"
              style={{
                height: `${Math.max((d.value / max) * 80, d.value > 0 ? 4 : 0)}px`,
                background: d.highlight
                  ? "linear-gradient(180deg,#F7A823,#e59a1d)"
                  : "linear-gradient(180deg,#e2e8f0,#cbd5e1)",
              }}
            />
          </div>
          <span className="text-[9px] text-gray-400 truncate w-full text-center">{d.label}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ segments, size = 96 }) {
  const r = 32, cx = size / 2, cy = size / 2;
  const circ = 2 * Math.PI * r;
  const total = segments.reduce((s, sg) => s + sg.value, 0) || 1;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
      {segments.map((seg, i) => {
        const dash = (seg.value / total) * circ;
        const el = (
          <circle key={i} cx={cx} cy={cy} r={r} fill="none"
            stroke={seg.color} strokeWidth="10"
            strokeDasharray={`${dash} ${circ - dash}`}
            strokeDashoffset={-offset} strokeLinecap="round" />
        );
        offset += dash;
        return el;
      })}
    </svg>
  );
}

const Reports = () => {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState(undefined);
  const [reviews,  setReviews ] = useState(undefined);
  const [workers,  setWorkers ] = useState(undefined);

  const load = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/auth/login"); return; }
    const h = { headers: { Authorization: `Bearer ${token}` } };

    try {
      const res = await axios.get(`${API_BASE}/Admin/Bookings`, h);
      const raw = res.data.items ?? res.data ?? [];
      setBookings(Array.isArray(raw) ? raw : []);
    } catch (err) {
      setBookings([]);
      if (err.response?.status === 401) { localStorage.clear(); navigate("/auth/login"); }
    }

    try {
      // Try admin endpoint first, fall back to general
      let revData = [];
      const reviewEndpoints = [
        `${API_BASE}/Admin/Reviews`,
        `${API_BASE}/General/Reviews`,
      ];
      for (const url of reviewEndpoints) {
        try {
          const res = await axios.get(url, h);
          const raw = res.data.items ?? res.data?.data ?? res.data ?? [];
          if (Array.isArray(raw) && raw.length >= 0) { revData = raw; break; }
        } catch { continue; }
      }
      setReviews(revData);
    } catch { setReviews([]); }

    try {
      const workerEndpoints = [
        `${API_BASE}/Admin/Workers`,
        `${API_BASE}/General/Workers`,
      ];
      let wData = [];
      for (const url of workerEndpoints) {
        try {
          const res = await axios.get(url, h);
          const raw = res.data.items ?? res.data?.data ?? res.data ?? [];
          if (Array.isArray(raw) && raw.length >= 0) { wData = raw; break; }
        } catch { continue; }
      }
      setWorkers(wData);
    } catch { setWorkers([]); }
  }, [navigate]);

  useEffect(() => { load(); }, [load]);

  const loading = bookings === undefined || reviews === undefined;

  // Stats
  const total     = bookings?.length ?? 0;
  const completed = bookings?.filter(b => getKey(b.status) === "completed").length ?? 0;
  const cancelled = bookings?.filter(b => getKey(b.status) === "cancelled").length ?? 0;
  const pending   = bookings?.filter(b => getKey(b.status) === "pending").length   ?? 0;
  const confirmed = bookings?.filter(b => getKey(b.status) === "confirmed").length ?? 0;
  const completionRate = total > 0 ? Math.round((completed / total) * 100) : 0;
  const avgRating = reviews?.length
    ? (reviews.reduce((s, r) => s + (r.rate ?? 0), 0) / reviews.length).toFixed(1)
    : "—";

  // Monthly (last 6 months)
  const now = new Date();
  const monthlyData = Array.from({ length: 6 }, (_, i) => {
    const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
    const count = bookings?.filter(b => {
      const bd = new Date(b.bookingDate);
      return bd.getFullYear() === d.getFullYear() && bd.getMonth() === d.getMonth();
    }).length ?? 0;
    return { label: MONTHS_AR[d.getMonth()].slice(0, 3), value: count, highlight: i === 5 };
  });

  // Donut segments
  const donutSegments = [
    { label: "مكتمل",  value: completed, color: "#22c55e" },
    { label: "مقبول",  value: confirmed, color: "#3b82f6" },
    { label: "انتظار", value: pending,   color: "#eab308" },
    { label: "ملغى",   value: cancelled, color: "#ef4444" },
  ].filter(s => s.value > 0);

  // Rating dist
  const ratingDist = [5,4,3,2,1].map(star => ({
    star, count: reviews?.filter(r => Math.round(r.rate) === star).length ?? 0,
  }));
  const maxRating = Math.max(...ratingDist.map(r => r.count), 1);

  // Top workers by completed bookings
  const workerMap = {};
  (bookings ?? []).forEach(b => {
    const wid = b.workerId || "x";
    const name = b.workerName || "فني";
    if (!workerMap[wid]) workerMap[wid] = { name, completed: 0, total: 0 };
    workerMap[wid].total++;
    if (getKey(b.status) === "completed") workerMap[wid].completed++;
  });
  const topWorkers = Object.values(workerMap)
    .sort((a, b) => b.completed - a.completed)
    .slice(0, 5);

  return (
    <div dir="rtl" className="space-y-5">

      {/* KPI cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {[
          { label: "إجمالي الحجوزات", value: total,             icon: <ClipboardList size={16}/>, bg: "bg-blue-50",   color: "text-blue-500",   sub: "حجز مسجّل"          },
          { label: "نسبة الإتمام",    value: `${completionRate}%`, icon: <TrendingUp size={16}/>,    bg: "bg-green-50",  color: "text-green-500",  sub: `${completed} مكتمل` },
          { label: "إجمالي الفنيين",  value: workers?.length ?? "—", icon: <Users size={16}/>,      bg: "bg-purple-50", color: "text-purple-500", sub: "فني نشط"             },
          { label: "متوسط التقييم",   value: avgRating,          icon: <Star size={16}/>,          bg: "bg-yellow-50", color: "text-yellow-500", sub: `${reviews?.length ?? 0} تقييم` },
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
        {/* Monthly chart */}
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

        {/* Status donut */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-sm font-medium text-gray-800 mb-4 flex items-center gap-2">
            <ClipboardList size={15} className="text-[#F7A823]" />
            توزيع الحالات
          </h3>
          {loading ? <Spinner /> : total === 0 ? (
            <p className="text-xs text-gray-300 text-center py-6">لا توجد بيانات</p>
          ) : (
            <div className="flex flex-col items-center gap-4">
              <div className="relative">
                <DonutChart segments={donutSegments.length ? donutSegments : [{ value: 1, color: "#e5e7eb" }]} />
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
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Rating distribution */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-sm font-medium text-gray-800 mb-4 flex items-center gap-2">
            <Star size={15} className="text-[#F7A823]" />
            توزيع التقييمات
          </h3>
          {loading ? <Spinner /> : !reviews?.length ? (
            <p className="text-xs text-gray-300 text-center py-6">لا توجد تقييمات</p>
          ) : (
            <div className="space-y-2.5">
              {ratingDist.map(({ star, count }) => (
                <div key={star} className="flex items-center gap-3">
                  <div className="flex items-center gap-0.5 w-14 justify-end">
                    <span className="text-[11px] text-gray-500">{star}</span>
                    <Star size={10} className="fill-amber-400 text-amber-400" />
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div className="h-full rounded-full bg-amber-400 transition-all duration-700"
                      style={{ width: `${(count / maxRating) * 100}%` }} />
                  </div>
                  <span className="text-[11px] text-gray-400 w-4 text-left">{count}</span>
                </div>
              ))}
              <div className="pt-2 border-t border-gray-50 flex items-center justify-between">
                <span className="text-[10px] text-gray-400">المتوسط العام</span>
                <div className="flex items-center gap-1">
                  <Star size={12} className="fill-amber-400 text-amber-400" />
                  <span className="text-sm font-semibold text-gray-800">{avgRating}</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Top workers */}
        <div className="bg-white rounded-2xl border border-gray-100 p-5">
          <h3 className="text-sm font-medium text-gray-800 mb-4 flex items-center gap-2">
            <CheckCircle2 size={15} className="text-[#F7A823]" />
            أكثر الفنيين إتماماً
          </h3>
          {loading ? <Spinner /> : topWorkers.length === 0 ? (
            <p className="text-xs text-gray-300 text-center py-6">لا توجد بيانات</p>
          ) : (
            <div className="space-y-2.5">
              {topWorkers.map((w, i) => (
                <div key={i} className="flex items-center gap-3">
                  <span className={`text-[10px] font-bold w-4 ${i === 0 ? "text-amber-500" : "text-gray-300"}`}>
                    {i + 1}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-[#001F3F] flex items-center justify-center
                                  text-[#F7A823] text-[10px] font-bold flex-shrink-0">
                    {w.name.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-medium text-gray-800 truncate">{w.name}</p>
                    <div className="flex items-center gap-1 mt-0.5">
                      <div className="flex-1 bg-gray-100 rounded-full h-1 overflow-hidden">
                        <div className="h-full bg-green-400 rounded-full"
                          style={{ width: `${(w.completed / (topWorkers[0]?.completed || 1)) * 100}%` }} />
                      </div>
                    </div>
                  </div>
                  <span className="text-[11px] font-semibold text-green-600 bg-green-50 px-2 py-0.5 rounded-full">
                    {w.completed}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
