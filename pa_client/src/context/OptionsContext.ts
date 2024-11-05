import { createContext, useContext } from "react";
import type { mappedTag, options, tag } from "../utility/types";

interface OptionContextType {
  options: options | null;
  tagMap: mappedTag;
  tags: tag[] | null;
  optionLoading: boolean;
  optionError: Error | null;
  setOptions: (changes: Partial<options>) => void;
  setTagAddition: (tag: string) => void;
  setTagDeletion: (id: number) => void;
};

export const OptionsContext = createContext<OptionContextType | undefined>(undefined);

export const useOptions = () => {
  const context = useContext(OptionsContext);
  if (!context) { throw new Error("useOption must be used within an OptionsProvider"); }

  return context;
}