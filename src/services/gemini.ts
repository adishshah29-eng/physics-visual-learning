export interface Message {
  role: 'user' | 'model';
  text: string;
}

export async function askPhysicsTutor(
  userMessage: string,
  chapterTitle: string,
  history: Message[]
): Promise<string> {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if (!apiKey) {
    return "Error: VITE_GEMINI_API_KEY is missing from your .env file.";
  }

  const contents = [
    {
      role: 'user',
      parts: [{
        text: `You are PhysicsLab AI, a JEE/NEET physics tutor.
Chapter context: ${chapterTitle}.
Rules: Keep answers to 3-5 sentences. Show formula after plain
English explanation. Wrap math in $ for LaTeX. Guide don't solve.
If off-topic, redirect to physics.`,
      }],
    },
    {
      role: 'model',
      parts: [{ text: `Understood. I'm ready to help with ${chapterTitle}.` }],
    },
    ...history.slice(-10).map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    })),
    {
      role: 'user',
      parts: [{ text: userMessage.slice(0, 2000) }],
    },
  ];

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ contents }),
        signal: controller.signal,
      }
    );
    clearTimeout(timeoutId);

    if (!response.ok) {
      const errText = await response.text();
      return `Google API Error (${response.status}): ${errText.slice(0, 100)}`;
    }

    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text ?? "I couldn't generate a response. Try again!";
  } catch (err: any) {
    clearTimeout(timeoutId);
    console.error('Tutor fetch error:', err);
    return `Connection Error: ${err.message}`;
  }
}
