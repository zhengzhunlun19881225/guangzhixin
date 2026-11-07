import React, { useEffect, useState } from 'react';
import { ArrowLeft, ArrowUpRight, Check, Copy, Download, ChevronDown, Layers, X } from 'lucide-react';
import { Button, EmptyState, PanelHeading, StatusBadge } from '../components/UI';
import { SearchField } from '../components/FieldControls';
import { SelectField } from '../components/SelectField';
import { interactions, pages, rules, sections, specVersion } from './catalog';
import { HoverExamples } from './HoverExamples';
import tokenSource from './tokens.css?raw';
import foundation from './foundationReference.json';
import './spec.css';
import { ComponentNavigation, ComponentReference, useComponentCatalogue } from './ComponentReference';

const paletteGroups = foundation.paletteGroups;
function tokenValue(name: string) { return tokenSource.match(new RegExp(`--gx-${name}:\\s*([^;]+)`))?.[1] ?? ''; }
const typography = foundation.typography;
function SpecSection({ id, title, subtitle, children }: { id:string; title:string; subtitle:string; children:React.ReactNode }) {
  return <section id={id} className="spec-section" aria-labelledby={`${id}-heading`}><div className="spec-section-title"><span>{String(sections.findIndex(s=>s[0]===id)+1).padStart(2,'0')}</span><div><h2 id={`${id}-heading`}>{title}</h2><p>{subtitle}</p></div></div>{children}</section>;
}
export default function DesignSpec() {
  const [active,setActive]=useState('foundations');
  const [notice,setNotice]=useState('');
  const [search,setSearch]=useState('');
  const [group,setGroup]=useState('全部页面');
  const catalogue = useComponentCatalogue();
  const [navigationOpen, setNavigationOpen] = useState(false);
  useEffect(()=>{
    const followHash=()=>{
      const target=window.location.hash.slice(1);
      if(!target)return;
      const id=target==='components'?'library':target==='overview'?'foundations':target;
      if(id!==target){const url=new URL(location.href);url.hash=id;history.replaceState(null,'',url);}
      const component=new URLSearchParams(location.search).get('component');
      document.getElementById(id==='library'&&component?`component-${component}`:id)?.scrollIntoView();
    };
    followHash();window.addEventListener('hashchange',followHash);
    return()=>window.removeEventListener('hashchange',followHash);
  },[]);
  useEffect(() => {
    const root = document.querySelector('.spec-main');
    if (!root) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const threshold = root.getBoundingClientRect().top + 80;
        const visible = Array.from(root.querySelectorAll<HTMLElement>('.spec-section')).filter(el => el.getBoundingClientRect().top <= threshold);
        setActive(visible.at(-1)?.id || 'foundations');
      });
    };
    root.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update); observer.observe(root); update();
    return () => { cancelAnimationFrame(frame); root.removeEventListener('scroll', update); observer.disconnect(); };
  }, []);
  async function copy(text:string){try{await navigator.clipboard.writeText(text);setNotice(`已复制 ${text}`);}catch{setNotice('无法访问剪贴板，请选中文本手动复制。');}}
  function download(){const url=URL.createObjectURL(new Blob([tokenSource],{type:'text/css;charset=utf-8'}));const a=document.createElement('a');a.href=url;a.download='guangzhixin-tokens-v3.css';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);setNotice('已下载当前系统使用的样式参数。');}
  const filtered=pages.filter(p=>(group==='全部页面'||p.group===group)&&`${p.name}${p.rules}${p.source}`.toLowerCase().includes(search.toLowerCase()));
  return <div className="app-shell spec-app">
    <a className="spec-skip" href="?view=design-system#spec-content">跳到规范内容</a>
    <header className="spec-header"><a href="?view=dashboard" className="spec-brand"><span>广智新</span><i/>设计规范</a><div><StatusBadge>v{specVersion}</StatusBadge><a href="?view=dashboard" className="spec-back"><ArrowLeft size={15}/>返回系统</a><Button onClick={download}><Download size={14}/>下载样式参数</Button></div></header>
    <div className="spec-layout"><aside className="spec-sidebar" data-expanded={navigationOpen}><p>产品设计系统</p>
      <button type="button" className="spec-mobile-nav-toggle" aria-expanded={navigationOpen} aria-controls="spec-navigation" onClick={()=>setNavigationOpen(v=>!v)}>规范目录<ChevronDown size={16}/></button>
      <nav id="spec-navigation" className="spec-navigation" aria-label="规范目录">{sections.map(([id,label],i)=><div className="spec-nav-item" key={id}>
        <a href={`?view=design-system#${id}`} aria-current={active===id?'location':undefined} aria-controls={id==='library'?'component-navigation':undefined} aria-expanded={id==='library'?active==='library':undefined} onClick={e=>{e.preventDefault();setActive(id);const url=new URL(location.href);url.hash=id;history.pushState(null,'',url);document.getElementById(id)?.scrollIntoView();if(id!=='library')setNavigationOpen(false);}}><span>{String(i+1).padStart(2,'0')}</span>{label}{id==='library'&&<ChevronDown size={14} className={active==='library'?'is-expanded':''}/>}</a>
        {id==='library'&&<div hidden={active!=='library'}><ComponentNavigation catalogue={catalogue} onChoose={id=>{setActive('library');setNavigationOpen(false);requestAnimationFrame(()=>{document.getElementById(`component-${id}`)?.scrollIntoView({block:'start',behavior:'instant'});if(window.matchMedia('(max-width:800px)').matches)document.getElementById('spec-content')?.focus({preventScroll:true});});}}/></div>}
      </div>)}</nav><div className="spec-sidebar-note"><Layers size={20}/><strong>与产品共用组件</strong><p>组件规范全览区分公共组件、业务实现和新增规范示例。</p><a href="https://github.com/zhengzhunlun19881225/guangzhixin/tree/main/docs/design-system" target="_blank" rel="noreferrer">查看开发文档 <ArrowUpRight size={14}/></a></div></aside>
    <main className="spec-main" id="spec-content" aria-label="广智新设计规范" tabIndex={-1}>
      <SpecSection id="foundations" title="基础样式" subtitle="颜色来自语义参数；字号、间距与圆角各有明确用途。">
        <div className="spec-palette-groups">{paletteGroups.map(group=><section className="spec-palette-group" key={group.title}><h3>{group.title}</h3><div className="spec-colors">{group.colors.map(([label,name,usage])=><button key={name} onClick={()=>copy(`var(--gx-${name})`)} className="spec-swatch" aria-label={`复制${label}变量`}><span style={{background:`var(--gx-${name})`}}/><strong>{label}</strong><code>{tokenValue(name)}</code><p>{usage}</p><small>--gx-{name}<Copy size={12}/></small></button>)}</div></section>)}</div>
        <div className="spec-note">辅助灰色适用于次要元信息。关键操作、错误和主要正文不得仅使用浅灰；状态必须同时有文字说明。</div>
        <div className="spec-card"><PanelHeading title="文字层级"/>{typography.map(([label,size,line,usage])=><div className="spec-type-row" key={label}><span style={{fontSize:`var(--gx-font-${size})`,lineHeight:`var(--gx-line-${line})`}}>{label} · 广智新</span><code>{tokenValue(`font-${size}`)} / {tokenValue(`line-${line}`)}</code><small>{usage}</small></div>)}</div>
        <div className="spec-two-col"><div className="spec-card"><PanelHeading title="间距节奏"/><div className="spec-spacing">{foundation.spacing.map(n=><div key={n}><i style={{width:`var(--gx-space-${n})`}}/><code>{tokenValue(`space-${n}`)}</code></div>)}</div><p>4/8px 用于局部间隔，12/16px 用于组件内容，20px 用于业务面板，24/32px 用于大区块。</p></div><div className="spec-card"><PanelHeading title="圆角与层次"/><div className="spec-radii">{foundation.radii.map(n=><div key={n} style={{borderRadius:`var(--gx-radius-${n})`}}><span>{tokenValue(`radius-${n}`)}</span></div>)}</div><p>菜单选项 4px、控件 8px、反馈浮层 12px、面板 16px、胶囊 999px。菜单使用统一阴影；静态面板不使用悬浮抬升。</p></div></div>
      </SpecSection>
      <SpecSection id="library" title="组件规范全览" subtitle="六类 59 项组件，涵盖使用场景、视觉结构、交互状态、键盘操作及接入边界。"><ComponentReference catalogue={catalogue}/></SpecSection>
      <SpecSection id="interaction" title="状态与交互" subtitle="相同状态保持一致；确有用途的差异明确登记。"><HoverExamples/><div className="spec-table-wrap"><table><thead><tr><th>状态</th><th>标准</th><th>边界与例外</th></tr></thead><tbody>{interactions.map(row=><tr key={row[0]}>{row.map((cell,i)=>i===0?<th scope="row" key={i}>{cell}</th>:<td key={i}>{cell}</td>)}</tr>)}</tbody></table></div><div className="spec-note"><strong>键盘与浮层</strong><p>下拉框支持方向键、Home/End、Enter、Escape 和 Tab。浮层接近屏幕底部时向上展开。原生弹窗演示支持焦点约束与关闭后返回触发点。</p></div></SpecSection>
      <SpecSection id="patterns" title="页面与业务模式" subtitle="组件组合规则，以及不能被全局样式覆盖的场景要求。"><div className="spec-two-col">{rules.map(rule=><article className="spec-card" key={rule.title}><h3>{rule.title}</h3><p>{rule.text}</p></article>)}</div></SpecSection>
      <SpecSection id="inventory" title="页面盘点" subtitle="包含当前页面、进入方式、代码入口和验收重点。"><div className="spec-demo-row"><SearchField label="查找页面规范" placeholder="搜索页面、规则或组件" value={search} onChange={setSearch}/><SelectField label="页面分组" options={['全部页面','工作台','文档','门户','协作']} value={group} onChange={setGroup}/><span>{filtered.length} 个场景</span></div><div className="spec-table-wrap"><table><thead><tr><th>页面 / 场景</th><th>适用规则</th><th>验收重点</th><th>查看</th></tr></thead><tbody>{filtered.map(page=><tr key={page.name}><td><strong>{page.name}</strong><small>{page.source}</small></td><td>{page.rules}</td><td>{page.check}</td><td><a href={page.url||'?view=chat'} target="_blank" rel="noreferrer" aria-label={`打开${page.name}`}>打开 <ArrowUpRight size={13}/></a></td></tr>)}</tbody></table></div>{!filtered.length&&<EmptyState title="暂无匹配页面" action={<Button onClick={()=>{setSearch('');setGroup('全部页面');}}>清空筛选</Button>}/>}</SpecSection>
      <SpecSection id="acceptance" title="开发与验收" subtitle="设计变更、组件实现和页面检查组成同一个交付流程。"><div className="spec-card"><ol className="spec-checks">{['确认页面属于现有模式，记录新增状态及业务例外。','优先引用公共组件；颜色、尺寸使用语义参数。','检查默认、悬浮、选中、聚焦、禁用、加载、错误、空状态。','验证键盘、长文本、空结果、弹窗层级和滚动边界。','运行类型检查、规范检查、构建与浏览器回归。','同步更新规范、验收记录和版本号，再发布。'].map(text=><li key={text}><Check size={16}/>{text}</li>)}</ol><pre>{`npm run lint\nnpm run check:design\nnpm run build\nnpm run check:ui  # 启动本地预览后执行，需 Playwright + Chrome`}</pre></div><div className="spec-note"><strong>本版覆盖与边界</strong><p>统一核心颜色、字段尺寸、菜单状态、工作台状态标签，新增公共组件并接入现有业务页面。浏览器回归覆盖桌面代表性页面与关键交互；完整人工可访问性审计、企业后端接入及移动端重设计不属于本版验收结论。详细结果与遗留项见开发文档。</p></div><footer className="spec-footer">广智新设计规范 · v{specVersion} · 2026-11-07</footer></SpecSection>
    </main></div>
    <div className="spec-notice" role="status" aria-live="polite">{notice&&<><Check size={16}/><span>{notice}</span><button aria-label="关闭提示" onClick={()=>setNotice('')}><X size={14}/></button></>}</div>

  </div>;
}
