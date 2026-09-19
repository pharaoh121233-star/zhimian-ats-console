export type Project = {
  key: string; code: string; name: string; client: string; manager: string;
  jobs: number; target: number; passed: number; progress: number; period: string;
  status: string; risk: string; updated: string;
};

export type Interview = {
  key: string; code: string; candidate: string; project: string; job: string;
  round: string; owner: string; linkStatus: string; status: string; online: string;
  remaining: string; score: number; risk?: string; updated: string;
  email?: string; interviewTime?: string; result?: string;
};

export const projects: Project[] = [
  { key:'img-p1', code:'ZM-PJ-2026-001', name:'kuma', client:'产品与客户服务', manager:'项目管理员', jobs:1, target:5, passed:0, progress:20, period:'08/01 - 12/31', status:'进行中', risk:'正常', updated:'08-25 11:36' },
  { key:'img-p2', code:'ZM-PJ-2026-002', name:'西安-行政岗', client:'西安职场', manager:'行政招聘组', jobs:1, target:8, passed:0, progress:13, period:'08/01 - 10/31', status:'进行中', risk:'正常', updated:'08-25 11:36' },
  { key:'img-p3', code:'ZM-PJ-2026-003', name:'未归属项目', client:'通用招聘需求', manager:'系统管理员', jobs:7, target:40, passed:6, progress:15, period:'08/01 - 12/31', status:'进行中', risk:'待完善归属', updated:'08-25 11:02' },
];

export const jobs = [
  { key:'img-j1', code:'ZM-JD-2026-001', name:'PM', project:projects[0].name, owner:'项目管理员', recruiter:'招聘专员', hc:5, passed:0, gap:5, city:'全国', priority:'普通', status:'招聘中', version:'V1.0', updated:'08-25 11:40' },
  { key:'img-j2', code:'ZM-JD-2026-002', name:'行政专员', project:projects[1].name, owner:'行政招聘组', recruiter:'招聘专员', hc:8, passed:1, gap:7, city:'西安', priority:'高', status:'招聘中', version:'V1.0', updated:'08-25 11:36' },
  { key:'img-j3', code:'ZM-JD-2026-003', name:'zj大模型标注', project:projects[2].name, owner:'标注业务负责人', recruiter:'招聘专员', hc:18, passed:3, gap:15, city:'全国', priority:'高', status:'招聘中', version:'V1.0', updated:'08-25 11:02' },
  { key:'img-j4', code:'ZM-JD-2026-004', name:'腾讯大模型标注', project:projects[2].name, owner:'标注业务负责人', recruiter:'招聘专员', hc:12, passed:3, gap:9, city:'全国', priority:'高', status:'招聘中', version:'V1.0', updated:'08-25 11:02' },
  { key:'img-j5', code:'ZM-JD-2026-005', name:'事业部总经理', project:projects[2].name, owner:'事业部负责人', recruiter:'招聘专员', hc:1, passed:0, gap:1, city:'全国', priority:'普通', status:'招聘中', version:'V1.0', updated:'08-24 18:00' },
  { key:'img-j6', code:'ZM-JD-2026-006', name:'桌面运维工程师', project:projects[2].name, owner:'IT 服务负责人', recruiter:'招聘专员', hc:3, passed:0, gap:3, city:'全国', priority:'普通', status:'招聘中', version:'V1.0', updated:'08-14 18:41' },
  { key:'img-j7', code:'ZM-JD-2026-007', name:'大模型标注', project:projects[2].name, owner:'标注业务负责人', recruiter:'招聘专员', hc:10, passed:0, gap:10, city:'全国', priority:'普通', status:'招聘中', version:'V1.0', updated:'08-14 18:00' },
  { key:'img-j8', code:'ZM-JD-2026-008', name:'短视频审核', project:projects[2].name, owner:'内容安全负责人', recruiter:'招聘专员', hc:6, passed:0, gap:6, city:'全国', priority:'普通', status:'招聘中', version:'V1.0', updated:'08-13 18:37' },
  { key:'img-j9', code:'ZM-JD-2026-009', name:'新媒体运营', project:projects[2].name, owner:'内容运营负责人', recruiter:'招聘专员', hc:8, passed:0, gap:8, city:'全国', priority:'普通', status:'招聘中', version:'V1.0', updated:'08-14 15:41' },
];

