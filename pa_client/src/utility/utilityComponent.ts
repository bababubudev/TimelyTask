export const BASE_URL = "http://127.0.0.1:3010";

export const isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") > -1;

export function findDataWithID<T extends { id: number }>(data: T[], id: number): T | undefined {
  return data.find(elem => elem.id === id);
}

export function isEqual<T>(objA: T, objB: T): boolean {
  return JSON.stringify(objA) === JSON.stringify(objB);
}

export function isNewData<T extends { id: number }>(data: T[], compareData: T): boolean {
  const current = findDataWithID<T>(data, compareData.id);
  if (!current) { return false; }

  if (isEqual<T>(current, compareData)) {
    return false;
  };

  return true;
}