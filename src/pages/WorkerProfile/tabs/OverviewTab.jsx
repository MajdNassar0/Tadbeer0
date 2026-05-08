import React from "react";
import { 
  Info, Phone, MapPin, Clock, Shield, Mail, Briefcase, User, Cake, Star, MessageSquare 
} from "lucide-react";
import Skeleton from "../../../components/UI/Skeleton";

const OverviewTab = ({ worker, isOwner, loading }) => {
  // مصفوفة البيانات الأساسية
  const infoItems = [
    { 
      icon: User, 
      label: "اسم العامل", 
      value: worker ? `${worker.firstName || ""} ${worker.lastName || ""}`.trim() : null 
    },
    { 
      icon: Cake, 
      label: "تاريخ الميلاد", 
      value: worker?.birthDate ? new Date(worker.birthDate).toLocaleDateString('ar-EG') : null 
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
      label: "التخصص", 
      value: worker?.subcategory 
    },
    { 
      icon: Mail, 
      label: "البريد", 
      value: worker?.email 
    },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* قسم وصف العمل */}
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
            {worker?.jobDescription || worker?.bio || "لا يوجد وصف متاح حالياً."}
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
      {/* شريط الإحصائيات السريع (Stats Bar) */}
      <div className="grid grid-cols-3 gap-3">
        <div className="flex flex-col items-center justify-center rounded-2xl bg-orange-50 p-4 border border-orange-100">
          <Star size={18} className="text-orange-500 mb-1" />
          <p className="text-xs text-gray-500 font-medium">التقييم</p>
          {loading ? <Skeleton className="h-4 w-8 mt-1" /> : (
            <p className="text-sm font-black text-gray-800">{worker?.rating || "0.0"}</p>
          )}
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl bg-blue-50 p-4 border border-blue-100">
          <MessageSquare size={18} className="text-blue-500 mb-1" />
          <p className="text-xs text-gray-500 font-medium">التقييمات</p>
          {loading ? <Skeleton className="h-4 w-8 mt-1" /> : (
            <p className="text-sm font-black text-gray-800">{worker?.reviewsCount || 0}</p>
          )}
        </div>
        <div className="flex flex-col items-center justify-center rounded-2xl bg-green-50 p-4 border border-green-100">
          <Briefcase size={18} className="text-green-500 mb-1" />
          <p className="text-xs text-gray-500 font-medium">المهام</p>
          {loading ? <Skeleton className="h-4 w-8 mt-1" /> : (
            <p className="text-sm font-black text-gray-800">{worker?.completedJobs || 0}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OverviewTab;