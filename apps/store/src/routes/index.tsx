import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useOrderSubmission } from "@/hooks/useOrderSubmission";
import { OrderNotifications } from "@/components/OrderNotifications";
import { useOrderNotifications } from "@/hooks/useOrderNotifications";
import { db } from "@/lib/instantdb";

import { getContent } from "@/lib/content";
import {
  HeroSection,
  SocialProofBar,
  FeatureGrid,
  ValueStackSection,
  OrderSection,
  type OrderData,
  BenefitsSection,
  TestimonialSection,
  GuaranteeSection,
  FAQSection,
  CTASection,
} from "@7aba/store-ui";
import { siteConfig } from "@/config/site.config";
import { getTheme } from "@/lib/theme";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const content = getContent();
  const theme = getTheme();
  const isDark = theme.mode === "dark";

  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");
  const [orderError, setOrderError] = useState("");
  const price = 2500;
  const { isSubmitting, submitOrder } = useOrderSubmission();
  const { sendOrderNotification } = useOrderNotifications();

  const { data: productsData } = db.useQuery({ products: {} });
  const defaultProduct = productsData?.products?.find(
    (p) => p.product_number === "PROD-234567-A1B2C3"
  ) || { stock: 0 };
  const totalStock = (defaultProduct as any).stock || 0;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const handleOrderSubmit = async (orderData: OrderData) => {
    setOrderError("");
    try {
      const result = await submitOrder({
        name: orderData.name,
        email: orderData.email || "",
        phone: orderData.phone,
        message: orderData.message || "",
        wilaya: orderData.wilaya,
        daira: orderData.daira,
        commune: orderData.commune,
        quantity: orderData.quantity,
      });

      if (result.success) {
        setSelectedWilaya(orderData.wilaya);
        setSelectedCommune(orderData.commune);
        sendOrderNotification(result.orderNumber || "", orderData.wilaya, orderData.quantity);
        navigate({ to: "/success", search: { orderNumber: result.orderNumber || "" } });
      } else {
        setOrderError(result.error || "حدث خطأ غير متوقع");
        setTimeout(() => setOrderError(""), 5000);
      }
    } catch (error) {
      console.error("Error submitting order:", error);
      setOrderError("حدث خطأ أثناء إرسال الطلب. يرجى المحاولة مرة أخرى.");
      setTimeout(() => setOrderError(""), 5000);
    }
  };

  const features = siteConfig.features;

  return (
    <Layout showNavigation={true}>
      <HeroSection content={content.hero} onCtaClick={() => scrollToSection("buy")} />

      {/* Acquisition-only sections */}
      {isDark && <SocialProofBar reviewCount={300} rating={4.9} />}

      {!isDark && <div className="w-full h-0.5 bg-black" />}

      <FeatureGrid features={content.features} title={content.sections.specs.title} />

      {features.benefits && <BenefitsSection benefits={content.benefits} />}

      {isDark && <ValueStackSection price={price} onCtaClick={() => scrollToSection("buy")} />}

      {features.testimonials && <TestimonialSection testimonials={content.testimonials} />}

      {isDark && <CTASection cta={content.cta} />}

      {features.guarantees && <GuaranteeSection guarantees={content.guarantees} />}

      {!isDark && <div className="w-full h-0.5 bg-black" />}

      <section id="buy">
        <OrderSection
          price={price}
          totalStock={totalStock}
          productImages={content.productImages}
          onSubmit={handleOrderSubmit}
          isSubmitting={isSubmitting}
          layoutConfig={content.orderLayout}
          title={content.sections.order.title}
        />
      </section>

      {features.faqs && <FAQSection faqs={content.faqs} />}

      <OrderNotifications userWilaya={selectedWilaya} userCommune={selectedCommune} />
    </Layout>
  );
}
