import React, { useState } from 'react';
import type { Language, ActiveTab, VoiceOption } from '../types';
import { UploadIcon } from './icons/UploadIcon';

interface ControlsPanelProps {
  language: Language;
  text: string;
  setText: (text: string) => void;
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  selectedVoice: VoiceOption;
  setSelectedVoice: (voice: VoiceOption) => void;
  clonedFile: File | null;
  setClonedFile: (file: File | null) => void;
  onGenerate: () => void;
  isLoading: boolean;
}

const voices: VoiceOption[] = [
    { id: 'Kore', name: 'Kore', gender: 'Male' },
    { id: 'Puck', name: 'Puck', gender: 'Male' },
    { id: 'Fenrir', name: 'Fenrir', gender: 'Male' },
    { id: 'Charon', name: 'Charon', gender: 'Female' },
    { id: 'Zephyr', name: 'Zephyr', gender: 'Female' },
];

const translations = {
    en: {
        textToAudio: 'Text-to-Audio',
        voiceCloning: 'Voice Cloning',
        enterText: 'Enter Text',
        placeholder: 'Write your text here...',
        selectVoice: 'Select Voice',
        male: 'Male',
        female: 'Female',
        multilingualNote: 'Note: These AI voices can speak English, Urdu, and Arabic based on the text you provide.',
        uploadSample: 'Upload Voice Sample',
        selectFile: 'Select a file or drag here',
        fileTypes: 'MP3, WAV (Max 10MB)',
        consent: 'I confirm this is my own voice and I consent to its cloning.',
        generate: 'Generate Audio',
        generating: 'Generating...',
        invalidFileType: 'Invalid file type. Please upload MP3 or WAV.',
        fileTooLarge: 'File is too large. Max size is 10MB.',
    },
    ur: {
        textToAudio: 'ٹیکسٹ سے آڈیو',
        voiceCloning: 'آواز کی کلوننگ',
        enterText: 'متن درج کریں',
        placeholder: 'یہاں اپنا متن لکھیں...',
        selectVoice: 'آواز منتخب کریں',
        male: 'مرد',
        female: 'عورت',
        multilingualNote: 'نوٹ: یہ AI آوازیں آپ کے فراہم کردہ متن کی بنیاد پر انگریزی، اردو اور عربی بول سکتی ہیں۔',
        uploadSample: 'آواز کا نمونہ اپ لوڈ کریں',
        selectFile: 'فائل منتخب کریں یا یہاں ڈریگ کریں',
        fileTypes: 'MP3, WAV (زیادہ سے زیادہ 10MB)',
        consent: 'میں تصدیق کرتا/کرتی ہوں کہ یہ میری اپنی آواز ہے اور میں اسے کلون کرنے کی اجازت دیتا/دیتی ہوں۔',
        generate: 'آڈیو بنائیں',
        generating: 'تیار کیا جا رہا ہے...',
        invalidFileType: 'غلط فائل کی قسم۔ براہ کرم MP3 یا WAV اپ لوڈ کریں۔',
        fileTooLarge: 'فائل بہت بڑی ہے۔ زیادہ سے زیادہ سائز 10MB ہے۔',
    },
    ar: {
        textToAudio: 'نص إلى صوت',
        voiceCloning: 'استنساخ الصوت',
        enterText: 'أدخل النص',
        placeholder: 'اكتب نصك هنا...',
        selectVoice: 'اختر الصوت',
        male: 'ذكر',
        female: 'أنثى',
        multilingualNote: 'ملاحظة: يمكن لهذه الأصوات الذكية التحدث باللغة الإنجليزية والأردية والعربية بناءً على النص الذي تقدمه.',
        uploadSample: 'تحميل عينة صوتية',
        selectFile: 'اختر ملفًا أو اسحبه هنا',
        fileTypes: 'MP3, WAV (الحد الأقصى 10 ميجابايت)',
        consent: 'أؤكد أن هذا هو صوتي وأوافق على استنساخه.',
        generate: 'إنشاء الصوت',
        generating: 'جاري الإنشاء...',
        invalidFileType: 'نوع الملف غير صالح. يرجى تحميل MP3 أو WAV.',
        fileTooLarge: 'حجم الملف كبير جدًا. الحجم الأقصى هو 10 ميجابايت.',
    }
};


