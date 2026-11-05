import { SearchField } from './FieldControls';
import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Bot, 
  Feather, 
  TrendingUp, 
  ShieldCheck, 
  BookOpen, 
  Receipt, 
  UserCheck, 
  Table, 
  GitCompare, 
  Image, 
  Languages, 
  CloudSun, 
  FileSpreadsheet,
  X
} from 'lucide-react';
import { figmaAssets } from '../data/figmaAssets';
import { AGENT_CARDS, SKILL_CARDS } from '../data/mockData';
import { AgentCard, SkillCard } from '../types';

interface AgentsAndSkillsViewProps {
  onSelectAgentOrSkill: (itemTitle: string) => void;
}

export const AgentsAndSkillsView: React.FC<AgentsAndSkillsViewProps> = ({
  onSelectAgentOrSkill
}) => {
  const [activeTab, setActiveTab] = useState<'agents' | 'skills'>(() => new URLSearchParams(window.location.search).get('view') === 'skills' ? 'skills' : 'agents');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [searchQuery, setSearchQuery] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDesc, setNewDesc] = useState('');

  const agentCategories = ['全部', '常用', '热门', '官方', '个人', '组织', '法务', '财务', '人力'];
  const skillCategories = ['全部', '常用', '热门', '法务', '生活', '数据分析', '自动化助理'];

  const categories = activeTab === 'agents' ? agentCategories : skillCategories;

  const filteredAgents = AGENT_CARDS.filter(card => {
    const matchCategory = selectedCategory === '全部' || card.category === selectedCategory || card.tag === selectedCategory;
    const matchSearch = !searchQuery || card.title.includes(searchQuery) || card.description.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  const filteredSkills = SKILL_CARDS.filter(card => {
    const matchCategory = selectedCategory === '全部' || card.category === selectedCategory || card.tag === selectedCategory;
    const matchSearch = !searchQuery || card.title.includes(searchQuery) || card.description.includes(searchQuery);
    return matchCategory && matchSearch;
  });

  const renderIcon = (type: string) => {
    if ((activeTab === 'agents' && type === 'shield') || type === 'image') return <span style={{position:'relative',width:20,height:20}}><img src={figmaAssets['71-4714:img1']} alt="" style={{position:'absolute',left:1,top:1,width:16,height:18}}/><img src={figmaAssets['71-4714:img2']} alt="" style={{position:'absolute',left:4,top:4,width:13,height:16}}/><img src={figmaAssets['71-4714:img3']} alt="" style={{position:'absolute',left:12,top:15,width:2,height:2}}/></span>;
    const mapped: Record<string,string> = {robot:'img7',quill:'img4',chart:'img',book:'img5',invoice:'img',service:'img4',shield:'img7',table:'img4',compare:'img',translate:'img5',weather:'img',calc:'img4'};
    if (mapped[type]) return <img src={figmaAssets['71-4714:'+mapped[type]]} width="20" height="20" alt="" />;
    switch (type) {
      case 'robot': return <Bot className="w-5 h-5 text-white" />;
      case 'quill': return <Feather className="w-5 h-5 text-white" />;
      case 'chart': return <TrendingUp className="w-5 h-5 text-white" />;
      case 'shield': return <ShieldCheck className="w-5 h-5 text-white" />;
      case 'book': return <BookOpen className="w-5 h-5 text-white" />;
      case 'invoice': return <Receipt className="w-5 h-5 text-white" />;
      case 'service': return <UserCheck className="w-5 h-5 text-white" />;
      case 'table': return <Table className="w-5 h-5 text-white" />;
      case 'compare': return <GitCompare className="w-5 h-5 text-white" />;
      case 'image': return <Image className="w-5 h-5 text-white" />;
      case 'translate': return <Languages className="w-5 h-5 text-white" />;
      case 'weather': return <CloudSun className="w-5 h-5 text-white" />;
      case 'calc': return <FileSpreadsheet className="w-5 h-5 text-white" />;
      default: return <Bot className="w-5 h-5 text-white" />;
    }
  };

  return (
    <div className="agents-view design-panel flex-1 flex flex-col h-full bg-[#f8fafc]/50 overflow-hidden select-none">
      {/* Top Header Bar (Images 1 & 4) */}
      <div className="h-14 px-8 border-b border-slate-100 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <span className="w-1.5 h-4 bg-orange-500 rounded-full" />
            <span className="text-base font-bold text-slate-800">智能体·技能</span>
          </div>

          <div className="h-4 w-px bg-slate-200" />

          {/* Sub tabs: 智能体 | 技能 */}
          <div role="tablist" aria-label="智能体与技能" className="flex items-center gap-6 text-sm font-medium">
            <button
              role="tab" aria-selected={activeTab === 'agents'}
              onClick={() => {
                setActiveTab('agents');
                setSelectedCategory('全部');
              }}
              className={`relative py-1 transition-colors ${
                activeTab === 'agents'
                  ? 'text-red-500 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red-500'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              智能体
            </button>
            <button
              role="tab" aria-selected={activeTab === 'skills'}
              onClick={() => {
                setActiveTab('skills');
                setSelectedCategory('全部');
              }}
              className={`relative py-1 transition-colors ${
                activeTab === 'skills'
                  ? 'text-red-500 font-semibold after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-red-500'
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              技能
            </button>
          </div>
        </div>

        {/* Right Create Button */}
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-1.5 px-4 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-lg text-xs md:text-sm font-medium transition-colors shadow-xs"
        >
          <img src={figmaAssets['71-4714:imgIcon']} width="16" height="16" alt="" />
          <span>创建</span>
        </button>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto px-8 py-6 space-y-6">
        {/* Categories & Search Row */}
        <div className="flex items-center justify-between gap-4 flex-wrap">
          {/* Category Pills */}
          <div className="flex items-center gap-2 flex-wrap text-xs">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full font-medium transition-all ${
                  selectedCategory === cat
                    ? 'bg-red-50 text-red-500 font-semibold shadow-xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <SearchField className="relative w-64" label="搜索智能体或技能" placeholder="请输入" value={searchQuery} onChange={setSearchQuery}/>
        </div>

        {(activeTab === 'agents' ? filteredAgents : filteredSkills).length === 0 && <p className="workspace-empty" role="status">暂无匹配的{activeTab === 'agents' ? '智能体' : '技能'}</p>}
        {/* Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {activeTab === 'agents' ? (
            filteredAgents.map((card) => (
              <div
                key={card.id}
                onClick={() => onSelectAgentOrSkill(card.title)}
                  role="button" tabIndex={0}
                  onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelectAgentOrSkill(card.title); } }}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between agent-card h-36 group"
              >
                <div className="flex items-start gap-3">
                  <div className={`agent-icon w-10 h-10 rounded-xl ${card.color} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}>
                    {renderIcon(card.iconType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-800 truncate mb-1">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <img src={figmaAssets['71-4714:imgHot']} alt="" width="8" height="10"/><span>{card.hotCount}</span>
                  <span>·</span>
                  <span className="font-sans">@{card.author}</span>
                </div>
              </div>
            ))
          ) : (
            filteredSkills.map((card) => (
              <div
                key={card.id}
                onClick={() => onSelectAgentOrSkill(card.title)}
                  role="button" tabIndex={0}
                  onKeyDown={event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); onSelectAgentOrSkill(card.title); } }}
                className="bg-white rounded-2xl p-4 border border-slate-100 shadow-xs hover:shadow-md transition-all duration-200 cursor-pointer flex flex-col justify-between agent-card h-36 group"
              >
                <div className="flex items-start gap-3">
                  <div className={`agent-icon w-10 h-10 rounded-xl ${card.color} flex items-center justify-center shrink-0 shadow-xs group-hover:scale-105 transition-transform`}>
                    {renderIcon(card.iconType)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-sm font-bold text-slate-800 truncate mb-1">
                      {card.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                      {card.description}
                    </p>
                  </div>
                </div>

                <div className="pt-2 text-[11px] text-slate-400 flex items-center gap-1 font-mono">
                  <img src={figmaAssets['71-4714:imgHot']} alt="" width="8" height="10"/><span>{card.hotCount}</span>
                  <span>·</span>
                  <span className="font-sans">@{card.author}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Create Modal */}
      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/40 backdrop-blur-xs p-4">
          <div className="w-full max-w-md bg-white rounded-2xl shadow-xl border border-slate-100 p-6 space-y-4 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900">
                创建自定义{activeTab === 'agents' ? '智能体' : '技能'}
              </h3>
              <button
                onClick={() => setShowCreateModal(false)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">名称</label>
                <input
                  type="text"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  placeholder="例如：投资决策分析助手"
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden text-slate-800"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">功能描述</label>
                <textarea
                  rows={3}
                  value={newDesc}
                  onChange={(e) => setNewDesc(e.target.value)}
                  placeholder="简要描述该智能体的专属场景与功能指令..."
                  className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden text-slate-800 resize-none"
                />
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">所属分类</label>
                <select className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-hidden text-slate-800">
                  <option>官方</option>
                  <option>组织</option>
                  <option>个人</option>
                  <option>法务</option>
                  <option>财务</option>
                  <option>人力</option>
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                取消
              </button>
              <button
                onClick={() => {
                  if (newTitle) {
                    onSelectAgentOrSkill(newTitle);
                    setShowCreateModal(false);
                  }
                }}
                className="px-4 py-2 text-xs font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-lg shadow-xs"
              >
                确认创建
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
