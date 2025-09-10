// src/routes/index.tsx
import { createFileRoute } from "@tanstack/react-router";
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
import { cn } from "@/lib/utils";
import { useAlgeriaLocations } from "@/hooks/useAlgeriaLocations";
import { useOrderSubmission } from "@/hooks/useOrderSubmission";
import { OrderNotifications } from "@/components/OrderNotifications";
import { useOrderNotifications } from "@/hooks/useOrderNotifications";
import { db } from "@/lib/instantdb";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
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
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [orderNumber, setOrderNumber] = useState("");
  const [orderError, setOrderError] = useState("");
  const [quantity, setQuantity] = useState(0);
  const [quantityError, setQuantityError] = useState(false);
  const price = 2500;
  const total = price * quantity;
  const { isSubmitting, submitOrder } = useOrderSubmission();
  const { sendOrderNotification } = useOrderNotifications();

  // Query to get the default product and its stock
  const { data: productsData } = db.useQuery({ products: {} });
  const defaultProduct = productsData?.products?.find(
    (p) => p.name === "مونو باك الكلاسيكي"
  ) || { stock: 0 };
  const totalStock = defaultProduct.stock || 0;

  const incrementQuantity = () => {
    setQuantity((prev) => (prev < totalStock ? prev + 1 : prev));
  };

  const decrementQuantity = () => {
    setQuantity((prev) => (prev > 0 ? prev - 1 : 0));
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
    console.log("Selected location info:", locationInfo);
  };

  const totalSlides = 3;

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % totalSlides);
    }, 5000);
    return () => clearInterval(interval);
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
    setOrderSuccess(false);

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
        setOrderSuccess(true);
        setOrderNumber(result.orderNumber || "");

        // Send real-time notification
        sendOrderNotification(
          result.orderNumber || "",
          selectedWilaya,
          quantity
        );

        // Reset form
        setFormData({ name: "", email: "", phone: "", message: "" });
        setSelectedWilaya("");
        setSelectedDaira("");
        setSelectedCommune("");
        setQuantity(0);

        // Hide success message after 10 seconds
        setTimeout(() => {
          setOrderSuccess(false);
          setOrderNumber("");
        }, 10000);
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

  const specs = [
    {
      image: "https://m.media-amazon.com/images/I/51uRC25FgML.jpg",
      title: "السعة: 25 لتر",
      description:
        "مساحة تخزين مثالية تتسع لجميع احتياجاتك اليومية بما في ذلك اللابتوب حتى 15 بوصة، الكتب، الملفات، زجاجة الماء، والأدوات الشخصية. تصميم داخلي ذكي مع جيوب متعددة لتنظيم أفضل.",
      bgColor: "bg-yellow-400 text-black",
    },
    {
      image: "https://m.media-amazon.com/images/I/81nxxt9Sx7L.jpg",
      title: "المادة: نايلون مقاوم للتمزق",
      description:
        "مصنوع من أقوى أنواع النايلون عالي الجودة مع طبقة حماية مقاومة للماء والغبار. يتحمل الاستخدام اليومي الشاق والظروف الجوية المختلفة، مما يضمن حماية محتوياتك في جميع الأوقات.",
      bgColor: "bg-white text-black",
    },
    {
      image: "https://m.media-amazon.com/images/I/71yKC3aNf4L.jpg",
      title: "الوزن: 1.2 كيلو فقط",
      description:
        "تصميم خفيف الوزن للغاية لا يضيف عبئاً إضافياً على كتفيك. بفضل المواد المتطورة والهندسة الذكية، حققنا التوازن المثالي بين القوة والخفة، مما يجعل حمل الحقيبة مريحاً طوال اليوم.",
      bgColor: "bg-black text-white",
    },
  ];

  const products = [
    {
      id: 1,
      icon: "🎒",
      title: "النموذج الكلاسيكي",
      description: "التصميم الأصلي بحزام واحد",
      price: "2500 دج",
      bgColor: "bg-black text-white",
    },
    {
      id: 2,
      icon: "💼",
      title: "النموذج المهني",
      description: "مثالي للعمل والاجتماعات",
      price: "3500 دج",
      bgColor: "bg-yellow-400 text-black",
    },
    {
      id: 3,
      icon: "🏃",
      title: "النموذج الرياضي",
      description: "للأنشطة الرياضية والمغامرات",
      price: "3000 دج",
      bgColor: "bg-white text-black border-2 border-black",
    },
  ];

  return (
    <div
      className="bg-white min-h-screen"
      style={{ fontFamily: "system-ui, -apple-system, sans-serif" }}
      dir="rtl"
    >
      <header className="bg-white text-black p-6 border-2 border-black sticky top-0 z-50">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="text-3xl font-black">مونو باك</div>

          <nav className="hidden md:flex space-x-8 space-x-reverse gap-8 font-bold">
            <button
              onClick={() => scrollToSection("specs")}
              className="hover:text-yellow-500 transition-colors"
            >
              المواصفات
            </button>
            <button
              onClick={() => scrollToSection("buy")}
              className="hover:text-yellow-500 transition-colors"
            >
              اشتري الآن
            </button>
          </nav>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </Button>
        </div>

        {mobileMenuOpen && (
          <nav className="md:hidden mt-4 pt-4 border-t border-black">
            <div className="flex flex-col space-y-4 font-bold">
              <button
                onClick={() => scrollToSection("specs")}
                className="text-right hover:text-yellow-500 transition-colors"
              >
                المواصفات
              </button>
              <button
                onClick={() => scrollToSection("buy")}
                className="text-right hover:text-yellow-500 transition-colors"
              >
                اشتري الآن
              </button>
            </div>
          </nav>
        )}
      </header>

      <div className="w-full border-b border-black"></div>

      <section className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        {/* Background decorative elements*/}

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center z-10">
          {/* Text Content */}
          <div className="space-y-6 md:space-y-8 order-2 lg:order-1">
            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black leading-none text-right">
              حزام واحد
              <br />
              يحكم
              <br />
              الكل
            </h1>

            {/* Description Box */}
            <div className="bg-black text-white p-4 sm:p-6 border-2 border-black transform -rotate-1">
              <p className="text-base sm:text-lg md:text-xl font-bold text-right leading-relaxed">
                تحرر من حقائب الظهر التقليدية. مونو باك تثور على طريقة الحمل
                بتصميمها ذو الحزام الواحد الذي يوزع الوزن بشكل مثالي على جسمك.
              </p>
            </div>

            {/* CTA Button */}
            <div className="flex justify-center sm:justify-start">
              <Button
                className="bg-yellow-400 text-black px-6 sm:px-8 py-3 sm:py-4 border-2 border-black font-black text-lg sm:text-xl hover:bg-gray-100 transition-all duration-150 transform hover:translate-x-1 hover:translate-y-1 shadow-[2px_2px_0px_0px_#000] w-full sm:w-auto"
                onClick={() => scrollToSection("buy")}
              >
                <ShoppingBag className="ml-2" size={20} />
                اشتري الآن - 2500 دج
              </Button>
            </div>
          </div>

          {/* Image Section */}
          <div className="relative order-1 lg:order-2 flex justify-center">
            {/* Main Image Container */}
            <div className="relative bg-white border-2 border-black p-4 sm:p-6 md:p-8 transform rotate-3 max-w-xs sm:max-w-sm md:max-w-md">
              <img
                src="https://images.modeherz.de/item/images/309629/full/PIQUADRO-Blue-Square-Revamp-Mono-Sling-Bag-Verde---Nero-309629.jpg"
                alt="Mono Backpack"
                className="w-full h-auto"
              />

              {/* "New" Badge*/}
              <div className="absolute -top-2 sm:-top-4 -left-2 sm:-left-4 bg-yellow-400 border-2 border-black p-2 sm:p-4 rotate-12">
                <span className="font-black text-lg sm:text-xl md:text-2xl">
                  جديد!
                </span>
              </div>

              {/* "Comfortable" Badge*/}
              <div className="absolute -bottom-2 sm:-bottom-4 -right-2 sm:-right-4 bg-black text-white border-2 border-black p-2 sm:p-3 -rotate-6">
                <span className="font-bold text-sm sm:text-base">مريح</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-0.5 bg-black"></div>

      <section id="specs" className="bg-white text-black p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <div>
            <h2 className="text-3xl md:text-5xl font-black mb-6 md:mb-8 text-right">
              المواصفات التقنية
            </h2>
            <div className="space-y-6 md:space-y-8">
              {specs.map((spec, index) => (
                <div
                  key={index}
                  className={`${spec.bgColor} p-4 sm:p-6 md:p-8 lg:p-12 border-2 border-black min-h-[200px] sm:min-h-[250px] md:min-h-[300px]`}
                >
                  {/* Mobile: Stack vertically, Desktop: Side by side */}
                  <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6 md:gap-8 lg:gap-12">
                    {/* Image */}
                    <div className="flex-shrink-0 w-full sm:w-auto flex justify-center sm:justify-start">
                      <img
                        src={spec.image}
                        alt={spec.title}
                        className="w-24 h-24 sm:w-28 sm:h-28 md:w-36 md:h-36 lg:w-48 lg:h-48 object-cover border-2 border-black"
                      />
                    </div>

                    {/* Content */}
                    <div className="flex-1 text-right space-y-2 sm:space-y-3 md:space-y-4">
                      <div className="font-black text-xl sm:text-2xl md:text-3xl lg:text-4xl leading-tight">
                        {spec.title}
                      </div>
                      <div className="font-bold text-sm sm:text-base md:text-lg lg:text-xl leading-relaxed">
                        {spec.description}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="w-full h-0.5 bg-black"></div>

      <section id="buy" className="bg-white p-6 md:p-12">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 md:mb-16">
            <h2 className="text-3xl md:text-5xl font-black mb-4">
              مستعد للثورة؟
            </h2>
            <div className="bg-black h-1 w-32 mx-auto border-2 border-black"></div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-start">
            {/* Form Section */}
            <div className="bg-white border-2 border-black p-4 md:p-8 transform rotate-1 order-2 lg:order-1">
              <h3 className="text-2xl md:text-3xl font-black mb-6 text-right">
                احصل على عرض خاص
              </h3>
              {validationError && (
                <Alert className="border-2 border-red-500 bg-red-50 text-black mb-6 flex items-start gap-3 p-4 rounded-xl">
                  <OctagonAlertIcon className="h-5 w-5 text-black mt-1" />
                  <div className="text-right">
                    <AlertTitle className="font-extrabold text-base md:text-lg">
                      يرجى ملء جميع الحقول المطلوبة
                    </AlertTitle>
                    <AlertDescription className="text-sm md:text-base font-medium">
                      تأكد من إدخال الاسم، رقم الهاتف، واختيار الموقع (الولاية،
                      الدائرة، والبلدية).
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              {/* Order Success Message */}
              {orderSuccess && (
                <Alert className="border-2 border-green-500 bg-green-50 text-black mb-6 flex items-start gap-3 p-4 rounded-xl">
                  <Check className="h-5 w-5 text-green-600 mt-1" />
                  <div className="text-right">
                    <AlertTitle className="font-extrabold text-base md:text-lg text-green-800">
                      تم إرسال طلبك بنجاح!
                    </AlertTitle>
                    <AlertDescription className="text-sm md:text-base font-medium text-green-700">
                      رقم الطلب: {orderNumber}
                      <br />
                      سيتم التواصل معك خلال 24 ساعة لتأكيد الطلب وترتيب التسليم.
                    </AlertDescription>
                  </div>
                </Alert>
              )}

              {/* Order Error Message */}
              {orderError && (
                <Alert className="border-2 border-red-500 bg-red-50 text-black mb-6 flex items-start gap-3 p-4 rounded-xl">
                  <OctagonAlertIcon className="h-5 w-5 text-red-600 mt-1" />
                  <div className="text-right">
                    <AlertTitle className="font-extrabold text-base md:text-lg text-red-800">
                      حدث خطأ في إرسال الطلب
                    </AlertTitle>
                    <AlertDescription className="text-sm md:text-base font-medium text-red-700">
                      {orderError}
                    </AlertDescription>
                  </div>
                </Alert>
              )}
              <div className="space-y-4 md:space-y-6">
                <div>
                  <Label
                    htmlFor="name"
                    className="block text-base md:text-lg font-bold mb-2 text-right"
                  >
                    الاسم الكامل
                  </Label>
                  <Input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    className="w-full p-3 md:p-4 border-2 border-black bg-white text-right font-bold text-sm md:text-base"
                    placeholder="أدخل اسمك الكامل"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="email"
                    className="block text-base md:text-lg font-bold mb-2 text-right"
                  >
                    البريد الإلكتروني (ليس مهمًا)
                  </Label>
                  <Input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full p-3 md:p-4 border-2 border-black bg-white text-right font-bold text-sm md:text-base"
                    placeholder="أدخل بريدك الإلكتروني"
                  />
                </div>

                <div>
                  <Label
                    htmlFor="phone"
                    className="block text-base md:text-lg font-bold mb-2 text-right"
                  >
                    رقم الهاتف
                  </Label>
                  <Input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="w-full p-3 md:p-4 border-2 border-black bg-white text-right font-bold text-sm md:text-base"
                    placeholder="أدخل رقم هاتفك"
                  />
                </div>

                {/* Location dropdowns */}
                <div className="space-y-4 md:space-y-6">
                  {/* Wilaya Combobox */}
                  <div>
                    <Label className="text-right block text-base md:text-lg font-bold mb-2">
                      الولاية
                    </Label>
                    <Popover open={wilayaOpen} onOpenChange={setWilayaOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={wilayaOpen}
                          className="w-full p-3 md:p-4 border-2 border-black bg-white font-bold text-sm md:text-lg justify-between text-right h-auto flex flex-row-reverse"
                        >
                          <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                          {selectedWilaya || "اختر الولاية"}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-[var(--radix-popover-trigger-width)] p-0 border-2 border-black bg-white"
                        align="start"
                        side="bottom"
                      >
                        <Command dir="rtl" className="rounded-none bg-white">
                          <CommandInput
                            placeholder="ابحث عن الولاية..."
                            className="mt-2 text-right border-0 border-black rounded-none h-12 font-bold"
                          />
                          <CommandList className="max-h-60 overflow-y-auto bg-white">
                            <CommandEmpty className="text-center py-6 font-bold">
                              لم يتم العثور على ولاية
                            </CommandEmpty>
                            <CommandGroup>
                              {wilayas.map((wilaya) => (
                                <CommandItem
                                  key={wilaya}
                                  value={wilaya}
                                  onSelect={() => {
                                    handleWilayaChange(wilaya);
                                    setWilayaOpen(false);
                                  }}
                                  className="text-right font-bold text-sm md:text-lg py-3 px-4 cursor-pointer hover:bg-gray-100"
                                >
                                  {wilaya}
                                  <Check
                                    className={cn(
                                      "mr-2 h-4 w-4",
                                      selectedWilaya === wilaya
                                        ? "opacity-100"
                                        : "opacity-0"
                                    )}
                                  />
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                  </div>

                  {/* Daira Combobox - Only show when Wilaya is selected */}
                  {selectedWilaya && (
                    <div>
                      <Label className="text-right block text-base md:text-lg font-bold mb-2">
                        الدائرة
                      </Label>
                      <Popover open={dairaOpen} onOpenChange={setDairaOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={dairaOpen}
                            className="w-full p-3 md:p-4 border-2 border-black bg-white font-bold text-sm md:text-lg justify-between text-right h-auto flex flex-row-reverse"
                            disabled={!selectedWilaya}
                          >
                            <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            {selectedDaira || "اختر الدائرة"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[var(--radix-popover-trigger-width)] p-0 border-2 border-black bg-white"
                          align="start"
                          side="bottom"
                        >
                          <Command dir="rtl" className="rounded-none bg-white">
                            <CommandInput
                              placeholder="ابحث عن الدائرة..."
                              className="mt-2 text-right border-0 border-black rounded-none h-12 font-bold"
                            />
                            <CommandList className="max-h-60 overflow-y-auto bg-white">
                              <CommandEmpty className="text-center py-6 font-bold">
                                لم يتم العثور على دائرة
                              </CommandEmpty>
                              <CommandGroup>
                                {availableDairas.map((daira) => (
                                  <CommandItem
                                    key={daira}
                                    value={daira}
                                    onSelect={() => {
                                      handleDairaChange(daira);
                                      setDairaOpen(false);
                                    }}
                                    className="text-right font-bold text-sm md:text-lg py-3 px-4 cursor-pointer hover:bg-gray-100"
                                  >
                                    {daira}
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedDaira === daira
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}

                  {/* Commune Combobox - Only show when Daira is selected */}
                  {selectedDaira && (
                    <div>
                      <Label className="text-right block text-base md:text-lg font-bold mb-2">
                        البلدية
                      </Label>
                      <Popover open={communeOpen} onOpenChange={setCommuneOpen}>
                        <PopoverTrigger asChild>
                          <Button
                            variant="outline"
                            role="combobox"
                            aria-expanded={communeOpen}
                            className="w-full p-3 md:p-4 border-2 border-black bg-white font-bold text-sm md:text-lg justify-between text-right h-auto flex flex-row-reverse"
                            disabled={!selectedDaira}
                          >
                            <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                            {selectedCommune || "اختر البلدية"}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent
                          className="w-[var(--radix-popover-trigger-width)] p-0 border-2 border-black bg-white"
                          align="start"
                          side="bottom"
                        >
                          <Command dir="rtl" className="rounded-none bg-white">
                            <CommandInput
                              placeholder="ابحث عن البلدية..."
                              className="mt-2 text-right border-0 border-black rounded-none h-12 font-bold"
                            />
                            <CommandList className="max-h-60 overflow-y-auto bg-white">
                              <CommandEmpty className="text-center py-6 font-bold">
                                لم يتم العثور على بلدية
                              </CommandEmpty>
                              <CommandGroup>
                                {availableCommunes.map((commune) => (
                                  <CommandItem
                                    key={commune}
                                    value={commune}
                                    onSelect={() => {
                                      handleCommuneChange(commune);
                                      setCommuneOpen(false);
                                    }}
                                    className="text-right font-bold text-sm md:text-lg py-3 px-4 cursor-pointer hover:bg-gray-100"
                                  >
                                    {commune}
                                    <Check
                                      className={cn(
                                        "mr-2 h-4 w-4",
                                        selectedCommune === commune
                                          ? "opacity-100"
                                          : "opacity-0"
                                      )}
                                    />
                                  </CommandItem>
                                ))}
                              </CommandGroup>
                            </CommandList>
                          </Command>
                        </PopoverContent>
                      </Popover>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Product Carousel and Quantity Section */}
            <div className="space-y-6 order-1 lg:order-2">
              {/* Product Carousel */}
              <div className="bg-white border-2 border-black p-4 md:p-8 transform -rotate-1">
                <div className="relative">
                  <div className="overflow-hidden">
                    <div
                      className="flex transition-transform duration-300 ease-in-out"
                      style={{
                        transform: `translateX(${currentSlide * 100}%)`,
                      }}
                    >
                      {products.map((product) => (
                        <div
                          key={product.id}
                          className="min-w-full flex-shrink-0"
                        >
                          <div
                            className={`${product.bgColor} p-4 md:p-6 border-2 border-black text-center`}
                          >
                            <div className="text-4xl md:text-6xl mb-4">
                              {product.icon}
                            </div>
                            <h4 className="text-xl md:text-2xl font-black mb-2">
                              {product.title}
                            </h4>
                            <p className="font-bold text-sm md:text-base">
                              {product.description}
                            </p>
                            <div
                              className={`text-2xl md:text-3xl font-black mt-4 ${product.bgColor.includes("black") ? "text-yellow-400" : "text-current"}`}
                            >
                              {product.price}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute left-2 md:left-4 top-1/2 transform -translate-y-1/2 bg-black text-white border-2 border-black font-black hover:bg-gray-800 w-8 h-8 md:w-10 md:h-10"
                    onClick={prevSlide}
                  >
                    <ArrowLeft size={16} className="md:w-5 md:h-5" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute right-2 md:right-4 top-1/2 transform -translate-y-1/2 bg-black text-white border-2 border-black font-black hover:bg-gray-800 w-8 h-8 md:w-10 md:h-10"
                    onClick={nextSlide}
                  >
                    <ArrowRight size={16} className="md:w-5 md:h-5" />
                  </Button>

                  <div className="flex justify-center mt-4 md:mt-6 gap-2 md:gap-3">
                    {products.map((_, index) => (
                      <button
                        key={index}
                        className={`w-3 h-3 md:w-4 md:h-4 border-2 border-black transition-colors ${
                          index === currentSlide ? "bg-black" : "bg-white"
                        }`}
                        onClick={() => setCurrentSlide(index)}
                      />
                    ))}
                  </div>
                </div>
              </div>

              {/* Quantity and Price Section */}
              <div className="hidden lg:block bg-white border-2 border-black p-6 xl:p-8 transform rotate-1">
                <div className="space-y-6 text-right">
                  {/* Quantity */}
                  <div className="space-y-4">
                    <Label className="block text-lg font-black text-right text-gray-900">
                      الكمية المطلوبة
                      <span className="block text-sm font-semibold text-gray-600 mt-1">
                        متبقي {totalStock - quantity}{" "}
                        {getUnitLabel(totalStock - quantity)} في المخزون
                      </span>
                    </Label>

                    {/* Quantity Error Alert */}
                    {quantityError && (
                      <Alert className="border-2 border-red-400 bg-red-50 text-red-900 flex items-start gap-3 p-4 rounded-xl shadow-sm">
                        <OctagonAlertIcon className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                        <div className="text-right flex-1">
                          <AlertTitle className="font-bold text-base text-red-900">
                            خطأ في الكمية
                          </AlertTitle>
                          <AlertDescription className="text-sm font-medium text-red-700 mt-1">
                            يرجى اختيار كمية واحدة على الأقل لإتمام الطلب
                          </AlertDescription>
                        </div>
                      </Alert>
                    )}

                    <div className="flex items-center justify-center gap-6 mb-6">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={incrementQuantity}
                        disabled={quantity >= totalStock}
                        className="h-12 w-12 xl:h-14 xl:w-14 border-2 border-black bg-white hover:bg-gray-100 font-black transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="h-5 w-5 xl:h-6 xl:w-6" />
                      </Button>
                      <span className="w-16 text-center font-black text-xl xl:text-2xl">
                        {quantity}
                      </span>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={decrementQuantity}
                        disabled={quantity <= 0}
                        className="h-12 w-12 xl:h-14 xl:w-14 border-2 border-black bg-white hover:bg-gray-100 font-black transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Minus className="h-5 w-5 xl:h-6 xl:w-6" />
                      </Button>
                    </div>
                  </div>
                  <hr className="border-black border-2" />
                  {/* Price Details */}
                  <div className="space-y-4">
                    <div className="flex justify-between items-center text-lg xl:text-xl">
                      <span className="font-black">السعر</span>
                      <span className="font-black">{price} دج</span>
                    </div>
                    <div className="flex justify-between items-center font-black text-xl xl:text-2xl">
                      <span>المجموع</span>
                      <span className="text-white bg-black px-3 py-1 border-2 border-black">
                        {total} دج
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          {/* Mobile Quantity and Price Section - Shows only on mobile, above order button */}
          <div className="block lg:hidden mt-8 md:mt-12">
            <div className="bg-white border-2 border-black p-4 transform rotate-1 max-w-md mx-auto">
              <div className="space-y-4 text-right">
                {/* Quantity */}
                <div className="space-y-4">
                  <Label className="block text-lg font-black text-right text-gray-900">
                    الكمية المطلوبة
                    <span className="block text-sm font-semibold text-gray-600 mt-1">
                      متبقي {totalStock - quantity}{" "}
                      {getUnitLabel(totalStock - quantity)} في المخزون
                    </span>
                  </Label>

                  {/* Quantity Error Alert */}
                  {quantityError && (
                    <Alert className="border-2 border-red-400 bg-red-50 text-red-900 flex items-start gap-3 p-4 rounded-xl shadow-sm">
                      <OctagonAlertIcon className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                      <div className="text-right flex-1">
                        <AlertTitle className="font-bold text-base text-red-900">
                          خطأ في الكمية
                        </AlertTitle>
                        <AlertDescription className="text-sm font-medium text-red-700 mt-1">
                          يرجى اختيار كمية واحدة على الأقل لإتمام الطلب
                        </AlertDescription>
                      </div>
                    </Alert>
                  )}

                  <div className="flex items-center justify-center gap-4 mb-4">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={incrementQuantity}
                      disabled={quantity >= totalStock}
                      className="h-10 w-10 border-2 border-black bg-white hover:bg-gray-100 font-black transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                    <span className="w-12 text-center font-black text-lg">
                      {quantity}
                    </span>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={decrementQuantity}
                      disabled={quantity <= 0}
                      className="h-10 w-10 border-2 border-black bg-white hover:bg-gray-100 font-black transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
                <hr className="border-black border-2" />
                {/* Price Details */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-base">
                    <span className="font-black">السعر</span>
                    <span className="font-black">{price} دج</span>
                  </div>
                  <div className="flex justify-between items-center font-black text-lg">
                    <span>المجموع</span>
                    <span className="text-white bg-black px-2 py-1 border-2 border-black">
                      {total} دج
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Order Button */}
          <Button
            type="button"
            className="w-full max-w-md mx-auto mt-8 md:mt-12 bg-yellow-400 text-black px-6 md:px-8 py-4 md:py-6 border-2 border-black font-black text-lg md:text-xl hover:bg-yellow-500 transition-all duration-150 transform hover:translate-x-1 hover:translate-y-1 shadow-[2px_2px_0px_0px_#000] block"
            onClick={handleSubmit}
          >
            اطلب الآن
          </Button>
        </div>
      </section>
      <OrderNotifications userWilaya={selectedWilaya} />

      <footer className="bg-black text-white p-8 border-t-4 border-black">
        <div className="max-w-7xl mx-auto text-center">
          <div className="text-2xl font-black mb-4">مونو باك</div>
          <div className="font-bold">
            © 2025 مونو باك. نثور على طريقة الحمل منذ اليوم.
          </div>
        </div>
      </footer>
    </div>
  );
}
