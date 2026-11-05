import { SearchField } from './FieldControls';
import { NewsCarousel } from './NewsCarousel';
import { aiNews, groupNews, PortalNewsItem } from '../data/portalNews';
import React, { useEffect, useRef, useState } from 'react';
import { ChevronRight, CalendarClock, Building2, X } from 'lucide-react';
import { figmaAssets } from '../data/figmaAssets';

const art = (key: string) => figmaAssets[`71-2370:${key}`];
const aiCategories = ['推荐', '我关注的', '与我有关', '集团要闻', '行业趋势', '政策法规'];
const groupCategories = ['最新', '最热', '焦点', '党建'];
const summary = '双方围绕数字化转型与产业协同开展深度合作，共同探索产业升级。';
const notices = ['广东先进新材料产业集群加快布局','高性能复合材料下游需求增长','省级新材料专项扶持政策落地，重点攻关卡脖子材料','生物基、可降解新材料商业化进程加快','新材料产学研对接平台扩容，校企联合攻关项目持续落地'];
const alerts = [
  {id:'travel',type:'出差申请',tag:'出行准备',title:'明天前往济南出差，尚未查到酒店预订',body:'出差申请已审批通过，关联记录中已有机票，暂未查到覆盖入住日期的酒店。若已通过其他渠道预订，请先核实。'},
  {id:'flight',type:'酒店/机票/高铁预订',tag:'行程核对',title:'明早08:30航班起飞，请提前核对行程',body:'广州白云—济南遥墙，机票状态为已出票。返程高铁与酒店订单也可一并核对；预订时间不代表实时运行状态。'},
];
type Detail = { title: string; body?: string; image?: string; items?: string[] };

