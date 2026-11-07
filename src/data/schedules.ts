import { SCHEDULE_DEPARTMENT_MEMBERS } from './scheduleDepartment';
export type ScheduleAttachment = { id: string; name: string; size: number; blob: Blob };
export type ScheduleItem = {
  id: string; kind: 'meeting' | 'event' | 'trip'; title: string; start: string; end: string;
  mode: '线下' | '线上'; location: string; host: string; participants: string[]; informed: string[];
  reminder: string; visibility: '公开日程' | '个人日程'; content: string; description: string;
  attachments: ScheduleAttachment[]; creator: string; completed: boolean;
};
export const CURRENT_SCHEDULE_USER = '张嘉嘉';
export const SCHEDULE_PEOPLE = ['张嘉嘉', '上官成硕', '李明浩', '上官家家', '李家家', '李佳佳', '张锐', '王武', '陈晓晓', '张三', ...SCHEDULE_DEPARTMENT_MEMBERS.map(member=>member.name)];
export function dayKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth()+1).padStart(2,'0')}-${String(date.getDate()).padStart(2,'0')}`;
}
export function addDays(value: string, count: number): string { const date=new Date(`${value}T12:00`);date.setDate(date.getDate()+count);return dayKey(date); }
export function weekDays(value: string): string[] { const day=new Date(`${value}T12:00`).getDay();const monday=addDays(value,-((day+6)%7));return Array.from({length:7},(_,i)=>addDays(monday,i)); }
export function isOnDay(item: ScheduleItem, day: string): boolean { return item.start < `${addDays(day,1)}T00:00` && item.end > `${day}T00:00`; }
export function seedSchedules(day=dayKey(new Date())): ScheduleItem[] {
  const base={start:`${day}T09:00`,end:`${day}T10:00`,mode:'线下' as const,location:'',host:'上官成硕',participants:[CURRENT_SCHEDULE_USER],informed:[],reminder:'10分钟',visibility:'公开日程' as const,content:'',description:'',attachments:[],creator:'上官成硕',completed:false};
  return [
    {...base,id:'sample-meeting',kind:'meeting',title:'关于集团2026年调研实施方案的讨论',location:'3楼会议室',completed:true,description:'讨论调研计划、责任分工与下一步安排。'},
    {...base,id:'sample-event',kind:'event',title:'高级职位候选人面试',content:'准备面试材料，并与面试团队确认安排。'},
    {...base,id:'sample-trip',kind:'trip',title:'到深圳参加集团2026年调研实施方案',location:'深圳',description:'确认调研行程及出行安排。'},
  ];
}
function openDatabase(): Promise<IDBDatabase> { return new Promise((resolve,reject)=>{const request=indexedDB.open('guangxin-schedules',1);request.onupgradeneeded=()=>request.result.createObjectStore('items',{keyPath:'id'});request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);}); }
export async function loadSchedules(): Promise<ScheduleItem[]> {
  const db=await openDatabase();try{return await new Promise((resolve,reject)=>{const request=db.transaction('items').objectStore('items').getAll();request.onsuccess=()=>resolve(request.result);request.onerror=()=>reject(request.error);});}finally{db.close();}
}
export async function saveSchedule(item: ScheduleItem): Promise<void> {
  const db=await openDatabase();try{await new Promise<void>((resolve,reject)=>{const tx=db.transaction('items','readwrite');tx.objectStore('items').put(item);tx.oncomplete=()=>resolve();tx.onerror=()=>reject(tx.error);tx.onabort=()=>reject(tx.error);});}finally{db.close();}
}
export function downloadScheduleAttachment(file: ScheduleAttachment) {const url=URL.createObjectURL(file.blob);const a=document.createElement('a');a.href=url;a.download=file.name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export function scheduleKind(item: ScheduleItem) {return item.kind==='meeting'?`${item.mode}会议`:item.kind==='trip'?'出差':'事项';}
