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
  SpaceBetween,
  Textarea,
} from '@cloudscape-design/components';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useMyStore from '../../store/useStore';
import { COLLECTION_NAMES } from '../../lib/collections';
import { updatePbRecord } from '../../utils/api';
import { deleteData } from '../../utils/data';
import { DEFAULT_ERROR_TEXTS, REPEAT_SELECTION } from '../../lib/tasks/tasks';
import HabitEveryDay from './habit-repeat-frequency/habit-every-day';
import HabitEveryWeek from './habit-repeat-frequency/habit-every-week';
import HabitEveryDayOfMonth from './habit-repeat-frequency/habit-every-day-of-month';
import HabitEveryYear from './habit-repeat-frequency/habit-every-year';
import { fetchDailies } from '../../utils/tasks/api';

export default function Habit({ habits, habit, i, isDaily, children, daily }) {
  const { pb, replaceItemInStore, removeItemInStore, setDataInStore } =
    useMyStore((state) => ({
      pb: state.pb,
      replaceItemInStore: state.replaceItemInStore,
      removeItemInStore: state.removeItemInStore,
      setDataInStore: state.setDataInStore,
    }));

  const { refetch } = useQuery({
    queryKey: [COLLECTION_NAMES.DAILIES],
    queryFn: () => fetchDailies(pb, setDataInStore),
    retry: 5,
    initialData: [],
  });

  const [visible, setVisible] = useState(false);
  const getInitialHabit = () => {
    const habitCopy = { ...habit };
    if (habitCopy.repeatEveryXDayOfMonth) {
      habitCopy.repeatEveryXDayOfMonth = {
        value: String(habitCopy.repeatEveryXDayOfMonth),
        label: String(habitCopy.repeatEveryXDayOfMonth),
      };
    }
    if (habitCopy.repeatEveryYearOnXDay) {
      habitCopy.repeatEveryYearOnXDay = {
        value: String(habitCopy.repeatEveryYearOnXDay),
        label: String(habitCopy.repeatEveryYearOnXDay),
      };
    }
    if (habitCopy.repeatEveryYearOnXMonth) {
      habitCopy.repeatEveryYearOnXMonth = {
        value: String(habitCopy.repeatEveryYearOnXMonth),
        label: String(habitCopy.repeatEveryYearOnXMonth),
      };
    }
    return habitCopy;
  };
  const INITIAL_HABIT = getInitialHabit();
  const [editHabit, setEditHabit] = useState(INITIAL_HABIT);
  const [errorEditHabit, setErrorEditHabit] = useState({
    name: undefined,
    ...DEFAULT_ERROR_TEXTS,
  });

  const onModalClose = () => {
    setVisible(false);
    setErrorEditHabit(DEFAULT_ERROR_TEXTS);
  };

  const onUpdate = async () => {
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

    const pbEditHabit = {
      ...editHabit,
      repeatEveryXDayOfMonth: editHabit.repeatEveryXDayOfMonth.value,
      repeatEveryYearOnXDay: editHabit.repeatEveryYearOnXDay.value,
      repeatEveryYearOnXMonth: editHabit.repeatEveryYearOnXMonth.value,
    };
    const record = await updatePbRecord(pb, {
      collectionName: COLLECTION_NAMES.HABITS,
      id: habit.id,
      body: pbEditHabit,
    });
    if (record) {
      replaceItemInStore(COLLECTION_NAMES.HABITS, record);
      refetch();
      onModalClose();
    }
  };

  const onDelete = async () => {
    await deleteData(
      pb,
      { collection: COLLECTION_NAMES.HABITS },
      { id: habit.id, removeItemInStore },
    );
    onModalClose();
  };

  const onDeleteDaily = async () => {
    await deleteData(
      pb,
      { collection: COLLECTION_NAMES.DAILIES },
      { id: daily.id, removeItemInStore },
    );
  };

  return (
    <div key={habit.id}>
      <Grid
        gridDefinition={
          isDaily
            ? [{ colspan: 2 }, { colspan: 9 }, { colspan: 1 }]
            : [{ colspan: 11 }, { colspan: 1 }]
        }
      >
        {isDaily ? children : null}
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
            <SpaceBetween size="xs" direction="vertical">
              <Button variant="inline-link" onClick={() => setVisible(true)}>
                <SpaceBetween size="xs" direction="horizontal">
                  <Icon name="edit" />
                  <span>Edit</span>
                </SpaceBetween>
              </Button>
              {isDaily ? (
                <Button variant="inline-link" onClick={onDeleteDaily}>
                  <SpaceBetween size="xs" direction="horizontal">
                    <Icon name="remove" />
                    <span>Delete</span>
                  </SpaceBetween>
                </Button>
              ) : null}
            </SpaceBetween>
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
              {!isDaily ? (
                <Button onClick={onDelete}>
                  <Icon name="remove" />
                </Button>
              ) : null}
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
              <HabitEveryDay
                editHabit={editHabit}
                errorEditHabit={errorEditHabit}
                setEditHabit={setEditHabit}
                setErrorEditHabit={setErrorEditHabit}
              />
              <HabitEveryWeek
                editHabit={editHabit}
                errorEditHabit={errorEditHabit}
                setEditHabit={setEditHabit}
                setErrorEditHabit={setErrorEditHabit}
                habit={habit}
              />
              <HabitEveryDayOfMonth
                editHabit={editHabit}
                errorEditHabit={errorEditHabit}
                setEditHabit={setEditHabit}
                setErrorEditHabit={setErrorEditHabit}
              />
              <HabitEveryYear
                editHabit={editHabit}
                errorEditHabit={errorEditHabit}
                setEditHabit={setEditHabit}
                setErrorEditHabit={setErrorEditHabit}
              />
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
