import { SelectField } from './SelectField';
import React, { useState } from 'react';
import { Plus, Minus, ChevronDown } from 'lucide-react';
import { figmaAssets } from '../data/figmaAssets';

const provinces = [
  { name: '北京', value: '45,678', color: '#ffa785', x: 303, y: 136 },
  { name: '山东', value: '62,340', color: '#f75a3b', x: 341, y: 168 },
  { name: '江苏', value: '98,760', color: '#f75a3b', x: 349, y: 197 },
  { name: '上海', value: '58,920', color: '#ff8972', x: 356, y: 226 },
  { name: '广东', value: '125,680', color: '#f53f3f', x: 263, y: 289 },
];

export const ProvinceTaxMap: React.FC = () => {
  const [zoom, setZoom] = useState(1);
  return <section className="province-map-card lg:col-span-4" aria-labelledby="province-map-title">
    <div className="province-map-stage">
      <div className="province-map-viewport">
        <div className="province-map-content" style={{ transform: `scale(${zoom})` }}>
          <img className="province-map-image" src="assets/portal/province-tax-map.png" alt="中国各省份年度累计实缴税金分布" />
          {provinces.map(province => <div key={province.name} className="province-map-label" style={{ left: `${province.x / 508 * 100}%`, top: province.y, '--province-color': province.color } as React.CSSProperties}>
            <i /><span>{province.name}</span><span>{province.value}</span>
          </div>)}
        </div>
      </div>
      <div className="province-map-header">
        <h3 id="province-map-title">各省份年度累计实缴税金 (万元)</h3>
        <div className="province-map-filters">
          {[{ label: '地图企业范围', value: '全部企业' }, { label: '地图年份', value: '2026年' }].map(filter => <SelectField key={filter.label} label={filter.label} variant="compact" options={[filter.value]} />)}
        </div>
      </div>
      <div className="province-map-zoom" aria-label="地图缩放">
        <button title="放大地图" disabled={zoom >= 1.6} onClick={() => setZoom(value => Math.min(1.6, +(value + 0.2).toFixed(1)))}><Plus width="13" height="13" /></button>
        <button title="缩小地图" disabled={zoom <= 0.8} onClick={() => setZoom(value => Math.max(0.8, +(value - 0.2).toFixed(1)))}><Minus width="13" height="13" /></button>
      </div>
      <div className="province-map-scale"><span>高</span><i /><span>低</span></div>
      <div className="province-map-legend">
        {['北京', '上海', '江苏', '山东', '广东'].map(name => <span key={name}><i style={{ background: provinces.find(province => province.name === name)?.color }} />{name}</span>)}
      </div>
    </div>
  </section>;
};
