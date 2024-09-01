import {
  Header,
  HelpPanel,
  SegmentedControl,
  SpaceBetween,
} from '@cloudscape-design/components';
import { useEffect, useState } from 'react';
import Layout from '../components/layout';
import useMyStore from '../store/useStore';
import {
  CONFIG_HEALTH_FILES,
  CONFIG_HEALTH_WEIGHT_LOGS,
  CONFIG_MEASUREMENT_TYPE,
} from '../lib/config';
import AddItemButtonModal from '../components/add-item-button-modal';
import BodyComposition from '../screens/body-composition';

const HEALTH_PAGE_VIEWS = {
  BODY_COMPOSITION: 'body-composition',
};

export default function HealthPage() {
  const { setDataInStore } = useMyStore((state) => ({
    setDataInStore: state.setDataInStore,
  }));

  const [view, setView] = useState(HEALTH_PAGE_VIEWS.BODY_COMPOSITION);

  function HelpContent() {
    return (
      <HelpPanel header={<h2>Overview</h2>}>
        <SpaceBetween size="xs" direction="vertical" alignItems="center">
          <h4>Body Composition Actions</h4>
          <AddItemButtonModal
            config={CONFIG_HEALTH_WEIGHT_LOGS}
            label="Add log"
          />
          <AddItemButtonModal
            config={CONFIG_MEASUREMENT_TYPE}
            label="Add measurement type"
          />
          <AddItemButtonModal
            config={CONFIG_HEALTH_FILES}
            label="Add files"
            showMultiple={false}
          />
        </SpaceBetween>
      </HelpPanel>
    );
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
          description="All you need to keep track of your wealth."
          actions={
            <SegmentedControl
              selectedId={view}
              onChange={({ detail }) => setView(detail.selectedId)}
              // label="Choose between Finance Logs and Finance Balances"
              options={[
                {
                  text: 'Body Composition',
                  id: HEALTH_PAGE_VIEWS.BODY_COMPOSITION,
                },
              ]}
            />
          }
        >
          Health
        </Header>
      }
    >
      {view === HEALTH_PAGE_VIEWS.BODY_COMPOSITION ? <BodyComposition /> : null}
    </Layout>
  );
}
