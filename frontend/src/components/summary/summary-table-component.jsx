import { Box, SpaceBetween } from '@cloudscape-design/components';
import TableList from '../table-list';
import { convertToDollar } from '../../utils/display';
import { totalSumOfDataAccordingToField } from '../../utils/math';
import { SUMMARY_ANALYSIS } from '../../lib/summary';
import { sumDataAccordingToFields } from '../../utils/analysis';

export function SummaryTableComponent({
  data,
  config,
  label,
  analysis,
  sumField,
  groupField,
}) {
  let total;
  let positive;
  let negative;
  let analyzedData = data;

  if (analysis === SUMMARY_ANALYSIS.SUM) {
    analyzedData = sumDataAccordingToFields(data, sumField, groupField);
    const totalSum = totalSumOfDataAccordingToField(analyzedData, sumField);
    total = totalSum.total;
    positive = totalSum.positive;
    negative = totalSum.negative;
  }

  return (
    <SpaceBetween size="xs" direction="vertical">
      <TableList
        data={analyzedData}
        config={config}
        label={label}
        hidePreferences
        hideFilter
        variant="embedded"
      />
      <hr />
      {analysis === SUMMARY_ANALYSIS.SUM ? (
        <Box>
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
      ) : null}
    </SpaceBetween>
  );
}
