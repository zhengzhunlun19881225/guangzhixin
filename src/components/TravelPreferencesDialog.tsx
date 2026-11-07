import React, { useState } from 'react';
import { BedDouble, MapPin, Plane, Sparkles, TrainFront, X } from 'lucide-react';
import { Button, ModalSurface } from './UI';
import { SelectField } from './SelectField';
import { readTravelPreferences, TRAVEL_FIELDS, TRAVEL_STORAGE_KEY, type TravelKey } from '../data/personalSettings';
import './personal-features.css';

export function TravelPreferencesDialog({ onClose, onSaved }: { onClose: () => void; onSaved: () => void }) {
  const [draft, setDraft] = useState(readTravelPreferences);
  const [summary, setSummary] = useState(false);
  const [error, setError] = useState('');
  const field = (key: TravelKey) => {
    const definition = TRAVEL_FIELDS.find(item => item.key === key)!;
    return <div className="pf-field" key={key}><span id={`travel-${key}`}>{definition.label.replace('火车', '').replace('飞机', '').replace('酒店级别', '级别')}</span>
      <SelectField label={definition.label} value={draft[key]} placeholder={!draft[key]} options={[{ value: '', label: '请选择' }, ...definition.options]}
        onChange={value => { setDraft(current => ({ ...current, [key]: value })); setError(''); }}/></div>;
  };
  return <ModalSurface label="差旅喜好设置" className="travel-preferences-dialog" onClose={onClose}>
    <header className="gx-dialog-header"><h2>差旅喜好设置</h2><button aria-label="关闭差旅喜好设置" onClick={onClose}><X size={18}/></button></header>
    <form className="gx-dialog-form" onSubmit={event => {
      event.preventDefault();
      try { localStorage.setItem(TRAVEL_STORAGE_KEY, JSON.stringify(draft)); onSaved(); } catch { setError('保存失败，请检查浏览器存储空间后重试。当前设置已保留。'); }
    }}>
      <div className="gx-dialog-body">
        <div className="travel-tools"><Button variant="text" aria-expanded={summary} onClick={() => setSummary(value => !value)}><Sparkles size={14}/>AI分析喜好</Button><span>用于本机差旅偏好</span></div>
        {summary && <aside className="travel-summary" role="status"><strong>当前偏好概览</strong><p>{TRAVEL_FIELDS.filter(item => draft[item.key]).map(item => `${item.label}：${draft[item.key]}`).join('；') || '尚未设置偏好。'}</p><small>仅根据当前选择整理；未接入历史订单或 AI 分析服务，不自动推断或覆盖设置。</small></aside>}
        <section><h3><MapPin size={15}/>常驻地</h3><div className="travel-grid">{field('city')}</div></section>
        <section><h3><TrainFront size={15}/>火车/动车</h3><div className="travel-grid">{field('trainTime')}</div></section>
        <section><h3><Plane size={15}/>飞机</h3><div className="travel-grid">{field('flightTime')}{field('airline')}{field('aircraft')}</div></section>
        <section><h3><BedDouble size={15}/>酒店</h3><div className="travel-grid">{field('hotelBrand')}{field('hotelLevel')}{field('facilities')}{field('breakfast')}</div></section>
      </div>
      <footer className="gx-dialog-footer">{error && <p role="alert">{error}</p>}<Button onClick={onClose}>取消</Button><Button variant="primary" type="submit">保存</Button></footer>
    </form>
  </ModalSurface>;
}
