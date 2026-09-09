import type { Interview } from './mock';

export const FEISHU_RECORDS_KEY = 'zhimian:feishu-interview-records';

export type FeishuMeetingRecord = Interview & {
  meetingId: string;
  meetingUrl: string;
  scheduledAt: string;
  interviewers: string;
  provider: '飞书视频会议';
  syncStatus: '等待面试' | '等待结果回传' | '已同步';
  recordingUrl?: string;
  transcriptUrl?: string;
  resultSummary?: string;
};

export type CreateMeetingInput = {
  candidate:string;
  project:string;
  job:string;
  scheduledAt:string;
  interviewers:string[];
  duration:number;
};

function readRecords():FeishuMeetingRecord[] {
  try {
    return JSON.parse(localStorage.getItem(FEISHU_RECORDS_KEY) || '[]');
  } catch {
    return [];
  }
}

function writeRecords(records:FeishuMeetingRecord[]) {
  localStorage.setItem(FEISHU_RECORDS_KEY,JSON.stringify(records));
}

export const mockFeishuService = {
  createMeeting: async (input:CreateMeetingInput) => {
    await new Promise(resolve=>setTimeout(resolve,700));
    const stamp=Date.now().toString().slice(-8);
    const record:FeishuMeetingRecord={
      key:`fs-${stamp}`,
      code:`ZM-IV-20260908-${stamp.slice(-4)}`,
      candidate:input.candidate,
      project:input.project,
      job:input.job,
      round:'二轮人工面试',
      owner:input.interviewers.join('、'),
      linkStatus:'已发送',
      status:'待面试',
      online:'离线',
      remaining:`${input.duration}:00`,
      score:0,
      updated:'刚刚',
      meetingId:`oc_${stamp}`,
      meetingUrl:`https://vc.feishu.cn/j/${stamp}`,
      scheduledAt:input.scheduledAt,
      interviewers:input.interviewers.join('、'),
      provider:'飞书视频会议',
      syncStatus:'等待面试',
    };
    writeRecords([record,...readRecords()]);
    return record;
  },
  syncMeetingResult: async (meetingId:string) => {
    await new Promise(resolve=>setTimeout(resolve,650));
    const records=readRecords().map(record=>record.meetingId===meetingId?{
      ...record,
      status:'待审核',
      linkStatus:'已完成',
      syncStatus:'已同步' as const,
      recordingUrl:`https://vc.feishu.cn/recording/${meetingId}`,
      transcriptUrl:`https://minutes.feishu.cn/minutes/${meetingId}`,
      resultSummary:'飞书会议已结束，录制文件、妙记转写及面试官评价已同步。',
      updated:'刚刚',
    }:record);
    writeRecords(records);
    return records.find(record=>record.meetingId===meetingId);
  },
  getRecords: readRecords,
};
