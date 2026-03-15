import React from "react";
import { motion } from "framer-motion";
import heroImg from "../../assets/img/hero.jpeg";

const Hero = () => {
  return (
    <section
      className="relative overflow-hidden bg-[#f8f6f3] py-16 lg:py-24"
      dir="rtl"
    >
      {/* عناصر ديكورية خلفية */}
      <div className="absolute top-0 left-0 w-64 h-64 bg-yellow-200/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />

      <div className="container mx-auto px-6 lg:px-20 relative z-10">
        <div className="grid lg:grid-cols-12 gap-12 items-center">
          {/* محتوى النص - RIGHT */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 space-y-8 text-right order-2 lg:order-1"
          >
            <div className="space-y-4">
              <span className="inline-flex items-center gap-2 bg-yellow-100 text-yellow-700 px-4 py-1.5 rounded-full text-sm font-semibold tracking-wide">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-yellow-500"></span>
                </span>
                الخيار الأول للصيانة المنزلية في المنطقة
              </span>

              <h1 className="text-4xl md:text-6xl xl:text-7xl font-black text-gray-900 leading-[1.15]">
                حلول ذكية <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-l from-yellow-500 to-yellow-600">
                  لخدماتك المنزلية
                </span>
              </h1>

              <p className="text-gray-600 text-lg md:text-xl leading-relaxed max-w-2xl ml-auto">
                نصل بك إلى أفضل الفنيين المحترفين لضمان راحتك وأمان منزلك. جودة
                متناهية، دقة في المواعيد، وموثوقية نعتز بها.
              </p>
            </div>

            {/* الأزرار */}
            <div className="flex flex-wrap gap-4 justify-start">
              <button className="group relative bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-4 rounded-2xl shadow-lg shadow-yellow-200 transition-all duration-300 transform hover:-translate-y-1 active:scale-95 font-bold text-lg">
                ابدأ الآن
              </button>
              <button className="bg-white border-2 border-gray-100 hover:border-yellow-500 hover:text-yellow-600 text-gray-700 px-8 py-4 rounded-2xl transition-all duration-300 font-bold text-lg">
                اكتشف الخدمات
              </button>
            </div>

            {/* الإحصائيات */}
            <div className="grid grid-cols-3 gap-8 pt-10 border-t border-gray-200/60">
              {[
                { label: "ضمان الجودة", value: "100%" },
                { label: "تقييم العملاء", value: "4.9/5" },
                { label: "عميل سعيد", value: "+50k" },
              ].map((stat, index) => (
                <div key={index} className="group">
                  <h3 className="text-2xl md:text-3xl font-black text-gray-800 group-hover:text-yellow-500 transition-colors">
                    {stat.value}
                  </h3>
                  <p className="text-gray-500 text-sm md:text-base font-medium">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* الصورة - LEFT */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="lg:col-span-5 relative order-1 lg:order-2 hidden lg:block w-full"
          >
            {/* حاوية نسبية للصورة تضمن بقاء العرض ثابت */}
            <div className="relative w-full h-full flex items-center">
              {/* الخلفية المزخرفة للصورة */}
              <div className="absolute -bottom-6 -right-6 w-full h-full border-2 border-yellow-400 rounded-[2.5rem] -z-10" />

              <div className="relative w-full overflow-hidden rounded-[2.5rem] shadow-2xl transform hover:rotate-1 transition-transform duration-500">
                <img
                  src={heroImg}
                  alt="Professional Technician"
                  className="w-full h-[400px] lg:h-[550px] object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>

              {/* البطاقة العائمة */}
              <div className="absolute -bottom-4 -left-4 bg-white p-4 rounded-2xl shadow-xl hidden xl:flex items-center gap-4 animate-bounce-slow z-20">
                <div className="bg-green-100 p-2 rounded-full">
                  <svg
                    className="w-6 h-6 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
                <div className="whitespace-nowrap">
                  <p className="text-xs text-gray-500">فنيون معتمدون</p>
                  <p className="font-bold text-gray-800">جاهزون للخدمة</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
