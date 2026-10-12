import localforage from 'localforage';

// Configure localforage
localforage.config({ name: 'pixel', storeName: 'data' });

export interface Task {
  id: string;
  date: string;        // YYYY-MM-DD
  startTime: string;   // HH:MM
  endTime: string;     // HH:MM
  subject: string;
  task: string;
  priority: 'High' | 'Medium' | 'Low';
  quadrant: 'urgent-important' | 'not-urgent-important' | 'urgent-not-important' | 'neither';
  completed: boolean;
  pomodoroSessions: number;
  createdAt: string;
}

export interface StudySession {
  id: string;
  date: string;
  subject: string;
  durationMinutes: number;
  type: 'pomodoro' | 'manual' | 'stopwatch';
}

// Storage keys
const KEYS = {
  tasks: 'tasks',
  sessions: 'sessions',
  settings: 'settings',
};

// Generic CRUD helpers
export async function getAll<T>(key: string): Promise<T[]> {
  return (await localforage.getItem<T[]>(key)) ?? [];
}
export async function saveAll<T>(key: string, items: T[]): Promise<void> {
  await localforage.setItem(key, items);
}

// Tasks
export const getTasks = () => getAll<Task>(KEYS.tasks);
export const saveTasks = (tasks: Task[]) => saveAll(KEYS.tasks, tasks);

// Sessions
export const getSessions = () => getAll<StudySession>(KEYS.sessions);
export const saveSessions = (s: StudySession[]) => saveAll(KEYS.sessions, s);

// Settings
export const DEFAULT_SETTINGS = {
  userName: '',
  pomodoroWork: 25,
  pomodoroBreak: 5,
  pomodoroLongBreak: 15,
  dailyGoalMinutes: 480,
  currentStreak: 0,
  lastActiveDate: '',
  onboardingDone: false,
  subjects: [] as { name: string; color: string }[],
  studyPlan: {} as Record<string, Record<string, number>>,
  theme: 'dark' as const,
};
export const getSettings = async () => {
  const saved = await localforage.getItem(KEYS.settings);
  if (!saved) return DEFAULT_SETTINGS;
  return { ...DEFAULT_SETTINGS, ...saved };
};
export const saveSettings = (settings: typeof DEFAULT_SETTINGS) =>
  localforage.setItem(KEYS.settings, settings);

// Export all data as JSON blob for backup
export async function exportData(): Promise<string> {
  const [tasks, sessions, settings] = await Promise.all([
    getTasks(), getSessions(), getSettings()
  ]);
  return JSON.stringify({ tasks, sessions, settings, exportedAt: new Date().toISOString() }, null, 2);
}

// Import data from JSON backup
export async function importData(json: string): Promise<void> {
  const data = JSON.parse(json);
  await Promise.all([
    saveTasks(data.tasks ?? []),
    saveSessions(data.sessions ?? []),
    saveSettings({ ...DEFAULT_SETTINGS, ...(data.settings ?? {}) }),
  ]);
}