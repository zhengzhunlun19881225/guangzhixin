import React, { useEffect, useRef, useState } from 'react';
import { Button } from './UI';
import { initialAgentCrop, type AgentImageCrop, type AgentImageSource } from '../data/agentImages';

const handles = [
  ['nw', -1, -1, '左上'], ['n', 0, -1, '上方'], ['ne', 1, -1, '右上'], ['e', 1, 0, '右侧'],
  ['se', 1, 1, '右下'], ['s', 0, 1, '下方'], ['sw', -1, 1, '左下'], ['w', -1, 0, '左侧'],
] as const;
const clamp = (value: number, min: number, max: number) => Math.max(min, Math.min(max, value));
export function AgentImageCropper({ source, crop, selected, onChange, onSelect }: {
  source: AgentImageSource; crop: AgentImageCrop; selected: boolean;
  onChange: (crop: AgentImageCrop) => void; onSelect: () => void;
}) {
  const viewport = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0);
  const drag = useRef<{ id: number; x: number; y: number; crop: AgentImageCrop; handle?: readonly [number, number] } | null>(null);
  const minimum = Math.max(1, Math.min(source.width, source.height) * .1);
  useEffect(() => {
    const element = viewport.current!;
    const resize = () => setScale(Math.min(Math.max(0, element.clientWidth - 16) / source.width, Math.max(0, element.clientHeight - 16) / source.height));
    resize(); const observer = new ResizeObserver(resize); observer.observe(element);
    return () => observer.disconnect();
  }, [source.width, source.height]);
  const adjust = (start: AgentImageCrop, dx: number, dy: number, handle?: readonly [number, number]) => {
    if (!handle) return { ...start, x: clamp(start.x + dx, 0, source.width - start.size), y: clamp(start.y + dy, 0, source.height - start.size) };
    const [hx, hy] = handle;
    const ax = hx < 0 ? start.x + start.size : hx > 0 ? start.x : start.x + start.size / 2;
    const ay = hy < 0 ? start.y + start.size : hy > 0 ? start.y : start.y + start.size / 2;
    const maxX = hx < 0 ? ax : hx > 0 ? source.width - ax : 2 * Math.min(ax, source.width - ax);
    const maxY = hy < 0 ? ay : hy > 0 ? source.height - ay : 2 * Math.min(ay, source.height - ay);
    const delta = hx && hy ? (dx * hx + dy * hy) / 2 : hx ? dx * hx : dy * hy;
    const size = clamp(start.size + delta, Math.min(minimum, maxX, maxY), Math.min(maxX, maxY));
    return { x: hx < 0 ? ax - size : hx > 0 ? ax : ax - size / 2, y: hy < 0 ? ay - size : hy > 0 ? ay : ay - size / 2, size };
  };
  const begin = (event: React.PointerEvent<HTMLElement>, handle?: readonly [number, number]) => {
    if (!scale || event.button !== 0) return;
    event.preventDefault(); event.stopPropagation(); onSelect(); event.currentTarget.focus({ preventScroll: true });
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { id: event.pointerId, x: event.clientX, y: event.clientY, crop: { ...crop }, handle };
  };
  const move = (event: React.PointerEvent<HTMLElement>) => {
    if (!drag.current || drag.current.id !== event.pointerId || !scale) return;
    event.stopPropagation();
    const start = drag.current;
    onChange(adjust(start.crop, (event.clientX - start.x) / scale, (event.clientY - start.y) / scale, start.handle));
  };
  const end = () => { drag.current = null; };
  const keys = (event: React.KeyboardEvent<HTMLElement>, handle?: readonly [number, number]) => {
    if (!['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(event.key)) return;
    event.preventDefault(); event.stopPropagation(); onSelect();
    const step = Math.max(1, Math.min(source.width, source.height) / 100) * (event.shiftKey ? 10 : 1);
    onChange(adjust(crop, event.key === 'ArrowLeft' ? -step : event.key === 'ArrowRight' ? step : 0, event.key === 'ArrowUp' ? -step : event.key === 'ArrowDown' ? step : 0, handle));
  };
  return <div className="aip-upload-editor">
    <div ref={viewport} className="aip-cropper" role="group" aria-label="上传图片裁剪">
      <div className="aip-crop-stage" style={{ width: source.width * scale, height: source.height * scale }}>
        <img src={source.src} alt="上传的智能体图片" draggable={false}/>
        <div className="aip-crop-frame" role="group" tabIndex={0} aria-label="移动裁剪框" aria-describedby="aip-crop-help"
          style={{ left: crop.x * scale, top: crop.y * scale, width: crop.size * scale, height: crop.size * scale }}
          onPointerDown={event => begin(event)} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end} onKeyDown={event => keys(event)}>
          {handles.map(([id, x, y, name]) => <button key={id} type="button" className={`aip-crop-handle handle-${id}`} aria-label={`从${name}调整裁剪范围`}
            onPointerDown={event => begin(event, [x, y])} onPointerMove={move} onPointerUp={end} onPointerCancel={end} onLostPointerCapture={end} onKeyDown={event => keys(event, [x, y])}/>) }
        </div>
      </div>
    </div>
    <div className="aip-crop-controls"><Button size="small" variant="text" aria-label="选择已上传图片" aria-pressed={selected} onClick={onSelect}>{selected ? '已选上传图片' : '使用上传图片'}</Button><Button size="small" variant="text" onClick={() => { onSelect(); onChange(initialAgentCrop(source)); }}>重置裁剪</Button></div>
    <p id="aip-crop-help" className="aip-crop-help">拖动裁剪框移动，拖动控制点缩放；方向键微调，Shift加速。</p>
  </div>;
}
