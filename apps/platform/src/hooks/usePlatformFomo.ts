import { useState, useEffect, useRef } from 'react'

interface FomoEvent {
    name: string
    city: string
    plan: string
    planAr: string
    timeAgo: string
}

const FOMO_EVENTS: FomoEvent[] = [
    { name: 'محمد', city: 'وهران', plan: 'Starter', planAr: 'المبتدئ', timeAgo: 'منذ 3 دقائق' },
    { name: 'أحمد', city: 'الجزائر العاصمة', plan: 'Pro', planAr: 'الاحترافي', timeAgo: 'منذ 7 دقائق' },
    { name: 'يوسف', city: 'قسنطينة', plan: 'Starter', planAr: 'المبتدئ', timeAgo: 'منذ 12 دقيقة' },
    { name: 'خالد', city: 'عنابة', plan: 'Pro', planAr: 'الاحترافي', timeAgo: 'منذ 18 دقيقة' },
    { name: 'ريم', city: 'سطيف', plan: 'Starter', planAr: 'المبتدئ', timeAgo: 'منذ 25 دقيقة' },
    { name: 'سلمى', city: 'تلمسان', plan: 'Agency', planAr: 'الوكالة', timeAgo: 'منذ دقيقة' },
    { name: 'عمر', city: 'بجاية', plan: 'Pro', planAr: 'الاحترافي', timeAgo: 'منذ 4 دقائق' },
    { name: 'أمين', city: 'باتنة', plan: 'Starter', planAr: 'المبتدئ', timeAgo: 'منذ 9 دقائق' },
    { name: 'سارة', city: 'الشلف', plan: 'Pro', planAr: 'الاحترافي', timeAgo: 'منذ 15 دقيقة' },
    { name: 'عبد الرحمن', city: 'تيزي وزو', plan: 'Agency', planAr: 'الوكالة', timeAgo: 'منذ 22 دقيقة' },
]

export function usePlatformFomo() {
    const [current, setCurrent] = useState<FomoEvent | null>(null)
    const [visible, setVisible] = useState(false)
    const indexRef = useRef(0)
    const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

    useEffect(() => {
        // Shuffle events randomly
        const shuffled = [...FOMO_EVENTS].sort(() => Math.random() - 0.5)

        function showNext() {
            const event = shuffled[indexRef.current % shuffled.length]
            indexRef.current++

            setCurrent(event)
            setVisible(true)

            // Hide after 5s
            timerRef.current = setTimeout(() => {
                setVisible(false)
                // Next notification after 8-15s gap
                const gap = 8000 + Math.random() * 7000
                timerRef.current = setTimeout(showNext, gap)
            }, 5000)
        }

        // First notification after 6-10s
        const initial = 6000 + Math.random() * 4000
        timerRef.current = setTimeout(showNext, initial)

        return () => {
            if (timerRef.current) clearTimeout(timerRef.current)
        }
    }, [])

    return { current, visible }
}
