import React, { useState } from "react";
import { Clock, Plus, Trash2, Save, Loader2 } from "lucide-react";

const DAYS = [
  { key: "Sunday",    label: "الأحد"    },
  { key: "Monday",    label: "الاثنين"  },
  { key: "Tuesday",   label: "الثلاثاء" },
  { key: "Wednesday", label: "الأربعاء" },
  { key: "Thursday",  label: "الخميس"  },
  { key: "Friday",    label: "الجمعة"  },
  { key: "Saturday",  label: "السبت"    },
];

const TIME_OPTIONS = Array.from({ length: 48 }).map((_, i) => {
  const hour = Math.floor(i / 2).toString().padStart(2, '0');
  const min = i % 2 === 0 ? '00' : '30';
  return `${hour}:${min}`;
});

const WorkingHoursEditor = ({ value = [], onChange, onAdd, onUpdate, onDelete }) => {
  const [loadingId, setLoadingId] = useState(null);

  const handleSave = async (slot, index) => {
    setLoadingId(index);
    // تنسيق الوقت ليتوافق مع السيرفر HH:mm:ss
    const formatTime = (time) => time?.length === 5 ? `${time}:00` : time;

    const hourData = {
      dayOfWeek: slot.dayOfWeek,
      startTime: formatTime(slot.startTime),
      endTime: formatTime(slot.endTime)
    };

    try {
      const res = slot.id 
        ? await onUpdate(slot.id, hourData) 
        : await onAdd(hourData);

      if (res.ok && res.data) {
        const newList = [...value];
        newList[index] = { ...newList[index], id: res.data.id };
        onChange(newList);
      }
    } catch (error) {
      console.error("Save error:", error);
    } finally {
      setLoadingId(null);
    }
  };

  const addSlot = () => {
    onChange([...value, { dayOfWeek: "Saturday", startTime: "08:00", endTime: "16:00" }]);
  };

  const updateLocalSlot = (index, field, newVal) => {
    const newList = [...value];
    newList[index] = { ...newList[index], [field]: newVal };
    onChange(newList);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-2">
        <label className="text-[11px] font-black text-gray-400 uppercase tracking-widest flex items-center gap-2">
          <Clock size={12} className="text-orange-500" /> تنظيم ساعات التوفر
        </label>
        <button 
          type="button" 
          onClick={addSlot}
          className="flex items-center gap-1.5 text-[10px] font-bold text-orange-600 bg-orange-50 px-4 py-2 rounded-2xl hover:bg-orange-100 transition-all active:scale-95"
        >
          <Plus size={14} /> إضافة فترة عمل
        </button>
      </div>

      <div className="grid grid-cols-1 gap-3">
        {value.map((slot, index) => (
          <div key={index} className="flex flex-wrap sm:flex-nowrap items-center gap-3 bg-white p-4 rounded-[2rem] border border-gray-100 shadow-sm hover:border-orange-200 transition-all">
            
            <select 
              className="flex-1 min-w-[120px] bg-gray-50 border-none text-xs font-bold py-2.5 px-4 rounded-2xl outline-none cursor-pointer"
              value={slot.dayOfWeek}
              onChange={(e) => updateLocalSlot(index, "dayOfWeek", e.target.value)}
            >
              {DAYS.map(d => <option key={d.key} value={d.key}>{d.label}</option>)}
            </select>

            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-2xl">
              <span className="text-[10px] font-black text-gray-400">من</span>
              <select 
                className="bg-transparent border-none text-xs font-black text-gray-700 outline-none cursor-pointer"
                value={slot.startTime?.slice(0, 5)}
                onChange={(e) => updateLocalSlot(index, "startTime", e.target.value)}
              >
                {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="flex items-center gap-2 bg-gray-50 px-3 py-1 rounded-2xl">
              <span className="text-[10px] font-black text-gray-400">إلى</span>
              <select 
                className="bg-transparent border-none text-xs font-black text-gray-700 outline-none cursor-pointer"
                value={slot.endTime?.slice(0, 5)}
                onChange={(e) => updateLocalSlot(index, "endTime", e.target.value)}
              >
                {TIME_OPTIONS.map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            </div>

            <div className="flex gap-1">
              <button 
                type="button"
                onClick={() => handleSave(slot, index)}
                disabled={loadingId === index}
                className="p-2.5 text-green-500 bg-green-50 rounded-2xl hover:bg-green-100 transition-all shadow-sm"
              >
                {loadingId === index ? <Loader2 size={16} className="animate-spin" /> : <Save size={16} />}
              </button>
              <button 
                type="button"
                onClick={() => slot.id ? onDelete(slot.id) : onChange(value.filter((_, i) => i !== index))}
                className="p-2.5 text-red-300 hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all shadow-sm"
              >
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// هذا السطر هو الأهم لحل الخطأ الأبيض
export default WorkingHoursEditor;