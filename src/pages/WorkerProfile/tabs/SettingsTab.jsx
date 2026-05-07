import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, Phone, Hash, Calendar, FileText, Navigation, 
  Edit3, X as IconX, Save, Loader2, ToggleRight, Lock, AlertTriangle 
} from "lucide-react";
import Field from "../../../components/UI/Field";
import WorkingHoursEditor from "../components/Editors/WorkingHoursEditor";
import { useToast } from "../../../context/ToastContext";

const SettingsTab = ({ worker, onToggleStatus, toggling, updateWorker, saving, updateUser }) => {
  const toast = useToast();
  
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState({
    FirstName: "", LastName: "", PhoneNumber: "", JobDescription: "",
    ExperienceYears: "", DateOfBirth: "", Latitude: "", Longitude: "",
    SpecialtyIds: [], WorkingHours: [],
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (!worker) return;
    setForm({
      FirstName: worker.firstName || "",
      LastName: worker.lastName || "",
      PhoneNumber: worker.phoneNumber || "",
      JobDescription: worker.jobDescription || worker.bio || "",
      ExperienceYears: worker.experienceYears ?? worker.yearsOfExperience ?? "",
      DateOfBirth: worker.dateOfBirth ? worker.dateOfBirth.split("T")[0] : "",
      Latitude: worker.latitude ?? "",
      Longitude: worker.longitude ?? "",
      SpecialtyIds: worker.specialtyIds || [],
      WorkingHours: worker.workingHours || [],
    });
  }, [worker]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(p => ({ ...p, [name]: value }));
    if (errors[name]) setErrors(p => ({ ...p, [name]: undefined }));
  };

  const validate = () => {
    const e = {};
    if (!form.FirstName.trim()) e.FirstName = "الاسم الأول مطلوب";
    if (!form.LastName.trim()) e.LastName = "الاسم الأخير مطلوب";
    if (form.ExperienceYears !== "" && isNaN(Number(form.ExperienceYears))) e.ExperienceYears = "يجب أن يكون رقماً";
    return e;
  };

  const handleSave = async () => {
    const errs = validate();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const payload = {
      ...form,
      ExperienceYears: form.ExperienceYears !== "" ? Number(form.ExperienceYears) : undefined,
      Latitude: form.Latitude !== "" ? Number(form.Latitude) : undefined,
      Longitude: form.Longitude !== "" ? Number(form.Longitude) : undefined,
    };

    const res = await updateWorker(payload);
    if (res?.ok) {
      updateUser({ name: `${form.FirstName} ${form.LastName}`.trim() });
      toast("تم حفظ البيانات بنجاح ✓");
      setEditMode(false);
      setErrors({});
    } else {
      toast(res?.error || "فشل الحفظ", "error");
    }
  };

  return (
    <div className="flex flex-col gap-8">
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-gray-800">البيانات الشخصية</h3>
          {!editMode && (
            <button onClick={() => setEditMode(true)} className="flex items-center gap-1.5 text-xs font-bold text-orange-500 bg-orange-50 px-3 py-1.5 rounded-xl border border-orange-200 hover:bg-orange-100 transition">
              <Edit3 size={12}/> تعديل
            </button>
          )}
        </div>

        <AnimatePresence mode="wait">
          {editMode ? (
            <motion.div key="edit" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field icon={User} label="الاسم الأول *" name="FirstName" value={form.FirstName} onChange={handleChange} error={errors.FirstName}/>
                <Field icon={User} label="الاسم الأخير *" name="LastName" value={form.LastName} onChange={handleChange} error={errors.LastName}/>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field icon={Phone} label="رقم الهاتف" name="PhoneNumber" value={form.PhoneNumber} onChange={handleChange} error={errors.PhoneNumber}/>
                <Field icon={Hash} label="سنوات الخبرة" name="ExperienceYears" type="number" value={form.ExperienceYears} onChange={handleChange} error={errors.ExperienceYears}/>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field icon={Calendar} label="تاريخ الميلاد" name="DateOfBirth" value={form.DateOfBirth} onChange={handleChange} type="date"/>
              </div>

              <Field icon={FileText} label="وصف العمل" name="JobDescription" as="textarea" rows={3} value={form.JobDescription} onChange={handleChange} placeholder="اكتب وصفاً لعملك..."/>
              
              <SpecialtyEditor value={form.SpecialtyIds} onChange={val => setForm(p => ({ ...p, SpecialtyIds: val }))}/>
              <WorkingHoursEditor value={form.WorkingHours} onChange={val => setForm(p => ({ ...p, WorkingHours: val }))}/>

              <div className="flex justify-end gap-3 border-t pt-4">
                <button onClick={() => { setEditMode(false); setErrors({}); }} className="text-sm font-semibold text-gray-500 px-5 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition">إلغاء</button>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 bg-orange-500 text-white px-6 py-2 rounded-xl font-bold shadow-md disabled:opacity-60 transition hover:bg-orange-600">
                  {saving ? <Loader2 size={14} className="animate-spin"/> : <Save size={14}/>} حفظ التغييرات
                </button>
              </div>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
               <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                 <User size={14} className="text-orange-400"/>
                 <div>
                   <p className="text-[10px] text-gray-400 font-medium">الاسم الكامل</p>
                   <p className="text-xs font-semibold text-gray-700">{worker?.firstName} {worker?.lastName}</p>
                 </div>
               </div>
               <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl border border-gray-100">
                 <Phone size={14} className="text-orange-400"/>
                 <div>
                   <p className="text-[10px] text-gray-400 font-medium">رقم الهاتف</p>
                   <p className="text-xs font-semibold text-gray-700">{worker?.phoneNumber || "غير محدد"}</p>
                 </div>
               </div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default SettingsTab;