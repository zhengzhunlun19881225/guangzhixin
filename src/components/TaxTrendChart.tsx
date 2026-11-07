import React from 'react';

// Both panels share the eight-month series shown in the supplied design.
const revenues = [17500, 14500, 16000, 13000, 17500, 17500, 15500, 12000];
const rates = [2.2, 1.6, 2.4, 1.7, 2.5, 1.9, 2.5, 1.05];
export function TaxTrendChart({ color }: { color: string }) {
  const x = (i: number) => 53 + i * 57;
  const y = (rate: number) => 110 - rate / 3 * 98;
  return <div className="portal-tax-plot">
    <svg viewBox="0 0 500 140" role="img" aria-label="1月至8月营业收入与整体税负率趋势">
      {[12, 45, 78, 110].map((v, i) => <g key={v}>
        <line x1="26" y1={v} x2="480" y2={v} stroke="#eef1f7" />
        <text x="23" y={v + 5} textAnchor="end">{['20k','15k','10k','0'][i]}</text>
        <text x="483" y={v + 5}>{3 - i}%</text>
      </g>)}
      {revenues.map((value, i) => <g key={i}>
        <rect x={x(i)-5} y={110-value/20000*98} width="10" height={value/20000*98} rx="5" fill={color}><title>{i+1}月营业收入：{value.toLocaleString()}万元</title></rect>
        <rect x={x(i)-5} y="105" width="10" height="5" fill={color}/>
        <text x={x(i)} y="130" textAnchor="middle">{i+1}月</text>
      </g>)}
      <polyline points={rates.map((v,i)=>`${x(i)},${y(v)}`).join(' ')} fill="none" stroke="var(--gx-info)" strokeWidth="2"/>
      {rates.map((v,i)=><circle key={i} cx={x(i)} cy={y(v)} r="2.8" fill="white" stroke="var(--gx-info)" strokeWidth="2"><title>{i+1}月整体税负率：{v}%</title></circle>)}
    </svg>
  </div>;
}
