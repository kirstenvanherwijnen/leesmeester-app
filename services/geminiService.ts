
import { GoogleGenAI, Type } from "@google/genai";
import { QuizData, QuestionCategory } from "../types";

// Initialiseer AI direct met de omgevingsvariabele van Railway
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const QUIZ_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    title: { type: Type.STRING, description: 'De titel van het artikel.' },
    questions: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          id: { type: Type.STRING },
          category: { type: Type.STRING, enum: Object.values(QuestionCategory) },
          text: { type: Type.STRING },
          options: { type: Type.ARRAY, items: { type: Type.STRING } },
          correctAnswerIndex: { type: Type.NUMBER },
          explanation: { type: Type.STRING },
          isOpen: { type: Type.BOOLEAN }
        },
        required: ['id', 'category', 'text', 'isOpen']
      }
    }
  },
  required: ['title', 'questions']
};

export async function generateReadingQuiz(input: string | { data: string, mimeType: string }, isUrl: boolean = false): Promise<QuizData> {
  const prompt = `Je bent een meester in begrijpend lezen voor groep 6. Maak een leuke quiz over de tekst. 
  Maak 8 uitdagende meerkeuzevragen en 2 open vragen die aanzetten tot nadenken.
  Zorg dat de taal aansluit bij kinderen van 9-10 jaar.`;

  let contentParts: any[] = [{ text: prompt }];
  if (typeof input === 'string') {
    contentParts.push({ text: `HIER IS DE TEKST:\n\n${input}` });
  } else {
    contentParts.push({ 
      inlineData: { 
        data: input.data, 
        mimeType: input.mimeType 
      } 
    });
  }

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: { parts: contentParts },
    config: {
      responseMimeType: "application/json",
      responseSchema: QUIZ_SCHEMA
    }
  });

  const parsedResponse = JSON.parse(response.text);
  
  return {
    ...parsedResponse,
    fullText: typeof input === 'string' && !isUrl ? input : "Bekijk de brontekst op de website of je papier.",
    id: Math.random().toString(36).substr(2, 9),
    createdAt: Date.now()
  } as QuizData;
}
