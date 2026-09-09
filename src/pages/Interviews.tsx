import { useMemo, useState } from 'react';
import dayjs from 'dayjs';
import {
  Alert, Button, Card, Checkbox, Col, DatePicker, Descriptions, Divider, Drawer, Form, Input,
  List, message, Modal, Progress, Radio, Result, Row, Select, Space, Steps, Table,
  Tabs, Tag, Timeline, Upload,
} from 'antd';
import {
  CheckCircleFilled, ClockCircleOutlined, LinkOutlined, PauseCircleOutlined,
  InboxOutlined, SendOutlined, VideoCameraOutlined, WarningOutlined,
} from '@ant-design/icons';
import { BusinessList, statusCol, textCol } from '../components/BusinessList';
import type { RecordType } from '../components/BusinessList';
import { PageHeader, StatCard, StatusTag } from '../components/Common';
import { candidates, interviews, jobs, projects } from '../services/mock';
import { mockFeishuService, type FeishuMeetingRecord } from '../services/feishu';

type InterviewFilterValue = {
  keyword?:string; project?:string; job?:string; owner?:string; round?:string; status?:string;
};

function InterviewFilterBar({ value, onChange, statusOptions }: {
  value:InterviewFilterValue;
  onChange:(value:InterviewFilterValue)=>void;
  statusOptions:string[];
}) {
  const setValue = (key:keyof InterviewFilterValue, next?:string) => onChange({...value,[key]:next});
  const availableJobs = value.project ? jobs.filter(item=>item.project===value.project) : jobs;
  return <Card className="filter-panel interview-filter">
    <div className="filter-grid">
      <Input.Search allowClear placeholder="候选人 / 面试编号" value={value.keyword} onChange={event=>setValue('keyword',event.target.value)} />
      <Select allowClear showSearch placeholder="项目" value={value.project} onChange={next=>onChange({...value,project:next,job:undefined})} options={projects.map(item=>({value:item.name,label:item.name}))} />
      <Select allowClear showSearch placeholder="岗位" value={value.job} onChange={next=>setValue('job',next)} options={availableJobs.map(item=>({value:item.name,label:item.name}))} />
      <Select allowClear placeholder="负责人" value={value.owner} onChange={next=>setValue('owner',next)} options={['许昭','唐宁','苏晚','温言'].map(name=>({value:name,label:name}))} />
      <Select allowClear placeholder="当前轮次" value={value.round} onChange={next=>setValue('round',next)} options={['首轮 AI 面试','二轮人工复试','终试','客户面'].map(name=>({value:name,label:name}))} />
      <Select allowClear placeholder="状态" value={value.status} onChange={next=>setValue('status',next)} options={statusOptions.map(name=>({value:name,label:name}))} />
      <DatePicker.RangePicker placeholder={['开始日期','结束日期']} />
      <Space><Button type="primary" onClick={()=>message.success('筛选条件已应用')}>查询</Button><Button onClick={()=>onChange({})}>重置</Button></Space>
    </div>
  </Card>;
}

function applyInterviewFilters<T extends typeof interviews[number]>(items:T[], filters:InterviewFilterValue) {
  return items.filter(item=>
    (!filters.keyword || `${item.candidate}${item.code}`.toLowerCase().includes(filters.keyword.toLowerCase())) &&
    (!filters.project || item.project===filters.project) &&
    (!filters.job || item.job===filters.job) &&
    (!filters.owner || item.owner===filters.owner) &&
    (!filters.round || item.round===filters.round) &&
    (!filters.status || `${item.status}${item.linkStatus}${item.risk || ''}`.includes(filters.status))
  );
}

