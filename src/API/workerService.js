import apiClient from './axiosConfig';

// 1. جلب بيانات الملف الشخصي (Profile Me)
export const getMyProfile = async () => {
  try {
    const response = await apiClient.get('/Worker/Profile/me');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 2. تبديل حالة العامل (Available/Busy)
export const toggleStatus = async () => {
  try {
    const response = await apiClient.patch('/Worker/Profile/me/status-toggle');
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// 3. رفع صور معرض الأعمال (Work Images)
export const uploadWorkImage = async (imageFile) => {
  try {
    const formData = new FormData();
    formData.append('MainImage', imageFile); // تأكد من الاسم المطلوب في Swagger لرفع الصورة

    const response = await apiClient.post('/Worker/Profile/me/work-images', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};