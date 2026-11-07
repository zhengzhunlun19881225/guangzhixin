import React, { useEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, Globe, PanelsTopLeft, X } from 'lucide-react';
import { figmaAssets } from '../data/figmaAssets';
import { AGENT_CARDS } from '../data/mockData';
import './agent-composer.css';
import { Button } from './UI';
import { PPT_TEMPLATE_CATEGORIES as categories, PPT_TEMPLATES as templates, pptTemplateImage, type PptTemplate as Template } from '../data/pptTemplates';

const quickAgents = ['智能问答', '智能写作', '智能摘要', '智能数据'];
const agentNames = [...new Set([...quickAgents, '智能查询', 'PPT生成', ...AGENT_CARDS.map(a => a.title)])];
const toolOptions: Record<string, string[]> = {
  '知识库': ['广新集团制度汇编', '集团业务知识库', '项目管理知识库'],
  '提示词模板': ['请将以下内容整理为结构清晰的工作汇报，突出进展、风险和下一步计划。', '请提炼以下材料的核心观点，并列出待办事项和负责人。', '请根据以下主题拟写一份正式通知，包含背景、安排和注意事项。'],
  '技能树': ['数据查询', '趋势分析', '报表生成'],
};
const promptLabels = ['工作汇报', '材料摘要', '通知写作'];

function ToolIcon({ index = 1, active = false }: { index?: number; active?: boolean }) {
  return <img className={active ? 'agent-icon-active' : ''} src={figmaAssets[`71-5347:img${index}`]} width={16} height={16} alt="" />;
}

