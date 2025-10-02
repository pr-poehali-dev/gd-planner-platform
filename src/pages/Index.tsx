import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from 'sonner';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';

pdfMake.vfs = pdfFonts.pdfMake.vfs;
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface ResponsiblePerson {
  id: number;
  name: string;
  position: string;
  phone: string;
  email: string;
}

interface ScheduleEvent {
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

const Index = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isPersonDialogOpen, setIsPersonDialogOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<ScheduleEvent | null>(null);
  const [filterType, setFilterType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [activeTab, setActiveTab] = useState<'active' | 'archive'>('active');
  
  const [responsiblePersons, setResponsiblePersons] = useState<ResponsiblePerson[]>([
    {
      id: 1,
      name: 'Иванов Иван Иванович',
      position: 'Помощник депутата',
      phone: '+7 (495) 123-45-67',
      email: 'ivanov@duma.gov.ru',
    },
  ]);
  
  const [newPerson, setNewPerson] = useState<Partial<ResponsiblePerson>>({
    name: '',
    position: '',
    phone: '',
    email: '',
  });
  
  const [scheduleEvents, setScheduleEvents] = useState<ScheduleEvent[]>([
    {
      id: 1,
      date: '02.10.2025',
      timeStart: '10:00',
      timeEnd: '14:00',
      title: 'Пленарное заседание Госдумы',
      type: 'session',
      location: 'Большой зал',
      description: 'Рассмотрение законопроектов второго чтения',
      status: 'in-progress',
      reminder: true,
      reminderMinutes: 30,
      archived: false,
    },
    {
      id: 2,
      date: '02.10.2025',
      timeStart: '15:00',
      timeEnd: '17:00',
      title: 'Заседание комитета по бюджету',
      type: 'committee',
      location: 'Зал комитета, 3 этаж',
      description: 'Обсуждение проекта бюджета на 2026 год',
      status: 'scheduled',
      reminder: true,
      reminderMinutes: 15,
      archived: false,
    },
    {
      id: 3,
      date: '02.10.2025',
      timeStart: '18:00',
      timeEnd: '19:30',
      title: 'Встреча с избирателями',
      type: 'meeting',
      location: 'Общественная приёмная',
      description: 'Вопросы благоустройства района',
      status: 'scheduled',
      reminder: false,
      archived: false,
    },
    {
      id: 4,
      date: '03.10.2025',
      timeStart: '11:00',
      timeEnd: '13:00',
      title: 'Рабочая поездка в школу №15',
      type: 'visit',
      location: 'г. Москва, ул. Ленина, 15',
      description: 'Инспекция ремонта образовательного учреждения',
      status: 'scheduled',
      reminder: true,
      reminderMinutes: 60,
      archived: false,
    },
    {
      id: 5,
      date: '03.10.2025',
      timeStart: '16:00',
      timeEnd: '18:00',
      title: 'Совещание с помощниками',
      type: 'other',
      location: 'Рабочий кабинет',
      description: 'Планирование работы на неделю',
      status: 'scheduled',
      reminder: false,
      archived: false,
    },
    {
      id: 6,
      date: '04.10.2025',
      timeStart: '09:00',
      timeEnd: '10:30',
      title: 'Пресс-конференция',
      type: 'other',
      location: 'Пресс-центр',
      description: 'Обсуждение принятых законопроектов',
      status: 'scheduled',
      reminder: true,
      reminderMinutes: 30,
      archived: false,
    },
    {
      id: 7,
      date: '04.10.2025',
      timeStart: '14:00',
      timeEnd: '16:00',
      title: 'Заседание фракции',
      type: 'session',
      location: 'Зал заседаний фракции',
      description: 'Обсуждение стратегии на следующую неделю',
      status: 'scheduled',
      reminder: false,
      archived: false,
    },
    {
      id: 8,
      date: '25.09.2025',
      timeStart: '10:00',
      timeEnd: '12:00',
      title: 'Встреча с министром образования',
      type: 'meeting',
      location: 'Министерство образования',
      description: 'Обсуждение реформы школьного образования',
      status: 'completed',
      reminder: false,
      archived: true,
    },
    {
      id: 9,
      date: '03.10.2025',
      timeStart: '10:00',
      timeEnd: '11:30',
      title: 'Онлайн-совещание с региональными представителями',
      type: 'vcs',
      location: '',
      description: 'Обсуждение региональных инициатив и законопроектов',
      status: 'scheduled',
      reminder: true,
      reminderMinutes: 15,
      archived: false,
      vcsLink: 'https://meet.example.com/regional-meeting-2025',
      responsiblePersonId: 1,
    },
    {
      id: 10,
      date: '05.10.2025',
      timeStart: '09:00',
      timeEnd: '18:00',
      title: 'Рабочая поездка в Московскую область',
      type: 'regional-trip',
      location: '',
      description: 'Встречи с местными органами власти, инспекция объектов строительства',
      status: 'scheduled',
      reminder: true,
      reminderMinutes: 60,
      archived: false,
      regionName: 'Московская область',
      responsiblePersonId: 1,
    },
  ]);

  const [newEvent, setNewEvent] = useState<Partial<ScheduleEvent>>({
    date: '',
    timeStart: '',
    timeEnd: '',
    title: '',
    type: 'session',
    location: '',
    description: '',
    status: 'scheduled',
    reminder: false,
    reminderMinutes: 15,
    archived: false,
    vcsLink: '',
    regionName: '',
    responsiblePersonId: undefined,
  });

  const [editEvent, setEditEvent] = useState<Partial<ScheduleEvent>>({});

  const typeLabels = {
    session: 'Заседание',
    committee: 'Комитет',
    meeting: 'Встреча',
    visit: 'Поездка',
    vcs: 'ВКС',
    'regional-trip': 'Выезд в регион',
    other: 'Другое',
  };

  const typeIcons = {
    session: 'Briefcase',
    committee: 'Users',
    meeting: 'UserCheck',
    visit: 'MapPin',
    vcs: 'Video',
    'regional-trip': 'Plane',
    other: 'Calendar',
  };

  const statusLabels = {
    scheduled: 'Запланировано',
    'in-progress': 'Идёт сейчас',
    completed: 'Завершено',
    cancelled: 'Отменено',
  };

  const typeColors = {
    session: 'bg-blue-500/10 text-blue-700 border-blue-200',
    committee: 'bg-purple-500/10 text-purple-700 border-purple-200',
    meeting: 'bg-green-500/10 text-green-700 border-green-200',
    visit: 'bg-orange-500/10 text-orange-700 border-orange-200',
    vcs: 'bg-cyan-500/10 text-cyan-700 border-cyan-200',
    'regional-trip': 'bg-indigo-500/10 text-indigo-700 border-indigo-200',
    other: 'bg-gray-500/10 text-gray-700 border-gray-200',
  };

  useEffect(() => {
    const updateStatuses = () => {
      const now = new Date();
      let hasChanges = false;

      const updatedEvents = scheduleEvents.map((event) => {
        if (event.archived || event.status === 'cancelled') return event;

        const [day, month, year] = event.date.split('.');
        const [startHours, startMinutes] = event.timeStart.split(':');
        const [endHours, endMinutes] = event.timeEnd.split(':');
        
        const eventStart = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
          parseInt(startHours),
          parseInt(startMinutes)
        );
        
        const eventEnd = new Date(
          parseInt(year),
          parseInt(month) - 1,
          parseInt(day),
          parseInt(endHours),
          parseInt(endMinutes)
        );

        let newStatus = event.status;

        if (now >= eventEnd && event.status !== 'completed') {
          newStatus = 'completed';
          hasChanges = true;
          
          const daysSinceEnd = Math.floor((now.getTime() - eventEnd.getTime()) / (1000 * 60 * 60 * 24));
          if (daysSinceEnd >= 7 && !event.archived) {
            return { ...event, status: newStatus, archived: true };
          }
        } else if (now >= eventStart && now < eventEnd && event.status === 'scheduled') {
          newStatus = 'in-progress';
          hasChanges = true;
        }

        if (event.reminder && event.reminderMinutes && event.status === 'scheduled') {
          const reminderTime = new Date(eventStart.getTime() - event.reminderMinutes * 60000);
          if (now >= reminderTime && now < eventStart) {
            toast.info(`Напоминание: ${event.title}`, {
              description: `Начало через ${event.reminderMinutes} мин. ${event.type === 'vcs' && event.vcsLink ? 'Ссылка: ' + event.vcsLink : 'Место: ' + event.location}`,
              duration: 10000,
            });
          }
        }

        return newStatus !== event.status ? { ...event, status: newStatus } : event;
      });

      if (hasChanges) {
        setScheduleEvents(updatedEvents);
      }
    };

    updateStatuses();
    const interval = setInterval(updateStatuses, 60000);

    return () => clearInterval(interval);
  }, [scheduleEvents]);

