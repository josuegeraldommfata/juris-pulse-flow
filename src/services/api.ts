import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'https://n8n.example.com/webhook',
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('jwt_token');
      window.location.href = '/';
    }
    return Promise.reject(error);
  }
);

export const apiService = {
  // WhatsApp / Evolution API
  getInstances: () => api.get('/evolution/instances'),
  generateQRCode: (instanceName: string) => api.post('/evolution/qrcode', { instanceName }),
  disconnectInstance: (instanceName: string) => api.post('/evolution/disconnect', { instanceName }),
  restartInstance: (instanceName: string) => api.post('/evolution/restart', { instanceName }),

  // Leads & Triage
  getLeads: () => api.get('/leads'),
  getLeadConversation: (leadId: string) => api.get(`/leads/${leadId}/conversation`),

  // Tokens & Wallet
  getWallet: () => api.get('/wallet'),
  getConsumptionHistory: () => api.get('/wallet/history'),
  purchaseTokens: (planId: string) => api.post('/wallet/purchase', { planId }),

  // Admin
  getUsers: () => api.get('/admin/users'),
  injectTokens: (userId: string, amount: number) => api.post('/admin/inject-tokens', { userId, amount }),
  getGlobalMetrics: () => api.get('/admin/metrics'),
};

export default api;
