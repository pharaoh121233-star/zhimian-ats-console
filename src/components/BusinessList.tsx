import { useEffect, useMemo, useState, type ReactNode } from 'react';
import {
  Badge, Button, Card, Col, Dropdown, Input, message, Progress, Row, Segmented,
  Select, Space, Table, Tooltip, Modal,
} from 'antd';
import type { ColumnsType } from 'antd/es/table';
import {
  AppstoreOutlined, BarsOutlined, CloudDownloadOutlined, CloudUploadOutlined,
  ColumnHeightOutlined, DeleteOutlined, PlusOutlined, ReloadOutlined, SettingOutlined,
} from '@ant-design/icons';
import { useApp } from '../context/AppContext';
import { DetailDrawer, ExportModal, ImportWizard, PageHeader, StatCard, StatusTag } from './Common';
import { jobs, projects } from '../services/mock';

export type RecordType = Record<string, unknown> & { key:string };

export type BusinessListProps = {
  title:string; description:string; stats:{label:string;value:string|number;tone?:string}[];
  data:RecordType[]; columns:ColumnsType<RecordType>; primaryAction?:string; allowBoard?:boolean;
  filterNames?:string[]; filterOptions?:Record<string, {value:string;label:string}[]>; headerExtra?:ReactNode;
  rowActions?:(record:RecordType)=>ReactNode;
};

