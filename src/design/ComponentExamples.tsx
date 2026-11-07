import React, { useEffect, useId, useRef, useState } from 'react';
import { Bell, Check, ChevronDown, ChevronLeft, ChevronRight, FileText, Folder, Info, LoaderCircle, Plus, Search, Settings2, Star, Trash2, Upload, User, X } from 'lucide-react';
import { Button, EmptyState, ModalSurface, StatusBadge } from '../components/UI';
import { SearchField, DateRangeField } from '../components/FieldControls';
import { SelectField } from '../components/SelectField';
import { Pagination, usePagination } from '../components/Pagination';
import { NumberInput } from '../components/NumberInput';
import { DateRangeExample } from './DateRangeExample';
import { SystemNewsExample, SystemUploadExample, SystemMeetingExample, SystemTableExample } from './SystemExamples';
import { IconCatalog } from './IconCatalog';
import { BadgeExample } from './BadgeExample';
import { AlertExample, MessageExample, NotificationExample, TooltipExample } from './FeedbackExamples';

import { RadioReference, CheckboxReference, SwitchReference, TabsReference, EmptyReference, MessageBoxReference } from './ReferencePatterns';

type DemoProps = { id: string };
const choices = ['集团总部', '广新企运', '广新研究院'];
const records = [{ name: '年度工作计划', amount: 12 }, { name: '数字化协作方案', amount: 8 }, { name: '采购管理规范', amount: 24 }, { name: '季度经营简报', amount: 16 }, { name: '项目验收记录', amount: 6 }];
function Result({ children }: { children: React.ReactNode }) { return <p className="cr-result" role="status">{children}</p>; }
function MenuExample() {
  const [selected, setSelected] = useState<string | null>(null);
  const items = [
    { name: '智能体·技能', icon: 'agents-skills' },
    { name: '知识库', icon: 'knowledge-base' },
    { name: '数字员工管理', icon: 'digital-employee' },
    { name: '云盘', icon: 'cloud-drive' },
  ];
  return <><nav className="cr-menu" aria-label="示例侧边导航">{items.map(item => <button type="button" key={item.icon} aria-current={selected === item.name ? 'page' : undefined} onClick={() => setSelected(item.name)}><img src={`${import.meta.env.BASE_URL}assets/sidebar/${item.icon}.svg`} width={20} height={20} alt=""/><span>{item.name}</span></button>)}</nav><Result>当前页面：{selected || '未选择'}</Result></>;
}
function Field({ label, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { label: string }) { const id = useId(); return <label className="cr-field" htmlFor={id}><span>{label}</span><input id={id} {...props}/></label>; }
function IconButton({ label, children, ...props }: React.ButtonHTMLAttributes<HTMLButtonElement> & { label: string }) { return <button type="button" className="cr-icon-button" aria-label={label} title={label} {...props}>{children}</button>; }

function ButtonDemo() {
  const [busy, setBusy] = useState(false), [smallBusy,setSmallBusy]=useState(false), [result, setResult] = useState('');
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  useEffect(() => () => timers.current.forEach(clearTimeout), []);
  const load=(small=false)=>{(small?setSmallBusy:setBusy)(true);timers.current.push(setTimeout(()=>{(small?setSmallBusy:setBusy)(false);setResult(`${small?'小号按钮':'按钮'}加载演示完成`);},900));};
  const action=(name:string)=>()=>setResult(`已触发${name}示例`);
  return <div className="cr-button-examples">
    <div role="group" aria-label="常规按钮 32px"><p className="cr-hint">常规按钮 · 32px</p><div className="cr-row">{(['primary', 'secondary', 'text', 'danger'] as const).map((variant, i) => <Button key={variant} variant={variant} onClick={action(['主按钮','次按钮','文本按钮','危险按钮'][i])}>示例{['主按钮', '次按钮', '文本按钮', '危险按钮'][i]}</Button>)}<Button variant="solid" onClick={action('主题红按钮')}>主题红按钮</Button><Button disabled>禁用按钮</Button><Button loading={busy} onClick={()=>load()}>加载示例</Button></div></div>
    <div role="group" aria-label="带图标按钮"><p className="cr-hint">带图标按钮 · 32px</p><div className="cr-row"><Button variant="primary" onClick={action('上传文件')}><Upload size={16} aria-hidden="true"/>上传文件</Button><Button variant="solid" onClick={action('新增')}><Plus size={16} aria-hidden="true"/>新增</Button><Button onClick={action('查询')}><Search size={16} aria-hidden="true"/>查询</Button><Button variant="text" onClick={action('设置')}><Settings2 size={16} aria-hidden="true"/>设置</Button><Button variant="danger" onClick={action('删除')}><Trash2 size={16} aria-hidden="true"/>删除</Button></div></div>
    <div role="group" aria-label="小号按钮 26px"><p className="cr-hint">小号按钮 · 26px</p><div className="cr-row"><Button size="small" variant="primary" onClick={action('小号主按钮')}>小号主按钮</Button><Button size="small" variant="solid" onClick={action('小号主题红按钮')}>主题红按钮</Button><Button size="small" onClick={action('小号次按钮')}>小号次按钮</Button><Button size="small" onClick={action('小号新增')}><Plus size={14} aria-hidden="true"/>新增</Button><Button size="small" variant="text" onClick={action('小号查询')}><Search size={14} aria-hidden="true"/>查询</Button><Button size="small" variant="danger" onClick={action('小号危险按钮')}>危险按钮</Button><Button size="small" disabled>禁用按钮</Button><Button size="small" loading={smallBusy} onClick={()=>load(true)}>加载示例</Button></div></div>
    <p className="cr-hint">鼠标移入检查 hover；Tab 检查焦点。危险操作在业务中必须先确认。</p><Result>{result || '点击按钮查看状态'}</Result>
  </div>;
}
function SplitDemo() {
  const [width, setWidth] = useState(35); const root = useRef<HTMLDivElement>(null); const dragging = useRef(false);
  const clamp = (n: number) => Math.max(25, Math.min(65, n));
  return <><div className="cr-split" ref={root} style={{ gridTemplateColumns: `${width}% 8px minmax(0,1fr)` }}><div>目录面板</div><div role="separator" tabIndex={0} aria-label="调整面板宽度" aria-orientation="vertical" aria-valuemin={25} aria-valuemax={65} aria-valuenow={width} onKeyDown={e => { if (['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) { e.preventDefault(); setWidth(v => e.key === 'Home' ? 25 : e.key === 'End' ? 65 : clamp(v + (e.key === 'ArrowLeft' ? -5 : 5))); } }} onPointerDown={e => { dragging.current = true; e.currentTarget.setPointerCapture(e.pointerId); }} onPointerMove={e => { if (!dragging.current || !root.current) return; const rect = root.current.getBoundingClientRect(); setWidth(clamp(Math.round((e.clientX - rect.left) / rect.width * 100))); }} onPointerUp={() => { dragging.current = false; }} onPointerCancel={() => { dragging.current = false; }}/><div>内容面板</div></div><Result>左侧宽度 {width}%；可拖动分隔条或使用左右方向键。</Result></>;
}
function StepsDemo() {
  const [step, setStep] = useState(0);
  return <><ol className="cr-steps" aria-label="创建流程">{['填写信息', '核对内容', '完成'].map((t, i) => <li key={t} aria-current={step === i ? 'step' : undefined} data-complete={step > i}><span>{step > i ? <Check size={14}/> : i + 1}</span>{t}</li>)}</ol><div className="cr-box">{['填写项目名称和负责人', '核对项目信息，确认后完成示例', '流程演示完成'][step]}</div><div className="cr-row"><Button disabled={step === 0} onClick={() => setStep(step - 1)}>上一步</Button><Button disabled={step === 2} onClick={() => setStep(step + 1)}>下一步</Button></div></>;
}
function PaginationDemo() {
  const [query, setQuery] = useState('');
  const files = Array.from({ length: 47 }, (_, index) => `${records[index % records.length].name} ${String(index + 1).padStart(2, '0')}`).filter(name => name.includes(query));
  const pagination = usePagination(files.length, query);
  return <><SearchField label="搜索分页示例文件" value={query} onChange={setQuery}/><div className="cr-pagination-list"><ul className="cr-items">{files.slice(pagination.offset, pagination.offset + pagination.pageSize).map(name => <li key={name}>{name}</li>)}</ul>{!files.length && <EmptyState title="暂无匹配文件"/>}</div><Pagination label="示例分页" total={files.length} {...pagination}/><Result>第 {pagination.page} / {Math.max(1, Math.ceil(files.length / pagination.pageSize))} 页；输入页码后按 Enter 跳转。47条演示数据用于检查跨页交互。</Result></>;
}
function RateDemo() {
  const [rating, setRating] = useState(0), [preview, setPreview] = useState(0);
  const name = useId();
  return <><fieldset className="cr-rate" onPointerLeave={() => setPreview(0)}><legend>服务评分</legend>{[1, 2, 3, 4, 5].map(n => <label key={n} data-active={n <= (preview || rating)} data-preview={preview > 0} onPointerLeave={() => setPreview(0)} onPointerEnter={event => { if (event.pointerType !== 'touch') setPreview(n); }}><input type="radio" name={name} aria-label={`${n}星`} checked={rating === n} onFocus={() => setPreview(0)} onChange={() => { setRating(n); setPreview(0); }} onKeyDown={() => setPreview(0)}/><Star size={24} aria-hidden="true"/></label>)}</fieldset><div className="cr-row"><span role="status">{preview ? `预览 ${preview} / 5 星，点击确认` : rating ? `${rating} / 5 星` : '尚未评分'}</span><Button onClick={() => { setRating(0); setPreview(0); }}>清空评分</Button></div></>;
}
function PopupDemo({ kind }: { kind: 'dropdown' | 'popover' | 'popconfirm' }) {
  const uid = useId(), trigger = useRef<HTMLButtonElement>(null), panel = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false), [result, setResult] = useState('');
  function close() { setOpen(false); trigger.current?.focus(); }
  useEffect(() => {
    if (!open) return;
    const el = panel.current, anchor = trigger.current;
    if (el && anchor) {
      const rect = anchor.getBoundingClientRect();
      if (kind === 'dropdown') el.style.setProperty('--cr-menu-trigger-width', `${rect.width}px`);
      el.showPopover();
      el.style.left = `${Math.max(16, Math.min(rect.left, innerWidth - el.offsetWidth - 16))}px`;
      el.style.top = `${rect.bottom + el.offsetHeight + 24 < innerHeight ? rect.bottom + 8 : Math.max(16, rect.top - el.offsetHeight - 8)}px`;
      el.querySelector<HTMLButtonElement>('button')?.focus();
    }
    function outside(e: PointerEvent) { if (!panel.current?.contains(e.target as Node) && !trigger.current?.contains(e.target as Node)) setOpen(false); }
    document.addEventListener('pointerdown', outside); return () => document.removeEventListener('pointerdown', outside);
  }, [open]);
  const names = { dropdown: '更多操作示例', popover: '查看卡片说明', popconfirm: '移除示例条目' };
  return <><div className="cr-popup-wrap" onKeyDown={e => { if (e.key === 'Escape') { e.preventDefault(); close(); } }} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false); }}>
    <button className="ui-button ui-button-secondary" ref={trigger} aria-expanded={open} aria-haspopup={kind === 'dropdown' ? 'menu' : 'dialog'} onClick={() => setOpen(!open)}>{names[kind]}{kind === 'dropdown' && <ChevronDown size={14}/>}</button>
    {open && <div ref={panel} id={uid} className={`cr-popup cr-popup-${kind}`} popover="manual" role={kind === 'dropdown' ? 'menu' : 'dialog'} aria-label={names[kind]} onKeyDown={e => { if (kind !== 'dropdown' || !['ArrowDown', 'ArrowUp', 'Home', 'End'].includes(e.key)) return; e.preventDefault(); const items = Array.from(e.currentTarget.querySelectorAll<HTMLButtonElement>('button:not(:disabled)')); const index = items.indexOf(document.activeElement as HTMLButtonElement); items[e.key === 'Home' ? 0 : e.key === 'End' ? items.length - 1 : (index + (e.key === 'ArrowDown' ? 1 : items.length - 1)) % items.length]?.focus(); }}>
      {kind === 'dropdown' ? <>{['查看详情', '查看名称'].map(t => <button role="menuitem" key={t} onClick={() => { setResult(t === '查看详情' ? '详情：年度工作计划 · 负责人李佳佳' : '资料名称：年度工作计划'); close(); }}>{t}</button>)}<button role="menuitem" disabled>归档（无权限）</button></> : <><strong>{kind === 'popconfirm' ? '确认移除这条示例？' : '订阅条件说明'}</strong><p>{kind === 'popconfirm' ? '只改变示例状态，可通过重置恢复。' : '根据行业、主题和来源筛选资讯。'}</p><div className="cr-row"><Button onClick={close}>{kind === 'popconfirm' ? '保留' : '知道了'}</Button>{kind === 'popconfirm' && <Button variant="danger" onClick={() => { setResult('示例条目已移除'); close(); }}>确认移除</Button>}</div></>}
    </div>}
  </div><Result>{result || '支持键盘聚焦、Escape 关闭'}</Result></>;
}
function ScrollDemo({ kind }: { kind: string }) {
  const root = useRef<HTMLDivElement>(null), sections = useRef<(HTMLElement | null)[]>([]);
  const jump = (index: number) => { if (root.current && sections.current[index]) root.current.scrollTo({ top: sections.current[index]!.offsetTop - root.current.offsetTop, behavior: 'instant' }); };
  return <><div className="cr-row">{kind === 'anchor' && ['基本信息', '业务范围', '审批记录'].map((t, i) => <button className="cr-link" key={t} onClick={() => jump(i)}>{t}</button>)}{kind === 'backtop' && <Button onClick={() => root.current?.scrollTo({ top: 0, behavior: 'instant' })}>返回示例顶部</Button>}</div><div className="cr-scroll" ref={root} tabIndex={0} aria-label="可滚动示例内容">{kind === 'affix' && <div className="cr-sticky">固定工具栏 · 随容器滚动保持可见</div>}{['基本信息', '业务范围', '审批记录'].map((t, i) => <section ref={el => { sections.current[i] = el; }} key={t}><h4>{t}</h4><p>此区域演示容器内部滚动。工具栏和锚点只影响本示例。</p><p>条目 {i + 1}：集团数字化协作项目</p></section>)}</div></>;
}
function TransferDemo() {
  const [right, setRight] = useState<string[]>(['广新研究院']), [checked, setChecked] = useState<string[]>([]), [query, setQuery] = useState('');
  const move = (toRight: boolean) => { setRight(toRight ? Array.from(new Set([...right, ...checked])) : right.filter(v => !checked.includes(v))); setChecked([]); };
  return <><SearchField label="筛选穿梭条目" value={query} onChange={setQuery}/><div className="cr-transfer">{[false, true].map(side => <React.Fragment key={String(side)}>{side && <div className="cr-transfer-actions"><Button disabled={!checked.some(v => !right.includes(v))} onClick={() => move(true)}>添加 →</Button><Button disabled={!checked.some(v => right.includes(v))} onClick={() => move(false)}>← 移回</Button></div>}<fieldset><legend>{side ? '已选' : '可选'}</legend>{choices.filter(v => right.includes(v) === side && v.includes(query)).map(v => <label className="cr-check" key={v}><input type="checkbox" checked={checked.includes(v)} onChange={e => setChecked(e.target.checked ? [...checked, v] : checked.filter(c => c !== v))}/>{v}</label>)}{!choices.some(v => right.includes(v) === side && v.includes(query)) && <p>暂无匹配条目</p>}</fieldset></React.Fragment>)}</div><Result>已选 {right.length} 项：{right.join('、') || '无'}</Result></>;
}
function TreeDemo({ select = false }: { select?: boolean }) {
  const [expanded, setExpanded] = useState(true), [selected, setSelected] = useState('集团总部'), [focus, setFocus] = useState('集团总部'), [query, setQuery] = useState('');
  const visible = ['集团总部', ...(expanded ? ['财务部', '运营部'] : [])].filter(n => n.includes(query));
  const refs = useRef<Record<string, HTMLButtonElement | null>>({});
  const move = (name: string) => { setFocus(name); refs.current[name]?.focus(); };
  return <>{select && <SearchField label="搜索组织节点" value={query} onChange={setQuery}/>}<div role="tree" aria-label={select ? '树形选择示例' : '组织树示例'} className="cr-tree">{visible.map((name, i) => <button key={name} ref={el => { refs.current[name] = el; }} role="treeitem" aria-level={name === '集团总部' ? 1 : 2} aria-posinset={name === '运营部' ? 2 : 1} aria-setsize={name === '集团总部' ? 1 : 2} aria-expanded={name === '集团总部' ? expanded : undefined} aria-selected={selected === name} tabIndex={(visible.includes(focus) ? focus : visible[0]) === name ? 0 : -1} style={{ paddingLeft: name === '集团总部' ? 12 : 28 }} onClick={() => { setSelected(name); setFocus(name); }} onKeyDown={e => { const next = e.key === 'ArrowDown' ? visible[Math.min(i + 1, visible.length - 1)] : e.key === 'ArrowUp' ? visible[Math.max(i - 1, 0)] : e.key === 'Home' ? visible[0] : e.key === 'End' ? visible[visible.length - 1] : ''; if (next) { e.preventDefault(); move(next); } if (e.key === 'ArrowRight' && name === '集团总部') { e.preventDefault(); if (expanded && visible[1]) move(visible[1]); else setExpanded(true); } if (e.key === 'ArrowLeft') { e.preventDefault(); if (name === '集团总部') setExpanded(false); else move('集团总部'); } }}><Folder size={16}/>{name}</button>)}</div>{!visible.length && <EmptyState title="没有匹配的组织"/>}<div className="cr-row"><Button onClick={() => { setExpanded(!expanded); setFocus('集团总部'); }}>{expanded ? '收起总部' : '展开总部'}</Button>{select && <Button onClick={() => setSelected('')}>清空已选组织</Button>}</div><Result>{select ? '当前值' : '选中节点'}：{selected || '无'}</Result></>;
}
function TreeSelectDemo() {
  const [open, setOpen] = useState(false), [query, setQuery] = useState(''), [value, setValue] = useState('');
  const trigger = useRef<HTMLButtonElement>(null), panel = useRef<HTMLDivElement>(null);
  const uid = useId();
  function close() { setOpen(false); trigger.current?.focus(); }
  useEffect(() => {
    if (!open || !panel.current || !trigger.current) return;
    const el = panel.current, rect = trigger.current.getBoundingClientRect(); el.showPopover();
    el.style.left = `${Math.max(16, Math.min(rect.left, innerWidth - el.offsetWidth - 16))}px`;
    el.style.top = `${rect.bottom + el.offsetHeight + 24 < innerHeight ? rect.bottom + 8 : Math.max(16, rect.top - el.offsetHeight - 8)}px`;
    el.querySelector<HTMLInputElement>('input')?.focus();
    const outside = (e: PointerEvent) => { if (!el.contains(e.target as Node) && !trigger.current?.contains(e.target as Node)) setOpen(false); };
    document.addEventListener('pointerdown', outside); return () => document.removeEventListener('pointerdown', outside);
  }, [open]);
  const names = ['财务部', '运营部'].filter(n => n.includes(query));
  return <div onKeyDown={e => { if (e.key === 'Escape') { e.preventDefault(); close(); } }} onBlur={e => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setOpen(false); }}><div className="cr-row"><button className="ui-button ui-button-secondary" ref={trigger} role="combobox" aria-label="选择组织树节点" aria-expanded={open} aria-haspopup="tree" aria-controls={uid} onClick={() => setOpen(!open)} onKeyDown={e => { if (e.key === 'ArrowDown') { e.preventDefault(); setOpen(true); } }}>{value || '请选择部门'}<ChevronDown size={14}/></button><Button disabled={!value} onClick={() => { setValue(''); trigger.current?.focus(); }}>清空部门</Button></div>
  {open && <div ref={panel} className="cr-popup cr-popup-tree" popover="manual"><SearchField label="筛选部门" value={query} onChange={setQuery}/><div id={uid} role="tree" aria-label="可选部门" className="cr-tree"><div role="treeitem" aria-expanded="true" aria-disabled="true" aria-level={1}>集团总部（请选择下级）<div role="group">{names.map((n, i) => <button key={n} role="treeitem" aria-level={2} aria-selected={value === n} aria-disabled="false" tabIndex={i === 0 ? 0 : -1} onKeyDown={e => { const options = Array.from(panel.current!.querySelectorAll<HTMLButtonElement>('button[role=treeitem]')); const next = e.key === 'ArrowDown' ? Math.min(i + 1, options.length - 1) : e.key === 'ArrowUp' ? Math.max(i - 1, 0) : e.key === 'Home' ? 0 : e.key === 'End' ? options.length - 1 : -1; if (next >= 0) { e.preventDefault(); options[next]?.focus(); } }} onClick={() => { setValue(n); close(); }}><Folder size={16}/>{n}</button>)}</div></div></div>{!names.length && <p role="status">无匹配部门</p>}</div>}
  <Result>已选：{value ? `集团总部 / ${value}` : '无'}</Result></div>;
}
function ModalDemo({ drawer = false }: { drawer?: boolean }) {
  const [open, setOpen] = useState(false), [value, setValue] = useState('年度工作计划'), [saved, setSaved] = useState('年度工作计划');
  return <><Button onClick={() => { setValue(saved); setOpen(true); }}>{drawer ? '打开抽屉示例' : '打开对话框示例'}</Button><Result>已保存：{saved}</Result>{open && <ModalSurface label={drawer ? '编辑资料抽屉' : '编辑资料对话框'} className={drawer ? 'cr-drawer' : 'cr-modal'} onClose={() => setOpen(false)}><header className="gx-dialog-header"><h2>{drawer ? '编辑资料' : '确认资料'}</h2><IconButton label="关闭资料编辑" onClick={() => setOpen(false)}><X size={18}/></IconButton></header><div className="gx-dialog-body"><Field label="资料名称" value={value} maxLength={40} onChange={e => setValue(e.target.value)}/><p className="cr-hint">取消会放弃本次修改；保存仅影响本示例。</p></div><footer className="gx-dialog-footer"><Button onClick={() => setOpen(false)}>取消</Button><Button variant="primary" disabled={!value.trim()} onClick={() => { setSaved(value.trim()); setOpen(false); }}>保存资料</Button></footer></ModalSurface>}</>;
}

