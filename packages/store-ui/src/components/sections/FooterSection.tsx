import { useTheme } from '../../context/ThemeContext'
import { cn } from '../../lib/utils'

export interface FooterContent {
  storeName: string
  tagline?: string
  phone?: string
  email?: string
  whatsapp?: string
  links?: { label: string; href: string }[]
  copyright?: string
}

interface FooterSectionProps {
  content: FooterContent
  className?: string
}

export function FooterSection({ content, className }: FooterSectionProps) {
  const theme = useTheme()
  const isDark = theme.mode === 'dark'

  return (
    <footer
      className={cn('py-10 px-6', className)}
      style={{
        backgroundColor: isDark ? '#050505' : '#000',
        borderTop: `2px solid ${isDark ? theme.colors.border : '#222'}`,
        color: '#fff',
        fontFamily: theme.typography.fontFamily,
      }}
    >
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Store name + tagline */}
        <div className="text-center">
          <p className="text-xl font-black" style={{ color: theme.colors.accent }}>
            {content.storeName || 'متجرك'}
          </p>
          {content.tagline && (
            <p className="text-sm mt-1 opacity-60">{content.tagline}</p>
          )}
        </div>

        {/* Contact info */}
        {(content.phone || content.email || content.whatsapp) && (
          <div className="flex flex-wrap items-center justify-center gap-4 text-sm opacity-70">
            {content.phone && (
              <a href={`tel:${content.phone}`} className="hover:opacity-100 transition-opacity">
                📞 {content.phone}
              </a>
            )}
            {content.whatsapp && (
              <a
                href={`https://wa.me/${content.whatsapp.replace(/\D/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:opacity-100 transition-opacity"
              >
                💬 WhatsApp
              </a>
            )}
            {content.email && (
              <a href={`mailto:${content.email}`} className="hover:opacity-100 transition-opacity">
                ✉️ {content.email}
              </a>
            )}
          </div>
        )}

        {/* Links */}
        {content.links && content.links.length > 0 && (
          <div className="flex flex-wrap justify-center gap-4 text-xs opacity-50">
            {content.links.map((link, i) => (
              <a key={i} href={link.href} className="hover:opacity-100 transition-opacity underline">
                {link.label}
              </a>
            ))}
          </div>
        )}

        {/* Divider */}
        <div className="border-t border-white/10" />

        {/* Copyright */}
        <p className="text-center text-xs opacity-40">
          {content.copyright || `© ${new Date().getFullYear()} ${content.storeName || 'متجرك'} — جميع الحقوق محفوظة`}
        </p>
      </div>
    </footer>
  )
}
