// src/pages/WorkerProfile/WorkerProfile.jsx
import React, {
  useState,
  useRef,
  useCallback,
  createContext,
  useContext,
} from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User,
  Shield,
  Images,
  Briefcase,
  Star,
  CheckCircle,
  Camera,
  Plus,
  Trash2,
  Edit3,
  Save,
  X,
  Award,
  Clock,
  BadgeCheck,
  Loader2,
  ZoomIn,
  ChevronLeft,
  ChevronRight,
  KeyRound,
  Smartphone,
  Ban,
  AlertTriangle,
} from "lucide-react";
import apiClient from "../../API/axiosConfig";
import { getFullImageUrl } from "../../Utils/imageHelper";
import { useAuth } from "../../context/AuthContext";

// ─────────────────────────────────────────────
// Toast Context (mirrors UserProfile approach)
// ─────────────────────────────────────────────
const ToastContext = createContext(null);
export const useToast = () => useContext(ToastContext);

// ─────────────────────────────────────────────
// Toast Component
// ─────────────────────────────────────────────
const Toast = ({ message, type, visible }) => (
  <AnimatePresence>
    {visible && (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className={`fixed bottom-6 left-1/2 z-[200] -translate-x-1/2 flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold shadow-xl ${
          type === "error"
            ? "bg-red-500 text-white"
            : "bg-[#001e3c] text-white"
        }`}
      >
        {type !== "error" && <CheckCircle size={16} />}
        {message}
      </motion.div>
    )}
  </AnimatePresence>
);

// ─────────────────────────────────────────────
// Tab Button
// ─────────────────────────────────────────────
const TabBtn = ({ id, label, icon: Icon, active, onClick }) => (
  <button
    onClick={() => onClick(id)}
    className={`flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-bold transition-all ${
      active
        ? "bg-orange-500 text-white shadow-md shadow-orange-200"
        : "text-gray-500 hover:bg-gray-100"
    }`}
  >
    <Icon size={16} />
    {label}
  </button>
);

// ─────────────────────────────────────────────
// Avatar Upload
// ─────────────────────────────────────────────
const AvatarUpload = ({ worker, onUpload, uploading }) => {
  const fileRef = useRef();
  const initials = `${worker?.firstName?.[0] ?? ""}${
    worker?.lastName?.[0] ?? ""
  }`.toUpperCase();

  return (
    <div className="relative inline-block">
      <div className="h-24 w-24 rounded-2xl overflow-hidden bg-gradient-to-br from-orange-400 to-[#001e3c] ring-4 ring-white shadow-lg">
        {worker?.profilePictureUrl ? (
          <img
            src={getFullImageUrl(worker.profilePictureUrl)}
            alt="avatar"
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-2xl font-black text-white">
            {initials || <User size={32} />}
          </div>
        )}
      </div>
      <button
        onClick={() => fileRef.current?.click()}
        disabled={uploading}
        className="absolute -bottom-1.5 -right-1.5 flex h-8 w-8 items-center justify-center rounded-xl bg-orange-500 text-white shadow-md hover:bg-orange-600 transition-all"
      >
        {uploading ? (
          <Loader2 size={14} className="animate-spin" />
        ) : (
          <Camera size={14} />
        )}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => e.target.files?.[0] && onUpload(e.target.files[0])}
      />
    </div>
  );
};

// ─────────────────────────────────────────────
// Rating Stars
// ─────────────────────────────────────────────
const RatingStars = ({ rating = 0 }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={14}
        className={s <= Math.round(rating) ? "text-amber-400 fill-amber-400" : "text-gray-200 fill-gray-200"}
      />
    ))}
  </div>
);

