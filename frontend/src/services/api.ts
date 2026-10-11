
const API_BASE = 'https://aura-seoul.onrender.com/api';


function getGuestId(): string {
  let guestId = localStorage.getItem('aura_guest_id');
  if (!guestId) {
    guestId = 'guest_' + Math.random().toString(36).substring(2, 12) + Date.now().toString(36);
    localStorage.setItem('aura_guest_id', guestId);
  }
  return guestId;
}

function getAuthHeader(): Record<string, string> {
  const token = localStorage.getItem('aura_token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    'x-guest-id': getGuestId()
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const headers = {
    ...getAuthHeader(),
    ...(options.headers || {})
  };

  const response = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers
  });

  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || `Request failed with status ${response.status}`);
  }
  return data;
}

export const api = {
  // Content & Homepage
  getHomepageContent: () => request<any>('/content/homepage'),
  subscribeNewsletter: (email: string) => request<any>('/content/newsletter', {
    method: 'POST',
    body: JSON.stringify({ email })
  }),

  // Auth
  register: (body: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
  login: (body: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
  getMe: () => request<any>('/auth/me'),
  updateProfile: (body: any) => request<any>('/auth/profile', { method: 'PUT', body: JSON.stringify(body) }),
  changePassword: (body: any) => request<any>('/auth/change-password', { method: 'PUT', body: JSON.stringify(body) }),
  forgotPassword: (email: string) => request<any>('/auth/forgot-password', { method: 'POST', body: JSON.stringify({ email }) }),

  // Products
  getProducts: (params: Record<string, any> = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') {
        query.append(k, String(v));
      }
    });
    const qs = query.toString();
    return request<any>(`/products${qs ? `?${qs}` : ''}`);
  },
  getProductByIdentifier: (idOrSlug: string) => request<any>(`/products/${idOrSlug}`),
  getSearchSuggestions: (q: string) => request<any>(`/products/search/suggestions?q=${encodeURIComponent(q)}`),
  getRelatedProducts: (id: string) => request<any>(`/products/${id}/related`),

  // Categories
  getCategories: () => request<any>('/categories'),
  getCategoryBySlug: (slug: string) => request<any>(`/categories/${slug}`),

  // Cart
  getCart: () => request<any>('/cart'),
  addToCart: (item: { productId: string; size: string; color?: string; quantity?: number }) =>
    request<any>('/cart/add', { method: 'POST', body: JSON.stringify(item) }),
  updateCartQuantity: (item: { productId: string; size: string; color?: string; quantity: number }) =>
    request<any>('/cart/update', { method: 'PUT', body: JSON.stringify(item) }),
  removeFromCart: (item: { productId: string; size: string; color?: string }) =>
    request<any>('/cart/remove', { method: 'DELETE', body: JSON.stringify(item) }),
  applyCoupon: (code: string) =>
    request<any>('/cart/apply-coupon', { method: 'POST', body: JSON.stringify({ code }) }),
  removeCoupon: () =>
    request<any>('/cart/remove-coupon', { method: 'DELETE' }),
  clearCart: () => request<any>('/cart/clear', { method: 'DELETE' }),

  // Wishlist
  getWishlist: () => request<any>('/wishlist'),
  toggleWishlist: (productId: string) =>
    request<any>('/wishlist/toggle', { method: 'POST', body: JSON.stringify({ productId }) }),
  removeFromWishlist: (productId: string) =>
    request<any>(`/wishlist/${productId}`, { method: 'DELETE' }),

  // Addresses
  getAddresses: () => request<any>('/addresses'),
  addAddress: (body: any) => request<any>('/addresses', { method: 'POST', body: JSON.stringify(body) }),
  updateAddress: (id: string, body: any) => request<any>(`/addresses/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  setDefaultAddress: (id: string) => request<any>(`/addresses/${id}/default`, { method: 'PUT' }),
  deleteAddress: (id: string) => request<any>(`/addresses/${id}`, { method: 'DELETE' }),

  // Orders
  checkout: (body: any) => request<any>('/orders/checkout', { method: 'POST', body: JSON.stringify(body) }),
  getMyOrders: () => request<any>('/orders/my-orders'),
  getOrder: (idOrNumber: string) => request<any>(`/orders/${idOrNumber}`),
  trackOrder: (orderNumber: string, emailOrPhone: string) =>
    request<any>('/orders/track', { method: 'POST', body: JSON.stringify({ orderNumber, emailOrPhone }) }),
  cancelOrder: (id: string, reason: string) =>
    request<any>(`/orders/${id}/cancel`, { method: 'POST', body: JSON.stringify({ reason }) }),
  requestReturn: (id: string, body: any) =>
    request<any>(`/orders/${id}/return-request`, { method: 'POST', body: JSON.stringify(body) }),

  // Coupons
  getActiveCoupons: () => request<any>('/coupons/active'),
  validateCoupon: (code: string, subtotal: number) =>
    request<any>('/coupons/validate', { method: 'POST', body: JSON.stringify({ code, subtotal }) }),

  // Reviews
  getProductReviews: (productId: string) => request<any>(`/reviews/product/${productId}`),
  submitReview: (body: any) => request<any>('/reviews', { method: 'POST', body: JSON.stringify(body) }),

  // Admin
  getAdminMetrics: () => request<any>('/admin/metrics'),
  getAdminOrders: (params: Record<string, string> = {}) => {
    const qs = new URLSearchParams(params).toString();
    return request<any>(`/admin/orders${qs ? `?${qs}` : ''}`);
  },
  updateOrderStatus: (id: string, body: any) => request<any>(`/admin/orders/${id}/status`, { method: 'PUT', body: JSON.stringify(body) }),
  createAdminProduct: (body: any) => request<any>('/admin/products', { method: 'POST', body: JSON.stringify(body) }),
  updateAdminProduct: (id: string, body: any) => request<any>(`/admin/products/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteAdminProduct: (id: string) => request<any>(`/admin/products/${id}`, { method: 'DELETE' }),
  createAdminCategory: (body: any) => request<any>('/admin/categories', { method: 'POST', body: JSON.stringify(body) }),
  updateAdminCategory: (id: string, body: any) => request<any>(`/admin/categories/${id}`, { method: 'PUT', body: JSON.stringify(body) }),
  deleteAdminCategory: (id: string) => request<any>(`/admin/categories/${id}`, { method: 'DELETE' }),
  getAdminCustomers: () => request<any>('/admin/customers'),
  getAdminInventory: () => request<any>('/admin/inventory'),
  updateAdminStock: (body: any) => request<any>('/admin/inventory/update-stock', { method: 'PUT', body: JSON.stringify(body) }),
  getAdminCoupons: () => request<any>('/admin/coupons'),
  createAdminCoupon: (body: any) => request<any>('/admin/coupons', { method: 'POST', body: JSON.stringify(body) }),
  toggleAdminCoupon: (id: string) => request<any>(`/admin/coupons/${id}/toggle`, { method: 'PUT' }),
  deleteAdminCoupon: (id: string) => request<any>(`/admin/coupons/${id}`, { method: 'DELETE' }),
  updateAdminContent: (section: string, body: any) => request<any>(`/admin/content/${section}`, { method: 'PUT', body: JSON.stringify(body) })
};
