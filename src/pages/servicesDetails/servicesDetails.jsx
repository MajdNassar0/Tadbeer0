// src/pages/ServicesDetails/ServicesDetails.jsx

import React from "react";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";

// Import the services details data
import servicesDetailsData from "../../Data/servicesDetailsData";

// Import Lucide icons
import {
  Zap,
  Wrench,
  Lightbulb,
  Grid,
  Sparkles,
  Droplet,
  Shield,
  Hammer,
  Ruler,
  Leaf,
  Scissors,
  Paintbrush,
  Home,
  Camera,
  Settings,
  Flame,
  Satellite,
  Signal,
  Sun,
  Battery,
  ArrowUp,
} from "lucide-react";

// Map the icon string in your data to Lucide components
const iconMap = {
  zap: Zap,
  wrench: Wrench,
  lightbulb: Lightbulb,
  grid: Grid,
  sparkles: Sparkles,
  droplet: Droplet,
  shield: Shield,
  hammer: Hammer,
  ruler: Ruler,
  leaf: Leaf,
  scissors: Scissors,
  paintbrush: Paintbrush,
  home: Home,
  camera: Camera,
  settings: Settings,
  flame: Flame,
  satellite: Satellite,
  signal: Signal,
  sun: Sun,
  battery: Battery,
  "arrow-up": ArrowUp,
};

const ServicesDetails = () => {
  const { slug } = useParams();

  // Get service category from slug
  const serviceCategory = servicesDetailsData[slug];

  if (!serviceCategory) {
    return (
      <div className="text-center mt-20 text-gray-500 text-xl">
        الخدمة غير موجودة
      </div>
    );
  }

  return (
    <section dir="rtl" className="bg-[#f8f6f3] py-20 px-4 min-h-screen">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-4xl font-bold mb-4">{serviceCategory.title}</h1>
        </div>

        {/* Services Grid */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            visible: { transition: { staggerChildren: 0.08 } },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {serviceCategory.services.map((item) => {
            const Icon = iconMap[item.icon] || Wrench;

            return (
              <motion.div
                key={item.id}
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0 },
                }}
                whileHover={{ y: -6 }}
                className="bg-white p-8 rounded-[1.8rem] shadow-sm text-center hover:shadow-lg"
              >
                <div className="w-14 h-14 flex items-center justify-center rounded-full bg-yellow-100 text-yellow-500 mx-auto mb-5">
                  <Icon size={24} />
                </div>

                <h3 className="font-bold text-[#002b5b] mb-2">{item.title}</h3>
                <p className="text-gray-500 text-sm">{item.desc}</p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default ServicesDetails;