import React, { useEffect, useId, useRef, useState } from 'react';
import { X } from 'lucide-react';
import warningGlyph from '../assets/feedback/warning.svg';
import emptyImage from '../assets/spec/empty-reference.png';
import './reference-patterns.css';

// Review-only patterns. These deliberately do not change shared business controls.
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return <section className="rp-section"><h4>{title}</h4>{children}</section>;
}
function Choice({ type = 'checkbox', children, mixed = false, boxed = false, ...props }: React.InputHTMLAttributes<HTMLInputElement> & { mixed?: boolean; boxed?: boolean }) {
  const ref = useRef<HTMLInputElement>(null);
  useEffect(() => { if (ref.current) ref.current.indeterminate = mixed; }, [mixed]);
  return <label className={`rp-choice ${boxed ? 'rp-choice-box' : ''}`} data-selected={!!props.checked || mixed} data-disabled={!!props.disabled} data-mixed={mixed}>
    <input {...props} ref={ref} data-custom-checkbox={type === 'checkbox' ? '' : undefined} type={type} aria-checked={mixed ? 'mixed' : props.checked}/>
    <span className={`rp-choice-glyph rp-${type}`} aria-hidden="true">{type === 'radio' && <i/>}</span><span>{children}</span>
  </label>;
}
function RadioGroup({ label, options, initial = 0, appearance = 'plain', disabled = false }: { label: string; options: string[]; initial?: number; appearance?: 'plain' | 'boxed' | 'segment' | 'pill'; disabled?: boolean }) {
  const [value, setValue] = useState(initial); const uid = useId();
  return <fieldset className={`rp-radio-group rp-radio-${appearance}`} aria-label={label}>{options.map((option, index) => appearance === 'segment' || appearance === 'pill'
    ? <label key={option} className="rp-radio-button" data-selected={value === index}><input type="radio" name={uid} checked={value === index} disabled={disabled} onChange={() => setValue(index)}/><span>{option}</span></label>
    : <Choice key={option} type="radio" name={uid} checked={value === index} disabled={disabled} boxed={appearance === 'boxed'} onChange={() => setValue(index)}>{option}</Choice>)}</fieldset>;
}
export function RadioReference() {
  return <div className="rp-reference"><Section title="基础用法"><RadioGroup label="基础单选" options={['备选', '已选']} initial={1}/></Section>
    <Section title="禁用状态"><RadioGroup label="禁用单选" options={['禁选（未选）', '禁选（已选）']} initial={1} disabled/></Section>
    <Section title="带有边框"><RadioGroup label="边框单选" options={['已选项', '备选项']} appearance="boxed"/><RadioGroup label="禁用边框单选" options={['备选项（已选）', '备选项（未选）']} appearance="boxed" disabled/></Section>
    <Section title="按钮样式"><RadioGroup label="状态单选" options={['待办', '已办', '消息']} appearance="segment"/><RadioGroup label="工作区单选" options={['工作台', '广新门户', 'IM']} appearance="pill"/></Section></div>;
}
function IndependentCheck({ label, initial = false, mixed = false, disabled = false, boxed = false }: { label: string; initial?: boolean; mixed?: boolean; disabled?: boolean; boxed?: boolean }) {
  const [checked, setChecked] = useState(initial), [half, setHalf] = useState(mixed);
  return <Choice checked={checked} mixed={half} disabled={disabled} boxed={boxed} onChange={e => { setHalf(false); setChecked(e.target.checked); }}>{label}</Choice>;
}
export function CheckboxReference() {
  const [values, setValues] = useState(['人工智能']); const options = ['人工智能', '制造业', '新材料'];
  return <div className="rp-reference"><Section title="基础用法"><div className="rp-row"><IndependentCheck label="备选项"/><IndependentCheck label="已选" initial/><IndependentCheck label="半选" mixed/></div></Section>
    <Section title="禁用状态"><div className="rp-row"><IndependentCheck label="禁用未选" disabled/><IndependentCheck label="禁用已选" disabled initial/><IndependentCheck label="禁用半选" disabled mixed/></div></Section>
    <Section title="多选框组"><div className="rp-checkbox-group"><Choice checked={values.length === options.length} mixed={values.length > 0 && values.length < options.length} onChange={e => setValues(e.target.checked ? options : [])}>全选行业</Choice><div className="rp-row">{options.map(option => <Choice key={option} checked={values.includes(option)} onChange={e => setValues(e.target.checked ? [...values, option] : values.filter(v => v !== option))}>{option}</Choice>)}</div><p className="rp-status" role="status">已选：{values.join('、') || '无'}</p></div></Section>
    <Section title="带有边框"><div className="rp-row"><IndependentCheck label="边框已选" initial boxed/><IndependentCheck label="边框备选" boxed/></div><div className="rp-row"><IndependentCheck label="边框禁用已选" initial boxed disabled/><IndependentCheck label="边框禁用未选" boxed disabled/></div></Section></div>;
}
function SwitchControl({ label, tone = 'info', initial = false, disabled = false, left, right }: { label: string; tone?: 'info' | 'success'; initial?: boolean; disabled?: boolean; left?: string; right?: string }) {
  const [on, setOn] = useState(initial);
  return <label className="rp-switch-label" data-disabled={disabled}>{left && <span>{left}</span>}<input type="checkbox" role="switch" aria-label={label} checked={on} disabled={disabled} onChange={e => setOn(e.target.checked)}/><span className="rp-switch-track" data-tone={tone} aria-hidden="true"/>{right && <span>{right}</span>}</label>;
}
export function SwitchReference() {
  return <div className="rp-reference"><Section title="基础用法"><div className="rp-row"><SwitchControl label="蓝色开关" initial/><SwitchControl label="绿色开关" tone="success" initial/></div></Section>
    <Section title="文字描述"><div className="rp-row rp-switch-descriptions"><SwitchControl label="接收提醒" tone="success" left="关闭" right="开启"/><SwitchControl label="自动同步" tone="success" left="关闭" right="开启" initial/><SwitchControl label="蓝色文字开关" left="左边文字" right="右边文字" initial/><SwitchControl label="灰色文字开关" left="左边文字" right="右边文字"/></div></Section>
    <Section title="禁用状态"><div className="rp-row"><SwitchControl label="禁用蓝色开启" initial disabled/><SwitchControl label="禁用绿色开启" tone="success" initial disabled/><SwitchControl label="禁用关闭" disabled/></div></Section></div>;
}
function ReferenceTabs({ pill = false }: { pill?: boolean }) {
  const options = pill ? ['全部', '常用', '热门', '官方', '个人', '组织', '法务', '财务', '人力'] : ['推荐', '我关注的', '与我有关', '集团要闻', '行业趋势', '政策法规'];
  const [active, setActive] = useState(0); const uid = useId(); const refs = useRef<(HTMLButtonElement | null)[]>([]);
  return <div className="rp-tab-example"><div className={`rp-tabs ${pill ? 'rp-tabs-pill' : 'rp-tabs-line'}`} role="tablist" aria-label={pill ? '分类示例页签' : '资讯示例页签'}>{options.map((label, index) => <button type="button" key={label} ref={el => { refs.current[index] = el; }} role="tab" id={`${uid}-tab-${index}`} aria-selected={active === index} aria-controls={`${uid}-panel`} tabIndex={active === index ? 0 : -1} onClick={() => setActive(index)} onKeyDown={e => {
    const next = e.key === 'ArrowRight' ? (index + 1) % options.length : e.key === 'ArrowLeft' ? (index + options.length - 1) % options.length : e.key === 'Home' ? 0 : e.key === 'End' ? options.length - 1 : -1;
    if (next >= 0) { e.preventDefault(); setActive(next); refs.current[next]?.focus(); }
  }}>{label}</button>)}</div><div className="rp-tab-panel" role="tabpanel" id={`${uid}-panel`} aria-labelledby={`${uid}-tab-${active}`} tabIndex={0}>{pill ? `${options[active]}：分类内容示例` : ['推荐：产业协同与业务创新', '我关注的：广东新材料政策', '与我有关：供应链管理动态', '集团要闻：集团业务动态', '行业趋势：行业观察', '政策法规：政策解读'][active]}</div></div>;
}
export function TabsReference() { return <div className="rp-reference"><Section title="下划线样式"><ReferenceTabs/></Section><Section title="胶囊样式"><ReferenceTabs pill/></Section></div>; }
export function EmptyReference() {
  const [added, setAdded] = useState(false);
  return <div className="rp-reference rp-empty-columns"><Section title="基础用法"><div className="rp-empty"><img src={emptyImage} alt=""/><p>暂无数据</p></div></Section><Section title="带按钮">{added ? <div className="rp-empty"><p role="status">已添加一条示例数据</p><button className="rp-secondary" onClick={() => setAdded(false)}>恢复空状态</button></div> : <div className="rp-empty"><img src={emptyImage} alt=""/><p>暂无数据</p><button className="rp-primary" onClick={() => setAdded(true)}>添加示例数据</button></div>}</Section></div>;
}

