import { Check, X, Minus } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext';

interface ComparisonRow {
    feature: string;
    us: boolean | string;
    shopify: boolean | string;
    ayor: boolean | string;
    woo: boolean | string;
}

interface ComparisonSectionProps {
    title?: string;
    rows?: ComparisonRow[];
}

const DEFAULT_ROWS: ComparisonRow[] = [
    { feature: 'سهولة الإعداد',           us: true,          shopify: true,  ayor: true,  woo: false },
    { feature: 'تكامل شاريلي للدفع',      us: true,          shopify: false, ayor: false, woo: false },
    { feature: 'نشر تلقائي على Cloudflare', us: true,         shopify: false, ayor: false, woo: false },
    { feature: 'تحكم كامل في التصميم',      us: true,         shopify: 'جزئي', ayor: false, woo: true },
    { feature: 'بدون رسوم شهرية مرتفعة',   us: true,          shopify: false, ayor: false, woo: true },
    { feature: 'دعم اللغة العربية',         us: true,          shopify: 'جزئي', ayor: true,  woo: 'جزئي' },
    { feature: 'متجر جزائري 100٪',         us: true,          shopify: false, ayor: true,  woo: false },
    { feature: 'أداء عالي (Edge/CDN)',      us: true,          shopify: true,  ayor: false, woo: false },
    { feature: 'قاعدة بيانات مدمجة',        us: true,          shopify: true,  ayor: false, woo: false },
    { feature: 'كود المصدر قابل للتنزيل',   us: true,          shopify: false, ayor: false, woo: true },
];

function Cell({ value }: { value: boolean | string }) {
    if (value === true) return <Check size={18} className="text-emerald-500 mx-auto" strokeWidth={2.5} />;
    if (value === false) return <X size={18} className="text-red-400 mx-auto" strokeWidth={2.5} />;
    return <span className="text-xs text-amber-500 font-semibold">{value}</span>;
}

export function ComparisonSection({ title, rows = DEFAULT_ROWS }: ComparisonSectionProps) {
    const theme = useTheme();
    const isDark = theme.mode === 'dark';
    const isClean = theme.name === 'clean';

    const sectionTitle = title ?? 'كيف نقارن بالآخرين؟';

    const competitors = [
        { key: 'us',      label: '7aba.store', highlight: true },
        { key: 'shopify', label: 'Shopify',    highlight: false },
        { key: 'ayor',    label: 'Ayor',       highlight: false },
        { key: 'woo',     label: 'WooCommerce', highlight: false },
    ] as const;

    // ── Dark ──────────────────────────────────────────────────────────────
    if (isDark) {
        return (
            <section className="py-16 px-6" style={{ backgroundColor: theme.colors.background }}>
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-black text-center mb-10" style={{ color: theme.colors.foreground }}>
                        {sectionTitle}
                    </h2>
                    <div className="overflow-x-auto">
                        <table className="w-full" style={{ borderCollapse: 'separate', borderSpacing: 0 }}>
                            <thead>
                                <tr>
                                    <th className="text-right p-4 text-sm font-bold" style={{ color: '#6b7280' }}>الميزة</th>
                                    {competitors.map(c => (
                                        <th key={c.key} className="text-center p-4 text-sm font-bold"
                                            style={{ color: c.highlight ? theme.colors.accent : '#6b7280' }}>
                                            {c.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, i) => (
                                    <tr key={i} style={{ borderTop: `1px solid ${theme.colors.border}` }}>
                                        <td className="text-right p-4 text-sm font-medium" style={{ color: theme.colors.foreground }}>{row.feature}</td>
                                        {competitors.map(c => (
                                            <td key={c.key} className="text-center p-4"
                                                style={{ backgroundColor: c.highlight ? `${theme.colors.accent}08` : undefined }}>
                                                <Cell value={row[c.key]} />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        );
    }

    // ── Clean ─────────────────────────────────────────────────────────────
    if (isClean) {
        return (
            <section className="py-16 px-6 bg-slate-50">
                <div className="max-w-5xl mx-auto">
                    <h2 className="text-4xl font-black text-center text-slate-900 mb-10">{sectionTitle}</h2>
                    <div className="overflow-x-auto bg-white rounded-2xl border border-slate-200 shadow-sm">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="text-right p-4 text-sm font-bold text-slate-500">الميزة</th>
                                    {competitors.map(c => (
                                        <th key={c.key} className={`text-center p-4 text-sm font-bold ${c.highlight ? 'text-sky-600' : 'text-slate-500'}`}>
                                            {c.label}
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {rows.map((row, i) => (
                                    <tr key={i} className="border-b border-slate-100 last:border-0 hover:bg-slate-50 transition-colors">
                                        <td className="text-right p-4 text-sm font-medium text-slate-800">{row.feature}</td>
                                        {competitors.map(c => (
                                            <td key={c.key} className={`text-center p-4 ${c.highlight ? 'bg-sky-50/50' : ''}`}>
                                                <Cell value={row[c.key]} />
                                            </td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </section>
        );
    }

    // ── Brutalist ─────────────────────────────────────────────────────────
    return (
        <section className="py-16 px-6 bg-white">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <h2 className="text-4xl font-black mb-3">{sectionTitle}</h2>
                    <div className="bg-black h-1 w-24 mx-auto" />
                </div>
                <div className="overflow-x-auto border-2 border-black shadow-[4px_4px_0px_0px_#000]">
                    <table className="w-full">
                        <thead className="bg-black text-white">
                            <tr>
                                <th className="text-right p-4 text-sm font-bold">الميزة</th>
                                {competitors.map(c => (
                                    <th key={c.key}
                                        className={`text-center p-4 text-sm font-black ${c.highlight ? 'text-yellow-400' : ''}`}>
                                        {c.label}
                                    </th>
                                ))}
                            </tr>
                        </thead>
                        <tbody>
                            {rows.map((row, i) => (
                                <tr key={i} className={`border-t-2 border-black ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}>
                                    <td className="text-right p-4 text-sm font-bold">{row.feature}</td>
                                    {competitors.map(c => (
                                        <td key={c.key} className={`text-center p-4 ${c.highlight ? 'bg-yellow-50' : ''}`}>
                                            <Cell value={row[c.key]} />
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </section>
    );
}
