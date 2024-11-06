import { createContext, useContext } from "react";
import type {
  activeTime,
  activityInterval,
  mappedTag,
  observationInterval,
  options,
  task,
  taskActivityMap,
  timestampMap
} from "../utility/types";

interface DataContextType {
  tasks: task[];
  timestampMap: timestampMap;
  activeTasks: taskActivityMap;
  taskActiveTimes: activeTime;
  tagActiveTimes: activeTime;
  observationInterval: observationInterval;
  taskDetailsInterval: activityInterval;
  tagMap: mappedTag;
  options: options | null;

  optionLoading: boolean;
  optionError: Error | null;

  setAllTask: (data: task[]) => void;
  setTaskAdd: (data: task) => void;
  setTaskEdit: (changes: task) => void;
  setTaskDelete: (id: number) => void;

  toggleActiveTask: (id: number) => void;
  getActivityIntervals: (taskId: number, start: Date, end: Date) => activityInterval[];
  addActivityInterval: (taskId: number, interval: activityInterval) => void;
  removeActivityInterval: (taskId: number, interval: activityInterval) => void;
  modifyActivityInterval: (taskId: number, oldInterval: activityInterval, newInterval: activityInterval) => void;

  setObservationInterval: (interval: observationInterval) => void;
  setTaskDetailsInterval: (interval: activityInterval) => void;
  calculateDailyActiveTimes: (taskID: number, start: Date, end: Date) => activeTime;

  setTagAddition: (tag: string) => void;
  setTagDeletion: (id: number) => void;
  setOptions: (changes: Partial<options>) => void;
  fetchAllData: () => void;
};

export const OptionsContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(OptionsContext);
  if (!context) { throw new Error("useOption must be used within an DataContext"); }

  return context;
}