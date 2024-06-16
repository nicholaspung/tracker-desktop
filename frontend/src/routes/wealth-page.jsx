import { Header, HelpPanel, SpaceBetween } from '@cloudscape-design/components';
import { useEffect } from 'react';
import Layout from '../components/layout';
import useMyStore from '../store/useStore';
import { COLLECTION_NAMES } from '../lib/collections';
import {
  CONFIG_FINANCES_CATEGORY,
  CONFIG_FINANCES_LOG,
  CONFIG_FINANCES_TAG,
} from '../lib/config';
import AddItemButtonModal from '../components/add-item-button-modal';
import FinanceLogs from '../screens/finance-logs';

export default function WealthPage() {
  const { setDataInStore } = useMyStore((state) => ({
    pb: state.pb,
    financesLog: state[COLLECTION_NAMES.FINANCES_LOG],
    setDataInStore: state.setDataInStore,
    financesCategory: state[COLLECTION_NAMES.FINANCES_CATEGORY],
    financesTag: state[COLLECTION_NAMES.FINANCES_TAG],
  }));

  function HelpContent() {
    return (
      <HelpPanel header={<h2>Overview</h2>}>
        <SpaceBetween size="xs" direction="vertical" alignItems="center">
          <h4>Finance Log Actions</h4>
          <AddItemButtonModal
            config={CONFIG_FINANCES_LOG}
            label="Add new log"
          />
          <AddItemButtonModal
            config={CONFIG_FINANCES_CATEGORY}
            label="Add new category"
          />
          <AddItemButtonModal
            config={CONFIG_FINANCES_TAG}
            label="Add new tag"
          />
        </SpaceBetween>
        <hr />
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
        >
          Wealth
        </Header>
      }
    >
      <FinanceLogs />
    </Layout>
  );
}
