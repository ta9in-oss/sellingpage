import { createFileRoute } from '@tanstack/react-router'
import { pageHead } from '@/lib/seo'
import { useLang } from '@/hooks/useLang'
import { Navbar } from '@/components/marketing/Navbar'
import { Footer } from '@/components/marketing/Footer'

export const Route = createFileRoute('/privacy')({
  head: () => pageHead({
    title: 'سياسة الخصوصية | 7aba.app',
    description: 'كيف تجمع منصة 7aba.app بياناتك وتستعملها وتحميها، وما هي حقوقك كتاجر أو زائر.',
    path: '/privacy',
  }),
  component: PrivacyPage,
})

const CONTACT_EMAIL = 'support@7aba.app'
const LAST_UPDATED = { ar: '9 يوليو 2026', fr: '9 juillet 2026', en: 'July 9, 2026' }

type Tri = { ar: string; fr: string; en: string }
type Section = { heading: Tri; body: Tri[] }

const intro: Tri = {
  ar: 'توضّح سياسة الخصوصية هذه كيف تجمع منصة 7aba ("نحن") بياناتك وتستخدمها وتحميها عند استخدامك للمنصة على 7aba.app. باستخدامك للخدمة فإنك توافق على الممارسات الموضّحة هنا.',
  fr: "Cette politique de confidentialité explique comment la plateforme 7aba (« nous ») collecte, utilise et protège vos données lorsque vous utilisez la plateforme sur 7aba.app. En utilisant le service, vous acceptez les pratiques décrites ici.",
  en: 'This Privacy Policy explains how the 7aba platform ("we") collects, uses and protects your data when you use the platform at 7aba.app. By using the service, you agree to the practices described here.',
}

