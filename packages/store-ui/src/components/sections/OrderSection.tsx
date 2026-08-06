import { useState } from 'react';
import { ProductCarousel } from './ProductCarousel';
import { QuantitySelector } from './QuantitySelector';
import { Check, ChevronsUpDown, OctagonAlertIcon } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
import { useTheme } from '../../context/ThemeContext';
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
} from '../../components/ui/command';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '../../components/ui/popover';
import { cn } from '../../lib/utils';
import { useAlgeriaLocations } from '../../hooks/useAlgeriaLocations';
import type { OrderFieldsConfig, OrderLayoutConfig, ProductImage } from '../../types/content.types';

interface OrderSectionProps {
    price: number;
    /** Units orderable, or `null` when the merchant does not track stock. */
    totalStock: number | null;
    productImages: ProductImage[];
    onSubmit: (orderData: OrderData) => Promise<void>;
    isSubmitting?: boolean;
    layoutConfig?: OrderLayoutConfig;
    title?: string;
    /** Active payment method set by merchant config. Not shown as a toggle to buyers. Defaults to 'cod'. */
    activePaymentMethod?: 'cod' | 'chargily';
    /** Buyer's authenticated email (required when activePaymentMethod is 'chargily'). */
    buyerEmail?: string;
    /** Buyer's display name. */
    buyerName?: string;
    /** Called when Chargily is active but buyer hasn't authenticated yet. */
    onAuthRequest?: () => void;
    /** Which fields the merchant made mandatory. Omitted keys fall back to REQUIRED_DEFAULTS. */
    requiredFields?: OrderFieldsConfig;
}

/**
 * What a store demands when the merchant has not said otherwise: enough to
 * dispatch a parcel and phone the buyer about it. Email stays optional — most
 * Algerian COD buyers do not have one to hand, and demanding it is a silent
 * conversion killer.
 */
const REQUIRED_DEFAULTS: Required<OrderFieldsConfig> = {
    name: true,
    phone: true,
    email: false,
    message: false,
};

export interface OrderData {
    name: string;
    email: string;
    phone: string;
    message: string;
    wilaya: string;
    daira: string;
    commune: string;
    quantity: number;
    total: number;
    paymentMethod: 'cod' | 'chargily';
}

