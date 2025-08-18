import { create } from 'zustand';
import type { CalendarState } from './types';
import {
  getCurrentMonth,
  getMonthDays,
  getPrevMonth,
  getNextMonth,
} from '../lib/utils';

interface CalendarActions {
  loadCurrentMonth: () => void;
  goToPrevMonth: () => void;
  goToNextMonth: () => void;
  setMonth: (year: number, month: number) => void;
  focusDay: (dayIndex: number) => void;
  clearFocus: () => void;
}

type CalendarStore = CalendarState & CalendarActions;

export const useCalendarStore = create<CalendarStore>((set, get) => {
  const { year, month } = getCurrentMonth();

  return {
    // Initial state
    year,
    month,
    days: getMonthDays(year, month),
    focusedDay: null,
    loading: false,
    error: null,

    // Actions
    loadCurrentMonth: () => {
      const current = getCurrentMonth();
      const days = getMonthDays(current.year, current.month);
      set({
        year: current.year,
        month: current.month,
        days,
        focusedDay: null,
        error: null,
      });
    },

    goToPrevMonth: () => {
      const { year, month } = get();
      const prev = getPrevMonth(year, month);
      const days = getMonthDays(prev.year, prev.month);
      set({
        year: prev.year,
        month: prev.month,
        days,
        focusedDay: null,
        error: null,
      });
    },

    goToNextMonth: () => {
      const { year, month } = get();
      const next = getNextMonth(year, month);
      const days = getMonthDays(next.year, next.month);
      set({
        year: next.year,
        month: next.month,
        days,
        focusedDay: null,
        error: null,
      });
    },

    setMonth: (year: number, month: number) => {
      const days = getMonthDays(year, month);
      set({
        year,
        month,
        days,
        focusedDay: null,
        error: null,
      });
    },

    focusDay: (dayIndex: number) => {
      set({ focusedDay: dayIndex });
    },

    clearFocus: () => {
      set({ focusedDay: null });
    },
  };
});
