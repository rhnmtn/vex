import type { Viewport } from 'next';

/** Form sayfaları için viewport - zoom devre dışı, mobil input focus sorunlarını önler */
export const formViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false
};
