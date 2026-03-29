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
      desc:  { ar: 'Cloudflare Workers — أسرع CDN في العالم', fr: 'Cloudflare Workers — CDN le plus rapide', en: 'Cloudflare Workers — fastest CDN worldwide' },
    },
    {
      icon: 'Shield',
      label: { ar: 'ملكية كاملة',             fr: 'Propriété totale',                en: 'Full ownership' },
      desc:  { ar: 'الكود والبيانات ملكك، لا أحد يستطيع إغلاق متجرك', fr: 'Code et données vous appartiennent', en: 'Code and data are yours — nobody can shut your store down' },
    },
    {
      icon: 'Palette',
      label: { ar: '3 قوالب احترافية',        fr: '3 thèmes pro',                    en: '3 pro themes' },
      desc:  { ar: 'بسيط، جريء، دافئ — كل واحد محسّن للبيع', fr: 'Simple, audacieux, chaleureux — optimisés pour vendre', en: 'Simple, bold, warm — each optimised to sell' },
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
      desc:  { ar: 'صور، نصوص، أسعار — كل شيء بصري', fr: 'Images, textes, prix — tout visuel', en: 'Images, text, prices — all visual' },
    },
    {
      icon: 'Bell',
      label: { ar: 'FOMO للزبائن — تلقائي',    fr: 'FOMO automatique pour vos clients', en: 'FOMO for customers — automatic' },
      desc:  {
        ar: 'زوار متجرك يشوفوا: "شخص من وهران طلب للتو" — يخلق إلحاح ويرفع المبيعات',
        fr: "Les visiteurs voient : \"Quelqu'un d'Oran vient de commander\" — urgence automatique",
        en: 'Visitors see: "Someone from Oran just ordered" — creates urgency, boosts sales',
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
      haba:    { text: { ar: '3,900 DZD مرة واحدة', fr: '3 900 DZD une fois',              en: '3,900 DZD one-time' },      good: true, highlight: true },
      ayor:    { text: { ar: '3,900+ DZD/شهر',       fr: '3 900+ DZD/mois',                en: '3,900+ DZD/mo' },           good: false },
      shopify: { text: { ar: '$29+/شهر',              fr: '$29+/mois',                      en: '$29+/mo' },                  good: false },
    },
  ],
}

// ── Notification Showcase ─────────────────────────────────────────────────────
export const notificationShowcase = {
  badge:   {
    ar: '🔥 ميزة حصرية — لا أحد في الجزائر يملكها',
    fr: "🔥 Exclusif — personne en Algérie ne l'a",
    en: '🔥 Exclusive — nobody in Algeria has it',
  },
  headline: {
    ar: 'زبائنك يشوفوا من اشترى قبلهم — تلقائياً',
    fr: 'Vos clients voient qui a acheté avant eux — automatiquement',
    en: 'Your customers see who bought before them — automatically',
  },
  sub: {
    ar: 'كل مرة يزور حد متجرك، يشوف إشعارات صغيرة في الزاوية: "شخص من وهران طلب للتو" أو "5 أشخاص من ولايتك طلبوا هذا الأسبوع". هذا يخلق إلحاح حقيقي ويرفع معدل التحويل — مثل WiserNotify، لكن مدمج في متجرك مباشرة.',
    fr: "À chaque visite, vos clients voient des notifications discrètes : \"Quelqu'un d'Oran vient de commander\" ou \"5 personnes de votre wilaya ont commandé cette semaine\". Crée une vraie urgence — comme WiserNotify, mais intégré gratuitement.",
    en: 'Every visit, customers see small corner notifications: "Someone from Oran just ordered" or "5 people from your wilaya ordered this week". Creates real urgency — like WiserNotify, but built right into your store.',
  },
  features: [
    { ar: 'إشعار "شخص من ولايتك طلب للتو"',    fr: '"Quelqu\'un de ta wilaya vient de commander"', en: '"Someone from your wilaya just ordered"' },
    { ar: 'يتكيف مع مدينة الزائر',               fr: "S'adapte à la ville du visiteur",             en: "Adapts to the visitor's city" },
    { ar: 'يرفع معدل التحويل بشكل ملحوظ',        fr: 'Booste le taux de conversion significativement', en: 'Significantly boosts conversion rate' },
    { ar: 'مدمج 100% — لا تطبيق خارجي',         fr: "100% intégré — aucune app externe",           en: '100% built-in — no external app' },
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
    { id: 'simple', name: { ar: 'بسيط',     fr: 'Simple',     en: 'Simple'   }, dzd: '3,900',  usd: '$29',   badge: { ar: 'الأكثر شيوعاً', fr: 'Le plus populaire', en: 'Most popular' }, accent: true },
    { id: 'pro',    name: { ar: 'احترافي',  fr: 'Pro',        en: 'Pro'      }, dzd: '14,900', usd: '$99',   badge: null, accent: false },
    { id: 'studio', name: { ar: 'ستوديو',   fr: 'Studio',     en: 'Studio'   }, dzd: '49,000', usd: '$299',  badge: null, accent: false },
    { id: 'partner',name: { ar: 'راعي',     fr: 'Partenaire', en: 'Partner'  }, dzd: '99,000+',usd: '$500+', badge: null, accent: false },
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
}
