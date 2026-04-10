import React, { useState, useEffect } from "react";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useAuth } from "../../context/AuthContext";
import {
  LogOut,
  User,
  LayoutDashboard,
  ChevronDown,
  Menu,
  X,
} from "lucide-react";

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  // إغلاق القائمة عند تغيير المسار
  useEffect(() => {
    setOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const navLinks = [
    { name: "الرئيسية", path: "/" },
    { name: "عن المنصة", path: "#about" },
    { name: "الخدمات", path: "/services" },
    { name: "اتصل بنا", path: "#ContactSection" },
  ];

  return (
    <nav
      className="bg-white/80 backdrop-blur-md shadow-sm sticky top-0 z-50 font-sans border-b border-gray-100"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo Section */}
          <NavLink to="/" className="flex items-center gap-3 group">
            <motion.div
              whileHover={{ rotate: -10 }}
              className="w-10 h-10 transition-transform"
            >
              <img
                src="/src/assets/img/tadbeerLogo/logo.5.png"
                alt="Tadbeer"
                className="w-full h-full object-contain"
              />
            </motion.div>
            <span className="text-2xl font-black text-[#001e3c] tracking-tight">
              تدبير
            </span>
          </NavLink>

          {/* Desktop Navigation Links */}
          <ul className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <li key={link.path}>
                {link.path.startsWith("#") ? (
                  /* روابط السكاشن: دائماً رمادية وتصبح صفراء عند الهوفر */
                  <a
                    href={link.path}
                    className="relative text-sm font-bold text-gray-500 hover:text-yellow-600 transition-all duration-300 py-2 px-1"
                  >
                    {link.name}
                  </a>
                ) : (
                  /* روابط الصفحات: تعتمد على حالة الـ Active */
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `relative text-sm font-bold transition-all duration-300 py-2 px-1
            ${isActive ? "text-yellow-600" : "text-gray-500 hover:text-[#001e3c]"}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {link.name}
                        {isActive && (
                          <motion.div
                            layoutId="nav-pill"
                            className="absolute -bottom-1 right-0 w-full h-[2px] bg-yellow-500"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>
          {/* User Actions Area (Desktop) */}
          <div className="hidden lg:flex items-center gap-4">
            {user ? (
              <div className="relative group">
                {/* User Trigger Button */}
                <button className="flex items-center gap-3 p-1.5 pr-4 bg-gray-50 hover:bg-white hover:shadow-md rounded-full border border-gray-100 transition-all duration-300">
                  <span className="text-sm font-bold text-gray-700">
                    {user.name}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-[#001e3c] flex items-center justify-center text-white text-xs font-bold shadow-inner">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <ChevronDown
                    size={14}
                    className="text-gray-400 group-hover:rotate-180 transition-transform duration-300"
                  />
                </button>

                {/* Dropdown Menu */}
                <div className="absolute left-0 mt-3 w-56 bg-white rounded-2xl shadow-2xl border border-gray-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform group-hover:translate-y-0 translate-y-2 z-50 overflow-hidden">
                  <div className="p-2 space-y-1">
                    <div className="px-4 py-3 border-b border-gray-50 mb-1">
                      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                        الحساب
                      </p>
                      <p className="text-xs text-gray-600 truncate">
                        {user.email}
                      </p>
                    </div>

                    {user.role?.toLowerCase() === "admin" && (
                      <NavLink
                        to="/admin"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-blue-900 hover:bg-blue-50 rounded-xl transition-colors"
                      >
                        <LayoutDashboard size={18} className="text-blue-600" />
                        لوحة التحكم
                      </NavLink>
                    )}

                    <NavLink
                      to="/profile"
                      className="flex items-center gap-3 px-4 py-3 text-sm font-bold text-gray-700 hover:bg-gray-50 rounded-xl transition-colors"
                    >
                      <User size={18} className="text-gray-400" />
                      الملف الشخصي
                    </NavLink>

                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-3 px-4 py-3 text-sm font-bold text-red-500 hover:bg-red-50 rounded-xl transition-colors"
                    >
                      <LogOut size={18} />
                      تسجيل الخروج
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <NavLink
                  to="/auth/login"
                  className="text-gray-600 font-bold px-5 py-2 hover:text-[#001e3c] transition-colors text-sm"
                >
                  تسجيل دخول
                </NavLink>
                <NavLink to="/auth/signup">
                  <motion.button
                    whileHover={{
                      scale: 1.03,
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1)",
                    }}
                    whileTap={{ scale: 0.97 }}
                    className="bg-[#001e3c] text-white px-7 py-2.5 rounded-full text-sm font-bold transition-all"
                  >
                    انشاء حساب
                  </motion.button>
                </NavLink>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-xl bg-gray-50 text-[#001e3c] hover:bg-gray-100 transition-all"
          >
            {open ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="lg:hidden bg-white border-t border-gray-50 shadow-2xl overflow-hidden"
          >
            <div className="px-6 py-8 space-y-6 text-right">
              {navLinks.map((link) => (
                <NavLink
                  key={link.path}
                  to={link.path}
                  className="block text-lg font-bold text-gray-800 hover:text-yellow-600 transition-colors"
                >
                  {link.name}
                </NavLink>
              ))}

              <div className="pt-6 border-t border-gray-100 flex flex-col gap-4">
                {user ? (
                  <>
                    <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                      <div className="w-10 h-10 rounded-full bg-yellow-500 flex items-center justify-center text-white font-bold">
                        {user.name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <p className="font-bold text-gray-900">{user.name}</p>
                        <p className="text-xs text-gray-500">{user.role}</p>
                      </div>
                    </div>
                    {user.role?.toLowerCase() === "admin" && (
                      <NavLink to="/admin" className="w-full">
                        <button className="w-full bg-blue-50 text-blue-700 py-4 rounded-2xl font-bold">
                          لوحة التحكم
                        </button>
                      </NavLink>
                    )}
                    <button
                      onClick={handleLogout}
                      className="w-full text-red-500 font-bold py-2"
                    >
                      تسجيل الخروج
                    </button>
                  </>
                ) : (
                  <>
                    <NavLink to="/auth/login" className="w-full">
                      <button className="w-full bg-gray-50 text-gray-800 py-4 rounded-2xl font-bold">
                        دخول
                      </button>
                    </NavLink>
                    <NavLink to="/auth/signup" className="w-full">
                      <button className="w-full bg-[#001e3c] text-white py-4 rounded-2xl font-bold shadow-lg shadow-blue-900/20">
                        ابدأ الآن
                      </button>
                    </NavLink>
                  </>
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
