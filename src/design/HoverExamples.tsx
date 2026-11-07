import React, { useState } from 'react';
import { Settings2 } from 'lucide-react';
import { figmaAssets } from '../data/figmaAssets';
import { Button } from '../components/UI';
import './hover-examples.css';

import hoverRules from './hoverReference.json';

export function HoverExamples() {
  const [result, setResult] = useState('移入可操作示例，或用 Tab 聚焦、Enter / Space 操作。');
  return <div className="hs-examples"><h3>Hover 悬浮反馈</h3><p>以知识库卡片、云盘上传、文字操作和设置图标为例。右侧“悬浮示意”便于对比，也可以直接移入左侧默认示例。</p>
    <div className="hs-card-pair">{[false, true].map(hover => <div key={String(hover)}><small>{hover ? '悬浮示意' : '默认 · 移入查看'}</small><button className={`hs-card ${hover ? 'is-hover' : ''}`} onClick={() => setResult('已打开知识库卡片示例。')}><span className="hs-card-heading"><img src={figmaAssets['71-4112:img5']} width={40} height={40} alt=""/><span><strong>知识库名称</strong><small>文档数：3份</small></span></span><span><img src={figmaAssets['71-4112:img2']} width={14} height={14} alt=""/>李敏莉</span><span><img src={figmaAssets['71-4112:img4']} width={14} height={14} alt=""/>2025/06/02 02:00</span></button></div>)}</div>
    <div className="hs-controls">{(['primary', 'secondary', 'text'] as const).map((variant, i) => <div className="hs-control-row" key={variant}><strong>{['主按钮（页面）', '次按钮', '文字按钮'][i]}</strong><Button variant={variant} onClick={() => setResult('已触发默认按钮示例。')}>{['上传文件', '取消', '查看详情'][i]}</Button><Button variant={variant} className="is-hover" onClick={() => setResult('已触发悬浮按钮示例。')}>悬浮示意</Button><Button variant={variant} disabled>不可用</Button></div>)}<div className="hs-control-row"><strong>主按钮（弹窗）</strong><Button className="hs-solid" onClick={() => setResult('已触发弹窗主按钮示例。')}>确定</Button><Button className="hs-solid is-hover" onClick={() => setResult('已触发弹窗主按钮示例。')}>悬浮示意</Button><Button className="hs-solid" disabled>不可用</Button></div><div className="hs-control-row"><strong>图标按钮</strong><button className="hs-icon" aria-label="设置示例" onClick={() => setResult('已打开设置示例。')}><Settings2 size={16}/></button><button className="hs-icon is-hover" aria-label="设置悬浮示意" onClick={() => setResult('已打开设置示例。')}><Settings2 size={16}/></button><button className="hs-icon" aria-label="不可用设置" disabled><Settings2 size={16}/></button></div></div>
    <p className="hs-result" role="status">{result}</p><div className="spec-table-wrap"><table><thead><tr><th>对象</th><th>默认</th><th>Hover / 点击反馈</th></tr></thead><tbody>{hoverRules.map(([name, normal, hover]) => <tr key={name}><th scope="row">{name}</th><td>{normal}</td><td>{hover}</td></tr>)}</tbody></table></div><p>按钮、链接和选择控件保留2px #CC0000键盘焦点外轮廓；输入及日期字段仅保留单层焦点边框。不能用hover代替焦点或选中。触屏不依赖hover才能访问操作；减少动态效果时取消卡片位移与过渡，保留颜色和阴影反馈。上述规则仅用于规范示例。</p>
  </div>;
}
