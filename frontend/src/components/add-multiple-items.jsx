import { useEffect, useState } from 'react';
import { useCollection } from '@cloudscape-design/collection-hooks';
import {
  Button,
  Header,
  Icon,
  Pagination,
  SpaceBetween,
  Table,
  TextFilter,
} from '@cloudscape-design/components';
import {
  getContentDisplayPreference,
  getDefaultPreferences,
} from '../utils/preferences';
import EmptyState from './empty-state';
import { getColumnDefinitionsForEdits } from '../utils/table';
import { getTextFilterCounterText } from '../utils/text-filter';
import { convertToTitleCase } from '../utils/display';
import Preferences from './preferences';
import useMyStore from '../store/useStore';
import { getInitialDataFormat } from '../utils/forms';
import { itemExists } from '../utils/misc';
import { TABLE_DISPLAY_TYPES } from '../lib/display';
import { getStoreValuesFromConfig } from '../utils/store';

export default function AddMultipleItems({
  config,
  label,
  type,
  setDataUpstream,
  hideHeader,
  hidePagination,
  hidePreferences,
  hideFilter,
}) {
  const storeValues = useMyStore((state) => {
    const result = {
      pb: state.pb,
      [config.collection]: state[config.collection],
      setDataInStore: state.setDataInStore,
      replaceItemInStore: state.replaceItemInStore,
      removeItemInStore: state.removeItemInStore,
    };
    return { ...result, ...getStoreValuesFromConfig(state, config) };
  });

  const emptyValue = getInitialDataFormat([
    ...config.columns,
    { id: 'id', type: TABLE_DISPLAY_TYPES.ID },
  ]);
  const [addData, setAddData] = useState([emptyValue]);

  useEffect(() => {
    setDataUpstream(addData);
  }, []);
  const [preferences, setPreferences] = useState(
    getDefaultPreferences(config.columns),
  );

  const {
    items,
    actions,
    filteredItemsCount,
    collectionProps,
    filterProps,
    paginationProps,
  } = useCollection(addData, {
    filtering: {
      empty: <EmptyState title={`No ${label.toLowerCase()}`} />,
      noMatch: (
        <EmptyState
          title="No matches"
          action={
            <Button onClick={() => actions.setFiltering('')}>
              Clear filter
            </Button>
          }
        />
      ),
    },
    pagination: { pageSize: preferences.pageSize },
    sorting: {},
    selection: {},
  });

  const { selectedItems } = collectionProps;

  const onAddIcon = () => {
    setAddData([...addData, emptyValue]);
  };
  const onTrashIcon = () => {
    if (!itemExists(selectedItems)) return;

    setAddData((prev) =>
      prev.filter((el) => {
        if (selectedItems.find((ele) => ele.id === el.id)) {
          return false;
        }
        return true;
      }),
    );
  };

  const tableProps = {
    ...collectionProps,
    columnDefinitions: getColumnDefinitionsForEdits(
      {
        ...config,
        columns: [
          ...config.columns,
          { id: 'id', type: TABLE_DISPLAY_TYPES.TEXT },
        ],
      },
      storeValues,
    ),
    enableKeyboardNavigation: true,
    items,
    columnDisplay: preferences.contentDisplay,
    wrapLines: preferences.wrapLines,
    stripedRows: preferences.stripedRows,
    contentDensity: preferences.contentDensity,
    loadingText: 'Loading resources',
    variant: 'embedded',
    header: !hideHeader ? (
      <Header
        counter={`(${addData.length})`}
        actions={
          <SpaceBetween size="xs" direction="horizontal">
            <Button variant="primary" onClick={onAddIcon}>
              <Icon name="add-plus" />
            </Button>
            <Button onClick={onTrashIcon}>
              <Icon name="remove" />
            </Button>
            <Button onClick={() => console.log(addData)}>Log</Button>
          </SpaceBetween>
        }
      >
        {label}
      </Header>
    ) : null,
    filter: !hideFilter ? (
      <TextFilter
        {...filterProps}
        countText={getTextFilterCounterText(Number(filteredItemsCount))}
        filteringAriaLabel={`Filter ${convertToTitleCase(label)}`}
        filteringPlaceholder="Search here"
      />
    ) : null,
    pagination: !hidePagination ? <Pagination {...paginationProps} /> : null,
    preferences: !hidePreferences ? (
      <Preferences
        preferences={preferences}
        setPreferences={setPreferences}
        contentDisplayPreference={getContentDisplayPreference(config.columns)}
        useWrapLinesPreference
        useStripedRowsPreference
      />
    ) : null,
    selectionType: 'multi',
    submitEdit: (e) => console.log(e),
  };

  return <Table {...tableProps} />;
}
