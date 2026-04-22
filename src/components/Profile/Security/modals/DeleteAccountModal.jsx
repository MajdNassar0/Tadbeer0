import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

const DeleteAccountModal = ({ isOpen, onClose }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-110 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />
          
          {/* Modal Content */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.9 }}
            className="relative w-full max-w-sm overflow-hidden rounded-3xl bg-white p-6 shadow-2xl text-right"
          >
            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
                <AlertTriangle size={28} />
              </div>
              <h3 className="text-lg font-black text-gray-800">حذف الحساب نهائياً</h3>
              <p className="mt-2 text-sm text-gray-500">
                هل أنت متأكد؟ سيتم حذف كافة بياناتك ولا يمكن استعادتها مرة أخرى.
              </p>
            </div>

            <div className="mt-6 flex gap-3">
              <button 
                onClick={onClose}
                className="flex-1 rounded-xl bg-gray-100 py-2.5 text-sm font-bold text-gray-700 transition hover:bg-gray-200"
              >
                إلغاء
              </button>
              <button 
                className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white transition hover:bg-red-700"
              >
                تأكيد الحذف
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default DeleteAccountModal; // هاد السطر هو اللي كان ناقص ومسبب المشكلة