import React, { useEffect, useRef, useState } from 'react';
import { Check, Pencil, X } from 'lucide-react';
import { Button, ModalSurface } from './UI';
import { AGENT_IMAGES, cropAgentImage, decodeAgentImage, initialAgentCrop, readAgentImage, type AgentImageCrop, type AgentImageSource } from '../data/agentImages';
import { AgentImageCropper } from './AgentImageCropper';
import uploadCloud from '../assets/upload-cloud.svg';
import './agent-image-dialog.css';

export function AgentImageDialog({ value, onClose, onConfirm }: {
  value?: string; onClose: () => void; onConfirm: (image: string) => void;
}) {
  const [selected, setSelected] = useState(value?.startsWith('data:') ? 'upload' : value || '');
  const [uploaded, setUploaded] = useState<AgentImageSource | null>(null);
  const [crop, setCrop] = useState<AgentImageCrop | null>(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);
  const input = useRef<HTMLInputElement>(null), sequence = useRef(0), choice = useRef(0), dragDepth = useRef(0);
  useEffect(() => {
    if (value?.startsWith('data:')) {
      const current = ++sequence.current; setLoading(true);
      void decodeAgentImage(value).then(source => {
        if (sequence.current !== current) return;
        setUploaded(source); setCrop(initialAgentCrop(source, 1));
      }).catch(() => { if (sequence.current === current) { setError('原图片无法读取，请重新上传或选择预设图片。'); setSelected(previous => previous === 'upload' ? '' : previous); } })
        .finally(() => { if (sequence.current === current) setLoading(false); });
    }
    return () => { sequence.current++; };
  }, []);
  const upload = async (files: File[]) => {
    const current = ++sequence.current;
    const selectedChoice = ++choice.current;
    setError(''); setDragging(false); dragDepth.current = 0;
    if (files.length !== 1) { setLoading(false); setError('请一次上传一张图片。'); return; }
    setLoading(true);
    try {
      const image = await readAgentImage(files[0]);
      if (sequence.current !== current) return;
      setUploaded(image); setCrop(initialAgentCrop(image)); if (choice.current === selectedChoice) setSelected('upload');
    } catch (reason) { if (sequence.current === current) setError(reason instanceof Error ? reason.message : '上传失败，请重试。'); }
    finally { if (sequence.current === current) setLoading(false); }
  };
  const choose = (image: string) => { choice.current++; setSelected(image); setError(''); };
  const confirm = async () => {
    if (saving || !selected || (selected === 'upload' && (loading || !uploaded || !crop))) return;
    if (selected !== 'upload') { onConfirm(selected); return; }
    // Reconfirming an unchanged saved image preserves its original encoding.
    if (uploaded!.src === value && crop!.x === 0 && crop!.y === 0 && crop!.size === uploaded!.width && crop!.size === uploaded!.height) { onConfirm(value!); return; }
    const current = ++sequence.current; setSaving(true); setError('');
    try { const image = await cropAgentImage(uploaded!, crop!); if (sequence.current === current) onConfirm(image); }
    catch { if (sequence.current === current) setError('裁剪失败，请重试或选择其他图片。'); }
    finally { if (sequence.current === current) setSaving(false); }
  };
  return <ModalSurface label="图片设置" className="agent-image-dialog" onClose={onClose}>
    <header className="gx-dialog-header"><h2>图片设置</h2><button aria-label="关闭图片设置" onClick={onClose}><X size={18}/></button></header>
    <div className="gx-dialog-body">
      <input ref={input} className="aip-file-input" type="file" accept="image/png,image/jpeg,.png,.jpg,.jpeg" hidden aria-label="上传智能体图片" onChange={event => { const files = Array.from(event.target.files || []); event.target.value = ''; if (files.length && !saving) void upload(files); }}/>
      <div className="aip-toolbar"><Button variant="text" disabled={saving} onClick={() => input.current?.click()}><Pencil size={14}/>重新上传</Button></div>
      {error && <p className="aip-error" role="alert">{error}</p>}
      <div className="aip-layout" inert={saving}>
        <div className="aip-presets" role="group" aria-label="预设图片">{AGENT_IMAGES.map(image => <button key={image.src} type="button" aria-label={`选择${image.name}图片`} aria-pressed={selected === image.src} onClick={() => choose(image.src)}>
          <img src={image.src} alt={image.name} draggable={false}/>{selected === image.src && <span className="aip-selected-mark"><Check size={14}/></span>}
        </button>)}</div>
        <div className={`aip-dropzone ${dragging ? 'is-dragging' : ''} ${uploaded ? 'has-image' : ''}`} aria-busy={loading}
          onDragOver={event => { event.preventDefault(); event.dataTransfer.dropEffect = 'copy'; }}
          onDragEnter={event => { event.preventDefault(); dragDepth.current++; setDragging(true); }}
          onDragLeave={event => { event.preventDefault(); dragDepth.current = Math.max(0, dragDepth.current - 1); if (!dragDepth.current) setDragging(false); }}
          onDrop={event => { event.preventDefault(); void upload(Array.from(event.dataTransfer.files)); }}>
          {uploaded && crop ? <AgentImageCropper source={uploaded} crop={crop} selected={selected === 'upload'} onChange={setCrop} onSelect={() => choose('upload')}/>
            : <button className="aip-upload-trigger" type="button" onClick={() => input.current?.click()}><img src={uploadCloud} alt=""/><span>将图片拖到此处，或<strong>点击上传</strong></span><small>支持 PNG、JPG、JPEG 格式，最大5MB</small></button>}
          {dragging && <span className="aip-drag-message">松开以上传图片</span>}
          {loading && <span className="aip-loading" role="status">正在处理图片…</span>}
        </div>
      </div>
      <p className="aip-description">选择预设图片，或上传图片后调整正方形裁剪范围，点击“确定”应用。</p>
    </div>
    <footer className="gx-dialog-footer"><Button onClick={onClose}>取消</Button><Button variant="primary" loading={saving} disabled={!selected || (selected === 'upload' && (loading || !uploaded || !crop))} onClick={() => void confirm()}>确定</Button></footer>
  </ModalSurface>;
}
