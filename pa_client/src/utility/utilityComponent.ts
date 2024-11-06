import { timestamp } from "./types";

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

export function formatHumanReadableDuration(ms: number) {
  const seconds = Math.floor(ms / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);

  const components = [
    { label: "month", value: months },
    { label: "day", value: days % 30 },
    { label: "hour", value: hours % 24 },
    { label: "minute", value: minutes % 60 },
    { label: "second", value: seconds % 60 },
  ];

  const nonZeroComponents = components.filter((component) => component.value > 0);

  const humanReadableParts = nonZeroComponents
    .slice(0, 2)
    .map((component) => `${component.value} ${component.label}${component.value > 1 ? "s" : ""}`);

  return humanReadableParts.join(" ");
}


export function getTaskDuration(timestamps: timestamp[]) {
  if (!timestamps || !(timestamps.length > 0)) return 0;

  let totalDuration = 0;
  let lastStartTime: Date | null = null;

  timestamps.forEach(({ timestamp, type }) => {
    const date = new Date(timestamp);

    if (type === 0) {
      if (!lastStartTime) {
        lastStartTime = date;
      }
    }
    else if (type === 1 && lastStartTime) {
      totalDuration += date.getTime() - lastStartTime.getTime();
      lastStartTime = null;
    }
  });

  if (lastStartTime) {
    totalDuration += Date.now() - (lastStartTime as Date).getTime();
  }

  return totalDuration;
}