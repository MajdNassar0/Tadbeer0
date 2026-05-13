import React, { useState } from "react";
import { Loader2, Save, User, Phone, Calendar } from "lucide-react";
import { useToast } from "../../../../context/ToastContext";

const PersonalInfoForm = ({ worker, updateWorker, saving }) => {
  const toast = useToast();
  
  // الحالة المحلية: نستخدم الحروف الصغيرة للعرض، ونحولها لكبيرة عند الإرسال
  const [formData, setFormData] = useState({
    FirstName: worker?.firstName || "",
    LastName: worker?.lastName || "",
    PhoneNumber: worker?.phoneNumber || "",
    // تنسيق التاريخ ليقبله حقل input type="date"
    DateOfBirth: worker?.dateOfBirth ? worker.dateOfBirth.split('T')[0] : "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // إرسال البيانات بنفس المسميات التي يطلبها السيرفر (PascalCase)
    const res = await updateWorker(formData);
    
    if (res.ok) {
      toast("تم تحديث معلوماتك الشخصية بنجاح ✓", "success");
    } else {
      toast(res.error || "فشل في تحديث البيانات", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5 animate-in fade-in duration-500">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {/* الاسم الأول */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-gray-400 mr-1 flex items-center gap-1">
            <User size={10} /> الاسم الأول
          </label>
          <input 
            className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 text-sm font-semibold text-gray-700 focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-all"
            value={formData.FirstName}
            onChange={(e) => setFormData({...formData, FirstName: e.target.value})}
            placeholder="أدخل اسمك الأول"
            required
          />
        </div>

        {/* اسم العائلة */}
        <div className="space-y-1.5">
          <label className="text-[11px] font-black text-gray-400 mr-1 flex items-center gap-1">
            <User size={10} /> اسم العائلة
          </label>
          <input 
            className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 text-sm font-semibold text-gray-700 focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-all"
            value={formData.LastName}
            onChange={(e) => setFormData({...formData, LastName: e.target.value})}
            placeholder="أدخل اسم العائلة"
            required
          />
        </div>
      </div>

      {/* رقم الهاتف */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-black text-gray-400 mr-1 flex items-center gap-1">
          <Phone size={10} /> رقم الهاتف
        </label>
        <input 
          className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 text-sm font-semibold text-gray-700 focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-all"
          value={formData.PhoneNumber}
          onChange={(e) => setFormData({...formData, PhoneNumber: e.target.value})}
          placeholder="059-xxxxxxx"
        />
      </div>

      {/* تاريخ الميلاد */}
      <div className="space-y-1.5">
        <label className="text-[11px] font-black text-gray-400 mr-1 flex items-center gap-1">
          <Calendar size={10} /> تاريخ الميلاد
        </label>
        <input 
          type="date"
          className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-gray-50 text-sm font-semibold text-gray-700 focus:bg-white focus:ring-2 focus:ring-orange-100 focus:border-orange-400 outline-none transition-all"
          value={formData.DateOfBirth}
          onChange={(e) => setFormData({...formData, DateOfBirth: e.target.value})}
        />
      </div>

      <button 
        type="submit"
        disabled={saving}
        className="w-full mt-6 bg-[#001F3F] text-white py-3.5 rounded-2xl text-sm font-black flex items-center justify-center gap-2 hover:bg-[#002d5c] active:scale-[0.98] transition-all disabled:opacity-50 shadow-lg shadow-blue-900/10"
      >
        {saving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
        حفظ التغييرات الشخصية
      </button>
    </form>
  );
};

export default PersonalInfoForm;