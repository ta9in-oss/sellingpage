import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState, useEffect } from "react";
import {
  Menu,
  X,
  ShoppingBag,
  OctagonAlertIcon,
  ArrowLeft,
  ArrowRight,
  Plus,
  Minus,
  Check,
  ChevronsUpDown,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Layout } from "@/components/Layout";
import { cn } from "@/lib/utils";
import { useAlgeriaLocations } from "@/hooks/useAlgeriaLocations";
import { useOrderSubmission } from "@/hooks/useOrderSubmission";
import { OrderNotifications } from "@/components/OrderNotifications";
import { useOrderNotifications } from "@/hooks/useOrderNotifications";
import { db } from "@/lib/instantdb";
import { HeroSection } from "@/components/sections/HeroSection";
import { FeatureGrid } from "@/components/sections/FeatureGrid";
import { OrderSection, type OrderData } from "@/components/sections/OrderSection";
import { getContent } from "@/lib/content";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const content = getContent();

  const [selectedWilaya, setSelectedWilaya] = useState("");
  const [selectedDaira, setSelectedDaira] = useState("");
  const [selectedCommune, setSelectedCommune] = useState("");
  const [currentSlide, setCurrentSlide] = useState(0);
  const [wilayaOpen, setWilayaOpen] = useState(false);
  const [dairaOpen, setDairaOpen] = useState(false);
  const [communeOpen, setCommuneOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    message: "",
  });
  const [validationError, setValidationError] = useState(false);
  const [orderError, setOrderError] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [quantityError, setQuantityError] = useState(false);
  const price = 2500;
  const total = price * quantity;
  const { isSubmitting, submitOrder } = useOrderSubmission();
  const { sendOrderNotification } = useOrderNotifications();

  // Query to get the default product and its stock
  const { data: productsData } = db.useQuery({ products: {} });
  const defaultProduct = productsData?.products?.find(
    (p) => p.product_number === "PROD-234567-A1B2C3"
  ) || { stock: 0 };
  const totalStock = defaultProduct.stock || 0;

  const incrementQuantity = () => {
    setQuantity((prev) => (prev < totalStock ? prev + 1 : prev));
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
  };

  // Use the custom hook for location data
  const { wilayas, getAvailableDairas, getAvailableCommunes, getLocationInfo } =
    useAlgeriaLocations();

  // Get available options based on current selections
  const availableDairas = getAvailableDairas(selectedWilaya);
  const availableCommunes = getAvailableCommunes(selectedWilaya, selectedDaira);

  // Handle selections with automatic resets
  const handleWilayaChange = (value: string) => {
    setSelectedWilaya(value);
    setSelectedDaira("");
    setSelectedCommune("");
  };

  const handleDairaChange = (value: string) => {
    setSelectedDaira(value);
    setSelectedCommune("");
  };

  const handleCommuneChange = (value: string) => {
    setSelectedCommune(value);
    // Optional: Get full location info if needed
    const locationInfo = getLocationInfo(value);
  };

  const totalSlides = 4;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    return () => {
      setMobileMenuOpen(false);
      setWilayaOpen(false);
      setDairaOpen(false);
      setCommuneOpen(false);
    };
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % totalSlides);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + totalSlides) % totalSlides);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    setValidationError(false);
    setQuantityError(false);
    setOrderError("");

    // Validate quantity first
    if (quantity < 1) {
      setQuantityError(true);
      setTimeout(() => setQuantityError(false), 5000);
      return;
    }

    // Validate required fields
    if (
      !formData.name ||
      !formData.phone ||
      !selectedWilaya ||
      !selectedDaira ||
      !selectedCommune
    ) {
      setValidationError(true);
      setTimeout(() => setValidationError(false), 5000);
      return;
    }

    try {
      // Submit order
      const result = await submitOrder({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
        wilaya: selectedWilaya,
        daira: selectedDaira,
        commune: selectedCommune,
        quantity: quantity,
      });

      if (result.success) {
        // Send real-time notification
        sendOrderNotification(
          result.orderNumber || "",
          selectedWilaya,
          quantity
        );

        // Redirect to success page with order number
        navigate({
          to: "/success",
          search: { orderNumber: result.orderNumber || "" }
        });
      } else {
        setOrderError(result.error || "حدث خطأ غير متوقع");
        setTimeout(() => setOrderError(""), 5000);
      }
    } catch (error) {
      console.error("Error in handleSubmit:", error);
      setOrderError("حدث خطأ غير متوقع. يرجى المحاولة مرة أخرى.");
      setTimeout(() => setOrderError(""), 5000);
    }
  };

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setMobileMenuOpen(false);
  };

  const getUnitLabel = (count) => {
    if (count === 1) return "وحدة";
    if (count === 2) return "وحدتان";
    if (count >= 3 && count <= 10) return "وحدات";
    return "وحدة";
  };

  // Adapter function for OrderSection component
  const handleOrderSubmit = async (orderData: OrderData) => {
    setValidationError(false);
    setQuantityError(false);
    setOrderError("");

    try {
      const result = await submitOrder({
        name: orderData.name,
        email: orderData.email || '',
        phone: orderData.phone,
        message: orderData.message || '',
        wilaya: orderData.wilaya,
        daira: orderData.daira,
        commune: orderData.commune,
        quantity: orderData.quantity,
      });

      if (result.success) {
        sendOrderNotification(
          result.orderNumber || "",
          orderData.wilaya,
          orderData.quantity
        );

        navigate({
          to: "/success",
          search: { orderNumber: result.orderNumber || "" }
        });
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

  return (
    <div
      className="bg-white min-h-screen"
      style={{ fontFamily: "Almarai, sans-serif" }}
      dir="rtl"
    >
      <Layout showNavigation={true}>

        <div className="w-full border-b border-black"></div>

        {/* Hero Section */}
        <HeroSection
          content={content.hero}
          onCtaClick={() => scrollToSection("buy")}
        />

        <div className="w-full h-0.5 bg-black"></div>

        {/* Specs/Features Section */}
        <FeatureGrid
          features={content.features}
          title={content.sections.specs.title}
        />

        <div className="w-full h-0.5 bg-black"></div>

        {/* Order Section */}
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

        <OrderNotifications userWilaya={selectedWilaya} userCommune={selectedCommune} />
      </Layout>
    </div>
  );
}
