import { NavItem } from '@/types';

/**
 * Navigation configuration
 * Used by sidebar and Cmd+K bar.
 */
export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    url: '/dashboard/overview',
    icon: 'dashboard',
    isActive: false,
    shortcut: ['d', 'd'],
    items: []
  },
  {
    title: 'Product',
    url: '/dashboard/product',
    icon: 'product',
    shortcut: ['p', 'p'],
    isActive: false,
    items: []
  },
  {
    title: 'Kullanıcılar',
    url: '/dashboard/users',
    icon: 'teams',
    shortcut: ['u', 'u'],
    isActive: false,
    items: []
  },
  {
    title: 'Müşteriler',
    url: '/dashboard/customers',
    icon: 'user2',
    shortcut: ['c', 'c'],
    isActive: false,
    items: []
  },
  {
    title: 'Account',
    url: '#',
    icon: 'account',
    isActive: true,
    items: [
      {
        title: 'Login',
        shortcut: ['l', 'l'],
        url: '/auth/sign-in',
        icon: 'login'
      }
    ]
  }
];
