import { createFileRoute } from '@tanstack/react-router'
import { pageHead } from '@/lib/seo'
import { useLang } from '@/hooks/useLang'
import { Navbar } from '@/components/marketing/Navbar'
import { Footer } from '@/components/marketing/Footer'

export const Route = createFileRoute('/terms')({
  head: () => pageHead({
    title: 'الشروط والأحكام | 7aba.app',
    description: 'شروط استخدام منصة 7aba.app لبناء المتاجر الجزائرية: الاشتراكات، الدفع، مسؤوليات التاجر وحقوق المنصة.',
    path: '/terms',
  }),
  component: TermsPage,
})

const CONTACT_EMAIL = 'support@7aba.app'
const LAST_UPDATED = { ar: '9 يوليو 2026', fr: '9 juillet 2026', en: 'July 9, 2026' }

type Tri = { ar: string; fr: string; en: string }
type Section = { heading: Tri; body: Tri[] }

const intro: Tri = {
  ar: 'تحكم شروط الاستخدام هذه استخدامك لمنصة 7aba على 7aba.app. باستخدامك للمنصة فإنك توافق على هذه الشروط. إذا لم توافق عليها، فالرجاء عدم استخدام الخدمة.',
  fr: "Ces conditions d'utilisation régissent votre utilisation de la plateforme 7aba sur 7aba.app. En utilisant la plateforme, vous acceptez ces conditions. Si vous ne les acceptez pas, veuillez ne pas utiliser le service.",
  en: 'These Terms of Service govern your use of the 7aba platform at 7aba.app. By using the platform, you agree to these terms. If you do not agree, please do not use the service.',
}

