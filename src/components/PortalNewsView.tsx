import { HotspotTracking } from './HotspotTracking';
import { NewsSubscriptionDialog } from './NewsSubscriptionDialog';
import { Button } from './UI';
import { readSubscription, subscriptionMatches, relatedMatches, NewsSubscription } from '../data/newsSubscription';
import { SearchField } from './FieldControls';
import { NewsCarousel } from './NewsCarousel';
import { Pagination, usePagination } from './Pagination';
import { aiNews, groupNews, PortalNewsItem } from '../data/portalNews';
import React, { useEffect, useId, useLayoutEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, CalendarClock, Building2, X, LayoutGrid, List, Paperclip } from 'lucide-react';
import { figmaAssets } from '../data/figmaAssets';
import interestedIcon from '../assets/spec-icons/34ea38113a5f13b7.svg';
import interestedSelectedIcon from '../assets/spec-icons/698e003d9e5e375b.svg';
import lessIcon from '../assets/spec-icons/79103c7c42caf873.svg';
import lessSelectedIcon from '../assets/spec-icons/eb119e7053af95bb.svg';

const art = (key: string) => figmaAssets[`71-2370:${key}`];
const aiCategories = ['推荐', '我关注的', '与我有关', '集团要闻', '行业趋势', '政策法规'];
const groupCategories = ['最新', '最热', '焦点', '党建'];
const summary = '双方围绕数字化转型与产业协同开展深度合作，共同探索产业升级。';
const notices = ['广东先进新材料产业集群加快布局','高性能复合材料下游需求增长','省级新材料专项扶持政策落地，重点攻关卡脖子材料','生物基、可降解新材料商业化进程加快','新材料产学研对接平台扩容，校企联合攻关项目持续落地'];
const alerts = [
  {id:'travel',type:'出差申请',tag:'出行准备',title:'明天前往济南出差，尚未查到酒店预订',body:'出差申请已审批通过，关联记录中已有机票，暂未查到覆盖入住日期的酒店。若已通过其他渠道预订，请先核实。'},
  {id:'flight',type:'酒店/机票/高铁预订',tag:'行程核对',title:'明早08:30航班起飞，请提前核对行程',body:'广州白云—济南遥墙，机票状态为已出票。返程高铁与酒店订单也可一并核对；预订时间不代表实时运行状态。'},
];
type Detail = { title: string; body?: string; image?: string; items?: string[]; news?: PortalNewsItem };
type NewsFeedback = 'interested' | 'less';
const feedbackKey = 'guangxin-news-feedback';
function readFeedback(): Record<string, NewsFeedback> {
  try {
    const saved: unknown = JSON.parse(localStorage.getItem(feedbackKey) || '{}');
    if (!saved || typeof saved !== 'object' || Array.isArray(saved)) return {};
    return Object.fromEntries(Object.entries(saved).filter(([id, value]) => [...aiNews, ...groupNews].some(news => news.id === id) && (value === 'interested' || value === 'less'))) as Record<string, NewsFeedback>;
  } catch { return {}; }
}

