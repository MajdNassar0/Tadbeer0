import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { 
  LayoutDashboard, ClipboardList, Briefcase, Clock, 
  MessageSquare, BarChart2, Settings, Search, Bell, 
  CheckCircle2, PlusCircle, Menu, X, Star, LogOut, Globe
} from "lucide-react";

const TechnicanDashboard = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  // ✅ Fetch Profile Data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate("/auth/login");
          return;
        }
        const res = await axios.get(
          "https://tadbeer0.runasp.net/api/Worker/Profile/me",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setUser(res.data);
      } catch (err) {
        console.error("PROFILE ERROR:", err);
        if (err.response?.status === 401) navigate("/auth/login");
      }
    };
    fetchProfile();
  }, [navigate]);

  // ✅ Logout Handler
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/auth/login");
  };

  // ✅ Dynamic Data Mapping
  const fullName = user ? `${user.firstName} ${user.lastName}` : "جاري التحميل...";
  const major = user?.specialtyNames?.length > 0 ? user.specialtyNames[0] : "فني متخصص";
  const avatar = user?.profileImage && user.profileImage !== "string" 
    ? user.profileImage 
    : `https://api.dicebear.com/7.x/avataaars/svg?seed=${user?.firstName || 'Worker'}`;

  return (
    <div dir="rtl" className="flex min-h-screen bg-[#f4f7fa] font-sans text-right">
      
      {/* 1. Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-[60] lg:hidden" 
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* 2. Sidebar */}
      <aside className={`
        fixed inset-y-0 right-0 z-[70] w-64 bg-[#0a1d37] text-white flex flex-col transition-transform duration-300 lg:translate-x-0 lg:static lg:inset-0
        ${isSidebarOpen ? "translate-x-0" : "translate-x-full"}
      `}>
        {/* ✅ Clickable Header to go Home */}
        <div 
          className="p-6 flex items-center justify-between cursor-pointer group hover:bg-white/5 transition-colors"
          onClick={() => navigate("/")}
        >
          <div className="flex items-center gap-3">
            <img 
              src="/src/assets/img/tadbeerLogo/logo.5.png" 
              alt="Tadbeer logo" 
              className="w-10 h-10 object-contain group-hover:scale-110 transition-transform" 
            />
            <div>
              <h1 className="text-xl font-bold">تدبير</h1>
              <p className="text-[9px] text-gray-400 group-hover:text-yellow-500 transition-colors">العودة للموقع</p>
            </div>
          </div>
          <button className="lg:hidden" onClick={(e) => { e.stopPropagation(); setIsSidebarOpen(false); }}>
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-3 space-y-1 mt-4">
          <NavItem icon={<LayoutDashboard size={18}/>} label="لوحة التحكم" active />
          <NavItem icon={<ClipboardList size={18}/>} label="مهامي" />
          <NavItem icon={<Briefcase size={18}/>} label="المشاريع" />
          <NavItem icon={<Clock size={18}/>} label="الحضور والانصراف" />
          <NavItem icon={<MessageSquare size={18}/>} label="الرسائل" badge="3" />
          <NavItem icon={<BarChart2 size={18}/>} label="التقارير" />
        </nav>

        <div className="p-4 border-t border-gray-700/50">
          <NavItem icon={<Settings size={18}/>} label="الإعدادات" />
          
          <button 
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-4 py-3.5 mt-2 text-red-400 hover:bg-red-400/10 rounded-xl transition-all group"
          >
            <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-black">تسجيل الخروج</span>
          </button>

          <div className="mt-4 bg-blue-900/40 p-4 rounded-2xl border border-blue-800 hidden lg:block text-center">
            <p className="text-[10px] text-blue-300 mb-2 font-bold uppercase tracking-wider">الدعم الفني</p>
            <button className="w-full bg-yellow-500 text-[#0a1d37] py-2.5 rounded-xl font-black text-sm hover:bg-yellow-400 transition-all active:scale-95 shadow-lg shadow-yellow-500/10">تواصل معنا</button>
          </div>
        </div>
      </aside>

      {/* 3. Main Content Area */}
      <main className="flex-1 flex flex-col lg:flex-row overflow-hidden w-full">
        <div className="flex-1 p-4 lg:p-6 overflow-y-auto">
          {/* Mobile Header */}
          <div className="flex items-center justify-between mb-6 lg:hidden bg-white p-4 rounded-2xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => navigate("/")}>
              <div className="w-12 h-12 rounded-xl bg-gray-100 overflow-hidden border-2 border-yellow-500/20 shadow-sm">
                <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
              </div>
              <div>
                <p className="font-bold text-sm text-gray-800 tracking-tight">{fullName}</p>
                <p className="text-[10px] text-gray-400 font-medium">{major}</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="p-2 bg-gray-50 rounded-lg text-gray-400">
                <Bell size={20} />
              </button>
              <button onClick={() => setIsSidebarOpen(true)} className="p-2 bg-[#0a1d37] text-white rounded-lg">
                <Menu size={20} />
              </button>
            </div>
          </div>

          <header className="flex justify-between items-center mb-6">
             <h2 className="hidden lg:block text-xl font-bold text-gray-800">لوحة تحكم الفني</h2>
             <div className="relative w-full lg:w-1/3">
                <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                <input 
                  type="text" 
                  placeholder="البحث عن مهمة..." 
                  className="w-full bg-white border-none rounded-full pr-10 py-3 shadow-sm text-sm focus:ring-2 focus:ring-yellow-500/10 transition-all outline-none" 
                />
             </div>
          </header>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 lg:gap-4 mb-6">
            <StatChip label="إجمالي المهام" value="42" icon={<ClipboardList size={18}/>} bg="bg-blue-50" color="text-blue-500" />
            <StatChip label="المهام المكتملة" value="28" icon={<CheckCircle2 size={18}/>} bg="bg-green-50" color="text-green-500" />
            <StatChip label="قيد التنفيذ" value="14" icon={<Clock size={18}/>} bg="bg-orange-50" color="text-orange-500" />
            <StatChip label="ساعات العمل" value="160" icon={<Clock size={18}/>} bg="bg-yellow-50" color="text-yellow-600" />
          </div>

          <div className="bg-white p-5 lg:p-7 rounded-[28px] shadow-sm mb-6 border border-gray-50">
            <h3 className="font-bold text-gray-800 mb-6">تقييم الأداء التفصيلي</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-4">
               <RatingRow label="الاحترافية بالتعامل" />
               <RatingRow label="التواصل والمتابعة" />
               <RatingRow label="جودة العمل المسلّم" />
               <RatingRow label="الخبرة بمجال المشروع" />
               <RatingRow label="التسليم في الموعد" />
               <RatingRow label="التعامل معه مرة أخرى" />
            </div>
          </div>

          <div className="bg-white p-5 lg:p-7 rounded-[28px] shadow-sm border border-gray-50 overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-gray-800">قائمة المهام الحالية</h3>
              <button className="text-orange-500 text-sm font-bold hover:underline">عرض الكل</button>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[600px] text-right">
                <thead>
                  <tr className="text-gray-400 text-[11px] uppercase tracking-wider border-b border-gray-50">
                    <th className="pb-4 font-bold pr-2">اسم المهمة</th>
                    <th className="pb-4 font-bold">المشروع</th>
                    <th className="pb-4 font-bold">الموعد النهائي</th>
                    <th className="pb-4 font-bold">الحالة</th>
                    <th className="pb-4 font-bold text-left">الإجراءات</th>
                  </tr>
                </thead>
                <tbody className="text-sm">
                  <TaskRow title="صيانة تكييف مركزي" project="مجمع الابتكار" date="٢٥ أكتوبر ٢٠٢٣" status="مكتمل" sColor="bg-green-100 text-green-600" />
                  <TaskRow title="تركيب تمديدات كهربائية" project="برج النخيل" date="٢٨ أكتوبر ٢٠٢٣" status="قيد التنفيذ" sColor="bg-orange-100 text-orange-600" />
                  <TaskRow title="فحص أنظمة السلامة" project="مستشفى الأمل" date="٣٠ أكتوبر ٢٠٢٣" status="معلق" sColor="bg-red-100 text-red-600" />
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 4. Secondary Sidebar (Desktop Profile & Feed) */}
        <div className="w-full lg:w-80 p-4 lg:p-6 space-y-6 lg:border-r border-gray-100 bg-gray-50/30 lg:bg-transparent">
          <div className="hidden lg:flex items-center gap-3 bg-white p-4 rounded-2xl shadow-sm border border-gray-50">
             <div className="w-11 h-11 rounded-xl bg-gray-100 overflow-hidden border-2 border-white">
                <img src={avatar} alt="avatar" className="w-full h-full object-cover" />
             </div>
             <div className="flex-1">
                <p className="font-bold text-xs text-gray-800">{fullName}</p>
                <p className="text-[10px] text-gray-400 font-medium">{major}</p>
             </div>
             <Bell className="text-gray-300 hover:text-gray-500 cursor-pointer" size={18} />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-6">
            <div className="bg-white p-5 rounded-[28px] shadow-sm border border-gray-50">
              <h4 className="font-bold text-sm mb-5 text-gray-800 tracking-tight">المواعيد النهائية القريبة</h4>
              <div className="space-y-3">
                <DeadlineCard label="صيانة المكيفات" time="المتبقي: ساعتين" color="bg-red-50" tColor="text-red-500" val="٢٥" />
                <DeadlineCard label="التمديدات الكهربائية" time="المتبقي: ٣ أيام" color="bg-yellow-50" tColor="text-yellow-600" val="٢٨" />
              </div>
            </div>

            <div className="bg-white p-5 rounded-[28px] shadow-sm border border-gray-50">
              <h4 className="font-bold text-sm mb-5 text-gray-800 tracking-tight">النشاط الأخير</h4>
              <div className="relative space-y-6 before:absolute before:right-4 before:top-2 before:bottom-2 before:w-[1px] before:bg-gray-100">
                <ActivityItem icon={<CheckCircle2 className="text-orange-500" size={16}/>} text="تم إكمال مهمة فحص السباكة" time="منذ ١٥ دقيقة" />
                <ActivityItem icon={<PlusCircle className="text-blue-500" size={16}/>} text="أضيفت مهمة جديدة" time="منذ ساعتين" />
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

