import React, { useEffect, useRef, useState } from 'react';
import { FileText, X, CircleX } from 'lucide-react';
import { Button } from './UI';
import uploadCloudIcon from '../assets/upload-cloud.svg';
import { figmaAssets } from '../data/figmaAssets';
import { SelectField } from './SelectField';
import { PeopleField, MeetingTimeField } from './ScheduleFields';
import { CURRENT_SCHEDULE_USER, downloadScheduleAttachment, type ScheduleAttachment, type ScheduleItem } from '../data/schedules';

export function ScheduleDialog({kind,day,onClose,onSave}: {kind:'meeting'|'event';day:string;onClose:()=>void;onSave:(item:ScheduleItem)=>Promise<void>}) {
  const dialog=useRef<HTMLDialogElement>(null);const upload=useRef<HTMLInputElement>(null);const savingRef=useRef(false);
  const [draft,setDraft]=useState<ScheduleItem>(()=>({id:crypto.randomUUID(),kind,title:'',start:`${day}T09:00`,end:`${day}T10:00`,mode:'线下',location:'',host:'',participants:[],informed:[],reminder:'10分钟',visibility:'公开日程',content:'',description:'',attachments:[],creator:CURRENT_SCHEDULE_USER,completed:false}));
  const [offlineLocation,setOfflineLocation]=useState('');const [onlineLocation,setOnlineLocation]=useState('');
  const [errors,setErrors]=useState<Record<string,string>>({});const [saving,setSaving]=useState(false);const [drop,setDrop]=useState(false);const [saveError,setSaveError]=useState('');
  const meeting=kind==='meeting';const name=meeting?'会议名称':'事件名称';
  useEffect(()=>{const el=dialog.current!;el.showModal();return()=>el.close();},[]);
  const change=<K extends keyof ScheduleItem>(key:K,value:ScheduleItem[K])=>{setDraft(d=>({...d,[key]:value}));setErrors(e=>({...e,[key]:''}));setSaveError('');};
  const addFiles=(files:File[])=>change('attachments',[...draft.attachments,...files.map(file=>({id:crypto.randomUUID(),name:file.name,size:file.size,blob:file}))]);
  const error=(key:string)=>errors[key]?<span className="sch-field-error" role="alert">{errors[key]}</span>:null;
  const submit=async(e:React.FormEvent)=>{
    e.preventDefault();if(savingRef.current)return;
    const next:Record<string,string>={};if(!draft.title.trim())next.title=`请输入${name}`;
    if(!draft.start||!Number.isFinite(new Date(draft.start).getTime()))next.start='请选择开始时间';
    if(!draft.end||!Number.isFinite(new Date(draft.end).getTime()))next.end='请选择结束时间';
    else if(draft.end<=draft.start)next.end='结束时间须晚于开始时间';
    if(meeting&&!draft.host)next.host='请选择主持人';
    if(meeting&&!draft.participants.length)next.participants='请至少选择一位与会人';
    if(!meeting&&!draft.content.trim())next.content='请输入事件内容';
    if(meeting&&draft.mode==='线上'&&draft.location.trim()){try{const url=new URL(draft.location.trim());if(!['http:','https:'].includes(url.protocol))throw new Error();}catch{next.location='请输入以 http:// 或 https:// 开头的会议链接';}}
    setErrors(next);if(Object.keys(next).length){requestAnimationFrame(()=>dialog.current?.querySelector<HTMLElement>('[aria-invalid="true"], [data-invalid="true"] button')?.focus());return;}
    savingRef.current=true;setSaving(true);setSaveError('');
    try{await onSave({...draft,title:draft.title.trim(),location:draft.location.trim(),content:draft.content.trim(),description:draft.description.trim()});}catch{setSaveError('保存失败，请检查浏览器存储空间后重试。填写的内容已保留。');savingRef.current=false;setSaving(false);}
  };
  return <dialog ref={dialog} className={`gx-dialog sch-dialog sch-create-dialog ${meeting?'is-meeting':'is-event'}`} aria-labelledby="sch-dialog-title" onCancel={e=>{e.preventDefault();if(!saving)onClose();}}>
    <header className="gx-dialog-header"><h2 id="sch-dialog-title">新建{meeting?'会议':'事件'}</h2><button type="button" disabled={saving} aria-label="关闭新增日程" onClick={onClose}><X size={18}/></button></header>
    <form className="gx-dialog-form" onSubmit={submit} noValidate><div className="gx-dialog-body sch-form-body"><fieldset disabled={saving} className="sch-fields">
      <div className="sch-field full"><label htmlFor="sch-title"><i>*</i>{name}</label><div className="sch-count-input"><input autoFocus id="sch-title" aria-invalid={!!errors.title} maxLength={20} value={draft.title} onChange={e=>change('title',e.target.value)} placeholder={`请输入${name}`}/><span>{draft.title.length}/20</span></div>{error('title')}</div>
      {meeting?<>
        <div className="sch-field"><label><i>*</i>会议时间</label><MeetingTimeField start={draft.start} end={draft.end} onStart={v=>change('start',v)} onEnd={v=>change('end',v)} invalid={!!(errors.start||errors.end)}/>{error('start')}{error('end')}</div>
        <div className="sch-field"><label><i>*</i>会议类型</label><SelectField label="会议类型" value={draft.mode} onChange={mode=>{if(draft.mode==='线下')setOfflineLocation(draft.location);else setOnlineLocation(draft.location);change('mode',mode as ScheduleItem['mode']);change('location',mode==='线下'?offlineLocation:onlineLocation);}} options={['线下','线上']}/></div>
        <div className="sch-field"><label htmlFor="sch-location">{draft.mode==='线下'?'会议地址':'会议链接'}</label><input id="sch-location" value={draft.location} placeholder={draft.mode==='线下'?'请输入会议地址':'请输入会议链接'} aria-invalid={!!errors.location} onChange={e=>change('location',e.target.value)}/>{error('location')}</div>
        <div className="sch-field"><label><i>*</i>主持人</label><PeopleField label="主持人" value={draft.host?[draft.host]:[]} onChange={v=>change('host',v[0]||'')} invalid={!!errors.host}/>{error('host')}</div>
      </>:<>
        <div className="sch-field"><label htmlFor="sch-start"><i>*</i>开始时间</label><input id="sch-start" type="datetime-local" value={draft.start} onChange={e=>change('start',e.target.value)} aria-invalid={!!errors.start}/>{error('start')}</div>
        <div className="sch-field"><label htmlFor="sch-end"><i>*</i>结束日期</label><input id="sch-end" type="datetime-local" min={draft.start} value={draft.end} onChange={e=>change('end',e.target.value)} aria-invalid={!!errors.end}/>{error('end')}</div>
      </>}
      <div className="sch-field full"><label>{meeting&&<i>*</i>}{meeting?'与会人':'安排他人'}</label><PeopleField multiple label={meeting?'与会人':'安排他人'} value={draft.participants} onChange={v=>change('participants',v)} invalid={!!errors.participants}/>{error('participants')}</div>
      <div className="sch-field full"><label>告知人</label><PeopleField multiple label="告知人" value={draft.informed} onChange={v=>change('informed',v)}/></div>
      {!meeting&&<div className="sch-field full"><label htmlFor="sch-content"><i>*</i>事件内容</label><div className="sch-textarea"><textarea id="sch-content" placeholder="请输入" maxLength={200} value={draft.content} onChange={e=>change('content',e.target.value)} aria-invalid={!!errors.content}/><span>{draft.content.length}/200</span></div>{error('content')}</div>}
      <div className="sch-field"><label>提前提醒</label><SelectField label="提前提醒" options={['不提醒','5分钟','10分钟','15分钟','30分钟','1小时']} value={draft.reminder} onChange={v=>change('reminder',v)}/></div>
      <div className="sch-field"><label>可见范围</label><SelectField label="可见范围" options={['公开日程','个人日程']} value={draft.visibility} onChange={v=>change('visibility',v as ScheduleItem['visibility'])}/></div>
      <div className="sch-field full"><label htmlFor="sch-description">描述</label><div className="sch-textarea"><textarea id="sch-description" maxLength={200} placeholder="请输入" value={draft.description} onChange={e=>change('description',e.target.value)}/><span>{draft.description.length}/200</span></div></div>
      <div className="sch-field full"><label>上传附件</label><button type="button" className={`sch-upload ${drop?'is-drag-over':''}`} onClick={()=>upload.current?.click()} onDragOver={e=>{e.preventDefault();setDrop(true);}} onDragLeave={()=>setDrop(false)} onDrop={e=>{e.preventDefault();setDrop(false);addFiles(Array.from(e.dataTransfer.files));}}><img src={uploadCloudIcon} width={28} height={21} alt=""/><span>点击上传文件</span></button><input ref={upload} type="file" multiple hidden aria-label="日程附件" onChange={e=>{addFiles(Array.from(e.target.files||[]));e.target.value='';}}/>
        <AttachmentList files={draft.attachments} onRemove={id=>change('attachments',draft.attachments.filter(f=>f.id!==id))}/>
      </div>
    </fieldset>{saveError&&<p className="sch-save-error" role="alert">{saveError}</p>}</div><footer className="gx-dialog-footer"><Button disabled={saving} onClick={onClose}>取消</Button><Button variant="primary" type="submit" loading={saving}>{saving?'保存中':'确定'}</Button></footer></form>
  </dialog>;
}
export function AttachmentList({files,onRemove}: {files:ScheduleAttachment[];onRemove?:(id:string)=>void}) {
  return files.length>0?<ul className="sch-attachments">{files.map(file=><li key={file.id}>{/\.pdf$/i.test(file.name)?<span className="sch-pdf-icon"><img src={figmaAssets['71-3575:img1']} alt=""/></span>:<FileText size={20}/>}<button type="button" title={file.name} onClick={()=>downloadScheduleAttachment(file)}>{file.name}</button><span>{file.size<1024?`${file.size}B`:`${(file.size/1024).toFixed(2)}KB`}</span>{onRemove&&<button type="button" className="sch-remove-file" aria-label={`移除附件${file.name}`} onClick={()=>onRemove(file.id)}><CircleX size={14}/></button>}</li>)}</ul>:null;
}
