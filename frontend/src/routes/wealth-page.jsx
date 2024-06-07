import {
  BarChart,
  Box,
  Button,
  ColumnLayout,
  Container,
  DatePicker,
  FormField,
  Header,
  HelpPanel,
  Select,
  SpaceBetween,
} from '@cloudscape-design/components';
import { useEffect, useState } from 'react';
import Layout from '../components/layout';
import useMyStore from '../store/useStore';
import { COLLECTION_NAMES } from '../lib/collections';
import {
  filterDataAccordingToPbDate,
  filterDataAccordingToField,
  getListData,
  sumDataAccordingToFields,
  barChartDataAccordingToFields,
} from '../utils/data';
import useData from '../hooks/useData';
import TableList from '../components/table-list';
import {
  CONFIG_CUSTOM_FINANCE_SUMMARY,
  CONFIG_FINANCES_CATEGORY,
  CONFIG_FINANCES_LOG,
  CONFIG_FINANCES_TAG,
} from '../lib/config';
import { ALL_OPTION, toOptions } from '../utils/misc';
import { dateToDatePickerMonth } from '../utils/date';
import { convertToDollar } from '../utils/display';
import EmptyState from '../components/empty-state';
import { totalSumOfDataAccordingToField } from '../utils/math';
import AddItemButtonModal from '../components/add-item-button-modal';

