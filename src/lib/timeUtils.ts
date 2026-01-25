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

/**
 * Check if an order is older than 24 hours
 */
export const isOlderThanOneDay = (timestamp: Date): boolean => {
  const now = new Date();
  const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
  return timestamp < oneDayAgo;
};

/**
 * Format aggregated order count with proper Arabic grammar
 * @param count - Number of orders
 * @param locationType - 'wilaya' or 'commune'
 * @param locationName - Name of the location
 */
export const formatAggregatedOrderText = (
  count: number,
  locationType: 'wilaya' | 'commune',
  locationName: string
): string => {
  const locationPrefix = locationType === 'wilaya' ? 'ولاية' : 'بلدية';

  if (count === 1) {
    return `تم تقديم طلب واحد من ${locationPrefix} ${locationName}`;
  } else if (count === 2) {
    return `تم تقديم طلبين من ${locationPrefix} ${locationName}`;
  } else if (count >= 3 && count <= 10) {
    return `تم تقديم ${count} طلبات من ${locationPrefix} ${locationName}`;
  } else if (count >= 11 && count <= 99) {
    return `تم تقديم ${count} طلبا من ${locationPrefix} ${locationName}`;
  } else {
    return `تم تقديم ${count} طلب من ${locationPrefix} ${locationName}`;
  }
};
