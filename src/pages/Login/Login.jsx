import React from "react";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import { Toaster, toast } from "sonner";

const Login = () => {
  const navigate = useNavigate();

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

        if (response.data?.token) {
          localStorage.setItem("token", response.data.token);
          toast.success("تم تسجيل الدخول بنجاح! مرحباً بك");
          setTimeout(() => {
            navigate("/");
          }, 1500);
        }
      } catch (error) {
        const backend = error.response?.data;
        if (error.response?.status === 401) {
            setFieldError("email", "خطأ في البريد الإلكتروني أو كلمة المرور");
        } else {
            toast.error(backend?.message || "حدث خطأ أثناء تسجيل الدخول");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#f0f2f5] p-4 font-sans" dir="rtl">
      <Toaster position="top-center" richColors />

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[450px] bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100"
      >
        <div className="bg-[#001e3c] py-10 px-6 text-center relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full bg-blue-500/10 blur-3xl rounded-full translate-y-[-50%]"></div>
          <h1 className="text-white text-2xl font-bold mb-2 relative z-10">مرحباً بك مجدداً</h1>
          <p className="text-yellow-500 text-sm relative z-10">سجل دخولك لإدارة خدمات منزلك</p>
        </div>

        <div className="p-8">
          <form onSubmit={formik.handleSubmit} className="space-y-6">
            
            {/* Email Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-bold text-gray-700 mb-2 mr-1 text-right">
                البريد الإلكتروني
              </label>
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
                <p className="text-red-500 text-xs mt-1 mr-1 text-right">{formik.errors.email}</p>
              )}
            </motion.div>

            {/* Password Field */}
            <motion.div variants={itemVariants}>
              <label className="block text-sm font-bold text-gray-700 mb-2 mr-1 text-right">
                كلمة المرور
              </label>
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
                <p className="text-red-500 text-xs mt-1 mr-1 text-right">{formik.errors.password}</p>
              )}
            </motion.div>

            <div className="flex items-center justify-between text-xs px-1">
              <div className="flex items-center gap-2 cursor-pointer group">
                <input 
                  type="checkbox" 
                  name="remember"
                  onChange={formik.handleChange}
                  checked={formik.values.remember}
                  className="w-4 h-4 rounded border-gray-300 text-[#001e3c] focus:ring-blue-900 cursor-pointer accent-[#001e3c]" 
                />
                <span className="text-gray-600 select-none group-hover:text-[#001e3c]">تذكرني</span>
              </div>
              <Link 
                to="/auth/forgotpassword" 
                title="نسيت كلمة المرور" 
                className="text-yellow-600 font-bold hover:text-yellow-700 transition-colors"
              >
                نسيت كلمة المرور؟
              </Link>
            </div>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              type="submit"
              disabled={formik.isSubmitting}
              className="w-full bg-yellow-500 hover:bg-yellow-600 text-[#001e3c] py-4 rounded-xl font-bold shadow-lg shadow-yellow-200/50 flex items-center justify-center gap-2 disabled:opacity-50 transition-all"
            >
              {formik.isSubmitting ? "جاري الدخول..." : "تسجيل الدخول"}
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-8">
            ليس لديك حساب؟{" "}
            <Link to="/auth/signup" className="text-[#001e3c] font-bold hover:underline">
              إنشاء حساب جديد
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;