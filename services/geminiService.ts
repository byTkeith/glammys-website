import { GoogleGenAI, Chat } from "@google/genai";
import { StorageService } from './storageService';
import { COMPANY_NAME, COMPANY_PHONE, COMPANY_EMAIL, COMPANY_ADDRESS } from '../constants';

let chatSession: Chat | null = null;

export const initializeChat = async () => {
  // Try retrieving key from Vite/React environment variables or window
  const apiKey = (typeof process !== 'undefined' && process.env?.API_KEY) ||
                 (import.meta as any)?.env?.VITE_GEMINI_API_KEY ||
                 (window as any)?.__GEMINI_API_KEY__;

  if (!apiKey || apiKey === 'undefined') {
    console.warn("Gemini API Key is missing. Chatbot will operate in smart offline fallback mode.");
    return false;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });

    // Fetch live data from storage
    const rooms = StorageService.getRooms();
    const activePromos = StorageService.getPromotions().filter(p => p.isActive);
    const faqs = StorageService.getFaqs();

    const roomList = rooms.map(r => 
      `- ${r.name}: R${r.price}/night. (${r.description} | Max guests: ${r.maxGuests} | Amenities: ${r.amenities.join(', ')})`
    ).join('\n');

    const promoList = activePromos.length > 0
      ? activePromos.map(p => 
          `- ${p.title} (${p.highlightText || `${p.discountPercentage}% OFF`}): ${p.description} (Code: ${p.code || 'None'})`
        ).join('\n')
      : 'No standard public promo codes currently active. Custom discounts can be provided by human concierge.';

    const faqList = faqs.map(f => `Q: ${f.question}\nA: ${f.answer}`).join('\n');

    const systemInstruction = `You are the Virtual Concierge for '${COMPANY_NAME}', a luxury accommodation provider in Sandton, Johannesburg at ${COMPANY_ADDRESS}.
Your tone is sophisticated, warm, welcoming, and 5-star professional.

=== LIVE SUITES & NIGHTLY RATES ===
${roomList}

=== CURRENT ACTIVE SPECIALS & PROMOTIONS ===
${promoList}

=== CONCIERGE FAQ DATABASE ===
${faqList}

=== CONTACT INFO ===
Phone/WhatsApp: +${COMPANY_PHONE}
Email: ${COMPANY_EMAIL}

=== INSTRUCTIONS & RULES ===
1. When asked about discounts, seasonal specials (e.g., December Disease, Early Bird, Weekday Madness), explain the savings clearly and encourage them to book.
2. Highlight key perks: Free high-speed Wi-Fi, secure parking, heated pool, gym access, 24hr security, and prime Sandton location.
3. If the user wants to book, finalize payment, negotiate custom rates, or speak to a human, politely invite them to connect with the front desk on WhatsApp (+${COMPANY_PHONE}).
4. Keep answers concise, elegant, and neatly formatted.`;

    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: { systemInstruction }
    });

    return true;
  } catch (error) {
    console.error("Failed to initialize Gemini chat:", error);
    return false;
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    await initializeChat();
  }

  if (chatSession) {
    try {
      const response = await chatSession.sendMessage({ message });
      if (response.text) {
        return response.text;
      }
    } catch (error) {
      console.error("Gemini Live Chat Error:", error);
    }
  }

  // Smart Offline Concierge Fallback
  return generateOfflineSmartReply(message);
};

// Resilient fallback logic when offline or API key is not configured
function generateOfflineSmartReply(query: string): string {
  const lower = query.toLowerCase();
  const rooms = StorageService.getRooms();
  const activePromos = StorageService.getPromotions().filter(p => p.isActive);
  const faqs = StorageService.getFaqs();

  // Promotions inquiry
  if (lower.includes('promo') || lower.includes('discount') || lower.includes('special') || lower.includes('december') || lower.includes('weekday') || lower.includes('early bird') || lower.includes('deal')) {
    if (activePromos.length > 0) {
      const list = activePromos.map(p => `✨ *${p.title}* (${p.highlightText || `${p.discountPercentage}% OFF`}): ${p.description}`).join('\n\n');
      return `Here are our current active specials:\n\n${list}\n\nWould you like our front desk concierge to apply one of these discounts to your reservation? Click the WhatsApp button below!`;
    }
    return `We offer tailored discounts for extended stays and corporate guests. Please chat with our front desk on WhatsApp for a custom discount rate!`;
  }

  // Room pricing inquiry
  if (lower.includes('price') || lower.includes('rate') || lower.includes('cost') || lower.includes('how much')) {
    const rates = rooms.map(r => `• *${r.name}*: R${r.price} / night`).join('\n');
    return `Our suite rates are as follows:\n\n${rates}\n\nAll reservations include complimentary fiber Wi-Fi, secure parking, and full amenities.`;
  }

  // FAQ search
  for (const faq of faqs) {
    if (lower.includes(faq.question.toLowerCase().slice(0, 15))) {
      return faq.answer;
    }
  }

  // Human agent / booking handoff
  if (lower.includes('agent') || lower.includes('human') || lower.includes('call') || lower.includes('phone') || lower.includes('book') || lower.includes('reserve')) {
    return `You can connect directly with our front desk reservations manager on WhatsApp (+${COMPANY_PHONE}) to finalize your booking or request special arrangements.`;
  }

  return `Welcome to Glammys Executive Suites! We offer executive living at Hydro Park & Westpoint in Sandton. Feel free to ask about our suites, active promotions, or tap below to speak directly with our concierge team.`;
}
