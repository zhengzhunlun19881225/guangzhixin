import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { CalendarDays, Clock, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, X } from 'lucide-react';
import { SelectField } from '../components/SelectField';
import './date-range-example.css';

type Range = { start: string; end: string };
const empty: Range = { start: '', end: '' };
const weekdays = ['日', '一', '二', '三', '四', '五', '六'];
const timeOptions = Array.from({ length: 96 }, (_, index) => `${String(Math.floor(index / 4)).padStart(2, '0')}:${String(index % 4 * 15).padStart(2, '0')}`);
const toDate = (value: string) => new Date(`${value}T00:00:00Z`);
const iso = (date: Date) => date.toISOString().slice(0, 10);
const monthOf = (value: string) => Number(value.slice(0, 4)) * 12 + Number(value.slice(5, 7)) - 1;
const atMonth = (month: number, day = 1) => new Date(Date.UTC(Math.floor(month / 12), month % 12, day));
const addDays = (value: string, count: number) => { const date = toDate(value); date.setUTCDate(date.getUTCDate() + count); return iso(date); };
const shiftMonth = (value: string, count: number) => {
  const month = monthOf(value) + count;
  return iso(atMonth(month, Math.min(toDate(value).getUTCDate(), atMonth(month + 1, 0).getUTCDate())));
};
function todayInShanghai() {
  const parts = new Intl.DateTimeFormat('en', { timeZone: 'Asia/Shanghai', year: 'numeric', month: '2-digit', day: '2-digit' }).formatToParts(new Date());
  return ['year', 'month', 'day'].map(type => parts.find(part => part.type === type)!.value).join('-');
}

