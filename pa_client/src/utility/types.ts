export enum ThemeType {
  light = "light",
  dark = "dark",
  default = "default"
}

export enum ModalType {
  "info",
  "alert",
  "form"
}

export enum FilterType {
  "AND",
  "OR"
}

export type task = {
  id: number,
  name: string,
  tags: string,
};

export type tag = {
  id: number,
  name: string,
};

export type mappedTag = { [key: string]: string };

export type timestamp = {
  id: number,
  timestamp: string,
  task: number,
  type: number,
};

export type activeTime = { [key: string]: number };
export type timestampMap = { [key: string]: timestamp[] };
export type taskActivityMap = { [key: string]: boolean };
export type observationInterval = { start: Date, end: Date };
export type activityInterval = { start: Date, end: Date | null };

export type options = {
  id: number,
  theme: ThemeType,
  alternative: number,
  own_textual_data: string,
};