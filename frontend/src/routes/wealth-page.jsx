import {
  Button,
  Header,
  Pagination,
  Table,
  TextFilter,
} from '@cloudscape-design/components';
import jmespath from 'jmespath';
import { useState } from 'react';
import { useCollection } from '@cloudscape-design/collection-hooks';
import Layout from '../components/layout';
import { getColumnDefinitions } from '../utils/table';
import useMyStore from '../store/useStore';
import { fetchPbRecordList } from '../utils/api';
import { COLLECTION_NAMES } from '../lib/collections';
import { pbRecordToUseCollectionData } from '../utils/data';
import useData from '../hooks/useData';
import EmptyState from '../components/empty-state';
import {
  getContentDisplayPreference,
  getDefaultPreferences,
} from '../utils/preferences';
import Preferences from '../components/preferences';
import { getTextFilterCounterText } from '../utils/text-filter';
import { TABLE_DISPLAY_TYPES } from '../lib/display';

export default function WealthPage() {
  const { pb, financesLog, setDataInStore, replaceItemInStore } = useMyStore(
    (state) => ({
      pb: state.pb,
      financesLog: state[COLLECTION_NAMES.FINANCES_LOG],
      setDataInStore: state.setDataInStore,
      replaceItemInStore: state.replaceItemInStore,
    }),
  );
  const COLUMNS = [
    { id: 'date', type: TABLE_DISPLAY_TYPES.DATE },
    { id: 'amount', type: TABLE_DISPLAY_TYPES.DOLLAR },
    { id: 'description', type: TABLE_DISPLAY_TYPES.TEXT },
    { id: 'category', type: TABLE_DISPLAY_TYPES.BADGE },
    { id: 'tags', type: TABLE_DISPLAY_TYPES.BADGE },
    { id: 'needs_review', type: TABLE_DISPLAY_TYPES.TEXT },
  ];

  /**
   *
   * @param {{
   *  amount: number,
   *  expand: {
   *    category: {
   *      category: string
   *    },
   *    tags: {
   *      tag: string
   *    }[]
   *  },
   *  date: string,
   *  description: string,
   *  needs_review: boolean
   * }} el
   * @returns {{
   *  date: string,
   *  amount: number,
   *  description: string,
   *  category: string,
   *  tags: string[],
   *  needs_review: boolean
   * }[]}
   */
  const financesLogTransformer = (el) => ({
    date: el.date,
    amount: el.amount,
    description: el.description,
    category: jmespath.search(el, 'expand.category.category'),
    tags: jmespath.search(el, 'expand.tags[].tag'),
    needs_review: el.needs_review,
  });
  const getFinancesLog = async () => {
    const data = await fetchPbRecordList(pb, {
      collectionName: COLLECTION_NAMES.FINANCES_LOG,
      expandFields: ['category', 'tags'],
    });
    if (!data) return;
    if (data.name === 'ClientResponseError 0') return;

    const transformedData = pbRecordToUseCollectionData(
      data,
      financesLogTransformer,
    );

    if (JSON.stringify(transformedData) !== JSON.stringify(financesLog)) {
      setDataInStore(COLLECTION_NAMES.FINANCES_LOG, transformedData);
    }
  };
  const { isLoading, hasError, error, refetch } = useData(getFinancesLog);

  const [preferences, setPreferences] = useState(
    getDefaultPreferences(COLUMNS),
  );

  const {
    items,
    actions,
    filteredItemsCount,
    collectionProps,
    filterProps,
    paginationProps,
  } = useCollection(financesLog, {
    filtering: {
      empty: <EmptyState title="No finance logs" />,
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
      <Table
        {...collectionProps}
        columnDefinitions={getColumnDefinitions(COLUMNS)}
        enableKeyboardNavigation
        items={items}
        columnDisplay={preferences.contentDisplay}
        wrapLines={preferences.wrapLines}
        stripedRows={preferences.stripedRows}
        contentDensity={preferences.contentDensity}
        loadingText="Loading resources"
        loading={isLoading}
        trackBy={(item) => `${item.date}${item.amount}${item.category}`}
        filter={
          <TextFilter
            {...filterProps}
            countText={getTextFilterCounterText(Number(filteredItemsCount))}
            filteringAriaLabel="Filter apps"
          />
        }
        pagination={<Pagination {...paginationProps} />}
        preferences={
          <Preferences
            preferences={preferences}
            setPreferences={setPreferences}
            contentDisplayPreference={getContentDisplayPreference(COLUMNS)}
            useWrapLinesPreference
            useStripedRowsPreference
            useContentDensityPreference
          />
        }
      />
    </Layout>
  );
}
