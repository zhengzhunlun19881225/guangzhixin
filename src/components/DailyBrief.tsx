import React, { useEffect, useRef, useState } from 'react';
import { FileText, RefreshCw, Smile, X } from 'lucide-react';
import { figmaAssets } from '../data/figmaAssets';
import { dailyBrief, greetingTones } from '../data/dailyBrief';
import { sendAnniversaryGreeting } from '../data/imMessages';
import './daily-brief.css';

function GreetingDialog({ onClose, onOpenIM }: { onClose: () => void; onOpenIM: (id: string) => void }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const input = useRef<HTMLTextAreaElement>(null);
  const [tone, setTone] = useState<keyof typeof greetingTones>('简洁明了');
  const [variant, setVariant] = useState(0);
  const [text, setText] = useState(greetingTones['简洁明了'][0]);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [error, setError] = useState('');
  const sending = useRef(false);
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    const element = dialog.current!;
    element.showModal();
    return () => { element.close(); trigger?.focus(); };
  }, []);
  const send = () => {
    if (!text.trim() || text.length > 200 || sending.current) return;
    sending.current = true;
    try { const contactId = sendAnniversaryGreeting(text.trim()); onClose(); onOpenIM(contactId); }
    catch { setError('发送未成功，请重试。'); sending.current = false; }
  };
  return <dialog ref={dialog} className="brief-greeting-dialog" aria-labelledby="greeting-title" onCancel={e => { e.preventDefault(); onClose(); }} onClick={e => { if (e.target === e.currentTarget) { const r = e.currentTarget.getBoundingClientRect(); if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) onClose(); } }}>
    <header><h2 id="greeting-title">送入职周年祝福</h2><button aria-label="关闭祝福弹窗" onClick={onClose}><X size={20}/></button></header>
    <div className="greeting-body">
      <img className="greeting-banner" src="assets/workbench/anniversary-care.png" alt="入职周年快乐，感恩同行，未来可期" />
      <h3>写一条给陈晓晓的入职周年祝福</h3>
      <div className="greeting-tones" aria-label="祝福语气">{(Object.keys(greetingTones) as (keyof typeof greetingTones)[]).map(label => <button key={label} aria-pressed={tone === label} onClick={() => { setTone(label); setVariant(0); setText(greetingTones[label][0]); setError(''); }}>{label}</button>)}</div>
      <div className="greeting-editor">
        <textarea ref={input} aria-label="祝福内容" value={text} maxLength={200} onChange={e => { setText(e.target.value); setError(''); }} />
        <div className="greeting-editor-tools"><div className="greeting-emoji"><button aria-label="添加表情" aria-expanded={emojiOpen} onClick={() => setEmojiOpen(!emojiOpen)}><Smile size={20}/></button>{emojiOpen && <div className="greeting-emoji-picker" aria-label="选择表情">{['🎉', '🎂', '🌟', '❤️', '👏', '😊'].map(emoji => <button key={emoji} aria-label={`插入 ${emoji}`} disabled={text.length + emoji.length > 200} onClick={() => { const start = input.current?.selectionStart ?? text.length; const end = input.current?.selectionEnd ?? start; setText(text.slice(0, start) + emoji + text.slice(end)); setEmojiOpen(false); requestAnimationFrame(() => { input.current?.focus(); input.current?.setSelectionRange(start + emoji.length, start + emoji.length); }); }}>{emoji}</button>)}</div>}</div><button className="greeting-refresh" onClick={() => { const next = (variant + 1) % greetingTones[tone].length; setVariant(next); setText(greetingTones[tone][next]); setError(''); }}><RefreshCw size={15}/>换一换</button><span aria-live="polite">{text.length}/200</span></div>
      </div>
      {error && <p role="alert" className="greeting-error">{error}</p>}
    </div>
    <footer><span>发送给：陈晓晓</span><button className="greeting-send" disabled={!text.trim() || text.length > 200} onClick={send}>发送IM祝福</button></footer>
  </dialog>;
}
export function DailyBrief({ onOpenIM }: { onOpenIM: (id: string) => void }) {
  const [greetingOpen, setGreetingOpen] = useState(false);
  return <section className="brief-column daily-brief" aria-label="AI今日简报">
    <header className="daily-brief-header">
    <div className="wb-greeting"><img src={figmaAssets['71-3450:imgAdfdbdb61B8D4E259A82Cf7F5Fd71853']} alt=""/><div><h2>早上好，张部长</h2><p>{dailyBrief.date}</p></div></div>
      <h3><img src="assets/workbench/heading-brief.png" alt=""/>AI今日简报<small>信息截至 08:00</small></h3>
    </header>
    <div className="wb-brief daily-brief-content" role="region" aria-label="简报内容" tabIndex={0}>
      <article><h4><span className="brief-icon red"><FileText size={14}/></span>今天的导读</h4><div><p>{dailyBrief.introduction}</p></div></article>
      <article className="brief-care"><h4><span className="brief-icon red"><FileText size={14}/></span>员工关怀</h4><img className="brief-care-banner" src="assets/workbench/anniversary-care.png" alt="入职周年快乐，感恩同行，未来可期"/><div><h5>今天是陈晓晓的入职 1 周年</h5><p>根据入职时间记录，您的同事「陈晓晓」今天在公司工作满 1 年。感谢陈晓晓一直以来的付出，也欢迎您在部门内送上感谢与鼓励。</p></div><footer><button className="brief-write-thanks" onClick={() => setGreetingOpen(true)}>AI 帮写感谢</button></footer></article>
      {dailyBrief.sections.map(section => <article key={section.title}><h4><span className={`brief-icon ${section.color}`}><FileText size={14}/></span>{section.title}</h4><div>{section.items.map((item, index) => <div className="brief-item" key={index}>{item.title && <h5>{item.title}</h5>}<p>{item.text}</p></div>)}</div></article>)}
    </div>
    {greetingOpen && <GreetingDialog onClose={() => setGreetingOpen(false)} onOpenIM={onOpenIM}/>}
  </section>;
}
