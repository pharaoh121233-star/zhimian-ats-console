import { useLocation, useNavigate } from 'react-router-dom';
import { Button, Progress, Tag } from 'antd';
import { BusinessList, progressCol, statusCol, textCol } from '../components/BusinessList';
import { AGENT_RECORD_URL, InterviewResult } from '../components/InterviewResult';
import { pageMeta } from '../config/navigation';
import { interviews, jobs, projects } from '../services/mock';
import { mockFeishuService } from '../services/feishu';

const projectColumns = [
  {...textCol('项目编号','code',160),fixed:'left' as const},
  {title:'项目名称',dataIndex:'name',width:230,fixed:'left' as const,render:(v:string)=><Button type="link">{v}</Button>},
  textCol('客户 / 业务线','client',160), textCol('项目经理','manager',100),
  {title:'岗位数',dataIndex:'jobs',width:80}, {title:'目标人数',dataIndex:'target',width:90},
  {title:'已通过',dataIndex:'passed',width:80}, progressCol(), textCol('项目周期','period',150),
  statusCol(), textCol('更新时间','updated',120),
];

const jobColumns = [
  {...textCol('岗位编号','code',160),fixed:'left' as const},
  {title:'岗位名称',dataIndex:'name',width:210,fixed:'left' as const,render:(v:string)=><Button type="link">{v}</Button>},
  textCol('所属项目','project',220), textCol('岗位负责人','owner',140), textCol('招聘专员','recruiter',110),
  {title:'HC',dataIndex:'hc',width:65},{title:'已通过',dataIndex:'passed',width:75},{title:'缺口',dataIndex:'gap',width:65,render:(v:number)=><b className={v>8?'danger-text':''}>{v}</b>},
  textCol('工作地点','city',90), {title:'优先级',dataIndex:'priority',width:80,render:(v:string)=><Tag color={v==='紧急'?'red':v==='高'?'orange':'default'}>{v}</Tag>},
  statusCol(),textCol('版本','version',70),textCol('更新时间','updated',110),
];

const questionData = jobs.slice(0,8).map((x,i)=>({key:x.key,code:`ZM-QS-2026-${String(128+i).padStart(4,'0')}`,name:['如何定位云主机网络间歇性超时？','客户情绪激动时如何推进问题解决？','判断：负载均衡健康检查仅支持 HTTP','设计一次重大故障的客户沟通方案'][i%4],project:x.project,job:x.name,type:['情景','简答','判断','实操'][i%4],difficulty:['中等','困难','简单'][i%3],duration:`${5+i%4} 分钟`,count:32+i*7,status:i===3?'待审批':'启用',version:`V${1+i%3}.${i}`,updated:`09-0${3-i%3} 14:${20+i}`}));

const scoreData = jobs.slice(0,8).map((x,i)=>({key:x.key,name:`${x.name}综合评分模板`,project:x.project,job:x.name,total:100,line:70+i%3*5,dimensions:5+i%3,veto:i%2,status:i===2?'草稿':'已发布',version:`V${2+i%2}.${i}`,updated:`09-0${3-i%3} 15:${10+i}`}));

const talentData = interviews.map((x,i)=>({key:x.key,name:x.candidate,contact:x.email||'未填写',project:x.project,job:x.job,pool:i%3===0?'公海池':'私海池',result:x.result||x.status,score:x.score,tags:['AI 面试'],owner:x.owner,updated:x.interviewTime||x.updated}));

const userData = ['李延财','沈知行','顾清禾','林嘉树','许昭','唐宁','苏晚','温言'].map((name,i)=>({key:String(i+1),name,account:i===0?'li.yancai@zhimian.cn':`user${i+1}@zhimian.cn`,department:['招聘运营部','云产品事业部','客户服务部'][i%3],role:['超级管理员','项目经理','岗位负责人','招聘专员','审核人员'][i%5],scope:i===0?'全部组织数据':`${1+i%4} 个项目 / ${2+i} 个岗位`,source:i%3===0?'统一登录同步':'管理员创建',status:i===6?'停用':'启用',login:`09-0${3-i%3} 1${i}:20`}));

const genericData = Array.from({length:9},(_,i)=>({key:String(i+1),code:`ZM-${String(i+1).padStart(4,'0')}`,name:['AI 首轮标准流程','面试邀请短信模板','候选人来源','项目编号规则','导出面试台账','角色权限调整','智面 V2.8.0','云产品事业部','项目创建审批'][i],module:['流程配置','通知模板','基础字典','编号规则','下载任务','审计日志','版本更新','组织架构','审批中心'][i],owner:['周谨言','顾清禾','沈知行'][i%3],status:['启用','已发布','正常','生成中','已完成','待审批'][i%6],updated:`09-0${3-i%3} ${10+i}:20`}));

export function ProjectPage() {
  return <BusinessList title="项目管理" description="管理招聘项目、目标进度和审批状态" stats={[{label:'全部项目',value:projects.length},{label:'进行中',value:projects.filter(item=>item.status==='进行中').length},{label:'待完善归属',value:projects.filter(item=>item.risk.includes('完善')).length,tone:'orange'},{label:'岗位总数',value:jobs.length},{label:'面试记录',value:interviews.length,tone:'green'}]} data={projects as unknown as (Record<string,unknown>&{key:string})[]} columns={projectColumns} primaryAction="新建项目" filterNames={['项目名称 / 编号','客户 / 业务线','项目经理','状态','日期范围']} />;
}

