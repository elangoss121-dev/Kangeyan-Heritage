import { MessageCircle } from 'lucide-react'
import { WHATSAPP_NUMBER } from '@/lib/format'

export function WhatsAppButton() {
  return (
    <a
      href={`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
        'Hello Kangeyan Heritage, I would like to know more about your products.',
      )}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with us on WhatsApp"
      className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-olive px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-olive/30 transition-transform hover:scale-105"
    >
      <MessageCircle className="size-5" />
      <span className="hidden sm:inline">Chat with us</span>
    </a>
  )
}