export default function WealthPage() {
  const { pb, financesLog, setDataInStore, financesCategory, financesTag } =
    useMyStore((state) => ({
      pb: state.pb,
      financesLog: state[COLLECTION_NAMES.FINANCES_LOG],
      setDataInStore: state.setDataInStore,
      financesCategory: state[COLLECTION_NAMES.FINANCES_CATEGORY],
      financesTag: state[COLLECTION_NAMES.FINANCES_TAG],
    }));

  function HelpContent() {
    return (
      <HelpPanel header={<h2>Overview</h2>}>
        <SpaceBetween size="xs" direction="vertical" alignItems="center">
          <h4>Actions</h4>
          <AddItemButtonModal
            config={CONFIG_FINANCES_LOG}
            label="Add new log"
          />
          <AddItemButtonModal
            config={CONFIG_FINANCES_CATEGORY}
            label="Add new category"
          />
          <AddItemButtonModal
            config={CONFIG_FINANCES_TAG}
            label="Add new tag"
          />
        </SpaceBetween>
        <hr />
      </HelpPanel>
    );
  }

  useEffect(() => {
    setDataInStore('HelpContent', HelpContent);
  }, []);

  const getFinancesLog = async () => {
    getListData(
      pb,
      CONFIG_FINANCES_LOG.collection,
      CONFIG_FINANCES_LOG.columns,
      {
        prevData: financesLog,
        setData: setDataInStore,
      },
    );
  };
  const { isLoading: flIsLoading, refetch: flRefetch } =
    useData(getFinancesLog);

  const getFinancesCategory = async () => {
    getListData(
      pb,
      CONFIG_FINANCES_CATEGORY.collection,
      CONFIG_FINANCES_CATEGORY.columns,
      {
        prevData: financesCategory,
        setData: setDataInStore,
      },
    );
  };
  const { refetch: fcRefetch } = useData(getFinancesCategory);

  const getFinancesTag = async () => {
    getListData(
      pb,
      CONFIG_FINANCES_TAG.collection,
      CONFIG_FINANCES_TAG.columns,
      {
        prevData: financesTag,
        setData: setDataInStore,
      },
    );
  };
  const { refetch: ftRefetch } = useData(getFinancesTag);

  const [timeFrame, setTimeFrame] = useState(dateToDatePickerMonth());
  const [category, setCategory] = useState(ALL_OPTION);
  const [tag, setTag] = useState(ALL_OPTION);

  const initialFilterOptions = {
    timeFrame,
    category,
    tag,
  };
  const [filterOptions, setFilterOptions] = useState(initialFilterOptions);

  const dateFiltered = filterDataAccordingToPbDate(
    financesLog,
    new Date(filterOptions.timeFrame),
  );
  const categoryFiltered = filterDataAccordingToField(
    dateFiltered,
    'category',
    filterOptions.category,
  );
  const tagFiltered = filterDataAccordingToField(
    categoryFiltered,
    'tags',
    filterOptions.tag,
  );

  const categorySummed = sumDataAccordingToFields(
    tagFiltered,
    'amount',
    'category',
  );
  const barChartSeriesCategorySummed = barChartDataAccordingToFields(
    categorySummed,
    'category',
    timeFrame,
    'amount',
  );

  const { total, positive, negative } = totalSumOfDataAccordingToField(
    categorySummed,
    'amount',
  );

  const onSaveFilter = () => {
    setFilterOptions({ timeFrame, category, tag });
  };
  const isSameFilter = () =>
    filterOptions.timeFrame === timeFrame &&
    filterOptions.category === category &&
    filterOptions.tag === tag;

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
      <SpaceBetween size="xs" direction="vertical">
        <TableList
          data={financesLog}
          columns={CONFIG_FINANCES_LOG.columns}
          label="All Finance Logs"
          isLoading={flIsLoading}
          refetch={flRefetch}
        />
        <Container
          header={<Header>Summary of Finance Logs according to filters</Header>}
        >
          <SpaceBetween size="xs" direction="vertical">
            <SpaceBetween size="xs" direction="horizontal">
              <FormField label="Select month">
                <DatePicker
                  granularity="month"
                  placeholder="YYYY/MM"
                  value={timeFrame}
                  onChange={({ detail }) => setTimeFrame(detail.value)}
                  isDateEnabled={(date) => date <= new Date()}
                  openCalendarAriaLabel={(selectedDate) =>
                    `Choose time period${
                      selectedDate ? `, selected period is ${selectedDate}` : ''
                    }`
                  }
                />
              </FormField>
              <FormField label="Select category">
                <Select
                  selectedOption={category}
                  options={[
                    ALL_OPTION,
                    ...toOptions(financesCategory, 'category'),
                  ]}
                  onLoadItems={fcRefetch}
                  onChange={({ detail }) => setCategory(detail.selectedOption)}
                />
              </FormField>
              <FormField label="Select tag">
                <Select
                  selectedOption={tag}
                  options={[ALL_OPTION, ...toOptions(financesTag, 'tag')]}
                  onLoadItems={ftRefetch}
                  onChange={({ detail }) => setTag(detail.selectedOption)}
                />
              </FormField>
            </SpaceBetween>

            <Button
              onClick={onSaveFilter}
              variant="primary"
              disabled={isSameFilter()}
            >
              Save filters
            </Button>
            <hr />
            <ColumnLayout columns={2} variant="text-grid">
              <SpaceBetween size="xs" direction="vertical">
                <TableList
                  data={categorySummed}
                  columns={CONFIG_CUSTOM_FINANCE_SUMMARY.columns}
                  label="Category sums"
                  hidePagination
                  hidePreferences
                  hideFilter
                  variant="embedded"
                />
                <Box>
                  <hr />
                  <p>
                    <strong>Income + Cash: </strong>
                    {convertToDollar(positive)}
                  </p>
                  <p>
                    <strong>Spend: </strong>
                    {convertToDollar(negative)}
                  </p>
                  <hr />
                  <p>
                    <strong>Total: </strong>
                    {convertToDollar(total)}
                  </p>
                </Box>
              </SpaceBetween>
              <BarChart
                series={barChartSeriesCategorySummed}
                xDomain={[timeFrame]}
                i18nStrings={{}}
                detailPopoverSeriesContent={({ series, y }) => ({
                  key: series.title,
                  value: convertToDollar(y),
                })}
                ariaLabel="Summary of category chart"
                stackedBars
                xTickFormatter={(d) =>
                  new Date(d).toLocaleDateString('en-US', {
                    month: 'short',
                    year: 'numeric',
                  })
                }
                height={300}
                yTickFormatter={(d) => convertToDollar(d)}
                xTitle="Month"
                yTitle="Amount"
                empty={<EmptyState title="No data available" />}
                noMatch={<EmptyState title="No matching data" />}
              />
            </ColumnLayout>
            <hr />
            <TableList
              data={tagFiltered}
              columns={CONFIG_FINANCES_LOG.columns}
              label="Finance Logs - filtered"
              variant="embedded"
            />
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </Layout>
  );
}
