import React, { useEffect, useRef, useState } from 'react';
import { ArrowUp, X, RotateCw } from 'lucide-react';
import './voice-input.css';

type RecognitionEvent = { results: ArrayLike<{ isFinal: boolean; 0: { transcript: string } }> };
type Recognition = {
  lang: string; continuous: boolean; interimResults: boolean;
  onstart: (() => void) | null; onend: (() => void) | null;
  onspeechstart: (() => void) | null; onspeechend: (() => void) | null;
  onresult: ((event: RecognitionEvent) => void) | null;
  onerror: ((event: { error: string }) => void) | null;
  start: () => void; stop: () => void; abort: () => void;
};
type SpeechWindow = Window & { SpeechRecognition?: new () => Recognition; webkitSpeechRecognition?: new () => Recognition };

export function VoiceInput({ draft, onCancel, onSend }: { draft: string; onCancel: () => void; onSend: (text: string) => void }) {
  const [status, setStatus] = useState<'starting' | 'listening' | 'stopped' | 'error' | 'sending'>('starting');
  const [transcript, setTranscript] = useState(draft);
  const [error, setError] = useState('');
  const [speaking, setSpeaking] = useState(false);
  const [attempt, setAttempt] = useState(0);
  const textRef = useRef(draft);
  const recognitionRef = useRef<Recognition | null>(null);
  const pendingSend = useRef(false);
  const sendRef = useRef(onSend);
  const cancelRef = useRef(onCancel);
  const finishRef = useRef<() => void>(() => {});
  const cancelButton = useRef<HTMLButtonElement>(null);
  sendRef.current = onSend;
  cancelRef.current = onCancel;
  const available = !!((window as SpeechWindow).SpeechRecognition || (window as SpeechWindow).webkitSpeechRecognition);

  useEffect(() => {
    cancelButton.current?.focus();
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') { event.preventDefault(); cancelRef.current(); } };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const Constructor = (window as SpeechWindow).SpeechRecognition || (window as SpeechWindow).webkitSpeechRecognition;
    if (!Constructor) { setStatus('error'); setError('当前浏览器不支持语音识别，请使用键盘输入，或在支持语音识别的浏览器中打开。'); return; }
    let disposed = false;
    let timer: ReturnType<typeof setTimeout> | undefined;
    let sent = false;
    const prefix = textRef.current.trim();
    const recognition = new Constructor();
    recognitionRef.current = recognition;
    recognition.lang = 'zh-CN'; recognition.continuous = true; recognition.interimResults = true;
    const finish = () => {
      if (disposed || sent || !pendingSend.current) return;
      pendingSend.current = false;
      if (timer) clearTimeout(timer);
      if (textRef.current.trim()) { sent = true; sendRef.current(textRef.current.trim()); }
      else setStatus('stopped');
    };
    finishRef.current = () => { timer = setTimeout(() => { recognition.abort(); finish(); }, 1200); };
    recognition.onstart = () => { if (!disposed) { setStatus('listening'); setError(''); } };
    recognition.onspeechstart = () => { if (!disposed) setSpeaking(true); };
    recognition.onspeechend = () => { if (!disposed) setSpeaking(false); };
    recognition.onresult = event => {
      if (disposed || sent) return;
      const spoken = Array.from(event.results).map(result => result[0].transcript).join('');
      textRef.current = prefix + (prefix && spoken ? ' ' : '') + spoken;
      setTranscript(textRef.current);
    };
    recognition.onerror = event => {
      if (disposed || sent) return;
      setSpeaking(false);
      const messages: Record<string,string> = {
        'not-allowed': '麦克风权限未开启，请在浏览器中允许麦克风后重试。',
        'service-not-allowed': '浏览器未允许语音识别服务，请检查权限后重试。',
        'audio-capture': '未检测到可用麦克风，请连接麦克风后重试。',
        'no-speech': '没有听清，请点击重试后再说一次。',
        network: '语音识别连接失败，请检查网络后重试。',
        'language-not-supported': '当前识别服务不支持中文，请使用键盘输入。',
      };
      setError(messages[event.error] || '语音识别已中断，您可以编辑文字或重试。');
      setStatus('error');
      if (pendingSend.current) finish();
    };
    recognition.onend = () => {
      if (disposed || sent) return;
      setSpeaking(false); recognitionRef.current = null;
      if (pendingSend.current) finish();
      else setStatus(value => value === 'error' ? 'error' : 'stopped');
    };
    setStatus('starting'); setError('');
    try { recognition.start(); } catch { setStatus('error'); setError('暂时无法启动麦克风，请重试或使用键盘输入。'); }
    return () => {
      disposed = true; pendingSend.current = false;
      if (timer) clearTimeout(timer);
      recognition.onstart = recognition.onend = recognition.onspeechstart = recognition.onspeechend = null;
      recognition.onresult = recognition.onerror = null;
      recognition.abort(); recognitionRef.current = null;
    };
  }, [attempt]);

  const submit = () => {
    if (!textRef.current.trim() || pendingSend.current) return;
    if (status === 'listening' && recognitionRef.current) {
      pendingSend.current = true; setStatus('sending'); setSpeaking(false);
      finishRef.current();
      try { recognitionRef.current.stop(); } catch { pendingSend.current = false; onSend(textRef.current.trim()); }
    } else onSend(textRef.current.trim());
  };
  const statusText = status === 'starting' ? '正在连接麦克风…' : status === 'listening' ? '正在聆听，请继续说…' : status === 'sending' ? '正在完成转写…' : status === 'error' ? error : transcript.trim() ? '录音已结束，可编辑文字后发送' : '未识别到内容，请重试或输入文字';
  return <section className={`voice-input is-${status} ${speaking ? 'is-speaking' : ''}`} aria-label="语音输入">
    <img className="voice-mascot" src="assets/figma/c577ac5f-2dab-4548-afb5-61bc3d306e33.png" alt="广智新助手"/>
    <div className="voice-status" role="status"><span className="voice-dot"/><span>{statusText}</span>{available && (status === 'error' || status === 'stopped') && <button className="voice-retry" onClick={() => setAttempt(value => value + 1)}><RotateCw size={14}/>重试</button>}</div>
    <textarea className="voice-transcript" aria-label="语音转写内容" placeholder={status === 'listening' ? '请说出您的任务或问题…' : '输入您的任务或问题…'} value={transcript} readOnly={status === 'starting' || status === 'listening' || status === 'sending'} onChange={event => {textRef.current = event.target.value;setTranscript(event.target.value);}} onKeyDown={event => {if(event.key === 'Enter' && !event.shiftKey && !event.nativeEvent.isComposing){event.preventDefault();submit();}}}/>
    <div className="voice-bottom"><div className="voice-wave" aria-hidden="true">{[5,9,17,11,25,18,28,14,22,11,18,7,13,5].map((height,i)=><i key={i} style={{height,animationDelay:`${i * -0.09}s`}}/>)}</div><span className="voice-caption">{status === 'listening' ? '实时转写' : status === 'sending' ? '正在整理' : status === 'starting' ? '等待连接' : '可编辑文字'}</span><div className="voice-actions"><button ref={cancelButton} type="button" className="voice-cancel" aria-label="取消语音输入" title="取消（Esc）" onClick={onCancel}><X size={22} strokeWidth={1.5}/></button><button type="button" className="voice-send" aria-label="发送语音内容" title="发送" disabled={!transcript.trim() || status === 'starting' || status === 'sending'} onClick={submit}><ArrowUp size={22} strokeWidth={1.5}/></button></div></div>
  </section>;
}
