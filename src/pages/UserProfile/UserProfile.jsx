import { useUserProfile } from "../../Hooks/useUserProfile";
import { getFullImageUrl } from "../../Utils/imageHelper";
import React, { useState, useCallback, createContext, useContext } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  User, Mail, Phone, MapPin, Shield, Calendar,
  Edit3, Camera, ClipboardList, Lock, AlertTriangle,
  Trash2, UserX, CheckCircle, XCircle, ChevronRight,
  Loader2, Star, BadgeCheck, Save, X as IconX,
} from "lucide-react";

// ══════════════════════════════════════════════════════════════
// CONSTANTS & HELPERS
// ══════════════════════════════════════════════════════════════
const ROLE_MAP = {
  SuperAdmin: { label: "مشرف عام", color: "#7c3aed", bg: "#ede9fe" },
  Admin:      { label: "مشرف",      color: "#001e3c", bg: "#e0f0ff" },
  Worker:     { label: "عامل",      color: "#ff9800", bg: "#fff3e0" },
  User:       { label: "مستخدم",  color: "#16a34a", bg: "#dcfce7" },
};

const STATUS_MAP = {
  Active:   { label: "نشط",          icon: CheckCircle, color: "#16a34a", bg: "#dcfce7" },
  Inactive: { label: "غير نشط",       icon: XCircle,     color: "#dc2626", bg: "#fee2e2" },
  Pending:  { label: "قيد المراجعة", icon: Loader2,      color: "#d97706", bg: "#fef3c7" },
};

const TABS = [
  { id: "personal", label: "المعلومات الشخصية", icon: User },
  { id: "security", label: "الأمان",             icon: Lock },
  { id: "requests", label: "طلباتي",             icon: ClipboardList },
];

const PHONE_REGEX = /^\+?[0-9\s\-]{7,15}$/;

const validateProfileForm = (data) => {
  const errors = {};
  if (!data.firstName?.trim())  errors.firstName   = "الاسم الأول مطلوب";
  if (!data.lastName?.trim())   errors.lastName    = "الاسم الأخير مطلوب";
  if (!data.email?.trim())      errors.email       = "البريد الإلكتروني مطلوب";
  if (data.phoneNumber && !PHONE_REGEX.test(data.phoneNumber))
    errors.phoneNumber = "رقم الهاتف غير صالح";
  return errors;
};


