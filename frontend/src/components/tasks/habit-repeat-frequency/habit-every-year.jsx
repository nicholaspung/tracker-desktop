import { Select, SpaceBetween, Toggle } from '@cloudscape-design/components';
import {
  DAY_OPTIONS,
  DEFAULT_ERROR_TEXTS,
  MONTH_OPTIONS,
  REPEAT_SELECTION,
} from '../../../lib/tasks/tasks';

export default function HabitEveryYear({
  editHabit,
  errorEditHabit,
  setEditHabit,
  setErrorEditHabit,
}) {
  return (
    <SpaceBetween size="xs" direction="horizontal" key="inner-1523523">
      <Toggle
        checked={
          editHabit.repeatSelection ===
          REPEAT_SELECTION.REPEAT_EVERY_YEAR_ON_X_DAY_X_MONTH
        }
        onChange={({ detail }) => {
          setEditHabit((prev) => ({
            ...prev,
            repeatSelection: detail.checked
              ? REPEAT_SELECTION.REPEAT_EVERY_YEAR_ON_X_DAY_X_MONTH
              : undefined,
          }));
          setErrorEditHabit((prev) => ({
            ...prev,
            ...DEFAULT_ERROR_TEXTS,
          }));
        }}
      />
      <SpaceBetween size="xs" direction="horizontal" key="inner-123">
        <span>Repeat every year on </span>
        <Select
          key="habitday"
          options={DAY_OPTIONS}
          selectedOption={editHabit.repeatEveryYearOnXDay}
          placeholder="Day"
          onChange={({ detail }) => {
            setEditHabit((prev) => ({
              ...prev,
              repeatEveryYearOnXDay: detail.selectedOption,
            }));
            if (errorEditHabit.repeatEveryYearOnXDay) {
              setErrorEditHabit((prev) => ({
                ...prev,
                repeatEveryYearOnXDay: undefined,
              }));
            }
          }}
          invalid={!!errorEditHabit.repeatEveryYearOnXDay}
        />
        <span> </span>
        <Select
          key="habitmonth"
          options={MONTH_OPTIONS}
          selectedOption={editHabit.repeatEveryYearOnXMonth}
          placeholder="Month"
          onChange={({ detail }) => {
            setEditHabit((prev) => ({
              ...prev,
              repeatEveryYearOnXMonth: detail.selectedOption,
            }));
            if (errorEditHabit.repeatEveryYearOnXMonth) {
              setErrorEditHabit((prev) => ({
                ...prev,
                repeatEveryYearOnXMonth: undefined,
              }));
            }
          }}
          invalid={!!errorEditHabit.repeatEveryYearOnXMonth}
        />
      </SpaceBetween>
    </SpaceBetween>
  );
}
