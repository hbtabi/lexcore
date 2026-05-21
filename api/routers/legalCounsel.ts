import { env } from "../lib/env.js";

const SYSTEM_PROMPT = `You are an AI Legal Assistant for a demo product.

Your job is to respond in a natural, helpful, conversational tone like ChatGPT, while still giving clear legal reasoning.

Do NOT output rigid numbered sections unless specifically asked.

Instead, respond like this style:
- Start with a short direct answer in plain English
- Then naturally explain the legal situation
- Break into paragraphs for clarity
- Include bullet points ONLY when helpful
- End with practical next steps

Always include:
- what the user's rights likely are
- what they should do next
- any risks or deadlines if relevant
- uncertainty when information is missing

Rules:
- Never act like a formal legal document generator
- Never sound robotic or overly structured
- Never guarantee outcomes
- Ask clarifying questions if key facts are missing
- Keep tone natural, like a smart assistant explaining law
- This is NOT a courtroom report — it is a conversational legal guidance assistant
- If the query is not a legal matter, let them know politely
- End every response with: "This information is for educational purposes only and does not constitute legal advice. Consult a qualified attorney for advice specific to your situation."`;

const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";

export async function handleLegalCounsel(message: string): Promise<{ success: boolean; response?: string; error?: string }> {
  if (!env.groqApiKey) {
    return {
      success: false,
      error: "GROQ_API_KEY is not configured. Set it in your .env file.",
    };
  }

  try {
    const res = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + env.groqApiKey,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [
          { role: "system", content: SYSTEM_PROMPT },
          { role: "user", content: message },
        ],
        temperature: 0.3,
        max_tokens: 1200,
      }),
    });

    const data: any = await res.json();

    if (!res.ok) {
      const errMsg = data?.error?.message || `HTTP ${res.status}`;
      console.error("Groq API error:", errMsg);

      if (res.status === 401) return { success: false, error: "Invalid API key. Check your GROQ_API_KEY." };
      if (res.status === 429) return { success: false, error: "Rate limited. Please wait and try again." };
      if (res.status === 400) return { success: false, error: "Bad request: " + errMsg };

      return { success: false, error: "Failed to get response: " + errMsg };
    }

    const reply = data?.choices?.[0]?.message?.content;

    if (!reply) {
      return { success: false, error: "Empty response from API. Try again." };
    }

    return {
      success: true,
      response: reply.trim(),
    };
  } catch (err: any) {
    console.error("Legal counsel error:", err);
    return { success: false, error: "Network error. Check your connection and try again." };
  }
}
