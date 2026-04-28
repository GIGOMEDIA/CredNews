export const formatStoryDate = (value: string) =>
  new Intl.DateTimeFormat('en', {
    day: '2-digit',
    month: 'short',
  })
    .format(new Date(value))
    .toUpperCase();

export const getRelativePublishedTime = (value: string) => {
  const timestamp = new Date(value).getTime();

  if (!Number.isFinite(timestamp)) {
    return 'RECENTLY';
  }

  const diff = Math.max(0, Date.now() - timestamp);
  const minutes = Math.max(1, Math.round(diff / (1000 * 60)));

  if (minutes < 60) {
    return `ABOUT ${minutes} ${minutes === 1 ? 'MINUTE' : 'MINUTES'} AGO`;
  }

  const hours = Math.round(minutes / 60);

  if (hours < 24) {
    return `ABOUT ${hours} ${hours === 1 ? 'HOUR' : 'HOURS'} AGO`;
  }

  const days = Math.round(hours / 24);

  return `ABOUT ${days} ${days === 1 ? 'DAY' : 'DAYS'} AGO`;
};