/** Small, isolated examples. New patterns remain proposals until adopted by a business screen. */
export function ComponentExample({ id }: DemoProps) {
  const [value, setValue] = useState(''), [number, setNumber] = useState(30), [active, setActive] = useState(0), [on, setOn] = useState(false), [notice, setNotice] = useState(''), [end, setEnd] = useState('');
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  useEffect(() => () => clearTimeout(timer.current), []);
  const simulate = () => { setOn(true); timer.current = setTimeout(() => { setOn(false); setNotice('示例数据加载完成'); }, 1000); };
  switch (id) {
    case 'button': return <ButtonDemo/>;
    case 'icon': return <IconCatalog/>;
    case 'link': return <div className="cr-stack"><a className="cr-link" href="?view=design-system#foundations">查看基础样式</a><a className="cr-link" href="?view=portal" target="_blank" rel="noreferrer">门户资讯（新窗口）</a><span className="cr-hint">未提供链接的资料（不可访问）</span></div>;
    case 'typography': return <div className="cr-stack"><p className="cr-title">欢迎使用广智新 · 24/32</p><h4>区块标题 · 16/24 · 600</h4><p className="cr-news-title">资讯标题 · 16/24 · 400</p><p>业务正文 · 14/22 · 400</p><p className="cr-answer">AI 回答正文 · 16/28</p><small>辅助信息 · 12/18</small><span className="cr-hint">说明使用正文灰；弱提示用于非关键占位。</span></div>;
    case 'divider': return <><p>集团综合资讯</p><hr className="cr-divider"/><div className="cr-row"><span>2026-11-06</span><i className="cr-divider-vertical" aria-hidden="true"/><span>广新集团</span></div></>;
    case 'avatar': return <><div className="cr-row">{[24, 30, 40].map(size => <span className="cr-avatar" style={{ width: size, height: size }} key={size} role="img" aria-label={`用户头像占位 ${size}px`}><User size={size / 2}/></span>)}<span className="cr-avatar" role="img" aria-label="李佳佳头像">李</span></div><p className="cr-hint">无头像时显示姓名首字或默认图标；AI 对话使用 30px。</p></>;
    case 'tag': return <><div className="cr-row">{(['success', 'info', 'warning', 'danger', 'neutral'] as const).map((tone, i) => <StatusBadge key={tone} tone={tone}>{['已完成', '待处理', '待确认', '失败', '未开始'][i]}</StatusBadge>)}</div><p className="cr-hint">4px 圆角 · 600 字重 · 上下 2px / 左右 6px · 12/18</p></>;
    case 'badge': return <BadgeExample/>;
    case 'space': return <><div className="cr-row"><SelectField label="示例间距" options={['4', '8', '12', '16', '20', '24', '32']} value={value || '16'} onChange={setValue}/><span>px</span></div><div className="cr-space" style={{ gap: `${value || '16'}px` }}>{['按钮', '筛选', '搜索'].map(t => <span key={t}>{t}</span>)}</div><p className="cr-hint">空间不足自动换行，横纵间距一致。</p></>;
    case 'grid': return <><SelectField label="示例栅格列数" options={['2', '3', '4']} value={value || '3'} onChange={setValue}/><div className="cr-grid" style={{ '--cr-columns': value || '3' } as React.CSSProperties}>{Array.from({ length: 6 }, (_, i) => <div key={i}>区域 {i + 1}</div>)}</div><p className="cr-hint">示例采用 24 栅格：2 / 3 / 4 列对应 12 / 8 / 6 跨度；窄屏自动单列。</p></>;
    case 'layout': return <><Button onClick={() => setOn(!on)}>{on ? '展开示例侧栏' : '折叠示例侧栏'}</Button><div className={`cr-layout ${on ? 'is-collapsed' : ''}`}><header>Header · 顶部</header><aside>{on ? <User size={18}/> : 'Sider · 导航'}</aside><main>Content · 内容</main><footer>Footer · 说明</footer></div></>;
    case 'card': return <SystemNewsExample/>;
    case 'collapse': return <div className="cr-collapse">{['基础设置', '高级设置'].map((t, i) => <details key={t} open={active === i} onToggle={e => { if (e.currentTarget.open) setActive(i); }}><summary>{t}</summary><p>{i ? '来源、屏蔽关键词与提醒方式。' : '选择关注的行业与主题。'}</p></details>)}</div>;
    case 'split': return <SplitDemo/>;
    case 'scrollbar': case 'affix': case 'anchor': case 'backtop': return <ScrollDemo kind={id}/>;
    case 'menu': return <MenuExample/>;
    case 'tabs': return <TabsReference/>;
    case 'steps': return <StepsDemo/>;
    case 'breadcrumb': return <><nav aria-label="示例面包屑" className="cr-row"><button className="cr-link" onClick={() => setActive(0)}>知识库</button><ChevronRight size={14}/>{active ? <><button className="cr-link" onClick={() => setActive(0)}>项目资料</button><ChevronRight size={14}/><span aria-current="page">工作计划</span></> : <span aria-current="page">项目资料</span>}</nav><Button onClick={() => setActive(1)}>进入工作计划</Button></>;
    case 'pagination': return <PaginationDemo/>;
    case 'tooltip': return <TooltipExample/>;
    case 'dropdown': case 'popover': case 'popconfirm': return <PopupDemo kind={id}/>;
    case 'pageheader': return <><div className="cr-page-header"><div><button type="button" className="todo-back" onClick={() => setOn(!on)}><ChevronLeft size={16} aria-hidden="true"/><span>返回</span></button><h4>{on ? '项目列表' : '项目资料'}</h4><p>资料说明与最近更新时间</p></div><Button onClick={() => setNotice('已进入编辑状态')}>编辑资料示例</Button></div><Result>{notice}</Result></>;
    case 'input': return <div className="cr-stack"><Field label="名称" value={value} maxLength={20} onChange={e => setValue(e.target.value)} placeholder="请输入名称"/><span className="cr-hint">{value.length}/20</span><Field label="只读编号" readOnly value="GX-2026-001"/><Field label="不可编辑字段" disabled value="暂无权限"/><label className="cr-field">说明<textarea rows={3} maxLength={200} placeholder="输入多行说明"/></label></div>;
    case 'inputnumber': return <><div className="cr-field"><span>数量（0—100）</span><NumberInput label="数量（0—100）" actionLabel="数量" min={0} max={100} value={number} onChange={value => setNumber(Math.round(value))}/></div><Result>当前数量：{number}</Result></>;
    case 'select': return <><SelectField label="示例所属组织" value={value || choices[0]} onChange={setValue} options={[...choices, { value: 'archived', label: '已归档组织（禁用）', disabled: true }]}/><Result>当前组织：{value || choices[0]}</Result></>;
    case 'radio': return <RadioReference/>;
    case 'checkbox': return <CheckboxReference/>;
    case 'switch': return <SwitchReference/>;
    case 'slider': return <><label className="cr-field"><span>播放音量：{number}%</span><input type="range" style={{ '--cr-slider-fill': `${number}%` } as React.CSSProperties} min={0} max={100} step={5} value={number} onChange={e => setNumber(Number(e.target.value))}/></label><Result>方向键每次调整 5%，Home / End 到端点。</Result></>;
    case 'datetime': return <DateRangeExample/>;
    case 'cascader': return <><div className="cr-row"><SelectField label="省份" options={['广东', '浙江']} value={value || '广东'} onChange={v => { setValue(v); setEnd(''); }}/><SelectField label="城市" options={value === '浙江' ? ['杭州', '宁波'] : ['广州', '深圳']} value={end || (value === '浙江' ? '杭州' : '广州')} onChange={setEnd}/></div><Result>路径：{value || '广东'} / {end || (value === '浙江' ? '杭州' : '广州')}</Result><p className="cr-hint">改变上级会重置下级；此示例组合已有 SelectField。</p></>;
    case 'rate': return <RateDemo/>;
    case 'upload': return <SystemUploadExample/>;
    case 'form': return <SystemMeetingExample/>;
    case 'transfer': return <TransferDemo/>;
    case 'search': return <><SearchField label="搜索示例资料" placeholder="输入资料名称" value={value} onChange={setValue}/><ul className="cr-items">{records.filter(r => r.name.includes(value)).map(r => <li key={r.name}>{r.name}</li>)}</ul>{!records.some(r => r.name.includes(value)) && <EmptyState title="暂无匹配资料" action={<Button onClick={() => setValue('')}>重置资料搜索</Button>}/>}</>;
    case 'table': return <SystemTableExample/>;
    case 'tree': return <TreeDemo/>;
    case 'treeselect': return <TreeSelectDemo/>;
    case 'descriptions': return <dl className="cr-descriptions">{[['项目名称', '数字化协作平台'], ['负责人', '李佳佳'], ['所属单位', '广新集团'], ['备注', '—']].map(([k, v]) => <div key={k}><dt>{k}</dt><dd>{v}</dd></div>)}</dl>;
    case 'timeline': return <ol className="cr-timeline">{['提交申请', '部门审核通过', '等待归档'].map((t, i) => <li key={t}><span className={i === 2 ? 'is-pending' : ''} aria-hidden="true"/><div><strong>{t}</strong><small>{i === 2 ? '待处理' : `2026-11-0${i + 1} 09:00`}</small></div></li>)}</ol>;
    case 'progress': return <><label className="cr-field">任务进度：{number}%<progress max={100} value={number} aria-label="示例任务完成进度"/></label><div className="cr-row"><Button disabled={number >= 100} onClick={() => setNumber(Math.min(100, number + 10))}>推进 10%</Button><Button onClick={() => setNumber(0)}>重新开始</Button></div><Result>{number === 100 ? '演示任务已完成' : '手动模拟进度，不代表实际请求'}</Result></>;
    case 'skeleton': return <><Button onClick={simulate} loading={on}>显示骨架加载</Button><div className="cr-box" aria-busy={on}>{on ? <div className="cr-skeleton" aria-label="内容加载中"><i/><i/><i/></div> : <><h4>项目资料已就绪</h4><p>骨架保留内容位置，避免布局跳动。</p></>}</div><Result>{notice}</Result></>;
    case 'empty': return <EmptyReference/>;
    case 'statistic': return <div className="cr-stats">{[['文档总数', '1,280', '份'], ['完成率', '86.5', '%'], ['待核实', '—', '']].map(([t, n, unit]) => <div key={t}><span>{t}</span><strong>{n}<small>{unit}</small></strong></div>)}</div>;
    case 'carousel': return <SystemNewsExample carousel/>;
    case 'chart': return <><SelectField label="示例图表指标" options={['文档数量', '协作次数']} value={value || '文档数量'} onChange={setValue}/><div className="cr-chart" role="img" aria-label={`${value || '文档数量'}：总部 ${value === '协作次数' ? 32 : 24}，企运 16，研究院 12`}>{[value === '协作次数' ? 32 : 24, 16, 12].map((n, i) => <div key={i}><span>{['总部', '企运', '研究院'][i]}</span><i style={{ width: `${n * 2}%`, background: `var(--gx-${['info', 'cyan', 'purple'][i]})` }}/><b>{n}</b></div>)}</div><p className="cr-hint">示例数据；系列色用于分类，同时显示名称、数值和单位。</p></>;
    case 'alert': return <AlertExample/>;
    case 'message': return <MessageExample/>;
    case 'notification': return <NotificationExample/>;
    case 'dialog': return <><MessageBoxReference/><hr className="cr-divider"/><h4>通用 Dialog（现有规范）</h4><ModalDemo/></>;
    case 'drawer': return <ModalDemo drawer/>;
    case 'loading': return <><Button onClick={simulate} disabled={on}>加载示例数据</Button><div className="cr-box" aria-busy={on}>{on ? <div className="cr-row"><LoaderCircle size={20} className="ui-spinner" aria-hidden="true"/><span>正在加载资料…</span><Button onClick={() => { clearTimeout(timer.current); setOn(false); setNotice('已取消本次示例加载'); }}>取消加载</Button></div> : <p>{notice || '资料内容区域'}</p>}</div><Result>{on ? '正在加载' : notice}</Result></>;
    default: return <p>未定义组件示例。</p>;
  }
}
