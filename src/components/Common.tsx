import { useState, type ReactNode } from 'react';
import {
  Alert, Button, Card, Checkbox, Descriptions, Divider, Drawer, Empty, Form,
  Input, message, Modal, Progress, Result, Select, Space, Spin, Steps, Table,
  Tag, Timeline, Tooltip, Upload,
} from 'antd';
import {
  CheckCircleFilled, ClockCircleFilled, CloseCircleFilled, CloudUploadOutlined,
  DownloadOutlined, ExclamationCircleFilled, EyeOutlined, FileExcelOutlined,
  InboxOutlined, InfoCircleOutlined, ReloadOutlined,
} from '@ant-design/icons';

const colorMap: Record<string, string> = {
  '进行中':'processing','招聘中':'processing','面试中':'processing','已访问':'processing',
  '已发送':'blue','待面试':'blue','待评分':'orange','待审核':'orange','审批中':'orange',
  '异常':'error','发送失败':'error','评分异常':'error','已驳回':'error','紧急':'error',
  '通过':'success','已通过':'success','已完成':'success','启用':'success','最终通过':'success',
  '已归档':'default','已过期':'default','已废弃':'default','暂停':'default','草稿':'default',
};

export function StatusTag({ status }: { status?: string }) {
  if (!status) return <Tag>--</Tag>;
  const color = colorMap[status] || (status.includes('失败') ? 'error' : status.includes('待') ? 'warning' : 'default');
  const icon = color === 'error' ? <CloseCircleFilled /> : color === 'success' ? <CheckCircleFilled /> :
    color === 'processing' ? <ClockCircleFilled /> : undefined;
  return <Tag color={color} icon={icon}>{status}</Tag>;
}

export function StatCard({ label, value, trend, active, onClick, tone = 'blue' }: {
  label:string; value:string|number; trend?:string; active?:boolean; onClick?:()=>void; tone?:string;
}) {
  return (
    <Card className={`stat-card ${active ? 'active' : ''}`} onClick={onClick} hoverable={!!onClick}>
      <div className={`stat-accent ${tone}`} />
      <div className="stat-label">{label}<Tooltip title="示例口径，数据每 5 分钟更新"><InfoCircleOutlined /></Tooltip></div>
      <div className="stat-value">{value}</div>
      {trend && <div className={trend.startsWith('+') ? 'trend up' : 'trend'}>{trend} <span>较上月</span></div>}
    </Card>
  );
}

export function PageHeader({ title, description, extra }: { title:string; description:string; extra?:ReactNode }) {
  return <div className="page-heading"><div><h1>{title}</h1><p>{description}</p></div><Space>{extra}</Space></div>;
}

export function EmptyState({ type = 'empty', onRetry }: { type?:string; onRetry?:()=>void }) {
  if (type === '403') return <Result status="403" title="暂无访问权限" subTitle="当前角色的数据范围不包含此页面" extra={<Button type="primary">申请权限</Button>} />;
  if (type === 'error') return <Result status="error" title="数据加载失败" subTitle="网络连接异常，请稍后重试" extra={<Button icon={<ReloadOutlined />} onClick={onRetry}>重新加载</Button>} />;
  return <Empty description={type === 'search' ? '未找到符合条件的数据' : '暂无数据'}><Button type="primary">创建第一条数据</Button></Empty>;
}

export function DetailDrawer({ open, onClose, title, record }: {
  open:boolean; onClose:()=>void; title:string; record?:Record<string, unknown>;
}) {
  return (
    <Drawer open={open} onClose={onClose} width={620} title={title} extra={<Button type="primary">查看完整详情</Button>}>
      <Alert type="info" showIcon message="信息来自 Mock Service，可替换为真实接口" />
      <Descriptions column={1} bordered size="small" style={{ marginTop:16 }}>
        {Object.entries(record || {}).filter(([k]) => k !== 'key').slice(0, 10).map(([k,v]) =>
          <Descriptions.Item key={k} label={k}>{String(v)}</Descriptions.Item>)}
      </Descriptions>
      <Divider titlePlacement="start">操作时间线</Divider>
      <Timeline items={[
        { color:'blue', children:'今天 16:42 记录信息更新' },
        { color:'green', children:'今天 14:18 系统校验通过' },
        { color:'gray', children:'09-02 10:30 创建记录' },
      ]} />
    </Drawer>
  );
}

