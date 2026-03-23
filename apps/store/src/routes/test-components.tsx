import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Layout } from '@/components/Layout';
import { HeroSection } from '@/components/sections/HeroSection';
import { FeatureGrid } from '@/components/sections/FeatureGrid';
import { ProductCarousel } from '@/components/sections/ProductCarousel';
import { OrderForm, type OrderFormData } from '@/components/sections/OrderForm';
import { OrderSection, type OrderData } from '@/components/sections/OrderSection';
import { TestimonialSection } from '@/components/sections/TestimonialSection';
import { FAQSection } from '@/components/sections/FAQSection';
import { GuaranteeSection } from '@/components/sections/GuaranteeSection';
import { BenefitsSection } from '@/components/sections/BenefitsSection';
import { CTASection } from '@/components/sections/CTASection';
import { OrderNotifications } from '@/components/OrderNotifications';
import { useOrderSubmission } from '@/hooks/useOrderSubmission';
import { useOrderNotifications } from '@/hooks/useOrderNotifications';
import { getContent } from '@/lib/content';
import { siteConfig } from '@/config/site.config';
import { db } from '@/lib/instantdb';
import { useState } from 'react';

// Only register this route in development mode
export const Route = createFileRoute('/test-components')({
  component: import.meta.env.DEV ? TestComponents : () => null,
  beforeLoad: () => {
    // Redirect to home if accessed in production
    if (!import.meta.env.DEV) {
      throw new Error('Test components page is only available in development mode');
    }
  },
});

