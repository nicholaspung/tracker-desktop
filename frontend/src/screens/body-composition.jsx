import { SpaceBetween, Tabs } from '@cloudscape-design/components';
import { useQueries } from '@tanstack/react-query';
import TableList from '../components/table-list';
import {
  CONFIG_HEALTH_FILES,
  CONFIG_HEALTH_WEIGHT_LOGS,
  CONFIG_MEASUREMENT_TYPE,
} from '../lib/config';
import { SELECT_TYPES } from '../lib/display';
import useMyStore from '../store/useStore';

export default function BodyComposition() {
  const configs = [
    CONFIG_HEALTH_WEIGHT_LOGS,
    CONFIG_MEASUREMENT_TYPE,
    CONFIG_HEALTH_FILES,
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
            label: 'Weight Logs',
            id: 'weight-logs',
            content: (
              <TableList
                config={configs[0]}
                label="All Weight Logs"
                variant="embedded"
                selectionType={SELECT_TYPES.SINGLE}
                isLoading={queries[0].isLoading}
                refetch={queries[0].refetch}
              />
            ),
          },
          {
            label: 'Measurement Types',
            id: 'measurement_types',
            content: (
              <TableList
                config={configs[1]}
                label="All Measurement Types"
                variant="embedded"
                selectionType={SELECT_TYPES.SINGLE}
                isLoading={queries[1].isLoading}
                refetch={queries[1].refetch}
              />
            ),
          },
          {
            label: 'Files',
            id: 'files',
            content: (
              <TableList
                config={configs[2]}
                label="All Health Files"
                variant="embedded"
                selectionType={SELECT_TYPES.SINGLE}
                isLoading={queries[2].isLoading}
                refetch={queries[2].refetch}
              />
            ),
          },
        ]}
      />
    </SpaceBetween>
  );
}
