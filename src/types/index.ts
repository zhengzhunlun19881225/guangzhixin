export type MainTab = 'workbench' | 'portal' | 'im';

export type SidebarMenu = 
  | 'new_chat' 
  | 'agents_skills' 
  | 'knowledge_base' 
  | 'digital_employee' 
  | 'cloud_drive'
  | 'todos';

export type PortalSubView = 'news' | 'data';
export type IMSubView = 'chat' | 'org';

export interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  content: string;
  timestamp: string;
  isThinking?: boolean;
  thoughtProcess?: string;
  hasFilePreview?: boolean;
}

export interface AgentCard {
  id: string;
  title: string;
  description: string;
  tag: string;
  hotCount: string;
  author: string;
  category: string;
  iconType: 'robot' | 'quill' | 'chart' | 'shield' | 'book' | 'invoice' | 'service';
  color: string;
}

export interface SkillCard {
  id: string;
  title: string;
  description: string;
  tag: string;
  hotCount: string;
  author: string;
  category: string;
  iconType: 'shield' | 'table' | 'compare' | 'image' | 'translate' | 'weather' | 'calc';
  color: string;
}

export interface KnowledgeItem {
  id: string;
  name: string;
  docCount: number;
  creator: string;
  createTime: string;
}

export interface KnowledgeFile {
  id: string;
  name: string;
  size: string;
  chunks: string;
  chunkMethod: string;
  updateTime: string;
  type: 'folder' | 'word' | 'pdf' | 'doc';
}

export interface TodoItem {
  id: number;
  title: string;
  type: string;
  startTime: string;
  creator: string;
  receiveTime: string;
  status: 'unread' | 'read';
}

export interface NewsItem {
  id: string;
  title: string;
  tag: string;
  isHeavy?: boolean;
  summary: string;
  source: string;
  date: string;
  image?: string;
}

export interface IMContact {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  time: string;
  unreadCount?: number;
  isGroup?: boolean;
}
