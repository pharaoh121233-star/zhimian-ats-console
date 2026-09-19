import { useState } from 'react';
import { Area, Bar, Column, Funnel, Pie } from '@ant-design/charts';
import {
  Alert, Button, Calendar, Card, Checkbox, Col, DatePicker, Drawer, Form, Input,
  List, message, Modal, Progress, Radio, Row, Select, Space, Switch, Table, Tag,
} from 'antd';
import {
  CloudDownloadOutlined, ExpandOutlined, LeftOutlined, ReloadOutlined,
  SyncOutlined,
} from '@ant-design/icons';
import dayjs, { type Dayjs } from 'dayjs';
import { useLocation, useNavigate } from 'react-router-dom';
import { PageHeader, StatCard, StatusTag } from '../components/Common';
import { funnelData, interviews, jobs, projects, trendData } from '../services/mock';

const sourceData = [{type:'QQ 邮箱',value:9},{type:'36w 企业邮箱',value:6},{type:'字节企业邮箱',value:5}];
const riskData = [{type:'建议通过',value:7},{type:'待复核',value:5},{type:'建议淘汰',value:7},{type:'匹配度评估',value:1}];

export function AnalyticsPage() {
  const { pathname }=useLocation();
  const navigate=useNavigate();
  const type=pathname.includes('projects')?'projects':pathname.includes('jobs')?'jobs':pathname.includes('interviews')?'interviews':'overview';
  const title={overview:'招聘总览',projects:'项目分析',jobs:'岗位分析',interviews:'面试分析'}[type];
  const drill=(metric:string)=>navigate(`/analytics/detail?source=${encodeURIComponent(title)}&metric=${encodeURIComponent(metric)}&date=2026-08-01_2026-09-03`);
  return <div><PageHeader title={title} description="按授权数据范围查看招聘效率、转化和质量指标" extra={<><Button icon={<CloudDownloadOutlined />} onClick={()=>message.success('已创建 Excel 导出任务')}>导出 Excel</Button><Button icon={<ExpandOutlined />}>全屏</Button></>} />
    <Card className="analytics-filter"><Space wrap><DatePicker.RangePicker defaultValue={[dayjs('2026-08-01'),dayjs('2026-09-03')]} /><Select placeholder="全部项目" style={{width:220}} options={projects.slice(0,4).map(x=>({value:x.key,label:x.name}))}/><Select placeholder="全部岗位" style={{width:180}} options={jobs.slice(0,4).map(x=>({value:x.key,label:x.name}))}/><Select placeholder="招聘专员" style={{width:140}} options={[{value:'许昭',label:'许昭'}]}/><Button type="primary">应用筛选</Button><Button>重置</Button></Space><Space><span><SyncOutlined /> 更新于 16:50</span><Switch size="small" defaultChecked /> 自动刷新</Space></Card>
    <Alert className="scope-alert" type="info" showIcon message="数据权限范围：全部组织数据；所有指标当前使用示例口径。" />
    {type==='overview'&&<OverviewAnalytics drill={drill} />}
    {type==='projects'&&<ProjectAnalytics drill={drill} />}
    {type==='jobs'&&<JobAnalytics drill={drill} />}
    {type==='interviews'&&<InterviewAnalytics drill={drill} />}
  </div>;
}

type Drill = (metric:string)=>void;

function MetricRow({ items, drill }:{items:[string,string,string][],drill:Drill}) {
  return <Row gutter={12} className="stats-row">{items.map((item,index)=><Col flex="1" key={item[0]}><StatCard label={item[0]} value={item[1]} trend={item[2]} tone={index===items.length-1?'orange':'blue'} onClick={()=>drill(item[0])} /></Col>)}</Row>;
}

function OverviewAnalytics({drill}:{drill:Drill}) {
  return <><MetricRow drill={drill} items={[['项目目标完成率','11.3%','6 / 53'],['邮件发送率','100%','20 / 20'],['面试完成率','100%','20 / 20'],['建议通过率','30%','6 / 20'],['平均 AI 得分','49 分','图片记录'],['待复核率','25%','5 / 20']]} />
    <Row gutter={16}><Col span={14}><Card title="招聘转化漏斗" className="chart-card"><Funnel data={funnelData} xField="stage" yField="value" colorField="stage" onReady={c=>c.on('element:click',()=>drill('招聘转化漏斗'))}/></Card></Col><Col span={10}><Card title="候选人来源分布" className="chart-card"><Pie data={sourceData} angleField="value" colorField="type" innerRadius={0.62} label={{text:'type',position:'outside'}} onReady={c=>c.on('element:click',()=>drill('候选人来源'))}/></Card></Col></Row>
    <Row gutter={16}><Col span={16}><Card title="近 14 天邀约 / 完成趋势" className="chart-card"><Area data={trendData.flatMap(x=>[{date:x.date,type:'邀约量',value:x.邀约量},{date:x.date,type:'完成量',value:x.完成量}])} xField="date" yField="value" colorField="type" shapeField="smooth" style={{fillOpacity:.12}} /></Card></Col><Col span={8}><Card title="异常类型分布" className="chart-card"><Bar data={riskData} xField="value" yField="type" colorField="type" legend={false} onReady={c=>c.on('element:click',()=>drill('异常类型'))}/></Card></Col></Row>
    <Card title="项目目标完成率排行" className="chart-card"><Column data={projects.slice(0,6).map(x=>({name:x.name.replace('招聘项目',''),value:x.progress}))} xField="name" yField="value" colorField="name" legend={false} label={{text:(d:{value:number})=>`${d.value}%`}} onReady={c=>c.on('element:click',()=>drill('项目完成率'))}/></Card></>;
}

