import React from "react";
import heroImg from "../../assets/img/hero.jpeg";

const Hero = () => {
  return (
    <section className="bg-[#f8f6f3] py-12 lg:py-20" dir="ltr">
      <div className="container mx-auto px-4 sm:px-6 lg:px-20 grid lg:grid-cols-5 items-center gap-10 lg:gap-16">

        {/* Image - LEFT */}
        <div className="flex justify-center items-center lg:col-span-2 hidden lg:flex">

          {/* Half Circle */}
          <div
            className="
              w-60 h-50 lg:w-80 lg:h-80
              bg-yellow-200/50
              rounded-full
              top-16
              -mr-40 lg:-mr-40
            "
          ></div>

          {/* Image */}
          <img
            src={heroImg}
            alt="Technician"
            className="w-[80%] h-[300px] sm:h-[400px] lg:h-[500px]
                       object-cover rounded-3xl shadow-xl"
          />

        </div>

        {/* Text - RIGHT */}
        <div className="space-y-6 text-right lg:col-span-3">

          <span className="inline-block bg-yellow-100 text-[#ffc258] px-4 py-1 rounded-full text-xs sm:text-sm font-medium">
            الخيار الأول للصيانة المنزلية في المنطقة
          </span>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-tight text-gray-800">
            حلول ذكية <br />
            <span className="text-[#ffc258]">
              لخدماتك المنزلية
            </span>
          </h1>

          <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
            نصل بك إلى أفضل الفنيين المحترفين لضمان راحتك وأمان منزلك،
            جودة، دقة، وموثوقية في كل خدمة نقدمها لك.
          </p>

          {/* Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 sm:gap-6 sm:justify-end">
            <button className="bg-white border border-gray-300 hover:bg-gray-100 text-gray-800 transition px-6 py-3 rounded-xl w-full sm:w-auto">
              اكتشف الخدمات
            </button>

            <button className="bg-yellow-500 hover:bg-[#E69500] transition text-white px-6 py-3 rounded-xl shadow-md w-full sm:w-auto">
              ابدأ الآن
            </button>
          </div>

          {/* Stats */}
          <div className="flex justify-between sm:justify-end sm:gap-12 pt-6 border-t border-gray-200 text-center sm:text-right">

            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">100%</h3>
              <p className="text-gray-500 text-xs sm:text-sm">ضمان الجودة</p>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">4.9/5</h3>
              <p className="text-gray-500 text-xs sm:text-sm">تقييم</p>
            </div>

            <div>
              <h3 className="text-lg sm:text-xl font-bold text-gray-800">+50k</h3>
              <p className="text-gray-500 text-xs sm:text-sm">عميل سعيد</p>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

export default Hero;