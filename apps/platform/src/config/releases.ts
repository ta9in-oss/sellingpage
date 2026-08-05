/**
 * Merchant-facing release notes — the "What's new" feed in the dashboard.
 *
 * This is NOT the technical changelog. Those live in `CHANGELOG.md` (platform)
 * and `apps/store/CHANGELOG.md` (store) for anyone reading the source. Here we
 * say only what a merchant cares about: what got better for them, in their
 * language. Newest first.
 *
 * When you ship something merchants can notice, add an entry. Keep each line one
 * plain sentence — no file names, no component names, no jargon.
 */
import type { Tri } from './pricing'

export type ReleaseKind = 'new' | 'improved' | 'fixed'

export interface ReleaseItem {
  kind: ReleaseKind
  text: Tri
}

export interface Release {
  /** ISO date — displayed, and used for ordering + the "new since" badge. */
  date: string
  title: Tri
  items: ReleaseItem[]
}

export const KIND_LABEL: Record<ReleaseKind, Tri> = {
  new: { ar: 'جديد', fr: 'Nouveau', en: 'New' },
  improved: { ar: 'تحسين', fr: 'Amélioré', en: 'Improved' },
  fixed: { ar: 'إصلاح', fr: 'Corrigé', en: 'Fixed' },
}

export const RELEASES: Release[] = [
  {
    date: '2026-08-05',
    title: {
      ar: 'صور أفضل، ألوان تعمل فعلاً، وإحصائيات لمتجرك',
      fr: 'Meilleures images, couleurs qui fonctionnent, et statistiques',
      en: 'Better images, working colors, and store analytics',
    },
    items: [
      {
        kind: 'fixed',
        text: {
          ar: 'رفع الصور أصبح يعمل في كل مكان — الصور التي ترفعها تُحفظ وتظهر مباشرة.',
          fr: 'Le téléversement d\'images fonctionne partout — vos images sont enregistrées et s\'affichent aussitôt.',
          en: 'Image upload now works everywhere — the images you upload are saved and show up right away.',
        },
      },
      {
        kind: 'fixed',
        text: {
          ar: 'صور متجرك المنشور لم تعد تختفي مع الوقت. أعد نشر متجرك مرة واحدة لتستفيد.',
          fr: 'Les images de votre boutique en ligne ne disparaissent plus. Republiez une fois pour en profiter.',
          en: 'Images in your published store no longer disappear over time. Publish once more to get the fix.',
        },
      },
      {
        kind: 'new',
        text: {
          ar: 'يمكنك رفع عدة صور دفعة واحدة، في المحرر وعند إنشاء المتجر.',
          fr: 'Téléversez plusieurs images d\'un coup, dans l\'éditeur et à la création.',
          en: 'Upload several images at once, both in the builder and when creating a store.',
        },
      },
      {
        kind: 'new',
        text: {
          ar: 'قسم المميزات يقبل صورة حقيقية لكل ميزة، وليس رمزاً تعبيرياً فقط.',
          fr: 'La section Avantages accepte une vraie image par élément, pas seulement un emoji.',
          en: 'The features section now takes a real picture per feature, not just an emoji.',
        },
      },
      {
        kind: 'improved',
        text: {
          ar: 'تغيير ألوان المتجر أصبح ينعكس فعلاً على الصفحة، واختيار استدارة الزوايا يعمل بشكل صحيح.',
          fr: 'Changer les couleurs se voit vraiment sur la page, et le réglage des coins arrondis fonctionne.',
          en: 'Changing your store colors actually changes the page, and the corner-radius setting works properly.',
        },
      },
      {
        kind: 'fixed',
        text: {
          ar: 'اتجاه النص (يمين/يسار) صار يُطبَّق على المتجر كله وليس على الاستمارة فقط.',
          fr: 'Le sens du texte (RTL/LTR) s\'applique à toute la boutique, plus seulement au formulaire.',
          en: 'Text direction (RTL/LTR) now applies to the whole store, not just the order form.',
        },
      },
      {
        kind: 'new',
        text: {
          ar: 'أضف Google Analytics و Microsoft Clarity و Meta Pixel لمتجرك — فقط الصق المعرّف في إعدادات المتجر.',
          fr: 'Ajoutez Google Analytics, Microsoft Clarity et Meta Pixel — collez simplement l\'identifiant dans les réglages.',
          en: 'Add Google Analytics, Microsoft Clarity and Meta Pixel to your store — just paste the ID in store settings.',
        },
      },
      {
        kind: 'fixed',
        text: {
          ar: 'المتجر المنشور صار يظهر بحالة "شغّال" بدل "مسودة".',
          fr: 'Une boutique publiée affiche bien « En ligne » au lieu de « Brouillon ».',
          en: 'A published store now shows as “Live” instead of “Draft”.',
        },
      },
    ],
  },
]

/** Newest release date, used for the dashboard "new" badge. */
export const LATEST_RELEASE_DATE = RELEASES[0]?.date ?? ''
