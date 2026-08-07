import { MessageCircle } from 'lucide-react'
import { contactWhatsappUrl } from '@/config/pricing'
import { trackGtag, trackClarity } from '@/lib/track'

const MSG = {
  ar: 'مرحباً، عندي سؤال عن 7aba.',
  fr: "Bonjour, j'ai une question sur 7aba.",
  en: 'Hi, I have a question about 7aba.',
}

/** Persistent contact channel for visitors stuck before signup — cheapest conversion save there is. */
export function WhatsAppButton() {
  return (
    <a
      href={contactWhatsappUrl(MSG.ar)}
      target="_blank"
      rel="noopener noreferrer"
      onClick={() => {
        trackGtag('whatsapp_click')
        trackClarity('whatsapp_click')
      }}
      aria-label="WhatsApp"
      className="fixed bottom-24 left-5 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[3px_3px_0px_0px_#000] border-2 border-black transition-transform hover:scale-105"
    >
      <MessageCircle className="h-7 w-7" fill="white" strokeWidth={0} />
    </a>
  )
}
