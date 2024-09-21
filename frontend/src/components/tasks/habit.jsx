import {
  Box,
  Button,
  Checkbox,
  FormField,
  Grid,
  Header,
  Icon,
  Input,
  Modal,
  Popover,
  Select,
  SpaceBetween,
  Textarea,
  Toggle,
} from '@cloudscape-design/components';
import { useState } from 'react';
import useMyStore from '../../store/useStore';
import { COLLECTION_NAMES } from '../../lib/collections';

const REPEAT_SELECTION = {
  REPEAT_EVERY_X_DAY: 'repeatEveryXDay',
  REPEAT_EVERY_WEEK_ON_X_DAYS: 'repeatEveryWeekOnXDays',
  REPEAT_EVERY_X_DAY_OF_MONTH: 'repeatEveryXDayOfMonth',
  REPEAT_EVERY_YEAR_ON_X_DAY_X_MONTH: 'repeatEveryYearOnXDayXMonth',
};

export default function Habit({ habits, habit, i }) {
  const { replaceItemInStore, removeItemInStore } = useMyStore((state) => ({
    replaceItemInStore: state.replaceItemInStore,
    removeItemInStore: state.removeItemInStore,
  }));

  const [visible, setVisible] = useState(false);
  const INITIAL_HABIT = {
    name: '',
    description: '',
    repeatEveryXDay: undefined,
    repeatEveryWeekOnXDays: [],
    repeatEveryXDayOfMonth: undefined,
    repeatEveryYearOnXDay: undefined,
    repeatEveryYearOnXMonth: undefined,
    repeatSelection: undefined,
    archived: false,
    ...habit,
  };
  const [editHabit, setEditHabit] = useState(INITIAL_HABIT);
  const DEFAULT_ERROR_TEXTS = {
    repeatEveryXDay: undefined,
    repeatEveryWeekOnXDays: undefined,
    repeatEveryXDayOfMonth: undefined,
    repeatEveryYearOnXDay: undefined,
    repeatEveryYearOnXMonth: undefined,
    repeatSelection: undefined,
  };
  const [errorEditHabit, setErrorEditHabit] = useState({
    name: undefined,
    ...DEFAULT_ERROR_TEXTS,
  });

  const DAY_OPTIONS = [
    1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
    22, 23, 24, 25, 26, 27, 28, 29, 30, 31,
  ].map((el) => ({ value: el, label: el }));
  const WEEK_OPTIONS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const MONTH_OPTIONS = [
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

  const onModalClose = () => {
    setVisible(false);
    setErrorEditHabit(DEFAULT_ERROR_TEXTS);
  };

  const onUpdate = () => {
    let hasError = false;
    if (!editHabit.name) {
      setErrorEditHabit((prev) => ({ ...prev, name: 'Required' }));
      hasError = true;
    }
    if (!editHabit.repeatSelection) {
      setErrorEditHabit((prev) => ({ ...prev, repeatSelection: 'Required' }));
      hasError = true;
    } else if (
      editHabit.repeatSelection === REPEAT_SELECTION.REPEAT_EVERY_X_DAY &&
      !Number(editHabit.repeatEveryXDay)
    ) {
      setErrorEditHabit((prev) => ({ ...prev, repeatEveryXDay: 'Required' }));
      hasError = true;
    } else if (
      editHabit.repeatSelection ===
        REPEAT_SELECTION.REPEAT_EVERY_WEEK_ON_X_DAYS &&
      !editHabit.repeatEveryWeekOnXDays.length
    ) {
      setErrorEditHabit((prev) => ({
        ...prev,
        repeatEveryWeekOnXDays: 'Required',
      }));
      hasError = true;
    } else if (
      editHabit.repeatSelection ===
        REPEAT_SELECTION.REPEAT_EVERY_X_DAY_OF_MONTH &&
      !Number(editHabit.repeatEveryXDayOfMonth.value)
    ) {
      setErrorEditHabit((prev) => ({
        ...prev,
        repeatEveryXDayOfMonth: 'Required',
      }));
      hasError = true;
    } else if (
      editHabit.repeatSelection ===
      REPEAT_SELECTION.REPEAT_EVERY_YEAR_ON_X_DAY_X_MONTH
    ) {
      if (!editHabit.repeatEveryYearOnXDay) {
        setErrorEditHabit((prev) => ({
          ...prev,
          repeatEveryYearOnXDay: 'Required',
        }));
        hasError = true;
      }
      if (!editHabit.repeatEveryYearOnXMonth) {
        setErrorEditHabit((prev) => ({
          ...prev,
          repeatEveryYearOnXMonth: 'Required',
        }));
        hasError = true;
      }
    }
    if (hasError) {
      return;
    }
    replaceItemInStore(COLLECTION_NAMES.HABITS, editHabit);
    onModalClose();
  };

  const onDelete = () => {
    removeItemInStore(COLLECTION_NAMES.HABITS, editHabit.id);
    onModalClose();
  };

  return (
    <div>
      <Grid gridDefinition={[{ colspan: 11 }, { colspan: 1 }]}>
        <SpaceBetween size="xs" direction="vertical">
          <span>
            <strong>{habit.name}</strong>
          </span>
          <span>{habit.description}</span>
        </SpaceBetween>
        <Popover
          dismissButton={false}
          position="bottom"
          size="small"
          triggerType="custom"
          content={
            <Button variant="inline-link" onClick={() => setVisible(true)}>
              <SpaceBetween size="xs" direction="horizontal">
                <Icon name="edit" />
                <span>Edit</span>
              </SpaceBetween>
            </Button>
          }
        >
          <Button variant="icon" iconName="ellipsis" />
        </Popover>
      </Grid>
      {habits.length - 1 !== i ? <br /> : null}
      <Modal
        onDismiss={onModalClose}
        visible={visible}
        header={<Header>Edit habit</Header>}
        footer={
          <Box float="right">
            <SpaceBetween size="xs" direction="horizontal">
              <Button onClick={onDelete}>
                <Icon name="remove" />
              </Button>
              <Button variant="primary" onClick={onUpdate}>
                Update
              </Button>
            </SpaceBetween>
          </Box>
        }
      >
        <SpaceBetween size="xs" direction="vertical">
          <FormField label="Name (Required)" errorText={errorEditHabit.name}>
            <Input
              value={editHabit.name}
              onChange={({ detail }) => {
                if (errorEditHabit.name) {
                  setErrorEditHabit((prev) => ({ ...prev, name: undefined }));
                }
                setEditHabit((prev) => ({ ...prev, name: detail.value }));
              }}
            />
          </FormField>
          <FormField label="Description">
            <Textarea
              value={editHabit.description}
              onChange={({ detail }) =>
                setEditHabit((prev) => ({ ...prev, description: detail.value }))
              }
            />
          </FormField>
          <FormField
            label="Repeat frequency"
            errorText={errorEditHabit.repeatSelection}
          >
            <SpaceBetween size="xs" direction="vertical">
              <SpaceBetween size="xs" direction="horizontal">
                <Toggle
                  checked={
                    editHabit.repeatSelection ===
                    REPEAT_SELECTION.REPEAT_EVERY_X_DAY
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
                <SpaceBetween size="xs" direction="horizontal">
                  Repeat every{' '}
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
                  />{' '}
                  day(s)
                </SpaceBetween>
              </SpaceBetween>
              <FormField
                errorText={errorEditHabit.repeatEveryWeekOnXDays || undefined}
              >
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
                    Repeat every week on{' '}
                    <SpaceBetween size="xs" direction="horizontal">
                      {WEEK_OPTIONS.map((day) => (
                        <Button
                          key={day}
                          variant={
                            editHabit.repeatEveryWeekOnXDays.includes(day)
                              ? 'primary'
                              : 'normal'
                          }
                          onClick={() => {
                            if (
                              !editHabit.repeatEveryWeekOnXDays.includes(day)
                            ) {
                              const editHabitCopy = { ...editHabit };
                              editHabitCopy.repeatEveryWeekOnXDays.push(day);
                              setEditHabit(editHabitCopy);
                            } else {
                              setEditHabit((prev) => {
                                const newRepeatEveryWeekOnXDays =
                                  prev.repeatEveryWeekOnXDays;
                                const index =
                                  newRepeatEveryWeekOnXDays.findIndex(
                                    (el) => el === day,
                                  );
                                if (index !== -1) {
                                  newRepeatEveryWeekOnXDays.splice(index, 1);
                                  return {
                                    ...prev,
                                    repeatEveryWeekOnXDays:
                                      newRepeatEveryWeekOnXDays,
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
              <SpaceBetween size="xs" direction="horizontal">
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
                <SpaceBetween size="xs" direction="horizontal">
                  Repeat on the{' '}
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
                  />{' '}
                  day of every month
                </SpaceBetween>
              </SpaceBetween>
              <SpaceBetween size="xs" direction="horizontal">
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
                <SpaceBetween size="xs" direction="horizontal">
                  Repeat every year on{' '}
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
                  />{' '}
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
            </SpaceBetween>
          </FormField>
          <FormField label="Archive">
            <Checkbox
              checked={editHabit.archived}
              onChange={({ detail }) =>
                setEditHabit((prev) => ({ ...prev, archived: detail.checked }))
              }
            >
              Archive
            </Checkbox>
          </FormField>
        </SpaceBetween>
      </Modal>
    </div>
  );
}
