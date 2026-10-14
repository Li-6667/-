export const upgradeChanges = [
  { title: '先统一视觉，再设计每个页面', before: '原版用柔和渐变、圆润卡片和色块表达穿搭方向。', after: '保留 Logo 和品牌色，引入蓝绿色舞台、原创双人漫画与同画风衣物。标题、按钮、间距和手机布局有了统一规则。', href: '/', oldHref: '/legacy', link: '对照首页' },
  { title: '把分散的页面连成操作流程', before: '部分按钮只展示固定结果，页面间的数据没有连起来。', after: '建档、六题测试、上传并确认分类、生成搭配、替换、收藏、安排日历，使用同一份本地数据。没有结果时会告诉你下一步。', href: '/profile', oldHref: '/legacy/profile', link: '从建档开始' },
  { title: '让保存有依据，让能力说实话', before: '档案保存在页面状态里；部分匹配率、分数和后台数字是固定示例。', after: '用 IndexedDB 保存本机资料，刷新后还能继续。推荐说明本地规则的依据；后台读取本机记录，存储不可用时明确提示。', href: '/admin', oldHref: '/legacy/admin', link: '查看本地数据' },
  { title: '把代码整理成能接着做的结构', before: '主要逻辑集中在各个页面里，使用 Next 14、React 18 和 Tailwind 3。', after: '升级到 Next 16、React 19、Tailwind 4；拆出页面组件、数据类型、推荐规则、图片处理和存储入口。修改一类逻辑时更容易找到位置。', href: '/stylist', oldHref: '/legacy/stylist', link: '体验搭配流程' },
  { title: '把验收和回退一起交付', before: '有页面和样式，还需要系统检查按钮承诺、刷新恢复与窄屏表现。', after: '运行数据逻辑测试、类型检查、lint 和构建，再进浏览器走主流程。原有 18 条业务地址保留，旧版另存完整快照，可逐页返回新版。', href: '/closet', oldHref: '/legacy/closet', link: '对照衣橱' },
];

export const skillWorkflow = [
  { name: 'design-taste-frontend V2', job: '确定视觉方向', outcome: '品牌色、排版、组件与响应式规范' },
  { name: 'frontend-patterns', job: '搭框架、接交互', outcome: '兼容升级与能走通的页面流程' },
  { name: 'codebase-design', job: '理清数据和职责', outcome: '类型、规则、存储与组件边界' },
  { name: 'imagegen', job: '制作统一素材', outcome: '原创人物、服饰插画与透明底素材' },
  { name: 'click-path-audit', job: '检查点击后的结果', outcome: '按钮文字与最终状态一致' },
  { name: 'browser-qa', job: '在浏览器里验收', outcome: '桌面、平板、手机与真实点击检查' },
];

