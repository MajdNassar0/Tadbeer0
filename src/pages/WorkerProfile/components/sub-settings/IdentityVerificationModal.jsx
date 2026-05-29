import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Upload, CheckCircle, AlertCircle, Loader2 } from "lucide-react";
// ✅ استيراد الـ apiClient المجهز والمربوط بالـ baseURL الصحيح والتوكن تلقائياً
import apiClient from "../../../../API/axiosConfig"; 

const IdentityVerificationModal = ({ isOpen, onClose, onUploadSuccess }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("idle"); // idle | success | error
  const [errorMessage, setErrorMessage] = useState("");

  if (!isOpen) return null;

  // التعامل مع اختيار ملف الصورة من الجهاز
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreviewUrl(URL.createObjectURL(file)); // لمعاينة الصورة فوراً في الـ UI
      setStatus("idle");
    }
  };

  // إرسال الصورة إلى السيرفر
  const handleUpload = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setStatus("idle");
    
    // بناء الـ FormData لإرسال الملف بصيغة multipart/form-data
    const formData = new FormData();
    // ✅ الحقل اسمه IdentityImage بالتطابق التام مع الـ Swagger الباكيند
    formData.append("IdentityImage", selectedFile); 

    try {
  await apiClient.post("/Worker/Profile/me/identity-picture", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  setStatus("success");

  // ✅ تشغيل دالة التحديث فوراً لتحديث الـ State في الصفحة الأبوية بدون ريفريش
  if (onUploadSuccess) {
    onUploadSuccess();
  }
  setTimeout(() => {
  onClose();
}, 2000);

    } catch (err) {
      console.error("خطأ أثناء رفع صورة الهوية:", err);
      setStatus("error");
      // عرض رسالة الخطأ القادمة من الباكيند إن وجدت أو رسالة افتراضية
      setErrorMessage(
        err.response?.data?.message || 
        err.message || 
        "فشل رفع الصورة، يرجى المحاولة لاحقاً."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* الخلفية المظلمة الشفافة */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* جسم الـ Modal */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 20 }}
          className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white p-6 shadow-2xl text-right font-sans"
          style={{ direction: "rtl" }}
        >
          {/* زر الإغلاق الفرعي */}
          <button
            onClick={onClose}
            className="absolute left-4 top-4 rounded-full p-1.5 text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition"
          >
            <X size={20} />
          </button>

          {/* العناوين المخصصة لتجربة المستخدم */}
          <h3 className="text-xl font-bold text-[#001e3c] mb-2">توثيق الهوية الشخصية</h3>
          <p className="text-sm text-gray-500 mb-6">
            يرجى رفع صورة واضحة للهوية الشخصية لتوثيق حسابك والحصول على شارة موثوق عند الزبائن.
          </p>

          {/* واجهة العرض بناءً على حالة الرفع */}
          {status === "success" ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="flex flex-col items-center justify-center py-8 text-center"
            >
              <div className="rounded-full bg-emerald-50 p-4 text-emerald-500 mb-4">
                <CheckCircle size={48} />
              </div>
              <h4 className="text-lg font-bold text-gray-800 mb-1">تم رفع الطلب بنجاح!</h4>
              <p className="text-sm text-gray-500 max-w-xs">
                صورة هويتك قيد المراجعة الآن من قبل الإدارة. سيتم تفعيل الشارة فور الموافقة عليها.
              </p>
            </motion.div>
          ) : (
            <div className="space-y-6">
              {/* منطقة رفع الهوية أو معاينتها */}
              <label className="relative flex flex-col items-center justify-center w-full h-56 border-2 border-dashed border-gray-300 rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100/70 transition overflow-hidden group">
                {previewUrl ? (
                  <img 
                    src={previewUrl} 
                    alt="معاينة الهوية" 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400 group-hover:text-gray-600 transition">
                    <Upload size={36} className="mb-3 stroke-[1.5]" />
                    <p className="mb-2 text-sm font-semibold">اضغط لرفع صورة الهوية</p>
                    <p className="text-xs text-gray-400">PNG, JPG (بحد أقصى 5MB)</p>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileChange}
                  disabled={loading}
                />
              </label>

              {/* إشعار الخطأ البرمجي في حال فشل الـ API */}
              {status === "error" && (
                <div className="flex items-center gap-2 rounded-xl bg-red-50 p-3.5 text-sm font-semibold text-red-600">
                  <AlertCircle size={18} className="shrink-0" />
                  <p>{errorMessage}</p>
                </div>
              )}

              {/* أزرار التحكم والرفع */}
              <div className="flex gap-3">
                <button
                  onClick={handleUpload}
                  disabled={!selectedFile || loading}
                  className="flex-1 flex items-center justify-center gap-2 rounded-2xl bg-[#001e3c] py-3.5 px-4 font-bold text-white transition hover:bg-[#002d5a] disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-900/10"
                >
                  {loading ? (
                    <>
                      <Loader2 size={18} className="animate-spin" />
                      جاري الرفع...
                    </>
                  ) : (
                    "إرسال للتدقيق"
                  )}
                </button>
                <button
                  onClick={onClose}
                  disabled={loading}
                  className="rounded-2xl border border-gray-200 bg-white py-3.5 px-6 font-bold text-gray-600 transition hover:bg-gray-50"
                >
                  إلغاء
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default IdentityVerificationModal;