const sections: Section[] = [
  {
    heading: { ar: '١. البيانات التي نجمعها', fr: '1. Données que nous collectons', en: '1. Data we collect' },
    body: [
      {
        ar: 'بيانات الحساب: بريدك الإلكتروني (لتسجيل الدخول عبر رمز التحقق أو حساب Google) واسمك إن وُجد.',
        fr: 'Données de compte : votre adresse e-mail (pour la connexion par code de vérification ou compte Google) et votre nom le cas échéant.',
        en: 'Account data: your email address (for sign-in via verification code or Google account) and your name where provided.',
      },
      {
        ar: 'بيانات المتجر: محتوى المتاجر التي تنشئها (المنتجات، الأقسام، الإعدادات) وبيانات الطلبات التي يقدّمها زبائنك.',
        fr: "Données de boutique : le contenu des boutiques que vous créez (produits, sections, réglages) et les données des commandes passées par vos clients.",
        en: 'Store data: the content of the stores you create (products, sections, settings) and the order data submitted by your customers.',
      },
      {
        ar: 'بيانات تقنية: عنوان IP، نوع المتصفح، والصفحات التي تزورها، تُجمع عبر أدوات التحليل الموضّحة أدناه.',
        fr: "Données techniques : adresse IP, type de navigateur et pages visitées, collectées via les outils d'analyse décrits ci-dessous.",
        en: 'Technical data: IP address, browser type and pages visited, collected via the analytics tools described below.',
      },
    ],
  },
  {
    heading: { ar: '٢. كيف نستخدم بياناتك', fr: '2. Utilisation de vos données', en: '2. How we use your data' },
    body: [
      {
        ar: 'نستخدم بياناتك لتشغيل حسابك، وإنشاء متاجرك ونشرها، ومعالجة الطلبات، وتحسين الخدمة، والتواصل معك بخصوص حسابك.',
        fr: "Nous utilisons vos données pour gérer votre compte, créer et déployer vos boutiques, traiter les commandes, améliorer le service et communiquer avec vous à propos de votre compte.",
        en: 'We use your data to operate your account, create and deploy your stores, process orders, improve the service, and communicate with you about your account.',
      },
      {
        ar: 'لا نبيع بياناتك الشخصية لأطراف ثالثة.',
        fr: 'Nous ne vendons pas vos données personnelles à des tiers.',
        en: 'We do not sell your personal data to third parties.',
      },
    ],
  },
  {
    heading: { ar: '٣. مزوّدو الخدمة والاستضافة', fr: '3. Prestataires et hébergement', en: '3. Service providers & hosting' },
    body: [
      {
        ar: 'تعمل هذه المنصة على شبكة Cloudflare (Workers و CDN). تمرّ بياناتك عبر بنية Cloudflare التحتية عند الوصول للخدمة، وتخضع معالجة Cloudflare لبيانات الشبكة والحافة لسياسة خصوصية Cloudflare: https://www.cloudflare.com/privacypolicy/',
        fr: "Cette plateforme fonctionne sur le réseau Cloudflare (Workers et CDN). Vos données transitent par l'infrastructure Cloudflare lors de l'accès au service ; le traitement des données réseau et edge par Cloudflare est régi par la politique de confidentialité de Cloudflare : https://www.cloudflare.com/privacypolicy/",
        en: 'This platform runs on the Cloudflare network (Workers and CDN). Your data passes through Cloudflare infrastructure when accessing the service, and Cloudflare\'s processing of network and edge data is governed by Cloudflare\'s privacy policy: https://www.cloudflare.com/privacypolicy/',
      },
      {
        ar: 'نخزّن بيانات الحسابات والمتاجر والطلبات في InstantDB. تخضع هذه البيانات المخزّنة لسياسة خصوصية InstantDB: https://www.instantdb.com/privacy',
        fr: "Nous stockons les données des comptes, des boutiques et des commandes dans InstantDB. Ces données stockées sont régies par la politique de confidentialité d'InstantDB : https://www.instantdb.com/privacy",
        en: 'We store account, store and order data in InstantDB. This stored data is governed by InstantDB\'s privacy policy: https://www.instantdb.com/privacy',
      },
      {
        ar: 'إذا اخترت الدفع الإلكتروني، تُعالَج المدفوعات عبر Chargily Pay وفق سياستهم الخاصة.',
        fr: "Si vous choisissez le paiement électronique, les paiements sont traités par Chargily Pay selon leur propre politique.",
        en: 'If you choose electronic payment, payments are processed via Chargily Pay under their own policy.',
      },
    ],
  },
  {
    heading: { ar: '٤. ملفات تعريف الارتباط والتحليلات', fr: '4. Cookies et analyses', en: '4. Cookies & analytics' },
    body: [
      {
        ar: 'نستخدم Google Analytics و Microsoft Clarity لفهم كيفية استخدام المنصة. تضع هذه الأدوات ملفات تعريف ارتباط. راجع قسم ملفات تعريف الارتباط في الشريط السفلي لمزيد من التفاصيل.',
        fr: "Nous utilisons Google Analytics et Microsoft Clarity pour comprendre l'usage de la plateforme. Ces outils déposent des cookies. Consultez la bannière de cookies pour plus de détails.",
        en: 'We use Google Analytics and Microsoft Clarity to understand how the platform is used. These tools set cookies. See the cookie notice for more details.',
      },
    ],
  },
  {
    heading: { ar: '٥. حقوقك', fr: '5. Vos droits', en: '5. Your rights' },
    body: [
      {
        ar: `يمكنك طلب الوصول إلى بياناتك الشخصية أو تصحيحها أو حذفها بمراسلتنا على ${CONTACT_EMAIL}. سنستجيب خلال مدة معقولة.`,
        fr: `Vous pouvez demander l'accès, la rectification ou la suppression de vos données personnelles en nous écrivant à ${CONTACT_EMAIL}. Nous répondrons dans un délai raisonnable.`,
        en: `You can request access to, correction of, or deletion of your personal data by contacting us at ${CONTACT_EMAIL}. We will respond within a reasonable time.`,
      },
    ],
  },
  {
    heading: { ar: '٦. التواصل', fr: '6. Contact', en: '6. Contact' },
    body: [
      {
        ar: `لأي سؤال حول هذه السياسة أو بياناتك، راسلنا على ${CONTACT_EMAIL}.`,
        fr: `Pour toute question concernant cette politique ou vos données, écrivez-nous à ${CONTACT_EMAIL}.`,
        en: `For any question about this policy or your data, contact us at ${CONTACT_EMAIL}.`,
      },
    ],
  },
]

function PrivacyPage() {
  const { t, dir } = useLang()

  return (
    <div className="min-h-screen bg-white" dir={dir}>
      <Navbar />

      <section className="py-24 px-4 bg-black text-white text-center border-b-4 border-yellow-400">
        <h1 className="text-4xl md:text-5xl font-black mb-4">
          {t({ ar: 'سياسة الخصوصية', fr: 'Politique de confidentialité', en: 'Privacy Policy' })}
        </h1>
        <p className="text-white/60 text-sm">
          {t({ ar: 'آخر تحديث', fr: 'Dernière mise à jour', en: 'Last updated' })}: {t(LAST_UPDATED)}
        </p>
      </section>

      <section className="py-16 px-4">
        <div className="max-w-2xl mx-auto space-y-10">
          <p className="text-black/70 leading-relaxed text-start">{t(intro)}</p>

          {sections.map((s, i) => (
            <div key={i} className="space-y-3 text-start">
              <h2 className="text-2xl font-black text-black">{t(s.heading)}</h2>
              {s.body.map((p, j) => (
                <p key={j} className="text-black/70 text-sm leading-relaxed break-words">
                  {t(p)}
                </p>
              ))}
            </div>
          ))}
        </div>
      </section>

      <Footer />
    </div>
  )
}
