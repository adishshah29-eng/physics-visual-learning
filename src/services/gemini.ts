export interface Message {
  role: 'user' | 'model';
  text: string;
}

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-flash-latest:generateContent';

export async function askPhysicsTutor(
  userMessage: string,
  chapterTitle: string,
  history: Message[]
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const systemPrompt = `You are PhysicsLab AI, a JEE/NEET physics tutor. 
Chapter context: ${chapterTitle}. 
Rules: Keep answers to 3-5 sentences. Show formula after 
plain English explanation. Wrap math in $ for LaTeX. 
Guide don't solve. If off-topic, redirect to physics.`;

    const modelAcknowledgement = `Understood. I'm ready to help with ${chapterTitle}.`;

    // Map history and inject system prompt sequence
    const contents = [
      {
        role: 'user',
        parts: [{ text: systemPrompt }]
      },
      {
        role: 'model',
        parts: [{ text: modelAcknowledgement }]
      },
      ...history.map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      })),
      {
        role: 'user',
        parts: [{ text: userMessage }]
      }
    ];

    const response = await fetch(`${BASE_URL}?key=${API_KEY}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ contents }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    const resultText = data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!resultText) {
      throw new Error('No content returned');
    }

    return resultText;
  } catch (error) {
    clearTimeout(timeoutId);
    console.error('Gemini API Error:', error);
    return "I'm having trouble connecting. Try again!";
  }
}
