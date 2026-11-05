import React, { useState } from 'react';
import { figmaAssets } from '../data/figmaAssets';
import { TaxTrendChart } from './TaxTrendChart';
import { ProvinceTaxMap } from './ProvinceTaxMap';
import { 
  ChevronDown, 
  ChevronRight, 
  Plus, 
  Minus, 
  TrendingUp, 
  Layers, 
  PieChart, 
  BarChart, 
  Sparkles, 
  Building 
} from 'lucide-react';

export const PortalDataView: React.FC = () => {
  const [selectedGroup, setSelectedGroup] = useState('集团合并');

  const projectInvestments = [
    {
      name: '智能制造装备升级项目',
      company: '广东某某科技股份有限公司',
      stage: '投资中',
      stageColor: 'text-slate-700',
      irr: '18.50%',
      payback: '4.2 年',
      progress: 75,
      profitRate: '16.80%'
    },
    {
      name: '高性能复合材料研发项目',
      company: '深圳某某创新研究院',
      stage: '投资中',
      stageColor: 'text-slate-700',
      irr: '18.50%',
      payback: '4.2 年',
      progress: 55,
      profitRate: '21.40%'
    },
    {
      name: '新型生物药物研发项目',
      company: '北京某某生物科技有限公司',
      stage: '投后管理',
      stageColor: 'text-slate-700',
      irr: '18.50%',
      payback: '4.2 年',
      progress: 45,
      profitRate: '23.60%'
    },
    {
      name: '7nm芯片研发项目',
      company: '上海某某半导体有限公司',
      stage: '投资中',
      stageColor: 'text-slate-700',
      irr: '18.50%',
      payback: '4.2 年',
      progress: 35,
      profitRate: '--'
    },
    {
      name: '新型固态电池研发项目',
      company: '杭州某某新能源有限公司',
      stage: '投资中',
      stageColor: 'text-slate-700',
      irr: '18.50%',
      payback: '4.2 年',
      progress: 25,
      profitRate: '18.90%'
    }
  ];

  const techProgress = [
    { name: '新一代人工智能技术...', budget: 8500, actual: 7200 },
    { name: '高性能复合材料研制', budget: 6200, actual: 5100 },
    { name: '新型生物药物研发平台', budget: 2600, actual: 1800 },
    { name: '7nm芯片先导制程项目', budget: 1900, actual: 1400 },
    { name: '新型固态电池规模化', budget: 1500, actual: 1200 }
  ];

  return (
    <div className="portal-data flex-1 flex flex-col h-full bg-[#f8fafc]/50 overflow-y-auto select-none p-6 md:p-8 space-y-6">
      <div className="max-w-7xl mx-auto w-full space-y-6">
        
        {/* Row 1: 一利五率+营收/利润 & 科研动态 (Image 15) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* 一利五率+营收/利润 (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs space-y-6">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-orange-500 rounded-full" />
                <h3 className="text-base font-bold text-slate-900">一利五率+营收/利润</h3>
              </div>

              <div className="relative">
                <select 
                  value={selectedGroup}
                  onChange={(e) => setSelectedGroup(e.target.value)}
                  className="appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-7 py-1 text-xs text-slate-700 outline-hidden cursor-pointer"
                >
                  <option>集团合并</option>
                  <option>板块汇总</option>
                  <option>二级企业汇总</option>
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
              </div>
            </div>

            {/* 4 Big Metrics */}
            <div className="metrics-grid grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
              {/* Metric 1 */}
              <div className="bg-orange-50/40 rounded-2xl p-4 border border-orange-100/60 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-orange-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <img src={figmaAssets['71-1646:imgGroup1']} alt="" width="22" height="22" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500">营业收入(亿元)</span>
                  <div className="text-lg font-black text-slate-900 font-mono tracking-tight">
                    1,234.56
                  </div>
                </div>
              </div>

              {/* Metric 2 */}
              <div className="bg-amber-50/40 rounded-2xl p-4 border border-amber-100/60 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <img src={figmaAssets['71-1646:imgGroup2']} alt="" width="22" height="22" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500">利润总额(亿元)</span>
                  <div className="text-lg font-black text-slate-900 font-mono tracking-tight">
                    345.67
                  </div>
                </div>
              </div>

              {/* Metric 3 */}
              <div className="bg-purple-50/40 rounded-2xl p-4 border border-purple-100/60 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-purple-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <img src={figmaAssets['71-1646:imgGroup3']} alt="" width="22" height="22" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500">资产总额(亿元)</span>
                  <div className="text-lg font-black text-slate-900 font-mono tracking-tight">
                    5,678.90
                  </div>
                </div>
              </div>

              {/* Metric 4 */}
              <div className="bg-blue-50/40 rounded-2xl p-4 border border-blue-100/60 flex items-center gap-3.5">
                <div className="w-11 h-11 rounded-xl bg-blue-500 text-white flex items-center justify-center shrink-0 shadow-xs">
                  <img src={figmaAssets['71-1646:imgGroup4']} alt="" width="22" height="22" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-500">净利润(亿元)</span>
                  <div className="text-lg font-black text-slate-900 font-mono tracking-tight">
                    123.45
                  </div>
                </div>
              </div>
            </div>

            {/* 5 Ratios Row */}
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4 pt-2 border-t border-slate-50">
              <div className="text-center">
                <div className="text-[11px] text-slate-400">净资产收益率</div>
                <div className="text-base font-bold text-slate-800 font-mono mt-0.5">
                  11.2<span className="text-xs font-sans ml-0.5">%</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-[11px] text-slate-400">营业收入现金比率</div>
                <div className="text-base font-bold text-slate-800 font-mono mt-0.5">
                  11.2<span className="text-xs font-sans ml-0.5">%</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-[11px] text-slate-400">资产负债率</div>
                <div className="text-base font-bold text-slate-800 font-mono mt-0.5">
                  1.2<span className="text-xs font-sans ml-0.5">%</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-[11px] text-slate-400">研发投入强度</div>
                <div className="text-base font-bold text-slate-800 font-mono mt-0.5">
                  26.2<span className="text-xs font-sans ml-0.5">%</span>
                </div>
              </div>

              <div className="text-center">
                <div className="text-[11px] text-slate-400">全员劳动生产率</div>
                <div className="text-base font-bold text-slate-800 font-mono mt-0.5">
                  22.1<span className="text-xs font-sans ml-0.5">%</span>
                </div>
              </div>
            </div>
          </div>

          {/* 科研动态 (4 cols) */}
          <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-3">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-red-500 rounded-full" />
                  <h3 className="text-base font-bold text-slate-900">科研动态</h3>
                </div>
                <button className="text-xs text-slate-400 hover:text-slate-600 flex items-center">
                  更多 <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs text-slate-700">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-medium">
                      <th className="py-2 px-1">企业名称</th>
                      <th className="py-2 px-1">类别</th>
                      <th className="py-2 px-1">最新动态</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    <tr>
                      <td className="py-2.5 px-1 font-medium truncate max-w-[100px]">智能制造装备升级项目</td>
                      <td className="py-2.5 px-1 text-slate-500">智能算法</td>
                      <td className="py-2.5 px-1 text-slate-600 truncate max-w-[130px]">成功研发新一代智能算法模型，...</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-1 font-medium truncate max-w-[100px]">高性能复合材料研发项目</td>
                      <td className="py-2.5 px-1 text-slate-500">复合材料</td>
                      <td className="py-2.5 px-1 text-slate-600 truncate max-w-[130px]">高性能复合材料项目进入中试阶段</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-1 font-medium truncate max-w-[100px]">智能制造装备升级项目</td>
                      <td className="py-2.5 px-1 text-slate-500">智能算法</td>
                      <td className="py-2.5 px-1 text-slate-600 truncate max-w-[130px]">新型生物药物临床试验申请获批</td>
                    </tr>
                    <tr>
                      <td className="py-2.5 px-1 font-medium truncate max-w-[100px]">高性能复合材料研发项目</td>
                      <td className="py-2.5 px-1 text-slate-500">复合材料</td>
                      <td className="py-2.5 px-1 text-slate-600 truncate max-w-[130px]">7nm芯片研发取得重大突破</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>

        </div>

        {/* Row 2: 二级公司纳税情况 & 各省份年度累计实缴税金 (Image 15) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* 二级公司纳税情况 (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-orange-500 rounded-full" />
                <h3 className="text-base font-bold text-slate-900">二级公司纳税情况</h3>
              </div>

              <div className="flex items-center gap-2">
                <div className="relative">
                  <select className="appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-7 py-1 text-xs text-slate-700 outline-hidden cursor-pointer">
                    <option>全部企业</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
                </div>
                <div className="relative">
                  <select className="appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-3 pr-7 py-1 text-xs text-slate-700 outline-hidden cursor-pointer">
                    <option>2026年</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400 absolute right-2 top-2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Dual Charts Row */}
            <div className="tax-chart-pair grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Chart 1: 营业收入与整体税负趋势 */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800">营业收入与整体税负趋势</h4>
                
                {/* 2 Mini KPI indicators */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50/80 rounded-xl p-2.5 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-orange-500 text-white flex items-center justify-center shrink-0 text-xs">
                      <span className="tax-kpi-symbol" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">当月营业收入 (万元)</div>
                      <div className="text-xs font-bold font-mono text-slate-900">12,345.67</div>
                    </div>
                  </div>

                  <div className="bg-slate-50/80 rounded-xl p-2.5 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-blue-500 text-white flex items-center justify-center shrink-0 text-xs">
                      <span className="tax-kpi-symbol" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">月税负率 (%)</div>
                      <div className="text-xs font-bold font-mono text-slate-900">2.10</div>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-[10px] text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-orange-500 rounded-xs" />
                    <span>营业收入 (万元)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>整体税负率 (%)</span>
                  </div>
                </div>

                <TaxTrendChart color="#ff8100" />
              </div>

              {/* Chart 2: 当月实缴税款情况 */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-800">当月实缴税款情况</h4>

                {/* 2 Mini KPI indicators */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-slate-50/80 rounded-xl p-2.5 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-amber-500 text-white flex items-center justify-center shrink-0 text-xs">
                      <span className="tax-kpi-symbol" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">当月营业收入 (万元)</div>
                      <div className="text-xs font-bold font-mono text-slate-900">12,345.67</div>
                    </div>
                  </div>

                  <div className="bg-slate-50/80 rounded-xl p-2.5 flex items-center gap-2">
                    <div className="w-6 h-6 rounded-md bg-cyan-500 text-white flex items-center justify-center shrink-0 text-xs">
                      <span className="tax-kpi-symbol" aria-hidden="true" />
                    </div>
                    <div>
                      <div className="text-[10px] text-slate-400">月税负率 (%)</div>
                      <div className="text-xs font-bold font-mono text-slate-900">2.10</div>
                    </div>
                  </div>
                </div>

                {/* Legend */}
                <div className="flex items-center gap-4 text-[10px] text-slate-400 pt-1">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 bg-cyan-500 rounded-xs" />
                    <span>营业收入 (万元)</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-blue-500" />
                    <span>整体税负率 (%)</span>
                  </div>
                </div>

                <TaxTrendChart color="#00cbd6" />
              </div>
            </div>
          </div>

          {/* 各省份年度累计实缴税金 (4 cols) */}
          <ProvinceTaxMap />

        </div>

        {/* Row 3: 项目投资 & 集团重大科技创新项目实施进度 (Image 15) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          
          {/* 项目投资 (8 cols) */}
          <div className="lg:col-span-8 bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 flex-wrap gap-3">
              <div className="flex items-center gap-2">
                <span className="w-1.5 h-4 bg-orange-500 rounded-full" />
                <h3 className="text-base font-bold text-slate-900">项目投资</h3>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <div className="relative">
                  <select className="appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-2 pr-6 py-1 text-xs text-slate-700 outline-hidden">
                    <option>项目类型</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
                </div>
                <div className="relative">
                  <select className="appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-2 pr-6 py-1 text-xs text-slate-700 outline-hidden">
                    <option>所属企业</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
                </div>
                <div className="relative">
                  <select className="appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-2 pr-6 py-1 text-xs text-slate-700 outline-hidden">
                    <option>投资阶段</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
                </div>
                <div className="relative">
                  <select className="appearance-none bg-slate-50 border border-slate-200 rounded-lg pl-2 pr-6 py-1 text-xs text-slate-700 outline-hidden">
                    <option>2026-09</option>
                  </select>
                  <ChevronDown className="w-3 h-3 text-slate-400 absolute right-1.5 top-2 pointer-events-none" />
                </div>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-700">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 font-medium">
                    <th className="py-2.5 px-3">项目名称</th>
                    <th className="py-2.5 px-3">所属企业</th>
                    <th className="py-2.5 px-3">项目阶段</th>
                    <th className="py-2.5 px-3">预计IRR</th>
                    <th className="py-2.5 px-3">预计投资回收期</th>
                    <th className="py-2.5 px-3">投资完成率</th>
                    <th className="py-2.5 px-3">投资利润率</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-50">
                  {projectInvestments.map((item, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-3 px-3 font-medium text-slate-800">{item.name}</td>
                      <td className="py-3 px-3 text-slate-600">{item.company}</td>
                      <td className="py-3 px-3">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${item.stage === '投后管理' ? 'project-managed' : 'project-investing'}`}>
                          {item.stage}
                        </span>
                      </td>
                      <td className="py-3 px-3 font-mono">{item.irr}</td>
                      <td className="py-3 px-3 font-mono">{item.payback}</td>
                      <td className="py-3 px-3">
                        <div className="flex items-center gap-2">
                          <div className="w-20 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-to-r from-orange-400 to-red-500 rounded-full"
                              style={{ width: `${item.progress}%` }}
                            />
                          </div>
                          <span className="font-mono text-[11px] text-red-500 font-medium">
                            {item.progress}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 px-3 font-mono">{item.profitRate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* 集团重大科技创新项目实施进度 (4 cols) */}
          <div className="tech-progress-card lg:col-span-4 bg-white rounded-3xl p-6 border border-slate-100 shadow-2xs space-y-4 flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-3 border-b border-slate-100 mb-2">
                <div className="flex items-center gap-2">
                  <span className="w-1.5 h-4 bg-orange-500 rounded-full" />
                  <h3 className="text-sm font-bold text-slate-900">集团重大科技创新项目实施进度</h3>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center gap-4 text-[10px] text-slate-400 pb-3">
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-blue-500" />
                  <span>预算研发经费投入 (万元)</span>
                </div>
                <div className="flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-orange-300" />
                  <span>实际研发经费投入 (万元)</span>
                </div>
              </div>

              {/* Horizontal Comparison Bars */}
              <div className="space-y-4 text-xs">
                {techProgress.map(item => <div key={item.name} className="tech-progress-row"><span title={item.name}>{item.name}</span><div>{[item.budget,item.actual].map((value,i)=><div className="tech-progress-bar" key={i}><i style={{width:`${value/8500*88}%`,background:i?'#ffcebb':'#ff5b36'}}/><small>{value.toLocaleString()}</small></div>)}</div></div>)}
              </div>
            </div>
          </div>

        </div>

      </div>
    </div>
  );
};
