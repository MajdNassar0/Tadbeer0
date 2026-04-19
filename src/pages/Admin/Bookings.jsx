import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Calendar } from "lucide-react";

function Spinner() {
  return (
    <div className="flex justify-center py-16">
      <div className="w-7 h-7 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

const STATUS_MAP = {
  completed : { label: "مكتمل",        cls: "bg-green-50  text-green-700"  },
  pending   : { label: "قيد الانتظار", cls: "bg-yellow-50 text-yellow-700" },
  inprogress: { label: "جارٍ التنفيذ", cls: "bg-blue-50   text-blue-700"   },
  cancelled : { label: "ملغى",          cls: "bg-red-50    text-red-700"    },
  confirmed : { label: "مؤكد",          cls: "bg-purple-50 text-purple-700" },
};

function StatusBadge({ status = "" }) {
  const key  = status?.toLowerCase().replace(/\s/g, "") ?? "";
  const info = STATUS_MAP[key] ?? { label: status || "—", cls: "bg-gray-50 text-gray-400" };
  return (
    <span className={`px-3 py-1 rounded-full text-[10px] font-medium ${info.cls}`}>
      {info.label}
    </span>
  );
}

const DAYS_AR = {
  saturday : "السبت",
  sunday   : "الأحد",
  monday   : "الاثنين",
  tuesday  : "الثلاثاء",
  wednesday: "الأربعاء",
  thursday : "الخميس",
  friday   : "الجمعة",
};

const Bookings = () => {
  const navigate   = useNavigate();
  const [bookings, setBookings] = useState(undefined);
  const [search,   setSearch  ] = useState("");

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/auth/login"); return; }
      try {
        const res = await axios.get("https://tadbeer0.runasp.net/api/Admin/Bookings",
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

  const filtered = bookings?.filter(b => {
    if (!search) return true;
    const q = search.toLowerCase();
    return (
      b.userName?.toLowerCase().includes(q) ||
      b.workerName?.toLowerCase().includes(q) ||
      b.status?.toLowerCase().includes(q)
    );
  }) ?? [];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-gray-100">
        <h2 className="text-base font-medium text-gray-700">
          الحجوزات
          <span className="mr-2 text-xs font-normal text-gray-400">
            ({bookings?.length ?? 0})
          </span>
        </h2>
        {/* Search */}
        <input
          type="text"
          value={search}
          onChange={e => setSearch(e.target.value)}
          placeholder="بحث باسم العميل أو الفني..."
          className="bg-gray-50 border border-gray-100 rounded-xl px-4 py-2
                     text-xs outline-none focus:ring-2 focus:ring-yellow-400/30 w-56"
        />
      </div>

      {bookings === undefined ? <Spinner /> : bookings.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3">
          <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
            <Calendar size={20} className="text-gray-300" />
          </div>
          <p className="text-sm text-gray-400">لا توجد حجوزات حالياً</p>
          <p className="text-xs text-gray-300">ستظهر الحجوزات هنا فور إضافتها</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-gray-400 border-b border-gray-100">
                <th className="py-3 px-6 text-right font-medium">العميل</th>
                <th className="py-3 px-4 text-right font-medium">الفني</th>
                <th className="py-3 px-4 text-right font-medium">تاريخ الحجز</th>
                <th className="py-3 px-4 text-right font-medium">اليوم</th>
                <th className="py-3 px-4 text-right font-medium">الوقت</th>
                <th className="py-3 px-4 text-right font-medium">المدة</th>
                <th className="py-3 px-4 text-right font-medium">تاريخ الإنشاء</th>
                <th className="py-3 px-6 text-center font-medium">الحالة</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-gray-300">
                    لا توجد نتائج مطابقة للبحث
                  </td>
                </tr>
              ) : filtered.map((b, i) => {
                const dayAr = DAYS_AR[b.workingDay?.toLowerCase()] ?? b.workingDay ?? "—";
                return (
                  <tr key={b.id ?? i} className="hover:bg-gray-50/60 transition-colors">

                    {/* Client */}
                    <td className="py-4 px-6 font-medium text-gray-800">
                      {b.userName || "—"}
                    </td>

                    {/* Worker */}
                    <td className="py-4 px-4 text-gray-500">
                      {b.workerName || "لم يحدد"}
                    </td>

                    {/* Booking date */}
                    <td className="py-4 px-4 text-gray-400">
                      {b.bookingDate
                        ? new Date(b.bookingDate).toLocaleDateString("ar-EG")
                        : "—"}
                    </td>

                    {/* Day */}
                    <td className="py-4 px-4 text-gray-400">{dayAr}</td>

                    {/* Time */}
                    <td className="py-4 px-4 text-gray-400">
                      {b.startTime && b.endTime
                        ? `${b.startTime.slice(0, 5)} – ${b.endTime.slice(0, 5)}`
                        : b.startTime?.slice(0, 5) ?? "—"}
                    </td>

                    {/* Duration */}
                    <td className="py-4 px-4 text-gray-400">
                      {b.durationMinutes != null ? `${b.durationMinutes} د` : "—"}
                    </td>

                    {/* Created at */}
                    <td className="py-4 px-4 text-gray-400">
                      {b.createdAt
                        ? new Date(b.createdAt).toLocaleDateString("ar-EG")
                        : "—"}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6 text-center">
                      <StatusBadge status={b.status} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default Bookings;