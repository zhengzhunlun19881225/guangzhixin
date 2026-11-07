import React, { useEffect, useId, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { SelectField } from './SelectField';
import './pagination.css';

export function usePagination(total: number, resetKey = '') {
  const [state, setState] = useState({ key: resetKey, page: 1, pageSize: 20 });
  const pages = Math.max(1, Math.ceil(total / state.pageSize));
  const page = state.key === resetKey ? Math.min(state.page, pages) : 1;
  useEffect(() => {
    if (state.key !== resetKey || state.page !== page) setState(s => ({ ...s, key: resetKey, page }));
  }, [resetKey, page, state.key, state.page]);
  return { page, pageSize: state.pageSize, offset: (page - 1) * state.pageSize,
    onPageChange: (next: number) => setState(s => ({ ...s, key: resetKey, page: Math.max(1, Math.min(pages, next)) })),
    onPageSizeChange: (pageSize: number) => setState({ key: resetKey, page: 1, pageSize }) };
}

type Props = { total: number; page: number; pageSize: number; onPageChange: (page: number) => void; onPageSizeChange: (size: number) => void; label?: string };
/** Shared by file lists and the specification; counts always reflect filtered data. */
export function Pagination({ total, page, pageSize, onPageChange, onPageSizeChange, label = '分页' }: Props) {
  const pages = Math.max(1, Math.ceil(total / pageSize)), id = useId();
  const [jump, setJump] = useState(String(page)), [error, setError] = useState('');
  useEffect(() => { setJump(String(page)); setError(''); }, [page, pageSize, total]);
  const numbers = [...new Set([1, pages, page - 1, page, page + 1].filter(n => n >= 1 && n <= pages))].sort((a, b) => a - b);
  const go = (next: number) => { onPageChange(next); setJump(String(next)); setError(''); };
  const submit = (event: React.FormEvent) => {
    event.preventDefault(); const next = Number(jump);
    if (!/^\d+$/.test(jump) || !Number.isSafeInteger(next) || next < 1 || next > pages) { setError(`请输入1至${pages}的整数页码`); return; }
    go(next);
  };
  return <nav className="gx-pagination" aria-label={label}>
    <div className="gx-pagination-summary"><span role="status">共{total} 条</span><SelectField label={`${label}每页条数`} placement="top" value={String(pageSize)} onChange={value => onPageSizeChange(Number(value))} options={[10, 20, 50, 100].map(size => ({ value: String(size), label: `${size}/页` }))}/></div>
    <div className="gx-pagination-controls"><button className="gx-pagination-page" type="button" aria-label="上一页" disabled={page <= 1 || !total} onClick={() => go(page - 1)}><ChevronLeft size={14}/></button>
      {numbers.map((n, i) => <React.Fragment key={n}>{i > 0 && n - numbers[i - 1] > 1 && <span className="gx-pagination-ellipsis" aria-hidden="true">…</span>}<button type="button" className="gx-pagination-page gx-pagination-number" aria-label={`第${n}页`} aria-current={page === n ? 'page' : undefined} disabled={!total} onClick={() => go(n)}>{n}</button></React.Fragment>)}
      <span className="gx-pagination-mobile-count">/ {pages}</span><button className="gx-pagination-page" type="button" aria-label="下一页" disabled={page >= pages || !total} onClick={() => go(page + 1)}><ChevronRight size={14}/></button>
      <form className="gx-pagination-jump" onSubmit={submit} noValidate><label htmlFor={id}>前往</label><input id={id} aria-label={`${label}跳转页码`} aria-invalid={!!error} aria-describedby={error ? `${id}-error` : undefined} inputMode="numeric" value={jump} disabled={!total} onChange={e => { setJump(e.target.value); setError(''); }} onBlur={() => { if (!jump) setJump(String(page)); }} onKeyDown={e => { if (e.key === 'Escape') { setJump(String(page)); setError(''); } }}/><span>页</span><button className="gx-pagination-submit" type="submit" disabled={!total}>跳转</button></form>
    </div>{error && <p id={`${id}-error`} className="gx-pagination-error" role="alert">{error}</p>}
  </nav>;
}
