import { createFileRoute } from '@tanstack/react-router'
import {
  ThemeProvider,
  HeroSection,
  FeatureGrid,
  BenefitsSection,
  TestimonialSection,
  GuaranteeSection,
  FAQSection,
  OrderSection,
  brutalistTheme,
} from '@7aba/store-ui'
import type { OrderData } from '@7aba/store-ui'

export const Route = createFileRoute('/demo')({
  component: DemoPage,
})

// Full content from the real store — this IS the live demo
const content = {
  hero: {
    title: ['حزام واحد', 'يحكم الكل'],
    description: 'صاكادو يد وحدة: يرفد بزاف ويبان صغير. خفيف، مريح، يخدم القراية والسبور والخرجات',
    ctaText: 'اشتر الآن',
    ctaLink: '#buy',
    image: '/bagpack_001.png',
    priceTag: { amount: '2500', currency: 'دج' },
    freeDelivery: true,
  },
  features: [
    {
      image: '/bagpack_005.png',
      title: 'السعة',
      description:
        'هي جاية كي شغل F1 فيها جيب واحد كبير تحط فيه كلش. مخدوم للناس اللي تحب تنظم حوايجها.',
      bgColor: 'bg-yellow-400 text-black',
    },
    {
      image: '/bagpack_003.png',
      title: 'المادة: %100 بوليستار',
      description: 'مصنوعة %100 بوليستار، قوية، ما تتقشر ما تتقطع، وأهم شي ما تشعّرش.',
      bgColor: 'bg-white text-black',
    },
    {
      image: '/bagpack_004.png',
      title: 'الوزن',
      description: 'صاكادو خفيفة ظريفة. ترفدها وتقلع كي شغل ماك رافد والو.',
      bgColor: 'bg-black text-white',
    },
  ],
  productImages: [
    { id: 1, image: '/bagpack_002.png', title: 'حقيبة ظهر بذراع واحدة', bgColor: 'bg-black text-white' },
    { id: 2, image: '/bagpack_003.png', title: 'حقيبة ظهر بذراع واحدة', bgColor: 'bg-yellow-400 text-black' },
    { id: 3, image: '/bagpack_004.png', title: 'حقيبة ظهر بذراع واحدة', bgColor: 'bg-white text-black border-2 border-black' },
    { id: 4, image: '/bagpack_005.png', title: 'حقيبة ظهر بذراع واحدة', bgColor: 'bg-yellow-400 border-2 border-black' },
  ],
  orderLayout: { type: 'form-right-carousel-quantity-left' as const, showCarousel: true, carouselPosition: 'top-left' as const },
  testimonials: [
    { id: 1, name: 'أحمد بن علي', location: 'الجزائر العاصمة', comment: 'الصاكادو روعة! خفيف و يرفد بزاف. استعملتها في رحلة للجامعة و كانت ممتازة', rating: 5 },
    { id: 2, name: 'فاطمة الزهراء', location: 'وهران', comment: 'جودة عالية و السعر معقول. نصحت بيها كل صديقاتي', rating: 5 },
    { id: 3, name: 'محمد الأمين', location: 'قسنطينة', comment: 'التوصيل كان سريع و المنتج كيما في الصور. راني راضي بزاف', rating: 5 },
    { id: 4, name: 'سارة بوعلام', location: 'عنابة', comment: 'الحقيبة مريحة بزاف للظهر و التصميم عصري. نستعملها كل يوم', rating: 5 },
    { id: 5, name: 'يوسف كريم', location: 'تلمسان', comment: 'المادة قوية و ما تتقطعش. استثمار يستحق الفلوس', rating: 5 },
    { id: 6, name: 'نادية حسين', location: 'سطيف', comment: 'جميلة و عملية. الجيوب مرتبين مليح و كلش عندو بلاصتو', rating: 5 },
  ],
  faqs: [
    { id: 1, question: 'كيفاش نطلب الصاكادو؟', answer: 'املأ الاستمارة بالمعلومات ديالك. بعد ما تأكد الطلب، راح يتصل بيك واحد من الفريق ديالنا.' },
    { id: 2, question: 'واش التوصيل مجاني؟', answer: 'إيه! التوصيل باطل لكامل ولايات الوطن.' },
    { id: 3, question: 'شحال من وقت يوصل الطلب؟', answer: 'عادة يوصل الطلب من 2 لـ 5 أيام حسب المنطقة ديالك.' },
    { id: 4, question: 'كيفاش الدفع؟', answer: 'الدفع يكون عند الاستلام. تستلم الصاكادو، تشوفها، وإذا عجبتك تخلص.' },
    { id: 5, question: 'واش نقدر نرجعها إذا ما عجبتنيش؟', answer: 'إيه! عندك 7 أيام باش ترجع المنتج إذا ما عجبكش.' },
    { id: 6, question: 'الصاكادو قوية؟ ما تتقطعش؟', answer: 'الصاكادو مصنوعة من بوليستار %100، مادة قوية وما تتقطعش بسهولة.' },
  ],
  guarantees: [
    { icon: 'truck', title: 'توصيل مجاني', description: 'التوصيل باطل لكامل التراب الوطني' },
    { icon: 'refresh', title: 'إرجاع مجاني', description: 'عندك 7 أيام باش ترجع المنتج' },
    { icon: 'credit', title: 'دفع عند الاستلام', description: 'خلص فقط لما تستلم المنتج' },
    { icon: 'shield', title: 'جودة مضمونة', description: 'المنتج مضمون %100' },
    { icon: 'award', title: 'خدمة ممتازة', description: 'فريق الدعم ديالنا جاهز باش يساعدك' },
    { icon: 'check', title: 'منتج أصلي', description: 'كل المنتجات أصلية %100' },
  ],
  benefits: [
    { icon: 'check', title: 'مريح للظهر', description: 'التصميم مدروس باش يكون مريح للظهر ولكتف' },
    { icon: 'zap', title: 'سريع الاستعمال', description: 'سهل تفتحها وتسكرها. الجيوب مرتبين مليح' },
    { icon: 'star', title: 'تصميم عصري', description: 'الشكل مودرن ويليق مع كل لبسة' },
    { icon: 'shield', title: 'مقاومة للماء', description: 'المادة تحمي الحوايج ديالك من المطر' },
    { icon: 'heart', title: 'خفيفة الوزن', description: 'ما تحسش بيها على كتفك' },
    { icon: 'trend', title: 'تدوم طويل', description: 'الخياطة متينة والمادة قوية' },
  ],
  sections: {
    specs: { title: 'المواصفات والخصائص' },
    order: { title: 'اطلب قبل ما تخلاص' },
  },
}

