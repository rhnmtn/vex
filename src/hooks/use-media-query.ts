import { useSyncExternalStore } from 'react';

const MEDIA_QUERY = '(max-width: 768px)';

function subscribe(callback: () => void) {
  const mq = window.matchMedia(MEDIA_QUERY);
  mq.addEventListener('change', callback);
  return () => mq.removeEventListener('change', callback);
}

function getSnapshot() {
  return window.matchMedia(MEDIA_QUERY).matches;
}

function getServerSnapshot() {
  return false;
}

export function useMediaQuery() {
  const isOpen = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);
  return { isOpen };
}
