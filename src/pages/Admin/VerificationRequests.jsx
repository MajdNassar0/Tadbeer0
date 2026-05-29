import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldCheck, Eye, Loader2, AlertCircle, FileText, X } from "lucide-react";
import { getPendingVerifications, approveIdentity, rejectIdentity } from "../../API/adminService";
import { useToast } from "../../context/ToastContext";

const VerificationRequests = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // States للتحكم بالـ Modals
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
  const [rejectionReason, setRejectionReason] = useState("");
  const [submitting, setSubmitting] = useState(false);
  
  const toast = useToast();

  // جلب الطلبات المعلقة عند تحميل الصفحة
  const loadRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPendingVerifications();
      setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "فشل تحميل طلبات التوثيق");
      toast("حدث خطأ أثناء جلب البيانات", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  // دالة الموافقة على طلب التوثيق
  const handleApprove = async (workerId) => {
    setSubmitting(true);
    try {
      await approveIdentity(workerId);
      toast("تم قبول طلب التوثيق بنجاح! تم تفعيل الشارة وإرسال إشعار للعامل 💬✓", "success");
      setSelectedRequest(null);
      loadRequests(); // تحديث القائمة
    } catch (err) {
      toast(err.message || "فشل إتمام عملية الموافقة", "error");
    } finally {
      setSubmitting(false);
    }
  };

  // دالة رفض طلب التوثيق
  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast("الرجاء كتابة سبب الرفض أولاً", "error");
      return;
    }
    setSubmitting(true);
    try {
      const workerId = selectedRequest.id; 
      await rejectIdentity(workerId, rejectionReason);
      toast(`تم رفض الطلب وإرسال سبب الرفض للعامل: (${rejectionReason}) ❌`, "success");
      
      setIsRejectModalOpen(false);
      setSelectedRequest(null);
      setRejectionReason("");
      loadRequests(); // تحديث القائمة
    } catch (err) {
      toast(err.message || "فشل إرسال طلب الرفض", "error");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[400px] flex-col items-center justify-center gap-3 text-red-500">
        <AlertCircle size={40} />
        <p className="font-bold">{error}</p>
        <button onClick={loadRequests} className="px-4 py-2 bg-orange-500 text-white rounded-xl text-xs font-bold">إعادة المحاولة</button>
      </div>
    );
  }

  return (
    <div className="p-1 font-sans text-right" style={{ direction: "rtl" }}>
      <div className="mb-6">
        <h1 className="text-xl font-black text-gray-800 flex items-center gap-2">
          <ShieldCheck className="text-orange-500" size={24} />
          طلبات توثيق الهوية المعلقة
        </h1>
        <p className="text-xs text-gray-400 mt-1">قم بمراجعة وثائق الهوية المرفوعة من قبل الحرفيين للموافقة عليها أو رفضها.</p>
      </div>

      {requests.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-col items-center justify-center p-12 bg-white border border-gray-100 rounded-3xl text-gray-400"
        >
          <ShieldCheck size={48} className="text-gray-200 mb-2" />
          <p className="text-sm font-bold">لا توجد طلبات توثيق معلقة حالياً</p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {requests.map((req) => {
            // 🎯 تم التصحيح لتقرأ من الـ req المعرف بالـ map مية بالمية
            const requestFirstName = req?.user?.firstName || req?.worker?.firstName || req?.firstName || "";
            const requestLastName = req?.user?.lastName || req?.worker?.lastName || req?.lastName || "";
            const displayFullName = `${requestFirstName} ${requestLastName}`.trim() || "مستخدم غير معروف";
            const displayPhone = req?.user?.phoneNumber || req?.worker?.phoneNumber || req?.phoneNumber || "بدون رقم هاتف";

            return (
              <motion.div
                layout
                key={req.id || req.userId} // تم التصحيح هنا لـ req المضمون
                className="bg-white border border-gray-100 rounded-3xl p-5 shadow-sm hover:shadow-md transition flex flex-col justify-between"
              >
                <div>
                  <div className="flex flex-col text-right mb-3">
                    <h3 className="text-sm font-bold text-gray-800">
                      {displayFullName}
                    </h3>
                    
                  </div>

                  <div className="bg-gray-50 rounded-2xl p-3 mb-4 border border-gray-100/50 flex items-center justify-between">
                    <div className="flex items-center gap-2 text-gray-600">
                      <FileText size={16} className="text-gray-400" />
                      <span className="text-xs font-medium">وثيقة الهوية الشخصية</span>
                    </div>
                    <span className="text-[10px] bg-amber-50 text-amber-600 px-2 py-0.5 rounded-full font-bold animate-pulse">معلق</span>
                  </div>
                </div>

                <button
                  onClick={() => setSelectedRequest(req)}
                  className="w-full py-2 bg-[#001e3c] text-white hover:bg-[#002d5a] rounded-xl text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-lg shadow-blue-900/10"
                >
                  <Eye size={14} />
                  عرض ومراجعة الطلب
                </button>
              </motion.div>
            );
          })}
        </div>
      )}

      {/* ── مودال تفاصيل طلب التوثيق والمراجعة ────────────────── */}
      <AnimatePresence>
        {selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              className="w-full max-w-2xl bg-white rounded-3xl p-6 shadow-2xl relative overflow-hidden"
            >
              <button 
                onClick={() => setSelectedRequest(null)}
                className="absolute top-4 left-4 p-2 text-gray-400 hover:text-gray-600 bg-gray-50 hover:bg-gray-100 rounded-full transition"
              >
                <X size={16} />
              </button>

              <h2 className="text-base font-black text-gray-800 mb-4 flex items-center gap-2">
                مراجعة وثيقة العامل: {selectedRequest.user?.firstName || selectedRequest.firstName} {selectedRequest.user?.lastName || selectedRequest.lastName}
              </h2>

              {/* حاوية عرض الصورة المرفوعة من السيرفر */}
              <div className="w-full h-80 bg-gray-950 rounded-2xl overflow-hidden relative flex items-center justify-center border border-gray-100 mb-6">
                {selectedRequest?.identityImageUrl || selectedRequest?.identityImage ? (
                  <img 
                    src={(() => {
                      const raw = selectedRequest.identityImageUrl || selectedRequest.identityImage;
                      if (!raw) return null;
                      if (raw.startsWith("http")) return raw;
                      return `https://tadbeer0.runasp.net/${raw.replace(/^\//, "")}`;
                    })()}
                    alt="Identity"
                    className="w-full h-full object-contain select-none"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = "https://placehold.co/600x400?text=Error+Loading+Image";
                    }}
                  />
                ) : (
                  <div className="text-center text-gray-400">
                    <FileText size={48} className="mx-auto mb-2 opacity-50" />
                    <p className="text-xs">مسار صورة الهوية غير متاح في رد السيرفر</p>
                  </div>
                )}
              </div>

              {/* أزرار اتخاذ القرار الإداري */}
              <div className="flex gap-3 justify-end border-t border-gray-50 pt-4">
                <button
                  onClick={() => setIsRejectModalOpen(true)}
                  className="px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl text-xs font-bold transition"
                >
                  رفض الطلب
                </button>
                
                <button
                  disabled={submitting}
                  onClick={() => handleApprove(selectedRequest.id)}
                  className="px-6 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition shadow-lg shadow-green-700/20"
                >
                  {submitting ? <Loader2 size={15} className="animate-spin" /> : <ShieldCheck size={15} />}
                  قبول وتوثيق الحساب
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ── مودال كتابة سبب الرفض ────────────────── */}
      <AnimatePresence>
        {isRejectModalOpen && (
          <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-white rounded-2xl p-5 shadow-xl"
            >
              <h3 className="text-sm font-black text-gray-800 mb-2">تحديد سبب الرفض</h3>
              <p className="text-[11px] text-gray-400 mb-4">يرجى كتابة سبب واضح لرفض الصورة، حيث سيتم إظهار هذا السبب للعامل في صفحة إعداداته لكي يتمكن من تصحيحه.</p>

              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="مثال: صورة الهوية الشخصية غير واضحة أو الأطراف مقصوصة..."
                rows={4}
                className="w-full border border-gray-200 rounded-xl p-3 text-xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition resize-none text-right"
              />

              <div className="flex gap-2 justify-end mt-4">
                <button
                  onClick={() => {
                    setIsRejectModalOpen(false);
                    setRejectionReason("");
                  }}
                  className="px-4 py-2 bg-gray-50 hover:bg-gray-100 text-gray-500 rounded-xl text-xs font-bold transition"
                >
                  إلغاء
                </button>
                <button
                  disabled={submitting}
                  onClick={handleReject}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition"
                >
                  {submitting ? <Loader2 size={14} className="animate-spin" /> : null}
                  إرسال الرفض
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VerificationRequests;