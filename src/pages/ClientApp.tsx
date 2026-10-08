import React, { useState, useEffect, useRef } from 'react';
import { RouteGuard } from '../components/common/RouteGuard';
import { useAuth } from '../context/AuthContext';
import { ClientNavbar } from '../components/client/ClientNavbar';
import { ClientBottomNav, ClientTab } from '../components/client/ClientBottomNav';
import { ChatBubble } from '../components/client/ChatBubble';
import { VoiceRecorder } from '../components/client/VoiceRecorder';
import { MyOrdersView } from '../components/client/MyOrdersView';
import { MyAccountView } from '../components/client/MyAccountView';
import { QuickReorderView } from '../components/client/QuickReorderView';
import { ChatMessage } from '../types';
import { getChatHistoryApi, sendTextMessageApi, processVoiceNoteApi, confirmOrderDraftApi } from '../api/chat';
import { PWAOfflineIndicator } from '../components/common/PWAOfflineIndicator';
import { Send, Sparkles, MessageSquare, Mic } from 'lucide-react';

export const ClientApp: React.FC = () => {
  const { user, language } = useAuth();
  const [activeTab, setActiveTab] = useState<ClientTab>('chat');

  // Chat State
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchChat = async () => {
    try {
      const history = await getChatHistoryApi();
      setMessages(history);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchChat();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendText = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || isSending) return;

    const query = inputText;
    setInputText('');
    setIsSending(true);

    try {
      const updated = await sendTextMessageApi(query, language, user?.clientId, user?.name);
      setMessages([...updated]);
    } catch (err: any) {
      alert(err.message || 'Failed to process chat message');
    } finally {
      setIsSending(false);
    }
  };

  const handleSendVoice = async (durationSeconds: number) => {
    setIsSending(true);
    try {
      const updated = await processVoiceNoteApi(durationSeconds, language, user?.clientId, user?.name);
      setMessages([...updated]);
    } catch (err: any) {
      alert(err.message || 'Failed to process voice note');
    } finally {
      setIsSending(false);
    }
  };

  const handleConfirmOrderDraft = async (messageId: string) => {
    try {
      const result = await confirmOrderDraftApi(messageId, user?.clientId || 'cli-1');
      setMessages([...result.messages]);
    } catch (err: any) {
      alert(err.message || 'Failed to confirm order draft');
    }
  };

  const quickPrompts = {
    ps: ['۲ بوری باسطي وريجې پکار دي', 'د اوړو نوې بيې څه دي؟', 'زما سابق حساب کتاب وښایاست'],
    ur: ['۵ کارٹن چائے اور ۲ بوری چینی بھیجیں', 'میرے موجودہ واجبات کتنے ہیں؟', 'پچھلا آرڈر دوبارہ بھیج دیں'],
    en: ['Order 10 bags of Wheat Flour 20kg', 'Show my total outstanding dues', 'Reorder last week supplies']
  };

  const prompts = quickPrompts[language] || quickPrompts.en;

  return (
    <RouteGuard requiredRole="client">
      <div className="min-h-screen bg-[#F7F5F2] text-[#171717] flex flex-col font-sans">
        <ClientNavbar />

        {/* Tab 1: WhatsApp-Style AI Chat */}
        {activeTab === 'chat' && (
          <main className="flex-1 max-w-md w-full mx-auto flex flex-col pb-36 px-3 pt-3">
            {/* Quick Prompts Suggestions */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-2 scrollbar-none mb-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-amber-400" />
                Quick:
              </span>
              {prompts.map((p, idx) => (
                <button
                  key={idx}
                  onClick={() => setInputText(p)}
                  className="px-2.5 py-1 bg-slate-900 hover:bg-slate-800 text-slate-300 border border-slate-800 rounded-xl text-xs whitespace-nowrap shrink-0 transition-colors"
                >
                  {p}
                </button>
              ))}
            </div>

            {/* Chat Bubbles List */}
            <div className="flex-1 space-y-1 overflow-y-auto">
              {messages.map(msg => (
                <ChatBubble
                  key={msg.id}
                  message={msg}
                  onConfirmOrder={handleConfirmOrderDraft}
                />
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Sticky Chat Input Bar */}
            <div className="fixed bottom-16 inset-x-0 z-30 bg-slate-900/95 border-t border-slate-800 p-2.5 backdrop-blur-md">
              <div className="max-w-md mx-auto flex items-center gap-2">
                <form onSubmit={handleSendText} className="flex-1 flex items-center gap-2">
                  <input
                    type="text"
                    value={inputText}
                    onChange={e => setInputText(e.target.value)}
                    placeholder={
                      language === 'ps'
                        ? 'پېغام ولیکئ یا غږ وسپارئ...'
                        : language === 'ur'
                        ? 'پیغام لکھیں یا وائس نوٹ بھیجیں...'
                        : 'Type supply order or ask AI...'
                    }
                    className="flex-1 px-3.5 py-2.5 bg-slate-950 border border-slate-800 focus:border-emerald-500 rounded-xl text-xs text-white placeholder:text-slate-500 outline-none"
                  />

                  <button
                    type="submit"
                    disabled={!inputText.trim() || isSending}
                    className="p-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white rounded-xl transition-all shadow-md shrink-0"
                  >
                    <Send className="w-4 h-4" />
                  </button>
                </form>

                {/* Voice Recorder Component */}
                <VoiceRecorder onSendVoice={handleSendVoice} language={language} />
              </div>
            </div>
          </main>
        )}

        {/* Tab 2: My Orders */}
        {activeTab === 'orders' && <MyOrdersView clientId={user?.clientId || 'cli-1'} language={language} />}

        {/* Tab 3: My Account / Dues Ledger */}
        {activeTab === 'account' && <MyAccountView clientId={user?.clientId || 'cli-1'} />}

        {/* Tab 4: 1-Tap Reorder */}
        {activeTab === 'reorder' && <QuickReorderView clientId={user?.clientId || 'cli-1'} />}

        <ClientBottomNav activeTab={activeTab} setActiveTab={setActiveTab} language={language} />
        <PWAOfflineIndicator />
      </div>
    </RouteGuard>
  );
};
