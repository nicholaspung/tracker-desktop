import { Input, SpaceBetween, Toggle } from '@cloudscape-design/components';
import {
  DEFAULT_ERROR_TEXTS,
  REPEAT_SELECTION,
} from '../../../lib/tasks/tasks';

export default function HabitEveryDay({
  editHabit,
  errorEditHabit,
  setEditHabit,
  setErrorEditHabit,
}) {
  return (
    <SpaceBetween size="xs" direction="horizontal" key="inner-12541">
      <Toggle
        checked={
          editHabit.repeatSelection === REPEAT_SELECTION.REPEAT_EVERY_X_DAY
        }
        onChange={({ detail }) => {
          setEditHabit((prev) => ({
            ...prev,
            repeatSelection: detail.checked
              ? REPEAT_SELECTION.REPEAT_EVERY_X_DAY
              : undefined,
          }));
          setErrorEditHabit((prev) => ({
            ...prev,
            ...DEFAULT_ERROR_TEXTS,
          }));
        }}
      />
      <SpaceBetween size="xs" direction="horizontal" key="inner-234">
        <span>Repeat every </span>
        <Input
          type="number"
          value={editHabit.repeatEveryXDay}
          placeholder="0"
          onChange={({ detail }) => {
            setEditHabit((prev) => ({
              ...prev,
              repeatEveryXDay: detail.value,
            }));
            if (errorEditHabit.repeatEveryXDay) {
              setErrorEditHabit((prev) => ({
                ...prev,
                repeatEveryXDay: undefined,
              }));
            }
          }}
          invalid={!!errorEditHabit.repeatEveryXDay}
        />
        <span> day(s)</span>
      </SpaceBetween>
    </SpaceBetween>
  );
}
