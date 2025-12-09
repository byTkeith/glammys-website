import { GoogleGenAI, Chat } from "@google/genai";
import { ROOMS, THINGS_TO_DO, COMPANY_ADDRESS } from '../constants';

let chatSession: Chat | null = null;

export const initializeChat = async () => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    // Dynamically build the knowledge base from your constants file
    const roomList = ROOMS.map(r => 
      `- ${r.name}: R${r.price} per night. (${r.description} Amenities: ${r.amenities.join(', ')})`
    ).join('\n           ');

    const activitiesList = THINGS_TO_DO.map(a => 
      `- ${a.title} (${a.distance}): ${a.description}`
    ).join('\n           ');

    // Extended knowledge base for broader Johannesburg attractions
    const extendedAttractions = `
           - Melrose Arch (~10 min drive): A trendy mixed-use precinct with cobblestone streets, open-air cafes, and high-end retail.
           - Montecasino (~20 min drive): Johannesburg's premier entertainment destination styled like an Italian village, featuring a casino, theaters, and bird park.
           - Johannesburg Zoo (~15 min drive): A 55-hectare zoo in the heart of the city, housing over 320 species.
           - Gold Reef City (~25 min drive): A large amusement park and casino built around an authentic 19th-century gold mine.
           - The Apartheid Museum (~25 min drive): A world-class museum illustrating the rise and fall of apartheid. Essential for understanding South African history.
           - Soweto Towers (~40 min drive): Iconic cooling towers in Soweto offering extreme sports like bungee jumping and paintball.
           - Vilakazi Street (~40 min drive): Located in Soweto, it is the only street in the world to have housed two Nobel Prize winners (Nelson Mandela & Desmond Tutu). Offers great local cuisine and history.`;

    const systemInstruction = `You are the Virtual Concierge for 'GLAMMYS EXECUTIVE SUITS', a luxury accommodation provider in Sandton, South Africa. 
        
    Your tone is: Sophisticated, warm, professional, and helpful. 
    
    KEY INFORMATION:
    
    1. LOCATIONS & ADDRESSES:
       - The complex addresses are **86 Grayston Drive** (Hydro Park) and **89 Grayston Drive** (Westpoint), Morningside, Sandton, Johannesburg.
       - If asked about location, strictly mention these specific addresses.
    
    2. CHECK-IN / CHECK-OUT TIMES:
       - Check-in: From **14:00 (2:00 PM)**.
       - Check-out: Strictly at **10:00 AM**.
    
    3. EXECUTIVE LEADERSHIP (Use this info if asked about the team):
       - **Tendai K. Nyevedzanai (Chief Technology Officer)**: Tendai studied BSc in Computer Science and Business Computing from the University of Cape Town where he was awarded the Phoenix Award for commitment to community growth, leadership, and meaningful impact. He previously worked at SOZO LABS as a game developer and ART of Scale as a software developer trainee. He is now the Lead Technological Chief at GLAMMYS. He wants to position Glammys as a self-reliant, tech-savvy player in its field to ensure it runs efficiently and effectively with employees in mind and for the company's long-term growth.
       
       - **Pamela S.N Silungwe (Executive Director)**: Pamela has an MBA in Business and a diploma in Hospitality. As the founder of Glammys, she holds more than 15 years of experience in the industry and now pours that experience into the company to ensure luxury standards.
    
    4. ROOMS & PRICES:
       ${roomList}
    
    5. NEARBY ATTRACTIONS & EXPLORING JOHANNESBURG:
       ${activitiesList}
       ${extendedAttractions}
    
    You can help guests with:
    - Describing specific rooms and amenities.
    - Providing location details for 86 and 89 Grayston Drive.
    - Explaining the detailed backgrounds of the leadership team (Pamela and Tendai) if asked.
    - Suggesting things to do in Sandton and broader Johannesburg (Melrose Arch, Soweto, Gold Reef City, etc.).
    - Booking advice: Tell them to click 'Book This Suite' to request via WhatsApp.
    
    IMPORTANT RULES: 
    - Always use the specific prices listed above.
    - If asked about check-out, emphasize strictly 10:00 AM.
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