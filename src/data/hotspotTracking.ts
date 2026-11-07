export type HotspotCategory = 'fact' | 'media' | 'analysis';
export type HotspotSource = {id:string;title:string;type:string;excerpt:string};
export type HotspotEvent = {id:string;topicId:string;title:string;publishedAt:string;category:HotspotCategory;major:boolean;summary:string;detail:string;nextCheck:string;sources:HotspotSource[]};
export const HOTSPOT_CATEGORIES = [{id:'all',label:'全部'},{id:'fact',label:'已确认事实'},{id:'media',label:'媒体观点'},{id:'analysis',label:'AI分析'}] as const;
export const HOTSPOT_TOPICS = [
  {id:'ai',label:'人工智能',change:'从能力发布转向业务验证'},
  {id:'compute',label:'国产算力',change:'新增适配与测试进展'},
  {id:'policy',label:'某项政策',change:'明确申报对象和实施安排'},
  {id:'competitor',label:'某家竞争对手',change:'新增明确实施范围'},
] as const;
type EventInput = [string,string,HotspotCategory,boolean,string,string,string,string,string];
function events(topicId:string,publishedAt:string,rows:EventInput[]):HotspotEvent[]{
  return rows.map(([id,title,category,major,summary,detail,nextCheck,sourceA,sourceB])=>({id,topicId,title,publishedAt,category,major,summary,detail,nextCheck,sources:[
    {id:id+'-original',title:sourceA,type:'本地演示材料',excerpt:detail},
    {id:id+'-coverage',title:sourceB,type:'本地演示材料',excerpt:summary},
  ]}));
}
// Prepared local demonstration records. No live crawling, company intelligence or AI inference service is implied.
export const HOTSPOT_EVENTS:HotspotEvent[]=[
  ...events('competitor','2026-10-16 10:28',[
    ['competitor-progress','产品进展更新','fact',true,'演示新增的原始材料补充了实施范围，相关转载合并为同一条进展。与上一节点相比，明确了范围变化；仍需持续跟踪后续结果。','本地示例材料明确了试点涉及的业务范围和阶段安排。两个材料记录归入同一事件节点；该节点仅记录材料出现的内容，不据此推断实际经营成效。','核验实际实施范围、启动时间和阶段结果。','产品进展说明（演示）','相关进展报道（演示）'],
    ['competitor-analysis','媒体跟进解读','analysis',true,'综合前两个节点，关注点已从“是否启动”转向“具体如何实施”。下一步建议核验实际落地范围、进度和约束条件。','这是针对本地演示材料整理的分析示例。现有节点说明安排更具体，但尚不足以判断落地效果；媒体解读与已确认事实分别归类。','持续核验实际落地范围、进度与约束条件。','阶段信息整理（演示）','媒体解读摘要（演示）'],
    ['competitor-announcement','企业发布公告','media',false,'示例原始公告公布了项目或文件的正式安排；两篇材料指向同一项安排，已合并为一个事件节点。具体效果尚无可核验材料。','演示报道围绕同一份安排展开。报道的评价属于媒体观点，具体结果仍需原始材料补充，不将转载次数视为多个独立事实。','等待补充可核验的执行与结果材料。','公告报道摘录（演示）','公告背景说明（演示）'],
  ]),
  ...events('ai','2026-11-06 15:20',[
    ['ai-pilot','业务试点进入验证阶段','fact',true,'示例材料补充了知识检索与办公辅助两个试点范围，关注点从模型能力转向业务使用效果。','本地演示记录列出试点范围及验证安排；未包含实际生产运行指标，不能据此判断整体投入产出。','核对覆盖范围、准确率及人工复核结果。','业务试点说明（演示）','验证计划摘要（演示）'],
    ['ai-comment','行业关注业务落地路径','media',false,'媒体解读聚焦数据准备、流程接入与人员培训，建议区分模型能力和具体场景的使用效果。','本地媒体观点示例讨论落地条件，不作为已确认的业务成效。不同材料中重复引用的观点归入同一节点。','跟踪独立验证材料及实际反馈。','行业观察摘录（演示）','应用讨论摘要（演示）'],
    ['ai-analysis','后续关注评估口径与复核机制','analysis',false,'分析示例建议先统一评估口径，再对准确性、响应时间与使用成本进行持续观察。','依据上述演示节点，下一阶段可补充统一基线、失败样例及人工复核记录。本条是分析建议，不是新的事实。','收集统一基线与可复核的失败样例。','节点对照摘要（演示）','评估建议说明（演示）'],
  ]),
  ...events('compute','2026-11-05 11:00',[
    ['compute-adaptation','新增适配验证进展','fact',true,'示例进展补充了应用适配与测试范围，后续需关注实际工作负载下的稳定性。','本地材料给出适配项目和测试安排，暂无完整生产负载表现及长期运行记录。','核验测试环境、工作负载和结果口径。','适配进展说明（演示）','测试范围摘要（演示）'],
    ['compute-media','生态适配成为讨论重点','media',false,'相关观点集中在应用迁移、工具链兼容与运维能力，尚不能替代具体测试结果。','本地媒体观点示例反映对兼容与迁移成本的关注；不同工作负载应分别比较。','跟踪可复现的适配测试报告。','生态观察摘录（演示）','应用迁移讨论（演示）'],
    ['compute-analysis','建议统一性能与成本比较条件','analysis',false,'分析示例建议统一工作负载和测试配置，避免用单项峰值推断完整业务表现。','比较测试应保留硬件、软件版本、并发与精度设置，同时记录稳定性和运维成本。','补充相同条件下的测试与成本记录。','测试条件对照（演示）','分析建议摘要（演示）'],
  ]),
  ...events('policy','2026-11-04 09:30',[
    ['policy-scope','实施范围与对象进一步明确','fact',true,'示例文件补充了适用对象及实施安排，需要结合具体申报条件逐项核对。','本地政策演示材料列出对象、范围和阶段安排，仅用于展示事件演化界面，不构成实际政策或申报依据。','核对正式文件、有效期与适用对象。','实施安排摘录（演示）','适用对象摘要（演示）'],
    ['policy-comment','解读关注申报条件与执行口径','media',false,'媒体观点提醒关注材料要求、时间窗口及地区执行差异，仍应以正式文件为准。','演示观点聚焦执行条件，不能代替主管部门文件及具体解释。','跟踪正式指南与后续口径说明。','文件解读摘要（演示）','执行讨论摘录（演示）'],
    ['policy-analysis','建议建立条件与材料对照清单','analysis',false,'分析示例建议按对象、条件、材料和时间窗口整理清单，保留待核验项。','依据演示节点，将已知信息与缺失信息分开记录，有助于后续核验；本条不判断任何企业的申报资格。','补充待核验条件及权威出处。','条件对照清单（演示）','材料核验建议（演示）'],
  ]),
];
export function readHotspotFollows():string[]{
  try{const value:unknown=JSON.parse(localStorage.getItem('guangxin-hotspot-follows')||'[]');return Array.isArray(value)?HOTSPOT_TOPICS.filter(topic=>value.includes(topic.id)).map(topic=>topic.id):[];}catch{return [];}
}
