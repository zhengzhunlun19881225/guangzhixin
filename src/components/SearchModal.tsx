import { ModalSurface } from './UI';
import { SearchField } from './FieldControls';
import React, { useState } from 'react';
import { Search, X, Trash2 } from 'lucide-react';
import { SEARCH_HISTORY_ITEMS } from '../data/mockData';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectKeyword: (keyword: string) => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({
  isOpen,
  onClose,
  onSelectKeyword
}) => {
  const [query, setQuery] = useState('');
  const [historyList, setHistoryList] = useState(SEARCH_HISTORY_ITEMS);

  if (!isOpen) return null;

  const handleClear = () => {
    setHistoryList([]);
  };

  const handleSelect = (item: string) => {
    onSelectKeyword(item);
    onClose();
  };

  return <ModalSurface className="search-dialog" label="全局搜索" onClose={onClose}>
    <header className="gx-dialog-header"><h2>全局搜索</h2><button aria-label="关闭全局搜索" onClick={onClose}><X size={18}/></button></header>
    <SearchField className="gx-search-field" label="全局搜索关键词" placeholder="请输入关键字搜索" autoFocus value={query} onChange={setQuery} onKeyDown={e => { if(e.key === 'Enter' && !e.nativeEvent.isComposing && query.trim()) handleSelect(query.trim()); }}/>
    <div className="gx-dialog-body">
      <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-3"><span>历史搜索</span>{historyList.length > 0 && <button onClick={handleClear} className="flex items-center gap-1"><Trash2 size={14}/>全部清空</button>}</div>
      {historyList.length === 0 ? <div className="py-8 text-center text-xs text-slate-400">暂无历史搜索</div> : <div className="space-y-1">{historyList.filter(item => !query || item.includes(query)).map((item,idx) => <button key={`${item}-${idx}`} onClick={() => handleSelect(item)} className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-red-600 rounded-lg truncate">{item}</button>)}</div>}
    </div>
  </ModalSurface>;
};
