import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, Loader2, Eye, EyeOff } from "lucide-react";
import apiClient from "../../../../API/axiosConfig"; 

const PasswordModal = ({ isOpen, onClose, toast }) => {
  const [loading, setLoading] = useState(false);
  
  // تغيير الحالة لتشمل كل حقل بشكل مستقل
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false,
  });

  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmNewPassword: "",
  });

  // دالة مساعدة لتبديل الحالة
  const toggleVisibility = (field) => {
    setShowPasswords((prev) => ({ ...prev, [field]: !prev[field] }));
  };
  const handleSubmit = async (e) => {
  e.preventDefault();

  // تحقق يدوي من الحقول الفارغة
  if (!formData.currentPassword || !formData.newPassword || !formData.confirmNewPassword) {
    return toast("يرجى تعبئة جميع الحقول المطلوبة", "error");
  }

  if (formData.newPassword !== formData.confirmNewPassword) {
    return toast("كلمات المرور الجديدة غير متطابقة", "error");
  }
  
  // طول كلمة المرور (كما هو مطلوب في الـ API بالصورة: min 6)
  if (formData.newPassword.length < 6) {
    return toast("كلمة المرور الجديدة يجب أن لا تقل عن 6 أحرف", "error");
  }

  // إذا كل شيء تمام، ابدأ التحميل وأرسل للـ API
  setLoading(true);
   try {
      const response = await apiClient.patch("/Identity/Auth/change-password", formData);
      if (response.data.isSuccess) {
        toast("تم تحديث كلمة المرور بنجاح ✓", "success");
        setFormData({ currentPassword: "", newPassword: "", confirmNewPassword: "" });
        onClose();
      } else {
        toast(response.data.errors?.[0] || "حدث خطأ ما", "error");
      }
    } catch (error) {
      const errorMessage = error.response?.data?.errors?.[0] || "حدث خطأ أثناء الاتصال";
      toast(errorMessage, "error");
    } finally {
      setLoading(false);
    }
};



  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl"
          >
            <div className="p-8">
              <div className="flex flex-col items-center text-center mb-6">
                <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-3 text-[#001e3c]">
                  <Lock size={30} />
                </div>
                <h3 className="text-xl font-black text-gray-800">تغيير كلمة المرور</h3>
                <p className="text-sm text-gray-400 font-medium">كلمة المرور القوية تمنحك أماناً أكبر، يرجى اختيارها بعناية.</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-right" dir="rtl">
                
                {/* كلمة المرور الحالية */}
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">كلمة المرور الحالية</label>
                  <div className="relative">
                    <input
                      type={showPasswords.current ? "text" : "password"}
                      required
                      className="w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-2.5 pr-4 pl-11 text-sm outline-none focus:border-orange-400 focus:bg-white transition-all "
                      value={formData.currentPassword}
                      onChange={(e) => setFormData({ ...formData, currentPassword: e.target.value })}
                    />
                    <button
                      type="button"
                      onClick={() => toggleVisibility('current')}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500"
                    >
                      {showPasswords.current ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {/* الجديدة */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1 block">الجديدة</label>
                    <div className="relative">
                      <input
                        type={showPasswords.new ? "text" : "password"}
                        required
                        className="w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-2.5 pr-4 pl-11 text-sm outline-none focus:border-orange-400 focus:bg-white transition-all "
                        value={formData.newPassword}
                        onChange={(e) => setFormData({ ...formData, newPassword: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => toggleVisibility('new')}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500"
                      >
                        {showPasswords.new ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>

                  {/* تأكيدها */}
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1 block">تأكيدها</label>
                    <div className="relative">
                      <input
                        type={showPasswords.confirm ? "text" : "password"}
                        required
                        className="w-full border border-gray-300 bg-gray-50 rounded-xl px-4 py-2.5 pr-4 pl-11 text-sm outline-none focus:border-orange-400 focus:bg-white transition-all "
                        value={formData.confirmNewPassword}
                        onChange={(e) => setFormData({ ...formData, confirmNewPassword: e.target.value })}
                      />
                      <button
                        type="button"
                        onClick={() => toggleVisibility('confirm')}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500"
                      >
                        {showPasswords.confirm ? <EyeOff size={18} /> : <Eye size={18} />}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2.5 rounded-xl bg-gray-300 text-gray-700 text-sm font-bold hover:bg-gray-200 transition-all"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-[#001e3c] text-white text-sm font-bold hover:bg-[#002a54] transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? <Loader2 size={16} className="animate-spin" /> : "حفظ التغييرات"}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default PasswordModal;