// ══════════════════════════════════════════════════════════════
// TOAST CONTEXT
// ══════════════════════════════════════════════════════════════
const ToastContext = createContext(null);
const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((message, type = "success") => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), 3500);
  }, []);
  return (
    <ToastContext.Provider value={push}>
      {children}
      <div className="fixed bottom-6 left-1/2 z-[100] flex -translate-x-1/2 flex-col gap-2" style={{ minWidth: 260 }}>
        <AnimatePresence>
          {toasts.map(t => (
            <motion.div key={t.id} initial={{ opacity: 0, y: 20, scale: 0.95 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 10, scale: 0.95 }}
              className={`flex items-center gap-2 rounded-2xl px-5 py-3 text-sm font-bold text-white shadow-xl ${t.type === "success" ? "bg-[#001e3c]" : "bg-red-600"}`}>
              {t.type === "success" ? <CheckCircle size={16} className="text-orange-400" /> : <XCircle size={16} />}
              {t.message}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </ToastContext.Provider>
  );
};
const useToast = () => useContext(ToastContext);

// ══════════════════════════════════════════════════════════════
// UI COMPONENTS (Skeleton, ProfileField, InputField, EditForm)
// ══════════════════════════════════════════════════════════════
const Skeleton = ({ className = "" }) => (
  <div className={`rounded-lg ${className}`} style={{ background: "linear-gradient(90deg,#e2e8f0 25%,#f1f5f9 50%,#e2e8f0 75%)", backgroundSize: "200% 100%", animation: "skshimmer 1.4s infinite" }} />
);

const ProfileField = ({ icon: Icon, label, value, loading }) => (
  <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-1.5 rounded-2xl border border-gray-100 bg-white p-4 shadow-sm transition-all duration-300 hover:border-orange-200 hover:shadow-md">
    <div className="flex items-center gap-2 text-gray-400">
      <Icon size={14} className="text-orange-400" />
      <span className="text-xs font-medium">{label}</span>
    </div>
    {loading ? <Skeleton className="h-5 w-3/4" /> : <p className="text-sm font-semibold text-gray-800">{value || <span className="font-normal italic text-gray-400">غير محدد</span>}</p>}
  </motion.div>
);

const InputField = ({ icon: Icon, label, name, value, onChange, error, placeholder = "" }) => (
  <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col gap-1.5">
    <label className="flex items-center gap-1.5 text-xs font-medium text-gray-500"><Icon size={13} className="text-orange-400" />{label}</label>
    <input name={name} value={value} onChange={onChange} placeholder={placeholder} className={`w-full rounded-xl border px-4 py-2.5 text-sm font-medium text-gray-800 outline-none transition-all duration-200 focus:border-orange-400 focus:ring-2 focus:ring-orange-100 ${error ? "border-red-400 bg-red-50" : "border-gray-200 bg-white hover:border-gray-300"}`} dir="rtl" />
    <AnimatePresence>{error && <motion.p initial={{ opacity: 0, y: -4 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="text-xs text-red-500">{error}</motion.p>}</AnimatePresence>
  </motion.div>
);

const EditForm = ({ user, saving, onSave, onCancel }) => {
  const [form, setForm] = useState({ firstName: user?.firstName || "", lastName: user?.lastName || "", email: user?.email || "", phoneNumber: user?.phoneNumber || "", city: user?.city || "" });
  const [errors, setErrors] = useState({});
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: undefined }));
  };
  const handleSubmit = () => {
    const errs = validateProfileForm(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }
    onSave(form);
  };
  const fields = [
    { icon: User, label: "الاسم الأول", name: "firstName", placeholder: "أدخل الاسم الأول" },
    { icon: User, label: "الاسم الأخير", name: "lastName", placeholder: "أدخل الاسم الأخير" },
    { icon: Mail, label: "البريد الإلكتروني", name: "email", placeholder: "example@email.com" },
    { icon: Phone, label: "رقم الهاتف", name: "phoneNumber", placeholder: "+970 5XX XXX XXX" },
    { icon: MapPin, label: "المدينة", name: "city", placeholder: "أدخل مدينتك" },
  ];
  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {fields.map((f, i) => (
          <motion.div key={f.name} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}>
            <InputField {...f} value={form[f.name]} onChange={handleChange} error={errors[f.name]} />
          </motion.div>
        ))}
      </div>
      <div className="mt-6 flex items-center justify-end gap-3 border-t border-gray-50 pt-4">
        <button onClick={onCancel} className="flex items-center gap-2 rounded-xl border border-gray-200 px-5 py-2 text-sm font-semibold text-gray-500 transition hover:bg-gray-50"><IconX size={14} /> إلغاء</button>
        <button onClick={handleSubmit} disabled={saving} className="flex items-center gap-2 rounded-xl bg-gradient-to-l from-orange-400 to-orange-500 px-5 py-2 text-sm font-bold text-white shadow-md transition disabled:opacity-60">
          {saving ? <Loader2 size={14} className="animate-spin" /> : <Save size={14} />} {saving ? "جاري الحفظ..." : "حفظ التغييرات"}
        </button>
      </div>
    </motion.div>
  );
};

