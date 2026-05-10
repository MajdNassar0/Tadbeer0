import { motion } from "framer-motion";
import { Briefcase, Plus } from "lucide-react";

const EmptyState = ({ onAdd }) => (
  <motion.div
    className="flex flex-col items-center justify-center py-20 px-6 text-center"
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5 }}
  >
    <div className="relative mb-6">
      <div className="w-24 h-24 rounded-3xl bg-orange-50 flex items-center justify-center">
        <Briefcase size={40} className="text-orange-300" />
      </div>
      <div className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-orange-500 flex items-center justify-center shadow-lg">
        <Plus size={16} className="text-white" />
      </div>
    </div>
    <h3 className="text-xl font-black text-gray-900 mb-2">معرض أعمالك فارغ</h3>
    <p className="text-sm text-gray-400 max-w-xs mb-6 leading-relaxed">
      أضف مشاريعك المنجزة وصور أعمالك لتبرز أمام العملاء وتزيد فرص عملك
    </p>
    <button
      onClick={onAdd}
      className="flex items-center gap-2 px-6 py-3 rounded-2xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 active:scale-95 transition-all shadow-xl shadow-orange-200"
    >
      <Plus size={18} />
      أنشئ أول مشروع
    </button>
  </motion.div>
);

export default EmptyState;