import React from 'react';
import { 
  User, Mail, Phone, MapPin, Calendar, 
  ShieldCheck, Bell, Moon, Trash2, Edit2, 
  CheckCircle, Clock, PlusCircle 
} from 'lucide-react';

const UserProfile = () => {
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8 font-sans" dir="rtl">
      {/* Container الأكبر */}
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* 1. Header Section - بطاقة التعريف العلوية */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-center gap-6 relative overflow-hidden">
          <div className="absolute top-0 left-0 w-32 h-32 bg-blue-50 rounded-full -translate-x-16 -translate-y-16 opacity-50"></div>
          
          <div className="relative">
            <div className="w-32 h-32 rounded-full border-4 border-white shadow-lg overflow-hidden bg-gray-200">
              <img 
                src="https://api.dicebear.com/7.x/avataaars/svg?seed=Ahmed" 
                alt="Profile" 
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-1 right-1 bg-orange-500 p-2 rounded-full text-white shadow-md hover:bg-orange-600 transition">
              <Edit2 size={16} />
            </button>
          </div>

          <div className="flex-1 text-center md:text-right">
            <h1 className="text-2xl font-bold text-gray-800">أحمد محمد حسن</h1>
            <div className="flex items-center justify-center md:justify-start gap-2 text-gray-500 mt-2">
              <MapPin size={18} className="text-blue-500" />
              <span>الرياض، المملكة العربية السعودية</span>
            </div>
            <div className="mt-4 flex flex-wrap justify-center md:justify-start gap-3">
              <span className="bg-blue-100 text-blue-700 px-4 py-1 rounded-full text-sm font-medium">عضو ذهبي</span>
              <span className="bg-gray-100 text-gray-600 px-4 py-1 rounded-full text-sm font-medium">12 طلب مكتمل</span>
            </div>
          </div>

          <div className="flex flex-col gap-2 w-full md:w-auto">
            <button className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-100">
              تعديل الملف
            </button>
          </div>
        </div>

        {/* 2. Main Content Grid - الجسم الأساسي */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Sidebar - القائمة الجانبية */}
          <div className="lg:col-span-1 space-y-6">
            {/* القائمة */}
            <div className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
              <nav className="space-y-1">
                {[
                  { name: 'الملف الشخصي', icon: User, active: true },
                  { name: 'الأمان', icon: ShieldCheck, active: false },
                  { name: 'التنبيهات', icon: Bell, active: false },
                  { name: 'المدفوعات', icon: Clock, active: false },
                ].map((item, idx) => (
                  <button 
                    key={idx}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl transition ${item.active ? 'bg-orange-50 text-orange-600' : 'text-gray-500 hover:bg-gray-50'}`}
                  >
                    <item.icon size={20} />
                    <span className="font-medium">{item.name}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* النشاط الأخير */}
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <Clock size={20} className="text-orange-500" /> النشاط الأخير
              </h3>
              <div className="space-y-6 relative before:absolute before:right-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-gray-100">
                <div className="relative pr-8">
                  <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-green-500 border-4 border-white"></div>
                  <p className="text-sm font-bold text-gray-800">صيانة مكيف مركزي</p>
                  <p className="text-xs text-gray-500">أمس، 4:00 م</p>
                </div>
                <div className="relative pr-8">
                  <div className="absolute right-1 top-1 w-4 h-4 rounded-full bg-blue-500 border-4 border-white"></div>
                  <p className="text-sm font-bold text-gray-800">تنظيف عميق للمنزل</p>
                  <p className="text-xs text-gray-500">12 أكتوبر</p>
                </div>
              </div>
              <button className="w-full mt-6 text-blue-600 text-sm font-bold hover:underline">عرض الكل</button>
            </div>
          </div>

          {/* Main Form - المحتوى الرئيسي */}
          <div className="lg:col-span-2 space-y-6">
            {/* المعلومات الشخصية */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-800">المعلومات الشخصية</h3>
                <button className="text-orange-500 text-sm font-bold">تعديل الكل</button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">الاسم الكامل</label>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-gray-700 font-medium">أحمد محمد حسن</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">البريد الإلكتروني</label>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-gray-700 font-medium">ahmed.h@example.com</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">رقم الهاتف</label>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-gray-700 font-medium text-left" dir="ltr">+966 50 123 4567</div>
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-400">تاريخ الميلاد</label>
                  <div className="bg-gray-50 p-3 rounded-xl border border-gray-100 text-gray-700 font-medium">15 مايو 1992</div>
                </div>
              </div>
            </div>

            {/* إعدادات سريعة */}
            <div className="bg-white rounded-3xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-800 mb-6">إعدادات الحساب</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="bg-blue-100 p-2 rounded-lg text-blue-600"><ShieldCheck size={20}/></div>
                    <div>
                      <p className="font-bold text-gray-800">التحقق بخطوتين (2FA)</p>
                      <p className="text-xs text-gray-500">تأمين حسابك عبر رمز سري</p>
                    </div>
                  </div>
                  <input type="checkbox" className="w-5 h-5 accent-orange-500" checked readOnly />
                </div>
                
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-2xl">
                  <div className="flex items-center gap-3">
                    <div className="bg-purple-100 p-2 rounded-lg text-purple-600"><Moon size={20}/></div>
                    <div>
                      <p className="font-bold text-gray-800">الوضع الليلي</p>
                      <p className="text-xs text-gray-500">تغيير مظهر التطبيق</p>
                    </div>
                  </div>
                  <input type="checkbox" className="w-5 h-5 accent-orange-500" />
                </div>
              </div>
            </div>

            {/* Danger Zone */}
            <div className="bg-red-50 rounded-3xl p-8 border border-red-100">
              <h3 className="text-red-600 font-bold mb-4 flex items-center gap-2">
                <Trash2 size={20} /> المنطقة الخطرة
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <button className="flex-1 bg-white border border-red-200 text-red-600 py-3 rounded-2xl font-bold hover:bg-red-100 transition">تعطيل الحساب مؤقتاً</button>
                <button className="flex-1 bg-red-600 text-white py-3 rounded-2xl font-bold hover:bg-red-700 transition">حذف الحساب نهائياً</button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* Floating Action Button للموبايل */}
      <button className="fixed bottom-6 left-6 bg-orange-500 text-white p-4 rounded-full shadow-2xl md:hidden">
        <PlusCircle size={24} />
      </button>
    </div>
  );
};

export default UserProfile;