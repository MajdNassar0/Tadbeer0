import React, { useState, useEffect } from "react";
import { Outlet, useNavigate, useLocation, NavLink } from "react-router-dom";
import axios from "axios";
import {
  LayoutDashboard, Users, UserCog, Calendar,
  Star, BarChart3, Settings, LogOut, Search, Bell
} from "lucide-react";

// ── helpers ───────────────────────────────────────────────────────────────────

function getInitials(name = "") {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return parts[0][0] + parts[1][0];
  return parts[0]?.slice(0, 2) ?? "م";
}

function Avatar({ name, src }) {
  const [err, setErr] = useState(false);
  const hasImg = src && src !== "string" && !err;
  return hasImg ? (
    <img src={src} alt={name} onError={() => setErr(true)}
         className="w-10 h-10 rounded-xl object-cover" />
  ) : (
    <div className="w-10 h-10 rounded-xl bg-yellow-500 flex items-center justify-center
                    text-sm font-medium text-[#0a1d37] select-none">
      {getInitials(name)}
    </div>
  );
}

const NAV_ITEMS = [
  { icon: LayoutDashboard, label: "لوحة القيادة",     to: "/admin"             },
  { icon: Users,           label: "إدارة المستخدمين", to: "/admin/users"       },
  { icon: UserCog,         label: "إدارة الفنيين",    to: "/admin/technicians" },
  { icon: BarChart3,       label: "التقارير",         to: "/admin/reports"     },
  { icon: Settings,        label: "الإعدادات",        to: "/admin/settings"    },
];

// ── layout ────────────────────────────────────────────────────────────────────

const AdminLayout = () => {
  const navigate = useNavigate();

  const [admin, setAdmin] = useState(() => {
    try { return JSON.parse(localStorage.getItem("user") ?? "null"); }
    catch { return null; }
  });

  useEffect(() => {
    const load = async () => {
      const token = localStorage.getItem("token");
      if (!token) { navigate("/auth/login"); return; }

      // ✅ Role guard: don't hit admin endpoint for non-admin users
      const storedUser = JSON.parse(localStorage.getItem("user") ?? "null");
      const role = storedUser?.role?.trim().toLowerCase();
      if (role && role !== "admin" && role !== "superadmin") {
        navigate("/auth/login");
        return;
      }

      try {
        const res = await axios.get(
          "https://tadbeer0.runasp.net/api/Admin/Profile/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const updated = {
          name:         res.data.fullName || res.data.name || admin?.name,
          email:        res.data.email    || admin?.email,
          role:         res.data.role     || admin?.role,
          profileImage: res.data.profileImage ?? null,
        };
        setAdmin(updated);
        localStorage.setItem("user", JSON.stringify(updated));
      } catch (err) {
        const status = err.response?.status;
        // 401 = token invalid/expired → force logout
        // 403 = token valid but wrong role → only redirect if user is definitely not admin
        if (status === 401) {
          localStorage.clear();
          navigate("/auth/login");
        } else if (status === 403) {
          // Don't clear storage — could be a StrictMode double-invoke race.
          // Re-read role from storage; only redirect if genuinely not admin.
          const u = JSON.parse(localStorage.getItem("user") ?? "null");
          const r = u?.role?.trim().toLowerCase();
          if (!r || (r !== "admin" && r !== "superadmin")) {
            localStorage.clear();
            navigate("/auth/login");
          }
          // Otherwise silently ignore — the layout still renders from cached user data
        }
      }
    };
    load();
  }, [navigate]);

  const displayName = admin?.name || admin?.fullName || admin?.userName || "مدير النظام";
  const displayRole = admin?.role?.toLowerCase() === "superadmin"
    ? "مدير النظام الأعلى" : "مدير النظام";
  const handleLogout = () => { localStorage.clear(); navigate("/auth/login"); };

  return (
    <div dir="rtl" className="flex min-h-screen bg-gray-50 font-sans text-right">

      {/* Sidebar */}
      <aside className="w-64 bg-[#0a1d37] text-white flex-col hidden lg:flex flex-shrink-0 sticky top-0 h-screen">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-3 px-6 py-6 hover:opacity-80 transition-opacity border-b border-white/[0.07]"
        >
          <img src="../../../public/logo.png" alt="تدبير"
               className="w-9 h-9 object-contain" />
          <span className="text-lg font-medium tracking-tight">تدبير</span>
        </button>

        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {NAV_ITEMS.map(({ icon: Icon, label, to }) => (
            <NavLink
              key={to}
              to={to}
              end={to === "/admin"}
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

      {/* Main */}
      <div className="flex-1 flex flex-col overflow-hidden">

        {/* Topbar */}
        <header className="flex justify-between items-center px-8 py-4 bg-white
                           border-b border-gray-100 sticky top-0 z-10">
          <div className="relative">
            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-300" size={15} />
            <input type="text" placeholder="بحث..."
              className="bg-gray-50 border border-gray-100 rounded-xl pr-9 pl-4 py-2.5
                         text-sm outline-none focus:ring-2 focus:ring-yellow-400/30 w-56" />
          </div>
          <div className="flex items-center gap-5">
            <button className="text-gray-400 hover:text-gray-600 relative">
              <Bell size={19} />
              <span className="absolute -top-0.5 -right-0.5 w-2 h-2 bg-yellow-500 rounded-full" />
            </button>
            <div className="flex items-center gap-3">
              <div className="leading-tight text-left">
                <p className="text-sm font-medium text-gray-800">{displayName}</p>
                <p className="text-xs text-gray-400">{displayRole}</p>
              </div>
              <Avatar name={displayName} src={admin?.profileImage} />
            </div>
          </div>
        </header>

        {/* Page content injected here */}
        <div className="flex-1 overflow-y-auto p-8">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default AdminLayout;