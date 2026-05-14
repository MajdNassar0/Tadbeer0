import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Info, BookOpen, Wrench, Star, Settings } from "lucide-react";

// Context & Hooks

import { useAuth } from "../../context/AuthContext";
import { useWorkerProfile } from "../../Hooks/useWorkerProfile";
import { useToast } from "../../context/ToastContext";
import { ToastProvider } from "../../context/ToastContext";

// Global Components
import MobileTabBar from "../../components/MobileTabBar/MobileTabBar";
import FloatingActions from "../../components/FloatingActions/FloatingActions";

// Shared UI
import ErrorState from "../../components/UI/ErrorState";

// Profile Sub-Components
import WorkerHeader from "./components/WorkerHeader";
import StatsBar from "./components/StatsBar";
import WorkerSidebar from "./components/WorkerSidebar";

// Tab Components
import OverviewTab from "./tabs/OverviewTab";
import PortfolioTab from "./tabs/PortfolioTab";
import ServicesTab from "./tabs/ServicesTab";
import ReviewsTab from "./tabs/ReviewsTab";
import SettingsTab from "./tabs/SettingsTab";

const OWNER_TABS = [
  { id: "overview", label: "المعلومات الشخصية", icon: Info },
  { id: "portfolio", label: "الأعمال", icon: BookOpen },
  { id: "services", label: "الخدمات", icon: Wrench },
  { id: "reviews", label: "التقييمات", icon: Star },
  { id: "settings", label: "الإعدادات", icon: Settings },
];

const VISITOR_TABS = OWNER_TABS.filter((t) => t.id !== "settings");


const WorkerProfileInner = () => {
  const { workerId } = useParams();
  const { user: authUser, updateUser } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("overview");

  // ✅ إذا كان الـ ID في الـ URL هو نفسه ID المستخدم → نعامله كـ Owner
  const effectiveId = authUser?.id && workerId === String(authUser.id)
    ? null
    : workerId ?? null;

  // ✅ تمرير effectiveId وليس workerId
  const {
    worker, workImages, loading, saving, toggling, error,
    fetchWorker, updateWorker, toggleStatus,
    uploadProfileImage, uploadWorkImage, deleteWorkImage,
    addWorkingHour,      // استخرجيها هنا
    updateWorkingHour,   // استخرجيها هنا
    deleteWorkingHour,
  } = useWorkerProfile(effectiveId);


 const isOwner = effectiveId === null;

  const tabs = isOwner ? OWNER_TABS : VISITOR_TABS;

  // ── Handlers ────────────────────────────────────────────────
  const handleUploadProfile = async (file) => {
    const res = await uploadProfileImage(file, worker);
    if (res.ok) {
      updateUser({ image: res.worker?.profileImage || res.worker?.ProfileImage });
      toast("تم تحديث صورة الملف الشخصي ✓");
    } else {
      toast(res.error || "فشل رفع الصورة", "error");
    }
  };

  const handleToggleStatus = async () => {
    const res = await toggleStatus();
    if (res.ok) toast("تم تغيير حالة التوفر ✓");
    else toast(res.error || "فشل تغيير الحالة", "error");
  };

  const handleUploadWork = async (file) => {
    const res = await uploadWorkImage(file);
    if (res.ok) toast("تمت إضافة الصورة للمعرض ✓");
    else toast(res.error || "فشل رفع الصورة", "error");
  };

  const handleDeleteWork = async (id) => {
    const res = await deleteWorkImage(id);
    if (res.ok) toast("تم حذف الصورة ✓");
    else toast(res.error || "فشل حذف الصورة", "error");
  };

  // ── Derived data ─────────────────────────────────────────────
  const portfolioImages =
    workImages.length > 0
      ? workImages
      : worker?.portfolioImages || worker?.workImages || [];

  const tabContent = {
    overview: <OverviewTab worker={worker} isOwner={isOwner} loading={loading} />,
   portfolio: <PortfolioTab isOwner={isOwner} />,
    services: (
      <ServicesTab services={worker?.services || []} isOwner={isOwner} loading={loading} />
    ),
    reviews: (
      <ReviewsTab
        reviews={worker?.reviews || []}
        rating={worker?.rating || 0}
        reviewsCount={worker?.reviewsCount || 0}
        loading={loading}
      />
    ),
   settings: isOwner ? (
  <SettingsTab
    worker={worker}
    updateWorker={updateWorker} // مررنا الدالة هنا
    saving={saving}             // مررنا حالة التحميل هنا
    onToggleStatus={handleToggleStatus}
    toggling={toggling}
    updateUser={updateUser}
     addWorkingHour={addWorkingHour}        // ✅ أضيفي هذا
    updateWorkingHour={updateWorkingHour}  // ✅ أضيفي هذا
    deleteWorkingHour={deleteWorkingHour} 
  />
) : null,
  };

  // ── Error state ───────────────────────────────────────────────
  if (error && !loading) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] p-4 lg:p-10" dir="rtl">
        <ErrorState message={error} onRetry={fetchWorker} />
      </div>
    );
  }

  // ── Render ────────────────────────────────────────────────────
  return (
    <div dir="rtl" className="min-h-screen bg-[#f8f6f3] p-4 pb-28 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <WorkerHeader
          worker={worker}
          isOwner={isOwner}
          loading={loading}
          saving={saving}
          toggling={toggling}
          onUploadImage={handleUploadProfile}
          onToggleStatus={handleToggleStatus}
          onEditClick={() => setActiveTab("settings")}
        />

        {/* Stats Bar */}
        <StatsBar worker={worker} loading={loading} />

        {/* Mobile Tab Bar */}
        <MobileTabBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOwner={isOwner}
          tabs={tabs}
        />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
          {/* Sidebar – desktop only */}
          <div className="hidden lg:block lg:col-span-1">
            <WorkerSidebar
              worker={worker}
              isOwner={isOwner}
              loading={loading}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              tabs={tabs}
              onUploadImage={handleUploadProfile}
            />
          </div>

          {/* Main tab content */}
          <main className="lg:col-span-3">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm min-h-[400px]">
              {/* Tab header row */}
              <div className="mb-5 border-b border-gray-50 pb-4 flex items-center justify-between">
                <h2 className="text-base font-black text-gray-800">
                  {tabs.find((t) => t.id === activeTab)?.label}
                </h2>
                <span
                  className={`rounded-full px-3 py-0.5 text-xs font-bold ${
                    isOwner ? "bg-orange-50 text-orange-500" : "bg-blue-50 text-blue-600"
                  }`}
                >
                  {isOwner ? "أنت المالك" : "زائر"}
                </span>
              </div>

              {/* Animated tab content */}
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.2 }}
                >
                  {tabContent[activeTab]}
                </motion.div>
              </AnimatePresence>
            </div>
          </main>
        </div>
      </div>

      {/* Floating action buttons – mobile only */}
      <FloatingActions isOwner={isOwner} setActiveTab={setActiveTab} />
    </div>
  );
};

// الـ Export الصحيح والوحيد في الملف
const WorkerProfile = () => (
  <ToastProvider>
    <WorkerProfileInner />
  </ToastProvider>
);

export default WorkerProfile;