import { createContext, useContext } from "react";
import type { mappedTag, options, task, taskActivityMap, timestampMap } from "../utility/types";

interface DataContextType {
  tasks: task[];
  timestampMap: timestampMap;
  activeTasks: taskActivityMap;
  tagMap: mappedTag;
  options: options | null;

  optionLoading: boolean;
  optionError: Error | null;

  setAllTask: (data: task[]) => void;
  setTaskAdd: (data: task) => void;
  setTaskEdit: (changes: task) => void;
  setTaskDelete: (id: number) => void;

  toggleActiveTask: (id: number) => void;

  setTagAddition: (tag: string) => void;
  setTagDeletion: (id: number) => void;
  setOptions: (changes: Partial<options>) => void;
};

export const OptionsContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(OptionsContext);
  if (!context) { throw new Error("useOption must be used within an DataContext"); }

  return context;
}