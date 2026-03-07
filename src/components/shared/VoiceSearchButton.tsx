import { useState, useRef, useCallback } from 'react';
import { Mic, MicOff, Loader2 } from 'lucide-react';

interface VoiceSearchButtonProps {
  onResult: (text: string) => void;
  className?: string;
}

type VoiceState = 'idle' | 'listening' | 'error';

// Web Speech API types
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
}
interface SpeechRecognitionErrorEvent extends Event {
  error: string;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInstance;
    webkitSpeechRecognition: new () => SpeechRecognitionInstance;
  }
}

interface SpeechRecognitionInstance extends EventTarget {
  lang: string;
  interimResults: boolean;
  maxAlternatives: number;
  continuous: boolean;
  start(): void;
  stop(): void;
  onresult: ((e: SpeechRecognitionEvent) => void) | null;
  onerror: ((e: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
}

export default function VoiceSearchButton({ onResult, className = '' }: VoiceSearchButtonProps) {
  const [state, setState] = useState<VoiceState>('idle');
  const recognitionRef = useRef<SpeechRecognitionInstance | null>(null);

  const isSupported = typeof window !== 'undefined' &&
    ('SpeechRecognition' in window || 'webkitSpeechRecognition' in window);

  const startListening = useCallback(() => {
    if (!isSupported) return;

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();

    recognition.lang = navigator.language || 'en-US';
    recognition.interimResults = false;
    recognition.maxAlternatives = 1;
    recognition.continuous = false;

    recognition.onresult = (e: SpeechRecognitionEvent) => {
      const transcript = e.results[0]?.[0]?.transcript?.trim();
      if (transcript) onResult(transcript);
      setState('idle');
    };

    recognition.onerror = () => {
      setState('error');
      setTimeout(() => setState('idle'), 1500);
    };

    recognition.onend = () => {
      setState('idle');
    };

    recognitionRef.current = recognition;
    recognition.start();
    setState('listening');
  }, [isSupported, onResult]);

  const stopListening = useCallback(() => {
    recognitionRef.current?.stop();
    setState('idle');
  }, []);

  if (!isSupported) return null;

  return (
    <button
      type="button"
      onClick={state === 'listening' ? stopListening : startListening}
      title={state === 'listening' ? 'Stop recording' : 'Search by voice'}
      className={[
        'flex items-center justify-center w-10 h-10 rounded-xl transition-all',
        state === 'listening'
          ? 'bg-purple-600 text-white animate-pulse shadow-lg shadow-purple-500/30'
          : state === 'error'
          ? 'bg-red-500/20 text-red-400'
          : 'bg-white/5 hover:bg-white/10 text-gray-400 hover:text-purple-400',
        className,
      ].join(' ')}
    >
      {state === 'listening' ? (
        <MicOff className="w-4 h-4" />
      ) : state === 'error' ? (
        <Loader2 className="w-4 h-4" />
      ) : (
        <Mic className="w-4 h-4" />
      )}
    </button>
  );
}
