import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookOpen, ImagePlus, Loader2, ZoomIn, Trash2 } from "lucide-react";
import { getFullImageUrl } from "../../../Utils/imageHelper";
import Skeleton from "../../../components/UI/Skeleton";
import Lightbox from "../../../components/UI/Lightbox";

const PortfolioTab = ({ images = [], isOwner, loading, onUploadImage, onDeleteImage, saving }) => {
  const [lbIdx, setLbIdx] = useState(null);
  const ref = useRef(null);

  return (
    <div>
      {isOwner && (
        <>
          <input ref={ref} type="file" className="hidden" accept="image/*"
            onChange={e => e.target.files[0] && onUploadImage(e.target.files[0])}/>
          <button onClick={() => ref.current?.click()} disabled={saving}
            className="mb-4 flex items-center gap-2 rounded-xl border border-dashed border-orange-300 bg-orange-50 px-4 py-2.5 text-sm font-semibold text-orange-500 hover:bg-orange-100 transition disabled:opacity-60">
            {saving ? <Loader2 size={15} className="animate-spin"/> : <ImagePlus size={15}/>}
            {saving ? "جاري الرفع..." : "إضافة صورة جديدة"}
          </button>
        </>
      )}

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {[...Array(6)].map((_, i) => <Skeleton key={i} className="aspect-[4/3] rounded-2xl"/>)}
        </div>
      ) : images.length === 0 ? (
        <div className="flex flex-col items-center gap-3 py-12 text-center">
          <BookOpen size={28} className="text-gray-300"/>
          <p className="text-sm text-gray-400">لا توجد صور في معرض الأعمال</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {images.map((img, i) => (
            <motion.div key={img.id || i} whileHover={{ scale: 1.02 }}
              className="group relative cursor-pointer overflow-hidden rounded-2xl aspect-[4/3] bg-gray-100"
              onClick={() => setLbIdx(i)}>
              <img src={getFullImageUrl(img.imageUrl || img.url) || img.url} alt=""
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"/>
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <ZoomIn className="text-white" size={24}/>
              </div>
              {isOwner && (
                <button className="absolute top-2 left-2 p-1.5 bg-red-500 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={e => { e.stopPropagation(); onDeleteImage(img.id); }}>
                  <Trash2 size={14}/>
                </button>
              )}
            </motion.div>
          ))}
        </div>
      )}
      <AnimatePresence>
        {lbIdx !== null && <Lightbox images={images} initialIndex={lbIdx} onClose={() => setLbIdx(null)}/>}
      </AnimatePresence>
    </div>
  );
};

export default PortfolioTab;