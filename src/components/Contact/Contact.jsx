import React from "react";
import { Mail, Phone,MapPinned} from "lucide-react";export default function ContactSection() {
  return (
    <section className="bg-gray-50 py-12 md:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* FORM SIDE */}
          <div className="order-1 lg:order-2">
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#ffc258]  mb-4 text-right">
              تواصل معنا
            </h2>
            <p className="text-gray-500 mb-8 text-sm sm:text-base text-right">
              لأي استفسار أو طلب مساعدة، فريقنا جاهز للرد عليك في أي وقت
            </p>

            <form className="space-y-5">
              
              {/* name + email */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 ">
                <input
                  type="text"
                  placeholder="الاسم الكامل"
                  className="w-full p-3 sm:p-4 border rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-800 text-right transition-all duration-300"
                />
                <input
                  type="email"
                  placeholder="البريد الإلكتروني"
                  className="w-full p-3 sm:p-4 border rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-900 text-right transition-all duration-300"
                />
              </div>

              <textarea
                rows="5"
                placeholder="الرسالة"
                className="w-full p-3 sm:p-4 border rounded-xl focus:outline-none focus:ring-1 focus:ring-blue-900 text-right transition-all duration-300"
              ></textarea>

              <button
                type="submit"
                className="w-full bg-yellow-500 text-white py-3 sm:py-4 rounded-xl hover:bg-[#E69500] transition duration-300"
              >
                ارسال الرسالة
              </button>

            </form>
          </div>

          {/* CONTACT INFO SIDE */}
          <div className="order-2 lg:order-1 space-y-8  mt-7">
                        <div className="flex items-start gap-4 justify-end ">

              <div>
                <h4 className="font-semibold text-right">اتصل بنا</h4>
                <p className="text-gray-500 text-sm sm:text-base">
                  966+ 800 123 4567
                </p>
              </div>
              <div className="flex items-start gap-4">
              <div className="bg-orange-100 p-3 rounded-xl shrink-0">
                  <Phone  className="text-[#cc9940]" size={28} /> 
           </div>
            </div>
            </div>

            <div className="flex items-start gap-4  justify-end">
              
              <div>
                <h4 className="font-semibold text-right">البريد الإلكتروني</h4>
                <p className="text-gray-500 text-sm sm:text-base">
                  info@tadbeer.sa
                </p>
              </div>
              <div className="flex items-start gap-4">
              <div className="bg-orange-100 p-3 rounded-xl shrink-0">
                <Mail className="text-[#cc9940]" size={28} />
              </div>
            </div>
            </div>
            

            <div className="flex items-start gap-4 justify-end">
              <div>
                <h4 className="font-semibold text-right">الموقع</h4>
                <p className="text-gray-500 text-sm sm:text-base">
                  شارع الملك فهد، حي الصحافة، الرياض، المملكة العربية السعودية
                </p>
              </div>
              <div className="bg-orange-100 p-3 rounded-xl shrink-0">
                     <MapPinned className="text-[#cc9940]" size={28}  />              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}