import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, PanelLeft } from 'lucide-react';
import { MainTab } from '../types';
import { figmaAssets } from '../data/figmaAssets';
import { BrandLogo } from './BrandLogo';

interface HeaderProps {
  currentTab: MainTab;
  onSelectTab: (tab: MainTab) => void;
  sidebarCollapsed: boolean;
  showSidebarToggle?: boolean;
  contextLabel?: string;
  onToggleSidebar: () => void;
  onOpenSearch: () => void;
  onSwitchToWorkbenchDashboard?: () => void;
}

type Menu = 'settings' | 'help' | 'user' | null;
const menuIcon = (file: string) => `assets/figma/${file}.svg`;
const preferenceItems = [
  { label: '差旅偏好', icon: menuIcon('61bb8f02-74b8-4593-a6c0-22fa62fed8e7') },
  { label: '自定义工作台', icon: menuIcon('4c90d1ad-34b6-4b1c-9f79-8559bd8583b1') },
  { label: '设置', icon: menuIcon('03cb3aa9-d564-47c2-8111-e47a1755944b') },
  { label: '退出系统', icon: menuIcon('4d4e9536-f75a-487b-b761-c82fcc617929') },
];
const helpItems = [
  { label: '反馈', icon: menuIcon('8ca2cab4-eb65-4768-9322-24efbec47daf') },
  { label: '帮助', icon: menuIcon('b01d2966-9bec-4d6d-9778-9cd1971516f7') },
];

export const Header: React.FC<HeaderProps> = ({ currentTab, onSelectTab, sidebarCollapsed,
  showSidebarToggle = true, contextLabel, onToggleSidebar, onOpenSearch, onSwitchToWorkbenchDashboard }) => {
  const [menu, setMenu] = useState<Menu>(null);
  const actionsRef = useRef<HTMLDivElement>(null);
  const lastTrigger = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (!menu) return;
    const dismiss = (event: PointerEvent) => {
      if (!actionsRef.current?.contains(event.target as Node)) setMenu(null);
    };
    const keyboard = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setMenu(null);
        lastTrigger.current?.focus();
      }
    };
    document.addEventListener('pointerdown', dismiss);
    document.addEventListener('keydown', keyboard);
    return () => {
      document.removeEventListener('pointerdown', dismiss);
      document.removeEventListener('keydown', keyboard);
    };
  }, [menu]);

  const toggle = (next: Exclude<Menu, null>, event: React.MouseEvent<HTMLButtonElement>) => {
    lastTrigger.current = event.currentTarget;
    setMenu(current => current === next ? null : next);
  };
  const renderMenu = (kind: Exclude<Menu, null>) => (
    <div className={`header-menu header-menu-${kind}`} role="menu" aria-label={kind === 'help' ? '帮助与反馈' : '个人设置'}>
      {(kind === 'help' ? helpItems : preferenceItems).map(item => (
        <button key={item.label} role="menuitem" onClick={() => {
          setMenu(null);
          if (item.label === '自定义工作台') onSwitchToWorkbenchDashboard?.();
        }}>
          <img src={item.icon} width="15" height="15" alt="" />
          <span>{item.label}</span>
        </button>
      ))}
    </div>
  );

  return (
    <header className="app-header">
      <div className="header-brand" data-sidebar-collapsed={sidebarCollapsed && showSidebarToggle}>
        <BrandLogo />
        <button hidden={!showSidebarToggle} onClick={onToggleSidebar}
          aria-expanded={!sidebarCollapsed}
          title={sidebarCollapsed ? '展开侧边栏' : '收起侧边栏'} className="header-collapse">
          <PanelLeft width="16" height="16" />
        </button>
      </div>
      {contextLabel && <span className="header-context">{contextLabel}</span>}
      <nav className="header-tabs" aria-label="主导航">
        {([{ id: 'workbench', label: '工作台' }, { id: 'portal', label: '广新门户' }, { id: 'im', label: 'IM' }] as const).map(tab => (
          <button key={tab.id} aria-current={currentTab === tab.id ? 'page' : undefined}
            className={`rounded-full transition-colors ${currentTab === tab.id ? 'text-white' : ''}`}
            onClick={() => { setMenu(null); onSelectTab(tab.id); }}>{tab.label}</button>
        ))}
      </nav>
      <div className="header-actions" ref={actionsRef}>
        <button onClick={() => { setMenu(null); onOpenSearch(); }} title="搜索 (Ctrl+K)" className="header-search">
          <span className="header-action-icon" aria-hidden="true" style={{ maskImage: `url(${figmaAssets['71-6523:img2']})`, WebkitMaskImage: `url(${figmaAssets['71-6523:img2']})` }} />
        </button>
        <div className="header-settings">
          <div className="header-menu-anchor">
            <button title="设置" aria-haspopup="menu" aria-expanded={menu === 'settings'} onClick={event => toggle('settings', event)}>
              <span className="header-action-icon" aria-hidden="true" style={{ maskImage: `url(${figmaAssets['71-6523:img1']})`, WebkitMaskImage: `url(${figmaAssets['71-6523:img1']})` }} />
            </button>
            {menu === 'settings' && renderMenu('settings')}
          </div>
          <div className="header-menu-anchor">
            <button title="帮助与反馈" aria-haspopup="menu" aria-expanded={menu === 'help'} onClick={event => toggle('help', event)}>
              <span className="header-action-icon" aria-hidden="true" style={{ maskImage: `url(${figmaAssets['71-6523:img']})`, WebkitMaskImage: `url(${figmaAssets['71-6523:img']})` }} />
            </button>
            {menu === 'help' && renderMenu('help')}
          </div>
        </div>
        <div className="relative header-user">
          <button aria-label="张嘉嘉，个人菜单" aria-haspopup="menu" aria-expanded={menu === 'user'} onClick={event => toggle('user', event)} className="flex items-center rounded-full">
            <img className="header-avatar" src={figmaAssets['71-6523:imgUserAvatarWithStylizedIllustration']} alt="" width="32" height="32" />
            <span>张嘉嘉</span><ChevronDown width="14" height="14" />
          </button>
          {menu === 'user' && renderMenu('user')}
        </div>
      </div>
    </header>
  );
};
