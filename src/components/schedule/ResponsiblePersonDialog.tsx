import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { ResponsiblePerson } from '@/types/schedule';

interface ResponsiblePersonDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  responsiblePersons: ResponsiblePerson[];
  newPerson: Partial<ResponsiblePerson>;
  setNewPerson: (person: Partial<ResponsiblePerson>) => void;
  onAddPerson: () => void;
  onDeletePerson: (id: number) => void;
}

export const ResponsiblePersonDialog = ({
  open,
  onOpenChange,
  responsiblePersons,
  newPerson,
  setNewPerson,
  onAddPerson,
  onDeletePerson,
}: ResponsiblePersonDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Управление ответственными лицами</DialogTitle>
          <DialogDescription>Добавьте или удалите ответственных за мероприятия</DialogDescription>
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
                  <Button variant="ghost" size="icon" onClick={() => onDeletePerson(person.id)}>
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
              <Button onClick={onAddPerson} className="w-full">
                <Icon name="Plus" size={16} className="mr-2" />
                Добавить
              </Button>
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Закрыть
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
