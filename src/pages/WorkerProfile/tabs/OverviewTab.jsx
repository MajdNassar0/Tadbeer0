import React from "react";
import { 
  Info, Phone, MapPin, Clock, Shield, Mail, Briefcase, BadgeCheck 
} from "lucide-react";
import Skeleton from "../../../components/UI/Skeleton";

const OverviewTab = ({ worker, isOwner, loading }) => (
  <div className="flex flex-col gap-5">
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-green-50">
          <Info size={13} className="text-green-600"/>
        </div>
        <h3 className="text-sm font-bold text-gray-800">وصف العمل</h3>
      </div>
      {loading ? (
        <div className="flex flex-col gap-2"><Skeleton className="h-4 w-full"/><Skeleton className="h-4 w-3/4"/></div>
      ) : (
        <p className="text-sm text-gray-600 leading-relaxed">
          {worker?.jobDescription || worker?.bio || "لا يوجد وصف."}
        </p>
      )}
    </div>

    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
      {[
        { icon: Phone, label: "الهاتف", value: worker?.phoneNumber },
        { icon: MapPin, label: "الموقع", value: worker?.city },
        { icon: Clock, label: "سنوات الخبرة", value: worker?.experienceYears != null ? `${worker.experienceYears} سنوات` : null },
        { icon: Shield, label: "التخصص", value: worker?.subcategory },
        { icon: Mail, label: "البريد", value: worker?.email },
        { icon: Briefcase, label: "المهام المنجزة", value: worker?.completedJobs ? `${worker.completedJobs} مهمة` : null },
      ].map(item => (
        <div key={item.label} className="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5">
          <item.icon size={14} className="text-orange-400 shrink-0"/>
          <div>
            <p className="text-xs text-gray-400 font-medium">{item.label}</p>
            {loading ? <Skeleton className="h-3 w-20 mt-1"/> : (
              <p className="text-xs font-semibold text-gray-700">
                {item.value || <span className="italic text-gray-300">غير محدد</span>}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  </div>
);

export default OverviewTab;