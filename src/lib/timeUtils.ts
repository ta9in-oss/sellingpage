// lib/timeUtils.ts
export const getRelativeTimeInArabic = (timestamp: Date): string => {
  const now = new Date();
  const diffInMs = now.getTime() - timestamp.getTime();
  const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
  const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
  const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));

  if (diffInMinutes < 60) {
    if (diffInMinutes < 1) return "الآن";
    if (diffInMinutes === 1) return "منذ دقيقة";
    if (diffInMinutes === 2) return "منذ دقيقتين";
    if (diffInMinutes <= 10) return `منذ ${diffInMinutes} دقائق`;
    return `منذ ${diffInMinutes} دقيقة`;
  } else if (diffInHours < 24) {
    if (diffInHours === 1) return "منذ ساعة";
    if (diffInHours === 2) return "منذ ساعتين";
    if (diffInHours <= 10) return `منذ ${diffInHours} ساعات`;
    return `منذ ${diffInHours} ساعة`;
  } else {
    if (diffInDays === 1) return "قبل يوم";
    if (diffInDays === 2) return "قبل يومين";
    if (diffInDays <= 10) return `قبل ${diffInDays} أيام`;
    return `قبل ${diffInDays} يوم`;
  }
};
