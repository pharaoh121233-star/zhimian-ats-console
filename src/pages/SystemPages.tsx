import { useMemo, useState } from 'react';
import {
  Alert, Avatar, Badge, Button, Card, Checkbox, Col, Descriptions, Drawer, Form,
  Input, List, message, Modal, Progress, Radio, Row, Select, Space, Statistic,
  Switch, Table, Tabs, Tag, Timeline, Tree,
} from 'antd';
import {
  ApiOutlined, AuditOutlined, CheckCircleFilled, EditOutlined, ExperimentOutlined,
  FileTextOutlined, LockOutlined, MailOutlined, PlusOutlined, ProjectOutlined,
  SafetyCertificateOutlined, SendOutlined, SettingOutlined, TeamOutlined,
  VideoCameraOutlined,
} from '@ant-design/icons';
import { PageHeader, StatCard, StatusTag } from '../components/Common';
import { jobs, projects } from '../services/mock';
import { roles, type Role, useApp } from '../context/AppContext';

const people = [
  {key:'1',name:'周谨言',role:'超级管理员',account:'zhou.jinyan',project:'全部项目',job:'全部岗位',scope:'全部组织数据',status:'启用'},
  {key:'2',name:'沈知行',role:'项目经理',account:'shen.zhixing',project:projects[1].name,job:'项目下全部岗位',scope:'本人负责项目',status:'启用'},
  {key:'3',name:'顾清禾',role:'岗位负责人',account:'gu.qinghe',project:projects[1].name,job:jobs[0].name,scope:'本人负责岗位',status:'启用'},
  {key:'4',name:'林嘉树',role:'项目经理',account:'lin.jiashu',project:projects[2].name,job:'项目下全部岗位',scope:'本人负责项目',status:'启用'},
  {key:'5',name:'许昭',role:'招聘专员',account:'xu.zhao',project:projects[1].name,job:jobs[0].name,scope:'已分配岗位',status:'启用'},
  {key:'6',name:'唐宁',role:'招聘专员',account:'tang.ning',project:projects[0].name,job:jobs[1].name,scope:'已分配岗位',status:'启用'},
  {key:'7',name:'陈砚',role:'面试官',account:'chen.yan',project:projects[1].name,job:jobs[0].name,scope:'参与的面试',status:'启用'},
  {key:'8',name:'苏晚',role:'审核人员',account:'su.wan',project:projects[0].name,job:jobs[2].name,scope:'授权审核范围',status:'启用'},
];