export function InvitePage() {
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState<React.Key[]>(['1','2']);
  const next = () => setCurrent(Math.min(3,current+1));
  return <div>
    <PageHeader title="发起邀约" description="为候选人配置首轮 AI 面试并发送唯一链接" extra={<Button>保存草稿</Button>} />
    <Card className="steps-shell"><Steps current={current} items={['选择候选人与岗位','配置面试','确认通知','发起结果'].map(title=>({title}))} /></Card>
    <Card className="invite-card">
      {current===0 && <div><div className="section-title"><h2>选择候选人与岗位</h2><span>已选择 {selected.length} 人</span></div>
        <div className="resume-upload">
          <Upload.Dragger multiple accept=".pdf,.doc,.docx" beforeUpload={(file)=>{message.success(`${file.name} 已加入解析队列`);return false;}} showUploadList>
            <Space size={10} className="resume-upload-content">
              <InboxOutlined />
              <b>上传简历并创建候选人</b>
              <span>拖拽或点击选择 PDF、DOC、DOCX</span>
              <Tag color="blue">支持批量解析</Tag>
            </Space>
          </Upload.Dragger>
        </div>
        <div className="filter-grid"><Input.Search placeholder="姓名 / 手机号 / 邮箱" /><Select placeholder="选择项目" options={projects.slice(0,4).map(x=>({value:x.key,label:x.name}))} /><Select placeholder="选择岗位" options={jobs.slice(0,5).map(x=>({value:x.key,label:x.name}))} /></div>
        <Alert type="warning" showIcon message="查重提醒" description="孟书瑶的手机号与已有候选人部分匹配，请人工确认后再发起邀约。" action={<Button size="small">查看重复记录</Button>} />
        <Table rowSelection={{selectedRowKeys:selected,onChange:setSelected}} pagination={false} dataSource={candidates.slice(0,5).map((name,i)=>({key:String(i+1),name,phone:`138****${2468+i*117}`,email:i===3?'未填写':`candidate${i+1}@example.com`,job:jobs[i%3].name,status:i===3?'资料不完整':'可邀约'}))} columns={[
          {title:'候选人',dataIndex:'name',render:(v)=><Button type="link">{v}</Button>},{title:'手机号',dataIndex:'phone'},{title:'邮箱',dataIndex:'email'},{title:'目标岗位',dataIndex:'job'},{title:'状态',dataIndex:'status',render:(v)=><StatusTag status={v} />},
        ]} /></div>}
      {current===1 && <Form layout="vertical" className="form-grid">
        <Form.Item label="面试题库" required><Select defaultValue="云产品支持工程师题库 V3.2" options={[{value:'云产品支持工程师题库 V3.2',label:'云产品支持工程师题库 V3.2'}]} /></Form.Item>
        <Form.Item label="评分模板" required><Select defaultValue="技术支持综合能力 V2.1" options={[{value:'技术支持综合能力 V2.1',label:'技术支持综合能力 V2.1'}]} /></Form.Item>
        <Form.Item label="链接有效期"><Input value="48 小时（固定）" disabled /></Form.Item>
        <Form.Item label="身份认证"><Checkbox defaultChecked>候选人访问时进行手机号认证</Checkbox></Form.Item>
        <Form.Item label="短信模板"><Select defaultValue="AI 面试邀约通知" options={[{value:'AI 面试邀约通知',label:'AI 面试邀约通知'}]} /></Form.Item>
        <Form.Item label="邮件模板"><Select defaultValue="标准面试邀请邮件" options={[{value:'标准面试邀请邮件',label:'标准面试邀请邮件'}]} /></Form.Item>
        <Form.Item label="发送时间"><Radio.Group defaultValue="now"><Radio value="now">立即发送</Radio><Radio value="later">定时发送</Radio></Radio.Group></Form.Item>
      </Form>}
      {current===2 && <Row gutter={20}><Col span={15}><Card size="small" title="接收人清单"><List dataSource={candidates.slice(0,2)} renderItem={(x,i)=><List.Item><Space><CheckCircleFilled className="success-icon" /><b>{x}</b><span>138****{2468+i*117}</span><Tag>{jobs[i].name}</Tag></Space></List.Item>} /></Card><Alert style={{marginTop:16}} type="warning" showIcon message="发现 1 项重复邀约风险" description="孟书瑶在过去 7 天内收到过同岗位邀约，继续发起将保留两次发送记录。" /></Col><Col span={9}><Card size="small" title="本次邀约摘要"><Descriptions column={1} size="small"><Descriptions.Item label="候选人数">2 人</Descriptions.Item><Descriptions.Item label="短信">2 条</Descriptions.Item><Descriptions.Item label="邮件">2 封</Descriptions.Item><Descriptions.Item label="链接有效期">48 小时</Descriptions.Item><Descriptions.Item label="预计费用">¥ 0.16</Descriptions.Item></Descriptions></Card></Col></Row>}
      {current===3 && <Result status="success" title="邀约已发起" subTitle="成功 2 人，失败 0 人。唯一链接已生成并进入发送队列。" extra={[<Button type="primary" key="process" href="/interviews/process">查看进程</Button>,<Button key="again" onClick={()=>setCurrent(0)}>继续发起</Button>]}><Tag>ZM-IV-20260903-0087</Tag><Tag>ZM-IV-20260903-0088</Tag></Result>}
      {current<3 && <div className="step-actions"><Button disabled={current===0} onClick={()=>setCurrent(current-1)}>上一步</Button><Button type="primary" icon={current===2?<SendOutlined />:undefined} onClick={next}>{current===2?'确认并发起':'下一步'}</Button></div>}
    </Card>
  </div>;
}