const ControlsPanel: React.FC<ControlsPanelProps> = ({
  language,
  text,
  setText,
  activeTab,
  setActiveTab,
  selectedVoice,
  setSelectedVoice,
  clonedFile,
  setClonedFile,
  onGenerate,
  isLoading,
}) => {
  const t = translations[language];
  const [fileError, setFileError] = useState<string | null>(null);
  const [consentChecked, setConsentChecked] = useState<boolean>(false);

  const tabCommonClasses = "w-full py-3 text-center text-sm sm:text-base font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 focus:ring-offset-white";
  const tabActiveClass = "text-white bg-indigo-600";
  const tabInactiveClass = "text-slate-600 bg-slate-100 hover:bg-slate-200";

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    setFileError(null);
    setClonedFile(null);

    if (!file) {
      return;
    }

    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    const ALLOWED_TYPES = ['audio/mpeg', 'audio/wav', 'audio/x-wav'];

    if (!ALLOWED_TYPES.includes(file.type)) {
      setFileError(t.invalidFileType);
      return;
    }

    if (file.size > MAX_SIZE) {
      setFileError(t.fileTooLarge);
      return;
    }

    setClonedFile(file);
  };

  const isGenerateDisabled = isLoading || 
    (activeTab === 'voice-cloning' && (!clonedFile || !consentChecked || !!fileError));

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-lg space-y-6 flex flex-col h-full">
      <div className="flex rounded-lg overflow-hidden border border-slate-300">
        <button onClick={() => setActiveTab('text-to-audio')} className={`${tabCommonClasses} rounded-l-md rtl:rounded-r-md rtl:rounded-l-none ${activeTab === 'text-to-audio' ? tabActiveClass : tabInactiveClass}`}>
          {t.textToAudio}
        </button>
        <button onClick={() => setActiveTab('voice-cloning')} className={`${tabCommonClasses} rounded-r-md rtl:rounded-l-md rtl:rounded-r-none ${activeTab === 'voice-cloning' ? tabActiveClass : tabInactiveClass}`}>
          {t.voiceCloning}
        </button>
      </div>

      <div className="flex-grow">
        <label htmlFor="text-input" className="block text-lg font-medium mb-2 text-slate-800">{t.enterText}</label>
        <textarea
          id="text-input"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder={t.placeholder}
          className="w-full h-40 p-4 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
        />
      </div>

      {activeTab === 'text-to-audio' ? (
        <div>
          <label htmlFor="voice-select" className="block text-lg font-medium mb-2 text-slate-800">{t.selectVoice}</label>
          <select
            id="voice-select"
            value={selectedVoice.id}
            onChange={(e) => {
                const voice = voices.find(v => v.id === e.target.value);
                if (voice) setSelectedVoice(voice);
            }}
            className="w-full p-3 bg-white border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {voices.map(voice => (
              <option key={voice.id} value={voice.id}>{`${voice.name} (${voice.gender === 'Male' ? t.male : t.female})`}</option>
            ))}
          </select>
           <p className="mt-2 text-xs text-slate-500">{t.multilingualNote}</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div>
            <label className="block text-lg font-medium mb-2 text-slate-800">{t.uploadSample}</label>
            <label htmlFor="file-upload" className={`cursor-pointer flex items-center justify-center w-full px-4 py-6 bg-slate-50 border-2 border-dashed rounded-lg transition-colors ${fileError ? 'border-red-500' : 'border-slate-300 hover:border-indigo-500'}`}>
              <div className="text-center">
                <UploadIcon className="mx-auto h-10 w-10 text-slate-400" />
                <p className="mt-2 text-sm text-slate-500">
                  {clonedFile ? clonedFile.name : t.selectFile}
                </p>
                <p className="text-xs text-slate-400">{t.fileTypes}</p>
              </div>
              <input id="file-upload" type="file" className="hidden" accept=".mp3,.wav" onChange={handleFileChange} />
            </label>
            {fileError && <p className="mt-2 text-sm text-red-500">{fileError}</p>}
          </div>
          <div className="flex items-start">
            <input 
              id="consent" 
              type="checkbox" 
              checked={consentChecked}
              onChange={(e) => setConsentChecked(e.target.checked)}
              className="h-4 w-4 mt-1 text-indigo-600 bg-slate-100 border-slate-400 rounded focus:ring-indigo-500" 
            />
            <label htmlFor="consent" className="ms-3 rtl:me-3 text-sm text-slate-600">
              {t.consent}
            </label>
          </div>
        </div>
      )}

      <button
        onClick={onGenerate}
        disabled={isGenerateDisabled}
        className="w-full py-4 text-lg font-bold text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 transition-all duration-300 disabled:bg-slate-400 disabled:cursor-not-allowed flex items-center justify-center shadow-lg transform hover:scale-105"
      >
        {isLoading ? (
          <>
            <svg className="animate-spin -ms-1 rtl:-me-1 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <span className="ms-3 rtl:me-3">{t.generating}</span>
          </>
        ) : (
          t.generate
        )}
      </button>
    </div>
  );
};

export default ControlsPanel;