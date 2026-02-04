import { config } from '../config';

declare global {
  interface Window {
    gtag?: (command: string, ...args: any[]) => void;
  }
}

export const trackEvent = (
  eventName: string,
  eventParams?: Record<string, any>
): void => {
  if (config.isProduction && window.gtag) {
    window.gtag('event', eventName, eventParams);
  } else if (config.isDevelopment) {
    console.log('📊 Analytics Event:', eventName, eventParams);
  }
};

export const trackPageView = (path: string): void => {
  if (config.isProduction && window.gtag) {
    window.gtag('config', config.analyticsId, {
      page_path: path,
    });
  }
};

export const trackError = (error: Error, errorInfo?: any): void => {
  if (config.isProduction && window.gtag) {
    window.gtag('event', 'exception', {
      description: error.message,
      fatal: false,
      ...errorInfo,
    });
  }
  console.error('Error tracked:', error, errorInfo);
};

// Custom event helpers
export const analytics = {
  contactFormSubmit: () => trackEvent('contact_form_submit'),
  cvDownload: (language: string) => trackEvent('cv_download', { language }),
  projectView: (projectId: string) => trackEvent('project_view', { project_id: projectId }),
  languageSwitch: (newLanguage: string) => trackEvent('language_switch', { language: newLanguage }),
  aiAssistantOpen: () => trackEvent('ai_assistant_open'),
  aiAssistantMessage: (messageType: string) => trackEvent('ai_assistant_message', { type: messageType }),
};
