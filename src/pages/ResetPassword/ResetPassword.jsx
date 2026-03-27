import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Lock, KeyRound, CheckCircle2, Save, Mail } from "lucide-react";
import axios from "axios";
import { Link, useLocation, useSearchParams } from "react-router-dom";

const API_BASE = "https://tadbeer0.runasp.net/api";

/** ترجمة رسائل السيرفر الإنجليزية الشائعة — السبب الحقيقي غالباً: كود، إيميل، أو سياسة كلمة المرور */
const RESET_SERVER_MSG_AR = {
  "Password reset failed.": "فشلت إعادة التعيين. تحقق من الكود والإيميل، ومن أن كلمة المرور تطابق شروط النظام (الطول والأحرف).",
  "Invalid or expired reset code.": "الكود غير صالح أو منتهي الصلاحية. اطلب كوداً جديداً من «نسيت كلمة المرور».",
};

function translateResetServerMessage(msg) {
  if (typeof msg !== "string") return msg;
  const key = msg.trim();
  return RESET_SERVER_MSG_AR[key] || RESET_SERVER_MSG_AR[msg] || msg;
}

function parseResetPasswordError(error) {
  const data = error.response?.data;
  if (!data) {
    if (error.response?.status === 405)
      return "طريقة الطلب غير مدعومة. حدّث التطبيق أو تواصل مع الدعم.";
    return "حدث خطأ. تأكد من البريد والكود وحاول مرة أخرى";
  }
  if (typeof data === "string") return translateResetServerMessage(data);
  if (data.message) return translateResetServerMessage(data.message);
  if (data.Message) return translateResetServerMessage(data.Message);
  if (data.detail) return translateResetServerMessage(data.detail);
  if (data.title && data.detail) return `${data.title}: ${data.detail}`;
  if (data.title) return data.title;
  const errs = data.errors;
  if (errs && typeof errs === "object") {
    const first = Object.values(errs).flat()[0];
    if (first) return first;
  }
  return "حدث خطأ. تأكد من البريد والكود وحاول مرة أخرى";
}

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const location = useLocation();

  const [formData, setFormData] = useState({
    email: "",
    token: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [infoBanner, setInfoBanner] = useState("");

  useEffect(() => {
    const emailFromQuery = searchParams.get("email") || "";
    const tokenFromQuery =
      searchParams.get("token") || searchParams.get("code") || searchParams.get("otp") || "";
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
    setSuccessMsg("");
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
      const payload = response.data;
      if (typeof payload === "string") {
        const ok = payload.trim().toLowerCase() === "ok";
        if (!ok) {
          setErrorMsg(translateResetServerMessage(payload));
          return;
        }
        setInfoBanner("");
        setSuccessMsg("تم تغيير كلمة المرور بنجاح");
        return;
      }
      if (payload && typeof payload === "object") {
        const explicitFail =
          payload.isSuccess === false ||
          payload.success === false ||
          payload.Success === false;
        const rawMsg = (payload.message || payload.Message || "").trim();
        const knownFailureText =
          rawMsg && Object.prototype.hasOwnProperty.call(RESET_SERVER_MSG_AR, rawMsg);
        const noExplicitSuccess =
          payload.isSuccess !== true &&
          payload.success !== true &&
          payload.Success !== true;
        const failed =
          explicitFail || (knownFailureText && noExplicitSuccess);
        if (failed) {
          const raw =
            payload.message ||
            payload.Message ||
            payload.detail ||
            "Password reset failed.";
          setErrorMsg(translateResetServerMessage(raw));
          return;
        }
      }
      setInfoBanner("");
      setSuccessMsg(
        payload?.message ||
          payload?.Message ||
          "تم تغيير كلمة المرور بنجاح"
      );
    } catch (error) {
      setErrorMsg(parseResetPasswordError(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f2f5] p-4 font-sans" dir="rtl">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-[450px] bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header بنفس ستايل الكحلي */}
        <div className="bg-[#001e3c] py-10 px-6 text-center text-white relative">
          <div className="flex justify-center mb-4">
            <div className="bg-white/10 p-4 rounded-full border border-white/20">
              <Lock size={32} className="text-white" />
            </div>
          </div>

          <h1 className="text-xl font-bold mb-2">إعادة تعيين كلمة المرور</h1>
          <p className="text-gray-300 text-xs leading-relaxed max-w-[280px] mx-auto">
            يرجى إدخال الكود المرسل إليك وكلمة المرور الجديدة لتأمين حسابك
          </p>
        </div>

        {/* Form Content */}
        <div className="p-8">
          {infoBanner && (
            <motion.div
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-5 p-3 bg-blue-50 border border-blue-100 rounded-lg"
            >
              <p className="text-[#001e3c] text-sm text-center font-medium leading-relaxed">{infoBanner}</p>
            </motion.div>
          )}
          <form className="space-y-5" onSubmit={handleSubmit}>
            <div className="group">
              <label className="block text-xs font-bold text-gray-700 mb-2 mr-1">البريد الإلكتروني</label>
              <div className="relative">
                <input
                  name="email"
                  type="email"
                  required
                  placeholder="example@domain.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full bg-[#f8f9fa] border-2 border-transparent rounded-lg py-3 px-4 pr-12 text-right outline-none focus:border-blue-900 focus:bg-white focus:ring-4 focus:ring-blue-50/50 transition-all duration-300"
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            {/* Input: Token/OTP */}
            <div className="group">
              <label className="block text-xs font-bold text-gray-700 mb-2 mr-1">كود التحقق</label>
              <div className="relative">
                <input
                  name="token"
                  type="text"
                  required
                  placeholder="أدخل الكود المستلم"
                  value={formData.token}
                  onChange={handleChange}
                  className="w-full bg-[#f8f9fa] border-2 border-transparent rounded-lg py-3 px-4 pr-12 text-right outline-none focus:border-blue-900 focus:bg-white focus:ring-4 focus:ring-blue-50/50 transition-all duration-300"
                />
                <KeyRound className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            {/* Input: New Password */}
            <div className="group">
              <label className="block text-xs font-bold text-gray-700 mb-2 mr-1">كلمة المرور الجديدة</label>
              <div className="relative">
                <input
                  name="newPassword"
                  type="password"
                  required
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full bg-[#f8f9fa] border-2 border-transparent rounded-lg py-3 px-4 pr-12 text-right outline-none focus:border-blue-900 focus:bg-white focus:ring-4 focus:ring-blue-50/50 transition-all duration-300"
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            {/* Input: Confirm Password */}
            <div className="group">
              <label className="block text-xs font-bold text-gray-700 mb-2 mr-1">تأكيد كلمة المرور</label>
              <div className="relative">
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full bg-[#f8f9fa] border-2 border-transparent rounded-lg py-3 px-4 pr-12 text-right outline-none focus:border-blue-900 focus:bg-white focus:ring-4 focus:ring-blue-50/50 transition-all duration-300"
                />
                <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            {/* Submit Button بنفس لون الأزرار الأصفر */}
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-white py-3.5 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-yellow-100 transition-all mt-4"
            >
              <Save size={18} />
              <span>{loading ? "جاري الحفظ..." : "حفظ كلمة المرور الجديدة"}</span>
            </motion.button>

            {/* Messages */}
            {successMsg && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-green-50 border border-green-200 rounded-lg">
                <p className="text-green-600 text-sm text-center font-medium">{successMsg}</p>
              </motion.div>
            )}
            {errorMsg && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center font-medium">{errorMsg}</p>
              </motion.div>
            )}
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-gray-400">
              تذكرت كلمة المرور؟{" "}
              <Link
                to="/auth/login"
                className="text-[#001e3c] font-bold hover:underline inline-block"
              >
                تسجيل الدخول
              </Link>
            </p>
          </div>
        </div>
      </motion.div>

      <p className="mt-8 text-gray-400 text-xs">
        © 2026 تدبير. جميع الحقوق محفوظة.
      </p>
    </div>
  );
};

export default ResetPassword;