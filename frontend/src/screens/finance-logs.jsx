import { SpaceBetween, Tabs } from '@cloudscape-design/components';
import { useQueries } from '@tanstack/react-query';
import TableList from '../components/table-list';
import {
  CONFIG_CUSTOM_FINANCE_SUMMARY,
  CONFIG_FINANCES_CATEGORY,
  CONFIG_FINANCES_LOG,
  CONFIG_FINANCES_TAG,
} from '../lib/config';
import { SELECT_TYPES } from '../lib/display';
import Summary from '../components/summary';
import useMyStore from '../store/useStore';

export default function FinanceLogs() {
  const configs = [
    CONFIG_FINANCES_LOG,
    CONFIG_FINANCES_CATEGORY,
    CONFIG_FINANCES_TAG,
  ];
  const { fetchPbRecordList } = useMyStore((state) => ({
    fetchPbRecordList: state.fetchPbRecordList,
  }));

  const fetchData = async (config) => {
    await fetchPbRecordList(config);
    return true;
  };

  const queries = useQueries({
    queries: configs.map((config) => ({
      queryKey: [config.collection, config],
      queryFn: () => fetchData(config),
      retry: 5,
      initialData: [],
    })),
  });

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
                config={configs[0]}
                label="All Finance Logs"
                variant="embedded"
                selectionType={SELECT_TYPES.SINGLE}
                isLoading={queries[0].isLoading}
                refetch={queries[0].refetch}
              />
            ),
          },
          {
            label: 'Categories',
            id: 'categories',
            content: (
              <TableList
                config={configs[1]}
                label="All Finance Categories"
                variant="embedded"
                selectionType={SELECT_TYPES.SINGLE}
                isLoading={queries[1].isLoading}
                refetch={queries[1].refetch}
              />
            ),
          },
          {
            label: 'Tags',
            id: 'tags',
            content: (
              <TableList
                config={configs[2]}
                label="All Finance Tags"
                variant="embedded"
                selectionType={SELECT_TYPES.SINGLE}
                isLoading={queries[2].isLoading}
                refetch={queries[2].refetch}
              />
            ),
          },
        ]}
      />
      <Summary config={CONFIG_CUSTOM_FINANCE_SUMMARY} />
    </SpaceBetween>
  );
}
