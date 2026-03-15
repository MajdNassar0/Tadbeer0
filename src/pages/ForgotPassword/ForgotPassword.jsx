import React from "react";
import { motion } from "framer-motion";
import { Mail, RotateCcw, Send } from "lucide-react";

const ForgotPassword = () => {
  // Animation Variants
  const containerVariants = {
    hidden: { opacity: 0, scale: 0.95 },
    visible: { 
      opacity: 1, 
      scale: 1,
      transition: { duration: 0.5 } 
    }
  };

  const transitionClasses = "transition-all duration-500 ease-in-out";

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#f0f2f5] p-4 font-sans" dir="rtl">
      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-[420px] bg-white rounded-2xl shadow-2xl overflow-hidden"
      >
        {/* Header Section */}
        <div className="bg-[#001e3c] py-10 px-6 text-center text-white relative">
          {/* Circular Reset Icon */}
          <div className="flex justify-center mb-4">
            <div className="bg-white/10 p-4 rounded-full border border-white/20">
              <RotateCcw size={32} className="text-white" />
            </div>
          </div>
          
          <h1 className="text-xl font-bold mb-2">استعادة كلمة المرور</h1>
          <p className="text-gray-300 text-xs leading-relaxed max-w-[280px] mx-auto">
            أدخل بريدك الإلكتروني أو رقم الهاتف لإرسال رابط استعادة كلمة المرور
          </p>
        </div>

        {/* Form Body */}
        <div className="p-8">
          <form className="space-y-6">
            
            {/* Input Field Group */}
            <div className="group">
              <label className={`block text-xs font-bold text-gray-700 mb-2 mr-1 group-focus-within:text-[#162c4d] ${transitionClasses}`}>
                البريد الإلكتروني أو رقم الهاتف
              </label>
              <div className="relative">
                <input 
                  type="text" 
                  placeholder="example@domain.com" 
                  className={`w-full bg-[#f8f9fa] border-2 border-transparent rounded-lg py-3 px-4 pr-12 text-right outline-none focus:border-blue-900 focus:bg-white focus:ring-4 focus:ring-blue-50/50 ${transitionClasses}`}
                />
                <Mail 
                  className={`absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-[#162c4d] ${transitionClasses}`} 
                  size={20} 
                />
              </div>
            </div>

            {/* Action Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full bg-yellow-500 hover:bg-yellow-500 text-white py-3.5 rounded-lg font-bold flex items-center justify-center gap-2 shadow-lg shadow-yellow-100 transition-all"
            >
              <Send size={18} className="rotate-180" />
              <span>إرسال رابط البدء</span>
            </motion.button>
          </form>

          {/* Help Link */}
          <div className="mt-10 text-center">
            <p className="text-sm text-gray-400">
              تواجه مشكلة؟ <span className="text-[#001e3c] font-bold cursor-pointer hover:underline">اتصل بالدعم الفني</span>
            </p>
          </div>
        </div>
      </motion.div>

      {/* Copyright Footer */}
      <p className="mt-8 text-gray-400 text-xs">
        © 2026 تدبير. جميع الحقوق محفوظة.
      </p>
    </div>
  );
};

export default ForgotPassword;