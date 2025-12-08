import { GoogleGenAI, Chat } from "@google/genai";
import { ROOMS, TEAM, THINGS_TO_DO, COMPANY_ADDRESS } from '../constants';

let chatSession: Chat | null = null;

export const initializeChat = async () => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Dynamically build the knowledge base from your constants file
    const roomList = ROOMS.map(r => 
      `- ${r.name}: R${r.price} per night. (${r.description} Amenities: ${r.amenities.join(', ')})`
    ).join('\n           ');

    const teamList = TEAM.map(t => 
      `- ${t.role}: ${t.name}`
    ).join('\n           ');

    const activitiesList = THINGS_TO_DO.map(a => 
      `- ${a.title} (${a.distance}): ${a.description}`
    ).join('\n           ');

    const systemInstruction = `You are the Virtual Concierge for 'GLAMMYS EXECUTIVE SUITS', a luxury accommodation provider in Sandton, South Africa. 
        
    Your tone is: Sophisticated, warm, professional, and helpful. 
    
    KEY INFORMATION:
    1. ROOMS & PRICES:
       ${roomList}
    
    2. LEADERSHIP:
       ${teamList}
    
    3. LOCATION & DETAILS:
       - Address: ${COMPANY_ADDRESS}
       - Nearby Attractions:
       ${activitiesList}
    
    You can help guests with:
    - Describing specific rooms and amenities based on the list above.
    - Suggesting things to do nearby.
    - Booking advice: Tell them to click 'Book This Suite' to request via WhatsApp.
    
    IMPORTANT: 
    - Always use the specific prices listed above (R1100, R1700, R1500).
    - If asked about the owner/director, mention Pamela S.N Silungwe.
    - Keep responses concise, elegant, and focused on luxury.`;
    
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction
      }
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
    if (!success) return "I apologize, but I am currently having trouble connecting to the concierge service. Please check your internet connection or try again later.";
  }

  if (!chatSession) return "I apologize, but I am currently having trouble connecting to the concierge service. Please try again later.";

  try {
    const response = await chatSession.sendMessage({ message });
    return response.text || "I apologize, I didn't catch that. Could you please rephrase?";
  } catch (error) {
    console.error("Gemini Error:", error);
    // If the session expired or errored, try re-initializing once
    await initializeChat();
    try {
        // Retry once
        if (chatSession) {
            const retryResponse = await chatSession.sendMessage({ message });
            return retryResponse.text || "I apologize, I didn't catch that.";
        }
    } catch (retryError) {
        console.error("Retry failed", retryError);
    }
    return "I apologize, but I am experiencing a momentary connection issue. Please contact us directly via WhatsApp for immediate assistance.";
  }
};