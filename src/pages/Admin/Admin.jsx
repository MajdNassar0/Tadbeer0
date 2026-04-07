import React from "react";
import { 
  LayoutDashboard, Users, UserCog, Calendar, 
  Star, BarChart3, Settings, LogOut, Search, Bell 
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
  return (
    <div dir="rtl" className="flex min-h-screen bg-[#f8f9fa] font-sans text-right">
      
      {/* Sidebar - Matching the Deep Navy and Gold */}
      <aside className="w-72 bg-[#0a1d37] text-white flex flex-col sticky top-0 h-screen">
        <div className="p-8 flex items-center gap-3">
          <div className="bg-yellow-500 p-2 rounded-lg">
            <LayoutDashboard className="text-[#0a1d37]" size={24} />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight">تدبير</h1>
            <p className="text-[10px] text-gray-400">منصة صيانة المنازل</p>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          <NavItem icon={<LayoutDashboard size={20}/>} label="لوحة القيادة" active />
          <NavItem icon={<Users size={20}/>} label="إدارة المستخدمين" />
          <NavItem icon={<UserCog size={20}/>} label="إدارة الفنيين" />
          <NavItem icon={<Calendar size={20}/>} label="الحجوزات" />
          <NavItem icon={<Star size={20}/>} label="التقييمات" />
          <NavItem icon={<BarChart3 size={20}/>} label="التقارير والتحليلات" />
          <div className="pt-4 mt-4 border-t border-gray-700/50">
             <NavItem icon={<Settings size={20}/>} label="الإعدادات" />
             <button className="flex items-center gap-4 w-full px-4 py-3 text-red-400 hover:bg-red-400/10 rounded-xl transition-all mt-2">
                <LogOut size={20} />
                <span className="font-medium">تسجيل الخروج</span>
             </button>
          </div>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-8">
        
        {/* Header */}
        <header className="flex justify-between items-center mb-10">
          <div className="relative w-1/3">
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
            <input
              type="text"
              placeholder="بحث عن حجوزات، فنيين..."
              className="w-full bg-white border-none rounded-2xl pr-12 pl-4 py-3 shadow-sm focus:ring-2 focus:ring-blue-500/20 transition-all"
            />
          </div>
          
          <div className="flex items-center gap-6">
            <button className="relative p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-all">
              <Bell size={22} />
              <span className="absolute top-2 left-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
            </button>
            <div className="flex items-center gap-3">
              <div className="text-left">
                <p className="font-bold text-sm text-gray-800">أحمد العتيبي</p>
                <p className="text-xs text-gray-400">مدير النظام</p>
              </div>
              <div className="w-11 h-11 bg-gray-200 rounded-full border-2 border-white shadow-sm overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed" alt="User" />
              </div>
            </div>
          </div>
        </header>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((item, i) => (
            <div key={i} className="bg-white p-6 rounded-[24px] shadow-sm border border-gray-50 relative group hover:shadow-md transition-all">
              <span className={`absolute top-4 left-4 text-xs font-bold px-2 py-1 rounded-lg bg-gray-50 ${item.color.replace('text', 'bg')}/10 ${item.color}`}>
                {item.growth}
              </span>
              <p className="text-sm font-medium text-gray-400 mb-1">{item.title}</p>
              <h2 className="text-3xl font-black text-gray-800">{item.value}</h2>
            </div>
          ))}
        </div>

        {/* Middle Section: Charts & Most Requested */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-7 rounded-[24px] shadow-sm border border-gray-50">
             <h3 className="text-lg font-bold text-gray-800 mb-6">إحصائيات الحجوزات الشهرية</h3>
             {/* Simple Bar Visualization */}
             <div className="flex items-end justify-between h-40 px-2">
                {[40, 70, 50, 85, 65, 45].map((h, i) => (
                  <div key={i} className="flex flex-col items-center gap-2 group w-full">
                    <div className={`w-10 rounded-xl transition-all cursor-pointer ${i === 3 ? 'bg-yellow-100' : 'bg-gray-100 group-hover:bg-blue-50'}`} style={{ height: `${h}%` }}></div>
                    <span className="text-[10px] text-gray-400 font-medium">شهر {i+1}</span>
                  </div>
                ))}
             </div>
          </div>

          <div className="bg-white p-7 rounded-[24px] shadow-sm border border-gray-50">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-800">الخدمات الأكثر طلباً</h3>
              <span className="text-xs bg-gray-50 text-gray-400 px-3 py-1 rounded-lg">آخر 30 يوم</span>
            </div>
            <div className="space-y-5">
              {services.map((srv, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm mb-2">
                    <span className="font-bold text-gray-700">{srv.name}</span>
                    <span className="font-bold text-gray-500">{srv.percent}%</span>
                  </div>
                  <div className="w-full bg-gray-100 h-2.5 rounded-full">
                    <div
                      className={`h-2.5 rounded-full ${srv.color} transition-all duration-1000`}
                      style={{ width: `${srv.percent}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Recent Bookings Table */}
        <div className="bg-white p-7 rounded-[24px] shadow-sm border border-gray-50">
          <div className="flex justify-between items-center mb-8">
            <h3 className="text-lg font-bold text-gray-800">أحدث الحجوزات</h3>
            <button className="text-sm font-bold text-orange-500 hover:text-orange-600">عرض الكل</button>
          </div>

          <table className="w-full">
            <thead>
              <tr className="text-gray-400 text-sm border-b border-gray-50">
                <th className="pb-4 font-medium pr-4">اسم العميل</th>
                <th className="pb-4 font-medium">الفني المختص</th>
                <th className="pb-4 font-medium">نوع الخدمة</th>
                <th className="pb-4 font-medium">التاريخ</th>
                <th className="pb-4 font-medium text-center">الحالة</th>
                <th className="pb-4 font-medium text-left">الإجراءات</th>
              </tr>
            </thead>
            <tbody className="text-sm">
              <TableRow name="سارة محمد" tech="م. خالد عبدالله" service="إصلاح تكييف" date="14 أكتوبر 2023" status="مكتمل" statusColor="bg-green-100 text-green-600" />
              <TableRow name="فيصل الحربي" tech="فهد العتيبي" service="تأسيس سباكة" date="14 أكتوبر 2023" status="قيد التنفيذ" statusColor="bg-blue-100 text-blue-600" />
              <TableRow name="نورة القحطاني" tech="سعيد الأحمد" service="كشف تسريبات" date="13 أكتوبر 2023" status="ملغي" statusColor="bg-red-100 text-red-600" />
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
};

// Helper Components for Cleaner Code
const NavItem = ({ icon, label, active = false }) => (
  <a href="#" className={`flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all group ${active ? 'bg-yellow-500 text-[#0a1d37] border-l-4 border-white' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
    <span className={active ? 'text-[#0a1d37]' : 'text-gray-500 group-hover:text-yellow-500'}>{icon}</span>
    <span className="font-medium">{label}</span>
  </a>
);

const TableRow = ({ name, tech, service, date, status, statusColor }) => (
  <tr className="border-b border-gray-50 last:border-0 group hover:bg-gray-50 transition-all">
    <td className="py-5 pr-4 font-bold text-gray-800">{name}</td>
    <td className="py-5 font-medium text-blue-900">{tech}</td>
    <td className="py-5 text-gray-600">{service}</td>
    <td className="py-5 text-gray-400">{date}</td>
    <td className="py-5 text-center">
      <span className={`px-4 py-1.5 rounded-full text-xs font-bold ${statusColor}`}>{status}</span>
    </td>
    <td className="py-5 text-left text-gray-300 font-bold">...</td>
  </tr>
);

export default Admin;