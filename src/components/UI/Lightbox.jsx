import React, { useState } from "react";
import { motion } from "framer-motion";
import { X as IconX, ChevronRight, ChevronLeft } from "lucide-react";
import { getFullImageUrl } from "../../Utils/imageHelper";

const Lightbox = ({ images, initialIndex, onClose }) => {
  const [cur, setCur] = useState(initialIndex);
  const img = images[cur];

  return (
    <motion.div 
      initial={{ opacity: 0 }} 
      animate={{ opacity: 1 }} 
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 p-4"
      onClick={onClose}
    >
      <motion.div 
        initial={{ scale: 0.9, opacity: 0 }} 
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }} 
        className="relative w-full max-w-3xl"
        onClick={e => e.stopPropagation()}
      >
        <button onClick={onClose} className="absolute -top-10 right-0 text-white/70 hover:text-white">
          <IconX size={28}/>
        </button>
        
        <img 
          src={getFullImageUrl(img.imageUrl || img.url) || img.url}
          alt={img.caption || ""}
          className="w-full max-h-[75vh] object-contain rounded-2xl"
        />

        {images.length > 1 && (
          <div className="absolute inset-y-0 flex items-center justify-between w-full px-2 pointer-events-none">
            <button 
              onClick={() => setCur(i => (i - 1 + images.length) % images.length)}
              className="pointer-events-auto bg-black/40 hover:bg-black/70 text-white rounded-full p-2"
            >
              <ChevronRight size={22}/>
            </button>
            <button 
              onClick={() => setCur(i => (i + 1) % images.length)}
              className="pointer-events-auto bg-black/40 hover:bg-black/70 text-white rounded-full p-2"
            >
              <ChevronLeft size={22}/>
            </button>
          </div>
        )}

        <div className="flex justify-center gap-1.5 mt-3">
          {images.map((_, i) => (
            <button 
              key={i} 
              onClick={() => setCur(i)}
              className={`h-1.5 rounded-full transition-all ${i === cur ? "w-6 bg-orange-400" : "w-1.5 bg-white/30"}`}
            />
          ))}
        </div>
      </motion.div>
    </motion.div>
  );
};

export default Lightbox;