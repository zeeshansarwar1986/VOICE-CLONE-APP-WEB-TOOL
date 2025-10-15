import React, { useState, useRef, useEffect } from 'react';
import type { Language } from '../types';
import Loader from './Loader';
import { PlayIcon } from './icons/PlayIcon';
import { PauseIcon } from './icons/PauseIcon';
import { DownloadIcon } from './icons/DownloadIcon';

interface OutputPanelProps {
  language: Language;
  audioUrl: string | null;
  isLoading: boolean;
  error: string | null;
}

const translations = {
  en: {
    error: 'Error',
    audioOutput: 'Audio Output',
    generatedAudio: 'Your generated audio will appear here.',
  },
  ur: {
    error: 'خرابی',
    audioOutput: 'آڈیو آؤٹ پٹ',
    generatedAudio: 'آپ کا تیار کردہ آڈیو یہاں ظاہر ہوگا۔',
  },
  ar: {
    error: 'خطأ',
    audioOutput: 'إخراج الصوت',
    generatedAudio: 'سيظهر الصوت الذي تم إنشاؤه هنا.',
  },
};

const OutputPanel: React.FC<OutputPanelProps> = ({ language, audioUrl, isLoading, error }) => {
  const t = translations[language];
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const setAudioData = () => {
      setDuration(audio.duration);
      setCurrentTime(audio.currentTime);
    }
    const setAudioTime = () => setCurrentTime(audio.currentTime);

    audio.addEventListener('loadeddata', setAudioData);
    audio.addEventListener('timeupdate', setAudioTime);
    audio.addEventListener('ended', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('loadeddata', setAudioData);
      audio.removeEventListener('timeupdate', setAudioTime);
      audio.removeEventListener('ended', () => setIsPlaying(false));
    };
  }, [audioUrl]);
  
  const togglePlayPause = () => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const formatTime = (time: number) => {
    if (isNaN(time) || time === 0) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const onScrub = (value: string) => {
    if (audioRef.current) {
        audioRef.current.currentTime = Number(value);
        setCurrentTime(Number(value));
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <Loader language={language} />;
    }
    if (error) {
      return (
        <div className="text-center text-red-600">
          <h3 className="text-lg font-semibold">{t.error}</h3>
          <p>{error}</p>
        </div>
      );
    }
    if (audioUrl) {
      return (
        <div className="w-full max-w-md mx-auto bg-slate-100 rounded-xl p-6 shadow-lg space-y-4">
          <audio ref={audioRef} src={audioUrl} preload="metadata"></audio>
          <div className="flex items-center space-x-4 rtl:space-x-reverse">
            <button onClick={togglePlayPause} className="p-3 bg-indigo-600 text-white rounded-full hover:bg-indigo-500 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {isPlaying ? <PauseIcon className="w-6 h-6"/> : <PlayIcon className="w-6 h-6"/>}
            </button>
            <div className="flex-grow flex items-center space-x-2 rtl:space-x-reverse">
                <span className="text-xs w-10 text-slate-600">{formatTime(currentTime)}</span>
                <input
                  type="range"
                  value={currentTime}
                  step="1"
                  min="0"
                  max={duration}
                  className="w-full h-1 bg-slate-300 rounded-lg appearance-none cursor-pointer range-sm"
                  onChange={(e) => onScrub(e.target.value)}
                  style={{'--thumb-color': '#6366f1'} as React.CSSProperties}
                />
                <span className="text-xs w-10 text-slate-600">{formatTime(duration)}</span>
            </div>
             <a href={audioUrl} download="sarwar-voice-studio-output.wav" className="p-3 bg-slate-200 text-slate-700 rounded-full hover:bg-slate-300 transition-colors focus:outline-none focus:ring-2 focus:ring-indigo-500">
                <DownloadIcon className="w-6 h-6"/>
            </a>
          </div>
        </div>
      );
    }
    return (
      <div className="text-center text-slate-500">
        <h3 className="text-xl font-semibold mb-2">{t.audioOutput}</h3>
        <p>{t.generatedAudio}</p>
      </div>
    );
  };

  return (
    <div className="bg-white border border-slate-200 p-6 rounded-2xl shadow-lg flex items-center justify-center min-h-[300px] lg:h-full">
      {renderContent()}
    </div>
  );
};

export default OutputPanel;