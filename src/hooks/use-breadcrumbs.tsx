'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

type BreadcrumbItem = {
  title: string;
  link: string;
};

// Türkçe kısa etiketler (min. karakter)
const routeMapping: Record<string, BreadcrumbItem[]> = {
  '/dashboard': [{ title: 'Panel', link: '/dashboard' }],
  '/dashboard/overview': [
    { title: 'Panel', link: '/dashboard' },
    { title: 'Genel', link: '/dashboard/overview' }
  ],
  '/dashboard/users': [
    { title: 'Panel', link: '/dashboard' },
    { title: 'Kull.', link: '/dashboard/users' }
  ],
  '/dashboard/customers': [
    { title: 'Panel', link: '/dashboard' },
    { title: 'Müş.', link: '/dashboard/customers' }
  ],
  '/dashboard/posts': [
    { title: 'Panel', link: '/dashboard' },
    { title: 'Blog', link: '/dashboard/posts' }
  ],
  '/dashboard/post-categories': [
    { title: 'Panel', link: '/dashboard' },
    { title: 'Blog Kateg.', link: '/dashboard/post-categories' }
  ],
  '/dashboard/profile': [
    { title: 'Panel', link: '/dashboard' },
    { title: 'Profil', link: '/dashboard/profile' }
  ],
  '/dashboard/settings': [
    { title: 'Panel', link: '/dashboard' },
    { title: 'Ayar', link: '/dashboard/settings' }
  ]
};

const segmentLabels: Record<string, string> = {
  dashboard: 'Panel',
  overview: 'Genel',
  users: 'Kull.',
  customers: 'Müş.',
  posts: 'Blog',
  'post-categories': 'Blog Kateg.',
  profile: 'Profil',
  settings: 'Ayar'
};

export function useBreadcrumbs() {
  const pathname = usePathname();

  const breadcrumbs = useMemo(() => {
    if (routeMapping[pathname]) {
      return routeMapping[pathname];
    }

    const segments = pathname.split('/').filter(Boolean);
    return segments.map((segment, index) => {
      const path = `/${segments.slice(0, index + 1).join('/')}`;
      const title =
        segmentLabels[segment] ??
        (/^\d+$/.test(segment)
          ? 'Detay'
          : segment.charAt(0).toUpperCase() + segment.slice(1));
      return { title, link: path };
    });
  }, [pathname]);

  return breadcrumbs;
}
