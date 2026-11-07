import React, { useEffect, useRef, useState } from 'react';
import { Bot, BookOpen, BriefcaseBusiness, ChartNoAxesCombined, ChevronLeft, Plus, Send, ShieldCheck, Sparkles, Trash2, X } from 'lucide-react';
import { Button, EmptyState, ModalSurface } from './UI';
import { SelectField } from './SelectField';
import { AgentImageDialog } from './AgentImageDialog';
import { AGENT_CATEGORIES, AGENT_MODELS, AGENT_PERMISSIONS, type CustomAgent } from '../data/personalSettings';
import './personal-features.css';

const icons = { bot: Bot, sparkles: Sparkles, book: BookOpen, chart: ChartNoAxesCombined, shield: ShieldCheck, briefcase: BriefcaseBusiness };
export function AgentAvatar({ icon, image }: { icon: CustomAgent['icon']; image?: string }) { const Icon = icons[icon]; return <span className={`ab-avatar ${image ? 'ab-avatar-image' : ''}`}>{image ? <img src={image} alt=""/> : <Icon size={36} aria-hidden="true"/>}</span>; }
type Message = { role: 'user' | 'assistant'; text: string };
export function AgentBuilder({ initial, onBack, onPublish }: {
  initial: CustomAgent; onBack: () => void; onPublish: (agent: CustomAgent) => void;
}) {
  const [draft, setDraft] = useState<CustomAgent>(() => ({ ...initial, questions: [...initial.questions] }));
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [iconOpen, setIconOpen] = useState(false);
  const [confirmBack, setConfirmBack] = useState(false);
  const [tested, setTested] = useState<CustomAgent | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [question, setQuestion] = useState('');
  const [notice, setNotice] = useState('');
  const form = useRef<HTMLFormElement>(null), testEnd = useRef<HTMLDivElement>(null), heading = useRef<HTMLHeadingElement>(null);
  const dirty = JSON.stringify(draft) !== JSON.stringify(initial);
  const testStale = tested && JSON.stringify(draft) !== JSON.stringify(tested);
  useEffect(() => { heading.current?.focus(); }, []);
  useEffect(() => { const scroller = testEnd.current?.parentElement; scroller?.scrollTo({ top: scroller.scrollHeight }); }, [messages]);
  useEffect(() => {
    if (!dirty) return;
    const warn = (event: BeforeUnloadEvent) => { event.preventDefault(); };
    window.addEventListener('beforeunload', warn);
    return () => window.removeEventListener('beforeunload', warn);
  }, [dirty]);
  const update = <K extends keyof CustomAgent>(key: K, value: CustomAgent[K]) => { setDraft(current => ({ ...current, [key]: value })); setErrors(current => ({ ...current, [key]: '' })); setNotice(''); };
  const validate = () => {
    const next: Record<string, string> = {};
    if (!draft.name.trim()) next.name = '请输入智能体名称。';
    if (!draft.intro.trim()) next.intro = '请输入简介。';
    if (!draft.description.trim()) next.description = '请输入设定描述。';
    setErrors(next);
    if (Object.keys(next).length) requestAnimationFrame(() => form.current?.querySelector<HTMLElement>('[aria-invalid=true]')?.focus());
    return Object.keys(next).length === 0;
  };
  const textField = (key: 'name' | 'intro' | 'welcome' | 'description', label: string, limit: number, placeholder: string, rows?: number) => {
    const props = { id: `ab-${key}`, name: key, value: draft[key], maxLength: limit, placeholder, 'aria-invalid': !!errors[key], 'aria-describedby': errors[key] ? `ab-${key}-error` : undefined, onChange: (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => update(key, event.target.value) };
    return <div className="pf-field"><label htmlFor={props.id}>{['name', 'intro', 'description'].includes(key) && <span className="pf-required" aria-hidden="true">*</span>}{label}</label><div className={`ab-counted ${rows ? 'is-textarea' : ''}`}>{rows ? <textarea {...props} rows={rows} required={key === 'description'}/> : <input {...props} required/>}<span aria-hidden="true">{draft[key].length} / {limit}</span></div>{errors[key] && <small id={`ab-${key}-error`} role="alert">{errors[key]}</small>}</div>;
  };
  const generateTest = () => {
    if (!validate()) return;
    setTested({ ...draft, questions: [...draft.questions] });
    setMessages([]); setQuestion(''); setNotice('测试配置已更新。');
  };
  const sendTest = (text: string) => {
    if (!tested || !text.trim()) return;
    setMessages(items => [...items, { role: 'user', text: text.trim() }, { role: 'assistant', text: `这是「${tested.name}」的本地测试预览。\n本次问题：${text.trim()}\n设定描述：${tested.description}\n当前未连接模型，以上用于检查配置与对话展示。` }]); setQuestion('');
  };
  return <section className="agent-builder design-panel" aria-label="创建智能体页面">
    <div className="ab-columns">
      <form noValidate ref={form} className="ab-config" onSubmit={event => {
        event.preventDefault(); if (!validate()) return;
        try { onPublish({ ...draft, name: draft.name.trim(), intro: draft.intro.trim(), description: draft.description.trim(), questions: draft.questions.map(q => q.trim()).filter(Boolean), id: draft.id || crypto.randomUUID(), updatedAt: new Date().toISOString() }); }
        catch { setErrors(current => ({ ...current, save: '发布失败，请检查浏览器存储后重试。配置与测试均已保留。' })); }
      }}>
        <header className="ab-page-header"><button type="button" className="todo-back" onClick={() => dirty ? setConfirmBack(true) : onBack()}><ChevronLeft size={16}/><span>返回</span></button><span className="todo-divider"/><h1 ref={heading} tabIndex={-1}>{initial.id ? '编辑智能体' : '创建智能体'}</h1></header>
        <div className="ab-config-scroll">
          <button className="ab-icon-picker" type="button" onClick={() => setIconOpen(true)} aria-label="更换智能体图标"><AgentAvatar icon={draft.icon} image={draft.avatarImage}/><span>智能体图标 <small>点击更换</small></span></button>
          {textField('name', '名称', 10, '请输入名称')}
          {textField('intro', '简介', 20, '请输入简介')}
          {textField('welcome', '欢迎语', 1000, '如：您好，我是企业助手，可以协助您整理资料。', 3)}
          <div className="pf-field"><div className="ab-question-label"><span>预设问题 <small>最多5个，每个30字以内</small></span><Button size="small" variant="text" aria-label="添加预设问题" disabled={draft.questions.length >= 5} onClick={() => update('questions', [...draft.questions, ''])}><Plus size={16}/></Button></div>
            {draft.questions.map((q, index) => <div className="ab-question-row" key={index}><input aria-label={`预设问题${index + 1}`} value={q} maxLength={30} onChange={event => update('questions', draft.questions.map((item, i) => i === index ? event.target.value : item))} placeholder="请输入预设问题"/><Button variant="text" aria-label={`删除预设问题${index + 1}`} onClick={() => update('questions', draft.questions.filter((_, i) => i !== index))}><Trash2 size={14}/></Button></div>)}
          </div>
          <div className="pf-field"><span>分类</span><SelectField label="智能体分类" options={AGENT_CATEGORIES} value={draft.category} onChange={value => update('category', value)}/></div>
          <div className="pf-field"><span><span className="pf-required">*</span>模型选择</span><SelectField label="模型选择" options={AGENT_MODELS} value={draft.model} onChange={value => update('model', value)} leadingIcon={<Sparkles size={14}/>}/></div>
          <div className="pf-field"><span><span className="pf-required">*</span>发布人</span><div className="ab-publisher">个人</div></div>
          <fieldset className="pf-field ab-permission"><legend><span className="pf-required">*</span>权限设置</legend><div className="ab-segmented">{AGENT_PERMISSIONS.map(value => <label key={value}><input type="radio" name="agent-permission" value={value} checked={draft.permission === value} onChange={() => update('permission', value)}/><span>{value}</span></label>)}</div><small>仅保存访问范围配置，不产生远程授权。</small></fieldset>
          {textField('description', '设定描述', 1000, '请输入智能体的职责、回答方式与边界', 3)}
          <div className="ab-complete"><Button variant="text" onClick={() => {
            if (!draft.name.trim() || !draft.intro.trim()) { setNotice('请先填写名称与简介，再完善设定描述。'); return; }
            if (draft.description.length >= 1000) { setNotice('设定描述已达1000字，请精简后再补充。'); return; }
            const addition = `你是${draft.name.trim()}。你的职责是${draft.intro.trim()}。请先确认用户需求，再给出清晰、可执行的建议；缺少依据时说明不确定性，不虚构数据或执行结果。`;
            update('description', `${draft.description.trim()}${draft.description.trim() ? '\n' : ''}${addition}`.slice(0, 1000)); setNotice('已按名称和简介补充设定草稿，请检查后使用。');
          }}><Sparkles size={14}/>一键完善</Button></div>
          {notice && <p className="ab-notice" role="status">{notice}</p>}
          {errors.save && <p className="ab-error" role="alert">{errors.save}</p>}
        </div>
        <footer className="ab-config-footer"><Button variant="primary" type="submit">{initial.id ? '保存' : '发布'}</Button><Button onClick={generateTest}>生成测试</Button></footer>
      </form>
      <section className="ab-test" aria-label="测试智能体"><header><Button onClick={() => { setMessages([]); setQuestion(''); }} disabled={!messages.length && !question}><Trash2 size={14}/>清空对话</Button><h2>测试智能体</h2></header>
        {!tested ? <EmptyState title="未发布测试" description="填写左侧配置，点击“生成测试”预览欢迎语和问题。"/> : <>
          <div className="ab-test-status"><span>本地预览 · {tested.model}</span>{testStale && <strong role="status">配置已修改，请重新生成测试</strong>}</div>
          <div className="ab-test-messages"><div className="ab-test-welcome"><AgentAvatar icon={tested.icon} image={tested.avatarImage}/><h3>{tested.name}</h3><p>{tested.welcome || `您好，我是${tested.name}。${tested.intro}`}</p>{tested.questions.filter(q => q.trim()).map((q, index) => <button key={index} onClick={() => sendTest(q)}>{q}</button>)}</div>{messages.map((message, index) => <div key={index} className={`ab-test-message is-${message.role}`}><span>{message.role === 'user' ? '我' : tested.name}</span><p>{message.text}</p></div>)}<div ref={testEnd}/></div>
          <div className="ab-test-composer"><textarea aria-label="测试消息" value={question} maxLength={1000} placeholder="输入测试问题…" onChange={event => setQuestion(event.target.value)} onKeyDown={event => { if (event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing) { event.preventDefault(); sendTest(question); } }}/><Button aria-label="发送测试消息" variant="primary" disabled={!question.trim()} onClick={() => sendTest(question)}><Send size={16}/></Button></div>
        </>}
      </section>
    </div>
    {iconOpen && <AgentImageDialog value={draft.avatarImage} onClose={() => setIconOpen(false)} onConfirm={image => { update('avatarImage', image); setIconOpen(false); }}/>}
    {confirmBack && <ModalSurface label="放弃未保存的配置？" className="ab-discard-dialog" onClose={() => setConfirmBack(false)}><header className="gx-dialog-header"><h2>放弃未保存的配置？</h2><button aria-label="关闭返回确认" onClick={() => setConfirmBack(false)}><X size={18}/></button></header><div className="gx-dialog-body">返回后，本次未保存的配置和测试对话将被清除。</div><footer className="gx-dialog-footer"><Button onClick={() => setConfirmBack(false)}>继续编辑</Button><Button variant="primary" onClick={onBack}>放弃并返回</Button></footer></ModalSurface>}
  </section>;
}
