import { SpaceBetween, Tabs } from '@cloudscape-design/components';
import { useQueries } from '@tanstack/react-query';
import TableList from '../components/table-list';
import {
  CONFIG_FINANCES_BALANCE,
  CONFIG_FINANCES_BALANCE_ACCOUNT_NAME,
  CONFIG_FINANCES_BALANCE_OWNER,
  CONFIG_FINANCES_BALANCE_TYPE,
} from '../lib/config';
import { SELECT_TYPES } from '../lib/display';
import useMyStore from '../store/useStore';
import { fetchPbRecordList } from '../utils/api';
import { pbRecordsToUseCollectionData, transfomer } from '../utils/data';

export default function FinanceBalances() {
  const configs = [
    CONFIG_FINANCES_BALANCE,
    CONFIG_FINANCES_BALANCE_ACCOUNT_NAME,
    CONFIG_FINANCES_BALANCE_OWNER,
    CONFIG_FINANCES_BALANCE_TYPE,
  ];
  const { pb, setDataInStore } = useMyStore((state) => ({
    pb: state.pb,
    setDataInStore: state.setDataInStore,
  }));

  const fetchData = async (config) => {
    const result = await fetchPbRecordList(pb, {
      collectionName: config.collection,
      expandFields: Array.isArray(config.columns)
        ? config.columns
            .filter((el) => el.expandFields)
            .map((ele) => ele.expandFields)
        : undefined,
      sort: config.sort,
    });

    const transformedResult = pbRecordsToUseCollectionData(
      result,
      transfomer,
      config,
    );

    setDataInStore(config.collection, transformedResult);

    return transformedResult;
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
            label: 'Balances',
            id: 'balances',
            content: (
              <TableList
                config={configs[0]}
                label="All Finance Balances"
                variant="embedded"
                selectionType={SELECT_TYPES.SINGLE}
                isLoading={queries[0].isLoading}
                refetch={queries[0].refetch}
              />
            ),
          },
          {
            label: 'Account Names',
            id: 'account_names',
            content: (
              <TableList
                config={configs[1]}
                label="All Finance Balance Account Names"
                variant="embedded"
                selectionType={SELECT_TYPES.SINGLE}
                isLoading={queries[1].isLoading}
                refetch={queries[1].refetch}
              />
            ),
          },
          {
            label: 'Owners',
            id: 'owners',
            content: (
              <TableList
                config={configs[2]}
                label="All Finance Balance Owners"
                variant="embedded"
                selectionType={SELECT_TYPES.SINGLE}
                isLoading={queries[2].isLoading}
                refetch={queries[2].refetch}
              />
            ),
          },
          {
            label: 'Types',
            id: 'types',
            content: (
              <TableList
                config={configs[3]}
                label="All Finance Balance Types"
                variant="embedded"
                selectionType={SELECT_TYPES.SINGLE}
                isLoading={queries[3].isLoading}
                refetch={queries[3].refetch}
              />
            ),
          },
        ]}
      />
    </SpaceBetween>
  );
}
