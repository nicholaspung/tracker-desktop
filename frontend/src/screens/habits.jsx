import {
  Button,
  Container,
  Grid,
  Header,
  Icon,
  Input,
  SpaceBetween,
  Spinner,
} from '@cloudscape-design/components';
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import useMyStore from '../store/useStore';
import { COLLECTION_NAMES } from '../lib/collections';
import Habit from '../components/tasks/habit';
import { addPbRecord } from '../utils/api';
import { isPbClientError } from '../utils/flashbar';
import { fetchHabits } from '../utils/tasks/api';

export default function Habits() {
  const [addHabit, setAddHabit] = useState({});
  const { pb, habits, addItemToStore, setDataInStore } = useMyStore(
    (state) => ({
      pb: state.pb,
      habits: state.habits,
      addItemToStore: state.addItemToStore,
      setDataInStore: state.setDataInStore,
    }),
  );

  const { isLoading, refetch } = useQuery({
    queryKey: [COLLECTION_NAMES.HABITS],
    queryFn: () => fetchHabits(pb, setDataInStore),
    retry: 5,
    initialData: [],
  });

  const { activeHabits, archivedHabits } = habits
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

  const onAddHabit = async () => {
    if (!addHabit.name) {
      return null;
    }
    const data = await addPbRecord(pb, {
      collectionName: COLLECTION_NAMES.HABITS,
      body: addHabit,
    });
    if (!data) return null;
    if (isPbClientError(data)) return data;

    addItemToStore(COLLECTION_NAMES.HABITS, data);
    setAddHabit({});

    return null;
  };

  return (
    <Container>
      <SpaceBetween direction="vertical" size="xs">
        <Grid gridDefinition={[{ colspan: 6 }]} key="top">
          <Header
            actions={
              <Button onClick={refetch}>
                <Icon name="refresh" />
              </Button>
            }
          >
            Habits
          </Header>
        </Grid>
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
          {isLoading ? (
            <Spinner />
          ) : (
            <SpaceBetween size="xs" direction="vertical">
              <Container>
                <Header>Active habits</Header>
                <br />
                {activeHabits.map((habit, i) => (
                  <Habit
                    habits={activeHabits}
                    habit={habit}
                    i={i}
                    key={habit.id}
                  />
                ))}
                {!activeHabits.length ? (
                  <p>
                    <i>No active habits</i>
                  </p>
                ) : null}
              </Container>
              <Container>
                <Header>Archived habits</Header>
                <br />
                {archivedHabits.map((habit, i) => (
                  <Habit
                    habits={archivedHabits}
                    habit={habit}
                    i={i}
                    key={habit.id}
                  />
                ))}
                {!archivedHabits.length ? (
                  <p>
                    <i>No archived habits</i>
                  </p>
                ) : null}
              </Container>
            </SpaceBetween>
          )}
        </Grid>
      </SpaceBetween>
    </Container>
  );
}
