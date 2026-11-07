import React, { useEffect, useRef, useState } from 'react';
import { ChevronDown, ChevronLeft, ChevronRight, Paperclip, Plus, X } from 'lucide-react';
import { Button, EmptyState, PanelHeading, StatusBadge } from './UI';
import { SelectField } from './SelectField';
import { AttachmentList, ScheduleDialog } from './ScheduleDialog';
import { CURRENT_SCHEDULE_USER, addDays, dayKey, isOnDay, loadSchedules, saveSchedule, scheduleKind, seedSchedules, weekDays, type ScheduleItem } from '../data/schedules';
import './schedule.css';
import { ScheduleCalendar } from './ScheduleCalendar';

function ScheduleDetail({item,onClose}: {item:ScheduleItem;onClose:()=>void}) {
  const dialog=useRef<HTMLDialogElement>(null);useEffect(()=>{const el=dialog.current!;el.showModal();return()=>el.close();},[]);
  const meeting=item.kind==='meeting';
  const rows=[['时间',`${item.start.replace('T',' ')} 至 ${item.end.replace('T',' ')}`],['类型',scheduleKind(item)],['发起人',item.creator],...(meeting?[['主持人',item.host]]:[]),[meeting?(item.mode==='线上'?'会议链接':'会议地址'):'途经及目的地',item.location],['与会 / 安排人员',item.participants.join('、')],['告知人',item.informed.join('、')],['提前提醒',item.reminder],['可见范围',item.visibility]];
  return <dialog ref={dialog} className="gx-dialog sch-dialog sch-detail-dialog" aria-labelledby="sch-detail-title" onCancel={e=>{e.preventDefault();onClose();}}><header className="gx-dialog-header"><h2 id="sch-detail-title">日程详情</h2><button aria-label="关闭日程详情" onClick={onClose}><X size={18}/></button></header><div className="gx-dialog-body sch-detail-body"><h3>{item.title}</h3><StatusBadge tone={item.completed?'success':'neutral'}>{item.completed?'已完成':'未开始'}</StatusBadge><dl>{rows.filter(([,value])=>value).map(([label,value])=><div key={label}><dt>{label}</dt><dd>{value}</dd></div>)}</dl>{item.content&&<section><h4>事件内容</h4><p>{item.content}</p></section>}{item.description&&<section><h4>描述</h4><p>{item.description}</p></section>}{item.attachments.length>0&&<section><h4>附件</h4><AttachmentList files={item.attachments}/></section>}</div><footer className="gx-dialog-footer"><Button onClick={onClose}>关闭</Button></footer></dialog>;
}
type ScheduleModuleProps={expanded?:boolean;initialDay?:string;initialScope?:string;onMore?:(day:string,scope:string)=>void;onBack?:(day:string,scope:string)=>void};
export function ScheduleModule({expanded=false,initialDay,initialScope='我的日程',onMore,onBack}:ScheduleModuleProps) {
  const [samples]=useState(seedSchedules);const [items,setItems]=useState<ScheduleItem[]>(samples);const [ready,setReady]=useState(false);
  const [day,setDay]=useState(()=>initialDay||dayKey(new Date()));const [scope,setScope]=useState(initialScope);const [menu,setMenu]=useState(false);
  const [create,setCreate]=useState<'meeting'|'event'|null>(null);const [detail,setDetail]=useState<ScheduleItem|null>(null);const [notice,setNotice]=useState('');const [savedId,setSavedId]=useState('');const [loadError,setLoadError]=useState('');
  const menuRoot=useRef<HTMLDivElement>(null);const addButton=useRef<HTMLButtonElement>(null);const returnFocus=useRef<HTMLElement|null>(null);const moreButton=useRef<HTMLButtonElement>(null);
  const load=()=>{let live=true;setLoadError('');loadSchedules().then(saved=>{if(live){setItems([...samples,...saved]);setReady(true);}}).catch(()=>{if(live)setLoadError('日程读取失败，请重试。');});return()=>{live=false;};};
  useEffect(load,[samples]);
  useEffect(()=>{if(!menu)return;menuRoot.current?.querySelector<HTMLButtonElement>('[role=menuitem]')?.focus();const outside=(e:PointerEvent)=>{if(!menuRoot.current?.contains(e.target as Node))setMenu(false);};document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside);},[menu]);
  const close=()=>{setCreate(null);setDetail(null);requestAnimationFrame(()=>{const target=returnFocus.current; if(target?.isConnected)target.focus();else addButton.current?.focus();});};
  const openCreate=(kind:'meeting'|'event')=>{returnFocus.current=addButton.current;setMenu(false);setCreate(kind);setNotice('');};
  const scoped=items.filter(item=>scope==='我发起的'?item.creator===CURRENT_SCHEDULE_USER:scope==='公开日程'?item.visibility==='公开日程':item.creator===CURRENT_SCHEDULE_USER||item.participants.includes(CURRENT_SCHEDULE_USER)||item.informed.includes(CURRENT_SCHEDULE_USER));
  const ordered=[...scoped].sort((a,b)=>a.start.localeCompare(b.start));const shown=ordered.filter(item=>isOnDay(item,day));const days=weekDays(day);
  const save=async(item:ScheduleItem)=>{await saveSchedule(item);setItems(previous=>[...previous.filter(i=>i.id!==item.id),item]);setDay(item.start.slice(0,10));setScope('我的日程');setSavedId(item.id);close();setNotice(`${item.kind==='meeting'?'会议':'事件'}已保存`);};
  const newControl=<div ref={menuRoot} className="sch-add-menu" onKeyDown={e=>{if(e.key==='Escape'&&menu){e.preventDefault();setMenu(false);addButton.current?.focus();}if(menu&&['ArrowDown','ArrowUp','Home','End'].includes(e.key)){e.preventDefault();const buttons=Array.from(menuRoot.current!.querySelectorAll<HTMLButtonElement>('[role=menuitem]'));const i=buttons.indexOf(document.activeElement as HTMLButtonElement);buttons[e.key==='Home'?0:e.key==='End'?buttons.length-1:(i+(e.key==='ArrowDown'?1:-1)+buttons.length)%buttons.length]?.focus();}}} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setMenu(false);}}>
        <button ref={addButton} className="sch-add-button" disabled={!ready} aria-haspopup="menu" aria-expanded={menu} onClick={()=>setMenu(!menu)} onKeyDown={e=>{if(e.key==='ArrowDown'&&!menu){e.preventDefault();setMenu(true);}}}><Plus size={15}/>{expanded?'新建':'新增日程'}{expanded&&<ChevronDown size={13}/>}</button>
        {menu&&<div className="sch-create-menu" role="menu" aria-label="新增日程类型"><button role="menuitem" onClick={()=>openCreate('meeting')}>新建会议</button><button role="menuitem" onClick={()=>openCreate('event')}>新建事件</button></div>}
      </div>;
  const notices=notice?<p className="sch-notice" role="status">{notice}<button aria-label="关闭日程提示" onClick={()=>setNotice('')}><X size={12}/></button></p>:null;
  const dialogs=<>{create&&<ScheduleDialog kind={create} day={day} onClose={close} onSave={save}/>} {detail&&<ScheduleDetail item={detail} onClose={close}/>}</>;
  const retry=()=>{void loadSchedules().then(saved=>{setItems([...samples,...saved]);setReady(true);setLoadError('');}).catch(()=>setLoadError('日程读取失败，请重试。'));};
  if(expanded)return <><ScheduleCalendar items={items} day={day} onDay={setDay} scope={scope} onScope={setScope} ready={ready} error={loadError} onRetry={retry} onBack={()=>onBack?.(day,scope)} onOpen={(item,trigger)=>{returnFocus.current=trigger;setDetail(item);}} newControl={newControl} notice={notices} savedId={savedId}/>{dialogs}</>;
  return <section className="wb-panel wb-schedule sch-module" aria-label="我的日程">
    <div className="sch-heading"><PanelHeading className="wb-heading" title="我的日程" icon={<img src="assets/workbench/heading-bar.png" alt=""/>}/><div className="sch-toolbar">
      {newControl}
      <SelectField label="日程范围" variant="compact" options={['我的日程','我发起的','公开日程']} value={scope} onChange={setScope}/>
      <button ref={moreButton} className="sch-more ui-more" aria-label="我的日程更多" onClick={()=>onMore?.(day,scope)}>更多<ChevronRight size={13}/></button>
    </div></div>
    <div className="sch-week" role="group" aria-label={`${days[0]} 至 ${days[6]} 周日历`}><button aria-label="上一周" onClick={()=>setDay(addDays(day,-7))}><ChevronLeft size={18}/></button><div>{days.map((date,i)=><button key={date} title={date} aria-label={`${date} 星期${'一二三四五六日'[i]}`} aria-pressed={date===day} tabIndex={date===day?0:-1} onClick={()=>setDay(date)} onKeyDown={e=>{const next=e.key==='ArrowLeft'?addDays(date,-1):e.key==='ArrowRight'?addDays(date,1):e.key==='Home'?days[0]:e.key==='End'?days[6]:null;if(next){e.preventDefault();setDay(next);requestAnimationFrame(()=>document.querySelector<HTMLButtonElement>(`.sch-week button[title="${next}"]`)?.focus());}}}><span>{'一二三四五六日'[i]}</span><b>{Number(date.slice(8))}</b>{ordered.some(item=>isOnDay(item,date))&&<i/>}</button>)}</div><button aria-label="下一周" onClick={()=>setDay(addDays(day,7))}><ChevronRight size={18}/></button></div>
    {loadError?<div className="sch-read-error" role="alert">{loadError}<button onClick={()=>{void loadSchedules().then(saved=>{setItems([...samples,...saved]);setReady(true);setLoadError('');}).catch(()=>setLoadError('日程读取失败，请重试。'));}}>重试</button></div>:<div className="sch-day-list" aria-label={`${day}日程列表`} aria-busy={!ready}>{shown.length?shown.map(item=><button className="sch-item" key={item.id} onClick={e=>{returnFocus.current=e.currentTarget;setDetail(item);}}><div className="sch-item-title"><time>{item.start.slice(0,10)===day?item.start.slice(11,16):'00:00'}</time><strong title={`【${scheduleKind(item)}】${item.title}`}>【{scheduleKind(item)}】{item.title}</strong>{item.attachments.length>0&&<Paperclip size={13} aria-label="有附件"/>}</div><div className="sch-item-meta"><StatusBadge tone={item.completed?'success':'neutral'}>{item.completed?'已完成':'未开始'}</StatusBadge><span>发起人</span><img src="assets/workbench/avatar-zhang.png" alt=""/><b>{item.creator}</b>{item.location&&<><span>{item.kind==='trip'?'途经及目的地':item.mode==='线上'?'链接':'地址'}</span><b className="sch-location" title={item.location}>{item.location}</b></>}</div></button>):<EmptyState title={ready?'当天暂无日程':'正在读取日程…'} description={ready?'可切换日期或新增日程。':undefined}/>}</div>}
    {notices}
    {dialogs}
  </section>;
}
