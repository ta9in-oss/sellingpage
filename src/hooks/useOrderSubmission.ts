import { useState } from 'react';
import { id, tx } from '@instantdb/react';
import { db } from '@/lib/instantdb';

interface OrderFormData {
  name: string;
  email: string;
  phone: string;
  message?: string;
  wilaya: string;
  daira: string;
  commune: string;
  quantity: number;
  productId?: string;
}

interface UseOrderSubmissionReturn {
  isSubmitting: boolean;
  submitOrder: (formData: OrderFormData) => Promise<{ success: boolean; orderNumber?: string; error?: string }>;
}

export function useOrderSubmission(): UseOrderSubmissionReturn {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Query products to check if default product exists
  const { data: productsData } = db.useQuery({ products: {} });
  const products = productsData?.products || [];

  const generateOrderNumber = (): string => {
    const timestamp = Date.now().toString();
    const random = Math.random().toString(36).substring(2, 8).toUpperCase();
    return `ORD-${timestamp.slice(-6)}-${random}`;
  };

  const ensureDefaultProduct = async (): Promise<string> => {
    // Check if default product exists
    let defaultProduct = products.find(p => p.name === 'مونو باك الكلاسيكي');
    
    if (!defaultProduct) {
      // Create default product
      const productId = id();
      await db.transact([
        tx.products[productId].update({
          name: 'مونو باك الكلاسيكي',
          description: 'التصميم الأصلي بحزام واحد - مساحة تخزين 25 لتر، نايلون مقاوم للتمزق، وزن 1.2 كيلو',
          price: 2500,
          image: 'https://images.modeherz.de/item/images/309629/full/PIQUADRO-Blue-Square-Revamp-Mono-Sling-Bag-Verde---Nero-309629.jpg',
          is_available: true,
          stock: 100,
          created_at: new Date(),
          updated_at: new Date(),
        })
      ]);
      return productId;
    }
    
    return defaultProduct.id;
  };

  const submitOrder = async (formData: OrderFormData) => {
    setIsSubmitting(true);
    
    try {
      // Validate required fields
      if (!formData.name || !formData.phone || !formData.wilaya || !formData.daira || !formData.commune) {
        return { success: false, error: 'جميع الحقول المطلوبة يجب ملؤها' };
      }

      // Convert phone to number and validate
      const phoneStr = formData.phone.replace(/\D/g, '');
      const phoneNumber = parseInt(phoneStr);
      if (isNaN(phoneNumber) || phoneStr.length < 9) {
        return { success: false, error: 'رقم الهاتف غير صحيح' };
      }

     
      const productId = await ensureDefaultProduct();
      
      // Get product for stock check and price
      const product = products.find(p => p.id === productId) || { price: 2500, stock: 100 };
      
      if (product.stock < formData.quantity) {
        return { success: false, error: 'الكمية المطلوبة غير متوفرة في المخزون' };
      }

      const orderNumber = generateOrderNumber();
      const currentDate = new Date();
      
      const totalAmount = (product.price * formData.quantity).toString();
      
      // Create customer address string
      const customerAddress = `${formData.commune}, ${formData.daira}, ${formData.wilaya}`;

      // Generate unique order ID
      const orderId = id();

      // Create order 
      await db.transact([
        tx.orders[orderId].update({
          order_number: orderNumber,
          customer_name: formData.name.trim(),
          customer_email: formData.email?.trim() || '',
          customer_phone: phoneNumber,
          customer_address: customerAddress,
          customer_city: formData.commune,
          customer_wilaya: formData.wilaya,
          quantity: formData.quantity,
          status: {
            current: 'pending',
            history: [
              {
                status: 'pending',
                timestamp: currentDate.toISOString(),
                note: 'تم استلام الطلب',
                quantity: formData.quantity
              }
            ]
          },
          total_amount: totalAmount,
          created_at: currentDate,
          updated_at: currentDate,
        }),

        tx.orders[orderId].link({ product: productId }),
        // Update product stock
        tx.products[productId].update({
          stock: product.stock - formData.quantity,
          updated_at: currentDate
        })
      ]);

      return { success: true, orderNumber };
      
    } catch (error) {
      console.error('Error submitting order:', error);
      
      // Handle InstantDB errors
      if (error instanceof Error) {
        if (error.message.includes('unique')) {
          return { 
            success: false, 
            error: 'حدث خطأ في رقم الطلب. يرجى المحاولة مرة أخرى.' 
          };
        }
        if (error.message.includes('network') || error.message.includes('fetch')) {
          return { 
            success: false, 
            error: 'خطأ في الاتصال بالإنترنت. يرجى التحقق من الاتصال والمحاولة مرة أخرى.' 
          };
        }
      }
      
      return { 
        success: false, 
        error: 'حدث خطأ في إرسال الطلب. يرجى المحاولة مرة أخرى.' 
      };
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    isSubmitting,
    submitOrder,
  };
}