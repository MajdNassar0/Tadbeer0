import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, NavLink } from "react-router-dom";
import axios from "axios";
import {
  LayoutDashboard, ClipboardList, Star,
  BarChart2, Settings, LogOut, Bell, Menu, X
} from "lucide-react";

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return parts[0][0] + parts[1][0];
  return parts[0]?.slice(0, 2) ?? "ف";
}

function Avatar({ name, src }) {
  const [err, setErr] = useState(false);
  const hasImg = src && src !== "string" && !err;
  return hasImg ? (
    <img src={src} alt={name} onError={() => setErr(true)}
         className="w-full h-full object-cover" />
  ) : (
    <div className="w-full h-full bg-yellow-500 flex items-center justify-center
                    text-sm font-medium text-[#0a1d37] select-none">
      {getInitials(name)}
    </div>
  );
}

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "لوحة التحكم", to: "/technical"          },
  { icon: ClipboardList,   label: "الحجوزات",    to: "/technical/bookings" },
  { icon: Star,            label: "التقييمات",   to: "/technical/reviews"  },
  { icon: BarChart2,       label: "التقارير",    to: "/technical/reports"  },
  { icon: Settings,        label: "الإعدادات",   to: "/technical/settings" },
];

const WorkerLayout = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [user, setUser] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user") ?? "null"); }
    catch { return null; }
  });

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/auth/login"); return; }
      try {
        const res = await axios.get(
          "https://tadbeer0.runasp.net/api/Worker/Profile/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const p = res.data;
        const updated = {
          name:         `${p.firstName ?? ""} ${p.lastName ?? ""}`.trim() || user?.name,
          email:        p.email        || user?.email,
          role:         p.role         || user?.role,
          specialty:    p.specialtyNames?.[0] || "فني متخصص",
          profileImage: p.profileImage ?? null,
          avgRating:    p.avgRating    ?? null,
          city:         p.city         ?? null,
        };
        setUser(updated);
        localStorage.setItem("user", JSON.stringify(updated));
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/auth/login");
        }
      }
    };
    load();
  }, [navigate]);

  const displayName    = user?.name    || "الفني";
  const displaySpecial = user?.specialty || "فني متخصص";
  const handleLogout   = () => { localStorage.clear(); navigate("/auth/login"); };

  return (
    <div dir="rtl" className="flex min-h-screen bg-[#f4f7fa] font-sans text-right">

      {/* Mobile overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] lg:hidden"
             onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* ── Sidebar ── */}
      <aside className={`
        fixed inset-y-0 right-0 z-[70] w-64 bg-[#0a1d37] text-white flex flex-col
        transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
      `}>
        <button
          onClick={() => navigate("/")}
          className="p-6 flex items-center justify-between hover:bg-white/5
                     transition-colors border-b border-white/[0.07]"
        >
          <div className="flex items-center gap-3">
            <img src="/src/assets/img/tadbeerLogo/logo.5.png" alt="تدبير"
                 className="w-9 h-9 object-contain" />
            <div>
              <h1 className="text-lg font-medium">تدبير</h1>
              <p className="text-[9px] text-gray-400">العودة للموقع</p>
            </div>
          </div>
          <button className="lg:hidden"
                  onClick={e => { e.stopPropagation(); setIsSidebarOpen(false); }}>
            <X size={20} />
          </button>
        </button>

        {/* Profile mini card */}
        <div className="mx-3 mt-4 mb-2 bg-white/5 rounded-xl p-3 flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl overflow-hidden flex-shrink-0 border-2 border-white/10">
            <Avatar name={displayName} src={user?.profileImage} />
          </div>
          <div className="min-w-0">
            <p className="text-xs font-medium text-white truncate">{displayName}</p>
            <p className="text-[10px] text-gray-400 truncate">{displaySpecial}</p>
          </div>
        </div>

        <nav className="flex-1 px-3 py-2 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/technical"}
              className={({ isActive }) =>
                `flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm transition-all
                ${isActive
                  ? "bg-yellow-500 text-[#0a1d37] font-medium"
                  : "text-white/50 hover:bg-white/5 hover:text-white/90"
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon size={17} className={isActive ? "text-[#0a1d37]" : "text-white/40"} />
                  {label}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="px-3 pb-5 border-t border-white/[0.07] pt-3">
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3 text-red-400
                       hover:bg-red-400/10 rounded-xl text-sm transition-all"
          >
            <LogOut size={17} />
            تسجيل الخروج
          </button>
        </div>
      </aside>

      {/* ── Main ── */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="flex justify-between items-center px-6 py-4 bg-white
                           border-b border-gray-100 sticky top-0 z-10">
          <button onClick={() => setIsSidebarOpen(true)}
                  className="lg:hidden p-2 bg-[#0a1d37] text-white rounded-lg">
            <Menu size={18} />
          </button>

          <h2 className="hidden lg:block text-sm font-medium text-gray-700">
            لوحة تحكم الفني
          </h2>

          <div className="flex items-center gap-4">
            <button className="text-gray-400 hover:text-gray-600 relative">
              <Bell size={18} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-500 rounded-full" />
            </button>
            <div className="flex items-center gap-3">
              <div className="leading-tight text-left hidden lg:block">
                <p className="text-xs font-medium text-gray-800">{displayName}</p>
                <p className="text-[10px] text-gray-400">{displaySpecial}</p>
              </div>
              <div className="w-9 h-9 rounded-xl overflow-hidden border-2 border-gray-100 flex-shrink-0">
                <Avatar name={displayName} src={user?.profileImage} />
              </div>
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="flex-1 overflow-y-auto p-6">
          <Outlet context={{ user }} />
        </div>
      </div>
    </div>
  );
};

export default WorkerLayout;