import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Check, Home, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Layout } from "@/components/Layout";

// Define the search params type
type SearchParams = {
  orderNumber?: string;
};

export const Route = createFileRoute("/success")({
  component: SuccessPage,
  validateSearch: (search: Record<string, unknown>): SearchParams => {
    return {
      orderNumber: typeof search.orderNumber === 'string' ? search.orderNumber : undefined,
    };
  },
});

function SuccessPage() {
  const navigate = useNavigate();
  const { orderNumber } = useSearch({ from: '/success' });
  const [showConfetti, setShowConfetti] = useState(true);

  useEffect(() => {
    
    const timer = setTimeout(() => {
      setShowConfetti(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []); 

  const goHome = () => {
    navigate({ to: "/" });
  };

  const orderAgain = () => {
    navigate({ 
        to: "/",
        hash: "buy"
    });
  };

  return (
    <Layout showNavigation={false}>
      {/* Success Section */}
      <section className="bg-white py-16 px-6">
        <div className="max-w-4xl mx-auto text-center">
          
          {/* Main Success Message */}
          <div className="space-y-8">
            <h1 className="text-4xl lg:text-5xl font-black leading-tight">
              تهانينا!
              <br />
              تم استلام طلبك بنجاح
            </h1>

            {/* Order Details Box */}
            <div className="bg-black text-white p-6 sm:p-8 border-2 border-black transform -rotate-1 max-w-2xl mx-auto">
              <div className="space-y-4">
                <h2 className="text-2xl font-black">تفاصيل الطلب</h2>
                {orderNumber && (
                  <div className="bg-yellow-400 text-black p-4 border-2 border-black transform rotate-1">
                    <p className="font-black text-lg">
                      رقم الطلب: {orderNumber}
                    </p>
                  </div>
                )}
                <p className="text-lg font-bold leading-relaxed">
                  سيتم التواصل معك خلال 24 ساعة لتأكيد الطلب وترتيب التسليم.
                  احتفظ برقم الطلب للمراجعة.
                </p>
              </div>
            </div>

            {/* Next Steps */}
            <div className="bg-white border-2 border-black p-6 sm:p-8 max-w-2xl mx-auto transform rotate-1">
              <h3 className="text-xl font-black mb-4">الخطوات التالية</h3>
              <div className="space-y-3 text-right">
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-400 text-black w-8 h-8 border-2 border-black flex items-center justify-center font-black text-sm">
                    1
                  </div>
                  <p className="font-bold">سنتصل بك خلال 24 ساعة</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-400 text-black w-8 h-8 border-2 border-black flex items-center justify-center font-black text-sm">
                    2
                  </div>
                  <p className="font-bold">تأكيد الطلب وتفاصيل التسليم</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="bg-yellow-400 text-black w-8 h-8 border-2 border-black flex items-center justify-center font-black text-sm">
                    3
                  </div>
                  <p className="font-bold">استلام حقيبتك الجديدة</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-8">
              <Button
                className="bg-yellow-400 text-black px-8 py-4 border-2 border-black rounded-none font-black text-lg hover:bg-yellow-300 transition-all duration-150 transform hover:translate-x-1 hover:translate-y-1 shadow-[2px_2px_0px_0px_#000]"
                onClick={goHome}
              >
                <Home className="ml-2" size={20} />
                العودة للرئيسية
              </Button>

              <Button
                variant="outline"
                className="bg-white text-black px-8 py-4 border-2 border-black rounded-none font-black text-lg hover:bg-gray-100 transition-all duration-150 transform hover:translate-x-1 hover:translate-y-1 shadow-[2px_2px_0px_0px_#000]"
                onClick={orderAgain}
              >
                <ShoppingBag className="ml-2" size={20} />
                اطلب مرة أخرى
              </Button>
            </div>
          </div>

          {/* Thank You Message */}
          <div className="mt-16 bg-black text-white p-6 border-2 border-black transform -rotate-1">
            <p className="text-xl font-black">
              شكرًا لثقتك في صاكادو
              <br />
              <span className="text-yellow-400">نثور على طريقة الحمل معًا!</span>
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}