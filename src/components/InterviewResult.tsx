import {
  Alert, Button, Card, Collapse, Descriptions, Divider, Progress, Space, Tag, message,
} from 'antd';
import {
  CheckCircleFilled, DownloadOutlined, PlayCircleOutlined, ReloadOutlined,
  ExportOutlined, SafetyCertificateOutlined, StarOutlined, UserOutlined,
} from '@ant-design/icons';
import type { Interview } from '../services/mock';

const dimensions = [
  { name:'专业技能', score:84 },
  { name:'工作经验', score:80 },
  { name:'沟通表达', score:85 },
  { name:'问题解决', score:80 },
  { name:'岗位匹配', score:86 },
  { name:'行为表现', score:90 },
];

const baseTags = [
  '人员管理及培训体系搭建', '客户对接', '文本标注', '语音标注', '图片审核',
  '参与质检', '参与培训', 'Excel 公式校验', '西安玉祥门可到岗',
  '接受项目制工时及工作地点', '薪资文本待澄清',
];

const behaviorTags = [
  '先比较新旧规则变化与关联再应用', '冲突场景先向客户或上级确认',
  '边缘场景暂停并反馈', '按月回溯统一标准复核', '每日班前会及错误宣贯',
  '规则预学习与日度复盘', '质检问题书面沉淀', '讲解后班前小测',
];

const questions = [
  {
    type:'AI追问', level:'基础', question:'您好张兰兰，我是本次面试官嘉欣。麻烦您先做一下自我介绍吧。',
    answer:'期间的话，主要负责的是跟甲方的对接，以及人员管理，或者人员培训体系的搭建。好，就这些。',
  },
  {
    type:'AI追问', level:'进阶', question:'请你总结一下过往参加过的标注任务类型，以及你是否参与过质检、培训等工作。',
    answer:'以往的标注任务类型有文本类标注、语音类标注以及图片审核类标注。做过质检和培训等工作。',
  },
  {
    type:'题库', level:'进阶', question:'如果标注规则临时进行了大范围更新，要求你在1天内熟悉新规则并切换到新标准完成标注，你会怎么快速学习适应，避免标注出错？',
    answer:'前期首先要重点看大范围更新的规则与原规则有哪些变动，以及这些变动之间的联系。督促自己快速掌握更新内容，再应用到标注过程中。',
  },
  {
    type:'题库', level:'进阶', question:'如果某条内容的发布时间接近规则时效临界值，且不同渠道对该内容的权威定级存在冲突，你会怎么处理？',
    answer:'先找甲方对接临界值的处理方式；如果是一线标注，先向上级确认。经过确认形成共识后，再应用到实际作业过程。',
  },
  {
    type:'题库', level:'进阶', question:'对于无法明确归类的边缘场景，你会优先凭经验标注，还是先暂停反馈问题？请说明原因和流程。',
    answer:'先暂停并反馈问题。特殊边缘场景仅凭经验标注结果不一定正确，得到确切答案后再根据解答操作，这有利于保持数据质量稳定。',
  },
  {
    type:'AI追问', level:'进阶', question:'你搭建数据核查体系时，针对时效临界值、权威定级冲突等易错场景，设置过哪些核查规则？',
    answer:'制定带公式的 Excel 表，将各类数据汇入后进行公式校验；同时进行月度回溯，为不同项目制定统一标准，再重复核查汇总数据。',
  },
  {
    type:'AI追问', level:'进阶', question:'你有没有参与过标注规则或流程优化？请说明具体做法和效果。',
    answer:'每天安排班前会画出重点，完成标注任务后总结当天错误，作为第二天宣贯内容。通过重复强调模糊点，帮助同学提升数据质量。',
  },
  {
    type:'题库', level:'挑战', question:'面对完全不了解的医疗、法律等专业知识问答数据，你会通过哪些方法保证标注准确性？',
    answer:'认真学习规则和操作注意点；作业中及时发现、提出并解决问题；以日为单位持续复盘，让问题在迭代中减少并提升数据质量。',
  },
  {
    type:'AI追问', level:'挑战', question:'你如何分类沉淀日常标注易错点，并确保内容更新到标注规范里，避免同类错误重复发生？',
    answer:'质检同学根据前一天数据问题形成书面汇总，第二天班会强调讲解，结束后下发班前会小测，检测吸收程度，降低同类问题重复发生。',
  },
  {
    type:'AI追问', level:'进阶', question:'岗位高峰期每月约10天需加班1-2小时，薪资税前4-6kk按经验定级，地点在西安市玉祥门几何时代大厦，是否了解并接受？',
    answer:'这些情况都了解清楚且能够接受。',
  },
];