export const interviews: Interview[] = [
  { key:'img-i01', code:'ZM-IV-20260825-0020', candidate:'左君怡', project:projects[1].name, job:jobs[1].name, round:'首轮 AI 面试', owner:'招聘专员', linkStatus:'邮件已发送', status:'已完成', online:'离线', remaining:'--', score:68, email:'zuojunyi@36w.cn', interviewTime:'2026/8/25 11:36:25', result:'待复核', updated:'08-25 11:36' },
  { key:'img-i02', code:'ZM-IV-20260825-0019', candidate:'张兰兰', project:projects[2].name, job:jobs[3].name, round:'首轮 AI 面试', owner:'招聘专员', linkStatus:'邮件已发送', status:'已完成', online:'离线', remaining:'--', score:82, email:'jixueying@36w.cn', interviewTime:'2026/8/25 11:02:10', result:'建议通过', updated:'08-25 11:02' },
  { key:'img-i03', code:'ZM-IV-20260824-0018', candidate:'张梦迪', project:projects[2].name, job:jobs[2].name, round:'首轮 AI 面试', owner:'招聘专员', linkStatus:'邮件已发送', status:'已完成', online:'离线', remaining:'--', score:65, email:'2287939310@qq.com', interviewTime:'2026/8/24 17:27:55', result:'待复核', updated:'08-24 17:27' },
  { key:'img-i04', code:'ZM-IV-20260824-0017', candidate:'刘梓瑄', project:projects[2].name, job:jobs[2].name, round:'首轮 AI 面试', owner:'招聘专员', linkStatus:'邮件已发送', status:'已完成', online:'离线', remaining:'--', score:78, email:'1512114078@qq.com', interviewTime:'2026/8/24 17:27:33', result:'建议通过', updated:'08-24 17:27' },
  { key:'img-i05', code:'ZM-IV-20260824-0016', candidate:'易湘曦', project:projects[2].name, job:jobs[2].name, round:'首轮 AI 面试', owner:'招聘专员', linkStatus:'邮件已发送', status:'已完成', online:'离线', remaining:'--', score:15, email:'1305997846@qq.com', interviewTime:'2026/8/24 17:27:08', result:'建议淘汰', updated:'08-24 17:27' },
  { key:'img-i06', code:'ZM-IV-20260824-0015', candidate:'陈家华', project:projects[2].name, job:jobs[2].name, round:'首轮 AI 面试', owner:'招聘专员', linkStatus:'邮件已发送', status:'已完成', online:'离线', remaining:'--', score:55, email:'cjh19910925@qq.com', interviewTime:'2026/8/24 17:26:46', result:'待复核', updated:'08-24 17:26' },
  { key:'img-i07', code:'ZM-IV-20260824-0014', candidate:'刘华媛', project:projects[2].name, job:jobs[2].name, round:'首轮 AI 面试', owner:'招聘专员', linkStatus:'邮件已发送', status:'已完成', online:'离线', remaining:'--', score:72, email:'865009422@qq.com', interviewTime:'2026/8/24 17:26:21', result:'建议通过', updated:'08-24 17:26' },
  { key:'img-i08', code:'ZM-IV-20260824-0013', candidate:'张镁月', project:projects[2].name, job:jobs[2].name, round:'首轮 AI 面试', owner:'招聘专员', linkStatus:'邮件已发送', status:'已完成', online:'离线', remaining:'--', score:25, email:'2195965720@qq.com', interviewTime:'2026/8/24 17:25:58', result:'建议淘汰', updated:'08-24 17:25' },
  { key:'img-i09', code:'ZM-IV-20260824-0012', candidate:'张蕊', project:projects[2].name, job:jobs[2].name, round:'首轮 AI 面试', owner:'招聘专员', linkStatus:'邮件已发送', status:'已完成', online:'离线', remaining:'--', score:55, email:'525312584@qq.com', interviewTime:'2026/8/24 17:25:20', result:'待复核', updated:'08-24 17:25' },
  { key:'img-i10', code:'ZM-IV-20260824-0011', candidate:'王佳洁', project:projects[2].name, job:jobs[2].name, round:'首轮 AI 面试', owner:'招聘专员', linkStatus:'邮件已发送', status:'已完成', online:'离线', remaining:'--', score:0, email:'598213135@qq.com', interviewTime:'2026/8/24 17:24:40', result:'评估匹配度', updated:'08-24 17:24' },
  { key:'img-i11', code:'ZM-IV-20260824-0010', candidate:'李宏阳', project:projects[2].name, job:jobs[2].name, round:'首轮 AI 面试', owner:'招聘专员', linkStatus:'邮件已发送', status:'已完成', online:'离线', remaining:'--', score:77, email:'412408552@qq.com', interviewTime:'2026/8/24 17:23:29', result:'建议通过', updated:'08-24 17:23' },
  { key:'img-i12', code:'ZM-IV-20260824-0009', candidate:'张玲钰', project:projects[2].name, job:jobs[3].name, round:'首轮 AI 面试', owner:'招聘专员', linkStatus:'邮件已发送', status:'已完成', online:'离线', remaining:'--', score:72, email:'1304279511@qq.com', interviewTime:'2026/8/24 16:27:03', result:'建议通过', updated:'08-24 16:27' },
  { key:'img-i13', code:'ZM-IV-20260824-0008', candidate:'姬胜奥', project:projects[2].name, job:jobs[3].name, round:'首轮 AI 面试', owner:'招聘专员', linkStatus:'邮件已发送', status:'已完成', online:'离线', remaining:'--', score:82, email:'1244836428@qq.com', interviewTime:'2026/8/24 16:26:35', result:'建议通过', updated:'08-24 16:26' },
  { key:'img-i14', code:'ZM-IV-20260814-0007', candidate:'贺郎郎', project:projects[2].name, job:jobs[5].name, round:'首轮 AI 面试', owner:'招聘专员', linkStatus:'邮件已发送', status:'已完成', online:'离线', remaining:'--', score:45, email:'helanglang@36w.cn', interviewTime:'2026/8/14 18:41:10', result:'建议淘汰', updated:'08-14 18:41' },
  { key:'img-i15', code:'ZM-IV-20260814-0006', candidate:'王镜淘', project:projects[2].name, job:jobs[8].name, round:'首轮 AI 面试', owner:'招聘专员', linkStatus:'邮件已发送', status:'已完成', online:'离线', remaining:'--', score:25, email:'wangjingtao.wdeu@bytedance.com', interviewTime:'2026/8/14 15:41:51', result:'建议淘汰', updated:'08-14 15:41' },
  { key:'img-i16', code:'ZM-IV-20260814-0005', candidate:'黄淳熠', project:projects[2].name, job:jobs[8].name, round:'首轮 AI 面试', owner:'招聘专员', linkStatus:'邮件已发送', status:'已完成', online:'离线', remaining:'--', score:20, email:'huangchunyi.razx@bytedance.com', interviewTime:'2026/8/14 14:58:54', result:'建议淘汰', updated:'08-14 14:58' },
  { key:'img-i17', code:'ZM-IV-20260813-0004', candidate:'王镜淘', project:projects[2].name, job:jobs[8].name, round:'首轮 AI 面试', owner:'招聘专员', linkStatus:'邮件已发送', status:'已完成', online:'离线', remaining:'--', score:10, email:'wangjingtao.wdeu@bytedance.com', interviewTime:'2026/8/13 18:43:22', result:'建议淘汰', updated:'08-13 18:43' },
  { key:'img-i18', code:'ZM-IV-20260813-0003', candidate:'罗媛媛', project:projects[2].name, job:jobs[8].name, round:'首轮 AI 面试', owner:'招聘专员', linkStatus:'邮件已发送', status:'已完成', online:'离线', remaining:'--', score:58, email:'luoyuanyuan.rnsl@bytedance.com', interviewTime:'2026/8/13 18:42:10', result:'待复核', updated:'08-13 18:42' },
  { key:'img-i19', code:'ZM-IV-20260813-0002', candidate:'韩龙', project:projects[2].name, job:jobs[7].name, round:'首轮 AI 面试', owner:'招聘专员', linkStatus:'邮件已发送', status:'已完成', online:'离线', remaining:'--', score:55, email:'hanlong@36w.cn', interviewTime:'2026/8/13 18:37:03', result:'待复核', updated:'08-13 18:37' },
  { key:'img-i20', code:'ZM-IV-20260813-0001', candidate:'韩龙', project:projects[2].name, job:jobs[7].name, round:'首轮 AI 面试', owner:'招聘专员', linkStatus:'邮件已发送', status:'已完成', online:'离线', remaining:'--', score:30, email:'hanlong@36w.cn', interviewTime:'2026/8/13 17:53:41', result:'建议淘汰', updated:'08-13 17:53' },
];

export const candidates = [...new Set(interviews.map(item => item.candidate))];

export const trendData = [
  { date:'08-13', 邀约量:4, 完成量:4 },
  { date:'08-14', 邀约量:3, 完成量:3 },
  { date:'08-15', 邀约量:0, 完成量:0 },
  { date:'08-16', 邀约量:0, 完成量:0 },
  { date:'08-17', 邀约量:0, 完成量:0 },
  { date:'08-18', 邀约量:0, 完成量:0 },
  { date:'08-19', 邀约量:0, 完成量:0 },
  { date:'08-20', 邀约量:0, 完成量:0 },
  { date:'08-21', 邀约量:0, 完成量:0 },
  { date:'08-22', 邀约量:0, 完成量:0 },
  { date:'08-23', 邀约量:0, 完成量:0 },
  { date:'08-24', 邀约量:11, 完成量:11 },
  { date:'08-25', 邀约量:2, 完成量:2 },
];

export const funnelData = [
  { stage:'已邀约', value:20 }, { stage:'已访问', value:20 },
  { stage:'已完成', value:20 }, { stage:'审核通过', value:6 },
  { stage:'进入下一轮', value:6 }, { stage:'最终通过', value:2 },
];

export const delay = <T,>(data: T, ms = 350) =>
  new Promise<T>((resolve) => setTimeout(() => resolve(data), ms));

export const mockService = {
  getProjects: () => delay(projects),
  getJobs: () => delay(jobs),
  getInterviews: () => delay(interviews),
  search: (keyword: string) => delay({
    projects: projects.filter(x => `${x.name}${x.code}`.includes(keyword)).slice(0, 3),
    jobs: jobs.filter(x => `${x.name}${x.code}`.includes(keyword)).slice(0, 3),
    candidates: candidates.filter(x => x.includes(keyword)).slice(0, 3),
  }, 180),
};