export function AgentComposerTools({ agent, onSelect, onInsert, busy, selectedPptTemplate, onPptTemplateChange }: {
  agent?: string;
  onSelect: (agent?: string) => void;
  onInsert: (text: string) => void;
  busy: boolean;
  selectedPptTemplate?:Template|null;
  onPptTemplateChange?:(template:Template)=>void;
}) {
  const pptMode=agent==='PPT生成'||agent==='制作PPT';
  const legalMode=agent==='法智小新';
  const appliedPreview=useRef(false);
  const templateToggle=useRef<HTMLButtonElement>(null);
  const [panel, setPanel] = useState<string | null>(null);
  const [category, setCategory] = useState('全部模板');
  const [preview, setPreview] = useState<Template | null>(null);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [knowledge, setKnowledge] = useState<string | null>(null);
  const [share, setShare] = useState(false);
  const root = useRef<HTMLDivElement>(null);
  const dialog = useRef<HTMLDialogElement>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);
  const attachment = useRef<HTMLInputElement>(null);
  useEffect(() => { setPanel(pptMode?'PPT生成':null);setCategory('全部模板');setPreview(null);setKnowledge(null);setSelectedTemplate(null);setShare(false); }, [agent]);
  useEffect(() => { if (busy) { setPanel(null); setPreview(null); } }, [busy]);
  useEffect(() => {
    if (!panel) return;
    const outside = (e: PointerEvent) => { if (!pptMode && !root.current?.contains(e.target as Node) && !(e.target as Element).closest?.('.ppt-preview-dialog')) setPanel(null); };
    const escape = (e: KeyboardEvent) => { if (e.key === 'Escape' && !dialog.current?.open) { setPanel(null); (pptMode?templateToggle.current:trigger.current)?.focus(); } };
    document.addEventListener('pointerdown', outside); document.addEventListener('keydown', escape);
    return () => { document.removeEventListener('pointerdown', outside); document.removeEventListener('keydown', escape); };
  }, [panel,pptMode]);
  useEffect(() => { if(!preview)return;const element=dialog.current!;element.showModal();return()=>element.close(); }, [preview]);
  const openPanel = (name: string, button: HTMLButtonElement) => { trigger.current = button; setPanel(p => p === name ? null : name); };
  const chosenTemplate=pptMode?selectedPptTemplate?.name:selectedTemplate;
  const closePanel = () => { setPanel(null); (pptMode?templateToggle.current:trigger.current)?.focus(); };
  const closePreview = () => { setPreview(null); };
  const showPreview=(item:Template,button:HTMLButtonElement)=>{trigger.current=button;setPreview(item);};
  useEffect(()=>{if(preview)return;if(appliedPreview.current){appliedPreview.current=false;return;}const button=trigger.current;if(button?.classList.contains('template-preview-button'))requestAnimationFrame(()=>button.isConnected&&button.focus());},[preview]);
  const useTemplate = (item: Template) => {
    if(preview)appliedPreview.current=true;
    if(pptMode){onPptTemplateChange?.(item);setPreview(null);setPanel('PPT生成');}
    else{setSelectedTemplate(item.name);onInsert(`请使用「${item.name}」模板生成PPT。`);setPreview(null);setPanel(null);}
  };
  const tools = legalMode?[]:pptMode?['模板']:!agent || agent === '智能问答' ? [] : ['智能查询', '智能数据'].includes(agent) ? ['分享管理', '技能树'] : ['知识库', '提示词模板', 'PPT生成'];
  return <div className="agent-composer-tools" data-selected={Boolean(agent)} ref={root}>
    <input ref={attachment} type="file" multiple hidden onChange={e => { const names = Array.from(e.target.files || []).map(file => file.name); if (names.length) onInsert(`附件：${names.join('、')}`); e.target.value = ''; }} />
    <button type="button" className="composer-attachment" title="上传附件" disabled={busy} onClick={() => attachment.current?.click()}><img src={figmaAssets['71-5347:imgSvg']} width={14} height={14} alt="" /></button>
    {agent ? <span className="selected-agent-pill">
      <button type="button" aria-label={`切换智能体：${agent}`} aria-expanded={panel === '智能体'} disabled={busy} onClick={e => openPanel('智能体', e.currentTarget)}><ToolIcon active /><span>{agent}</span></button>
      <button type="button" className={legalMode?'composer-cancel-legal':undefined} aria-label={legalMode?'取消法智小新':'移除智能体'} title={legalMode?'取消法智小新':'移除智能体'} disabled={busy} onClick={() => onSelect(undefined)}><X size={12} strokeWidth={1.4}/></button>
    </span> : quickAgents.map((name, index) => <button key={name} type="button" className="composer-agent-choice" disabled={busy} onClick={() => onSelect(name)}><ToolIcon index={index + 1}/><span>{name}</span></button>)}
    {tools.map((name,index)=>{const target=name==='模板'?'PPT生成':name;return <button key={name} ref={name==='模板'?templateToggle:undefined} type="button" disabled={busy} className={`composer-agent-tool ${panel===target||(!pptMode&&((name==='PPT生成'&&selectedTemplate)||(name==='知识库'&&knowledge)||(name==='分享管理'&&share)))?'is-active':''}`} aria-expanded={panel===target} aria-controls={target==='PPT生成'?'ppt-template-panel':undefined} title={target==='PPT生成'&&chosenTemplate?`已选模板：${chosenTemplate}`:name==='知识库'&&knowledge?`已选知识库：${knowledge}`:name} onClick={e=>openPanel(target,e.currentTarget)}>
      {pptMode?<PanelsTopLeft size={16}/>:name==='PPT生成'&&(panel===name||selectedTemplate)?<Globe size={16}/>:<ToolIcon index={index===0?2:3}/>}{name}
    </button>;})}
    {panel && <section id={panel==='PPT生成'?'ppt-template-panel':undefined} className={`agent-tools-panel ${panel === 'PPT生成' ? 'ppt-template-panel' : ''}`} aria-label={panel === 'PPT生成' ? 'PPT模板' : panel}>
      {panel === 'PPT生成' ? <>
        <div className="ppt-panel-header"><div className="ppt-categories" role="tablist" aria-label="模板分类">{categories.map((name,index) => <button key={name} role="tab" aria-selected={name===category} tabIndex={name===category?0:-1} onClick={()=>setCategory(name)} onKeyDown={e=>{const next=e.key==='ArrowRight'?(index+1)%categories.length:e.key==='ArrowLeft'?(index+categories.length-1)%categories.length:e.key==='Home'?0:e.key==='End'?categories.length-1:-1;if(next<0)return;e.preventDefault();setCategory(categories[next]);const button=e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('button')[next];button?.focus();button?.scrollIntoView({block:'nearest',inline:'nearest'});}}>{name}</button>)}</div><button className="agent-panel-close" aria-label="关闭模板面板" onClick={closePanel}><X size={16}/></button></div>
        <div className="ppt-template-grid">{templates.filter(t => category === '全部模板' || t.category === category).map(item => <article className={`ppt-template-card ${chosenTemplate === item.name ? 'is-selected' : ''}`} key={item.id}>
          <button className="ppt-template-cover" aria-label={`选择${item.name}模板`} aria-pressed={chosenTemplate===item.name} onClick={() => useTemplate(item)}><img src={pptTemplateImage(item)} alt={`${item.name}模板封面`}/></button>
          <div><button onClick={() => useTemplate(item)}>{item.name}{chosenTemplate === item.name && <Check size={13}/>}</button><button className="template-preview-button" onClick={e => showPreview(item,e.currentTarget)} aria-label={`预览${item.name}模板`}>预览</button></div>
        </article>)}</div>
        {category !== '全部模板' && !templates.some(t => t.category === category) && <p className="agent-panel-empty">该分类暂无模板，请选择其他分类</p>}
      </> : <>
        <header><strong>{panel === '智能体' ? '选择智能体' : panel}</strong><button className="agent-panel-close" aria-label={`关闭${panel}面板`} onClick={closePanel}><X size={16}/></button></header>
        {panel === '智能体' ? <div className="agent-picker-grid">{agentNames.map(name => <button key={name} className={agent === name ? 'is-active' : ''} onClick={() => onSelect(name)}><ToolIcon active={agent === name}/>{name}{agent === name && <Check size={14}/>}</button>)}</div> : panel === '分享管理' ? <div className="agent-share-settings"><span>允许分享本次查询结果</span><button role="switch" aria-label="允许分享本次查询结果" aria-checked={share} className={share ? 'is-on' : ''} onClick={() => setShare(!share)}><span/></button><p>{share ? '分享已开启，回答完成后可使用回答下方的分享入口。' : '分享已关闭，仅自己可见。'}</p></div> : <div className="agent-tool-options">{(toolOptions[panel] || []).map((text, i) => <button key={text} onClick={() => { if (panel === '知识库') setKnowledge(text); onInsert(panel === '知识库' ? `参考知识库：${text}` : panel === '技能树' ? `请使用${text}技能处理以上内容。` : text); closePanel(); }}>
          <span>{panel === '提示词模板' ? promptLabels[i] : text}</span>{panel === '提示词模板' && <small>{text}</small>}{knowledge === text && <Check size={14}/>}</button>)}</div>}
      </>}
    </section>}
    {preview && createPortal(<dialog ref={dialog} className="gx-dialog ppt-preview-dialog" aria-label={`${preview.name}模板预览`} onCancel={e => { e.preventDefault(); closePreview(); }} onClick={e => { if(e.target!==e.currentTarget)return;const rect=e.currentTarget.getBoundingClientRect();if(e.clientX<rect.left||e.clientX>rect.right||e.clientY<rect.top||e.clientY>rect.bottom)closePreview(); }}>
      <header className="gx-dialog-header"><strong>{preview.name} · 模板预览</strong><button aria-label="关闭模板预览" onClick={closePreview}><X size={18}/></button></header><div className="gx-dialog-body"><img src={pptTemplateImage(preview)} alt={`${preview.name}模板封面预览`}/></div><footer className="gx-dialog-footer"><button onClick={closePreview}>返回模板</button><button className="gx-dialog-primary use-ppt-template" onClick={() => useTemplate(preview)}>使用此模板</button></footer>
    </dialog>, document.body)}
  </div>;
}
