import { SelectField } from './SelectField';
import React, { useEffect, useRef, useState } from 'react';
import { 
  ArrowRight,
  ArrowUp,
  Square, 
  ChevronRight, 
  Plus, 
  Globe, 
  Mic, 
  ChevronDown, 
  Sparkles, 
  FileText, 
  BarChart2, 
  Volume2, 
  Copy, 
  Download, 
  RotateCw, 
  CornerUpRight, 
  ThumbsUp, 
  ThumbsDown, 
  Trash2, 
  MoreHorizontal,
  Bot,
  Compass,
  X
} from 'lucide-react';
import { figmaAssets } from '../data/figmaAssets';
import { useResponseProgress } from './useResponseProgress';
import './composer-action.css';
import { VoiceInput } from './VoiceInput';
import { Mascot } from './Mascot';
import { pptTemplateImage, type PptTemplate } from '../data/pptTemplates';
import './ppt-composer.css';
import { AgentComposerTools } from './AgentComposerTools';
import { questionExamples, resolveExampleAnswer, answerAsText } from '../data/conversationExamples';

interface AIChatViewProps {
  activeTopic?: string;
  responseRequestId?: number;
  selectedAgent?: string;
  onSelectAgent: (agent?: string) => void;
  onOpenDocPreview: (title: string, content: string) => void;
  onSendQuery: (query: string) => void;
}

