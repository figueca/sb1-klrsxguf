import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar, Clock, Users, VideoIcon, Building2, CreditCard, FileText } from "lucide-react";
import { DatePicker } from "@/components/ui/date-picker";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

const timeSlots = [
  "08:00", "08:30", "09:00", "09:30", "10:00", "10:30",
  "11:00", "11:30", "14:00", "14:30", "15:00", "15:30",
  "16:00", "16:30", "17:00", "17:30"
];

const appointmentTypes = [
  "Primeira Consulta",
  "Retorno",
  "Avaliação",
  "Sessão",
];

const durations = [
  { value: "30", label: "30 minutos" },
  { value: "45", label: "45 minutos" },
  { value: "60", label: "1 hora" },
  { value: "90", label: "1 hora e 30 minutos" },
];

const rooms = [
  { id: "1", name: "Sala 1" },
  { id: "2", name: "Sala 2" },
  { id: "3", name: "Sala 3" },
];

const appointmentFormSchema = z.object({
  patientId: z.string().min(1, "Selecione um paciente"),
  date: z.date({
    required_error: "Selecione uma data",
  }),
  startTime: z.string().min(1, "Selecione um horário"),
  type: z.string().min(1, "Selecione o tipo de consulta"),
  duration: z.string().min(1, "Selecione a duração"),
  isOnline: z.boolean().default(false),
  room: z.string().optional(),
  notes: z.string().optional(),
  healthInsurance: z.string().optional(),
  insuranceNumber: z.string().optional(),
});

type AppointmentFormValues = z.infer<typeof appointmentFormSchema>;

interface AppointmentFormProps {
  patients: Array<{ id: string; name: string }>;
  onSubmit: (data: AppointmentFormValues) => void;
  onCancel: () => void;
  defaultDate?: Date;
  defaultTime?: string | null;
  isOpen: boolean;
}

export function AppointmentForm({ 
  patients, 
  onSubmit,
  onCancel,
  defaultDate,
  defaultTime,
  isOpen 
}: AppointmentFormProps) {
  const form = useForm<AppointmentFormValues>({
    resolver: zodResolver(appointmentFormSchema),
    defaultValues: {
      date: defaultDate || new Date(),
      startTime: defaultTime || "08:00",
      isOnline: false,
      notes: "",
    },
  });

  const handleSubmit = (data: AppointmentFormValues) => {
    onSubmit(data);
    form.reset();
  };

  return (
    <Dialog open={isOpen} onOpenChange={() => onCancel()}>
      <DialogContent className="max-w-2xl p-6 bg-gray-50">
        <DialogHeader>
          <DialogTitle className="text-2xl">Agendar Nova Consulta</DialogTitle>
        </DialogHeader>
        <Tabs defaultValue="appointment" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="appointment" className="flex items-center gap-2 py-3">
              <Calendar className="h-5 w-5" />
              Agendamento
            </TabsTrigger>
            <TabsTrigger value="payment" className="flex items-center gap-2 py-3">
              <CreditCard className="h-5 w-5" />
              Pagamento
            </TabsTrigger>
          </TabsList>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <TabsContent value="appointment" className="space-y-6">
                <div className="bg-white rounded-lg p-6 space-y-6 shadow-sm">
                  <FormField
                    control={form.control}
                    name="patientId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base flex items-center gap-2">
                          <Users className="h-5 w-5" />
                          Paciente
                        </FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="h-12">
                              <SelectValue placeholder="Selecione o paciente" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {patients.map((patient) => (
                              <SelectItem key={patient.id} value={patient.id}>
                                {patient.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="date"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base flex items-center gap-2">
                            <Calendar className="h-5 w-5" />
                            Data
                          </FormLabel>
                          <DatePicker
                            date={field.value}
                            onDateChange={field.onChange}
                            className="h-12"
                          />
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="startTime"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Horário
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Selecione o horário" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {timeSlots.map((time) => (
                                <SelectItem key={time} value={time}>
                                  {time}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-6">
                    <FormField
                      control={form.control}
                      name="type"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base flex items-center gap-2">
                            <FileText className="h-5 w-5" />
                            Tipo de Consulta
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Selecione o tipo" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {appointmentTypes.map((type) => (
                                <SelectItem key={type} value={type}>
                                  {type}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="duration"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base flex items-center gap-2">
                            <Clock className="h-5 w-5" />
                            Duração
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Selecione a duração" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {durations.map((duration) => (
                                <SelectItem key={duration.value} value={duration.value}>
                                  {duration.label}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <FormField
                  control={form.control}
                  name="isOnline"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <FormLabel className="text-base">Modalidade</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={(value) => field.onChange(value === "online")}
                          defaultValue={field.value ? "online" : "presential"}
                          className="grid grid-cols-2 gap-4"
                        >
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem
                                value="presential"
                                id="presential"
                                className="peer sr-only"
                              />
                            </FormControl>
                            <FormLabel
                              htmlFor="presential"
                              className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-white p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                            >
                              <Building2 className="mb-3 h-8 w-8" />
                              <span className="text-base font-medium">Presencial</span>
                            </FormLabel>
                          </FormItem>
                          <FormItem>
                            <FormControl>
                              <RadioGroupItem
                                value="online"
                                id="online"
                                className="peer sr-only"
                              />
                            </FormControl>
                            <FormLabel
                              htmlFor="online"
                              className="flex flex-col items-center justify-between rounded-lg border-2 border-muted bg-white p-6 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer"
                            >
                              <VideoIcon className="mb-3 h-8 w-8" />
                              <span className="text-base font-medium">Online</span>
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {!form.watch("isOnline") && (
                  <div className="bg-white rounded-lg p-6 shadow-sm">
                    <FormField
                      control={form.control}
                      name="room"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-base flex items-center gap-2">
                            <Building2 className="h-5 w-5" />
                            Sala
                          </FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger className="h-12">
                                <SelectValue placeholder="Selecione a sala" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {rooms.map((room) => (
                                <SelectItem key={room.id} value={room.id}>
                                  {room.name}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Observações</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Adicione observações importantes sobre a consulta..."
                            className="min-h-[100px] resize-none"
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <TabsContent value="payment" className="space-y-6">
                <div className="bg-white rounded-lg p-6 shadow-sm space-y-6">
                  <FormField
                    control={form.control}
                    name="healthInsurance"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Convênio</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Nome do convênio" 
                            className="h-12"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="insuranceNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-base">Número da Carteirinha</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Número da carteirinha do convênio" 
                            className="h-12"
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </TabsContent>

              <div className="flex justify-end gap-3 pt-6 border-t">
                <Button
                  type="button"
                  variant="outline"
                  size="lg"
                  onClick={onCancel}
                >
                  Cancelar
                </Button>
                <Button type="submit" size="lg">
                  Agendar Consulta
                </Button>
              </div>
            </form>
          </Form>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}