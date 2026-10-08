import { ChatMessage, Language, OrderItem } from '../types';
import { getStored, setStored, KEYS } from './storageHelper';
import { INITIAL_CHAT_MESSAGES, INITIAL_PRODUCTS } from './mockData';
import { createOrderApi } from './orders';
import { logAIActivityApi } from './reports';

export const getChatHistoryApi = async (): Promise<ChatMessage[]> => {
  await new Promise(res => setTimeout(res, 200));
  return getStored<ChatMessage[]>(KEYS.CHAT, INITIAL_CHAT_MESSAGES);
};

export const sendTextMessageApi = async (
  content: string,
  language: Language = 'en',
  clientId: string = 'cli-1',
  clientName: string = 'Khan Muhammad'
): Promise<ChatMessage[]> => {
  await new Promise(res => setTimeout(res, 400));
  const messages = getStored<ChatMessage[]>(KEYS.CHAT, INITIAL_CHAT_MESSAGES);

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Add User Message
  const userMsg: ChatMessage = {
    id: `msg-${Date.now()}`,
    sender: 'user',
    type: 'text',
    content,
    timestamp: timeStr,
    language
  };
  messages.push(userMsg);

  // Parse items from user input or generate smart order draft
  const products = getStored(KEYS.PRODUCTS, INITIAL_PRODUCTS);

  // Simple smart matcher for demonstration
  const lower = content.toLowerCase();
  let draftItems: OrderItem[] = [];

  if (lower.includes('rice') || lower.includes('چاول') || lower.includes('وريجې')) {
    const p = products.find(prod => prod.id === 'prod-1') || products[0];
    const qty = parseInt(content.match(/\d+/)?.[0] || '2');
    draftItems.push({
      productId: p.id,
      productName: p.name,
      quantity: qty,
      unit: p.unit,
      unitPrice: p.wholesalePrice,
      unitCost: p.costPrice,
      totalPrice: p.wholesalePrice * qty
    });
  }

  if (lower.includes('oil') || lower.includes('ائل') || lower.includes('تیل')) {
    const p = products.find(prod => prod.id === 'prod-3') || products[2];
    const qty = parseInt(content.match(/\d+/)?.[0] || '2');
    draftItems.push({
      productId: p.id,
      productName: p.name,
      quantity: qty,
      unit: p.unit,
      unitPrice: p.wholesalePrice,
      unitCost: p.costPrice,
      totalPrice: p.wholesalePrice * qty
    });
  }

  if (lower.includes('flour') || lower.includes('آٹا') || lower.includes('اوړه')) {
    const p = products.find(prod => prod.id === 'prod-2') || products[1];
    const qty = parseInt(content.match(/\d+/)?.[0] || '5');
    draftItems.push({
      productId: p.id,
      productName: p.name,
      quantity: qty,
      unit: p.unit,
      unitPrice: p.wholesalePrice,
      unitCost: p.costPrice,
      totalPrice: p.wholesalePrice * qty
    });
  }

  if (lower.includes('tea') || lower.includes('ٹی') || lower.includes('چاى')) {
    const p = products.find(prod => prod.id === 'prod-5') || products[4];
    const qty = parseInt(content.match(/\d+/)?.[0] || '1');
    draftItems.push({
      productId: p.id,
      productName: p.name,
      quantity: qty,
      unit: p.unit,
      unitPrice: p.wholesalePrice,
      unitCost: p.costPrice,
      totalPrice: p.wholesalePrice * qty
    });
  }

  // Fallback if no specific keyword matched
  if (draftItems.length === 0) {
    const p1 = products[0];
    const p2 = products[1];
    draftItems = [
      {
        productId: p1.id,
        productName: p1.name,
        quantity: 2,
        unit: p1.unit,
        unitPrice: p1.wholesalePrice,
        unitCost: p1.costPrice,
        totalPrice: p1.wholesalePrice * 2
      },
      {
        productId: p2.id,
        productName: p2.name,
        quantity: 5,
        unit: p2.unit,
        unitPrice: p2.wholesalePrice,
        unitCost: p2.costPrice,
        totalPrice: p2.wholesalePrice * 5
      }
    ];
  }

  const totalAmount = draftItems.reduce((acc, i) => acc + i.totalPrice, 0);

  // Multilingual response texts
  let replyText = '';
  if (language === 'ps') {
    replyText = `ما ستاسو غوښتنه وسنجوله. ما ستاسو لپاره آرډر تیار کړی دی:`;
  } else if (language === 'ur') {
    replyText = `میں نے آپ کے آرڈر کی تفصیلات تیار کر لی ہیں۔ براہ کرم نیچے تصدیق کریں:`;
  } else {
    replyText = `I have drafted your order based on your message. Please review and confirm below:`;
  }

  const aiReplyMsg: ChatMessage = {
    id: `msg-${Date.now() + 1}`,
    sender: 'ai',
    type: 'text',
    content: replyText,
    timestamp: timeStr,
    language
  };
  messages.push(aiReplyMsg);

  const orderCardMsg: ChatMessage = {
    id: `msg-${Date.now() + 2}`,
    sender: 'ai',
    type: 'order_card',
    content: 'Draft Order',
    orderDraft: {
      items: draftItems,
      totalAmount,
      deliveryAddress: 'Main Market Store Location',
      confirmed: false
    },
    timestamp: timeStr,
    language
  };
  messages.push(orderCardMsg);

  setStored(KEYS.CHAT, messages);

  // Log to AI activity
  await logAIActivityApi(
    'Text Chat Order Processing',
    clientName,
    'client',
    `Text order parsed (${language.toUpperCase()}): ${content}. Total: PKR ${totalAmount.toLocaleString()}`,
    language
  );

  return messages;
};

