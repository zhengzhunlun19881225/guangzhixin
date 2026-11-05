import { SearchField } from './FieldControls';
import React, { useEffect, useRef, useState } from 'react';
import { Search, X, Pin, CornerDownLeft, CircleAlert } from 'lucide-react';
import { AGENT_CARDS } from '../data/mockData';
import { recentExamples } from '../data/conversationExamples';
import './history-modal.css';

type Category = '消息' | '对话' | '云盘';
export type HistoryEntry = { id: string; title: string; agentId: string; category: Category; time: string; pinned?: boolean; notice?: boolean };
const historyEntries: HistoryEntry[] = [
  ...recentExamples.map((item, index): HistoryEntry => ({ id: item.id, title: item.question, agentId: 'a1', category: '对话', time: `11月5日 ${String(16 - Math.floor(index / 2)).padStart(2, '0')}:${index % 2 ? '15' : '45'}` })),
  { id: 'qa-policy', agentId: 'a1', title: '查询集团差旅报销标准与审批流程', category: '对话', time: '11月4日 09:30', pinned: true },
  { id: 'write-notice', agentId: 'a2', title: '起草年度数字化创新大赛通知', category: '对话', time: '11月3日 15:01', pinned: true },
  { id: 'data-sales', agentId: 'a3', title: '分析第三季度各区域销售业绩与增长趋势', category: '对话', time: '昨天 21:29' },
  { id: 'legal-contract', agentId: 'a4', title: '审查采购合同中的付款条款与违约风险', category: '对话', time: '11月3日 16:37' },
  { id: 'summary-meeting', agentId: 'a5', title: '提炼项目推进会纪要与待办事项', category: '对话', time: '11月3日 15:26' },
  { id: 'finance-travel', agentId: 'a6', title: '生成上海出差申请单并核对费用预算', category: '对话', time: '11月2日 16:07' },
  { id: 'hr-leave', agentId: 'a7', title: '查询剩余年假与请假申请流程', category: '对话', time: '11月2日 10:21' },
  { id: 'write-report', agentId: 'a2', title: '撰写集团年度经营总结报告', category: '对话', time: '11月1日 16:23' },
  { id: 'data-budget', agentId: 'a3', title: '对比各部门预算执行率并标记异常支出', category: '对话', time: '10月31日 14:30' },
  { id: 'legal-agreement', agentId: 'a4', title: '解读保密协议中的责任范围与期限', category: '对话', time: '10月30日 17:30' },
  { id: 'summary-file', agentId: 'a5', title: '集团调研报告核心结论摘要.docx', category: '云盘', time: '10月29日 20:36' },
  { id: 'finance-invoice', agentId: 'a6', title: '核对出差报销发票与费用明细', category: '对话', time: '10月28日 15:01', notice: true },
  { id: 'hr-onboard', agentId: 'a7', title: '新员工入职材料补交通知', category: '消息', time: '10月27日 17:05' },
  { id: 'qa-training', agentId: 'a1', title: '查询年度培训安排与报名方式', category: '对话', time: '10月26日 11:14' },
  { id: 'write-plan', agentId: 'a2', title: '数字化转型实施方案初稿.docx', category: '云盘', time: '10月25日 21:47' },
  { id: 'finance-reminder', agentId: 'a6', title: '差旅报销审批进度提醒', category: '消息', time: '10月24日 10:27' },
];
interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNewChat: () => void;
  onSelect: (entry: HistoryEntry) => void;
}

export function HistoryModal({ isOpen, onClose, onNewChat, onSelect }: HistoryModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const search = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [pinnedIds, setPinnedIds] = useState(() => historyEntries.filter(item => item.pinned).map(item => item.id));
  useEffect(() => {
    const element = dialog.current;
    if (!isOpen || !element) return;
    const trigger = document.activeElement as HTMLElement | null;
    setQuery('');
    element.showModal();
    search.current?.focus();
    return () => { element.close(); trigger?.focus(); };
  }, [isOpen]);
  const matches = historyEntries.filter(item => `${item.title} ${AGENT_CARDS.find(agent => agent.id === item.agentId)?.title ?? ''}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()))
    .sort((a, b) => Number(pinnedIds.includes(b.id)) - Number(pinnedIds.includes(a.id)));
  const closeAndSelect = (entry: HistoryEntry) => { onClose(); onSelect(entry); };
  return <dialog ref={dialog} className="history-dialog" aria-label="历史记录" onCancel={event => { event.preventDefault(); onClose(); }} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const bounds = event.currentTarget.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) onClose();
  }}>
    <div className="history-dialog-header">
      <SearchField className="history-search-field" inputRef={search} label="搜索历史记录" value={query} onChange={setQuery} clearText="清空" onKeyDown={event => { if (event.key === 'Enter' && !event.nativeEvent.isComposing && matches.length) { event.preventDefault(); closeAndSelect(matches[0]); } }}/>

      <button className="history-dialog-close" aria-label="关闭历史记录" onClick={onClose}><X size={18} /></button>
    </div>
    <div className="history-results">
      {!query.trim() && <section className="history-quick-create"><h3>快捷创建</h3><button onClick={() => { onClose(); onNewChat(); }}><img src="assets/sidebar/new-chat.svg" width="20" height="20" alt="" /><span>新建会话</span></button></section>}
      <section aria-label="历史列表"><h3>{query.trim() ? '搜索结果' : '最近对话'}{query.trim() && <span className="history-result-count">{matches.length} 条</span>}</h3>
        {matches.map(entry => {
          return <div className="history-result-row" key={entry.id} data-agent-id={entry.agentId}>
            <button className="history-open-entry" title={entry.title} onClick={() => closeAndSelect(entry)}>
              <span className="history-entry-title">{entry.title}</span>{pinnedIds.includes(entry.id) && <Pin size={13} className="history-inline-pin" aria-hidden="true" />}{entry.notice && <CircleAlert size={14} className="history-notice" aria-label="待处理" />}
              <time>{entry.time}</time><CornerDownLeft size={16} className="history-open-arrow" aria-hidden="true" />
            </button>
            <button className={`history-pin ${pinnedIds.includes(entry.id) ? 'is-pinned' : ''}`} aria-label={`${pinnedIds.includes(entry.id) ? '取消置顶' : '置顶'}：${entry.title}`} aria-pressed={pinnedIds.includes(entry.id)} onClick={() => setPinnedIds(ids => ids.includes(entry.id) ? ids.filter(id => id !== entry.id) : [...ids, entry.id])}><Pin size={13} /></button>
          </div>;
        })}
        {!matches.length && <div className="history-no-results" role="status"><Search size={28} /><p>未找到相关记录</p><span>试试其他关键词</span></div>}
      </section>
    </div>
  </dialog>;
}
