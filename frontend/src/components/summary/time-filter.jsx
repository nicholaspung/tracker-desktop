import {
  DatePicker,
  DateRangePicker,
  FormField,
  Select,
  SpaceBetween,
} from '@cloudscape-design/components';
import { useEffect, useState } from 'react';
import { TIME_FILTERS } from '../../lib/summary';
import {
  dateToDatePickerMonth,
  generateYearArrayFromYearToThisYear,
  getFirstMonthAndYearFromData,
  isDateEnabled,
  isValidRange,
} from '../../utils/date';
import { toOptions } from '../../utils/misc';

export function TimeFilter({
  data,
  exclude,
  filterOptions,
  setFilterOptions,
  setCurrentFilterOptions,
}) {
  const { firstYear, firstMonth, firstDay } = getFirstMonthAndYearFromData(
    data,
    'date',
  );

  const YEAR_OPTIONS = toOptions(
    generateYearArrayFromYearToThisYear(firstYear),
  );

  const TIME_FILTERS_OPTIONS = toOptions(
    Object.keys(TIME_FILTERS)
      .filter((key) => !exclude.includes(TIME_FILTERS[key]))
      .map((el) => TIME_FILTERS[el]),
  );

  const initialTimeFrame = {
    [TIME_FILTERS.YEAR]: YEAR_OPTIONS[YEAR_OPTIONS.length - 1],
    [TIME_FILTERS.MONTH]: dateToDatePickerMonth(),
    [TIME_FILTERS.DATE_RANGE]: undefined,
  };

  const [timeFrame, setTimeFrame] = useState(initialTimeFrame);
  const [timeFilter, setTimeFilter] = useState(filterOptions.timeFilter);

  // Side effect used initially load filter options at a higher component
  useEffect(() => {
    setFilterOptions((prev) => ({ ...prev, timeFrame }));
    setCurrentFilterOptions((prev) => ({ ...prev, timeFrame }));
  }, []);

  useEffect(() => {
    setFilterOptions((prev) => ({ ...prev, timeFrame }));
  }, [timeFrame]);

  useEffect(() => {
    setFilterOptions((prev) => ({ ...prev, timeFilter }));
  }, [timeFilter]);

  return (
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
              isDateEnabled(date, {
                year: firstYear,
                month: firstMonth,
              })
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
              isDateEnabled(date, {
                year: firstYear,
                month: firstMonth,
              })
            }
          />
        </FormField>
      ) : null}
    </SpaceBetween>
  );
}
