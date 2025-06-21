import { useEffect } from 'react';
import {
  Header,
  HelpPanel,
  SpaceBetween,
  Tabs,
} from '@cloudscape-design/components';
import { useQueries } from '@tanstack/react-query';
import useMyStore from '../store/useStore';
import Layout from '../components/layout';
import AddItemButtonModal from '../components/add-item-button-modal';
import {
  CONFIG_INVENTORY_CATEGORY,
  CONFIG_INVENTORY_ENTRY,
  CONFIG_INVENTORY_ITEM,
  CONFIG_INVENTORY_LOCATION,
  CONFIG_INVENTORY_UNIT,
} from '../lib/config/inventoryManagement';
import TableList from '../components/table-list';
import { SELECT_TYPES } from '../lib/display';

export default function InventoryManagement() {
  const configs = [
    CONFIG_INVENTORY_ENTRY,
    CONFIG_INVENTORY_ITEM,
    CONFIG_INVENTORY_CATEGORY,
    CONFIG_INVENTORY_LOCATION,
    CONFIG_INVENTORY_UNIT,
  ];
  const { fetchPbRecordList, setDataInStore } = useMyStore((state) => ({
    fetchPbRecordList: state.fetchPbRecordList,
    setDataInStore: state.setDataInStore,
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

  function HelpContent() {
    return (
      <HelpPanel header={<h2>Overview</h2>}>
        <SpaceBetween size="xs" direction="vertical" alignItems="center">
          <h4>Actions</h4>
          <AddItemButtonModal
            config={CONFIG_INVENTORY_ENTRY}
            label="Add entry"
          />
          <AddItemButtonModal config={CONFIG_INVENTORY_ITEM} label="Add item" />
          <AddItemButtonModal
            config={CONFIG_INVENTORY_CATEGORY}
            label="Add Category"
          />
          <AddItemButtonModal
            config={CONFIG_INVENTORY_LOCATION}
            label="Add item location"
          />
          <AddItemButtonModal config={CONFIG_INVENTORY_UNIT} label="Add unit" />
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
          description="All you need to keep track of the things you have in your house."
        >
          Inventory management
        </Header>
      }
    >
      <SpaceBetween size="xs" direction="vertical">
        <Tabs
          variant="container"
          tabs={[
            {
              label: 'Entries',
              id: 'entries',
              content: (
                <TableList
                  config={configs[0]}
                  label="All Inventory Entries"
                  variant="embedded"
                  selectionType={SELECT_TYPES.SINGLE}
                  isLoading={queries[0].isLoading}
                  refetch={queries[0].refetch}
                />
              ),
            },
            {
              label: 'Items',
              id: 'items',
              content: (
                <TableList
                  config={configs[1]}
                  label="All Inventory Items"
                  variant="embedded"
                  selectionType={SELECT_TYPES.SINGLE}
                  isLoading={queries[1].isLoading}
                  refetch={queries[1].refetch}
                />
              ),
            },
            {
              label: 'Categories',
              id: 'categories',
              content: (
                <TableList
                  config={configs[2]}
                  label="All Inventory Categories"
                  variant="embedded"
                  selectionType={SELECT_TYPES.SINGLE}
                  isLoading={queries[2].isLoading}
                  refetch={queries[2].refetch}
                />
              ),
            },
            {
              label: 'Locations',
              id: 'locations',
              content: (
                <TableList
                  config={configs[3]}
                  label="All Inventory Locations"
                  variant="embedded"
                  selectionType={SELECT_TYPES.SINGLE}
                  isLoading={queries[3].isLoading}
                  refetch={queries[3].refetch}
                />
              ),
            },
            {
              label: 'Units',
              id: 'units',
              content: (
                <TableList
                  config={configs[4]}
                  label="All Inventory Units"
                  variant="embedded"
                  selectionType={SELECT_TYPES.SINGLE}
                  isLoading={queries[4].isLoading}
                  refetch={queries[4].refetch}
                />
              ),
            },
          ]}
        />
      </SpaceBetween>
    </Layout>
  );
}
