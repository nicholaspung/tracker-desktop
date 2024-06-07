import { useState } from 'react';
import { useCollection } from '@cloudscape-design/collection-hooks';
import {
  Button,
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

export default function TableList({
  data,
  columns,
  label,
  isLoading,
  refetch,
  hideHeader,
  variant = 'container',
  hidePagination,
  hidePreferences,
  hideFilter,
}) {
  const [preferences, setPreferences] = useState(
    getDefaultPreferences(columns),
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

  return (
    <Table
      {...collectionProps}
      columnDefinitions={getColumnDefinitions(columns)}
      enableKeyboardNavigation
      items={items}
      columnDisplay={preferences.contentDisplay}
      wrapLines={preferences.wrapLines}
      stripedRows={preferences.stripedRows}
      contentDensity={preferences.contentDensity}
      loadingText="Loading resources"
      loading={isLoading}
      variant={variant}
      trackBy={(item) => `${item.date}${item.amount}${item.category}`}
      header={
        !hideHeader ? (
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
        ) : null
      }
      filter={
        !hideFilter ? (
          <TextFilter
            {...filterProps}
            countText={getTextFilterCounterText(Number(filteredItemsCount))}
            filteringAriaLabel={`Filter ${convertToTitleCase(label)}`}
          />
        ) : null
      }
      pagination={!hidePagination ? <Pagination {...paginationProps} /> : null}
      preferences={
        !hidePreferences ? (
          <Preferences
            preferences={preferences}
            setPreferences={setPreferences}
            contentDisplayPreference={getContentDisplayPreference(columns)}
            useWrapLinesPreference
            useStripedRowsPreference
          />
        ) : null
      }
    />
  );
}
