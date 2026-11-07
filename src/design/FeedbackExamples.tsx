import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { Button } from '../components/UI';
import { SelectField } from '../components/SelectField';
import infoIcon from '../assets/feedback/info.svg';
import successIcon from '../assets/feedback/success.svg';
import warningIcon from '../assets/feedback/warning.svg';
import dangerIcon from '../assets/feedback/danger.svg';
import closeIcon from '../assets/feedback/close.svg';
import './feedback-examples.css';

type Tone = 'info' | 'success' | 'warning' | 'danger';
const tones: Tone[] = ['info', 'success', 'warning', 'danger'];
const names: Record<Tone, string> = { info: '信息', success: '成功', warning: '警告', danger: '错误' };
const glyphs = { info: infoIcon, success: successIcon, warning: warningIcon, danger: dangerIcon };
// Use the exported Figma glyphs as masks so the approved semantic palette stays authoritative.
function FeedbackIcon({ tone }: { tone: Tone }) {
  return <span className="cr-feedback-icon" data-tone={tone} aria-hidden="true"><i style={{ maskImage: `url(${JSON.stringify(glyphs[tone])})`, WebkitMaskImage: `url(${JSON.stringify(glyphs[tone])})` }}/></span>;
}
function Close({ label, onClose }: { label: string; onClose: () => void }) {
  return <button type="button" className="cr-feedback-close" aria-label={label} onClick={onClose}><i style={{ maskImage: `url(${JSON.stringify(closeIcon)})`, WebkitMaskImage: `url(${JSON.stringify(closeIcon)})` }} aria-hidden="true"/></button>;
}
const alertContent: Record<Tone, { short: string; title: string; description: string }> = {
  info: { short: '你好！欢迎使用专业版，你可以根据自身需求添加业务模块。', title: '帮助信息', description: '你好，由于你的良好信用，我们决定赠送你三个月产品会员。' },
  success: { short: '恭喜！你所提交的信息已经审核通过，如有问题请联系客服。', title: '已成功！', description: '你所提交的信息已经审核通过，请及时跟进申请状况。如有问题，请联系审核人员。' },
  warning: { short: '系统将于 15:00 - 17:00 进行升级，请及时保存你的资料！', title: '请注意！', description: '你账户使用权限将在3天后到期，请及时跟进申请状况。如有问题，请联系审核人员。' },
  danger: { short: '系统错误，请稍后重试。', title: '出错了！', description: '这是一句绕口令：黑灰化肥会挥发发灰黑化肥挥发；灰黑化肥会挥发发黑灰化肥……' },
};
export function AlertExample() {
  const [dismissed, setDismissed] = useState<string[]>([]);
  const [notice, setNotice] = useState('');
  return <div className="cr-feedback cr-alert-examples">
    <h4>基本用法</h4><p className="cr-feedback-description">页面中的非浮层元素，不会自动消失。</p>
    {[false, true].map(detailed => <React.Fragment key={String(detailed)}>
      {detailed && <h4 className="cr-feedback-heading">带有图标和辅助性文字介绍</h4>}
      <div className="cr-feedback-stack">{tones.map(tone => {
        const key = `${tone}-${detailed}`, item = alertContent[tone];
        return dismissed.includes(key) ? null : <div key={key} className={`cr-alert ${detailed ? 'cr-alert-detailed' : ''}`} data-tone={tone}>
          <FeedbackIcon tone={tone}/><div className="cr-alert-copy">{detailed ? <><h5>{item.title}</h5><p>{item.description}</p></> : <p>{item.short}</p>}</div>
          <Close label={`关闭${names[tone]}${detailed ? '说明' : '提示'}`} onClose={() => { setDismissed(v => [...v, key]); setNotice(`已关闭${names[tone]}${detailed ? '说明' : '提示'}`); }}/>
        </div>;
      })}</div>
    </React.Fragment>)}
    <div className="cr-row"><Button disabled={!dismissed.length} onClick={() => { setDismissed([]); setNotice('已恢复全部提示'); }}>恢复全部提示</Button><span className="cr-hint" role="status">{notice}</span></div>
  </div>;
}

