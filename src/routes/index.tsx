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

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  const navigate = useNavigate();
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

  const specs = [
    {
      image: "bagpack_005.png",
      title: "السعة",
      description:
        "هي جاية كي شغل F1 فيها جيب واحد كبير تحط فيه كلش . ولكن الحقيقة تقال ، يرفد الله يبارك . مخدوم للناس اللي ما تقراش بزاف . كراس نتاع 288 يكفيها آك شايف . ولكان راك رايح تدير سبور يرفد الله يبارك . في رحلة دراسية تان . المهم كي توصلك للدار تفهم .",
      bgColor: "bg-yellow-400 text-black ",
    },
    {
      image: "bagpack_003.png",
      title: "المادة: %100 بوليستار",
      description:
        "مصنوعة %100 بوليستار، قوية، ما تتقشر ما تتقطع، وأهم شي ما تشعّرش، وما تديرش الحساسية",
      bgColor: "bg-white text-black ",
    },
    {
      image: "bagpack_004.png",
      title: "الوزن",
      description:
        "صاكادو خفيفة ظريفة . ترفدها وتقلع كي شغل ماك رافد والو . درعها يتحل ويتعقد بمشطة . وفي جيب زايد كي تلقى واش تدير بيه خبرنا .👌",
      bgColor: "bg-black text-white",
    },
  ];

  const products = [
    {
      id: 1,
      image: "bagpack_002.png",
      title: "حقيبة ظهر بذراع واحدة",
      bgColor: "bg-black text-white",
    },
    {
      id: 2,
      image: "bagpack_003.png",
      title: "حقيبة ظهر بذراع واحدة ",
      bgColor: "bg-yellow-400 text-black",
    },
    {
      id: 3,
      image: "bagpack_004.png",
      title: "حقيبة ظهر بذراع واحدة ",
      bgColor: "bg-white text-black border-2 border-black",
    },
    {
      id: 4,
      image: "bagpack_005.png",
      title: "حقيبة ظهر بذراع واحدة ",
      bgColor: "bg-yellow-400  border-2 border-black",
    },
  ];

  return (
    <div
      className="bg-white min-h-screen"
      style={{ fontFamily: "Almarai, sans-serif" }}
      dir="rtl"
    >
      <Layout showNavigation={true}>

        <div className="w-full border-b border-black"></div>

        {/* Hero Section */}
        <section className="bg-white py-16 px-6">
          <div className="max-w-5xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              {/* Text Content */}
              <div className="space-y-8 order-2 lg:order-1">
                <h1 className="text-4xl lg:text-5xl font-black leading-tight text-right">
                  حزام واحد
                  <br />
                  يحكم الكل
                </h1>

                {/* Description Box */}
                <div className="bg-black text-white p-4 sm:p-6 border-1 border-black transform -rotate-1">
                  <p className="text-base sm:text-lg md:text-l font-bold text-right leading-relaxed">
                    صاكادو يد وحدة: يرفد بزاف ويبان صغير. خفيف، مريح، يخدم القراية والسبور والخرجات
                  </p>
                </div>

                <Button
                  className="bg-yellow-400 text-black px-8 py-4 border-1 border-black rounded-none font-black text-lg hover:bg-yellow-300 transition-all duration-150 transform hover:translate-x-1 hover:translate-y-1 shadow-[2px_2px_0px_0px_#000]"
                  onClick={() => scrollToSection("buy")}
                >
                  <ShoppingBag className="ml-2" size={20} />
                  اشتر الآن - 2500 دج
                </Button>
              </div>

              {/* Image Section */}
              <div className="relative order-1 lg:order-2 flex justify-center">
                <div className="relative max-w-md">
                  <img
                    src="/bagpack_001.png"
                    alt="Mono Backpack"
                    className="w-full h-auto transform rotate-3"
                  />

                  {/* Big Cost Cards */}
                  <div className="absolute top-8 sm:top-12 left-8 sm:left-12 transform -rotate-12 z-10">
                    {/* Price Card  */}
                    <div className="bg-yellow-400 border-4 border-black px-6 py-4 mb-2 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] transition-all">
                      <span className="font-black text-2xl sm:text-3xl">2500 دج</span>
                    </div>
                    {/* Free Delivery Card */}
                    <div className="bg-green-400 border-4 border-black px-6 py-4 shadow-[4px_4px_0px_0px_#000] hover:shadow-[6px_6px_0px_0px_#000] transition-all">
                      <span className="font-black text-lg sm:text-xl">التوصيل باطل</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
        <div className="w-full h-0.5 bg-black"></div>

        {/* Specs Section */}
        <section id="specs" className="bg-white py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black mb-4">
                المواصفات والخصائص
              </h2>
              <div className="bg-black h-1 w-32 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {specs.map((spec, index) => (
                <div
                  key={index}
                  className={`${spec.bgColor} border-2 border-black p-8 text-center transition-all duration-150 transform hover:-translate-y-1 hover:scale-110  shadow-[2px_2px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000]`}
                >
                  <div className="mb-6">
                    <img
                      src={spec.image}
                      alt={spec.title}
                      className="w-48 h-48 object-contain mx-auto"
                    />
                  </div>
                  <h3 className="font-black text-xl mb-4">{spec.title}</h3>
                  <p className="text-sm leading-relaxed ">
                    {spec.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <div className="w-full h-0.5 bg-black"></div>

        {/* Order Section */}
        <section id="buy" className="bg-white py-16 px-6">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-black mb-4">
                اطلب قبل ما تخلاص
              </h2>
              <div className="bg-black h-1 w-32 mx-auto"></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

              {/* Form Section */}
              <div className="space-y-8">
                <div className="bg-white border-2 border-black p-8">
                  {validationError && (
                    <Alert className="border-2 border-red-500 bg-red-50 text-black mb-6 flex items-start gap-3 p-4">
                      <OctagonAlertIcon className="h-5 w-5 text-black mt-1" />
                      <div className="text-right">
                        <AlertTitle className="font-extrabold text-base">
                          يرجى ملء جميع الحقول المطلوبة
                        </AlertTitle>
                        <AlertDescription className="text-sm font-medium">
                          تأكد من إدخال الاسم، رقم الهاتف، واختيار الموقع (الولاية،
                          الدائرة، والبلدية).
                        </AlertDescription>
                      </div>
                    </Alert>
                  )}

                  {orderError && (
                    <Alert className="border-2 border-red-500 bg-red-50 text-black mb-6 flex items-start gap-3 p-4">
                      <OctagonAlertIcon className="h-5 w-5 text-red-600 mt-1" />
                      <div className="text-right">
                        <AlertTitle className="font-extrabold text-base text-red-800">
                          حدث خطأ في إرسال الطلب
                        </AlertTitle>
                        <AlertDescription className="text-sm font-medium text-red-700">
                          {orderError}
                        </AlertDescription>
                      </div>
                    </Alert>
                  )}

                  <div className="space-y-6">
                    <div>
                      <Label
                        htmlFor="name"
                        className="block text-base font-bold mb-2 text-right"
                      >
                        الاسم الكامل
                        <span className="text-red-500 mr-1 text-xl">*</span>
                      </Label>
                      <Input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className="w-full p-6 border-2 border-black rounded-none bg-white text-right font-bold"
                        placeholder="أدخل اسمك الكامل"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="email"
                        className="block text-base font-bold mb-2 text-right"
                      >
                        البريد الإلكتروني (ليس مهمًا)
                      </Label>
                      <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className="w-full p-6 border-2 border-black rounded-none bg-white text-right font-bold"
                        placeholder="أدخل بريدك الإلكتروني"
                      />
                    </div>

                    <div>
                      <Label
                        htmlFor="phone"
                        className="block text-base font-bold mb-2 text-right"
                      >
                        رقم الهاتف
                        <span className="text-red-500 mr-1 text-xl">*</span>
                      </Label>
                      <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className="w-full p-6 border-2 border-black rounded-none bg-white text-right font-bold"
                        placeholder="أدخل رقم هاتفك"
                      />
                    </div>

                    <div className="space-y-4">
                      {/* Wilaya Combobox */}
                      <div>
                        <Label className="text-right block text-base font-bold mb-2">
                          الولاية
                          <span className="text-red-500 mr-1 text-xl">*</span>
                        </Label>
                        <Popover open={wilayaOpen} onOpenChange={setWilayaOpen}>
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={wilayaOpen}
                              className="w-full p-4 border-2 border-black rounded-none bg-white font-bold justify-between text-right h-auto flex flex-row-reverse"
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
                                      className="text-right font-bold py-3 px-4 cursor-pointer hover:bg-gray-100"
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
                          <Label className="text-right block text-base font-bold mb-2">
                            الدائرة
                            <span className="text-red-500 mr-1 text-xl">*</span>
                          </Label>
                          <Popover open={dairaOpen} onOpenChange={setDairaOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={dairaOpen}
                                className="w-full p-4 border-2 border-black rounded-none bg-white font-bold justify-between text-right h-auto flex flex-row-reverse"
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
                                        className="text-right font-bold py-3 px-4 cursor-pointer hover:bg-gray-100"
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
                          <Label className="text-right block text-base font-bold mb-2">
                            البلدية
                            <span className="text-red-500 mr-1 text-xl">*</span>
                          </Label>
                          <Popover open={communeOpen} onOpenChange={setCommuneOpen}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={communeOpen}
                                className="w-full p-4 border-2 border-black rounded-none bg-white font-bold justify-between text-right h-auto flex flex-row-reverse"
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
                                        className="text-right font-bold py-3 px-4 cursor-pointer hover:bg-gray-100"
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
              </div>
              {/* Product Selection */}
              <div className="space-y-8">

                {/* Product Carousel */}
                <div className="bg-white border-2 border-black p-3 sm:p-6 transform -rotate-1">
                  <div className="relative">
                    <div className="overflow-hidden rounded-lg">
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
                              className={`${product.bgColor} p-2 sm:p-4 border-2 border-black rounded-lg`}
                            >
                              <div className="relative w-full">
                                <img
                                  src={product.image}
                                  alt={product.title}
                                  className="w-72 h-64 object-cover rounded-md mx-auto"
                                  loading="lazy"
                                />
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Navigation Buttons */}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute left-1 sm:left-4 top-1/2 transform -translate-y-1/2 bg-black text-white border-2 border-black font-black hover:bg-gray-800 w-8 h-8 sm:w-10 sm:h-10 z-10"
                      onClick={prevSlide}
                    >
                      <ArrowLeft size={14} className="sm:w-4 sm:h-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="absolute right-1 sm:right-4 top-1/2 transform -translate-y-1/2 bg-black text-white border-2 border-black font-black hover:bg-gray-800 w-8 h-8 sm:w-10 sm:h-10 z-10"
                      onClick={nextSlide}
                    >
                      <ArrowRight size={14} className="sm:w-4 sm:h-4" />
                    </Button>

                    {/* Pagination Dots */}
                    <div className="flex justify-center mt-4 sm:mt-6 gap-2 sm:gap-3">
                      {products.map((_, index) => (
                        <button
                          key={index}
                          className={`w-3 h-3 sm:w-4 sm:h-4 border-2 border-black transition-colors rounded-sm ${index === currentSlide ? "bg-black" : "bg-white"
                            }`}
                          onClick={() => setCurrentSlide(index)}
                          aria-label={`Go to slide ${index + 1}`}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                {/* Quantity Section */}
                <div className="bg-white border-2 border-black p-6 transform rotate-1">
                  <div className="space-y-6 text-right">
                    <div className="space-y-4">
                      <Label className="block text-lg font-black text-gray-900">
                        الكمية المطلوبة
                        <span className="block text-sm font-semibold text-gray-600 mt-1">
                          متبقي {totalStock - quantity}{" "}
                          {getUnitLabel(totalStock - quantity)} في المخزون
                        </span>
                      </Label>

                      {quantityError && (
                        <Alert className="border-2 border-red-400 bg-red-50 text-red-900 flex items-start gap-3 p-4">
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

                      <div className="flex items-center justify-center gap-6">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={incrementQuantity}
                          disabled={quantity >= totalStock}
                          className="h-12 w-12 border-2 border-black bg-white hover:bg-gray-100 font-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="h-5 w-5" />
                        </Button>
                        <span className="w-16 text-center font-black text-xl">
                          {quantity}
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={decrementQuantity}
                          disabled={quantity <= 1}
                          className="h-12 w-12 border-2 border-black bg-white hover:bg-gray-100 font-black transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Minus className="h-5 w-5" />
                        </Button>
                      </div>
                    </div>

                    <div className="border-t-2 border-black pt-4">
                      <div className="space-y-3">
                        <div className="flex justify-between items-center text-lg">
                          <span className="font-black">السعر</span>
                          <span className="font-black">{price} دج</span>
                        </div>
                        <div className="flex justify-between items-center font-black text-xl">
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
            </div>



            {/* Submit Button */}
            <div className="flex justify-center mt-12">
              <Button
                type="button"
                className="bg-yellow-400 text-black px-32 py-6 border-1 border-black rounded-none font-black text-lg hover:bg-yellow-300 transition-all duration-150 transform hover:translate-x-1 hover:translate-y-1 shadow-[2px_2px_0px_0px_#000]"
                onClick={handleSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? "جاري الإرسال..." : "اطلب الآن"}
              </Button>
            </div>
          </div>
        </section>

        <OrderNotifications userWilaya={selectedWilaya} userCommune={selectedCommune} />
      </Layout>
    </div>
  );
}