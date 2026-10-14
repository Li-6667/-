import Image from 'next/image';
import Link from 'next/link';
import { ArrowUpRight, CheckCircle, ArrowRight } from '@phosphor-icons/react/dist/ssr';
import { CodexLessons, LiveComparison, PromptCopy } from '@/components/upgrade/GuideInteractions';
import { agentsExample, skillWorkflow, upgradeChanges } from '@/lib/upgrade-guide';
import styles from './upgrade.module.css';

export const metadata = {
  title: '这次升级，也把方法留给你 · 随意搭',
  description: '随意搭的升级说明、产品开发思路与可直接练习的 Codex 流程。从设计、数据和交互，到验收与交接。',
};

const chapters = [['changes', '这次怎么升级'], ['product', '产品应该怎么做'], ['codex', '跟着 Codex 做'], ['handoff', '继续接手项目']] as const;
const productStages = [
  { title: '可操作的 Demo', status: '当前版本', description: '用本地数据把关键流程走通，先确认操作和反馈是否清楚。', acceptance: '上传、生成、替换、收藏都有效；刷新后能接着用。' },
  { title: '小范围真实使用', status: '建议下一步', description: '请目标用户用自己的衣物完成搭配，观察她们在哪一步停下、为什么回来。', acceptance: '记录完成一次搭配的障碍，以及愿意再次使用的理由。' },
  { title: '验证真实 AI', status: '后续建设', description: '分别验证分类、推荐和图像生成。先定义好结果，再比较效果、成本和等待时间。', acceptance: '使用真实样例评估；失败时能改分类、换单品或退回手动操作。' },
  { title: '准备公开上线', status: '后续建设', description: '根据使用需求补账号、云端存储、权限、备份、隐私说明与故障排查。', acceptance: '部署后重新验收；能监控异常，也有明确的回退办法。' },
];

