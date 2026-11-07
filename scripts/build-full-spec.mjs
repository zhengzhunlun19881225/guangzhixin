import fs from 'node:fs';
import path from 'node:path';

/** The full download has exactly three modules, sharing sources with the online examples. */
export function buildFullSpec(root, reference, stages) {
  const read = file => fs.readFileSync(path.join(root, file), 'utf8');
  const foundation = JSON.parse(read('src/design/foundationReference.json'));
  const hover = JSON.parse(read('src/design/hoverReference.json'));
  const tokens = new Map([...read('src/design/tokens.css').matchAll(/(--gx-[\w-]+)\s*:\s*([^;]+);/g)].map(match => [match[1], match[2].trim()]));
  const version = read('src/design/catalog.ts').match(/specVersion = '([^']+)'/)[1];
  const token = name => {
    const value = tokens.get(`--gx-${name}`);
    if (!value) throw new Error(`Foundation refers to missing token: ${name}`);
    return value;
  };
  const table = (columns, rows) => `| ${columns.join(' | ')} |\n| ${columns.map(() => '---').join(' | ')} |\n${rows.map(row => `| ${row.join(' | ')} |`).join('\n')}\n`;
  let text = `# 广智新完整设计规范 v${version}\n\n版本日期：2026-11-07。本文仅包含基础样式、组件规范全览、状态与交互三个模块；组件共6类、59项。\n\n在线入口：\`?view=design-system\`。参数取自当前系统，组件说明与在线预览共用数据源。\n\n## 01 基础样式\n\n`;
  for (const group of foundation.paletteGroups) {
    text += `### ${group.title}\n\n`;
    text += table(['名称', '变量', '当前值', '用途'], group.colors.map(([label, name, usage]) => [label, `\`--gx-${name}\``, `\`${token(name)}\``, usage])) + '\n';
  }
  text += '### 文字层级\n\n';
  text += table(['层级', '字号 / 行高', '用途'], foundation.typography.map(([label, size, line, usage]) => [label, `${token(`font-${size}`)} / ${token(`line-${line}`)}`, usage]));
  text += '\n默认字体：' + token('font-family') + '。\n\n';
  text += '### 间距、圆角与控件\n\n';
  text += table(['维度', '当前规则'], [
    ['间距', foundation.spacing.map(n => token(`space-${n}`)).join('、') + '；局部4/8、组件12/16、面板20、大区块24/32。'],
    ['圆角', foundation.radii.map(name => `${token(`radius-${name}`)}（${{small:'菜单项',control:'控件',feedback:'反馈浮层',card:'面板',pill:'胶囊'}[name]}）`).join('；') + '。'],
    ['按钮', '默认32px高、14px字；小号26px高、12px字。页面主操作渐变白字、主题红solid白字均无描边；弹窗主操作纯红白字；普通图标16px、小号14px。'],
    ['标签', '4px圆角、12/18、600字重，上下2px、左右6px。'],
    ['表格与分页', `数据表头${token('table-header-bg')}；日历网格除外。分页每页条数选择框与下拉菜单90px；表格搜索和文件类型最大250px并按原业务自适应。`],
    ['滚动条', `默认滑块${token('scrollbar-thumb')}，保留原hover/focus加深；原有隐藏滚动条保持隐藏。`],
    ['单选和复选', '带边框选项选中外边框为主题色50%透明度，文字与内部指示器保持实色；禁用灰色。复选指示器14px、4px圆角、勾形10px，半选横线8×2px。'],
    ['业务弹窗', '表单、搜索、详情、列表标题18/28、600字重；标题区上下20px、左右30px，最小高64px。页脚按钮36px高、最小宽78px、横距40px。'],
    ['反馈浮层', 'Popover、Popconfirm、Alert、Message、Notification、规范Dialog/MessageBox圆角12px；保留原标题字号。普通下拉、Tooltip和Drawer按各自规则。'],
    ['资讯', '卡片与列表标题16/24、400字重，摘要12/22；卡片宽240px、横距24px，悬浮无阴影。文章左右和底部30px；更多列表最大1080px，分页与内容等宽居中。'],
    ['订阅', '选项横纵间距12px；手动/AI切换260×32px灰底分段，选中白底、主文字色600字重，保留AI图标；底部名称“保存”。'],
    ['日期时间示例', '日期与时间框均300×32px，窄容器自适应；双月日历不显示滚动条，短视口内容仍可访问。时间为15分钟步长下拉列表，带时钟与清空；业务原日期字段按各自契约。'],
  ]);
  text += '\n### 当前语义参数表\n\n' + table(['变量', '当前值'], [...tokens].map(([name, value]) => [`\`${name}\``, `\`${value}\``]));
  text += '\n## 02 组件规范全览\n\n六类59项，按用途、视觉、状态、键盘、边界与接入约定记录。入口：`?view=design-system#library`；单项：`?view=design-system&component=button#library`。各项连续展示、独立重置，支持分类和名称检索。\n\n### 使用与落地状态\n\n';
  for (const [stage, label] of Object.entries(stages)) text += `- **${stage}**：${label}。\n`;
  text += '\n公共组件按既有API接入；业务实现不等于独立公共API；规范示例用于确认外观及交互。预览只修改示例状态，真实后端和异步错误按业务契约接入。\n';
  for (const [index, group] of reference.groups.entries()) {
    text += `\n### 2.${index + 1} ${group.name}\n`;
    for (const entry of reference.entries.filter(item => item.group === group.id)) {
      text += `\n#### ${entry.name}\n\n**落地状态**：${stages[entry.stage]}。\n\n**代码依据**：${entry.source === '—' ? '无生产公共组件；见规范示例。' : `\`src/${entry.source}\`。`}\n\n`;
      for (const [key, label] of [['usage','用途与选择'],['visual','结构与视觉'],['behavior','状态与交互'],['keyboard','键盘与焦点'],['boundaries','边界与恢复'],['contract','接入约定']]) text += `- **${label}**：${entry[key]}\n`;
      if (entry.designSource) text += `\n${entry.referenceUrl ? `[${entry.designSource}](${entry.referenceUrl})` : entry.designSource}\n`;
      text += `\n**示例入口**：\`?view=design-system&component=${entry.id}#library\`。\n`;
    }
  }
  text += '\n## 03 状态与交互\n\n入口：`?view=design-system#interaction`。禁用阻止动作，加载防止重复提交，错误保留输入；选中不被悬浮覆盖。状态同时有文字或可访问语义，不单靠颜色表达。\n\n### 通用状态\n\n';
  text += table(['状态', '标准', '边界与例外'], foundation.interactions);
  text += '\n### 组件状态矩阵\n\n' + table(['组件类型', '适用状态', '边界'], [
    ['动作/导航', '默认、hover、active、focus、disabled；异步loading/error；导航current', 'Link不模拟按钮加载，静态页头不承载点击。'],
    ['字段/表单', '默认、hover、focus、filled、readonly、disabled、error；异步选项loading/empty', '只读允许复制，禁用不可编辑；错误保留输入并关联字段。'],
    ['选择控件', '未选/已选、focus、disabled；Checkbox半选；Select打开/空态/错误', 'Radio无半选；Switch即时保存失败时回滚。'],
    ['数据组件', '正常、loading、empty、error；适用时选中/展开/排序/焦点', '静态Descriptions/Statistic不强加悬浮或选中。'],
    ['浮层/反馈', '打开/关闭、触发/回焦；取消/确认/处理中/失败', 'Tooltip无交互内容；Alert不抢焦点；Message不承载必须完成的任务。'],
    ['静态基础/容器', '正常、长内容、窄容器、资源缺失', 'Typography/Divider/Space/Grid无自身禁用/加载/选中。'],
  ]);
  text += '\n### Hover与点击反馈\n\n' + table(['对象', '默认', 'Hover / 点击反馈'], hover);
  text += '\n### 键盘、浮层与恢复\n\n- 按钮与链接可由键盘访问并提供2px主题焦点外轮廓；输入及日期字段仅单层焦点边框。\n- 下拉支持方向键、Home/End、Enter、Escape和Tab，靠近视口边缘时避让；菜单禁用项和隐藏项不参与键盘导航。\n- 弹窗约束焦点，Escape按层关闭，关闭后返回触发按钮；取消不提交草稿。分页Enter跳页，非法页码显示恢复提示。\n- 单选组保持互斥，多选可独立切换并联动全选/半选；边框型选中外边框保持主题色50%，内部图形及禁用状态独立。\n- 触屏不依赖hover访问操作；遵循减少动态效果偏好，关闭非必要卡片位移和平滑动画。\n';
  const headings = [...text.matchAll(/^## (.+)$/gm)].map(match => match[1]);
  if (headings.join('|') !== '01 基础样式|02 组件规范全览|03 状态与交互' || [...text.matchAll(/^#### /gm)].length !== 59) throw new Error('Full specification must contain exactly three modules and 59 component entries.');
  return text;
}
