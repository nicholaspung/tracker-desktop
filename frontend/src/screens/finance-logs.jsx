import {
  BarChart,
  Box,
  Button,
  ColumnLayout,
  Container,
  DatePicker,
  FormField,
  Header,
  Select,
  SpaceBetween,
  Tabs,
} from '@cloudscape-design/components';
import { useState } from 'react';
import TableList from '../components/table-list';
import {
  CONFIG_CUSTOM_FINANCE_SUMMARY,
  CONFIG_FINANCES_CATEGORY,
  CONFIG_FINANCES_LOG,
  CONFIG_FINANCES_TAG,
} from '../lib/config';
import { ALL_OPTION, toOptions } from '../utils/misc';
import { convertToDollar } from '../utils/display';
import EmptyState from '../components/empty-state';
import { COLLECTION_NAMES } from '../lib/collections';
import useMyStore from '../store/useStore';
import { getListData } from '../utils/data';
import useData from '../hooks/useData';
import { dateToDatePickerMonth } from '../utils/date';
import {
  barChartDataAccordingToFields,
  filterDataAccordingToField,
  filterDataAccordingToPbDate,
  sumDataAccordingToFields,
} from '../utils/analysis';
import { totalSumOfDataAccordingToField } from '../utils/math';

export default function FinanceLogs() {
  const { pb, financesLog, setDataInStore, financesCategory, financesTag } =
    useMyStore((state) => ({
      pb: state.pb,
      financesLog: state[COLLECTION_NAMES.FINANCES_LOG],
      setDataInStore: state.setDataInStore,
      financesCategory: state[COLLECTION_NAMES.FINANCES_CATEGORY],
      financesTag: state[COLLECTION_NAMES.FINANCES_TAG],
    }));

  const getFinancesLog = async () => {
    getListData(pb, CONFIG_FINANCES_LOG, {
      prevData: financesLog,
      setDataInStore,
    });
  };
  const { isLoading: flIsLoading, refetch: flRefetch } =
    useData(getFinancesLog);

  const getFinancesCategory = async () => {
    getListData(pb, CONFIG_FINANCES_CATEGORY, {
      prevData: financesCategory,
      setDataInStore,
    });
  };
  const { refetch: fcRefetch, isLoading: fcLoading } =
    useData(getFinancesCategory);

  const getFinancesTag = async () => {
    getListData(pb, CONFIG_FINANCES_TAG, {
      prevData: financesTag,
      setDataInStore,
    });
  };
  const { refetch: ftRefetch, isLoading: ftLoading } = useData(getFinancesTag);

  const [timeFrame, setTimeFrame] = useState(dateToDatePickerMonth());
  const [category, setCategory] = useState(ALL_OPTION);
  const [tag, setTag] = useState(ALL_OPTION);

  const initialFilterOptions = {
    timeFrame,
    category,
    tag,
  };
  const [filterOptions, setFilterOptions] = useState(initialFilterOptions);

  const onSaveFilter = () => {
    setFilterOptions({ timeFrame, category, tag });
  };
  const isSameFilter = () =>
    filterOptions.timeFrame === timeFrame &&
    filterOptions.category === category &&
    filterOptions.tag === tag;

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
                data={financesLog}
                columns={CONFIG_FINANCES_LOG.columns}
                label="All Finance Logs"
                isLoading={flIsLoading}
                refetch={flRefetch}
                variant="embedded"
              />
            ),
          },
          {
            label: 'Categories',
            id: 'categories',
            content: (
              <TableList
                data={financesCategory}
                columns={CONFIG_FINANCES_CATEGORY.columns}
                label="All Finance Categories"
                isLoading={fcLoading}
                refetch={fcRefetch}
                variant="embedded"
              />
            ),
          },
          {
            label: 'Tags',
            id: 'tags',
            content: (
              <TableList
                data={financesTag}
                columns={CONFIG_FINANCES_TAG.columns}
                label="All Finance Tags"
                isLoading={ftLoading}
                refetch={ftRefetch}
                variant="embedded"
              />
            ),
          },
        ]}
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
  );
}