// --- Child Components ---

const NavItem = ({ icon, label, active = false, badge }) => (
  <button className={`flex items-center gap-3 w-full px-4 py-3.5 rounded-xl transition-all ${active ? 'bg-yellow-500 text-[#0a1d37] shadow-lg shadow-yellow-500/10' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}>
    <span>{icon}</span>
    <span className="text-sm font-black flex-1 text-right">{label}</span>
    {badge && <span className="bg-yellow-500 text-[#0a1d37] text-[10px] font-black px-1.5 py-0.5 rounded-full shadow-sm">{badge}</span>}
  </button>
);

const StatChip = ({ label, value, icon, bg, color }) => (
  <div className="bg-white p-4 rounded-2xl shadow-sm flex items-center justify-between border border-gray-50/50 hover:border-yellow-500/10 transition-colors">
    <div className="text-right">
       <p className="text-[10px] text-gray-400 mb-0.5 font-bold uppercase tracking-wide">{label}</p>
       <h4 className="text-xl font-black text-gray-800">{value}</h4>
    </div>
    <div className={`${bg} ${color} p-2.5 rounded-xl`}>{icon}</div>
  </div>
);

const RatingRow = ({ label }) => (
  <div className="flex items-center justify-between text-xs group py-0.5">
    <span className="text-gray-500 font-medium group-hover:text-gray-800 transition-colors">{label}</span>
    <div className="flex gap-0.5">
      {[...Array(5)].map((_, i) => <Star key={i} size={13} className="fill-orange-400 text-orange-400" />)}
    </div>
  </div>
);

const TaskRow = ({ title, project, date, status, sColor }) => (
  <tr className="border-b border-gray-50 last:border-0 hover:bg-gray-50/50 transition-colors group">
    <td className="py-5 pr-2 font-black text-gray-800 whitespace-nowrap">{title}</td>
    <td className="py-5 text-gray-400 font-medium whitespace-nowrap">{project}</td>
    <td className="py-5 text-gray-400 font-medium whitespace-nowrap">{date}</td>
    <td className="py-5"><span className={`px-4 py-1.5 rounded-full text-[10px] font-black ${sColor}`}>{status}</span></td>
    <td className="py-5 text-left"><button className="bg-yellow-500 text-[#0a1d37] px-4 py-2 rounded-xl text-xs font-black hover:bg-yellow-400 shadow-md shadow-yellow-500/5 transition-all">تعديل</button></td>
  </tr>
);

const DeadlineCard = ({ label, time, color, tColor, val }) => (
  <div className={`flex items-center justify-between p-4 rounded-2xl ${color} border border-white/80 shadow-sm transition-all hover:scale-[1.03] cursor-pointer`}>
     <div className="text-right">
        <p className="font-black text-[11px] text-gray-800 tracking-tight">{label}</p>
        <p className="text-[9px] text-gray-400 mt-0.5 font-bold">{time}</p>
     </div>
     <div className={`flex flex-col items-center leading-none ${tColor}`}>
        <span className="text-[7px] font-black uppercase mb-0.5 tracking-tighter">أكتوبر</span>
        <span className="text-xl font-black">{val}</span>
     </div>
  </div>
);

const ActivityItem = ({ icon, text, time }) => (
  <div className="relative pr-9">
     <div className="absolute right-2 top-0 bg-white p-0.5 z-10">{icon}</div>
     <p className="text-[11px] font-black text-gray-800 leading-tight">{text}</p>
     <p className="text-[10px] text-gray-400 mt-1 font-bold">{time}</p>
  </div>
);

export default TechnicanDashboard;