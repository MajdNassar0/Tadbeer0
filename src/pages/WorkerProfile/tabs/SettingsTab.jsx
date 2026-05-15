import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PasswordModal from "../../../components/Profile/Security/modals/PasswordModal"; 
import { useToast } from "../../../context/ToastContext";
import PersonalInfoForm from "../components/sub-settings/PersonalInfoForm";
import ProfessionalInfoForm from "../components/sub-settings/ProfessionalInfoForm";
import DeactivateModal from "../../../components/Profile/Security/modals/DeactivateModal";
import { 
  User, Briefcase, ShieldCheck, Key, Shield, UserX, Trash2,
  Phone, FileText, Calendar, MapPin, Clock
} from "lucide-react";
const SettingsTab = ({ worker, updateWorker, saving, onToggleStatus, toggling, updateUser ,addWorkingHour,      // استلام هنا
  updateWorkingHour, 
  deleteWorkingHour }) => {
  const [activeTab, setActiveTab] = useState("profile"); // profile | work | security
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [activeModal, setActiveModal] = useState(null);
  const toast = useToast();

  // مكون الصف الاحترافي (Row) - معدل لاستقبال onClick
  const SettingsRow = ({ icon: Icon, title, description, actionText, isDestructive = false, onClick }) => (
    <motion.div 
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors mb-3"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${isDestructive ? 'bg-red-50 text-red-500' : 'bg-gray-50 text-gray-400'}`}>
          <Icon size={20} />
        </div>
        <div className="text-right">
          <h4 className="text-sm font-bold text-gray-800">{title}</h4>
          <p className="text-[11px] text-gray-400 mt-0.5">{description}</p>
        </div>
      </div>
      <button 
        onClick={onClick} 
        className={`px-5 py-1.5 rounded-lg border text-xs font-bold transition ${
          isDestructive 
            ? "border-red-100 text-red-500 hover:bg-red-50" 
            : "border-orange-100 text-orange-500 hover:bg-orange-50"
        }`}
      >
        {actionText}
      </button>
    </motion.div>
  );

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">
      
      {/* --- 1. تابات التنقل العلوي --- */}
      <div className="flex items-center justify-around bg-white p-2 rounded-2xl border border-gray-100 shadow-sm">
        {[
          { id: "profile", label: "الملف الشخصي", icon: User },
          { id: "work", label: "إعدادات العمل", icon: Briefcase },
          { id: "security", label: "الأمان والخصوصية", icon: ShieldCheck },
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition-all duration-300 ${
              activeTab === tab.id 
                ? "bg-orange-500 text-white shadow-lg shadow-orange-100 scale-105" 
                : "text-gray-400 hover:bg-gray-50"
            }`}
          >
            <tab.icon size={18} />
            <span className="hidden sm:inline">{tab.label}</span>
          </button>
        ))}
      </div>

      {/* --- 2. محتوى التابات مع أنيميشن --- */}
      <div className="min-h-100">
        <AnimatePresence mode="wait">
          
          {/* تاب الملف الشخصي */}
          {activeTab === "profile" && (
  <PersonalInfoForm 
    worker={worker} 
    updateWorker={updateWorker} 
    saving={saving} 
  />
)}

          {/* تاب العمل */}
{activeTab === "work" && (
  <motion.div 
    key="work" 
    initial={{ opacity: 0, y: 10 }} 
    animate={{ opacity: 1, y: 0 }} 
    exit={{ opacity: 0, y: -10 }}
    className="space-y-4"
  >
    <div className="px-2 mb-2">
      <h3 className="text-md font-bold text-gray-700">إدارة الملف المهني</h3>
      <p className="text-[11px] text-gray-400">تحكم في تخصصاتك، خبراتك، وساعات تواجدك الميداني.</p>
    </div>

    {/* استدعاء الفورم الجديد وتمرير الـ Props اللازمة */}
    <ProfessionalInfoForm 
      worker={worker} 
  updateWorker={updateWorker} 
  saving={saving}
  addWorkingHour={addWorkingHour}      
  updateWorkingHour={updateWorkingHour} 
  deleteWorkingHour={deleteWorkingHour}
    />
  </motion.div>
)}

          {/* تاب الأمان */}
          {activeTab === "security" && (
            <motion.div 
              key="security" 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }}
              className="space-y-4"
            >
              <h3 className="text-md font-bold text-gray-700 px-2">حماية الحساب</h3>
              <SettingsRow 
                icon={Key} 
                title="تغيير كلمة المرور" 
                description="تحديث كلمة المرور بشكل دوري" 
                actionText="تغيير" 
                onClick={() => setIsPassModalOpen(true)} 
              />
              <SettingsRow icon={Shield} title="توثيق الهوية" description="ارفع هويتك للحصول على شارة موثوق" actionText="توثيق" />
              <SettingsRow 
  icon={UserX} 
  title={worker?.status === "Inactive" ? "تفعيل الحساب" : "تعطيل الحساب"} 
  description="إخفاء بروفايلك عن العملاء مؤقتاً" 
  actionText={worker?.status === "Inactive" ? "تفعيل" : "تعطيل"}
  isDestructive={worker?.status !== "Inactive"}
  onClick={() => setActiveModal("deactivate")} // تفعيل الزر عند الضغط
/>
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      {/* مودال تغيير كلمة المرور */}
      <PasswordModal 
        isOpen={isPassModalOpen} 
        onClose={() => setIsPassModalOpen(false)} 
        toast={toast} 
      />
      <DeactivateModal 
  isOpen={activeModal === "deactivate"} 
  onClose={() => setActiveModal(null)} 
  onConfirm={async () => {
    const res = await onToggleStatus(); // استدعاء دالة الـ PATCH للعامل
    if (res.ok) setActiveModal(null);
  }}
  loading={toggling}
  isInactive={worker?.status === "Inactive"} 
/>

      

    </div>
  );
};

export default SettingsTab;