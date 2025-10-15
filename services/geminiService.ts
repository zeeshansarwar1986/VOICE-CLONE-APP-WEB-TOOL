
import { GoogleGenAI, Modality } from "@google/genai";

// Ensure the API key is handled by the environment.
const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  // In a real app, you might want to show this error in the UI.
  // For this example, we'll throw to make it clear during development.
  console.error("API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

/**
 * Generates speech from text using the Gemini TTS model.
 * @param text The text to convert to speech.
 * @param voiceName The pre-built voice to use.
 * @returns A promise that resolves to a base64 encoded audio string.
 */
export const generateSpeech = async (text: string, voiceName: string): Promise<string> => {
  if (!API_KEY) {
    throw new Error("Gemini API key is not configured.");
  }
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Say: ${text}` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: voiceName },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;

    if (!base64Audio) {
      throw new Error("No audio data received from the API.");
    }
    
    return base64Audio;
  } catch (error) {
    console.error("Error calling Gemini API:", error);
    throw new Error("Failed to communicate with the AI service.");
  }
};
