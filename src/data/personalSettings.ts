import { AGENT_IMAGES, isAgentImage } from './agentImages';

export const TRAVEL_FIELDS = [
  { key: 'city', label: '常驻城市', options: ['广州', '深圳', '北京', '上海', '杭州', '成都', '香港'] },
  { key: 'trainTime', label: '火车时间偏好', options: ['不限', '上午 06:00–12:00', '下午 12:00–18:00', '晚上 18:00–24:00'] },
  { key: 'flightTime', label: '飞机时间偏好', options: ['不限', '上午 06:00–12:00', '下午 12:00–18:00', '晚上 18:00–24:00'] },
  { key: 'airline', label: '航司偏好', options: ['不限', '中国南方航空', '中国国际航空', '中国东方航空', '海南航空', '深圳航空'] },
  { key: 'aircraft', label: '机型偏好', options: ['不限', '宽体客机', '窄体客机'] },
  { key: 'hotelBrand', label: '品牌偏好', options: ['不限', '希尔顿', '万豪', '洲际', '华住', '锦江'] },
  { key: 'hotelLevel', label: '酒店级别', options: ['不限', '经济型', '舒适型', '高档型', '豪华型'] },
  { key: 'facilities', label: '酒店设施', options: ['不限', '健身房', '会议室', '洗衣房', '停车场'] },
  { key: 'breakfast', label: '早餐', options: ['不限', '含早餐', '无需早餐'] },
] as const;
export type TravelKey = typeof TRAVEL_FIELDS[number]['key'];
export type TravelPreferences = Record<TravelKey, string>;
export const TRAVEL_STORAGE_KEY = 'guangxin-travel-preferences';
export function readTravelPreferences(): TravelPreferences {
  let saved: Record<string, unknown> = {};
  try { saved = JSON.parse(localStorage.getItem(TRAVEL_STORAGE_KEY) || '{}') || {}; } catch { /* Invalid data starts a clean draft. */ }
  return Object.fromEntries(TRAVEL_FIELDS.map(field => [field.key, (saved[field.key] === '' || (field.options as readonly string[]).includes(saved[field.key] as string)) ? saved[field.key] : field.key === 'city' ? '广州' : ''])) as TravelPreferences;
}

export const AGENT_ICONS = ['bot', 'sparkles', 'book', 'chart', 'shield', 'briefcase'] as const;
export const AGENT_CATEGORIES = ['默认', '法务', '财务', '人力', '办公', '数据分析'];
export const AGENT_MODELS = ['qwen3-vl-32b', 'qwen3-8b', 'qwen3-32b'];
export const AGENT_PERMISSIONS = ['个人', '组织', '通用'];
export type CustomAgent = {
  id: string; name: string; intro: string; welcome: string; questions: string[];
  category: string; model: string; permission: string; description: string;
  icon: typeof AGENT_ICONS[number]; avatarImage?: string; updatedAt: string;
};
export const AGENT_STORAGE_KEY = 'guangxin-custom-agents';
export function blankAgent(): CustomAgent {
  return { id: '', name: '', intro: '', welcome: '', questions: [''], category: '默认', model: AGENT_MODELS[0], permission: '个人', description: '', icon: 'bot', avatarImage: AGENT_IMAGES[0].src, updatedAt: '' };
}
export function readCustomAgents(): CustomAgent[] {
  try {
    const data: unknown = JSON.parse(localStorage.getItem(AGENT_STORAGE_KEY) || '[]');
    if (!Array.isArray(data)) return [];
    return data.filter((agent): agent is CustomAgent => agent && typeof agent.id === 'string' && agent.id.length > 0
      && typeof agent.name === 'string' && agent.name.trim().length > 0 && agent.name.length <= 10
      && typeof agent.intro === 'string' && agent.intro.length <= 20 && typeof agent.welcome === 'string' && agent.welcome.length <= 1000
      && typeof agent.description === 'string' && agent.description.length <= 1000
      && Array.isArray(agent.questions) && agent.questions.length <= 5 && agent.questions.every((q: unknown) => typeof q === 'string' && q.length <= 30)
      && AGENT_CATEGORIES.includes(agent.category) && AGENT_MODELS.includes(agent.model) && AGENT_PERMISSIONS.includes(agent.permission)
      && AGENT_ICONS.includes(agent.icon) && (agent.avatarImage === undefined || isAgentImage(agent.avatarImage)) && typeof agent.updatedAt === 'string');
  } catch { return []; }
}
