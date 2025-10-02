import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
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

const Index = () => {
  const [date, setDate] = useState<Date | undefined>(new Date());

  const sessions = [
    {
      id: 1,
      title: 'Пленарное заседание Госдумы',
      time: '10:00 - 14:00',
      status: 'active',
      type: 'session',
    },
    {
      id: 2,
      title: 'Заседание комитета по бюджету',
      time: '15:00 - 17:00',
      status: 'upcoming',
      type: 'committee',
    },
    {
      id: 3,
      title: 'Приём граждан',
      time: '18:00 - 19:30',
      status: 'upcoming',
      type: 'citizens',
    },
  ];

  const bills = [
    {
      id: 1,
      number: '№ 487632-8',
      title: 'О внесении изменений в Федеральный закон',
      stage: 'Второе чтение',
      date: '15.10.2025',
      role: 'Соавтор',
    },
    {
      id: 2,
      number: '№ 491254-8',
      title: 'О поправках в Налоговый кодекс РФ',
      stage: 'Первое чтение',
      date: '20.10.2025',
      role: 'Докладчик',
    },
    {
      id: 3,
      number: '№ 485123-8',
      title: 'О внесении изменений в закон об образовании',
      stage: 'Комитет',
      date: '25.10.2025',
      role: 'Автор',
    },
  ];

  const citizenAppeals = [
    {
      id: 1,
      name: 'Иванов Иван Иванович',
      topic: 'Вопрос ЖКХ',
      date: '03.10.2025',
      status: 'pending',
    },
    {
      id: 2,
      name: 'Петрова Мария Сергеевна',
      topic: 'Социальная поддержка',
      date: '02.10.2025',
      status: 'completed',
    },
    {
      id: 3,
      name: 'Сидоров Петр Александрович',
      topic: 'Благоустройство района',
      date: '01.10.2025',
      status: 'in-progress',
    },
  ];

  const stats = [
    { label: 'Законопроекты', value: '24', icon: 'FileText' },
    { label: 'Заседания', value: '156', icon: 'Users' },
    { label: 'Обращения граждан', value: '89', icon: 'MessageSquare' },
    { label: 'Выступления', value: '43', icon: 'Mic' },
  ];

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

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="Calendar" size={20} />
                  Расписание на сегодня
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {sessions.map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors"
                    >
                      <div className="flex items-center gap-4">
                        <div className="bg-primary/10 p-2 rounded">
                          <Icon
                            name={
                              session.type === 'session'
                                ? 'Briefcase'
                                : session.type === 'committee'
                                ? 'Users'
                                : 'UserCheck'
                            }
                            size={20}
                            className="text-primary"
                          />
                        </div>
                        <div>
                          <h4 className="font-semibold">{session.title}</h4>
                          <p className="text-sm text-muted-foreground">{session.time}</p>
                        </div>
                      </div>
                      <Badge variant={session.status === 'active' ? 'default' : 'secondary'}>
                        {session.status === 'active' ? 'Идёт сейчас' : 'Предстоит'}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="FileText" size={20} />
                  Законопроекты в работе
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Номер</TableHead>
                      <TableHead>Название</TableHead>
                      <TableHead>Стадия</TableHead>
                      <TableHead>Роль</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bills.map((bill) => (
                      <TableRow key={bill.id} className="cursor-pointer hover:bg-muted/50">
                        <TableCell className="font-mono text-sm">{bill.number}</TableCell>
                        <TableCell className="font-medium">{bill.title}</TableCell>
                        <TableCell>
                          <Badge variant="outline">{bill.stage}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge>{bill.role}</Badge>
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
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  className="rounded-md border"
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Icon name="MessageSquare" size={20} />
                  Приём граждан
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {citizenAppeals.map((appeal) => (
                    <div
                      key={appeal.id}
                      className="p-3 border rounded-lg hover:bg-muted/50 transition-colors cursor-pointer"
                    >
                      <div className="flex items-start justify-between mb-2">
                        <h4 className="font-semibold text-sm">{appeal.name}</h4>
                        <Badge
                          variant={
                            appeal.status === 'completed'
                              ? 'default'
                              : appeal.status === 'in-progress'
                              ? 'secondary'
                              : 'outline'
                          }
                          className="text-xs"
                        >
                          {appeal.status === 'completed'
                            ? 'Выполнено'
                            : appeal.status === 'in-progress'
                            ? 'В работе'
                            : 'Ожидает'}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground mb-1">{appeal.topic}</p>
                      <p className="text-xs text-muted-foreground">{appeal.date}</p>
                    </div>
                  ))}
                </div>
                <Button className="w-full mt-4" variant="outline">
                  <Icon name="Plus" size={16} className="mr-2" />
                  Запланировать приём
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
