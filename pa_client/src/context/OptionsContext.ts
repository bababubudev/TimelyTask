import { createContext, useContext } from "react";
import type { options } from "../utility/types";

interface OptionContextType {
  options: options | null;
  setOptions: (changes: Partial<options>) => void;
};

export const OptionsContext = createContext<OptionContextType | undefined>(undefined);

export const useOptions = () => {
  const context = useContext(OptionsContext);
  if (!context) { throw new Error("useOption must be used within an OptionsProvider"); }

  return context;
}