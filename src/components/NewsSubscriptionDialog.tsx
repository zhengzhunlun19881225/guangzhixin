import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, RotateCcw, SlidersHorizontal, Sparkles, X } from 'lucide-react';
import { Button } from './UI';
import { SelectField } from './SelectField';
import { ChoiceKey, defaultSubscription, generateSubscription, NewsSubscription, subscriptionKey, subscriptionOptions } from '../data/newsSubscription';
import './news-subscription.css';

type Props = { initial: NewsSubscription | null; onClose: () => void; onSave: (settings: NewsSubscription) => void };
const examples = ['关注人工智能、制造业和国产算力，每天更新', '每周关注广东新材料政策，只看政府网站，排除娱乐'];
export function NewsSubscriptionDialog({ initial, onClose, onSave }: Props) {
  const dialog = useRef<HTMLDialogElement>(null);
  const content = useRef<HTMLDivElement>(null);
  const [draft, setDraft] = useState<NewsSubscription>(() => initial ? structuredClone(initial) : defaultSubscription());
  const [mode, setMode] = useState<'manual' | 'ai'>('manual');
  const [advanced, setAdvanced] = useState(false);
  const [prompt, setPrompt] = useState('');
  const [recognized, setRecognized] = useState<string[]>([]);
  const [error, setError] = useState('');
  const [invalid, setInvalid] = useState<ChoiceKey | null>(null);
  const [notice, setNotice] = useState('');
  useEffect(() => {
    const element = dialog.current!;
    const trigger = document.activeElement as HTMLElement | null;
    element.showModal();
    return () => { element.close(); trigger?.focus(); };
  }, []);
  const update = <K extends keyof NewsSubscription>(key: K, value: NewsSubscription[K]) => {
    setDraft(current => ({ ...current, [key]: value })); setError(''); setInvalid(null); setNotice('');
  };
  const changeMode = (next: 'manual' | 'ai') => { setMode(next); setError(''); setInvalid(null); content.current?.scrollTo({ top: 0 }); };
  const changePrompt = (value: string) => { setPrompt(value); setRecognized([]); setError(''); };
  const generate = () => {
    const result = generateSubscription(prompt, draft);
    if (!result) { setError('未识别到订阅条件，请补充行业、主题、地区或更新频率，或切换到手动订阅。'); return; }
    setDraft(result.settings); setRecognized(result.recognized); setError('');
  };
  const save = (event: React.FormEvent) => {
    event.preventDefault();
    for (const key of ['industries', 'topics'] as const) {
      if (!draft[key].length) {
        setMode('manual'); setInvalid(key); setError(`请至少选择一个关注${key === 'industries' ? '行业' : '主题'}。`);
        requestAnimationFrame(() => dialog.current?.querySelector<HTMLInputElement>(`[data-choice="${key}"] input`)?.focus());
        return;
      }
    }
    try {
      localStorage.setItem(subscriptionKey, JSON.stringify(draft));
      onSave(draft);
    } catch { setError('订阅未保存：本地存储不可用。已保留当前设置，请检查浏览器存储后重试。'); }
  };
  const choices = (key: ChoiceKey, title: string, required = false) => <fieldset className="ns-choice-group" data-choice={key} aria-invalid={invalid === key || undefined} aria-describedby={invalid === key ? 'ns-error' : undefined}>
    <legend>{title}{required && <span>必选 · 可多选</span>}</legend>
    <div className="ns-options">{subscriptionOptions[key].map(option => <label key={option} className={draft[key].includes(option) ? 'is-selected' : ''}>
      <input type="checkbox" checked={draft[key].includes(option)} onChange={e => update(key, e.target.checked ? [...draft[key], option] : draft[key].filter(item => item !== option))}/>{option}
    </label>)}</div>
  </fieldset>;
  const textField = (key: 'keywords' | 'related' | 'blockedKeywords' | 'blockedSources', title: string, placeholder: string, helper?: string) => <label className="ns-field" htmlFor={`ns-${key}`}><span>{title}</span><input id={`ns-${key}`} aria-label={title} value={draft[key]} maxLength={300} placeholder={placeholder} onChange={e => update(key, e.target.value)} aria-describedby={helper ? `ns-${key}-help` : undefined}/>{helper && <small id={`ns-${key}-help`}>{helper}</small>}</label>;
  return <dialog ref={dialog} className="gx-dialog ns-dialog" aria-labelledby="ns-title" onCancel={e => { e.preventDefault(); onClose(); }} onKeyDown={e => {
      if (e.key !== 'Tab') return;
      const controls = Array.from(e.currentTarget.querySelectorAll<HTMLElement>('button, input, textarea, [tabindex]')).filter(element => element.tabIndex >= 0 && !element.hasAttribute('disabled') && element.getClientRects().length > 0);
      const first = controls[0], last = controls[controls.length - 1];
      if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last?.focus(); }
      else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first?.focus(); }
    }}>
    <form onSubmit={save} className="ns-form">
      <header className="gx-dialog-header ns-header"><h2 id="ns-title">资讯订阅设置</h2><button type="button" aria-label="关闭资讯订阅设置" onClick={onClose}><X size={20}/></button></header>
      <div className="gx-dialog-body ns-content" ref={content}>
        <div className="ns-tabs" role="tablist" aria-label="订阅方式">{(['manual','ai'] as const).map(tab => <button key={tab} id={`ns-tab-${tab}`} type="button" role="tab" aria-selected={mode === tab} aria-controls={`ns-panel-${tab}`} tabIndex={mode === tab ? 0 : -1} onClick={() => changeMode(tab)} onKeyDown={e => {
          if (['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) { e.preventDefault(); const next = e.key === 'Home' ? 'manual' : e.key === 'End' ? 'ai' : mode === 'manual' ? 'ai' : 'manual'; changeMode(next); dialog.current?.querySelector<HTMLButtonElement>(`#ns-tab-${next}`)?.focus(); }
        }}>{tab === 'ai' && <Sparkles size={14} aria-hidden="true"/>} {tab === 'manual' ? '手动订阅' : 'AI 订阅'}</button>)}</div>
        <div id={`ns-panel-${mode}`} role="tabpanel" aria-labelledby={`ns-tab-${mode}`} className="ns-panel">
          {mode === 'manual' ? <>
            {choices('industries', '关注行业', true)}
            {choices('topics', '关注主题', true)}
            {textField('keywords', '关键词订阅', '例如：广新集团、AIGC、产业链协同')}
            <button type="button" className="ns-advanced-toggle" aria-expanded={advanced} aria-controls="ns-advanced" onClick={() => setAdvanced(!advanced)}><ChevronDown size={16} className={advanced ? 'is-open' : ''}/>高级设置：来源、屏蔽与提醒</button>
            {advanced && <div id="ns-advanced" className="ns-advanced">
              {choices('regions', '关注地区')}{choices('contentTypes', '内容类型')}{choices('sources', '来源偏好')}
              {textField('related', '与我有关', '填写岗位或业务领域，例如：供应链管理、新材料投资')}
              <div className="ns-columns">{textField('blockedKeywords', '屏蔽关键词', '例如：娱乐，以逗号分隔')}{textField('blockedSources', '屏蔽来源', '输入媒体名称或域名，以逗号分隔')}</div>
              <label className="ns-check"><input type="checkbox" checked={draft.personalized} onChange={e => update('personalized', e.target.checked)}/><span>允许根据阅读行为优化推荐</span></label>
              <div className="ns-columns"><div className="ns-field"><span>更新频率</span><SelectField label="更新频率" value={draft.frequency} onChange={v => update('frequency', v)} options={['每日更新','每周更新','实时更新']}/></div><div className="ns-field"><span>提醒方式</span><SelectField label="提醒方式" value={draft.reminder} onChange={v => update('reminder', v)} options={['仅页面展示']}/></div></div>
              <label className="ns-check"><input type="checkbox" checked={draft.important} onChange={e => update('important', e.target.checked)}/><span>重大资讯单独提醒</span></label>
            </div>}
          </> : <>
            <div className="ns-ai-request">
              <h3 className="ns-ai-heading"><Sparkles size={18} aria-hidden="true"/>用一句话告诉 AI，你想关注什么</h3>
              <label className="ns-field ns-prompt-field" htmlFor="ns-prompt"><span className="ns-sr-only">订阅需求</span><textarea id="ns-prompt" aria-label="订阅需求" aria-describedby="ns-prompt-count" value={prompt} maxLength={500} onChange={e => changePrompt(e.target.value)} placeholder="例如：我关注人工智能在制造业的应用和国产算力，重点看广东的政策解读和企业动态，每天更新，不要娱乐。"/><small id="ns-prompt-count" className="ns-counter">{prompt.length} / 500</small></label>
            </div>
            <div className="ns-ai-actions"><div className="ns-examples">{examples.map(example => <button key={example} type="button" onClick={() => changePrompt(example)}>{example}</button>)}</div><Button variant="primary" disabled={!prompt.trim()} onClick={generate}><SlidersHorizontal size={14} aria-hidden="true"/>生成订阅条件</Button></div>
            {!!recognized.length && <section className="ns-result" aria-label="生成的订阅条件"><div><h3>已生成订阅条件</h3><Button variant="text" onClick={() => { changeMode('manual'); setAdvanced(true); }}>编辑条件</Button></div><p role="status">已识别：{recognized.join('、')}</p><dl><dt>行业 / 主题</dt><dd>{draft.industries.join('、')} / {draft.topics.join('、')}</dd><dt>关键词</dt><dd>{draft.keywords || '不限'}</dd><dt>地区 / 来源</dt><dd>{draft.regions.join('、') || '不限'} / {draft.sources.join('、') || '不限'}</dd><dt>屏蔽 / 更新</dt><dd>{draft.blockedKeywords || '无'} / {draft.frequency}</dd></dl><p className="ns-help">确认后点击“保存”生效。</p></section>}
          </>}
        </div>
      </div>
      <footer className="ns-footer">
        {error && <p className="ns-error" id="ns-error" role="alert">{error}</p>}{notice && <p role="status" className="ns-help">{notice}</p>}
        <div className="gx-dialog-footer"><Button className="gx-dialog-reset" variant="text" onClick={() => { setDraft(defaultSubscription()); setPrompt(''); setRecognized([]); setError(''); setInvalid(null); setNotice('已恢复默认草稿，保存后生效。'); }}><RotateCcw size={14} aria-hidden="true"/>恢复默认</Button><Button onClick={onClose}>取消</Button><Button type="submit" variant="primary" disabled={mode === 'ai' && !recognized.length}>保存</Button></div>
      </footer>
    </form>
  </dialog>;
}
