import React, { useMemo, useState } from 'react';
import { Plus, Trash2 } from 'lucide-react';
import { Button } from '../components/UI';
import { SearchField } from '../components/FieldControls';
import catalog from './iconCatalog.json';
import './icon-catalog.css';

const assets = import.meta.glob('../assets/spec-icons/*.svg', { eager: true, query: '?url', import: 'default' }) as Record<string, string>;
const categories = [{ id: 'line', name: '线性图标' }, { id: 'solid', name: '面性图标' }] as const;
type Entry = typeof catalog.entries[number];

/** Original assets stay intact; CSS masks recolor monochrome shapes without flattening cutouts. */
function IconGlyph({ entry, size, brand }: { entry: Entry; size: number; brand: boolean }) {
  const [failed, setFailed] = useState(false);
  const src = assets[`../assets/spec-icons/${entry.file}`];
  if (!src || failed) return <span className="ig-unavailable" style={{ width: size, height: size }} title="图标资源不可用">?</span>;
  return <span className={`ig-glyph ${entry.preserveColor ? 'ig-original-color' : 'ig-monochrome'}`} data-tone={entry.tone === 'primary' && brand ? 'brand' : entry.tone} style={{ width: size, height: size, ...(!entry.preserveColor ? { maskImage: `url(${JSON.stringify(src)})`, WebkitMaskImage: `url(${JSON.stringify(src)})` } : {}) }} aria-hidden="true">
    <img src={src} alt="" width={size} height={size} onError={() => setFailed(true)}/>
  </span>;
}

export function IconCatalog() {
  const [query, setQuery] = useState(''), [category, setCategory] = useState('all');
  const [size, setSize] = useState(24), [brand, setBrand] = useState(false), [count, setCount] = useState(0);
  const matched = useMemo(() => {
    const key = query.trim().toLowerCase().replace(/\s+/g, '');
    return catalog.entries.filter(entry => `${entry.name} ${entry.aliases.join(' ')}`.toLowerCase().replace(/\s+/g, '').includes(key));
  }, [query]);
  const visible = matched.filter(entry => category === 'all' || entry.category === category);
  const reset = () => { setQuery(''); setCategory('all'); };
  return <div className="ig-catalog">
    <p className="ig-intro">138 个来源文件，按图形去重后保留 133 个。线性与面性分别展示，选中变体独立保留。</p>
    <div className="ig-toolbar"><SearchField label="搜索图标" placeholder="搜索名称或别名" value={query} onChange={setQuery}/><span className="ig-count" role="status">找到 {visible.length} 个图标</span></div>
    <div className="ig-filters" role="group" aria-label="图标分类">
      {[{ id: 'all', name: '全部' }, ...categories].map(item => <button key={item.id} type="button" aria-pressed={category === item.id} onClick={() => setCategory(item.id)}>{item.name}<span>{matched.filter(entry => item.id === 'all' || entry.category === item.id).length}</span></button>)}
    </div>
    <div className="ig-options">
      <div className="ig-sizes" role="group" aria-label="图标尺寸"><span>尺寸</span>{[16, 20, 24].map(value => <button key={value} type="button" aria-pressed={size === value} onClick={() => setSize(value)}>{value}px</button>)}</div>
      <div className="ig-colors" role="group" aria-label="图标配色"><span>普通图标</span><button type="button" aria-pressed={!brand} onClick={() => setBrand(false)}>主文字色</button><button type="button" aria-pressed={brand} onClick={() => setBrand(true)}>主题红</button></div>
    </div>
    <p className="ig-note">警告、提示和事件保留对应功能色；渐变文档保留原色。</p>
    {visible.length ? categories.map(group => {
      const entries = visible.filter(entry => entry.category === group.id);
      if (!entries.length) return null;
      return <section className="ig-section" key={group.id} aria-label={group.name}><h4>{group.name}<span>{entries.length}</span></h4><ul className="ig-grid">{entries.map(entry => <li key={entry.id} className="ig-card" data-icon-id={entry.id} data-category={entry.category} title={entry.aliases.length ? `${entry.name}；别名：${entry.aliases.join('、')}` : entry.name}>
        <div className="ig-icon-area"><IconGlyph entry={entry} size={size} brand={brand}/></div><span className="ig-name">{entry.name}</span>{entry.aliases.length > 0 && <small>别名：{entry.aliases.join('、')}</small>}
      </li>)}</ul></section>;
    }) : <div className="ig-empty"><p>暂无匹配图标</p><Button onClick={reset}>重置图标筛选</Button></div>}
    <div className="ig-usage"><h4>图标按钮使用示例</h4><div className="cr-row"><button type="button" className="cr-icon-button" aria-label="添加示例条目" onClick={() => setCount(value => value + 1)}><Plus size={20} aria-hidden="true"/></button><button type="button" className="cr-icon-button" aria-label="不可删除的示例" disabled><Trash2 size={20} aria-hidden="true"/></button><span role="status">条目数：{count}</span></div><p className="ig-note">操作图标由按钮承载，提供完整名称和键盘焦点；装饰图标不单独响应操作。</p></div>
  </div>;
}