export const PortalNewsView: React.FC = () => {
  const [aiCategory,setAiCategory]=useState('推荐');
  const [groupCategory,setGroupCategory]=useState('最新');
  const [aiQuery,setAiQuery]=useState('');
  const [groupQuery,setGroupQuery]=useState('');
  const [hiddenAlerts,setHiddenAlerts]=useState<string[]>([]);
  const [detail,setDetail]=useState<Detail|null>(null);
  const modal=useRef<HTMLDialogElement>(null);
  useEffect(()=>{if(detail)modal.current?.showModal();else modal.current?.close();},[detail]);
  const selectedAI=aiNews.filter(n=>(aiCategory==='推荐'||(aiCategory==='我关注的'?n.followed:aiCategory==='与我有关'?n.related:n.category===aiCategory))&&`${n.title}${n.summary}`.includes(aiQuery.trim()));
  const selectedGroup=(groupCategory==='最新'?groupNews:groupCategory==='最热'?[...groupNews].reverse():groupCategory==='焦点'?groupNews.filter(n=>n.featured):groupNews.filter(n=>n.category==='党建')).filter(n=>`${n.title}${n.summary}`.includes(groupQuery.trim()));
  const openNews=(n:PortalNewsItem)=>setDetail({title:n.title,body:n.body,image:n.image});
  const more=(label:string,items:string[])=>setDetail({title:label,items});
  const toolbar=(kind:'ai'|'group')=>{
    const ai=kind==='ai';const label=ai?'AI 智能资讯':'集团综合资讯';
    return <header className="pn-section-header"><h3><i/>{label}</h3><div className="pn-tabs" role="tablist" aria-label={`${label}分类`}>
      {(ai?aiCategories:groupCategories).map(cat=><button role="tab" key={cat} aria-selected={(ai?aiCategory:groupCategory)===cat} onClick={()=>{ai?setAiCategory(cat):setGroupCategory(cat);}}>{cat}</button>)}
    </div><SearchField className="pn-search" label={`搜索${label}`} value={ai?aiQuery:groupQuery} onChange={ai?setAiQuery:setGroupQuery}/><button className="pn-more" onClick={()=>more(label,(ai?selectedAI:selectedGroup).map(n=>n.title))}>更多<ChevronRight size={13}/></button></header>;
  };
  return <div className="portal-news pn-page flex-1 overflow-y-auto">
    <div className="pn-layout">
      <div className="pn-primary">
        <div className="pn-banner"><img src={art('img3')} alt="庆祝广新集团连续四年上榜《财富》世界500强，2026年位列406位"/></div>
        <section className="pn-panel pn-ai-news">
          {toolbar('ai')}
          <NewsCarousel label="AI资讯" resetKey={`${aiCategory}:${aiQuery}`} count={selectedAI.length}>
            {selectedAI.map((n,i)=><button className="pn-ai-card" key={n.id} onClick={()=>openNews(n)}><img src={n.image} alt=""/><div className="pn-card-copy"><div className="pn-tags"><span>{n.category}</span>{n.featured&&<b>精选</b>}</div><h4>{n.title}</h4><p>{n.summary}</p><footer><span>广新集团</span><time>{n.date}</time></footer></div></button>)}
            {!selectedAI.length&&<p className="pn-empty">暂无匹配资讯</p>}
          </NewsCarousel>
        </section>
        <section className="pn-panel pn-group-news">
          {toolbar('group')}
          <NewsCarousel label="集团资讯" resetKey={`${groupCategory}:${groupQuery}`} count={selectedGroup.length}>
            {selectedGroup.map(n=><button className="pn-group-card" key={n.id} onClick={()=>openNews(n)}><img src={n.image} alt=""/><h4>{n.title}</h4><time>{n.date}</time></button>)}
            {!selectedGroup.length&&<p className="pn-empty">暂无匹配资讯</p>}
          </NewsCarousel>
        </section>
      </div>
      <div className="pn-secondary">
        <section className="pn-panel pn-alerts">
          <header className="pn-section-header"><h3><i/>AI 主动服务与智能提醒</h3><button className="pn-more" onClick={()=>more('AI 主动服务与智能提醒',alerts.filter(a=>!hiddenAlerts.includes(a.id)).map(a=>a.title))}>更多<ChevronRight size={13}/></button></header>
          <div className="pn-alert-list">{alerts.filter(a=>!hiddenAlerts.includes(a.id)).map((a,i)=><article className={`pn-alert ${a.id}`} key={a.id}>
            <span className="pn-alert-icon">{a.id==='travel'?<CalendarClock size={20}/>:<Building2 size={20}/>}</span><div><div className="pn-alert-type">{a.type}<span>{a.tag}</span></div><h4>{a.title}</h4><p>{a.body}</p><footer><button onClick={()=>setDetail({title:a.title,body:a.body})}>查看</button><button onClick={()=>setHiddenAlerts(ids=>[...ids,a.id])}>忽略</button></footer></div>
          </article>)}{hiddenAlerts.length===alerts.length&&<p className="pn-empty">暂无待处理提醒</p>}</div>
        </section>
        {['最新通知','最新公告'].map((label,index)=><section className={`pn-panel pn-notices ${index?'pn-announcements':''}`} key={label}>
          <header className="pn-section-header"><h3><img src={`assets/workbench/${index?'heading-tasks':'heading-brief'}.png`} alt=""/>{label}</h3><button className="pn-more" onClick={()=>more(label,notices)}>更多<ChevronRight size={13}/></button></header>
          <ol>{notices.map((title,i)=><li key={title}><button onClick={()=>setDetail({title,body:'广新集团 · '+label})}><span>{i+1}{index?'.':''}</span><span>{title}</span></button></li>)}</ol>
        </section>)}
      </div>
    </div>
    <dialog className="pn-detail" ref={modal} onCancel={()=>setDetail(null)} onClick={e=>{if(e.target===e.currentTarget)setDetail(null);}}><header><h3>{detail?.title}</h3><button aria-label="关闭资讯详情" onClick={()=>setDetail(null)}><X size={20}/></button></header>{detail?.image&&<img src={detail.image} alt=""/>}{detail?.body&&<p>{detail.body}</p>}{detail?.items&&<ul>{detail.items.length?detail.items.map((title,i)=><li key={i}><button onClick={()=>{const news=[...aiNews,...groupNews].find(n=>n.title===title);if(news)openNews(news);else setDetail({title,body:summary});}}>{title}<ChevronRight size={16}/></button></li>):<li>暂无内容</li>}</ul>}</dialog>
  </div>;
};
