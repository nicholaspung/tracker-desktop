import {
  Header,
  HelpPanel,
  SegmentedControl,
  SpaceBetween,
} from '@cloudscape-design/components';
import { useEffect, useState } from 'react';
import Layout from '../components/layout';
import useMyStore from '../store/useStore';
import { COLLECTION_NAMES } from '../lib/collections';
import {
  CONFIG_FINANCES_BALANCE,
  CONFIG_FINANCES_BALANCE_ACCOUNT_NAME,
  CONFIG_FINANCES_BALANCE_OWNER,
  CONFIG_FINANCES_BALANCE_TYPE,
  CONFIG_FINANCES_CATEGORY,
  CONFIG_FINANCES_FILES,
  CONFIG_FINANCES_LOG,
  CONFIG_FINANCES_TAG,
} from '../lib/config';
import AddItemButtonModal from '../components/add-item-button-modal';
import FinanceLogs from '../screens/finance-logs';
import FinanceBalances from '../screens/finance-balances';

const WEALTH_PAGE_VIEWS = {
  FINANCE_LOGS: 'finance-logs',
  FINANCE_BALANCES: 'finance-balances',
};

export default function WealthPage() {
  const { setDataInStore } = useMyStore((state) => ({
    pb: state.pb,
    financesLog: state[COLLECTION_NAMES.FINANCES_LOG],
    setDataInStore: state.setDataInStore,
    financesCategory: state[COLLECTION_NAMES.FINANCES_CATEGORY],
    financesTag: state[COLLECTION_NAMES.FINANCES_TAG],
  }));

  const [view, setView] = useState(WEALTH_PAGE_VIEWS.FINANCE_LOGS);

  function HelpContent() {
    return (
      <HelpPanel header={<h2>Overview</h2>}>
        <SpaceBetween size="xs" direction="vertical" alignItems="center">
          <h4>Finance Log Actions</h4>
          <AddItemButtonModal config={CONFIG_FINANCES_LOG} label="Add log" />
          <AddItemButtonModal
            config={CONFIG_FINANCES_CATEGORY}
            label="Add category"
          />
          <AddItemButtonModal config={CONFIG_FINANCES_TAG} label="Add tag" />
          <AddItemButtonModal
            config={CONFIG_FINANCES_FILES}
            label="Add files"
            showMultiple={false}
          />
        </SpaceBetween>
        <hr />
        <SpaceBetween size="xs" direction="vertical" alignItems="center">
          <h4>Finance Balance Actions</h4>
          <AddItemButtonModal
            config={CONFIG_FINANCES_BALANCE}
            label="Add balance"
          />
          <AddItemButtonModal
            config={CONFIG_FINANCES_BALANCE_ACCOUNT_NAME}
            label="Add balance account name"
          />
          <AddItemButtonModal
            config={CONFIG_FINANCES_BALANCE_OWNER}
            label="Add balance owner"
          />
          <AddItemButtonModal
            config={CONFIG_FINANCES_BALANCE_TYPE}
            label="Add balance type"
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
          actions={
            <SegmentedControl
              selectedId={view}
              onChange={({ detail }) => setView(detail.selectedId)}
              label="Choose between Finance Logs and Finance Balances"
              options={[
                { text: 'Finance Logs', id: WEALTH_PAGE_VIEWS.FINANCE_LOGS },
                {
                  text: 'Finance Balances',
                  id: WEALTH_PAGE_VIEWS.FINANCE_BALANCES,
                },
              ]}
            />
          }
        >
          Wealth
        </Header>
      }
    >
      {view === WEALTH_PAGE_VIEWS.FINANCE_LOGS ? <FinanceLogs /> : null}
      {view === WEALTH_PAGE_VIEWS.FINANCE_BALANCES ? <FinanceBalances /> : null}
    </Layout>
  );
}
