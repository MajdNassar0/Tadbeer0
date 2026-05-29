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
export const approveIdentity = async (userId) => {
  try {
    const response = await apiClient.post(`/Admin/Users/${userId}/identity-verification/approve`);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

/**
 * 3. رفض توثيق هوية مستخدم معين مع إرسال السبب
 * POST /api/Admin/Users/{id}/identity-verification/reject
 */
export const rejectIdentity = async (userId, reason) => {
  try {
    // الباكيند يتوقع المتغير "identityImageRejectionReason" في الـ Body
    const response = await apiClient.post(`/Admin/Users/${userId}/identity-verification/reject`, {
      identityImageRejectionReason: reason
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};