/**
 * İzin verilen yönlendirme URL'lerini kontrol eder (open redirect önlemi).
 * Sadece relative path; parent traversal (..) ve protocol-relative (//) reddedilir.
 */
export function getSafeRedirectUrl(url: string | undefined): string | null {
  if (!url || typeof url !== 'string') return null;
  const trimmed = url.trim();
  if (trimmed.startsWith('//') || trimmed.includes('..')) return null;
  if (trimmed === '/' || trimmed === '/dashboard' || trimmed.startsWith('/dashboard/')) {
    return trimmed;
  }
  return null;
}
