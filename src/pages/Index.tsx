import { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ScheduleEvent, ResponsiblePerson } from '@/types/schedule';
import { EventFormDialog } from '@/components/schedule/EventFormDialog';
import { EventViewDialog } from '@/components/schedule/EventViewDialog';
import { ResponsiblePersonDialog } from '@/components/schedule/ResponsiblePersonDialog';
import { EventList } from '@/components/schedule/EventList';
import { useSchedule } from '@/hooks/useSchedule';

const Index = () => {
  const { events: scheduleEvents, persons: responsiblePersons, loading, addEvent, updateEvent, deleteEvent, addPerson, deletePerson } = useSchedule();
  
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

  const [newPerson, setNewPerson] = useState<Partial<ResponsiblePerson>>({
    name: '',
    position: '',
    phone: '',
    email: '',
  });



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

  const handleExportToPDF = async () => {
    const eventsToExport = scheduleEvents.filter((e) => !e.archived);
    const { exportToPDF } = await import('@/utils/pdfExport');
    exportToPDF(eventsToExport, responsiblePersons);
  };

  const handlePrintSchedule = async () => {
    const eventsToExport = scheduleEvents.filter((e) => !e.archived);
    const { printSchedule } = await import('@/utils/pdfExport');
    printSchedule(eventsToExport, responsiblePersons);
  };

  const exportDayToPDF = async (dateStr: string) => {
    const dayEvents = scheduleEvents.filter((e) => e.date === dateStr && !e.archived);
    const { exportToPDF } = await import('@/utils/pdfExport');
    exportToPDF(dayEvents, responsiblePersons, dateStr);
  };

  const printDay = async (dateStr: string) => {
    const dayEvents = scheduleEvents.filter((e) => e.date === dateStr && !e.archived);
    const { printSchedule } = await import('@/utils/pdfExport');
    printSchedule(dayEvents, responsiblePersons, dateStr);
  };

  useEffect(() => {
    const updateStatuses = async () => {
      const now = new Date();

      for (const event of scheduleEvents) {
        if (event.archived || event.status === 'cancelled') continue;

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
        let newArchived = event.archived;

        if (now >= eventEnd && event.status !== 'completed') {
          newStatus = 'completed';
          const daysSinceEnd = Math.floor((now.getTime() - eventEnd.getTime()) / (1000 * 60 * 60 * 24));
          if (daysSinceEnd >= 7 && !event.archived) {
            newArchived = true;
          }
        } else if (now >= eventStart && now < eventEnd && event.status === 'scheduled') {
          newStatus = 'in-progress';
        }

        if (newStatus !== event.status || newArchived !== event.archived) {
          await updateEvent({ ...event, status: newStatus, archived: newArchived });
        }

        if (event.reminder && event.reminderMinutes && event.status === 'scheduled') {
          const reminderTime = new Date(eventStart.getTime() - event.reminderMinutes * 60000);
          if (now >= reminderTime && now < eventStart) {
            toast.info(`Напоминание: ${event.title}`, {
              description: `Начало через ${event.reminderMinutes} мин. ${
                event.type === 'vcs' && event.vcsLink
                  ? 'Ссылка: ' + event.vcsLink
                  : 'Место: ' + event.location
              }`,
              duration: 10000,
            });
          }
        }
      }
    };

    updateStatuses();
    const interval = setInterval(updateStatuses, 60000);

    return () => clearInterval(interval);
  }, [scheduleEvents, updateEvent]);

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

  const handleAddEvent = async () => {
    if (newEvent.title && newEvent.date && newEvent.timeStart && newEvent.timeEnd) {
      const [year, month, day] = newEvent.date!.split('-');
      const formattedDate = `${day}.${month}.${year}`;

      await addEvent({
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
      });
      
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

  const handleEditEvent = async () => {
    if (editEvent.id && editEvent.title && editEvent.date && editEvent.timeStart && editEvent.timeEnd) {
      let formattedDate = editEvent.date!;
      if (editEvent.date!.includes('-')) {
        const [year, month, day] = editEvent.date!.split('-');
        formattedDate = `${day}.${month}.${year}`;
      }

      await updateEvent({
        id: editEvent.id,
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
        archived: editEvent.archived || false,
      } as ScheduleEvent);
      
      setIsEditDialogOpen(false);
      setEditEvent({});
      toast.success('Мероприятие обновлено');
    }
  };

  const handleDeleteEvent = async (id: number) => {
    await deleteEvent(id);
    toast.success('Мероприятие удалено из графика');
  };

  const handleArchiveEvent = async (id: number) => {
    const event = scheduleEvents.find(e => e.id === id);
    if (event) {
      await updateEvent({ ...event, archived: true });
      toast.success('Мероприятие перемещено в архив');
    }
  };

  const handleUnarchiveEvent = async (id: number) => {
    const event = scheduleEvents.find(e => e.id === id);
    if (event) {
      await updateEvent({ ...event, archived: false });
      toast.success('Мероприятие восстановлено из архива');
    }
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

  const handleAddPerson = async () => {
    if (newPerson.name && newPerson.position) {
      await addPerson({
        name: newPerson.name!,
        position: newPerson.position!,
        phone: newPerson.phone || '',
        email: newPerson.email || '',
      });
      
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

  const handleDeletePerson = async (id: number) => {
    await deletePerson(id);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Icon name="Loader2" size={48} className="animate-spin text-primary mx-auto mb-4" />
          <p className="text-lg text-muted-foreground">Загрузка данных...</p>
        </div>
      </div>
    );
  }

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
                            <DropdownMenuItem onClick={handleExportToPDF}>
                              <Icon name="FileDown" size={16} className="mr-2" />
                              Скачать PDF
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={handlePrintSchedule}>
                              <Icon name="Printer" size={16} className="mr-2" />
                              Печать
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        <Button variant="outline" className="shadow-sm" onClick={() => setIsPersonDialogOpen(true)}>
                          <Icon name="Users" size={16} className="mr-2" />
                          Ответственные
                        </Button>
                        <Button className="shadow-sm" onClick={() => setIsAddDialogOpen(true)}>
                          <Icon name="Plus" size={16} className="mr-2" />
                          Добавить мероприятие
                        </Button>
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
                    <EventList
                      groupedEvents={groupedEvents}
                      sortedDates={sortedDates}
                      responsiblePersons={responsiblePersons}
                      formatDateHeader={formatDateHeader}
                      onView={openViewDialog}
                      onEdit={openEditDialog}
                      onArchive={handleArchiveEvent}
                      onUnarchive={handleUnarchiveEvent}
                      onDelete={handleDeleteEvent}
                      onExportDay={exportDayToPDF}
                      onPrintDay={printDay}
                    />
                  </CardContent>
                </TabsContent>

                <TabsContent value="archive" className="m-0">
                  <CardContent className="p-6">
                    <EventList
                      groupedEvents={groupedEvents}
                      sortedDates={sortedDates}
                      responsiblePersons={responsiblePersons}
                      formatDateHeader={formatDateHeader}
                      onView={openViewDialog}
                      onEdit={openEditDialog}
                      onArchive={handleArchiveEvent}
                      onUnarchive={handleUnarchiveEvent}
                      onDelete={handleDeleteEvent}
                      onExportDay={exportDayToPDF}
                      onPrintDay={printDay}
                      isArchived
                    />
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
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border shadow-sm" />
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

      <EventFormDialog
        open={isAddDialogOpen}
        onOpenChange={setIsAddDialogOpen}
        event={newEvent}
        setEvent={setNewEvent}
        onSave={handleAddEvent}
        responsiblePersons={responsiblePersons}
        title="Добавить мероприятие в график"
      />

      <EventFormDialog
        open={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        event={editEvent}
        setEvent={setEditEvent}
        onSave={handleEditEvent}
        responsiblePersons={responsiblePersons}
        title="Редактировать мероприятие"
        isEdit
      />

      <EventViewDialog
        open={isViewDialogOpen}
        onOpenChange={setIsViewDialogOpen}
        event={selectedEvent}
        responsiblePersons={responsiblePersons}
        onEdit={openEditDialog}
        formatDateHeader={formatDateHeader}
      />

      <ResponsiblePersonDialog
        open={isPersonDialogOpen}
        onOpenChange={setIsPersonDialogOpen}
        responsiblePersons={responsiblePersons}
        newPerson={newPerson}
        setNewPerson={setNewPerson}
        onAddPerson={handleAddPerson}
        onDeletePerson={handleDeletePerson}
      />
    </div>
  );
};

export default Index;