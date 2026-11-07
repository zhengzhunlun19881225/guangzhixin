import React, { useState } from 'react';
import { Bell } from 'lucide-react';
import { Button } from '../components/UI';
import { NumberInput } from '../components/NumberInput';
import './badge-example.css';

function Count({ count }: { count: number }) { return <span className="cr-badge-pill" aria-hidden="true">{count > 99 ? '99+' : count}</span>; }
export function BadgeExample() {
  const [count, setCount] = useState(5), [showZero, setShowZero] = useState(false), [dot, setDot] = useState(true);
  return <div className="cr-badge-example">
    <h4>计数徽标</h4><div className="cr-badge-samples"><span className="cr-badge-square" role="img" aria-label="未读99条"><Count count={99}/></span><span className="cr-badge-square" role="img" aria-label="未读超过99条"><Count count={100}/></span></div>
    <h4>小红点</h4><div className="cr-badge-samples"><span className="cr-badge-square" role="img" aria-label="有新消息"><i className="cr-badge-small-dot" aria-hidden="true"/></span></div>
    <p className="cr-hint">主题红 · 99 封顶 · 白色描边 · 右上角定位</p>
    <h4>交互示例</h4><div className="cr-row cr-badge-controls"><div className="cr-field"><span>未读数量</span><NumberInput label="未读数量" min={0} max={9999} value={count} onChange={value => setCount(Math.floor(value))}/></div><label className="cr-check"><input type="checkbox" checked={showZero} onChange={e => setShowZero(e.target.checked)}/>显示零值</label></div>
    <div className="cr-badge-samples"><button className="cr-badge-square" aria-label={`消息，${count}条未读，点击标记已读`} onClick={() => setCount(0)}><Bell size={20} aria-hidden="true"/>{(count > 0 || showZero) && <Count count={count}/>}</button><button className="cr-badge-square" aria-label={dot ? '有新提醒，点击标记已读' : '暂无新提醒'} onClick={() => setDot(false)}><Bell size={20} aria-hidden="true"/>{dot && <i className="cr-badge-small-dot" aria-hidden="true"/>}</button><Button onClick={() => { setCount(5); setDot(true); }}>重置未读</Button></div>
    <p className="cr-result" role="status">未读 {count} 条；{dot ? '有新提醒' : '提醒已读'}。计数大于 99 显示 99+，零值默认隐藏。</p>
  </div>;
}
