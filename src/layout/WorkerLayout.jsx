import React, { useState } from "react";
import { Outlet, Link, useLocation } from "react-router-dom";
import { 
  LayoutDashboard, User, Briefcase, Settings, 
  LogOut, Bell, Menu, X, Hammer 
} from "lucide-react";

const WorkerLayout = () => {
  const [isSidebarOpen, setSidebarOpen] = useState(false);
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: "الرئيسية", path: "/worker-dashboard" },
    { icon: User, label: "ملفي الشخصي", path: "/worker-dashboard/profile" },
    { icon: Briefcase, label: "طلبات الشغل", path: "/worker-dashboard/jobs" },
    { icon: Settings, label: "الإعدادات", path: "/worker-dashboard/settings" },
  ];

  return (
    <div className="flex min-h-screen bg-gray-50 font-['Tajawal']" dir="rtl">
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 z-40 bg-black/50 lg:hidden" onClick={() => setSidebarOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-50 w-64 transform bg-[#001e3c] text-white transition-transform duration-300 lg:relative lg:translate-x-0 ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}>
        <div className="flex h-20 items-center justify-center border-b border-white/10 gap-2">
          <Hammer className="text-orange-400" />
          <span className="text-xl font-black tracking-wider text-orange-400">TADBEER</span>
        </div>

        <nav className="mt-6 px-4 space-y-2">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 rounded-xl px-4 py-3 transition-all ${isActive ? "bg-orange-400 text-white shadow-lg" : "text-blue-100 hover:bg-white/10"}`}
              >
                <item.icon size={20} />
                <span className="font-bold">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 w-full px-4">
          <button className="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-red-300 hover:bg-red-500/10 transition-all">
            <LogOut size={20} />
            <span className="font-bold">تسجيل الخروج</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="flex h-16 items-center justify-between bg-white px-6 shadow-sm">
          <button className="lg:hidden text-gray-600" onClick={() => setSidebarOpen(true)}>
            <Menu size={24} />
          </button>
          <div className="mr-auto flex items-center gap-4">
            <button className="relative p-2 text-gray-400 hover:text-orange-500">
              <Bell size={20} />
              <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-white" />
            </button>
            <div className="h-8 w-8 rounded-full bg-orange-100 border border-orange-200" />
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8">
          <Outlet /> {/* هنا ستظهر صفحة البروفايل */}
        </main>
      </div>
    </div>
  );
};

export default WorkerLayout;