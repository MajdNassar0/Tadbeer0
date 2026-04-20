import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Check, X } from "lucide-react";

const STATUS_MAP = {
  completed : { label: "مكتمل",       cls: "bg-green-100  text-green-600"  },
  pending   : { label: "معلق",         cls: "bg-red-100    text-red-600"    },
  inprogress: { label: "قيد التنفيذ", cls: "bg-orange-100 text-orange-600" },
  cancelled : { label: "ملغى",         cls: "bg-gray-100   text-gray-500"   },
  confirmed : { label: "مؤكد",         cls: "bg-blue-100   text-blue-600"   },
};

function statusInfo(status = "") {
  const key = status?.toLowerCase().replace(/\s/g, "") ?? "";
  return STATUS_MAP[key] ?? { label: status || "—", cls: "bg-gray-100 text-gray-500" };
}

function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="w-7 h-7 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

const DAYS_AR = {
  saturday : "السبت",   sunday   : "الأحد",
  monday   : "الاثنين", tuesday  : "الثلاثاء",
  wednesday: "الأربعاء",thursday : "الخميس",
  friday   : "الجمعة",
};

const Bookings = () => {
  const navigate   = useNavigate();
  const [bookings, setBookings] = useState(undefined);
  const [loading,  setLoading ] = useState({}); // { [id]: "accept"|"cancel"|"complete" }
  const [search,   setSearch  ] = useState("");
  const [error,    setError   ] = useState("");

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/auth/login"); return; }
      try {
        const res = await axios.get("https://tadbeer0.runasp.net/api/Worker/Bookings",
          { headers: { Authorization: `Bearer ${token}` } });
        const items = res.data.items ?? res.data ?? [];
        setBookings(Array.isArray(items) ? items : []);
      } catch (err) {
        setBookings([]);
        if (err.response?.status === 401) { localStorage.clear(); navigate("/auth/login"); }
      }
    };
    load();
  }, [navigate]);

  const updateStatus = async (id, action) => {
    setLoading(prev => ({ ...prev, [id]: action }));
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await axios.patch(
        `https://tadbeer0.runasp.net/api/Worker/Bookings/${id}/${action}`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      // Update the booking in state with the new status from response
      setBookings(prev => prev.map(b =>
        b.id === id ? { ...b, status: res.data.status ?? b.status } : b
      ));
    } catch {
      setError("فشل تحديث الحالة، يرجى المحاولة مجدداً");
    } finally {
      setLoading(prev => { const n = { ...prev }; delete n[id]; return n; });
    }
  };

  const filtered = bookings?.filter(b => {
    if (!search) return true;
    const q = search.toLowerCase();
    return b.userName?.toLowerCase().includes(q) || b.status?.toLowerCase().includes(q);
  }) ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h2 className="text-base font-medium text-gray-700">
          الحجوزات
          <span className="mr-2 text-xs font-normal text-gray-400">({bookings?.length ?? 0})</span>
        </h2>
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="بحث باسم العميل..."
          className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2
                     text-xs outline-none focus:ring-2 focus:ring-yellow-400/30 w-52"
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-600 text-xs p-3 rounded-xl">
          {error}
        </div>
      )}

      {bookings === undefined ? <Spinner /> : bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <ClipboardList size={20} className="text-gray-300" />
          </div>
          <p className="text-sm text-gray-400">لا توجد حجوزات حالياً</p>
          <p className="text-xs text-gray-300">ستظهر هنا فور إضافتها</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="text-[10px] text-gray-400 border-b border-gray-100">
                  <th className="py-3 px-6 text-right font-medium">العميل</th>
                  <th className="py-3 px-4 text-right font-medium">تاريخ الحجز</th>
                  <th className="py-3 px-4 text-right font-medium">اليوم</th>
                  <th className="py-3 px-4 text-right font-medium">الوقت</th>
                  <th className="py-3 px-4 text-right font-medium">المدة</th>
                  <th className="py-3 px-4 text-center font-medium">الحالة</th>
                  <th className="py-3 px-6 text-center font-medium">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="text-xs divide-y divide-gray-50">
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="py-10 text-center text-gray-300">
                    لا توجد نتائج مطابقة
                  </td></tr>
                ) : filtered.map((b, i) => {
                  const info   = statusInfo(b.status);
                  const dayAr  = DAYS_AR[b.workingDay?.toLowerCase()] ?? b.workingDay ?? "—";
                  const isLoading = loading[b.id];
                  const status = b.status?.toLowerCase().replace(/\s/g, "");
                  return (
                    <tr key={b.id ?? i} className="hover:bg-gray-50/60 transition-colors">
                      <td className="py-4 px-6 font-medium text-gray-800">{b.userName || "—"}</td>
                      <td className="py-4 px-4 text-gray-400">
                        {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString("ar-EG") : "—"}
                      </td>
                      <td className="py-4 px-4 text-gray-400">{dayAr}</td>
                      <td className="py-4 px-4 text-gray-400">
                        {b.startTime && b.endTime
                          ? `${b.startTime.slice(0,5)} – ${b.endTime.slice(0,5)}`
                          : b.startTime?.slice(0,5) ?? "—"}
                      </td>
                      <td className="py-4 px-4 text-gray-400">
                        {b.durationMinutes ? `${b.durationMinutes} د` : "—"}
                      </td>
                      <td className="py-4 px-4 text-center">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-medium ${info.cls}`}>
                          {info.label}
                        </span>
                      </td>

                      {/* Action buttons based on current status */}
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-center gap-2">
                          {status === "pending" && (
                            <>
                              <button
                                onClick={() => updateStatus(b.id, "accept")}
                                disabled={!!isLoading}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg
                                           bg-green-50 text-green-600 hover:bg-green-100
                                           transition-colors text-[10px] font-medium disabled:opacity-50"
                              >
                                {isLoading === "accept"
                                  ? <span className="w-3 h-3 border border-green-500 border-t-transparent rounded-full animate-spin" />
                                  : <Check size={11} />
                                }
                                قبول
                              </button>
                              <button
                                onClick={() => updateStatus(b.id, "cancel")}
                                disabled={!!isLoading}
                                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg
                                           bg-red-50 text-red-500 hover:bg-red-100
                                           transition-colors text-[10px] font-medium disabled:opacity-50"
                              >
                                {isLoading === "cancel"
                                  ? <span className="w-3 h-3 border border-red-400 border-t-transparent rounded-full animate-spin" />
                                  : <X size={11} />
                                }
                                رفض
                              </button>
                            </>
                          )}
                          {(status === "confirmed" || status === "inprogress") && (
                            <button
                              onClick={() => updateStatus(b.id, "complete")}
                              disabled={!!isLoading}
                              className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg
                                         bg-blue-50 text-blue-600 hover:bg-blue-100
                                         transition-colors text-[10px] font-medium disabled:opacity-50"
                            >
                              {isLoading === "complete"
                                ? <span className="w-3 h-3 border border-blue-400 border-t-transparent rounded-full animate-spin" />
                                : <Check size={11} />
                              }
                              إتمام
                            </button>
                          )}
                          {(status === "completed" || status === "cancelled") && (
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
        </div>
      )}
    </div>
  );
};

export default Bookings;