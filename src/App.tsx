import React, { useState, useEffect } from 'react';
import { EmptyState } from './components/UI';
import { Header } from './components/Header';
import { Sidebar } from './components/Sidebar';
import { AIChatView } from './components/AIChatView';
import { AgentsAndSkillsView } from './components/AgentsAndSkillsView';
import { KnowledgeBaseView } from './components/KnowledgeBaseView';
import { TodoView } from './components/TodoView';
import { WorkbenchDashboard } from './components/WorkbenchDashboard';
import { PortalNewsView } from './components/PortalNewsView';
import { PortalDataView } from './components/PortalDataView';
import { IMChatView } from './components/IMChatView';
import { SearchModal } from './components/SearchModal';
import { CloudDriveView } from './components/CloudDriveView';
import { HistoryModal } from './components/HistoryModal';
import { FilePreviewDrawer } from './components/FilePreviewDrawer';
import { FloatingAITools } from './components/FloatingAITools';
import { MainTab, SidebarMenu, PortalSubView, IMSubView } from './types';
import { Users, Cloud } from 'lucide-react';

export default function App() {
  const [mainTab, setMainTab] = useState<MainTab>(() => new URLSearchParams(window.location.search).get('view') === 'portal' ? 'portal' : new URLSearchParams(window.location.search).get('view') === 'im' ? 'im' : 'workbench');
  const [sidebarMenu, setSidebarMenu] = useState<SidebarMenu>(() => { const view = new URLSearchParams(window.location.search).get('view'); return view === 'agents' || view === 'skills' ? 'agents_skills' : view === 'knowledge' ? 'knowledge_base' : view === 'employees' ? 'digital_employee' : view === 'todos' ? 'todos' : view === 'drive' ? 'cloud_drive' : 'new_chat'; });
  const [portalSubView, setPortalSubView] = useState<PortalSubView>(() => new URLSearchParams(window.location.search).get('section') === 'data' ? 'data' : 'news');
  const [imTargetContact, setIMTargetContact] = useState<string | undefined>();
  const [imSubView, setIMSubView] = useState<IMSubView>(() => new URLSearchParams(window.location.search).get('section') === 'contacts' ? 'org' : 'chat');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showWorkbenchDashboard, setShowWorkbenchDashboard] = useState(() => new URLSearchParams(window.location.search).get('view') === 'dashboard');

  // Active topic in AI chat (e.g. '数据监测与优化策略' matching screenshots)
  const [selectedAgent, setSelectedAgent] = useState<string | undefined>();
  const [responseRequestId, setResponseRequestId] = useState(0);
  const requestSequence = React.useRef(0);
  const [activeTopic, setActiveTopic] = useState<string | undefined>(undefined);

  // Modals & Drawers
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [isFilePreviewOpen, setIsFilePreviewOpen] = useState(false);
  const [previewDocData, setPreviewDocData] = useState<{
    title: string;
    size: string;
    ready: boolean;
    content?: string;
  } | null>(null);

  useEffect(() => {
    const handleKeys = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') { event.preventDefault(); if (!isHistoryOpen) setIsSearchOpen(true); }
      if (event.key === 'Escape') { setIsSearchOpen(false); setIsFilePreviewOpen(false); }
    };
    window.addEventListener('keydown', handleKeys);
    return () => window.removeEventListener('keydown', handleKeys);
  }, [isHistoryOpen]);

  // Tab switching handler
  const handleSelectTab = (tab: MainTab) => {
    setMainTab(tab);
    if (tab === 'workbench') {
      // Keep state
    }
  };

  const handleSelectMenu = (menu: SidebarMenu) => {
    setSidebarMenu(menu);
    setShowWorkbenchDashboard(false);
    if (menu === 'new_chat') {
      setSelectedAgent(undefined);
      setResponseRequestId(0);
      setActiveTopic(undefined);
    }
  };

  const handleSelectHistoryItem = (item: string) => {
    setSelectedAgent(undefined);
    setResponseRequestId(0);
    setMainTab('workbench');
    setSidebarMenu('new_chat');
    setShowWorkbenchDashboard(false);
    setActiveTopic(item);
  };

  const handleOpenDocPreview = (customTitle?: string, content?: string) => {
    setPreviewDocData({
      title: customTitle || '在〔会议名称〕上的总结讲话.docx',
      size: content ? `${(new Blob([content]).size / 1024).toFixed(1)} KB` : '36.2 KB',
      content,
      ready: true
    });
    setIsFilePreviewOpen(true);
  };

  const handleSendQuery = (query: string) => {
    setResponseRequestId(++requestSequence.current);
    setActiveTopic(query);
    setMainTab('workbench');
    setSidebarMenu('new_chat');
    setShowWorkbenchDashboard(false);
  };

  return (
    <div className={`app-shell flex flex-col h-screen w-screen overflow-hidden antialiased selection:bg-red-500 selection:text-white ${isFilePreviewOpen ? 'has-file-preview' : ''}`} data-view={mainTab === 'workbench' ? (showWorkbenchDashboard ? 'dashboard' : sidebarMenu) : mainTab}>
      {/* Top Header */}
      <Header
        currentTab={mainTab}
        onSelectTab={handleSelectTab}
        sidebarCollapsed={sidebarCollapsed}
        contextLabel={mainTab === 'workbench' && !showWorkbenchDashboard && sidebarMenu === 'new_chat' ? '新建会话' : undefined}
        showSidebarToggle={mainTab === 'workbench' && !showWorkbenchDashboard && sidebarMenu !== 'todos'}
        onToggleSidebar={() => setSidebarCollapsed(!sidebarCollapsed)}
        onOpenSearch={() => setIsSearchOpen(true)}
        onSwitchToWorkbenchDashboard={() => {
          setMainTab('workbench');
          setShowWorkbenchDashboard(true);
        }}
      />

      {/* Main Workspace Frame */}
      <div className="flex-1 flex min-h-0 relative">
        {/* Left Sidebar is present during Workbench mode */}
        {mainTab === 'workbench' && !showWorkbenchDashboard && sidebarMenu !== 'todos' && (
          <Sidebar
            currentMenu={sidebarMenu}
            onSelectMenu={handleSelectMenu}
            collapsed={sidebarCollapsed}
            activeHistoryItem={activeTopic}
            onSelectHistoryItem={handleSelectHistoryItem}
            onOpenHistory={() => setIsHistoryOpen(true)}
          />
        )}

        {/* View Routing */}
        <main className="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative">
          {mainTab === 'workbench' && (
            <>
              {showWorkbenchDashboard ? (
                <WorkbenchDashboard
                  onNavigateToTodos={() => {
                    setShowWorkbenchDashboard(false);
                    setSidebarMenu('todos');
                  }}
                  onNavigateToAIChat={(prompt) => {
                    setShowWorkbenchDashboard(false);
                    setSidebarMenu('new_chat');
                    if (prompt) setActiveTopic(prompt);
                  }}
                  onOpenIM={contactId => { setIMTargetContact(contactId); setMainTab('im'); setIMSubView('chat'); }}
                  onNavigateToDrive={() => { setShowWorkbenchDashboard(false); setSidebarMenu('cloud_drive'); }}
                  onNavigateToKnowledge={() => {
                    setShowWorkbenchDashboard(false);
                    setSidebarMenu('knowledge_base');
                  }}
                />
              ) : sidebarMenu === 'new_chat' ? (
                <AIChatView
                  activeTopic={activeTopic}
                  responseRequestId={responseRequestId}
                  selectedAgent={selectedAgent}
                  onSelectAgent={setSelectedAgent}
                  onOpenDocPreview={(title, content) => handleOpenDocPreview(`${title}.txt`, content)}
                  onSendQuery={handleSendQuery}
                />
              ) : sidebarMenu === 'agents_skills' ? (
                <AgentsAndSkillsView
                  onSelectAgentOrSkill={(title) => {
                    setSelectedAgent(title);
                    setResponseRequestId(0);
                    setActiveTopic(undefined);
                    setSidebarMenu('new_chat');
                    setShowWorkbenchDashboard(false);
                  }}
                />
              ) : sidebarMenu === 'knowledge_base' ? (
                <KnowledgeBaseView
                  onOpenFilePreview={(fileName) => handleOpenDocPreview(fileName)}
                />
              ) : sidebarMenu === 'todos' ? (
                <TodoView
                  onBack={() => setSidebarMenu('new_chat')}
                  onOpenItem={(title) => handleSendQuery(title)}
                />
              ) : sidebarMenu === 'digital_employee' ? (
                <EmptyState className="digital-employee-empty flex-1" />
              ) : (
                <CloudDriveView onOpenIM={contactId => { setIMTargetContact(contactId); setMainTab('im'); setIMSubView('chat'); }} />
              )}
            </>
          )}

          {mainTab === 'portal' && (
            <>
              {portalSubView === 'news' ? (
                <PortalNewsView />
              ) : (
                <PortalDataView />
              )}
            </>
          )}

          {mainTab === 'im' && (
            <IMChatView
              initialContactId={imTargetContact}
              subView={imSubView}
              onSelectSubView={setIMSubView}
            />
          )}
        </main>
      </div>

      {/* Floating Right Dock / Quick Buttons */}
      <FloatingAITools
        currentTab={mainTab}
        portalSubView={portalSubView}
        onSelectPortalSubView={setPortalSubView}
        imSubView={imSubView}
        onSelectIMSubView={setIMSubView}
        onToggleAIAssistant={() => {
          setMainTab('workbench');
          setSidebarMenu('new_chat');
          setActiveTopic(undefined);
          setShowWorkbenchDashboard(false);
        }}
        onToggleFavorites={() => {
          setMainTab('workbench');
          setShowWorkbenchDashboard(true);
        }}
      />

      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        onNewChat={() => { setMainTab('workbench'); handleSelectMenu('new_chat'); }}
        onSelect={entry => {
          if (entry.category === '云盘') handleOpenDocPreview(`${entry.title}.docx`);
          else if (entry.category === '消息') { setMainTab('im'); setIMSubView('chat'); }
          else handleSelectHistoryItem(entry.title);
        }}
      />

      {/* Global Search Modal (Image 6) */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectKeyword={(kw) => handleSendQuery(kw)}
      />

      {/* Document Preview Drawer / Full Preview (Images 9 & 17) */}
      <FilePreviewDrawer
        isOpen={isFilePreviewOpen}
        onClose={() => setIsFilePreviewOpen(false)}
        documentData={previewDocData}
      />
    </div>
  );
}
