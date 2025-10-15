export type Language = 'en' | 'ur' | 'ar';

export type ActiveTab = 'text-to-audio' | 'voice-cloning';

export interface VoiceOption {
  id: string;
  name: string;
  gender: 'Male' | 'Female';
}