export function OrganizationPage() {
  const [selected,setSelected]=useState(`p-${projects[0].key}`);
  const [drawer,setDrawer]=useState(false);
  const treeData=projects.map(project=>({key:`p-${project.key}`,title:project.name,icon:<ProjectOutlined />,children:jobs.filter(job=>job.project===project.name).map(job=>({key:`j-${job.key}`,title:job.name,icon:<TeamOutlined />}))}));
  const currentProject=selected.startsWith('p-')?projects.find(item=>`p-${item.key}`===selected):projects.find(item=>item.name===jobs.find(job=>`j-${job.key}`===selected)?.project);
  const currentJob=jobs.find(item=>`j-${item.key}`===selected);
  const roster=useMemo(()=>{
    const rows=currentJob?[{name:currentJob.owner,role:'岗位负责人'},{name:currentJob.recruiter,role:'招聘专员'}]:[
      {name:currentProject?.manager||'',role:'项目经理'},
      ...jobs.filter(job=>job.project===currentProject?.name).flatMap(job=>[{name:job.owner,role:'岗位负责人'},{name:job.recruiter,role:'招聘专员'}]),
    ];
    return rows.flatMap(row=>row.name.split('、').map(name=>({key:`${row.role}-${name}`,name,role:row.role,project:currentProject?.name,job:currentJob?.name||'项目下全部岗位',scope:row.role==='项目经理'?'项目全量数据':'负责岗位数据',status:'启用'}))).filter((item,index,array)=>array.findIndex(other=>other.key===item.key)===index);
  },[currentJob,currentProject]);
  return <div><PageHeader title="组织架构" description="按项目、岗位和负责人维护招聘组织与数据归属" extra={<Button type="primary" icon={<PlusOutlined />} onClick={()=>setDrawer(true)}>配置负责人</Button>} />
    <Row gutter={12} className="stats-row"><Col span={6}><StatCard label="项目节点" value={projects.length}/></Col><Col span={6}><StatCard label="岗位节点" value={jobs.length}/></Col><Col span={6}><StatCard label="岗位负责人" value="9"/></Col><Col span={6}><StatCard label="招聘专员" value="6"/></Col></Row>
    <div className="roster-layout"><Card className="roster-tree" title="项目 - 岗位"><Input.Search placeholder="搜索项目或岗位" /><Tree showIcon defaultExpandAll selectedKeys={[selected]} treeData={treeData} onSelect={keys=>keys[0]&&setSelected(String(keys[0]))} /></Card>
      <Card className="roster-content" title={<Space><b>{currentJob?.name||currentProject?.name}</b><Tag color="blue">{currentJob?'岗位':'项目'}</Tag></Space>} extra={<span>共 {roster.length} 人</span>}><Alert type="info" showIcon message={`当前数据范围：${currentJob?'该岗位':'该项目及下属岗位'}`} /><Table dataSource={roster} pagination={false} columns={[{title:'负责人',dataIndex:'name',render:value=><Space><Avatar size={30}>{value.slice(-1)}</Avatar><b>{value}</b></Space>},{title:'职责',dataIndex:'role',render:value=><Tag color={value==='项目经理'?'blue':'cyan'}>{value}</Tag>},{title:'所属项目',dataIndex:'project'},{title:'负责岗位',dataIndex:'job'},{title:'数据范围',dataIndex:'scope'},{title:'状态',dataIndex:'status',render:(value)=><StatusTag status={value}/>},{title:'操作',render:()=> <Button type="link" icon={<EditOutlined />} onClick={()=>setDrawer(true)}>调整</Button>}]} /></Card></div>
    <Drawer open={drawer} onClose={()=>setDrawer(false)} width={520} title="配置项目 / 岗位负责人" extra={<Button type="primary" onClick={()=>{setDrawer(false);message.success('负责人配置已保存');}}>保存</Button>}><Form layout="vertical"><Form.Item label="项目" required><Select defaultValue={currentProject?.name} options={projects.map(item=>({value:item.name,label:item.name}))}/></Form.Item><Form.Item label="岗位"><Select allowClear placeholder="不选择则配置项目负责人" defaultValue={currentJob?.name} options={jobs.filter(item=>item.project===currentProject?.name).map(item=>({value:item.name,label:item.name}))}/></Form.Item><Form.Item label="负责人" required><Select mode="multiple" defaultValue={roster.slice(0,2).map(item=>item.name)} options={people.map(item=>({value:item.name,label:`${item.name} · ${item.role}`}))}/></Form.Item><Form.Item label="数据权限"><Radio.Group defaultValue="负责范围"><Radio value="负责范围">负责范围</Radio><Radio value="只读">只读</Radio></Radio.Group></Form.Item><Alert type="warning" showIcon message="调整后将同步更新成员的数据可见范围和操作权限。" /></Form></Drawer>
  </div>;
}

export function RolesRosterPage() {
  const {setRole}=useApp();
  const [selectedRole,setSelectedRole]=useState<Role>('招聘专员');
  const roster=people.filter(item=>item.role===selectedRole || selectedRole==='超级管理员');
  const permissions=['首页工作台','面试控制台','项目与岗位','题库与评分','面试台账','数据看板','人才库','系统设置'].map((module,index)=>({key:module,module,view:true,create:index<7,edit:index<7,approve:[1,2].includes(index),export:index!==7,delete:selectedRole==='超级管理员'}));
  return <div><PageHeader title="角色与权限" description="按角色查看人员花名册、项目岗位归属和功能权限" extra={<Button type="primary" onClick={()=>{setRole(selectedRole);message.success(`已切换为${selectedRole}预览`);}}>以该角色预览系统</Button>} />
    <Row gutter={14}><Col span={6}><Card title="角色"><List dataSource={[...roles]} renderItem={(item:Role)=><List.Item className={`role-item ${selectedRole===item?'active':''}`} onClick={()=>setSelectedRole(item)}><Space><Avatar icon={<SafetyCertificateOutlined />}/><div><b>{item}</b><span>{people.filter(person=>person.role===item).length||Math.max(1,8-roles.indexOf(item))} 人</span></div></Space></List.Item>} /></Card></Col>
      <Col span={18}><Card><div className="role-summary"><div><h2>{selectedRole}</h2><p>当前角色成员及项目、岗位数据范围</p></div><Space><Tag color="blue">{roster.length} 名成员</Tag><Tag>{selectedRole==='超级管理员'?'全部组织数据':'按项目岗位授权'}</Tag></Space></div><Tabs items={[
        {key:'roster',label:'人员花名册',children:<Table dataSource={roster} columns={[{title:'成员',dataIndex:'name',render:value=><Space><Avatar size={28}>{value.slice(-1)}</Avatar><b>{value}</b></Space>},{title:'账号',dataIndex:'account'},{title:'负责项目',dataIndex:'project'},{title:'负责岗位',dataIndex:'job'},{title:'数据范围',dataIndex:'scope'},{title:'状态',dataIndex:'status',render:value=><StatusTag status={value}/>},{title:'操作',render:()=> <Button type="link">调整授权</Button>}]} />},
        {key:'permission',label:'功能权限',children:<Table dataSource={permissions} pagination={false} columns={[{title:'模块',dataIndex:'module'},{title:'查看',dataIndex:'view',render:value=><Checkbox defaultChecked={value}/>},{title:'新增',dataIndex:'create',render:value=><Checkbox defaultChecked={value}/>},{title:'编辑',dataIndex:'edit',render:value=><Checkbox defaultChecked={value}/>},{title:'审批',dataIndex:'approve',render:value=><Checkbox defaultChecked={value}/>},{title:'导出',dataIndex:'export',render:value=><Checkbox defaultChecked={value}/>},{title:'删除',dataIndex:'delete',render:value=><Checkbox defaultChecked={value} disabled={selectedRole!=='超级管理员'}/>}]} />},
      ]}/></Card></Col></Row>
  </div>;
}