function TestComponents() {
  const navigate = useNavigate();
  const content = getContent();
  const { isSubmitting, submitOrder } = useOrderSubmission();
  const { sendOrderNotification } = useOrderNotifications();

  // Query to get the default product and its stock
  const { data: productsData } = db.useQuery({ products: {} });
  const defaultProduct = productsData?.products?.find(
    (p) => p.product_number === siteConfig.defaultProduct.productNumber
  ) || { stock: 0, price: 2500 };
  const totalStock = defaultProduct.stock || 0;
  const price = defaultProduct.price || 2500;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleOrderSubmit = async (orderData: OrderFormData | OrderData) => {
    try {
      // Submit order to database (same as main page)
      const result = await submitOrder({
        name: orderData.name,
        email: orderData.email,
        phone: orderData.phone,
        message: orderData.message || '',
        wilaya: orderData.wilaya,
        daira: orderData.daira,
        commune: orderData.commune,
        quantity: orderData.quantity,
      });

      if (result.success) {
        // Send real-time notification
        sendOrderNotification(
          result.orderNumber || '',
          orderData.wilaya,
          orderData.quantity
        );

        // Redirect to success page with order number
        navigate({
          to: '/success',
          search: { orderNumber: result.orderNumber || '' }
        });
      } else {
        throw new Error(result.error || 'حدث خطأ غير متوقع');
      }
    } catch (error: any) {
      console.error('Order submission error:', error);
      // The error will be caught by the component and displayed
      throw error;
    }
  };

  return (
    <div
      className="bg-white min-h-screen"
      style={{ fontFamily: siteConfig.theme.typography.fontFamily }}
      dir={siteConfig.theme.direction}
    >
      <Layout showNavigation={false}>
        {/* Order Notifications - Social Proof */}
        {siteConfig.features.notifications && <OrderNotifications />}

        <div className="max-w-6xl mx-auto py-8 px-6">
          <h1 className="text-4xl font-black mb-8 text-center">
            Component Test Page
          </h1>
          <p className="text-center mb-12 text-lg">
            Testing the new modular components with theme and content configuration
          </p>
        </div>

        <HeroSection
          content={content.hero}
          onCtaClick={() => scrollToSection('test-features')}
        />

        <div className="w-full border-b border-black"></div>

        <FeatureGrid
          title={content.sections.specs.title}
          features={content.features}
        />

        <div className="w-full border-b border-black"></div>

        <section id="test-carousel" className="bg-white py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-black mb-8 text-center">
              Product Carousel Test
            </h2>
            <div className="max-w-xl mx-auto">
              <ProductCarousel products={content.productImages} />
            </div>
          </div>
        </section>

        <div className="w-full border-b border-black"></div>

        <section id="test-order" className="bg-white py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-black mb-8 text-center">
              Order Form Test
            </h2>
            <OrderForm
              price={price}
              totalStock={totalStock}
              onSubmit={handleOrderSubmit}
              isSubmitting={isSubmitting}
            />
          </div>
        </section>

        <div className="w-full border-b border-black"></div>

        <section id="test-order-section" className="bg-white py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl font-black mb-4 text-center">
              OrderSection Test (Configurable Layout)
            </h2>
            <p className="text-center mb-8 text-gray-600">
              Current layout: <strong>{content.orderLayout?.type || 'form-right-carousel-quantity-left'}</strong>
            </p>
            <OrderSection
              price={price}
              totalStock={totalStock}
              productImages={content.productImages}
              onSubmit={handleOrderSubmit}
              isSubmitting={isSubmitting}
              layoutConfig={content.orderLayout}
            />
          </div>
        </section>

        <div className="w-full border-b border-black"></div>

        {/* Testimonials Section Test */}
        {content.testimonials && content.testimonials.length > 0 && (
          <section id="test-testimonials" className="bg-white">
            <TestimonialSection testimonials={content.testimonials} />
          </section>
        )}

        <div className="w-full border-b border-black"></div>

        {/* FAQ Section Test */}
        {content.faqs && content.faqs.length > 0 && (
          <section id="test-faqs" className="bg-white">
            <FAQSection faqs={content.faqs} />
          </section>
        )}

        <div className="w-full border-b border-black"></div>

        {/* Guarantee Section Test */}
        {content.guarantees && content.guarantees.length > 0 && (
          <section id="test-guarantees">
            <GuaranteeSection guarantees={content.guarantees} />
          </section>
        )}

        <div className="w-full border-b border-black"></div>

        {/* Benefits Section Test */}
        {content.benefits && content.benefits.length > 0 && (
          <section id="test-benefits">
            <BenefitsSection benefits={content.benefits} />
          </section>
        )}

        <div className="w-full border-b border-black"></div>

        {/* CTA Section Test */}
        {content.cta && (
          <section id="test-cta">
            <CTASection cta={content.cta} />
          </section>
        )}

        <div className="w-full border-b border-black"></div>

        <section className="bg-white py-16 px-6">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl font-black mb-8 text-center">
              Configuration Details
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="border-2 border-black p-6">
                <h3 className="text-xl font-black mb-4">Theme Info</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>Name:</strong> {siteConfig.theme.name}</li>
                  <li><strong>Primary Color:</strong> {siteConfig.theme.colors.primary}</li>
                  <li><strong>Accent Color:</strong> {siteConfig.theme.colors.accent}</li>
                  <li><strong>Font:</strong> {siteConfig.theme.typography.fontFamily}</li>
                  <li><strong>Direction:</strong> {siteConfig.theme.direction}</li>
                </ul>
              </div>
              <div className="border-2 border-black p-6">
                <h3 className="text-xl font-black mb-4">Feature Flags</h3>
                <ul className="space-y-2 text-sm">
                  <li><strong>Notifications:</strong> {siteConfig.features.notifications ? '✓' : '✗'}</li>
                  <li><strong>Testimonials:</strong> {siteConfig.features.testimonials ? '✓' : '✗'}</li>
                  <li><strong>FAQs:</strong> {siteConfig.features.faqs ? '✓' : '✗'}</li>
                  <li><strong>Guarantees:</strong> {siteConfig.features.guarantees ? '✓' : '✗'}</li>
                  <li><strong>Multi-Product:</strong> {siteConfig.features.multiProduct ? '✓' : '✗'}</li>
                </ul>
              </div>
            </div>
          </div>
        </section>
      </Layout>
    </div>
  );
}
