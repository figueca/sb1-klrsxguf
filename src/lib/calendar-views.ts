import { DayGridView } from '@fullcalendar/daygrid';

// View personalizada para trimestre
export class QuarterView extends DayGridView {
  static type = 'dayGridQuarter';
  static duration = { months: 3 };
}

// View personalizada para semestre
export class SemesterView extends DayGridView {
  static type = 'dayGridSemester';
  static duration = { months: 6 };
}