function ProjectAnalytics({drill}:{drill:Drill}) {
  const targetData=projects.slice(0,5).flatMap(item=>[{name:item.name.slice(0,8),type:'目标人数',value:item.target},{name:item.name.slice(0,8),type:'已通过',value:item.passed}]);
  const contribution=jobs.slice(0,6).map(item=>({name:item.name,value:item.passed}));
  const workload=[{name:'招聘专员',value:20},{name:'行政招聘组',value:1},{name:'标注业务负责人',value:16}];
  return <><MetricRow drill={drill} items={[['项目总数',String(projects.length),'图片项目'],['整体目标完成率','11.3%','6 / 53'],['进度正常项目','2','kuma、西安'],['待完善项目','1','未归属项目'],['岗位总数',String(jobs.length),'9 个 JD']]} />
    <Row gutter={16}><Col span={16}><Card title="项目目标与实际对比" className="chart-card"><Column data={targetData} xField="name" yField="value" colorField="type" group onReady={c=>c.on('element:click',()=>drill('项目目标与实际'))}/></Card></Col><Col span={8}><Card title="项目进度风险" className="chart-card"><List dataSource={projects.slice(0,5)} renderItem={item=><List.Item onClick={()=>drill(item.name)} className="rank-item"><div className="rank-main"><b>{item.name}</b><Progress percent={item.progress} size="small" /></div><Tag color={item.risk==='正常'?'green':'orange'}>{item.risk}</Tag></List.Item>} /></Card></Col></Row>
    <Row gutter={16}><Col span={12}><Card title="岗位通过贡献" className="chart-card"><Pie data={contribution} angleField="value" colorField="name" innerRadius={0.55} onReady={c=>c.on('element:click',()=>drill('岗位贡献'))}/></Card></Col><Col span={12}><Card title="招聘专员项目工作量" className="chart-card"><Bar data={workload} xField="value" yField="name" colorField="name" legend={false} label={{text:'value'}} onReady={c=>c.on('element:click',()=>drill('招聘专员工作量'))}/></Card></Col></Row></>;
}

function JobAnalytics({drill}:{drill:Drill}) {
  const hcData=jobs.slice(0,6).flatMap(item=>[{name:item.name.slice(0,7),type:'HC',value:item.hc},{name:item.name.slice(0,7),type:'已通过',value:item.passed}]);
  const duration=[{stage:'简历筛选',days:1.8},{stage:'AI 面试',days:2.4},{stage:'人工复试',days:3.6},{stage:'客户面',days:4.2},{stage:'Offer 审批',days:2.1}];
  const score=[{range:'60 以下',value:12},{range:'60-69',value:2},{range:'70-79',value:4},{range:'80-89',value:2},{range:'90 以上',value:0}];
  return <><MetricRow drill={drill} items={[['招聘中岗位',String(jobs.length),'图片岗位'],['HC 总量',String(jobs.reduce((sum,item)=>sum+item.hc,0)),'岗位合计'],['HC 完成率','11.3%','6 人通过'],['有面试记录岗位','6','20 条记录'],['未归属岗位','7','待完善']]} />
    <Row gutter={16}><Col span={15}><Card title="岗位 HC 完成情况" className="chart-card"><Column data={hcData} xField="name" yField="value" colorField="type" group onReady={c=>c.on('element:click',()=>drill('岗位 HC 完成'))}/></Card></Col><Col span={9}><Card title="候选人推进漏斗" className="chart-card"><Funnel data={funnelData.slice(0,5)} xField="stage" yField="value" colorField="stage" onReady={c=>c.on('element:click',()=>drill('岗位候选人漏斗'))}/></Card></Col></Row>
    <Row gutter={16}><Col span={12}><Card title="各阶段平均推进时长" className="chart-card"><Bar data={duration} xField="days" yField="stage" colorField="stage" legend={false} label={{text:(d:{days:number})=>`${d.days} 天`}} /></Card></Col><Col span={12}><Card title="AI 评分区间分布" className="chart-card"><Column data={score} xField="range" yField="value" colorField="range" legend={false} onReady={c=>c.on('element:click',()=>drill('评分区间'))}/></Card></Col></Row>
    <Card title="岗位来源质量" className="table-panel"><Table pagination={false} dataSource={jobs.slice(0,5)} columns={[{title:'岗位',dataIndex:'name'},{title:'主要来源',render:(_,__,index)=>['内部推荐','招聘官网','招聘平台','人才公海','校园招聘'][index]},{title:'候选人数',render:(_,__,index)=>128-index*13},{title:'通过率',render:(_,__,index)=><Progress percent={48-index*4} size="small" />},{title:'平均得分',render:(_,__,index)=>86-index*2}]} /></Card></>;
}

