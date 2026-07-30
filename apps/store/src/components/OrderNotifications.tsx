import { useOrderNotifications } from "@/hooks/useOrderNotifications";
import { ShoppingBag, MapPin, Zap, CheckCircle2 } from "lucide-react";
import { getRelativeTimeInArabic, formatAggregatedOrderText } from "@/lib/timeUtils";

export type NotificationVariant = "brutalist" | "soft" | "minimal" | "dark";

interface OrderNotificationsProps {
  userWilaya?: string;
  userCommune?: string;
  /** Visual preset the merchant picked in the builder. */
  variant?: NotificationVariant;
}

/**
 * Predefined FOMO designs. `accent` is the emphasis colour driven by the order
 * type (live / same-area / other); `card`/`text` are the surface. brutalist =
 * bold coloured card; soft/minimal = white surface with a coloured rail; dark =
 * dark surface. One preset is picked per store.
 */
const VARIANTS: Record<NotificationVariant, {
  wrap: (accent: string) => string
  filled: boolean // accent fills the whole card (brutalist) vs a rail/icon (others)
  title: string
  desc: string
}> = {
  brutalist: {
    wrap: (a) => `${a} text-white border-2 border-black rounded-none shadow-[4px_4px_0px_0px_#000]`,
    filled: true,
    title: "text-white",
    desc: "text-white",
  },
  soft: {
    wrap: (a) => `bg-white text-zinc-900 rounded-2xl shadow-xl border border-black/5 border-s-4 ${a.replace("bg-", "border-s-")}`,
    filled: false,
    title: "text-zinc-900",
    desc: "text-zinc-600",
  },
  minimal: {
    wrap: (a) => `bg-white text-zinc-900 rounded-lg border border-zinc-200 border-s-4 ${a.replace("bg-", "border-s-")} shadow-sm`,
    filled: false,
    title: "text-zinc-900",
    desc: "text-zinc-500",
  },
  dark: {
    wrap: (a) => `bg-zinc-900 text-white rounded-xl border border-white/10 border-s-4 ${a.replace("bg-", "border-s-")} shadow-2xl`,
    filled: false,
    title: "text-white",
    desc: "text-white/70",
  },
};

export const OrderNotifications = ({ userWilaya, userCommune, variant = "brutalist" }: OrderNotificationsProps) => {
  const { currentNotification } = useOrderNotifications(userWilaya, userCommune);
  if (!currentNotification) return null;

  const isFromSameWilaya = currentNotification.isUserWilaya;
  const isFromSameCommune = currentNotification.isUserCommune;
  const isLive = currentNotification.isLive;
  const isAggregated = currentNotification.type === "aggregated";

  const accent = isLive ? "bg-emerald-500" : isFromSameCommune || isFromSameWilaya ? "bg-cyan-500" : "bg-blue-500";
  const preset = VARIANTS[variant] ?? VARIANTS.brutalist;
  // Icon colour: white on filled cards, the accent hue otherwise.
  const iconClass = preset.filled ? "text-white" : accent.replace("bg-", "text-");

  const Icon = isLive ? Zap : isFromSameCommune || isFromSameWilaya ? MapPin : ShoppingBag;

  const title = isLive
    ? "طلب جديد!"
    : isFromSameCommune
      ? "طلب من بلديتك!"
      : isFromSameWilaya
        ? "طلب من ولايتك!"
        : "طلب حديث!";

  const description = isAggregated
    ? formatAggregatedOrderText(currentNotification.count!, currentNotification.locationType!, currentNotification.location)
    : isFromSameCommune
      ? `أحد سكان بلديتك "${currentNotification.location}" قام بطلب ${currentNotification.quantity}`
      : isFromSameWilaya
        ? `أحد سكان ولايتك "${currentNotification.location}" قام بطلب ${currentNotification.quantity}`
        : `أحد سكان ${currentNotification.location} قام بطلب ${currentNotification.quantity}`;

  const showTimestamp = !isAggregated && currentNotification.timestamp;

  return (
    <div className="fixed bottom-4 left-4 z-50 w-80 min-w-[300px] max-w-[calc(100vw-2rem)] animate-in slide-in-from-left-4 fade-in duration-500 ease-out" dir="rtl">
      <div className={`p-4 transition-all duration-300 ${preset.wrap(accent)}`}>
        <div className="flex items-start gap-3">
          <div className={preset.filled ? "shrink-0" : `shrink-0 w-8 h-8 rounded-full ${accent}/10 flex items-center justify-center`}>
            <Icon className={`h-4 w-4 ${iconClass}`} />
          </div>
          <div className="flex flex-col text-right flex-1 min-w-0">
            <p className={`text-sm font-bold mb-0.5 flex items-center gap-1.5 ${preset.title}`}>
              {isLive && <CheckCircle2 size={13} className={preset.filled ? "text-yellow-300" : "text-emerald-500"} />}
              {title}
            </p>
            <p className={`font-bold text-sm leading-tight ${preset.desc}`}>{description}</p>
            {(isFromSameCommune || isFromSameWilaya) && !isAggregated && (
              <p className={`text-xs mt-1 font-medium ${preset.filled ? "text-yellow-200" : "opacity-70"}`}>
                {isFromSameCommune ? "جارك يثق بالمنتج - فرصة ذهبية! ✨" : "أهل ولايتك يثقون بالمنتج! 💫"}
              </p>
            )}
            {showTimestamp && (
              <p className={`text-xs mt-1 font-medium ${preset.filled ? "text-white/90" : "opacity-60"}`}>
                {getRelativeTimeInArabic(currentNotification.timestamp!)}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
