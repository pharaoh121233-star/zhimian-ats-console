import { createContext, useContext, useMemo, useState, type ReactNode } from 'react';

export const roles = ['超级管理员','项目经理','岗位负责人','招聘专员','面试官','审核人员','数据观察员','外部客户'] as const;
export type Role = typeof roles[number];

type ContextValue = {
  userName: string;
  role: Role;
  setRole: (role: Role) => void;
  compact: boolean;
  setCompact: (compact: boolean) => void;
  canEdit: boolean;
  canDelete: boolean;
  dataScope: string;
};

const AppContext = createContext<ContextValue | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>('超级管理员');
  const [compact, setCompact] = useState(false);
  const value = useMemo(() => ({
    userName: '李延财',
    role, setRole, compact, setCompact,
    canEdit: !['数据观察员','外部客户'].includes(role),
    canDelete: role === '超级管理员',
    dataScope: role === '超级管理员' ? '全部组织数据' :
      role === '项目经理' ? '本人负责的 3 个项目' :
      role === '岗位负责人' ? '本人负责的 6 个岗位' :
      role === '外部客户' ? '已授权的 1 个项目' : '已授权业务范围',
  }), [role, compact]);
  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const value = useContext(AppContext);
  if (!value) throw new Error('useApp must be used inside AppProvider');
  return value;
}
