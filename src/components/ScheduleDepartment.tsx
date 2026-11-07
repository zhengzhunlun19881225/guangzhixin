import React, { useEffect, useRef } from 'react';
import { Button, EmptyState } from './UI';
import { SCHEDULE_DEPARTMENT_MEMBERS, type ScheduleDepartmentMember } from '../data/scheduleDepartment';
import { isOnDay, scheduleKind, type ScheduleItem } from '../data/schedules';

export function DepartmentMembers({selected,onChange}:{selected:string[];onChange:(ids:string[])=>void}) {
  const all=useRef<HTMLInputElement>(null);const complete=selected.length===SCHEDULE_DEPARTMENT_MEMBERS.length;
  useEffect(()=>{if(all.current)all.current.indeterminate=selected.length>0&&!complete;},[selected,complete]);
  return <div className="sc-department-members" role="group" aria-label="部门成员筛选">
    <label className="sc-member-choice"><input ref={all} type="checkbox" checked={complete} aria-label="全选部门成员" onChange={e=>onChange(e.target.checked?SCHEDULE_DEPARTMENT_MEMBERS.map(member=>member.id):[])}/><span>全选</span></label>
    {SCHEDULE_DEPARTMENT_MEMBERS.map(member=><label className="sc-member-choice" key={member.id} title={member.name}><input type="checkbox" checked={selected.includes(member.id)} aria-label={`显示${member.name}的日程`} onChange={e=>onChange(e.target.checked?[...selected,member.id]:selected.filter(id=>id!==member.id))}/><span>{member.name}</span></label>)}
  </div>;
}
export function ScheduleDepartment({days,members,items,today,minutes,onOpen,onSelectAll}:{days:string[];members:ScheduleDepartmentMember[];items:ScheduleItem[];today:string;minutes:number;onOpen:(item:ScheduleItem,trigger:HTMLElement)=>void;onSelectAll:()=>void}) {
  if(!members.length)return <div className="sc-department-empty"><EmptyState title="请选择部门成员" description="勾选左侧成员，查看对应日期的日程。" action={<Button onClick={onSelectAll}>全选成员</Button>}/></div>;
  return <table className="sc-department-table" aria-label="部门成员日程" style={{minWidth:188+days.length*140}}>
    <colgroup><col style={{width:188}}/>{days.map(day=><col key={day}/>)}</colgroup>
    <thead><tr><th scope="col" className="sc-member-column">部门成员</th>{days.map(date=><th scope="col" key={date} className={date===today?'is-today':''} title={date}><span>{Number(date.slice(5,7))}/{Number(date.slice(8))}</span><span>星期{'日一二三四五六'[new Date(`${date}T12:00`).getDay()]}</span>{date===today&&<span className="sc-department-today">今天</span>}</th>)}</tr></thead>
    <tbody>{members.map(member=><tr key={member.id} data-member-id={member.id}>
      <th scope="row" className="sc-member-column"><div className="sc-member-profile"><span className="sc-member-avatar" aria-hidden="true">{member.avatar}</span><div><strong title={member.name}>{member.name}</strong>{member.role&&<span title={member.role}>{member.role}</span>}</div></div></th>
      {days.map(date=><td key={date} className={date===today?'is-today':''} aria-label={`${member.name} ${date}`}>
        {items.filter(item=>isOnDay(item,date)&&(item.creator===member.name||item.host===member.name||item.participants.includes(member.name)||item.informed.includes(member.name))).sort((a,b)=>a.start.localeCompare(b.start)).map(item=><button key={item.id} className={`sc-department-event sc-kind-${item.kind}`} title={`${scheduleKind(item)} · ${item.title} · ${item.start.replace('T',' ')} 至 ${item.end.replace('T',' ')}`} onClick={e=>onOpen(item,e.currentTarget)}><time>{item.start.slice(0,10)===date?item.start.slice(11):'续'}</time><span>{item.title}</span></button>)}
        {date===today&&<span aria-hidden="true" className="sc-department-now" style={{left:`${minutes/1440*100}%`}}/>}
      </td>)}
    </tr>)}</tbody>
  </table>;
}