export const AIChatView: React.FC<AIChatViewProps> = ({
  activeTopic,
  responseRequestId = 0,
  selectedAgent,
  onSelectAgent,
  onOpenDocPreview,
  onSendQuery
}) => {
  const { phase, visibleBlocks, busy, stop } = useResponseProgress(activeTopic, responseRequestId);
  const pptMode=selectedAgent==='PPT生成'||selectedAgent==='制作PPT';
  const legalMode=selectedAgent==='法智小新';
  const [pptTemplate,setPptTemplate]=useState<PptTemplate|null>(null);
  const [pptError,setPptError]=useState('');
  useEffect(()=>{if(!pptMode){setPptTemplate(null);setPptError('');}},[pptMode]);
  const [voiceOpen, setVoiceOpen] = useState(false);
  useEffect(() => { setVoiceOpen(false); }, [activeTopic]);
  const composerInput = useRef<HTMLTextAreaElement>(null);
  const microphoneButton = useRef<HTMLButtonElement>(null);
  const [inputMessage, setInputMessage] = useState('');
  const [activeTab, setActiveTab] = useState<'recent' | 'hot' | 'common'>('hot');
  const [selectedModel, setSelectedModel] = useState('qwen3.8-27b');
  const [enableWebSearch, setEnableWebSearch] = useState(false);
  const [isThinkingOpen, setIsThinkingOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [guideChip, setGuideChip] = useState('第一季度各区域销售业绩汇报');
  const [liked, setLiked] = useState<boolean | null>(null);

  const handleCardClick = (title: string) => {
    if(busy)return;
    if(title==='制作PPT'){onSelectAgent('PPT生成');setVoiceOpen(false);setPptError('');requestAnimationFrame(()=>composerInput.current?.focus());}
    else if(title==='法智小新'){onSelectAgent(title);setVoiceOpen(false);requestAnimationFrame(()=>composerInput.current?.focus());}
    else onSendQuery(title);
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setIsCopied(true);
      setTimeout(() => setIsCopied(false), 2000);
    } catch { setIsCopied(false); }
  };

  const sendText = () => {
    if(busy)return;
    if(pptMode){
      if(!pptTemplate){setPptError('请先选择一个PPT模板。');return;}
      if(!inputMessage.trim()){setPptError('请输入PPT主题或内容。');composerInput.current?.focus();return;}
      onSendQuery(`请使用「${pptTemplate.name}」模板制作PPT：${inputMessage.trim()}`);setPptError('');
    }else{if(!inputMessage.trim())return;onSendQuery(inputMessage.trim());}
    setInputMessage('');
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey && !e.nativeEvent.isComposing && e.keyCode !== 229) {
      e.preventDefault();
      sendText();
    }
  };
  const insertContext = (text: string) => {
    setInputMessage(value => value.trim() ? `${value}\n${text}` : text);
    requestAnimationFrame(() => composerInput.current?.focus());
  };
  const answer = resolveExampleAnswer(activeTopic ?? '');
  const answerText = answerAsText(answer);
  const questions = questionExamples[activeTab].map(item => item.question);
  useEffect(() => { setLiked(null); setIsCopied(false); setIsThinkingOpen(false); }, [activeTopic, responseRequestId]);
  const actionLabel = busy ? '结束生成' : pptMode?'生成PPT': inputMessage.trim() ? '发送消息' : '语音输入';

  return (
    <div className={`ai-chat-view ${pptMode?'ai-ppt-mode':''} ${legalMode?'ai-legal-mode':''} flex-1 flex flex-col h-full bg-[#f8fafc]/50 overflow-hidden relative select-none`}>
      {/* Scrollable Conversation / Landing Container */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6">
        {pptMode&&!activeTopic?<div className="ai-ppt-workspace" aria-label="PPT制作"/>:!activeTopic ? (
          /* Landing Home State (Image 9) */
          <div className="ai-landing max-w-4xl mx-auto space-y-8 pt-4 pb-32">
            {/* Greeting */}
            <h1 className="text-2xl font-bold text-center text-slate-800 tracking-tight pt-2">
              您好，欢迎使用广智新
            </h1>

            <div className="ai-feature-cards">
              {[
                {title:'AI+财务自动差旅',description:'一句话提交出差申请单',asset:'img10',color:'var(--gx-info)'},
                {title:'法智小新',description:'解法规，答操作',asset:'img2',color:'var(--gx-purple)'},
                {title:'制作PPT',description:'从需求到方案一键生成完整方案',asset:'img7',color:'var(--gx-warning)'},
                {title:'AI+员工服务',description:'一句话提交请假、加班申请单',asset:'img5',color:'var(--gx-brand)'}
              ].map(card => <button key={card.title} aria-pressed={card.title==='法智小新'?legalMode:undefined} onClick={() => handleCardClick(card.title)} className="ai-feature-card" style={{'--feature-color':card.color} as React.CSSProperties}>
                <div className="ai-feature-art"><img src={figmaAssets['71-5548:'+card.asset]} alt="" /><h3>{card.title}</h3></div>
                <p>{card.description}</p>
                <span className="ai-feature-arrow"><ArrowRight size={18}/></span>
              </button>)}
            </div>

            {/* Questions Tabs & 2-Column List */}
            <div className="ai-questions space-y-4 pt-2">
              <div className="flex items-center gap-6 border-b border-slate-100 pb-2 text-sm font-medium">
                <button
                  onClick={() => setActiveTab('recent')}
                  aria-pressed={activeTab === 'recent'}
                  className={`transition-colors ${
                    activeTab === 'recent' ? 'text-red-500 font-semibold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  最近记录
                </button>
                <button
                  onClick={() => setActiveTab('hot')}
                  aria-pressed={activeTab === 'hot'}
                  className={`relative transition-colors ${
                    activeTab === 'hot'
                      ? 'text-red-500 font-semibold after:absolute after:-bottom-2.5 after:left-0 after:right-0 after:h-0.5 after:bg-red-500'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  热门问答
                </button>
                <button
                  onClick={() => setActiveTab('common')}
                  aria-pressed={activeTab === 'common'}
                  className={`transition-colors ${
                    activeTab === 'common' ? 'text-red-500 font-semibold' : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  常用问题
                </button>
              </div>

              {/* 2-column numbered list */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2">
                <div className="space-y-1">
                  {questions.slice(0, 5).map((item, idx) => (
                    <button
                      key={`col1-${idx}`}
                      title={item}
                      onClick={() => handleCardClick(item)}
                      className="w-full flex items-center justify-between py-2 text-sm text-slate-700 hover:text-red-600 transition-colors group text-left"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className={`w-4 font-bold text-xs ${idx < 3 ? 'text-red-500' : 'text-slate-400'}`}>
                          {idx + 1}.
                        </span>
                        <span className="truncate">{item}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-red-500 shrink-0" />
                    </button>
                  ))}
                </div>

                <div className="space-y-1">
                  {questions.slice(5, 10).map((item, idx) => (
                    <button
                      key={`col2-${idx}`}
                      title={item}
                      onClick={() => handleCardClick(item)}
                      className="w-full flex items-center justify-between py-2 text-sm text-slate-700 hover:text-red-600 transition-colors group text-left"
                    >
                      <div className="flex items-center gap-2 truncate pr-2">
                        <span className="w-4 font-bold text-xs text-slate-400">
                          {idx + 6}.
                        </span>
                        <span className="truncate">{item}</span>
                      </div>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-red-500 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Active Chat Conversation State (Image 7 & Image 10) */
          <div className="ai-conversation max-w-4xl mx-auto space-y-6 pt-4 pb-36">
            {/* User message */}
            <div className="flex justify-end">
              <div className="bg-slate-100 text-slate-800 px-4 py-2.5 rounded-2xl max-w-lg text-sm shadow-xs font-medium">
                {activeTopic}
              </div>
            </div>

            {/* AI Response Card */}
            <div className="flex items-start gap-3">
              <img className="ai-response-avatar" src="assets/figma/c577ac5f-2dab-4548-afb5-61bc3d306e33.png" alt="广智新助手" />

              <div className="flex-1 space-y-3">
                {/* Thinking Process Accordion */}
                <div className="ai-thinking-header inline-block">
                  <button
                    onClick={() => setIsThinkingOpen(!isThinkingOpen)}
                    aria-expanded={isThinkingOpen}
                    aria-controls="ai-thinking-details"
                    className="ai-thinking-toggle"
                  >
                    <span role="status">{phase === 'thinking' ? '正在思考…' : phase === 'responding' ? '正在回答…' : phase === 'stopped' ? '已停止生成' : '已思考'}</span>
                  </button>
                  {isThinkingOpen && (
                    <div id="ai-thinking-details" className="mt-2 p-3 bg-slate-50 border border-slate-100 rounded-xl text-xs text-slate-500 leading-relaxed max-w-lg">
                      围绕“{activeTopic}”整理要点，区分已有信息与待补充内容，并按可执行的步骤组织回答。当前展示为预设示例，未检索企业内部资料。
                    </div>
                  )}
                </div>

                {/* Structured Text Content */}
                <div className="ai-response-content bg-white rounded-2xl p-6 shadow-xs border border-slate-100 text-slate-800 text-sm leading-relaxed space-y-4" data-phase={phase} data-visible-blocks={visibleBlocks} hidden={visibleBlocks === 0}>
                  <h2 className="text-base font-bold text-slate-900">{answer.title}</h2>
                  <p>{answer.intro}</p>
                  {answer.sections.map((section, index) => <div key={section.title}>
                    <h3 className="font-semibold text-slate-900 mb-1">{index + 1}、{section.title}</h3>
                    <ul className="list-disc list-inside space-y-1 pl-1">
                      {section.items.map(item => <li key={item}>{item}</li>)}
                    </ul>
                  </div>)}

                  {/* Message Action Toolbar */}
                  <div className="ai-response-actions" role="group" aria-label="回答操作">
                    <button
                      onClick={() => {}}
                      title="朗读"
                      className="p-1 hover:text-slate-700 transition-colors"
                    >
                      <Volume2 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => handleCopy(answerText)}
                      title="复制"
                      className="p-1 hover:text-slate-700 transition-colors relative"
                    >
                      <Copy className="w-4 h-4" />
                      {isCopied && (
                        <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-slate-800 text-white text-[10px] px-1.5 py-0.5 rounded">
                          已复制
                        </span>
                      )}
                    </button>
                    <button
                      onClick={() => onOpenDocPreview(answer.title, answerText)}
                      title="生成文档预览"
                      className="p-1 transition-colors"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => { if (!busy) onSendQuery(activeTopic); }}
                      title="重新生成"
                      className="p-1 hover:text-slate-700 transition-colors"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {}}
                      title="分享"
                      className="p-1 hover:text-slate-700 transition-colors"
                    >
                      <CornerUpRight className="w-4 h-4" />
                    </button>
                    <span className="ai-response-actions-divider" aria-hidden="true" />
                    <button
                      onClick={() => setLiked(liked === true ? null : true)}
                      title="赞同"
                      aria-pressed={liked === true}
                      className={`p-1 transition-colors ${liked === true ? 'text-red-500' : 'hover:text-slate-700'}`}
                    >
                      <ThumbsUp className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setLiked(liked === false ? null : false)}
                      title="不赞同"
                      aria-pressed={liked === false}
                      className={`p-1 transition-colors ${liked === false ? 'text-red-500' : 'hover:text-slate-700'}`}
                    >
                      <ThumbsDown className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Floating Guided Prompt Chip (Image 10) */}
      {guideChip && !pptMode && (
        <div className="absolute bottom-28 left-1/2 -translate-x-1/2 w-full max-w-3xl px-4 flex justify-start z-10">
          <div className="inline-flex items-center gap-2 bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-xl px-3 py-1.5 shadow-sm text-xs text-slate-700 animate-in fade-in slide-in-from-bottom-2 duration-150">
            <span className="text-slate-400">↳</span>
            <span 
              onClick={() => {
                onSendQuery(guideChip);
                setGuideChip('');
              }}
              className="cursor-pointer hover:text-red-600 truncate max-w-sm"
            >
              {guideChip}
            </span>
            <div className="flex items-center gap-1 ml-2 text-slate-400">
              <button 
                onClick={() => {
                  onSendQuery(guideChip);
                  setGuideChip('');
                }}
                className="hover:text-slate-700 flex items-center gap-0.5"
              >
                <Compass className="w-3 h-3 text-red-500" />
                <span className="text-[11px]">引导</span>
              </button>
              <button 
                onClick={() => setGuideChip('')}
                className="hover:text-slate-700 p-0.5"
                title="删除建议"
              >
                <Trash2 className="w-3 h-3" />
              </button>
              <button className="hover:text-slate-700 p-0.5">
                <MoreHorizontal className="w-3 h-3" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sticky Rich Prompt Bar */}
      <div className={`ai-composer ${pptMode?'ai-ppt-composer':''} absolute bottom-0 left-0 right-0 p-4 pt-2 bg-gradient-to-t from-white via-white/90 to-transparent flex flex-col items-center z-20`}>
        <div className="w-full max-w-3xl relative ai-composer-inner">
          {/* Sleeping Mascot on top of input container when on home (Image 9) */}
          {!activeTopic && !voiceOpen && !selectedAgent && (
            <div className="absolute -top-7 right-6 z-10 pointer-events-none">
              <Mascot size={72} sleeping />
            </div>
          )}

          {/* Input Box Card */}
          {voiceOpen ? <VoiceInput draft={inputMessage} onCancel={() => { setVoiceOpen(false); requestAnimationFrame(() => microphoneButton.current?.focus()); }} onSend={text => { setVoiceOpen(false); setInputMessage(''); onSendQuery(text); }} /> : <div className="bg-white rounded-2xl shadow-md border border-slate-200/80 p-3 flex flex-col gap-2">
            {pptMode&&pptTemplate&&<div className="ppt-selected-template" aria-label="已选PPT模板"><img src={pptTemplateImage(pptTemplate)} alt=""/><span>{pptTemplate.name}</span><button aria-label="移除所选PPT模板" onClick={()=>{setPptTemplate(null);setPptError('');composerInput.current?.focus();}}><X size={14}/></button></div>}
            <textarea
              ref={composerInput}
              aria-label="消息内容"
              value={inputMessage}
              onChange={(e) => {setInputMessage(e.target.value);setPptError('');}}
              onKeyDown={handleKeyDown}
              rows={pptMode?1:2}
              placeholder={pptMode?(pptTemplate?'请输入PPT主题或内容…':'请选择模板'):'输入您的任务、业务指令或查询，让企业 AI 助手协助您快速完成...'}
              aria-invalid={!!pptError} aria-describedby={pptError?'ppt-composer-error':undefined}
              className="w-full resize-none text-sm text-slate-800 placeholder-slate-400 outline-hidden bg-transparent"
            />

            {pptError&&<p className="ppt-composer-error" role="alert" id="ppt-composer-error">{pptError}</p>}
            {/* Sub-tools Toolbar */}
            <div className="ai-composer-toolbar flex items-center justify-between pt-1 border-t border-slate-50 text-xs">
              <AgentComposerTools agent={selectedAgent} onSelect={agent=>{onSelectAgent(agent);setVoiceOpen(false);setPptError('');requestAnimationFrame(()=>composerInput.current?.focus());}} onInsert={insertContext} busy={busy} selectedPptTemplate={pptTemplate} onPptTemplateChange={template=>{setPptTemplate(template);setPptError('');requestAnimationFrame(()=>composerInput.current?.focus());}} />

              {/* Right tools: Web search, Model, Mic */}
              <div className="flex items-center gap-2 shrink-0">
                {(!selectedAgent || ['智能问答', '智能摘要', '法智小新'].includes(selectedAgent)) && <button
                  type="button"
                  onClick={() => setEnableWebSearch(!enableWebSearch)}
                  aria-pressed={enableWebSearch}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg transition-colors ${
                    enableWebSearch ? 'bg-red-50 text-red-600' : 'text-slate-500 hover:bg-slate-100'
                  }`}
                >
                  <img src={figmaAssets['71-5347:img6']} alt="" width="16" height="16" />
                  <span>{selectedAgent ? (enableWebSearch ? '已联网' : '未联网') : '联网搜索'}</span>
                </button>}

                {/* Model selector dropdown */}
                <SelectField label="选择模型" variant="pill" placement="top" value={selectedModel} onChange={setSelectedModel} options={['qwen3.8-27b', 'gemini-2.5-flash', 'deepseek-r1']} />

                {/* Microphone Record Button */}
                <button
                  type="button"
                  className="composer-primary-action w-7 h-7 rounded-full bg-red-500 text-white flex items-center justify-center hover:bg-red-600 transition-colors shadow-xs"
                  ref={microphoneButton}
                  onClick={() => { if (busy) stop(); else if (pptMode||inputMessage.trim()) sendText(); else setVoiceOpen(true); }}
                  aria-label={actionLabel}
                  title={actionLabel}
                  data-state={busy ? 'stop' : pptMode||inputMessage.trim() ? 'send' : 'voice'}
                >
                  {busy ? <Square size={13} fill="currentColor" strokeWidth={0}/> : pptMode||inputMessage.trim() ? <ArrowUp size={19} strokeWidth={1.8}/> : <Mic className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>
          </div>}

          {/* Red Security Compliance Notice */}
          <p className="text-[11px] text-red-500 text-center mt-2 font-medium tracking-tight">
            请勿上传、处理涉及国家秘密、工作秘密、敏感信息等涉密敏感内容
          </p>
        </div>
      </div>
    </div>
  );
};
