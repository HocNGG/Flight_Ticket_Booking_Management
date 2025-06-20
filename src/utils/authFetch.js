export function authFetch(url, options = {}) {
  const token = localStorage.getItem('access_token');
  return fetch(url, {
    ...options,
    headers: {
      ...(options.headers || {}),
      Authorization: token ? `Bearer ${token}` : undefined,
    },
  });
}

// Hàm tổng dùng cho mọi chỗ gọi API để lấy headers có Authorization
export function getAuthHeader(extraHeaders = {}) {
  const token = localStorage.getItem('access_token');
  return {
    ...extraHeaders,
    Authorization: token ? `Bearer ${token}` : undefined,
  };
} 