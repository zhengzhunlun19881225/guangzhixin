import { AgentCard, SkillCard, KnowledgeItem, KnowledgeFile, TodoItem, NewsItem, IMContact } from '../types';

import { recentExamples } from './conversationExamples';

export const HISTORY_ITEMS = recentExamples.map(item => item.question);

export const SEARCH_HISTORY_ITEMS = [
  '智能问答',
  '制作PPT',
  '数字员工管理',
  '关于广新产业园AI智能管控系统项目申请事项',
  '从需求到方案一键生成完整方案',
  '行动不便老人上门问诊、家庭病床服务需求',
  '组织2026年度员工体检的通知',
  '参加“数字化创新大赛”'
];

export const AGENT_CARDS: AgentCard[] = [
  {
    id: 'a1',
    title: '智能问答',
    description: '一站式答疑问',
    tag: '常用',
    hotCount: '2万+',
    author: '广新集团',
    category: '常用',
    iconType: 'robot',
    color: 'bg-blue-500'
  },
  {
    id: 'a2',
    title: '智能写作',
    description: '快速生成文案',
    tag: '热门',
    hotCount: '2万+',
    author: '广新集团',
    category: '热门',
    iconType: 'quill',
    color: 'bg-purple-500'
  },
  {
    id: 'a3',
    title: '智能数据',
    description: '分析数据制报表',
    tag: '官方',
    hotCount: '2万+',
    author: '广新集团',
    category: '官方',
    iconType: 'chart',
    color: 'bg-amber-500'
  },
  {
    id: 'a4',
    title: '法智小新',
    description: '解法规，答操作',
    tag: '法务',
    hotCount: '2万+',
    author: '广新集团',
    category: '法务',
    iconType: 'shield',
    color: 'bg-teal-500'
  },
  {
    id: 'a5',
    title: '智能摘要',
    description: '提炼文章要点',
    tag: '常用',
    hotCount: '2万+',
    author: '广新集团',
    category: '常用',
    iconType: 'book',
    color: 'bg-emerald-500'
  },
  {
    id: 'a6',
    title: '财务共享',
    description: '一句话提交出差申请单',
    tag: '财务',
    hotCount: '2万+',
    author: '广新集团',
    category: '财务',
    iconType: 'invoice',
    color: 'bg-amber-500'
  },
  {
    id: 'a7',
    title: 'AI+员工服务',
    description: '一句话描述功能的一句话描述功能的内容...',
    tag: '人力',
    hotCount: '2万+',
    author: '广新集团',
    category: '人力',
    iconType: 'service',
    color: 'bg-purple-600'
  }
];

export const SKILL_CARDS: SkillCard[] = [
  {
    id: 's1',
    title: '合同审查',
    description: '一站式答疑问',
    tag: '法务',
    hotCount: '2万+',
    author: '广新集团',
    category: '法务',
    iconType: 'shield',
    color: 'bg-blue-500'
  },
  {
    id: 's2',
    title: '智能填表',
    description: '快速生成文案',
    tag: '常用',
    hotCount: '2万+',
    author: '广新集团',
    category: '常用',
    iconType: 'table',
    color: 'bg-purple-500'
  },
  {
    id: 's3',
    title: '合同对比',
    description: '分析数据制报表',
    tag: '法务',
    hotCount: '2万+',
    author: '广新集团',
    category: '法务',
    iconType: 'compare',
    color: 'bg-amber-500'
  },
  {
    id: 's4',
    title: 'AI图片',
    description: '解法规，答操作',
    tag: '热门',
    hotCount: '2万+',
    author: '广新集团',
    category: '热门',
    iconType: 'image',
    color: 'bg-teal-500'
  },
  {
    id: 's5',
    title: '泰语翻译',
    description: '提炼文章要点',
    tag: '生活',
    hotCount: '2万+',
    author: '广新集团',
    category: '生活',
    iconType: 'translate',
    color: 'bg-emerald-500'
  },
  {
    id: 's6',
    title: '天气查询',
    description: '一句话提交出差申请单',
    tag: '生活',
    hotCount: '2万+',
    author: '广新集团',
    category: '生活',
    iconType: 'weather',
    color: 'bg-amber-500'
  },
  {
    id: 's7',
    title: '表格工具',
    description: '一句话描述功能的一句话描述功能的内容...',
    tag: '自动化助理',
    hotCount: '2万+',
    author: '广新集团',
    category: '自动化助理',
    iconType: 'calc',
    color: 'bg-purple-600'
  }
];