function InterviewAnalytics({drill}:{drill:Drill}) {
  const completion=trendData.flatMap(item=>[{date:item.date,type:'AI 面试量',value:item.邀约量},{date:item.date,type:'完成量',value:item.完成量}]);
  const score=[{range:'60 以下',value:12},{range:'60-69',value:2},{range:'70-79',value:4},{range:'80-89',value:2},{range:'90 以上',value:0}];
  const load=[{name:'陈砚',value:18},{name:'梁序',value:15},{name:'顾清禾',value:12},{name:'林嘉树',value:9},{name:'周谨言',value:7}];
  return <><MetricRow drill={drill} items={[['AI 面试量',String(interviews.length),'图片记录'],['完成率','100%','20 / 20'],['建议通过率','30%','6 / 20'],['平均 AI 得分','49 分','图片记录'],['待复核率','25%','5 / 20']]} />
    <Row gutter={16}><Col span={16}><Card title="AI 面试量与完成趋势" className="chart-card"><Area data={completion} xField="date" yField="value" colorField="type" shapeField="smooth" style={{fillOpacity:.12}} onReady={c=>c.on('element:click',()=>drill('AI 面试趋势'))}/></Card></Col><Col span={8}><Card title="AI 风险分布" className="chart-card"><Pie data={[{type:'正常',value:82},{type:'身份风险',value:6},{type:'回答风险',value:8},{type:'环境风险',value:4}]} angleField="value" colorField="type" innerRadius={0.62} onReady={c=>c.on('element:click',()=>drill('AI 风险'))}/></Card></Col></Row>
    <Row gutter={16}><Col span={12}><Card title="评分区间分布" className="chart-card"><Column data={score} xField="range" yField="value" colorField="range" legend={false} onReady={c=>c.on('element:click',()=>drill('面试评分区间'))}/></Card></Col><Col span={12}><Card title="人工面试官负载" className="chart-card"><Bar data={load} xField="value" yField="name" colorField="name" legend={false} label={{text:'value'}} onReady={c=>c.on('element:click',()=>drill('面试官负载'))}/></Card></Col></Row>
    <Card title="异常趋势与待处理记录" className="table-panel"><Table dataSource={interviews.filter(item=>item.risk)} pagination={false} columns={[{title:'面试编号',dataIndex:'code'},{title:'候选人',dataIndex:'candidate'},{title:'岗位',dataIndex:'job'},{title:'异常',dataIndex:'risk',render:value=><Tag color="red">{value}</Tag>},{title:'负责人',dataIndex:'owner'},{title:'更新时间',dataIndex:'updated'},{title:'操作',render:()=> <Button type="link" onClick={()=>drill('异常面试')}>查看明细</Button>}]} /></Card></>;
}

export function AnalyticsDetail() {
  const navigate=useNavigate(); const params=new URLSearchParams(useLocation().search);
  const metric=params.get('metric')||'招聘转化';
  return <div><PageHeader title={`${metric}明细`} description="由数据看板下钻，已自动带入来源筛选条件" extra={<Button icon={<LeftOutlined />} onClick={()=>navigate(-1)}>返回来源看板</Button>} /><Alert type="info" showIcon message={`筛选摘要：来源 ${params.get('source')||'招聘总览'} · 日期 2026-08-13 至 2026-08-25 · 全部项目`} /><Row gutter={12} className="stats-row"><Col span={6}><StatCard label="明细记录" value={interviews.length} /></Col><Col span={6}><StatCard label="涉及项目" value={new Set(interviews.map(item=>item.project)).size} /></Col><Col span={6}><StatCard label="涉及岗位" value={new Set(interviews.map(item=>item.job)).size} /></Col><Col span={6}><StatCard label="平均得分" value="49 分" /></Col></Row><Card><Table dataSource={interviews} columns={[{title:'面试编号',dataIndex:'code'},{title:'候选人',dataIndex:'candidate'},{title:'邮箱',dataIndex:'email'},{title:'项目',dataIndex:'project'},{title:'岗位',dataIndex:'job'},{title:'得分',dataIndex:'score',render:value=>`${value} 分`},{title:'结果',dataIndex:'result'},{title:'状态',dataIndex:'status',render:(v)=><StatusTag status={v}/>},{title:'完成时间',dataIndex:'interviewTime'}]} /></Card></div>;
}

