export interface SprintQuery {
  sprints: SprintElement[];
  rapidViewId: number;
}

export interface SprintElement {
  id: number;
  sequence: number;
  name: string;
  state: State;
  linkedPagesCount: number;
  goal?: string;
}

export enum State {
  Active = 'ACTIVE',
  Closed = 'CLOSED',
}

export interface SprintReport {
  contents: SprintReportContents;
  sprint: Sprint;
  lastUserToClose: string;
  supportsPages: boolean;
}

export interface SprintReportContents {
  completedIssues: CompletedIssue[];
  issuesNotCompletedInCurrentSprint: CompletedIssue[];
  puntedIssues: PuntedIssue[]; // Issues removed from the sprint
  issuesCompletedInAnotherSprint: any[];
  completedIssuesInitialEstimateSum: EstimateSum;
  completedIssuesEstimateSum: EstimateSum;
  issuesNotCompletedInitialEstimateSum: EstimateSum;
  issuesNotCompletedEstimateSum: EstimateSum;
  allIssuesEstimateSum: EstimateSum;
  puntedIssuesInitialEstimateSum: EstimateSum;
  puntedIssuesEstimateSum: EstimateSum;
  issuesCompletedInAnotherSprintInitialEstimateSum: IssuesCompletedInAnotherSprintEstimateSum;
  issuesCompletedInAnotherSprintEstimateSum: IssuesCompletedInAnotherSprintEstimateSum;
  issueKeysAddedDuringSprint: { [key: string]: boolean }; // These won't count towards committed
}

export interface EstimateSum {
  value: number;
  text: string;
}

export interface CompletedIssue {
  id: number;
  key: string;
  hidden: boolean;
  typeName: string;
  typeId: string;
  summary: string;
  typeUrl: string;
  priorityUrl: string;
  priorityName: string;
  done: boolean;
  assignee?: string;
  assigneeKey?: string;
  assigneeAccountId?: string;
  assigneeName?: string;
  avatarUrl?: string;
  hasCustomUserAvatar: boolean;
  flagged: boolean;
  epic?: string;
  epicField?: EpicField;
  currentEstimateStatistic: EstimateStatistic;
  estimateStatisticRequired: boolean;
  estimateStatistic: EstimateStatistic;
  statusId: string;
  statusName: string;
  statusUrl: string;
  status: Status;
  fixVersions: any[];
  projectId: number;
  linkedPagesCount: number;
}

export interface EstimateStatistic {
  statFieldId: string;
  statFieldValue: StatFieldValue;
}

export interface StatFieldValue {
  value?: number;
}

export interface EpicField {
  id: string;
  label: string;
  editable: boolean;
  renderer: string;
  epicKey: string;
  epicColor?: string;
  text: string;
  canRemoveEpic: boolean;
}

export interface Status {
  id: string;
  name: string;
  description: string;
  iconUrl: string;
  statusCategory: StatusCategory;
}

export interface StatusCategory {
  id: string;
  key: Key;
  colorName: string;
}

export enum Key {
  Done = 'done',
  Indeterminate = 'indeterminate',
  New = 'new',
}

export interface IssuesCompletedInAnotherSprintEstimateSum {
  text: string;
}

export interface PuntedIssue {
  id: number;
  key: string;
  hidden: boolean;
  typeName: string;
  typeId: string;
  summary: string;
  typeUrl: string;
  priorityUrl: string;
  priorityName: string;
  done: boolean;
  hasCustomUserAvatar: boolean;
  flagged: boolean;
  epic: string;
  epicField: EpicField;
  currentEstimateStatistic: EstimateStatistic;
  estimateStatisticRequired: boolean;
  estimateStatistic: EstimateStatistic;
  statusId: string;
  statusName: string;
  statusUrl: string;
  status: Status;
  fixVersions: any[];
  projectId: number;
  linkedPagesCount: number;
}

export interface Sprint {
  id: number;
  sequence: number;
  name: string;
  state: string;
  linkedPagesCount: number;
  goal: string;
  startDate: string;
  endDate: string;
  isoStartDate: string;
  isoEndDate: string;
  completeDate: string;
  isoCompleteDate: string;
  canUpdateSprint: boolean;
  remoteLinks: any[];
  daysRemaining: number;
}

export interface IssueEstimate {
  key: string;
  estimate: number;
}