export default function UpgradePage() {
  return <div className={styles.guide}>
    <section className={`shell ${styles.hero}`} aria-labelledby="guide-title">
      <div className={styles.heroCopy}>
        <p className={styles.kicker}>写给随意搭的创作者</p>
        <h1 id="guide-title">这次升级，<br /><span>也把方法留给你。</span></h1>
        <p className={styles.heroDescription}>从设计、数据到交互，把这次怎么做、接下来怎么做，一起讲清楚。</p>
        <div className={styles.heroActions}><a className="btn btn-dark" href="#changes">看看改了什么 <ArrowRight size={18} /></a><a className="text-link" href="#codex">跟着 Codex 做 ↗</a></div>
      </div>
      <div className={styles.heroArt}><Image src="/demo/girls-retro-v2.png" alt="随意搭的两位原创复古漫画女孩" fill priority sizes="(max-width: 767px) 92vw, 42vw" /></div>
    </section>

    <div className={`shell ${styles.facts}`} aria-label="本次升级保留与完成内容">
      <div><strong>18</strong><span>原有业务页面地址保留</span></div><div><strong>可继续</strong><span>本地资料刷新后仍在</span></div><div><strong>可对照</strong><span>完整旧版也留在网站里</span></div>
    </div>

    <div className={`shell ${styles.readingLayout}`}>
      <aside className={styles.chapterRail}><nav aria-label="说明页目录"><span>阅读路线</span>{chapters.map(([id, title]) => <a href={`#${id}`} key={id}>{title}<ArrowUpRight size={14} /></a>)}</nav></aside>
      <div className={styles.article}>
        <section id="changes" className={styles.section} aria-labelledby="changes-title">
          <div className={styles.sectionHeading}><h2 id="changes-title">你的想法还在。<br />这次，把它接得更完整。</h2><p>原版已经把“日常穿搭助手”的方向表达出来了。我用 Codex 把设计、代码和数据逐层整理，让一套搭配能从输入走到保存，也给下一轮开发留出清楚的位置。</p></div>
          <LiveComparison />
          <div className={styles.changeList}>{upgradeChanges.map(item => <article className={styles.changeRow} key={item.title}>
            <h3>{item.title}</h3><div className={styles.changeColumns}><div><span>改版前</span><p>{item.before}</p><a href={item.oldHref} target="_blank" rel="noreferrer">查看旧页 ↗</a></div><div><span>升级后</span><p>{item.after}</p><Link href={item.href}>{item.link} ↗</Link></div></div>
          </article>)}</div>
        </section>

        <section className={styles.section} aria-labelledby="skills-title">
          <div className={styles.sectionHeading}><h2 id="skills-title">我怎样让 Codex<br />把这件事做完。</h2><p>先盘点，再定视觉和数据契约；接着实现流程，最后回到浏览器检查。每种 skill 负责一个具体问题，交付到下一环时都有可核对的结果。</p></div>
          <div className={styles.skillGrid}>{skillWorkflow.map((skill, index) => <article key={skill.name}><span className={styles.skillIndex}>{String(index + 1).padStart(2, '0')}</span><h3>{skill.job}</h3><code>{skill.name}</code><p>{skill.outcome}</p></article>)}</div>
          <p className={styles.footnote}>这些 skills 是本次开发者本机已安装的工作方法，克隆仓库不会自动安装。你可以先让 Codex 列出可用技能；缺少时，把同样的要求写进任务和验收标准。</p>
          <details className={styles.disclosure}><summary>Codex、skill、MCP，分别负责什么？</summary><div className={styles.glossary}><p><strong>Codex</strong>读取项目、修改代码、运行检查，并根据反馈继续处理任务。</p><p><strong>Skill</strong>是一份可复用的工作说明，指导某类任务怎样完成；它本身不等于一个已经接好的产品功能。</p><p><strong>MCP / 连接器</strong>让工具获得外部信息或执行操作。需要 GitHub、设计文件等外部上下文时，再连接对应能力。</p></div></details>
        </section>

        <section id="product" className={styles.section} aria-labelledby="product-title">
          <div className={styles.sectionHeading}><h2 id="product-title">网站让人看懂。<br />产品让人愿意再用。</h2><p>做下一版之前，先回答一个问题：用户早上出门前，能不能用已有衣服，轻松选出一套自己愿意穿的搭配？</p></div>
          <div className={styles.productBrief}>
            <div><span>先服务一个具体场景</span><h3>出门前，<br />少纠结一会儿。</h3><p>从常穿的几件衣服开始。让用户能自己上传、调整和复用，再观察她是否真的需要更多功能。</p></div>
            <div className={styles.productLoop}><span>先做完整这一圈</span><ol>{['录入自己的衣物', '得到有依据的搭配', '换掉不喜欢的单品', '保存，下一次继续用'].map(item => <li key={item}><CheckCircle size={19} weight="duotone" />{item}</li>)}</ol><p>每一步都要回答：输入是什么？数据放哪里？失败怎么处理？用户怎样继续？</p></div>
          </div>
          <div className={styles.productRoadmap}>{productStages.map((stage, index) => <article key={stage.title}><div className={styles.roadmapMarker}>{index + 1}</div><div><span className={index === 0 ? styles.currentStage : styles.futureStage}>{stage.status}</span><h3>{stage.title}</h3><p>{stage.description}</p><div className={styles.stageAcceptance}><strong>这一阶段看什么</strong><p>{stage.acceptance}</p></div></div></article>)}</div>
          <div className={styles.boundary}><Image src="/demo/garment-jacket-v2.png" alt="与人物画风统一的淡紫外套插画" width={130} height={150} sizes="130px" /><div><h3>当前版本适合验证流程。</h3><p>搭配由本地规则产生，照片与资料保存在当前浏览器。“搭配预览”用于并排对照，真实 AI、账号和云端同步留给后续验证。先把这一版用明白，再决定下一步投入。</p></div></div>
        </section>

        <section id="codex" className={styles.section} aria-labelledby="codex-title">
          <div className={styles.sectionHeading}><p className={styles.kicker}>可以直接练习的 Codex 流程</p><h2 id="codex-title">你来决定要做什么。<br />让 Codex 把结果做给你看。</h2><p>打开本地仓库，从下面第一项开始。每次选一个明确目标，把指令复制进 Codex，然后核对这一轮应该交付的结果。示例中的项目名、路径和参考素材可按实际情况替换。</p></div>
          <details className={`${styles.disclosure} ${styles.startHere}`}><summary>第一次用 Codex？先完成这四件事</summary><div className={styles.glossary}><p><strong>安装并登录</strong>按官方入门流程安装适合自己系统的桌面应用，登录自己的账号，选择 Codex 开发模式。不同版本的入口名称可能有变化，以应用和官方说明为准。</p><p><strong>把仓库放到本机</strong>使用自己的 GitHub 账号访问项目，克隆仓库到本地目录。如果不熟悉 Git，可先在 Codex 中打开一个新的空文件夹，请它把这个仓库克隆到该目录。</p><p><strong>选对项目文件夹</strong>本仓库的网站代码在“随意搭”子目录。打开包含 package.json、app 和 README.md 的这个文件夹，让 Codex 获得相应的项目上下文。</p><p><strong>发送第一条指令</strong>复制下面“先把项目跑起来”的指令。让它检查环境并启动项目，再打开它实际验证过的本地地址；如果失败，保留报错原文继续排查。</p></div></details>
          <CodexLessons />
          <div className={styles.promptRecipe}><h3>一段好用的任务，讲清四件事。</h3><dl><div><dt>目标</dt><dd>用户要完成哪件事</dd></div><div><dt>上下文</dt><dd>项目、页面、文件与参考</dd></div><div><dt>约束</dt><dd>保留什么，做到什么范围</dd></div><div><dt>完成条件</dt><dd>怎样操作才算通过</dd></div></dl><p>例如：“让衣物上传后刷新仍能找到”，比“把衣橱做得智能一点”更容易做对、也更容易验收。</p></div>
          <details className={styles.disclosure}><summary>把常用约定写进 AGENTS.md</summary><div className={styles.agentsContent}><p>AGENTS.md 用来保存项目工作约定。下面是本项目可采用的示例，请合并到已有文件，保留原来的有效规则。</p><pre>{agentsExample}</pre><PromptCopy text={agentsExample} label="复制约定示例" /></div></details>
          <p className={styles.sourceNote}>Codex 的项目上下文、任务结构与 AGENTS.md 用法已对照 <a href="https://learn.chatgpt.com/guides/best-practices" target="_blank" rel="noreferrer">OpenAI 官方最佳实践 ↗</a> 和 <a href="https://learn.chatgpt.com/docs/agent-configuration/agents-md" target="_blank" rel="noreferrer">AGENTS.md 指南 ↗</a>。初次安装和登录可看 <a href="https://learn.chatgpt.com/docs/quickstart" target="_blank" rel="noreferrer">官方入门流程 ↗</a>。本页指令是针对随意搭整理的实战示例。</p>
        </section>

        <section id="handoff" className={`${styles.section} ${styles.handoff}`} aria-labelledby="handoff-title">
          <div className={styles.sectionHeading}><h2 id="handoff-title">下一次打开项目，<br />从这里接着做。</h2><p>先读说明、跑本地、选一个功能。把每次做过什么、验证到哪里留在项目里，下一次就能从可靠的起点继续。</p></div>
          <div className={styles.handoffGrid}><div><h3>先认这几个位置</h3><dl><div><dt>README.md</dt><dd>启动、检查命令与能力边界</dd></div><div><dt>DESIGN.md</dt><dd>品牌色、排版、素材和界面规范</dd></div><div><dt>lib/</dt><dd>数据类型、本地规则、存储和图片处理</dd></div><div><dt>components/pages/</dt><dd>各条业务流程的页面组件</dd></div><div><dt>public/legacy/</dt><dd>完整旧版快照，用于对照</dd></div></dl></div><div><h3>做完，再核对这几件事</h3><ul>{['从用户入口能走到结果。', '刷新、空数据和错误输入有明确反馈。', '手机上看得清，键盘也能操作。', '相关检查通过，实际页面也看过。', '交接时说清提交号、数据范围与剩余问题。'].map(item => <li key={item}><CheckCircle size={17} />{item}</li>)}</ul></div></div>
          <div className={styles.evidence}><strong>本次升级的代码记录</strong><a href="https://github.com/Li-6667/-/commit/bfbed58" target="_blank" rel="noreferrer">全站重构 bfbed58 ↗</a><a href="https://github.com/Li-6667/-/commit/5bcc73b" target="_blank" rel="noreferrer">旧版对比 5bcc73b ↗</a><p>2026-10-14 的升级检查包括：7 项数据逻辑测试、类型检查、lint、构建，以及新旧共 36 条页面的可达性检查；主流程另做了浏览器操作与刷新恢复核对。正式上线时仍需按部署环境重新验收。</p></div>
          <div className={styles.closing}><p>你已经有了一个值得继续做的起点。</p><h3>接下来，把一个真实需求做扎实。</h3><Link className="btn btn-dark" href="/profile">体验完整流程 <ArrowRight size={18} /></Link><a className="text-link" href="https://github.com/Li-6667/-" target="_blank" rel="noreferrer">打开项目仓库 ↗</a></div>
        </section>
      </div>
    </div>
  </div>;
}
