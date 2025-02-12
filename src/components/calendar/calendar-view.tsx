import { useState, useRef } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Search, Plus, Filter } from 'lucide-react';
import { AppointmentForm } from '@/components/appointments/appointment-form';
import { usePatients } from '@/hooks/use-patients';
import { appointmentStatusConfig, APPOINTMENT_STATUS } from "@/lib/constants";
import * as Icons from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { cn } from "@/lib/utils";

// Configuração de localização em português
const ptBRLocale = {
  code: 'pt-br',
  week: {
    dow: 0, // Domingo é 0, Segunda é 1, etc.
    doy: 4  // A semana que contém Jan 4th é a primeira semana do ano.
  },
  buttonText: {
    prev: 'Anterior',
    next: 'Próximo',
    today: 'Hoje',
    month: 'Mês',
    week: 'Semana',
    day: 'Dia',
    list: 'Lista'
  },
  weekText: 'Sm',
  allDayText: 'Dia Inteiro',
  moreLinkText: 'mais',
  noEventsText: 'Não há eventos para mostrar',
  dayHeaderFormat: { weekday: 'long', day: 'numeric', month: 'numeric', omitCommas: true }
};

const mockEvents = [
  {
    id: '1',
    title: 'Maria Silva',
    start: '2024-03-15T09:00:00',
    end: '2024-03-15T10:00:00',
    extendedProps: {
      status: APPOINTMENT_STATUS.CONFIRMED,
      type: 'Primeira Consulta'
    }
  },
  {
    id: '2',
    title: 'João Santos',
    start: '2024-03-15T14:00:00',
    end: '2024-03-15T15:00:00',
    extendedProps: {
      status: APPOINTMENT_STATUS.IN_PROGRESS,
      type: 'Retorno'
    }
  },
  {
    id: '3',
    title: 'Ana Oliveira',
    start: '2024-03-16T10:00:00',
    end: '2024-03-16T11:00:00',
    extendedProps: {
      status: APPOINTMENT_STATUS.REQUESTED,
      type: 'Avaliação'
    }
  }
];

export function CalendarView() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedTime, setSelectedTime] = useState<string | null>(null);
  const [showAppointmentForm, setShowAppointmentForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const { patients } = usePatients();
  const calendarRef = useRef<any>(null);

  const handleDateSelect = (selectInfo: any) => {
    const { start } = selectInfo;
    setSelectedDate(start);
    setSelectedTime(format(start, 'HH:mm'));
    setShowAppointmentForm(true);
    selectInfo.view.calendar.unselect();
  };

  const handleEventClick = (clickInfo: any) => {
    console.log('Evento clicado:', clickInfo.event);
  };

  const handleAppointmentSubmit = (data: any) => {
    console.log('Nova consulta:', data);
    setShowAppointmentForm(false);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleCloseForm = () => {
    setShowAppointmentForm(false);
    setSelectedDate(null);
    setSelectedTime(null);
  };

  const handleNewAppointment = () => {
    setSelectedDate(new Date());
    setSelectedTime('08:00');
    setShowAppointmentForm(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between bg-white p-4 rounded-lg shadow-sm">
        <div className="flex items-center gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
            <Input
              placeholder="Buscar pacientes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-9 w-[300px] border-0 bg-gray-50 focus-visible:ring-0 focus-visible:ring-offset-0"
            />
          </div>
          <Select>
            <SelectTrigger className="w-[180px] bg-gray-50 border-0">
              <SelectValue placeholder="Todas as salas" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todas as salas</SelectItem>
              <SelectItem value="1">Sala 1</SelectItem>
              <SelectItem value="2">Sala 2</SelectItem>
              <SelectItem value="3">Sala 3</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" className="bg-gray-50 border-0">
            <Filter className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            {Object.entries(appointmentStatusConfig).map(([key, config]) => {
              const Icon = (Icons as any)[config.icon];
              return (
                <Badge 
                  key={key} 
                  variant="outline" 
                  className={cn("gap-1 px-2 py-1", config.color)}
                >
                  <Icon className="h-3 w-3" />
                  {config.label}
                </Badge>
              );
            })}
          </div>
          <Button 
            onClick={handleNewAppointment} 
            size="lg" 
            className="bg-primary hover:bg-primary/90 text-white gap-2 px-6"
          >
            <Plus className="h-5 w-5" />
            Novo Agendamento
          </Button>
        </div>
      </div>

      <Card className="shadow-lg border-0">
        <CardContent className="p-0">
          <FullCalendar
            ref={calendarRef}
            plugins={[timeGridPlugin, dayGridPlugin, interactionPlugin]}
            initialView="timeGridWeek"
            headerToolbar={{
              left: 'prev,next today',
              center: 'title',
              right: 'timeGridDay,timeGridWeek,dayGridMonth'
            }}
            locale={ptBRLocale}
            locales={[ptBRLocale]}
            slotMinTime="08:00:00"
            slotMaxTime="20:00:00"
            allDaySlot={false}
            editable={true}
            selectable={true}
            selectMirror={true}
            dayMaxEvents={true}
            weekends={true}
            businessHours={{
              daysOfWeek: [1, 2, 3, 4, 5],
              startTime: '08:00',
              endTime: '20:00',
            }}
            events={mockEvents}
            select={handleDateSelect}
            eventClick={handleEventClick}
            slotDuration="00:30:00"
            slotLabelInterval="00:30"
            slotLabelFormat={{
              hour: '2-digit',
              minute: '2-digit',
              hour12: false
            }}
            selectConstraint="businessHours"
            selectOverlap={false}
            nowIndicator={true}
            height="auto"
            contentHeight="auto"
            aspectRatio={2}
            expandRows={true}
            stickyHeaderDates={true}
            eventContent={(eventInfo) => {
              const event = eventInfo.event;
              const status = event.extendedProps.status || APPOINTMENT_STATUS.CONFIRMED;
              const config = appointmentStatusConfig[status];
              const StatusIcon = (Icons as any)[config.icon];
              
              return (
                <div className={cn(
                  "p-2 rounded-md h-full w-full shadow-sm transition-all hover:shadow-md",
                  config.color
                )}>
                  <div className="flex items-center gap-1">
                    <StatusIcon className="h-3 w-3" />
                    <span className="font-medium text-xs">{event.title}</span>
                  </div>
                  <div className="text-xs flex items-center gap-1 mt-1">
                    <Icons.Clock className="h-3 w-3" />
                    {format(event.start!, 'HH:mm')}
                    <span className="ml-1 opacity-75">
                      {event.extendedProps.type}
                    </span>
                  </div>
                </div>
              );
            }}
            slotLaneClassNames="bg-gray-50/50"
            dayCellClassNames="hover:bg-gray-50/70 transition-colors"
            dayHeaderClassNames="text-sm font-medium py-2"
            viewClassNames="bg-white"
            eventClassNames="rounded-md overflow-hidden"
          />
        </CardContent>
      </Card>

      {showAppointmentForm && (
        <AppointmentForm
          patients={patients.map(p => ({ id: p.id, name: p.full_name }))}
          onSubmit={handleAppointmentSubmit}
          onCancel={handleCloseForm}
          defaultDate={selectedDate}
          defaultTime={selectedTime}
          isOpen={showAppointmentForm}
        />
      )}
    </div>
  );
}