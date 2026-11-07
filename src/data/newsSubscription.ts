import type { PortalNewsItem } from './portalNews';

export const subscriptionKey = 'gx-news-subscription-v1';
export const subscriptionOptions = {
  industries: ['人工智能', '制造业', '新材料', '国际贸易', '金融投资', '新能源', '现代服务业', '其他'],
  topics: ['企业数字化', '供应链', '产业投资', '绿色低碳', '产业协同', '科技创新', '市场动态', '风险管理'],
  regions: ['全国', '广东', '长三角', '京津冀', '东南亚', '欧洲', '北美', '全球'],
  contentTypes: ['行业新闻', '政策解读', '研究报告', '企业动态', '深度分析'],
  sources: ['官方媒体', '行业媒体', '政府网站', '研究机构', '企业官网'],
};
export type ChoiceKey = keyof typeof subscriptionOptions;
export type NewsSubscription = Record<ChoiceKey, string[]> & {
  keywords: string; related: string; blockedKeywords: string; blockedSources: string;
  personalized: boolean; frequency: string; reminder: string; important: boolean;
};
export const defaultSubscription = (): NewsSubscription => ({
  industries: ['人工智能', '制造业'], topics: ['企业数字化', '产业协同'],
  keywords: '广新集团, AIGC', regions: ['全国', '广东'],
  contentTypes: ['行业新闻', '政策解读', '企业动态'], sources: ['官方媒体', '行业媒体', '政府网站'],
  related: '', blockedKeywords: '', blockedSources: '', personalized: true,
  frequency: '每日更新', reminder: '仅页面展示', important: false,
});
export function readSubscription(): NewsSubscription | null {
  try {
    const value = JSON.parse(localStorage.getItem(subscriptionKey) || 'null');
    if (!value || typeof value !== 'object') return null;
    const defaults = defaultSubscription();
    const result = { ...defaults };
    for (const key of Object.keys(defaults) as (keyof NewsSubscription)[]) {
      if (key in subscriptionOptions) {
        const k = key as ChoiceKey;
        if (!Array.isArray(value[k])) return null;
        result[k] = value[k].filter((v: unknown) => typeof v === 'string' && subscriptionOptions[k].includes(v));
      } else if (typeof value[key] !== typeof defaults[key]) return null;
      else Object.assign(result, { [key]: value[key] });
    }
    if (!result.industries.length || !result.topics.length) return null;
    if (!['每日更新', '每周更新', '实时更新'].includes(result.frequency)) result.frequency = defaults.frequency;
    result.reminder = defaults.reminder;
    return result;
  } catch { return null; }
}
export const splitKeywords = (text: string) => text.split(/[,，、;；\n]+/).map(s => s.trim()).filter(Boolean);

// Local sample metadata used to preview subscription matching; no external feed is connected.
const industryTags = [['制造业','现代服务业'],['制造业','现代服务业'],['新材料','制造业'],['国际贸易','制造业'],['人工智能','现代服务业'],['人工智能'],['新材料','制造业'],['制造业','现代服务业'],['现代服务业'],['新能源','制造业'],['人工智能'],['现代服务业']];
const topicTags = [['企业数字化','产业协同'],['企业数字化'],['绿色低碳','科技创新'],['供应链','产业协同'],['企业数字化','风险管理'],['企业数字化','科技创新'],['科技创新','产业协同'],['企业数字化','产业投资'],['企业数字化'],['绿色低碳','市场动态'],['风险管理','科技创新'],['企业数字化','风险管理']];
export function subscriptionMatches(news: PortalNewsItem, settings: NewsSubscription): boolean {
  const index = Number(news.id.split('-')[1]);
  const text = `${news.title} ${news.body} 广新集团 ${news.source}`.toLowerCase();
  const intersects = (selected: string[], values: string[]) => !selected.length || selected.some(s => values.includes(s));
  const includes = (keywords: string) => splitKeywords(keywords).some(k => text.includes(k.toLowerCase()));
  return intersects(settings.industries, industryTags[index] || [])
    && intersects(settings.topics, topicTags[index] || [])
    && (!settings.keywords.trim() || includes(settings.keywords))
    && intersects(settings.regions, ['全国', '广东', '全球'])
    && intersects(settings.contentTypes, [news.category === '政策法规' ? '政策解读' : news.category === '集团要闻' ? '企业动态' : '行业新闻'])
    && intersects(settings.sources, ['官方媒体'])
    && !includes(settings.blockedKeywords)
    && !splitKeywords(settings.blockedSources).some(k => `广新集团 ${news.source}`.includes(k));
}
export function relatedMatches(news: PortalNewsItem, settings: NewsSubscription): boolean {
  return splitKeywords(settings.related).some(k => `${news.title}${news.body}`.includes(k));
}

/** Deterministic prototype parser. Only recognizes explicit terms; never claims an AI service call. */
export function generateSubscription(text: string, current: NewsSubscription): { settings: NewsSubscription; recognized: string[] } | null {
  const next = { ...current };
  const recognized: string[] = [];
  const positiveText = text.replace(/(?:不要|排除|屏蔽)[^，。；\n]+/g, '');
  for (const key of Object.keys(subscriptionOptions) as ChoiceKey[]) {
    const matches = subscriptionOptions[key].filter(term => positiveText.includes(term));
    if (matches.length) { next[key] = matches; recognized.push(...matches); }
  }
  if (/政策/.test(positiveText) && !subscriptionOptions.contentTypes.some(t => positiveText.includes(t))) { next.contentTypes = ['政策解读']; recognized.push('政策解读'); }
  if (/每周/.test(text)) { next.frequency = '每周更新'; recognized.push('每周更新'); }
  else if (/每天|每日/.test(text)) { next.frequency = '每日更新'; recognized.push('每日更新'); }
  else if (/实时/.test(text)) { next.frequency = '实时更新'; recognized.push('实时更新'); }
  const blocked = [...text.matchAll(/(?:不要|排除|屏蔽)([^，。；\n]+)/g)].map(m => m[1].trim());
  if (blocked.length) { next.blockedKeywords = blocked.join(', '); recognized.push(...blocked.map(s => `屏蔽：${s}`)); }
  const keys = ['AIGC', '国产算力', '广新集团'].filter(s => text.toLowerCase().includes(s.toLowerCase()));
  if (keys.length) { next.keywords = keys.join(', '); recognized.push(...keys); }
  else next.keywords = '';
  return recognized.length ? { settings: next, recognized } : null;
}
