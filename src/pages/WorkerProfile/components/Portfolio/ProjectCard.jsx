import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, Trash2 } from "lucide-react";

const ProjectCard = ({ project, onClick, onDelete, index }) => {
  const [hover, setHover] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, type: "spring", stiffness: 300, damping: 25 }}
      className="relative group rounded-3xl overflow-hidden border border-gray-100 shadow-sm cursor-pointer bg-white"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      onClick={() => onClick(project)}
    >
      <div className="h-52 overflow-hidden bg-gray-100">
        {(project.imageUrl || project.mainImageUrl) ? (
          <motion.img
            src={project.imageUrl || project.mainImageUrl}
            alt={project.title || "مشروع"}
            className="w-full h-full object-cover"
            animate={{ scale: hover ? 1.06 : 1 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Briefcase size={32} className="text-gray-300" />
          </div>
        )}
      </div>

      <AnimatePresence>
        {hover && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent flex items-end p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <p className="text-white text-xs font-semibold">عرض المشروع ←</p>
          </motion.div>
        )}
      </AnimatePresence>

      <button
        onClick={(e) => { e.stopPropagation(); onDelete(project); }}
        className="absolute top-3 left-3 w-8 h-8 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition-all hover:bg-red-50 shadow-sm"
      >
        <Trash2 size={14} />
      </button>

      <div className="p-4">
        <h4 className="font-bold text-gray-900 text-sm truncate">
          {project.title || "مشروع بدون عنوان"}
        </h4>
        {project.description && (
          <p className="text-xs text-gray-400 mt-0.5 truncate">{project.description}</p>
        )}
        <div className="mt-2 flex items-center gap-1.5">
          <span className="w-1.5 h-1.5 rounded-full bg-orange-400" />
          <span className="text-[11px] text-orange-500 font-medium">
            {project.subImagesCount ?? 0} صور إضافية
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export default ProjectCard;