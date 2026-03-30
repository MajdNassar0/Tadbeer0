// src/data/servicesDetailsData.js

const servicesDetailsData = {
  appliances: {
    title: "الأجهزة المنزلية",
    services: [
      { id: 1, title: "تصليح الغسالات", desc: "إصلاح جميع أنواع الغسالات", icon: "wrench" },
      { id: 2, title: "تصليح الثلاجات", desc: "صيانة أعطال التبريد", icon: "snowflake" },
      { id: 3, title: "تصليح الأفران", desc: "إصلاح الأفران الكهربائية والغاز", icon: "flame" },
    ],
  },

  cleaning: {
    title: "خدمات التنظيف",
    services: [
      { id: 1, title: "تنظيف المنازل", desc: "تنظيف شامل وعميق", icon: "sparkles" },
      { id: 2, title: "تنظيف السجاد", desc: "إزالة البقع والأوساخ", icon: "layers" },
      { id: 3, title: "تعقيم المنازل", desc: "استخدام مواد آمنة", icon: "shield" },
    ],
  },

  electricity: {
    title: "أعمال الكهرباء",
    services: [
      { id: 1, title: "إصلاح الأعطال", desc: "صيانة الأعطال الكهربائية", icon: "zap" },
      { id: 2, title: "تركيب الإضاءة", desc: "تركيب إنارة داخلية وخارجية", icon: "lightbulb" },
      { id: 3, title: "تمديد الأسلاك", desc: "تمديد شبكات كهربائية", icon: "cable" },
      { id: 4, title: "صيانة اللوحات", desc: "فحص لوحات الكهرباء", icon: "grid" },
    ],
  },

  plumbing: {
    title: "السباكة",
    services: [
      { id: 1, title: "إصلاح التسريبات", desc: "كشف وإصلاح التسربات", icon: "droplet" },
      { id: 2, title: "تركيب الأدوات الصحية", desc: "تركيب مغاسل ومراحيض", icon: "tool" },
      { id: 3, title: "تنظيف المجاري", desc: "إزالة الانسدادات", icon: "wind" },
    ],
  },

  gardening: {
    title: "تنسيق الحدائق",
    services: [
      { id: 1, title: "تصميم الحدائق", desc: "تصميم مساحات خضراء", icon: "leaf" },
      { id: 2, title: "قص الأشجار", desc: "تشذيب الأشجار والنباتات", icon: "scissors" },
      { id: 3, title: "الري", desc: "أنظمة ري حديثة", icon: "droplets" },
    ],
  },

  carpentry: {
    title: "أعمال النجارة",
    services: [
      { id: 1, title: "تصليح الأثاث", desc: "إصلاح الأثاث الخشبي", icon: "hammer" },
      { id: 2, title: "تفصيل أثاث", desc: "تصميم حسب الطلب", icon: "ruler" },
    ],
  },

  pest_control: {
    title: "مكافحة الحشرات",
    services: [
      { id: 1, title: "رش المبيدات", desc: "مواد آمنة وفعالة", icon: "bug" },
      { id: 2, title: "مكافحة القوارض", desc: "حلول فعالة للقوارض", icon: "shield" },
    ],
  },

  painting: {
    title: "دهانات وتشطيبات",
    services: [
      { id: 1, title: "دهانات داخلية", desc: "تشطيبات عصرية", icon: "paintbrush" },
      { id: 2, title: "دهانات خارجية", desc: "مقاومة للعوامل الجوية", icon: "home" },
    ],
  },

  cameras: {
    title: "كاميرات المراقبة",
    services: [
      { id: 1, title: "تركيب الكاميرات", desc: "أنظمة مراقبة حديثة", icon: "camera" },
      { id: 2, title: "برمجة الأنظمة", desc: "ضبط وربط الأجهزة", icon: "settings" },
    ],
  },

  water_tanks: {
    title: "خزانات المياه",
    services: [
      { id: 1, title: "تنظيف الخزانات", desc: "تنظيف وتعقيم", icon: "droplet" },
      { id: 2, title: "عزل الخزانات", desc: "منع التسرب والتلوث", icon: "shield" },
    ],
  },

  aluminum: {
    title: "أعمال الألمنيوم",
    services: [
      { id: 1, title: "تركيب النوافذ", desc: "نوافذ حديثة", icon: "square" },
      { id: 2, title: "تصليح الأبواب", desc: "صيانة الأبواب", icon: "door-open" },
    ],
  },

  flooring: {
    title: "أرضيات وحوائط",
    services: [
      { id: 1, title: "تركيب السيراميك", desc: "تشطيب احترافي", icon: "grid" },
      { id: 2, title: "تركيب الباركيه", desc: "أرضيات خشبية", icon: "layers" },
    ],
  },

  blacksmith: {
    title: "أعمال الحدادة",
    services: [
      { id: 1, title: "تصنيع الحديد", desc: "أعمال حديد حسب الطلب", icon: "hammer" },
      { id: 2, title: "تركيب الأبواب", desc: "أبواب حديد قوية", icon: "shield" },
    ],
  },

  gates: {
    title: "البوابات الكهربائية",
    services: [
      { id: 1, title: "تركيب البوابات", desc: "بوابات أوتوماتيكية", icon: "cpu" },
      { id: 2, title: "صيانة الأنظمة", desc: "إصلاح الأعطال", icon: "settings" },
    ],
  },

  solar: {
    title: "الطاقة الشمسية",
    services: [
      { id: 1, title: "تركيب الألواح", desc: "أنظمة طاقة شمسية", icon: "sun" },
      { id: 2, title: "صيانة الأنظمة", desc: "تحسين الكفاءة", icon: "battery" },
    ],
  },

  elevators: {
    title: "المصاعد",
    services: [
      { id: 1, title: "تركيب المصاعد", desc: "مصاعد منزلية وتجارية", icon: "arrow-up" },
      { id: 2, title: "الصيانة", desc: "فحص دوري", icon: "tool" },
    ],
  },

  handyman: {
    title: "خدمة حرفي",
    services: [
      { id: 1, title: "صيانة عامة", desc: "إصلاحات منزلية متنوعة", icon: "wrench" },
    ],
  },

  satellite: {
    title: "فني ستالايت",
    services: [
      { id: 1, title: "تركيب الستالايت", desc: "تركيب وضبط", icon: "satellite" },
      { id: 2, title: "صيانة الإشارة", desc: "حل مشاكل الاستقبال", icon: "signal" },
    ],
  },
};

export default servicesDetailsData;