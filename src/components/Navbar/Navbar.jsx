import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logoImg from "../../assets/img/tadbeerLogo/logo.5.png";
import { useAuth } from "../../context/AuthContext";
import {
  LogOut,
  User,
  ChevronDown,
  Menu,
  X,
  LayoutDashboard,
} from "lucide-react";

function Navbar() {
  const [open, setOpen] = useState(false);
  const [isNavigating, setIsNavigating] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // ✅ منطق الأدوار والروابط (تم دمجه من التحديث الجديد)
  const role = user?.role?.toLowerCase();
  const dashboardRoutes = {
    admin: "/admin",
    superadmin: "/admin",
    worker: "/technical",
  };

  const navLinks = [
    { name: "الرئيسية", path: "/" },
    { name: "عن المنصة", path: "#about" },
    { name: "الخدمات", path: "/services" },
    { name: "اتصل بنا", path: "#ContactSection" },
  ];

  // ✅ دالة الخروج (تم الحفاظ عليها)
  const handleLogout = async () => {
    await logout();
    setOpen(false);
    navigate("/");
  };

  const isLinkActive = (linkPath) => {
    const currentPath = location.pathname;
    const currentHash = location.hash;
    if (linkPath.startsWith("#")) return currentHash === linkPath;
    if (linkPath === "/") return currentPath === "/" && currentHash === "";
    return currentPath === linkPath;
  };

  const handleNavClick = (path) => {
    setOpen(false);
    if (path.startsWith("#")) {
      setIsNavigating(true);
      navigate({ pathname: "/", hash: path });
      setTimeout(() => setIsNavigating(false), 800);
    } else {
      navigate(path);
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    if (location.pathname === "/" && location.hash) {
      const el = document.querySelector(location.hash);
      if (el) setTimeout(() => el.scrollIntoView({ behavior: "smooth" }), 100);
    }
  }, [location.pathname, location.hash]);

  useEffect(() => {
    if (location.pathname !== "/" || isNavigating) return;
    const sections = ["#about", "#ContactSection"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const id = "#" + entry.target.id;
            navigate({ pathname: "/", hash: id }, { replace: true });
          }
        });
      },
      { root: null, rootMargin: "-40% 0px -50% 0px", threshold: 0 }
    );
    sections.forEach((sec) => {
      const el = document.querySelector(sec);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, [location.pathname, isNavigating, navigate]);

  return (
    <nav className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 font-sans border-b border-gray-100" dir="rtl">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">

          {/* Logo Section */}
          <div onClick={() => handleNavClick("/")} className="flex items-center gap-3 cursor-pointer group">
            <motion.div whileHover={{ rotate: -10 }} className="w-10 h-10">
              <img src={logoImg} alt="Tadbeer Logo" className="w-full h-full object-contain" />
            </motion.div>
            <span className="text-2xl font-black text-[#001e3c] tracking-tight">تدبير</span>
          </div>

          {/* Desktop Links */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => {
              const active = isLinkActive(link.path);
              return (
                <li key={link.name}>
                  <button
                    onClick={() => handleNavClick(link.path)}
                    className={`relative text-sm font-bold py-2 px-1 transition-all duration-300 ${active ? "text-yellow-600" : "text-gray-500 hover:text-yellow-600"}`}
                  >
                    {link.name}
                    {active && <motion.div layoutId="active-line" className="absolute -bottom-1 right-0 w-full h-[2px] bg-yellow-500" />}
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Desktop User Area */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="relative group">
                <button className="flex items-center gap-3 p-1.5 pr-4 bg-gray-50 hover:bg-white hover:shadow-md rounded-full border border-gray-100 transition-all duration-300">
                  <span className="text-sm font-bold text-gray-700">{user.name}</span>
                  <div className="w-8 h-8 rounded-full bg-[#001e3c] flex items-center justify-center text-white text-xs font-bold shadow-inner">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown size={14} className="text-gray-400 group-hover:rotate-180 transition-transform duration-300" />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute left-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50 overflow-hidden">
                  <div className="p-2 space-y-1 text-right">
                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">الحساب الشخصي</p>
                      <p className="text-xs text-gray-600 truncate">{user.email || "أهلاً بك"}</p>
                    </div>

                    {/* لوحة التحكم بناءً على الـ Role */}
                    {dashboardRoutes[role] && (
                      <button
                        onClick={() => navigate(dashboardRoutes[role])}
                        className="w-full text-right flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-blue-50 rounded-xl transition-colors"
                      >
                        <LayoutDashboard size={18} className="text-blue-600" />
                        لوحة التحكم
                      </button>
                    )}

                    <button onClick={() => navigate("/user-profile")} className="w-full text-right flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-xl transition-colors">
                      <User size={18} className="text-gray-400" /> الملف الشخصي
                    </button>

                    <button onClick={handleLogout} className="w-full text-right flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors">
                      <LogOut size={18} /> تسجيل الخروج
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button onClick={() => navigate("/auth/login")} className="text-gray-600 font-bold px-5 py-2 text-sm hover:text-[#001e3c]">تسجيل دخول</button>
                <motion.button whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} onClick={() => navigate("/auth/signup")} className="bg-[#001e3c] text-white px-7 py-2.5 rounded-full text-sm font-bold shadow-lg">انشاء حساب</motion.button>
              </div>
            )}
          </div>

          {/* Mobile Toggle */}
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 bg-gray-50 text-[#001e3c] rounded-xl">
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="lg:hidden bg-white border-t border-gray-50 overflow-hidden shadow-2xl">
            <div className="px-6 py-8 space-y-6 text-right">
              {navLinks.map((link) => (
                <button key={link.name} onClick={() => handleNavClick(link.path)} className={`block w-full text-right text-lg font-bold ${isLinkActive(link.path) ? "text-yellow-600" : "text-gray-800"}`}>
                  {link.name}
                </button>
              ))}

              {user && dashboardRoutes[role] && (
                <button onClick={() => navigate(dashboardRoutes[role])} className="flex items-center gap-3 text-blue-600 font-bold text-lg">
                  <LayoutDashboard size={20} /> لوحة التحكم
                </button>
              )}

              <div className="pt-6 border-t border-gray-100">
                {user ? (
                  <button onClick={handleLogout} className="flex items-center gap-3 text-red-500 font-bold text-lg">
                    <LogOut size={20} /> تسجيل الخروج
                  </button>
                ) : (
                  <div className="flex flex-col gap-4">
                    <button onClick={() => navigate("/auth/login")} className="w-full bg-gray-50 py-3 rounded-xl font-bold">دخول</button>
                    <button onClick={() => navigate("/auth/signup")} className="w-full bg-[#001e3c] text-white py-3 rounded-xl font-bold">حساب جديد</button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;