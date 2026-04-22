import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, X, Loader2, CheckCircle, Eye, EyeOff } from "lucide-react";

const PasswordModal = ({ isOpen, onClose, toast }) => {
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();

    // فحص بسيط قبل الإرسال
    if (formData.newPassword !== formData.confirmPassword) {
      return toast("كلمات المرور غير متطابقة", "error");
    }

    setLoading(true);
    // محاكاة الاتصال بالـ API (هنا تربط مع الدالة الخاصة بك لاحقاً)
    setTimeout(() => {
      setLoading(false);
      toast("تم تحديث كلمة المرور بنجاح ✓");
      onClose();
    }, 1500);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 flex items-center justify-center p-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/60 backdrop-blur-sm"
          />

          {/* Modal Body */}
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
                <h3 className="text-xl font-black text-gray-800">
                  تغيير كلمة المرور
                </h3>
                <p className="text-s text-gray-400 font-medium">
                  تأكد من اختيار كلمة مرور قوية لحماية حسابك
                </p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4 text-right">
                <div>
                  <label className="text-xs font-bold text-gray-700 mb-1 block">
                    كلمة المرور الحالية
                  </label>
                  <div className="relative">
                    {" "}
                    {/* أضفنا div relative هنا */}
                    <input
                      type={showPassword ? "text" : "password"} // تعديل النوع
                      required
                      className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-2.5 pl-11 text-sm outline-none focus:border-orange-400 focus:bg-white transition-all"
                      value={formData.currentPassword}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          currentPassword: e.target.value,
                        })
                      }
                    />
                    {/* زر العين الجديد */}
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 text-right">
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1 block">
                      الجديدة
                    </label>
                    <div className="relative">
                      {" "}
                      {/* أضفنا div relative هنا */}
                      <input
                        type={showPassword ? "text" : "password"} // تعديل النوع
                        required
                        className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-2.5 pl-11 text-sm outline-none focus:border-orange-400 focus:bg-white transition-all"
                        value={formData.newPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            newPassword: e.target.value,
                          })
                        }
                      />
                      {/* زر العين الجديد */}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-gray-700 mb-1 block">
                      تأكيدها
                    </label>
                    <div className="relative">
                      {" "}
                      {/* أضفنا div relative هنا */}
                      <input
                        type={showPassword ? "text" : "password"} // تعديل النوع
                        required
                        className="w-full border border-gray-100 bg-gray-50 rounded-xl px-4 py-2.5 pl-11 text-sm outline-none focus:border-orange-400 focus:bg-white transition-all"
                        value={formData.confirmPassword}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            confirmPassword: e.target.value,
                          })
                        }
                      />
                      {/* زر العين الجديد */}
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-orange-500 transition-colors"
                      >
                        {showPassword ? (
                          <EyeOff size={18} />
                        ) : (
                          <Eye size={18} />
                        )}
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="w-full py-2.5 rounded-xl bg-gray-100 text-gray-700 text-sm font-bold hover:bg-gray-200 transition-all"
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-2.5 rounded-xl bg-[#001e3c] text-white text-sm font-bold hover:bg-[#002a54] transition-all flex items-center justify-center gap-2"
                  >
                    {loading ? (
                      <Loader2 size={16} className="animate-spin" />
                    ) : (
                      "حفظ التغييرات"
                    )}
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