export const KNOWLEDGE_ITEMS: KnowledgeItem[] = [
  {
    id: 'k1',
    name: '知识库名称',
    docCount: 3,
    creator: '李敏莉',
    createTime: '2025/06/02 02:00'
  },
  {
    id: 'k2',
    name: '知识库名称',
    docCount: 3,
    creator: '李敏莉',
    createTime: '2025/06/02 02:00'
  },
  {
    id: 'k3',
    name: '知识库名称',
    docCount: 3,
    creator: '李敏莉',
    createTime: '2025/06/02 02:00'
  },
  {
    id: 'k4',
    name: '知识库名称',
    docCount: 3,
    creator: '李敏莉',
    createTime: '2025/06/02 02:00'
  }
];

export const KNOWLEDGE_FILES: KnowledgeFile[] = [
  {
    id: 'f1',
    name: '数课程设计',
    size: '54.12MB',
    chunks: '--',
    chunkMethod: '--',
    updateTime: '2022-08-21 12:29',
    type: 'folder'
  },
  {
    id: 'f2',
    name: '课程规划与设计',
    size: '34.12MB',
    chunks: '--',
    chunkMethod: '--',
    updateTime: '2022-08-21 12:29',
    type: 'folder'
  },
  {
    id: 'f3',
    name: '补充阅读材料',
    size: '14.22KB',
    chunks: '--',
    chunkMethod: '--',
    updateTime: '2022-08-21 12:29',
    type: 'folder'
  },
  {
    id: 'f4',
    name: '关于修订广东省广新控股集团有限公司《董事会决策清单》《董事会授权清单》的通知...',
    size: '154.12KB',
    chunks: '3',
    chunkMethod: 'Genera',
    updateTime: '2022-08-21 12:29',
    type: 'word'
  },
  {
    id: 'f5',
    name: '关于修订印发《广东省广新控股集团有限公司总部印章管理办法》的通知.pdf',
    size: '154.12KB',
    chunks: '4',
    chunkMethod: 'Genera',
    updateTime: '2022-08-21 12:29',
    type: 'pdf'
  },
  {
    id: 'f6',
    name: '关于印发《广东省广新控股集团有限公司职工关爱帮扶实施办法》的通知.word',
    size: '154.12KB',
    chunks: '4',
    chunkMethod: 'Genera',
    updateTime: '2022-08-21 12:29',
    type: 'word'
  }
];

export const TODO_ITEMS: TodoItem[] = [
  {
    id: 1,
    title: '办公室(党委办公室)发布新闻:《广新集团学习与创新中心新材料分院在佛塑科技揭牌成立》',
    type: '协同',
    startTime: '2022-08-21 12:29:20',
    creator: '张山',
    receiveTime: '2022-08-21 12:29:20',
    status: 'unread'
  },
  {
    id: 2,
    title: 'XXXXXXXXXXXXXXXXXXX',
    type: '表单',
    startTime: '2022-08-21 12:29:20',
    creator: '张山',
    receiveTime: '2022-08-21 12:29:20',
    status: 'unread'
  },
  {
    id: 3,
    title: '办公室(党委办公室)发布新闻:《广新集团学习与创新中心新材料分院在佛塑科技揭牌成立》',
    type: '公文管理',
    startTime: '2022-08-21 12:29:20',
    creator: '张山',
    receiveTime: '2022-08-21 12:29:20',
    status: 'unread'
  },
  {
    id: 4,
    title: '办公室(党委办公室)发布新闻:《广新集团举办组织人事干部巡视整改专题培训》',
    type: '日程事件',
    startTime: '2022-08-21 12:29:20',
    creator: '张山',
    receiveTime: '2022-08-21 12:29:20',
    status: 'unread'
  },
  {
    id: 5,
    title: 'XXXXXXXXXXXXXXXXXXX',
    type: '组织模型',
    startTime: '2022-08-21 12:29:20',
    creator: '张山',
    receiveTime: '2022-08-21 12:29:20',
    status: 'read'
  },
  {
    id: 6,
    title: 'XXXXXXXXXXXXXXXXXXX',
    type: '知识社区',
    startTime: '2022-08-21 12:29:20',
    creator: '张山',
    receiveTime: '2022-08-21 12:29:20',
    status: 'read'
  },
  {
    id: 7,
    title: 'XXXXXXXXXXXXXXXXXXX',
    type: '邮件',
    startTime: '2022-08-21 12:29:20',
    creator: '张山',
    receiveTime: '2022-08-21 12:29:20',
    status: 'read'
  },
  {
    id: 8,
    title: 'XXXXXXXXXXXXXXXXXXX',
    type: '协同',
    startTime: '2022-08-21 12:29:20',
    creator: '张山',
    receiveTime: '2022-08-21 12:29:20',
    status: 'read'
  },
  {
    id: 9,
    title: 'XXXXXXXXXXXXXXXXXXX',
    type: '邮件',
    startTime: '2022-08-21 12:29:20',
    creator: '张山',
    receiveTime: '2022-08-21 12:29:20',
    status: 'read'
  },
  {
    id: 10,
    title: 'XXXXXXXXXXXXXXXXXXX',
    type: '邮件',
    startTime: '2022-08-21 12:29:20',
    creator: '张山',
    receiveTime: '2022-08-21 12:29:20',
    status: 'read'
  },
  {
    id: 11,
    title: 'XXXXXXXXXXXXXXXXXXX',
    type: '邮件',
    startTime: '2022-08-21 12:29:20',
    creator: '张山',
    receiveTime: '2022-08-21 12:29:20',
    status: 'read'
  }
];

