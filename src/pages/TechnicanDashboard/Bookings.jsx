import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Check, X, Search, Loader2 } from "lucide-react";
import { toast, Toaster } from "sonner";

const API_BASE = "https://tadbeer0.runasp.net/api";

const STATUS_MAP = {
  completed:  { label: "مكتمل",        cls: "bg-green-100  text-green-600"  },
  pending:    { label: "قيد الانتظار", cls: "bg-yellow-100 text-yellow-700" },
  inprogress: { label: "قيد التنفيذ",  cls: "bg-orange-100 text-orange-600" },
  cancelled:  { label: "ملغى",          cls: "bg-red-100    text-red-600"    },
  confirmed:  { label: "مقبول",         cls: "bg-blue-100   text-blue-600"   },
};

const ACTION_LABELS = { accept: "قبول", cancel: "رفض", complete: "إتمام" };

const ACTION_TO_STATUS = {
  accept  : "Confirmed",
  cancel  : "Cancelled",
  complete: "Completed",
};

const DAYS_AR = {
  saturday: "السبت",   sunday:    "الأحد",
  monday:   "الاثنين", tuesday:   "الثلاثاء",
  wednesday:"الأربعاء",thursday:  "الخميس",
  friday:   "الجمعة",
};

const getKey = (s) => s?.toString().toLowerCase().trim().replace(/\s/g, "") ?? "";

// ✅ Helper to group similar statuses together
const normalizeStatus = (status) => {
  const key = getKey(status);
  if (["pending", "waiting"].includes(key)) return "pending";
  if (["confirmed", "accepted"].includes(key)) return "confirmed";
  if (["completed", "done", "finished"].includes(key)) return "completed";
  if (["cancelled", "canceled", "rejected"].includes(key)) return "cancelled";
  return key;
};

const FILTERS = [
  { key: "all",       label: "الكل"          },
  { key: "pending",   label: "قيد الانتظار"  },
  { key: "confirmed", label: "مقبول"          },
  { key: "completed", label: "مكتمل"          },
  { key: "cancelled", label: "ملغى"           },
];

function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <Loader2 size={24} className="animate-spin text-yellow-400" />
    </div>
  );
}

