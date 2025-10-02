import { useState } from 'react';
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
  });

  const stats = [
    { label: 'Мероприятий в неделю', value: '12', icon: 'Calendar' },
    { label: 'Заседаний', value: '156', icon: 'Users' },
    { label: 'Выступлений', value: '43', icon: 'Mic' },
    { label: 'Рабочих поездок', value: '28', icon: 'MapPin' },
  ];

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

  const handleAddEvent = () => {
    if (newEvent.title && newEvent.date && newEvent.timeStart && newEvent.timeEnd) {
      const event: ScheduleEvent = {
        id: Math.max(...scheduleEvents.map((e) => e.id)) + 1,
        date: newEvent.date!,
        timeStart: newEvent.timeStart!,
        timeEnd: newEvent.timeEnd!,
        title: newEvent.title!,
        type: newEvent.type as ScheduleEvent['type'],
        location: newEvent.location || '',
        description: newEvent.description || '',
        status: 'scheduled',
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
      });
    }
  };

  const handleDeleteEvent = (id: number) => {
    setScheduleEvents(scheduleEvents.filter((event) => event.id !== id));
  };

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
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">{stat.label}</p>
                    <p className="text-3xl font-bold text-primary">{stat.value}</p>
                  </div>
                  <div className="bg-primary/10 p-3 rounded-lg">
                    <Icon name={stat.icon} size={24} className="text-primary" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2">
                    <Icon name="Calendar" size={20} />
                    График работы
                  </CardTitle>
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
