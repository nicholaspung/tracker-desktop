import { Box, SpaceBetween } from '@cloudscape-design/components';
import TableList from '../table-list';
import { convertToDollar } from '../../utils/display';
import { totalSumOfDataAccordingToField } from '../../utils/math';
import {
  SUMMARY_ANALYSIS,
  SUMMARY_ANALYSIS_DISPLAY,
  SUMMARY_ANALYSIS_DISPLAY_FIELDS,
} from '../../lib/summary';
import {
  latestDataAccordingToField,
  sumDataAccordingToFields,
} from '../../utils/analysis';

export function SummaryTableComponent({
  data,
  config,
  label,
  analysis,
  analysisDisplay,
  analysisDisplayFields,
  sumField,
  groupField,
  latestFields,
}) {
  let total;
  let positive;
  let negative;
  let analyzedData = data;

  if (analysis.includes(SUMMARY_ANALYSIS.LATEST)) {
    analyzedData = latestDataAccordingToField(analyzedData, latestFields);
  }

  if (analysis.includes(SUMMARY_ANALYSIS.SUM)) {
    analyzedData = sumDataAccordingToFields(analyzedData, sumField, groupField);
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
      {analysisDisplay === SUMMARY_ANALYSIS_DISPLAY.POSITIVE_NEGATIVE_TOTAL ? (
        <Box>
          {analysisDisplayFields
            ? analysisDisplayFields.map((el) => {
                if (el.type === SUMMARY_ANALYSIS_DISPLAY_FIELDS.POSITIVE) {
                  return (
                    <p key={el.label}>
                      <strong>{el.label}</strong>
                      {convertToDollar(positive)}
                    </p>
                  );
                }
                if (el.type === SUMMARY_ANALYSIS_DISPLAY_FIELDS.NEGATIVE) {
                  return (
                    <p key={el.label}>
                      <strong>{el.label}</strong>
                      {convertToDollar(negative)}
                    </p>
                  );
                }
                if (el.type === SUMMARY_ANALYSIS_DISPLAY_FIELDS.TOTAL) {
                  return (
                    <p key={el.label}>
                      <strong>{el.label}</strong>
                      {convertToDollar(total)}
                    </p>
                  );
                }
                return null;
              })
            : null}
        </Box>
      ) : null}
    </SpaceBetween>
  );
}
