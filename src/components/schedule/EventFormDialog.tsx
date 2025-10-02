import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ScheduleEvent, ResponsiblePerson } from '@/types/schedule';

interface EventFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: Partial<ScheduleEvent>;
  setEvent: (event: Partial<ScheduleEvent>) => void;
  onSave: () => void;
  responsiblePersons: ResponsiblePerson[];
  title: string;
  isEdit?: boolean;
}

export const EventFormDialog = ({
  open,
  onOpenChange,
  event,
  setEvent,
  onSave,
  responsiblePersons,
  title,
  isEdit = false,
}: EventFormDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>
            {isEdit ? 'Измените информацию о мероприятии' : 'Заполните информацию о новом мероприятии в графике работы'}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor={isEdit ? 'edit-date' : 'date'}>Дата</Label>
              <Input
                id={isEdit ? 'edit-date' : 'date'}
                type="date"
                value={event.date}
                onChange={(e) => setEvent({ ...event, date: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={isEdit ? 'edit-type' : 'type'}>Тип мероприятия</Label>
              <Select
                value={event.type}
                onValueChange={(value) => setEvent({ ...event, type: value as ScheduleEvent['type'] })}
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
              <Label htmlFor={isEdit ? 'edit-timeStart' : 'timeStart'}>Время начала</Label>
              <Input
                id={isEdit ? 'edit-timeStart' : 'timeStart'}
                type="time"
                value={event.timeStart}
                onChange={(e) => setEvent({ ...event, timeStart: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={isEdit ? 'edit-timeEnd' : 'timeEnd'}>Время окончания</Label>
              <Input
                id={isEdit ? 'edit-timeEnd' : 'timeEnd'}
                type="time"
                value={event.timeEnd}
                onChange={(e) => setEvent({ ...event, timeEnd: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor={isEdit ? 'edit-title' : 'title'}>Название</Label>
            <Input
              id={isEdit ? 'edit-title' : 'title'}
              value={event.title}
              onChange={(e) => setEvent({ ...event, title: e.target.value })}
              placeholder="Введите название мероприятия"
            />
          </div>
          {event.type === 'vcs' ? (
            <div className="space-y-2">
              <Label htmlFor={isEdit ? 'edit-vcsLink' : 'vcsLink'}>Ссылка на ВКС</Label>
              <Input
                id={isEdit ? 'edit-vcsLink' : 'vcsLink'}
                value={event.vcsLink}
                onChange={(e) => setEvent({ ...event, vcsLink: e.target.value })}
                placeholder="Введите ссылку на видеоконференцсвязь"
              />
            </div>
          ) : event.type === 'regional-trip' ? (
            <div className="space-y-2">
              <Label htmlFor={isEdit ? 'edit-regionName' : 'regionName'}>Название региона</Label>
              <Input
                id={isEdit ? 'edit-regionName' : 'regionName'}
                value={event.regionName}
                onChange={(e) => setEvent({ ...event, regionName: e.target.value })}
                placeholder="Например: Московская область"
              />
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor={isEdit ? 'edit-location' : 'location'}>Место проведения</Label>
              <Input
                id={isEdit ? 'edit-location' : 'location'}
                value={event.location}
                onChange={(e) => setEvent({ ...event, location: e.target.value })}
                placeholder="Введите место проведения"
              />
            </div>
          )}
          <div className="space-y-2">
            <Label htmlFor={isEdit ? 'edit-responsiblePerson' : 'responsiblePerson'}>Ответственный</Label>
            <Select
              value={event.responsiblePersonId ? String(event.responsiblePersonId) : 'none'}
              onValueChange={(value) =>
                setEvent({ ...event, responsiblePersonId: value === 'none' ? undefined : parseInt(value) })
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
            <Label htmlFor={isEdit ? 'edit-description' : 'description'}>Описание</Label>
            <Textarea
              id={isEdit ? 'edit-description' : 'description'}
              value={event.description}
              onChange={(e) => setEvent({ ...event, description: e.target.value })}
              placeholder="Введите описание мероприятия"
              rows={3}
            />
          </div>
          {isEdit && (
            <div className="space-y-2">
              <Label htmlFor="edit-status">Статус</Label>
              <Select
                value={event.status}
                onValueChange={(value) => setEvent({ ...event, status: value as ScheduleEvent['status'] })}
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
          )}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="space-y-1">
              <Label htmlFor={isEdit ? 'edit-reminder' : 'reminder'}>Напоминание</Label>
              <p className="text-sm text-muted-foreground">Получать уведомление перед мероприятием</p>
            </div>
            <Switch
              id={isEdit ? 'edit-reminder' : 'reminder'}
              checked={event.reminder}
              onCheckedChange={(checked) => setEvent({ ...event, reminder: checked })}
            />
          </div>
          {event.reminder && (
            <div className="space-y-2">
              <Label htmlFor={isEdit ? 'edit-reminderMinutes' : 'reminderMinutes'}>
                За сколько минут напомнить
              </Label>
              <Select
                value={String(event.reminderMinutes)}
                onValueChange={(value) => setEvent({ ...event, reminderMinutes: parseInt(value) })}
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
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Отмена
          </Button>
          <Button onClick={onSave}>{isEdit ? 'Сохранить изменения' : 'Добавить'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
