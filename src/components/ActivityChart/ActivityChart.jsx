import React from 'react';
import { motion } from 'framer-motion';

const ActivityChart = ({ data }) => {
  // دالة لتحديد اللون بناءً على القيمة القادمة من الباك إيند
  const getColor = (count) => {
    if (!count || count === 0) return "bg-gray-100";
    if (count < 3) return "bg-orange-200";
    if (count < 6) return "bg-orange-400";
    return "bg-orange-600";
  };

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm mt-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-bold text-gray-700">نشاط المنصة</h3>
        <div className="flex gap-2">
           <span className="text-[10px] text-gray-400">أقل</span>
           <div className="flex gap-1 items-center">
              <div className="w-2 h-2 bg-gray-100 rounded-sm"></div>
              <div className="w-2 h-2 bg-orange-200 rounded-sm"></div>
              <div className="w-2 h-2 bg-orange-400 rounded-sm"></div>
              <div className="w-2 h-2 bg-orange-600 rounded-sm"></div>
           </div>
           <span className="text-[10px] text-gray-400">أكثر</span>
        </div>
      </div>

      <div className="grid grid-flow-col grid-rows-7 gap-1 overflow-x-auto pb-2 custom-scrollbar">
        {/* هنا يتم عمل Map للبيانات */}
        {data?.map((day, index) => (
          <motion.div
            key={index}
            whileHover={{ scale: 1.2 }}
            className={`w-3 h-3 rounded-sm ${getColor(day.count)} cursor-pointer`}
            title={`${day.date}: ${day.count} نشاط`}
          />
        ))}
      </div>
    </div>
  );
};

export default ActivityChart;