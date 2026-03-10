import React from "react";

function AboutSection() {
  return (
    <section id="about" dir="rtl" className="py-20  bg-gray-50">
      <div className="container mx-auto px-6">

        <div className="grid lg:grid-cols-2 rounded-3xl overflow-hidden shadow-lg">

          {/* الصورة */}
          <div className="h-[420px]">
            <img
              src="/img/Electrical Energy Company.jpg"
              alt="about tadbeer"
              className="w-full h-full object-cover"
            />
          </div>

          {/* النص */}
          <div className="bg-[#101929] text-white p-12 flex flex-col justify-center">

            <h2 className="text-3xl font-bold mb-6">
              رسالتنا في تدبير
            </h2>

            <p className="text-gray-200 leading-relaxed mb-10">
              نحن نؤمن بأن الصيانة المنزلية لا يجب أن تكون مصدرًا للقلق.
              مهمتنا هي تحويل تجربة الصيانة إلى تجربة سهلة وسلسة
              تجمع بين الكفاءة، الأمان، والتكنولوجيا الحديثة.
            </p>

            {/* الإحصائيات */}
            <div className="flex gap-16">

              <div>
                <h3 className="text-3xl font-bold text-[#c5a032]">
                  +10k
                </h3>
                <p className="text-sm text-gray-300">
                  عملية صيانة ناجحة
                </p>
              </div>

              <div>
                <h3 className="text-3xl font-bold text-[#c5a032]">
                  4.9/5
                </h3>
                <p className="text-sm text-gray-300">
                  تقييم العملاء
                </p>
              </div>

            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

export default AboutSection;