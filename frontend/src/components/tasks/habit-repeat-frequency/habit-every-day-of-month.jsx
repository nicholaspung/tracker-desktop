import { Select, SpaceBetween, Toggle } from '@cloudscape-design/components';
import {
  DAY_OPTIONS,
  DEFAULT_ERROR_TEXTS,
  REPEAT_SELECTION,
} from '../../../lib/tasks/tasks';

export default function HabitEveryDayOfMonth({
  editHabit,
  errorEditHabit,
  setEditHabit,
  setErrorEditHabit,
}) {
  return (
    <SpaceBetween size="xs" direction="horizontal" key="inner-124125">
      <Toggle
        checked={
          editHabit.repeatSelection ===
          REPEAT_SELECTION.REPEAT_EVERY_X_DAY_OF_MONTH
        }
        onChange={({ detail }) => {
          setEditHabit((prev) => ({
            ...prev,
            repeatSelection: detail.checked
              ? REPEAT_SELECTION.REPEAT_EVERY_X_DAY_OF_MONTH
              : undefined,
          }));
          setErrorEditHabit((prev) => ({
            ...prev,
            ...DEFAULT_ERROR_TEXTS,
          }));
        }}
      />
      <SpaceBetween size="xs" direction="horizontal" key="inner-2352351">
        <span>Repeat on the </span>
        <Select
          options={DAY_OPTIONS}
          selectedOption={editHabit.repeatEveryXDayOfMonth}
          placeholder="Day"
          onChange={({ detail }) => {
            setEditHabit((prev) => ({
              ...prev,
              repeatEveryXDayOfMonth: detail.selectedOption,
            }));
            if (errorEditHabit.repeatEveryXDayOfMonth) {
              setErrorEditHabit((prev) => ({
                ...prev,
                repeatEveryXDayOfMonth: undefined,
              }));
            }
          }}
          invalid={!!errorEditHabit.repeatEveryXDayOfMonth}
        />
        <span> day of every month</span>
      </SpaceBetween>
    </SpaceBetween>
  );
}
