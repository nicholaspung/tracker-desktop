export const REPEAT_SELECTION = {
  REPEAT_EVERY_X_DAY: 'repeatEveryXDay',
  REPEAT_EVERY_WEEK_ON_X_DAYS: 'repeatEveryWeekOnXDays',
  REPEAT_EVERY_X_DAY_OF_MONTH: 'repeatEveryXDayOfMonth',
  REPEAT_EVERY_YEAR_ON_X_DAY_X_MONTH: 'repeatEveryYearOnXDayXMonth',
};

export const DEFAULT_ERROR_TEXTS = {
  repeatEveryXDay: undefined,
  repeatEveryWeekOnXDays: undefined,
  repeatEveryXDayOfMonth: undefined,
  repeatEveryYearOnXDay: undefined,
  repeatEveryYearOnXMonth: undefined,
  repeatSelection: undefined,
};

export const DAY_OPTIONS = [
  1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22,
  23, 24, 25, 26, 27, 28, 29, 30, 31,
].map((el) => ({ value: el, label: el }));

export const WEEK_OPTIONS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const MONTH_OPTIONS = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
].map((el) => ({ value: el, label: el }));

export const DAILIES_LOCAL_STORAGE_KEY = 'latest_daily_creation_date';
