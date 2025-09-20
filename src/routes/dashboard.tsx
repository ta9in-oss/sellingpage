import React, { useState, useEffect } from 'react';
import { createFileRoute } from '@tanstack/react-router';
import { 
  Package, 
  CheckCircle, 
  XCircle, 
  Clock, 
  Printer, 
  Search,
  Filter,
  Eye,
  LogOut,
  Mail,
  Send
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { db } from '@/lib/instantdb';

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
}

const LoginScreen = ({ onSignIn, isLoading, error }) => {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState('email'); // 'email' or 'code'
  const [sentTo, setSentTo] = useState('');

  const handleSendCode = async (e) => {
    e.preventDefault();
    if (!email.trim()) return;
    
    try {
      await onSignIn(email, step);
      setSentTo(email);
      setStep('code');
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
                  جاري الإرسال...
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

  const orders = ordersData?.orders || [];
  const products = productsData?.products || [];

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

  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await db.transact([
        db.tx.orders[orderId].update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
      ]);

      if (selectedOrder && selectedOrder.id === orderId) {
        setSelectedOrder(prev => {
          if (!prev) return null;
          return {
            ...prev,
            status: newStatus,
            updated_at: new Date().toISOString() 
          };
        });
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
      alert('عذراً، لا يمكن فتح نافذة الطباعة. يرجى التأكد من السماح بالنوافذ المنبثقة لهذا الموقع.');
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
      alert('حدث خطأ أثناء محاولة الطباعة. يرجى المحاولة مرة أخرى.');
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
            <div className="text-right">
              <p className="font-bold text-sm text-gray-600">مرحباً</p>
              <p className="font-black">{user?.email}</p>
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
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
            <div key={order.id} className="bg-white border-2 border-black p-4 transform hover:rotate-1 transition-transform">
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
                </div>

                {/* Action Buttons Section */}
                <div className="flex items-center gap-2">
                <Button
                  onClick={() => updateOrderStatus(order.id, { value: 'confirmed', label: 'مؤكد' })}
                  className={`border-2 border-black rounded-none font-bold text-sm transition-all ${
                    (typeof order.status === 'string' ? order.status : order.status?.value) === 'confirmed' 
                      ? 'bg-green-400 text-black ring-4 ring-green-600 hover:bg-green-500' 
                      : 'bg-green-200 text-black hover:bg-green-400 hover:text-black'
                  }`}
                >
                  <CheckCircle size={14} className="ml-1" />
                 تأكيد
                </Button>
                <Button
                  onClick={() => updateOrderStatus(order.id, { value: 'cancelled', label: 'ملغى' })}
                  className={`border-2 border-black rounded-none font-bold text-sm transition-all ${
                    (typeof order.status === 'string' ? order.status : order.status?.value) === 'cancelled' 
                      ? 'bg-red-400 text-white ring-4 ring-red-600 hover:bg-red-500' 
                      : 'bg-red-200 text-black hover:bg-red-400 hover:text-white'
                  }`}
                >
                  <XCircle size={14} className="ml-1" />
                  إلغاء
                </Button>
                  <Button
                    onClick={() => setSelectedOrder({
                      ...order,
                      total_amount: Number(order.total_amount)
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
                    <label className="block font-black text-sm mb-1">رقم الهاتف</label>
                    <p className="bg-gray-100 p-3 border-2 border-black font-mono">{selectedOrder.customer_phone}</p>
                  </div>
                  <div>
                    <label className="block font-black text-sm mb-1">البريد الإلكتروني</label>
                    <p className="bg-gray-100 p-3 border-2 border-black font-bold">{selectedOrder.customer_email || 'غير محدد'}</p>
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
                  <div>
                    <label className="block font-black text-sm mb-1">المبلغ الإجمالي</label>
                    <p className="bg-yellow-400 p-3 border-2 border-black font-black text-center">{selectedOrder.total_amount} دج</p>
                  </div>
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
                    const isActive = (typeof selectedOrder.status === 'string' ? selectedOrder.status : selectedOrder.status?.value) === status.value;
                    return (
                      <Button
                        key={status.value}
                        onClick={() => updateOrderStatus(selectedOrder.id, { value: status.value, label: status.label })}
                        className={`${status.color} border-2 border-black rounded-none font-bold text-sm transition-all transform hover:scale-105 ${
                          isActive ? 'ring-4 ring-black scale-105 shadow-lg' : 'hover:shadow-md'
                        }`}
                      >
                        <div className="flex items-center gap-1">
                          {status.icon}
                          {status.label}
                        </div>
                      </Button>
                    );
                  })}
                </div>
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
    </div>
  );
};

export default function SellerDashboard() {
  const { user, isLoading } = db.useAuth();
  const [authLoading, setAuthLoading] = useState(false);
  const [authError, setAuthError] = useState('');
  const [sentEmail, setSentEmail] = useState('');

  const handleAuth = async (emailOrCode, step) => {
    setAuthLoading(true);
    setAuthError('');
    
    try {
      if (step === 'email') {
        // Send magic code to email
        await db.auth.sendMagicCode({ email: emailOrCode });
        setSentEmail(emailOrCode);
      } else if (step === 'code') {
        // Sign in with the magic code
        await db.auth.signInWithMagicCode({ email: sentEmail, code: emailOrCode });
      }
    } catch (error) {
      console.error('Auth error:', error);
      setAuthError(
        step === 'email' 
          ? 'فشل في إرسال رمز التحقق. تأكد من صحة البريد الإلكتروني.'
          : 'رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.'
      );
    } finally {
      setAuthLoading(false);
    }
  };

  const signOut = () => {
    db.auth.signOut();
    setAuthError('');
    setSentEmail('');
  };

  // Show loading state while checking authentication
  if (isLoading) {
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

  // Show dashboard if user is authenticated
  return <Dashboard user={user} onSignOut={signOut} />;
}