export type GuideLesson = { id: string; title: string; instruction: string; deliverable: string; prompt: string };
export const guideLessons: GuideLesson[] = [
  {
    id: 'inspect', title: '先把项目跑起来',
    instruction: '在 Codex 中打开本地仓库，选中包含 package.json 的项目目录。先让它读项目，再给出第一项改动。',
    deliverable: '正确的工作目录、当前分支、已有改动、启动命令，以及一个能打开的本地地址。',
    prompt: '请先接手这个随意搭项目。读取 AGENTS.md、README.md、DESIGN.md 和 package.json，核对 Git 分支与未提交改动，说明目录结构与启动方法。安装必要依赖并启动本地页面。先不要重构，也不要覆盖现有改动。请把实际打开成功的本地地址给我。',
  },
  {
    id: 'scope', title: '把想法写成验收标准',
    instruction: '先说谁在什么场景下要完成什么。把“更好看、智能一点”换成可以看见和检查的结果。',
    deliverable: '一条用户流程、明确范围、分阶段计划，以及每阶段的完成条件。',
    prompt: '目标：让用户用衣橱里已有的衣服完成一次日常搭配。请先盘点现有路由与按钮，规划“建档 → 上传衣物 → 生成 → 替换 → 收藏 → 日历”的完整流程。保留 Logo、品牌色和原有地址；本轮只做本地 Demo。刷新后数据要保留；真实 AI、账号和云端同步不在本轮范围。给出按阶段实施的计划，每阶段写明要改什么、使用哪个已有 skill、怎样验收。',
  },
  {
    id: 'design', title: '先做一个关键页面',
    instruction: '把参考链接、截图和必须保留的品牌元素一起给它。先校准首页和一条关键流程，再铺到全站。',
    deliverable: 'DESIGN.md 中可复用的规范，以及手机和桌面都看得见的关键页。',
    prompt: '请先列出本项目当前可用的设计与前端 skills；如果存在 design-taste-frontend V2，就读取并使用它。根据我给的参考，保留现有 Logo 和品牌色，先设计首页与衣橱页。说明标题层级、间距、按钮、卡片、图片比例和手机布局，并更新 DESIGN.md。人物素材先给出静态稿，校准头身比、线条、衣褶和质感后再接入动效。不要声称使用了未安装的 skill。',
  },
  {
    id: 'build', title: '每次交付一个闭环',
    instruction: '从一次完整操作入手。界面、数据和异常状态一起做，后续页面就能复用同一套规则。',
    deliverable: '操作有结果、错误有提示、刷新能恢复的一条完整流程。',
    prompt: '现在实现“上传衣物 → 手动确认分类 → 保存到衣橱”这一条闭环。请把数据类型、图片处理和存储职责拆清楚。上传校验 JPG/PNG/WebP 与 10 MB 上限，在本机压缩并保存。补齐未选图、读取失败、存储不可用和空衣橱状态。实际上传一张示例图片，保存后刷新核对，再报告结果。暂时不要扩展别的功能。',
  },
  {
    id: 'verify', title: '让它亲自点一遍',
    instruction: '让 Codex 在能使用浏览器的环境里操作页面。运行日志和构建结果之外，也看实际画面。',
    deliverable: '复现路径、修复结果、关键画面，以及仍未验证的项目。',
    prompt: '请在实际浏览器里验收本次改动。用示例数据走完关键流程，并刷新确认数据仍在；检查 375、768、1440px 的布局、键盘焦点、标签与错误提示。重点核对每个按钮点击后的结果是否符合文字承诺。有问题就修复，再复查相关路径；没有浏览器能力的项目请明确列为未验证。保留关键页面截图或实际检查记录。',
  },
  {
    id: 'review', title: '检查改动，再留回退点',
    instruction: '看清哪些文件变了、哪里还有限制。复杂改动分阶段提交，让下一次继续开发有稳定起点。',
    deliverable: '相关测试和构建结果、清晰的改动摘要，以及本地 Git 提交。',
    prompt: '请复核本次 diff，检查误改范围、数据丢失、重复保存和无效按钮等问题。运行适合这次改动的测试，以及 npm run typecheck、npm run lint、npm run build。更新 README 的启动、验证与功能边界说明。通过后创建一个范围清楚的本地提交，给出提交号与剩余问题；本轮不要推送远程。',
  },
  {
    id: 'ship', title: '明确交付到哪里',
    instruction: '本地提交、GitHub 推送、网站部署分别说明。发布时同时检查旧版入口和对比链接。',
    deliverable: '远程分支与提交号；如包含部署，还要有可打开的部署地址和线上检查结果。',
    prompt: '请把已经验收的改动推送到 origin/main。推送前先 fetch，核对远程是否有新的提交，并保留其他人的工作；不要强制覆盖。保留 /legacy 的旧版快照和新旧版互跳入口。推送后核对远程 main 的提交号与本地一致，说明是否触发了已有自动部署。此指令只授权推送；如需另外部署，请先说明目标环境。',
  },
];

export const agentsExample = `# 随意搭项目约定

## 产品目标
帮助用户用已有衣物完成日常搭配。

## 工作方式
- 先读 README.md、DESIGN.md，并核对 Git 状态。
- 保留其他人的改动，按功能小步修改。
- 需要 skill 时先确认已安装，再读取使用。
- 保留 Logo、品牌色、原有 URL 和旧版入口。

## 完成标准
- 关键操作能实际走通，刷新后数据保留。
- 空状态、错误状态和不可用能力如实说明。
- 运行相关测试、typecheck、lint 和 build。
- 用浏览器查看桌面与手机效果，列出未验证项。
- 交付改动摘要、验证结果和本地提交号。
- 推送与部署按照本次任务的明确范围执行。`;