export function ProcessPage() {
  const [monitor, setMonitor] = useState<typeof interviews[number]>();
  const columns = [
    {...textCol('面试编号','code',190),fixed:'left' as const},
    {title:'候选人',dataIndex:'candidate',width:110,render:(v:string)=><Button type="link">{v}</Button>},
    textCol('项目 / 岗位','job',190), textCol('当前轮次','round',120), textCol('负责人','owner',90),
    statusCol('链接状态','linkStatus',100), statusCol('面试状态','status',100),
    {title:'在线状态',dataIndex:'online',width:90,render:(v:string)=><Tag color={v==='在线'?'green':'default'}>{v}</Tag>},
    {title:'剩余时间',dataIndex:'remaining',width:90,render:(v:string)=><b className={v==='08:42'?'danger-text':''}>{v}</b>},
    {title:'评分进度',dataIndex:'score',width:130,render:(v:number)=><Progress percent={v} size="small" status={v===45?'exception':'normal'} />},
    {title:'异常',dataIndex:'risk',width:130,render:(v:string)=><span className="danger-text">{v&&<><WarningOutlined /> {v}</>}</span>},
  ];
  return <><BusinessList title="进程管理" description="实时跟踪面试、链接、评分和异常状态" stats={[
    {label:'待发送',value:18},{label:'已发送',value:126},{label:'待面试',value:86},{label:'面试中',value:12,tone:'green'},{label:'待审核',value:28,tone:'orange'},{label:'异常',value:7,tone:'red'},
  ]} data={interviews as unknown as Record<string,unknown>[] & {key:string}[]} columns={columns} primaryAction="发起邀约" filterNames={['候选人 / 面试编号','项目','岗位','招聘专员','当前轮次','面试状态','链接状态']} headerExtra={<Button icon={<VideoCameraOutlined />} onClick={()=>setMonitor(interviews[0])}>实时监控</Button>} />
  <Drawer open={!!monitor} onClose={()=>setMonitor(undefined)} width={720} title={`实时监控 · ${monitor?.candidate}`} extra={<StatusTag status="面试中" />}>
    <div className="monitor-stage"><VideoCameraOutlined /><b>候选人视频画面</b><span>录制中 · 1080P</span></div>
    <Row gutter={12} className="monitor-stats"><Col span={6}><Card size="small"><span>当前题目</span><b>6 / 10</b></Card></Col><Col span={6}><Card size="small"><span>剩余时间</span><b className="danger-text">08:42</b></Card></Col><Col span={6}><Card size="small"><span>网络状态</span><b>72ms</b></Card></Col><Col span={6}><Card size="small"><span>AI 分析</span><b>进行中</b></Card></Col></Row>
    <Card size="small" title="当前题目" className="monitor-card"><b>请描述一次你处理复杂客户技术问题的完整过程。</b><p className="transcript">“当时客户的核心系统在业务高峰出现间歇性超时，我先通过监控指标定位到连接池饱和……”</p></Card>
    <Alert type="warning" showIcon message="候选人网络存在波动" description="过去 3 分钟出现 2 次短时丢包，录制未中断。" />
    <Divider titlePlacement="start">监控操作</Divider><Space><Button icon={<PauseCircleOutlined />}>暂停面试</Button><Button icon={<ClockCircleOutlined />}>延长 10 分钟</Button><Button danger>结束面试</Button><Button danger type="primary">强制关闭</Button></Space>
    <Divider titlePlacement="start">操作日志</Divider><Timeline items={[{color:'green',children:'16:30:18 候选人完成身份认证'},{color:'blue',children:'16:31:04 面试开始，录制服务正常'},{color:'orange',children:'16:42:36 检测到网络波动'}]} />
  </Drawer></>;
}

