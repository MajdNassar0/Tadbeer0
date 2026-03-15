import React, { useState, useEffect } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

function Navbar() {
  const [open, setOpen] = useState(false);
  const location = useLocation();

  // إغلاق القائمة تلقائياً عند تغيير المسار (مثلاً عند الضغط على رابط)
  useEffect(() => {
    setOpen(false);
  }, [location]);

  const navLinks = [
    { name: "الرئيسية", path: "/" },
    { name: "عن المنصة", path: "#about" },
    { name: "الخدمات", path: "/services" },
    { name: "اتصل بنا", path: "/contact" },
  ];

  return (
    <nav
      className="bg-white/90 backdrop-blur-sm shadow-sm sticky top-0 z-50 font-sans"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between h-16 md:h-20">
          {/* Logo Section */}
          <NavLink to="/" className="flex items-center gap-3">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="bg-yellow-500 w-9 h-9 rounded-lg flex items-center justify-center shadow-md shadow-yellow-100"
            >
              <span className="text-white font-black text-xl">T</span>
            </motion.div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">
              تدبير
            </span>
          </NavLink>

          {/* Desktop Links - تظهر فقط في الشاشات الكبيرة (أكبر من الآيباد) */}
          <ul className="hidden lg:flex items-center gap-10">
            {navLinks.map((link) => (
              <li key={link.path}>
                {link.path.startsWith("#") ? (
                  /* رابط السكشن (عن المنصة) */
                  <a
                    href={link.path}
                    className="relative text-sm font-bold text-gray-600 hover:text-yellow-500 transition-all duration-300 py-1"
                  >
                    {link.name}
                  </a>
                ) : (
                  /* روابط الصفحات الأخرى */
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `relative text-sm font-bold transition-all duration-300 py-1
            ${isActive ? "text-yellow-500" : "text-gray-600 hover:text-yellow-500"}`
                    }
                  >
                    {({ isActive }) => (
                      <>
                        {link.name}
                        {isActive && (
                          <motion.div
                            layoutId="nav-underline"
                            className="absolute -bottom-1 right-0 w-full h-[3px] bg-yellow-500 rounded-full"
                          />
                        )}
                      </>
                    )}
                  </NavLink>
                )}
              </li>
            ))}
          </ul>

          {/* Action Buttons - تظهر فقط في الشاشات الكبيرة */}
          <div className="hidden lg:flex items-center gap-4">
            <button className="text-gray-700 font-bold px-4 hover:text-yellow-600 transition-colors">
              تسجيل الدخول
            </button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-yellow-500 text-white px-6 py-2.5 rounded-xl font-bold shadow-lg shadow-yellow-100"
            >
              إنشاء حساب
            </motion.button>
          </div>

          {/* Mobile/Tablet Menu Button - يظهر في الآيباد والجوال */}
          <button
            onClick={() => setOpen(!open)}
            className="lg:hidden p-2 rounded-xl bg-gray-50 text-gray-700 active:bg-gray-100 transition-all"
          >
            <span className="text-2xl">{open ? "✕" : "☰"}</span>
          </button>
        </div>
      </div>

      {/* Mobile/Tablet Menu Drawer */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="lg:hidden bg-white border-t border-gray-100 overflow-hidden shadow-xl"
          >
            <div className="px-8 py-8 space-y-6">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.path}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <NavLink
                    to={link.path}
                    className={({ isActive }) =>
                      `block text-xl font-bold transition-colors ${isActive ? "text-yellow-500" : "text-gray-800"}`
                    }
                  >
                    {link.name}
                  </NavLink>
                </motion.div>
              ))}

              <motion.div
                className="pt-6 border-t border-gray-100 space-y-4"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
              >
                <button className="w-full bg-gray-50 text-gray-800 py-4 rounded-2xl font-bold active:scale-95 transition-transform">
                  تسجيل الدخول
                </button>
                <button className="w-full bg-yellow-500 text-white py-4 rounded-2xl font-bold shadow-xl shadow-yellow-100 active:scale-95 transition-transform">
                  إنشاء حساب
                </button>
              </motion.div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;
