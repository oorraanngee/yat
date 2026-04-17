import { GoogleGenAI } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function translateToPreRevolutionary(text: string): Promise<string> {
  if (!text.trim()) return "";
  
  const prompt = `Переведи следующий современный русский текст на дореволюционную (дореформенную) орфографию.
Правила:
1. Используй букву 'ѣ' (ять) там, где она исторически писалась.
2. Используй 'і' (и десятеричное) перед гласными и 'й', а также в слове 'міръ' (вселенная).
3. Используй 'ѳ' (фита) в словах греческого происхождения (Аѳины, орѳография).
4. Пиши 'ъ' (ер) на конце слов после твердых согласных.
5. Приставки на -з/-с: пиши 'з' перед звонкими и глухими согласными (кроме 'с'), например: 'разсказъ', 'безполезный'.
6. Окончания прилагательных: -аго/-яго вместо -ого/-его, -ыя/-ія вместо -ые/-ие для женского и среднего рода.

Текст для перевода:
${text}

Верни ТОЛЬКО переведенный текст, без комментариев, кавычек и пояснений.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        temperature: 0.1, // Low temperature for more deterministic translation
      }
    });
    
    return response.text || "";
  } catch (error: any) {
    console.error("Translation error:", error);
    throw new Error(error?.message || "Не удалось перевести текст. Пожалуйста, попробуйте позже.");
  }
}
