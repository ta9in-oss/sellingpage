import { useLang } from '@/hooks/useLang'

const T = {
  title: {
    ar: 'تنبيه: لا تشترِ هذه النسخة',
    fr: 'Avis : n’achetez pas cette version',
    en: 'Notice: please don’t buy this version',
  },
  message: {
    ar: 'هذه النسخة من حبة ستور ستصبح مفتوحة المصدر قريباً، لأن InstantDB — التقنية التي بُنيت عليها — توقفت. نعمل على نسخة جديدة وأفضل من المنتج، وستكون متاحة قريباً.',
    fr: 'Cette version de 7aba Store sera bientôt open source, car InstantDB — la technologie sur laquelle elle repose — a été arrêtée. Nous préparons une nouvelle version, meilleure, du produit. Elle sera disponible bientôt.',
    en: 'This version of 7aba Store is going open source soon, because InstantDB — the technology it’s built on — has been discontinued. We’re working on a newer, better version of the product. It will be available soon.',
  },
}

/** Site-wide sunset notice. Static (in DOM flow) like InAppBrowserBanner so it
 *  pushes the sticky navbar down; intentionally not dismissible. */
export function SunsetBanner() {
  const { t, dir } = useLang()

  return (
    <div role="alert" className="relative z-[60] bg-yellow-400 text-black border-b-2 border-black px-4 py-3" dir={dir}>
      <div className="max-w-3xl mx-auto text-sm text-center">
        <p className="font-black">{t(T.title)}</p>
        <p className="mt-1">{t(T.message)}</p>
      </div>
    </div>
  )
}
