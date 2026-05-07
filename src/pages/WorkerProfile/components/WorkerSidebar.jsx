import React from "react";
import { ChevronRight, Star, Camera } from "lucide-react";
import { getFullImageUrl } from "../../../Utils/imageHelper";
import StarRating from "../../../components/UI/StarRating";
import Skeleton from "../../../components/UI/Skeleton";

const WorkerSidebar = ({ 
  worker, 
  isOwner, 
  loading, 
  activeTab, 
  setActiveTab, 
  tabs, 
  onUploadImage 
}) => {
  // إنشاء اسم كامل للعامل
  const fullName = worker ? `${worker.firstName || ""} ${worker.lastName || ""}`.trim() : "";
  
  // صورة احتياطية (UI Avatar) تعتمد على الاسم في حال عدم وجود صورة شخصية
  const avatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(fullName || "W")}&background=ff9800&color=fff&size=200&bold=true`;

  return (
    <aside className="lg:col-span-1">
      <div className="sticky top-6 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        
        {/* قسم الصورة والمعلومات الأساسية */}
        <div className="border-b border-gray-50 p-5 text-center">
          {loading ? (
            <div className="flex flex-col items-center gap-2">
              <Skeleton className="h-24 w-24 rounded-full mx-auto" />
              <Skeleton className="h-4 w-28 mx-auto" />
              <Skeleton className="h-3 w-20 mx-auto" />
            </div>
          ) : (
            <>
              {/* حاوية الصورة مع الكاميرا */}
              <div className="relative mx-auto w-24 h-24 mb-4">
                <img
                  // استخدام getFullImageUrl لضمان ظهور الصورة من السيرفر
                  src={getFullImageUrl(worker?.profileImage) || avatar}
                  className="w-full h-full rounded-full object-cover border-4 border-white shadow-md"
                  alt={fullName}
                />

                {/* أيقونة الكاميرا: تظهر فقط إذا كان المستخدم هو صاحب الحساب */}
                {isOwner && (
                  <label 
                    className="absolute bottom-0 right-0 bg-orange-500 p-2 rounded-full border-2 border-white shadow-lg cursor-pointer hover:bg-orange-600 transition-colors z-10"
                    title="تغيير الصورة"
                  >
                    <Camera size={16} className="text-white" />
                    <input 
                      type="file" 
                      className="hidden" 
                      onChange={(e) => {
                        if (e.target.files?.[0]) {
                          onUploadImage(e.target.files[0]);
                        }
                      }} 
                      accept="image/*"
                    />
                  </label>
                )}
              </div>
              
              <p className="text-sm font-bold text-gray-800">{fullName}</p>
              
              <div className="mt-2 flex justify-center">
                <StarRating rating={worker?.rating || 0} size={12} />
              </div>
            </>
          )}
        </div>

        {/* قائمة التبويبات (Navigation) */}
        <nav className="p-3">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition
                ${
                  activeTab === tab.id
                    ? "bg-[#001e3c] text-white shadow-md"
                    : "text-gray-500 hover:bg-gray-50"
                }`}
            >
              <tab.icon
                size={16}
                className={activeTab === tab.id ? "text-orange-400" : ""}
              />
              <span className="flex-1 text-right">{tab.label}</span>
              <ChevronRight
                size={14}
                className={
                  activeTab === tab.id
                    ? "rotate-180 text-orange-400"
                    : "text-gray-300"
                }
              />
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

export default WorkerSidebar;