export function OrderSection({
    price,
    totalStock,
    productImages,
    onSubmit,
    isSubmitting = false,
    layoutConfig,
    title = 'اطلب قبل ما تخلاص',
    activePaymentMethod = 'cod',
    buyerEmail,
    buyerName,
    onAuthRequest,
    requiredFields,
}: OrderSectionProps) {
    const required = { ...REQUIRED_DEFAULTS, ...(requiredFields ?? {}) };
    // Chargily sends the receipt by email, so online payment overrides the
    // merchant's choice. Everything else is theirs to decide.
    const emailRequired = required.email || activePaymentMethod === 'chargily';
    const [quantity, setQuantity] = useState(1);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [selectedWilaya, setSelectedWilaya] = useState('');
    const [selectedDaira, setSelectedDaira] = useState('');
    const [selectedCommune, setSelectedCommune] = useState('');
    const [wilayaOpen, setWilayaOpen] = useState(false);
    const [dairaOpen, setDairaOpen] = useState(false);
    const [communeOpen, setCommuneOpen] = useState(false);
    const [validationError, setValidationError] = useState(false);
    const [orderError, setOrderError] = useState('');

    const { wilayas, getAvailableDairas, getAvailableCommunes } = useAlgeriaLocations();
    const availableDairas = getAvailableDairas(selectedWilaya);
    const availableCommunes = getAvailableCommunes(selectedWilaya, selectedDaira);

    const layout = layoutConfig || { type: 'form-right-carousel-quantity-left', showCarousel: true };
    const showCarousel = layout.showCarousel !== false;

    const theme = useTheme();
    const isDark = theme.mode === 'dark';
    const submitButtonText = activePaymentMethod === 'chargily' ? 'ادفع إلكترونياً' : 'أكّد الطلب';
    const darkInput = isDark ? { backgroundColor: '#1a1a1a', border: `1px solid ${theme.colors.border}`, color: theme.colors.foreground, borderRadius: '6px' } : {};
    const darkPopoverBtn = isDark ? { backgroundColor: '#1a1a1a', border: `1px solid ${theme.colors.border}`, color: theme.colors.foreground, borderRadius: '6px' } : {};
    const darkPopoverContent = isDark ? { backgroundColor: '#161616', border: `1px solid ${theme.colors.border}` } : {};

    const handleWilayaChange = (value: string) => {
        setSelectedWilaya(value);
        setSelectedDaira('');
        setSelectedCommune('');
    };

    const handleDairaChange = (value: string) => {
        setSelectedDaira(value);
        setSelectedCommune('');
    };

    const handleCommuneChange = (value: string) => {
        setSelectedCommune(value);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        setValidationError(false);
        setOrderError('');

        if (quantity < 1) {
            setOrderError('يجب أن تكون الكمية على الأقل 1');
            setTimeout(() => setOrderError(''), 5000);
            return;
        }

        // Location is always required — a parcel cannot be delivered without it.
        const missing =
            (required.name && !formData.name.trim()) ||
            (required.phone && !formData.phone.trim()) ||
            (emailRequired && !formData.email.trim()) ||
            (required.message && !(formData.message ?? '').trim()) ||
            !selectedWilaya || !selectedDaira || !selectedCommune;
        if (missing) {
            setValidationError(true);
            setTimeout(() => setValidationError(false), 5000);
            return;
        }

        try {
            await onSubmit({
                ...formData,
                name: formData.name,
                email: formData.email,
                wilaya: selectedWilaya,
                daira: selectedDaira,
                commune: selectedCommune,
                quantity,
                total: price * quantity,
                paymentMethod: activePaymentMethod,
            });
        } catch (error: any) {
            setOrderError(error.message || 'حدث خطأ في إرسال الطلب');
            setTimeout(() => setOrderError(''), 5000);
        }
    };

    // Render form fields component
    const renderForm = () => (
        <div className={isDark ? 'p-8' : 'bg-white border-2 border-black p-8'} style={isDark ? { backgroundColor: theme.colors.muted, border: `1px solid ${theme.colors.border}`, borderRadius: theme.effects.borderRadius } : {}}>
            {validationError && (
                <Alert className="border-2 border-red-500 bg-red-50 text-black mb-6 flex items-start gap-3 p-4">
                    <OctagonAlertIcon className="h-5 w-5 text-black mt-1" />
                    <div className="text-right">
                        <AlertTitle className="font-extrabold text-base">
                            يرجى ملء جميع الحقول المطلوبة
                        </AlertTitle>
                        <AlertDescription className="text-sm font-medium">
                            تأكد من إدخال الاسم، رقم الهاتف، واختيار الموقع (الولاية، الدائرة، والبلدية).
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
                {/* Name */}
                <div>
                    <Label htmlFor="name" className="block text-base font-bold mb-2 text-right">
                        الاسم الكامل
                        {required.name && <span className="text-red-500 mr-1 text-xl">*</span>}
                    </Label>
                    <Input
                        type="text"
                        id="name"
                        name="name"
                        value={formData.name}
                        onChange={handleInputChange}
                        className={isDark ? "w-full p-6 text-right font-bold" : "w-full p-6 border-2 border-black rounded-none bg-white text-right font-bold"} style={isDark ? darkInput : {}}
                        placeholder="أدخل اسمك الكامل"
                    />
                </div>

                {/* Email */}
                <div>
                    <Label htmlFor="email" className="block text-base font-bold mb-2 text-right">
                        البريد الإلكتروني
                        {emailRequired
                            ? <span className="text-red-500 mr-1 text-xl">*</span>
                            : <span className="text-sm font-normal mr-1">(اختياري)</span>}
                        {activePaymentMethod === 'chargily' && (
                            <span className="block text-xs font-normal text-gray-500 mt-0.5">مطلوب للدفع الإلكتروني</span>
                        )}
                    </Label>
                    <Input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        className={isDark ? "w-full p-6 text-right font-bold" : "w-full p-6 border-2 border-black rounded-none bg-white text-right font-bold"} style={isDark ? darkInput : {}}
                        placeholder="أدخل بريدك الإلكتروني"
                    />
                </div>

                {/* Phone */}
                <div>
                    <Label htmlFor="phone" className="block text-base font-bold mb-2 text-right">
                        رقم الهاتف
                        {required.phone && <span className="text-red-500 mr-1 text-xl">*</span>}
                    </Label>
                    <Input
                        type="tel"
                        id="phone"
                        name="phone"
                        value={formData.phone}
                        onChange={handleInputChange}
                        className={isDark ? "w-full p-6 text-right font-bold" : "w-full p-6 border-2 border-black rounded-none bg-white text-right font-bold"} style={isDark ? darkInput : {}}
                        placeholder="05XX XX XX XX"
                    />
                </div>

                {/* Wilaya */}
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
                                className={isDark ? "w-full p-4 font-bold justify-between text-right h-auto flex flex-row-reverse" : "w-full p-4 border-2 border-black rounded-none bg-white font-bold justify-between text-right h-auto flex flex-row-reverse"} style={isDark ? darkPopoverBtn : {}}
                            >
                                <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                {selectedWilaya || 'اختر الولاية'}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent
                            className={isDark ? "w-[var(--radix-popover-trigger-width)] p-0" : "w-[var(--radix-popover-trigger-width)] p-0 border-2 border-black bg-white"} style={isDark ? darkPopoverContent : {}}
                            align="start"
                            side="bottom"
                        >
                            <Command dir="rtl" className="rounded-none" style={{ fontFamily: 'Almarai, sans-serif', backgroundColor: isDark ? '#161616' : '#fff', color: isDark ? '#fff' : '#000' }}>
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
                                                        'mr-2 h-4 w-4',
                                                        selectedWilaya === wilaya ? 'opacity-100' : 'opacity-0'
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

                {/* Daira */}
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
                                    className={isDark ? "w-full p-4 font-bold justify-between text-right h-auto flex flex-row-reverse" : "w-full p-4 border-2 border-black rounded-none bg-white font-bold justify-between text-right h-auto flex flex-row-reverse"} style={isDark ? darkPopoverBtn : {}}
                                    disabled={!selectedWilaya}
                                >
                                    <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                    {selectedDaira || 'اختر الدائرة'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className={isDark ? "w-[var(--radix-popover-trigger-width)] p-0" : "w-[var(--radix-popover-trigger-width)] p-0 border-2 border-black bg-white"} style={isDark ? darkPopoverContent : {}}
                                align="start"
                                side="bottom"
                            >
                                <Command dir="rtl" className="rounded-none" style={{ fontFamily: 'Almarai, sans-serif', backgroundColor: isDark ? '#161616' : '#fff', color: isDark ? '#fff' : '#000' }}>
                                    <CommandInput placeholder="ابحث عن الدائرة..." className="mt-2 text-right border-0 border-black rounded-none h-12 font-bold" />
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
                                                            'mr-2 h-4 w-4',
                                                            selectedDaira === daira ? 'opacity-100' : 'opacity-0'
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

                {/* Commune */}
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
                                    className={isDark ? "w-full p-4 font-bold justify-between text-right h-auto flex flex-row-reverse" : "w-full p-4 border-2 border-black rounded-none bg-white font-bold justify-between text-right h-auto flex flex-row-reverse"} style={isDark ? darkPopoverBtn : {}}
                                    disabled={!selectedDaira}
                                >
                                    <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                    {selectedCommune || 'اختر البلدية'}
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent
                                className={isDark ? "w-[var(--radix-popover-trigger-width)] p-0" : "w-[var(--radix-popover-trigger-width)] p-0 border-2 border-black bg-white"} style={isDark ? darkPopoverContent : {}}
                                align="start"
                                side="bottom"
                            >
                                <Command dir="rtl" className="rounded-none" style={{ fontFamily: 'Almarai, sans-serif', backgroundColor: isDark ? '#161616' : '#fff', color: isDark ? '#fff' : '#000' }}>
                                    <CommandInput placeholder="ابحث عن البلدية..." className="mt-2 text-right border-0 border-black rounded-none h-12 font-bold" />
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
                                                            'mr-2 h-4 w-4',
                                                            selectedCommune === commune ? 'opacity-100' : 'opacity-0'
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
    );

    // Wrapper function to add section title and spacing
    const wrapWithSection = (content: React.ReactElement) => (
        <section className="py-16 px-6" style={isDark ? { backgroundColor: theme.colors.background } : { backgroundColor: '#fff' }}>
            <div className="max-w-6xl mx-auto">
                {/* Section Title */}
                <div className="text-center mb-12">
                    <h2 className="text-4xl font-black mb-4" style={isDark ? { color: theme.colors.foreground } : {}}>
                        {title}
                    </h2>
                    <div className="bg-black h-1 w-32 mx-auto"></div>
                </div>
                {content}
            </div>
        </section>
    );

    // Render layout based on configuration
    // Note: In RTL mode, grid columns are reversed, so we swap the order
    const isRTL = theme.direction === 'rtl';

    if (layout.type === 'form-right-carousel-quantity-left') {
        return wrapWithSection(
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {/* In RTL: Right column appears is on right) */}
                {isRTL ? (
                    <>
                        {/* Right Column: Form */}
                        <div className="space-y-8">
                            {renderForm()}
                        </div>

                        {/* Left Column: Carousel + Quantity */}
                        <div className="space-y-8">
                            {showCarousel && <ProductCarousel products={productImages} />}
                            <QuantitySelector
                                quantity={quantity}
                                onQuantityChange={setQuantity}
                                totalStock={totalStock}
                                price={price}
                                onSubmit={handleSubmit}
                                isSubmitting={isSubmitting}
                                paymentMethod={activePaymentMethod}
                                submitButtonText={submitButtonText}
                            />
                        </div>
                    </>
                ) : (
                    <>
                        {/* Left Column: Carousel + Quantity */}
                        <div className="space-y-8">
                            {showCarousel && <ProductCarousel products={productImages} />}
                            <QuantitySelector
                                quantity={quantity}
                                onQuantityChange={setQuantity}
                                totalStock={totalStock}
                                price={price}
                                onSubmit={handleSubmit}
                                isSubmitting={isSubmitting}
                                paymentMethod={activePaymentMethod}
                                submitButtonText={submitButtonText}
                            />
                        </div>

                        {/* Right Column: Form */}
                        <div className="space-y-8">
                            {renderForm()}
                        </div>
                    </>
                )}
            </div>
        );
    }

    if (layout.type === 'form-left-carousel-quantity-right') {
        return wrapWithSection(
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                {isRTL ? (
                    <>
                        {/* Left Column: Carousel + Quantity */}
                        <div className="space-y-8">
                            {showCarousel && <ProductCarousel products={productImages} />}
                            <QuantitySelector
                                quantity={quantity}
                                onQuantityChange={setQuantity}
                                totalStock={totalStock}
                                price={price}
                                onSubmit={handleSubmit}
                                isSubmitting={isSubmitting}
                                paymentMethod={activePaymentMethod}
                                submitButtonText={submitButtonText}
                            />
                        </div>

                        {/* Right Column: Form */}
                        <div className="space-y-8">
                            {renderForm()}
                        </div>
                    </>
                ) : (
                    <>
                        {/* Left Column: Form */}
                        <div className="space-y-8">
                            {renderForm()}
                        </div>

                        {/* Right Column: Carousel + Quantity */}
                        <div className="space-y-8">
                            {showCarousel && <ProductCarousel products={productImages} />}
                            <QuantitySelector
                                quantity={quantity}
                                onQuantityChange={setQuantity}
                                totalStock={totalStock}
                                price={price}
                                onSubmit={handleSubmit}
                                isSubmitting={isSubmitting}
                                paymentMethod={activePaymentMethod}
                                submitButtonText={submitButtonText}
                            />
                        </div>
                    </>
                )}
            </div>
        );
    }
    if (layout.type === 'side-by-side') {
        return wrapWithSection(
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
                <div className="space-y-8">
                    {renderForm()}
                </div>
                <div className="space-y-8">
                    <QuantitySelector
                        quantity={quantity}
                        onQuantityChange={setQuantity}
                        totalStock={totalStock}
                        price={price}
                        onSubmit={handleSubmit}
                        isSubmitting={isSubmitting}
                    />
                </div>
            </div>
        );
    }

    if (layout.type === 'stacked') {
        return wrapWithSection(
            <div className="space-y-12">
                {showCarousel && <ProductCarousel products={productImages} />}
                {renderForm()}
                <QuantitySelector
                    quantity={quantity}
                    onQuantityChange={setQuantity}
                    totalStock={totalStock}
                    price={price}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    paymentMethod={activePaymentMethod}
                    submitButtonText={submitButtonText}
                />
            </div>
        );
    }

    // Default fallback
    return wrapWithSection(
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
            <div className="space-y-8">
                {showCarousel && <ProductCarousel products={productImages} />}
                <QuantitySelector
                    quantity={quantity}
                    onQuantityChange={setQuantity}
                    totalStock={totalStock}
                    price={price}
                    onSubmit={handleSubmit}
                    isSubmitting={isSubmitting}
                    paymentMethod={activePaymentMethod}
                    submitButtonText={submitButtonText}
                />
            </div>
            <div className="space-y-8">
                {renderForm()}
            </div>
        </div>
    );
}
