// Provider adapter: Gemini by default, Anthropic optional (LLM_PROVIDER=anthropic + ANTHROPIC_API_KEY).
const PROVIDER = (Deno.env.get('LLM_PROVIDER') || 'gemini').toLowerCase();
const MODEL = Deno.env.get('LLM_MODEL') || (PROVIDER === 'anthropic' ? 'claude-haiku-4-5' : 'gemini-2.5-flash-lite');
const EMBED_MODEL = Deno.env.get('EMBED_MODEL') || 'gemini-embedding-001';
const GEMINI_KEY = Deno.env.get('GEMINI_API_KEY') || '';
const DIMS = 768;

export type Turn = { role: 'user' | 'assistant'; text: string };
export class LlmError extends Error { constructor(public code: 'rate' | 'fail') { super(code); } }

export async function embedQuery(text: string): Promise<number[]> {
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${EMBED_MODEL}:embedContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_KEY },
    body: JSON.stringify({
      model: `models/${EMBED_MODEL}`,
      content: { parts: [{ text }] },
      taskType: 'RETRIEVAL_QUERY',
      outputDimensionality: DIMS,
    }),
  });
  if (r.status === 429) throw new LlmError('rate');
  if (!r.ok) throw new LlmError('fail');
  const j = await r.json();
  const v: number[] | undefined = j?.embedding?.values;
  if (!v?.length) throw new LlmError('fail');
  // gemini-embedding-001 με μειωμένες διαστάσεις: κανονικοποίηση για σωστή cosine
  const n = Math.sqrt(v.reduce((s, x) => s + x * x, 0)) || 1;
  return v.map((x) => x / n);
}

export async function generate(system: string, history: Turn[], user: string): Promise<string> {
  if (PROVIDER === 'anthropic') return anthropic(system, history, user);
  return gemini(system, history, user);
}

async function gemini(system: string, history: Turn[], user: string): Promise<string> {
  const contents = [
    ...history.map((t) => ({ role: t.role === 'assistant' ? 'model' : 'user', parts: [{ text: t.text }] })),
    { role: 'user', parts: [{ text: user }] },
  ];
  const r = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'x-goog-api-key': GEMINI_KEY },
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents,
      generationConfig: { temperature: 0.3, maxOutputTokens: 350 },
    }),
  });
  if (r.status === 429) throw new LlmError('rate');
  if (!r.ok) throw new LlmError('fail');
  const j = await r.json();
  const out = j?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text || '').join('').trim();
  if (!out) throw new LlmError('fail');
  return out;
}

async function anthropic(system: string, history: Turn[], user: string): Promise<string> {
  const r = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': Deno.env.get('ANTHROPIC_API_KEY') || '',
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 350,
      temperature: 0.3,
      system,
      messages: [...history.map((t) => ({ role: t.role, content: t.text })), { role: 'user', content: user }],
    }),
  });
  if (r.status === 429) throw new LlmError('rate');
  if (!r.ok) throw new LlmError('fail');
  const j = await r.json();
  const out = j?.content?.map((c: { text?: string }) => c.text || '').join('').trim();
  if (!out) throw new LlmError('fail');
  return out;
}
