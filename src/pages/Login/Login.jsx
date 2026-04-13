import React from "react";
import { useAuth } from "../../context/AuthContext";
import { motion } from "framer-motion";
import { Mail, Lock, UserPlus } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import { Toaster, toast } from "sonner";
import { jwtDecode } from "jwt-decode";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();

  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: { duration: 0.6, staggerChildren: 0.1 } 
    }
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 15 },
    visible: { opacity: 1, y: 0 }
  };

  const formik = useFormik({
    initialValues: { email: "", password: "", remember: false },
    validate: (values) => {
      const errors = {};
      if (!values.email) errors.email = "البريد الإلكتروني مطلوب";
      else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(values.email)) 
        errors.email = "بريد إلكتروني غير صالح";
      if (!values.password) errors.password = "كلمة المرور مطلوبة";
      return errors;
    },

    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      try {
        const response = await axios.post(
          "https://tadbeer0.runasp.net/api/Identity/Auth/login",
          { email: values.email, password: values.password }
        );

        if (response.data.token) {
          const token = response.data.token;
          const decoded = jwtDecode(token);
          
          // سطر للفحص في الكونسول للتأكد من مسميات التوكن
          console.log("Decoded Token:", decoded);

          // استخراج البيانات مع ضمان جلب الـ ID بكل المسميات المحتملة لـ API تدبير
          const user = {
            id: decoded.uid || decoded.sub || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier"], 
            name: decoded.name || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] || "User",
            email: decoded.email || decoded["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress"] || values.email,
            role: decoded.role || decoded["http://schemas.microsoft.com/ws/2008/06/identity/claims/role"] || "User",
          };

          // تحديث الـ Context بالبيانات الجديدة
          login(user, token);

          toast.success("تم تسجيل الدخول بنجاح!");

          setTimeout(() => {
            const role = user.role?.trim().toLowerCase();
            if (role === "admin" || role === "superadmin") navigate("/admin");
            else if (role === "worker") navigate("/technical");
            else navigate("/");
          }, 1000);
        }

      } catch (error) {
        const status = error.response?.status;
        if (status === 401 || status === 400) {
          setFieldError("email", "خطأ في البريد أو كلمة المرور");
          toast.error("بيانات الدخول غير صحيحة");
        } else {
          toast.error("تعذر الاتصال بالخادم. يرجى المحاولة لاحقاً");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] p-4 font-sans" dir="rtl">
      <Toaster position="top-center" richColors expand={true} />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[450px] bg-white rounded-[24px] shadow-2xl overflow-hidden border border-gray-100"
      >
        <div className="bg-[#001e3c] py-10 px-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-blue-500/10 blur-3xl rounded-full translate-y-[-50%]"></div>
          <h1 className="text-white text-2xl font-bold mb-2 relative z-10 tracking-tight">مرحباً بك مجدداً</h1>
          <p className="text-yellow-500 text-sm relative z-10 font-medium">سجل دخولك لإدارة خدمات منزلك</p>
        </div>

        <div className="p-8 lg:p-10">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-bold text-gray-700 mb-2 mr-1 text-right">البريد الإلكتروني</label>
              <div className="relative">
                <input 
                  type="text"
                  {...formik.getFieldProps("email")}
                  placeholder="البريد الإلكتروني"
                  className={`w-full bg-[#f8f9fa] border-2 rounded-lg py-3 pr-11 pl-4 text-right transition-colors
                  ${formik.touched.email && formik.errors.email ? "border-red-500" : "border-transparent"}
                  focus:outline-none focus:border-blue-900`}
                />
                <Mail className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-[11px] mt-1.5 mr-1 text-right font-bold">{formik.errors.email}</p>
              )}
            </motion.div>

            <motion.div variants={itemVariants}>
              <label className="block text-sm font-bold text-gray-700 mb-2 mr-1 text-right">كلمة المرور</label>
              <div className="relative">
                <input 
                  type="password"
                  {...formik.getFieldProps("password")}
                  placeholder="كلمة المرور"
                  className={`w-full bg-[#f8f9fa] border-2 rounded-lg py-3 pr-11 pl-4 text-right transition-colors
                  ${formik.touched.password && formik.errors.password ? "border-red-500" : "border-transparent"}
                  focus:outline-none focus:border-blue-900`}
                />
                <Lock className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
              </div>
              {formik.touched.password && formik.errors.password && (
                <p className="text-red-500 text-[11px] mt-1.5 mr-1 text-right font-bold">{formik.errors.password}</p>
              )}
            </motion.div>

            <motion.button
              type="submit"
              disabled={formik.isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-yellow-500 hover:bg-yellow-400 py-4 rounded-xl font-black text-[#001e3c] shadow-xl transition-all disabled:opacity-70"
            >
              {formik.isSubmitting ? "جاري التحقق..." : "تسجيل الدخول"}
            </motion.button>

            <motion.div variants={itemVariants} className="text-center pt-6 border-t border-gray-100">
                <Link to="/auth/signup" className="flex items-center justify-center gap-2 mt-3 text-[#001e3c] font-black underline">
                  إنشاء حساب جديد في تدبير
                </Link>
            </motion.div>
          </form>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;