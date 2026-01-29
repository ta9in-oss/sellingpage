import { useState } from 'react';
import { Plus, Minus, OctagonAlertIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

interface QuantitySelectorProps {
    quantity: number;
    onQuantityChange: (newQuantity: number) => void;
    totalStock: number;
    price: number;
    unitLabel?: (num: number) => string;
    onSubmit?: () => void;
    isSubmitting?: boolean;
    submitButtonText?: string;
    showSubmitButton?: boolean;
}

export function QuantitySelector({
    quantity,
    onQuantityChange,
    totalStock,
    price,
    unitLabel,
    onSubmit,
    isSubmitting = false,
    submitButtonText = 'أكّد الطلب',
    showSubmitButton = true,
}: QuantitySelectorProps) {
    const [quantityError, setQuantityError] = useState(false);

    const defaultUnitLabel = (num: number) => {
        if (num === 0) return 'حقائب';
        if (num === 1) return 'حقيبة';
        if (num === 2) return 'حقيبتين';
        if (num >= 3 && num <= 10) return 'حقائب';
        return 'حقيبة';
    };

    const getLabel = unitLabel || defaultUnitLabel;
    const total = price * quantity;

    const incrementQuantity = () => {
        if (quantity < totalStock) {
            onQuantityChange(quantity + 1);
        }
    };

    const decrementQuantity = () => {
        if (quantity > 1) {
            onQuantityChange(quantity - 1);
        }
    };

    const handleSubmit = () => {
        if (quantity < 1) {
            setQuantityError(true);
            setTimeout(() => setQuantityError(false), 5000);
            return;
        }
        if (onSubmit) {
            onSubmit();
        }
    };

    return (
        <div className="bg-white border-2 border-black p-6 transform rotate-1">
            <div className="space-y-6 text-right">
                <div className="space-y-4">
                    <Label className="block text-lg font-black text-gray-900">
                        الكمية المطلوبة
                        <span className="block text-sm font-semibold text-gray-600 mt-1">
                            متبقي {totalStock - quantity} {getLabel(totalStock - quantity)} في المخزون
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

                    {showSubmitButton && (
                        <Button
                            onClick={handleSubmit}
                            disabled={isSubmitting}
                            className="w-full bg-yellow-400 text-black px-8 py-6 border-2 border-black rounded-none font-black text-xl hover:bg-yellow-300 transition-all duration-150 transform hover:translate-x-1 hover:translate-y-1 shadow-[4px_4px_0px_0px_#000]"
                        >
                            {isSubmitting ? 'جاري الإرسال...' : submitButtonText}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
