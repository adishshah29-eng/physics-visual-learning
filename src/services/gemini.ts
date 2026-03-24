export interface Message {
  role: 'user' | 'model';
  text: string;
}

export async function askPhysicsTutor(
  userMessage: string,
  chapterTitle: string,
  history: Message[]
): Promise<string> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), 15000);

  try {
    const response = await fetch('/api/tutor', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userMessage: userMessage.slice(0, 2000),
        chapterTitle,
        history: history.slice(-10),
      }),
      signal: controller.signal,
    });
    clearTimeout(timeoutId);

    if (response.status === 429) {
      return 'You are sending messages too quickly. Please wait a moment.';
    }
    if (!response.ok) {
      throw new Error(`Proxy error ${response.status}`);
    }

    const data = await response.json();
    return data.text ?? "I'm having trouble connecting. Try again!";
  } catch (err) {
    clearTimeout(timeoutId);
    console.error('Tutor fetch error:', err);
    return "I'm having trouble connecting. Try again!";
  }
}
