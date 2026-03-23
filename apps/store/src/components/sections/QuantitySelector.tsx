import { useState } from 'react';
import { Plus, Minus, OctagonAlertIcon, CreditCard, Truck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { getTheme } from '@/lib/theme';

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
    paymentMethod?: 'cod' | 'chargily';
    onPaymentMethodChange?: (method: 'cod' | 'chargily') => void;
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
    paymentMethod = 'cod',
    onPaymentMethodChange,
}: QuantitySelectorProps) {
    const [quantityError, setQuantityError] = useState(false);
    const theme = getTheme();
    const isDark = theme.mode === 'dark';

    const defaultUnitLabel = (num: number) => {
        if (num === 0) return 'حقائب';
        if (num === 1) return 'حقيبة';
        if (num === 2) return 'حقيبتين';
        if (num >= 3 && num <= 10) return 'حقائب';
        return 'حقيبة';
    };

    const getLabel = unitLabel || defaultUnitLabel;
    const total = price * quantity;

    const incrementQuantity = () => { if (quantity < totalStock) onQuantityChange(quantity + 1); };
    const decrementQuantity = () => { if (quantity > 1) onQuantityChange(quantity - 1); };

    const handleSubmit = () => {
        if (quantity < 1) {
            setQuantityError(true);
            setTimeout(() => setQuantityError(false), 5000);
            return;
        }
        if (onSubmit) onSubmit();
    };

    // ── Brutalist ──────────────────────────────────────────────────────────
    if (!isDark) {
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
                                    <AlertTitle className="font-bold text-base text-red-900">خطأ في الكمية</AlertTitle>
                                    <AlertDescription className="text-sm font-medium text-red-800">يجب أن تكون الكمية على الأقل 1</AlertDescription>
                                </div>
                            </Alert>
                        )}

                        <div className="flex items-center justify-center gap-6">
                            <Button variant="outline" onClick={incrementQuantity} disabled={quantity >= totalStock}
                                className="w-16 h-16 border-2 border-black rounded-none bg-yellow-400 hover:bg-yellow-300 text-black font-black text-2xl p-0 shadow-[2px_2px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] transition-all">
                                <Plus size={24} />
                            </Button>
                            <span className="text-5xl font-black min-w-[80px] text-center">{quantity}</span>
                            <Button variant="outline" onClick={decrementQuantity} disabled={quantity <= 1}
                                className="w-16 h-16 border-2 border-black rounded-none bg-white hover:bg-gray-100 text-black font-black text-2xl p-0 shadow-[2px_2px_0px_0px_#000] hover:shadow-[4px_4px_0px_0px_#000] transition-all">
                                <Minus size={24} />
                            </Button>
                        </div>

                        <div className="bg-black text-white p-6 text-center space-y-2">
                            <p className="text-base font-bold">السعر الإجمالي</p>
                            <p className="text-4xl font-black">{total.toLocaleString()} دج</p>
                            <p className="text-sm font-semibold opacity-80">({quantity} × {price.toLocaleString()} دج)</p>
                        </div>

                        {onPaymentMethodChange && (
                            <div className="space-y-3">
                                <p className="font-black text-base">طريقة الدفع</p>
                                <div className="grid grid-cols-2 gap-3">
                                    <button type="button" onClick={() => onPaymentMethodChange('cod')}
                                        className={`flex flex-col items-center gap-2 p-3 border-2 border-black font-bold text-sm transition-all duration-150 ${
                                            paymentMethod === 'cod'
                                                ? 'bg-yellow-400 text-black shadow-[4px_4px_0px_0px_#000] -translate-x-0.5 -translate-y-0.5'
                                                : 'bg-white text-black hover:bg-gray-50 shadow-[2px_2px_0px_0px_#000]'
                                        }`}>
                                        <Truck size={20} />
                                        <span>عند الاستلام</span>
                                    </button>
                                    <button type="button" onClick={() => onPaymentMethodChange('chargily')}
                                        className={`flex flex-col items-center gap-2 p-3 border-2 border-black font-bold text-sm transition-all duration-150 ${
                                            paymentMethod === 'chargily'
                                                ? 'bg-yellow-400 text-black shadow-[4px_4px_0px_0px_#000] -translate-x-0.5 -translate-y-0.5'
                                                : 'bg-white text-black hover:bg-gray-50 shadow-[2px_2px_0px_0px_#000]'
                                        }`}>
                                        <CreditCard size={20} />
                                        <span>دفع إلكتروني</span>
                                        <span className="text-xs opacity-70">EDAHABIA/CIB</span>
                                    </button>
                                </div>
                                {paymentMethod === 'chargily' && (
                                    <p className="text-xs font-bold text-gray-600 border-r-4 border-yellow-400 pr-3">
                                        ستُحوَّل إلى Chargily Pay للدفع الآمن
                                    </p>
                                )}
                            </div>
                        )}

                        {showSubmitButton && (
                            <Button onClick={handleSubmit} disabled={isSubmitting}
                                className="w-full bg-yellow-400 text-black px-8 py-6 border-2 border-black rounded-none font-black text-xl hover:bg-yellow-300 transition-all duration-150 transform hover:translate-x-1 hover:translate-y-1 shadow-[4px_4px_0px_0px_#000]">
                                {isSubmitting ? 'جاري المعالجة...' : paymentMethod === 'chargily' ? 'ادفع الآن' : submitButtonText}
                            </Button>
                        )}
                    </div>
                </div>
            </div>
        );
    }

    // ── Acquisition (dark) ─────────────────────────────────────────────────
    return (
        <div className="p-6" style={{ backgroundColor: theme.colors.muted, border: `1px solid ${theme.colors.border}`, borderRadius: theme.effects.borderRadius }}>
            <div className="space-y-6 text-right">
                <div className="space-y-4">
                    <Label className="block text-lg font-black" style={{ color: theme.colors.foreground }}>
                        الكمية المطلوبة
                        <span className="block text-sm font-semibold mt-1" style={{ color: '#9ca3af' }}>
                            متبقي {totalStock - quantity} {getLabel(totalStock - quantity)} في المخزون
                        </span>
                    </Label>

                    {quantityError && (
                        <Alert className="flex items-start gap-3 p-4" style={{ border: `1px solid #ef4444`, backgroundColor: '#1a0000' }}>
                            <OctagonAlertIcon className="h-5 w-5 text-red-500 mt-0.5 flex-shrink-0" />
                            <div className="text-right flex-1">
                                <AlertTitle className="font-bold text-base text-red-400">خطأ في الكمية</AlertTitle>
                                <AlertDescription className="text-sm font-medium text-red-300">يجب أن تكون الكمية على الأقل 1</AlertDescription>
                            </div>
                        </Alert>
                    )}

                    <div className="flex items-center justify-center gap-6">
                        <Button variant="outline" onClick={incrementQuantity} disabled={quantity >= totalStock}
                            className="w-16 h-16 font-black text-2xl p-0 transition-all"
                            style={{ backgroundColor: theme.colors.accent, color: '#000', border: 'none', borderRadius: theme.effects.borderRadius }}>
                            <Plus size={24} />
                        </Button>
                        <span className="text-5xl font-black min-w-[80px] text-center" style={{ color: theme.colors.foreground }}>{quantity}</span>
                        <Button variant="outline" onClick={decrementQuantity} disabled={quantity <= 1}
                            className="w-16 h-16 font-black text-2xl p-0 transition-all"
                            style={{ backgroundColor: theme.colors.muted, color: theme.colors.foreground, border: `1px solid ${theme.colors.border}`, borderRadius: theme.effects.borderRadius }}>
                            <Minus size={24} />
                        </Button>
                    </div>

                    <div className="p-6 text-center space-y-2" style={{ backgroundColor: '#0a0a0a', border: `1px solid ${theme.colors.border}`, borderRadius: theme.effects.borderRadius }}>
                        <p className="text-base font-bold" style={{ color: '#9ca3af' }}>السعر الإجمالي</p>
                        <p className="text-4xl font-black" style={{ color: theme.colors.accent }}>{total.toLocaleString()} دج</p>
                        <p className="text-sm font-semibold" style={{ color: '#6b7280' }}>({quantity} × {price.toLocaleString()} دج)</p>
                    </div>

                    {showSubmitButton && (
                        <Button onClick={handleSubmit} disabled={isSubmitting}
                            className="w-full px-8 py-6 font-black text-xl transition-all"
                            style={{ backgroundColor: theme.colors.accent, color: '#000', border: 'none', borderRadius: theme.effects.borderRadius, boxShadow: `0 4px 16px ${theme.colors.accent}40` }}>
                            {isSubmitting ? 'جاري الإرسال...' : submitButtonText}
                        </Button>
                    )}
                </div>
            </div>
        </div>
    );
}
