import { useEffect, useState } from 'react';
import { Header, SegmentedControl } from '@cloudscape-design/components';
import { useQueries } from '@tanstack/react-query';
import useMyStore from '../store/useStore';
import Layout from '../components/layout';
import Habits from '../screens/habits';
import { COLLECTION_NAMES } from '../lib/collections';
import Dailies from '../screens/dailies';
import { fetchDailies, fetchHabits } from '../utils/tasks/api';

const TASKS_PAGE_VIEWS = {
  HABITS: 'habits',
  // TODOS: 'todos',
  DAILIES: 'dailies',
};

export default function TasksPage() {
  const { pb, setDataInStore } = useMyStore((state) => ({
    pb: state.pb,
    setDataInStore: state.setDataInStore,
  }));

  const COLLECTIONS = [
    {
      collectionName: COLLECTION_NAMES.HABITS,
      fetchFunc: () => fetchHabits(pb, setDataInStore),
    },
    {
      collectionName: COLLECTION_NAMES.DAILIES,
      fetchFunc: () => fetchDailies(pb, setDataInStore),
    },
  ];

  useQueries({
    queries: COLLECTIONS.map(({ collectionName, fetchFunc }) => ({
      queryKey: [collectionName],
      queryFn: () => fetchFunc(collectionName),
      retry: 5,
      initialData: [],
    })),
  });

  const [view, setView] = useState(TASKS_PAGE_VIEWS.HABITS);

  useEffect(() => {
    setDataInStore('HelpContent', null);

    return () => {
      setDataInStore('HelpContent', null);
    };
  }, []);

  return (
    <Layout
      contentHeader={
        <Header
          variant="h1"
          description="All you need to keep track of your habits and todos list."
          actions={
            <SegmentedControl
              selectedId={view}
              onChange={({ detail }) => setView(detail.selectedId)}
              label="Choose between Habits and Todos"
              options={[
                { text: 'Dailies', id: TASKS_PAGE_VIEWS.DAILIES },
                { text: 'Habits', id: TASKS_PAGE_VIEWS.HABITS },
                // {
                //   text: 'Todos',
                //   id: TASKS_PAGE_VIEWS.TODOS,
                // },
              ]}
            />
          }
        >
          Tasks
        </Header>
      }
    >
      {view === TASKS_PAGE_VIEWS.DAILIES ? <Dailies /> : null}
      {view === TASKS_PAGE_VIEWS.HABITS ? <Habits /> : null}
      {/* {view === TASKS_PAGE_VIEWS.TODOS ? <Habits /> : null} */}
    </Layout>
  );
}
