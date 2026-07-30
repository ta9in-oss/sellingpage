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
 * Predefined FOMO designs. The accent colour (driven by the order type) is
 * applied via inline styles — NOT runtime-built Tailwind classes, which the
 * compiler can't see and would purge. brutalist = bold coloured card;
 * soft/minimal = white surface with a coloured start-rail; dark = dark surface.
 */
const VARIANTS: Record<NotificationVariant, {
  wrap: string
  filled: boolean // accent fills the whole card (brutalist) vs a rail/icon (others)
  title: string
  desc: string
}> = {
  brutalist: { wrap: "text-white border-2 border-black rounded-none shadow-[4px_4px_0px_0px_#000]", filled: true, title: "text-white", desc: "text-white" },
  soft: { wrap: "bg-white text-zinc-900 rounded-2xl shadow-xl border border-black/5", filled: false, title: "text-zinc-900", desc: "text-zinc-600" },
  minimal: { wrap: "bg-white text-zinc-900 rounded-lg border border-zinc-200 shadow-sm", filled: false, title: "text-zinc-900", desc: "text-zinc-500" },
  dark: { wrap: "bg-zinc-900 text-white rounded-xl border border-white/10 shadow-2xl", filled: false, title: "text-white", desc: "text-white/70" },
};

const ACCENT_HEX: Record<string, string> = { live: "#10b981", area: "#06b6d4", other: "#3b82f6" };

export const OrderNotifications = ({ userWilaya, userCommune, variant = "brutalist" }: OrderNotificationsProps) => {
  const { currentNotification } = useOrderNotifications(userWilaya, userCommune);
  if (!currentNotification) return null;

  const isFromSameWilaya = currentNotification.isUserWilaya;
  const isFromSameCommune = currentNotification.isUserCommune;
  const isLive = currentNotification.isLive;
  const isAggregated = currentNotification.type === "aggregated";

  const accentHex = ACCENT_HEX[isLive ? "live" : isFromSameCommune || isFromSameWilaya ? "area" : "other"];
  const preset = VARIANTS[variant] ?? VARIANTS.brutalist;

  const Icon = isLive ? Zap : isFromSameCommune || isFromSameWilaya ? MapPin : ShoppingBag;

  // Accent applied inline (no runtime Tailwind classes → no purge). Filled cards
  // paint the whole surface; others get a coloured start-rail + tinted icon chip.
  const cardStyle = preset.filled
    ? { backgroundColor: accentHex }
    : { borderInlineStartWidth: "4px", borderInlineStartColor: accentHex };
  const iconChipStyle = preset.filled ? undefined : { backgroundColor: `${accentHex}1a` };
  const iconColor = preset.filled ? "#ffffff" : accentHex;

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
      <div className={`p-4 transition-all duration-300 ${preset.wrap}`} style={cardStyle}>
        <div className="flex items-start gap-3">
          <div className={preset.filled ? "shrink-0" : "shrink-0 w-8 h-8 rounded-full flex items-center justify-center"} style={iconChipStyle}>
            <Icon className="h-4 w-4" style={{ color: iconColor }} />
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