export const IM_CONTACTS: IMContact[] = [
  {
    id: 'im1',
    name: '周伟',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
    lastMessage: '[链接] “四能”筑牢防线',
    time: '10:00',
    unreadCount: 4
  },
  {
    id: 'im2',
    name: '李明睿',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
    lastMessage: '一句话描述功能的内容',
    time: '11:26'
  },
  {
    id: 'im3',
    name: '姜德强',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100&auto=format&fit=crop&q=80',
    lastMessage: '[文件]',
    time: '11:26'
  },
  {
    id: 'im4',
    name: '何嘉嘉',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80',
    lastMessage: '下午1点30分有一个非常紧急需求会议...',
    time: '昨天'
  },
  {
    id: 'im5',
    name: '刘磊、胡磊、陈丽、胡可',
    avatar: 'group',
    lastMessage: '[@所有人] 下午1点30分有一个非常紧急需求会议...',
    time: '昨天',
    isGroup: true
  },
  {
    id: 'im6',
    name: '李杰',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=100&auto=format&fit=crop&q=80',
    lastMessage: '下午1点30分有一个非常紧急需求会议...',
    time: '昨天'
  }
];

export const ORG_COMPANIES = [
  { id: 'c1', name: '集团总部', count: 211 },
  { id: 'c2', name: '广新企运', count: 72 },
  { id: 'c3', name: '广新研究院', count: 107 },
  { id: 'c4', name: '盛特投资', count: 5903 },
  { id: 'c5', name: '兴发铝业', count: 9745 },
  { id: 'c6', name: '星湖科技', count: 10931 },
  { id: 'c7', name: '香港投资', count: 102 },
  { id: 'c8', name: '丝纺集团', count: 541 },
  { id: 'c9', name: '佛塑科技', count: 9218 },
  { id: 'c10', name: '纺织股份', count: 2214 },
  { id: 'c11', name: '省开发', count: 2815 },
  { id: 'c12', name: '省食品', count: 2178 }
];

export const GROUP_MEMBERS = [
  { name: '系统管理员', avatar: 'bg-emerald-600', isAi: false },
  { name: '唐学文', avatar: 'bg-slate-600', isAi: false },
  { name: '陈铧江', avatar: 'bg-amber-600', isAi: false },
  { name: '内部数字员工', avatar: 'bg-indigo-600', isAi: true },
  { name: '尚旭辉', avatar: 'bg-teal-700', isAi: false },
  { name: '李虎', avatar: 'bg-blue-400', isAi: false },
  { name: '唐良武', avatar: 'bg-blue-300', isAi: false },
  { name: '卢伟旋', avatar: 'bg-orange-300', isAi: false },
  { name: '陈晓凤', avatar: 'bg-emerald-300', isAi: false },
  { name: '郑梓煌', avatar: 'bg-purple-300', isAi: false },
  { name: '宁取专用', avatar: 'bg-sky-400', isAi: false },
  { name: '测试8', avatar: 'bg-cyan-300', isAi: false },
  { name: '测试9', avatar: 'bg-blue-200', isAi: false },
  { name: '鸿蒙测试...', avatar: 'bg-sky-200', isAi: false },
  { name: '鸿蒙测试...', avatar: 'bg-teal-200', isAi: false },
  { name: 'iOS 测试', avatar: 'bg-indigo-200', isAi: false }
];
