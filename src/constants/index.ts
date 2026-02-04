export const CONTACT_INFO = {
  EMAIL: 'brandon@landaetta.dev',
  PHONE: '+573006361659',
  WHATSAPP: '+573006361659',
  LINKEDIN: 'https://www.linkedin.com/in/brandon-landaetta-70340ba2/',
  GITHUB: 'https://github.com/landaettadev',
  WEBSITE: 'https://brandonlandaetta.dev',
} as const;

export const SOCIAL_LINKS = {
  github: CONTACT_INFO.GITHUB,
  linkedin: CONTACT_INFO.LINKEDIN,
} as const;

export const CV_PATHS = {
  en: '/cv-en.pdf',
  es: '/cv-es.pdf',
} as const;

export const ROUTES = {
  HOME: '#home',
  ABOUT: '#about',
  STACK: '#stack',
  PROJECTS: '#projects',
  CONTACT: '#contact',
} as const;

export const ANIMATION_DURATIONS = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
} as const;

export const BREAKPOINTS = {
  SM: 640,
  MD: 768,
  LG: 1024,
  XL: 1280,
} as const;
