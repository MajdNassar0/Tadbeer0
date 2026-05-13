import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Briefcase } from "lucide-react"; // أضفنا Briefcase للحالة الفارغة
import apiClient from "../../../../API/axiosConfig";
import { useToast } from "../../../../context/ToastContext";
import { ProjectCardSkeleton } from "./shared/Skeleton";
import ProjectCard from "./ProjectCard";
import ProjectDetail from "./ProjectDetail";
import EmptyState from "./EmptyState";
import CreateProjectModal from "./CreateProjectModal";
import ConfirmDialog from "./ConfirmDialog";

// 1. استقبال isOwner كخاصية للمكون [cite: 438, 451]
const PortfolioTabInner = ({ isOwner }) => { 
  const toast = useToast();
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [confirm, setConfirm] = useState({ open: false, project: null });
  const [deleting, setDeleting] = useState(false);

  const fetchProjects = useCallback(async () => {
    setLoading(true);
    try {
      // ملاحظة: هنا يفضل استخدام مسار ديناميكي إذا كان الزائر يشاهد بروفايل شخص آخر
      const res = await apiClient.get("/Worker/Profile/me/work-images"); 
      setProjects(res.data || []);
    } catch {
      toast("فشل تحميل المشاريع", "error");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchProjects(); }, [fetchProjects]);

  const handleDeleteProject = async () => {
    if (!confirm.project) return;
    setDeleting(true);
    try {
      await apiClient.delete(`/Worker/Profile/me/work-images/${confirm.project.id}`); 
      setProjects((prev) => prev.filter((p) => p.id !== confirm.project.id));
      toast("تم حذف المشروع ✓");
    } catch {
      toast("فشل حذف المشروع", "error");
    } finally {
      setDeleting(false);
      setConfirm({ open: false, project: null });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50 p-4 sm:p-6" dir="rtl">
      <AnimatePresence mode="wait">
        {selectedProject ? (
          <ProjectDetail
            key="detail"
            project={selectedProject}
            onBack={() => setSelectedProject(null)}
            onProjectDeleted={(id) => {
              setProjects((prev) => prev.filter((p) => p.id !== id));
              setSelectedProject(null);
            }}
          />
        ) : (
          <motion.div
            key="grid"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-5"
          >
            {/* Header */}
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-black text-gray-900">معرض الأعمال</h2>
                <p className="text-sm text-gray-400 mt-0.5">{projects.length} مشروع منجز</p>
              </div>
              {/* 2. إظهار زر الإضافة فقط للمالك [cite: 438] */}
              {isOwner && projects.length > 0 && (
                <button
                  onClick={() => setShowCreateModal(true)}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-orange-500 text-white text-sm font-bold hover:bg-orange-600 active:scale-95 transition-all shadow-lg shadow-orange-200"
                >
                  <Plus size={16} /> مشروع جديد
                </button>
              )}
            </div>

            {/* Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[...Array(6)].map((_, i) => <ProjectCardSkeleton key={i} />)}
              </div>
            ) : projects.length === 0 ? (
              // 3. التمييز في الحالة الفارغة بين المالك والزائر [cite: 223, 460]
              isOwner ? (
                <EmptyState onAdd={() => setShowCreateModal(true)} />
              ) : (
                <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-dashed border-gray-200">
                  <Briefcase size={40} className="text-gray-200 mb-3" />
                  <p className="text-sm text-gray-400 font-medium">لا توجد أعمال معروضة لهذا العامل حالياً</p>
                </div>
              )
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {projects.map((project, i) => (
                  <ProjectCard
                    key={project.id}
                    project={project}
                    index={i}
                    onClick={setSelectedProject}
                    onDelete={isOwner ? (p) => setConfirm({ open: true, project: p }) : null}
                  />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* مودال الإنشاء يظهر للمالك فقط برمجياً [cite: 269] */}
      {isOwner && (
        <CreateProjectModal
          open={showCreateModal}
          onClose={() => setShowCreateModal(false)}
          onCreated={(newProject) => setProjects((prev) => [newProject, ...prev])}
        />
      )}

      <ConfirmDialog
        open={confirm.open}
        message={`هل تريد حذف "${confirm.project?.title || "هذا المشروع"}"؟`}
        loading={deleting}
        onConfirm={handleDeleteProject}
        onCancel={() => setConfirm({ open: false, project: null })}
      />
    </div>
  );
};

export default PortfolioTabInner;