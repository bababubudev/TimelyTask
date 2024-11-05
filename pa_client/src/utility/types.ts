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
  position: number,
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

export type options = {
  id: number,
  theme: ThemeType,
  alternative: number,
  own_textual_data: string,
};