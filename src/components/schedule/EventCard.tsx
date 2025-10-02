import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScheduleEvent, ResponsiblePerson, typeLabels, typeIcons, typeColors, statusLabels } from '@/types/schedule';

interface EventCardProps {
  event: ScheduleEvent;
  responsiblePersons: ResponsiblePerson[];
  onView: (event: ScheduleEvent) => void;
  onEdit: (event: ScheduleEvent) => void;
  onArchive: (id: number) => void;
  onUnarchive: (id: number) => void;
  onDelete: (id: number) => void;
  isArchived?: boolean;
}

export const EventCard = ({
  event,
  responsiblePersons,
  onView,
  onEdit,
  onArchive,
  onUnarchive,
  onDelete,
  isArchived = false,
}: EventCardProps) => {
  const cardClassName = `hover:shadow-md transition-all border-l-4 cursor-pointer ${
    isArchived
      ? 'border-l-gray-400 bg-gray-50/30'
      : event.status === 'in-progress'
      ? 'border-l-green-500 bg-green-50/50'
      : event.status === 'completed'
      ? 'border-l-gray-400 bg-gray-50/50'
      : event.status === 'cancelled'
      ? 'border-l-red-400 bg-red-50/50'
      : 'border-l-blue-500'
  }`;

  return (
    <Card className={cardClassName} onClick={() => onView(event)}>
      <CardContent className="p-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start gap-4 flex-1">
            <div
              className={`p-3 rounded-lg ${typeColors[event.type]} border shrink-0 ${
                isArchived ? 'opacity-70' : ''
              }`}
            >
              <Icon name={typeIcons[event.type]} size={24} />
            </div>
            <div className="flex-1 space-y-2 min-w-0">
              <div className="flex items-start justify-between gap-2">
                <div className="flex-1 min-w-0">
                  <h4
                    className={`font-bold text-lg leading-tight mb-1 truncate ${
                      isArchived ? 'text-gray-700' : ''
                    }`}
                  >
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
                <p className="text-sm text-muted-foreground line-clamp-2">{event.description}</p>
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
                {event.responsiblePersonId &&
                  responsiblePersons.find((p) => p.id === event.responsiblePersonId) && (
                    <Badge variant="outline" className="flex items-center gap-1">
                      <Icon name="User" size={12} />
                      {
                        responsiblePersons
                          .find((p) => p.id === event.responsiblePersonId)
                          ?.name.split(' ')[0]
                      }
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
              {isArchived ? (
                <>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onUnarchive(event.id);
                    }}
                  >
                    <Icon name="ArchiveRestore" size={16} className="mr-2" />
                    Восстановить
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(event.id);
                    }}
                    className="text-destructive focus:text-destructive"
                  >
                    <Icon name="Trash2" size={16} className="mr-2" />
                    Удалить
                  </DropdownMenuItem>
                </>
              ) : (
                <>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onEdit(event);
                    }}
                  >
                    <Icon name="Pencil" size={16} className="mr-2" />
                    Редактировать
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onArchive(event.id);
                    }}
                  >
                    <Icon name="Archive" size={16} className="mr-2" />
                    В архив
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      onDelete(event.id);
                    }}
                    className="text-destructive focus:text-destructive"
                  >
                    <Icon name="Trash2" size={16} className="mr-2" />
                    Удалить
                  </DropdownMenuItem>
                </>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardContent>
    </Card>
  );
};
