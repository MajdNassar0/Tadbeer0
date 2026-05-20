import React, { useState, useEffect } from "react";
import { Loader2, Save, Briefcase, FileText } from "lucide-react";
import { useToast } from "../../../../context/ToastContext";
import SpecialtyEditor from "../Editors/SpecialtyEditor";
import WorkingHoursEditor from "../Editors/WorkingHoursEditor";

const ProfessionalInfoForm = ({ 
  worker, 
  updateWorker, 
  saving,
  addWorkingHour, 
  updateWorkingHour, 
  deleteWorkingHour 
}) => {
  const toast = useToast();
  
  const [formData, setFormData] = useState({
    JobDescription: "",
    ExperienceYears: 0,
    SpecialtyIds: [],
    WorkingHours: []
  });

  // مزامنة البيانات عند تحميل الصفحة أو تحديث بيانات العامل [cite: 458]
  useEffect(() => {
    if (worker) {
      setFormData({
        JobDescription: worker.jobDescription || "",
        ExperienceYears: worker.experienceYears || 0,
        SpecialtyIds: worker.specialtyIds || [],
        WorkingHours: worker.workingHours?.map(wh => ({
          id: wh.id, // نمرر الـ id لضمان عمل الـ PUT والـ DELETE بشكل صحيح [cite: 58]
          dayOfWeek: wh.dayOfWeek,
          startTime: wh.startTime,
          endTime: wh.endTime
        })) || []
      });
    }
  }, [worker]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // إرسال البيانات المهنية فقط، الساعات تُحفظ سطر بسطر في الـ Editor [cite: 51, 58]
    const { WorkingHours, ...professionalData } = formData;
    const res = await updateWorker(professionalData);
    
    if (res.ok) {
      toast("تم تحديث المعلومات المهنية بنجاح ✓", "success");
    } else {
      toast(res.error || "فشل التحديث، يرجى المحاولة لاحقاً", "error");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in duration-700">
      
      {/* 1. التخصصات المهنية [cite: 463] */}
      <section className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <SpecialtyEditor 
          value={formData.SpecialtyIds} 
          onChange={(ids) => setFormData({...formData, SpecialtyIds: ids})} 
        />
      </section>

      {/* 2. بيانات الخبرة والوصف [cite: 464] */}
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-[11px] font-black text-gray-400 mr-1 flex items-center gap-1 uppercase tracking-wider">
            <FileText size={12} className="text-orange-500" /> النبذة التعريفية (عن عملك)
          </label>
          <textarea 
            rows={5}
            className="w-full px-5 py-4 rounded-[2rem] border border-gray-100 bg-white text-sm font-semibold text-gray-600 focus:ring-2 focus:ring-orange-100 outline-none transition-all leading-relaxed shadow-sm"
            value={formData.JobDescription}
            onChange={(e) => setFormData({...formData, JobDescription: e.target.value})}
            placeholder="اكتب هنا تفاصيل مهاراتك..."
          />
        </div>

{/* قسم سنوات الخبرة مع زر الحفظ المدمج */}
<div className="flex flex-col sm:flex-row items-end justify-between gap-6 pt-2 w-full"> 
  {/* حقل سنوات الخبرة */}
  <div className="space-y-2 w-full sm:w-[180px]"> 
    <label className="text-[11px] font-black text-gray-400 mr-1 flex items-center gap-1 uppercase tracking-wider">
      <Briefcase size={12} className="text-orange-500" /> سنوات الخبرة
    </label>
    <div className="relative">
      <input 
        type="number"
        className="w-full px-4 py-3 rounded-2xl border border-gray-100 bg-white text-sm font-bold text-gray-700 outline-none pr-10 focus:ring-2 focus:ring-orange-50 transition-all"
        value={formData.ExperienceYears}
        onChange={(e) => setFormData({...formData, ExperienceYears: parseInt(e.target.value) || 0})}
      />
      <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[10px] font-bold text-gray-400">سنة</span>
    </div>
  </div>

  {/* زر التحديث في أقصى اليسار */}
  <button 
    type="submit"
    disabled={saving}
    className="h-12 px-10 bg-[#001F3F] text-white rounded-2xl text-[11px] font-black flex items-center justify-center gap-2 hover:bg-[#002d5c] active:scale-[0.98] transition-all disabled:opacity-50 shadow-xl shadow-blue-900/10 min-w-[200px]"
  >
    {saving ? (
      <Loader2 size={16} className="animate-spin" />
    ) : (
      <>
        <Save size={14} className="text-orange-400" />
        <span>تحديث البيانات المهنية</span>
      </>
    )}
  </button>
</div>
      </div>

      {/* 3. ساعات العمل - الربط مع الـ Endpoints المنفصلة [cite: 87] */}
      <section className="bg-gray-50/50 p-6 rounded-[2.5rem] border border-gray-100 shadow-sm">
        <WorkingHoursEditor 
          value={formData.WorkingHours} 
          onChange={(hours) => setFormData({...formData, WorkingHours: hours})}
          onAdd={addWorkingHour}
          onUpdate={updateWorkingHour}
          onDelete={deleteWorkingHour}
        />
      </section>


    </form>
  );
};

// السطر الذي يحل المشكلة الظاهرة في الصورة [cite: 471]
export default ProfessionalInfoForm;