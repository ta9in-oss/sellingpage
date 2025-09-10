import { useState, useEffect, useCallback } from "react";
import { db } from "@/lib/instantdb";

interface OrderNotification {
  id: string;
  orderNumber: string;
  customerWilaya: string;
  quantity: number;
  timestamp: Date;
  isFromSameWilaya?: boolean;
  isInitial?: boolean;
}

interface UserLocationInfo {
  wilaya: string;
  totalOrdersFromWilaya: number;
}

export const useOrderNotifications = (userWilaya?: string) => {
  const [notifications, setNotifications] = useState<OrderNotification[]>([]);
  const [hasShownInitial, setHasShownInitial] = useState(false);
  const [totalOrdersFromUserWilaya, setTotalOrdersFromUserWilaya] = useState(0);
  
  const room = db.room("orderNotifications", "main");

  // Query to get existing orders for initial load and wilaya statistics
  const { data: ordersData } = db.useQuery({ orders: {} });

  // Calculate total orders from user's wilaya
  useEffect(() => {
    if (userWilaya && ordersData?.orders) {
      const wilayaOrdersCount = ordersData.orders.filter(
        order => order.customer_wilaya === userWilaya
      ).length;
      setTotalOrdersFromUserWilaya(wilayaOrdersCount);
    }
  }, [userWilaya, ordersData]);

  // Function to create notification from order data
  const createNotificationFromOrder = useCallback((order: any, isInitial = false): OrderNotification => {
    return {
      id: `${order.order_number}-${Date.now()}-${Math.random()}`,
      orderNumber: order.order_number,
      customerWilaya: order.customer_wilaya,
      quantity: order.quantity,
      timestamp: new Date(order.created_at),
      isFromSameWilaya: userWilaya ? order.customer_wilaya === userWilaya : false,
      isInitial
    };
  }, [userWilaya]);

  // Show initial notifications on first load
  useEffect(() => {
    if (!hasShownInitial && ordersData?.orders && ordersData.orders.length > 0) {
      const now = new Date();
      const thirtySecondsAgo = new Date(now.getTime() - 30 * 1000);
      
      // Get recent orders (within last 30 seconds - adjust timeframe as needed for demo)
      // For demo purposes, let's consider orders from the last 24 hours as "recent"
      const oneDayAgo = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      const recentOrders = ordersData.orders.filter(
        order => new Date(order.created_at) > oneDayAgo
      );

      let ordersToShow: any[] = [];

      if (recentOrders.length > 0) {
        // Show recent orders, prioritizing user's wilaya
        if (userWilaya) {
          const userWilayaOrders = recentOrders.filter(
            order => order.customer_wilaya === userWilaya
          );
          const otherOrders = recentOrders.filter(
            order => order.customer_wilaya !== userWilaya
          );
          
          // Show up to 2 from user's wilaya first, then others
          ordersToShow = [
            ...userWilayaOrders.slice(-2),
            ...otherOrders.slice(-1)
          ].slice(-3); // Show max 3 initial notifications
        } else {
          ordersToShow = recentOrders.slice(-3);
        }
      } else {
        // Show random older orders to build trust
        const olderOrders = [...ordersData.orders].sort(() => Math.random() - 0.5);
        ordersToShow = olderOrders.slice(0, 2);
      }

      // Create and show initial notifications with staggered timing
      ordersToShow.reverse().forEach((order, index) => {
        setTimeout(() => {
          const notification = createNotificationFromOrder(order, true);
          setNotifications(prev => [notification, ...prev]);
          
          // Auto-remove after 8 seconds
          setTimeout(() => {
            setNotifications(prev => 
              prev.filter(n => n.id !== notification.id)
            );
          }, 8000);
        }, index * 2000); // Stagger by 2 seconds
      });

      setHasShownInitial(true);
    }
  }, [ordersData, hasShownInitial, createNotificationFromOrder, userWilaya]);

  // Subscribe to new live order notifications
  db.rooms.useTopicEffect(
    room,
    "newOrder",
    ({ orderNumber, customerWilaya, quantity, timestamp }) => {
      const newNotification: OrderNotification = {
        id: `${orderNumber}-${Date.now()}`,
        orderNumber,
        customerWilaya,
        quantity,
        timestamp: new Date(timestamp),
        isFromSameWilaya: userWilaya ? customerWilaya === userWilaya : false,
        isInitial: false
      };

      // Add notification to the list
      setNotifications((prev) => [newNotification, ...prev]);

      // Auto-remove notification after 10 seconds for live notifications
      setTimeout(() => {
        setNotifications((prev) =>
          prev.filter((n) => n.id !== newNotification.id)
        );
      }, 10000);

      // Update wilaya count if it's from user's wilaya
      if (userWilaya && customerWilaya === userWilaya) {
        setTotalOrdersFromUserWilaya(prev => prev + 1);
      }
    }
  );

  // Function to publish new order notification
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

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return {
    notifications,
    sendOrderNotification,
    removeNotification,
    totalOrdersFromUserWilaya,
    userWilaya,
  };
};