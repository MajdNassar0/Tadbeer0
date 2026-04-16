import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, KeyRound, CheckCircle2, Save, Mail, ArrowRight } from "lucide-react";
import axios from "axios";
import { Link, useLocation, useSearchParams, useNavigate } from "react-router-dom";

const API_BASE = "https://tadbeer0.runasp.net/api";

/** ترجمة رسائل السيرفر **/
const RESET_SERVER_MSG_AR = {
  "Password reset failed.": "فشلت إعادة التعيين. تحقق من الكود والإيميل، ومن أن كلمة المرور تطابق شروط النظام.",
  "Invalid or expired reset code.": "الكود غير صالح أو منتهي الصلاحية. اطلب كوداً جديداً.",
};

function translateResetServerMessage(msg) {
  if (typeof msg !== "string") return msg;
  const key = msg.trim();
  return RESET_SERVER_MSG_AR[key] || RESET_SERVER_MSG_AR[msg] || msg;
}

function parseResetPasswordError(error) {
  const data = error.response?.data;
  if (!data) return "حدث خطأ في الاتصال. حاول مرة أخرى";
  if (typeof data === "string") return translateResetServerMessage(data);
  if (data.message || data.Message) return translateResetServerMessage(data.message || data.Message);
  return "حدث خطأ. تأكد من البيانات وحاول مرة أخرى";
}

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    token: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [infoBanner, setInfoBanner] = useState("");
  const [showSuccessToast, setShowSuccessToast] = useState(false);

  useEffect(() => {
    const emailFromQuery = searchParams.get("email") || "";
    const tokenFromQuery = searchParams.get("token") || searchParams.get("code") || searchParams.get("otp") || "";
    const emailFromState = location.state?.email || "";
    const flashMessage = location.state?.flashMessage;
    
    if (flashMessage) setInfoBanner(flashMessage);

    setFormData((prev) => ({
      ...prev,
      email: emailFromState || emailFromQuery || prev.email,
      token: tokenFromQuery || prev.token,
    }));
  }, [searchParams, location.state]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
      setErrorMsg("كلمات المرور غير متطابقة");
      return;
    }

    setLoading(true);
    setErrorMsg("");

    try {
      const response = await axios.patch(
        `${API_BASE}/Identity/Auth/reset-password`,
        {
          email: formData.email.trim(),
          code: formData.token.trim(),
          newPassword: formData.newPassword,
          confirmNewPassword: formData.confirmPassword,
        },
        { headers: { "Content-Type": "application/json" } }
      );

      const isOk = response.status === 200 || response.data === "OK" || response.data?.isSuccess;

      if (isOk) {
        setInfoBanner("");
        setShowSuccessToast(true);
        
        // التوجيه لصفحة تسجيل الدخول بعد 2.5 ثانية
        // نرسل الإيميل والرسالة لصفحة اللوجن لتسهيل العملية على المستخدم
        setTimeout(() => {
          navigate("/auth/login", { 
            state: { 
              email: formData.email, 
              flashMessage: "تم تحديث كلمة المرور بنجاح، يرجى تسجيل الدخول ببياناتك الجديدة." 
            } 
          });
        }, 2500);
      }
    } catch (error) {
      setErrorMsg(parseResetPasswordError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f2f5] p-4 font-sans relative" dir="rtl">
      
      {/* التنبيه العلوي العائم */}
      <AnimatePresence>
        {showSuccessToast && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 30, opacity: 1 }}
            exit={{ y: -100, opacity: 0 }}
            className="fixed top-0 z-[999] bg-green-600 text-white px-8 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-green-400"
          >
            <div className="bg-white/20 p-1 rounded-full">
              <CheckCircle2 size={24} />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-lg">تم تغيير كلمة المرور بنجاح!</span>
              <span className="text-sm opacity-90">جاري توجيهك لصفحة تسجيل الدخول...</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="absolute top-8 right-8">
        <Link 
          to="/" 
          className="flex items-center gap-2 text-[#001e3c] font-bold text-sm hover:opacity-70 transition-opacity"
        >
          <ArrowRight size={20} className="text-yellow-600" />
          <span>العودة للرئيسية</span>
        </Link>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-[450px] bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        <div className="bg-[#001e3c] py-10 px-6 text-center text-white relative">
          <div className="flex justify-center mb-4">
            <div className="bg-white/10 p-4 rounded-full border border-white/20">
              <Lock size={32} className="text-white" />
            </div>
          </div>
          <h1 className="text-xl font-bold mb-2">إعادة تعيين كلمة المرور</h1>
          <p className="text-gray-300 text-xs leading-relaxed max-w-[280px] mx-auto">
            أدخل كود التحقق وكلمة المرور الجديدة لتحديث حسابك
          </p>
        </div>

        <div className="p-8">
          {infoBanner && (
            <div className="mb-5 p-3 bg-blue-50 border border-blue-100 rounded-lg text-[#001e3c] text-sm text-center font-medium">
              {infoBanner}
            </div>
          )}

          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="group">
              <label className="block text-xs font-bold text-gray-700 mb-2 mr-1">البريد الإلكتروني</label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#f8f9fa] border-2 border-transparent rounded-lg py-3 px-4 pr-12 text-right outline-none focus:border-blue-900 focus:bg-white transition-all duration-300"
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-gray-700 mb-2 mr-1">كود التحقق</label>
              <div className="relative">
                <input
                  name="token"
                  type="text"
                  required
                  value={formData.token}
                  onChange={handleChange}
                  className="w-full bg-[#f8f9fa] border-2 border-transparent rounded-lg py-3 px-4 pr-12 text-right outline-none focus:border-blue-900 focus:bg-white transition-all duration-300"
                />
                <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-gray-700 mb-2 mr-1">كلمة المرور الجديدة</label>
              <div className="relative">
                <input
                  name="newPassword"
                  type="password"
                  required
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full bg-[#f8f9fa] border-2 border-transparent rounded-lg py-3 px-4 pr-12 text-right outline-none focus:border-blue-900 focus:bg-white transition-all duration-300"
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <div className="group">
              <label className="block text-xs font-bold text-gray-700 mb-2 mr-1">تأكيد كلمة المرور</label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-[#f8f9fa] border-2 border-transparent rounded-lg py-3 px-4 pr-12 text-right outline-none focus:border-blue-900 focus:bg-white transition-all duration-300"
                />
                <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3.5 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg transition-all mt-4 disabled:bg-gray-400"
            >
              <Save size={18} />
              <span>{loading ? "جاري الحفظ..." : "حفظ كلمة المرور الجديدة"}</span>
            </motion.button>

            {errorMsg && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center font-medium">{errorMsg}</p>
              </motion.div>
            )}
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              تذكرت كلمة المرور؟{" "}
              <Link to="/auth/login" className="text-[#001e3c] font-bold hover:underline inline-block">تسجيل الدخول</Link>
            </p>
          </div>
        </div>
      </motion.div>

      <p className="mt-8 text-gray-400 text-xs italic">
        © 2026 تدبير. جميع الحقوق محفوظة.
      </p>
    </div>
  );
};

export default ResetPassword;