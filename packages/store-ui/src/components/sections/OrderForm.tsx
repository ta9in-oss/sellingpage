import { useState } from 'react';
import { Plus, Minus, Check, ChevronsUpDown, OctagonAlertIcon } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '../../components/ui/alert';
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

interface OrderFormProps {
    price: number;
    initialQuantity?: number;
    totalStock: number;
    onSubmit: (orderData: OrderFormData) => Promise<void>;
    isSubmitting?: boolean;
}

export interface OrderFormData {
    name: string;
    email: string;
    phone: string;
    message: string;
    wilaya: string;
    daira: string;
    commune: string;
    quantity: number;
    total: number;
}

export function OrderForm({
    price,
    initialQuantity = 1,
    totalStock,
    onSubmit,
    isSubmitting = false,
}: OrderFormProps) {
    const [quantity, setQuantity] = useState(initialQuantity);
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
    const [quantityError, setQuantityError] = useState(false);
    const [orderError, setOrderError] = useState('');

    const { wilayas, getAvailableDairas, getAvailableCommunes } = useAlgeriaLocations();
    const availableDairas = getAvailableDairas(selectedWilaya);
    const availableCommunes = getAvailableCommunes(selectedWilaya, selectedDaira);

    const total = price * quantity;

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

    const incrementQuantity = () => {
        setQuantity((prev) => (prev < totalStock ? prev + 1 : prev));
    };

    const decrementQuantity = () => {
        setQuantity((prev) => (prev > 1 ? prev - 1 : 1));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const getUnitLabel = (num: number) => {
        if (num === 0) return 'حقائب';
        if (num === 1) return 'حقيبة';
        if (num === 2) return 'حقيبتين';
        if (num >= 3 && num <= 10) return 'حقائب';
        return 'حقيبة';
    };

    const handleSubmit = async () => {
        setValidationError(false);
        setQuantityError(false);
        setOrderError('');

        if (quantity < 1) {
            setQuantityError(true);
            setTimeout(() => setQuantityError(false), 5000);
            return;
        }

        if (!formData.name || !formData.phone || !selectedWilaya || !selectedDaira || !selectedCommune) {
            setValidationError(true);
            setTimeout(() => setValidationError(false), 5000);
            return;
        }

        try {
            await onSubmit({
                ...formData,
                wilaya: selectedWilaya,
                daira: selectedDaira,
                commune: selectedCommune,
                quantity,
                total,
            });
        } catch (error: any) {
            setOrderError(error.message || 'حدث خطأ في إرسال الطلب');
            setTimeout(() => setOrderError(''), 5000);
        }
    };

    return (
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

                        {/* Email */}
                        <div>
                            <Label htmlFor="email" className="block text-base font-bold mb-2 text-right">
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

                        {/* Phone */}
                        <div>
                            <Label htmlFor="phone" className="block text-base font-bold mb-2 text-right">
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
                                        className="w-full p-4 border-2 border-black rounded-none bg-white font-bold justify-between text-right h-auto flex flex-row-reverse"
                                    >
                                        <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                        {selectedWilaya || 'اختر الولاية'}
                                    </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                    className="w-[var(--radix-popover-trigger-width)] p-0 border-2 border-black bg-white"
                                    align="start"
                                    side="bottom"
                                >
                                    <Command dir="rtl" className="rounded-none bg-white" style={{ fontFamily: 'Almarai, sans-serif' }}>
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
                                            className="w-full p-4 border-2 border-black rounded-none bg-white font-bold justify-between text-right h-auto flex flex-row-reverse"
                                            disabled={!selectedWilaya}
                                        >
                                            <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                            {selectedDaira || 'اختر الدائرة'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-[var(--radix-popover-trigger-width)] p-0 border-2 border-black bg-white"
                                        align="start"
                                        side="bottom"
                                    >
                                        <Command dir="rtl" className="rounded-none bg-white" style={{ fontFamily: 'Almarai, sans-serif' }}>
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
                                            className="w-full p-4 border-2 border-black rounded-none bg-white font-bold justify-between text-right h-auto flex flex-row-reverse"
                                            disabled={!selectedDaira}
                                        >
                                            <ChevronsUpDown className="mr-2 h-4 w-4 shrink-0 opacity-50" />
                                            {selectedCommune || 'اختر البلدية'}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent
                                        className="w-[var(--radix-popover-trigger-width)] p-0 border-2 border-black bg-white"
                                        align="start"
                                        side="bottom"
                                    >
                                        <Command dir="rtl" className="rounded-none bg-white" style={{ fontFamily: 'Almarai, sans-serif' }}>
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
            </div>

            {/* Quantity Section */}
            <div className="space-y-8">
                <div className="bg-white border-2 border-black p-6 transform rotate-1">
                    <div className="space-y-6 text-right">
                        <div className="space-y-4">
                            <Label className="block text-lg font-black text-gray-900">
                                الكمية المطلوبة
                                <span className="block text-sm font-semibold text-gray-600 mt-1">
                                    متبقي {totalStock - quantity} {getUnitLabel(totalStock - quantity)} في المخزون
                                </span>
                            </Label>

                            {quantityError && (
                                <Alert className="border-2 border-red-400 bg-red-50 text-red-900 flex items-start gap-3 p-4">
                                    <OctagonAlertIcon className="h-5 w-5 text-red-600 mt-0.5 flex-shrink-0" />
                                    <div className="text-right flex-1">
                                        <AlertTitle className="font-bold text-base text-red-900">
                                            خطأ في الكمية
                                        </AlertTitle>
                                        <AlertDescription className="text-sm font-medium text-red-800">
                                            يجب أن تكون الكمية على الأقل 1
                                        </AlertDescription>
                                    </div>
                                </Alert>
                            )}

                            <div className="flex items-center justify-center gap-6">
                                <Button
                                    variant="outline"
                                    onClick={incrementQuantity}
                                    className="w-16 h-16 border-2 border-black rounded-none bg-yellow-400 hover:bg-yellow-300 text-black font-black text-2xl p-0 shadow-[2px_2px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] transition-all"
                                    disabled={quantity >= totalStock}
                                >
                                    <Plus size={24} />
                                </Button>
                                <span className="text-5xl font-black min-w-[80px] text-center">{quantity}</span>
                                <Button
                                    variant="outline"
                                    onClick={decrementQuantity}
                                    className="w-16 h-16 border-2 border-black rounded-none bg-white hover:bg-gray-100 text-black font-black text-2xl p-0 shadow-[2px_2px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] transition-all"
                                    disabled={quantity <= 1}
                                >
                                    <Minus size={24} />
                                </Button>
                            </div>

                            <div className="bg-black text-white p-6 text-center space-y-2">
                                <p className="text-base font-bold">السعر الإجمالي</p>
                                <p className="text-4xl font-black">{total.toLocaleString()} دج</p>
                                <p className="text-sm font-semibold opacity-80">
                                    ({quantity} × {price.toLocaleString()} دج)
                                </p>
                            </div>

                            <Button
                                onClick={handleSubmit}
                                disabled={isSubmitting}
                                className="w-full bg-yellow-400 text-black px-8 py-6 border-2 border-black rounded-none font-black text-xl hover:bg-yellow-300 transition-all duration-150 transform hover:translate-x-1 hover:translate-y-1 shadow-[4px_4px_0px_0px_#000]"
                            >
                                {isSubmitting ? 'جاري الإرسال...' : 'أكّد الطلب'}
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