export function JobPage() {
  return <BusinessList title="岗位管理" description="配置岗位、成员权限与面试流程" stats={[{label:'招聘中岗位',value:jobs.filter(item=>item.status==='招聘中').length},{label:'项目内岗位',value:jobs.filter(item=>item.project!=='未归属项目').length},{label:'未归属岗位',value:jobs.filter(item=>item.project==='未归属项目').length,tone:'orange'},{label:'HC 缺口',value:jobs.reduce((sum,item)=>sum+item.gap,0),tone:'red'},{label:'面试完成',value:interviews.length,tone:'green'}]} data={jobs as unknown as (Record<string,unknown>&{key:string})[]} columns={jobColumns} primaryAction="新增 JD" filterNames={['关键词','项目','岗位负责人','招聘专员','状态']} />;
}

export function GenericPage() {
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const meta = pageMeta[pathname] || {title:'业务管理',description:'管理业务数据与操作记录'};
  const isQuestion = pathname==='/questions';
  const isScore = pathname==='/score-templates';
  const isTalent = pathname.startsWith('/talent/');
  const isUsers = pathname==='/users';
  const isRecord = pathname==='/records';
  const source = isQuestion?questionData:isScore?scoreData:isTalent?talentData:isUsers?userData:isRecord?[...mockFeishuService.getRecords(),...interviews]:genericData;
  const columns = isQuestion ? [textCol('题目编号','code',160),textCol('题目摘要','name',240),textCol('项目 / 岗位','job',200),textCol('题型','type'),textCol('难度','difficulty'),textCol('建议时长','duration'),textCol('使用次数','count'),statusCol(),textCol('版本','version'),textCol('更新时间','updated')] :
    isScore ? [textCol('模板名称','name',230),textCol('项目 / 岗位','job',210),textCol('总分','total'),textCol('通过线','line'),textCol('维度数','dimensions'),textCol('单项否决','veto'),textCol('当前版本','version'),statusCol(),textCol('更新时间','updated')] :
    isTalent ? [{title:'候选人',dataIndex:'name',width:120,render:(v:string)=><Button type="link">{v}</Button>},textCol('联系方式','contact'),textCol('最近项目 / 岗位','job',220),textCol('人才池','pool'),textCol('最近结果','result'),{title:'AI 得分',dataIndex:'score'},textCol('负责人','owner'),textCol('更新时间','updated')] :
    isUsers ? [{title:'用户',dataIndex:'name',render:(v:string)=><Button type="link">{v}</Button>},textCol('账号 / 邮箱','account',190),textCol('部门','department'),textCol('角色','role'),textCol('项目 / 岗位数据范围','scope',180),textCol('账号来源','source'),statusCol(),textCol('最后登录','login')] :
    isRecord ? [textCol('面试编号','code',190),textCol('候选人','candidate'),textCol('邮箱','email',220),textCol('项目','project',140),textCol('岗位','job',160),textCol('完成时间','interviewTime',170),{title:'AI 得分',dataIndex:'score',width:90,sorter:(a:any,b:any)=>Number(a.score)-Number(b.score),render:(value:number)=><Tag color={value>=80?'green':value>=60?'orange':'red'}>{value} 分</Tag>},{title:'人员定位',dataIndex:'candidate',width:160,render:(value:string)=><Tag color={value==='张兰兰'?'blue':'default'}>{value==='张兰兰'?'标注质培复合型':'待生成标签'}</Tag>},textCol('评估结果','result',110),statusCol('面试状态','status'),statusCol('通知状态','linkStatus'),textCol('会议方式','provider',130),statusCol('结果同步','syncStatus'),textCol('更新时间','updated')] :
    [textCol('编号','code'),textCol('名称 / 摘要','name',240),textCol('所属模块','module'),textCol('负责人','owner'),statusCol(),textCol('更新时间','updated')];
  const stats = isRecord
    ? [{label:'全部记录',value:source.length},{label:'已完成',value:interviews.filter(item=>item.status==='已完成').length},{label:'建议通过',value:interviews.filter(item=>item.result==='建议通过').length,tone:'green'},{label:'待复核',value:interviews.filter(item=>item.result==='待复核').length,tone:'orange'},{label:'已生成人员标签',value:1,tone:'blue'}]
    : [{label:'全部',value:128},{label:'启用 / 进行中',value:86},{label:'待处理',value:18,tone:'orange'},{label:'异常',value:3,tone:'red'},{label:'本月新增',value:24,tone:'green'}];
  return <BusinessList title={meta.title} description={meta.description} stats={stats} data={source as unknown as (Record<string,unknown>&{key:string})[]} columns={columns} primaryAction={isTalent?'录入候选人':`新建${meta.title.replace('管理','')}`} allowBoard={isTalent||pathname==='/approvals'} headerExtra={pathname==='/versions'?<Button onClick={()=>navigate('/jobs')}>查看当前配置</Button>:undefined} detailContent={isRecord?record=><InterviewResult record={record}/>:undefined} detailWidth={isRecord?1180:undefined} detailExtra={isRecord?record=>record.candidate==='张兰兰'?<Button type="primary" href={AGENT_RECORD_URL} target="_self">查看 Agent 原始记录</Button>:undefined:undefined} />;
}