const templates=[
  {key:'1',name:'智面 V2.9.0 版本发布通知',type:'版本通知',channel:'站内信、邮件',audience:'全部用户',status:'启用',updated:'09-08 10:30',summary:'发布新增能力、影响模块和升级时间'},
  {key:'2',name:'飞书二轮面试功能上线',type:'功能通知',channel:'站内信',audience:'项目经理、招聘专员',status:'启用',updated:'09-08 09:20',summary:'介绍飞书建会、结果回传和台账查看方式'},
  {key:'3',name:'招聘专员操作说明书更新',type:'说明书',channel:'邮件',audience:'招聘专员',status:'启用',updated:'09-07 17:40',summary:'候选人导入、邀约与异常处理操作指南'},
  {key:'4',name:'数据看板指标口径说明',type:'说明书',channel:'站内信',audience:'数据观察员、项目经理',status:'草稿',updated:'09-07 14:10',summary:'指标定义、更新时间和下钻方式'},
  {key:'5',name:'系统维护窗口通知',type:'系统公告',channel:'短信、邮件',audience:'管理员',status:'停用',updated:'09-06 16:30',summary:'维护时间、影响范围和应急联系人'},
];

export function NotificationTemplatesPage() {
  const [current,setCurrent]=useState<typeof templates[number]>();
  return <div><PageHeader title="通知模板" description="管理版本发布、功能通知、说明书和系统公告" extra={<Button type="primary" icon={<PlusOutlined />} onClick={()=>setCurrent(templates[0])}>新建模板</Button>} /><Row gutter={12} className="stats-row"><Col span={6}><StatCard label="版本通知" value="8"/></Col><Col span={6}><StatCard label="功能通知" value="12"/></Col><Col span={6}><StatCard label="说明书" value="16"/></Col><Col span={6}><StatCard label="待发布" value="3" tone="orange"/></Col></Row><Card><Tabs items={['全部','版本通知','功能通知','说明书','系统公告'].map(type=>({key:type,label:type,children:<Table dataSource={type==='全部'?templates:templates.filter(item=>item.type===type)} columns={[{title:'模板名称',dataIndex:'name',render:value=><Button type="link">{value}</Button>},{title:'内容类型',dataIndex:'type',render:value=><Tag color="blue">{value}</Tag>},{title:'通知渠道',dataIndex:'channel'},{title:'接收对象',dataIndex:'audience'},{title:'内容摘要',dataIndex:'summary'},{title:'状态',dataIndex:'status',render:value=><StatusTag status={value}/>},{title:'更新时间',dataIndex:'updated'},{title:'操作',render:(_,record)=><Space><Button type="link" onClick={()=>setCurrent(record)}>编辑</Button><Button type="link" icon={<SendOutlined />} onClick={()=>message.success('测试通知已发送')}>测试</Button></Space>}]} />}))} /></Card><Drawer open={!!current} onClose={()=>setCurrent(undefined)} width={620} title="编辑通知模板" extra={<Button type="primary" onClick={()=>{setCurrent(undefined);message.success('模板已保存');}}>保存</Button>}><Form layout="vertical"><Form.Item label="模板名称"><Input defaultValue={current?.name}/></Form.Item><Row gutter={12}><Col span={12}><Form.Item label="内容类型"><Select defaultValue={current?.type} options={['版本通知','功能通知','说明书','系统公告'].map(value=>({value,label:value}))}/></Form.Item></Col><Col span={12}><Form.Item label="接收对象"><Select mode="multiple" defaultValue={['全部用户']} options={roles.map(value=>({value,label:value}))}/></Form.Item></Col></Row><Form.Item label="标题"><Input defaultValue={current?.name}/></Form.Item><Form.Item label="通知正文"><Input.TextArea rows={10} defaultValue={`【${current?.type}】\n\n${current?.summary}\n\n查看完整内容：{{detail_link}}\n发布时间：{{publish_time}}`}/></Form.Item><Alert type="info" showIcon message="可用变量：{{version}}、{{feature_name}}、{{detail_link}}、{{publish_time}}、{{operator}}" /></Form></Drawer></div>;
}

