import React from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import { Home, Briefcase, ClipboardList, User } from "lucide-react";
import { useAuth } from "../../context/AuthContext";

function BottomNav() {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();

  const role = user?.role?.toLowerCase();

  // Resolve profile path based on role
  const profilePath =
    role === "worker"
      ? "/technical"
      : role === "admin" || role === "superadmin"
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
      path: profilePath,
    },
  ];

  const isActive = (item) => {
    if (item.exact) {
      return location.pathname === item.path && location.hash === "";
    }
    // For profile tab, match any of the dashboard paths
    if (item.label === "حسابي") {
      return (
        location.pathname === item.path ||
        location.pathname.startsWith("/user-profile") ||
        location.pathname.startsWith("/technical") ||
        location.pathname.startsWith("/admin")
      );
    }
    return location.pathname.startsWith(item.path);
  };

  return (
    <nav
      dir="rtl"
      className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-100"
      style={{ boxShadow: "0 -4px 20px rgba(0,0,0,0.07)" }}
    >
      {/* Safe area padding for iOS */}
      <div className="flex items-center justify-around px-2 pt-2 pb-safe">
        {navItems.map((item) => {
          const active = isActive(item);
          const Icon = item.icon;

          return (
            <button
              key={item.label}
              onClick={() => navigate(item.path)}
              className="relative flex flex-col items-center justify-center gap-0.5 py-2 px-4 rounded-2xl flex-1 min-w-0"
              aria-label={item.label}
            >
              {/* Active background pill */}
              {active && (
                <motion.div
                  layoutId="bottom-nav-pill"
                  className="absolute inset-0 rounded-2xl bg-yellow-100"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}

              {/* Icon with scale tap animation */}
              <motion.div
                whileTap={{ scale: 0.82 }}
                transition={{ type: "spring", stiffness: 400, damping: 20 }}
                className="relative z-10"
              >
                <Icon
                  size={22}
                  strokeWidth={active ? 2.2 : 1.7}
                  className={`transition-colors duration-200 ${
                    active ? "text-yellow-600" : "text-gray-400"
                  }`}
                />
              </motion.div>

              {/* Label */}
              <span
                className={`relative z-10 text-[10px] font-bold tracking-wide transition-colors duration-200 truncate ${
                  active ? "text-yellow-700" : "text-gray-400"
                }`}
              >
                {item.label}
              </span>

              {/* Active dot indicator */}
              {active && (
                <motion.div
                  layoutId="bottom-nav-dot"
                  className="absolute top-1.5 right-3  h-1.5 rounded-full bg-yellow-700"
                  transition={{ type: "spring", stiffness: 380, damping: 32 }}
                />
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default BottomNav;
