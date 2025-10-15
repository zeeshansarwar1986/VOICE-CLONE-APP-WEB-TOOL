import React, { useState, useEffect, useCallback } from 'react';
import type { Language, VoiceOption, ActiveTab } from './types';
import { generateSpeech } from './services/geminiService';
import Header from './components/Header';
import ControlsPanel from './components/ControlsPanel';
import OutputPanel from './components/OutputPanel';

// Helper to write string to DataView
function writeString(view: DataView, offset: number, str: string) {
  for (let i = 0; i < str.length; i++) {
    view.setUint8(offset + i, str.charCodeAt(i));
  }
}

/**
 * Converts raw PCM audio data (from a base64 string) to a Blob with a WAV header.
 * @param base64Audio The base64 encoded string of raw PCM audio data.
 * @returns A Blob object representing a valid WAV file.
 */
function pcmToWavBlob(base64Audio: string): Blob {
  const binaryString = atob(base64Audio);
  const dataLength = binaryString.length;
  const pcmData = new Uint8Array(dataLength);
  for (let i = 0; i < dataLength; i++) {
    pcmData[i] = binaryString.charCodeAt(i);
  }

  const sampleRate = 24000; // Gemini TTS output is 24kHz
  const numChannels = 1;     // Mono
  const bitsPerSample = 16;  // 16-bit PCM

  const dataSize = pcmData.length;
  const blockAlign = numChannels * (bitsPerSample / 8);
  const byteRate = sampleRate * blockAlign;
  
  // Total buffer size is 44 bytes for the header + data size
  const bufferSize = 44 + dataSize;
  const buffer = new ArrayBuffer(bufferSize);
  const view = new DataView(buffer);

  // RIFF header (12 bytes)
  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true); // file-size - 8
  writeString(view, 8, 'WAVE');
  
  // fmt subchunk (24 bytes)
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);           // subchunk1Size (16 for PCM)
  view.setUint16(20, 1, true);            // audioFormat (1 for PCM)
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  
  // data subchunk (8 bytes + data)
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  // Write PCM data
  for (let i = 0; i < dataSize; i++) {
    view.setUint8(44 + i, pcmData[i]);
  }
  
  return new Blob([view], { type: 'audio/wav' });
}


const App: React.FC = () => {
  const [language, setLanguage] = useState<Language>('en');
  const [text, setText] = useState<string>('');
  const [activeTab, setActiveTab] = useState<ActiveTab>('text-to-audio');
  const [selectedVoice, setSelectedVoice] = useState<VoiceOption>({ id: 'Kore', name: 'Kore (Male)', gender: 'Male' });
  const [clonedFile, setClonedFile] = useState<File | null>(null);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === 'en' ? 'ltr' : 'rtl';
    document.body.className = `bg-slate-50 text-slate-800 ${language === 'en' ? 'font-sans' : 'font-urdu'}`;
  }, [language]);

  const handleGenerate = useCallback(async () => {
    const errorMessages = {
      en: {
        noText: 'Please enter some text to generate audio.',
        noCloneFile: 'Please upload a voice sample for cloning.',
        generationFailed: 'Failed to generate audio:',
      },
      ur: {
        noText: 'براہ کرم آڈیو بنانے کے لیے کچھ متن درج کریں۔',
        noCloneFile: 'براہ کرم کلوننگ کے لیے صوتی نمونہ اپ لوڈ کریں۔',
        generationFailed: 'آڈیو بنانے میں ناکام:',
      },
      ar: {
        noText: 'الرجاء إدخال بعض النصوص لإنشاء الصوت.',
        noCloneFile: 'يرجى تحميل عينة صوتية للاستنساخ.',
        generationFailed: 'فشل في إنشاء الصوت:',
      }
    };

    if (!text.trim()) {
      setError(errorMessages[language].noText);
      return;
    }
    if (activeTab === 'voice-cloning' && !clonedFile) {
      setError(errorMessages[language].noCloneFile);
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setAudioUrl(null);

    try {
      // Use a specific voice to simulate the cloned voice
      const voiceToUse = activeTab === 'voice-cloning' ? 'Zephyr' : selectedVoice.id;
      const base64Audio = await generateSpeech(text, voiceToUse);
      
      const audioBlob = pcmToWavBlob(base64Audio);
      const url = URL.createObjectURL(audioBlob);
      setAudioUrl(url);

    } catch (err) {
      console.error('Error generating speech:', err);
      const errorMessage = err instanceof Error ? err.message : 'An unknown error occurred.';
      setError(`${errorMessages[language].generationFailed} ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  }, [text, activeTab, clonedFile, selectedVoice, language]);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 p-4 sm:p-6 lg:p-8">
      <div className="max-w-7xl mx-auto">
        <Header language={language} setLanguage={setLanguage} />
        
        <main className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ControlsPanel
            language={language}
            text={text}
            setText={setText}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            selectedVoice={selectedVoice}
            setSelectedVoice={setSelectedVoice}
            clonedFile={clonedFile}
            setClonedFile={setClonedFile}
            onGenerate={handleGenerate}
            isLoading={isLoading}
          />
          <OutputPanel
            language={language}
            audioUrl={audioUrl}
            isLoading={isLoading}
            error={error}
          />
        </main>
      </div>
    </div>
  );
};

export default App;