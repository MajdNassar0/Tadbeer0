import { motion, AnimatePresence } from "framer-motion";
import { Trash2, Loader2 } from "lucide-react";

const ConfirmDialog = ({ open, message, onConfirm, onCancel, loading }) => (
  <AnimatePresence>
    {open && (
      <motion.div
        className="fixed inset-0 z-9998 flex items-center justify-center bg-black/40 backdrop-blur-sm px-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl"
          initial={{ scale: 0.85, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.85, opacity: 0 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-2xl bg-red-50 flex items-center justify-center">
              <Trash2 size={18} className="text-red-500" />
            </div>
            <p className="font-semibold text-gray-800 text-sm">{message}</p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={onCancel}
              className="flex-1 py-2.5 rounded-2xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition"
            >
              إلغاء
            </button>
            <button
              onClick={onConfirm}
              disabled={loading}
              className="flex-1 py-2.5 rounded-2xl bg-red-500 text-white text-sm font-semibold hover:bg-red-600 transition disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {loading && <Loader2 size={14} className="animate-spin" />}
              حذف
            </button>
          </div>
        </motion.div>
      </motion.div>
    )}
  </AnimatePresence>
);

export default ConfirmDialog;