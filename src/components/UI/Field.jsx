import React from "react";
import { motion, AnimatePresence } from "framer-motion"; // تحتاج فريمر موشن للأنيميشن الخاص بالخطأ [cite: 2]

const Field = ({
  icon: Icon, label, name, value, onChange, error,
  placeholder = "", type = "text", as = "input", rows = 3,
  min, max, step,
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="flex items-center gap-1.5 text-xs font-semibold text-gray-500">
      {Icon && <Icon size={13} className="text-orange-400"/>}
      {label}
    </label>
    
    {as === "textarea" ? (
      <textarea 
        name={name} 
        value={value} 
        onChange={onChange}
        placeholder={placeholder} 
        rows={rows}
        className={`w-full resize-none rounded-xl border px-4 py-2.5 text-sm font-medium text-gray-800
          outline-none transition-all duration-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100
          ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white hover:border-gray-300"}`}
        dir="rtl"
      />
    ) : (
      <input 
        type={type} 
        name={name} 
        value={value} 
        onChange={onChange}
        placeholder={placeholder} 
        min={min} 
        max={max} 
        step={step}
        className={`w-full rounded-xl border px-4 py-2.5 text-sm font-medium text-gray-800
          outline-none transition-all duration-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100
          ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white hover:border-gray-300"}`}
        dir="rtl"
      />
    )}

    <AnimatePresence>
      {error && (
        <motion.p 
          initial={{ opacity: 0, y: -4 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0 }}
          className="text-xs text-red-500 font-medium"
        >
          {error}
        </motion.p>
      )}
    </AnimatePresence>
  </div>
);

export default Field;