// ══════════════════════════════════════════════════════════════
// TABS COMPONENTS
// ══════════════════════════════════════════════════════════════
const PersonalInfoTab = ({ user, loading, saving, onSave }) => {
  const [editMode, setEditMode] = useState(false);
  const handleSave = async (payload) => {
    const res = await onSave(payload);
    if (res?.ok) setEditMode(false);
  };
  const fields = [
    { icon: User, label: "الاسم الأول", value: user?.firstName },
    { icon: User, label: "الاسم الأخير", value: user?.lastName },
    { icon: Mail, label: "البريد الإلكتروني", value: user?.email },
    { icon: Phone, label: "رقم الهاتف", value: user?.phoneNumber },
    { icon: MapPin, label: "المدينة", value: user?.city },
    { icon: Calendar, label: "تاريخ الإنضمام", value: user?.createdAt ? new Date(user.createdAt).toLocaleDateString("ar-SA", { year: "numeric", month: "long", day: "numeric" }) : null },
  ];
  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <div><h3 className="text-sm font-bold text-gray-700">البيانات الشخصية</h3><p className="text-xs text-gray-400">بياناتك المسجلة في المنصة</p></div>
        {!loading && !editMode && (
          <motion.button whileTap={{ scale: 0.97 }} onClick={() => setEditMode(true)} className="flex items-center gap-1.5 rounded-xl border border-orange-200 bg-orange-50 px-3 py-1.5 text-xs font-bold text-orange-500 transition hover:bg-orange-100"><Edit3 size={12} /> تعديل</motion.button>
        )}
      </div>
      <AnimatePresence mode="wait">
        {editMode ? (
          <EditForm key="edit" user={user} saving={saving} onSave={handleSave} onCancel={() => setEditMode(false)} />
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {fields.map((f, i) => <ProfileField key={f.label} {...f} loading={loading} />)}
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

const SecurityTab = () => (
  <div className="space-y-4">
    {[{ title: "تغيير كلمة المرور", desc: "تحديث كلمة المرور لحماية حسابك", btn: "تغيير" }, { title: "التحقق بخطوتين", desc: "أضف طبقة حماية إضافية", btn: "تفعيل" }].map((item) => (
      <div key={item.title} className="flex items-center justify-between rounded-2xl border border-gray-100 bg-white p-4 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50"><Shield size={18} className="text-[#001e3c]" /></div>
          <div><p className="text-sm font-semibold text-gray-800">{item.title}</p><p className="text-xs text-gray-400">{item.desc}</p></div>
        </div>
        <button className="rounded-xl border border-orange-200 px-4 py-1.5 text-xs font-semibold text-orange-500 transition hover:bg-orange-50">{item.btn}</button>
      </div>
    ))}
  </div>
);

const RequestsTab = () => (
  <div className="flex flex-col items-center gap-4 py-12 text-center">
    <div className="flex h-20 w-20 items-center justify-center rounded-full bg-orange-50"><ClipboardList size={36} className="text-orange-400" /></div>
    <p className="text-lg font-bold text-gray-700">لا توجد طلبات بعد</p>
    <button className="rounded-xl bg-orange-500 px-6 py-2.5 text-sm font-bold text-white">استعرض الخدمات</button>
  </div>
);

// ══════════════════════════════════════════════════════════════
// SIDEBAR & HEADER
// ══════════════════════════════════════════════════════════════
const ProfileTabs = ({ activeTab, setActiveTab, user, loading }) => {
  const fullName = user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : "";
  const avatarUrl = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "U")}&background=ff9800&color=fff&size=200&bold=true`;
  return (
    <aside className="lg:col-span-1">
      <div className="sticky top-6 overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-sm">
        <div className="border-b border-gray-50 p-5 text-center">
          {loading ? <Skeleton className="mx-auto mb-3 h-14 w-14 rounded-full" /> : (
            <>
            <img 
  src={getFullImageUrl(user?.profileImage || user?.ProfileImage) || avatarUrl(fullName)} 
  alt="" 
  className="mx-auto mb-2 h-14 w-14 rounded-full object-cover ring-2 ring-orange-200" 
  onError={(e) => { e.target.src = avatarUrl(fullName); }}
/>
              <p className="text-sm font-bold text-gray-800">{fullName}</p>
              <p className="truncate text-xs text-gray-400">{user?.email}</p>
            </>
          )}
        </div>
        <nav className="p-3">
          {TABS.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} className={`mb-1 flex w-full items-center gap-3 rounded-xl px-4 py-3 text-sm font-semibold transition ${activeTab === tab.id ? "bg-[#001e3c] text-white shadow-md" : "text-gray-500 hover:bg-gray-50"}`}>
              <tab.icon size={16} className={activeTab === tab.id ? "text-orange-400" : ""} /><span className="flex-1 text-right">{tab.label}</span><ChevronRight size={14} className={activeTab === tab.id ? "rotate-180" : ""} />
            </button>
          ))}
        </nav>
      </div>
    </aside>
  );
};

const ProfileHeader = ({ user, loading, saving, onUploadImage }) => {
  const [imageHover, setImageHover] = useState(false);
  const fileInputRef = React.useRef(null);
  const roleBadge = ROLE_MAP[user?.role] || ROLE_MAP.User;
  const statusBadge = STATUS_MAP[user?.status] || STATUS_MAP.Active;
  const StatusIcon = statusBadge.icon;
  const fullName = user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : "";
  const avatarUrl = (name) => `https://ui-avatars.com/api/?name=${encodeURIComponent(name || "U")}&background=ff9800&color=fff&size=200&bold=true`;

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="relative mb-6 overflow-hidden rounded-3xl bg-gradient-to-l from-[#001e3c] to-[#003a6e] p-6 shadow-2xl sm:p-8">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={(e) => e.target.files[0] && onUploadImage(e.target.files[0])} />
      <div className="relative flex flex-col items-center gap-6 sm:flex-row sm:items-end">
        <div className="relative shrink-0 cursor-pointer" onClick={() => !saving && fileInputRef.current.click()} onMouseEnter={() => setImageHover(true)} onMouseLeave={() => setImageHover(false)}>
          <div className="h-24 w-24 overflow-hidden rounded-2xl ring-4 ring-orange-400/50 sm:h-28 sm:w-28 relative">
            {loading ? <Skeleton className="h-full w-full" /> : (
              <>
<img 
  src={getFullImageUrl(user?.profileImage || user?.ProfileImage) || avatarUrl(fullName)} 
  alt={fullName} 
  className={`h-full w-full object-cover transition-all duration-300 ${saving ? 'blur-sm opacity-50' : ''}`} 
  style={{ transform: imageHover ? "scale(1.1)" : "scale(1)" }} 
  onError={(e) => { e.target.src = avatarUrl(fullName); }}
/>
                {saving && <div className="absolute inset-0 flex items-center justify-center"><Loader2 className="animate-spin text-orange-400" /></div>}
              </>
            )}
          </div>
          <AnimatePresence>{imageHover && !loading && !saving && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40 backdrop-blur-sm"><Camera size={24} className="text-white" /></motion.div>
          )}</AnimatePresence>
          {!loading && <span className="absolute -bottom-1 -left-1 h-5 w-5 rounded-full border-2 border-[#001e3c]" style={{ background: statusBadge.color }} />}
        </div>
        <div className="flex flex-1 flex-col items-center gap-2.5 sm:items-start text-white">
          {loading ? <Skeleton className="h-8 w-52" /> : (
            <>
              <div className="flex items-center gap-2"><h1 className="text-2xl font-black sm:text-3xl">{fullName || "—"}</h1><BadgeCheck size={22} className="text-orange-400" /></div>
              <div className="flex gap-3 text-sm text-blue-200">{user?.city && <span className="flex items-center gap-1"><MapPin size={13} />{user.city}</span>}<span><Mail size={13} />{user?.email}</span></div>
              <div className="flex gap-2 pt-1">
                <span className="rounded-full px-3 py-0.5 text-xs font-bold" style={{ background: roleBadge.bg, color: roleBadge.color }}>{roleBadge.label}</span>
                <span className="flex items-center gap-1 rounded-full px-3 py-0.5 text-xs font-bold" style={{ background: statusBadge.bg, color: statusBadge.color }}><StatusIcon size={11} />{statusBadge.label}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </motion.div>
  );
};

// ══════════════════════════════════════════════════════════════
// DANGER ZONE
// ══════════════════════════════════════════════════════════════
const DangerZone = ({ toggling, onToggleStatus }) => {
  const [confirmDeactivate, setConfirmDeactivate] = useState(false);
  const toast = useToast();
  const handleDeactivate = async () => {
    const res = await onToggleStatus();
    if (res?.ok) { toast("تم تغيير حالة الحساب بنجاح"); setConfirmDeactivate(false); }
    else { toast(res?.error || "حدث خطأ", "error"); }
  };
  return (
    <div className="mt-8 overflow-hidden rounded-3xl border border-red-100 bg-white shadow-sm">
      <div className="flex items-center gap-3 border-b border-red-50 bg-red-50/60 px-6 py-4"><AlertTriangle size={18} className="text-red-500" /><h3 className="text-sm font-bold text-red-600">منطقة الخطر</h3></div>
      <div className="p-6">
        <div className="flex flex-col gap-3 rounded-2xl border border-red-100 p-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3"><div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-50"><UserX size={18} className="text-red-400" /></div><div><p className="text-sm font-semibold text-gray-800">تعطيل/تفعيل الحساب</p></div></div>
          {!confirmDeactivate ? <button onClick={() => setConfirmDeactivate(true)} className="rounded-xl border border-red-200 px-4 py-2 text-xs font-semibold text-red-500 hover:bg-red-50">تغيير الحالة</button> : (
            <div className="flex gap-2">
              <button onClick={handleDeactivate} disabled={toggling} className="rounded-xl bg-red-500 px-4 py-2 text-xs font-bold text-white disabled:opacity-60">{toggling ? <Loader2 size={12} className="animate-spin" /> : "تأكيد"}</button>
              <button onClick={() => setConfirmDeactivate(false)} className="rounded-xl border border-gray-200 px-4 py-2 text-xs font-semibold text-gray-500">إلغاء</button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

// ══════════════════════════════════════════════════════════════
// MAIN EXPORT
// ══════════════════════════════════════════════════════════════
const UserProfile = () => {
  const { user, loading, saving, toggling, error, fetchUser, updateUser, toggleStatus } = useUserProfile();
  const [activeTab, setActiveTab] = useState("personal");
  const toast = useToast();

  const handleSave = async (payload) => {
    const res = await updateUser(payload);
    if (res.ok) toast("تم حفظ التغييرات بنجاح ✓");
    else toast(res.error || "فشل الحفظ", "error");
    return res;
  };

  const handleUploadImage = async (file) => {
    const formData = new FormData();
    formData.append("FirstName", user.firstName);
    formData.append("LastName", user.lastName);
    formData.append("City", user.city || "");
    formData.append("PhoneNumber", user.phoneNumber || "");
    formData.append("ProfileImage", file);

    const res = await updateUser(formData);
    if (res.ok) toast("تم تحديث الصورة الشخصية بنجاح ✓");
    else toast(res.error || "فشل الرفع", "error");
  };

  return (
    <ToastProvider>
      <style>{`@import url('https://fonts.googleapis.com/css2?family=Tajawal:wght@300;400;500;700;800;900&display=swap'); *, *::before, *::after { font-family: 'Tajawal', sans-serif !important; } @keyframes skshimmer { 0% { background-position: 200% 0; } 100% { background-position: -200% 0; } }`}</style>
      <div dir="rtl" className="min-h-screen bg-[#f8f6f3] p-4 sm:p-6 lg:p-10">
        <div className="mx-auto max-w-5xl">
          <ProfileHeader user={user} loading={loading} saving={saving} onUploadImage={handleUploadImage} />
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-4">
            <ProfileTabs activeTab={activeTab} setActiveTab={setActiveTab} user={user} loading={loading} />
            <main className="lg:col-span-3">
              <div className="rounded-3xl border border-gray-100 bg-white p-6 shadow-sm">
                <div className="mb-5 border-b border-gray-50 pb-4"><h2 className="text-base font-black text-gray-800">{TABS.find(t => t.id === activeTab)?.label}</h2></div>
                <AnimatePresence mode="wait">
                  <motion.div key={activeTab} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                    {activeTab === "personal" && <PersonalInfoTab user={user} loading={loading} saving={saving} onSave={handleSave} />}
                    {activeTab === "security" && <SecurityTab />}
                    {activeTab === "requests" && <RequestsTab />}
                  </motion.div>
                </AnimatePresence>
              </div>
              <DangerZone toggling={toggling} onToggleStatus={toggleStatus} />
            </main>
          </div>
        </div>
      </div>
    </ToastProvider>
  );
};

export default UserProfile;