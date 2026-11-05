import React, { useState } from 'react';
import { ChevronRight, ChevronLeft } from 'lucide-react';
import { DailyBrief } from './DailyBrief';
import { ApplicationManager } from './ApplicationManager';
import { WorkbenchVectorIcon, hasWorkbenchVector } from './WorkbenchVectorIcon';
import { appCatalogs, APP_PREFERENCES_KEY, loadAppPreferences, type AppScope } from '../data/workbenchApps';

interface WorkbenchDashboardProps {
  onNavigateToTodos: () => void;
  onNavigateToAIChat: (prompt?: string) => void;
  onNavigateToKnowledge: () => void;
  onNavigateToDrive: () => void;
  onOpenIM: (contactId: string) => void;
}
const asset = (name: string) => `assets/workbench/${name}.png`;
const taskGroups = {
  pending: [
    ['关于集团2026年调研实施方案的讨论', '上官成硕', '1小时前', '正常'],
    ['年度新品研发规划汇报-研发周期推广规划', '张锐', '1小时前', '正常'],
    ['关于广新产业园AI智能管控系统项目申请事项', '李佳佳', '2026-10-29', '正常'],
    ['关于集团2026年调研实施方案的讨论', '李佳佳', '2026-10-29', '正常'],
  ],
  completed: [
    ['年度采购计划审批', '张锐', '2026-10-28', '已完成'],
    ['第三季度项目验收申请', '李佳佳', '2026-10-27', '已完成'],
  ],
  messages: [
    ['关于集团2026年调研实施方案的通知', '上官成硕', '1小时前', '未读'],
    ['开发管理系统日报提交提醒', '张锐', '2小时前', '未读'],
    ['本周项目进展汇总已更新', '李佳佳', '2026-10-29', '已读'],
  ],
};
const taskTabs = [{ id: 'pending', label: '待办' }, { id: 'completed', label: '已办' }, { id: 'messages', label: '消息' }] as const;
const recentForms = [
  '进出口业务统计情况表', '业务进出口情况月报表',
  '数据测试', '信息系统群组变更信息登记表',
  '服务中心车辆报修申请表', '业务进出口情况月报表',
  '纺织股份用车申请表', '纺织股份用车申请表',
  '日合规审查表', '纺织股份信息系统账户申请表',
];
export const WorkbenchDashboard: React.FC<WorkbenchDashboardProps> = ({ onNavigateToTodos, onNavigateToAIChat, onNavigateToKnowledge, onNavigateToDrive, onOpenIM }) => {
  const [taskTab, setTaskTab] = useState<keyof typeof taskGroups>('pending');
  const [appPreferences, setAppPreferences] = useState(loadAppPreferences);
  const [managerScope, setManagerScope] = useState<AppScope | null>(null);
  const [saveAnnouncement, setSaveAnnouncement] = useState('');
  const [month, setMonth] = useState(new Date(2025, 10, 1));
  const [selectedDay, setSelectedDay] = useState(13);
  const offset = month.getDay();
  const dayCount = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
  const previousCount = new Date(month.getFullYear(), month.getMonth(), 0).getDate();
  const changeMonth = (delta: number) => {
    const next = new Date(month.getFullYear(), month.getMonth() + delta, 1);
    setMonth(next);
    setSelectedDay(day => Math.min(day, new Date(next.getFullYear(), next.getMonth() + 1, 0).getDate()));
  };
  const saveApps = (ids: string[]) => {
    if (!managerScope) return false;
    const next = { ...appPreferences, [managerScope]: [...ids] };
    try { localStorage.setItem(APP_PREFERENCES_KEY, JSON.stringify(next)); }
    catch { return false; }
    setAppPreferences(next);
    setSaveAnnouncement(`${managerScope === 'common' ? '常用功能' : '系统导航'}已保存`);
    return true;
  };
  const open = (name: string) => name === '知识库' ? onNavigateToKnowledge() : name === '云盘' ? onNavigateToDrive() : onNavigateToAIChat(name);
  const appGrid = (scope: AppScope) => appPreferences[scope].length ? (
    <div className={`wb-icon-grid ${scope === 'systems' ? 'wb-systems' : ''}`}>
      {appPreferences[scope].map(id => {
        const app = appCatalogs[scope].find(item => item.id === id)!;
        const Icon = app.icon;
        return <button key={id} data-app-id={id} onClick={() => open(app.name)}>
          {hasWorkbenchVector(id) ? <WorkbenchVectorIcon className="wb-app-art" name={id} /> : <span style={{ background: app.color }}><Icon size={20} /></span>}
          {app.name}
        </button>;
      })}
    </div>
  ) : <div className="wb-apps-empty">暂未添加<button onClick={() => setManagerScope(scope)}>添加{scope === 'common' ? '应用' : '系统'}</button></div>;
  const heading = (title: string, icon: string, action = onNavigateToTodos) => <div className="wb-heading">
    <h3><img src={asset(icon)} alt="" />{title}</h3>
    <button onClick={action} aria-label={`${title}更多`}>更多<ChevronRight size={13} /></button>
  </div>;

  return <div className="workbench-dashboard overflow-y-auto flex-1">
    <div className="workbench-grid">
      <DailyBrief onOpenIM={onOpenIM} />
      <div className="dashboard-main">
        <div className="wb-middle">
          <section className="wb-panel wb-tasks">
            {heading('统一待办', 'heading-tasks')}
            <div className="wb-tabs" role="tablist" aria-label="统一待办分类">{taskTabs.map(tab => <button key={tab.id} id={`wb-tab-${tab.id}`} role="tab" aria-selected={taskTab === tab.id} aria-controls="wb-task-panel" className={taskTab === tab.id ? 'active' : ''} tabIndex={taskTab === tab.id ? 0 : -1} onKeyDown={event => {
              const index = taskTabs.findIndex(item => item.id === tab.id);
              const nextIndex = event.key === 'ArrowRight' ? (index + 1) % taskTabs.length : event.key === 'ArrowLeft' ? (index + taskTabs.length - 1) % taskTabs.length : event.key === 'Home' ? 0 : event.key === 'End' ? taskTabs.length - 1 : -1;
              if (nextIndex < 0) return;
              event.preventDefault();
              setTaskTab(taskTabs[nextIndex].id);
              document.getElementById(`wb-tab-${taskTabs[nextIndex].id}`)?.focus();
            }} onClick={() => setTaskTab(tab.id)}>{tab.label} {taskGroups[tab.id].length}</button>)}</div>
            <div className="wb-task-list" id="wb-task-panel" role="tabpanel" aria-labelledby={`wb-tab-${taskTab}`}>{taskGroups[taskTab].map(([name, author, time, status], i) => <button key={i} onClick={onNavigateToTodos}>
              <div><h4 title={`[系统来源] ${name}`}>[系统来源] {name}</h4><p>发起人 <img className="wb-person" src={asset(i === 2 ? 'avatar-junwei' : 'avatar-zhang')} alt="" /><b>{author}</b><span className="wb-time">时间</span><b>{time}</b></p></div>
              <span className={`wb-status ${status === '未读' ? 'waiting' : 'normal'}`}>{status}</span>
            </button>)}</div>
          </section>
          <div className="wb-utilities">
            <section className="wb-panel wb-common-apps">{heading('常用功能', 'heading-bar', () => setManagerScope('common'))}{appGrid('common')}</section>
            <section className="wb-panel wb-system-apps">{heading('系统导航', 'heading-bar', () => setManagerScope('systems'))}{appGrid('systems')}</section>
          </div>
        </div>
        <div className="wb-bottom">
          <section className="wb-panel wb-recent-forms" aria-label="最近使用表单">
            {heading('最近使用表单', 'heading-bar', () => onNavigateToAIChat('最近使用表单'))}
            <div className="wb-form-list">{recentForms.map((title, i) => <button key={`${title}-${i}`} title={title} onClick={() => onNavigateToAIChat(title)}>
              <svg className="wb-form-icon" viewBox="0 0 16 20" aria-hidden="true"><path fill="#00C395" d="M1 0h9l5 5v14a1 1 0 0 1-1 1H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1Z"/><path fill="#9AE8D5" d="M10 0v5h5Z"/><path d="m4 8 7 8m0-8-7 8" stroke="white" strokeWidth="1.5" strokeLinecap="round"/></svg>
              <span>{title}</span>
            </button>)}</div>
          </section>
          <section className="wb-panel wb-schedule">
            {heading('我的日程', 'heading-schedule', () => onNavigateToAIChat('我的日程'))}
            <div className="wb-schedule-body">
              <div className="wb-calendar">
                <div className="calendar-heading"><button aria-label="上个月" onClick={() => changeMonth(-1)}><ChevronLeft size={14} /></button><span>{month.getFullYear()} - {String(month.getMonth() + 1).padStart(2, '0')}</span><button aria-label="下个月" onClick={() => changeMonth(1)}><ChevronRight size={14} /></button></div>
                <div className={`calendar-grid ${Math.ceil((offset + dayCount) / 7) === 6 ? 'six-weeks' : ''}`}>
                  {'日一二三四五六'.split('').map(d => <span className="weekday" key={d}>{d}</span>)}
                  {Array.from({ length: Math.ceil((offset + dayCount) / 7) * 7 }, (_, i) => {
                    const day = i - offset + 1;
                    const outside = day < 1 || day > dayCount;
                    const marked = month.getFullYear() === 2025 && month.getMonth() === 10 && day === 16;
                    return <button key={i} disabled={outside} onClick={() => setSelectedDay(day)} aria-label={`${month.getFullYear()}年${month.getMonth() + 1}月${day}日`} aria-pressed={!outside && day === selectedDay} className={`${outside ? 'outside' : day === selectedDay ? 'selected' : ''} ${marked ? 'has-event' : ''}`}>{day < 1 ? previousCount + day : day > dayCount ? day - dayCount : day}</button>;
                  })}
                </div>
              </div>
              <div className="wb-agenda">{[['09:00', '新产品发布会筹备会议', '已完成', '王武'], ['13:00', '高级职位候选人面试', '未开始', '王武'], ['15:00', '安排新员工入职培训', '未开始', '张三']].map(([time, title, status, person]) => <button key={time} onClick={() => onNavigateToAIChat(title)}>
                <h4><time>{time}</time><span>{title}</span></h4><p><span className={status === '已完成' ? 'wb-status' : 'wb-status pending'}>{status}</span><small>指派人</small><b><img src={asset(person === '王武' ? 'avatar-wang' : 'avatar-san')} alt="" />{person}</b></p>
              </button>)}</div>
            </div>
          </section>
        </div>
      </div>
    </div>
    {managerScope && <ApplicationManager key={managerScope} scope={managerScope} selectedIds={appPreferences[managerScope]} onClose={() => setManagerScope(null)} onSave={saveApps} onOpenApp={app => open(app.name)} />}
    <span className="sr-only" role="status" aria-live="polite">{saveAnnouncement}</span>
  </div>;
};
