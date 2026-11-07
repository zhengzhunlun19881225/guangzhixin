import React, { useEffect, useId, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Star, X } from 'lucide-react';
import { Button, EmptyState, ModalSurface } from './UI';
import { HOTSPOT_CATEGORIES, HOTSPOT_EVENTS, HOTSPOT_TOPICS, readHotspotFollows, type HotspotEvent } from '../data/hotspotTracking';
import './hotspot-tracking.css';

type Filter=typeof HOTSPOT_CATEGORIES[number]['id'];
type View={kind:'overview';followedOnly?:boolean}|{kind:'topic';topicId:string}|{kind:'event';eventId:string};
const categoryLabel=(event:HotspotEvent)=>HOTSPOT_CATEGORIES.find(category=>category.id===event.category)!.label;
const order=(events:HotspotEvent[])=>[...events].sort((a,b)=>b.publishedAt.localeCompare(a.publishedAt));
function EventTimeline({events,onOpen}:{events:HotspotEvent[];onOpen:(event:HotspotEvent)=>void}){
  return events.length?<ol className="ht-timeline">{events.map(event=><li key={event.id} data-category={event.category}>
    <time dateTime={event.publishedAt.replace(' ','T')}>{event.publishedAt}</time><h4>{event.title}</h4><p>{event.summary}</p>
    <footer><div className="ht-tags"><span>{categoryLabel(event)}</span>{event.major&&<span>重大进展</span>}<span>{event.sources.length}个来源</span></div><button className="ht-read" aria-label={`查看${event.title}`} onClick={()=>onOpen(event)}>查看</button></footer>
  </li>)}</ol>:<EmptyState title="暂无匹配进展" description="可切换分类查看其他事件。"/>;
}
export function HotspotTracking(){
  const [topicId,setTopicId]=useState('competitor'),[filter,setFilter]=useState<Filter>('all');const [followed,setFollowed]=useState(readHotspotFollows),[followError,setFollowError]=useState('');
  const [stack,setStack]=useState<View[]>([]);const view=stack[stack.length-1];const root=useRef<HTMLElement>(null),timeline=useRef<HTMLDivElement>(null),trigger=useRef<HTMLElement|null>(null),heading=useRef<HTMLHeadingElement>(null);const id=useId();
  const tabs=[...HOTSPOT_TOPICS,{id:'followed',label:'关注主题'}];const topic=HOTSPOT_TOPICS.find(item=>item.id===topicId);
  const relevant=order(HOTSPOT_EVENTS.filter(event=>topicId==='followed'?followed.includes(event.topicId):event.topicId===topicId));const shown=relevant.filter(event=>filter==='all'||event.category===filter);
  const activeEvent=view?.kind==='event'?HOTSPOT_EVENTS.find(event=>event.id===view.eventId):undefined;
  const activeTopic=view?.kind==='topic'?HOTSPOT_TOPICS.find(topic=>topic.id===view.topicId):undefined;
  const title=activeEvent?.title|| (activeTopic?`${activeTopic.label} · 事件演化`:view?.kind==='overview'&&view.followedOnly?'关注主题':'AI 热点追踪与事件演化');
  useEffect(()=>{timeline.current?.scrollTo({top:0});},[topicId,filter]);
  useEffect(()=>{const list=root.current?.querySelector<HTMLElement>('.ht-topics');if(!list)return;const reveal=()=>{const active=list.querySelector<HTMLElement>('[aria-selected=true]');if(!active)return;const left=active.offsetLeft,right=left+active.offsetWidth;if(left<list.scrollLeft)list.scrollLeft=left;else if(right>list.scrollLeft+list.clientWidth)list.scrollLeft=right-list.clientWidth;};reveal();const observer=new ResizeObserver(reveal);observer.observe(list);return()=>observer.disconnect();},[topicId]);
  useEffect(()=>{if(view){heading.current?.focus();heading.current?.closest('dialog')?.querySelector('.gx-dialog-body')?.scrollTo({top:0});}},[view]);
  const open=(next:View)=>{trigger.current=document.activeElement as HTMLElement;setStack([next]);};
  const close=()=>{setStack([]);requestAnimationFrame(()=>{if(trigger.current?.isConnected)trigger.current.focus({preventScroll:true});else root.current?.querySelector<HTMLButtonElement>('[role=tab][aria-selected=true]')?.focus({preventScroll:true});});};
  const toggleFollow=(id:string)=>{const next=followed.includes(id)?followed.filter(value=>value!==id):[...followed,id];setFollowed(next);try{localStorage.setItem('guangxin-hotspot-follows',JSON.stringify(next));setFollowError('');}catch{setFollowError('关注设置暂未保存，刷新后可能丢失。');}};
  const selectTopic=(value:string)=>{setTopicId(value);setFilter('all');};
  const complete=()=>open(topic?{kind:'topic',topicId:topic.id}:{kind:'overview',followedOnly:true});
  return <section className="pn-panel pn-hotspots" ref={root} aria-label="AI 热点追踪与事件演化">
    <header className="pn-section-header"><h3><i/>AI 热点追踪与事件演化</h3><button className="pn-more ui-more" aria-label="更多热点追踪" onClick={()=>open({kind:'overview'})}>更多<ChevronRight size={13}/></button></header>
    <div className="ht-topics" role="tablist" aria-label="热点主题">{tabs.map((tab,index)=><button key={tab.id} role="tab" id={`${id}-topic-${tab.id}`} aria-selected={topicId===tab.id} aria-controls={`${id}-events`} tabIndex={topicId===tab.id?0:-1} onClick={()=>selectTopic(tab.id)} onKeyDown={e=>{
      const next=e.key==='ArrowRight'?(index+1)%tabs.length:e.key==='ArrowLeft'?(index+tabs.length-1)%tabs.length:e.key==='Home'?0:e.key==='End'?tabs.length-1:-1;
      if(next<0)return;e.preventDefault();selectTopic(tabs[next].id);const target=e.currentTarget.parentElement?.querySelectorAll<HTMLButtonElement>('button')[next];target?.focus();target?.scrollIntoView({block:'nearest',inline:'nearest'});
    }}>{tab.label}</button>)}</div>
    <div className="ht-change"><strong>关键变化</strong><span title={topic?.change||`已关注 ${followed.length} 个主题`}>{topic?.change||`已关注 ${followed.length} 个主题`}</span><button onClick={complete}>查看完整</button></div>
    <div className="ht-filters" role="group" aria-label="进展分类">{HOTSPOT_CATEGORIES.map(category=><button key={category.id} aria-pressed={filter===category.id} onClick={()=>setFilter(category.id)}>{category.label}</button>)}</div>
    <div className="ht-feed" ref={timeline} id={`${id}-events`} role="tabpanel" aria-labelledby={`${id}-topic-${topicId}`} tabIndex={0}>
      {topicId==='followed'&&!followed.length?<EmptyState title="暂无关注主题" description="查看主题完整进展后，可将主题加入关注。" action={<Button onClick={()=>open({kind:'overview'})}>选择关注主题</Button>}/>:<EventTimeline events={shown} onOpen={event=>open({kind:'event',eventId:event.id})}/>}
    </div>
    {view&&<ModalSurface label={title} className="ht-dialog" onClose={close}>
      <header className="gx-dialog-header"><h2 ref={heading} tabIndex={-1}>{title}</h2><button onClick={close} aria-label="关闭热点追踪"><X size={18}/></button></header>
      <div className="gx-dialog-body">
        {followError&&<p className="ht-follow-error" role="alert">{followError}</p>}
        {view.kind==='overview'&&<div className="ht-topic-overview">{HOTSPOT_TOPICS.filter(topic=>!view.followedOnly||followed.includes(topic.id)).map(topic=><article key={topic.id}>
          <div><h3>{topic.label}</h3><Button aria-pressed={followed.includes(topic.id)} onClick={()=>toggleFollow(topic.id)}><Star size={14} fill={followed.includes(topic.id)?'currentColor':'none'}/>{followed.includes(topic.id)?'已关注':'关注主题'}</Button></div><p>{topic.change}</p><footer><span>{HOTSPOT_EVENTS.filter(event=>event.topicId===topic.id).length} 条进展</span><button className="ht-read" onClick={()=>setStack(previous=>[...previous,{kind:'topic',topicId:topic.id}])}>查看完整<ChevronRight size={14}/></button></footer>
        </article>)}{view.followedOnly&&!followed.length&&<EmptyState title="暂无关注主题" action={<Button onClick={()=>setStack([{kind:'overview'}])}>选择关注主题</Button>}/>}</div>}
        {activeTopic&&<><div className="ht-topic-intro"><p><strong>关键变化：</strong>{activeTopic.change}</p><Button aria-pressed={followed.includes(activeTopic.id)} onClick={()=>toggleFollow(activeTopic.id)}><Star size={14} fill={followed.includes(activeTopic.id)?'currentColor':'none'}/>{followed.includes(activeTopic.id)?'已关注':'关注主题'}</Button></div><EventTimeline events={order(HOTSPOT_EVENTS.filter(event=>event.topicId===activeTopic.id))} onOpen={event=>setStack(previous=>[...previous,{kind:'event',eventId:event.id}])}/></>}
        {activeEvent&&<article className="ht-event-detail"><div className="ht-event-meta"><time dateTime={activeEvent.publishedAt.replace(' ','T')}>{activeEvent.publishedAt}</time><span>{categoryLabel(activeEvent)}</span><span>{HOTSPOT_TOPICS.find(topic=>topic.id===activeEvent.topicId)!.label}</span></div>
          <section><h3>事件进展</h3><p>{activeEvent.summary}</p><p>{activeEvent.detail}</p></section><section><h3>后续关注</h3><p>{activeEvent.nextCheck}</p></section><section><h3>来源材料（{activeEvent.sources.length}）</h3><div className="ht-sources">{activeEvent.sources.map(source=><article key={source.id}><h4>{source.title}</h4><span>{source.type}</span><p>{source.excerpt}</p></article>)}</div></section>
        </article>}
      </div>
      <footer className="gx-dialog-footer">{stack.length>1&&<Button onClick={()=>setStack(previous=>previous.slice(0,-1))}><ChevronLeft size={14}/>返回列表</Button>}<Button onClick={close}>关闭</Button></footer>
    </ModalSurface>}
  </section>;
}
