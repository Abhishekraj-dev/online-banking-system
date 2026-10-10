export const PUBLIC_ROUTES = {
  HOME: '/',
  ABOUT: '/about',
  SERVICES: '/services',
  CONTACT: '/contact',
  LOGIN: '/login',
  REGISTER: '/register',
  FORGOT_PASSWORD: '/forgot-password',
} as const;

export const CUSTOMER_ROUTES = {
  DASHBOARD: '/dashboard',
  ACCOUNTS: '/accounts',
  TRANSACTIONS: '/transactions',
  TRANSFER: '/transfer',
  SERVICES: '/my-services',
  PROFILE: '/profile',
  SETTINGS: '/settings',
} as const;

export const ADMIN_ROUTES = {
  ROOT: '/admin',
  DASHBOARD: '/admin/dashboard',
  USERS: '/admin/users',
  TRANSACTIONS: '/admin/transactions',
  SERVICES: '/admin/services',
  SETTINGS: '/admin/settings',
  REPORTS: '/admin/reports',
} as const;

export const API_ROUTES = {
  AUTH: '/api/auth',
  USERS: '/api/users',
  ACCOUNTS: '/api/accounts',
  TRANSACTIONS: '/api/transactions',
  SERVICES: '/api/services',
  PROFILE: '/api/profile',
  ADMIN: {
    USERS: '/api/admin/users',
    TRANSACTIONS: '/api/admin/transactions',
    SETTINGS: '/api/admin/settings',
    REPORTS: '/api/admin/reports',
  },
} as const;
