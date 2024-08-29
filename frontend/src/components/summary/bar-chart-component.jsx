import { BarChart } from '@cloudscape-design/components';
import { useMemo } from 'react';
import { convertToDollar } from '../../utils/display';
import EmptyState from '../empty-state';
import {
  singleBarChartDataAccordingToFields,
  getOverallDataAnalysis,
  multipleBarChartDataAccordingToFields,
} from '../../utils/analysis';
import { SELECT_TYPES } from '../../lib/display';
import { SUMMARY_ANALYSIS } from '../../lib/summary';

// Right now only works for financial graphs in USD
export default function BarChartComponent({
  xTitle,
  yTitle,
  ariaLabel,
  data,
  popoverTitleField,
  popoverValueField,
  filterOptions,
  analysis = [],
  analysisDisplay,
  sumField,
  groupFields,
  latestFields,
  dateField,
  type,
}) {
  const { analyzedData } = useMemo(
    () =>
      getOverallDataAnalysis(data, analysis, filterOptions, {
        sumField,
        groupFields,
        latestFields,
        dateField,
      }),
    [data, filterOptions],
  );

  let barChartSeriesData;
  if (type === SELECT_TYPES.SINGLE) {
    barChartSeriesData = singleBarChartDataAccordingToFields(
      analyzedData,
      popoverTitleField,
      filterOptions.timeFrame,
      popoverValueField,
      filterOptions.timeFilter,
    );
  } else if (
    type === SELECT_TYPES.MULTIPLE &&
    analysis.includes(SUMMARY_ANALYSIS.GROUP)
  ) {
    barChartSeriesData = multipleBarChartDataAccordingToFields(
      analyzedData,
      popoverTitleField,
      popoverValueField,
      dateField,
      filterOptions.timeFilter,
      analysisDisplay,
      sumField,
    );
  }

  return (
    <BarChart
      series={barChartSeriesData}
      i18nStrings={{}}
      detailPopoverSeriesContent={({ series, y }) => ({
        key: series.title,
        value: convertToDollar(y),
      })}
      ariaLabel={ariaLabel}
      stackedBars
      xTickFormatter={(d) => d}
      height={300}
      yTickFormatter={(d) => convertToDollar(d)}
      xTitle={xTitle}
      yTitle={yTitle}
      empty={<EmptyState title="No data available" />}
      noMatch={<EmptyState title="No matching data" />}
    />
  );
}
