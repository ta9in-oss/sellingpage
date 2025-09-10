import { useOrderNotifications } from "@/hooks/useOrderNotifications";
import { X, ShoppingBag, MapPin, TrendingUp } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { getRelativeTimeInArabic } from "@/lib/timeUtils";
import { useEffect, useState } from "react";

interface OrderNotificationsProps {
  userWilaya?: string; 
}

export const OrderNotifications = ({ userWilaya }: OrderNotificationsProps) => {
  const { notifications, removeNotification, totalOrdersFromUserWilaya } =
    useOrderNotifications(userWilaya);

  const [showTotalCount, setShowTotalCount] = useState(false);

  // Show the total count when userWilaya changes and hide it after 8 seconds
  useEffect(() => {
    if (userWilaya && totalOrdersFromUserWilaya > 0) {
      setShowTotalCount(true);

      const timer = setTimeout(() => {
        setShowTotalCount(false);
      }, 8000); // Hide after 8 seconds

      return () => clearTimeout(timer);
    } else {
      setShowTotalCount(false);
    }
  }, [userWilaya, totalOrdersFromUserWilaya]);

  return (
    <div className="fixed bottom-4 left-4 z-50 space-y-2 max-w-sm">
      {/* Show total orders from user's wilaya if available */}
      {showTotalCount && userWilaya && totalOrdersFromUserWilaya > 0 && (
        <Alert
          className="bg-blue-500 text-white border-2 border-black shadow-[2px_2px_0px_0px_#000] rounded-none animate-in slide-in-from-bottom-full duration-300 flex justify-between items-center pr-2 [&>svg+div]:translate-y-0"
          dir="rtl"
        >
          <div className="flex items-start gap-3">
            <TrendingUp className="mt-0.5 h-4 w-4 text-white" />
            <div className="flex-col justify-center">
               <AlertTitle className="text-white text-sm font-bold">
                 إجمالي طلبات أهالي {userWilaya}: {totalOrdersFromUserWilaya}
              </AlertTitle>
              <AlertDescription className="text-blue-100 text-xs">
                الثقة تبدأ من المنطقة
              </AlertDescription>
            </div>
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="text-white hover:bg-blue-600 pl-0! rounded-none"
            onClick={() => setShowTotalCount(false)}
          >
            <X className="h-4 w-4" />
          </Button>
        </Alert>
      )}

      {/* Notification messages */}
      {notifications.map((notification) => {
        const isFromSameWilaya =
          userWilaya && notification.customerWilaya === userWilaya;

        return (
          <Alert
            key={notification.id}
            className="bg-green-500 text-white border-2 border-black shadow-[4px_4px_0px_0px_#000] rounded-none animate-in slide-in-from-right-full duration-300 flex justify-between items-start pr-2 [&>svg+div]:translate-y-0"
            dir="rtl"
          >
            <div className="flex items-start gap-3">
              <ShoppingBag className="mt-0.5 h-4 w-4 text-white" />
              <div className="flex-col justify-center text-right">
                <AlertTitle className="text-white text-sm font-bold mb-1 flex items-center gap-2">
                  {isFromSameWilaya 
                    ? "طلب من جارك!" 
                    : notification.isInitial ? "طلب حديث!" : "طلب جديد!"
                  }
                  {isFromSameWilaya && (
                    <MapPin size={14} className="text-yellow-300" />
                  )}
                </AlertTitle>

                <AlertDescription className="text-white font-bold text-base leading-tight">
                  {isFromSameWilaya ? (
                    <>
                      أحد سكان منطقتك{" "}
                      "{notification.customerWilaya}" قام بطلب{" "}
                      {notification.quantity}
                    </>
                  ) : (
                    <>
                      أحد سكان {notification.customerWilaya} قام بطلب{" "}
                      {notification.quantity}
                    </>
                  )}
                </AlertDescription>

                {isFromSameWilaya && (
                  <AlertDescription className="text-xs text-yellow-200 mt-1 font-medium">
                    جارك يثق بالمنتج - فرصة ذهبية! ✨
                  </AlertDescription>
                )}

                <AlertDescription className="text-xs opacity-100 mt-1 text-white/90 font-medium">
                  {getRelativeTimeInArabic(notification.timestamp)}
                </AlertDescription>
              </div>
            </div>

            <Button
              variant="ghost"
              size="icon"
              className="text-white hover:bg-green-600 pl-0! rounded-none"
              onClick={() => removeNotification(notification.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </Alert>
        );
      })}
    </div>
  );
};