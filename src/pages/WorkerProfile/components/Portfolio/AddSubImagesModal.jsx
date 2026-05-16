import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ImagePlus, Loader2 } from "lucide-react";
import apiClient from "../../../../API/axiosConfig";
import { useToast } from "../../../../context/ToastContext";
import ImageDropZone from "./ImageDropZone";

const AddSubImagesModal = ({ open, projectId, onClose, onAdded }) => {
  const toast = useToast();
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleClose = () => { setFiles([]); onClose(); };
  // داخل handleSubmit في AddSubImagesModal.jsx
const handleSubmit = async () => {
 if (!files.length) return toast("اختر صورة واحدة على الأقل", "error");
    console.log("Project ID being sent:", projectId);
    setLoading(true);
      const results = [];
  for (const file of files) {
    try {
      const fd = new FormData();
      fd.append("SubImage", file);
      const res = await apiClient.post(
        `/Worker/Profile/me/work-images/${projectId}/sub-images`,
        fd,
        { headers: { "Content-Type": "multipart/form-data" } }
      );
      
      // ✅ تأكد هنا: إذا كان السيرفر يعيد الصورة داخل res.data.data استخدمها
      // وإذا كان يعيدها مباشرة في res.data فكودك الحالي صحيح
      results.push(res.data?.data || res.data); 
    } catch {
      toast("فشل رفع إحدى الصور", "error");
    }finally {
    setLoading(false); 
  }
  }

  if (results.length) {
    // نرسل مصفوفة الصور الجديدة للأب
    onAdded(results); 
    handleClose();
  }
};



  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-9995 flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm px-4 pb-4 sm:pb-0"
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
              <h3 className="text-lg font-bold text-gray-900">إضافة صور للمشروع</h3>
              <button onClick={handleClose} className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200 transition">
                <X size={16} />
              </button>
            </div>

            <div className="space-y-4">
              <ImageDropZone
                file={files.length ? files : null}
                onChange={setFiles}
                label="اختر صور إضافية للمشروع"
                multiple
              />
              <button
                onClick={handleSubmit}
                disabled={loading}
                className="w-full py-3 rounded-2xl bg-orange-500 text-white font-bold text-sm hover:bg-orange-600 transition disabled:opacity-60 flex items-center justify-center gap-2 shadow-lg shadow-orange-200"
              >
                {loading
                  ? <><Loader2 size={16} className="animate-spin" /> جاري الرفع...</>
                  : <><ImagePlus size={16} /> رفع الصور</>}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AddSubImagesModal;