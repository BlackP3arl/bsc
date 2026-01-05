export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

export const MONTHS_SHORT = [
  'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'
];

export const QUARTERS = [
  { start: 0, end: 2, label: 'Q1' },
  { start: 3, end: 5, label: 'Q2' },
  { start: 6, end: 8, label: 'Q3' },
  { start: 9, end: 11, label: 'Q4' },
];

export const getQuarterForMonth = (month) => {
  if (month >= 0 && month <= 2) return 0;
  if (month >= 3 && month <= 5) return 1;
  if (month >= 6 && month <= 8) return 2;
  return 3;
};

export const getMonthPosition = (month, cellWidth) => {
  return month * cellWidth;
};

export const getMonthFromPosition = (position, cellWidth) => {
  return Math.max(0, Math.min(11, Math.floor(position / cellWidth)));
};

export const clampMonth = (month) => {
  return Math.max(0, Math.min(11, month));
};

