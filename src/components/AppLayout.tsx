import { useMemo, useState } from 'react';
import { useLocation, useNavigate, Outlet } from 'react-router-dom';
import {
  Avatar, Badge, Breadcrumb, Button, Divider, Dropdown, Input, Layout, Menu,
  Modal, Result, Select, Space, Tooltip, Typography,
} from 'antd';
import {
  BellOutlined, BulbOutlined, DownOutlined, HistoryOutlined, MenuFoldOutlined,
  MenuUnfoldOutlined, PlusOutlined, QuestionCircleOutlined, SearchOutlined,
  SettingOutlined, UserOutlined,
} from '@ant-design/icons';
import { navigation, pageMeta, type NavItem } from '../config/navigation';
import { roles, useApp } from '../context/AppContext';
import { candidates, jobs, projects } from '../services/mock';

const { Sider, Header, Content } = Layout;

export function AppLayout() {
  const [collapsed, setCollapsed] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { userName, role, setRole, dataScope } = useApp();
  const meta = pageMeta[location.pathname] || { title:'业务详情', description:'智面智能面试管理后台' };
  const restrictedPrefixes: Partial<Record<typeof role, string[]>> = {
    '数据观察员':['/dashboard','/records','/calendar','/analytics'],
    '外部客户':['/dashboard','/projects','/jobs','/records'],
    '面试官':['/dashboard','/interviews/process','/interviews/review','/records','/calendar'],
    '审核人员':['/dashboard','/interviews/review','/approvals','/records'],
  };
  const allowedPrefixes = restrictedPrefixes[role];
  const canAccess = !allowedPrefixes || allowedPrefixes.some(prefix=>location.pathname.startsWith(prefix));
  const searchResults = useMemo(() => ({
    projects: projects.filter(x=>`${x.name}${x.code}`.includes(query)).slice(0,2),
    jobs: jobs.filter(x=>`${x.name}${x.code}`.includes(query)).slice(0,2),
    candidates: candidates.filter(x=>x.includes(query)).slice(0,2),
  }), [query]);

  const menuItems = navigation.map((item:NavItem)=>{
    const children=item.children?.filter(x=>!allowedPrefixes||allowedPrefixes.some(prefix=>x.key.startsWith(prefix))).map(x=>({key:x.key,label:x.label}));
    return { key:item.key, label:item.label, icon:item.icon, children };
  }).filter(item=>!allowedPrefixes||item.key==='/dashboard'||(item.children&&item.children.length>0));
  const selected = location.pathname;
  const parent = navigation.find(x=>x.children?.some(y=>selected.startsWith(y.key)));
  const breadcrumbs = [{title:parent?.label || '智面'}, {title:meta.title}];

  return (
    <Layout className="app-shell">
      <Sider width={240} collapsedWidth={64} collapsed={collapsed} className="sidebar">
        <div className="brand" onClick={()=>navigate('/dashboard')}>
          <div className="brand-mark">智</div>{!collapsed && <div><strong>智面</strong><span>AI Interview OS</span></div>}
        </div>
        <div className="sidebar-nav">
          <Menu theme="dark" mode="inline" selectedKeys={[selected]} defaultOpenKeys={parent ? [parent.key] : []} items={menuItems} onClick={({key})=>key.startsWith('/')&&navigate(key)} />
        </div>
        {!collapsed && <div className="scope-card"><span>当前数据范围</span><b>{dataScope}</b><Button type="link" size="small">查看权限</Button></div>}
      </Sider>
      <Layout>
        <Header className="topbar">
          <Space size={14}>
            <Button type="text" icon={collapsed?<MenuUnfoldOutlined />:<MenuFoldOutlined />} onClick={()=>setCollapsed(!collapsed)} />
            <Breadcrumb items={breadcrumbs} />
          </Space>
          <Space size={8}>
            <Input className="global-search" prefix={<SearchOutlined />} placeholder="搜索项目、岗位、候选人、面试编号" readOnly onClick={()=>setSearchOpen(true)} />
            <Dropdown menu={{items:[
              {key:'project',label:'新建项目'},{key:'job',label:'新建岗位'},{key:'candidate',label:'录入候选人'},{key:'invite',label:'发起面试邀约'},
            ],onClick:({key})=>key==='invite'?navigate('/interviews/invite'):Modal.success({title:'快捷创建',content:'已打开创建表单演示'})}}>
              <Button type="primary" icon={<PlusOutlined />}>快捷创建</Button>
            </Dropdown>
            <Tooltip title="最近访问"><Button type="text" icon={<HistoryOutlined />} /></Tooltip>
            <Tooltip title="通知"><Badge dot offset={[-4,4]}><Button type="text" icon={<BellOutlined />} onClick={()=>navigate('/notifications')} /></Badge></Tooltip>
            <Tooltip title="帮助中心"><Button type="text" icon={<QuestionCircleOutlined />} /></Tooltip>
            <Select className="role-select" value={role} onChange={value=>setRole(value)} options={roles.map(value=>({value,label:value}))} />
            <Dropdown menu={{items:[{key:'profile',label:'个人设置',icon:<UserOutlined />},{key:'setting',label:'通知偏好',icon:<SettingOutlined />},{type:'divider'},{key:'logout',label:'退出登录'}]}}>
              <Space className="user-menu"><Avatar size={30}>{userName.slice(0,1)}</Avatar><span>{userName}</span><DownOutlined /></Space>
            </Dropdown>
          </Space>
        </Header>
        <Content className="main-content">
          <div className="content-inner">{canAccess ? <Outlet /> : <Result status="403" title="暂无访问权限" subTitle={`${role}无法访问该页面，请联系管理员申请业务权限。`} extra={<Button type="primary" onClick={()=>navigate('/dashboard')}>返回工作台</Button>} />}</div>
          <div className="footer-note">智面 · 数据更新时间 2026-09-03 16:50</div>
        </Content>
      </Layout>
      <Modal open={searchOpen} onCancel={()=>setSearchOpen(false)} footer={null} width={640} title="全局搜索">
        <Input autoFocus size="large" prefix={<SearchOutlined />} value={query} onChange={e=>setQuery(e.target.value)} placeholder="输入名称或编号进行模糊搜索" />
        {!query ? <div className="recent-search"><Typography.Text type="secondary">最近搜索</Typography.Text><Space wrap><Button size="small">zj大模型标注</Button><Button size="small">张兰兰</Button><Button size="small">ZM-IV-20260824</Button></Space></div> :
        <div className="search-results">
          <ResultGroup title="项目" items={searchResults.projects.map(x=>({title:x.name,sub:x.code}))} onClick={()=>navigate('/projects')} />
          <ResultGroup title="岗位" items={searchResults.jobs.map(x=>({title:x.name,sub:x.code}))} onClick={()=>navigate('/jobs')} />
          <ResultGroup title="候选人" items={searchResults.candidates.map(x=>({title:x,sub:'候选人 · 手机号已脱敏'}))} onClick={()=>navigate('/talent/private')} />
        </div>}
      </Modal>
    </Layout>
  );
}

function ResultGroup({ title, items, onClick }:{title:string;items:{title:string;sub:string}[];onClick:()=>void}) {
  if (!items.length) return null;
  return <div className="result-group"><b>{title}</b>{items.map(item=><div className="result-item" key={item.title} onClick={onClick}><BulbOutlined /><div><strong>{item.title}</strong><span>{item.sub}</span></div></div>)}<Divider /></div>;
}