type BoxKind = 'short' | 'long' | 'confirm' | 'prompt';
const boxTitle = { short: '标题名称', long: '标题名称', confirm: '批量删除确认', prompt: '重置密码' };
function BoxContent({ kind, onClose, onConfirm, live = false }: { kind: BoxKind; onClose: () => void; onConfirm: () => void; live?: boolean }) {
  const [value, setValue] = useState(''), [error, setError] = useState(false); const input = useRef<HTMLInputElement>(null); const uid = useId();
  const submit = (e: React.FormEvent) => { e.preventDefault(); if (kind === 'prompt' && !value.trim()) { setError(true); input.current?.focus(); return; } onConfirm(); };
  return <form className="rp-messagebox-content" onSubmit={submit} noValidate><header><h5>{boxTitle[kind]}</h5><button type="button" className="rp-box-close" aria-label={`关闭${boxTitle[kind]}`} onClick={onClose}><X size={16}/></button></header><div className="rp-messagebox-body">
    {kind === 'prompt' ? <label className="rp-password" htmlFor={uid}>重置后的密码 <span className="rp-required">*</span><input ref={input} id={uid} type="password" autoComplete="new-password" placeholder="请输入" required value={value} aria-invalid={error} aria-describedby={error ? `${uid}-error` : undefined} onChange={e => { setValue(e.target.value); setError(false); }}/>{error && <span id={`${uid}-error`} className="rp-error" role="alert">请输入重置后的密码</span>}</label>
      : kind === 'confirm' ? <p className="rp-confirm-copy"><span className="rp-confirm-icon" aria-hidden="true" style={{ maskImage: `url(${JSON.stringify(warningGlyph)})`, WebkitMaskImage: `url(${JSON.stringify(warningGlyph)})` }}/>此操作将永久删除该文件，是否继续？</p> : <p>{kind === 'short' ? '这是一段比较短的示例文字' : '这是一段比较长的示例文字，这是一段比较长的示例文字，这是一段比较长的示例文字。'}</p>}
    </div><footer>{(kind === 'confirm' || kind === 'prompt') && <button type="button" className="rp-secondary" onClick={onClose}>取消</button>}<button type="submit" className="rp-primary">确定</button></footer></form>;
}
function BoxOverlay({ kind, onClose, onConfirm }: { kind: BoxKind; onClose: () => void; onConfirm: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const trigger = document.activeElement as HTMLElement; const node = ref.current!; node.showModal(); if (kind === 'prompt') node.querySelector('input')?.focus(); else node.querySelector<HTMLButtonElement>('button[type=submit]')?.focus(); return () => { node.close(); trigger?.focus(); }; }, []);
  return <dialog ref={ref} className="rp-messagebox rp-messagebox-live" aria-label={boxTitle[kind]} onCancel={e => { e.preventDefault(); onClose(); }}><BoxContent kind={kind} live onClose={onClose} onConfirm={onConfirm}/></dialog>;
}
export function MessageBoxReference() {
  const [open, setOpen] = useState<BoxKind | null>(null), [result, setResult] = useState('');
  const sample = (kind: BoxKind) => <div className="rp-messagebox" key={kind} aria-label={`${boxTitle[kind]}外观示例`}><BoxContent kind={kind} onClose={() => setResult('外观示例保持展示；可点击下方按钮体验关闭。')} onConfirm={() => setResult('已确认外观示例；不执行实际操作。')}/></div>;
  return <div className="rp-reference rp-messageboxes"><p className="rp-review-note">MessageBox 轻量弹框 · 待确认规范示例</p><Section title="消息提示"><div className="rp-box-grid">{sample('short')}{sample('long')}</div><div className="rp-row"><button className="rp-secondary" onClick={() => setOpen('short')}>打开消息提示</button><button className="rp-secondary" onClick={() => setOpen('long')}>打开长消息提示</button></div></Section>
    <Section title="确认消息">{sample('confirm')}<button className="rp-secondary rp-launch" onClick={() => setOpen('confirm')}>打开确认消息</button></Section>
    <Section title="提交内容">{sample('prompt')}<button className="rp-secondary rp-launch" onClick={() => setOpen('prompt')}>打开输入弹框</button></Section>
    <p className="rp-status" role="status">{result || '示例仅在当前预览内运行，不删除文件、不保存密码。'}</p>
    {open && <BoxOverlay kind={open} onClose={() => { setOpen(null); setResult('已取消示例操作'); }} onConfirm={() => { setResult(open === 'prompt' ? '输入校验通过，已完成示例；未保存密码。' : '已确认示例操作'); setOpen(null); }}/>}</div>;
}