const auditLogs=[
  {key:'1',time:'09-08 15:42:18',user:'周谨言',role:'超级管理员',module:'项目管理',action:'批量删除',object:'3 个测试项目',summary:'删除虚拟项目及关联展示数据',ip:'10.24.18.36',result:'成功'},
  {key:'2',time:'08-25 14:26:09',user:'招聘专员',role:'招聘专员',module:'面试通过',action:'创建飞书会议',object:'张兰兰 · 二轮面试',summary:'创建飞书会议并发送通知',ip:'10.24.20.18',result:'成功'},
  {key:'3',time:'09-08 14:02:31',user:'系统服务',role:'系统',module:'飞书集成',action:'结果回传',object:'oc_26090842',summary:'同步录制、妙记和面试评价',ip:'172.18.0.6',result:'成功'},
  {key:'4',time:'08-25 11:18:45',user:'项目管理员',role:'项目经理',module:'岗位管理',action:'修改负责人',object:'腾讯大模型标注',summary:'更新岗位负责人和招聘专员',ip:'10.24.19.22',result:'成功'},
  {key:'5',time:'08-25 10:06:12',user:'标注业务负责人',role:'岗位负责人',module:'面试台账',action:'导出',object:'8 月 AI 面试记录',summary:'导出 20 条记录',ip:'10.24.18.91',result:'失败'},
];

export function AuditLogPage() {
  const [current,setCurrent]=useState<typeof auditLogs[number]>();
  return <div><PageHeader title="审计日志" description="追踪删除、权限、飞书会议、结果回传及数据导出等敏感操作" extra={<Button icon={<FileTextOutlined />}>导出审计报告</Button>} /><Card className="filter-panel"><div className="filter-grid"><Input.Search placeholder="用户 / 业务对象" /><Select placeholder="模块" options={['项目管理','岗位管理','飞书集成','面试台账','角色权限'].map(value=>({value,label:value}))}/><Select placeholder="操作类型" options={['删除','批量删除','权限变更','创建飞书会议','结果回传','导出'].map(value=>({value,label:value}))}/><Select placeholder="执行结果" options={['成功','失败'].map(value=>({value,label:value}))}/><Button type="primary">查询</Button></div></Card><Card className="table-panel"><Table dataSource={auditLogs} columns={[{title:'操作时间',dataIndex:'time',width:150},{title:'用户',dataIndex:'user'},{title:'角色',dataIndex:'role'},{title:'模块',dataIndex:'module'},{title:'动作',dataIndex:'action',render:value=><Tag color={value.includes('删除')?'red':'blue'}>{value}</Tag>},{title:'业务对象',dataIndex:'object',width:190},{title:'操作摘要',dataIndex:'summary',width:220},{title:'IP',dataIndex:'ip'},{title:'结果',dataIndex:'result',render:value=><StatusTag status={value==='成功'?'已完成':'发送失败'}/>},{title:'操作',render:(_,record)=><Button type="link" onClick={()=>setCurrent(record)}>详情</Button>}]} /></Card><Drawer open={!!current} onClose={()=>setCurrent(undefined)} width={600} title="审计日志详情"><Descriptions bordered column={1} size="small">{Object.entries(current||{}).filter(([key])=>key!=='key').map(([key,value])=><Descriptions.Item key={key} label={key}>{value}</Descriptions.Item>)}</Descriptions><Alert style={{marginTop:16}} type="info" showIcon message="日志不可编辑或删除，保留期限为 365 天。" /><Timeline style={{marginTop:24}} items={[{color:'blue',children:'请求进入权限网关并完成身份校验'},{color:'green',children:'业务操作执行完成'},{color:current?.result==='成功'?'green':'red',children:`审计记录写入：${current?.result}`}]}/></Drawer></div>;
}

