import contentData from '@/config/content.json';
import type { SiteContent } from '@/types/content.types';

/**
 * Get all site content
 */
export function getContent(): SiteContent {
    return contentData as SiteContent;
}

/**
 * Get hero section content
 */
export function getHeroContent() {
    return getContent().hero;
}

/**
 * Get features/specs content
 */
export function getFeatures() {
    return getContent().features;
}

/**
 * Get product images for carousel
 */
export function getProductImages() {
    return getContent().productImages;
}

/**
 * Get testimonials if enabled
 */
export function getTestimonials() {
    return getContent().testimonials || [];
}

/**
 * Get FAQ items if enabled
 */
export function getFAQs() {
    return getContent().faqs || [];
}

/**
 * Get guarantees if enabled
 */
export function getGuarantees() {
    return getContent().guarantees || [];
}

/**
 * Get benefits if enabled
 */
export function getBenefits() {
    return getContent().benefits || [];
}

/**
 * Get comparison table data if enabled
 */
export function getComparison() {
    return getContent().comparison || [];
}

/**
 * Get urgency configuration  if enabled
 */
export function getUrgencyConfig() {
    return getContent().urgency;
}

/**
 * Get CTA section if enabled
 */
export function getCTASection() {
    return getContent().cta;
}
