import React, { useEffect, useRef, useState } from 'react';
import { Building2, CalendarDays, ChevronDown, ChevronLeft, ChevronRight, Users } from 'lucide-react';
import { Button } from './UI';
import { SelectField } from './SelectField';
import { CURRENT_SCHEDULE_USER, SCHEDULE_PEOPLE, addDays, dayKey, isOnDay, scheduleKind, weekDays, type ScheduleItem } from '../data/schedules';
import { DepartmentMembers, ScheduleDepartment } from './ScheduleDepartment';
import { SCHEDULE_DEPARTMENT_MEMBERS } from '../data/scheduleDepartment';
import './schedule-calendar.css';

type Mode = 'day' | 'week' | 'month';
type Props = {
  items: ScheduleItem[]; day: string; onDay: (day:string)=>void; scope:string; onScope:(scope:string)=>void;
  ready:boolean; error:string; onRetry:()=>void; onBack:()=>void; onOpen:(item:ScheduleItem,trigger:HTMLElement)=>void;
  newControl:React.ReactNode; notice:React.ReactNode; savedId:string;
};
const modes = [{id:'day',label:'日'},{id:'week',label:'周'},{id:'month',label:'月'}] as const;
const dateLabel=(day:string)=>{const [y,m,d]=day.split('-').map(Number);return `${y}年${m}月${d}日`;};
function shiftMonth(day:string,amount:number) {
  const date=new Date(`${day}T12:00`), desired=date.getDate();
  date.setDate(1);date.setMonth(date.getMonth()+amount);
  const last=new Date(date.getFullYear(),date.getMonth()+1,0).getDate();date.setDate(Math.min(desired,last));return dayKey(date);
}
// Partition overlapping intervals into lanes. Separate overlap groups use their own width.
function positionedEvents(items:ScheduleItem[],date:string) {
  const events=items.filter(item=>isOnDay(item,date)).map(item=>({item,
    start:item.start.slice(0,10)<date?0:Number(item.start.slice(11,13))*60+Number(item.start.slice(14,16)),
    end:item.end.slice(0,10)>date?1440:Number(item.end.slice(11,13))*60+Number(item.end.slice(14,16)),lane:0,lanes:1,
  })).sort((a,b)=>a.start-b.start||b.end-a.end);
  let group:typeof events=[],ends:number[]=[],groupEnd=-1;
  const finish=()=>group.forEach(event=>{event.lanes=ends.length;});
  for(const event of events){
    if(event.start>=groupEnd){finish();group=[];ends=[];groupEnd=-1;}
    const lane=ends.findIndex(end=>end<=event.start);event.lane=lane<0?ends.length:lane;ends[event.lane]=event.end;
    group.push(event);groupEnd=Math.max(groupEnd,event.end);
  }
  finish();return events;
}
export function ScheduleCalendar({items,day,onDay,scope,onScope,ready,error,onRetry,onBack,onOpen,newControl,notice,savedId}:Props) {
  const [mode,setMode]=useState<Mode>('week');const [view,setView]=useState<'mine'|'department'|'others'>('mine');
  const [person,setPerson]=useState('上官成硕');const [kind,setKind]=useState('all');const [now,setNow]=useState(()=>new Date());
  const [selectedMembers,setSelectedMembers]=useState<string[]>(()=>SCHEDULE_DEPARTMENT_MEMBERS.map(member=>member.id));
  const departmentMembers=SCHEDULE_DEPARTMENT_MEMBERS.filter(member=>selectedMembers.includes(member.id));
  const scroll=useRef<HTMLDivElement>(null),back=useRef<HTMLButtonElement>(null);
  useEffect(()=>{back.current?.focus();const timer=window.setInterval(()=>setNow(new Date()),60000);return()=>clearInterval(timer);},[]);
  useEffect(()=>{if(savedId){setView('mine');setKind('all');}},[savedId]);
  useEffect(()=>{
    const el=scroll.current;if(!el)return;el.scrollTop=view==='department'||mode==='month'?0:8*60;
    const reveal=()=>{const index=mode==='week'?weekDays(day).indexOf(day):0;const column=el.querySelector<HTMLElement>('.sc-day-column');el.scrollLeft=column?index*column.offsetWidth:0;};
    reveal();const observer=new ResizeObserver(reveal);observer.observe(el);return()=>observer.disconnect();
  },[mode,day,view]);
  const today=dayKey(now),week=weekDays(day);
  const first=day.slice(0,8)+'01', monthStart=weekDays(first)[0];
  const monthLast=dayKey(new Date(Number(day.slice(0,4)),Number(day.slice(5,7)),0));
  const monthCount=Math.round((new Date(`${weekDays(monthLast)[6]}T12:00`).getTime()-new Date(`${monthStart}T12:00`).getTime())/86400000)+1;
  const days=mode==='day'?[day]:mode==='week'?week:view==='department'?Array.from({length:Number(monthLast.slice(8))},(_,i)=>addDays(first,i)):Array.from({length:monthCount},(_,i)=>addDays(monthStart,i));
  const involved=(item:ScheduleItem,name:string)=>item.creator===name||item.participants.includes(name)||item.informed.includes(name)||item.host===name;
  const filtered=items.filter(item=>(view==='department'?item.visibility==='公开日程'&&departmentMembers.some(member=>involved(item,member.name)):view==='others'?item.visibility==='公开日程'&&involved(item,person):scope==='我发起的'?item.creator===CURRENT_SCHEDULE_USER:scope==='公开日程'?item.visibility==='公开日程':involved(item,CURRENT_SCHEDULE_USER))&&(kind==='all'||item.kind===kind));
  const count=filtered.filter(item=>days.some(date=>isOnDay(item,date))).length;
  const range=mode==='month'?`${Number(day.slice(0,4))}年${Number(day.slice(5,7))}月`:mode==='day'?dateLabel(day):`${dateLabel(week[0])} — ${dateLabel(week[6])}`;
  const previous=()=>onDay(mode==='month'?shiftMonth(day,-1):addDays(day,mode==='week'?-7:-1));
  const next=()=>onDay(mode==='month'?shiftMonth(day,1):addDays(day,mode==='week'?7:1));
  return <section className="sc-page" aria-label="日程日历">
    <header className="sc-toolbar">
      <div className="sc-navigation"><button className="todo-back" ref={back} onClick={onBack}><ChevronLeft size={16}/><span>返回</span></button><span className="todo-divider"/>
        <div className="sc-modes" role="tablist" aria-label="日历视图">{modes.map((tab,i)=><button key={tab.id} role="tab" aria-selected={mode===tab.id} tabIndex={mode===tab.id?0:-1} onClick={()=>setMode(tab.id)} onKeyDown={e=>{
          const index=e.key==='ArrowRight'?(i+1)%3:e.key==='ArrowLeft'?(i+2)%3:e.key==='Home'?0:e.key==='End'?2:-1;
          if(index>=0){e.preventDefault();setMode(modes[index].id);e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('button')[index]?.focus();}
        }}>{tab.label}</button>)}</div><Button onClick={()=>onDay(today)}>{mode==='day'?'今天':mode==='week'?'本周':'本月'}</Button>
      </div>
      <div className="sc-period"><button aria-label="上一个日期范围" onClick={previous}><ChevronLeft size={18}/></button><h1 aria-live="polite">{range}</h1><button aria-label="下一个日期范围" onClick={next}><ChevronRight size={18}/></button></div>
      <div className="sc-actions"><SelectField label="日程类型" value={kind} onChange={setKind} options={[{value:'all',label:'全部类型'},{value:'meeting',label:'会议'},{value:'event',label:'事件'},{value:'trip',label:'出差'}]}/>{newControl}</div>
    </header>
    <div className="sc-body">
      <aside className="sc-sidebar" aria-label="日程视图筛选">
        <button className={view==='mine'?'is-selected':''} aria-expanded={view==='mine'} onClick={()=>setView('mine')}><CalendarDays size={18}/><span>我的视图</span><ChevronDown size={16}/></button>
        {view==='mine'&&<div className="sc-sidebar-options"><SelectField label="日历范围" value={scope} onChange={onScope} options={['我的日程','我发起的','公开日程']}/></div>}
        <button className={view==='department'?'is-selected':''} aria-expanded={view==='department'} onClick={()=>setView('department')}><Building2 size={18}/><span>部门视图</span><ChevronDown size={16}/></button>
        {view==='department'&&<div className="sc-sidebar-options"><DepartmentMembers selected={selectedMembers} onChange={setSelectedMembers}/></div>}
        <button className={view==='others'?'is-selected':''} aria-expanded={view==='others'} onClick={()=>setView('others')}><Users size={18}/><span>他人视图</span><ChevronDown size={16}/></button>
        {view==='others'&&<div className="sc-sidebar-options"><SelectField label="查看人员" value={person} onChange={setPerson} options={SCHEDULE_PEOPLE.filter(name=>name!==CURRENT_SCHEDULE_USER)}/><small>仅显示该人员参与的本地公开日程。</small></div>}
      </aside>
      <div className="sc-main">
        {error?<div className="sc-error" role="alert">{error}<Button onClick={onRetry}>重试</Button></div>:<>
          <div className="sc-summary" role="status">{ready?`${view==='mine'?scope:view==='department'?`部门视图 · 已选 ${departmentMembers.length}/${SCHEDULE_DEPARTMENT_MEMBERS.length} 人（演示）`:person+'的公开日程'} · ${count} 项日程${count?'':' · 当前范围暂无日程'}`:'正在读取日程…'}</div>
          <div className={`sc-scroll ${view==='department'?'sc-department-scroll':mode==='month'?'sc-month-scroll':''}`} ref={scroll} tabIndex={0} aria-label={view==='department'?'部门日历，可滚动查看成员及日期':mode==='month'?'月日历':'时间日历，可滚动查看全天'} aria-busy={!ready}>
            {view==='department'?<ScheduleDepartment days={days} members={departmentMembers} items={filtered} today={today} minutes={now.getHours()*60+now.getMinutes()} onOpen={onOpen} onSelectAll={()=>setSelectedMembers(SCHEDULE_DEPARTMENT_MEMBERS.map(member=>member.id))}/>:mode==='month'?<div className="sc-month" style={{'--sc-weeks':days.length/7} as React.CSSProperties}>
              {'一二三四五六日'.split('').map(label=><div className="sc-month-weekday" key={label}>星期{label}</div>)}
              {days.map(date=><div className={`sc-month-day ${date.slice(0,7)!==day.slice(0,7)?'is-outside':''} ${date===today?'is-today':''}`} key={date}>
                <button className="sc-date-button" aria-label={`查看${date}日程`} aria-current={date===today?'date':undefined} onClick={()=>{onDay(date);setMode('day');requestAnimationFrame(()=>back.current?.parentElement?.querySelector<HTMLButtonElement>('[role=tab]')?.focus());}}>{Number(date.slice(8))}</button>
                {filtered.filter(item=>isOnDay(item,date)).map(item=><button key={item.id} className={`sc-month-event sc-kind-${item.kind}`} title={`${scheduleKind(item)} · ${item.title}`} onClick={e=>onOpen(item,e.currentTarget)}><time>{item.start.slice(0,10)===date?item.start.slice(11):'续'}</time><span>{item.title}</span></button>)}
              </div>)}
            </div>:<div className={`sc-time-grid ${mode==='day'?'sc-day-grid':''}`} style={{'--sc-days':days.length} as React.CSSProperties}>
              <div className="sc-time-heading">时间</div>{days.map(date=><div className={`sc-day-heading ${date===today?'is-today':''}`} key={date}><span>{Number(date.slice(5,7))}/{Number(date.slice(8))}</span><span>星期{'日一二三四五六'[new Date(`${date}T12:00`).getDay()]}</span>{date===today&&<b>今天</b>}</div>)}
              <div className="sc-time-labels">{Array.from({length:24},(_,h)=><div key={h}>{String(h).padStart(2,'0')}:00</div>)}</div>
              {days.map(date=><div key={date} className={`sc-day-column ${date===today?'is-today':''}`} aria-label={`${date}日程`}>
                {positionedEvents(filtered,date).map(({item,start,end,lane,lanes})=><button key={item.id} className={`sc-event sc-kind-${item.kind}`} title={`${item.start.replace('T',' ')} 至 ${item.end.replace('T',' ')} · ${scheduleKind(item)} · ${item.title}`} aria-label={`${date} ${item.start.slice(11)} ${scheduleKind(item)} ${item.title}`} style={{top:start,height:Math.max(26,end-start-3),left:`calc(${lane/lanes*100}% + 4px)`,width:`calc(${100/lanes}% - 8px)`}} onClick={e=>onOpen(item,e.currentTarget)}>
                  <time>{item.start.slice(0,10)===date?item.start.slice(11):'00:00'} – {item.end.slice(0,10)>date?'24:00':item.end.slice(11)}</time><span>{item.title}</span>
                </button>)}
                {date===today&&<div className="sc-now" style={{top:now.getHours()*60+now.getMinutes()}} aria-label={`当前时间 ${now.getHours()}:${String(now.getMinutes()).padStart(2,'0')}`}/>}
              </div>)}
            </div>}
          </div>
        </>}
        {notice}
      </div>
    </div>
  </section>;
}