// ─────────────────────────────────────────────
// ── TAB: Professional Info ──
// ─────────────────────────────────────────────
const ProfessionalTab = ({ worker, onSave, saving }) => {
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    jobDescription: worker?.jobDescription ?? "",
    experienceYears: worker?.experienceYears ?? "",
  });

  const handleSave = async () => {
    const result = await onSave(form);
    if (result?.ok) setEditing(false);
  };

  return (
    <div className="space-y-5">
      {/* Bio Card */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-sm font-black text-gray-800">النبذة المهنية</h3>
          {!editing ? (
            <button
              onClick={() => setEditing(true)}
              className="flex items-center gap-1.5 rounded-xl border border-orange-200 px-3 py-1.5 text-xs font-bold text-orange-500 hover:bg-orange-50 transition-all"
            >
              <Edit3 size={12} /> تعديل
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setEditing(false)}
                className="flex items-center gap-1 rounded-xl bg-gray-100 px-3 py-1.5 text-xs font-bold text-gray-600 hover:bg-gray-200 transition-all"
              >
                <X size={12} /> إلغاء
              </button>
              <button
                onClick={handleSave}
                disabled={saving}
                className="flex items-center gap-1 rounded-xl bg-[#001e3c] px-3 py-1.5 text-xs font-bold text-white hover:bg-[#002a54] transition-all"
              >
                {saving ? (
                  <Loader2 size={12} className="animate-spin" />
                ) : (
                  <Save size={12} />
                )}
                حفظ
              </button>
            </div>
          )}
        </div>

        {editing ? (
          <textarea
            dir="rtl"
            rows={5}
            value={form.jobDescription}
            onChange={(e) => setForm({ ...form, jobDescription: e.target.value })}
            placeholder="اكتب نبذة تعريفية عن خبرتك ومهاراتك..."
            className="w-full resize-none rounded-xl border border-gray-200 bg-gray-50 p-3 text-sm text-right outline-none focus:border-orange-400 focus:bg-white transition-all"
          />
        ) : (
          <p
            dir="rtl"
            className={`text-sm leading-relaxed text-right ${
              worker?.jobDescription ? "text-gray-700" : "italic text-gray-400"
            }`}
          >
            {worker?.jobDescription || "لم تتم إضافة نبذة مهنية بعد."}
          </p>
        )}
      </div>

      {/* Trust & Verification */}
      <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
        <h3 className="mb-4 text-sm font-black text-gray-800 text-right">
          التحقق والمصداقية
        </h3>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {/* Experience */}
          <div className="flex flex-col items-center gap-2 rounded-xl bg-blue-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-100">
              <Clock size={18} className="text-[#001e3c]" />
            </div>
            {editing ? (
              <input
                type="number"
                min="0"
                max="50"
                value={form.experienceYears}
                onChange={(e) =>
                  setForm({ ...form, experienceYears: e.target.value })
                }
                className="w-20 rounded-lg border border-blue-200 bg-white p-1 text-center text-sm font-bold outline-none focus:border-blue-400"
              />
            ) : (
              <span className="text-2xl font-black text-[#001e3c]">
                {worker?.experienceYears ?? "—"}
              </span>
            )}
            <span className="text-xs font-semibold text-gray-500">
              سنوات خبرة
            </span>
          </div>

          {/* Rating */}
          <div className="flex flex-col items-center gap-2 rounded-xl bg-amber-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100">
              <Award size={18} className="text-amber-600" />
            </div>
            <span className="text-2xl font-black text-amber-700">
              {worker?.avgRating?.toFixed(1) ?? "—"}
            </span>
            <RatingStars rating={worker?.avgRating ?? 0} />
          </div>

          {/* Verified Badge */}
          <div className="flex flex-col items-center gap-2 rounded-xl bg-green-50 p-4">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-100">
              <BadgeCheck size={18} className="text-green-600" />
            </div>
            <span className="text-sm font-black text-green-700">
              {worker?.isVerified ? "موثّق" : "غير موثّق"}
            </span>
            <span className="text-xs font-semibold text-gray-500">
              الهوية الرسمية
            </span>
          </div>
        </div>
      </div>

      {/* Specialties */}
      {worker?.specialtyNames?.length > 0 && (
        <div className="rounded-2xl border border-gray-100 bg-white p-5 shadow-sm">
          <h3 className="mb-3 text-sm font-black text-gray-800 text-right">
            التخصصات
          </h3>
          <div className="flex flex-wrap gap-2 justify-end">
            {worker.specialtyNames.map((sp, i) => (
              <span
                key={i}
                className="rounded-xl bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-600 border border-orange-100"
              >
                {sp}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────────
// ── TAB: Work Gallery ──
// ─────────────────────────────────────────────
const GalleryTab = ({ workImages = [], onAddMainImage, onAddSubImage, onDeleteMainImage, onDeleteSubImage, uploading }) => {
  const [lightbox, setLightbox] = useState(null); // { images: [], index: 0 }
  const mainRef = useRef();

  const openLightbox = (images, index) => setLightbox({ images, index });
  const closeLightbox = () => setLightbox(null);
  const prev = () =>
    setLightbox((l) => ({ ...l, index: (l.index - 1 + l.images.length) % l.images.length }));
  const next = () =>
    setLightbox((l) => ({ ...l, index: (l.index + 1) % l.images.length }));

  return (
    <div className="space-y-5">
      {/* Upload New Main Image */}
      <div className="flex items-center justify-between">
        <p className="text-xs text-gray-400">أضف صور مشاريعك السابقة لعرضها للعملاء</p>
        <button
          onClick={() => mainRef.current?.click()}
          disabled={uploading}
          className="flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2 text-xs font-bold text-white shadow-md shadow-orange-200 hover:bg-orange-600 transition-all"
        >
          {uploading ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
          إضافة مشروع
        </button>
        <input
          ref={mainRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => e.target.files?.[0] && onAddMainImage(e.target.files[0])}
        />
      </div>

      {workImages.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50 py-16">
          <Images size={36} className="text-gray-300" />
          <p className="text-sm font-semibold text-gray-400">
            لا توجد صور مشاريع بعد
          </p>
          <p className="text-xs text-gray-300">اضغط "إضافة مشروع" لبدء معرضك</p>
        </div>
      ) : (
        <div className="space-y-6">
          {workImages.map((project, pi) => (
            <motion.div
              key={project.mainImageId}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm"
            >
              {/* Main Image */}
              <div className="relative group">
                <img
                  src={getFullImageUrl(project.mainImageUrl)}
                  alt={`project-${pi}`}
                  className="h-52 w-full object-cover cursor-pointer"
                  onClick={() => {
                    const all = [project.mainImageUrl, ...(project.subImages?.map((s) => s.imageUrl) ?? [])];
                    openLightbox(all, 0);
                  }}
                />
                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/40 transition-all flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100">
                  <button
                    onClick={() => {
                      const all = [project.mainImageUrl, ...(project.subImages?.map((s) => s.imageUrl) ?? [])];
                      openLightbox(all, 0);
                    }}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/90 text-gray-700 hover:bg-white transition-all"
                  >
                    <ZoomIn size={16} />
                  </button>
                  <button
                    onClick={() => onDeleteMainImage(project.mainImageId)}
                    className="flex h-9 w-9 items-center justify-center rounded-xl bg-red-500/90 text-white hover:bg-red-600 transition-all"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
                <div className="absolute bottom-2 right-2 rounded-lg bg-black/50 px-2 py-1 text-xs font-bold text-white backdrop-blur-sm">
                  مشروع {pi + 1}
                </div>
              </div>

              {/* Sub Images */}
              <div className="p-3">
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {project.subImages?.map((sub, si) => (
                    <div key={sub.subImageId} className="relative group/sub flex-shrink-0">
                      <img
                        src={getFullImageUrl(sub.imageUrl)}
                        alt={`sub-${si}`}
                        className="h-16 w-16 rounded-xl object-cover cursor-pointer ring-1 ring-gray-100"
                        onClick={() => {
                          const all = [project.mainImageUrl, ...(project.subImages?.map((s) => s.imageUrl) ?? [])];
                          openLightbox(all, si + 1);
                        }}
                      />
                      <button
                        onClick={() => onDeleteSubImage(sub.subImageId)}
                        className="absolute -top-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-white opacity-0 group-hover/sub:opacity-100 transition-all hover:bg-red-600"
                      >
                        <X size={10} />
                      </button>
                    </div>
                  ))}

                  {/* Add Sub Image */}
                  <SubImageUploader
                    mainImageId={project.mainImageId}
                    onUpload={onAddSubImage}
                    uploading={uploading}
                  />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Lightbox */}
      <AnimatePresence>
        {lightbox && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/90 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative max-w-3xl w-full"
            >
              <button
                onClick={closeLightbox}
                className="absolute -top-10 right-0 flex h-8 w-8 items-center justify-center rounded-full bg-white/10 text-white hover:bg-white/20 transition-all"
              >
                <X size={18} />
              </button>
              <img
                src={getFullImageUrl(lightbox.images[lightbox.index])}
                alt="preview"
                className="w-full rounded-2xl object-contain max-h-[70vh]"
              />
              {lightbox.images.length > 1 && (
                <>
                  <button
                    onClick={prev}
                    className="absolute left-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition-all"
                  >
                    <ChevronLeft size={20} />
                  </button>
                  <button
                    onClick={next}
                    className="absolute right-2 top-1/2 -translate-y-1/2 flex h-9 w-9 items-center justify-center rounded-xl bg-white/20 text-white hover:bg-white/30 transition-all"
                  >
                    <ChevronRight size={20} />
                  </button>
                  <div className="mt-3 flex justify-center gap-1.5">
                    {lightbox.images.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setLightbox((l) => ({ ...l, index: i }))}
                        className={`h-1.5 rounded-full transition-all ${
                          i === lightbox.index
                            ? "w-5 bg-orange-400"
                            : "w-1.5 bg-white/40"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SubImageUploader = ({ mainImageId, onUpload, uploading }) => {
  const ref = useRef();
  return (
    <>
      <button
        onClick={() => ref.current?.click()}
        disabled={uploading}
        className="flex h-16 w-16 flex-shrink-0 items-center justify-center rounded-xl border-2 border-dashed border-gray-200 bg-gray-50 text-gray-300 hover:border-orange-300 hover:text-orange-400 transition-all"
      >
        {uploading ? (
          <Loader2 size={16} className="animate-spin text-orange-400" />
        ) : (
          <Plus size={16} />
        )}
      </button>
      <input
        ref={ref}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) =>
          e.target.files?.[0] && onUpload(mainImageId, e.target.files[0])
        }
      />
    </>
  );
};

// ─────────────────────────────────────────────
// ── TAB: Security ──
// ─────────────────────────────────────────────
const SecurityTab = ({ worker, onToggleStatus, toggling }) => {
  const [activeModal, setActiveModal] = useState(null);
  const toast = useToast();
  const isInactive = worker?.status === "Inactive";

  const securityItems = [
    { id: "pwd", icon: KeyRound, title: "تغيير كلمة المرور", desc: "تحديث كلمة المرور لحماية حسابك", btn: "تغيير" },
    { id: "2fa", icon: Smartphone, title: "التحقق بخطوتين", desc: "أضف طبقة حماية إضافية", btn: "تفعيل" },
    {
      id: "deactivate",
      icon: Ban,
      title: isInactive ? "تفعيل الحساب" : "تعطيل الحساب مؤقتاً",
      desc: isInactive ? "إعادة تنشيط حسابك" : "يمكنك استعادة حسابك في أي وقت",
      btn: isInactive ? "تفعيل" : "تعطيل",
      variant: "danger",
    },
    {
      id: "delete",
      icon: Trash2,
      title: "حذف الحساب نهائياً",
      desc: "سيتم مسح كافة بياناتك نهائياً",
      btn: "حذف",
      variant: "danger",
    },
  ];

  return (
    <div className="space-y-4">
      {securityItems.map((item) => (
        <div
          key={item.id}
          className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm hover:shadow-md transition-all"
        >
          <div className="flex items-center gap-3">
            <div
              className={`flex h-10 w-10 items-center justify-center rounded-xl ${
                item.variant === "danger" ? "bg-red-50" : "bg-blue-50"
              }`}
            >
              <item.icon
                size={18}
                className={
                  item.variant === "danger" ? "text-red-500" : "text-[#001e3c]"
                }
              />
            </div>
            <div>
              <p className="text-sm font-semibold text-gray-800">{item.title}</p>
              <p className="text-xs text-gray-400">{item.desc}</p>
            </div>
          </div>
          <button
            onClick={() => setActiveModal(item.id)}
            className={`rounded-xl border px-4 py-1.5 text-xs font-semibold transition-all ${
              item.variant === "danger"
                ? "border-red-100 text-red-500 hover:bg-red-50"
                : "border-orange-200 text-orange-500 hover:bg-orange-50"
            }`}
          >
            {item.btn}
          </button>
        </div>
      ))}

      {/* Deactivate Modal */}
      <AnimatePresence>
        {activeModal === "deactivate" && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center"
            >
              <div className="mb-4 flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-orange-50 text-orange-500">
                  <Ban size={28} />
                </div>
                <h3 className="text-lg font-black text-gray-800">
                  {isInactive ? "تفعيل الحساب" : "تعطيل الحساب مؤقتاً"}
                </h3>
                <p className="text-sm text-gray-500">
                  {isInactive
                    ? "هل أنت متأكد من إعادة تفعيل حسابك؟"
                    : "هل أنت متأكد؟ يمكنك إعادة تفعيله في أي وقت."}
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveModal(null)}
                  className="flex-1 rounded-xl bg-gray-100 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-200 transition-all"
                >
                  تراجع
                </button>
                <button
                  onClick={async () => {
                    const res = await onToggleStatus();
                    setActiveModal(null);
                    if (!res.ok) toast(res.error, "error");
                    else toast("تم تحديث حالة الحساب ✓");
                  }}
                  disabled={toggling}
                  className="flex-1 rounded-xl bg-[#001e3c] py-2.5 text-sm font-bold text-white hover:bg-[#002a54] transition-all flex items-center justify-center gap-2"
                >
                  {toggling ? (
                    <Loader2 size={16} className="animate-spin" />
                  ) : isInactive ? (
                    "تأكيد التفعيل"
                  ) : (
                    "تأكيد التعطيل"
                  )}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Modal */}
      <AnimatePresence>
        {activeModal === "delete" && (
          <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveModal(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-sm rounded-3xl bg-white p-6 shadow-2xl text-center"
            >
              <div className="mb-4 flex flex-col items-center gap-3">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
                  <AlertTriangle size={28} />
                </div>
                <h3 className="text-lg font-black text-gray-800">
                  حذف الحساب نهائياً
                </h3>
                <p className="text-sm text-gray-500">
                  هل أنت متأكد؟ سيتم حذف كافة بياناتك ولا يمكن استعادتها.
                </p>
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => setActiveModal(null)}
                  className="flex-1 rounded-xl bg-gray-100 py-2.5 text-sm font-bold text-gray-700 hover:bg-gray-200 transition-all"
                >
                  إلغاء
                </button>
                <button className="flex-1 rounded-xl bg-red-600 py-2.5 text-sm font-bold text-white hover:bg-red-700 transition-all">
                  تأكيد الحذف
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

// ─────────────────────────────────────────────
// ── Main Hook: useWorkerProfile ──
// ─────────────────────────────────────────────
const useWorkerProfile = () => {
  const [worker, setWorker] = useState(null);
  const [workImages, setWorkImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [toggling, setToggling] = useState(false);
  const [uploading, setUploading] = useState(false);

  const fetch = useCallback(async () => {
    try {
      const [profileRes, imagesRes] = await Promise.all([
        apiClient.get("/Worker/Profile/me"),
        apiClient.get("/Worker/Profile/me/work-images"),
      ]);
      setWorker(profileRes.data);
      setWorkImages(imagesRes.data ?? []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProfile = useCallback(async (payload) => {
    setSaving(true);
    try {
      const fd = new FormData();
      fd.append("JobDescription", payload.jobDescription ?? "");
      fd.append("ExperienceYears", payload.experienceYears ?? "");
      const res = await apiClient.put("/Worker/Profile/me", fd);
      setWorker(res.data);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: e.response?.data?.message ?? "فشل التحديث" };
    } finally {
      setSaving(false);
    }
  }, []);

  const uploadAvatar = useCallback(async (file) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("ProfilePicture", file);
      const res = await apiClient.put("/Worker/Profile/me", fd);
      setWorker(res.data);
      return { ok: true, user: res.data };
    } catch (e) {
      return { ok: false };
    } finally {
      setUploading(false);
    }
  }, []);

  const addMainImage = useCallback(async (file) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("MainImage", file);
      const res = await apiClient.post("/Worker/Profile/me/work-images", fd);
      setWorkImages((prev) => [...prev, res.data]);
      return { ok: true };
    } catch (e) {
      return { ok: false };
    } finally {
      setUploading(false);
    }
  }, []);

  const addSubImage = useCallback(async (mainImageId, file) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.append("SubImage", file);
      await apiClient.post(
        `/Worker/Profile/me/work-images/${mainImageId}/sub-images`,
        fd
      );
      // Re-fetch images to get updated sub-images
      const res = await apiClient.get("/Worker/Profile/me/work-images");
      setWorkImages(res.data ?? []);
      return { ok: true };
    } catch (e) {
      return { ok: false };
    } finally {
      setUploading(false);
    }
  }, []);

  const deleteMainImage = useCallback(async (mainImageId) => {
    try {
      await apiClient.delete(`/Worker/Profile/me/work-images/${mainImageId}`);
      setWorkImages((prev) => prev.filter((p) => p.mainImageId !== mainImageId));
    } catch (e) {
      console.error(e);
    }
  }, []);

  const deleteSubImage = useCallback(async (subImageId) => {
    try {
      await apiClient.delete(
        `/Worker/Profile/me/work-sub-images/${subImageId}`
      );
      setWorkImages((prev) =>
        prev.map((p) => ({
          ...p,
          subImages: p.subImages?.filter((s) => s.subImageId !== subImageId),
        }))
      );
    } catch (e) {
      console.error(e);
    }
  }, []);

  const toggleAccountStatus = useCallback(async () => {
    setToggling(true);
    try {
      const res = await apiClient.patch("/Worker/Profile/me/status-toggle");
      setWorker(res.data);
      return { ok: true };
    } catch (e) {
      return { ok: false, error: "فشل تغيير حالة الحساب" };
    } finally {
      setToggling(false);
    }
  }, []);

  React.useEffect(() => {
    fetch();
  }, [fetch]);

  return {
    worker,
    workImages,
    loading,
    saving,
    toggling,
    uploading,
    updateProfile,
    uploadAvatar,
    addMainImage,
    addSubImage,
    deleteMainImage,
    deleteSubImage,
    toggleAccountStatus,
  };
};

// ─────────────────────────────────────────────
// ── Main Page ──
// ─────────────────────────────────────────────
const WorkerProfile = () => {
  const [activeTab, setActiveTab] = useState("professional");
  const [toast, setToast] = useState({ msg: "", type: "success", visible: false });
  const { updateUser } = useAuth();

  const showToast = useCallback((msg, type = "success") => {
    setToast({ msg, type, visible: true });
    setTimeout(() => setToast((t) => ({ ...t, visible: false })), 3000);
  }, []);

  const {
    worker,
    workImages,
    loading,
    saving,
    toggling,
    uploading,
    updateProfile,
    uploadAvatar,
    addMainImage,
    addSubImage,
    deleteMainImage,
    deleteSubImage,
    toggleAccountStatus,
  } = useWorkerProfile();

  const handleAvatarUpload = async (file) => {
    const res = await uploadAvatar(file);
    if (res.ok) {
      updateUser({ profilePictureUrl: res.user?.profilePictureUrl });
      showToast("تم تحديث الصورة الشخصية ✓");
    } else {
      showToast("فشل رفع الصورة", "error");
    }
  };

  const handleSaveProfessional = async (payload) => {
    const res = await updateProfile(payload);
    if (res.ok) showToast("تم حفظ البيانات المهنية ✓");
    else showToast(res.error, "error");
    return res;
  };

  const handleAddMainImage = async (file) => {
    const res = await addMainImage(file);
    if (res.ok) showToast("تمت إضافة المشروع ✓");
    else showToast("فشل رفع الصورة", "error");
  };

  const handleAddSubImage = async (mainId, file) => {
    const res = await addSubImage(mainId, file);
    if (res.ok) showToast("تمت إضافة الصورة ✓");
    else showToast("فشل رفع الصورة", "error");
  };

  const tabs = [
    { id: "professional", label: "المعلومات المهنية", icon: Briefcase },
    { id: "gallery", label: "معرض الأعمال", icon: Images },
    { id: "security", label: "الأمان", icon: Shield },
  ];

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500" />
      </div>
    );
  }

  return (
    <ToastContext.Provider value={showToast}>
      <div dir="rtl" className="min-h-screen bg-gray-50/60 pb-16">
        {/* Header Card */}
        <div className="bg-white border-b border-gray-100 shadow-sm">
          <div className="mx-auto max-w-2xl px-4 py-6">
            <div className="flex items-start gap-4">
              <AvatarUpload
                worker={worker}
                onUpload={handleAvatarUpload}
                uploading={uploading}
              />
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl font-black text-gray-900 truncate">
                    {worker?.firstName} {worker?.lastName}
                  </h1>
                  {worker?.isVerified && (
                    <BadgeCheck size={18} className="text-blue-500 flex-shrink-0" />
                  )}
                </div>
                <p className="mt-0.5 text-sm text-gray-500">
                  {worker?.specialtyNames?.[0] ?? "عامل معتمد"}
                </p>
                <div className="mt-2 flex items-center gap-3 flex-wrap">
                  <RatingStars rating={worker?.avgRating ?? 0} />
                  <span className="text-xs text-gray-400 font-medium">
                    {worker?.avgRating?.toFixed(1) ?? "—"} / 5.0
                  </span>
                  {worker?.status && (
                    <span
                      className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${
                        worker.status === "Active"
                          ? "bg-green-50 text-green-600"
                          : "bg-red-50 text-red-500"
                      }`}
                    >
                      {worker.status === "Active" ? "نشط" : "غير نشط"}
                    </span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="mx-auto max-w-2xl px-4">
          <div className="mt-4 flex gap-1.5 overflow-x-auto rounded-2xl bg-white p-1.5 shadow-sm border border-gray-100">
            {tabs.map((t) => (
              <TabBtn
                key={t.id}
                {...t}
                active={activeTab === t.id}
                onClick={setActiveTab}
              />
            ))}
          </div>

          {/* Tab Content */}
          <div className="mt-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.18 }}
              >
                {activeTab === "professional" && (
                  <ProfessionalTab
                    worker={worker}
                    onSave={handleSaveProfessional}
                    saving={saving}
                  />
                )}
                {activeTab === "gallery" && (
                  <GalleryTab
                    workImages={workImages}
                    onAddMainImage={handleAddMainImage}
                    onAddSubImage={handleAddSubImage}
                    onDeleteMainImage={deleteMainImage}
                    onDeleteSubImage={deleteSubImage}
                    uploading={uploading}
                  />
                )}
                {activeTab === "security" && (
                  <SecurityTab
                    worker={worker}
                    onToggleStatus={toggleAccountStatus}
                    toggling={toggling}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Toast */}
        <Toast message={toast.msg} type={toast.type} visible={toast.visible} />
      </div>
    </ToastContext.Provider>
  );
};

export default WorkerProfile;
