import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import PasswordModal from "../../../components/Profile/Security/modals/PasswordModal";
import { useToast } from "../../../context/ToastContext";
import PersonalInfoForm from "../components/sub-settings/PersonalInfoForm";
import ProfessionalInfoForm from "../components/sub-settings/ProfessionalInfoForm";
import DeactivateModal from "../../../components/Profile/Security/modals/DeactivateModal";
import IdentityVerificationModal from "../components/sub-settings/IdentityVerificationModal"; 


import {
  User, Briefcase, ShieldCheck, Key, Shield, UserX, CheckCircle2, AlertTriangle
} from "lucide-react";

const SettingsTab = ({
  worker, updateWorker, saving, onToggleStatus, toggling, updateUser,
  addWorkingHour, updateWorkingHour, deleteWorkingHour, setWorker 
}) => {
  const [activeTab, setActiveTab] = useState("profile");
  const [isPassModalOpen, setIsPassModalOpen] = useState(false);
  const [isVerifyModalOpen, setIsVerifyModalOpen] = useState(false); 
  const [activeModal, setActiveModal] = useState(null);
  const toast = useToast();

  // ✅ الـ Backend بيستخدم "Existed" / "Deleted" بدل "Active" / "Inactive"
  const isInactive = worker?.status === "Deleted";

  
  const isVerified = worker?.isIdentityVerified;
const hasIdentityImage = !!worker?.identityImageUrl;
const rejectionReason = worker?.identityImageRejectionReason;

  // إعداد الحالات الافتراضية لزر التوثيق
  let verifyActionText = "توثيق";
  let isVerifySuccess = false;
  let isVerifyDisabled = false;
  let isVerifyWarning = false;
  let verifyDescription = "ارفع هويتك الشخصية للحصول على شارة الحساب الموثق";

  if (isVerified) {
    // 1️⃣ حالة: الحساب موثق ومؤكد مسبقاً ✅
    verifyActionText = "موثق ✓";
    isVerifySuccess = true;
    isVerifyDisabled = true; // قفل لمنع الرفع مجدداً
    verifyDescription = "تهانينا! حسابك موثق ومؤكد بشكل رسمي ومحمّي.";
  } else if (hasIdentityImage && !rejectionReason) {
    // 2️⃣ حالة: قيد التدقيق والمراجعة من الأدمن ⏳
    verifyActionText = "قيد المراجعة";
    isVerifyDisabled = true; // قفل لمنع تكرار الرفع وإغراق السيرفر
    verifyDescription = "طلبك قيد المراجعة والتدقيق حالياً من قبل الإدارة.";
  } else if (rejectionReason) {
    // 3️⃣ حالة: تم رفض الطلب من الأدمن لوجود مشكلة ❌
    verifyActionText = "إعادة رفع";
    isVerifyWarning = true;
    verifyDescription = `تم الرفض: ${rejectionReason}`;
  }

  const SettingsRow = ({
    icon: Icon, title, description, actionText,
    isDestructive = false, onClick, isSuccess = false, isWarning = false, disabled = false
  }) => (
    <motion.div
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      className="flex items-center justify-between p-4 bg-white border border-gray-100 rounded-2xl hover:bg-gray-50 transition-colors mb-3"
    >
      <div className="flex items-center gap-4">
        <div className={`p-3 rounded-xl ${
          isSuccess ? 'bg-green-50 text-green-500' :
          isWarning ? 'bg-amber-50 text-amber-500' :
          isDestructive ? 'bg-red-50 text-red-500' :
          'bg-gray-50 text-gray-400'
        }`}>
          <Icon size={20} />
        </div>
        <div className="text-right">
          <h4 className="text-sm font-bold text-gray-800">{title}</h4>
          <p className={`text-[11px] mt-0.5 ${isWarning ? 'text-amber-600 font-medium' : 'text-gray-400'}`}>{description}</p>
        </div>
      </div>
      <button
        onClick={onClick}
        disabled={disabled}
        className={`px-5 py-1.5 rounded-lg border text-xs font-bold transition flex items-center gap-1.5 ${
          disabled && !isSuccess ? "opacity-60 cursor-not-allowed bg-gray-50 text-gray-400 border-gray-200" : ""
        } ${
          isSuccess
            ? "border-green-200 bg-green-50 text-green-600 cursor-not-allowed"
            : isWarning
              ? "border-amber-200 bg-amber-50 text-amber-600 hover:bg-amber-100/50"
              : isDestructive
                ? "border-red-100 text-red-500 hover:bg-red-50"
                : "border-orange-100 text-orange-500 hover:bg-orange-50"
        }`}
      >
        {isSuccess && <CheckCircle2 size={14} />}
        {isWarning && !disabled && <AlertTriangle size={14} />}
        {actionText}
      </button>
    </motion.div>
  );

  return (
    <div className="flex flex-col gap-6 max-w-4xl mx-auto">

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

      <div className="min-h-100">
        <AnimatePresence mode="wait">

          {activeTab === "profile" && (
            <PersonalInfoForm
              worker={worker}
              updateWorker={updateWorker}
              saving={saving}
            />
          )}

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

              {/* 🛡️ حقل توثيق الهوية المطور ذكياً بالحالات الأربعة */}
              <SettingsRow
                icon={Shield}
                title="توثيق الهوية"
                description={verifyDescription}
                actionText={verifyActionText}
                isSuccess={isVerifySuccess}
                isWarning={isVerifyWarning}
                disabled={isVerifyDisabled}
                onClick={() => setIsVerifyModalOpen(true)} 
              />

              {/* ✅ زرار التعطيل - بيقرأ من worker.status (Existed / Deleted) */}
              <SettingsRow
                icon={isInactive ? CheckCircle2 : UserX}
                title={isInactive ? "الحساب معطل حالياً" : "تعطيل الحساب"}
                description={isInactive
                  ? "بروفايلك مخفي عن العملاء - اضغط لإعادة التفعيل"
                  : "إخفاء بروفايلك عن العملاء مؤقتاً"}
                actionText={
                  toggling
                    ? "جاري المعالجة..."
                    : isInactive
                      ? "تم التعطيل ✓"
                      : "تعطيل"
                }
                isDestructive={!isInactive}
                isSuccess={isInactive}
                disabled={toggling}
                onClick={() => setActiveModal("deactivate")}
              />
            </motion.div>
          )}

        </AnimatePresence>
      </div>

      <PasswordModal
        isOpen={isPassModalOpen}
        onClose={() => setIsPassModalOpen(false)}
        toast={toast}
      />


<IdentityVerificationModal
key={isVerifyModalOpen ? "open" : "closed"}
  isOpen={isVerifyModalOpen}
  onClose={() => setIsVerifyModalOpen(false)}
  onUploadSuccess={() => {
    setWorker(prev => ({
      ...prev,
      hasIdentityImage: true,
      identityImageRejectionReason: null,
    }));
    setIsVerifyModalOpen(false); // ✅ أغلق المودال تلقائياً بعد النجاح
  }}
/>
      <DeactivateModal
        isOpen={activeModal === "deactivate"}
        onClose={() => setActiveModal(null)}
        onConfirm={async () => {
          const res = await onToggleStatus();
          if (res.ok) setActiveModal(null);
        }}
        loading={toggling}
        isInactive={isInactive}
      />

    </div>
  );
};

export default SettingsTab;