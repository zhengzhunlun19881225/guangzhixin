import React from 'react';
import { LayoutGrid, FileText, BarChart3 } from 'lucide-react';
import { Mascot } from './Mascot';
import { MainTab, PortalSubView, IMSubView } from '../types';

interface FloatingAIToolsProps {
  currentTab: MainTab;
  portalSubView: PortalSubView;
  onSelectPortalSubView: (sub: PortalSubView) => void;
  imSubView: IMSubView;
  onSelectIMSubView: (sub: IMSubView) => void;
  onToggleAIAssistant?: () => void;
  onToggleFavorites?: () => void;
}

export const FloatingAITools: React.FC<FloatingAIToolsProps> = ({
  currentTab,
  portalSubView,
  onSelectPortalSubView,
  imSubView,
  onSelectIMSubView,
  onToggleAIAssistant,
  onToggleFavorites
}) => {
  if (currentTab === 'portal') {
    return (
      <div className="floating-tools fixed right-4 bottom-24 z-30 flex flex-col items-center bg-white rounded-2xl shadow-lg border border-slate-100 p-1.5 space-y-2 select-none">
        <button
          aria-pressed={portalSubView === 'news'}
          onClick={() => onSelectPortalSubView('news')}
          className={`w-12 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors ${
            portalSubView === 'news'
              ? 'bg-red-50 text-red-600 font-semibold shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
          title="资讯门户"
        >
          <FileText className="w-5 h-5" />
          <span className="text-[11px]">资讯</span>
        </button>

        <button
          aria-pressed={portalSubView === 'data'}
          onClick={() => onSelectPortalSubView('data')}
          className={`w-12 h-14 rounded-xl flex flex-col items-center justify-center gap-1 transition-colors ${
            portalSubView === 'data'
              ? 'bg-red-50 text-red-600 font-semibold shadow-xs'
              : 'text-slate-500 hover:text-slate-800 hover:bg-slate-50'
          }`}
          title="数据门户"
        >
          <BarChart3 className="w-5 h-5" />
          <span className="text-[11px]">数据</span>
        </button>
      </div>
    );
  }

  if (currentTab === 'im') {
    return (
      <div className={`floating-tools im-dock ${imSubView === 'org' ? 'is-directory' : ''} fixed z-30 flex flex-col items-center`}>
        <button className={`flex flex-col items-center justify-center ${imSubView === 'chat' ? 'is-active' : ''}`} title="IM消息" aria-pressed={imSubView === 'chat'} onClick={() => onSelectIMSubView('chat')}>
          <img src={`assets/im/dock-chat${imSubView === 'chat' ? '-active' : ''}.png`} alt="" /><span>IM</span>
        </button>
        <button className={`flex flex-col items-center justify-center ${imSubView === 'org' ? 'is-active' : ''}`} title="通讯录 / 组织架构" aria-pressed={imSubView === 'org'} onClick={() => onSelectIMSubView('org')}>
          <img src={`assets/im/dock-contacts${imSubView === 'org' ? '-active' : ''}.png`} alt="" /><span>通讯录</span>
        </button>
      </div>
    );
  }

  // Workbench / AI Chat Mode
  return (
    <div className="floating-tools fixed right-4 bottom-24 z-30 flex flex-col items-center bg-white rounded-2xl shadow-lg border border-slate-100 p-1.5 space-y-2 select-none">
      <button
        onClick={onToggleFavorites}
        className="w-12 h-12 rounded-xl flex flex-col items-center justify-center text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors"
        title="常用工具"
      >
        <span className="floating-apps-icon" aria-hidden="true">{['5222c845-198b-4d52-a15a-364e7876c9e8','496c0157-02c5-45ad-aa63-0851a3f52620','68f04fbb-4f7c-4d08-b1bf-460dd2722e5c','c4ff2767-b90b-4650-9a64-cea09ba8df2a'].map(id => <img key={id} src={'assets/figma/'+id+'.svg'} alt="" width="8" height="8" />)}</span>
        <span className="text-[10px] text-slate-500 scale-90">常用</span>
      </button>

      <button
        onClick={onToggleAIAssistant}
        className="w-12 h-14 rounded-xl flex flex-col items-center justify-center text-slate-700 hover:bg-amber-50/50 transition-colors group"
        title="广新AI助手"
      >
        <span className="floating-mascot-crop"><img src="assets/figma/c577ac5f-2dab-4548-afb5-61bc3d306e33.png" alt="广智新助手" width="47" height="43" /></span>
        <span className="text-[10px] font-bold text-red-500 mt-0.5">AI</span>
      </button>
    </div>
  );
};
