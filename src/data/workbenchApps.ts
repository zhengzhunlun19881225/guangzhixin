import { FileText, Plane, Briefcase, Sparkles, Layers, Shield, Database, Building, Send, HelpCircle, Wallet, Clock, BedDouble, Wrench, Soup, HeartHandshake, CircleDollarSign, Presentation, UserRoundCheck, Users, Newspaper, ContactRound, CarFront, Mail, Receipt, Hotel, Bot, Landmark, FileCheck2, type LucideIcon } from 'lucide-react';

export type AppScope = 'common' | 'systems';
export interface WorkbenchApp { id: string; name: string; icon: LucideIcon; color: string; category: string; }
export const commonAppCatalog: WorkbenchApp[] = [
  { id: 'ai-write', name: 'AI智写', icon: FileText, color: '#9248ef', category: '智能办公' },
  { id: 'travel-request', name: '出差申请', icon: Plane, color: '#16cb86', category: '出行出差' },
  { id: 'ai-query', name: 'AI查询', icon: Briefcase, color: '#36a9ff', category: '智能办公' },
  { id: 'ai-ppt', name: 'AI PPT', icon: Sparkles, color: '#ff612d', category: '智能办公' },
  { id: 'cloud', name: '云盘', icon: Layers, color: '#30a9ff', category: '智能办公' },
  { id: 'attendance', name: '打卡', icon: Shield, color: '#ff9b0c', category: '人事服务' },
  { id: 'data', name: '智数', icon: Database, color: '#ff8516', category: '智能办公' },
  { id: 'contacts', name: '通讯录', icon: Building, color: '#ff653d', category: '办公必备' },
  { id: 'knowledge', name: '知识库', icon: Send, color: '#1ac286', category: '智能办公' },
  { id: 'overtime', name: '加班申请', icon: FileText, color: '#8b44e8', category: '人事服务' },
  { id: 'salary', name: '工资查询', icon: Wallet, color: '#1fc18b', category: '人事服务' },
  { id: 'attendance-fix', name: '补卡申请', icon: Clock, color: '#1fc18b', category: '人事服务' },
  { id: 'housing', name: '员工住宿', icon: BedDouble, color: '#1fc18b', category: '生活服务' },
  { id: 'park-repair', name: '园区报修', icon: Wrench, color: '#278bff', category: '生活服务' },
  { id: 'canteen', name: '智慧食堂', icon: Soup, color: '#1fc18b', category: '生活服务' },
  { id: 'charity', name: '三一公益', icon: HeartHandshake, color: '#ff791d', category: '生活服务' },
  { id: 'sany-wallet', name: '三一宝', icon: CircleDollarSign, color: '#ff791d', category: '生活服务' },
  { id: 'it-repair', name: 'IT报修', icon: Wrench, color: '#1fc18b', category: '办公必备' },
  { id: 'meeting', name: '线下会议', icon: Presentation, color: '#278bff', category: '办公必备' },
  { id: 'visitor', name: '访客预约', icon: UserRoundCheck, color: '#7550ed', category: '办公必备' },
  { id: 'reception', name: '客户接待', icon: Users, color: '#ff791d', category: '办公必备' },
  { id: 'news', name: '前沿资讯', icon: Newspaper, color: '#1fc18b', category: '办公必备' },
  { id: 'access-person', name: '人行权限', icon: ContactRound, color: '#1fc18b', category: '办公必备' },
  { id: 'access-car', name: '车行权限', icon: CarFront, color: '#278bff', category: '办公必备' },
  { id: 'chairman-mail', name: '董事长信箱', icon: Mail, color: '#ff791d', category: '办公必备' },
  { id: 'travel-expense', name: '差旅报销', icon: Receipt, color: '#278bff', category: '出行出差' },
  { id: 'flight', name: '机票预订', icon: Plane, color: '#1fc18b', category: '出行出差' },
  { id: 'hotel', name: '酒店预订', icon: Hotel, color: '#ff791d', category: '出行出差' },
];
export const systemAppCatalog: WorkbenchApp[] = [
  { id: 'oa', name: 'OA系统', icon: Building, color: '#02cbd0', category: '协同办公' },
  { id: 'bpm', name: 'BPM系统', icon: Layers, color: '#17ce8b', category: '协同办公' },
  { id: 'ai-share', name: 'AI共享平台', icon: Database, color: '#ff8912', category: '智能服务' },
  { id: 'legal', name: '法务系统', icon: Shield, color: '#f4c821', category: '业务支持' },
  { id: 'oa-secondary', name: 'OA系统', icon: Building, color: '#0acdd0', category: '协同办公' },
  { id: 'audit', name: '审计系统', icon: Briefcase, color: '#389aff', category: '经营管理' },
  { id: 'custom-data', name: '法务系统', icon: Shield, color: '#f4c821', category: '业务支持' },
  { id: 'custom-service', name: '审计系统', icon: Briefcase, color: '#389aff', category: '业务支持' },
  { id: 'finance', name: '财务系统', icon: Wallet, color: '#278bff', category: '经营管理' },
  { id: 'assets', name: '资管平台', icon: Landmark, color: '#ff8b12', category: '经营管理' },
  { id: 'ai-assistant', name: 'AI智能助手', icon: Bot, color: '#13b8ab', category: '智能服务' },
  { id: 'contract', name: '合同系统', icon: FileCheck2, color: '#9248ef', category: '业务支持' },
];
export const appCatalogs = { common: commonAppCatalog, systems: systemAppCatalog };
export const appCategories = {
  common: ['生活服务', '办公必备', '出行出差', '人事服务', '智能办公'],
  systems: ['协同办公', '经营管理', '智能服务', '业务支持'],
};
export type WorkbenchAppPreferences = Record<AppScope, string[]>;
export const APP_PREFERENCES_KEY = 'guangxin.workbench.apps.v1';
export const defaultAppPreferences: WorkbenchAppPreferences = { common: commonAppCatalog.slice(0, 10).map(app => app.id), systems: systemAppCatalog.slice(0, 8).map(app => app.id) };
export function loadAppPreferences(): WorkbenchAppPreferences {
  try {
    const saved = JSON.parse(localStorage.getItem(APP_PREFERENCES_KEY) || 'null');
    return Object.fromEntries((['common', 'systems'] as const).map(scope => [scope, Array.isArray(saved?.[scope]) ? [...new Set<string>(saved[scope].filter((id: unknown) => typeof id === 'string' && appCatalogs[scope].some(app => app.id === id)))] : defaultAppPreferences[scope]])) as WorkbenchAppPreferences;
  } catch { return { ...defaultAppPreferences }; }
}