export function BusinessList({
  title, description, stats, data, columns, primaryAction='新建', allowBoard=true,
  filterNames=['关键词','项目','岗位','负责人','状态'], filterOptions={}, headerExtra, rowActions,
}: BusinessListProps) {
  const { canEdit, canDelete } = useApp();
  const storageKey = `zhimian:deleted:${title}`;
  const readDeletedKeys = () => {
    try {
      return new Set<string>(JSON.parse(localStorage.getItem(storageKey) || '[]'));
    } catch {
      return new Set<string>();
    }
  };
  const [localData, setLocalData] = useState<RecordType[]>(()=> {
    const deletedKeys = readDeletedKeys();
    return data.filter(item=>!deletedKeys.has(String(item.key)));
  });
  const [keyword, setKeyword] = useState('');
  const [view, setView] = useState<string>('表格');
  const [active, setActive] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string,string>>({});
  const [drawer, setDrawer] = useState<RecordType>();
  const [importOpen, setImportOpen] = useState(false);
  const [exportOpen, setExportOpen] = useState(false);
  const [selectedKeys, setSelectedKeys] = useState<React.Key[]>([]);
  useEffect(()=>{
    const deletedKeys = readDeletedKeys();
    setLocalData(data.filter(item=>!deletedKeys.has(String(item.key))));
  },[data, storageKey]);
  const filtered = useMemo(() => localData.filter(item =>
    (!keyword || JSON.stringify(item).toLowerCase().includes(keyword.toLowerCase())) &&
    (!active || JSON.stringify(item).includes(active)) &&
    Object.values(filterValues).every(value=>!value || JSON.stringify(item).includes(value))
  ), [localData, keyword, active, filterValues]);

  const deleteRecords = (keys:React.Key[]) => {
    const affected = localData.filter(item=>keys.includes(item.key));
    Modal.confirm({
      title:`确认删除 ${affected.length} 条${title.replace('管理','')}数据？`,
      icon:<DeleteOutlined style={{color:'#d9363e'}} />,
      content:<div><p>删除后数据将从当前 Mock 列表中移除，且无法撤销。</p><p className="danger-text">影响对象：{affected.slice(0,3).map(item=>String(item.name || item.candidate || item.code)).join('、')}{affected.length>3?' 等':''}</p></div>,
      okText:'确认删除',
      cancelText:'取消',
      okButtonProps:{danger:true},
      onOk:()=>{
        const deletedKeys = readDeletedKeys();
        keys.forEach(key=>deletedKeys.add(String(key)));
        localStorage.setItem(storageKey,JSON.stringify([...deletedKeys]));
        setLocalData(current=>current.filter(item=>!keys.includes(item.key)));
        setSelectedKeys([]);
        message.success(`已删除 ${affected.length} 条数据`);
      },
    });
  };

  const getFilterOptions = (name:string) => {
    if (filterOptions[name]) return filterOptions[name];
    if (name.includes('项目')) return projects.map(item=>({value:item.name,label:item.name}));
    if (name.includes('岗位')) return jobs.map(item=>({value:item.name,label:item.name}));
    if (name.includes('招聘专员') || name.includes('负责人')) return ['许昭','唐宁','苏晚','温言','周谨言'].map(value=>({value,label:value}));
    if (name.includes('轮次')) return ['首轮 AI 面试','二轮人工复试','终试','客户面'].map(value=>({value,label:value}));
    if (name.includes('链接')) return ['待发送','已发送','已访问','进行中','已完成','已过期','发送失败'].map(value=>({value,label:value}));
    return ['待面试','面试中','待评分','待审核','待安排下一轮','待客户面','最终通过','异常'].map(value=>({value,label:value}));
  };

  const enhancedColumns: ColumnsType<RecordType> = [
    ...columns,
    {
      title:'操作', key:'action', fixed:'right', width:150,
      render:(_, record) => <Space size={2}>
        {rowActions?.(record)}
        <Button type="link" size="small" onClick={()=>setDrawer(record)}>查看</Button>
        <Tooltip title={canEdit ? '' : '当前角色为只读权限'}>
          <Button type="link" size="small" disabled={!canEdit} onClick={()=>message.success('已进入编辑模式')}>编辑</Button>
        </Tooltip>
        <Dropdown menu={{items:[
          {key:'copy',label:'复制'},
          {key:'log',label:'操作日志'},
          {key:'archive',label:'归档'},
          ...(canDelete ? [{type:'divider' as const},{key:'delete',label:'删除',danger:true,icon:<DeleteOutlined />}] : []),
        ],onClick:({key})=>key==='delete'?deleteRecords([record.key]):message.info(key==='archive'?'归档前将进行影响范围检查':'操作已记录')}}>
          <Button type="link" size="small">更多</Button>
        </Dropdown>
      </Space>
    },
  ];

  return (
    <div>
      <PageHeader title={title} description={description} extra={<>
        {headerExtra}
        <Tooltip title={canEdit ? '' : '数据观察员仅有查看权限'}>
          <Button type="primary" icon={<PlusOutlined />} disabled={!canEdit} onClick={()=>message.success(`已打开${primaryAction}页面`)}>{primaryAction}</Button>
        </Tooltip>
      </>} />
      <Row gutter={12} className="stats-row">
        {stats.map(item=><Col flex="1" key={item.label}><StatCard {...item} active={active===item.label} onClick={()=>setActive(active===item.label?'':item.label.replace('全部',''))} /></Col>)}
      </Row>
      <Card className="filter-panel">
        <div className="filter-grid">
          {filterNames.map((name,index)=>index===0 ?
            <Input.Search key={name} allowClear placeholder={`搜索${name}`} value={keyword} onChange={e=>setKeyword(e.target.value)} /> :
            <Select key={name} allowClear showSearch optionFilterProp="label" placeholder={name} value={filterValues[name]} onChange={value=>setFilterValues(current=>({...current,[name]:value}))} options={getFilterOptions(name)} />)}
          <Space><Button type="primary" onClick={()=>message.success(`筛选条件已应用，共 ${filtered.length} 条`)}>查询</Button><Button onClick={()=>{setKeyword('');setActive('');setFilterValues({});}}>重置</Button></Space>
        </div>
      </Card>
      <Card className="table-panel">
        <div className="table-toolbar">
          <Space>
            {allowBoard && <Segmented value={view} onChange={setView} options={[{label:'表格',value:'表格',icon:<BarsOutlined />},{label:'看板',value:'看板',icon:<AppstoreOutlined />}]} />}
            {selectedKeys.length > 0 && <Badge count={selectedKeys.length} color="#1677ff"><Button>已选数据</Button></Badge>}
            {canDelete && selectedKeys.length > 0 && <Button danger icon={<DeleteOutlined />} onClick={()=>deleteRecords(selectedKeys)}>批量删除</Button>}
          </Space>
          <Space>
            <Button icon={<CloudUploadOutlined />} onClick={()=>setImportOpen(true)}>导入</Button>
            <Button icon={<CloudDownloadOutlined />} onClick={()=>setExportOpen(true)}>导出</Button>
            <Tooltip title="列设置"><Button icon={<SettingOutlined />} /></Tooltip>
            <Tooltip title="紧凑密度"><Button icon={<ColumnHeightOutlined />} /></Tooltip>
            <Tooltip title="刷新"><Button icon={<ReloadOutlined />} onClick={()=>message.success('数据已刷新')} /></Tooltip>
          </Space>
        </div>
        {view === '表格' ? <Table
          rowSelection={{selectedRowKeys:selectedKeys,onChange:setSelectedKeys}}
          dataSource={filtered} columns={enhancedColumns} scroll={{x:1300}}
          pagination={{pageSize:8,showSizeChanger:true,showTotal:t=>`共 ${t} 条`}}
        /> : <div className="board-grid">{['进行中','待处理','已完成','已归档'].map(status=>
          <div className="board-column" key={status}><h3>{status}<Badge count={filtered.filter(x=>String(x.status).includes(status.slice(0,2))).length} showZero /></h3>
            {filtered.slice(0,3).map(item=><Card key={`${status}-${item.key}`} size="small" hoverable onClick={()=>setDrawer(item)}>
              <b>{String(item.name || item.candidate || item.title)}</b><p>{String(item.code || item.project || '')}</p>
              {item.progress !== undefined && <Progress size="small" percent={Number(item.progress)} />}
              <div className="board-card-footer"><StatusTag status={String(item.status || status)} />{canDelete&&<Button danger type="link" size="small" icon={<DeleteOutlined />} onClick={event=>{event.stopPropagation();deleteRecords([item.key]);}}>删除</Button>}</div>
            </Card>)}
          </div>)}</div>}
      </Card>
      <DetailDrawer open={!!drawer} onClose={()=>setDrawer(undefined)} title={`${title}详情`} record={drawer} />
      <ImportWizard open={importOpen} onClose={()=>setImportOpen(false)} />
      <ExportModal open={exportOpen} onClose={()=>setExportOpen(false)} selected={selectedKeys.length} />
    </div>
  );
}

export const textCol = (title:string, dataIndex:string, width=140) => ({ title, dataIndex, width, ellipsis:true });
export const statusCol = (title='状态', dataIndex='status', width=110) => ({
  title, dataIndex, width, render:(value:string)=><StatusTag status={value} />,
});
export const progressCol = (title='完成率', dataIndex='progress', width=150) => ({
  title, dataIndex, width, sorter:(a:RecordType,b:RecordType)=>Number(a[dataIndex])-Number(b[dataIndex]),
  render:(value:number)=><Progress percent={value} size="small" strokeColor={value<50?'#fa8c16':'#1677ff'} />,
});