const sections: Section[] = [
  {
    heading: { ar: '١. الخدمة', fr: '1. Le service', en: '1. The service' },
    body: [
      {
        ar: 'توفّر 7aba أدوات لإنشاء متاجر إلكترونية ونشرها واستضافتها على شبكة Cloudflare، مع إدارة الطلبات ووسائل دفع تشمل الدفع عند الاستلام والدفع الإلكتروني عبر Chargily.',
        fr: "7aba fournit des outils pour créer, déployer et héberger des boutiques en ligne sur le réseau Cloudflare, avec gestion des commandes et moyens de paiement incluant le paiement à la livraison et le paiement électronique via Chargily.",
        en: '7aba provides tools to create, deploy and host online stores on the Cloudflare network, with order management and payment methods including cash on delivery and electronic payment via Chargily.',
      },
    ],
  },
  {
    heading: { ar: '٢. الحساب', fr: '2. Compte', en: '2. Account' },
    body: [
      {
        ar: 'أنت مسؤول عن الحفاظ على سرية وصولك إلى حسابك وعن جميع الأنشطة التي تجري من خلاله. يجب أن تكون المعلومات التي تقدّمها صحيحة ومحدّثة.',
        fr: "Vous êtes responsable de la confidentialité de l'accès à votre compte et de toutes les activités qui s'y déroulent. Les informations que vous fournissez doivent être exactes et à jour.",
        en: 'You are responsible for keeping your account access confidential and for all activity that occurs under it. The information you provide must be accurate and up to date.',
      },
    ],
  },
  {
    heading: { ar: '٣. مسؤولية التاجر', fr: '3. Responsabilité du marchand', en: '3. Merchant responsibility' },
    body: [
      {
        ar: 'أنت وحدك مسؤول عن المتاجر التي تنشئها: المنتجات المعروضة، الأسعار، الوفاء بالطلبات، والتعامل مع زبائنك وبياناتهم. يجب أن يلتزم نشاطك بالقوانين المعمول بها في الجزائر.',
        fr: "Vous êtes seul responsable des boutiques que vous créez : produits proposés, prix, exécution des commandes, et relations avec vos clients et leurs données. Votre activité doit respecter les lois applicables en Algérie.",
        en: 'You are solely responsible for the stores you create: the products offered, pricing, order fulfilment, and dealing with your customers and their data. Your activity must comply with the laws applicable in Algeria.',
      },
      {
        ar: 'يُمنع استخدام المنصة لأي غرض غير قانوني أو لبيع سلع أو خدمات محظورة.',
        fr: "L'utilisation de la plateforme à des fins illégales ou pour vendre des biens ou services interdits est proscrite.",
        en: 'Using the platform for any unlawful purpose, or to sell prohibited goods or services, is not permitted.',
      },
    ],
  },
  {
    heading: { ar: '٤. المدفوعات', fr: '4. Paiements', en: '4. Payments' },
    body: [
      {
        ar: 'تُعالَج المدفوعات الإلكترونية عبر Chargily Pay. نحن لسنا طرفاً في المعاملات بين التاجر وزبائنه ولا نتحمّل مسؤولية النزاعات الناشئة عنها.',
        fr: "Les paiements électroniques sont traités via Chargily Pay. Nous ne sommes pas partie aux transactions entre le marchand et ses clients et déclinons toute responsabilité pour les litiges qui en découlent.",
        en: 'Electronic payments are processed via Chargily Pay. We are not a party to transactions between the merchant and their customers and are not responsible for disputes arising from them.',
      },
    ],
  },
  {
    heading: { ar: '٥. مزوّدو الطرف الثالث', fr: '5. Fournisseurs tiers', en: '5. Third-party providers' },
    body: [
      {
        ar: 'تعتمد الخدمة على مزوّدين خارجيين منهم Cloudflare (الاستضافة) و InstantDB (قاعدة البيانات) و Chargily (الدفع). يخضع استخدامهم لشروطهم وسياساتهم الخاصة، ولا نضمن توافرهم المستمر.',
        fr: "Le service repose sur des fournisseurs externes dont Cloudflare (hébergement), InstantDB (base de données) et Chargily (paiement). Leur utilisation est soumise à leurs propres conditions et politiques, et nous ne garantissons pas leur disponibilité continue.",
        en: 'The service relies on external providers including Cloudflare (hosting), InstantDB (database) and Chargily (payments). Their use is subject to their own terms and policies, and we do not guarantee their continuous availability.',
      },
    ],
  },
  {
    heading: { ar: '٦. إخلاء المسؤولية وحدودها', fr: '6. Garanties et limitation de responsabilité', en: '6. Disclaimer & limitation of liability' },
    body: [
      {
        ar: 'تُقدَّم الخدمة "كما هي" دون ضمانات صريحة أو ضمنية. إلى الحد الذي يسمح به القانون، لا نتحمّل مسؤولية أي أضرار غير مباشرة أو تبعية أو خسارة أرباح أو بيانات ناتجة عن استخدامك للمنصة.',
        fr: "Le service est fourni « en l'état », sans garantie expresse ou implicite. Dans les limites permises par la loi, nous déclinons toute responsabilité pour les dommages indirects ou consécutifs, la perte de bénéfices ou de données résultant de votre utilisation de la plateforme.",
        en: 'The service is provided "as is", without express or implied warranties. To the extent permitted by law, we are not liable for any indirect or consequential damages, loss of profits or data arising from your use of the platform.',
      },
    ],
  },
  {
    heading: { ar: '٧. التعديلات', fr: '7. Modifications', en: '7. Changes' },
    body: [
      {
        ar: 'قد نحدّث هذه الشروط من وقت لآخر. يسري أي تعديل بمجرد نشره على هذه الصفحة، ويُعدّ استمرارك في استخدام الخدمة قبولاً بالشروط المحدّثة.',
        fr: "Nous pouvons mettre à jour ces conditions de temps à autre. Toute modification prend effet dès sa publication sur cette page, et la poursuite de votre utilisation vaut acceptation des conditions mises à jour.",
        en: 'We may update these terms from time to time. Any change takes effect once published on this page, and your continued use constitutes acceptance of the updated terms.',
      },
    ],
  },
  {
    heading: { ar: '٨. القانون المطبّق والتواصل', fr: '8. Loi applicable et contact', en: '8. Governing law & contact' },
    body: [
      {
        ar: `تخضع هذه الشروط للقوانين المعمول بها في الجزائر. لأي استفسار، راسلنا على ${CONTACT_EMAIL}.`,
        fr: `Ces conditions sont régies par les lois applicables en Algérie. Pour toute question, écrivez-nous à ${CONTACT_EMAIL}.`,
        en: `These terms are governed by the laws applicable in Algeria. For any inquiry, contact us at ${CONTACT_EMAIL}.`,
      },
    ],
  },
]

function TermsPage() {
  const { t, dir } = useLang()

  return (
    <div className="min-h-screen bg-white" dir={dir}>
      <Navbar />

      <section className="py-24 px-4 bg-black text-white text-center border-b-4 border-yellow-400">
        <h1 className="text-4xl md:text-5xl font-black mb-4">
          {t({ ar: 'شروط الاستخدام', fr: "Conditions d'utilisation", en: 'Terms of Service' })}
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
