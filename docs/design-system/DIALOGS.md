# 系统弹窗标准 v2.0.0

最新依据：用户提供的新建会议弹窗（2026-11-06），标题栏与底部操作区为统一模板；主按钮由渐变改为纯红。此规则优先于 v1.x 弹窗各自的标题、边距和渐变约定，页面上的操作按钮与插画/图标内容色不在本次改变范围。

## 结构与尺寸

- 白底、16px 圆角，遮罩 `--gx-dialog-backdrop` 黑色约 53% 不模糊，阴影 `--gx-shadow-dialog`。
- 标题栏最小高 64px，左右 30px、上下 20px；业务表单、搜索、详情、列表弹窗标题统一18/28、字重600，关闭按钮24×24。Popover、Popconfirm、Alert、Message、Notification及规范Dialog / MessageBox保留各自原字号。无额外标题分隔线。长标题换行增高，不与关闭按钮重叠。
- 正文 `8px 30px 16px`，独立滚动；标题与操作区保持可见。常规正文14/22，字段高32px。资讯长文阅读仍16/30，左右内边距统一30px、底部30px留白，窄屏也保留此间距；附件属于阅读正文末尾，标题、元信息、正文、图片及附件左边缘对齐。
- 操作区 `20px 30px 24px`，主/次按钮整体居中，间距40px；按钮高36px、最小宽78px、圆角8px。取消白底细边框，主操作纯红底白字。没有确认操作的搜索/阅读弹窗不人为新增确认按钮。
- 弹窗宽度按任务保留：确认440、智能体创建448、搜索560、日程710、应用/历史800、订阅840、文章900等。桌面距视口上下至少20px、左右至少16px；600px以下左右内边距20px、视口至少12px、操作按钮间距20px。
- 订阅“恢复默认”属于辅助操作，桌面靠左，取消/保存居中；窄屏恢复默认单独一行，防止遮挡。

## 按钮状态

`--gx-dialog-primary: #FF0000`；hover使用`--gx-hover-text`，active使用`--gx-focus`，三种状态均白字、没有背景图或渐变。禁用透明度.45、不触发；加载沿用Button的真实保存状态。输入错误与焦点沿用既有语义token。

## 接入

`UI.tsx` 的 `ModalSurface({label,className,onClose,children})` 提供原生模态、Escape、遮罩关闭、关闭回焦及Tab首尾循环。已具备保存阻塞/多层关闭等业务行为的原生dialog保留自身控制逻辑，共用样式槽：

```tsx
<ModalSurface label="创建" className="business-dialog" onClose={close}>
  <header className="gx-dialog-header"><h2>创建</h2><button aria-label="关闭" onClick={close}>…</button></header>
  <form className="gx-dialog-form" onSubmit={submit}>
    <div className="gx-dialog-body">…</div>
    <footer className="gx-dialog-footer"><Button onClick={close}>取消</Button><Button variant="primary" type="submit">确定</Button></footer>
  </form>
</ModalSurface>
```

旧原生按钮通过`gx-dialog-primary`指定主操作；不用宽泛的`button:last-child`选择器猜测主按钮。共享规则只影响带`gx-dialog`的显式接入组件。菜单、日期/人员选择浮层和侧边抽屉维持自身交互布局。

## 已覆盖的生产组件

ScheduleDialog / ScheduleModule、NewsSubscriptionDialog、ApplicationManager、DailyBrief、CloudDriveView、AgentsAndSkillsView、PortalNewsView、HistoryModal、SearchModal、AgentComposerTools、IMChatView，及 DesignSpec 确认示例。应用网格、历史搜索条和阅读区保留内容适配，标题栏和操作区同标准。

## 验收

运行类型检查、check:design、build、check:ui、check:schedule、check:news-subscription；弹窗专项检查记录标题18/28、标题区最小64px、按钮36px、纯红/白字/无渐变、底部居中、溢出、关闭/取消及小屏固定区域。正文滚动不能让保存操作离开视口。当前仅本地更新，不自动发布。

应用管理内容层级：弹窗大标题统一18/28；“我的应用/我的系统”和目录分组标题为14/22。管理入口采用与知识库管理相同的次按钮样式，带14px设置图标、32px高、左右10px内边距，宽度自适应。