function MessageCard({ tone, children }: { tone: Tone; children: React.ReactNode }) {
  return <div className="cr-message" data-tone={tone}><FeedbackIcon tone={tone}/><span>{children}</span></div>;
}
const messageContent: Record<Tone, string> = {
  success: '这是一条消息，会主动消失', info: '这是一条很长询问消息，会主动消失',
  warning: '这是一条很长很长很长很长询问消息，会主动消失', danger: '这是一条很长很长很长很长很长询问消息，会主动消失',
};
/** A native top-layer container avoids clipping in the independently scrolling spec page. */
function FeedbackOverlay({ className, children, label }: { className: string; children: React.ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => { const node = ref.current!; node.showPopover(); return () => { if (node.isConnected && node.matches(':popover-open')) node.hidePopover(); }; }, []);
  return <div ref={ref} popover="manual" className={`cr-feedback-overlay ${className}`} aria-label={label}>{children}</div>;
}
export function MessageExample() {
  const [message, setMessage] = useState<{ tone: Tone; serial: number } | null>(null);
  const counter = useRef(0);
  useEffect(() => {
    if (!message) return;
    const timer = setTimeout(() => setMessage(null), 3000);
    const escape = (e: KeyboardEvent) => { if (e.key === 'Escape' && !e.defaultPrevented) setMessage(null); };
    document.addEventListener('keydown', escape);
    return () => { clearTimeout(timer); document.removeEventListener('keydown', escape); };
  }, [message]);
  return <div className="cr-feedback">
    <h4>基础用法</h4><p className="cr-feedback-description">从顶部出现，3 秒后自动消失。</p>
    <div className="cr-message-examples">{(['success', 'info', 'warning', 'danger'] as Tone[]).map(tone => <MessageCard key={tone} tone={tone}>{messageContent[tone]}</MessageCard>)}</div>
    <div className="cr-row cr-feedback-actions">{(['success', 'info', 'warning', 'danger'] as Tone[]).map(tone => <Button key={tone} onClick={() => setMessage({ tone, serial: ++counter.current })}>{tone === 'danger' ? '显示失败轻提示' : `显示${names[tone]}轻提示`}</Button>)}</div>
    <p className="cr-hint">上方为外观示例；点击按钮体验顶部提示。重复触发更新当前提示并重新计时。</p>
    {message && <FeedbackOverlay className="cr-message-overlay" label="轻提示"><div key={message.serial} role="status" aria-live="polite"><MessageCard tone={message.tone}>{messageContent[message.tone]}</MessageCard></div></FeedbackOverlay>}
  </div>;
}

