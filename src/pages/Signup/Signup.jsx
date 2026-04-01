import React from "react";
import { motion } from "framer-motion";
import { User, Mail, Phone, Lock, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useFormik } from "formik";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import { z } from "zod";
import { Toaster, toast } from "sonner";

const Signup = () => {
  const navigate = useNavigate();

  const signupSchema = z
    .object({
      name: z.string().min(3, "الاسم يجب أن يكون 3 حروف على الأقل"),
      email: z.string().min(1, "البريد الإلكتروني مطلوب").email("بريد إلكتروني غير صالح"),
      phone: z.string().min(1, "رقم الجوال مطلوب"),
      password: z.string().min(6, "كلمة المرور يجب أن تكون 6 رموز على الأقل"),
      confirmPassword: z.string().min(1, "يرجى تأكيد كلمة المرور"),
      agree: z.boolean().refine((val) => val === true, {
        message: "يجب الموافقة على الشروط",
      }),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: "كلمة المرور غير متطابقة",
      path: ["confirmPassword"],
    });

  const validate = (values) => {
    const result = signupSchema.safeParse(values);
    if (result.success) return {};
    const errors = {};
    result.error.issues.forEach((e) => (errors[e.path[0]] = e.message));
    return errors;
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, staggerChildren: 0.1 } },
  };
  const itemVariants = { hidden: { opacity: 0, x: -10 }, visible: { opacity: 1, x: 0 } };

  const formik = useFormik({
    initialValues: { name: "", email: "", phone: "", password: "", confirmPassword: "", agree: false },
    validate,
    validateOnChange: true,
    validateOnBlur: true,
    onSubmit: async (values, { setSubmitting, setFieldError }) => {
      const formattedPhone = values.phone.startsWith("+970") 
        ? values.phone 
        : "+970" + values.phone.replace(/^0/, "");
      
      const payload = { 
        fullName: values.name, 
        email: values.email, 
        password: values.password, 
        confirmPassword: values.confirmPassword, 
        phoneNumber: formattedPhone 
      };

      try {
        const response = await axios.post(
          "https://tadbeer0.runasp.net/api/Identity/Auth/register",
          payload
        );

        console.log(response.data);

        // ✅ Success (بس بدون دخول مباشر)
        if (response.data?.isSuccess) {

          toast.success("تم إنشاء الحساب! يرجى تأكيد بريدك الإلكتروني 📩");

          // ❗ ما نحفظ token ولا نروح home
          setTimeout(() => {
            navigate("/auth/login");
          }, 1500);
        }

      } catch (err) {
        const backendData = err.response?.data;
        const errorsList = backendData?.errors;

        if (Array.isArray(errorsList)) {
          errorsList.forEach((msg) => {
            if (msg.toLowerCase().includes("email")) {
              setFieldError("email", "هذا البريد مستخدم مسبقاً");
            } else {
              toast.error(msg);
            }
          });
        } else {
          toast.error(backendData?.message || "حدث خطأ أثناء التسجيل");
        }
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans" dir="rtl">
      <Toaster position="top-center" richColors />
      
      <motion.div initial="hidden" animate="visible" variants={containerVariants} className="w-full max-w-md bg-white rounded-2xl shadow-2xl overflow-hidden border border-gray-100">
        <div className="bg-[#101f49] p-8 text-center relative">
          <motion.h1 className="text-2xl font-bold text-white">ابدأ رحلتك معنا</motion.h1>
          <p className="text-blue-200 text-sm mt-2">
            انضم إلى <span className="text-yellow-500 font-semibold">تدبير</span>
          </p>
        </div>

        <div className="p-8">
          <form onSubmit={formik.handleSubmit} className="space-y-5">
            
            <motion.div variants={itemVariants} className="relative">
              <User className="absolute right-3 top-3.5 text-gray-400" size={20} />
              <input type="text" name="name" {...formik.getFieldProps("name")} placeholder="الاسم الكامل" className={`w-full border-2 rounded-xl py-3 pr-11 pl-4 bg-gray-50/50 outline-none transition-all ${formik.touched.name && formik.errors.name ? 'border-red-400' : 'border-gray-100 focus:border-blue-900 '} `} />
              {formik.touched.name && formik.errors.name && <p className="text-red-500 text-xs mt-1">{formik.errors.name}</p>}
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <Mail className="absolute right-3 top-3.5 text-gray-400" size={20} />
              <input type="email" name="email" {...formik.getFieldProps("email")} placeholder="البريد الإلكتروني" className={`w-full border-2 rounded-xl py-3 pr-11 pl-4 bg-gray-50/50 outline-none transition-all ${formik.touched.email && formik.errors.email ? 'border-red-400' : 'border-gray-100 focus:border-blue-900'}`} />
              {formik.touched.email && formik.errors.email && <p className="text-red-500 text-xs mt-1">{formik.errors.email}</p>}
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <Phone className="absolute right-3 top-3.5 text-gray-400" size={20} />
              <input type="tel" name="phone" {...formik.getFieldProps("phone")} placeholder="رقم الجوال" dir="rtl" className={`w-full border-2 rounded-xl py-3 pr-11 pl-4 bg-gray-50/50 outline-none transition-all ${formik.touched.phone && formik.errors.phone ? 'border-red-400' : 'border-gray-100 focus:border-blue-900'}`} />
              {formik.touched.phone && formik.errors.phone && <p className="text-red-500 text-xs mt-1">{formik.errors.phone}</p>}
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <Lock className="absolute right-3 top-3.5 text-gray-400" size={20} />
              <input type="password" name="password" {...formik.getFieldProps("password")} placeholder="كلمة المرور" className={`w-full border-2 rounded-xl py-3 pr-11 pl-4 bg-gray-50/50 outline-none transition-all ${formik.touched.password && formik.errors.password ? 'border-red-400' : 'border-gray-100 focus:border-blue-900'}`} />
              {formik.touched.password && formik.errors.password && <p className="text-red-500 text-xs mt-1">{formik.errors.password}</p>}
            </motion.div>

            <motion.div variants={itemVariants} className="relative">
              <ShieldCheck className="absolute right-3 top-3.5 text-gray-400" size={20} />
              <input type="password" name="confirmPassword" {...formik.getFieldProps("confirmPassword")} placeholder="تأكيد الكلمة" className={`w-full border-2 rounded-xl py-3 pr-11 pl-4 bg-gray-50/50 outline-none transition-all ${formik.touched.confirmPassword && formik.errors.confirmPassword ? 'border-red-400' : 'border-gray-100 focus:border-blue-900'}`} />
              {formik.touched.confirmPassword && formik.errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{formik.errors.confirmPassword}</p>}
            </motion.div>

            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <input type="checkbox" name="agree" id="agree" checked={formik.values.agree} onChange={formik.handleChange} className="accent-blue-900 h-4 w-4" />
                <label htmlFor="agree" className="text-sm text-gray-600">أوافق على الشروط وسياسة الخصوصية</label>
              </div>
              {formik.touched.agree && formik.errors.agree && <p className="text-red-500 text-xs">{formik.errors.agree}</p>}
            </div>

            <motion.button type="submit" disabled={formik.isSubmitting} className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 rounded-xl shadow-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed mt-2">
              {formik.isSubmitting ? "جاري التسجيل..." : "إنشاء الحساب"}
            </motion.button>
          </form>

          <p className="text-center text-sm text-gray-500 mt-6">
            لديك حساب بالفعل؟ <Link to="/auth/login" className="text-[#101f49] font-bold hover:underline">سجل دخولك الآن</Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;