export function ImportWizard({ open, onClose }: { open:boolean; onClose:()=>void }) {
  const [step, setStep] = useState(0);
  const finish = () => { message.success('导入完成：成功 8 条，失败 2 条'); setStep(3); };
  return (
    <Modal open={open} onCancel={onClose} width={760} title="导入 Excel" footer={[
      <Button key="cancel" onClick={onClose}>取消</Button>,
      step > 0 && <Button key="back" onClick={()=>setStep(step-1)}>上一步</Button>,
      step < 3 && <Button key="next" type="primary" onClick={()=>step === 2 ? finish() : setStep(step+1)}>{step===2?'开始导入':'下一步'}</Button>,
      step === 3 && <Button key="done" type="primary" onClick={onClose}>查看数据</Button>,
    ]}>
      <Steps current={step} size="small" items={['上传文件','字段映射','数据预览','导入结果'].map(title=>({title}))} />
      <div className="wizard-content">
        {step === 0 && <><Button icon={<DownloadOutlined />}>下载固定模板</Button><Upload.Dragger accept=".xlsx,.xls" beforeUpload={()=>false} style={{marginTop:16}}><p className="ant-upload-drag-icon"><InboxOutlined /></p><p>拖拽 Excel 文件到此处，或点击上传</p><p className="hint">支持 .xlsx/.xls，文件不超过 20MB</p></Upload.Dragger></>}
        {step === 1 && <Form layout="vertical"><Alert message="已自动识别 9 个字段，其中 3 个必填字段" type="success" showIcon/><div className="mapping-row"><b>候选人姓名 *</b><span>→</span><Select value="姓名" options={[{value:'姓名'}]} /></div><div className="mapping-row"><b>手机号 *</b><span>→</span><Select value="联系电话" options={[{value:'联系电话'}]} /></div><div className="mapping-row"><b>目标岗位 *</b><span>→</span><Select value="应聘职位" options={[{value:'应聘职位'}]} /></div></Form>}
        {step === 2 && <><Alert message="共 10 条：8 条可导入，1 条重复，1 条格式错误" type="warning" showIcon/><Table size="small" pagination={false} dataSource={[{key:1,name:'左君怡',phone:'zuojunyi@36w.cn',result:'可导入'},{key:2,name:'韩龙',phone:'hanlong@36w.cn',result:'疑似重复'},{key:3,name:'王佳洁',phone:'邮箱格式待确认',result:'错误'}]} columns={[{title:'姓名',dataIndex:'name'},{title:'邮箱',dataIndex:'phone'},{title:'检测结果',dataIndex:'result',render:(value:string)=><StatusTag status={value} />}]} /></>}
        {step === 3 && <Result status="warning" title="部分导入成功" subTitle="成功 8 条，失败 2 条，已生成导入报告" extra={<Button icon={<FileExcelOutlined />}>下载失败明细</Button>} />}
      </div>
    </Modal>
  );
}

export function ExportModal({ open, onClose, selected = 0 }: { open:boolean; onClose:()=>void; selected?:number }) {
  return <Modal open={open} onCancel={onClose} title="导出数据" okText="创建导出任务" onOk={()=>{message.success('导出任务已创建，可在下载中心查看进度');onClose();}}>
    <Form layout="vertical"><Form.Item label="导出范围"><Select defaultValue={selected ? 'selected':'filtered'} options={[{value:'filtered',label:'当前筛选结果（预计 128 条）'},{value:'selected',label:`已选记录（${selected} 条）`,disabled:!selected}]} /></Form.Item><Form.Item label="导出字段"><Checkbox.Group defaultValue={['base','status','owner']} options={[{label:'基础信息',value:'base'},{label:'状态信息',value:'status'},{label:'负责人',value:'owner'},{label:'操作记录',value:'logs'}]} /></Form.Item><Alert message="手机号、邮箱等敏感字段将按当前角色权限自动脱敏。大数据量导出会转为后台任务。" type="info" showIcon /></Form>
  </Modal>;
}

export function LoadingBlock() {
  return <div className="loading-block"><Spin size="large" /><span>正在加载业务数据...</span></div>;
}

export const ActionButton = ({ onClick, children='查看详情' }: { onClick?:()=>void; children?:ReactNode }) =>
  <Button type="link" size="small" icon={<EyeOutlined />} onClick={onClick}>{children}</Button>;
