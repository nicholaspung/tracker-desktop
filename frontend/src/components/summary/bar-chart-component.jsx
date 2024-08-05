import { BarChart } from '@cloudscape-design/components';
import { convertToDollar } from '../../utils/display';
import EmptyState from '../empty-state';
import {
  barChartDataAccordingToFields,
  latestDataAccordingToField,
  sumDataAccordingToFields,
} from '../../utils/analysis';
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
  analysis,
  sumField,
  groupField,
  latestFields,
}) {
  let analyzedData = data;

  if (analysis.includes(SUMMARY_ANALYSIS.LATEST)) {
    analyzedData = latestDataAccordingToField(analyzedData, latestFields);
  }

  if (analysis.includes(SUMMARY_ANALYSIS.SUM)) {
    analyzedData = sumDataAccordingToFields(data, sumField, groupField);
  }

  const barChartSeriesData = barChartDataAccordingToFields(
    analyzedData,
    popoverTitleField,
    filterOptions.timeFrame,
    popoverValueField,
    filterOptions.timeFilter,
  );

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
