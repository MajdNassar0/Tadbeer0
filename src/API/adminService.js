import apiClient from './axiosConfig';

/**
 * 1. جلب كل طلبات توثيق الهوية المعلقة (Pending)
 * GET /api/Admin/Users/identity-verification/pending
 */
export const getPendingVerifications = async () => {
  try {
    const response = await apiClient.get('/Admin/Users/identity-verification/pending');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * 2. الموافقة على توثيق هوية مستخدم معين
 * POST /api/Admin/Users/{id}/identity-verification/approve
 */
export const approveIdentity = async (id) => {
  try {
    // تأكدي من حالة الأحرف الكابيتال للـ Users لتطابق سكيما السيرفر
    const response = await apiClient.put(`/Admin/Users/${id}/approve-identity`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
/**
 * 3. رفض توثيق هوية مستخدم معين مع إرسال السبب
 * POST /api/Admin/Users/{id}/identity-verification/reject
 */
// التعديل السحري لدالة الرفض لتطابق الباكيند بالملي
export const rejectIdentity = async (id, reason) => {
  try {
    // تمرير الـ reason داخل الـ params ليرسلها الأكسيوس بالـ URL كـ Query String
    const response = await apiClient.put(`/Admin/Users/${id}/reject-identity`, null, {
      params: { reason: reason }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};