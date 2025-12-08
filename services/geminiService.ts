
import { GoogleGenAI, Chat } from "@google/genai";

let chatSession: Chat | null = null;

export const initializeChat = async () => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: `You are the Virtual Concierge for 'GLAMMYS EXECUTIVE SUITS', a luxury accommodation provider in Sandton, South Africa. 
        
        Your tone is: Sophisticated, warm, professional, and helpful. 
        
        KEY INFORMATION:
        1. ROOMS:
           - 1 Bedroom Executive Suite @ Hydro Park (Approx R2500)
           - 2 Bedroom Executive Suite @ Hydro Park (Approx R4500)
           - 2 Bedroom Exec Unit @ Westpoint (Approx R5500)
        
        2. LEADERSHIP:
           - Executive Director: Pamela S.N Silungwe
           - CTO: Tendai K. Nyevedzanai
        
        3. LOCATION:
           - We are located in the heart of Sandton (Hydro Park and Westpoint buildings).
           - Near Sandton City, Nelson Mandela Square, and The Leonardo.
        
        You can help guests with:
        - Describing rooms and amenities (Pool, Gym, Secure Parking, Fiber Wi-Fi).
        - Suggesting things to do nearby (Shopping, Dining at Alto234, Mushroom Farm Park).
        - Booking advice (Tell them to click 'Book This Suite' to request via WhatsApp).
        
        Keep responses concise, elegant, and focused on luxury.`
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
    await initializeChat();
  }

  if (!chatSession) return "I apologize, but I am currently having trouble connecting to the concierge service. Please try again later.";

  try {
    const response = await chatSession.sendMessage({ message });
    return response.text || "I apologize, I didn't catch that.";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "I apologize, but I am experiencing a momentary connection issue.";
  }
};
