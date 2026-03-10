import React from "react";
import { Zap, CircleCheckBig, UserCheck } from "lucide-react";

function ServicesSection() {
  return (
    <>
      <section id="services" dir="rtl" className="pt-32 pb-16 bg-gray-50">
        <div className="container mx-auto px-6">
          {/* العنوان */}
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-[#0f2b46]">
              لماذا تختار منصة تدبير؟
            </h2>
            <div className="w-20 h-1 bg-[#cc9940] mx-auto mt-4 rounded-full"></div>
          </div>



          {/* الكروت */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" dir="ltr">

            {/* كرت 1 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition duration-300 text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-[#f5ecd9]">
                <Zap className="text-[#cc9940]" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-[#0f2b46]">
                استجابة سريعة
              </h3>
              <p className="text-gray-600 leading-relaxed">
                نصل إليك في أسرع وقت ممكن، خدماتنا متوفرة على مدار الساعة
                للحالات الطارئة
              </p>
            </div>

            {/* كرت 2 */}
            <div className="bg-white p-8 rounded-2xl shadow-md hover:shadow-xl transition duration-300 text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-[#f5ecd9]">
                    <CircleCheckBig className="text-[#cc9940]" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-[#0f2b46]">
                ضمان الخدمة
              </h3>
              <p className="text-gray-600 leading-relaxed">
               نحن لا نكتفي بإنهاء المهمة فقط، بل نضمن جودة العمل المقدم ونوفر لك متابعة دورية لراحة بالك
              </p>
            </div>

            {/* كرت 3 */}
            <div className="bg-white p-8 rounded-2xl shadow-sm hover:shadow-lg transition duration-300 text-center">
              <div className="w-16 h-16 mx-auto mb-6 flex items-center justify-center rounded-full bg-[#f5ecd9]">
                <UserCheck className="text-[#cc9940]" size={28} />
              </div>
              <h3 className="text-xl font-bold mb-4 text-[#0f2b46]">
                فنيون محترفون
              </h3>
              <p className="text-gray-600 leading-relaxed">
                نخبة من الخبراء المعتمدين والمفحوصين أمنيًا لضمان أعلى مستويات
                الأمان والجودة
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default ServicesSection;
