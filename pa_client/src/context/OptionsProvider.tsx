import { useEffect, useState } from "react";
import { OptionsContext } from "./OptionsContext";
import type { options } from "../utility/types";
import { BASE_URL } from "../utility/utilityComponent";

interface OptionsProviderProps {
  children: React.ReactNode;
}

function OptionsProvider({ children }: OptionsProviderProps) {
  const [options, setOptions] = useState<options | null>(null);

  useEffect(() => {
    const fetchOptions = async () => {
      try {
        const optionsResponse = await fetch(`${BASE_URL}/options/1`);
        const data = await optionsResponse.json();

        setOptions(data[0]);
      }
      catch (err) {
        console.log("[ Error fetching options ]\n", err);
      }
    };

    fetchOptions();
  }, []);

  const handleSetOptions = async (changes: Partial<options>) => {
    try {
      const response = await fetch("http://127.0.0.1:3010/options/1", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });

      if (!response.ok) throw new Error("Failed to update options");

      setOptions(prev => ({ ...prev, ...changes }) as options);
    } catch (error) {
      console.error("Error updating options:", error);
    }
  };

  return (
    <OptionsContext.Provider value={{ options, setOptions: handleSetOptions }}>
      {children}
    </OptionsContext.Provider>
  )
}

export default OptionsProvider;