import { useEffect, useState } from 'react';
import {
  Header,
  HelpPanel,
  SegmentedControl,
} from '@cloudscape-design/components';
import useMyStore from '../store/useStore';
import Layout from '../components/layout';
import Habits from '../screens/habits';

const TASKS_PAGE_VIEWS = {
  HABITS: 'habits',
  TODOS: 'todos',
  DAILIES: 'dailies',
};

export default function TasksPage() {
  const { setDataInStore } = useMyStore((state) => ({
    setDataInStore: state.setDataInStore,
  }));

  const [view, setView] = useState(TASKS_PAGE_VIEWS.HABITS);

  function HelpContent() {
    return <HelpPanel header={<h2>Overview</h2>} />;
  }

  useEffect(() => {
    setDataInStore('HelpContent', HelpContent);

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
                {
                  text: 'Todos',
                  id: TASKS_PAGE_VIEWS.TODOS,
                },
              ]}
            />
          }
        >
          Tasks
        </Header>
      }
    >
      {view === TASKS_PAGE_VIEWS.DAILIES ? <Habits /> : null}
      {view === TASKS_PAGE_VIEWS.HABITS ? <Habits /> : null}
      {view === TASKS_PAGE_VIEWS.TODOS ? <Habits /> : null}
    </Layout>
  );
}