type NotificationTone = Tone | 'neutral';
function NotificationCard({ tone, title = '提示', description, onClose, live = false }: { tone: NotificationTone; title?: string; description: string; onClose?: () => void; live?: boolean }) {
  return <div className="cr-notification" data-tone={tone} role={live ? 'status' : undefined}>
    {tone !== 'neutral' && <FeedbackIcon tone={tone}/>}
    <div className="cr-notification-copy"><h5>{title}</h5><p>{description}</p></div>
    {onClose && <Close label={live ? '关闭通知示例' : `关闭${tone === 'neutral' ? '通用' : names[tone]}通知样式`} onClose={onClose}/>}
  </div>;
}
const notificationDescriptions: Record<NotificationTone, string> = { neutral: '这是一条通用的提示消息', success: '这是一条成功消息', info: '这是一条信息提示消息', warning: '这是一条警告消息', danger: '这是一条错误消息' };
const corners = [{ value: 'top-right', label: '右上角' }, { value: 'bottom-right', label: '右下角' }, { value: 'top-left', label: '左上角' }, { value: 'bottom-left', label: '左下角' }];
export function NotificationExample() {
  const [dismissed, setDismissed] = useState<string[]>([]), [mode, setMode] = useState('manual'), [tone, setTone] = useState<NotificationTone>('neutral'), [corner, setCorner] = useState('top-right');
  const [notice, setNotice] = useState<{ tone: NotificationTone; auto: boolean; corner: string; serial: number } | null>(null);
  const [paused, setPaused] = useState(false);
  const remaining = useRef(4500), sequence = useRef(0), timingSerial = useRef(0), trigger = useRef<HTMLButtonElement>(null);
  const close = () => { const focusedInside = document.activeElement?.closest('.cr-notification-overlay'); setNotice(null); if (focusedInside) trigger.current?.focus(); };
  useEffect(() => {
    if (notice && timingSerial.current !== notice.serial) { timingSerial.current = notice.serial; remaining.current = 4500; }
    if (!notice?.auto || paused) return;
    const start = performance.now(); const timer = setTimeout(() => setNotice(null), remaining.current);
    return () => { clearTimeout(timer); remaining.current = Math.max(0, remaining.current - (performance.now() - start)); };
  }, [notice, paused]);
  useEffect(() => {
    if (!notice) return;
    const escape = (e: KeyboardEvent) => { if (e.key === 'Escape' && !e.defaultPrevented) close(); };
    document.addEventListener('keydown', escape); return () => document.removeEventListener('keydown', escape);
  }, [notice]);
  const show = () => { setPaused(false); setNotice({ tone, auto: mode === 'auto', corner, serial: ++sequence.current }); };
  const sample = (key: string, tone: NotificationTone, auto: boolean, description: string) => dismissed.includes(key) ? <div className="cr-notification-removed">已关闭<Button variant="text" onClick={() => setDismissed(v => v.filter(id => id !== key))}>恢复样式</Button></div> : <NotificationCard tone={tone} title={tone === 'neutral' ? '提示' : '标题名称'} description={description} onClose={auto ? undefined : () => setDismissed(v => [...v, key])}/>;
  return <div className="cr-feedback">
    <h4>基本用法</h4><p className="cr-feedback-description">悬浮出现在页面角落，显示全局的通知提醒消息。</p>
    <div className="cr-notification-grid">{[false, true].map(auto => <div className="cr-notification-column" key={String(auto)}><h5>{auto ? '自动关闭' : '不会自动关闭'}</h5>{sample(`neutral-${auto}`, 'neutral', auto, notificationDescriptions.neutral)}{sample(`long-${auto}`, 'neutral', auto, '这是一条比较长的通用的提示消息，这是一条比较长的通用的提示消息')}</div>)}</div>
    <h4 className="cr-feedback-heading">带有倾向性</h4><p className="cr-feedback-description">带有图标，用于成功、信息、警告和错误等系统消息。</p>
    <div className="cr-notification-grid">{[false, true].map(auto => <div className="cr-notification-column" key={String(auto)}><h5>{auto ? '自动关闭' : '不会自动关闭'}</h5>{(['success', 'info', 'warning', 'danger'] as Tone[]).map(t => <React.Fragment key={t}>{sample(`${t}-${auto}`, t, auto, notificationDescriptions[t])}</React.Fragment>)}</div>)}</div>
    <div className="cr-row cr-feedback-actions"><SelectField label="通知类型" options={[{ value: 'neutral', label: '通用提示' }, ...tones.map(t => ({ value: t, label: names[t] }))]} value={tone} onChange={v => setTone(v as NotificationTone)}/><SelectField label="通知关闭方式" options={[{ value: 'manual', label: '手动关闭' }, { value: 'auto', label: '自动关闭（4.5秒）' }]} value={mode} onChange={setMode}/><SelectField label="通知位置" options={corners} value={corner} onChange={setCorner}/></div>
    <button ref={trigger} className="ui-button ui-button-secondary" type="button" onClick={show}>显示通知示例</button>
    <p className="cr-hint">上方为常驻样式预览；点击按钮体验实际角落通知。自动关闭通知在鼠标移入时暂停计时。</p>
    {notice && <FeedbackOverlay className={`cr-notification-overlay cr-corner-${notice.corner}`} label="通知示例"><div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}><NotificationCard tone={notice.tone} title={notice.tone === 'neutral' ? '提示' : '标题名称'} description={notificationDescriptions[notice.tone]} onClose={notice.auto ? undefined : close} live/></div></FeedbackOverlay>}
  </div>;
}

