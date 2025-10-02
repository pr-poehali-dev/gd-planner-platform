import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { ScheduleEvent, ResponsiblePerson, typeLabels, statusLabels } from '@/types/schedule';
import { toast } from 'sonner';

pdfMake.vfs = pdfFonts.pdfMake.vfs;

export const exportToPDF = (
  events: ScheduleEvent[],
  responsiblePersons: ResponsiblePerson[],
  dateStr?: string
) => {
  const tableBody = events.map((event) => {
    const responsiblePerson = event.responsiblePersonId
      ? responsiblePersons.find((p) => p.id === event.responsiblePersonId)
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
        margin: [0, 0, 0, 10],
      },
      {
        text: `Дата формирования: ${new Date().toLocaleDateString('ru-RU')}`,
        style: 'subheader',
        margin: [0, 0, 0, 20],
      },
      {
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', '*', 'auto', '*', 'auto', 'auto'],
          body: [
            ['Дата', 'Время', 'Мероприятие', 'Тип', 'Место/Регион', 'Ответственный', 'Статус'],
            ...tableBody,
          ],
        },
        layout: {
          fillColor: (rowIndex: number) =>
            rowIndex === 0 ? '#0039A6' : rowIndex % 2 === 0 ? '#f5f5f5' : null,
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#cccccc',
          vLineColor: () => '#cccccc',
        },
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
      },
      subheader: {
        fontSize: 10,
        alignment: 'center',
        color: '#666666',
      },
    },
    defaultStyle: {
      font: 'Roboto',
      fontSize: 9,
    },
  };

  const filename = dateStr
    ? `График_${dateStr.replace(/[^0-9]/g, '_')}.pdf`
    : `График_работы_${new Date().toLocaleDateString('ru-RU').replace(/\./g, '_')}.pdf`;

  pdfMake.createPdf(docDefinition).download(filename);
  toast.success('График экспортирован в PDF');
};

export const printSchedule = (
  events: ScheduleEvent[],
  responsiblePersons: ResponsiblePerson[],
  dateStr?: string
) => {
  const tableBody = events.map((event) => {
    const responsiblePerson = event.responsiblePersonId
      ? responsiblePersons.find((p) => p.id === event.responsiblePersonId)
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
        margin: [0, 0, 0, 10],
      },
      {
        text: `Дата формирования: ${new Date().toLocaleDateString('ru-RU')}`,
        style: 'subheader',
        margin: [0, 0, 0, 20],
      },
      {
        table: {
          headerRows: 1,
          widths: ['auto', 'auto', '*', 'auto', '*', 'auto', 'auto'],
          body: [
            ['Дата', 'Время', 'Мероприятие', 'Тип', 'Место/Регион', 'Ответственный', 'Статус'],
            ...tableBody,
          ],
        },
        layout: {
          fillColor: (rowIndex: number) =>
            rowIndex === 0 ? '#0039A6' : rowIndex % 2 === 0 ? '#f5f5f5' : null,
          hLineWidth: () => 0.5,
          vLineWidth: () => 0.5,
          hLineColor: () => '#cccccc',
          vLineColor: () => '#cccccc',
        },
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
        alignment: 'center',
      },
      subheader: {
        fontSize: 10,
        alignment: 'center',
        color: '#666666',
      },
    },
    defaultStyle: {
      font: 'Roboto',
      fontSize: 9,
    },
  };

  pdfMake.createPdf(docDefinition).print();
  toast.success('Отправлено на печать');
};
