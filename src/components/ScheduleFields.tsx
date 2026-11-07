import React, { useEffect, useId, useRef, useState } from 'react';
import { CalendarDays, Check, CirclePlus, Search, X } from 'lucide-react';
import { SCHEDULE_PEOPLE } from '../data/schedules';

export function PeopleField({label,value,onChange,multiple=false,invalid=false}: {label:string;value:string[];onChange:(value:string[])=>void;multiple?:boolean;invalid?:boolean}) {
  const [open,setOpen]=useState(false);const [query,setQuery]=useState('');const [active,setActive]=useState(0);
  const root=useRef<HTMLDivElement>(null);const input=useRef<HTMLInputElement>(null);const trigger=useRef<HTMLButtonElement>(null);const id=useId();
  const people=SCHEDULE_PEOPLE.filter(name=>name.includes(query));
  useEffect(()=>{if(!open)return;const outside=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node))setOpen(false);};document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside);},[open]);
  useEffect(()=>{if(open&&multiple)input.current?.focus();},[open,multiple]);
  useEffect(()=>{if(open)document.getElementById(`${id}-${active}`)?.scrollIntoView({block:'nearest'});},[open,active,id]);
  const choose=(name:string)=>{onChange(multiple?(value.includes(name)?value.filter(v=>v!==name):[...value,name]):[name]);if(!multiple){setOpen(false);setQuery('');input.current?.focus();}};
  const keys=(e:React.KeyboardEvent)=>{
    if(e.key==='Escape'){if(open){e.preventDefault();e.stopPropagation();setOpen(false);multiple?trigger.current?.focus():input.current?.focus();}return;}
    if(e.key==='ArrowDown'||e.key==='ArrowUp'){e.preventDefault();setOpen(true);setActive(i=>!open?(e.key==='ArrowDown'?0:Math.max(0,people.length-1)):(i+(e.key==='ArrowDown'?1:-1)+Math.max(1,people.length))%Math.max(1,people.length));}
    if(open&&(e.key==='Home'||e.key==='End')){e.preventDefault();setActive(e.key==='Home'?0:Math.max(0,people.length-1));}
    if(e.key==='Enter'&&open){e.preventDefault();if(people[active])choose(people[active]);}
  };
  return <div ref={root} className="sch-people" onKeyDown={keys} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setOpen(false);}}>
    <div className="sch-people-control" data-invalid={invalid}>
      {multiple?<><div className="sch-person-chips">{value.map(person=><span key={person}>{person}<button type="button" aria-label={`从${label}移除${person}`} onClick={()=>onChange(value.filter(v=>v!==person))}><X size={11}/></button></span>)}</div><button type="button" ref={trigger} aria-label={`选择${label}`} aria-haspopup="listbox" aria-expanded={open} aria-controls={open?id:undefined} onClick={()=>{setQuery('');setActive(0);setOpen(!open);}}><CirclePlus size={15}/></button></>:<><input ref={input} role="combobox" aria-label={label} aria-expanded={open} aria-controls={open?id:undefined} aria-autocomplete="list" aria-invalid={invalid} aria-activedescendant={open&&people[active]?`${id}-${active}`:undefined} value={open?query:value[0]||''} placeholder="输入可搜索" onFocus={()=>{setQuery('');setActive(0);setOpen(true);}} onChange={e=>{setQuery(e.target.value);setActive(0);setOpen(true);}}/>{value.length>0&&<button type="button" aria-label={`清空${label}`} onClick={()=>{onChange([]);input.current?.focus();}}><X size={13}/></button>}</>}
    </div>
    {open&&<div className="sch-people-popup">
      {multiple&&<div className="sch-person-search"><Search size={14}/><input ref={input} role="combobox" aria-expanded={open} aria-controls={id} aria-autocomplete="list" aria-activedescendant={people[active]?`${id}-${active}`:undefined} aria-label={`搜索${label}`} placeholder="输入姓名搜索" value={query} onChange={e=>{setQuery(e.target.value);setActive(0);}}/></div>}
      <div role="listbox" aria-label={`${label}选项`} aria-multiselectable={multiple||undefined} id={id}>{people.map((name,i)=><button type="button" role="option" id={`${id}-${i}`} aria-selected={value.includes(name)} className={active===i?'is-active':''} key={name} onMouseDown={e=>e.preventDefault()} onPointerMove={()=>setActive(i)} onClick={()=>choose(name)}><span>{name}</span>{value.includes(name)&&<Check size={14}/>}</button>)}{!people.length&&<p role="status">暂无匹配人员</p>}</div>
    </div>}
  </div>;
}

export function MeetingTimeField({start,end,onStart,onEnd,invalid}: {start:string;end:string;onStart:(s:string)=>void;onEnd:(s:string)=>void;invalid:boolean}) {
  const [open,setOpen]=useState(false);const root=useRef<HTMLDivElement>(null);const trigger=useRef<HTMLButtonElement>(null);
  useEffect(()=>{if(!open)return;const outside=(e:PointerEvent)=>{if(!root.current?.contains(e.target as Node))setOpen(false);};document.addEventListener('pointerdown',outside);return()=>document.removeEventListener('pointerdown',outside);},[open]);
  return <div className="sch-meeting-time" ref={root} onKeyDown={e=>{if(e.key==='Escape'&&open){e.preventDefault();e.stopPropagation();setOpen(false);trigger.current?.focus();}}} onBlur={e=>{if(!e.currentTarget.contains(e.relatedTarget as Node))setOpen(false);}}><button ref={trigger} type="button" className="sch-time-trigger" aria-label="会议时间" aria-expanded={open} aria-invalid={invalid} onClick={()=>setOpen(!open)}><CalendarDays size={14}/><span>{start.replace('T',' ')} 至 {end.replace('T',' ')}</span></button>{open&&<div className="sch-time-popup"><label>开始时间<input type="datetime-local" aria-label="会议开始时间" value={start} onChange={e=>onStart(e.target.value)}/></label><label>结束时间<input type="datetime-local" aria-label="会议结束时间" value={end} min={start} onChange={e=>onEnd(e.target.value)}/></label><button type="button" onClick={()=>{setOpen(false);trigger.current?.focus();}}>完成</button></div>}</div>;
}