export function SystemConfigPage() {
  return <div><PageHeader title="系统配置" description="配置飞书会议、消息通道、登录安全和数据保留策略" extra={<Button type="primary" onClick={()=>message.success('系统配置已保存')}>保存配置</Button>} /><Tabs className="system-tabs" items={[
    {key:'feishu',label:<Space><VideoCameraOutlined />飞书会议集成</Space>,children:<Row gutter={16}><Col span={16}><Card title="飞书开放平台连接" extra={<Badge status="success" text="Mock 环境已启用" />}><Alert type="warning" showIcon message="生产环境凭证必须由后端服务安全托管，前端不得保存 App Secret。" /><Form layout="vertical" className="settings-form"><Row gutter={16}><Col span={12}><Form.Item label="飞书 App ID"><Input defaultValue="cli_a8f2***********" /></Form.Item></Col><Col span={12}><Form.Item label="App Secret"><Input.Password value="zhimian-feishu-secret" /></Form.Item></Col></Row><Form.Item label="事件订阅回调地址"><Input value="https://api.zhimian.example.com/webhooks/feishu/events" addonBefore="POST" /></Form.Item><Form.Item label="订阅事件"><Checkbox.Group defaultValue={['meeting_end','recording_ready','minutes_ready']} options={[{value:'meeting_end',label:'会议结束'},{value:'recording_ready',label:'录制完成'},{value:'minutes_ready',label:'妙记生成'},{value:'meeting_updated',label:'会议信息变更'}]} /></Form.Item><Space><Button type="primary" icon={<ApiOutlined />} onClick={()=>message.success('飞书连接测试成功')}>测试连接</Button><Button>重新获取事件校验信息</Button></Space></Form></Card></Col><Col span={8}><Card title="面试结果同步链路"><Timeline items={[{dot:<CheckCircleFilled />,color:'green',children:<><b>1. 会议结束事件</b><p>接收 meeting_end 回调</p></>},{dot:<ApiOutlined />,color:'blue',children:<><b>2. 拉取会议资产</b><p>按会议 ID 获取详情、录制与妙记</p></>},{dot:<ExperimentOutlined />,color:'blue',children:<><b>3. 汇总评价</b><p>关联面试官评价与候选人</p></>},{dot:<AuditOutlined />,color:'gray',children:<><b>4. 写入面试台账</b><p>保留原始回调和同步日志</p></>}]} /><Alert type="info" showIcon message="失败任务每 5 分钟重试，最多 3 次，之后进入异常中心。" /></Card></Col></Row>},
    {key:'message',label:<Space><MailOutlined />通知通道</Space>,children:<Row gutter={16}><Col span={12}><Card title="邮件通道" extra={<Switch defaultChecked />}><Form layout="vertical"><Form.Item label="SMTP 服务"><Input defaultValue="smtp.zhimian.example.com"/></Form.Item><Form.Item label="发件账号"><Input defaultValue="notice@zhimian.example.com"/></Form.Item><Button>发送测试邮件</Button></Form></Card></Col><Col span={12}><Card title="短信通道" extra={<Switch defaultChecked />}><Form layout="vertical"><Form.Item label="服务商"><Select defaultValue="火山引擎短信" options={[{value:'火山引擎短信',label:'火山引擎短信'}]}/></Form.Item><Form.Item label="签名"><Input defaultValue="智面招聘"/></Form.Item><Button>发送测试短信</Button></Form></Card></Col></Row>},
    {key:'security',label:<Space><LockOutlined />登录与数据</Space>,children:<Row gutter={16}><Col span={12}><Card title="登录安全"><Form layout="vertical"><Form.Item label="统一登录"><Switch defaultChecked /> <span>启用 SSO</span></Form.Item><Form.Item label="会话有效期"><Select defaultValue="8 小时" options={['4 小时','8 小时','12 小时'].map(value=>({value,label:value}))}/></Form.Item><Form.Item label="管理员二次验证"><Switch defaultChecked /></Form.Item></Form></Card></Col><Col span={12}><Card title="数据保留"><Form layout="vertical"><Form.Item label="面试数据保留期限"><Select defaultValue="365 天" options={['180 天','365 天','730 天'].map(value=>({value,label:value}))}/></Form.Item><Form.Item label="导出文件有效期"><Select defaultValue="7 天" options={['3 天','7 天','15 天'].map(value=>({value,label:value}))}/></Form.Item><Form.Item label="默认时区"><Select defaultValue="Asia/Shanghai" options={[{value:'Asia/Shanghai',label:'Asia/Shanghai (UTC+8)'}]}/></Form.Item></Form></Card></Col></Row>},
  ]}/></div>;
}
