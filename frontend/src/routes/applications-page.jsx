import {
  Badge,
  Button,
  Cards,
  Header,
  Icon,
  Pagination,
  SpaceBetween,
  Spinner,
  TextFilter,
} from '@cloudscape-design/components';
import { useEffect, useState } from 'react';
import { useCollection } from '@cloudscape-design/collection-hooks';
import Layout from '../components/layout';
import EmptyState from '../components/empty-state';
import { getTextFilterCounterText } from '../utils/text-filter';
import Preferences from '../components/preferences';
import useMyStore from '../store/useStore';
import { fetchPbRecordList, updatePbRecord } from '../utils/api';
import { pbRecordToUseCollectionData } from '../utils/data';
import useData from '../hooks/useData';
import { COLLECTION_NAMES } from '../lib/collections';
import {
  getDefaultPreferences,
  getVisibleContentPreference,
  transformVisibleContentOptionsForPreferences,
} from '../utils/preferences';
import useFlashbar from '../hooks/useFlashbar';

export default function ApplicationsPage() {
  const { pb, applications, setDataInStore, replaceItemInStore } = useMyStore(
    (state) => ({
      pb: state.pb,
      applications: state[COLLECTION_NAMES.APPLICATIONS],
      setDataInStore: state.setDataInStore,
      replaceItemInStore: state.replaceItemInStore,
    }),
  );
  const VISIBLE_CONTENT_OPTIONS = [
    {
      id: 'id',
      label: 'App ID',
      editable: false,
    },
    { id: 'name', label: 'App name', editable: false },
    { id: 'description' },
    { id: 'collectionNames' },
  ];
  /**
   * @type {{
   *   fetched: boolean,
   *   applications: {
   *     collectionNames: string[],
   *     description: string,
   *     id: string,
   *     name: string,
   *     selected: boolean
   *   }[]
   * }}
   */
  const [initialApplications, setInitialApplications] = useState({
    fetched: false,
    applications: [],
  });
  const { FlashbarComponent, setFlasbarItems, generateFlashbarItems } =
    useFlashbar();

  /**
   *
   * @param {{
   *  collectionNames: string,
   *  description: string,
   *  name: string,
   *  id: string,
   *  selected: boolean
   * }} el
   * @returns {{
   *  collectionNames: string[],
   *  description: string,
   *  id: string,
   *  name: string,
   *  selected: boolean
   * }[]}
   */
  const applicationsTransformer = (el) => ({
    name: el.name,
    description: el.description,
    collectionNames: el.collectionNames.split(','),
    id: el.id,
    selected: el.selected,
  });

  const getApplications = async () => {
    const data = await fetchPbRecordList(pb, {
      collectionName: COLLECTION_NAMES.APPLICATIONS,
    });
    if (!data) return;
    if (data.name === 'ClientResponseError 0') return;

    const transformedData = pbRecordToUseCollectionData(
      data,
      applicationsTransformer,
    );

    if (JSON.stringify(transformedData) !== JSON.stringify(applications)) {
      setDataInStore(COLLECTION_NAMES.APPLICATIONS, transformedData);
      setInitialApplications((prev) => {
        if (!prev.fetched) {
          return {
            fetched: true,
            applications: transformedData,
          };
        }
        return prev;
      });
    }
  };
  const { isLoading, hasError, error, refetch } = useData(getApplications);

  // Have not actually tested what an error looks like when fetching data
  useEffect(() => {
    if (hasError) {
      setFlasbarItems([
        generateFlashbarItems({
          header: 'Error fetching applications',
          content: JSON.stringify(error, null, 2),
          type: 'error',
          id: 'fetching',
        }),
      ]);
    }
  }, [error]);

  const [preferences, setPreferences] = useState(
    getDefaultPreferences(
      transformVisibleContentOptionsForPreferences(VISIBLE_CONTENT_OPTIONS),
    ),
  );

  // Currently doing this because the useCollection defaultSelectedItems
  // doesn't work for me for some reason...
  const [selectedApplications, setSelectedApplications] = useState(
    applications.filter((el) => el.selected),
  );
  useEffect(() => {
    setSelectedApplications(applications.filter((el) => el.selected));
  }, [applications]);

  const {
    items,
    actions,
    filteredItemsCount,
    collectionProps,
    filterProps,
    paginationProps,
  } = useCollection(applications, {
    filtering: {
      empty: <EmptyState title="No apps" />,
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

  // Currently just loops through all items and performs an update
  // Can be optimized later
  const updateApplications = async (selectedItems) => {
    items.forEach(async (item) => {
      const data = await updatePbRecord(pb, {
        id: item.id,
        collectionName: COLLECTION_NAMES.APPLICATIONS,
        body: {
          name: item.name,
          description: item.description,
          selected: Boolean(selectedItems.find((el) => el.id === item.id)),
        },
      });
      replaceItemInStore(
        COLLECTION_NAMES.APPLICATIONS,
        applicationsTransformer(data),
      );
    });
  };

  const onSave = async () => {
    await updateApplications(selectedApplications);
  };
  const onReset = async () => {
    await setDataInStore(
      COLLECTION_NAMES.APPLICATIONS,
      initialApplications.applications,
    );
    await updateApplications(initialApplications.applications);
  };
  const onRefresh = async () => {
    await refetch();
  };

  return (
    <Layout
      contentHeader={
        <Header
          variant="h1"
          description={
            <>
              <br />
              <span>
                Enable or disable apps to personalize your dashboard. Choose the
                apps that matter most to you.
              </span>
              <br />
              <br />
              <span>
                Simply toggle apps on or off to create a tailored interface that
                meets your needs.
              </span>
            </>
          }
        >
          App Selection
        </Header>
      }
    >
      <SpaceBetween size="l" direction="vertical">
        <FlashbarComponent />
        {isLoading ? (
          <Spinner />
        ) : (
          <Cards
            {...collectionProps}
            onSelectionChange={({ detail }) =>
              setSelectedApplications(detail.selectedItems)
            }
            selectedItems={selectedApplications}
            ariaLabels={{
              itemSelectionLabel: (e, t) => `- select ${t.name}`,
              selectionGroupLabel: 'Item selection',
            }}
            cardDefinition={{
              header: (item) => item.name,
              sections: [
                {
                  id: 'description',
                  header: 'Description',
                  content: (item) => item.description,
                },
                {
                  id: 'collectionNames',
                  header: 'Collection names',
                  content: (item) => (
                    <SpaceBetween size="xs" direction="horizontal">
                      {item.collectionNames.map((collection) => (
                        <Badge key={collection}>{collection}</Badge>
                      ))}
                    </SpaceBetween>
                  ),
                },
              ],
            }}
            cardsPerRow={[{ cards: 1 }, { minWidth: 500, cards: 2 }]}
            items={items}
            loadingText="Loading apps"
            selectionType="multi"
            trackBy="id"
            visibleSections={preferences.visibleContent}
            filter={
              <TextFilter
                {...filterProps}
                countText={getTextFilterCounterText(Number(filteredItemsCount))}
                filteringAriaLabel="Filter apps"
              />
            }
            header={
              <Header
                counter={
                  selectedApplications?.length
                    ? `${selectedApplications.length}/${items.length}`
                    : `(${items.length})`
                }
                actions={
                  <SpaceBetween size="xs" direction="horizontal">
                    <Button onClick={onRefresh}>
                      <Icon name="refresh" />
                    </Button>
                    <Button onClick={onReset}>Reset</Button>
                    <Button variant="primary" onClick={onSave}>
                      Save
                    </Button>
                  </SpaceBetween>
                }
              >
                Customize your experience
              </Header>
            }
            pagination={<Pagination {...paginationProps} />}
            preferences={
              <Preferences
                preferences={preferences}
                setPreferences={setPreferences}
                visibleContentPreference={getVisibleContentPreference(
                  VISIBLE_CONTENT_OPTIONS,
                )}
                useVisibleContentPreference
              />
            }
          />
        )}
      </SpaceBetween>
    </Layout>
  );
}
