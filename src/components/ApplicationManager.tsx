import { Button } from './UI';
import React, { useEffect, useRef, useState } from 'react';
import { Minus, Plus, X } from 'lucide-react';
import { appCatalogs, appCategories, type AppScope, type WorkbenchApp } from '../data/workbenchApps';
import './application-manager.css';
import { WorkbenchVectorIcon, hasWorkbenchVector } from './WorkbenchVectorIcon';

interface ApplicationManagerProps {
  scope: AppScope;
  selectedIds: string[];
  onClose: () => void;
  onSave: (ids: string[]) => boolean;
  onOpenApp: (app: WorkbenchApp) => void;
}
function AppIcon({ app }: { app: WorkbenchApp }) {
  if (hasWorkbenchVector(app.id)) return <WorkbenchVectorIcon name={app.id} className="app-manager-vector" />;
  const Icon = app.icon;
  return <span className="app-manager-icon" style={{ background: `linear-gradient(145deg,${app.color}aa,${app.color})` }}><Icon size={22} strokeWidth={1.8} /></span>;
}
export function ApplicationManager({ scope, selectedIds, onClose, onSave, onOpenApp }: ApplicationManagerProps) {
  const dialog = useRef<HTMLDialogElement>(null);
  const closeButton = useRef<HTMLButtonElement>(null);
  const manageButton = useRef<HTMLButtonElement>(null);
  const draggedId = useRef<string | null>(null);
  const [draft, setDraft] = useState([...selectedIds]);
  const [isEditing, setIsEditing] = useState(false);
  const [dropTarget, setDropTarget] = useState<string | null>(null);
  const [activeDrag, setActiveDrag] = useState<string | null>(null);
  const clearDrag = () => { draggedId.current = null; setActiveDrag(null); setDropTarget(null); };
  const [announcement, setAnnouncement] = useState('');
  const [saveError, setSaveError] = useState('');
  const catalog = appCatalogs[scope];
  const selected = draft.map(id => catalog.find(app => app.id === id)!).filter(Boolean);
  const available = isEditing ? catalog.filter(app => !draft.includes(app.id)) : catalog;
  useEffect(() => {
    const trigger = document.activeElement as HTMLElement | null;
    const element = dialog.current!;
    element.showModal(); closeButton.current?.focus();
    return () => { element.close(); trigger?.focus(); };
  }, []);
  const add = (app: WorkbenchApp) => { if (!isEditing) return; setDraft(ids => ids.includes(app.id) ? ids : [...ids, app.id]); setSaveError(''); setAnnouncement(`已添加${app.name}`); };
  const remove = (app: WorkbenchApp) => { if (!isEditing) return; setDraft(ids => ids.filter(id => id !== app.id)); setSaveError(''); setAnnouncement(`已移除${app.name}`); };
  const reorder = (id: string, target: string) => {
    if (!isEditing) return;
    setDraft(ids => {
      const from = ids.indexOf(id), to = ids.indexOf(target);
      if (from < 0 || to < 0 || from === to) return ids;
      const next = [...ids]; next.splice(from, 1); next.splice(to, 0, id); return next;
    });
    setSaveError('');
  };
  const move = (app: WorkbenchApp, direction: number) => {
    const position = draft.indexOf(app.id) + direction;
    if (position < 0 || position >= draft.length) return;
    reorder(app.id, draft[position]); setAnnouncement(`已将${app.name}移至第${position + 1}位`);
  };
  const finishEditing = () => {
    clearDrag(); setIsEditing(false); setSaveError('');
    requestAnimationFrame(() => manageButton.current?.focus());
  };
  const cancelEditing = () => { setDraft([...selectedIds]); finishEditing(); setAnnouncement('已取消修改'); };
  const openApp = (app: WorkbenchApp) => { if (isEditing) return; onClose(); onOpenApp(app); };
  const save = () => {
    if (!isEditing) return;
    if (onSave(draft)) { finishEditing(); setAnnouncement('已保存'); }
    else setSaveError('保存失败，请检查浏览器存储权限后重试。');
  };
  return <dialog ref={dialog} className={`app-manager-dialog ${isEditing ? 'is-editing' : 'is-browsing'}`} aria-labelledby="app-manager-title" onCancel={event => { event.preventDefault(); if (isEditing) cancelEditing(); else onClose(); }} onClick={event => {
    if (event.target !== event.currentTarget) return;
    const box = event.currentTarget.getBoundingClientRect();
    if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) onClose();
  }}>
    <header className="app-manager-header"><div><h2 id="app-manager-title">{scope === 'common' ? '添加应用' : '添加系统'}</h2></div><button ref={closeButton} aria-label="关闭应用管理" onClick={onClose}><X size={20} /></button></header>
    <div className="app-manager-body">
      <section className="app-manager-section app-manager-selected" aria-label={scope === 'common' ? '我的应用' : '我的系统'}>
        <div className="app-manager-selection-heading"><h3>{scope === 'common' ? '我的应用' : '我的系统'}</h3>{isEditing ? <span className="app-manager-edit-label">编辑中 · 拖动调整顺序</span> : <button ref={manageButton} className="app-manager-manage" onClick={() => { setDraft([...selectedIds]); setSaveError(''); setIsEditing(true); }}>管理</button>}</div>
        {selected.length ? <div className="app-manager-grid">{selected.map((app, index) => <div key={app.id} data-app-id={app.id} className={`app-manager-item is-selected ${dropTarget === app.id ? 'is-drop-target' : ''} ${activeDrag === app.id ? 'is-dragging' : ''}`} draggable={isEditing} tabIndex={0} role={isEditing ? 'group' : 'button'} aria-label={isEditing ? `${app.name}，第${index + 1}位，可拖动或按 Alt 加左右方向键调整顺序` : `打开${app.name}`} aria-keyshortcuts={isEditing ? 'Alt+ArrowLeft Alt+ArrowRight' : undefined}
          onClick={() => openApp(app)}
          onKeyDown={event => { if (!isEditing && ['Enter', ' '].includes(event.key)) { event.preventDefault(); openApp(app); } if (isEditing && event.altKey && ['ArrowLeft', 'ArrowRight'].includes(event.key)) { event.preventDefault(); move(app, event.key === 'ArrowLeft' ? -1 : 1); } }}
          onDragStart={event => { if (!isEditing) { event.preventDefault(); return; } draggedId.current = app.id; setActiveDrag(app.id); event.dataTransfer.effectAllowed = 'move'; event.dataTransfer.setData('text/plain', app.id); const box = event.currentTarget.getBoundingClientRect(); event.dataTransfer.setDragImage(event.currentTarget, event.clientX - box.left, event.clientY - box.top); }}
          onDragOver={event => { if (isEditing && draggedId.current) { event.preventDefault(); event.dataTransfer.dropEffect = 'move'; setDropTarget(draggedId.current === app.id ? null : app.id); } }}
          onDragLeave={event => { if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setDropTarget(id => id === app.id ? null : id); }}
          onDrop={event => { event.preventDefault(); if (isEditing && draggedId.current) { reorder(draggedId.current, app.id); setAnnouncement(`已将${catalog.find(item => item.id === draggedId.current)?.name || '应用'}移至第${index + 1}位`); } clearDrag(); }}
          onDragEnd={clearDrag}>
          <div className="app-manager-icon-wrap"><AppIcon app={app} />{isEditing && <button className="app-manager-badge remove" aria-label={`移除${app.name}`} onClick={() => remove(app)} draggable={false} onDragStart={event => event.preventDefault()}><Minus size={13} strokeWidth={2.5} /></button>}</div>
          <span className="app-manager-name" title={app.name}>{app.name}</span>
        </div>)}</div> : <div className="app-manager-empty">暂无{scope === 'common' ? '应用' : '系统'}，{isEditing ? '可从下方添加' : '点击管理添加'}</div>}
      </section>
      <section className="app-manager-section app-manager-catalog" aria-label={isEditing ? '可添加的应用' : '应用目录'}>
        {appCategories[scope].map(category => {
          const apps = available.filter(app => app.category === category);
          return apps.length ? <div className="app-manager-category" key={category}><h4>{category}</h4><div className="app-manager-grid">{apps.map(app => <button key={app.id} data-app-id={app.id} className="app-manager-item" aria-label={`${isEditing ? '添加' : '打开'}${app.name}`} onClick={() => isEditing ? add(app) : openApp(app)}><span className="app-manager-icon-wrap"><AppIcon app={app} />{isEditing && <span className="app-manager-badge add"><Plus size={13} strokeWidth={2.5} /></span>}</span><span className="app-manager-name" title={app.name}>{app.name}</span></button>)}</div></div> : null;
        })}
        {!available.length && <div className="app-manager-empty">已添加全部应用</div>}
      </section>
    </div>
    {isEditing && <footer className="app-manager-footer">{saveError && <p role="alert">{saveError}</p>}<Button className="app-manager-cancel" onClick={cancelEditing}>取消</Button><Button variant="primary" className="app-manager-save" onClick={save}>保存</Button></footer>}
    <span className="sr-only" role="status" aria-live="polite">{announcement}</span>
  </dialog>;
}