export const processVoiceNoteApi = async (
  durationSeconds: number,
  language: Language = 'en',
  clientId: string = 'cli-1',
  clientName: string = 'Khan Muhammad'
): Promise<ChatMessage[]> => {
  await new Promise(res => setTimeout(res, 600)); // Simulate audio transcription
  const messages = getStored<ChatMessage[]>(KEYS.CHAT, INITIAL_CHAT_MESSAGES);
  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  let transcription = '';
  if (language === 'ps') {
    transcription = 'زه ۵ بوری فلور آټا او ۲ کارټن چای پکار لرم، مهربانی وکړئ بیړه وکړئ.';
  } else if (language === 'ur') {
    transcription = 'مجھے ۵ بوری آٹا اور ۲ کارٹن چائے بھیج دیں، شکریا۔';
  } else {
    transcription = 'Please send 5 bags of Wheat Flour and 2 cartons of Kenya Tea to my shop.';
  }

  // 1. User Voice Message
  const voiceMsg: ChatMessage = {
    id: `msg-${Date.now()}`,
    sender: 'user',
    type: 'voice',
    content: `🎤 Voice Note (0:${durationSeconds < 10 ? '0' : ''}${durationSeconds}s)`,
    voiceDuration: durationSeconds,
    transcription,
    timestamp: timeStr,
    language
  };
  messages.push(voiceMsg);

  // 2. AI Understanding Confirmation Text
  let aiConfirmText = '';
  if (language === 'ps') {
    aiConfirmText = `ما ستاسو غږ اورېدلی او سم پوه شوم: "${transcription}"\nلاندې د ستاسو د آرډر کارت وګورئ:`;
  } else if (language === 'ur') {
    aiConfirmText = `میں نے آپ کا وائس نوٹ سن لیا ہے: "${transcription}"\nآپ کا آرڈر تیار ہے، براہ کرم تصدیق کریں:`;
  } else {
    aiConfirmText = `I transcribed your voice note: "${transcription}"\nHere is your generated order card:`;
  }

  const aiConfirmMsg: ChatMessage = {
    id: `msg-${Date.now() + 1}`,
    sender: 'ai',
    type: 'text',
    content: aiConfirmText,
    timestamp: timeStr,
    language
  };
  messages.push(aiConfirmMsg);

  // 3. Draft Order Card
  const products = getStored(KEYS.PRODUCTS, INITIAL_PRODUCTS);
  const pFlour = products.find(p => p.id === 'prod-2') || products[1];
  const pTea = products.find(p => p.id === 'prod-5') || products[4];

  const draftItems: OrderItem[] = [
    {
      productId: pFlour.id,
      productName: pFlour.name,
      quantity: 5,
      unit: pFlour.unit,
      unitPrice: pFlour.wholesalePrice,
      unitCost: pFlour.costPrice,
      totalPrice: pFlour.wholesalePrice * 5
    },
    {
      productId: pTea.id,
      productName: pTea.name,
      quantity: 2,
      unit: pTea.unit,
      unitPrice: pTea.wholesalePrice,
      unitCost: pTea.costPrice,
      totalPrice: pTea.wholesalePrice * 2
    }
  ];

  const totalAmount = draftItems.reduce((acc, i) => acc + i.totalPrice, 0);

  const orderCardMsg: ChatMessage = {
    id: `msg-${Date.now() + 2}`,
    sender: 'ai',
    type: 'order_card',
    content: 'Voice Draft Order',
    orderDraft: {
      items: draftItems,
      totalAmount,
      deliveryAddress: 'Client Shop Address',
      confirmed: false
    },
    timestamp: timeStr,
    language
  };
  messages.push(orderCardMsg);

  setStored(KEYS.CHAT, messages);

  // Log AI Voice Activity
  await logAIActivityApi(
    'Voice Note AI Transcription',
    clientName,
    'client',
    `Voice note (${durationSeconds}s, ${language.toUpperCase()}) transcribed as: "${transcription}". Created draft order worth PKR ${totalAmount.toLocaleString()}`,
    language
  );

  return messages;
};

export const confirmOrderDraftApi = async (
  messageId: string,
  clientId: string
): Promise<{ messages: ChatMessage[]; createdOrder: any }> => {
  await new Promise(res => setTimeout(res, 300));
  const messages = getStored<ChatMessage[]>(KEYS.CHAT, INITIAL_CHAT_MESSAGES);
  const msgIndex = messages.findIndex(m => m.id === messageId);
  if (msgIndex === -1 || !messages[msgIndex].orderDraft) {
    throw new Error('Order draft message not found');
  }

  const draft = messages[msgIndex].orderDraft!;
  draft.confirmed = true;

  // Create real order in database
  const createdOrder = await createOrderApi(
    clientId,
    draft.items.map(i => ({ productId: i.productId, quantity: i.quantity })),
    draft.deliveryAddress
  );

  draft.id = createdOrder.id;

  const timeStr = new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  // Add system confirmation message in chat
  messages.push({
    id: `msg-${Date.now()}`,
    sender: 'system',
    type: 'text',
    content: `✅ Order #${createdOrder.orderNumber} confirmed successfully! Total: PKR ${createdOrder.totalAmount.toLocaleString()}. Status: Placed.`,
    timestamp: timeStr
  });

  setStored(KEYS.CHAT, messages);

  return { messages, createdOrder };
};
