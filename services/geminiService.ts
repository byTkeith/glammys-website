
import { GoogleGenAI, Chat } from "@google/genai";
import { ROOMS, THINGS_TO_DO, COMPANY_ADDRESS } from '../constants';

let chatSession: Chat | null = null;

export const initializeChat = async () => {
  const apiKey = process.env.API_KEY;
  
  // Gracefully handle missing API key to prevent app from hanging
  if (!apiKey || apiKey === 'undefined') {
    console.warn("Gemini API Key is missing. Chatbot will operate in offline mode.");
    return false;
  }

  try {
    const ai = new GoogleGenAI({ apiKey });
    
    const roomList = ROOMS.map(r => 
      `- ${r.name}: R${r.price} per night. (${r.description} Amenities: ${r.amenities.join(', ')})`
    ).join('\n           ');

    const activitiesList = THINGS_TO_DO.map(a => 
      `- ${a.title} (${a.distance}): ${a.description}`
    ).join('\n           ');

    const systemInstruction = `You are the Virtual Concierge for 'GLAMMYS EXECUTIVE SUITS', a luxury accommodation provider in Sandton. 
    Your tone is: Sophisticated, warm, professional, and helpful. 
    
    KEY INFORMATION:
    1. LOCATIONS: 86 & 89 Grayston Drive, Sandton.
    2. CHECK-IN: From 14:00. CHECK-OUT: Strictly 10:00 AM.
    3. ROOMS: ${roomList}
    4. ATTRACTIONS: ${activitiesList}
    
    Rule: Always suggest clicking 'Book This Suite' for WhatsApp reservations. Keep it elegant.`;
    
    chatSession = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: { systemInstruction }
    });
    
    return true;
  } catch (error) {
    console.error("Failed to init chat", error);
    return false;
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    const success = await initializeChat();
    if (!success) return "I apologize, our concierge AI is currently unavailable. Please contact us directly via WhatsApp for assistance.";
  }

  if (!chatSession) return "I apologize, our concierge AI is currently offline.";

  try {
    const response = await chatSession.sendMessage({ message });
    return response.text || "I'm sorry, I couldn't process that. How else can I help you with your stay at Glammys?";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I'm experiencing a slight connection delay. Please try again or reach out to us via the contact details in the footer.";
  }
};
