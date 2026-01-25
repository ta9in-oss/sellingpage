import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/instantdb";
import { isOlderThanOneDay, formatAggregatedOrderText } from "@/lib/timeUtils";

interface NotificationItem {
  id: string;
  type: 'individual' | 'aggregated';
  // For individual notifications
  orderNumber?: string;
  quantity?: number;
  timestamp?: Date;
  isLive?: boolean; // TRUE if from room topic (real-time)
  // For aggregated notifications
  count?: number;
  locationType?: 'wilaya' | 'commune';
  // Common fields
  location: string; // Wilaya or Commune name
  isRecent: boolean; // within 24 hours (for existing orders)
  isUserCommune: boolean;
  isUserWilaya: boolean;
}

interface Order {
  id: string;
  order_number: string;
  customer_wilaya: string;
  customer_city?: string;
  quantity: number;
  created_at: number | string;
}

const DISPLAY_DURATION = 2000; // 2 seconds
const GAP_DURATION = 1000; // 1 second

export const useOrderNotifications = (userWilaya?: string, userCommune?: string) => {
  const [notificationQueue, setNotificationQueue] = useState<NotificationItem[]>([]);
  const [currentNotification, setCurrentNotification] = useState<NotificationItem | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isInGap, setIsInGap] = useState(false);
  const [hasBuiltInitialQueue, setHasBuiltInitialQueue] = useState(false);

  const room = db.room("orderNotifications", "main");

  // Query to get existing orders for initial queue
  const { data: ordersData } = db.useQuery({ orders: {} });

  /**
   * Create an individual notification from an order
   */
  const createIndividualNotification = useCallback((
    order: Order,
    isLive: boolean = false
  ): NotificationItem => {
    const timestamp = new Date(order.created_at);
    return {
      id: `${order.order_number}-${Date.now()}-${Math.random()}`,
      type: 'individual',
      orderNumber: order.order_number,
      quantity: order.quantity,
      timestamp,
      isLive,
      location: order.customer_wilaya,
      isRecent: !isOlderThanOneDay(timestamp),
      isUserCommune: userCommune ? order.customer_city === userCommune : false,
      isUserWilaya: userWilaya ? order.customer_wilaya === userWilaya : false,
    };
  }, [userWilaya, userCommune]);

  /**
   * Aggregate older orders by location
   */
  const aggregateOrders = useCallback((orders: Order[]): NotificationItem[] => {
    // Group by wilaya and commune
    const groupedByWilaya = new Map<string, Order[]>();
    const groupedByCommune = new Map<string, Order[]>();

    orders.forEach(order => {
      // Group by wilaya
      const wilayaKey = order.customer_wilaya;
      if (!groupedByWilaya.has(wilayaKey)) {
        groupedByWilaya.set(wilayaKey, []);
      }
      groupedByWilaya.get(wilayaKey)!.push(order);

      // Group by commune if available
      if (order.customer_city) {
        const communeKey = `${order.customer_wilaya}::${order.customer_city}`;
        if (!groupedByCommune.has(communeKey)) {
          groupedByCommune.set(communeKey, []);
        }
        groupedByCommune.get(communeKey)!.push(order);
      }
    });

    const aggregatedNotifications: NotificationItem[] = [];

    // Create aggregated notifications for wilayas
    groupedByWilaya.forEach((orders, wilaya) => {
      aggregatedNotifications.push({
        id: `agg-wilaya-${wilaya}-${Date.now()}`,
        type: 'aggregated',
        count: orders.length,
        location: wilaya,
        locationType: 'wilaya',
        isRecent: false,
        isUserCommune: false,
        isUserWilaya: userWilaya === wilaya,
      });
    });

    // Create aggregated notifications for communes (if user has selected commune)
    if (userCommune) {
      groupedByCommune.forEach((orders, communeKey) => {
        const [wilaya, commune] = communeKey.split('::');
        aggregatedNotifications.push({
          id: `agg-commune-${communeKey}-${Date.now()}`,
          type: 'aggregated',
          count: orders.length,
          location: commune,
          locationType: 'commune',
          isRecent: false,
          isUserCommune: userCommune === commune,
          isUserWilaya: userWilaya === wilaya,
        });
      });
    }

    return aggregatedNotifications;
  }, [userWilaya, userCommune]);

  /**
   * Compare priority for sorting
   */
  const comparePriority = (a: NotificationItem, b: NotificationItem): number => {
    // Priority 1: User's commune (highest)
    if (a.isUserCommune && !b.isUserCommune) return -1;
    if (!a.isUserCommune && b.isUserCommune) return 1;

    // Priority 2: User's wilaya
    if (a.isUserWilaya && !b.isUserWilaya) return -1;
    if (!a.isUserWilaya && b.isUserWilaya) return 1;

    // Priority 3: Recent over old
    if (a.isRecent && !b.isRecent) return -1;
    if (!a.isRecent && b.isRecent) return 1;

    return 0;
  };

  /**
   * Build initial queue from existing database orders
   */
  const buildInitialQueue = useCallback((existingOrders: Order[]): NotificationItem[] => {
    const now = new Date();
    const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);

    // Separate recent vs old existing orders
    const recentOrders = existingOrders.filter(o => new Date(o.created_at) > oneDayAgo);
    const oldOrders = existingOrders.filter(o => new Date(o.created_at) <= oneDayAgo);

    // Create individual notifications for recent existing orders
    const recentNotifications = recentOrders.map(o => createIndividualNotification(o, false));

    // Create aggregated notifications for old orders
    const aggregatedNotifications = aggregateOrders(oldOrders);

    // Combine and sort by priority
    const allNotifications = [...recentNotifications, ...aggregatedNotifications];
    allNotifications.sort(comparePriority);

    return allNotifications;
  }, [createIndividualNotification, aggregateOrders]);

  /**
   * Build initial queue on first load
   */
  useEffect(() => {
    if (!hasBuiltInitialQueue && ordersData?.orders && ordersData.orders.length > 0) {
      const queue = buildInitialQueue(ordersData.orders);
      setNotificationQueue(queue);
      setHasBuiltInitialQueue(true);
    }
  }, [ordersData, hasBuiltInitialQueue, buildInitialQueue]);

  /**
   * Rebuild queue when user location changes
   */
  useEffect(() => {
    if (hasBuiltInitialQueue && ordersData?.orders) {
      const queue = buildInitialQueue(ordersData.orders);
      setNotificationQueue(queue);
      setCurrentIndex(0); // Reset to start
    }
  }, [userWilaya, userCommune]);

  /**
   * Sequential display logic with timing
   */
  useEffect(() => {
    if (notificationQueue.length === 0) {
      setCurrentNotification(null);
      return;
    }

    const displayNext = () => {
      // Show notification
      setCurrentNotification(notificationQueue[currentIndex]);
      setIsInGap(false);

      // After DISPLAY_DURATION, hide and enter gap
      const hideTimer = setTimeout(() => {
        setCurrentNotification(null);
        setIsInGap(true);

        // After GAP_DURATION, move to next notification
        const nextTimer = setTimeout(() => {
          setCurrentIndex((currentIndex + 1) % notificationQueue.length);
        }, GAP_DURATION);

        return () => clearTimeout(nextTimer);
      }, DISPLAY_DURATION);

      return () => clearTimeout(hideTimer);
    };

    const cleanup = displayNext();
    return cleanup;
  }, [currentIndex, notificationQueue]);

  /**
   * Subscribe to live order notifications from room
   */
  db.rooms.useTopicEffect(
    room,
    "newOrder",
    ({ orderNumber, customerWilaya, quantity, timestamp }) => {
      const liveOrder: Order = {
        id: orderNumber,
        order_number: orderNumber,
        customer_wilaya: customerWilaya,
        quantity: quantity,
        created_at: timestamp,
      };

      const liveNotification = createIndividualNotification(liveOrder, true);

      // Insert at position 0 (head of queue) to show next
      setNotificationQueue(prev => [liveNotification, ...prev]);

      // If in gap period, immediately skip to this notification
      if (isInGap) {
        setCurrentIndex(0);
      }
    }
  );

  /**
   * Function to publish new order notification to room
   */
  const publishOrderNotification = db.rooms.usePublishTopic(room, "newOrder");

  const sendOrderNotification = (
    orderNumber: string,
    customerWilaya: string,
    quantity: number
  ) => {
    publishOrderNotification({
      orderNumber,
      customerWilaya,
      quantity,
      timestamp: new Date().toISOString(),
    });
  };

  return {
    currentNotification,
    sendOrderNotification,
    hasNotifications: notificationQueue.length > 0,
  };
};