import { SearchField, DateRangeField } from './FieldControls';
import React, { useState } from 'react';
import { BellOff, RotateCw, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { TODO_ITEMS } from '../data/mockData';

interface TodoViewProps { onBack: () => void; onOpenItem?: (title: string) => void; }
export const TodoView: React.FC<TodoViewProps> = ({ onBack, onOpenItem }) => {
  const [activeTab, setActiveTab] = useState<'pending' | 'completed' | 'messages'>('pending');
  const [selectedType, setSelectedType] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [dndEnabled, setDndEnabled] = useState(false);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [readIds, setReadIds] = useState<number[]>([]);
  const [pageSize, setPageSize] = useState(20);
  const [page, setPage] = useState(1);
  const items = TODO_ITEMS.filter(item => (activeTab === 'pending' || (activeTab === 'completed' ? item.id >= 5 : item.type === '邮件')) && (!selectedType || item.type === selectedType) && (!searchQuery || item.title.includes(searchQuery) || item.type.includes(searchQuery)) && (!startDate || item.startTime.slice(0,10) >= startDate) && (!endDate || item.startTime.slice(0,10) <= endDate));
  const pages = Math.max(1, Math.ceil(items.length / pageSize));
  const currentPage = Math.min(page, pages);
  const open = (item: typeof TODO_ITEMS[number]) => { setReadIds(ids => [...ids, item.id]); onOpenItem?.(item.title); };
  const resetFilters = () => { setSelectedType(''); setSearchQuery(''); setStartDate(''); setEndDate(''); setPage(1); };
  return <section className="todo-view design-panel todo-refined">
    <header className="todo-header">
      <button className="todo-back" onClick={onBack}><ChevronLeft size={16}/><span>返回</span></button><span className="todo-divider" />
      <div className="todo-tabs" role="tablist" aria-label="待办分类">{([['pending','待办'],['completed','已办'],['messages','消息']] as const).map(([id,label]) => <button role="tab" aria-selected={activeTab === id} className={activeTab === id ? 'active' : ''} key={id} onClick={() => { setActiveTab(id); setPage(1); }}>{label}</button>)}</div>
      <button className="todo-dnd" aria-pressed={dndEnabled} onClick={() => setDndEnabled(!dndEnabled)}><BellOff size={16}/>{dndEnabled ? '免打扰已开启' : '免打扰'}</button>
    </header>
    <div className="todo-body">
      <div className="todo-toolbar">
        <button className="todo-refresh" title="刷新" aria-label="刷新并重置筛选" onClick={resetFilters}><RotateCw size={14}/></button>
        <div className="todo-filters">
          <DateRangeField start={startDate} end={endDate} onStartChange={value=>{setStartDate(value);setPage(1);}} onEndChange={value=>{setEndDate(value);setPage(1);}}/>
          <label className="todo-type"><select aria-label="类型" value={selectedType} onChange={e => {setSelectedType(e.target.value);setPage(1);}}><option value="">类型</option>{Array.from(new Set(TODO_ITEMS.map(item => item.type))).map(type => <option key={type}>{type}</option>)}</select><ChevronDown size={14}/></label>
          <SearchField className="todo-search" label="搜索待办" placeholder="请输入" value={searchQuery} onChange={value=>{setSearchQuery(value);setPage(1);}}/>
        </div>
      </div>
      <div className="todo-table-scroll"><table><colgroup>{['5.6%','38%','10.4%','15%','10.4%','16.6%','4%'].map((width,index) => <col key={index} style={{width}}/>)}</colgroup>
        <thead><tr>{['序号','标题','类型','发起时间','发起人','接收时间','操作'].map(label => <th key={label}>{label}</th>)}</tr></thead>
        <tbody>{items.slice((currentPage - 1) * pageSize, currentPage * pageSize).map(item => <tr key={item.id}><td>{item.id}</td><td><button className="todo-item-title" title={item.title} onClick={() => open(item)}>{item.title}</button></td><td>{item.type}</td><td>{item.startTime}</td><td>{item.creator}</td><td>{item.receiveTime}</td><td><button onClick={() => open(item)} className={item.status === 'unread' && !readIds.includes(item.id) ? 'is-unread' : 'is-read'}>{item.status === 'unread' && !readIds.includes(item.id) ? '未读' : '已读'}</button></td></tr>)}{!items.length && <tr><td colSpan={7} className="workspace-empty">暂无匹配记录</td></tr>}</tbody>
      </table></div>
      <footer className="todo-pagination"><div><span>共{items.length} 条</span><label><select aria-label="每页条数" value={pageSize} onChange={e => {setPageSize(Number(e.target.value));setPage(1);}}>{[20,50,100].map(size => <option key={size} value={size}>{size}/页</option>)}</select><ChevronDown size={14}/></label></div><div><button aria-label="上一页" disabled={currentPage === 1} onClick={() => setPage(currentPage - 1)}><ChevronLeft size={14}/></button><button className="current-page" aria-current="page">{currentPage}</button><button aria-label="下一页" disabled={currentPage === pages} onClick={() => setPage(currentPage + 1)}><ChevronRight size={14}/></button><span>前往</span><input aria-label="页码" type="number" min={1} max={pages} value={currentPage} onChange={e => setPage(Math.max(1,Math.min(pages,Number(e.target.value) || 1)))}/><span>页</span></div></footer>
    </div>
  </section>;
};
