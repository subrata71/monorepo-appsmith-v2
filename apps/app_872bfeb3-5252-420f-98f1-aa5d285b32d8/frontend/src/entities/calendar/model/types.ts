export interface DayCell {
  date: Date;
  day: number;
  isCurrentMonth: boolean;
  isToday: boolean;
  isFocused: boolean;
}

export interface CalendarMonth {
  year: number;
  month: number; // 0-based (0 = January)
  days: DayCell[];
}

export interface CalendarState {
  year: number;
  month: number;
  days: DayCell[];
  focusedDay: number | null;
  loading: boolean;
  error: string | null;
}
