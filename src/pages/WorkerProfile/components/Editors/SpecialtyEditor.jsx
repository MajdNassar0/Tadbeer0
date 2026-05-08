import React from "react";
import { Check } from "lucide-react";

const AVAILABLE_SPECIALTIES = [
  { id: 1, name: "سباكة" },
  { id: 2, name: "كهرباء" },
  { id: 3, name: "نجارة" },
  { id: 4, name: "دهان" },
  { id: 5, name: "تكييف وتبريد" },
  { id: 6, name: "تنظيف منازل" },
];

const SpecialtyEditor = ({ value = [], onChange }) => {
  const toggleSpecialty = (id) => {
    if (value.includes(id)) {
      onChange(value.filter((i) => i !== id));
    } else {
      onChange([...value, id]);
    }
  };

  return (
    <div className="space-y-3">
      <label className="text-xs font-bold text-gray-500 uppercase tracking-wider">
        التخصصات المهنية
      </label>
      <div className="flex flex-wrap gap-2">
        {AVAILABLE_SPECIALTIES.map((spec) => {
          const isSelected = value.includes(spec.id);
          return (
            <button
              key={spec.id}
              type="button"
              onClick={() => toggleSpecialty(spec.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all border ${
                isSelected
                  ? "bg-orange-500 border-orange-500 text-white shadow-md shadow-orange-100"
                  : "bg-white border-gray-200 text-gray-600 hover:border-orange-200"
              }`}
            >
              {isSelected && <Check size={14} />}
              {spec.name}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SpecialtyEditor;