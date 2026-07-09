// ─────────────────────────────────────────────────────────────────────────────
// Centralised marketing translations
// All strings are grouped by component section and keyed by locale code.
// Components import their section and pass it to the useLang `t()` helper.
// ─────────────────────────────────────────────────────────────────────────────

export type LangKey = 'ar' | 'fr' | 'en'
export type T3 = { ar: string; fr: string; en: string }

// ── Navbar ────────────────────────────────────────────────────────────────────
export const navbar = {
  pricing:    { ar: 'الأسعار',      fr: 'Tarifs',                  en: 'Pricing' },
  howItWorks: { ar: 'كيف يعمل؟',   fr: 'Comment ça marche?',      en: 'How it works' },
  demo:       { ar: 'عرض تجريبي',  fr: 'Démo',                    en: 'Demo' },
  start:      { ar: 'ابدأ الآن',   fr: 'Commencer',               en: 'Get started' },
  langLabel:  { ar: 'اللغة',       fr: 'Langue',                  en: 'Language' },
}

// ── Hero Section ──────────────────────────────────────────────────────────────
export const hero = {
  headline: {
    ar: 'أطلق متجرك الإلكتروني في دقيقتين',
    fr: 'Lancez votre boutique en 2 minutes',
    en: 'Launch your online store in 2 minutes',
  },
  sub: {
    ar: 'منصة بناء المتاجر للتجار الجزائريين. ادفع مرة واحدة، اكتسب كل شيء.',
    fr: 'La plateforme e-commerce pour les marchands algériens. Payez une fois, possédez tout.',
    en: 'The e-commerce platform for Algerian merchants. Pay once, own everything.',
  },
  cta1: { ar: 'ابدأ الآن',      fr: 'Commencer maintenant', en: 'Get started' },
  cta2: { ar: 'شوف مثال حي',   fr: 'Voir un exemple',      en: 'Live demo' },
}

// ── Feature Grid ──────────────────────────────────────────────────────────────
export const featureGrid = {
  title: {
    ar: 'كل ما تحتاجه لمتجرك',
    fr: 'Tout ce dont vous avez besoin',
    en: 'Everything you need for your store',
  },
  features: [
    {
      icon: 'Zap',
      label: { ar: 'نشر في دقيقتين',         fr: 'Déployé en 2 min',                en: 'Deploy in 2 minutes' },
      desc:  { ar: 'Cloudflare Workers. أسرع CDN في العالم', fr: 'Cloudflare Workers. CDN le plus rapide', en: 'Cloudflare Workers. Fastest CDN worldwide' },
    },
    {
      icon: 'Shield',
      label: { ar: 'ملكية كاملة',             fr: 'Propriété totale',                en: 'Full ownership' },
      desc:  { ar: 'الكود والبيانات ملكك، لا أحد يستطيع إغلاق متجرك', fr: 'Code et données vous appartiennent', en: 'Code and data are yours. Nobody can shut your store down' },
    },
    {
      icon: 'Palette',
      label: { ar: '3 قوالب احترافية',        fr: '3 thèmes pro',                    en: '3 pro themes' },
      desc:  { ar: 'بسيط، جريء، دافئ. كل واحد محسّن للبيع', fr: 'Simple, audacieux, chaleureux. Optimisés pour vendre', en: 'Simple, bold, warm. Each optimised to sell' },
    },
    {
      icon: 'Languages',
      label: { ar: 'عربي + فرنسي',            fr: 'Arabe + Français',                en: 'Arabic + French' },
      desc:  { ar: 'واجهة RTL أصلية ودعم ثنائي اللغة', fr: 'Interface RTL native et bilinguisme', en: 'Native RTL interface and bilingual support' },
    },
    {
      icon: 'Bell',
      label: { ar: 'إشعارات الطلبات',          fr: 'Notifications commandes',         en: 'Order notifications' },
      desc:  { ar: 'إشعارات فورية لكل طلب جديد', fr: 'Notifications en temps réel', en: 'Real-time notifications for every new order' },
    },
    {
      icon: 'MapPin',
      label: { ar: 'توصيل للجزائر',            fr: 'Livraison Algérie',               en: 'Algeria delivery' },
      desc:  { ar: '58 ولاية ودوائرها كاملة في نموذج الطلب', fr: '58 wilayas dans le formulaire de commande', en: 'All 58 wilayas in the order form' },
    },
    {
      icon: 'BarChart2',
      label: { ar: 'تحليلات مدمجة',            fr: 'Analytics intégrés',              en: 'Built-in analytics' },
      desc:  { ar: 'Google Analytics + Meta Pixel + Clarity', fr: 'Google Analytics + Meta Pixel + Clarity', en: 'Google Analytics + Meta Pixel + Clarity' },
    },
    {
      icon: 'CreditCard',
      label: { ar: 'لا عمولات أبداً',          fr: 'Zéro commission',                 en: 'Zero commission' },
      desc:  { ar: 'كل ريال من مبيعاتك يذهب إليك مباشرة', fr: 'Chaque dinar de vos ventes vous revient', en: 'Every dinar from your sales goes directly to you' },
    },
  ],
}

// ── How It Works ──────────────────────────────────────────────────────────────
export const howItWorks = {
  title: { ar: 'كيف يعمل؟', fr: 'Comment ça marche?', en: 'How it works?' },
  steps: [
    {
      icon: 'Palette',
      label: { ar: 'اختر قالبك',               fr: 'Choisissez votre thème',          en: 'Pick your template' },
      desc:  { ar: '3 قوالب بسيط، جريء، دافئ', fr: '3 thèmes optimisés pour vendre', en: '3 themes: simple, bold, warm' },
    },
    {
      icon: 'SlidersHorizontal',
      label: { ar: 'خصص محتواك',               fr: 'Personnalisez le contenu',        en: 'Customize your content' },
      desc:  { ar: 'صور، نصوص، أسعار. كل شيء بصري', fr: 'Images, textes, prix. Tout visuel', en: 'Images, text, prices. All visual' },
    },
    {
      icon: 'Bell',
      label: { ar: 'FOMO للزبائن تلقائي',    fr: 'FOMO automatique pour vos clients', en: 'FOMO for customers. Automatic' },
      desc:  {
        ar: 'زوار متجرك يشوفوا: "شخص من وهران طلب للتو". يخلق إلحاح ويرفع المبيعات',
        fr: "Les visiteurs voient : \"Quelqu'un d'Oran vient de commander\". Urgence automatique",
        en: 'Visitors see: "Someone from Oran just ordered". Creates urgency, boosts sales',
      },
    },
    {
      icon: 'Rocket',
      label: { ar: 'أطلق متجرك + داشبورد',    fr: 'Lancez + Dashboard complet',      en: 'Launch + Dashboard' },
      desc:  { ar: 'نشر تلقائي على Cloudflare مع داشبورد لإدارة الطلبات', fr: 'Déploiement Cloudflare + dashboard pour gérer vos commandes', en: 'Auto-deploy on Cloudflare with orders dashboard' },
    },
  ],
}

// ── Comparison Table ──────────────────────────────────────────────────────────
export const comparisonTable = {
  title:       { ar: 'لماذا 7aba أفضل؟',    fr: 'Pourquoi 7aba est meilleur?', en: 'Why is 7aba better?' },
  feature:     { ar: 'الميزة',               fr: 'Caractéristique',              en: 'Feature' },
  oncePayment: { ar: 'دفع مرة واحدة',        fr: 'Paiement unique',              en: 'One-time payment' },
  features: [
    {
      label:   { ar: 'رسوم شهرية',                  fr: 'Frais mensuels',                  en: 'Monthly fees' },
      haba:    { text: { ar: '✓ لا يوجد',           fr: '✓ Aucun',                         en: '✓ None' },                  good: true },
      ayor:    { text: { ar: '3,900–7,900 DZD/شهر', fr: '3 900–7 900 DZD/mois',            en: '3,900–7,900 DZD/mo' },      good: false },
      shopify: { text: { ar: '$29–$299/شهر',         fr: '$29–$299/mois',                   en: '$29–$299/mo' },              good: false },
    },
    {
      label:   { ar: 'تملك الكود المصدري',          fr: 'Propriété du code source',        en: 'Own source code' },
      haba:    { text: { ar: '✓ نعم (Pro)',          fr: '✓ Oui (Pro)',                     en: '✓ Yes (Pro)' },             good: true },
      ayor:    { text: { ar: '✗ لا',                 fr: '✗ Non',                           en: '✗ No' },                    good: false },
      shopify: { text: { ar: '✗ لا',                 fr: '✗ Non',                           en: '✗ No' },                    good: false },
    },
    {
      label:   { ar: 'إنفراستراكتشر خاص',           fr: 'Infrastructure privée',           en: 'Private infrastructure' },
      haba:    { text: { ar: '✓ Cloudflare',         fr: '✓ Cloudflare',                   en: '✓ Cloudflare' },            good: true },
      ayor:    { text: { ar: '✗ مشترك',              fr: '✗ Partagée',                      en: '✗ Shared' },                good: false },
      shopify: { text: { ar: '✗ مشترك',              fr: '✗ Partagée',                      en: '✗ Shared' },                good: false },
    },
    {
      label:   { ar: 'بدون عمولة على المبيعات',     fr: 'Sans commission sur ventes',      en: 'No sales commission' },
      haba:    { text: { ar: '✓ دائماً',             fr: '✓ Toujours',                      en: '✓ Always' },               good: true },
      ayor:    { text: { ar: '✓',                    fr: '✓',                               en: '✓' },                       good: true },
      shopify: { text: { ar: '✗ 2%',                 fr: '✗ 2%',                            en: '✗ 2%' },                    good: false },
    },
    {
      label:   { ar: 'السعر',                        fr: 'Prix',                            en: 'Price' },
      haba:    { text: { ar: '3,500 DZD مرة واحدة', fr: '3 500 DZD une fois',              en: '3,500 DZD one-time' },      good: true, highlight: true },
      ayor:    { text: { ar: '3,900+ DZD/شهر',       fr: '3 900+ DZD/mois',                en: '3,900+ DZD/mo' },           good: false },
      shopify: { text: { ar: '$29+/شهر',              fr: '$29+/mois',                      en: '$29+/mo' },                  good: false },
    },
  ],
}

// ── Notification Showcase ─────────────────────────────────────────────────────
export const notificationShowcase = {
  badge:   {
    ar: '🔥 ميزة حصرية. لا أحد في الجزائر يملكها',
    fr: "🔥 Exclusif. Personne en Algérie ne l'a",
    en: '🔥 Exclusive. Nobody in Algeria has it',
  },
  headline: {
    ar: 'زبائنك يشوفوا من اشترى قبلهم، تلقائياً',
    fr: 'Vos clients voient qui a acheté avant eux, automatiquement',
    en: 'Your customers see who bought before them, automatically',
  },
  sub: {
    ar: 'كل مرة يزور حد متجرك، يشوف إشعارات صغيرة في الزاوية: "شخص من وهران طلب للتو" أو "5 أشخاص من ولايتك طلبوا هذا الأسبوع". هذا يخلق إلحاح حقيقي ويرفع معدل التحويل. مثل WiserNotify، لكن مدمج في متجرك مباشرة.',
    fr: "À chaque visite, vos clients voient des notifications discrètes : \"Quelqu'un d'Oran vient de commander\" ou \"5 personnes de votre wilaya ont commandé cette semaine\". Crée une vraie urgence. Comme WiserNotify, mais intégré gratuitement.",
    en: 'Every visit, customers see small corner notifications: "Someone from Oran just ordered" or "5 people from your wilaya ordered this week". Creates real urgency. Like WiserNotify, but built right into your store.',
  },
  features: [
    { ar: 'إشعار "شخص من ولايتك طلب للتو"',    fr: '"Quelqu\'un de ta wilaya vient de commander"', en: '"Someone from your wilaya just ordered"' },
    { ar: 'يتكيف مع مدينة الزائر',               fr: "S'adapte à la ville du visiteur",             en: "Adapts to the visitor's city" },
    { ar: 'يرفع معدل التحويل بشكل ملحوظ',        fr: 'Booste le taux de conversion significativement', en: 'Significantly boosts conversion rate' },
    { ar: 'مدمج 100%. لا تطبيق خارجي',         fr: "100% intégré. Aucune app externe",           en: '100% built-in. No external app' },
  ],
  visitorSees: {
    ar: 'ما يراه الزائر في متجرك ↓',
    fr: 'Ce que voit le visiteur dans votre boutique ↓',
    en: 'What the visitor sees in your store ↓',
  },
  mockNotifications: [
    {
      type: 'live' as const,
      text: { ar: 'طلب جديد!',     fr: 'Nouvelle commande!', en: 'New order!' },
      desc: { ar: 'أحد سكان وهران قام بطلب 1 × صاكادو', fr: "Quelqu'un d'Oran vient de commander 1 × Sac", en: 'Someone from Oran just ordered 1 × Bag' },
      sub:  { ar: 'منذ لحظات',     fr: 'il y a quelques instants', en: 'moments ago' },
      bg: 'bg-green-500',
    },
    {
      type: 'wilaya' as const,
      text: { ar: 'طلب من ولايتك!', fr: 'Commande de ta wilaya!', en: 'Order from your wilaya!' },
      desc: { ar: 'أحد سكان ولايتك قام بطلب 2 × صاكادو', fr: "Quelqu'un de ta wilaya a commandé 2 × Sac", en: 'Someone from your wilaya ordered 2 × Bag' },
      sub:  { ar: 'أهل ولايتك يثقون بالمنتج! 💫', fr: 'Ta wilaya fait confiance au produit ! 💫', en: 'Your wilaya trusts this product! 💫' },
      bg: 'bg-cyan-500',
    },
    {
      type: 'recent' as const,
      text: { ar: 'طلب حديث!',     fr: 'Commande récente!', en: 'Recent order!' },
      desc: { ar: 'أحد سكان قسنطينة قام بطلب 1 × صاكادو', fr: "Quelqu'un de Constantine a commandé 1 × Sac", en: 'Someone from Constantine ordered 1 × Bag' },
      sub:  { ar: 'منذ 5 دقائق',   fr: 'il y a 5 minutes', en: '5 minutes ago' },
      bg: 'bg-blue-500',
    },
  ],
}

// ── Pricing Preview (homepage teaser) ─────────────────────────────────────────
export const pricingPreview = {
  title: { ar: 'الأسعار',              fr: 'Tarifs',      en: 'Pricing' },
  sub: {
    ar: 'دفع مرة واحدة. لا اشتراكات. لا مفاجآت.',
    fr: "Payez une fois. Pas d'abonnements. Pas de surprises.",
    en: 'Pay once. No subscriptions. No surprises.',
  },
  cta:  { ar: 'اختر هذه الباقة',       fr: 'Choisir ce forfait',  en: 'Choose this plan' },
  once: { ar: 'دفع مرة واحدة',         fr: 'Paiement unique',     en: 'One-time payment' },
  tiers: [
    { id: 'simple', name: { ar: 'بسيط',     fr: 'Simple',     en: 'Simple'   }, dzd: '3,500',   usd: '$25',   badge: { ar: 'الأكثر شيوعاً', fr: 'Le plus populaire', en: 'Most popular' }, accent: true },
    { id: 'pro',    name: { ar: 'احترافي',  fr: 'Pro',        en: 'Pro'      }, dzd: '20,000',  usd: '$125',  badge: null, accent: false },
    { id: 'studio', name: { ar: 'ستوديو',   fr: 'Studio',     en: 'Studio'   }, dzd: '100,000', usd: '$650',  badge: null, accent: false },
    { id: 'partner',name: { ar: 'راعي',     fr: 'Partenaire', en: 'Partner'  }, dzd: '99,000+', usd: '$500+', badge: null, accent: false },
  ],
}

// ── Social Numbers ────────────────────────────────────────────────────────────
export const socialNumbers = {
  stats: [
    { value: 500, suffix: '+',  label: { ar: 'متجر منشور',         fr: 'Boutiques lancées',      en: '500+ stores launched' } },
    { value: 99,  suffix: '%',  label: { ar: 'رضا العملاء',         fr: 'Satisfaction client',    en: '99% satisfaction' } },
    { value: 2,   suffix: 'د',  label: { ar: 'متوسط وقت النشر',    fr: 'Temps de déploiement',   en: 'avg deploy time' } },
  ],
}

// ── Footer ────────────────────────────────────────────────────────────────────
export const footer = {
  tagline:   { ar: 'منصة التجارة الإلكترونية الجزائرية', fr: 'La plateforme e-commerce algérienne', en: 'Algerian e-commerce platform' },
  copyright: { ar: '© 2026 7aba.store. جميع الحقوق محفوظة.', fr: '© 2026 7aba.store. Tous droits réservés.', en: '© 2026 7aba.store. All rights reserved.' },
  support:   { ar: 'الدعم عبر WhatsApp',   fr: 'Support WhatsApp',  en: 'WhatsApp support' },
  pricing:   { ar: 'الأسعار',              fr: 'Tarifs',            en: 'Pricing' },
  howItWorks:{ ar: 'كيف يعمل؟',           fr: 'Comment ça marche?',en: 'How it works' },
  demo:      { ar: 'عرض تجريبي',           fr: 'Démo',              en: 'Demo' },
  terms:     { ar: 'شروط الاستخدام',       fr: "Conditions d'utilisation", en: 'Terms of Service' },
  privacy:   { ar: 'سياسة الخصوصية',       fr: 'Politique de confidentialité', en: 'Privacy Policy' },
}

// ─────────────────────────────────────────────────────────────────────────────
// Landing page bilingual copy (ar + en; fr added by a later task)
// ─────────────────────────────────────────────────────────────────────────────

// ── Landing: Nav ──────────────────────────────────────────────────────────────
export const landingNav = {
  brand:   { ar: 'حبة',           en: '7aba' },
  how:     { ar: 'كيف تعمل',      en: 'How it works' },
  pricing: { ar: 'الأسعار',       en: 'Pricing' },
  proof:   { ar: 'المتجر الحي',   en: 'Live store' },
  roadmap: { ar: 'خارطة الطريق',  en: 'Roadmap' },
  cta:     { ar: 'أنشئ حسابك',    en: 'Create account' },
}

// ── Landing: Hero ─────────────────────────────────────────────────────────────
export const landingHero = {
  eyebrow:      { ar: 'مشروع من فريق تقن',            en: 'A project by the ta9in team' },
  headline: {
    l1: { ar: 'ادفع مرة واحدة،',    en: 'Pay once.' },
    l2: { ar: 'أنشئ ما لا نهاية.', en: 'Create endlessly.' },
  },
  sub:          { ar: 'منصة جزائرية لبناء متاجر الصفحة الواحدة ونشرها على Cloudflare و InstantDB الخاصة بك. بدفعة واحدة تمتلك المنتوج، وتستثمر في الفريق الذي يطوّره يوماً بعد يوم.', en: 'An Algerian platform to build one-page stores and publish them to your own Cloudflare + InstantDB. One payment: you own the product, and you invest in the team building it, day after day.' },
  ctaPrimary:   { ar: 'أنشئ حسابك',          en: 'Create your account' },
  ctaSecondary: { ar: 'شاهد المتجر الحي',    en: 'See the live store' },
  price:        { ar: '2500 دج',              en: '2500 DA' },
  delivery:     { ar: 'التوصيل باطل',         en: 'Free delivery' },
  notif:        { ar: 'شخص من تيبازة قام بطلب', en: 'Someone in Tipaza just ordered' },
  notifAgo:     { ar: 'قبل دقيقة',            en: '1 min ago' },
  frameTitle:   { ar: 'متجرك ← cloudflare.dev', en: 'your-store ← cloudflare.dev' },
}

// ── Landing: Manifesto ────────────────────────────────────────────────────────
export const landingManifesto = {
  kicker: { ar: 'الفكرة',          en: 'The idea' },
  title: {
    l1: { ar: 'هذا استثمار،',                         en: 'This is an investment,' },
    l2: { ar: 'وليس منتوجاً رقمياً جامداً.',           en: 'not a frozen digital product.' },
  },
  body: { ar: 'حين تشتري 7aba، لا تشتري ملفات تُسلَّم وتُنسى. تشتري المنتوج، وتستثمر في الفريق الذي يبنيه. الهدف كبير، والطموح لا ينتهي.', en: "When you buy 7aba, you're not buying files that get delivered and forgotten. You buy the product, and you invest in the team building it. The goal is big, the ambition endless." },
  pillars: [
    {
      n: '01',
      t: { ar: 'تحديث مستمر',       en: 'Continuous updates' },
      d: { ar: 'كل تحسين جديد يصلك. المنصة تكبر، وأنت معها، بدون أن تدفع من جديد.', en: 'Every improvement reaches you. The platform grows, and you grow with it, no second payment.' },
    },
    {
      n: '02',
      t: { ar: 'الفريق وراءه',       en: 'The team behind it' },
      d: { ar: 'مبنية ومُشغّلة من فريق تقن. أشخاص حقيقيون يطوّرون ويردّون، لا روبوت دعم.', en: 'Built and run by ta9in. Real people who ship and reply, not a support bot.' },
    },
    {
      n: '03',
      t: { ar: 'الطموح لا ينتهي',    en: 'Endless ambition' },
      d: { ar: 'خارطة طريق مفتوحة. تستثمر في الاتجاه، لا في لقطة ثابتة.', en: 'An open roadmap. You invest in a direction, not a snapshot.' },
    },
  ],
}

// ── Landing: Proof ────────────────────────────────────────────────────────────
export const landingProof = {
  kicker: { ar: 'ليست واجهة وهمية',  en: 'Not a mockup' },
  title: {
    l1: { ar: 'المتجر الذي تراه…',   en: "The store you're seeing," },
    l2: { ar: 'نشغّله نحن.',          en: 'we run it ourselves.' },
  },
  body:    { ar: 'لا أرقام مُختلقة، ولا شهادات مدفوعة. نفس المنصة التي نبيعها لك، نبيع بها نحن. هذا المتجر، وهذه اللوحة، مبنيان بـ 7aba، كما سيكون متجرك.', en: 'No invented numbers, no paid testimonials. The very platform we sell you is the one we sell with. This store and this dashboard are built on 7aba, exactly like yours will be.' },
  cap1:    { ar: 'متجر الصفحة الواحدة',  en: 'The one-page store' },
  cap1sub: { ar: 'ما يراه زبونك',         en: 'What your customer sees' },
  cap2:    { ar: 'لوحة تحكم البائع',      en: 'The seller dashboard' },
  cap2sub: { ar: 'ما تديره أنت',          en: 'What you run' },
}

// ── Landing: Features ─────────────────────────────────────────────────────────
export const landingFeatures = {
  kicker: { ar: 'ما الذي تبنيه',  en: 'What you build' },
  title: {
    l1: { ar: 'متجر صفحة واحدة،',          en: 'A one-page store,' },
    l2: { ar: 'مضبوط للتحويل.',             en: 'tuned to convert.' },
  },
  items: [
    { t: { ar: 'متجر بصفحة واحدة',              en: 'One-page store' },              d: { ar: 'كل شيء في صفحة واحدة: من العرض إلى الطلب، بلا تشتيت.', en: 'Everything on a single page: from pitch to order, no distraction.' } },
    { t: { ar: 'منتوج واحد',                     en: 'Single product' },              d: { ar: 'ركّز كل الانتباه على منتوج واحد يبيع. وضوح يرفع التحويل.', en: 'Focus all attention on one product that sells. Clarity converts.' } },
    { t: { ar: 'عناصر مختلفة',                   en: 'Varied sections' },             d: { ar: 'محرر بصري بأقسام جاهزة تركّبها وتعيد ترتيبها كما تشاء.', en: 'A visual editor of ready blocks you assemble and reorder freely.' } },
    { t: { ar: 'إشعارات الشراء FOMO',            en: 'FOMO purchase alerts' },        d: { ar: 'أشعِر الزائر أن الكمية تنفد… فيطلب الآن لا غداً.', en: 'Make visitors feel stock is running out, so they order now, not later.' } },
    { t: { ar: 'لوحة تحكم بسيطة وفعّالة',       en: 'Simple, effective dashboard' }, d: { ar: 'طلبات، حالات، شحن، طباعة الملصقات، كلها بالعربية.', en: 'Orders, statuses, shipping, label printing, all in Arabic.' } },
    { t: { ar: 'إحصائيات',                       en: 'Analytics' },                   d: { ar: 'Google Analytics و Clarity مدمجان من اليوم الأول.', en: 'Google Analytics and Clarity built in from day one.' } },
  ],
}

// ── Landing: How ──────────────────────────────────────────────────────────────
export const landingHow = {
  kicker: { ar: 'كيف تعمل',  en: 'How it works' },
  title: {
    l1: { ar: 'من التسجيل،',    en: 'From sign-up,' },
    l2: { ar: 'إلى متجر حيّ.', en: 'to a live store.' },
  },
  steps: [
    { t: { ar: 'سجّل الدخول',       en: 'Sign in' },              d: { ar: 'أنشئ حسابك على 7aba في دقيقة.', en: 'Create your 7aba account in a minute.' } },
    { t: { ar: 'اختر باقتك',        en: 'Pick your tier' },        d: { ar: 'ادفع مرة واحدة، وافتح الأدوات.', en: 'Pay once, and unlock the tools.' } },
    { t: { ar: 'ابنِ في المحرر',    en: 'Build in the editor' },   d: { ar: 'خصّص الألوان، الأقسام، والمحتوى بصرياً.', en: 'Customize colors, sections and content, visually.' } },
    { t: { ar: 'انشر على ملكك',     en: "Publish to what's yours" }, d: { ar: 'متجرك يعيش على Cloudflare و InstantDB الخاصة بك.', en: 'Your store lives on your own Cloudflare + InstantDB.' } },
  ],
}

// ── Landing: Pricing ──────────────────────────────────────────────────────────
export const landingPricing = {
  kicker:   { ar: 'الأسعار',          en: 'Pricing' },
  title: {
    l1: { ar: 'ادفع مرة واحدة.',  en: 'Pay once.' },
    l2: { ar: 'لا اشتراكات.',     en: 'No subscriptions.' },
  },
  sub:      { ar: 'كل باقة تفتح طبقة أعمق من الملكية.',  en: 'Each tier unlocks a deeper layer of ownership.' },
  currency: { ar: 'دج',   en: 'DA' },
  once:     { ar: 'دفعة واحدة',  en: 'one-time' },
  tiers: [
    {
      name:      { ar: 'المبتدئ',   en: 'Starter' },
      who:       { ar: 'البائع: تبيع بنفسك',  en: 'The seller: sell for yourself' },
      price:     '3,000',
      highlight: false,
      features: [
        { ar: 'متاجر غير محدودة',                                                     en: 'Unlimited stores' },
        { ar: 'محرر بصري كامل (12 نوع قسم)',                                          en: 'Full visual editor (12 section types)' },
        { ar: '3 ثيمات + تخصيص كامل',                                                 en: '3 themes + full customization' },
        { ar: 'دفع عند الاستلام، مجاني دائماً',                                       en: 'Cash on delivery, free forever' },
        { ar: 'Chargily Pay (CIB، Dahabia)',                                           en: 'Chargily Pay (CIB, Dahabia)' },
        { ar: 'اربط نطاقك الخاص عبر Cloudflare (مع دليل إرشادي)',                    en: 'Connect your own domain via Cloudflare (guide included)' },
        { ar: 'لوحة إدارة الطلبات',                                                   en: 'Order management dashboard' },
        { ar: 'Google Analytics + Clarity',                                            en: 'Google Analytics + Clarity' },
      ],
      cta: { ar: 'ابدأ بالمبتدئ',   en: 'Start with Starter' },
    },
    {
      name:      { ar: 'المستقل',   en: 'Freelancer' },
      who:       { ar: 'المستقل: تبني لعملائك',  en: 'The freelancer: build for clients' },
      price:     '20,000',
      badge:     { ar: 'الأكثر اختياراً',  en: 'Most chosen' },
      highlight: true,
      features: [
        { ar: 'كل ما في المبتدئ',                 en: 'Everything in Starter' },
        { ar: 'تحميل كود مصدر المتجر فوراً',      en: 'Download store source code instantly' },
        { ar: 'دعم ذو أولوية',                    en: 'Priority support' },
      ],
      cta: { ar: 'اختر المستقل',   en: 'Choose Freelancer' },
    },
    {
      name:      { ar: 'الوكالة',   en: 'Run One' },
      who:       { ar: 'الوكالة: تملك منصة مثل هذه',  en: 'The agency: own a platform like this' },
      price:     '500,000',
      highlight: false,
      features: [
        { ar: 'كل ما في المستقل',                            en: 'Everything in Freelancer' },
        { ar: 'نُجهّز لك منصة كاملة مثل حبة',               en: 'We set up a full platform like 7aba for you' },
        { ar: 'تصلك التحديثات عند صدورها أولاً بأول',       en: 'You get updates first, as we ship them' },
        { ar: 'متاجر غير محدودة + دعم مباشر',               en: 'Unlimited client stores + direct support' },
      ],
      cta: { ar: 'امتلك المنصة',   en: 'Own the platform' },
    },
  ],
  ownTitle: { ar: 'تريد امتلاك المشروع بالكامل؟',                        en: 'Want to own the whole project?' },
  ownBody:  { ar: 'شراكة كاملة مع ta9in على 7aba: المشروع، لا نسخة منه.', en: 'A full partnership with ta9in on 7aba, the project, not a copy of it.' },
  ownCta:   { ar: 'تواصل معنا',                                           en: 'Talk to us' },
  note:     { ar: 'النشر يتطلّب حساب Cloudflare و InstantDB مجانيين، نرشدك خطوة بخطوة.', en: 'Publishing needs free Cloudflare + InstantDB accounts, we guide you step by step.' },
}

// ── Landing: Roadmap ──────────────────────────────────────────────────────────
export const landingRoadmap = {
  kicker: { ar: 'تحديث مستمر',  en: 'Always shipping' },
  title: {
    l1: { ar: 'خارطة طريق',  en: 'An open' },
    l2: { ar: 'مفتوحة.',     en: 'roadmap.' },
  },
  sub:  { ar: 'تستثمر في الاتجاه، لا في لقطة ثابتة.',  en: 'You invest in a direction, not a snapshot.' },
  cols: [
    {
      tag: { ar: 'متاح الآن',  en: 'Live now' },
      items: [
        { ar: 'محرر المتاجر البصري',              en: 'Visual store editor' },
        { ar: 'النشر على Cloudflare',             en: 'Cloudflare publishing' },
        { ar: 'لوحة البائع + COD + Chargily',    en: 'Seller dashboard + COD + Chargily' },
      ],
    },
    {
      tag: { ar: 'قريباً',  en: 'Next' },
      items: [
        { ar: 'متوافق مع GDPR وقانون 18-07',     en: 'GDPR & Algerian Law 18-07 compliant' },
        { ar: 'ثيمات إضافية',                    en: 'More themes' },
        { ar: 'بوابات دفع أكثر',                 en: 'More payment gateways' },
        { ar: 'تحسينات المحرر',                  en: 'Editor improvements' },
      ],
    },
    {
      tag: { ar: 'قادم',  en: 'Planned' },
      items: [
        { ar: 'متاجر متعددة المنتجات',  en: 'Multi-product stores' },
        { ar: 'تحليلات أعمق',           en: 'Deeper analytics' },
      ],
    },
  ],
}

// ── Landing: Final CTA ────────────────────────────────────────────────────────
export const landingFinalCta = {
  title: {
    l1: { ar: 'ادفع مرة واحدة.',  en: 'Pay once.' },
    l2: { ar: 'امتلكها للأبد.',   en: 'Own it forever.' },
  },
  sub: { ar: 'ابدأ بمتجرك الأول اليوم.',  en: 'Start your first store today.' },
  cta: { ar: 'أنشئ حسابك',               en: 'Create your account' },
}

// ── Landing: Footer ───────────────────────────────────────────────────────────
export const landingFooter = {
  tagline: { ar: 'منصة المتاجر الجزائرية. ادفع مرة، وامتلك.',  en: 'The Algerian store platform. Pay once, and own it.' },
  built:   { ar: 'مبنية ومُشغّلة من',                           en: 'Built and run by' },
  made:    { ar: 'صُنع في الجزائر',                             en: 'Made in Algeria' },
  rights:  { ar: '© 2026 7aba. جميع الحقوق محفوظة',            en: '© 2026 7aba. All rights reserved' },
}
