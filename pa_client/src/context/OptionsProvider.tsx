import { useCallback, useEffect, useState } from "react";
import { OptionsContext } from "./OptionsContext";
import type { mappedTag, options, tag } from "../utility/types";
import { BASE_URL } from "../utility/utilityComponent";

interface OptionsProviderProps {
  children: React.ReactNode;
}

function OptionsProvider({ children }: OptionsProviderProps) {
  const [options, setOptions] = useState<options | null>(null);
  const [tags, setTags] = useState<tag[] | null>(null);
  const [tagMap, setTagMap] = useState<mappedTag>({});

  const [optionError, setOptionError] = useState<Error | null>(null);
  const [optionLoading, setOptionLoading] = useState<boolean>(false);

  const fetchData = useCallback(async (url: string, options: RequestInit = {}) => {
    setOptionLoading(true);
    setOptionError(null);
    try {
      const response = await fetch(url, options);
      if (!response.ok) throw new Error("Network response was not ok");
      return await response.json();
    } catch (err) {
      setOptionError(new Error("Failed to fetch data"));
      console.error("[ Error fetching data ]\n", err);
      throw err;
    } finally {
      setOptionLoading(false);
    }
  }, []);

  useEffect(() => {
    const fetchOptionsAndTags = async () => {
      try {
        const [optionsData, tagsData] = await Promise.all([
          fetchData(`${BASE_URL}/options/1`),
          fetchData(`${BASE_URL}/tags`)
        ]);

        setOptions(optionsData[0]);
        setTags(tagsData);

        const tagMap: mappedTag = {};
        tagsData.forEach((tag: tag) => { tagMap[tag.id] = tag.name });
        setTagMap(tagMap);
      } catch (err) {
        console.log("[ Error fetching options and tags ]\n", err);
      }
    };

    fetchOptionsAndTags();
  }, [fetchData]);

  const handleSetOptions = async (changes: Partial<options>) => {
    try {
      await fetchData(`${BASE_URL}/options/1`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(changes),
      });
      setOptions(prev => ({ ...prev, ...changes }) as options);
    } catch (err) {
      setOptionError(new Error("Failed to update options"));
      console.error("Error updating options:", err);
    }
  };

  const setTagAddition = async (tagName: string) => {
    console.log("adding new tag", tagName);

    const isExisting = Object.values(tagMap).includes(tagName);
    if (isExisting) return;

    try {
      const { id } = await fetchData(`${BASE_URL}/tags`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: tagName })
      });
      setTagMap(prev => ({ ...prev, [id]: tagName }));
    } catch (err) {
      setOptionError(new Error("Adding tag failed"));
      console.log("[ Adding tag failed ]\n", err);
    }
  };

  const setTagDeletion = async (id: number) => {
    try {
      await fetchData(`${BASE_URL}/tags/${id}`, { method: "DELETE" });
      setTagMap(prev => {
        const updatedEntries = Object.entries(prev).filter(([key]) => key !== id.toString());
        return Object.fromEntries(updatedEntries);
      });
    } catch (err) {
      setOptionError(new Error("Deleting tag failed"));
      console.log("[ Deleting tag failed ]\n", err);
    }
  };

  return (
    <OptionsContext.Provider
      value={{
        options,
        setOptions: handleSetOptions,
        tags,
        setTagAddition,
        setTagDeletion,
        tagMap,
        optionLoading,
        optionError
      }}
    >
      {children}
    </OptionsContext.Provider>
  )
}

export default OptionsProvider;