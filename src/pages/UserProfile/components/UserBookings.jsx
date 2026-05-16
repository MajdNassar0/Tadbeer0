import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { ClipboardList, Calendar, Clock, Loader2, ArrowRight, Star } from "lucide-react";
import { toast, Toaster } from "sonner";
import apiClient from "../../../API/axiosConfig"; // ✅ التأكد من المسار الصحيح لـ apiClient ليمرر التوكن تلقائياً

const STATUS_STYLE = {
  Pending   : { cls: "bg-yellow-100  text-yellow-700", label: "قيد الانتظار" },
  Confirmed : { cls: "bg-blue-100    text-blue-600",   label: "مقبول"        },
  Completed : { cls: "bg-green-100   text-green-600",  label: "مكتمل"        },
  Cancelled : { cls: "bg-red-100     text-red-600",    label: "ملغى"         },
};

const DAYS_AR = {
  saturday : "السبت",    sunday   : "الأحد",
  monday   : "الاثنين",  tuesday  : "الثلاثاء",
  wednesday: "الأربعاء", thursday : "الخميس",
  friday   : "الجمعة",
};

export default function UserBookings() {
  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  // جلب حجوزات الزبون الحالي من السيرفر
  const fetchUserBookings = useCallback(async () => {
    setLoading(true);
    try {
      // Endpoint جلب حجوزات المستخدم العادي
      const res = await apiClient.get("/User/Bookings"); 
      // معالجة بنية البيانات المستلمة ودعم مصفوفات دوت نت $values
      const items = res.data?.items ?? res.data?.$values ?? res.data ?? [];
      
      // ترتيب الحجوزات من الأحدث إلى الأقدم
      const sortedItems = [...items].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setBookings(sortedItems);
    } catch (err) {
      console.error("Fetch user bookings error:", err);
      toast.error("فشل في تحميل سجل طلباتك");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchUserBookings();
  }, [fetchUserBookings]);

  if (loading) {
    return (
      <div className="flex min-h-62.5 flex-col items-center justify-center gap-3">
        <Loader2 className="h-7 w-7 animate-spin text-orange-500" />
        <p className="text-xs font-medium text-gray-500">جاري تحميل طلباتك الحالية...</p>
      </div>
    );
  }

  if (bookings.length === 0) {
    return (
      <div className="flex min-h-75 flex-col items-center justify-center rounded-3xl p-8 text-center">
        <div className="mb-4 rounded-full bg-gray-50 p-4 text-gray-400">
          <ClipboardList className="h-8 w-8" />
        </div>
        <h3 className="text-sm font-black text-gray-700">لا توجد طلبات بعد</h3>
        <button 
          onClick={() => navigate("/services")} 
          className="mt-4 inline-flex items-center gap-2 bg-orange-500 text-white font-bold px-6 py-3 rounded-2xl text-xs hover:bg-orange-600 transition-all shadow-md shadow-orange-500/10"
        >
          استعرض الخدمات
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4" dir="rtl">
      <Toaster position="top-center" richColors />
      
      <div className="grid grid-cols-1 gap-3">
        {bookings.map((b) => {
          const s = STATUS_STYLE[b.status] || { cls: "bg-gray-100 text-gray-600", label: b.status };
          const date = b.bookingDate
            ? new Date(b.bookingDate).toLocaleDateString("ar-EG", { day: "numeric", month: "long" })
            : "—";

          const workerName = b.workerName || `${b.worker?.firstName || ''} ${b.worker?.lastName || ''}`.trim() || "فني منصة تدبير";

          return (
            <div
              key={b.id}
              onClick={() => navigate(`/booking/${b.workerId}?bookingId=${b.id}`)}
              className="group flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 bg-gray-50/50 hover:bg-white border border-gray-100 hover:border-orange-200 rounded-2xl transition-all duration-300 cursor-pointer gap-4"
            >
              {/* تفاصيل الحجز والوقت */}
              <div className="flex items-center gap-4 min-w-0">
                <div className="hidden sm:flex w-10 h-10 rounded-xl bg-white border border-gray-100 items-center justify-center text-gray-700 shadow-xs">
                  <Calendar size={18} className="text-gray-400" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-black text-gray-800 mb-1">
                    طلب صيانة مع: <span className="text-orange-600">{workerName}</span>
                  </p>
                  <p className="text-[11px] font-bold text-gray-500 mb-1">
                    {DAYS_AR[b.workingDay?.toLowerCase()] ?? b.workingDay}، {date}
                  </p>
                  <div className="flex items-center gap-1.5 text-[10px] text-gray-400 font-medium">
                    <Clock size={11} className="text-gray-400" />
                    <span>{b.startTime?.slice(0, 5)} حتى {b.endTime?.slice(0, 5)}</span>
                  </div>
                </div>
              </div>

              {/* شارات الحالة والتحكم */}
              <div className="flex items-center justify-between sm:justify-end gap-3 border-t sm:border-t-0 pt-3 sm:pt-0 border-gray-100">
                <span className={`text-[10px] font-black px-3 py-1.5 rounded-xl ${s.cls}`}>
                  {s.label}
                </span>
                
                {/* إذا اكتمل الطلب، نتيح له الانتقال لتقييم الفني فوراً */}
                {b.status === "Completed" && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate(`/booking/${b.workerId}?bookingId=${b.id}`);
                    }}
                    className="flex items-center gap-1.5 text-[10px] font-black bg-orange-500 text-white px-3 py-2 rounded-xl hover:bg-orange-600 transition"
                  >
                    <Star size={11} className="fill-white" />
                    <span>تقييم الخدمة</span>
                  </button>
                )}
                
                <ArrowRight size={14} className="text-gray-300 group-hover:text-orange-500 group-hover:-translate-x-1 transition-all transform rotate-180 hidden sm:block" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}