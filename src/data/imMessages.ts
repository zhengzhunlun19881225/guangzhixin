export type LocalIMMessage = { id: number; content: string; file?: string };
export type LocalIMMessages = Record<string, LocalIMMessage[]>;
const key = 'guangxin-im-messages';
export function loadIMMessages(): LocalIMMessages {
  try {
    const value = JSON.parse(localStorage.getItem(key) || '{}');
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    const result: LocalIMMessages = {};
    for (const [contactId, messages] of Object.entries(value)) {
      if (Array.isArray(messages) && messages.every(m => m && typeof m.id === 'number' && typeof m.content === 'string')) result[contactId] = messages;
    }
    return result;
  } catch { return {}; }
}
export function saveIMMessages(messages: LocalIMMessages) { localStorage.setItem(key, JSON.stringify(messages)); }
export function sendAnniversaryGreeting(content: string) {
  const messages = loadIMMessages();
  const contactId = 'chen-xiaoxiao';
  messages[contactId] = [...(messages[contactId] || []), { id: Date.now(), content }];
  saveIMMessages(messages);
  return contactId;
}
