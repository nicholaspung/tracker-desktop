import {
  BarChart,
  Box,
  Button,
  ColumnLayout,
  Container,
  DatePicker,
  DateRangePicker,
  FormField,
  Header,
  Select,
  SpaceBetween,
} from '@cloudscape-design/components';
import { useState } from 'react';
import TableList from '../components/table-list';
import { convertToDollar } from '../utils/display';
import {
  CONFIG_CUSTOM_FINANCE_SUMMARY,
  CONFIG_FINANCES_CATEGORY,
  CONFIG_FINANCES_LOG,
  CONFIG_FINANCES_TAG,
} from '../lib/config';
import { ALL_OPTION, toOptions } from '../utils/misc';
import {
  dateToDatePickerMonth,
  generateYearArrayFromYearToThisYear,
  getFirstMonthAndYearFromData,
  isDateEnabled,
  isValidRange,
} from '../utils/date';
import {
  filterDataAccordingToField,
  filterDataAccordingToPbDate,
  barChartDataAccordingToFields,
  sumDataAccordingToFields,
} from '../utils/analysis';
import { totalSumOfDataAccordingToField } from '../utils/math';
import { getListData } from '../utils/data';
import useMyStore from '../store/useStore';
import { COLLECTION_NAMES } from '../lib/collections';
import useData from '../hooks/useData';
import { TIME_FILTERS } from '../lib/summary';
import EmptyState from '../components/empty-state';

export default function FinanceLogsSummary() {
  const { pb, financesLog, setDataInStore, financesCategory, financesTag } =
    useMyStore((state) => ({
      pb: state.pb,
      financesLog: state[COLLECTION_NAMES.FINANCES_LOG],
      setDataInStore: state.setDataInStore,
      financesCategory: state[COLLECTION_NAMES.FINANCES_CATEGORY],
      financesTag: state[COLLECTION_NAMES.FINANCES_TAG],
    }));

  const getFinancesCategory = async () => {
    getListData(pb, CONFIG_FINANCES_CATEGORY, {
      prevData: financesCategory,
      setDataInStore,
    });
  };
  const { refetch: fcRefetch } = useData(getFinancesCategory);

  const getFinancesTag = async () => {
    getListData(pb, CONFIG_FINANCES_TAG, {
      prevData: financesTag,
      setDataInStore,
    });
  };
  const { refetch: ftRefetch } = useData(getFinancesTag);

  const { firstYear, firstMonth, firstDay } = getFirstMonthAndYearFromData(
    financesLog,
    'date',
  );
  const YEAR_OPTIONS = toOptions(
    generateYearArrayFromYearToThisYear(firstYear),
  );
  const initialTimeFrame = {
    [TIME_FILTERS.YEAR]: YEAR_OPTIONS[YEAR_OPTIONS.length - 1],
    [TIME_FILTERS.MONTH]: dateToDatePickerMonth(),
    [TIME_FILTERS.DATE_RANGE]: undefined,
  };
  const [timeFrame, setTimeFrame] = useState(initialTimeFrame);
  const [category, setCategory] = useState(ALL_OPTION);
  const [tag, setTag] = useState(ALL_OPTION);

  const TIME_FILTERS_OPTIONS = toOptions(
    Object.keys(TIME_FILTERS).map((el) => TIME_FILTERS[el]),
  );
  const [timeFilter, setTimeFilter] = useState(TIME_FILTERS_OPTIONS[1]);

  const initialFilterOptions = {
    timeFrame,
    category,
    tag,
    timeFilter,
  };
  const [filterOptions, setFilterOptions] = useState(initialFilterOptions);

  const onSaveFilter = () => {
    setFilterOptions({ timeFrame, category, tag, timeFilter });
  };
  const isSameFilter = () =>
    filterOptions.timeFrame === timeFrame &&
    filterOptions.category === category &&
    filterOptions.tag === tag &&
    filterOptions.timeFilter === timeFilter;

  const dateFiltered = filterDataAccordingToPbDate(
    financesLog,
    filterOptions.timeFilter,
    filterOptions.timeFrame,
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
    filterOptions.timeFrame,
    'amount',
    filterOptions.timeFilter,
  );

  const { total, positive, negative } = totalSumOfDataAccordingToField(
    categorySummed,
    'amount',
  );

  return (
    <Container
      header={<Header>Summary of Finance Logs according to filters</Header>}
    >
      <SpaceBetween size="xs" direction="vertical">
        <SpaceBetween size="xs" direction="horizontal">
          <FormField label="Select time filter">
            <Select
              options={TIME_FILTERS_OPTIONS}
              selectedOption={timeFilter}
              onChange={({ detail }) => setTimeFilter(detail.selectedOption)}
            />
          </FormField>
          {timeFilter.value === TIME_FILTERS.YEAR ? (
            <FormField label="Select year">
              <Select
                options={YEAR_OPTIONS}
                selectedOption={timeFrame[TIME_FILTERS.YEAR]}
                onChange={({ detail }) =>
                  setTimeFrame((prev) => ({
                    ...prev,
                    [TIME_FILTERS.YEAR]: detail.selectedOption,
                  }))
                }
              />
            </FormField>
          ) : null}
          {timeFilter.value === TIME_FILTERS.MONTH ? (
            <FormField label="Select month">
              <DatePicker
                granularity="month"
                placeholder="YYYY/MM"
                value={timeFrame[TIME_FILTERS.MONTH]}
                onChange={({ detail }) =>
                  setTimeFrame((prev) => ({
                    ...prev,
                    [TIME_FILTERS.MONTH]: detail.value,
                  }))
                }
                isDateEnabled={(date) =>
                  isDateEnabled(date, { year: firstYear, month: firstMonth })
                }
                openCalendarAriaLabel={(selectedDate) =>
                  `Choose time period${
                    selectedDate ? `, selected period is ${selectedDate}` : ''
                  }`
                }
              />
            </FormField>
          ) : null}
          {timeFilter.value === TIME_FILTERS.DATE_RANGE ? (
            <FormField label="Select date range">
              <DateRangePicker
                dateOnly
                rangeSelectorMode="absolute-only"
                absoluteFormat="long-localized"
                value={timeFrame[TIME_FILTERS.DATE_RANGE]}
                onChange={({ detail }) =>
                  setTimeFrame((prev) => ({
                    ...prev,
                    [TIME_FILTERS.DATE_RANGE]: detail.value,
                  }))
                }
                placeholder="Filter by date range"
                isValidRange={(value) =>
                  isValidRange({
                    startDate: value.startDate,
                    endDate: value.endDate,
                    year: firstYear,
                    month: firstMonth,
                    day: firstDay,
                  })
                }
                isDateEnabled={(date) =>
                  isDateEnabled(date, { year: firstYear, month: firstMonth })
                }
              />
            </FormField>
          ) : null}
          <FormField label="Select category">
            <Select
              selectedOption={category}
              options={[ALL_OPTION, ...toOptions(financesCategory, 'category')]}
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
            i18nStrings={{}}
            detailPopoverSeriesContent={({ series, y }) => ({
              key: series.title,
              value: convertToDollar(y),
            })}
            ariaLabel="Summary of category chart"
            stackedBars
            xTickFormatter={(d) => d}
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
  );
}
