import React, { useState } from 'react';
import { ChatMessage } from '../../types';
import { Play, Pause, Bot, User, CheckCheck, Ear } from 'lucide-react';
import { OrderCardInChat } from './OrderCardInChat';

interface ChatBubbleProps {
  message: ChatMessage;
  onConfirmOrder: (messageId: string) => void;
}

export const ChatBubble: React.FC<ChatBubbleProps> = ({ message, onConfirmOrder }) => {
  const [isPlaying, setIsPlaying] = useState(false);

  const isUser = message.sender === 'user';
  const isSystem = message.sender === 'system';

  const togglePlayAudio = () => {
    setIsPlaying(!isPlaying);
    // Auto reset after 3 seconds for simulation
    if (!isPlaying) {
      setTimeout(() => setIsPlaying(false), 3000);
    }
  };

  if (isSystem) {
    return (
      <div className="flex justify-center my-3">
        <div className="px-3 py-1.5 bg-slate-200 dark:bg-slate-800/80 text-slate-700 dark:text-slate-300 text-xs font-medium rounded-full border border-slate-300 dark:border-slate-700 max-w-sm text-center">
          {message.content}
        </div>
      </div>
    );
  }

  return (
    <div className={`flex gap-2.5 my-2.5 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
      {/* Avatar */}
      <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
        isUser
          ? 'bg-emerald-600 text-white'
          : 'bg-slate-800 text-emerald-400 border border-slate-700'
      }`}>
        {isUser ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
      </div>

      {/* Bubble Content */}
      <div className={`max-w-[85%] sm:max-w-md ${isUser ? 'items-end' : 'items-start'}`}>

        {/* Text Message */}
        {message.type === 'text' && (
          <div className={`p-3.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
            isUser
              ? 'bg-emerald-600 text-white rounded-tr-xs'
              : 'bg-white dark:bg-slate-800 text-slate-900 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-xs'
          }`}>
            <p className="whitespace-pre-line">{message.content}</p>
            <div className={`flex items-center gap-1 text-[10px] mt-1.5 ${isUser ? 'text-emerald-100 justify-end' : 'text-slate-400'}`}>
              <span>{message.timestamp}</span>
              {isUser && <CheckCheck className="w-3 h-3 text-emerald-200" />}
            </div>
          </div>
        )}

        {/* Voice Note */}
        {message.type === 'voice' && (
          <div className={`p-3.5 rounded-2xl shadow-xs ${
            isUser
              ? 'bg-emerald-700 text-white rounded-tr-xs'
              : 'bg-slate-800 text-slate-100 border border-slate-700 rounded-tl-xs'
          }`}>
            <div className="flex items-center gap-3">
              <button
                onClick={togglePlayAudio}
                className="w-9 h-9 rounded-full bg-white/20 hover:bg-white/30 flex items-center justify-center transition-colors shrink-0"
                aria-label="Play voice note"
              >
                {isPlaying ? <Pause className="w-4 h-4 fill-white text-white" /> : <Play className="w-4 h-4 fill-white text-white ml-0.5" />}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 mb-1">
                  {/* Waveform bars simulation */}
                  {[40, 70, 30, 90, 60, 100, 50, 80, 40, 60].map((h, i) => (
                    <span
                      key={i}
                      className={`w-1 rounded-full transition-all ${isPlaying ? 'bg-emerald-300 animate-pulse' : 'bg-white/50'}`}
                      style={{ height: `${(h * 16) / 100}px` }}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-between text-[11px] text-emerald-100/80">
                  <span>Voice Note</span>
                  <span>0:{message.voiceDuration ? (message.voiceDuration < 10 ? `0${message.voiceDuration}` : message.voiceDuration) : '08'}</span>
                </div>
              </div>
            </div>

            {/* AI Voice Transcription Feedback callout */}
            {message.transcription && (
              <div className="mt-3 p-2.5 bg-black/20 rounded-xl border border-white/10 text-xs">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-200 mb-1">
                  <Ear className="w-3.5 h-3.5" />
                  <span>AI Transcribed Text:</span>
                </div>
                <p className="italic text-emerald-50 dir-rtl font-arabic text-xs">
                  "{message.transcription}"
                </p>
              </div>
            )}

            <div className="flex items-center justify-end gap-1 text-[10px] text-emerald-200 mt-2">
              <span>{message.timestamp}</span>
              <CheckCheck className="w-3 h-3" />
            </div>
          </div>
        )}

        {/* Order Card */}
        {message.type === 'order_card' && message.orderDraft && (
          <OrderCardInChat
            messageId={message.id}
            items={message.orderDraft.items}
            totalAmount={message.orderDraft.totalAmount}
            deliveryAddress={message.orderDraft.deliveryAddress}
            confirmed={message.orderDraft.confirmed}
            language={message.language}
            onConfirmOrder={onConfirmOrder}
          />
        )}
      </div>
    </div>
  );
};