  const filteredEvents = useMemo(() => {
    return scheduleEvents.filter((event) => {
      const isArchived = activeTab === 'archive';
      if (event.archived !== isArchived) return false;

      const matchesSearch =
        event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        event.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesType = filterType === 'all' || event.type === filterType;
      const matchesStatus = filterStatus === 'all' || event.status === filterStatus;

      return matchesSearch && matchesType && matchesStatus;
    });
  }, [scheduleEvents, searchQuery, filterType, filterStatus, activeTab]);

  const groupedEvents = useMemo(() => {
    const groups: { [key: string]: ScheduleEvent[] } = {};
    filteredEvents.forEach((event) => {
      if (!groups[event.date]) {
        groups[event.date] = [];
      }
      groups[event.date].push(event);
    });
    Object.keys(groups).forEach((date) => {
      groups[date].sort((a, b) => {
        const timeA = a.timeStart.split(':').map(Number);
        const timeB = b.timeStart.split(':').map(Number);
        return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
      });
    });
    return groups;
  }, [filteredEvents]);

  const sortedDates = useMemo(() => {
    return Object.keys(groupedEvents).sort((a, b) => {
      const [dayA, monthA, yearA] = a.split('.');
      const [dayB, monthB, yearB] = b.split('.');
      const dateA = new Date(parseInt(yearA), parseInt(monthA) - 1, parseInt(dayA));
      const dateB = new Date(parseInt(yearB), parseInt(monthB) - 1, parseInt(dayB));
      return dateA.getTime() - dateB.getTime();
    });
  }, [groupedEvents]);

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.timeStart && newEvent.timeEnd) {
      const [year, month, day] = newEvent.date!.split('-');
      const formattedDate = `${day}.${month}.${year}`;

      const event: ScheduleEvent = {
        id: Math.max(...scheduleEvents.map((e) => e.id), 0) + 1,
        date: formattedDate,
        timeStart: newEvent.timeStart!,
        timeEnd: newEvent.timeEnd!,
        title: newEvent.title!,
        type: newEvent.type as ScheduleEvent['type'],
        location: newEvent.location || '',
        description: newEvent.description || '',
        status: 'scheduled',
        reminder: newEvent.reminder || false,
        reminderMinutes: newEvent.reminderMinutes || 15,
        archived: false,
        vcsLink: newEvent.vcsLink || '',
        regionName: newEvent.regionName || '',
        responsiblePersonId: newEvent.responsiblePersonId,
      };
      setScheduleEvents([...scheduleEvents, event]);
      setIsAddDialogOpen(false);
      setNewEvent({
        date: '',
        timeStart: '',
        timeEnd: '',
        title: '',
        type: 'session',
        location: '',
        description: '',
        status: 'scheduled',
        reminder: false,
        reminderMinutes: 15,
        archived: false,
        vcsLink: '',
        regionName: '',
        responsiblePersonId: undefined,
      });
      toast.success('Мероприятие добавлено в график');
    }
  };

  const handleEditEvent = () => {
    if (editEvent.id && editEvent.title && editEvent.date && editEvent.timeStart && editEvent.timeEnd) {
      let formattedDate = editEvent.date!;
      if (editEvent.date!.includes('-')) {
        const [year, month, day] = editEvent.date!.split('-');
        formattedDate = `${day}.${month}.${year}`;
      }

      const updatedEvents = scheduleEvents.map((event) =>
        event.id === editEvent.id
          ? {
              ...event,
              date: formattedDate,
              timeStart: editEvent.timeStart!,
              timeEnd: editEvent.timeEnd!,
              title: editEvent.title!,
              type: editEvent.type as ScheduleEvent['type'],
              location: editEvent.location || '',
              description: editEvent.description || '',
              status: editEvent.status as ScheduleEvent['status'],
              reminder: editEvent.reminder || false,
              reminderMinutes: editEvent.reminderMinutes || 15,
              vcsLink: editEvent.vcsLink || '',
              regionName: editEvent.regionName || '',
              responsiblePersonId: editEvent.responsiblePersonId,
            }
          : event
      );
      setScheduleEvents(updatedEvents);
      setIsEditDialogOpen(false);
      setEditEvent({});
      toast.success('Мероприятие обновлено');
    }
  };

  const handleDeleteEvent = (id: number) => {
    setScheduleEvents(scheduleEvents.filter((event) => event.id !== id));
    toast.success('Мероприятие удалено из графика');
  };

  const handleArchiveEvent = (id: number) => {
    const updatedEvents = scheduleEvents.map((event) =>
      event.id === id ? { ...event, archived: true } : event
    );
    setScheduleEvents(updatedEvents);
    toast.success('Мероприятие перемещено в архив');
  };

  const handleUnarchiveEvent = (id: number) => {
    const updatedEvents = scheduleEvents.map((event) =>
      event.id === id ? { ...event, archived: false } : event
    );
    setScheduleEvents(updatedEvents);
    toast.success('Мероприятие восстановлено из архива');
  };

  const openEditDialog = (event: ScheduleEvent) => {
    const [day, month, year] = event.date.split('.');
    const isoDate = `${year}-${month}-${day}`;

    setEditEvent({
      ...event,
      date: isoDate,
    });
    setIsEditDialogOpen(true);
  };

  const openViewDialog = (event: ScheduleEvent) => {
    setSelectedEvent(event);
    setIsViewDialogOpen(true);
  };

  const exportToPDF = (events?: ScheduleEvent[], dateStr?: string) => {
    const eventsToExport = events || scheduleEvents.filter(e => !e.archived);
    
    const tableBody = eventsToExport.map((event) => {
      const responsiblePerson = event.responsiblePersonId 
        ? responsiblePersons.find(p => p.id === event.responsiblePersonId)
        : null;
      
      let locationText = '';
      if (event.type === 'vcs') {
        locationText = event.vcsLink || 'ВКС';
      } else if (event.type === 'regional-trip') {
        locationText = event.regionName || 'Регион не указан';
      } else {
        locationText = event.location;
      }
      
      return [
        event.date,
        `${event.timeStart} - ${event.timeEnd}`,
        event.title,
        typeLabels[event.type],
        locationText,
        responsiblePerson?.name || '-',
        statusLabels[event.status],
      ];
    });

    const docDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      content: [
        {
          text: dateStr 
            ? `График работы депутата на ${dateStr}`
            : 'График работы депутата Государственной Думы РФ',
          style: 'header',
          margin: [0, 0, 0, 10]
        },
        {
          text: `Дата формирования: ${new Date().toLocaleDateString('ru-RU')}`,
          style: 'subheader',
          margin: [0, 0, 0, 20]
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', '*', 'auto', '*', 'auto', 'auto'],
            body: [
              ['Дата', 'Время', 'Мероприятие', 'Тип', 'Место/Регион', 'Ответственный', 'Статус'],
              ...tableBody
            ]
          },
          layout: {
            fillColor: (rowIndex: number) => (rowIndex === 0 ? '#0039A6' : (rowIndex % 2 === 0 ? '#f5f5f5' : null)),
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => '#cccccc',
            vLineColor: () => '#cccccc',
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center'
        },
        subheader: {
          fontSize: 10,
          alignment: 'center',
          color: '#666666'
        }
      },
      defaultStyle: {
        font: 'Roboto',
        fontSize: 9
      }
    };

    const filename = dateStr 
      ? `График_${dateStr.replace(/[^0-9]/g, '_')}.pdf`
      : `График_работы_${new Date().toLocaleDateString('ru-RU').replace(/\./g, '_')}.pdf`;

    pdfMake.createPdf(docDefinition).download(filename);
    toast.success('График экспортирован в PDF');
  };
  
  const printSchedule = (events?: ScheduleEvent[], dateStr?: string) => {
    const eventsToExport = events || scheduleEvents.filter(e => !e.archived);
    
    const tableBody = eventsToExport.map((event) => {
      const responsiblePerson = event.responsiblePersonId 
        ? responsiblePersons.find(p => p.id === event.responsiblePersonId)
        : null;
      
      let locationText = '';
      if (event.type === 'vcs') {
        locationText = event.vcsLink || 'ВКС';
      } else if (event.type === 'regional-trip') {
        locationText = event.regionName || 'Регион не указан';
      } else {
        locationText = event.location;
      }
      
      return [
        event.date,
        `${event.timeStart} - ${event.timeEnd}`,
        event.title,
        typeLabels[event.type],
        locationText,
        responsiblePerson?.name || '-',
        statusLabels[event.status],
      ];
    });

    const docDefinition: any = {
      pageSize: 'A4',
      pageOrientation: 'landscape',
      content: [
        {
          text: dateStr 
            ? `График работы депутата на ${dateStr}`
            : 'График работы депутата Государственной Думы РФ',
          style: 'header',
          margin: [0, 0, 0, 10]
        },
        {
          text: `Дата формирования: ${new Date().toLocaleDateString('ru-RU')}`,
          style: 'subheader',
          margin: [0, 0, 0, 20]
        },
        {
          table: {
            headerRows: 1,
            widths: ['auto', 'auto', '*', 'auto', '*', 'auto', 'auto'],
            body: [
              ['Дата', 'Время', 'Мероприятие', 'Тип', 'Место/Регион', 'Ответственный', 'Статус'],
              ...tableBody
            ]
          },
          layout: {
            fillColor: (rowIndex: number) => (rowIndex === 0 ? '#0039A6' : (rowIndex % 2 === 0 ? '#f5f5f5' : null)),
            hLineWidth: () => 0.5,
            vLineWidth: () => 0.5,
            hLineColor: () => '#cccccc',
            vLineColor: () => '#cccccc',
          }
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'center'
        },
        subheader: {
          fontSize: 10,
          alignment: 'center',
          color: '#666666'
        }
      },
      defaultStyle: {
        font: 'Roboto',
        fontSize: 9
      }
    };

    pdfMake.createPdf(docDefinition).print();
    toast.success('Отправлено на печать');
  };

  const exportDayToPDF = (dateStr: string) => {
    const dayEvents = scheduleEvents.filter(e => e.date === dateStr && !e.archived);
    exportToPDF(dayEvents, dateStr);
  };
  
  const printDay = (dateStr: string) => {
    const dayEvents = scheduleEvents.filter(e => e.date === dateStr && !e.archived);
    printSchedule(dayEvents, dateStr);
  };
  
  const handleAddPerson = () => {
    if (newPerson.name && newPerson.position) {
      const person: ResponsiblePerson = {
        id: Math.max(...responsiblePersons.map((p) => p.id), 0) + 1,
        name: newPerson.name!,
        position: newPerson.position!,
        phone: newPerson.phone || '',
        email: newPerson.email || '',
      };
      setResponsiblePersons([...responsiblePersons, person]);
      setIsPersonDialogOpen(false);
      setNewPerson({
        name: '',
        position: '',
        phone: '',
        email: '',
      });
      toast.success('Ответственное лицо добавлено');
    }
  };
  
  const handleDeletePerson = (id: number) => {
    setResponsiblePersons(responsiblePersons.filter((p) => p.id !== id));
    toast.success('Ответственное лицо удалено');
  };

  const upcomingReminders = scheduleEvents
    .filter((event) => event.reminder && event.status === 'scheduled' && !event.archived)
    .sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split('.');
      const [dayB, monthB, yearB] = b.date.split('.');
      const dateA = new Date(parseInt(yearA), parseInt(monthA) - 1, parseInt(dayA));
      const dateB = new Date(parseInt(yearB), parseInt(monthB) - 1, parseInt(dayB));
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 5);

  const formatDateHeader = (dateStr: string) => {
    const [day, month, year] = dateStr.split('.');
    const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
    const weekdays = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'];
    const months = [
      'января',
      'февраля',
      'марта',
      'апреля',
      'мая',
      'июня',
      'июля',
      'августа',
      'сентября',
      'октября',
      'ноября',
      'декабря',
    ];
    return `${weekdays[date.getDay()]}, ${parseInt(day)} ${months[date.getMonth()]} ${year}`;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50">
      <header className="bg-gradient-to-r from-primary via-primary to-blue-800 text-primary-foreground shadow-lg border-b-4 border-blue-900">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="bg-white/10 p-3 rounded-lg backdrop-blur-sm">
                <Icon name="Building2" size={32} />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">Рабочий кабинет депутата</h1>
                <p className="text-sm opacity-90 font-medium">Государственная Дума Российской Федерации</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="ghost"
                size="icon"
                className="text-primary-foreground hover:bg-white/20 rounded-full"
              >
                <Icon name="Bell" size={20} />
              </Button>
              <Avatar className="ring-2 ring-white/30">
                <AvatarFallback className="bg-secondary text-secondary-foreground font-bold">
                  ДГ
                </AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as 'active' | 'archive')}>
              <Card className="shadow-lg border-t-4 border-t-primary">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <CardTitle className="flex items-center gap-2">
                        <Icon name="Calendar" size={22} className="text-primary" />
                        <span className="text-xl">График работы депутата</span>
                      </CardTitle>
                      <div className="flex gap-2 flex-wrap">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" className="shadow-sm">
                              <Icon name="Download" size={16} className="mr-2" />
                              Экспорт
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent>
                            <DropdownMenuItem onClick={() => exportToPDF()}>
                              <Icon name="FileDown" size={16} className="mr-2" />
                              Скачать PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => printSchedule()}>
                              <Icon name="Printer" size={16} className="mr-2" />
                              Печать
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Dialog open={isPersonDialogOpen} onOpenChange={setIsPersonDialogOpen}>
                          <DialogTrigger asChild>
                            <Button variant="outline" className="shadow-sm">
                              <Icon name="Users" size={16} className="mr-2" />
                              Ответственные
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Управление ответственными лицами</DialogTitle>
                              <DialogDescription>
                                Добавьте или удалите ответственных за мероприятия
                              </DialogDescription>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                              <div className="space-y-3">
                                {responsiblePersons.map((person) => (
                                  <Card key={person.id} className="p-4">
                                    <div className="flex items-start justify-between">
                                      <div className="space-y-1">
                                        <h4 className="font-semibold">{person.name}</h4>
                                        <p className="text-sm text-muted-foreground">{person.position}</p>
                                        {person.phone && (
                                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Icon name="Phone" size={12} />
                                            {person.phone}
                                          </p>
                                        )}
                                        {person.email && (
                                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                                            <Icon name="Mail" size={12} />
                                            {person.email}
                                          </p>
                                        )}
                                      </div>
                                      <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={() => handleDeletePerson(person.id)}
                                      >
                                        <Icon name="Trash2" size={16} className="text-destructive" />
                                      </Button>
                                    </div>
                                  </Card>
                                ))}
                              </div>
                              <div className="border-t pt-4 space-y-3">
                                <h4 className="font-semibold">Добавить ответственное лицо</h4>
                                <div className="grid gap-3">
                                  <div className="space-y-2">
                                    <Label htmlFor="person-name">ФИО</Label>
                                    <Input
                                      id="person-name"
                                      value={newPerson.name}
                                      onChange={(e) => setNewPerson({ ...newPerson, name: e.target.value })}
                                      placeholder="Иванов Иван Иванович"
                                    />
                                  </div>
                                  <div className="space-y-2">
                                    <Label htmlFor="person-position">Должность</Label>
                                    <Input
                                      id="person-position"
                                      value={newPerson.position}
                                      onChange={(e) => setNewPerson({ ...newPerson, position: e.target.value })}
                                      placeholder="Помощник депутата"
                                    />
                                  </div>
                                  <div className="grid grid-cols-2 gap-3">
                                    <div className="space-y-2">
                                      <Label htmlFor="person-phone">Телефон</Label>
                                      <Input
                                        id="person-phone"
                                        value={newPerson.phone}
                                        onChange={(e) => setNewPerson({ ...newPerson, phone: e.target.value })}
                                        placeholder="+7 (495) 123-45-67"
                                      />
                                    </div>
                                    <div className="space-y-2">
                                      <Label htmlFor="person-email">Email</Label>
                                      <Input
                                        id="person-email"
                                        type="email"
                                        value={newPerson.email}
                                        onChange={(e) => setNewPerson({ ...newPerson, email: e.target.value })}
                                        placeholder="email@duma.gov.ru"
                                      />
                                    </div>
                                  </div>
                                  <Button onClick={handleAddPerson} className="w-full">
                                    <Icon name="Plus" size={16} className="mr-2" />
                                    Добавить
                                  </Button>
                                </div>
                              </div>
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsPersonDialogOpen(false)}>
                                Закрыть
                              </Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                        <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                          <DialogTrigger asChild>
                            <Button className="shadow-sm">
                              <Icon name="Plus" size={16} className="mr-2" />
                              Добавить мероприятие
                            </Button>
                          </DialogTrigger>
                          <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                              <DialogTitle>Добавить мероприятие в график</DialogTitle>
                              <DialogDescription>
                                Заполните информацию о новом мероприятии в графике работы
                              </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="date">Дата</Label>
                                  <Input
                                    id="date"
                                    type="date"
                                    value={newEvent.date}
                                    onChange={(e) => setNewEvent({ ...newEvent, date: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="type">Тип мероприятия</Label>
                                  <Select
                                    value={newEvent.type}
                                    onValueChange={(value) =>
                                      setNewEvent({ ...newEvent, type: value as ScheduleEvent['type'] })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="session">Заседание</SelectItem>
                                      <SelectItem value="committee">Комитет</SelectItem>
                                      <SelectItem value="meeting">Встреча</SelectItem>
                                      <SelectItem value="visit">Поездка</SelectItem>
                                      <SelectItem value="vcs">ВКС</SelectItem>
                                      <SelectItem value="regional-trip">Выезд в регион</SelectItem>
                                      <SelectItem value="other">Другое</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                  <Label htmlFor="timeStart">Время начала</Label>
                                  <Input
                                    id="timeStart"
                                    type="time"
                                    value={newEvent.timeStart}
                                    onChange={(e) => setNewEvent({ ...newEvent, timeStart: e.target.value })}
                                  />
                                </div>
                                <div className="space-y-2">
                                  <Label htmlFor="timeEnd">Время окончания</Label>
                                  <Input
                                    id="timeEnd"
                                    type="time"
                                    value={newEvent.timeEnd}
                                    onChange={(e) => setNewEvent({ ...newEvent, timeEnd: e.target.value })}
                                  />
                                </div>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="title">Название</Label>
                                <Input
                                  id="title"
                                  value={newEvent.title}
                                  onChange={(e) => setNewEvent({ ...newEvent, title: e.target.value })}
                                  placeholder="Введите название мероприятия"
                                />
                              </div>
                              {newEvent.type === 'vcs' ? (
                                <div className="space-y-2">
                                  <Label htmlFor="vcsLink">Ссылка на ВКС</Label>
                                  <Input
                                    id="vcsLink"
                                    value={newEvent.vcsLink}
                                    onChange={(e) => setNewEvent({ ...newEvent, vcsLink: e.target.value })}
                                    placeholder="Введите ссылку на видеоконференцсвязь"
                                  />
                                </div>
                              ) : newEvent.type === 'regional-trip' ? (
                                <div className="space-y-2">
                                  <Label htmlFor="regionName">Название региона</Label>
                                  <Input
                                    id="regionName"
                                    value={newEvent.regionName}
                                    onChange={(e) => setNewEvent({ ...newEvent, regionName: e.target.value })}
                                    placeholder="Например: Московская область"
                                  />
                                </div>
                              ) : (
                                <div className="space-y-2">
                                  <Label htmlFor="location">Место проведения</Label>
                                  <Input
                                    id="location"
                                    value={newEvent.location}
                                    onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                                    placeholder="Введите место проведения"
                                  />
                                </div>
                              )}
                              <div className="space-y-2">
                                <Label htmlFor="responsiblePerson">Ответственный</Label>
                                <Select
                                  value={newEvent.responsiblePersonId ? String(newEvent.responsiblePersonId) : 'none'}
                                  onValueChange={(value) =>
                                    setNewEvent({ ...newEvent, responsiblePersonId: value === 'none' ? undefined : parseInt(value) })
                                  }
                                >
                                  <SelectTrigger>
                                    <SelectValue placeholder="Выберите ответственного" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="none">Не назначен</SelectItem>
                                    {responsiblePersons.map((person) => (
                                      <SelectItem key={person.id} value={String(person.id)}>
                                        {person.name} ({person.position})
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div className="space-y-2">
                                <Label htmlFor="description">Описание</Label>
                                <Textarea
                                  id="description"
                                  value={newEvent.description}
                                  onChange={(e) => setNewEvent({ ...newEvent, description: e.target.value })}
                                  placeholder="Введите описание мероприятия"
                                  rows={3}
                                />
                              </div>
                              <div className="flex items-center justify-between p-4 border rounded-lg">
                                <div className="space-y-1">
                                  <Label htmlFor="reminder">Напоминание</Label>
                                  <p className="text-sm text-muted-foreground">
                                    Получать уведомление перед мероприятием
                                  </p>
                                </div>
                                <Switch
                                  id="reminder"
                                  checked={newEvent.reminder}
                                  onCheckedChange={(checked) => setNewEvent({ ...newEvent, reminder: checked })}
                                />
                              </div>
                              {newEvent.reminder && (
                                <div className="space-y-2">
                                  <Label htmlFor="reminderMinutes">За сколько минут напомнить</Label>
                                  <Select
                                    value={String(newEvent.reminderMinutes)}
                                    onValueChange={(value) =>
                                      setNewEvent({ ...newEvent, reminderMinutes: parseInt(value) })
                                    }
                                  >
                                    <SelectTrigger>
                                      <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                      <SelectItem value="5">За 5 минут</SelectItem>
                                      <SelectItem value="15">За 15 минут</SelectItem>
                                      <SelectItem value="30">За 30 минут</SelectItem>
                                      <SelectItem value="60">За 1 час</SelectItem>
                                      <SelectItem value="120">За 2 часа</SelectItem>
                                    </SelectContent>
                                  </Select>
                                </div>
                              )}
                            </div>
                            <DialogFooter>
                              <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                                Отмена
                              </Button>
                              <Button onClick={handleAddEvent}>Добавить</Button>
                            </DialogFooter>
                          </DialogContent>
                        </Dialog>
                      </div>
                    </div>
                    
                    <TabsList className="grid w-full grid-cols-2 max-w-md">
                      <TabsTrigger value="active">
                        <Icon name="Calendar" size={16} className="mr-2" />
                        Активные
                      </TabsTrigger>
                      <TabsTrigger value="archive">
                        <Icon name="Archive" size={16} className="mr-2" />
                        Архив
                      </TabsTrigger>
                    </TabsList>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      <div className="relative">
                        <Icon
                          name="Search"
                          size={18}
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground"
                        />
                        <Input
                          placeholder="Поиск..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="pl-10 bg-white shadow-sm"
                        />
                      </div>
                      <Select value={filterType} onValueChange={setFilterType}>
                        <SelectTrigger className="bg-white shadow-sm">
                          <SelectValue placeholder="Тип" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Все типы</SelectItem>
                          <SelectItem value="session">Заседание</SelectItem>
                          <SelectItem value="committee">Комитет</SelectItem>
                          <SelectItem value="meeting">Встреча</SelectItem>
                          <SelectItem value="visit">Поездка</SelectItem>
                          <SelectItem value="vcs">ВКС</SelectItem>
                          <SelectItem value="regional-trip">Выезд в регион</SelectItem>
                          <SelectItem value="other">Другое</SelectItem>
                        </SelectContent>
                      </Select>
                      <Select value={filterStatus} onValueChange={setFilterStatus}>
                        <SelectTrigger className="bg-white shadow-sm">
                          <SelectValue placeholder="Статус" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="all">Все статусы</SelectItem>
                          <SelectItem value="scheduled">Запланировано</SelectItem>
                          <SelectItem value="in-progress">Идёт сейчас</SelectItem>
                          <SelectItem value="completed">Завершено</SelectItem>
                          <SelectItem value="cancelled">Отменено</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardHeader>
                
                <TabsContent value="active" className="m-0">
                  <CardContent className="p-6">
                    {sortedDates.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Icon name="CalendarX" size={48} className="mx-auto mb-3 opacity-50" />
                        <p className="text-lg font-medium">Мероприятия не найдены</p>
                        <p className="text-sm">Попробуйте изменить параметры поиска</p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {sortedDates.map((dateStr) => (
                          <div key={dateStr} className="space-y-3">
                            <div className="flex items-center gap-3 pb-2 border-b-2 border-primary/20">
                              <Icon name="CalendarDays" size={20} className="text-primary" />
                              <h3 className="text-lg font-bold text-primary flex-1">{formatDateHeader(dateStr)}</h3>
                              <Badge variant="outline">
                                {groupedEvents[dateStr].length} мероприятий
                              </Badge>
                              <DropdownMenu>
                                <DropdownMenuTrigger asChild>
                                  <Button variant="outline" size="sm" className="shadow-sm">
                                    <Icon name="Download" size={14} className="mr-1" />
                                    Экспорт
                                  </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent>
                                  <DropdownMenuItem onClick={() => exportDayToPDF(dateStr)}>
                                    <Icon name="FileDown" size={14} className="mr-2" />
                                    PDF
                                  </DropdownMenuItem>
                                  <DropdownMenuItem onClick={() => printDay(dateStr)}>
                                    <Icon name="Printer" size={14} className="mr-2" />
                                    Печать
                                  </DropdownMenuItem>
                                </DropdownMenuContent>
                              </DropdownMenu>
                            </div>
                            <div className="grid gap-3">
                              {groupedEvents[dateStr].map((event) => (
                                <Card
                                  key={event.id}
                                  className={`hover:shadow-md transition-all border-l-4 cursor-pointer ${
                                    event.status === 'in-progress'
                                      ? 'border-l-green-500 bg-green-50/50'
                                      : event.status === 'completed'
                                      ? 'border-l-gray-400 bg-gray-50/50'
                                      : event.status === 'cancelled'
                                      ? 'border-l-red-400 bg-red-50/50'
                                      : 'border-l-blue-500'
                                  }`}
                                  onClick={() => openViewDialog(event)}
                                >
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex items-start gap-4 flex-1">
                                        <div className={`p-3 rounded-lg ${typeColors[event.type]} border shrink-0`}>
                                          <Icon name={typeIcons[event.type]} size={24} />
                                        </div>
                                        <div className="flex-1 space-y-2 min-w-0">
                                          <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                              <h4 className="font-bold text-lg leading-tight mb-1 truncate">
                                                {event.title}
                                              </h4>
                                              <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                                                <div className="flex items-center gap-1">
                                                  <Icon name="Clock" size={14} />
                                                  <span className="font-medium">
                                                    {event.timeStart} — {event.timeEnd}
                                                  </span>
                                                </div>
                                                {event.type === 'vcs' ? (
                                                  <div className="flex items-center gap-1">
                                                    <Icon name="Video" size={14} />
                                                    <a
                                                      href={event.vcsLink}
                                                      target="_blank"
                                                      rel="noopener noreferrer"
                                                      onClick={(e) => e.stopPropagation()}
                                                      className="text-primary hover:underline truncate"
                                                    >
                                                      Подключиться к ВКС
                                                    </a>
                                                  </div>
                                                ) : event.type === 'regional-trip' ? (
                                                  <div className="flex items-center gap-1">
                                                    <Icon name="Plane" size={14} />
                                                    <span className="truncate">{event.regionName || 'Регион'}</span>
                                                  </div>
                                                ) : (
                                                  <div className="flex items-center gap-1">
                                                    <Icon name="MapPin" size={14} />
                                                    <span className="truncate">{event.location}</span>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                          {event.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                              {event.description}
                                            </p>
                                          )}
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <Badge variant="outline" className={typeColors[event.type]}>
                                              {typeLabels[event.type]}
                                            </Badge>
                                            <Badge
                                              variant={
                                                event.status === 'in-progress'
                                                  ? 'default'
                                                  : event.status === 'completed'
                                                  ? 'secondary'
                                                  : event.status === 'cancelled'
                                                  ? 'destructive'
                                                  : 'outline'
                                              }
                                            >
                                              {statusLabels[event.status]}
                                            </Badge>
                                            {event.reminder && (
                                              <Badge variant="outline" className="flex items-center gap-1">
                                                <Icon name="Bell" size={12} />
                                                {event.reminderMinutes} мин
                                              </Badge>
                                            )}
                                            {event.responsiblePersonId && responsiblePersons.find(p => p.id === event.responsiblePersonId) && (
                                              <Badge variant="outline" className="flex items-center gap-1">
                                                <Icon name="User" size={12} />
                                                {responsiblePersons.find(p => p.id === event.responsiblePersonId)?.name.split(' ')[0]}
                                              </Badge>
                                            )}
                                          </div>
                                        </div>
                                      </div>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                          <Button variant="ghost" size="icon" className="shrink-0">
                                            <Icon name="MoreVertical" size={18} />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              openEditDialog(event);
                                            }}
                                          >
                                            <Icon name="Pencil" size={16} className="mr-2" />
                                            Редактировать
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleArchiveEvent(event.id);
                                            }}
                                          >
                                            <Icon name="Archive" size={16} className="mr-2" />
                                            В архив
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteEvent(event.id);
                                            }}
                                            className="text-destructive focus:text-destructive"
                                          >
                                            <Icon name="Trash2" size={16} className="mr-2" />
                                            Удалить
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </TabsContent>

                <TabsContent value="archive" className="m-0">
                  <CardContent className="p-6">
                    {sortedDates.length === 0 ? (
                      <div className="text-center py-12 text-muted-foreground">
                        <Icon name="Archive" size={48} className="mx-auto mb-3 opacity-50" />
                        <p className="text-lg font-medium">Архив пуст</p>
                        <p className="text-sm">Завершённые мероприятия будут отображаться здесь</p>
                      </div>
                    ) : (
                      <div className="space-y-8">
                        {sortedDates.map((dateStr) => (
                          <div key={dateStr} className="space-y-3">
                            <div className="flex items-center gap-3 pb-2 border-b-2 border-gray-300">
                              <Icon name="CalendarDays" size={20} className="text-gray-600" />
                              <h3 className="text-lg font-bold text-gray-700 flex-1">{formatDateHeader(dateStr)}</h3>
                              <Badge variant="outline">
                                {groupedEvents[dateStr].length} мероприятий
                              </Badge>
                            </div>
                            <div className="grid gap-3">
                              {groupedEvents[dateStr].map((event) => (
                                <Card
                                  key={event.id}
                                  className="hover:shadow-md transition-all border-l-4 border-l-gray-400 bg-gray-50/30 cursor-pointer"
                                  onClick={() => openViewDialog(event)}
                                >
                                  <CardContent className="p-4">
                                    <div className="flex items-start justify-between gap-4">
                                      <div className="flex items-start gap-4 flex-1">
                                        <div className={`p-3 rounded-lg ${typeColors[event.type]} border shrink-0 opacity-70`}>
                                          <Icon name={typeIcons[event.type]} size={24} />
                                        </div>
                                        <div className="flex-1 space-y-2 min-w-0">
                                          <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                              <h4 className="font-bold text-lg leading-tight mb-1 truncate text-gray-700">
                                                {event.title}
                                              </h4>
                                              <div className="flex items-center gap-3 text-sm text-muted-foreground flex-wrap">
                                                <div className="flex items-center gap-1">
                                                  <Icon name="Clock" size={14} />
                                                  <span className="font-medium">
                                                    {event.timeStart} — {event.timeEnd}
                                                  </span>
                                                </div>
                                                {event.type === 'vcs' ? (
                                                  <div className="flex items-center gap-1">
                                                    <Icon name="Video" size={14} />
                                                    <span className="truncate">ВКС</span>
                                                  </div>
                                                ) : event.type === 'regional-trip' ? (
                                                  <div className="flex items-center gap-1">
                                                    <Icon name="Plane" size={14} />
                                                    <span className="truncate">{event.regionName || 'Регион'}</span>
                                                  </div>
                                                ) : (
                                                  <div className="flex items-center gap-1">
                                                    <Icon name="MapPin" size={14} />
                                                    <span className="truncate">{event.location}</span>
                                                  </div>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                          {event.description && (
                                            <p className="text-sm text-muted-foreground line-clamp-2">
                                              {event.description}
                                            </p>
                                          )}
                                          <div className="flex items-center gap-2 flex-wrap">
                                            <Badge variant="outline" className={typeColors[event.type]}>
                                              {typeLabels[event.type]}
                                            </Badge>
                                            <Badge variant="secondary">
                                              {statusLabels[event.status]}
                                            </Badge>
                                          </div>
                                        </div>
                                      </div>
                                      <DropdownMenu>
                                        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
                                          <Button variant="ghost" size="icon" className="shrink-0">
                                            <Icon name="MoreVertical" size={18} />
                                          </Button>
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent align="end">
                                          <DropdownMenuItem
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleUnarchiveEvent(event.id);
                                            }}
                                          >
                                            <Icon name="ArchiveRestore" size={16} className="mr-2" />
                                            Восстановить
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={(e) => {
                                              e.stopPropagation();
                                              handleDeleteEvent(event.id);
                                            }}
                                            className="text-destructive focus:text-destructive"
                                          >
                                            <Icon name="Trash2" size={16} className="mr-2" />
                                            Удалить
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    </div>
                                  </CardContent>
                                </Card>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </TabsContent>
              </Card>
            </Tabs>
          </div>

          <div className="space-y-6">
            <Card className="shadow-lg border-t-4 border-t-primary">
              <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Icon name="CalendarDays" size={20} className="text-primary" />
                  Календарь
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border shadow-sm"
                />
              </CardContent>
            </Card>

            <Card className="shadow-lg border-t-4 border-t-orange-500">
              <CardHeader className="bg-gradient-to-r from-orange-50 to-amber-50 border-b">
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Bell" size={20} className="text-orange-600" />
                  Ближайшие напоминания
                </CardTitle>
              </CardHeader>
              <CardContent className="p-4">
                {upcomingReminders.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingReminders.map((event) => (
                      <div
                        key={event.id}
                        className="p-3 border rounded-lg hover:bg-muted/50 transition-colors bg-white shadow-sm cursor-pointer"
                        onClick={() => openViewDialog(event)}
                      >
                        <div className="flex items-start justify-between mb-2">
                          <h4 className="font-semibold text-sm leading-tight pr-2">{event.title}</h4>
                          <Badge variant="outline" className="text-xs shrink-0">
                            {event.date}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center gap-1 text-xs text-muted-foreground">
                            <Icon name="Clock" size={12} />
                            <span>{event.timeStart}</span>
                          </div>
                          <div className="flex items-center gap-1 text-xs text-primary font-medium">
                            <Icon name="Bell" size={12} />
                            <span>За {event.reminderMinutes} мин</span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Icon name="BellOff" size={32} className="mx-auto mb-2 text-muted-foreground opacity-50" />
                    <p className="text-sm text-muted-foreground">Нет активных напоминаний</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Редактировать мероприятие</DialogTitle>
            <DialogDescription>Измените информацию о мероприятии</DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-date">Дата</Label>
                <Input
                  id="edit-date"
                  type="date"
                  value={editEvent.date}
                  onChange={(e) => setEditEvent({ ...editEvent, date: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-type">Тип мероприятия</Label>
                <Select
                  value={editEvent.type}
                  onValueChange={(value) =>
                    setEditEvent({ ...editEvent, type: value as ScheduleEvent['type'] })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="session">Заседание</SelectItem>
                    <SelectItem value="committee">Комитет</SelectItem>
                    <SelectItem value="meeting">Встреча</SelectItem>
                    <SelectItem value="visit">Поездка</SelectItem>
                    <SelectItem value="vcs">ВКС</SelectItem>
                    <SelectItem value="regional-trip">Выезд в регион</SelectItem>
                    <SelectItem value="other">Другое</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-timeStart">Время начала</Label>
                <Input
                  id="edit-timeStart"
                  type="time"
                  value={editEvent.timeStart}
                  onChange={(e) => setEditEvent({ ...editEvent, timeStart: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-timeEnd">Время окончания</Label>
                <Input
                  id="edit-timeEnd"
                  type="time"
                  value={editEvent.timeEnd}
                  onChange={(e) => setEditEvent({ ...editEvent, timeEnd: e.target.value })}
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-title">Название</Label>
              <Input
                id="edit-title"
                value={editEvent.title}
                onChange={(e) => setEditEvent({ ...editEvent, title: e.target.value })}
                placeholder="Введите название мероприятия"
              />
            </div>
            {editEvent.type === 'vcs' ? (
              <div className="space-y-2">
                <Label htmlFor="edit-vcsLink">Ссылка на ВКС</Label>
                <Input
                  id="edit-vcsLink"
                  value={editEvent.vcsLink}
                  onChange={(e) => setEditEvent({ ...editEvent, vcsLink: e.target.value })}
                  placeholder="Введите ссылку на видеоконференцсвязь"
                />
              </div>
            ) : editEvent.type === 'regional-trip' ? (
              <div className="space-y-2">
                <Label htmlFor="edit-regionName">Название региона</Label>
                <Input
                  id="edit-regionName"
                  value={editEvent.regionName}
                  onChange={(e) => setEditEvent({ ...editEvent, regionName: e.target.value })}
                  placeholder="Например: Московская область"
                />
              </div>
            ) : (
              <div className="space-y-2">
                <Label htmlFor="edit-location">Место проведения</Label>
                <Input
                  id="edit-location"
                  value={editEvent.location}
                  onChange={(e) => setEditEvent({ ...editEvent, location: e.target.value })}
                  placeholder="Введите место проведения"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="edit-responsiblePerson">Ответственный</Label>
              <Select
                value={editEvent.responsiblePersonId ? String(editEvent.responsiblePersonId) : 'none'}
                onValueChange={(value) =>
                  setEditEvent({ ...editEvent, responsiblePersonId: value === 'none' ? undefined : parseInt(value) })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Выберите ответственного" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Не назначен</SelectItem>
                  {responsiblePersons.map((person) => (
                    <SelectItem key={person.id} value={String(person.id)}>
                      {person.name} ({person.position})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Описание</Label>
              <Textarea
                id="edit-description"
                value={editEvent.description}
                onChange={(e) => setEditEvent({ ...editEvent, description: e.target.value })}
                placeholder="Введите описание мероприятия"
                rows={3}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-status">Статус</Label>
              <Select
                value={editEvent.status}
                onValueChange={(value) =>
                  setEditEvent({ ...editEvent, status: value as ScheduleEvent['status'] })
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="scheduled">Запланировано</SelectItem>
                  <SelectItem value="in-progress">Идёт сейчас</SelectItem>
                  <SelectItem value="completed">Завершено</SelectItem>
                  <SelectItem value="cancelled">Отменено</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center justify-between p-4 border rounded-lg">
              <div className="space-y-1">
                <Label htmlFor="edit-reminder">Напоминание</Label>
                <p className="text-sm text-muted-foreground">Получать уведомление перед мероприятием</p>
              </div>
              <Switch
                id="edit-reminder"
                checked={editEvent.reminder}
                onCheckedChange={(checked) => setEditEvent({ ...editEvent, reminder: checked })}
              />
            </div>
            {editEvent.reminder && (
              <div className="space-y-2">
                <Label htmlFor="edit-reminderMinutes">За сколько минут напомнить</Label>
                <Select
                  value={String(editEvent.reminderMinutes)}
                  onValueChange={(value) =>
                    setEditEvent({ ...editEvent, reminderMinutes: parseInt(value) })
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">За 5 минут</SelectItem>
                    <SelectItem value="15">За 15 минут</SelectItem>
                    <SelectItem value="30">За 30 минут</SelectItem>
                    <SelectItem value="60">За 1 час</SelectItem>
                    <SelectItem value="120">За 2 часа</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Отмена
            </Button>
            <Button onClick={handleEditEvent}>Сохранить изменения</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-2xl">{selectedEvent?.title}</DialogTitle>
            <DialogDescription>Подробная информация о мероприятии</DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Дата</Label>
                  <p className="font-semibold">{formatDateHeader(selectedEvent.date)}</p>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Время</Label>
                  <p className="font-semibold">
                    {selectedEvent.timeStart} — {selectedEvent.timeEnd}
                  </p>
                </div>
              </div>
              {selectedEvent.type === 'vcs' ? (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Ссылка на ВКС</Label>
                  <div className="flex items-center gap-2">
                    <Icon name="Video" size={16} className="text-primary" />
                    <a 
                      href={selectedEvent.vcsLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="font-semibold text-primary hover:underline break-all"
                    >
                      {selectedEvent.vcsLink}
                    </a>
                  </div>
                </div>
              ) : selectedEvent.type === 'regional-trip' ? (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Регион поездки</Label>
                  <div className="flex items-center gap-2">
                    <Icon name="Plane" size={16} className="text-primary" />
                    <p className="font-semibold">{selectedEvent.regionName}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Место проведения</Label>
                  <div className="flex items-center gap-2">
                    <Icon name="MapPin" size={16} className="text-primary" />
                    <p className="font-semibold">{selectedEvent.location}</p>
                  </div>
                </div>
              )}
              {selectedEvent.responsiblePersonId && responsiblePersons.find(p => p.id === selectedEvent.responsiblePersonId) && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Ответственный</Label>
                  <div className="flex items-center gap-2">
                    <Icon name="User" size={16} className="text-primary" />
                    <div>
                      <p className="font-semibold">
                        {responsiblePersons.find(p => p.id === selectedEvent.responsiblePersonId)?.name}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {responsiblePersons.find(p => p.id === selectedEvent.responsiblePersonId)?.position}
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {selectedEvent.description && (
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Описание</Label>
                  <p className="text-sm">{selectedEvent.description}</p>
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Тип мероприятия</Label>
                  <Badge className={typeColors[selectedEvent.type]}>
                    <Icon name={typeIcons[selectedEvent.type]} size={14} className="mr-1" />
                    {typeLabels[selectedEvent.type]}
                  </Badge>
                </div>
                <div className="space-y-2">
                  <Label className="text-muted-foreground">Статус</Label>
                  <Badge
                    variant={
                      selectedEvent.status === 'in-progress'
                        ? 'default'
                        : selectedEvent.status === 'completed'
                        ? 'secondary'
                        : selectedEvent.status === 'cancelled'
                        ? 'destructive'
                        : 'outline'
                    }
                  >
                    {statusLabels[selectedEvent.status]}
                  </Badge>
                </div>
              </div>
              {selectedEvent.reminder && (
                <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
                  <Icon name="Bell" size={16} className="text-orange-600" />
                  <p className="text-sm font-medium text-orange-800">
                    Напоминание за {selectedEvent.reminderMinutes} минут до начала
                  </p>
                </div>
              )}
            </div>
          )}
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsViewDialogOpen(false)}>
              Закрыть
            </Button>
            <Button
              onClick={() => {
                setIsViewDialogOpen(false);
                if (selectedEvent) {
                  openEditDialog(selectedEvent);
                }
              }}
            >
              <Icon name="Pencil" size={16} className="mr-2" />
              Редактировать
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Index;