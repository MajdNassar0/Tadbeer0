import React from 'react';
import img1 from '../../assets/img/1.png';
import img2 from '../../assets/img/2.png';
import img3 from '../../assets/img/3.png';
import img4 from '../../assets/img/4.png';

const How = () => {
    return (
        <div>
           <section className=" py-20" dir="ltr">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center">

        {/* Images Grid */}
        <div className="grid grid-cols-2 gap-6  rounded-2xl ">
          <img
            src={img1}
            className="rounded-2xl object-cover h-64 w-full"
          />
           <img
            src={img4}
            className="rounded-2xl object-cover h-64 w-full "
          />

          <img
            src={img2}
            className="rounded-2xl object-cover h-80 w-full row-span-2"
          />

          <img
            src={img3}
            className="rounded-2xl object-cover h-64 w-full"
          />

         
        </div>

        {/* Text Content */}
        <div dir="rtl" className="space-y-8 m-2 sm:m-5">

          <h2 className="text-3xl text-gray-800 font-bold ">
            كيف يعمل تدبير؟
          </h2>

          <p className="text-gray-500">
            ثلاث خطوات بسيطة تفصلك عن منزل مريح وخالٍ من الأعطال.
          </p>

          {/* Step 1 */}
          <div className="flex items-start gap-4">
            <div className="bg-yellow-500 text-white w-8 h-8 flex items-center justify-center rounded-full">
              1
            </div>
            <div>
              <h3 className="font-semibold text-lg text-gray-900">وصف المشكلة</h3>
              <p className="text-gray-500">
                أخبرنا بنوع العطل أو أرسل المشكلة بكلمات بسيطة عبر تطبيقنا.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="flex items-start gap-4">
            <div className="bg-yellow-500 text-white w-8 h-8 flex items-center justify-center rounded-full">
              2
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">تحليل الذكاء الصناعي</h3>
              <p className="text-gray-500">
                نقوم بتحليل المشكلة واختيار الفني الأنسب والأقرب لموقعك آليًا.
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="flex items-start gap-4">
            <div className="bg-yellow-500 text-white w-8 h-8 flex items-center justify-center rounded-full">
              3
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">إتمام الإصلاح</h3>
              <p className="text-gray-500">
                احصل على خدمة احترافية مع ضمان شامل على قطع الغيار والعمل.
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
        </div>
    );
}

export default How;
