import { DollarSign, Clock, AlertCircle, CheckCircle, Activity, X, CalendarClock, CreditCard, RefreshCcw } from 'lucide-react';

export const APPOINTMENT_STATUS = {
  REQUESTED: 'requested',
  CONFIRMED: 'confirmed',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  RESCHEDULED: 'rescheduled',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  REFUNDED: 'refunded',
} as const;

export type AppointmentStatus = typeof APPOINTMENT_STATUS[keyof typeof APPOINTMENT_STATUS];
export type PaymentStatus = typeof PAYMENT_STATUS[keyof typeof PAYMENT_STATUS];

export const appointmentStatusConfig = {
  [APPOINTMENT_STATUS.REQUESTED]: {
    label: 'Solicitado',
    color: 'bg-purple-100 text-purple-800 border-purple-200',
    icon: Clock,
  },
  [APPOINTMENT_STATUS.CONFIRMED]: {
    label: 'Confirmado',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: CheckCircle,
  },
  [APPOINTMENT_STATUS.IN_PROGRESS]: {
    label: 'Em Atendimento',
    color: 'bg-blue-100 text-blue-800 border-blue-200',
    icon: Activity,
  },
  [APPOINTMENT_STATUS.COMPLETED]: {
    label: 'Concluído',
    color: 'bg-gray-100 text-gray-800 border-gray-200',
    icon: CheckCircle,
  },
  [APPOINTMENT_STATUS.RESCHEDULED]: {
    label: 'Reagendado',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
    icon: CalendarClock,
  },
  [APPOINTMENT_STATUS.CANCELLED]: {
    label: 'Cancelado',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: X,
  },
};

export const paymentStatusConfig = {
  [PAYMENT_STATUS.PENDING]: {
    label: 'Pagamento Pendente',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: AlertCircle,
  },
  [PAYMENT_STATUS.CONFIRMED]: {
    label: 'Pagamento Confirmado',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    icon: CreditCard,
  },
  [PAYMENT_STATUS.REFUNDED]: {
    label: 'Reembolsado',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: RefreshCcw,
  },
};

export const PATIENT_STATUS = {
  ACTIVE: 'active',
  INACTIVE: 'inactive',
} as const;

export const RECORD_TYPES = {
  FIRST_VISIT: 'Primeira Consulta',
  RETURN_VISIT: 'Retorno',
  EVALUATION: 'Avaliação',
  SESSION: 'Sessão',
  EVOLUTION: 'Evolução',
} as const;

export const TRANSACTION_TYPES = {
  INCOME: 'income',
  EXPENSE: 'expense',
} as const;

export const TRANSACTION_CATEGORIES = {
  INCOME: [
    'Consultas',
    'Procedimentos',
    'Convênios',
    'Outros',
  ],
  EXPENSE: [
    'Aluguel',
    'Equipamentos',
    'Material',
    'Salários',
    'Impostos',
    'Marketing',
    'Outros',
  ],
} as const;

export const REPORT_TYPES = {
  FINANCIAL: 'financial',
  PATIENTS: 'patients',
  APPOINTMENTS: 'appointments',
  MARKETING: 'marketing',
} as const;

export const REPORT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export const MARKETING_CAMPAIGN_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  DRAFT: 'draft',
} as const;

export const MARKETING_CAMPAIGN_TYPES = {
  SOCIAL_MEDIA: 'social_media',
  EMAIL: 'email',
  SEARCH_ADS: 'search_ads',
  DISPLAY_ADS: 'display_ads',
} as const;

export const COMMUNICATION_TYPES = {
  CHAT: 'chat',
  EMAIL: 'email',
  SMS: 'sms',
  WHATSAPP: 'whatsapp',
} as const;

export const TELEMEDICINE_STATUS = {
  SCHEDULED: 'scheduled',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  CANCELLED: 'cancelled',
} as const;

export const NOTIFICATION_TYPES = {
  APPOINTMENT_REMINDER: 'appointment_reminder',
  PAYMENT_DUE: 'payment_due',
  MEDICAL_RECORD_UPDATE: 'medical_record_update',
  SYSTEM_UPDATE: 'system_update',
} as const;

export const NOTIFICATION_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

export const SYSTEM_MODULES = {
  PATIENTS: 'patients',
  APPOINTMENTS: 'appointments',
  MEDICAL_RECORDS: 'medical_records',
  FINANCIAL: 'financial',
  TELEMEDICINE: 'telemedicine',
  REPORTS: 'reports',
  MARKETING: 'marketing',
  COMMUNICATION: 'communication',
  SETTINGS: 'settings',
} as const;

export const HEALTH_INSURANCE_TYPES = {
  PRIVATE: 'private',
  PUBLIC: 'public',
  INTERNATIONAL: 'international',
} as const;

export const DOCUMENT_TYPES = {
  PRESCRIPTION: 'prescription',
  MEDICAL_CERTIFICATE: 'medical_certificate',
  EXAM_REQUEST: 'exam_request',
  REPORT: 'report',
} as const;

export const MARITAL_STATUS = {
  SINGLE: 'Solteiro(a)',
  MARRIED: 'Casado(a)',
  DIVORCED: 'Divorciado(a)',
  WIDOWED: 'Viúvo(a)',
  SEPARATED: 'Separado(a)',
} as const;

export const BLOOD_TYPES = [
  'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'
] as const;

export const STATES = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const;