import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';
const ai = new GoogleGenAI({ apiKey });

export const solveMathProblem = async (expression: string): Promise<string> => {
  if (!expression) return "数式が入力されていません。";

  try {
    const prompt = `
      You are an expert mathematics tutor. 
      Solve the following mathematical expression or problem provided in LaTeX format:
      
      Expression: $$${expression}$$
      
      Instructions:
      1. Provide a step-by-step explanation.
      2. Use LaTeX format for all mathematical expressions, enclosed in single dollar signs $...$ for inline and double dollar signs $$...$$ for block equations.
      3. Be concise but clear.
      4. If the input is just an expression, simplify or solve it. If it's a question, answer it.
      5. Output in Japanese.
    `;

    // Using gemini-3-pro-preview for better reasoning capabilities in math
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 2048 }, // Enable thinking for better math reasoning
      }
    });

    return response.text || "回答を生成できませんでした。";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "エラーが発生しました。しばらく待ってから再度お試しください。";
  }
};