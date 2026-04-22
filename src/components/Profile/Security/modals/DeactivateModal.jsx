import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ban, Loader2 } from 'lucide-react';

const DeactivateModal = ({ isOpen, onClose, onConfirm, loading, isInactive }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-6 shadow-2xl text-right"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                <Ban size={28} />
              </div>
              <h3 className="text-lg font-black text-gray-800">
  {isInactive ? "تفعيل الحساب" : "تعطيل الحساب مؤقتاً"}
</h3>
              <p className="mt-2 text-sm text-gray-500 leading-relaxed">
  {isInactive
    ? "هل أنت متأكد من إعادة تفعيل حسابك؟"
    : "هل أنت متأكد؟ يمكنك إعادة تفعيل حسابك في أي وقت."}
</p>
            </div>

            <div className="mt-6 flex gap-3">
              <button 
                onClick={onClose}
                disabled={loading}
                className="flex-1 rounded-xl bg-gray-100 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
              >
                تراجع
              </button>
              <button 
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 rounded-xl bg-[#001e3c] py-2.5 text-sm font-bold text-white transition hover:bg-[#002a54] flex items-center justify-center gap-2"
              >
                {loading ? (
  <Loader2 size={16} className="animate-spin" />
) : (
  isInactive ? "تأكيد التفعيل" : "تأكيد التعطيل"
)}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeactivateModal;