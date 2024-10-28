export enum theme {
  "light",
  "dark",
  "default"
}

export enum ModalType {
  "info",
  "alert",
  "form"
}

export type action = "GET" | "POST" | "PUT";

export type FilterType = "AND" | "OR";

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

export type options = {
  id: number,
  theme: theme,
  alternative: number,
  own_textual_data: string,
};