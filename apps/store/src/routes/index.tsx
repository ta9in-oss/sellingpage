import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Layout } from "@/components/Layout";
import { useOrderSubmission } from "@/hooks/useOrderSubmission";
import { OrderNotifications } from "@/components/OrderNotifications";
import { useOrderNotifications } from "@/hooks/useOrderNotifications";
import { db } from "@/lib/instantdb";
import { useGoogleLogin } from "@react-oauth/google";

import { getContent, LEGACY_PRODUCT_NUMBER } from "@/lib/content";
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
  // Price comes from the merchant's config (hero price tag), not a constant.
  const price = Number(getContent().hero.priceTag.amount) || 0;
  const { isSubmitting, submitOrder } = useOrderSubmission();
  const { sendOrderNotification } = useOrderNotifications();

  // Buyer authentication state (used when Chargily is the active payment method)
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [buyerEmail, setBuyerEmail] = useState("");
  const [buyerName, setBuyerName] = useState("");

  const activePaymentMethod = siteConfig.payment.activeMethod;

  // Stock lives on the store's own product row and is managed from /dashboard.
  // Match this store's product number, falling back to the legacy hardcoded one
  // (and then to whatever single product exists) so older stores keep their stock.
  const { data: productsData } = db.useQuery({ products: {} });
  const allProducts = productsData?.products ?? [];
  const defaultProduct =
    allProducts.find((p) => p.product_number === siteConfig.defaultProduct.productNumber) ??
    allProducts.find((p) => p.product_number === LEGACY_PRODUCT_NUMBER) ??
    allProducts[0] ?? { stock: 0 };
  const totalStock = (defaultProduct as any).stock || 0;

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) element.scrollIntoView({ behavior: "smooth" });
  };

  const handleOrderSubmit = async (orderData: OrderData) => {
    setOrderError("");
    try {
      const result = await submitOrder({
        name: buyerName || orderData.name,
        email: buyerEmail || orderData.email || "",
        phone: orderData.phone,
        message: orderData.message || "",
        wilaya: orderData.wilaya,
        daira: orderData.daira,
        commune: orderData.commune,
        quantity: orderData.quantity,
        paymentMethod: orderData.paymentMethod || "cod",
      });

      if (result.success) {
        setSelectedWilaya(orderData.wilaya);
        setSelectedCommune(orderData.commune);
        sendOrderNotification(result.orderNumber || "", orderData.wilaya, orderData.quantity);

        if (result.checkoutUrl) {
          // Chargily payment: redirect to payment gateway
          window.location.href = result.checkoutUrl;
        } else {
          navigate({ to: "/success", search: { orderNumber: result.orderNumber || "" } });
        }
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

      {/* Sections below are shown when the merchant adds them in the builder */}
      {features.socialProof && content.socialProof && (
        <SocialProofBar reviewCount={content.socialProof.reviewCount} rating={content.socialProof.rating} />
      )}

      {!isDark && <div className="w-full h-0.5 bg-black" />}

      <FeatureGrid features={content.features} title={content.sections.specs.title} />

      {features.benefits && <BenefitsSection benefits={content.benefits} />}

      {features.valueStack && (
        <ValueStackSection
          price={price}
          ctaText={content.valueStack?.ctaText}
          items={content.valueStack?.items}
          onCtaClick={() => scrollToSection("buy")}
        />
      )}

      {features.testimonials && <TestimonialSection testimonials={content.testimonials} />}

      {features.cta && content.cta && <CTASection cta={content.cta} />}

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
          activePaymentMethod={activePaymentMethod}
          requiredFields={content.orderFields}
          buyerEmail={buyerEmail || undefined}
          buyerName={buyerName || undefined}
          onAuthRequest={() => setShowAuthModal(true)}
        />
      </section>

      {features.faqs && <FAQSection faqs={content.faqs} />}

      {features.notifications && (
        <OrderNotifications
          userWilaya={selectedWilaya}
          userCommune={selectedCommune}
          variant={siteConfig.notifications?.style}
        />
      )}

      {showAuthModal && (
        <BuyerAuthModal
          onAuthenticated={(email, name) => {
            setBuyerEmail(email);
            setBuyerName(name);
            setShowAuthModal(false);
          }}
          onClose={() => setShowAuthModal(false)}
        />
      )}
    </Layout>
  );
}

// ─── Buyer Auth Modal ────────────────────────────────────────────────────────

interface BuyerAuthModalProps {
  onAuthenticated: (email: string, name: string) => void;
  onClose: () => void;
}

function BuyerAuthModal({ onAuthenticated, onClose }: BuyerAuthModalProps) {
  const [tab, setTab] = useState<"google" | "email">("google");
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [code, setCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const googleClientId = siteConfig.payment.googleClientId;

  const handleGoogleSuccess = async (tokenResponse: { access_token: string }) => {
    setLoading(true);
    try {
      // Fetch basic profile from Google
      const res = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
        headers: { Authorization: `Bearer ${tokenResponse.access_token}` },
      });
      const profile = await res.json();
      const userEmail: string = profile.email ?? "";
      const userName: string = profile.name ?? profile.given_name ?? "";
      // Sign in to InstantDB with the Google id_token if available; fallback to email
      try {
        await db.auth.signInWithIdToken({
          clientName: "google-web",
          idToken: profile.sub ?? tokenResponse.access_token,
          nonce: undefined,
        } as Parameters<typeof db.auth.signInWithIdToken>[0]);
      } catch {
        // Non-fatal: we still have the email/name from Google profile
      }
      onAuthenticated(userEmail, userName);
    } catch {
      setError("فشل تسجيل الدخول عبر Google. حاول مجدداً.");
    } finally {
      setLoading(false);
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError("فشل تسجيل الدخول عبر Google."),
  });

  const sendCode = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    try {
      await db.auth.sendMagicCode({ email: email.trim().toLowerCase() });
      setCodeSent(true);
    } catch (e: unknown) {
      setError((e as Error).message || "فشل إرسال الرمز");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!code.trim() || !email.trim()) return;
    setLoading(true);
    setError("");
    try {
      await db.auth.signInWithMagicCode({ email: email.trim().toLowerCase(), code: code.trim() });
      onAuthenticated(email.trim().toLowerCase(), name.trim() || email.split("@")[0]);
    } catch (e: unknown) {
      setError((e as Error).message || "رمز غير صحيح");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4"
      dir="rtl"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="w-full max-w-sm bg-white border-2 border-black shadow-[8px_8px_0px_#000] p-6 space-y-5">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-lg font-black">تسجيل الدخول للمتابعة</h2>
            <p className="text-xs text-zinc-500 mt-0.5">مطلوب لإتمام الدفع الإلكتروني عبر Chargily</p>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-zinc-900 font-bold text-xl leading-none">×</button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2">
          {googleClientId && (
            <button
              onClick={() => setTab("google")}
              className={`flex-1 py-2 text-sm font-bold border-2 transition-all ${tab === "google" ? "border-black bg-yellow-400" : "border-zinc-200 bg-white"}`}
            >
              Google
            </button>
          )}
          <button
            onClick={() => setTab("email")}
            className={`flex-1 py-2 text-sm font-bold border-2 transition-all ${tab === "email" ? "border-black bg-yellow-400" : "border-zinc-200 bg-white"}`}
          >
            البريد الإلكتروني
          </button>
        </div>

        {error && <p className="text-red-600 text-xs bg-red-50 border border-red-200 p-2 rounded">{error}</p>}

        {/* Google tab */}
        {tab === "google" && googleClientId && (
          <button
            onClick={() => googleLogin()}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 border-2 border-black py-3 font-bold text-sm bg-white hover:bg-zinc-50 shadow-[3px_3px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            {loading ? "جارٍ تسجيل الدخول..." : "الدخول عبر Google"}
          </button>
        )}

        {/* Email tab */}
        {tab === "email" && (
          <div className="space-y-3">
            {!codeSent ? (
              <>
                <div className="space-y-1">
                  <label className="block text-xs font-bold">الاسم</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="اسمك الكامل"
                    className="w-full border-2 border-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <div className="space-y-1">
                  <label className="block text-xs font-bold">البريد الإلكتروني</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && sendCode()}
                    placeholder="example@email.com"
                    dir="ltr"
                    className="w-full border-2 border-black px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <button
                  onClick={sendCode}
                  disabled={loading || !email.trim()}
                  className="w-full border-2 border-black py-2.5 font-bold text-sm bg-yellow-400 shadow-[3px_3px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
                >
                  {loading ? "جارٍ الإرسال..." : "إرسال رمز التحقق"}
                </button>
              </>
            ) : (
              <>
                <p className="text-xs text-green-700 bg-green-50 border border-green-200 p-2 rounded">
                  تم إرسال رمز التحقق إلى {email}
                </p>
                <div className="space-y-1">
                  <label className="block text-xs font-bold">رمز التحقق</label>
                  <input
                    type="text"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && verifyCode()}
                    placeholder="123456"
                    dir="ltr"
                    maxLength={8}
                    className="w-full border-2 border-black px-3 py-2 text-sm text-center tracking-widest focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  />
                </div>
                <button
                  onClick={verifyCode}
                  disabled={loading || !code.trim()}
                  className="w-full border-2 border-black py-2.5 font-bold text-sm bg-yellow-400 shadow-[3px_3px_0px_#000] hover:shadow-[1px_1px_0px_#000] hover:translate-x-[2px] hover:translate-y-[2px] transition-all disabled:opacity-50"
                >
                  {loading ? "جارٍ التحقق..." : "تحقق ودخول"}
                </button>
                <button
                  onClick={() => { setCodeSent(false); setCode(""); setError(""); }}
                  className="w-full text-xs text-zinc-400 hover:text-zinc-600 underline"
                >
                  تغيير البريد الإلكتروني
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