type Placement = 'top-start' | 'top' | 'top-end' | 'left' | 'right' | 'bottom-start' | 'bottom' | 'bottom-end';
const placements: { value: Placement; label: string; row: number; col: number }[] = [
  { value: 'top-start', label: 'Top Left', row: 1, col: 1 }, { value: 'top', label: 'Top Center', row: 1, col: 2 }, { value: 'top-end', label: 'Top Right', row: 1, col: 3 },
  { value: 'left', label: 'Left Center', row: 2, col: 1 }, { value: 'right', label: 'Right Center', row: 2, col: 3 },
  { value: 'bottom-start', label: 'Bottom Left', row: 3, col: 1 }, { value: 'bottom', label: 'Bottom Center', row: 3, col: 2 }, { value: 'bottom-end', label: 'Bottom Right', row: 3, col: 3 },
];
function TooltipTrigger({ placement, content, children }: { placement: Placement; content: string; children: React.ReactNode }) {
  const [open, setOpen] = useState(false), [side, setSide] = useState(placement.split('-')[0]);
  const trigger = useRef<HTMLButtonElement>(null), bubble = useRef<HTMLDivElement>(null), timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined), hover = useRef(false);
  const id = useId();
  const cancel = () => clearTimeout(timer.current);
  const hide = () => { cancel(); setOpen(false); };
  useEffect(() => () => cancel(), []);
  useLayoutEffect(() => {
    if (!open || !bubble.current || !trigger.current) return;
    const panel = bubble.current; panel.showPopover();
    const position = () => {
      const rect = trigger.current!.getBoundingClientRect();
      const width = panel.offsetWidth, height = panel.offsetHeight, margin = 12, gap = 8;
      let edge = placement.split('-')[0];
      if (edge === 'top' && rect.top < height + gap + margin) edge = 'bottom';
      else if (edge === 'bottom' && innerHeight - rect.bottom < height + gap + margin) edge = 'top';
      else if (edge === 'left' && rect.left < width + gap + margin) edge = 'right';
      else if (edge === 'right' && innerWidth - rect.right < width + gap + margin) edge = 'left';
      const vertical = edge === 'top' || edge === 'bottom';
      let x = vertical ? placement.endsWith('start') ? rect.left : placement.endsWith('end') ? rect.right - width : rect.left + (rect.width - width) / 2 : edge === 'left' ? rect.left - width - gap : rect.right + gap;
      let y = vertical ? edge === 'top' ? rect.top - height - gap : rect.bottom + gap : rect.top + (rect.height - height) / 2;
      x = Math.max(margin, Math.min(x, innerWidth - width - margin)); y = Math.max(margin, Math.min(y, innerHeight - height - margin));
      panel.style.left = `${x}px`; panel.style.top = `${y}px`;
      panel.style.setProperty('--cr-arrow-offset', `${Math.max(10, Math.min(vertical ? width - 10 : height - 10, vertical ? rect.left + rect.width / 2 - x : rect.top + rect.height / 2 - y))}px`);
      setSide(edge);
    };
    position(); window.addEventListener('resize', position); document.addEventListener('scroll', position, true);
    return () => { window.removeEventListener('resize', position); document.removeEventListener('scroll', position, true); if (panel.isConnected && panel.matches(':popover-open')) panel.hidePopover(); };
  }, [open, placement]);
  const leave = () => { hover.current = false; cancel(); if (document.activeElement !== trigger.current) timer.current = setTimeout(() => setOpen(false), 100); };
  return <span className="cr-tooltip-trigger"><button type="button" ref={trigger} className="ui-button ui-button-secondary" aria-describedby={open ? id : undefined} onMouseEnter={() => { hover.current = true; cancel(); timer.current = setTimeout(() => setOpen(true), 150); }} onMouseLeave={leave} onFocus={() => { cancel(); setOpen(true); }} onBlur={() => { if (!hover.current) hide(); }} onClick={() => { cancel(); setOpen(true); }} onKeyDown={e => { if (e.key === 'Escape') { e.preventDefault(); hide(); } }}>{children}</button>
    {open && <div ref={bubble} popover="manual" id={id} role="tooltip" className="cr-tooltip-bubble cr-tooltip-live" data-side={side} onMouseEnter={() => { hover.current = true; cancel(); }} onMouseLeave={leave}>{content}<i className="cr-tooltip-arrow" aria-hidden="true"/></div>}
  </span>;
}
export function TooltipExample() {
  const [placement, setPlacement] = useState<Placement>('top');
  return <div className="cr-feedback">
    <h4>基本用法</h4><p className="cr-feedback-description">常用于鼠标悬浮或键盘聚焦时补充简短说明。</p>
    <div className="cr-tooltip-directions" aria-label="八个提示方向">{placements.map(p => <div key={p.value} className="cr-tooltip-bubble" data-side={p.value.split('-')[0]} data-align={p.value.endsWith('start') ? 'start' : p.value.endsWith('end') ? 'end' : 'center'} style={{ gridRow: p.row, gridColumn: p.col }}>{p.label} 提示文字<i className="cr-tooltip-arrow" aria-hidden="true"/></div>)}</div>
    <div className="cr-row cr-feedback-actions"><SelectField label="提示方向" options={placements} value={placement} onChange={v => setPlacement(v as Placement)}/><TooltipTrigger placement={placement} content={`${placements.find(p => p.value === placement)?.label} 提示文字`}>查看提示</TooltipTrigger></div>
    <p className="cr-hint">按 Tab 聚焦查看，Escape 关闭；贴近视口边缘时自动翻转或调整位置。</p>
  </div>;
}
