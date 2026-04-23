export const config = { runtime: 'edge' };

const ALLOWED_ORIGINS = [
  'https://physics-visual-learning.vercel.app',
  'http://localhost:5173',
];

const RATE_LIMIT_MAP = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT_MAX = 20;       // requests
const RATE_LIMIT_WINDOW = 60000; // 1 minute in ms

function getRateLimitKey(req: Request): string {
  return (
    req.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ??
    req.headers.get('cf-connecting-ip') ??
    'unknown'
  );
}

function isRateLimited(key: string): boolean {
  const now = Date.now();
  const entry = RATE_LIMIT_MAP.get(key);
  if (!entry || now > entry.resetAt) {
    RATE_LIMIT_MAP.set(key, { count: 1, resetAt: now + RATE_LIMIT_WINDOW });
    return false;
  }
  if (entry.count >= RATE_LIMIT_MAX) return true;
  entry.count++;
  return false;
}

function buildContents(
  userMessage: string,
  chapterTitle: string,
  history: { role: string; text: string }[]
) {
  return [
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
    ...history.map(msg => ({
      role: msg.role,
      parts: [{ text: msg.text }],
    })),
    {
      role: 'user',
      parts: [{ text: userMessage }],
    },
  ];
}

export default async function handler(req: Request) {
  // CORS check
  const origin = req.headers.get('origin') ?? '';
  const isAllowed = ALLOWED_ORIGINS.includes(origin) || origin.endsWith('.vercel.app');
  if (!isAllowed && origin !== '') {
    return new Response('Forbidden', { status: 403 });
  }

  // Method check
  if (req.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  // Rate limiting
  const key = getRateLimitKey(req);
  if (isRateLimited(key)) {
    return new Response(
      JSON.stringify({ error: 'Too many requests. Please wait a moment.' }),
      { status: 429, headers: { 'Content-Type': 'application/json' } }
    );
  }

  // Input validation
  let body: { userMessage?: string; chapterTitle?: string; history?: unknown[] };
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), { status: 400 });
  }

  const { userMessage, chapterTitle, history = [] } = body;
  if (
    typeof userMessage !== 'string' ||
    typeof chapterTitle !== 'string' ||
    userMessage.trim().length === 0 ||
    userMessage.length > 2000
  ) {
    return new Response(
      JSON.stringify({ error: 'Invalid request body' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const geminiKey = process.env.GEMINI_API_KEY || process.env.VITE_GEMINI_API_KEY;
  if (!geminiKey) {
    return new Response(
      JSON.stringify({ text: 'Error: GEMINI_API_KEY is missing from Vercel Environment Variables.' }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin } }
    );
  }

  try {
    const geminiRes = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiKey}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: buildContents(
            userMessage,
            chapterTitle,
            (history as { role: string; text: string }[]).slice(-10)
          ),
        }),
      }
    );

    if (!geminiRes.ok) {
      const errorText = await geminiRes.text();
      return new Response(
        JSON.stringify({ text: `Google API Error (${geminiRes.status}): ${errorText.slice(0, 100)}` }),
        { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin } }
      );
    }

    const data = await geminiRes.json();
    const text =
      data.candidates?.[0]?.content?.parts?.[0]?.text ??
      "I'm having trouble connecting right now. Try again!";

    return new Response(
      JSON.stringify({ text }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': origin,
        },
      }
    );
  } catch (err: any) {
    console.error('Gemini proxy error:', err);
    return new Response(
      JSON.stringify({ text: `Server Error: ${err.message}` }),
      { status: 200, headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': origin } }
    );
  }
}
