import React, { useState, useRef, useEffect } from 'react';
import { Mic, Send, Trash2, StopCircle } from 'lucide-react';

interface VoiceRecorderProps {
  onSendVoice: (durationSeconds: number) => void;
  language: 'en' | 'ur' | 'ps';
}

export const VoiceRecorder: React.FC<VoiceRecorderProps> = ({ onSendVoice, language }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [recordingTime, setRecordingTime] = useState(0);
  const timerRef = useRef<any>(null);

  useEffect(() => {
    if (isRecording) {
      setRecordingTime(0);
      timerRef.current = setInterval(() => {
        setRecordingTime(prev => prev + 1);
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isRecording]);

  const handleStartRecording = () => {
    setIsRecording(true);
  };

  const handleStopAndSend = () => {
    const finalDuration = Math.max(2, recordingTime);
    setIsRecording(false);
    onSendVoice(finalDuration);
  };

  const handleCancel = () => {
    setIsRecording(false);
    setRecordingTime(0);
  };

  const labels = {
    en: { hold: 'Press & Hold to Record Voice Note', recording: 'Recording Voice Note...', slide: 'Slide / Tap Trash to cancel' },
    ur: { hold: 'آواز ریکارڈ کرنے کے لیے دبائیں', recording: 'وائس نوٹ ریکارڈ ہو رہا ہے...', slide: 'منسوخ کرنے کے لیے کوڑا دان دبائیں' },
    ps: { hold: 'د غږ ثبتولو لپاره کلک کړئ او ونیسئ', recording: 'د غږ ثبتول پیل شول...', slide: 'د منسوخولو لپاره ډسټبین ووهئ' }
  };

  const currentLabel = labels[language] || labels.en;

  if (isRecording) {
    return (
      <div className="flex items-center justify-between gap-3 p-3 bg-red-900/20 border border-red-500/40 rounded-2xl animate-pulse">
        <div className="flex items-center gap-3">
          <div className="w-3 h-3 bg-red-500 rounded-full animate-ping" />
          <span className="text-xs font-mono font-bold text-red-400">
            0:{recordingTime < 10 ? `0${recordingTime}` : recordingTime}
          </span>
          <span className="text-xs text-red-300 font-medium truncate hidden sm:inline">
            {currentLabel.recording}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleCancel}
            className="p-2.5 bg-slate-800 hover:bg-slate-700 text-red-400 rounded-xl transition-colors"
            title="Cancel Voice Note"
          >
            <Trash2 className="w-5 h-5" />
          </button>
          <button
            onClick={handleStopAndSend}
            className="flex items-center gap-1.5 px-4 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-bold text-xs shadow-lg"
          >
            <Send className="w-4 h-4" />
            <span>Send</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <button
      type="button"
      onClick={handleStartRecording}
      className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white rounded-xl font-semibold text-xs transition-all shadow-md shrink-0 active:scale-95"
      title={currentLabel.hold}
    >
      <Mic className="w-4 h-4" />
      <span className="hidden xs:inline">{currentLabel.hold}</span>
    </button>
  );
};
