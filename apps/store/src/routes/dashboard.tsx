import React, { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { 
  Package, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Printer, 
  Eye,
  LogOut,
  Send,
  Truck,
  UserPlus,
  Trash2, 
  Shield
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { db } from '@/lib/instantdb';
import { siteConfig } from '@/config/site.config';
import { LEGACY_PRODUCT_NUMBER } from '@/lib/content';
import { id } from "@instantdb/react";
import type { AppSchema } from '@/instant.schema';

export const Route = createFileRoute('/dashboard')({
  component: SellerDashboard,
});

// Define the Order interface
interface Order {
  id: string;
  created_at: string | number;
  updated_at: string | number;
  order_number: string;
  customer_name: string;
  customer_email: string;
  customer_phone: number;
  customer_address: string;
  customer_wilaya?: string;
  customer_city?: string;
  status?: string | { value: string; label: string };
  product?: any; 
  quantity?: number;
  total_amount?: number;
  payment_method?: 'cod' | 'chargily';
  payment_status?: 'not_required' | 'pending' | 'paid' | 'failed';
  chargily_checkout_id?: string;
}

const LoginScreen = ({ onSignIn, isLoading, error }) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('email');
  const [sentTo, setSentTo] = useState('');

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    try {
      const result = await onSignIn(email, step);
      // Only proceed to code step if email was successfully authorized and code was sent
      if (result === 'CODE_SENT') {
        setSentTo(email);
        setStep('code');
      }
      // If result is 'UNAUTHORIZED', stay on email step and error will be shown
    } catch (error) {
      console.error('Error sending code:', error);
    }
  };

  const handleVerifyCode = async (e) => {
    e.preventDefault();
    if (!code.trim()) return;
    
    try {
      await onSignIn(code, step);
    } catch (error) {
      console.error('Error verifying code:', error);
    }
  };

  const handleBack = () => {
    setStep('email');
    setCode('');
    setSentTo('');
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-6" dir="rtl" style={{ fontFamily: 'Almarai, sans-serif' }}>
      <div className="bg-white border-2 border-black p-8 transform -rotate-1 max-w-md w-full">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-black mb-4">لوحة تحكم البائع</h1>
          <div className="bg-black h-1 w-24 mx-auto mb-6"></div>
          <p className="text-lg font-bold">
            {step === 'email' ? 'أدخل بريدك الإلكتروني' : 'أدخل رمز التحقق'}
          </p>
        </div>
        
        {error && (
          <Alert className="mb-6 border-2 border-red-400 bg-red-50">
            <AlertDescription className="text-red-700 font-bold text-right">
              {error}
            </AlertDescription>
          </Alert>
        )}

        {step === 'email' ? (
          <form onSubmit={handleSendCode} className="space-y-4">
            <div>
              <Input
                type="email"
                placeholder="البريد الإلكتروني"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full border-2 border-black rounded-none font-bold text-right"
                required
                disabled={isLoading}
              />
            </div>
            
            <Button
              type="submit"
              disabled={!email.trim() || isLoading}
              className="w-full bg-yellow-400 text-black px-8 py-4 border-2 border-black rounded-none font-black text-lg hover:bg-yellow-300 transition-all duration-150 transform hover:translate-x-1 hover:translate-y-1 shadow-[2px_2px_0px_0px_#000] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent ml-2"></div>
                  جاري التحقق...
                </>
              ) : (
                <>
                  <Send className="ml-2" size={20} />
                  إرسال رمز التحقق
                </>
              )}
            </Button>
          </form>
        ) : (
          <div className="space-y-4">
            <div className="bg-green-50 border-2 border-green-400 p-4 text-center">
              <p className="font-bold text-green-700">
                تم إرسال رمز التحقق إلى:
              </p>
              <p className="font-black text-green-800 mt-1">{sentTo}</p>
            </div>
            
            <form onSubmit={handleVerifyCode} className="space-y-4">
              <div>
                <Input
                  type="text"
                  placeholder="رمز التحقق (6 أرقام)"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full border-2 border-black rounded-none font-bold text-center text-2xl tracking-widest"
                  maxLength={6}
                  required
                  disabled={isLoading}
                />
              </div>
              
              <Button
                type="submit"
                disabled={!code.trim() || isLoading}
                className="w-full bg-green-400 text-black px-8 py-4 border-2 border-black rounded-none font-black text-lg hover:bg-green-300 transition-all duration-150 transform hover:translate-x-1 hover:translate-y-1 shadow-[2px_2px_0px_0px_#000] disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-black border-t-transparent ml-2"></div>
                    جاري التحقق...
                  </>
                ) : (
                  <>
                    <CheckCircle className="ml-2" size={20} />
                    تسجيل الدخول
                  </>
                )}
              </Button>
              
              <Button
                type="button"
                onClick={handleBack}
                variant="outline"
                className="w-full border-2 border-black rounded-none font-bold hover:bg-gray-100"
                disabled={isLoading}
              >
                العودة لتغيير البريد الإلكتروني
              </Button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

