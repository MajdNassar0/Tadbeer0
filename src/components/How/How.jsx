import React from 'react';
import { motion } from 'framer-motion';
import img1 from '../../assets/img/1.webp';
import img2 from '../../assets/img/2.png';
import img3 from '../../assets/img/3.jpeg';
import img4 from '../../assets/img/4.jpg';

const How = () => {
  // Container variant to stagger the children (images)
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Each image waits 0.2s after the previous one
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { duration: 0.6, ease: "easeOut" } 
    },
  };

  return (
    <section className="py-20 overflow-hidden" dir="ltr">
      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-10 items-center px-4">
        
        {/* Images Grid - Animates when it comes into view */}
        <motion.div 
          className="grid grid-cols-2 gap-6 rounded-2xl"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }} // Triggers when 30% of the grid is visible
        >
          <motion.img src={img1} variants={itemVariants} className="rounded-2xl object-cover h-64 w-full shadow-md" />
          <motion.img src={img4} variants={itemVariants} className="rounded-2xl object-cover h-64 w-full shadow-md" />
          <motion.img src={img2} variants={itemVariants} className="rounded-2xl object-cover h-80 w-full row-span-2 shadow-md" />
          <motion.img src={img3} variants={itemVariants} className="rounded-2xl object-cover h-64 w-full shadow-md" />
        </motion.div>

        {/* Text Content - Slides in from the right when in view */}
        <div 
          dir="rtl" 
          className="space-y-8 m-2 sm:m-5"
          
        >
          <h2 className="text-4xl text-gray-800 font-bold">كيف يعمل تدبير؟</h2>
          <p className="text-gray-500 text-lg">ثلاث خطوات بسيطة تفصلك عن منزل مريح وخالٍ من الأعطال.</p>

          <div className="space-y-6">
            {steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4">
                <div className="bg-yellow-500 text-white min-w-[32px] h-8 flex items-center justify-center rounded-full font-bold">
                  {index + 1}
                </div>
                <div>
                  <h3 className="font-semibold text-lg text-gray-900">{step.title}</h3>
                  <p className="text-gray-500">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
};

const steps = [
  { title: "وصف المشكلة", desc: "أخبرنا بنوع العطل أو أرسل المشكلة بكلمات بسيطة عبر تطبيقنا." },
  { title: "تحليل الذكاء الصناعي", desc: "نقوم بتحليل المشكلة واختيار الفني الأنسب والأقرب لموقعك آليًا." },
  { title: "إتمام الإصلاح", desc: "احصل على خدمة احترافية مع ضمان شامل على قطع الغيار والعمل." },
];

export default How;