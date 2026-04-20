import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Calendar, BarChart3 } from "lucide-react";

const MONTHLY_DATA = [4, 6, 8, 5, 9, 7];
const MONTH_LABELS = ["يناير","فبراير","مارس","أبريل","مايو","يونيو"];
const SERVICES = [
  { name: "السباكة",       percent: 85, color: "bg-yellow-400" },
  { name: "الكهرباء",      percent: 72, color: "bg-[#0a1d37]"  },
  { name: "تكييف وتبريد", percent: 60, color: "bg-blue-500"   },
  { name: "تنظيف",         percent: 45, color: "bg-gray-300"   },
];

const STATUS_MAP = {
  completed : { label: "مكتمل",        cls: "bg-green-50  text-green-700"  },
  pending   : { label: "قيد الانتظار", cls: "bg-yellow-50 text-yellow-700" },
  inprogress: { label: "جارٍ التنفيذ", cls: "bg-blue-50   text-blue-700"   },
  cancelled : { label: "ملغى",          cls: "bg-red-50    text-red-700"    },
};
function StatusBadge({ status = "" }) {
  const key  = status.toLowerCase().replace(/\s/g, "");
  const info = STATUS_MAP[key] ?? { label: status || "—", cls: "bg-gray-50 text-gray-500" };
  return <span className={`px-3 py-1 rounded-full text-[10px] font-medium ${info.cls}`}>{info.label}</span>;
}

function EmptyBookings() {
  return (
    <div className="flex flex-col items-center justify-center py-16 gap-3">
      <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center">
        <Calendar size={20} className="text-gray-300" />
      </div>
      <p className="text-sm text-gray-400 font-medium">لا توجد حجوزات حالياً</p>
      <p className="text-xs text-gray-300">ستظهر الحجوزات هنا فور إضافتها</p>
    </div>
  );
}

const Dashboard = () => {
  const navigate  = useNavigate();
  const [stats,    setStats   ] = useState(null);
  const [bookings, setBookings] = useState(undefined);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/auth/login"); return; }
      const h = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const [usersRes, bookingsRes, reviewsRes] = await Promise.all([
          axios.get("https://tadbeer0.runasp.net/api/Admin/Users",     h),
          axios.get("https://tadbeer0.runasp.net/api/Admin/Bookings",  h),
          axios.get("https://tadbeer0.runasp.net/api/General/Reviews", h),
        ]);
        const users    = usersRes.data.items    ?? usersRes.data    ?? [];
        const allBk    = bookingsRes.data.items ?? bookingsRes.data ?? [];
        const revItems = reviewsRes.data.items  ?? reviewsRes.data  ?? [];
        const techs    = users.filter(u => ["worker","technician"].includes(u.role?.toLowerCase()));
        const avg      = revItems.length
          ? (revItems.reduce((s, r) => s + (r.rate ?? 0), 0) / revItems.length).toFixed(1)
          : "0.0";
        setBookings(Array.isArray(allBk) ? allBk : []);
        setStats({
          users:    usersRes.data.totalCount    ?? users.length,
          techs:    techs.length,
          bookings: bookingsRes.data.totalCount ?? allBk.length,
          rating:   avg,
        });
      } catch (err) {
        setBookings([]);
        if (err.response?.status === 401) { localStorage.clear(); navigate("/auth/login"); }
      }
    };
    load();
  }, [navigate]);

  return (
    <div className="space-y-6">

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          { label: "المستخدمون المسجلون", value: stats?.users,    badge: "+12%", cls: "bg-blue-50 text-blue-700"    },
          { label: "الفنيون النشطون",     value: stats?.techs,    badge: "+5%",  cls: "bg-amber-50 text-amber-700"  },
          { label: "إجمالي الحجوزات",    value: stats?.bookings, badge: "+18%", cls: "bg-purple-50 text-purple-700" },
          { label: "تقييم الخدمة",       value: stats?.rating,   badge: "+0.2", cls: "bg-green-50 text-green-700"  },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl p-5 border border-gray-100 hover:shadow-sm transition-shadow">
            <p className="text-xs text-gray-400 mb-1">{s.label}</p>
            <p className="text-3xl font-medium text-gray-900">
              {s.value ?? <span className="text-gray-200 animate-pulse">···</span>}
            </p>
            <span className={`inline-block mt-2 text-[10px] font-medium px-2 py-0.5 rounded-full ${s.cls}`}>
              {s.badge}
            </span>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-5">إحصائيات الحجوزات الشهرية</h3>
          <div className="flex items-end justify-between h-36 gap-2">
            {MONTHLY_DATA.map((h, i) => {
              const pct   = (h / Math.max(...MONTHLY_DATA)) * 100;
              const isMax = h === Math.max(...MONTHLY_DATA);
              return (
                <div key={i} className="flex flex-col items-center gap-1.5 flex-1 group h-full justify-end">
                  <div className={`w-full rounded-t-lg transition-colors
                    ${isMax ? "bg-yellow-400" : "bg-gray-100 group-hover:bg-yellow-200"}`}
                    style={{ height: `${pct}%` }} />
                  <span className="text-[9px] text-gray-400">{MONTH_LABELS[i].slice(0,3)}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-white rounded-2xl p-6 border border-gray-100">
          <h3 className="text-sm font-medium text-gray-700 mb-5">الخدمات الأكثر طلباً</h3>
          <div className="space-y-4">
            {SERVICES.map((s, i) => (
              <div key={i}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-700">{s.name}</span>
                  <span className="text-gray-400">{s.percent}%</span>
                </div>
                <div className="w-full bg-gray-100 h-1.5 rounded-full overflow-hidden">
                  <div className={`h-full ${s.color}`} style={{ width: `${s.percent}%` }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent bookings */}
      <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
        <div className="px-6 py-5 border-b border-gray-50">
          <h3 className="text-sm font-medium text-gray-700">أحدث الحجوزات</h3>
        </div>
        {bookings === undefined ? (
          <div className="flex justify-center py-12">
            <div className="w-7 h-7 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : bookings.length === 0 ? (
          <EmptyBookings />
        ) : (
          <table className="w-full">
            <thead>
              <tr className="text-[10px] text-gray-400 border-b border-gray-50">
                <th className="py-3 px-6 text-right font-medium">اسم العميل</th>
                <th className="py-3 px-4 text-right font-medium">الفني</th>
                <th className="py-3 px-4 text-right font-medium">التاريخ</th>
                <th className="py-3 px-6 text-center font-medium">الحالة</th>
              </tr>
            </thead>
            <tbody className="text-xs divide-y divide-gray-50">
              {bookings.slice(0, 7).map((b, i) => (
                <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                  <td className="py-4 px-6 font-medium text-gray-800">{b.userName || b.customerName || "—"}</td>
                  <td className="py-4 px-4 text-gray-500">{b.workerName || "لم يحدد"}</td>
                  <td className="py-4 px-4 text-gray-400">
                    {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString("ar-EG") : "—"}
                  </td>
                  <td className="py-4 px-6 text-center"><StatusBadge status={b.status} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Dashboard;