function ScoreBlock() {
  return <Card className="result-card" title={<Space><StarOutlined />AI 匹配度评估</Space>}>
    <div className="result-summary">
      <div className="result-score"><strong>82</strong><span>匹配度评分 / 100</span><Tag color="green">推荐</Tag></div>
      <div className="result-evaluation">
        <p>候选人对标注相关问题的回答逻辑清晰，符合岗位核心工作要求，具备标注、质检、培训相关实操经验；规则迭代与疑难场景处理思路稳健，整体匹配度较高。</p>
        <div className="dimension-grid">{dimensions.map(item=><div key={item.name}><span>{item.name}</span><b>{item.score}</b><Progress percent={item.score} showInfo={false} size="small" strokeColor="#009a6e" /></div>)}</div>
      </div>
    </div>
    <Divider />
    <div className="strength-grid">
      <div><h3 className="success-text">优势</h3><ul><li>熟悉文本、语音、图片审核等多类型任务，具备质检、培训及流程优化经验。</li><li>边缘和冲突场景先暂停、确认再执行，数据质量意识较强。</li><li>能够通过班前会、错误总结和小测形成培训闭环，适应项目制节奏。</li></ul></div>
      <div><h3 className="danger-text">待确认</h3><ul><li>自我介绍较简略，个人经历与目标岗位的关联仍可进一步结构化表达。</li><li>规则快速学习方案偏原则性，需要进一步验证复杂规则的实际落地效果。</li><li>薪资原始文本“4-6kk”存在歧义，进入下一轮前需人工澄清。</li></ul></div>
    </div>
    <Alert type="info" showIcon message="录用建议" description="建议进入下一轮。重点考察复杂规则快速学习、跨项目质量管理及带教效果的量化结果，同时确认薪资口径。" />
  </Card>;
}

function ProfileTags() {
  return <Card className="result-card" title={<Space><UserOutlined />人员标签定位</Space>} extra={<Tag color="blue">标注质培复合型</Tag>}>
    <div className="profile-position">
      <div><span>核心定位</span><strong>数据标注项目执行 / 质检培训复合人才</strong></div>
      <div><span>适配场景</span><strong>规则密集、质量优先、需持续培训复盘的标注项目</strong></div>
      <div><span>工作风格</span><strong>审慎确认 · 规则驱动 · 闭环复盘</strong></div>
    </div>
    <div className="tag-section"><b>A 类 · 基础履历</b><p>来自候选人的经历、技能与客观接受条件</p><Space size={[8,10]} wrap>{baseTags.map(tag=><Tag color="blue" key={tag}>{tag}</Tag>)}</Space></div>
    <div className="tag-section"><b>B 类 · 过程行为</b><p>根据情境题回答提炼的稳定行为特征与工作方法</p><Space size={[8,10]} wrap>{behaviorTags.map(tag=><Tag color="green" key={tag}>{tag}</Tag>)}</Space></div>
  </Card>;
}

function QuestionList() {
  return <Card className="result-card" title="问答记录（10 题）" extra={<Space><Tag color="green">已回答 10</Tag><Tag>未回答 0</Tag><Button type="primary" ghost size="small" icon={<ExportOutlined />} href="https://zhimianv1.coze.site/admin/monitor/11f6600b-7a91-4438-96c6-c20aaa8ee904" target="_blank" rel="noopener noreferrer">查看具体记录</Button></Space>}>
    <Collapse ghost items={questions.map((item,index)=>({
      key:String(index),
      label:<div className="qa-title"><b>Q{index+1}</b><Tag color={item.type==='AI追问'?'blue':'purple'}>{item.type}</Tag><Tag>{item.level}</Tag><span>{item.question}</span><Tag color="green" icon={<CheckCircleFilled />}>已回答</Tag></div>,
      children:<div className="qa-answer"><b>回答转录</b><p>{item.answer}</p><Space><Button size="small" icon={<PlayCircleOutlined />} onClick={()=>message.info(`正在加载 Q${index+1} 面试录像`)}>播放录像</Button><Button size="small" icon={<DownloadOutlined />} onClick={()=>message.success(`Q${index+1} 录像下载任务已创建`)}>下载录像</Button><Button type="link" size="small" icon={<ReloadOutlined />} onClick={()=>message.success('录像链接已刷新')}>刷新链接</Button></Space></div>,
    }))} />
  </Card>;
}

export function InterviewResult({ record }: { record:Record<string, unknown> }) {
  const interview = record as unknown as Interview;
  if (interview.candidate !== '张兰兰') return null;
  return <div className="interview-result">
    <Card className="result-profile">
      <div>
        <Space><Tag color="green">已完成</Tag><Tag>{interview.round}</Tag><Tag icon={<SafetyCertificateOutlined />} color="cyan">Agent 已评估</Tag></Space>
        <h2>{interview.candidate} · {interview.job}</h2>
        <Descriptions size="small" column={3}>
          <Descriptions.Item label="面试编号">{interview.code}</Descriptions.Item>
          <Descriptions.Item label="邮箱">{interview.email}</Descriptions.Item>
          <Descriptions.Item label="完成时间">{interview.interviewTime}</Descriptions.Item>
          <Descriptions.Item label="所属项目">{interview.project}</Descriptions.Item>
          <Descriptions.Item label="面试官">嘉欣（AI Agent）</Descriptions.Item>
          <Descriptions.Item label="评估结果"><Tag color="green">建议通过</Tag></Descriptions.Item>
        </Descriptions>
      </div>
      <div className="score-badge"><strong>82</strong><span>推荐</span></div>
    </Card>
    <ScoreBlock />
    <ProfileTags />
    <QuestionList />
  </div>;
}