export const PortalNewsView: React.FC = () => {
  const [subscription,setSubscription]=useState<NewsSubscription|null>(readSubscription);
  const [subscriptionOpen,setSubscriptionOpen]=useState(false);
  const [subscriptionNotice,setSubscriptionNotice]=useState('');
  const [aiCategory,setAiCategory]=useState('推荐');
  const [groupCategory,setGroupCategory]=useState('最新');
  const [aiQuery,setAiQuery]=useState('');
  const [groupQuery,setGroupQuery]=useState('');
  const [aiView,setAiView]=useState<'cards'|'list'>('cards');
  const [groupView,setGroupView]=useState<'cards'|'list'>('cards');
  const [hiddenAlerts,setHiddenAlerts]=useState<string[]>([]);
  const [detail,setDetail]=useState<Detail|null>(null);
  const [feedback,setFeedback]=useState(readFeedback);
  const recordFeedback=(id:string,value:NewsFeedback)=>{
    setFeedback(current=>{
      const next={...current};
      if(next[id]===value)delete next[id];else next[id]=value;
      try{localStorage.setItem(feedbackKey,JSON.stringify(next));}catch{/* Feedback still works in the current session. */}
      return next;
    });
  };
  const [moreKind,setMoreKind]=useState<'ai'|'group'|null>(null);
  const pageRoot=useRef<HTMLDivElement>(null), homeScroll=useRef(0);
  const openMore=(kind:'ai'|'group')=>{homeScroll.current=pageRoot.current?.scrollTop||0;setMoreKind(kind);pageRoot.current?.scrollTo({top:0});};
  const closeMore=()=>{const kind=moreKind;setMoreKind(null);requestAnimationFrame(()=>{pageRoot.current?.scrollTo({top:homeScroll.current});pageRoot.current?.querySelector<HTMLButtonElement>(`.pn-${kind==='ai'?'ai':'group'}-news .pn-more`)?.focus({preventScroll:true});});};
  const modal=useRef<HTMLDialogElement>(null);
  useEffect(()=>{if(detail){modal.current?.showModal();modal.current?.scrollTo({top:0});}else modal.current?.close();},[detail]);
  const selectedAI=aiNews.filter(n=>(aiCategory==='推荐'||(aiCategory==='我关注的'?(subscription?subscriptionMatches(n,subscription):n.followed):aiCategory==='与我有关'?(subscription?relatedMatches(n,subscription):n.related):n.category===aiCategory))&&`${n.title}${n.summary}`.includes(aiQuery.trim()));
  const selectedGroup=(groupCategory==='最新'?groupNews:groupCategory==='最热'?[...groupNews].reverse():groupCategory==='焦点'?groupNews.filter(n=>n.featured):groupNews.filter(n=>n.category==='党建')).filter(n=>`${n.title}${n.summary}`.includes(groupQuery.trim()));
  const openNews=(n:PortalNewsItem)=>setDetail({title:n.title,news:n});
  const more=(label:string,items:string[])=>setDetail({title:label,items});
  const toolbar=(kind:'ai'|'group')=>{
    const ai=kind==='ai';const label=ai?'AI 智能资讯':'集团综合资讯';
    return <header className="pn-section-header"><h3><i/>{label}</h3><div className="pn-tabs" role="tablist" aria-label={`${label}分类`}>
      {(ai?aiCategories:groupCategories).map(cat=><button role="tab" key={cat} aria-selected={(ai?aiCategory:groupCategory)===cat} onClick={()=>{ai?setAiCategory(cat):setGroupCategory(cat);}}>{cat}</button>)}
    </div><div className="pn-section-tools">{ai&&<Button className="pn-subscribe" onClick={()=>setSubscriptionOpen(true)}>订阅</Button>}<div className="pn-view-toggle" role="group" aria-label={`${label}展示模式`}>{(['cards','list'] as const).map(mode=><button key={mode} type="button" aria-label={`${label}${mode==='cards'?'卡片':'列表'}模式`} title={mode==='cards'?'卡片模式':'列表模式'} aria-pressed={(ai?aiView:groupView)===mode} onClick={()=>ai?setAiView(mode):setGroupView(mode)}>{mode==='cards'?<LayoutGrid size={16}/>:<List size={16}/>}</button>)}</div><SearchField className="pn-search" label={`搜索${label}`} value={ai?aiQuery:groupQuery} onChange={ai?setAiQuery:setGroupQuery}/><button className="pn-more ui-more" onClick={()=>openMore(kind)}>更多<ChevronRight size={13}/></button></div></header>;
  };
  return <div ref={pageRoot} className={`portal-news pn-page flex-1 overflow-y-auto ${moreKind?'pn-more-page':''}`}>
    {moreKind&&<NewsMoreView label={moreKind==='ai'?'AI 智能资讯':'集团综合资讯'} categories={moreKind==='ai'?aiCategories:groupCategories} category={moreKind==='ai'?aiCategory:groupCategory} onCategory={moreKind==='ai'?setAiCategory:setGroupCategory} query={moreKind==='ai'?aiQuery:groupQuery} onQuery={moreKind==='ai'?setAiQuery:setGroupQuery} items={moreKind==='ai'?selectedAI:selectedGroup} onBack={closeMore} onOpen={openNews} onSubscribe={moreKind==='ai'?()=>setSubscriptionOpen(true):undefined} important={!!subscription?.important&&aiCategory==='我关注的'} notice={subscriptionNotice}/>}
    <div className="pn-layout" style={moreKind?{display:'none'}:undefined}>
      <div className="pn-primary">
        <div className="pn-banner"><img src={art('img3')} alt="庆祝广新集团连续四年上榜《财富》世界500强，2026年位列406位"/></div>
        <section className={`pn-panel pn-ai-news ${aiView==='list'?'pn-is-list':''}`}>
          {toolbar('ai')}
          {subscriptionNotice&&<p className="pn-subscription-notice" role="status">{subscriptionNotice}<button aria-label="关闭订阅提示" onClick={()=>setSubscriptionNotice('')}><X size={14}/></button></p>}
          {aiView==='list'?<NewsList label="AI 智能资讯" important={!!subscription?.important&&aiCategory==='我关注的'} items={selectedAI} onOpen={openNews} resetKey={`${aiCategory}:${aiQuery}`}/>:<NewsCarousel label="AI资讯" resetKey={`${aiCategory}:${aiQuery}`} count={selectedAI.length}>
            {selectedAI.map((n,i)=><button className="pn-ai-card" key={n.id} onClick={()=>openNews(n)}><img src={n.image} alt=""/><div className="pn-card-copy"><div className="pn-tags"><span>{n.category}</span>{n.featured&&<b>{subscription?.important&&aiCategory==='我关注的'?'重点资讯':'精选'}</b>}</div><h4 title={n.title}>{n.title}</h4><p>{n.summary}</p><footer><span>广新集团</span><time>{n.date}</time></footer></div></button>)}
            {!selectedAI.length&&<p className="pn-empty">暂无匹配资讯</p>}
          </NewsCarousel>}
        </section>
        <section className={`pn-panel pn-group-news ${groupView==='list'?'pn-is-list':''}`}>
          {toolbar('group')}
          {groupView==='list'?<NewsList label="集团综合资讯" items={selectedGroup} onOpen={openNews} resetKey={`${groupCategory}:${groupQuery}`}/>:<NewsCarousel label="集团资讯" resetKey={`${groupCategory}:${groupQuery}`} count={selectedGroup.length}>
            {selectedGroup.map(n=><button className="pn-group-card" key={n.id} onClick={()=>openNews(n)}><img src={n.image} alt=""/><h4 title={n.title}>{n.title}</h4><time>{n.date}</time></button>)}
            {!selectedGroup.length&&<p className="pn-empty">暂无匹配资讯</p>}
          </NewsCarousel>}
        </section>
      </div>
      <div className="pn-secondary">
        <section className="pn-panel pn-alerts">
          <header className="pn-section-header"><h3><i/>AI 主动服务与智能提醒</h3><button className="pn-more ui-more" onClick={()=>more('AI 主动服务与智能提醒',alerts.filter(a=>!hiddenAlerts.includes(a.id)).map(a=>a.title))}>更多<ChevronRight size={13}/></button></header>
          <div className="pn-alert-list">{alerts.filter(a=>!hiddenAlerts.includes(a.id)).map((a,i)=><article className={`pn-alert ${a.id}`} key={a.id}>
            <span className="pn-alert-icon">{a.id==='travel'?<CalendarClock size={20}/>:<Building2 size={20}/>}</span><div><div className="pn-alert-type">{a.type}<span>{a.tag}</span></div><h4>{a.title}</h4><p>{a.body}</p><footer><button onClick={()=>setDetail({title:a.title,body:a.body})}>查看</button><button onClick={()=>setHiddenAlerts(ids=>[...ids,a.id])}>忽略</button></footer></div>
          </article>)}{hiddenAlerts.length===alerts.length&&<p className="pn-empty">暂无待处理提醒</p>}</div>
        </section>
        <HotspotTracking/>
        {['最新通知','最新公告'].map((label,index)=><section className={`pn-panel pn-notices ${index?'pn-announcements':''}`} key={label}>
          <header className="pn-section-header"><h3><img src={`assets/workbench/${index?'heading-tasks':'heading-brief'}.png`} alt=""/>{label}</h3><button className="pn-more ui-more" onClick={()=>more(label,notices)}>更多<ChevronRight size={13}/></button></header>
          <ol>{notices.map((title,i)=><li key={title}><button onClick={()=>setDetail({title,body:'广新集团 · '+label})}><span>{i+1}{index?'.':''}</span><span>{title}</span></button></li>)}</ol>
        </section>)}
      </div>
    </div>
    {subscriptionOpen&&<NewsSubscriptionDialog initial={subscription} onClose={()=>setSubscriptionOpen(false)} onSave={settings=>{setSubscription(settings);setSubscriptionOpen(false);setAiCategory('我关注的');setAiQuery('');setSubscriptionNotice('订阅已保存，正在展示本地匹配资讯。');}}/>}
    <dialog className={`gx-dialog pn-detail ${detail?.news?'pn-article-detail':''}`} aria-labelledby="pn-detail-title" ref={modal} onCancel={()=>setDetail(null)} onClick={e=>{if(e.target===e.currentTarget)setDetail(null);}}><header className="gx-dialog-header"><h3 id="pn-detail-title">{detail?.title}</h3><button aria-label="关闭资讯详情" onClick={()=>setDetail(null)}><X size={20}/></button></header><div className="gx-dialog-body">{detail?.news&&<NewsArticle key={detail.news.id} news={detail.news} feedback={feedback[detail.news.id]} onFeedback={value=>recordFeedback(detail.news!.id,value)}/>}{detail?.image&&<img src={detail.image} alt=""/>}{detail?.body&&<p>{detail.body}</p>}{detail?.items&&<ul>{detail.items.length?detail.items.map((title,i)=><li key={i}><button onClick={()=>{const news=[...aiNews,...groupNews].find(n=>n.title===title);if(news)openNews(news);else setDetail({title,body:summary});}}>{title}<ChevronRight size={16}/></button></li>):<li>暂无内容</li>}</ul>}</div></dialog>
  </div>;
};

