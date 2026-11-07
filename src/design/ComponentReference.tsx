import React, { useEffect, useMemo, useState } from 'react';
import { RotateCcw, Search, Shapes } from 'lucide-react';
import { Button, EmptyState, StatusBadge } from '../components/UI';
import { SearchField } from '../components/FieldControls';
import reference from './componentReference.json';
import { ComponentExample } from './ComponentExamples';
import './component-reference.css';

const stages: Record<string, string> = { shared: '公共组件', business: '业务实现', proposal: '规范示例' };
const fields = [
  ['usage', '用途与选择'], ['visual', '结构与视觉'], ['behavior', '状态与交互'],
  ['keyboard', '键盘与焦点'], ['boundaries', '边界与恢复'], ['contract', '接入约定'],
] as const;

/** Reference-only catalogue: examples are not silently promoted to production APIs. */
export function useComponentCatalogue() {
  const initial = new URLSearchParams(location.search).get('component');
  const [selected, setSelected] = useState(reference.entries.some(e => e.id === initial) ? initial! : 'button');
  const [group, setGroup] = useState('all');
  const [query, setQuery] = useState('');
  const filtered = useMemo(() => reference.entries.filter(e => (group === 'all' || e.group === group) && `${e.name} ${e.usage}`.toLowerCase().includes(query.trim().toLowerCase())), [group, query]);
  const entry = filtered.find(e => e.id === selected) || filtered[0];
  function choose(id: string) {
    setSelected(id);
    const url = new URL(location.href); url.searchParams.set('component', id); url.hash = 'library';
    history.replaceState(null, '', url);
  }
  useEffect(() => {
    const sync = () => {
      const id = new URLSearchParams(location.search).get('component');
      if (reference.entries.some(e => e.id === id)) { setSelected(id!); setGroup('all'); setQuery(''); }
    };
    window.addEventListener('popstate', sync);
    return () => window.removeEventListener('popstate', sync);
  }, []);
  return { group, setGroup, query, setQuery, filtered, entry, choose, setSelected };
}
type Catalogue = ReturnType<typeof useComponentCatalogue>;
export function ComponentNavigation({ catalogue, onChoose }: { catalogue: Catalogue; onChoose: (id: string) => void }) {
  return <nav id="component-navigation" className="cr-list" aria-label="组件列表">{catalogue.filtered.map(e => <button key={e.id} type="button" aria-current={catalogue.entry?.id === e.id ? 'true' : undefined} onClick={() => { catalogue.choose(e.id); onChoose(e.id); }}><span>{e.name}</span><small>{stages[e.stage]}</small></button>)}{!catalogue.filtered.length && <p>没有匹配的组件</p>}</nav>;
}
export function ComponentReference({ catalogue }: { catalogue: Catalogue }) {
  const { group, setGroup, query, setQuery, filtered, entry } = catalogue;
  useEffect(() => {
    const root = document.querySelector('.spec-main');
    if (!root) return;
    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const threshold = root.getBoundingClientRect().top + 48;
        const cards = Array.from(root.querySelectorAll<HTMLElement>('.cr-detail'));
        const current = cards.filter(card => card.getBoundingClientRect().top <= threshold).at(-1) || cards[0];
        if (current) catalogue.setSelected(current.dataset.component!);
      });
    };
    root.addEventListener('scroll', update, { passive: true });
    const observer = new ResizeObserver(update); observer.observe(root);
    return () => { cancelAnimationFrame(frame); root.removeEventListener('scroll', update); observer.disconnect(); };
  }, [filtered, catalogue.setSelected]);
  return <div className="cr-library">
    <div className="cr-intro"><Shapes size={28} aria-hidden="true"/><div><h3>组件规范全览</h3><p>6 类 · {reference.entries.length} 项 · 与当前系统配色和尺寸一致</p></div><a href="./design-system-components.md" download="广智新完整设计规范-v3.6.0.md" title="基础样式、组件规范全览、状态与交互">下载完整规范</a></div>
    <p className="cr-scope">公共组件可直接复用；业务实现需按页面源码接入；规范示例用于确认交互与外观，尚未作为公共组件在业务中上线。预览操作仅改变当前示例。</p>
    <div className="cr-filters" role="group" aria-label="组件类别">
      {[{ id: 'all', name: '全部' }, ...reference.groups].map(g => <button key={g.id} type="button" aria-pressed={group === g.id} onClick={() => setGroup(g.id)}>{g.name}<span>{g.id === 'all' ? reference.entries.length : reference.entries.filter(e => e.group === g.id).length}</span></button>)}
    </div>
    <div className="cr-search"><SearchField label="搜索组件规范" placeholder="搜索组件名称或用途" value={query} onChange={setQuery}/><span role="status">{filtered.length} 项规范</span></div>
    {entry ? <div className="cr-workspace">
      {filtered.map(item => <ComponentDetail key={item.id} entry={item} active={entry?.id === item.id}/>)}
    </div> : <EmptyState title="没有匹配的组件" description="尝试中文名称、英文名称或用途关键词。" action={<Button onClick={() => { setQuery(''); setGroup('all'); }}><Search size={14}/>重置筛选</Button>}/>}
    <details className="cr-common"><summary>通用状态、组合与验收规则</summary><p>可操作控件覆盖默认、悬浮、聚焦、禁用和适用的加载、错误、选中状态。静态文字、间距、分割线没有加载或选中状态；容器自身不添加无意义交互。加载阻止重复提交，错误保留输入，空数据保留恢复入口。</p><p>禁用优先于悬浮与点击；只读允许选择和复制；输入焦点使用单层边框；提示不能仅靠颜色表达。浮层内聚焦、Escape 关闭和关闭回焦必须一起验证。新组件从示例升级为公共组件前，还需真实业务接入、异步错误处理、长内容及键盘回归。</p></details>
  </div>;
}

const ComponentDetail = React.memo(function ComponentDetail({ entry, active }: { entry: (typeof reference.entries)[number]; active: boolean }) {
  const [revision, setRevision] = useState(0);
  return <article id={`component-${entry.id}`} className="cr-detail" data-component={entry.id} data-active={active}>
        <header className="cr-detail-header"><div><small>{reference.groups.find(g => g.id === entry.group)?.name}</small><h3>{entry.name}</h3></div><StatusBadge tone={entry.stage === 'shared' ? 'success' : entry.stage === 'business' ? 'info' : 'neutral'}>{stages[entry.stage]}</StatusBadge></header>
        <div className="cr-preview-header"><span>组件预览</span><Button variant="text" onClick={() => setRevision(v => v + 1)} aria-label="重置当前组件示例"><RotateCcw size={14}/>重置</Button></div>
        <div className="cr-preview"><ComponentExample key={`${entry.id}-${revision}`} id={entry.id}/></div>
        <dl className="cr-rules">{fields.map(([key, label]) => <div key={key}><dt>{label}</dt><dd>{entry[key]}</dd></div>)}</dl>
        <footer className="cr-source">{entry.designSource && <p className="cr-design-source">{entry.referenceUrl ? <a href={entry.referenceUrl} target="_blank" rel="noreferrer">{entry.designSource}</a> : entry.designSource}</p>}<strong>{entry.stage === 'shared' ? '当前代码' : entry.stage === 'business' ? '参考业务源码' : '落地状态'}</strong><code>{entry.source === '—' ? '新增规范示例；接入约定为建议接口，非已发布 API。' : `src/${entry.source}`}</code>{entry.stage === 'business' && <p>列出的规范是后续统一标准；单页实现不等于已经抽象为公共组件。</p>}</footer>
      </article>;
});
