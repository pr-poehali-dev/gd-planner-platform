import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Label } from '@/components/ui/label';
import Icon from '@/components/ui/icon';
import { ScheduleEvent, ResponsiblePerson, typeLabels, typeIcons, typeColors, statusLabels } from '@/types/schedule';

interface EventViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event: ScheduleEvent | null;
  responsiblePersons: ResponsiblePerson[];
  onEdit: (event: ScheduleEvent) => void;
  formatDateHeader: (dateStr: string) => string;
}

export const EventViewDialog = ({
  open,
  onOpenChange,
  event,
  responsiblePersons,
  onEdit,
  formatDateHeader,
}: EventViewDialogProps) => {
  if (!event) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl">{event.title}</DialogTitle>
          <DialogDescription>Подробная информация о мероприятии</DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Дата</Label>
              <p className="font-semibold">{formatDateHeader(event.date)}</p>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Время</Label>
              <p className="font-semibold">
                {event.timeStart} — {event.timeEnd}
              </p>
            </div>
          </div>
          {event.type === 'vcs' ? (
            <div className="space-y-2">
              <Label className="text-muted-foreground">Ссылка на ВКС</Label>
              <div className="flex items-center gap-2">
                <Icon name="Video" size={16} className="text-primary" />
                <a
                  href={event.vcsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-semibold text-primary hover:underline break-all"
                >
                  {event.vcsLink}
                </a>
              </div>
            </div>
          ) : event.type === 'regional-trip' ? (
            <div className="space-y-2">
              <Label className="text-muted-foreground">Регион поездки</Label>
              <div className="flex items-center gap-2">
                <Icon name="Plane" size={16} className="text-primary" />
                <p className="font-semibold">{event.regionName}</p>
              </div>
            </div>
          ) : (
            <div className="space-y-2">
              <Label className="text-muted-foreground">Место проведения</Label>
              <div className="flex items-center gap-2">
                <Icon name="MapPin" size={16} className="text-primary" />
                <p className="font-semibold">{event.location}</p>
              </div>
            </div>
          )}
          {event.responsiblePersonId &&
            responsiblePersons.find((p) => p.id === event.responsiblePersonId) && (
              <div className="space-y-2">
                <Label className="text-muted-foreground">Ответственный</Label>
                <div className="flex items-center gap-2">
                  <Icon name="User" size={16} className="text-primary" />
                  <div>
                    <p className="font-semibold">
                      {responsiblePersons.find((p) => p.id === event.responsiblePersonId)?.name}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {responsiblePersons.find((p) => p.id === event.responsiblePersonId)?.position}
                    </p>
                  </div>
                </div>
              </div>
            )}
          {event.description && (
            <div className="space-y-2">
              <Label className="text-muted-foreground">Описание</Label>
              <p className="text-sm">{event.description}</p>
            </div>
          )}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-muted-foreground">Тип мероприятия</Label>
              <Badge className={typeColors[event.type]}>
                <Icon name={typeIcons[event.type]} size={14} className="mr-1" />
                {typeLabels[event.type]}
              </Badge>
            </div>
            <div className="space-y-2">
              <Label className="text-muted-foreground">Статус</Label>
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
            </div>
          </div>
          {event.reminder && (
            <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-200 rounded-lg">
              <Icon name="Bell" size={16} className="text-orange-600" />
              <p className="text-sm font-medium text-orange-800">
                Напоминание за {event.reminderMinutes} минут до начала
              </p>
            </div>
          )}
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Закрыть
          </Button>
          <Button
            onClick={() => {
              onOpenChange(false);
              onEdit(event);
            }}
          >
            <Icon name="Pencil" size={16} className="mr-2" />
            Редактировать
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
