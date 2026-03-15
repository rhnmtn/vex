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
    title: 'Sayfalar',
    url: '/dashboard/pages',
    icon: 'page',
    shortcut: ['p', 'p'],
    isActive: false,
    items: []
  },
  {
    title: 'Blog',
    url: '#',
    icon: 'post',
    shortcut: ['b', 'b'],
    isActive: false,
    items: [
      {
        title: 'Blog Kategorileri',
        url: '/dashboard/post-categories',
        icon: 'folder',
        shortcut: ['k', 'k'],
        isActive: false,
        items: []
      },
      {
        title: 'Bloglar',
        url: '/dashboard/posts',
        icon: 'post',
        shortcut: ['b', 'p'],
        isActive: false,
        items: []
      }
    ]
  }
];
