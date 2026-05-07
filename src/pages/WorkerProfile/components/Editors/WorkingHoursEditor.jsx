import React from "react";
import { motion } from "framer-motion";
import { Clock, Plus, Minus } from "lucide-react";

const DAYS = [
  { key: "Saturday",  label: "السبت"    },
  { key: "Sunday",    label: "الأحد"    },
  { key: "Monday",    label: "الاثنين"  },
  { key: "Tuesday",   label: "الثلاثاء" },
  { key: "Wednesday", label: "الأربعاء" },
  { key: "Thursday",  label: "الخميس"  },
  { key: "Friday",    label: "الجمعة"  },
];

const WorkingHoursEditor = ({ value = [], onChange }) => {
  const addRow = () => {
    onChange([...value, { dayOfWeek: "Saturday", startTime: "08:00", endTime: "17:00" }]);
  };

  const removeRow = (i) => {
    onChange(value.filter((_, idx) => idx !== i));
  };

  const updateRow = (i, field, val) => {
    const next = value.map((r, idx) => (idx === i ? { ...r, [field]: val } : r));
    onChange(next);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
          <Clock size={13} className="text-orange-400" />
          ساعات العمل
        </label>
        <button
          type="button"
          onClick={addRow}
          className="flex items-center gap-1 rounded-lg bg-orange-50 border border-orange-200 px-2.5 py-1 text-xs font-bold text-orange-500 hover:bg-orange-100 transition"
        >
          <Plus size={12} />
          إضافة يوم
        </button>
      </div>

      {value.length === 0 && (
        <p className="text-xs text-gray-400 italic text-center py-3 border border-dashed border-gray-200 rounded-xl">
          لم تُضف أي ساعات عمل بعد
        </p>
      )}

      {value.map((row, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, x: 8 }}
          animate={{ opacity: 1, x: 0 }}
          className="grid grid-cols-[1fr_1fr_1fr_auto] gap-2 items-center rounded-xl border border-gray-100 bg-gray-50 px-3 py-2.5"
        >
          <select
            value={row.dayOfWeek}
            onChange={(e) => updateRow(i, "dayOfWeek", e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-semibold text-gray-700 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
          >
            {DAYS.map((d) => (
              <option key={d.key} value={d.key}>
                {d.label}
              </option>
            ))}
          </select>

          <input
            type="time"
            value={row.startTime}
            onChange={(e) => updateRow(i, "startTime", e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-semibold text-gray-700 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
          />

          <input
            type="time"
            value={row.endTime}
            onChange={(e) => updateRow(i, "endTime", e.target.value)}
            className="rounded-lg border border-gray-200 bg-white px-2 py-1.5 text-xs font-semibold text-gray-700 outline-none focus:border-orange-400 focus:ring-1 focus:ring-orange-100"
          />

          <button
            type="button"
            onClick={() => removeRow(i)}
            className="flex h-7 w-7 items-center justify-center rounded-lg text-red-400 hover:bg-red-50 transition"
          >
            <Minus size={14} />
          </button>
        </motion.div>
      ))}
    </div>
  );
};

export default WorkingHoursEditor;