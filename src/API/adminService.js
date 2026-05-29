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
    throw new Error(error.response?.data?.message || error.response?.data || error.message || "فشل تحميل طلبات التوثيق");
  }
};

/**
 * 2. قبول وتوثيق حساب الحرفي
 * POST /api/Admin/Users/{id}/identity-verification/approve
 */
export const approveIdentity = async (id) => {
  try {
    const response = await apiClient.post(`/Admin/Users/${id}/identity-verification/approve`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.message || error.response?.data || error.message || "فشل إتمام عملية الموافقة");
  }
};

/**
 * 3. رفض طلب التوثيق مع سبب الرفض
 * POST /api/Admin/Users/{id}/identity-verification/reject
 */
export const rejectIdentity = async (id, reason) => {
  try {
    // إرسال كائن بالـ body يحتوي على الحقل "reason" كما تطلبه السكيما بالضبط
    const response = await apiClient.post(`/Admin/Users/${id}/identity-verification/reject`, {
      reason: reason
    });
    return response.data;
  } catch (error) {
    console.error("Reject API Error:", error.response);
    throw new Error(error.response?.data?.message || error.response?.data?.error || error.message || "فشل إرسال طلب الرفض");
  }
};