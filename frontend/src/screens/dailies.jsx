import {
  Button,
  Container,
  Grid,
  Header,
  Icon,
  ProgressBar,
  SpaceBetween,
  Spinner,
} from '@cloudscape-design/components';
import { useQuery } from '@tanstack/react-query';
import { useEffect } from 'react';
import { COLLECTION_NAMES } from '../lib/collections';
import { addPbRecord, updatePbRecord } from '../utils/api';
import useMyStore from '../store/useStore';
import { isPbClientError } from '../utils/flashbar';
import { fetchDailies } from '../utils/tasks/api';
import {
  cloudscapeDateToCorrectDateValue,
  dateToDatePicker,
  daysBetweenDates,
} from '../utils/date';
import {
  DAILIES_LOCAL_STORAGE_KEY,
  MONTH_OPTIONS,
  REPEAT_SELECTION,
  WEEK_OPTIONS,
} from '../lib/tasks/tasks';
import Habit from '../components/tasks/habit';
import { getCompletionPercentage } from '../utils/tasks/daily';

export default function Dailies() {
  const {
    pb,
    dailies,
    habits,
    setDataInStore,
    addItemToStore,
    replaceItemInStore,
  } = useMyStore((state) => ({
    pb: state.pb,
    dailies: state.dailies,
    habits: state.habits,
    setDataInStore: state.setDataInStore,
    addItemToStore: state.addItemToStore,
    replaceItemInStore: state.replaceItemInStore,
  }));

  const { isLoading, refetch } = useQuery({
    queryKey: [COLLECTION_NAMES.DAILIES],
    queryFn: () => fetchDailies(pb, setDataInStore),
    retry: 5,
    initialData: [],
  });

  const TODAY_LOCALE_DATE_STRING = new Date().toLocaleDateString();

  const hasTodaysDailiesBeenCreated = () => {
    const lastDailyDate = localStorage.getItem(DAILIES_LOCAL_STORAGE_KEY);
    if (lastDailyDate !== TODAY_LOCALE_DATE_STRING) {
      return false;
    }
    return true;
  };

  const todaysDailies = dailies.filter(
    (daily) =>
      new Date(daily.date).toLocaleDateString() === TODAY_LOCALE_DATE_STRING,
  );
  const activeHabits = habits.filter((habit) => !habit.archived);

  /**
   * TODO
   */
  const hasDailyAlreadyBeenCreated = (habit) => {
    if (!todaysDailies.length) return false;

    let result = false;
    for (let i = 0; i < todaysDailies.length; i += 1) {
      if (todaysDailies[i].expand.current_relation.id === habit.id) {
        result = true;
        break;
      }
    }
    return result;
  };

  const createDaily = async (habit) => {
    const data = await addPbRecord(pb, {
      collectionName: COLLECTION_NAMES.DAILIES,
      expandFields: ['current_relation'],
      body: {
        date: cloudscapeDateToCorrectDateValue(dateToDatePicker()),
        completed: false,
        current_relation: habit.id,
        initial_habit: habit,
      },
    });
    if (!data) return null;
    if (isPbClientError(data)) return data;

    addItemToStore(COLLECTION_NAMES.DAILIES, data);

    return null;
  };

  const createDailiesFromHabits = async () => {
    for (let i = 0; i < activeHabits.length; i += 1) {
      const { repeatSelection } = activeHabits[i];
      const today = new Date();
      if (!repeatSelection) continue;
      if (hasDailyAlreadyBeenCreated(activeHabits[i])) continue;

      if (repeatSelection === REPEAT_SELECTION.REPEAT_EVERY_X_DAY) {
        const habitCreated = new Date(activeHabits[i].created);
        const days = daysBetweenDates(today, habitCreated);
        if (days % activeHabits[i].repeatEveryXDay === 0) {
          await createDaily(activeHabits[i]);
        }
      } else if (
        repeatSelection === REPEAT_SELECTION.REPEAT_EVERY_WEEK_ON_X_DAYS
      ) {
        const day = today.getDay();
        if (
          activeHabits[i].repeatEveryWeekOnXDays.includes(WEEK_OPTIONS[day])
        ) {
          await createDaily(activeHabits[i]);
        }
      } else if (
        repeatSelection === REPEAT_SELECTION.REPEAT_EVERY_X_DAY_OF_MONTH
      ) {
        const date = today.getDate();
        if (activeHabits[i].repeatEveryXDayOfMonth === date) {
          await createDaily(activeHabits[i]);
        }
      } else if (
        repeatSelection === REPEAT_SELECTION.REPEAT_EVERY_YEAR_ON_X_DAY_X_MONTH
      ) {
        const date = today.getDate();
        const month = today.getMonth();
        if (
          activeHabits[i].repeatEveryYearOnXDay === date &&
          activeHabits[i].repeatEveryYearOnXMonth === MONTH_OPTIONS[month].value
        ) {
          await createDaily(activeHabits[i]);
        }
      }
    }

    localStorage.setItem(DAILIES_LOCAL_STORAGE_KEY, TODAY_LOCALE_DATE_STRING);
    return null;
  };

  const updateDaily = async (daily) => {
    const record = await updatePbRecord(pb, {
      collectionName: COLLECTION_NAMES.DAILIES,
      id: daily.id,
      expandFields: ['current_relation'],
      body: {
        completed: !daily.completed,
      },
    });
    if (record) {
      replaceItemInStore(COLLECTION_NAMES.DAILIES, record);
    }
  };

  useEffect(() => {
    if (!hasTodaysDailiesBeenCreated()) {
      createDailiesFromHabits();
    }
  }, []);

  return (
    <Container>
      <Grid gridDefinition={[{ colspan: 6 }]}>
        <SpaceBetween size="m" direction="vertical">
          <Header
            actions={
              <SpaceBetween
                size="xs"
                direction="horizontal"
                alignItems="center"
              >
                <span>
                  Today&apos;s dailies created?{' '}
                  <i>{hasTodaysDailiesBeenCreated() ? 'Yes' : 'No'}</i>
                </span>
                <Button onClick={createDailiesFromHabits}>
                  Create dailies
                </Button>
                <Button onClick={refetch}>
                  <Icon name="refresh" />
                </Button>
              </SpaceBetween>
            }
          >
            Dailies
          </Header>
          <ProgressBar value={getCompletionPercentage(todaysDailies)} />
        </SpaceBetween>
      </Grid>
      <Grid gridDefinition={[{ colspan: 6 }]}>
        {isLoading ? (
          <Spinner />
        ) : (
          <Container>
            {todaysDailies.map((daily, i) => (
              <Habit
                habits={todaysDailies}
                habit={daily.expand.current_relation}
                i={i}
                key={daily.id}
                daily={daily}
                isDaily
              >
                <Button
                  variant={daily.completed ? 'primary' : 'normal'}
                  onClick={() => updateDaily(daily)}
                >
                  <Icon name="check" />
                </Button>
              </Habit>
            ))}
          </Container>
        )}
      </Grid>
    </Container>
  );
}
