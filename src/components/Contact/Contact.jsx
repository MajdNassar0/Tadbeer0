import React from "react";
import { Mail, Phone, MapPinned, Send } from "lucide-react";

export default function ContactSection() {
  return (
    <section className="bg-[#fcfaf7] py-20 lg:py-28" dir="rtl" id="ContactSection">
      <div className="container mx-auto px-6 lg:px-20">
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">

          {/* معلومات التواصل - LEFT (تظهر في اليمين بسبب RTL) */}
          <div 
            className="lg:col-span-5 space-y-10"
          >
            <div>
              <h2 className="text-3xl md:text-4xl font-black text-gray-900 mb-4">
                نحن هنا <span className="text-yellow-500">لمساعدتك</span>
              </h2>
              <p className="text-gray-600 leading-relaxed text-lg">
                سواء كان لديك استفسار بسيط أو مشروع صيانة ضخم، فريق تدبير جاهز لخدمتك على مدار الساعة.
              </p>
            </div>

            <div className="space-y-6">
              {[
                { 
                  icon: <Phone size={24} />, 
                  title: "اتصل بنا", 
                  content: " 800 123 4567 966+",
                  sub: "من الأحد للخميس، 9ص - 9م" 
                },
                { 
                  icon: <Mail size={24} />, 
                  title: "البريد الإلكتروني", 
                  content: "tadbeer@gmail.com",
                  sub: "نرد خلال أقل من 24 ساعة" 
                },
                { 
                  icon: <MapPinned size={24} />, 
                  title: "الموقع الرئيسي", 
                  content: "فلسطين",
                  sub: "متواجدون أيضاً في كافة مدن فلسطين" 
                }
              ].map((item, index) => (
                <div key={index} className="flex items-start gap-5 group">
                  <div className="bg-white p-4 rounded-2xl shadow-sm group-hover:bg-yellow-500 group-hover:text-white transition-all duration-300 text-yellow-600 border border-gray-100">
                    {item.icon}
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-bold text-gray-800 text-lg">{item.title}</h4>
                    <p className="text-gray-900 font-medium">{item.content}</p>
                    <p className="text-gray-400 text-sm">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* نموذج المراسلة - RIGHT */}
          <div 
            className="lg:col-span-7 bg-white p-8 md:p-12 rounded-[2.5rem] shadow-xl shadow-gray-200/50 border border-gray-50"
          >
            <form className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 mr-2">الاسم الكامل</label>
                  <input
                    type="text"
                    placeholder="أدخل اسمك هنا"
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-yellow-500/20 focus:bg-white transition-all outline-none"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-gray-700 mr-2">البريد الإلكتروني</label>
                  <input
                    type="email"
                    placeholder="example@mail.com"
                    className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-yellow-500/20 focus:bg-white transition-all outline-none"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-gray-700 mr-2">موضوع الرسالة</label>
                <textarea
                  rows="4"
                  placeholder="كيف يمكننا مساعدتك اليوم؟"
                  className="w-full p-4 bg-gray-50 border-none rounded-2xl focus:ring-2 focus:ring-yellow-500/20 focus:bg-white transition-all outline-none"
                ></textarea>
              </div>

              <button
                type="submit"
                className="w-full bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-4 rounded-2xl shadow-lg shadow-yellow-200 transition-all flex items-center justify-center gap-2 group"
              >
                <span>إرسال الرسالة</span>
                <Send size={18} className="group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

        </div>
      </div>
    </section>
  );
}