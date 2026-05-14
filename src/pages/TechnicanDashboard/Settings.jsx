import React from "react";
import { useNavigate, useOutletContext } from "react-router-dom";
import { User, ChevronLeft, Settings as SettingsIcon } from "lucide-react";

const Settings = () => {
  const navigate = useNavigate();
  const { user } = useOutletContext();
  const workerId = user?.id || user?.userId;

  return (
    <div dir="rtl" className="flex flex-col items-center justify-center py-16 gap-6 max-w-sm mx-auto text-center">

      <div className="w-16 h-16 rounded-2xl bg-[#001F3F]/5 flex items-center justify-center">
        <SettingsIcon size={28} className="text-[#001F3F]/30" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-base font-semibold text-gray-800">الإعدادات في ملفك الشخصي</h3>
        <p className="text-sm text-gray-400 leading-relaxed">
          يمكنك تعديل جميع إعداداتك من صفحة ملفك الشخصي
        </p>
      </div>

      <button
        onClick={() => navigate(`/worker-profile/${workerId}`)}
        className="flex items-center gap-2 bg-[#001F3F] hover:bg-[#002d5a] text-white px-6 py-3 rounded-2xl text-sm font-semibold transition-colors shadow-md shadow-blue-900/10"
      >
        <User size={15} />
        الذهاب إلى الملف الشخصي
        <ChevronLeft size={14} className="text-[#F7A823]" />
      </button>

    </div>
  );
};

export default Settings;
