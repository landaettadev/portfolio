export const config = {
  isProduction: import.meta.env.PROD,
  isDevelopment: import.meta.env.DEV,
  analyticsId: import.meta.env.VITE_GA_MEASUREMENT_ID || '',
};