function NewsMoreView({label,categories,category,onCategory,query,onQuery,items,onBack,onOpen,onSubscribe,important,notice}: {
  label:string;categories:string[];category:string;onCategory:(value:string)=>void;query:string;onQuery:(value:string)=>void;items:PortalNewsItem[];onBack:()=>void;onOpen:(item:PortalNewsItem)=>void;onSubscribe?:()=>void;important:boolean;notice:string;
}) {
  const id=useId(), back=useRef<HTMLButtonElement>(null), scroll=useRef<HTMLDivElement>(null);
  const pagination=usePagination(items.length,`${category}:${query}`);
  useEffect(()=>{back.current?.focus({preventScroll:true});},[]);
  useEffect(()=>{scroll.current?.scrollTo({top:0});},[pagination.page,pagination.pageSize,category,query]);
  useLayoutEffect(()=>{const node=scroll.current!;const update=()=>node.parentElement?.style.setProperty('--pn-list-scrollbar',`${node.offsetWidth-node.clientWidth}px`);update();const observer=new ResizeObserver(update);observer.observe(node);return()=>observer.disconnect();},[]);
  return <section className="pn-more-surface" aria-label={`${label}全部资讯`}>
    <header className="pn-more-header"><button ref={back} type="button" className="todo-back pn-more-back" onClick={onBack}><ChevronLeft size={16}/><span>返回</span></button><span className="todo-divider" aria-hidden="true"/>
      <div className="pn-tabs pn-more-tabs" role="tablist" aria-label={`${label}分类`}>{categories.map((item,index)=><button key={item} id={`${id}-tab-${index}`} role="tab" aria-selected={category===item} aria-controls={`${id}-panel`} tabIndex={category===item?0:-1} onClick={()=>onCategory(item)} onKeyDown={event=>{const delta=event.key==='ArrowRight'?1:event.key==='ArrowLeft'?-1:0;if(!delta&&!['Home','End'].includes(event.key))return;event.preventDefault();const next=event.key==='Home'?0:event.key==='End'?categories.length-1:(index+delta+categories.length)%categories.length;onCategory(categories[next]);document.getElementById(`${id}-tab-${next}`)?.focus();}}>{item}</button>)}</div>
      <div className="pn-more-tools">{onSubscribe&&<Button onClick={onSubscribe}>订阅</Button>}<SearchField className="pn-more-search" label={`搜索${label}`} value={query} onChange={onQuery}/></div>
    </header>
    <div ref={scroll} className="pn-more-content" id={`${id}-panel`} role="tabpanel" aria-labelledby={`${id}-tab-${categories.indexOf(category)}`} tabIndex={0}>
      {notice&&onSubscribe&&<p className="pn-subscription-notice" role="status">{notice}</p>}
      <NewsList label={label} items={items.slice(pagination.offset,pagination.offset+pagination.pageSize)} onOpen={onOpen} resetKey={`${category}:${query}:${pagination.page}`} important={important}/>
    </div>
    <div className="pn-more-pagination"><Pagination label={`${label}分页`} total={items.length} {...pagination}/></div>
  </section>;
}

