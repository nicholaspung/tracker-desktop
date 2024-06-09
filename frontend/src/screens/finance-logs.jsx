import { SpaceBetween, Tabs } from '@cloudscape-design/components';
import TableList from '../components/table-list';
import {
  CONFIG_FINANCES_CATEGORY,
  CONFIG_FINANCES_LOG,
  CONFIG_FINANCES_TAG,
} from '../lib/config';
import { COLLECTION_NAMES } from '../lib/collections';
import useMyStore from '../store/useStore';
import { getListData } from '../utils/data';
import useData from '../hooks/useData';
import FinanceLogsSummary from './finance-logs-summary';

export default function FinanceLogs() {
  const { pb, financesLog, setDataInStore, financesCategory, financesTag } =
    useMyStore((state) => ({
      pb: state.pb,
      financesLog: state[COLLECTION_NAMES.FINANCES_LOG],
      setDataInStore: state.setDataInStore,
      financesCategory: state[COLLECTION_NAMES.FINANCES_CATEGORY],
      financesTag: state[COLLECTION_NAMES.FINANCES_TAG],
    }));

  const getFinancesLog = async () => {
    getListData(pb, CONFIG_FINANCES_LOG, {
      prevData: financesLog,
      setDataInStore,
    });
  };
  const { isLoading: flIsLoading, refetch: flRefetch } =
    useData(getFinancesLog);

  const getFinancesCategory = async () => {
    getListData(pb, CONFIG_FINANCES_CATEGORY, {
      prevData: financesCategory,
      setDataInStore,
    });
  };
  const { refetch: fcRefetch, isLoading: fcLoading } =
    useData(getFinancesCategory);

  const getFinancesTag = async () => {
    getListData(pb, CONFIG_FINANCES_TAG, {
      prevData: financesTag,
      setDataInStore,
    });
  };
  const { refetch: ftRefetch, isLoading: ftLoading } = useData(getFinancesTag);

  return (
    <SpaceBetween size="xs" direction="vertical">
      <Tabs
        variant="container"
        tabs={[
          {
            label: 'Logs',
            id: 'logs',
            content: (
              <TableList
                data={financesLog}
                columns={CONFIG_FINANCES_LOG.columns}
                label="All Finance Logs"
                isLoading={flIsLoading}
                refetch={flRefetch}
                variant="embedded"
              />
            ),
          },
          {
            label: 'Categories',
            id: 'categories',
            content: (
              <TableList
                data={financesCategory}
                columns={CONFIG_FINANCES_CATEGORY.columns}
                label="All Finance Categories"
                isLoading={fcLoading}
                refetch={fcRefetch}
                variant="embedded"
              />
            ),
          },
          {
            label: 'Tags',
            id: 'tags',
            content: (
              <TableList
                data={financesTag}
                columns={CONFIG_FINANCES_TAG.columns}
                label="All Finance Tags"
                isLoading={ftLoading}
                refetch={ftRefetch}
                variant="embedded"
              />
            ),
          },
        ]}
      />
      <FinanceLogsSummary />
    </SpaceBetween>
  );
}
