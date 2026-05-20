import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Info, BookOpen, Wrench, Star, Settings } from "lucide-react";
import ReactivateScreen from "../../components/UI/ReactivateScreen";

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
  const { user: authUser, updateUser, logout } = useAuth();
  const toast = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [showReactivate, setShowReactivate] = useState(false);

   const getSafeStoredUser = () => {
    try {
      const raw = localStorage.getItem("user");
      if (!raw || raw === "undefined") return null;
      return JSON.parse(raw);
    } catch {
      return null;
    }
  };
   const resolveIsOwner = () => {
    // المصدر الأول: AuthContext (الأولوية دائماً)
    const currentUser = authUser ?? getSafeStoredUser();

    if (!currentUser) return false;

    const userId   = String(currentUser.id || currentUser.userId || currentUser._id || "");
    const userRole = (currentUser.role || currentUser.userType || currentUser.Role || "").toLowerCase();

    // يجب أن يكون Role = "worker" وأن يطابق الـ ID في الرابط
    const isWorkerRole = userRole === "worker";
    const isIdMatch    = userId !== "" && userId === String(workerId);

    return isWorkerRole && isIdMatch;
  };

  const isOwner = resolveIsOwner();

   const effectiveId = isOwner ? null : workerId ?? null;

  const {
    worker, workImages, loading, saving, toggling, error,
    fetchWorker, updateWorker, toggleStatus,
    uploadProfileImage, uploadWorkImage, deleteWorkImage,
    addWorkingHour, setWorker,
    updateWorkingHour,
    deleteWorkingHour,
  } = useWorkerProfile(effectiveId);


  // ✅ لما الحساب يبقى "Deleted"، نستنى ثانيتين قبل شاشة إعادة التفعيل
  // عشان المستخدم يشوف الـ toast والزرار يتحدث لـ "تم التعطيل ✓"
  useEffect(() => {
    if (!loading && isOwner && worker?.status === "Deleted") {
      const timer = setTimeout(() => setShowReactivate(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowReactivate(false);
    }
  }, [loading, isOwner, worker?.status]);

  // ── Handlers ────────────────────────────────────────────────

  const handleToggleStatus = async () => {
    const res = await toggleStatus();

    if (res.ok) {
      // ✅ الـ Backend بيستخدم "Existed" / "Deleted"
      const newStatus = res.worker?.status ??
        (worker.status === "Existed" ? "Deleted" : "Existed");

      const msg = newStatus === "Deleted" ? "تم تعطيل الحساب" : "تم تفعيل الحساب";
      toast(`${msg} بنجاح ✓`);

      updateUser({ status: newStatus });

      return res;
    } else {
      toast(res.error || "فشل تغيير الحالة", "error");
      return res;
    }
  };

  const handleUploadProfile = async (file) => {
    const res = await uploadProfileImage(file, worker);
    if (res.ok) {
      updateUser({ image: res.worker?.profileImage || res.worker?.ProfileImage });
      toast("تم تحديث صورة الملف الشخصي ✓");
    } else {
      toast(res.error || "فشل رفع الصورة", "error");
    }
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

  // ✅ شاشة إعادة التفعيل تظهر بعد ثانيتين من التعطيل
  if (showReactivate) {
    return (
      <ReactivateScreen
        onReactivate={handleToggleStatus}
        loading={toggling}
        onLogout={() => {
          logout();
          window.location.href = "/login";
        }}
      />
    );
  }

  const tabs = isOwner ? OWNER_TABS : VISITOR_TABS;

  const tabContent = {
    overview: <OverviewTab worker={worker} isOwner={isOwner} loading={loading} />,
    portfolio: <PortfolioTab
      isOwner={isOwner}
      workerId={workerId}
      workerData={worker}
    />,
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
        updateWorker={updateWorker}
        saving={saving}
        onToggleStatus={handleToggleStatus}
        toggling={toggling}
        updateUser={updateUser}
        addWorkingHour={addWorkingHour}
        updateWorkingHour={updateWorkingHour}
        deleteWorkingHour={deleteWorkingHour}
      />
    ) : null,
  };

  if (error && !loading) {
    return (
      <div className="min-h-screen bg-[#f8f6f3] p-4 lg:p-10" dir="rtl">
        <ErrorState message={error} onRetry={fetchWorker} />
      </div>
    );
  }

  return (
    <div dir="rtl" className="min-h-screen bg-[#f8f6f3] p-4 pb-28 sm:p-6 lg:p-10">
      <div className="mx-auto max-w-5xl">
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

        <StatsBar worker={worker} loading={loading} />

        <MobileTabBar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          isOwner={isOwner}
          tabs={tabs}
        />

        <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
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

          <main className="lg:col-span-3">
            <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm min-h-[400px]">
              <div className="mb-5 border-b border-gray-50 pb-4 flex items-center justify-between">
                <h2 className="text-base font-black text-gray-800">
                  {tabs.find((t) => t.id === activeTab)?.label}
                </h2>
                <span className={`rounded-full px-3 py-0.5 text-xs font-bold ${isOwner ? "bg-orange-50 text-orange-500" : "bg-blue-50 text-blue-600"}`}>
                  {isOwner ? "أنت المالك" : "زائر"}
                </span>
              </div>

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
      <FloatingActions isOwner={isOwner} setActiveTab={setActiveTab} />
    </div>
  );
};

const WorkerProfile = () => (
  <ToastProvider>
    <WorkerProfileInner />
  </ToastProvider>
);

export default WorkerProfile;