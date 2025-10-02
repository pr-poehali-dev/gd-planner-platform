import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ScheduleEvent, ResponsiblePerson } from '@/types/schedule';
import { EventCard } from './EventCard';

interface EventListProps {
  groupedEvents: { [key: string]: ScheduleEvent[] };
  sortedDates: string[];
  responsiblePersons: ResponsiblePerson[];
  formatDateHeader: (dateStr: string) => string;
  onView: (event: ScheduleEvent) => void;
  onEdit: (event: ScheduleEvent) => void;
  onArchive: (id: number) => void;
  onUnarchive: (id: number) => void;
  onDelete: (id: number) => void;
  onExportDay: (dateStr: string) => void;
  onPrintDay: (dateStr: string) => void;
  isArchived?: boolean;
}

export const EventList = ({
  groupedEvents,
  sortedDates,
  responsiblePersons,
  formatDateHeader,
  onView,
  onEdit,
  onArchive,
  onUnarchive,
  onDelete,
  onExportDay,
  onPrintDay,
  isArchived = false,
}: EventListProps) => {
  if (sortedDates.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        <Icon name={isArchived ? 'Archive' : 'CalendarX'} size={48} className="mx-auto mb-3 opacity-50" />
        <p className="text-lg font-medium">
          {isArchived ? 'Архив пуст' : 'Мероприятия не найдены'}
        </p>
        <p className="text-sm">
          {isArchived
            ? 'Завершённые мероприятия будут отображаться здесь'
            : 'Попробуйте изменить параметры поиска'}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {sortedDates.map((dateStr) => (
        <div key={dateStr} className="space-y-3">
          <div className={`flex items-center gap-3 pb-2 border-b-2 ${isArchived ? 'border-gray-300' : 'border-primary/20'}`}>
            <Icon name="CalendarDays" size={20} className={isArchived ? 'text-gray-600' : 'text-primary'} />
            <h3 className={`text-lg font-bold flex-1 ${isArchived ? 'text-gray-700' : 'text-primary'}`}>
              {formatDateHeader(dateStr)}
            </h3>
            <Badge variant="outline">{groupedEvents[dateStr].length} мероприятий</Badge>
            {!isArchived && (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="shadow-sm">
                    <Icon name="Download" size={14} className="mr-1" />
                    Экспорт
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => onExportDay(dateStr)}>
                    <Icon name="FileDown" size={14} className="mr-2" />
                    PDF
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => onPrintDay(dateStr)}>
                    <Icon name="Printer" size={14} className="mr-2" />
                    Печать
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
          <div className="grid gap-3">
            {groupedEvents[dateStr].map((event) => (
              <EventCard
                key={event.id}
                event={event}
                responsiblePersons={responsiblePersons}
                onView={onView}
                onEdit={onEdit}
                onArchive={onArchive}
                onUnarchive={onUnarchive}
                onDelete={onDelete}
                isArchived={isArchived}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
