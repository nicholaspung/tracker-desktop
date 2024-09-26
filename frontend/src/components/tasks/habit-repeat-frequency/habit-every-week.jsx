import {
  Button,
  FormField,
  SpaceBetween,
  Toggle,
} from '@cloudscape-design/components';
import {
  DEFAULT_ERROR_TEXTS,
  REPEAT_SELECTION,
  WEEK_OPTIONS,
} from '../../../lib/tasks/tasks';

export default function HabitEveryWeek({
  editHabit,
  errorEditHabit,
  setEditHabit,
  setErrorEditHabit,
  habit,
}) {
  return (
    <FormField errorText={errorEditHabit.repeatEveryWeekOnXDays || undefined}>
      <SpaceBetween size="xs" direction="horizontal">
        <Toggle
          checked={
            editHabit.repeatSelection ===
            REPEAT_SELECTION.REPEAT_EVERY_WEEK_ON_X_DAYS
          }
          onChange={({ detail }) => {
            setEditHabit((prev) => ({
              ...prev,
              repeatSelection: detail.checked
                ? REPEAT_SELECTION.REPEAT_EVERY_WEEK_ON_X_DAYS
                : undefined,
            }));
            setErrorEditHabit((prev) => ({
              ...prev,
              ...DEFAULT_ERROR_TEXTS,
            }));
          }}
        />
        <SpaceBetween size="xs" direction="vertical">
          <span>Repeat every week on </span>
          <SpaceBetween size="xs" direction="horizontal">
            {WEEK_OPTIONS.map((day, j) => (
              <Button
                key={`${day}${j}${habit.id}`}
                variant={
                  editHabit.repeatEveryWeekOnXDays.includes(day)
                    ? 'primary'
                    : 'normal'
                }
                onClick={() => {
                  if (!editHabit.repeatEveryWeekOnXDays.includes(day)) {
                    const editHabitCopy = { ...editHabit };
                    editHabitCopy.repeatEveryWeekOnXDays.push(day);
                    setEditHabit(editHabitCopy);
                  } else {
                    setEditHabit((prev) => {
                      const newRepeatEveryWeekOnXDays =
                        prev.repeatEveryWeekOnXDays;
                      const index = newRepeatEveryWeekOnXDays.findIndex(
                        (el) => el === day,
                      );
                      if (index !== -1) {
                        newRepeatEveryWeekOnXDays.splice(index, 1);
                        return {
                          ...prev,
                          repeatEveryWeekOnXDays: newRepeatEveryWeekOnXDays,
                        };
                      }
                      return prev;
                    });
                  }
                  setErrorEditHabit((prev) => ({
                    ...prev,
                    ...DEFAULT_ERROR_TEXTS,
                  }));
                }}
              >
                {day}
              </Button>
            ))}
          </SpaceBetween>
        </SpaceBetween>
      </SpaceBetween>
    </FormField>
  );
}