function NewsList({label,items,onOpen,resetKey,important=false}: {important?:boolean;label:string;items:PortalNewsItem[];onOpen:(item:PortalNewsItem)=>void;resetKey:string}) {
  const list=useRef<HTMLDivElement>(null);
  useEffect(()=>{if(list.current)list.current.scrollTop=0;},[resetKey]);
  return <div ref={list} className="pn-news-list" role="region" aria-label={`${label}列表`} tabIndex={0}>
    {items.length?<ul>{items.map(item=><li key={item.id}><button className="pn-news-row" onClick={()=>onOpen(item)}>
      <img className="pn-row-image" src={item.image} alt=""/>
      <div className="pn-row-copy">
        <div className="pn-row-heading"><h4 title={item.title}>{item.title}</h4><span className="pn-row-category">{item.category}</span>{item.featured&&<b>{important?'重点资讯':'精选'}</b>}</div>
        <p className="pn-row-summary">{item.summary}</p>
        <footer><time dateTime={item.date}>{item.date}</time><span>广新集团</span></footer>
      </div>
    </button></li>)}</ul>:<p className="pn-empty" role="status">暂无匹配资讯</p>}
  </div>;
}

function NewsArticle({news,feedback,onFeedback}: {news:PortalNewsItem;feedback?:NewsFeedback;onFeedback:(value:NewsFeedback)=>void}) {
  return <>
    <div className="pn-article-meta"><time dateTime={news.publishedAt.replace(' ','T')}>{news.publishedAt}</time><span>{news.source}</span><span>版块：{news.category}</span><div className="pn-article-feedback" role="group" aria-label="资讯偏好">
      {([{value:'interested',label:'感兴趣',icon:interestedIcon,selectedIcon:interestedSelectedIcon},{value:'less',label:'减少此类内容',icon:lessIcon,selectedIcon:lessSelectedIcon}] as const).map(option=><Button key={option.value} className="pn-feedback-button" aria-pressed={feedback===option.value} onClick={()=>onFeedback(option.value)}><span className="pn-feedback-icon" aria-hidden="true" style={{maskImage:`url(${JSON.stringify(feedback===option.value?option.selectedIcon:option.icon)})`,WebkitMaskImage:`url(${JSON.stringify(feedback===option.value?option.selectedIcon:option.icon)})`}}/>{option.label}</Button>)}
    </div></div>
    <article className="pn-article-body" aria-label="资讯正文">
      {news.paragraphs.slice(0,2).map((paragraph,i)=><p key={i}>{paragraph}</p>)}
      <img src={news.detailImage} alt={`${news.title}交流场景配图（示例）`}/>
      {news.paragraphs.slice(2).map((paragraph,i)=><p key={i}>{paragraph}</p>)}
    </article>
    <footer className="pn-article-files" aria-label="资讯附件"><span className="pn-attachment-count"><Paperclip size={14}/>({news.attachments.length})</span>{news.attachments.map(file=><a key={file.url} href={file.url} download={file.name} title={file.name}><span className="pn-pdf-icon"><img src={figmaAssets['71-3575:img1']} alt=""/></span><span>{file.name}</span></a>)}</footer>
  </>;
}
