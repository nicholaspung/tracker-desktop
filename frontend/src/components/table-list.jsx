import { useState } from 'react';
import { useCollection } from '@cloudscape-design/collection-hooks';
import {
  Button,
  Grid,
  Header,
  Icon,
  Pagination,
  Spinner,
  Table,
  TextFilter,
} from '@cloudscape-design/components';
import {
  getContentDisplayPreference,
  getDefaultPreferences,
} from '../utils/preferences';
import EmptyState from './empty-state';
import { getColumnDefinitions } from '../utils/table';
import { getTextFilterCounterText } from '../utils/text-filter';
import { convertToTitleCase } from '../utils/display';
import Preferences from './preferences';
import { SELECT_TYPES } from '../lib/display';
import useMyStore from '../store/useStore';
import { getStoreNamesFromConfig } from '../utils/store';
import EditTableItem from './forms/edit-table-item';

export default function TableList({
  data,
  config,
  label,
  isLoading,
  refetch,
  hideHeader,
  variant = 'container',
  hidePagination,
  hidePreferences,
  hideFilter,
  selectionType,
}) {
  const storeValues = useMyStore((state) => {
    const storeNames = getStoreNamesFromConfig(config);
    const result = {
      pb: state.pb,
      replaceItemInStore: state.replaceItemInStore,
      removeItemInStore: state.removeItemInStore,
    };
    storeNames.forEach((store) => {
      result[store] = state[store];
    });
    return result;
  });

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
  } = useCollection(data, {
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

  const tableProps = {
    ...collectionProps,
    columnDefinitions: getColumnDefinitions(config.columns),
    enableKeyboardNavigation: true,
    items,
    columnDisplay: preferences.contentDisplay,
    wrapLines: preferences.wrapLines,
    stripedRows: preferences.stripedRows,
    contentDensity: preferences.contentDensity,
    loadingText: 'Loading resources',
    loading: isLoading,
    variant,
    trackBy: 'id',
    header: !hideHeader ? (
      <Header
        counter={`(${data.length})`}
        actions={
          refetch ? (
            <Button onClick={refetch}>
              {isLoading ? <Spinner /> : <Icon name="refresh" />}
            </Button>
          ) : null
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
    selectionType,
    isItemDisabled: (item) => {
      if (selectedItems.length) {
        if (selectedItems.find((el) => item.id === el.id)) {
          return false;
        }
        return true;
      }
      return false;
    },
  };

  const [editedData, setEditedData] = useState(null);

  const clearSelection = async () => {
    actions.setSelectedItems([]);
    await setEditedData(null);
  };

  return selectionType === SELECT_TYPES.SINGLE && selectedItems.length > 0 ? (
    <Grid
      gridDefinition={[
        {
          colspan: {
            default: 12,
            s: 4,
          },
        },
        {
          colspan: {
            default: 12,
            s: 8,
          },
        },
      ]}
    >
      <EditTableItem
        storeValues={storeValues}
        config={config}
        selectedItem={selectedItems[0]}
        clearSelection={clearSelection}
        editedData={editedData}
        setEditedData={setEditedData}
      />
      <Table {...tableProps} />
    </Grid>
  ) : (
    <Table {...tableProps} />
  );
}
