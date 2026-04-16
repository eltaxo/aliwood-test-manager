export interface TestCase {
  id: string;
  title: string;
  epic: string;
  userStory: string;
  platforms: Platform[];
  description: string;
  given: string;
  when: string;
  then: string;
  priority: Priority;
  ok: boolean;
  ko: boolean;
  notes: string;
  responsible: string;
  status: TestStatus;
  linkBug: string;
}

export type Platform = 'iOS' | 'Android' | 'Web';
export type Priority = 'URGENT' | 'HIGH' | 'MEDIUM' | 'LOW';
export type TestStatus = 'Pending' | 'In Progress' | 'DONE' | 'BLOCKED';

export interface FilterState {
  search: string;
  platforms: Platform[];
  epics: string[];
  priorities: Priority[];
  statuses: TestStatus[];
  responsible: string[];
}

export interface DashboardStats {
  total: number;
  pending: number;
  inProgress: number;
  done: number;
  blocked: number;
  passRate: number;
  byPriority: Record<Priority, number>;
  byPlatform: Record<Platform, number>;
  byEpic: Record<string, number>;
}