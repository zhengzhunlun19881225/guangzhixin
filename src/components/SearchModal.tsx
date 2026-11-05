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

  return (
    <div onClick={onClose} role="dialog" aria-modal="true" aria-label="全局搜索" className="search-overlay fixed inset-0 z-50 flex items-start justify-center pt-24 bg-slate-900/40 backdrop-blur-xs select-none">
      <div 
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-100 overflow-hidden animate-in fade-in zoom-in-95 duration-150"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-slate-100 flex items-center gap-3">
          <SearchField className="flex-1" label="全局搜索关键词" placeholder="请输入关键字搜索" autoFocus value={query} onChange={setQuery} onKeyDown={e=>{if(e.key==='Enter' && !e.nativeEvent.isComposing && query.trim()) handleSelect(query.trim());if(e.key==='Escape') onClose();}}/>
          <button aria-label="关闭全局搜索" onClick={onClose} className="p-1 rounded-full text-slate-400 hover:bg-slate-100"><X size={16}/></button>
        </div>

        {/* History Search Section */}
        <div className="p-5 max-h-96 overflow-y-auto">
          <div className="flex items-center justify-between text-xs text-slate-400 font-medium mb-3">
            <span>历史搜索</span>
            {historyList.length > 0 && (
              <button
                onClick={handleClear}
                className="flex items-center gap-1 hover:text-slate-600 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                全部清空
              </button>
            )}
          </div>

          {historyList.length === 0 ? (
            <div className="py-8 text-center text-xs text-slate-400">
              暂无历史搜索
            </div>
          ) : (
            <div className="space-y-1">
              {historyList
                .filter(item => !query || item.includes(query))
                .map((item, idx) => (
                  <button
                    key={`${item}-${idx}`}
                    onClick={() => handleSelect(item)}
                    className="w-full text-left px-3 py-2 text-sm text-slate-700 hover:bg-slate-50 hover:text-red-600 rounded-lg transition-colors truncate"
                  >
                    {item}
                  </button>
                ))}
            </div>
          )}
        </div>
      </div>
      

    </div>
  );
};