export function ExceptionPage() {
  const [tab,setTab]=useState('已过期');
  const [filters,setFilters]=useState<InterviewFilterValue>({});
  const data=useMemo(()=>applyInterviewFilters(interviews.filter(x=>x.risk),filters).map(x=>({...x,status:tab})),[filters,tab]);
  return <div><PageHeader title="废弃与异常" description="处理链接失效、发送失败和 AI 结果异常" />
    <InterviewFilterBar value={filters} onChange={setFilters} statusOptions={['已过期','已废弃','发送失败','认证失败','面试中断','结果回传失败','评分异常']} />
    <Card><Tabs activeKey={tab} onChange={setTab} items={['已过期','已废弃','发送失败','认证失败','面试中断','结果回传失败','评分异常'].map(x=>({key:x,label:x}))} />
      <Table dataSource={data} columns={[textCol('面试编号','code',190),textCol('候选人','candidate'),textCol('项目 / 岗位','job',220),statusCol('异常类型','status'),textCol('失效 / 异常原因','risk',180),textCol('操作人','owner'),{title:'操作',render:()=> <Space><Button type="link">查看详情</Button><Button type="primary" size="small" icon={<LinkOutlined />} onClick={()=>Modal.confirm({title:'重新发起面试链接？',content:'将生成全新链接，旧链接保持失效并保留完整时间线。',okText:'确认重新发起',onOk:()=>message.success('新链接已生成')})}>重新发起</Button></Space>}]} /></Card>
  </div>;
}

export function ReviewPage() {
  const [detail,setDetail]=useState(false);
  const [filters,setFilters]=useState<InterviewFilterValue>({});
  const items=useMemo(()=>applyInterviewFilters(interviews.filter(x=>x.status==='待审核'),filters),[filters]);
  return <div><PageHeader title="待审核" description="审核 AI 面试结果并推进候选人流程" extra={<Radio.Group defaultValue="card" optionType="button" options={[{value:'card',label:'卡片'},{value:'table',label:'表格'}]} />} />
    <InterviewFilterBar value={filters} onChange={setFilters} statusOptions={['待审核','即将超时','存在风险','建议通过','建议淘汰']} />
    <Row gutter={[14,14]}>{items.concat(items).map((x,i)=><Col span={8} key={`${x.key}-${i}`}><Card className="candidate-card" hoverable onClick={()=>setDetail(true)}><div className="candidate-top"><div className="candidate-avatar">{x.candidate.slice(-1)}</div><div><h3>{x.candidate}</h3><p>{x.job}</p></div><b className="score">{x.score}</b></div><Divider /><Space wrap><StatusTag status="建议通过" />{x.risk&&<Tag color="red">{x.risk}</Tag>}<Tag>AI 首轮</Tag></Space><div className="candidate-meta"><span>完成于 {x.updated}</span><span>剩余审核 18h</span></div></Card></Col>)}</Row>
    <Drawer open={detail} onClose={()=>setDetail(false)} width="88%" title="候选人审核 · 程砚秋"><Row gutter={24}><Col span={15}><Tabs items={['AI 摘要','面试转写','录音录像','题目与回答','简历'].map((x,i)=>({key:String(i),label:x,children:<Card><Alert type="success" showIcon message="AI 综合建议：通过" description="候选人具备良好的问题定位、客户沟通和跨团队协作能力。回答结构完整，技术场景真实性较高。" /><Divider /><h3>能力亮点</h3><p>能够使用分层排查方式快速缩小故障范围，并主动同步客户预期；对云产品监控与网络诊断工具有实际使用经验。</p><h3>关注项</h3><p>大型客户应急响应经验仍需在人工复试中进一步确认。</p></Card>}))} /></Col><Col span={9}><Card title="分项评分"><List dataSource={[['问题定位',92],['技术基础',86],['客户沟通',90],['协作意识',84]]} renderItem={x=><List.Item><span>{x[0]}</span><Progress percent={Number(x[1])} style={{width:160}} /></List.Item>} /><Divider /><Form layout="vertical"><Form.Item label="审核意见"><Input.TextArea rows={4} placeholder="填写审核意见" /></Form.Item><Space direction="vertical" style={{width:'100%'}}><Button block type="primary" onClick={()=>message.success('已通过并进入下一轮')}>通过并进入下一轮</Button><Button block>直接通过</Button><Button block danger onClick={()=>Modal.confirm({title:'驳回并释放到公海？',content:<Input.TextArea placeholder="驳回原因（必填）" />,okText:'确认驳回'})}>驳回并释放公海</Button></Space></Form></Card></Col></Row></Drawer>
  </div>;
}

