import * as React from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { appointmentStatusConfig, paymentStatusConfig } from "@/lib/constants";
import * as Icons from "lucide-react";

interface AppointmentCardProps {
  appointment: {
    id: string;
    patientName: string;
    date: string;
    time: string;
    status: string;
    paymentStatus: string;
    type: string;
    isOnline?: boolean;
  };
  className?: string;
}

export function AppointmentCard({ appointment, className }: AppointmentCardProps) {
  const statusConfig = appointmentStatusConfig[appointment.status as keyof typeof appointmentStatusConfig];
  const paymentConfig = paymentStatusConfig[appointment.paymentStatus as keyof typeof paymentStatusConfig];
  
  const StatusIcon = Icons[statusConfig.icon as keyof typeof Icons] as React.ElementType;
  const PaymentIcon = Icons[paymentConfig.icon as keyof typeof Icons] as React.ElementType;

  return (
    <Card className={cn("p-4 space-y-2", className)}>
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{appointment.patientName}</h3>
        {appointment.isOnline && (
          <Badge variant="outline" className="bg-blue-50">
            <Icons.Video className="h-3 w-3 mr-1" />
            Online
          </Badge>
        )}
      </div>
      
      <div className="text-sm text-muted-foreground">
        {appointment.time} - {appointment.type}
      </div>
      
      <div className="flex items-center gap-2">
        <Badge className={statusConfig.color}>
          <StatusIcon className="h-3 w-3 mr-1" />
          {statusConfig.label}
        </Badge>
        
        <Badge className={paymentConfig.color}>
          <PaymentIcon className="h-3 w-3 mr-1" />
          {paymentConfig.label}
        </Badge>
      </div>
    </Card>
  );
}