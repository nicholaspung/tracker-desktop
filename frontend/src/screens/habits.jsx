import {
  Button,
  Container,
  Grid,
  Header,
  Icon,
  Input,
  SpaceBetween,
} from '@cloudscape-design/components';
import { useState } from 'react';
import useMyStore from '../store/useStore';
import { COLLECTION_NAMES } from '../lib/collections';
import Habit from '../components/tasks/habit';

export default function Habits() {
  const [addHabit, setAddHabit] = useState({});
  const { habits, addItemToStore } = useMyStore((state) => ({
    habits: state.habits,
    addItemToStore: state.addItemToStore,
  }));

  const fakeHabits = [
    ...habits,
    {
      id: '1',
      name: 'hi',
      description: 'description',
      repeatEveryXDay: '0',
      repeatEveryWeekOnXDays: [],
      repeatEveryXDayOfMonth: '0',
      repeatEveryYearOnXDay: '',
      repeatEveryYearOnXMonth: '',
      repeatSelection: undefined,
      archived: false,
      updated: 1,
    },
    {
      id: '2',
      name: 'hi 2',
      description: 'description 2',
      repeatEveryXDay: '0',
      repeatEveryWeekOnXDays: [],
      repeatEveryXDayOfMonth: '0',
      repeatEveryYearOnXDay: '',
      repeatEveryYearOnXMonth: '',
      repeatSelection: undefined,
      archived: true,
      updated: 2,
    },
    {
      id: '3',
      name: 'hi 3',
      description: 'description 3',
      repeatEveryXDay: '0',
      repeatEveryWeekOnXDays: [],
      repeatEveryXDayOfMonth: '0',
      repeatEveryYearOnXDay: '',
      repeatEveryYearOnXMonth: '',
      repeatSelection: undefined,
      archived: false,
      updated: 3,
    },
  ];

  const { activeHabits, archivedHabits } = fakeHabits
    .sort((a, b) => {
      if (a.updated > b.updated) {
        return -1;
      }
      if (a.updated < b.updated) {
        return 1;
      }
      return 0;
    })
    .reduce(
      (acc, curr) => {
        if (acc) {
          if (curr.archived) {
            acc.archivedHabits.push(curr);
          } else {
            acc.activeHabits.push(curr);
          }
        }
        return acc;
      },
      { activeHabits: [], archivedHabits: [] },
    );

  const onAddHabit = () => {
    if (!addHabit.name) {
      return;
    }
    addItemToStore(COLLECTION_NAMES.HABITS, {
      ...addHabit,
      id: crypto.randomUUID(),
    });
    setAddHabit({});
  };

  return (
    <Container header={<Header>Habits</Header>}>
      <SpaceBetween direction="vertical" size="xs">
        <Grid gridDefinition={[{ colspan: 5 }, { colspan: 1 }]} key="middle">
          <Input
            value={addHabit.name}
            onChange={({ detail }) =>
              setAddHabit((prev) => ({ ...prev, name: detail.value }))
            }
            placeholder="Add new habit here"
          />
          <Button variant="primary" onClick={onAddHabit}>
            <Icon name="add-plus" />
          </Button>
        </Grid>
        <Grid gridDefinition={[{ colspan: 6 }]} key="bottom">
          <Container header={<Header>Individual habits</Header>}>
            <div key="div1">
              <u>Active habits</u>
            </div>
            <br />
            {activeHabits.map((habit, i) => (
              <Habit
                habits={activeHabits}
                habit={habit}
                i={i}
                key={`${habit.name}${i + 10}`}
              />
            ))}
            <br />
            <div key="div2">
              <u>Archived habits</u>
            </div>
            <br />
            {archivedHabits.map((habit, i) => (
              <Habit
                habits={archivedHabits}
                habit={habit}
                i={i}
                key={`${habit.name}${i + 12}`}
              />
            ))}
          </Container>
        </Grid>
      </SpaceBetween>
    </Container>
  );
}