const Dashboard = ({ user, onSignOut }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showUserManagement, setShowUserManagement] = useState(false);
  const [newUserEmail, setNewUserEmail] = useState('');
  const [newUserRole, setNewUserRole] = useState('seller');
  
  // Alert modal states
  const [alertModal, setAlertModal] = useState<{
    isOpen: boolean;
    type: 'success' | 'error' | 'confirm';
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({
    isOpen: false,
    type: 'success',
    title: '',
    message: '',
  });

  // Query orders from InstantDB
  const { data: ordersData, isLoading: ordersLoading } = db.useQuery({
    orders: {
      product: {}
    }
  });

  // Query products from InstantDB
  const { data: productsData } = db.useQuery({
    products: {}
  });

  // Query all users
  const { data: allUsersData } = db.useQuery({
    users: {}
  });

  const orders = ordersData?.orders || [];
  const products = productsData?.products || [];
  const users = allUsersData?.users || [];
  
  // Calculate total pending quantity
  const pendingOrdersQuantity = orders
    .filter(order => {
      const status = typeof order.status === 'string' ? order.status : order.status?.value;
      return status === 'pending';
    })
    .reduce((sum, order) => sum + (order.quantity || 0), 0);
  
  // Resolve the same product row the storefront reads, so the stock shown here
  // and the stock buyers see are always the same record.
  const storeProduct =
    products.find((p) => p.product_number === siteConfig.defaultProduct.productNumber) ??
    products.find((p) => p.product_number === LEGACY_PRODUCT_NUMBER) ??
    products[0];

  // current stock
  const availableStock = storeProduct?.stock || 0;

  // Merchant-editable stock. Seeded from the DB and re-synced whenever the stored
  // value changes underneath us (an order confirmed in another tab, say), except
  // while the merchant is mid-edit.
  const [stockInput, setStockInput] = useState<string>('');
  const [savingStock, setSavingStock] = useState(false);
  useEffect(() => {
    setStockInput(String(availableStock));
  }, [availableStock]);

  const saveStock = async () => {
    const next = Math.max(0, Math.floor(Number(stockInput)));
    if (!Number.isFinite(next)) return;
    setSavingStock(true);
    try {
      const existing = storeProduct;
      if (existing) {
        await db.transact(db.tx.products[existing.id].update({ stock: next, updated_at: new Date() }));
      } else {
        // No product row yet (nobody has ordered) — create it so stock is set.
        await db.transact(
          db.tx.products[id()].update({
            product_number: siteConfig.defaultProduct.productNumber,
            name: siteConfig.site.name,
            price: 0,
            is_available: true,
            stock: next,
            created_at: new Date(),
            updated_at: new Date(),
          })
        );
      }
      showAlert('success', 'تم الحفظ', `الكمية المتوفرة الآن ${next} وحدة`);
    } catch (e) {
      showAlert('error', 'تعذّر الحفظ', (e as Error)?.message ?? 'حاول مجدداً');
    } finally {
      setSavingStock(false);
    }
  };

  // Check if current user is admin (can manage users)
  const currentUser = users.find(u => u.email === user.email);
  const isAdmin = currentUser?.role === 'admin';

  //alert functions
  const showAlert = (type: 'success' | 'error', title: string, message: string) => {
    setAlertModal({
      isOpen: true,
      type,
      title,
      message,
    });
  };

  const showConfirm = (title: string, message: string, onConfirm: () => void) => {
    setAlertModal({
      isOpen: true,
      type: 'confirm',
      title,
      message,
      onConfirm,
      onCancel: () => setAlertModal(prev => ({ ...prev, isOpen: false })),
    });
  };

  const closeAlert = () => {
    setAlertModal(prev => ({ ...prev, isOpen: false }));
  };

  const addNewUser = async () => {
    if (!newUserEmail.trim()) return;

    try {
      await db.transact(
        db.tx.users[id()].update({
          email: newUserEmail.toLowerCase(),
          role: newUserRole,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
      );

      setNewUserEmail('');
      setNewUserRole('seller');
      showAlert('success', 'تم بنجاح!', 'تم إضافة المستخدم الجديد بنجاح');
    } catch (error) {
      console.error('Error adding user:', error);
      showAlert('error', 'خطأ!', 'حدث خطأ أثناء إضافة المستخدم');
    }
  };

  const removeUser = async (userId: string, userEmail: string) => {
    // Prevent admin from deleting themselves
    if (userEmail === user.email) {
      showAlert('error', 'غير مسموح!', 'لا يمكنك حذف حسابك الخاص');
      return;
    }

    showConfirm(
      'تأكيد حذف المستخدم',
      `هل أنت متأكد من حذف المستخدم ${userEmail}؟ لا يمكن التراجع عن هذا الإجراء.`,
      async () => {
        try {
          await db.transact(
            db.tx.users[userId].delete()
          );
          showAlert('success', 'تم الحذف!', 'تم حذف المستخدم بنجاح');
        } catch (error) {
          console.error('Error removing user:', error);
          showAlert('error', 'خطأ!', 'حدث خطأ أثناء حذف المستخدم');
        }
      }
    );
  };

  const getStatusColor = (status) => {
    if (typeof status === 'string') {
      const colors = {
        pending: 'bg-yellow-400 text-black',
        confirmed: 'bg-green-400 text-black',
        shipped: 'bg-blue-400 text-black', 
        cancelled: 'bg-red-400 text-white'
      };
      return colors[status] || 'bg-gray-400 text-black';
    }
    
    const colors = {
      pending: 'bg-yellow-400 text-black',
      confirmed: 'bg-green-400 text-black',
      shipped: 'bg-blue-400 text-black', 
      cancelled: 'bg-red-400 text-white'
    };
    return colors[status?.value] || 'bg-gray-400 text-black';
  };

  const getStatusIcon = (status) => {
    const statusValue = typeof status === 'string' ? status : status?.value;
    const icons = {
      pending: <Clock size={16} />,
      confirmed: <CheckCircle size={16} />,
      shipped: <Package size={16} />,
      cancelled: <XCircle size={16} />
    };
    return icons[statusValue] || <Clock size={16} />;
  };

  const getStatusLabel = (status) => {
    if (typeof status === 'string') {
      const labels = {
        pending: 'في الانتظار',
        confirmed: 'مؤكد',
        shipped: 'تم الشحن',
        cancelled: 'ملغى'
      };
      return labels[status] || status;
    }
    return status?.label || status?.value || 'غير محدد';
  };

  const updateOrderStatus = async (orderId: string, newStatus: { value: string; label: string }) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      const currentStatus = typeof order.status === 'string' ? order.status : order.status?.value;
      
      // Update order status in the database
      await db.transact(
        db.tx.orders[orderId].update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
      );

      // Update stock based on status change
      if (storeProduct) {
        const currentStock = storeProduct.stock || 0;
        const orderQuantity = order.quantity || 0;
        let newStock = currentStock;

        if (currentStatus === 'pending' && newStatus.value === 'confirmed') {
          newStock = currentStock;
        }
      
        else if ( newStatus.value === 'cancelled') {
          newStock = currentStock + orderQuantity;
        }

        // Update stock in the database if it changed
        if (newStock !== currentStock) {
          try {
            await db.transact(
              db.tx.products[storeProduct.id].update({
                stock: Math.max(0, newStock) // Ensure stock doesn't be negative
              })
            );
          } catch (error) {
            console.error('Error updating product stock:', error);
          }
        }
      }

      // Update selected order 
      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => ({
          ...prev!,
          status: newStatus,
          updated_at: new Date().toISOString()
        }));
      }
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  const filteredOrders = orders.filter(order => {
    const matchesSearch = order.customer_name?.includes(searchTerm) || 
                         order.order_number?.includes(searchTerm) ||
                         order.customer_phone?.toString().includes(searchTerm);
    
    const orderStatus = typeof order.status === 'string' ? order.status : order.status?.value;
    const matchesStatus = statusFilter === 'all' || orderStatus === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const printOrder = (order) => {
    const printContent = `
      <div style="font-family: Arial, sans-serif; direction: rtl; text-align: right; padding: 20px;">
        <h2>تفاصيل الطلب</h2>
        <hr>
        <p><strong>رقم الطلب:</strong> ${order.order_number}</p>
        <p><strong>اسم العميل:</strong> ${order.customer_name}</p>
        <p><strong>الهاتف:</strong> ${order.customer_phone}</p>
        <p><strong>العنوان:</strong> ${order.customer_address}</p>
        <p><strong>الولاية:</strong> ${order.customer_wilaya}</p>
        <p><strong>المدينة:</strong> ${order.customer_city}</p>
        <p><strong>الكمية:</strong> ${order.quantity}</p>
        <p><strong>المبلغ الإجمالي:</strong> ${order.total_amount} دج</p>
        <p><strong>الحالة:</strong> ${getStatusLabel(order.status)}</p>
        <p><strong>تاريخ الطلب:</strong> ${new Date(order.created_at).toLocaleDateString('ar-DZ')}</p>
      </div>
    `;
    
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      showAlert('error', 'تعذرت الطباعة!', 'لا يمكن فتح نافذة الطباعة. يرجى التأكد من السماح بالنوافذ المنبثقة لهذا الموقع.');
      return;
    }
    
    try {
      printWindow.document.write(printContent);
      printWindow.document.close();
      printWindow.onload = () => {
        printWindow.print();
      };
    } catch (error) {
      console.error('Error while printing:', error);
      showAlert('error', 'خطأ في الطباعة!', 'حدث خطأ أثناء محاولة الطباعة. يرجى المحاولة مرة أخرى.');
    }
  };

  if (ordersLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl font-bold">جاري تحميل الطلبات...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white" dir="rtl" style={{ fontFamily: 'Almarai, sans-serif' }}>
      {/* Header */}
      <div className="bg-white border-b-2 border-black p-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-black">لوحة تحكم البائع</h1>
            <p className="text-lg font-bold text-gray-600">إدارة الطلبات والمبيعات</p>
          </div>
          <div className="flex items-center gap-4">
            {isAdmin && (
              <Button
                onClick={() => setShowUserManagement(!showUserManagement)}
                className="bg-purple-400 text-black border-2 border-black rounded-none font-bold hover:bg-purple-300"
              >
                <Shield className="ml-2" size={16} />
                إدارة المستخدمين
              </Button>
            )}
            <div className="text-right">
              <p className="font-bold text-sm text-gray-600">مرحباً</p>
              <p className="font-black">{user?.email}</p>
              {currentUser?.role && (
                <p className="text-xs font-bold text-purple-600">
                  {currentUser.role === 'admin' ? 'مدير' : 'بائع'}
                </p>
              )}
            </div>
            <Button
              onClick={onSignOut}
              variant="outline"
              className="border-2 border-black rounded-none font-bold hover:bg-gray-100"
            >
              <LogOut className="ml-2" size={16} />
              تسجيل الخروج
            </Button>
          </div>
        </div>
      </div>

      <div className="p-6">
        {/* User Management Section */}
        {showUserManagement && isAdmin && (
          <div className="bg-white border-2 border-black p-6 mb-8">
            <h2 className="text-2xl font-black mb-4">إدارة المستخدمين</h2>
            
            {/* Add New User Form */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
              <Input
                type="email"
                placeholder="البريد الإلكتروني للمستخدم الجديد"
                value={newUserEmail}
                onChange={(e) => setNewUserEmail(e.target.value)}
                className="border-2 border-black rounded-none font-bold text-right"
              />
              <select
                value={newUserRole}
                onChange={(e) => setNewUserRole(e.target.value)}
                className="p-1 border-2 border-black rounded-none font-bold text-right bg-white"
              >
                <option value="seller">بائع</option>
                <option value="admin">مدير</option>
              </select>
              <Button
                onClick={addNewUser}
                disabled={!newUserEmail.trim()}
                className="bg-green-400 text-black border-2 border-black rounded-none font-bold hover:bg-green-300"
              >
                <UserPlus className="ml-2" size={16} />
                إضافة مستخدم
              </Button>
            </div>

            {/* Users List */}
            <div className="space-y-2">
              <h3 className="font-bold mb-2">المستخدمون الحاليون ({users.length}):</h3>
              {users.map((dbUser) => (
                <div key={dbUser.id} className="flex items-center justify-between p-4 bg-gray-50 border-2 border-gray-300">
                  <div className="flex items-center gap-4">
                    <span className="font-bold">{dbUser.email}</span>
                    <span className={`px-2 py-1 text-xs font-bold ${
                      dbUser.role === 'admin' ? 'bg-purple-400' : 'bg-blue-400'
                    } text-black border border-black`}>
                      {dbUser.role === 'admin' ? 'مدير' : 'بائع'}
                    </span>
                    {dbUser.email === user.email && (
                      <span className="px-2 py-1 text-xs font-bold bg-yellow-400 text-black border border-black">
                        أنت
                      </span>
                    )}
                  </div>
                  {dbUser.email !== user.email && (
                    <Button
                      onClick={() => removeUser(dbUser.id, dbUser.email)}
                      className="bg-red-400 text-white border-2 border-black rounded-none font-bold text-sm hover:bg-red-500"
                    >
                      <Trash2 size={14} />
                    </Button>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stock management — the merchant sets how many units are available.
            Orders still adjust it automatically as they are confirmed/cancelled. */}
        <div className="bg-white border-2 border-black p-6 mb-8">
          <div className="flex flex-col sm:flex-row sm:items-end gap-4 justify-between">
            <div>
              <h2 className="font-black text-lg mb-1">الكمية المتوفرة</h2>
              <p className="text-sm text-gray-600">
                حدّد عدد الوحدات المتبقية من منتجك. تظهر للزبون في صفحة الطلب، وتنقص تلقائياً مع كل طلب مؤكَّد.
              </p>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Input
                type="number"
                min={0}
                value={stockInput}
                onChange={(e) => setStockInput(e.target.value)}
                className="w-28 border-2 border-black rounded-none font-black text-lg text-center"
                dir="ltr"
              />
              <Button
                onClick={saveStock}
                disabled={savingStock || stockInput === '' || Number(stockInput) === availableStock}
                className="bg-yellow-400 text-black border-2 border-black rounded-none font-black hover:bg-yellow-300 disabled:opacity-50"
              >
                {savingStock ? 'جارٍ الحفظ...' : 'حفظ الكمية'}
              </Button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          {/* Real Stock Card */}
          <div className="bg-purple-400 text-black border-2 border-black p-6 transform rotate-1 hover:-rotate-1 transition-transform">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-bold text-sm">الكمية الفعلية في المخزون</p>
                <p className="font-black text-2xl">
                  {availableStock + pendingOrdersQuantity} وحدة
                </p>
              </div>
              <div className="text-black">
                <Package size={24} />
              </div>
            </div>
          </div>
          
          {/* Other Stats Cards */}
          {[
            { label: 'إجمالي الطلبات', value: orders.length, color: 'bg-yellow-400', icon: <Package /> },
            { 
              label: 'في الانتظار', 
              value: orders.filter(o => {
                const status = typeof o.status === 'string' ? o.status : o.status?.value;
                return status === 'pending';
              }).length, 
              color: 'bg-orange-400', 
              icon: <Clock /> 
            },
            { 
              label: 'مؤكدة', 
              value: orders.filter(o => {
                const status = typeof o.status === 'string' ? o.status : o.status?.value;
                return status === 'confirmed';
              }).length, 
              color: 'bg-green-400', 
              icon: <CheckCircle /> 
            },
            { 
              label: 'تم الشحن', 
              value: orders.filter(o => {
                const status = typeof o.status === 'string' ? o.status : o.status?.value;
                return status === 'shipped';
              }).length, 
              color: 'bg-blue-400', 
              icon: <Package /> 
            }
          ].map((stat, index) => (
            <div key={index} className={`${stat.color} text-black border-2 border-black p-6 transform rotate-1 hover:-rotate-1 transition-transform`}>
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-bold text-sm">{stat.label}</p>
                  <p className="font-black text-2xl">{stat.value}</p>
                </div>
                <div className="text-black">
                  {stat.icon}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white border-2 border-black p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Input
                type="text"
                placeholder="البحث بالاسم، رقم الطلب، أو الهاتف..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="border-2 border-black rounded-none font-bold text-right"
              />
            </div>
            <div>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full p-3 border-2 border-black rounded-none font-bold text-right bg-white"
              >
                <option value="all">جميع الحالات</option>
                <option value="pending">في الانتظار</option>
                <option value="confirmed">مؤكد</option>
                <option value="shipped">تم الشحن</option>
                <option value="cancelled">ملغى</option>
              </select>
            </div>
          </div>
        </div>

        {/* Orders Cards */}
        <div className="space-y-4">
          {filteredOrders.map((order, index) => (
            <div key={order.id} className="bg-white border-2 border-black p-4">
              <div className="flex items-center justify-between gap-4">
                {/* Order Info Section */}
                <div className="flex items-center gap-6 flex-1">
                  <div className="bg-black text-white px-3 py-2 border-2 border-black">
                    <span className="font-black text-sm">{order.order_number}</span>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-black text-lg">{order.customer_name}</p>
                    <p className="text-sm text-gray-600 font-bold">{order.customer_wilaya}</p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-mono font-bold">{order.customer_phone}</p>
                    <p className="text-sm text-gray-600 font-bold">
                      {new Date(order.created_at).toLocaleDateString('ar-DZ')}
                    </p>
                  </div>
                  
                  <div className="text-right">
                    <p className="font-black text-lg">{order.quantity} وحدة</p>
                    <p className="text-sm font-bold text-green-600">{order.total_amount} دج</p>
                  </div>
                  
                  <div className={`inline-flex items-center gap-2 px-3 py-1 border-2 border-black font-bold text-sm ${getStatusColor(order.status)}`}>
                    {getStatusIcon(order.status)}
                    {getStatusLabel(order.status)}
                  </div>
                  
                  {/* Payment badge */}
                  {order.payment_method === 'chargily' && (
                    <div className={`inline-flex items-center gap-1 px-2 py-1 border-2 border-black font-bold text-xs ${
                      order.payment_status === 'paid' ? 'bg-green-400' :
                      order.payment_status === 'failed' ? 'bg-red-400' :
                      'bg-yellow-300'
                    }`}>
                      💳 {order.payment_status === 'paid' ? 'مدفوع' : order.payment_status === 'failed' ? 'فشل' : 'معلق'}
                    </div>
                  )}
                </div>

                {/* Action Buttons Section */}
                <div className="flex items-center gap-2">
                {(() => {
                  const status = typeof order.status === 'string' ? order.status : order.status?.value;
                  const isFinalStatus = status === 'cancelled' || status === 'shipped';
                  
                  // If order is in final status (cancelled or shipped), show disabled buttons
                  if (isFinalStatus) {
                    return (
                      <div className="flex items-center gap-2">
                        <Button
                          disabled
                          className="border-2 border-gray-400 rounded-none font-bold text-sm bg-gray-200 text-gray-500 cursor-not-allowed"
                        >
                          <Truck size={14} className="ml-1" />
                          شحن
                        </Button>
                        <Button
                          disabled
                          className="border-2 border-gray-400 rounded-none font-bold text-sm bg-gray-200 text-gray-500 cursor-not-allowed"
                        >
                          <CheckCircle size={14} className="ml-1" />
                          تأكيد
                        </Button>
                        <Button
                          disabled
                          className="border-2 border-gray-400 rounded-none font-bold text-sm bg-red-100 text-gray-500 cursor-not-allowed"
                        >
                          <XCircle size={14} className="ml-1" />
                          ملغى
                        </Button>
                      </div>
                    );
                  }

                  // For non-cancelled orders, show appropriate buttons
                  return (
                    <>
                      {/* Show Ship button only for confirmed orders */}
                      {status === 'confirmed' && (
                        <Button
                          onClick={() => updateOrderStatus(order.id, { value: 'shipped', label: 'تم الشحن' })}
                          className="border-2 border-black rounded-none font-bold text-sm bg-blue-400 text-black hover:bg-blue-500 hover:text-white transition-all"
                        >
                          <Truck size={14} className="ml-1" />
                          شحن
                        </Button>
                      )}
                      
                      {/* Show Confirm button only for pending orders */}
                      {status === 'pending' && (
                        <Button
                          onClick={() => updateOrderStatus(order.id, { value: 'confirmed', label: 'مؤكد' })}
                          className="border-2 border-black rounded-none font-bold text-sm bg-green-200 text-black hover:bg-green-400 hover:text-black transition-all"
                        >
                          <CheckCircle size={14} className="ml-1" />
                          تأكيد
                        </Button>
                      )}
                      
                      <Button
                        onClick={() => updateOrderStatus(order.id, { value: 'cancelled', label: 'ملغى' })}
                        className="border-2 border-black rounded-none font-bold text-sm bg-red-200 text-black hover:bg-red-400 hover:text-white transition-all"
                      >
                        <XCircle size={14} className="ml-1" />
                        إلغاء
                      </Button>
                    </>
                  );
                })()}
                  <Button
                    onClick={() => setSelectedOrder({
                      ...order,
                      total_amount: Number(order.total_amount),
                      payment_method: order.payment_method as 'cod' | 'chargily' | undefined,
                      payment_status: order.payment_status as 'not_required' | 'pending' | 'paid' | 'failed' | undefined,
                    })}
                    className="bg-yellow-400 text-black border-2 border-black rounded-none font-bold text-sm hover:bg-yellow-300 px-3 py-2 transition-all"
                  >
                    <Eye size={16} />
                  </Button>
                  <Button
                    onClick={() => printOrder(order)}
                    className="bg-white text-black border-2 border-black rounded-none font-bold text-sm hover:bg-gray-100 px-3 py-2 transition-all"
                  >
                    <Printer size={16} />
                  </Button>
                </div>

              </div>
            </div>
          ))}
        </div>

        {filteredOrders.length === 0 && (
          <div className="text-center py-12">
            <Package size={48} className="mx-auto mb-4 text-gray-400" />
            <p className="text-xl font-bold text-gray-600">لا توجد طلبات مطابقة للبحث</p>
          </div>
        )}
      </div>

      {/* Order Details Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-6 z-50">
          <div className="bg-white border-4 border-black max-w-2xl w-full max-h-[90vh] overflow-y-auto scrollbar-hide">
          <div className="bg-black text-white p-4 relative">
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <Button
                onClick={() => setSelectedOrder(null)}
                variant="ghost"
                className="text-white hover:bg-gray-800"
              >
                <XCircle size={20} />
              </Button>
            </div>
            <h2 className="text-xl font-black text-center">تفاصيل الطلب</h2>
          </div>
            
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <label className="block font-black text-sm mb-1">رقم الطلب</label>
                    <p className="bg-gray-100 p-3 border-2 border-black font-bold">{selectedOrder.order_number}</p>
                  </div>
                  <div>
                    <label className="block font-black text-sm mb-1">اسم العميل</label>
                    <p className="bg-gray-100 p-3 border-2 border-black font-bold">{selectedOrder.customer_name}</p>
                  </div>
                  <div>
                    <label className="block font-black text-sm mb-1">الهاتف</label>
                    <p className="bg-gray-100 p-3 border-2 border-black font-bold">{selectedOrder.customer_phone}</p>
                  </div>
                  <div>
                    <label className="block font-black text-sm mb-1">البريد الإلكتروني</label>
                    <p className="bg-gray-100 p-3 border-2 border-black font-bold">{selectedOrder.customer_email}</p>
                  </div>
                </div>
                <div className="space-y-4">
                  <div>
                    <label className="block font-black text-sm mb-1">الولاية</label>
                    <p className="bg-gray-100 p-3 border-2 border-black font-bold">{selectedOrder.customer_wilaya}</p>
                  </div>
                  <div>
                    <label className="block font-black text-sm mb-1">المدينة</label>
                    <p className="bg-gray-100 p-3 border-2 border-black font-bold">{selectedOrder.customer_city}</p>
                  </div>
                  <div>
                    <label className="block font-black text-sm mb-1">العنوان</label>
                    <p className="bg-gray-100 p-3 border-2 border-black font-bold">{selectedOrder.customer_address}</p>
                  </div>
                  <div>
                    <label className="block font-black text-sm mb-1">الكمية</label>
                    <p className="bg-gray-100 p-3 border-2 border-black font-bold text-center">{selectedOrder.quantity}</p>
                  </div>
                </div>
              </div>

              <div>
                <label className="block font-black text-sm mb-1">المبلغ الإجمالي</label>
                <p className="bg-yellow-400 p-3 border-2 border-black font-black text-center">{selectedOrder.total_amount} دج</p>
              </div>
              
              <div>
                <label className="block font-black text-sm mb-1">طريقة الدفع</label>
                <div className="flex gap-2">
                  <span className={`px-3 py-2 border-2 border-black font-bold text-sm ${selectedOrder.payment_method === 'chargily' ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    {selectedOrder.payment_method === 'chargily' ? '💳 دفع إلكتروني' : '🚚 الدفع عند الاستلام'}
                  </span>
                  {selectedOrder.payment_method === 'chargily' && (
                    <span className={`px-3 py-2 border-2 border-black font-bold text-sm ${
                      selectedOrder.payment_status === 'paid' ? 'bg-green-400' :
                      selectedOrder.payment_status === 'failed' ? 'bg-red-400' :
                      'bg-yellow-300'
                    }`}>
                      {selectedOrder.payment_status === 'paid' ? '✅ مدفوع' : selectedOrder.payment_status === 'failed' ? '❌ فشل' : '⏳ معلق'}
                    </span>
                  )}
                </div>
              </div>

              <div>
                <label className="block font-black text-sm mb-2">تحديث حالة الطلب</label>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { value: 'pending', label: 'في الانتظار', color: 'bg-yellow-400', icon: <Clock size={16} /> },
                    { value: 'confirmed', label: 'مؤكد', color: 'bg-green-400', icon: <CheckCircle size={16} /> },
                    { value: 'shipped', label: 'تم الشحن', color: 'bg-blue-400', icon: <Package size={16} /> },
                    { value: 'cancelled', label: 'ملغى', color: 'bg-red-400 text-white', icon: <XCircle size={16} /> }
                  ].map((status) => {
                    const currentStatus = typeof selectedOrder.status === 'string' ? selectedOrder.status : selectedOrder.status?.value;
                    const isActive = currentStatus === status.value;
                    const isDisabled = (currentStatus === 'cancelled' || currentStatus === 'shipped') && !isActive;
                    
                    return (
                      <Button
                        key={status.value}
                        onClick={() => !isDisabled && updateOrderStatus(selectedOrder.id, { value: status.value, label: status.label })}
                        className={`${status.color} border-2 border-black rounded-none font-bold text-sm transition-all transform ${
                          isActive 
                            ? 'ring-4 ring-black scale-105 shadow-lg cursor-default' 
                            : isDisabled 
                              ? 'opacity-50 cursor-not-allowed' 
                              : 'hover:scale-105 hover:shadow-md'
                        }`}
                        disabled={isDisabled}
                      >
                        <div className="flex items-center gap-1">
                          {status.icon}
                          {status.label}
                        </div>
                      </Button>
                    );
                  })}
                </div>
                {(() => {
                  const status = typeof selectedOrder.status === 'string' ? selectedOrder.status : selectedOrder.status?.value;
                  if (status === 'cancelled') {
                    return <p className="text-sm text-red-600 mt-2 text-center">لا يمكن تغيير حالة الطلب الملغى</p>;
                  } else if (status === 'shipped') {
                    return <p className="text-sm text-blue-600 mt-2 text-center">تم شحن الطلب بنجاح ولا يمكن تعديل حالته</p>;
                  }
                  return null;
                })()}
              </div>

              <div className="flex gap-3">
                <Button
                  onClick={() => printOrder(selectedOrder)}
                  className="flex-1 bg-black text-white border-2 border-black rounded-none font-bold"
                >
                  <Printer className="ml-2" size={16} />
                  طباعة الطلب
                </Button>
                <Button
                  onClick={() => setSelectedOrder(null)}
                  variant="outline"
                  className="flex-1 border-2 border-black rounded-none font-bold"
                >
                  إغلاق
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/*  Alert Modal */}
      {alertModal.isOpen && (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center p-6 z-50">
          <div className="bg-white border-4 border-black max-w-md w-full ">
            {/* Header */}
            <div className={`p-4 text-center border-b-2 border-black ${
              alertModal.type === 'success' 
                ? 'bg-green-400 text-black' 
                : alertModal.type === 'error' 
                  ? 'bg-red-400 text-white' 
                  : 'bg-yellow-400 text-black'
            }`}>
              <div className="flex items-center justify-center gap-3">
                {alertModal.type === 'success' && <CheckCircle size={24} />}
                {alertModal.type === 'error' && <XCircle size={24} />}
                {alertModal.type === 'confirm' && <Clock size={24} />}
                <h3 className="text-xl font-black">{alertModal.title}</h3>
              </div>
            </div>
            
            {/* Content */}
            <div className="p-6">
              <p className="text-center font-bold text-lg mb-6 text-gray-800">
                {alertModal.message}
              </p>
              
              {/* Buttons */}
              <div className="flex gap-3">
                {alertModal.type === 'confirm' ? (
                  <>
                    <Button
                      onClick={() => {
                        alertModal.onConfirm?.();
                        closeAlert();
                      }}
                      className="flex-1 bg-red-400 text-white border-2 border-black rounded-none font-black hover:bg-red-500 transition-all transform hover:scale-105 shadow-[2px_2px_0px_0px_#000]"
                    >
                      <CheckCircle className="ml-2" size={16} />
                      تأكيد
                    </Button>
                    <Button
                      onClick={() => {
                        alertModal.onCancel?.();
                        closeAlert();
                      }}
                      className="flex-1 bg-gray-400 text-black border-2 border-black rounded-none font-black hover:bg-gray-500 transition-all transform hover:scale-105 shadow-[2px_2px_0px_0px_#000]"
                    >
                      <XCircle className="ml-2" size={16} />
                      إلغاء
                    </Button>
                  </>
                ) : (
                  <Button
                    onClick={closeAlert}
                    className={`w-full border-2 border-black rounded-none font-black text-lg transition-all transform hover:scale-105 shadow-[2px_2px_0px_0px_#000] ${
                      alertModal.type === 'success' 
                        ? 'bg-green-400 text-black hover:bg-green-500' 
                        : 'bg-red-400 text-white hover:bg-red-500'
                    }`}
                  >
                    <CheckCircle className="ml-2" size={16} />
                    حسناً
                  </Button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default function SellerDashboard() {
  const { user, isLoading } = db.useAuth();
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [sentEmail, setSentEmail] = useState('');

  // Query all users
  const { data: allUsersData, isLoading: usersLoading } = db.useQuery({
    users: {}
  });

  // Get current authorized user using find
  const getCurrentUser = React.useCallback(() => {
    if (!user || !allUsersData?.users) return null;
    return allUsersData.users.find(
      (dbUser: any) => dbUser.email?.toLowerCase() === user.email?.toLowerCase()
    );
  }, [user, allUsersData]);

  const currentAuthorizedUser = getCurrentUser();
  const isAuthorizedUser = !!currentAuthorizedUser && (currentAuthorizedUser.role === 'admin' || currentAuthorizedUser.role === 'seller');

  console.log('All users:', allUsersData?.users);
  console.log('Current user email:', user?.email);
  console.log('Current authorized user:', currentAuthorizedUser);
  console.log('isAuthorizedUser', isAuthorizedUser);

  const checkUserAuthorization = (email: string) => {
    if (!allUsersData?.users) {
      console.log('Users data not loaded yet');
      return false;
    }

    const foundUser = allUsersData.users.find(
      (dbUser: any) => dbUser.email?.toLowerCase() === email.toLowerCase()
    );

    console.log('Checking authorization for:', email);
    console.log('Found user:', foundUser);

    // Check if user exists and has admin or seller role
    return foundUser && (foundUser.role === 'admin' || foundUser.role === 'seller');
  };

  const handleAuth = async (emailOrCode, step) => {
    setAuthLoading(true);
    setAuthError('');
    
    try {
      if (step === 'email') {
        // First check if the email is authorized using loaded data
        const isAuthorized = checkUserAuthorization(emailOrCode);
        
        if (!isAuthorized) {
          setAuthError('هذا البريد الإلكتروني غير مخول للوصول إلى هذه اللوحة. يرجى التواصل مع المدير.');
          setAuthLoading(false);
          return 'UNAUTHORIZED'; // Return status to indicate unauthorized
        }
        
        // Send magic code to email if authorized
        await db.auth.sendMagicCode({ email: emailOrCode });
        setSentEmail(emailOrCode);
        return 'CODE_SENT'; // Return status to indicate code was sent successfully
      } else if (step === 'code') {
        // Sign in with the magic code
        await db.auth.signInWithMagicCode({ email: sentEmail, code: emailOrCode });
        return 'SIGNED_IN'; // Return status to indicate successful sign in
      }
    } catch (error) {
      console.error('Auth error:', error);
      setAuthError(
        step === 'email' 
          ? 'فشل في إرسال رمز التحقق. تأكد من صحة البريد الإلكتروني.'
          : 'رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.'
      );
      return 'ERROR'; // Return error status
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = () => {
    db.auth.signOut();
    setAuthError('');
    setSentEmail('');
  };

  // Show loading state while checking authentication and users data
  if (isLoading || usersLoading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-black border-t-transparent mx-auto mb-4"></div>
          <p className="text-xl font-bold">جاري الدخول...</p>
        </div>
      </div>
    );
  }

  // Show login screen if user is not authenticated
  if (!user) {
    return (
      <LoginScreen 
        onSignIn={handleAuth}
        isLoading={authLoading}
        error={authError}
      />
    );
  }

  // Show unauthorized message if user is authenticated but not in users table or doesn't have proper role
  if (user && !isAuthorizedUser) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center p-6" dir="rtl" style={{ fontFamily: 'Almarai, sans-serif' }}>
        <div className="bg-white border-2 border-red-500 p-8 transform -rotate-1 max-w-md w-full text-center">
          <div className="mb-6">
            <XCircle className="mx-auto mb-4 text-red-500" size={48} />
            <h1 className="text-2xl font-black mb-4 text-red-600">غير مخول للوصول</h1>
            <p className="text-lg font-bold text-gray-700 mb-6">
              هذا الحساب ({user.email}) غير مخول للوصول إلى لوحة تحكم البائع. يرجى التواصل مع المدير.
            </p>
          </div>
          
          <Button
            onClick={signOut}
            className="w-full bg-red-400 text-white px-8 py-4 border-2 border-black rounded-none font-black text-lg hover:bg-red-500 transition-all duration-150 transform hover:translate-x-1 hover:translate-y-1 shadow-[2px_2px_0px_0px_#000]"
          >
            <LogOut className="ml-2" size={20} />
            تسجيل الخروج
          </Button>
        </div>
      </div>
    );
  }

  // Show dashboard if user is authenticated and authorized
  return <Dashboard user={user} onSignOut={signOut} />;
}