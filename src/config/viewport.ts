import type { Viewport } from 'next';

/**
 * Form sayfaları için viewport - zoom devre dışı, mobil input focus sorunlarını önler.
 * interactiveWidget: 'overlays-content' — Klavye içeriğin üzerine biner, viewport yeniden
 * boyutlanmaz; header kayması ve alta boşluk sorunlarını önler (Chrome 108+, Firefox 132+).
 */
export const formViewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  interactiveWidget: 'overlays-content'
};
