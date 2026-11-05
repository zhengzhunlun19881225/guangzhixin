import React, { useRef } from 'react';
import { Search, CircleX, CalendarDays } from 'lucide-react';

type SearchFieldProps = {
  value: string; onChange: (value: string) => void; label: string;
  placeholder?: string; className?: string; autoFocus?: boolean;
  inputRef?: React.RefObject<HTMLInputElement | null>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  clearText?: string;
};
export function SearchField({value,onChange,label,placeholder='搜索',className='',autoFocus,inputRef,onKeyDown,clearText}: SearchFieldProps) {
  const ownRef=useRef<HTMLInputElement>(null); const ref=inputRef || ownRef;
  return <div className={`ui-field ui-search-field ${className}`} data-filled={value.length > 0}>
    <Search className="ui-field-icon" size={14} aria-hidden="true"/>
    <input ref={ref} type="text" aria-label={label} placeholder={placeholder} value={value} autoFocus={autoFocus} onChange={e=>onChange(e.target.value)} onKeyDown={onKeyDown}/>
    {value && <button type="button" className="ui-field-clear" aria-label={clearText || `清空${label}`} title="清空" onMouseDown={e=>e.preventDefault()} onClick={()=>{onChange('');ref.current?.focus();}}>{clearText || <CircleX size={14}/>}</button>}
  </div>;
}
export function DateRangeField({start,end,onStartChange,onEndChange,className='knowledge-date-range'}: {
  start:string;end:string;onStartChange:(value:string)=>void;onEndChange:(value:string)=>void;className?:string;
}) {
  const first=useRef<HTMLInputElement>(null);
  return <div className={`ui-field ui-date-range ${className}`} role="group" aria-label="创建日期范围" data-filled={Boolean(start || end)}>
    <CalendarDays className="ui-field-icon" size={14} aria-hidden="true"/>
    <label className="ui-date-part"><input ref={first} type="date" aria-label="开始日期" value={start} max={end || undefined} onChange={e=>onStartChange(e.target.value)} onClick={e=>e.currentTarget.showPicker?.()}/><span className={start ? 'has-value' : ''}>{start || '开始日期'}</span></label>
    <b>至</b>
    <label className="ui-date-part"><input type="date" aria-label="结束日期" value={end} min={start || undefined} onChange={e=>onEndChange(e.target.value)} onClick={e=>e.currentTarget.showPicker?.()}/><span className={end ? 'has-value' : ''}>{end || '结束日期'}</span></label>
    {(start || end) && <button type="button" className="ui-field-clear" aria-label="清空日期范围" title="清空" onMouseDown={e=>e.preventDefault()} onClick={()=>{onStartChange('');onEndChange('');first.current?.focus();}}><CircleX size={14}/></button>}
  </div>;
}
