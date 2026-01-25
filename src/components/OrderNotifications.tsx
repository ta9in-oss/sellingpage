import { useOrderNotifications } from "@/hooks/useOrderNotifications";
import { ShoppingBag, MapPin, Zap } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getRelativeTimeInArabic, formatAggregatedOrderText } from "@/lib/timeUtils";

interface OrderNotificationsProps {
  userWilaya?: string;
  userCommune?: string;
}

export const OrderNotifications = ({ userWilaya, userCommune }: OrderNotificationsProps) => {
  const { currentNotification, hasNotifications } = useOrderNotifications(userWilaya, userCommune);

  // Don't render anything if there's no current notification
  if (!currentNotification) {
    return null;
  }

  const isFromSameWilaya = currentNotification.isUserWilaya;
  const isFromSameCommune = currentNotification.isUserCommune;
  const isLive = currentNotification.isLive;
  const isAggregated = currentNotification.type === 'aggregated';

  // Determine background color based on notification type
  const bgColor = isLive
    ? "bg-green-500" // Live orders - green
    : isFromSameCommune || isFromSameWilaya
      ? "bg-cyan-500" // Same location - cyan  
      : "bg-blue-500"; // Others - blue

  // Get notification title
  const getTitle = () => {
    if (isLive) {
      return (
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-yellow-300" />
          <span>طلب جديد!</span>
        </div>
      );
    }
    if (isFromSameCommune) {
      return (
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-yellow-300" />
          <span>طلب من بلديتك!</span>
        </div>
      );
    }
    if (isFromSameWilaya) {
      return (
        <div className="flex items-center gap-2">
          <MapPin size={14} className="text-yellow-300" />
          <span>طلب من ولايتك!</span>
        </div>
      );
    }
    return "طلب حديث!";
  };

  // Get notification description
  const getDescription = () => {
    if (isAggregated) {
      // Aggregated notification
      return formatAggregatedOrderText(
        currentNotification.count!,
        currentNotification.locationType!,
        currentNotification.location
      );
    } else {
      // Individual notification
      if (isFromSameCommune) {
        return `أحد سكان بلديتك "${currentNotification.location}" قام بطلب ${currentNotification.quantity}`;
      } else if (isFromSameWilaya) {
        return `أحد سكان ولايتك "${currentNotification.location}" قام بطلب ${currentNotification.quantity}`;
      } else {
        return `أحد سكان ${currentNotification.location} قام بطلب ${currentNotification.quantity}`;
      }
    }
  };

  // Show timestamp for individual recent/live orders only
  const showTimestamp = !isAggregated && currentNotification.timestamp;

  return (
    <div className="fixed bottom-4 left-4 z-50 w-80 min-w-[320px] animate-in slide-in-from-left-4 fade-in duration-500 ease-out">
      <Alert
        className={`${bgColor} text-white border-2 border-black shadow-[4px_4px_0px_0px_#000] rounded-none [&>svg+div]:translate-y-0 !grid-cols-none !block transition-all duration-300`}
        dir="rtl"
      >
        <div className="flex items-start gap-3">
          <ShoppingBag className="mt-0.5 h-4 w-4 text-white flex-shrink-0" />
          <div className="flex flex-col justify-center text-right flex-1 min-w-0">
            <AlertTitle className="text-white text-sm font-bold mb-1">
              {getTitle()}
            </AlertTitle>

            <AlertDescription className="text-white font-bold text-base leading-tight">
              {getDescription()}
            </AlertDescription>

            {(isFromSameCommune || isFromSameWilaya) && !isAggregated && (
              <AlertDescription className="text-xs text-yellow-200 mt-1 font-medium">
                {isFromSameCommune ? "جارك يثق بالمنتج - فرصة ذهبية! ✨" : "أهل ولايتك يثقون بالمنتج! 💫"}
              </AlertDescription>
            )}

            {showTimestamp && (
              <AlertDescription className="text-xs opacity-100 mt-1 text-white/90 font-medium">
                {getRelativeTimeInArabic(currentNotification.timestamp!)}
              </AlertDescription>
            )}
          </div>
        </div>
      </Alert>
    </div>
  );
};