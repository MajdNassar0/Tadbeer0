import React, { useState, useEffect } from "react";
import { Check, Loader2 } from "lucide-react";
import apiClient from "../../../../API/axiosConfig"; // التأكد من المسار الصحيح للأكسيوس

const SpecialtyEditor = ({ value = [], onChange }) => {
  const [availableSpecialties, setAvailableSpecialties] = useState([]);
  const [loading, setLoading] = useState(true);

  // ── جلب التخصصات من الباك آند ──────────────────────
  useEffect(() => {
    const fetchSpecs = async () => {
      try {
        // استخدام الإيندبوينت التي وجدتيها في Scalar
        const res = await apiClient.get("/General/Specialties"); 
        
        // بناءً على الصورة، البيانات تعود كمصفوفة مباشرة
        setAvailableSpecialties(Array.isArray(res.data) ? res.data : []); 
      } catch (err) {
        console.error("فشل جلب الخدمات المتاحة", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSpecs();
  }, []);

  const toggleSpecialty = (id) => {
    // التعامل مع الـ IDs كـ Strings (Guid) كما يظهر في Scalar
    if (value.includes(id)) {
      onChange(value.filter((i) => i !== id));
    } else {
      onChange([...value, id]);
    }
  };

  if (loading) return (
    <div className="flex items-center gap-2 py-4 text-gray-400 text-[10px]">
      <Loader2 size={12} className="animate-spin" /> جاري مزامنة الخدمات مع النظام...
    </div>
  );

  return (
    <div className="space-y-4">
    <div className="flex items-center justify-between px-1">
      <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
        <span className="w-1.5 h-1.5 bg-orange-500 rounded-full"></span>
        التخصصات المهنية المتاحة
      </label>
      <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-lg">
        تم اختيار {value.length}
      </span>
    </div>

    {/* تحويل العرض إلى Grid منظم بدلاً من Flex مبعثر */}
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2 max-h-75 overflow-y-auto p-2 border border-dashed border-gray-100 rounded-3xl custom-scrollbar">
      {availableSpecialties.map((spec) => {
        const isSelected = value.includes(spec.id);
        return (
          <button
            key={spec.id}
            type="button"
            onClick={() => toggleSpecialty(spec.id)}
            className={`flex items-center gap-2 px-3 py-2.5 rounded-2xl text-[11px] font-bold transition-all duration-300 border ${
              isSelected
                ? "bg-orange-500 border-orange-500 text-white shadow-lg shadow-orange-100 scale-[1.02]"
                : "bg-white border-gray-100 text-gray-500 hover:border-orange-200 hover:bg-orange-50/30"
            }`}
          >
            <div className={`w-4 h-4 rounded-full border flex items-center justify-center transition-colors ${
              isSelected ? "bg-white border-white" : "bg-gray-50 border-gray-200"
            }`}>
              {isSelected && <Check size={10} className="text-orange-500 font-black" />}
            </div>
            <span className="truncate">{spec.name}</span>
          </button>
        );
      })}
    </div>
  </div>
   )
 
};

export default SpecialtyEditor;