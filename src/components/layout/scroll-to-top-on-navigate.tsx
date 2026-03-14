'use client';

import { usePathname } from 'next/navigation';
import { useEffect, useRef } from 'react';

const SCROLL_CONTAINER_SELECTOR = '[data-dashboard-scroll]';

/**
 * Dashboard sayfa geçişlerinde scroll container'ı başa alır.
 * Next.js geri gidildiğinde scroll pozisyonunu restore ediyor; bu bileşen
 * her pathname değişiminde scroll'u sıfırlayarak sayfanın üstte başlamasını sağlar.
 */
export function ScrollToTopOnNavigate() {
  const pathname = usePathname();
  const prevPathnameRef = useRef(pathname);

  useEffect(() => {
    if (prevPathnameRef.current !== pathname) {
      prevPathnameRef.current = pathname;
      // Next.js scroll restoration async çalışabiliyor; bir sonraki frame'de reset ediyoruz
      const id = requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          const el = document.querySelector(SCROLL_CONTAINER_SELECTOR);
          if (el instanceof HTMLElement) {
            el.scrollTop = 0;
          }
        });
      });
      return () => cancelAnimationFrame(id);
    }
  }, [pathname]);

  return null;
}