const events:Record<string,{title:string;status:string;time:string;candidate:string}[]> = {
  '2026-08-26':[{title:'腾讯大模型标注 · 二轮复试',status:'已确认',time:'10:00',candidate:'张兰兰'},{title:'zj大模型标注 · 人工复核',status:'冲突',time:'14:30',candidate:'刘梓瑄'}],
  '2026-08-27':[{title:'行政专员 · 二轮复试',status:'待确认',time:'15:00',candidate:'左君怡'}],
  '2026-08-28':[{title:'腾讯大模型标注 · 终试',status:'待确认',time:'11:00',candidate:'姬胜奥'}],
};

export function CalendarPage() {
  const [selected,setSelected]=useState<Dayjs>(dayjs('2026-08-26')); const [drawer,setDrawer]=useState(false); const [create,setCreate]=useState(false);
  return <div><PageHeader title="面试日历" description="仅展示二轮及后续人工面试、客户面和排班环节" extra={<Button type="primary" onClick={()=>setCreate(true)}>新建人工面试</Button>} />
    <Card className="calendar-toolbar"><Space><Button onClick={()=>setSelected(dayjs())}>今天</Button><Radio.Group defaultValue="month" optionType="button" options={[{label:'月',value:'month'},{label:'周',value:'week'},{label:'日',value:'day'}]} /><Select placeholder="全部项目" style={{width:200}} options={projects.slice(0,3).map(x=>({value:x.key,label:x.name}))}/><Select placeholder="面试官" style={{width:130}} options={[{value:'陈砚',label:'陈砚'},{value:'梁序',label:'梁序'}]}/></Space><span>时区：Asia/Shanghai (UTC+8)</span></Card>
    <Card className="calendar-card"><Calendar value={selected} onSelect={d=>setSelected(d)} cellRender={date=><div className="event-list">{(events[date.format('YYYY-MM-DD')]||[]).map(event=><div key={event.time} className={`calendar-event ${event.status==='冲突'?'conflict':''}`} onClick={()=>setDrawer(true)}><b>{event.time} {event.candidate}</b><span>{event.title}</span></div>)}</div>} /></Card>
    <Drawer open={drawer} onClose={()=>setDrawer(false)} title="人工面试安排" width={520}><Alert type="error" showIcon message="检测到面试官时间冲突" description="面试官在 14:00 - 15:00 已有另一场人工复核。" /><Form layout="vertical" style={{marginTop:16}}><Form.Item label="候选人"><Input value="刘梓瑄" readOnly/></Form.Item><Form.Item label="时间"><DatePicker showTime value={dayjs('2026-08-26 14:30')}/></Form.Item><Form.Item label="面试官"><Select mode="multiple" defaultValue={['标注业务负责人']} options={[{value:'标注业务负责人',label:'标注业务负责人（冲突）'},{value:'招聘专员',label:'招聘专员（空闲）'}]}/></Form.Item><Form.Item label="同步日历"><Checkbox defaultChecked>同步飞书日历并重新通知参会人</Checkbox></Form.Item><Button type="primary" block onClick={()=>message.success('改期已保存，通知已重新发送')}>确认改期</Button></Form></Drawer>
    <Modal open={create} onCancel={()=>setCreate(false)} title="新建人工面试" okText="创建并通知" onOk={()=>{setCreate(false);message.success('人工面试已创建');}}><Form layout="vertical"><Form.Item label="候选人" required><Select options={interviews.slice(0,5).map(x=>({value:x.key,label:`${x.candidate} · ${x.job}`}))}/></Form.Item><Form.Item label="推荐时段"><Radio.Group options={['09-04 10:00','09-04 14:30','09-05 11:00']} optionType="button"/></Form.Item><Form.Item label="面试官" required><Select mode="multiple" options={[{value:'陈砚',label:'陈砚 · 空闲'},{value:'梁序',label:'梁序 · 空闲'}]}/></Form.Item><Form.Item label="会议方式"><Select defaultValue="飞书会议" options={[{value:'飞书会议',label:'飞书会议'},{value:'腾讯会议',label:'腾讯会议'},{value:'现场',label:'现场'}]}/></Form.Item></Form></Modal>
  </div>;
}
