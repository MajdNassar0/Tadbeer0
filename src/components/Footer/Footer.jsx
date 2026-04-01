import React from "react";

import { Mail, Phone, Facebook, Instagram} from "lucide-react";

function Footer() {
  return (
    <>
      <footer
        dir="rtl"
        className="bg-[#101929] text-white pt-16 pb-8 px-6 md:px-16"
      >
        {/* Newsletter Section */}
        <div className="grid md:grid-cols-2 gap-10 items-center border-b border-white/10 pb-12">
          
          {/* Right Side Text */}
          <div>
            <h2 className="text-2xl md:text-3xl font-bold text-[#ffc258] mb-3">
              اشترك في نشرتنا الإخبارية
            </h2>
            <p className="text-gray-300">
              احصل على آخر التحديثات والخدمات والخصومات الحصرية مباشرة في بريدك
              الإلكتروني.
            </p>
          </div>

          {/* Left Side Input */}
          <div className="flex flex-col sm:flex-row gap-4">
            <input
              type="email"
              placeholder="البريد الإلكتروني"
              className="flex-1 bg-[#162c4d] border border-white/10 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-[#b8914e]"
            />

            <button className="bg-[#d19f48] hover:bg-[#E69500] text-black font-semibold px-6 py-3 rounded-lg transition-all duration-500">
              اشترك الآن
            </button>
          </div>
        </div>

        {/* Links Section */}
        <div className="grid md:grid-cols-4 sm:grid-cols-2  gap-10 py-12 border-b border-white/10" dir="ltr">
          
          {/* Company */}
          <div dir="rtl" >
            <h3 className="font-bold mb-4">الشركة</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="hover:text-[#cc9940] cursor-pointer transition duration-600">عن تدبير</li>
              <li className="hover:text-[#cc9940] cursor-pointer transition duration-600">الوظائف</li>
              <li className="">المدونة</li>
              <li className="hover:text-[#cc9940] cursor-pointer transition duration-600">شركاء النجاح</li>
            </ul>
          </div>

          {/* Services */}
          <div dir="rtl">
            <h3 className="font-bold mb-4">الخدمات</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="hover:text-[#cc9940] cursor-pointer transition duration-600">أعمال السباكة</li>
              <li className="hover:text-[#cc9940] cursor-pointer transition duration-600">الكهرباء</li>
              <li className="hover:text-[#cc9940] cursor-pointer transition duration-600">التنظيف العميق</li>
              <li className="hover:text-[#cc9940] cursor-pointer transition duration-600">صيانة التكييف</li>
            </ul>
          </div>

          {/* Support */}
          <div dir="rtl">
            <h3 className="font-bold mb-4">الدعم</h3>
            <ul className="space-y-2 text-gray-300">
              <li className="hover:text-[#cc9940] cursor-pointer transition duration-600">مركز المساعدة</li>
              <li className="hover:text-[#cc9940] cursor-pointer transition duration-600">الأسئلة الشائعة</li>
              <li className="hover:text-[#cc9940] cursor-pointer transition duration-600">اتصل بنا</li>
              <li className="hover:text-[#cc9940] cursor-pointer transition duration-600">سياسة الخصوصية</li>
            </ul>
          </div>

          {/* About Tadbeer */}
          
          <div dir="rtl">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 shrink-0">
                <img src="/src/assets/img/tadbeerLogo/logo.5.png" alt="Tadbeer logo" />
              </div>
              <h3 className="text-xl font-bold text-[#ffc258]">تدبير</h3>
            </div>


            <p className="text-gray-300 mb-6 leading-relaxed">
              تدبير هو شريكك المتكامل لجميع خدمات الصيانة المنزلية في فلسطين.
              نحن نجمع بين الجودة، السرعة، والأمان لضمان راحة بالك في كل زاوية
              من منزلك.
            </p>

            <div className="flex gap-4">
              {[Facebook, Mail, Phone , Instagram].map((Icon, i) => (
                <div
                  key={i}
                  className="bg-[#2B4366] p-3 rounded-full hover:bg-[#c99844] hover:text-black transition duration-800 cursor-pointer"
                >
                  <Icon size={18} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center gap-4 pt-6 text-gray-300 text-sm">
          
          <div>
            © 2026 تدبير – منصة خدمات الصيانة المنزلية في فلسطين. جميع الحقوق محفوظة.
          </div>

          <div className="flex gap-6">
            <span className="hover:text-[#FFA50A] cursor-pointer transition duration-300">
              الشروط والأحكام
            </span>
            <span className="hover:text-[#FFA50A] cursor-pointer transition duration-300">
              ملفات تعريف الارتباط
            </span>
          </div>

          <div>العربية (فلسطين)</div>

        </div>
      </footer>
    </>
  );
}

export default Footer;