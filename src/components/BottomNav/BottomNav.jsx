import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Home, Briefcase, ClipboardList, User, LayoutDashboard, ChevronLeft, X } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  // حالة التحكم بفتح وإغلاق القائمة السفلية للعامل
  const [showAccountMenu, setShowAccountMenu] = useState(false);

  const role = user?.role?.toLowerCase();

  // تحديد المسار للأدوار الأخرى بشكل طبيعي
  const profilePath =
    role === "admin" || role === "superadmin"
      ? "/admin"
      : user
      ? "/user-profile"
      : "/auth/login";

  const navItems = [
    {
      label: "الرئيسية",
      icon: Home,
      path: "/",
      exact: true,
    },
    {
      label: "الخدمات",
      icon: Briefcase,
      path: "/services",
    },
    {
      label: "طلباتي",
      icon: ClipboardList,
      path: "/orders",
    },
    {
      label: "حسابي",
      icon: User,
      // إذا كان عامل، نترك المسار فارغاً ليعتمد على الـ onClick لفتح القائمة السفلية
      path: role === "worker" ? "" : profilePath,
    },
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path && location.hash === "";
    }
    if (item.label === "حسابي") {
      // يضيء الزر إذا كان الفني يتنقل داخل البروفايل أو لوحة تحكم الفني (technical)
      return (
        location.pathname.startsWith("/user-profile") ||
        location.pathname.startsWith("/worker-profile") || 
        location.pathname.startsWith("/technical") ||
        location.pathname.startsWith("/admin")
      );
    }
    return location.pathname.startsWith(item.path);
  };

  const handleProfileClick = (item) => {
    if (role === "worker") {
      setShowAccountMenu(true);
    } else {
      navigate(item.path);
    }
  };

  return (
    <>
      <nav
        dir="rtl"
        className="lg:hidden fixed bottom-0 left-0 right-0 z-[9990] bg-white border-t border-gray-100"
        style={{ boxShadow: "0 -4px 20px rgba(0,0,0,0.07)" }}
      >
        <div className="flex items-center justify-around px-2 pt-2 pb-safe">
          {navItems.map((item) => {
            const active = isActive(item);
            const Icon = item.icon;

            return (
              <button
                key={item.label}
                onClick={() => item.label === "حسابي" ? handleProfileClick(item) : navigate(item.path)}
                className="relative flex flex-col items-center justify-center gap-0.5 py-2 px-4 rounded-2xl flex-1 min-w-0"
                aria-label={item.label}
              >
                {active && (
                  <motion.div
                    layoutId="bottom-nav-pill"
                    className="absolute inset-0 rounded-2xl bg-orange-50/40"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}

                <motion.div
                  whileTap={{ scale: 0.82 }}
                  transition={{ type: "spring", stiffness: 400, damping: 20 }}
                  className="relative z-10"
                >
                  <Icon
                    size={22}
                    strokeWidth={active ? 2.2 : 1.7}
                    className={`transition-colors duration-200 ${
                      active ? "text-orange-500" : "text-gray-400"
                    }`}
                  />
                </motion.div>

                <span
                  className={`relative z-10 text-[10px] font-bold tracking-wide transition-colors duration-200 truncate ${
                    active ? "text-orange-600" : "text-gray-400"
                  }`}
                >
                  {item.label}
                </span>

                {active && (
                  <motion.div
                    layoutId="bottom-nav-dot"
                    className="absolute top-1.5 right-3 h-1.5 w-1.5 bg-orange-500 rounded-full"
                    transition={{ type: "spring", stiffness: 380, damping: 32 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </nav>

      {/* --- الـ Bottom Sheet المطور للفني --- */}
      <AnimatePresence>
        {showAccountMenu && (
          <>
            <motion.div
              className="fixed inset-0 z-[9991] bg-black/40 backdrop-blur-xs"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setShowAccountMenu(false)}
            />

            <motion.div
              className="fixed bottom-0 left-0 right-0 z-[9992] bg-white rounded-t-[2.5rem] p-6 pb-8 shadow-2xl"
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              dir="rtl"
            >
              <div className="flex flex-col items-center mb-5 relative">
                <div className="w-12 h-1.5 bg-gray-200 rounded-full mb-2" />
                <h3 className="text-sm font-black text-gray-800">خيارات التحكم</h3>
                <p className="text-[10px] text-gray-400 mt-0.5">اختر الوجهة التي تريد الانتقال إليها</p>
                <button 
                  onClick={() => setShowAccountMenu(false)}
                  className="absolute left-0 top-0 w-7 h-7 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:bg-gray-100 transition"
                >
                  <X size={14} />
                </button>
              </div>

              <div className="space-y-3">
                {/* الخيار الأول: الملف الشخصي (المشاريع، الأعمال والخدمات للتعديل) */}
                <button 
                  onClick={() => {
                    navigate(`/worker-profile/${user?.id || 'me'}`);
                    setShowAccountMenu(false);
                  }} 
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-orange-50/50 border border-orange-100 hover:bg-orange-50 transition-all text-right group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 bg-orange-500 text-white rounded-xl shadow-md shadow-orange-200">
                      <User size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-gray-800">الملف الشخصي الفني</h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">إدارة معرض أعمالك، مشاريعك، والخدمات الميدانية المتاحة</p>
                    </div>
                  </div>
                  <ChevronLeft size={14} className="text-orange-500 group-hover:-translate-x-1 transition-transform" />
                </button>

                {/* الخيار الثاني: لوحة التحكم الإدارية (الطلبات، الحجوزات والتقارير) */}
                <button 
                  onClick={() => {
                    navigate(`/technical`); // يوجهه للداشبورد المبرمجة بالملفات المرفقة
                    setShowAccountMenu(false);
                  }} 
                  className="w-full flex items-center justify-between p-4 rounded-2xl bg-gray-50/50 border border-gray-100 hover:bg-gray-50 transition-all text-right group"
                >
                  <div className="flex items-center gap-3.5">
                    <div className="p-2.5 bg-[#001F3F] text-white rounded-xl shadow-md shadow-blue-900/10">
                      <LayoutDashboard size={18} />
                    </div>
                    <div>
                      <h4 className="text-xs font-black text-gray-800">لوحة التحكم </h4>
                      <p className="text-[10px] text-gray-400 mt-0.5">متابعة وإدارة طلبات الحجوزات، التقييمات، والتقارير المالية</p>
                    </div>
                  </div>
                  <ChevronLeft size={14} className="text-gray-400 group-hover:-translate-x-1 transition-transform" />
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

export default BottomNav;