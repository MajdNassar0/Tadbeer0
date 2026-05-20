import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ImagePlus, Trash2, Briefcase, FolderOpen, Expand } from "lucide-react";
import apiClient from "../../../../API/axiosConfig";
import { useToast } from "../../../../context/ToastContext";
import { Skeleton } from "./shared/Skeleton";
import ConfirmDialog from "./ConfirmDialog";
import AddSubImagesModal from "./AddSubImagesModal";
import Lightbox from "./Lightbox";
import { getFullImageUrl } from "../../../../Utils/imageHelper";
import { useAuth } from "../../../../context/AuthContext";
import { useParams } from "react-router-dom";

const ProjectDetail = ({ project, onBack, onProjectDeleted , isOwner}) => {
  const toast = useToast();
  const { user } = useAuth();
  const { id: workerIdFromUrl } = useParams();
  const [subImages, setSubImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [lightbox, setLightbox] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, subImageId: null });
  const [deleting, setDeleting] = useState(false);
  const [confirmProject, setConfirmProject] = useState(false);
  const [deletingProject, setDeletingProject] = useState(false);


  // جلب الصور الفرعية من السيرفر [cite: 215]
// جلب الصور الفرعية بناءً على الصلاحيات
const fetchSubImages = useCallback(async () => {
  // 💡 إذا مش صاحب الحساب، الصور موجودة مسبقاً داخل كائن الـ project في الـ Schema العامة
  if (!isOwner) {
    if (project?.subImages) {
      setSubImages(project.subImages);
    } else if (project?.projectImages) {
      setSubImages(project.projectImages);
    }
    setLoading(false);
    return;
  }

  // 🔒 إذا كان صاحب الحساب (العامل نفسه)، يجلبها من الـ /me المخصصة له كالعادة
  setLoading(true);
  try {
    const res = await apiClient.get(`/Worker/Profile/me/work-images/${project.id}/sub-images`);
    setSubImages(res.data || []);
  } catch {
    toast("فشل تحميل صور المشروع", "error");
  } finally {
    setLoading(false);
  }
}, [project, isOwner, toast]);

