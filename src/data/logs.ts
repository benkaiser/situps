import { dayNumber } from "../utils/daynumber";
import { getTodayGoal } from "./goals";

export interface ILogData {
  date: number;
  numberOfSitups: number;
}

export function readLogData(): ILogData[] {
  try {
    return JSON.parse(localStorage.getItem('situp-logData')) || [];
  } catch {
    return [];
  }
}

export function setLogDataRaw(logData: ILogData[]) {
  localStorage.setItem('situp-logData', JSON.stringify(logData));
}

export function addToLogData(newLogData: ILogData) {
  const logData = readLogData();
  logData.push(newLogData);
  localStorage.setItem('situp-logData', JSON.stringify(logData));
}

export function deleteLog(log: ILogData) {
  const logs: ILogData[] = readLogData();
  setLogDataRaw(logs.filter(storedLog => storedLog.date != log.date));
}

export function getAllCount() {
  const logs = readLogData();
  const situpsDone = logs
    .reduce((previousValue: number, currentValue) => previousValue + currentValue.numberOfSitups, 0);
  return situpsDone;
}

export function getLogsForDayNumebr(day: number): ILogData[] {
  const logs = readLogData();
  return logs.filter((log) => day == dayNumber(log.date));
}

export function getLogCountForDayNumebr(day: number): number {
  return getLogsForDayNumebr(day)
    .reduce((previousValue: number, currentValue) => previousValue + currentValue.numberOfSitups, 0);
}

export function getTodayCount() {
  return getLogCountForDayNumebr(dayNumber(+new Date()));
}

export function getTodayLogs() {
  return getLogsForDayNumebr(dayNumber(+new Date()));
}

export function recordSitups(numberOfSitups: number): void {
  addToLogData({date: +new Date(), numberOfSitups: numberOfSitups});

  const count = getTodayCount();
  const goal = getTodayGoal();
  if (Notification.permission === 'granted') {
    navigator.serviceWorker.ready.then((serviceWorkerRegistration) => {
      serviceWorkerRegistration.getNotifications().then(notifications => {
        notifications.forEach(notification => notification.close());
        if (count < goal) {
          serviceWorkerRegistration.showNotification('Sit-Up Time', {
            icon: 'https://benkaiser.github.io/situps/static/icons/icon-512x512.png',
            badge: 'https://benkaiser.github.io/situps/static/icons/badge-72x72.png',
            body: `${goal - count} more to hit your daily goal`
          });
        }
      });
    });
  }
}
