import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar } from '@/components/ui/calendar';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import Icon from '@/components/ui/icon';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
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
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface ScheduleEvent {
  id: number;
  date: string;
  timeStart: string;
  timeEnd: string;
  title: string;
  type: 'session' | 'committee' | 'meeting' | 'visit' | 'other';
  location: string;
  description: string;
  status: 'scheduled' | 'in-progress' | 'completed' | 'cancelled';
  reminder?: boolean;
  reminderMinutes?: number;
}

const Index = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
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
  });

  const typeLabels = {
    session: 'Заседание',
    committee: 'Комитет',
    meeting: 'Встреча',
    visit: 'Поездка',
    other: 'Другое',
  };

  const typeIcons = {
    session: 'Briefcase',
    committee: 'Users',
    meeting: 'UserCheck',
    visit: 'MapPin',
    other: 'Calendar',
  };

  const statusLabels = {
    scheduled: 'Запланировано',
    'in-progress': 'Идёт сейчас',
    completed: 'Завершено',
    cancelled: 'Отменено',
  };

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();
      scheduleEvents.forEach((event) => {
        if (event.reminder && event.reminderMinutes) {
          const [day, month, year] = event.date.split('.');
          const [hours, minutes] = event.timeStart.split(':');
          const eventTime = new Date(
            parseInt(year),
            parseInt(month) - 1,
            parseInt(day),
            parseInt(hours),
            parseInt(minutes)
          );
          const reminderTime = new Date(eventTime.getTime() - event.reminderMinutes * 60000);

          if (now >= reminderTime && now < eventTime) {
            toast.info(`Напоминание: ${event.title}`, {
              description: `Начало через ${event.reminderMinutes} мин. Место: ${event.location}`,
              duration: 10000,
            });
          }
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [scheduleEvents]);

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.timeStart && newEvent.timeEnd) {
      const event: ScheduleEvent = {
        id: Math.max(...scheduleEvents.map((e) => e.id), 0) + 1,
        date: newEvent.date!,
        timeStart: newEvent.timeStart!,
        timeEnd: newEvent.timeEnd!,
        title: newEvent.title!,
        type: newEvent.type as ScheduleEvent['type'],
        location: newEvent.location || '',
        description: newEvent.description || '',
        status: 'scheduled',
        reminder: newEvent.reminder || false,
        reminderMinutes: newEvent.reminderMinutes || 15,
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
      });
      toast.success('Мероприятие добавлено в график');
    }
  };

  const handleDeleteEvent = (id: number) => {
    setScheduleEvents(scheduleEvents.filter((event) => event.id !== id));
    toast.success('Мероприятие удалено из графика');
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    const addRussianFont = () => {
      doc.addFont(
        'https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.66/fonts/Roboto/Roboto-Regular.ttf',
        'Roboto',
        'normal'
      );
      doc.setFont('Roboto');
    };

    doc.setFontSize(18);
    doc.text('График работы депутата Государственной Думы РФ', 14, 20);
    
    doc.setFontSize(10);
    doc.text(`Дата формирования: ${new Date().toLocaleDateString('ru-RU')}`, 14, 28);

    const tableData = scheduleEvents.map((event) => [
      event.date,
      `${event.timeStart} - ${event.timeEnd}`,
      event.title,
      typeLabels[event.type],
      event.location,
      statusLabels[event.status],
    ]);

    autoTable(doc, {
      startY: 35,
      head: [['Дата', 'Время', 'Мероприятие', 'Тип', 'Место', 'Статус']],
      body: tableData,
      styles: {
        font: 'helvetica',
        fontSize: 9,
      },
      headStyles: {
        fillColor: [0, 57, 166],
        textColor: 255,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [245, 245, 245],
      },
      margin: { top: 35 },
    });

    const pageCount = doc.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i);
      doc.setFontSize(8);
      doc.text(
        `Страница ${i} из ${pageCount}`,
        doc.internal.pageSize.getWidth() / 2,
        doc.internal.pageSize.getHeight() - 10,
        { align: 'center' }
      );
    }

    doc.save(`График_работы_${new Date().toLocaleDateString('ru-RU')}.pdf`);
    toast.success('График экспортирован в PDF');
  };

  const upcomingReminders = scheduleEvents
    .filter((event) => event.reminder && event.status === 'scheduled')
    .sort((a, b) => {
      const [dayA, monthA, yearA] = a.date.split('.');
      const [dayB, monthB, yearB] = b.date.split('.');
      const dateA = new Date(parseInt(yearA), parseInt(monthA) - 1, parseInt(dayA));
      const dateB = new Date(parseInt(yearB), parseInt(monthB) - 1, parseInt(dayB));
      return dateA.getTime() - dateB.getTime();
    })
    .slice(0, 5);

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-primary text-primary-foreground shadow-md">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Icon name="Building2" size={32} />
              <div>
                <h1 className="text-2xl font-bold">Рабочий кабинет депутата</h1>
                <p className="text-sm opacity-90">Государственная Дума РФ</p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon" className="text-primary-foreground hover:bg-primary/80">
                <Icon name="Bell" size={20} />
              </Button>
              <Avatar>
                <AvatarFallback className="bg-secondary text-secondary-foreground">ДГ</AvatarFallback>
              </Avatar>
            </div>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Calendar" size={20} />
                    График работы
                  </CardTitle>
                  <div className="flex gap-2">
                    <Button variant="outline" onClick={exportToPDF}>
                      <Icon name="FileDown" size={16} className="mr-2" />
                      Экспорт в PDF
                    </Button>
                    <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
                      <DialogTrigger asChild>
                        <Button>
                          <Icon name="Plus" size={16} className="mr-2" />
                          Добавить мероприятие
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
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
                          <div className="space-y-2">
                            <Label htmlFor="location">Место проведения</Label>
                            <Input
                              id="location"
                              value={newEvent.location}
                              onChange={(e) => setNewEvent({ ...newEvent, location: e.target.value })}
                              placeholder="Введите место проведения"
                            />
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
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Дата</TableHead>
                      <TableHead>Время</TableHead>
                      <TableHead>Мероприятие</TableHead>
                      <TableHead>Тип</TableHead>
                      <TableHead>Место</TableHead>
                      <TableHead>Статус</TableHead>
                      <TableHead className="text-center">Напоминание</TableHead>
                      <TableHead className="text-right">Действия</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {scheduleEvents.map((event) => (
                      <TableRow key={event.id} className="hover:bg-muted/50">
                        <TableCell className="font-medium">{event.date}</TableCell>
                        <TableCell className="text-sm">
                          {event.timeStart} - {event.timeEnd}
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-semibold">{event.title}</p>
                            {event.description && (
                              <p className="text-sm text-muted-foreground">{event.description}</p>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="flex items-center gap-1 w-fit">
                            <Icon name={typeIcons[event.type]} size={12} />
                            {typeLabels[event.type]}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">{event.location}</TableCell>
                        <TableCell>
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
                        </TableCell>
                        <TableCell className="text-center">
                          {event.reminder ? (
                            <div className="flex items-center justify-center gap-1">
                              <Icon name="Bell" size={14} className="text-primary" />
                              <span className="text-xs text-muted-foreground">
                                {event.reminderMinutes} мин
                              </span>
                            </div>
                          ) : (
                            <span className="text-xs text-muted-foreground">—</span>
                          )}
                        </TableCell>
                        <TableCell className="text-right">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteEvent(event.id)}
                            className="text-destructive hover:text-destructive"
                          >
                            <Icon name="Trash2" size={16} />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="CalendarDays" size={20} />
                  Календарь
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar mode="single" selected={date} onSelect={setDate} className="rounded-md border" />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Bell" size={20} />
                  Ближайшие напоминания
                </CardTitle>
              </CardHeader>
              <CardContent>
                {upcomingReminders.length > 0 ? (
                  <div className="space-y-3">
                    {upcomingReminders.map((event) => (
                      <div
                        key={event.id}
                        className="p-3 border rounded-lg hover:bg-muted/50 transition-colors"
                      >
                        <div className="flex items-start justify-between mb-1">
                          <h4 className="font-semibold text-sm">{event.title}</h4>
                          <Badge variant="outline" className="text-xs">
                            {event.date}
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground mb-1">{event.timeStart}</p>
                        <div className="flex items-center gap-1 text-xs text-primary">
                          <Icon name="Bell" size={12} />
                          <span>За {event.reminderMinutes} мин</span>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-sm text-muted-foreground text-center py-4">
                    Нет активных напоминаний
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