function DemoPage() {
  const scrollToBuy = () => {
    document.getElementById('buy')?.scrollIntoView({ behavior: 'smooth' })
  }

  const handleSubmit = async (_data: OrderData) => {
    // Demo — no real submission
    alert('هذا عرض تجريبي فقط — الطلب لن يُرسل')
  }

  return (
    <ThemeProvider value={brutalistTheme}>
      <div dir="rtl" className="font-[Almarai,sans-serif]">
        {/* Demo banner */}
        <div className="fixed top-0 inset-x-0 z-50 bg-yellow-400 border-b-2 border-black py-2 px-4 text-center">
          <span className="font-black text-sm text-black">
            🏪 هذا مثال على متجر مبني بـ 7aba.store —{' '}
            <a href="/" className="underline hover:no-underline">
              ابدأ متجرك مجاناً
            </a>
          </span>
        </div>

        <div className="pt-10">
          <HeroSection content={content.hero} onCtaClick={scrollToBuy} />
          <div className="w-full h-0.5 bg-black" />
          <FeatureGrid features={content.features} title={content.sections.specs.title} />
          <BenefitsSection benefits={content.benefits} />
          <TestimonialSection testimonials={content.testimonials} />
          <GuaranteeSection guarantees={content.guarantees} />
          <div className="w-full h-0.5 bg-black" />
          <section id="buy">
            <OrderSection
              price={2500}
              totalStock={99}
              productImages={content.productImages}
              onSubmit={handleSubmit}
              isSubmitting={false}
              layoutConfig={content.orderLayout}
              title={content.sections.order.title}
            />
          </section>
          <FAQSection faqs={content.faqs} />
        </div>
      </div>
    </ThemeProvider>
  )
}
