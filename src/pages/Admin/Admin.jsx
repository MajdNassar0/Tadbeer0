import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { 
  LayoutDashboard, Users, UserCog, Calendar, 
  Star, BarChart3, Settings, LogOut, Search, Bell, Menu, X, Globe 
} from "lucide-react";

const stats = [
  { title: "المستخدمين المسجلين", value: "1,250", growth: "12%+", color: "text-blue-600" },
  { title: "الفنيين النشطين", value: "480", growth: "5%+", color: "text-orange-500" },
  { title: "إجمالي الحجوزات", value: "3,420", growth: "18%+", color: "text-purple-600" },
  { title: "تقييم الخدمة", value: "4.9", growth: "0.2%+", color: "text-yellow-500" },
];

const services = [
  { name: "السباكة", percent: 85, color: "bg-orange-400" },
  { name: "الكهرباء", percent: 72, color: "bg-[#0a1d37]" },
  { name: "تكييف وتبريد", percent: 60, color: "bg-blue-500" },
  { name: "تنظيف", percent: 45, color: "bg-gray-400" },
];

const Admin = () => {
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
  const [admin, setAdmin] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  useEffect(() => {
    const fetchAdminProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/auth/login");
          return;
        }

        const res = await axios.get(
          "https://tadbeer0.runasp.net/api/Admin/Profile/me",
          { headers: { Authorization: `Bearer ${token}` } }
        );

        const role = res.data.role?.toLowerCase();
        if (role === "admin" || role === "superadmin") {
          setAdmin(res.data);
          localStorage.setItem("user", JSON.stringify(res.data));
        } else {
          navigate("/"); 
        }
      } catch (err) {
        if (err.response?.status === 401) {
          localStorage.clear();
          navigate("/auth/login");
        }
      }
    };

    fetchAdminProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.clear();
    navigate("/auth/login");
  };

  const displayName = admin ? `${admin.firstName || admin.name || ''} ${admin.lastName || ''}` : "تحميل...";
  const displayRole = admin?.role === "SuperAdmin" ? "مدير النظام الأعلى" : "مدير النظام";
  const displayAvatar = admin?.profileImage && admin.profileImage !== "string" 
    ? admin.profileImage 
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${admin?.firstName || 'Admin'}`;

  return (
    <div dir="rtl" className="flex min-h-screen bg-[#f8f9fa] font-sans text-right">
      
      {/* 1. Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div className="fixed inset-0 bg-black/50 z-[60] lg:hidden" onClick={() => setIsSidebarOpen(false)} />
      )}

      {/* 2. Sidebar */}
      <aside className={`fixed inset-y-0 right-0 z-[70] w-72 bg-[#0a1d37] text-white flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0 ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}`}>
        
        {/* Sidebar Header - Clickable to Home */}
        <div 
          className="p-8 flex items-center justify-between cursor-pointer group hover:bg-white/5 transition-colors"
          onClick={() => navigate("/")}
        >
          <div className="flex items-center gap-3">
            <img src="/src/assets/img/tadbeerLogo/logo.5.png" alt="Tadbeer logo" className="w-10 h-10 object-contain" />
            <div>
              <h1 className="text-2xl font-bold tracking-tight">تدبير</h1>
              <p className="text-[10px] text-gray-400 group-hover:text-yellow-500 transition-colors">العودة للرئيسية</p>
            </div>
          </div>
          <button className="lg:hidden" onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(false); }}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {/* ✅ Redirect to Home Button */}
          <button 
            onClick={() => navigate("/")}
            className="flex items-center gap-4 w-full px-4 py-3 mb-6 text-yellow-500 border border-yellow-500/20 rounded-xl hover:bg-yellow-500 hover:text-[#0a1d37] transition-all group"
          >
            <Globe size={20} className="group-hover:rotate-12 transition-transform" />
            <span className="font-bold text-sm">عرض الموقع العام</span>
          </button>

          <NavItem icon={<LayoutDashboard size={20}/>} label="لوحة القيادة" active />
          <NavItem icon={<Users size={20}/>} label="إدارة المستخدمين" />
          <NavItem icon={<UserCog size={20}/>} label="إدارة الفنيين" />
          <NavItem icon={<Calendar size={20}/>} label="الحجوزات" />
          <NavItem icon={<Star size={20}/>} label="التقييمات" />
          <NavItem icon={<BarChart3 size={20}/>} label="التقارير والتحليلات" />
          
          <div className="pt-4 mt-4 border-t border-gray-700/50">
             <NavItem icon={<Settings size={20}/>} label="الإعدادات" />
             <button onClick={handleLogout} className="flex items-center gap-4 w-full px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all mt-2 group">
                <LogOut size={20} className="group-hover:-translate-x-1 transition-transform" />
                <span className="font-bold text-sm">تسجيل الخروج</span>
             </button>
          </div>
        </nav>
      </aside>

      {/* 3. Main Content Area */}
      <main className="flex-1 p-4 lg:p-8 w-full overflow-x-hidden">
        
        {/* Header (Desktop) */}
        <header className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4 lg:gap-0">
          <div className="relative w-full md:w-1/3">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input type="text" placeholder="بحث عن حجوزات، فنيين..." className="w-full bg-white border-none rounded-2xl pr-12 pl-4 py-3 shadow-sm outline-none" />
          </div>
          
          <div className="hidden lg:flex items-center gap-6">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-all">
              <Bell size={22} />
              <span className="absolute top-2 left-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="text-left">
                <p className="font-bold text-sm text-gray-800">{displayName}</p>
                <p className="text-xs text-gray-400">{displayRole}</p>
              </div>
              <div className="w-11 h-11 bg-gray-200 rounded-xl border-2 border-white shadow-sm overflow-hidden">
                <img src={displayAvatar} alt="User" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-6 mb-8">
          {stats.map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-50 relative group hover:shadow-md transition-all">
              <span className={`absolute top-4 left-4 text-[10px] font-black px-2 py-1 rounded-lg bg-gray-50 ${item.color.replace('text', 'bg')}/10 ${item.color}`}>{item.growth}</span>
              <p className="text-sm font-medium text-gray-400 mb-1">{item.title}</p>
              <h2 className="text-2xl lg:text-3xl font-black text-gray-800">{item.value}</h2>
            </div>
          ))}
        </div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-5 lg:p-7 rounded-[24px] shadow-sm border border-gray-50">
             <h3 className="text-lg font-bold text-gray-800 mb-6">إحصائيات الحجوزات الشهرية</h3>
             <div className="flex items-end justify-between h-40 px-2 gap-2">
                {[40, 70, 50, 85, 65, 45].map((h, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 group w-full">
                    <div className={`w-full max-w-[40px] rounded-t-xl transition-all cursor-pointer ${i === 3 ? 'bg-yellow-400 shadow-lg' : 'bg-gray-100 group-hover:bg-blue-50'}`} style={{ height: `${h}%` }}></div>
                    <span className="text-[10px] text-gray-400 font-bold">شهر {i+1}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-white p-5 lg:p-7 rounded-[24px] shadow-sm border border-gray-50">
            <h3 className="text-lg font-bold text-gray-800 mb-6">الخدمات الأكثر طلباً</h3>
            <div className="space-y-5">
              {services.map((srv, i) => (
                <div key={i}>
                  <div className="flex justify-between text-xs lg:text-sm mb-2 font-bold">
                    <span className="text-gray-700">{srv.name}</span>
                    <span className="text-gray-500">{srv.percent}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div className={`h-full ${srv.color} transition-all duration-1000`} style={{ width: `${srv.percent}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Bookings */}
        <div className="bg-white p-5 lg:p-7 rounded-[24px] shadow-sm border border-gray-50 overflow-hidden">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-gray-800">أحدث الحجوزات</h3>
            <button className="text-sm font-bold text-orange-500">عرض الكل</button>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px]">
              <thead>
                <tr className="text-gray-400 text-xs text-right border-b border-gray-50">
                  <th className="pb-4 pr-4">اسم العميل</th>
                  <th className="pb-4">الفني</th>
                  <th className="pb-4">الخدمة</th>
                  <th className="pb-4">التاريخ</th>
                  <th className="pb-4 text-center">الحالة</th>
                  <th className="pb-4 text-left">الإجراءات</th>
                </tr>
              </thead>
              <tbody className="text-sm">
                <TableRow name="سارة محمد" tech="م. خالد" service="إصلاح تكييف" date="14 أكتوبر" status="مكتمل" statusColor="bg-green-100 text-green-600" />
                <TableRow name="فيصل الحربي" tech="فهد العتيبي" service="تأسيس سباكة" date="14 أكتوبر" status="قيد التنفيذ" statusColor="bg-blue-100 text-blue-600" />
                <TableRow name="نورة القحطاني" tech="سعيد الأحمد" service="كشف تسريبات" date="13 أكتوبر" status="ملغي" statusColor="bg-red-100 text-red-600" />
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  );
};

const NavItem = ({ icon, label, active = false }) => (
  <button className={`flex items-center gap-4 w-full px-4 py-3.5 rounded-xl transition-all group ${active ? 'bg-yellow-500 text-[#0a1d37] shadow-lg' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
    <span className={active ? 'text-[#0a1d37]' : 'text-gray-500 group-hover:text-yellow-500 transition-colors'}>{icon}</span>
    <span className="font-bold text-sm">{label}</span>
  </button>
);

const TableRow = ({ name, tech, service, date, status, statusColor }) => (
  <tr className="border-b border-gray-50 last:border-0 group hover:bg-gray-50 transition-all">
    <td className="py-5 pr-4 font-black text-gray-800 whitespace-nowrap">{name}</td>
    <td className="py-5 font-bold text-blue-900">{tech}</td>
    <td className="py-5 text-gray-600">{service}</td>
    <td className="py-5 text-gray-400">{date}</td>
    <td className="py-5 text-center">
      <span className={`px-4 py-1.5 rounded-full text-[10px] font-black ${statusColor}`}>{status}</span>
    </td>
    <td className="py-5 text-left text-gray-300 font-black cursor-pointer hover:text-gray-600">...</td>
  </tr>
);

export default Admin;