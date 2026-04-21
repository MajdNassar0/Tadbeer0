const IMAGE_BASE_URL = "https://tadbeer0.runasp.net";

export const getFullImageUrl = (path) => {
  if (!path) return null;
  if (path.startsWith('http')) return path; 
  return `${IMAGE_BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};