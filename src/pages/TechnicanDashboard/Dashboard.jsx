import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useOutletContext } from "react-router-dom";
import { ClipboardList, CheckCircle2, Clock, Star } from "lucide-react";

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
    <div className="flex justify-center py-10">
      <div className="w-7 h-7 border-2 border-yellow-400 border-t-transparent rounded-full animate-spin" />
    </div>
  );
}

const STATIC_DEADLINES = [
  { label: "صيانة المكيفات",       time: "المتبقي: ساعتين", color: "bg-red-50",    tColor: "text-red-500",    val: "٢٥", month: "أكتوبر" },
  { label: "التمديدات الكهربائية", time: "المتبقي: ٣ أيام", color: "bg-yellow-50", tColor: "text-yellow-600", val: "٢٨", month: "أكتوبر" },
];

const Dashboard = () => {
  const navigate       = useNavigate();
  const { user }       = useOutletContext();
  const [bookings, setBookings] = useState(undefined);
  const [reviews,  setReviews ] = useState([]);

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/auth/login"); return; }
      const h = { headers: { Authorization: `Bearer ${token}` } };
      try {
        const [bkRes, revRes] = await Promise.all([
          axios.get("https://tadbeer0.runasp.net/api/Worker/Bookings",  h),
          axios.get("https://tadbeer0.runasp.net/api/General/Reviews",  h),
        ]);
        const bkItems  = bkRes.data.items  ?? bkRes.data  ?? [];
        const revItems = revRes.data.items ?? revRes.data ?? [];
        setBookings(Array.isArray(bkItems)  ? bkItems  : []);
        setReviews(Array.isArray(revItems)  ? revItems : []);
      } catch (err) {
        setBookings([]);
        if (err.response?.status === 401) { localStorage.clear(); navigate("/auth/login"); }
      }
    };
    load();
  }, [navigate]);

  const totalTasks      = bookings?.length ?? 0;
  const completedTasks  = bookings?.filter(b => b.status?.toLowerCase() === "completed").length ?? 0;
  const inProgressTasks = bookings?.filter(b => b.status?.toLowerCase().replace(/\s/g,"") === "inprogress").length ?? 0;
  const totalHours      = Math.round((bookings?.reduce((s, b) => s + (b.durationMinutes ?? 0), 0) ?? 0) / 60);
  const avgRating       = reviews.length
    ? (reviews.reduce((s, r) => s + (r.rate ?? 0), 0) / reviews.length).toFixed(1)
    : null;

  return (
    <div className="flex flex-col lg:flex-row gap-6">

      {/* ── Left: main content ── */}
      <div className="flex-1 space-y-6 min-w-0">

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: "إجمالي المهام",   value: totalTasks,      icon: <ClipboardList size={17}/>, bg: "bg-blue-50",   color: "text-blue-500"   },
            { label: "المهام المكتملة", value: completedTasks,  icon: <CheckCircle2  size={17}/>, bg: "bg-green-50",  color: "text-green-500"  },
            { label: "قيد التنفيذ",    value: inProgressTasks, icon: <Clock         size={17}/>, bg: "bg-orange-50", color: "text-orange-500" },
            { label: "ساعات العمل",    value: totalHours,      icon: <Clock         size={17}/>, bg: "bg-yellow-50", color: "text-yellow-600" },
          ].map((s, i) => (
            <div key={i} className="bg-white p-4 rounded-2xl border border-gray-100
                                    flex items-center justify-between hover:shadow-sm transition-shadow">
              <div>
                <p className="text-[10px] text-gray-400 mb-0.5">{s.label}</p>
                <h4 className={`text-xl font-medium text-gray-800
                  ${bookings === undefined ? "animate-pulse text-gray-200" : ""}`}>
                  {bookings === undefined ? "···" : s.value}
                </h4>
              </div>
              <div className={`${s.bg} ${s.color} p-2.5 rounded-xl`}>{s.icon}</div>
            </div>
          ))}
        </div>

        {/* Performance ratings */}
        <div className="bg-white p-6 rounded-2xl border border-gray-100">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-sm font-medium text-gray-800">تقييم الأداء التفصيلي</h3>
            {avgRating && (
              <div className="flex items-center gap-1 bg-yellow-50 px-3 py-1 rounded-full">
                <Star size={11} className="fill-yellow-400 text-yellow-400" />
                <span className="text-xs text-yellow-700 font-medium">{avgRating} متوسط</span>
              </div>
            )}
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
            {[
              "الاحترافية بالتعامل",
              "التواصل والمتابعة",
              "جودة العمل المسلّم",
              "الخبرة بمجال المشروع",
              "التسليم في الموعد",
              "التعامل معه مرة أخرى",
            ].map((label, i) => {
              const ratingVal = avgRating ? Math.round(parseFloat(avgRating)) : 0;
              return (
                <div key={i} className="flex items-center justify-between text-xs py-0.5">
                  <span className="text-gray-500">{label}</span>
                  <div className="flex gap-0.5">
                    {[...Array(5)].map((_, j) => (
                      <Star key={j} size={13}
                        className={j < ratingVal
                          ? "fill-orange-400 text-orange-400"
                          : "fill-gray-100 text-gray-200"
                        }
                      />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Recent bookings table */}
        <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden">
          <div className="px-6 py-5 border-b border-gray-50 flex items-center justify-between">
            <h3 className="text-sm font-medium text-gray-800">
              آخر الحجوزات
              {bookings !== undefined && (
                <span className="mr-2 text-xs font-normal text-gray-400">({totalTasks})</span>
              )}
            </h3>
          </div>
          {bookings === undefined ? <Spinner /> : bookings.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-2">
              <ClipboardList size={20} className="text-gray-200" />
              <p className="text-sm text-gray-400">لا توجد حجوزات حالياً</p>
              <p className="text-xs text-gray-300">ستظهر هنا فور إضافتها</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[500px]">
                <thead>
                  <tr className="text-[10px] text-gray-400 border-b border-gray-50">
                    <th className="py-3 px-6 text-right font-medium">العميل</th>
                    <th className="py-3 px-4 text-right font-medium">التاريخ</th>
                    <th className="py-3 px-4 text-right font-medium">الوقت</th>
                    <th className="py-3 px-4 text-right font-medium">المدة</th>
                    <th className="py-3 px-6 text-center font-medium">الحالة</th>
                  </tr>
                </thead>
                <tbody className="text-xs divide-y divide-gray-50">
                  {bookings.slice(0, 5).map((b, i) => {
                    const info = statusInfo(b.status);
                    return (
                      <tr key={i} className="hover:bg-gray-50/60 transition-colors">
                        <td className="py-4 px-6 font-medium text-gray-800">{b.userName || "—"}</td>
                        <td className="py-4 px-4 text-gray-400">
                          {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString("ar-EG") : "—"}
                        </td>
                        <td className="py-4 px-4 text-gray-400">{b.startTime?.slice(0,5) || "—"}</td>
                        <td className="py-4 px-4 text-gray-400">
                          {b.durationMinutes ? `${b.durationMinutes} د` : "—"}
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className={`px-3 py-1 rounded-full text-[10px] font-medium ${info.cls}`}>
                            {info.label}
                          </span>
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

        {/* Deadlines — static */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100">
          <h4 className="text-sm font-medium text-gray-800 mb-4">المواعيد النهائية القريبة</h4>
          <div className="space-y-3">
            {STATIC_DEADLINES.map((d, i) => (
              <div key={i} className={`flex items-center justify-between p-4 rounded-2xl
                                       ${d.color} border border-white/80`}>
                <div>
                  <p className="text-xs font-medium text-gray-800">{d.label}</p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{d.time}</p>
                </div>
                <div className={`flex flex-col items-center leading-none ${d.tColor}`}>
                  <span className="text-[8px] font-medium mb-0.5">{d.month}</span>
                  <span className="text-lg font-medium">{d.val}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Recent reviews */}
        <div className="bg-white p-5 rounded-2xl border border-gray-100">
          <h4 className="text-sm font-medium text-gray-800 mb-4">
            آخر التقييمات
            {reviews.length > 0 && (
              <span className="mr-2 text-xs font-normal text-gray-400">({reviews.length})</span>
            )}
          </h4>
          {reviews.length === 0 ? (
            <div className="flex flex-col items-center py-6 gap-2">
              <Star size={18} className="text-gray-200" />
              <p className="text-xs text-gray-300">لا توجد تقييمات بعد</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.slice(0, 3).map((r, i) => (
                <div key={i} className="border-b border-gray-50 last:border-0 pb-3 last:pb-0">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-gray-700">{r.userName || "مستخدم"}</span>
                    <div className="flex gap-0.5">
                      {[...Array(5)].map((_, j) => (
                        <Star key={j} size={10}
                          className={j < Math.round(r.rate ?? 0)
                            ? "fill-orange-400 text-orange-400"
                            : "fill-gray-100 text-gray-200"
                          }
                        />
                      ))}
                    </div>
                  </div>
                  {r.comment && (
                    <p className="text-[11px] text-gray-400 truncate">{r.comment}</p>
                  )}
                  <p className="text-[10px] text-gray-300 mt-1">
                    {r.createdAt ? new Date(r.createdAt).toLocaleDateString("ar-EG") : ""}
                  </p>
                </div>
              ))}
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
              <p className="text-xs text-gray-300 text-center py-4">لا يوجد نشاط حالياً</p>
            ) : bookings.slice(0, 3).map((b, i) => {
              const info = statusInfo(b.status);
              return (
                <div key={i} className="relative pr-9">
                  <div className="absolute right-2 top-0 bg-white p-0.5 z-10">
                    <CheckCircle2 size={15} className="text-orange-400" />
                  </div>
                  <p className="text-[11px] font-medium text-gray-800 leading-tight">
                    حجز من {b.userName || "عميل"}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">
                    {b.bookingDate ? new Date(b.bookingDate).toLocaleDateString("ar-EG") : "—"}
                    {" · "}
                    <span className={info.cls.split(" ")[1]}>{info.label}</span>
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