const Bookings = () => {
  const navigate   = useNavigate();
  const [bookings, setBookings ] = useState(undefined);
  const [actioning,setActioning] = useState({});
  const [search,   setSearch   ] = useState("");
  const [filter,   setFilter   ] = useState("all");

  const load = useCallback(async () => {
    const token = localStorage.getItem("token");
    if (!token) { navigate("/auth/login"); return; }
    try {
      const res = await axios.get(`${API_BASE}/Worker/Bookings`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const items = res.data.items ?? res.data ?? [];
      setBookings(Array.isArray(items) ? items : []);
    } catch (err) {
      setBookings([]);
      if (err.response?.status === 401) { localStorage.clear(); navigate("/auth/login"); }
    }
  }, [navigate]);

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
      toast.success(`تم ${ACTION_LABELS[action]} الحجز بنجاح`);
    } catch (err) {
      const msg = err.response?.data?.message || "";
      toast.error(msg || `فشل ${ACTION_LABELS[action]} الحجز`);
    } finally {
      setActioning(prev => { const n = { ...prev }; delete n[bookingId]; return n; });
    }
  };

  // ✅ Updated counts using normalized status
  const counts = (bookings ?? []).reduce((acc, b) => {
    const k = normalizeStatus(b.status);
    acc[k] = (acc[k] || 0) + 1;
    return acc;
  }, {});

  // ✅ Updated filtering using normalized status
  const filtered = (bookings ?? []).filter(b => {
    const matchSearch = !search ||
      b.userName?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || normalizeStatus(b.status) === filter;
    return matchSearch && matchFilter;
  });

  return (
    <div className="space-y-5" dir="rtl">
      <Toaster position="top-center" richColors />

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4
                      bg-white p-5 rounded-3xl border border-gray-100 shadow-sm">
        <h2 className="text-lg font-medium text-[#001F3F]">
          الحجوزات
          <span className="mr-2 text-sm font-normal text-gray-400">
            ({bookings?.length ?? 0})
          </span>
        </h2>
        <div className="relative">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="بحث باسم العميل..."
            className="bg-gray-50 border border-gray-100 rounded-2xl pr-9 pl-4 py-2
                       text-xs outline-none focus:ring-2 focus:ring-yellow-400/30 w-full sm:w-56"
          />
        </div>
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-hide">
        {FILTERS.map(f => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-4 py-2 rounded-2xl text-xs font-medium whitespace-nowrap
                        transition-all flex-shrink-0
              ${filter === f.key
                ? "bg-[#001F3F] text-white"
                : "bg-white text-gray-500 border border-gray-100 hover:border-gray-200"
              }`}
          >
            {f.label}
            {f.key !== "all" && counts[f.key] ? (
              <span className={`mr-1.5 text-[9px] ${filter === f.key ? "opacity-70" : "text-gray-400"}`}>
                ({counts[f.key]})
              </span>
            ) : null}
          </button>
        ))}
      </div>

      {bookings === undefined ? <Spinner /> :
       filtered.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3
                        bg-white rounded-3xl border border-gray-100">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <ClipboardList size={20} className="text-gray-300" />
          </div>
          <p className="text-sm text-gray-400">
            {bookings.length === 0 ? "لا توجد حجوزات حالياً" : "لا توجد نتائج مطابقة"}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-3xl border border-gray-100 overflow-hidden shadow-sm">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px]">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr className="text-[10px] text-gray-400">
                  <th className="py-4 px-6 text-right font-medium">العميل</th>
                  <th className="py-4 px-4 text-right font-medium">الموعد</th>
                  <th className="py-4 px-4 text-right font-medium">المدة</th>
                  <th className="py-4 px-4 text-center font-medium">الحالة</th>
                  <th className="py-4 px-6 text-center font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-gray-50">
                {filtered.map(b => {
                  const sKey  = normalizeStatus(b.status);
                  const info  = STATUS_MAP[sKey] ?? { label: b.status || "—", cls: "bg-gray-100 text-gray-500" };
                  const isAct = actioning[b.id];
                  return (
                    <tr key={b.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="py-4 px-6 font-medium text-gray-800">
                        {b.userName || "—"}
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-gray-700 font-medium">
                          {DAYS_AR[b.workingDay?.toLowerCase()] ?? b.workingDay ?? "—"}
                        </p>
                        <p className="text-gray-400 mt-0.5">
                          {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString("ar-EG") : "—"}
                        </p>
                        <p className="text-gray-400">
                          {b.startTime?.slice(0,5)} – {b.endTime?.slice(0,5)}
                        </p>
                      </td>
                      <td className="py-4 px-4 text-gray-400">
                        {b.durationMinutes ? `${b.durationMinutes} د` : "—"}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-medium ${info.cls}`}>
                          {info.label}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          {sKey === "pending" && (
                            <>
                              <button
                                onClick={() => updateStatus(b.id, "accept")}
                                disabled={!!isAct}
                                className="bg-green-50 text-green-600 px-3 py-1.5 rounded-xl text-[10px]"
                              >
                                {isAct === "accept" ? <Loader2 size={12} className="animate-spin" /> : <Check size={12} />}
                                قبول
                              </button>
                              <button
                                onClick={() => updateStatus(b.id, "cancel")}
                                disabled={!!isAct}
                                className="bg-red-50 text-red-500 px-3 py-1.5 rounded-xl text-[10px]"
                              >
                                {isAct === "cancel" ? <Loader2 size={12} className="animate-spin" /> : <X size={12} />}
                                رفض
                              </button>
                            </>
                          )}
                          {(sKey === "confirmed" || sKey === "inprogress") && (
                           <button
  onClick={() => updateStatus(b.id, "complete")}
  disabled={!!isAct}
  className="bg-[#001F3F] text-white px-4 py-2 rounded-xl text-[10px]"
>
  {isAct === "complete" ? (
    <Loader2 size={12} className="animate-spin" />
  ) : null}
  إتمام الخدمة
</button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Bookings;