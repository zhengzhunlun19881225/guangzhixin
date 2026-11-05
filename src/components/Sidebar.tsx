import React from 'react';
import { 
  SquarePen, 
  Bot, 
  BookOpen, 
  UserCog, 
  Cloud, 
  CheckSquare, 
  ChevronRight,
  MessageSquare
} from 'lucide-react';
import { SidebarMenu } from '../types';
import { HISTORY_ITEMS } from '../data/mockData';
import './sidebar-selection.css';

interface SidebarProps {
  currentMenu: SidebarMenu;
  onSelectMenu: (menu: SidebarMenu) => void;
  collapsed: boolean;
  activeHistoryItem?: string;
  onSelectHistoryItem: (item: string) => void;
  onOpenHistory: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentMenu,
  onSelectMenu,
  collapsed,
  activeHistoryItem,
  onSelectHistoryItem,
  onOpenHistory
}) => {
  return (
    <aside
      className={`app-sidebar h-full flex flex-col shrink-0 transition-all duration-200 select-none ${
        collapsed ? 'w-16 items-center' : 'w-60'
      }`}
    >
      {/* Top New Chat Action */}
      <div className="sidebar-new-chat p-3 border-b border-slate-50">
        <button
          onClick={() => onSelectMenu('new_chat')}
          className={`sidebar-menu-button w-full flex items-center justify-center gap-2 rounded-xl py-2 px-3 text-sm font-medium transition-colors ${
            currentMenu === 'new_chat' && !activeHistoryItem
              ? 'bg-slate-50 text-red-600 font-semibold'
              : 'text-slate-700 hover:bg-slate-50 hover:text-red-600'
          }`}
          title="新建会话"
          aria-current={currentMenu === 'new_chat' && !activeHistoryItem ? 'page' : undefined}
        >
          <img className="sidebar-menu-icon" width="20" height="20" src="assets/sidebar/new-chat.svg" alt="" />
          {!collapsed && <span>新建会话</span>}
        </button>
      </div>

      {/* Main Navigation Menu */}
      <nav className="sidebar-primary-nav p-2 space-y-1">
        <button
          onClick={() => onSelectMenu('agents_skills')}
          title="智能体·技能"
          aria-current={currentMenu === 'agents_skills' ? 'page' : undefined}
          className={`sidebar-menu-button w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
            currentMenu === 'agents_skills'
              ? 'sidebar-menu-selected'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <img className="sidebar-menu-icon" width="20" height="20" src="assets/sidebar/agents-skills.svg" alt="" />
          {!collapsed && <span>智能体·技能</span>}
        </button>

        <button
          onClick={() => onSelectMenu('knowledge_base')}
          title="知识库"
          aria-current={currentMenu === 'knowledge_base' ? 'page' : undefined}
          className={`sidebar-menu-button w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
            currentMenu === 'knowledge_base'
              ? 'sidebar-menu-selected'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <img className="sidebar-menu-icon" width="20" height="20" src="assets/sidebar/knowledge-base.svg" alt="" />
          {!collapsed && <span>知识库</span>}
        </button>

        <button
          onClick={() => onSelectMenu('digital_employee')}
          title="数字员工管理"
          aria-current={currentMenu === 'digital_employee' ? 'page' : undefined}
          className={`sidebar-menu-button w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
            currentMenu === 'digital_employee'
              ? 'sidebar-menu-selected'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <img className="sidebar-menu-icon" width="20" height="20" src="assets/sidebar/digital-employee.svg" alt="" />
          {!collapsed && <span>数字员工管理</span>}
        </button>

        <button
          onClick={() => onSelectMenu('cloud_drive')}
          title="云盘"
          aria-current={currentMenu === 'cloud_drive' ? 'page' : undefined}
          className={`sidebar-menu-button w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-sm transition-colors ${
            currentMenu === 'cloud_drive'
              ? 'sidebar-menu-selected'
              : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
          }`}
        >
          <img className="sidebar-menu-icon" width="20" height="20" src="assets/sidebar/cloud-drive.svg" alt="" />
          {!collapsed && <span>云盘</span>}
        </button>


      </nav>

      {/* History Records Section */}
      {!collapsed ? (
        <div className="sidebar-history flex-1 flex flex-col min-h-0 border-t border-slate-100">
          <div className="sidebar-history-heading flex items-center justify-between text-xs text-slate-400 font-medium">
            <span>历史记录</span>
            <button onClick={onOpenHistory} aria-label="查看更多历史记录" aria-haspopup="dialog" className="flex items-center hover:text-slate-600 transition-colors">
              更多 <ChevronRight className="w-3 h-3 ml-0.5" />
            </button>
          </div>

          <div className="sidebar-history-list flex-1 overflow-y-auto space-y-0.5 pr-1 text-xs">
            {HISTORY_ITEMS.map((item, idx) => (
              <button
                key={`${item}-${idx}`}
                onClick={() => onSelectHistoryItem(item)}
                className={`sidebar-history-item w-full text-left px-2.5 py-2 rounded-lg truncate transition-colors ${
                  activeHistoryItem === item
                    ? 'bg-slate-100 text-slate-900 font-medium'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
                title={item}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="mt-auto p-2 border-t border-slate-100">
          <button
            onClick={onOpenHistory}
            title="历史记录"
            className="w-10 h-10 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-50"
          >
            <MessageSquare className="w-4 h-4" />
          </button>
        </div>
      )}
    </aside>
  );
};