useEffect(() => {
  fetchSubImages();
}, [fetchSubImages]);

  useEffect(() => { fetchSubImages(); }, [fetchSubImages]);

  const handleDeleteSubImage = async () => {
    setDeleting(true);
    try {
      await apiClient.delete(`/Worker/Profile/me/work-sub-images/${confirm.subImageId}`);
      setSubImages((prev) => prev.filter((img) => img.id !== confirm.subImageId));
      toast("تم حذف الصورة ✓");
    } catch {
      toast("فشل حذف الصورة", "error");
    } finally {
      setDeleting(false);
      setConfirm({ open: false, subImageId: null });
    }
  };

  const handleDeleteProject = async () => {
    setDeletingProject(true);
    try {
      await apiClient.delete(`/Worker/Profile/me/work-images/${project.id}`);
      toast("تم حذف المشروع ✓");
      onProjectDeleted(project.id);
    } catch {
      toast("فشل حذف المشروع", "error");
    } finally {
      setDeletingProject(false);
      setConfirmProject(false);
    }
  };

  // توحيد مسميات الحقول لضمان عمل الـ Lightbox مع السكيما القديمة والجديدة [cite: 223, 224]
  const allImages = [
    { 
      id: "main", 
      imageUrl: project.imageUrl || project.mainImageUrl || project.url 
    },
    ...subImages.map(img => ({
      ...img,
      imageUrl: img.imageUrl || img.url 
    })),
  ].filter((img) => img.imageUrl);

  return (
    <motion.div
      initial={{ opacity: 0, x: 40 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{ type: "spring", stiffness: 350, damping: 30 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-3">
          <button
            onClick={onBack}
            className="w-9 h-9 rounded-2xl border border-gray-200 flex items-center justify-center text-gray-600 hover:bg-gray-50 transition"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            {/* دعم حقل name الجديد من السيرفر [cite: 125, 128] */}
            <h3 className="font-bold text-gray-900">{project.name || project.title || "تفاصيل المشروع"}</h3>
            {project.description && (
              <p className="text-xs text-gray-400 mt-0.5">{project.description}</p>
            )}
          </div>
        </div>
        {isOwner && (
  <div className="flex gap-2">
    <button
      onClick={() => setConfirmProject(true)}
      className="flex items-center gap-1.5 px-3 py-2 rounded-2xl border border-red-100 text-red-500 text-xs font-semibold hover:bg-red-50 transition"
    >
      <Trash2 size={13} /> حذف المشروع
    </button>
    <button
      onClick={() => setShowAddModal(true)}
      className="flex items-center gap-1.5 px-4 py-2 rounded-2xl bg-orange-500 text-white text-xs font-bold hover:bg-orange-600 transition shadow-md shadow-orange-100"
    >
      <ImagePlus size={13} /> إضافة صور
    </button>
  </div>
)}

      </div>

      {/* Cover - تم تحديثه ليدعم imageUrl لعدم الاختفاء بعد الـ Refresh [cite: 127] */}
      <div
        className="relative h-64 rounded-3xl overflow-hidden bg-gray-100 cursor-pointer group"
        onClick={() => setLightbox(0)}
      >
        {(project.imageUrl || project.mainImageUrl || project.url) ? (
          <img 
            src={getFullImageUrl(project.imageUrl || project.mainImageUrl || project.url)} 
            alt={project.name || "Project Cover"} 
            className="w-full h-full object-cover" 
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Briefcase size={40} className="text-gray-300" />
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition flex items-center justify-center">
          <Expand size={24} className="text-white opacity-0 group-hover:opacity-100 transition" />
        </div>
        <div className="absolute top-3 right-3 px-2.5 py-1 bg-black/50 backdrop-blur-sm rounded-full text-white text-[11px] font-semibold">
          الغلاف الرئيسي
        </div>
      </div>

      {/* Sub images */}
      <div>
        <h4 className="text-sm font-bold text-gray-700 mb-3">
          الصور الإضافية <span className="text-orange-400">({subImages.length})</span>
        </h4>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[...Array(3)].map((_, i) => <Skeleton key={i} className="h-32 rounded-2xl" />)}
          </div>
        ) : subImages.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-10 rounded-3xl border-2 border-dashed border-gray-200">
            <FolderOpen size={32} className="text-gray-300 mb-2" />
            <p className="text-sm text-gray-400">لا توجد صور إضافية بعد</p>
           {isOwner && (
  <button onClick={() => setShowAddModal(true)} className="mt-3 text-orange-500 text-xs font-bold hover:underline">
    + أضف صوراً الآن
  </button>
)}
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {subImages.map((img, i) => (
              <motion.div
                key={img.id}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05 }}
                className="relative group rounded-2xl overflow-hidden h-32 bg-gray-100 cursor-pointer"
                onClick={() => setLightbox(i + 1)}
              >
                <img 
                  src={getFullImageUrl(img.imageUrl || img.url)} 
                  alt="" 
                  className="w-full h-full object-cover" 
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition" />
               {isOwner && (
  <button
    onClick={(e) => { e.stopPropagation(); setConfirm({ open: true, subImageId: img.id }); }}
    className="absolute top-2 left-2 w-7 h-7 rounded-xl bg-white/90 flex items-center justify-center text-red-500 opacity-0 group-hover:opacity-100 transition shadow-sm"
  >
    <Trash2 size={12} />
  </button>
)}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      <AddSubImagesModal
       open={showAddModal}
  projectId={project.id}
  onClose={() => setShowAddModal(false)}
  onAdded={() => {
    // ✅ الحل الجذري: نطلب من المكون إعادة جلب الصور من السيرفر فوراً
    // هذا سيجلب الصور الجديدة بنفس التنسيق الذي يتوقعه الـ Lightbox
    fetchSubImages(); 
    toast("تم تحديث معرض الصور بنجاح ✓");
  }}
/>

      <ConfirmDialog
        open={confirm.open}
        message="هل أنت متأكد من حذف هذه الصورة؟"
        loading={deleting}
        onConfirm={handleDeleteSubImage}
        onCancel={() => setConfirm({ open: false, subImageId: null })}
      />

      <ConfirmDialog
        open={confirmProject}
        message="هل أنت متأكد من حذف هذا المشروع بالكامل؟ لا يمكن التراجع."
        loading={deletingProject}
        onConfirm={handleDeleteProject}
        onCancel={() => setConfirmProject(false)}
      />

      <AnimatePresence>
        {lightbox !== null && (
          <Lightbox images={allImages} startIndex={lightbox} onClose={() => setLightbox(null)} />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProjectDetail;