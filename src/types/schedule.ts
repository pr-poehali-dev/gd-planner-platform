export interface ResponsiblePerson {
  id: number;
  name: string;
  position: string;
  phone: string;
  email: string;
}

export interface ScheduleEvent {
  id: number;
  date: string;
  timeStart: string;
  timeEnd: string;
  title: string;
  type: 'session' | 'committee' | 'meeting' | 'visit' | 'vcs' | 'regional-trip' | 'other';
  location: string;
  description: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  reminder?: boolean;
  reminderMinutes?: number;
  archived?: boolean;
  vcsLink?: string;
  regionName?: string;
  responsiblePersonId?: number;
}

export const typeLabels = {
  session: 'Заседание',
  committee: 'Комитет',
  meeting: 'Встреча',
  visit: 'Поездка',
  vcs: 'ВКС',
  'regional-trip': 'Выезд в регион',
  other: 'Другое',
};

export const typeIcons = {
  session: 'Briefcase',
  committee: 'Users',
  meeting: 'UserCheck',
  visit: 'MapPin',
  vcs: 'Video',
  'regional-trip': 'Plane',
  other: 'Calendar',
};

export const statusLabels = {
  scheduled: 'Запланировано',
  'in-progress': 'Идёт сейчас',
  completed: 'Завершено',
  cancelled: 'Отменено',
};

export const typeColors = {
  session: 'bg-blue-500/10 text-blue-700 border-blue-200',
  committee: 'bg-purple-500/10 text-purple-700 border-purple-200',
  meeting: 'bg-green-500/10 text-green-700 border-green-200',
  visit: 'bg-orange-500/10 text-orange-700 border-orange-200',
  vcs: 'bg-cyan-500/10 text-cyan-700 border-cyan-200',
  'regional-trip': 'bg-indigo-500/10 text-indigo-700 border-indigo-200',
  other: 'bg-gray-500/10 text-gray-700 border-gray-200',
};
