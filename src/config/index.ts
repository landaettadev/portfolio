export const config = {
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD,
  apiUrl: import.meta.env.VITE_API_URL || '',
  analyticsId: import.meta.env.VITE_GA_ID || 'G-FMJJXZFQXH',
  emailJsServiceId: import.meta.env.VITE_EMAILJS_SERVICE_ID || '',
  emailJsTemplateId: import.meta.env.VITE_EMAILJS_TEMPLATE_ID || '',
  emailJsPublicKey: import.meta.env.VITE_EMAILJS_PUBLIC_KEY || '',
} as const;
