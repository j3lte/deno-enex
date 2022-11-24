enum ReminderStatus {
  ACTIVE = "active",
  MUTED = "muted",
}

export type Reminder = {
  created: Date;
  updated: Date;
  noteLevelID: string;
  reminderDate: Date | null;
  reminderDateUIOption: DateUIOption | null;
  dueDateOffset: number | null;
  reminderStatus: ReminderStatus | null;
};

export enum TaskStatus {
  OPEN = "open",
  COMPLETED = "completed",
}

export type Task = {
  title: string;
  created: Date;
  updated: Date;
  taskStatus: TaskStatus;
  inNote: boolean;
  taskFlag: string;
  sortWeight: string;
  noteLevelID: string;
  taskGroupNoteLevelID: string;
  dueDate: Date | null;
  dueDateUIOption: DateUIOption | null;
  timeZone: string | null;
  statusUpdated: Date | null;
  creator: string | null;
  lastEditor: string | null;
  reminder: Reminder | null;
};

export enum MimeTypes {
  GIF = "image/gif",
  JPEG = "image/jpeg",
  PNG = "image/png",
  WAV = "audio/wav",
  MPEG = "audio/mpeg",
  PDF = "application/pdf",
  INK = "application/vnd.evernote.ink",
}

export type Resource = {
  data?: Uint8Array;
  mime?: MimeTypes;
  filename?: string;
  hash?: string;
  width?: number | null;
  height?: number | null;
  // duration: number | null;
  // alternateData: string | null;
  // attributes?: ResourceAttributes;
};

export type Note = {
  title?: string;
  author?: string;
  latitude?: string;
  longitude?: string;
  altitude?: string;
  created?: Date | null;
  updated?: Date | null;
  subjectDate?: Date | null;
  source?: string;
  sourceUrl?: string;
  sourceApplication?: string;
  placeName?: string;
  tags: string[];
  content?: string;
  markdown?: string;
  contentClass?: string;
  resources: Resource[];
  tasks?: Task[];
  applicationData?: string;
};

export enum DateUIOption {
  DateTime = "date_time",
  DateOnly = "date_only",
  RelativeToDue = "relative_to_due",
}

export type ParseState = {
  note?: Note;
  resource?: Resource;
  ignore: boolean;
  text: string;
  attributes: Record<string, string>;
};
