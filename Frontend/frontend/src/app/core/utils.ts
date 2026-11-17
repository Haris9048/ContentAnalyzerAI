export function formatNumber(value: number): string {
  return new Intl.NumberFormat('en-IN').format(value || 0);
}

export function formatDate(value: string): string {
  if (!value) return '';

  return new Date(value).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });
}

export function formatFileSize(bytes: number): string {
  if (!bytes) return '0 MB';

  return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
}