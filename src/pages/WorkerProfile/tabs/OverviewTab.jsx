import React, { useState, useEffect } from "react";
import axios from "axios";
import { 
  Info, Phone, MapPin, Clock, Shield, Mail, User, Cake, Target 
} from "lucide-react";
import { motion } from "framer-motion";
import Skeleton from "../../../components/UI/Skeleton";

const API_BASE = "https://tadbeer0.runasp.net/api";

const OverviewTab = ({ worker, loading }) => {
  const [completedCount, setCompletedCount] = useState(0);
  const [statsLoading, setStatsLoading] = useState(true);

  // إعدادات الحسبة المنطقية (Milestone Logic)
  const GOAL_TARGET = 50; 

  // منطق توحيد الحالات المكتملة بناءً على ملف Bookings.jsx
  const normalizeStatus = (status) => {
    const s = status?.toString().toLowerCase().trim().replace(/\s/g, "") ?? "";
    if (["completed", "done", "finished"].includes(s)) return "completed";
    return s;
  };

  // جلب الحجوزات وحساب النسبة الحقيقية (الحل الجذري)
  useEffect(() => {
    const fetchStats = async () => {
      const token = localStorage.getItem("token");
      if (!token) return;

      try {
        const res = await axios.get(`${API_BASE}/Worker/Bookings`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const items = res.data.items ?? res.data ?? [];
        const count = items.reduce((acc, b) => {
          return normalizeStatus(b.status) === "completed" ? acc + 1 : acc;
        }, 0);

        setCompletedCount(count);
      } catch (err) {
        console.error("Error fetching stats:", err);
      } finally {
        setStatsLoading(false);
      }
    };

    fetchStats();
  }, []);

  // حساب النسبة المئوية من الهدف (مثلاً 6 من 50 تعطي 12%)
  const progressPercentage = completedCount > 0 ? (completedCount / GOAL_TARGET) * 100 : 0;

  const infoItems = [
    { 
      icon: User, 
      label: "اسم العامل", 
      value: worker ? `${worker.firstName || ""} ${worker.lastName || ""}`.trim() : null 
    },
    { 
      icon: Cake, 
      label: "تاريخ الميلاد", 
      value: worker?.dateOfBirth ? new Date(worker.dateOfBirth).toLocaleDateString('ar-EG') : null 
    },
    { 
      icon: Phone, 
      label: "الهاتف", 
      value: worker?.phoneNumber 
    },
    { 
      icon: MapPin, 
      label: "الموقع", 
      value: worker?.city 
    },
    { 
      icon: Clock, 
      label: "سنوات الخبرة", 
      value: worker?.experienceYears != null ? `${worker.experienceYears} سنوات` : null 
    },
    { 
      icon: Shield, 
      label: "التخصصات", 
      value: worker?.specialtyNames?.length > 0 ? worker.specialtyNames.join(" ، ") : null 
    },
    { 
      icon: Mail, 
      label: "البريد", 
      value: worker?.email 
    },
  ];

  return (
    <div className="flex flex-col gap-6" dir="rtl">
      
      {/* وصف العمل */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100">
            <Info size={13} className="text-gray-600"/>
          </div>
          <h3 className="text-sm font-bold text-gray-800">وصف العمل</h3>
        </div>
        {loading ? (
          <div className="flex flex-col gap-2">
            <Skeleton className="h-4 w-full"/>
            <Skeleton className="h-4 w-3/4"/>
          </div>
        ) : (
          <p className="text-sm text-gray-600 leading-relaxed">
            {worker?.jobDescription || "لا يوجد وصف متاح حالياً."}
          </p>
        )}
      </div>

      {/* شبكة المعلومات التفصيلية */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {infoItems.map((item, index) => (
          <div key={index} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5 transition-all hover:bg-white hover:shadow-sm">
            <item.icon size={14} className="text-orange-400 shrink-0"/>
            <div>
              <p className="text-xs text-gray-400 font-medium">{item.label}</p>
              {loading ? (
                <Skeleton className="h-3 w-24 mt-1"/>
              ) : (
                <p className="text-xs font-semibold text-gray-700">
                  {item.value || <span className="italic text-gray-300 text-[10px]">غير محدد</span>}
                </p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* أوقات العمل المتاحة */}
      {!loading && worker?.workingHours?.length > 0 && (
        <div className="p-4 rounded-2xl bg-orange-50/50 border border-orange-100">
          <h4 className="text-xs font-bold text-orange-600 mb-2 flex items-center gap-2">
            <Clock size={14} /> أوقات العمل المتاحة
          </h4>
          <div className="flex flex-wrap gap-2">
            {worker.workingHours.map((slot, idx) => (
              <span key={idx} className="text-[10px] bg-white px-2 py-1 rounded-lg border border-orange-100 font-semibold text-gray-700">
                {slot.dayOfWeek}: {slot.startTime?.slice(0,5)} - {slot.endTime?.slice(0,5)}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* مؤشرات الأداء والخدمة - الحسبة المنطقية الجديدة */}
      {!loading && (
        <div className="mt-4 space-y-4">
          <h3 className="text-sm font-black text-gray-800 flex items-center gap-2 px-1">
            <Target size={16} className="text-orange-500" /> مؤشرات الأداء والخدمة
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            
            {/* معدل إتمام المهام (نسبة مئوية واقعية) */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-700">معدل إتمام المهام</span>
                <span className={`text-xs font-black ${completedCount > 0 ? 'text-green-600' : 'text-gray-400'}`}>
                  {statsLoading ? "..." : `%${progressPercentage.toFixed(0)}`}
                </span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden bg-gray-50">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: statsLoading ? 0 : `${Math.min(progressPercentage, 100)}%` }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                  className="h-full bg-green-500 rounded-full"
                />
              </div>
              <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                {statsLoading ? "جاري جلب سجل العمل..." : completedCount > 0 
                  ? `أنجز العامل ${completedCount} مهمة بنجاح من أصل هدف المنصة الأول (${GOAL_TARGET} مهمة).` 
                  : "ابدأ بتنفيذ المهام لتفعيل مؤشر الأداء الخاص بك."}
              </p>
            </div>

            {/* سرعة الاستجابة (ديناميكية بناءً على التقييم) */}
            <div className="bg-white rounded-3xl p-5 border border-gray-100 shadow-sm space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-xs font-bold text-gray-700">سرعة الاستجابة</span>
                <span className={`text-xs font-black ${worker?.avgRating > 0 ? 'text-orange-500' : 'text-gray-400'}`}>
                  {worker?.avgRating >= 4.5 ? "ممتاز" : 
                   worker?.avgRating >= 3.5 ? "جيد جداً" : 
                   worker?.avgRating > 0 ? "نشط" : "لا يوجد تقييم"}
                </span>
              </div>
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: worker?.avgRating > 0 ? `${(worker.avgRating / 5) * 100}%` : "0%" }}
                  transition={{ duration: 1.5, delay: 0.2, ease: "easeOut" }}
                  className="h-full bg-orange-500 rounded-full"
                />
              </div>
              <p className="text-[10px] text-gray-400 font-medium leading-relaxed">
                {worker?.avgRating > 0 
                  ? `بناءً على تقييم العملاء البالغ ${worker.avgRating} نجوم.` 
                  : "بانتظار التقييمات الأولى لتحديد مستوى السرعة."}
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default OverviewTab;