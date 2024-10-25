import { mappedTag } from "./types";

export const mapIDsToNames = (tagIds: string, tagMap: mappedTag): string[] => {
  //* filter(Boolean) filters out undefined values
  return tagIds.split(",").map(id => tagMap[id.trim()]).filter(Boolean);
};

//? If tag doesn't exist add it as new?
export const mapNamesToIds = (tagNames: string[], tagMap: mappedTag): string => {
  //* changes from {[id]: name} to [name, id] format
  const tagIdMap = Object.fromEntries(Object.entries(tagMap).map(([id, name]) => [name, id]));

  return tagNames.map(name => tagIdMap[name.trim()]).filter(Boolean).join(",");
};