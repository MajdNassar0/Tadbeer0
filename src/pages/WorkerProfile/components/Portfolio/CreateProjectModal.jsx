import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Plus, Loader2 } from "lucide-react";
import apiClient from "../../../../API/axiosConfig";
import { useToast } from "../../../../context/ToastContext";
import ImageDropZone from "./ImageDropZone";

const CreateProjectModal = ({ open, onClose, onCreated }) => {
  const toast = useToast();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);

  const reset = () => { setFile(null); setTitle(""); setDescription(""); };
  const handleClose = () => { reset(); onClose(); };

  const handleSubmit = async () => {
    if (!file) return toast("الرجاء اختيار صورة غلاف", "error");
    setLoading(true);
    try {
      const fd = new FormData();
      fd.append("MainImage", file);
      if (title) fd.append("Title", title);
      if (description) fd.append("Description", description);

      const res = await apiClient.post("/Worker/Profile/me/work-images", fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast("تم إنشاء المشروع بنجاح ✓");
      onCreated(res.data);
      handleClose();
    } catch {
      toast("فشل إنشاء المشروع", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-[9995] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-4 sm:pb-0"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
        >
          <motion.div
            className="bg-white rounded-3xl p-6 w-full max-w-md shadow-2xl"
            initial={{ y: 60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 60, opacity: 0 }}
            transition={{ type: "spring", stiffness: 400, damping: 35 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-bold text-gray-900">مشروع جديد</h3>
              <button onClick={handleClose} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <ImageDropZone file={file} onChange={setFile} label="صورة الغلاف الرئيسية" />

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">عنوان المشروع</label>
                <input
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="مثال: تركيب سباكة شقة دور ثالث"
                  className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition"
                />
              </div>

              <div>
                <label className="text-xs font-semibold text-gray-500 mb-1.5 block">وصف (اختياري)</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={3}
                  placeholder="صف العمل المنجز..."
                  className="w-full px-4 py-2.5 rounded-2xl border border-gray-200 text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-orange-200 focus:border-orange-400 transition resize-none"
                />
              </div>

              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
              >
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> جاري الرفع...</>
                  : <><Plus size={16} /> إنشاء المشروع</>}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CreateProjectModal;