export function PassedPage() {
  const [target,setTarget]=useState<RecordType>();
  const [decision,setDecision]=useState<'complete'|'second'>('second');
  const [submitting,setSubmitting]=useState(false);
  const [meeting,setMeeting]=useState<FeishuMeetingRecord>();
  const [form]=Form.useForm();
  const close=()=>{setTarget(undefined);setMeeting(undefined);setDecision('second');form.resetFields();};
  const submit=async()=>{
    if(decision==='complete'){
      const values=await form.validateFields(['finalResult','comment']);
      message.success(`${target?.candidate}的面试已完成，结果已写入台账`);
      localStorage.setItem(`zhimian:completed:${target?.key}`,JSON.stringify(values));
      close();
      return;
    }
    const values=await form.validateFields(['scheduledAt','interviewers','duration']);
    setSubmitting(true);
    try{
      const created=await mockFeishuService.createMeeting({
        candidate:String(target?.candidate),
        project:String(target?.project),
        job:String(target?.job),
        scheduledAt:values.scheduledAt.format('YYYY-MM-DD HH:mm'),
        interviewers:values.interviewers,
        duration:values.duration,
      });
      setMeeting(created);
      message.success('飞书会议已创建，二轮面试已写入台账');
    }finally{setSubmitting(false);}
  };
  const syncResult=async()=>{
    if(!meeting)return;
    setSubmitting(true);
    try{
      const synced=await mockFeishuService.syncMeetingResult(meeting.meetingId);
      if(synced)setMeeting(synced);
      message.success('飞书录制、妙记与评价已同步至面试台账');
    }finally{setSubmitting(false);}
  };
  return <><BusinessList title="面试通过" description="评估是否结束流程，或创建飞书视频会议发起二轮人工面试" stats={[{label:'待评估',value:18},{label:'待二轮面试',value:8},{label:'等待飞书回传',value:6},{label:'面试完成',value:32,tone:'green'}]} data={interviews.filter(x=>x.score>80).map(x=>({...x,status:x.round==='客户面'?'待评估':'待决定'})) as unknown as RecordType[]} columns={[textCol('候选人','candidate'),textCol('项目 / 岗位','job',220),textCol('当前轮次','round'),{title:'AI 总分',dataIndex:'score',width:100},statusCol(),textCol('负责人','owner'),textCol('更新时间','updated')]} primaryAction="批量评估" filterNames={['候选人 / 面试编号','项目','岗位','负责人','当前轮次','通过状态']} rowActions={record=><Button type="link" size="small" icon={<VideoCameraOutlined />} onClick={()=>{setTarget(record);setDecision(Number(record.score)>=90?'complete':'second');}}>评估去向</Button>} />
    <Modal open={!!target} onCancel={close} width={760} title={`面试去向评估 · ${target?.candidate}`} footer={meeting?[
      <Button key="records" href="/records">查看面试台账</Button>,
      meeting.syncStatus!=='已同步'&&<Button key="sync" loading={submitting} onClick={syncResult}>模拟面试结束并同步结果</Button>,
      <Button key="done" type="primary" onClick={close}>完成</Button>,
    ]:[
      <Button key="cancel" onClick={close}>取消</Button>,
      <Button key="submit" type="primary" loading={submitting} onClick={submit}>{decision==='second'?'创建飞书会议并发起二轮':'确认完成面试'}</Button>,
    ]}>
      {meeting?<Result status="success" title="二轮飞书会议已创建" subTitle={`${meeting.scheduledAt} · ${meeting.interviewers}`} extra={<Space><Button type="primary" href={meeting.meetingUrl} target="_blank" icon={<LinkOutlined />}>打开飞书会议</Button><StatusTag status={meeting.syncStatus} /></Space>}>
        <Descriptions bordered size="small" column={1}><Descriptions.Item label="会议 ID">{meeting.meetingId}</Descriptions.Item><Descriptions.Item label="会议链接">{meeting.meetingUrl}</Descriptions.Item><Descriptions.Item label="台账编号">{meeting.code}</Descriptions.Item>{meeting.resultSummary&&<Descriptions.Item label="回传结果">{meeting.resultSummary}</Descriptions.Item>}</Descriptions>
      </Result>:<><Alert type={Number(target?.score)>=90?'success':'info'} showIcon message={Number(target?.score)>=90?'AI 建议：可完成面试':'AI 建议：进行二轮人工面试'} description={`AI 总分 ${target?.score}。${Number(target?.score)>=90?'候选人综合能力达到直接通过标准，可结束面试流程；如需进一步确认，也可发起二轮。':'建议通过人工面试重点验证复杂场景处理和客户沟通能力。'}`} />
        <Radio.Group className="decision-cards" value={decision} onChange={event=>setDecision(event.target.value)}>
          <Radio.Button value="complete">完成面试</Radio.Button><Radio.Button value="second">发起二轮人工面试</Radio.Button>
        </Radio.Group>
        <Form form={form} layout="vertical" initialValues={{scheduledAt:dayjs().add(1,'day').hour(14).minute(0),interviewers:['陈砚'],duration:60,finalResult:'最终通过'}}>
          {decision==='complete'?<><Form.Item name="finalResult" label="最终结果" rules={[{required:true}]}><Select options={['最终通过','进入 Offer 审批','人才储备'].map(value=>({value,label:value}))} /></Form.Item><Form.Item name="comment" label="结论说明" rules={[{required:true,message:'请填写面试结论'}]}><Input.TextArea rows={3} placeholder="填写完成面试的判断依据" /></Form.Item></>:<><Row gutter={16}><Col span={12}><Form.Item name="scheduledAt" label="二轮面试时间" rules={[{required:true}]}><DatePicker showTime style={{width:'100%'}} /></Form.Item></Col><Col span={12}><Form.Item name="duration" label="会议时长（分钟）" rules={[{required:true}]}><Select options={[30,45,60,90].map(value=>({value,label:`${value} 分钟`}))} /></Form.Item></Col></Row><Form.Item name="interviewers" label="二轮面试官" rules={[{required:true,message:'请选择面试官'}]}><Select mode="multiple" options={['陈砚','梁序','顾清禾','林嘉树'].map(value=>({value,label:`${value} · 空闲`}))} /></Form.Item><Card size="small" className="feishu-connector"><Space><VideoCameraOutlined /><div><b>飞书视频会议</b><p>创建会议后自动发送候选人与面试官，并同步飞书日历。</p></div><Tag color="green">已启用</Tag></Space></Card></>}
        </Form>
        <Alert className="result-sync-note" type="info" showIcon message="飞书结果记录获取方式" description="会议结束事件由飞书事件订阅回调后端；后端使用会议 ID 获取会议详情、录制文件和飞书妙记，再将面试官评价与转写写入面试台账。" /></>}
    </Modal>
  </>;
}