/** Review-only range picker. Existing DateRangeField consumers are intentionally untouched. */
export function DateRangeExample() {
  const today = todayInShanghai(), id = useId();
  const [value, setValue] = useState<Range>(empty), [draft, setDraft] = useState<Range>(empty);
  const [open, setOpen] = useState(false), [pickingEnd, setPickingEnd] = useState(false), [hovered, setHovered] = useState('');
  const [firstMonth, setFirstMonth] = useState(monthOf(today)), [focused, setFocused] = useState(today);
  const [time, setTime] = useState(''), [notice, setNotice] = useState('');
  const trigger = useRef<HTMLButtonElement>(null), field = useRef<HTMLDivElement>(null), panel = useRef<HTMLDivElement>(null), pendingFocus = useRef(false);
  const timeField = useRef<HTMLDivElement>(null);
  const close = (returnFocus = false) => { setOpen(false); setHovered(''); if (returnFocus) trigger.current?.focus(); };
  const show = () => {
    const initial = value.start || today;
    setDraft(value); setPickingEnd(false); setHovered(''); setFocused(initial); setFirstMonth(monthOf(initial)); setOpen(true);
  };
  const clear = () => { setValue(empty); setDraft(empty); setPickingEnd(false); setNotice('已清空日期范围'); close(true); };
  const select = (date: string) => {
    setFocused(date); setHovered('');
    if (!pickingEnd || date < draft.start) { setDraft({ start: date, end: '' }); setPickingEnd(true); return; }
    const next = { start: draft.start, end: date };
    setValue(next); setDraft(next); setNotice(`已选择 ${next.start} 至 ${next.end}`); close(true);
  };

  useLayoutEffect(() => {
    if (!open) return;
    const node = panel.current!, anchor = trigger.current!;
    node.showPopover();
    const place = () => {
      const rect = anchor.getBoundingClientRect();
      const viewport = window.visualViewport, width = viewport?.width || innerWidth, height = viewport?.height || innerHeight;
      const left = viewport?.offsetLeft || 0, top = viewport?.offsetTop || 0;
      node.style.maxHeight = `${height - 24}px`;
      const fullHeight = Math.min(node.scrollHeight, height - 24), below = top + height - rect.bottom - 20, above = rect.top - top - 20;
      const upwards = below < fullHeight && above > below;
      node.style.left = `${Math.max(left + 12, Math.min(rect.left, left + width - node.offsetWidth - 12))}px`;
      // Keep the complete calendar visible instead of shrinking it to one side of the field.
      const preferredTop = upwards ? rect.top - fullHeight - 8 : rect.bottom + 8;
      node.style.top = `${Math.max(top + 12, Math.min(preferredTop, top + height - node.offsetHeight - 12))}px`;
    };
    place(); node.querySelector<HTMLButtonElement>(`button[data-date="${value.start || today}"]:not(:disabled)`)?.focus({ preventScroll: true });
    const scroll = (event: Event) => { if (!node.contains(event.target as Node)) place(); };
    window.addEventListener('resize', place); document.addEventListener('scroll', scroll, true); window.visualViewport?.addEventListener('resize', place);
    return () => { if (node.matches(':popover-open')) node.hidePopover(); window.removeEventListener('resize', place); document.removeEventListener('scroll', scroll, true); window.visualViewport?.removeEventListener('resize', place); };
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const outside = (event: Event) => { if (!panel.current?.contains(event.target as Node) && !field.current?.contains(event.target as Node)) close(); };
    document.addEventListener('pointerdown', outside); document.addEventListener('focusin', outside);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('focusin', outside); };
  }, [open]);
  useLayoutEffect(() => {
    if (open && pendingFocus.current) { pendingFocus.current = false; panel.current?.querySelector<HTMLButtonElement>(`button[data-date="${focused}"]:not(:disabled)`)?.focus(); }
  }, [firstMonth, focused, open]);

  const navigate = (delta: number) => {
    const next = firstMonth + delta;
    setFirstMonth(next); setHovered('');
    if (monthOf(focused) < next || monthOf(focused) > next + 1) setFocused(iso(atMonth(next)));
  };
  const keyDown = (event: React.KeyboardEvent<HTMLButtonElement>, date: string) => {
    let next = '';
    if (event.key === 'ArrowLeft') next = addDays(date, -1);
    if (event.key === 'ArrowRight') next = addDays(date, 1);
    if (event.key === 'ArrowUp') next = addDays(date, -7);
    if (event.key === 'ArrowDown') next = addDays(date, 7);
    if (event.key === 'Home') next = addDays(date, -toDate(date).getUTCDay());
    if (event.key === 'End') next = addDays(date, 6 - toDate(date).getUTCDay());
    if (event.key === 'PageUp') next = shiftMonth(date, event.shiftKey ? -12 : -1);
    if (event.key === 'PageDown') next = shiftMonth(date, event.shiftKey ? 12 : 1);
    if (!next) return;
    event.preventDefault(); if (next === date) return; const month = monthOf(next);
    if (month < firstMonth) setFirstMonth(month); else if (month > firstMonth + 1) setFirstMonth(month - 1);
    pendingFocus.current = true; setFocused(next); setHovered(pickingEnd && next >= draft.start ? next : '');
  };
  const end = pickingEnd ? (hovered >= draft.start ? hovered : '') : draft.end;
  const displayed = open ? draft : value;
  return <div className="drp-example">
    <div ref={field} className="drp-field" data-open={open}>
      <button ref={trigger} type="button" className="drp-trigger" aria-label="选择日期范围" aria-haspopup="dialog" aria-expanded={open} aria-controls={open ? id : undefined} onClick={() => open ? close() : show()} onKeyDown={event => { if (event.key === 'ArrowDown') { event.preventDefault(); if (!open) show(); } }}>
        <CalendarDays size={16} aria-hidden="true"/><span data-placeholder={!displayed.start}>{displayed.start || '开始日期'}</span><span className="drp-to">至</span><span data-placeholder={!displayed.end}>{displayed.end || '结束日期'}</span>
      </button>
      {(displayed.start || value.start) && <button className="drp-clear" type="button" aria-label="清空日期范围" onClick={clear}><X size={14}/></button>}
    </div>
    {open && <div ref={panel} id={id} popover="manual" role="dialog" aria-label="选择日期范围" aria-describedby={`${id}-hint`} className="drp-popover" onPointerLeave={() => setHovered('')} onKeyDown={event => { if (event.key === 'Escape') { event.preventDefault(); event.stopPropagation(); close(true); } }}>
      <div className="drp-months">{[firstMonth, firstMonth + 1].map((month, side) => {
        const start = atMonth(month), leading = start.getUTCDay(), first = addDays(iso(start), -leading);
        const title = `${start.getUTCFullYear()} 年 ${start.getUTCMonth() + 1} 月`;
        return <section className="drp-month" key={side} aria-label={title}>
          <header><div>{side === 0 && <><button type="button" aria-label="上一年" onClick={() => navigate(-12)}><ChevronsLeft size={16}/></button><button type="button" aria-label="上个月" onClick={() => navigate(-1)}><ChevronLeft size={16}/></button></>}</div><h4 id={`${id}-month-${side}`}>{title}</h4><div>{side === 1 && <><button type="button" aria-label="下个月" onClick={() => navigate(1)}><ChevronRight size={16}/></button><button type="button" aria-label="下一年" onClick={() => navigate(12)}><ChevronsRight size={16}/></button></>}</div></header>
          <table role="grid" aria-labelledby={`${id}-month-${side}`} aria-multiselectable="true"><thead><tr>{weekdays.map(day => <th key={day} scope="col">{day}</th>)}</tr></thead><tbody>{Array.from({ length: 6 }, (_, row) => <tr key={row}>{Array.from({ length: 7 }, (_, column) => {
            const date = addDays(first, row * 7 + column), current = monthOf(date) === month;
            const isStart = current && date === draft.start, isEnd = current && date === end;
            const inRange = current && !!draft.start && !!end && date >= draft.start && date <= end;
            return <td key={date} role="gridcell" aria-selected={isStart || isEnd || inRange} data-range={inRange} data-start={isStart} data-end={isEnd} data-current={current}><button type="button" data-date={date} data-endpoint={isStart || isEnd} aria-label={date} aria-current={date === today ? 'date' : undefined} disabled={!current} tabIndex={current && focused === date ? 0 : -1} onFocus={() => setFocused(date)} onPointerEnter={() => { if (pickingEnd && current) setHovered(date >= draft.start ? date : ''); }} onKeyDown={event => keyDown(event, date)} onClick={() => select(date)}><span>{toDate(date).getUTCDate()}</span></button></td>;
          })}</tr>)}</tbody></table>
        </section>;
      })}</div>
      <footer><span id={`${id}-hint`} role="status">{pickingEnd ? '请选择结束日期' : '请选择开始日期'}</span><button type="button" disabled={!value.start && !draft.start} onClick={clear}>清空</button><button type="button" onClick={() => close(true)}>取消</button></footer>
    </div>}
    <div className="cr-field drp-time"><span>开始时间</span><div ref={timeField} className="drp-time-field">
      <SelectField label="开始时间" options={timeOptions} value={time} onChange={setTime} placeholder={!time} className="drp-time-select" menuClassName="drp-time-menu" leadingIcon={<Clock size={16} aria-hidden="true"/>} showArrow={false}/>
      {time && <button type="button" className="drp-clear drp-time-clear" aria-label="清空开始时间" onClick={() => { setTime(''); setNotice('已清空开始时间'); timeField.current?.querySelector<HTMLButtonElement>('[role=combobox]')?.focus(); }}><X size={14}/></button>}
    </div></div>
    <p className="cr-result" role="status">日期范围：{value.start || '未选'} 至 {value.end || '未选'}；时区 Asia/Shanghai。</p>
    {notice && <p className="drp-notice" role="status">{notice}</p>}
  </div>;
}
