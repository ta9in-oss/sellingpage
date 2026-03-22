import { seo } from "@/utils/seo";

export const seoConfigs = {
  privacyPolicy: seo({
    title: "سياسة الخصوصية",
    description:
      "معلوماتك محفوظة في قواعد بيانات ممتازة الحماية مع مسح دوري لك طلبات منتهية.",
  }),

  termsOfService: seo({
    title: "سياسة الإستخدام",
    description: "كل ما تراه في الموقع",
  }),
};
