import { Box, SpaceBetween } from '@cloudscape-design/components';
import { useMemo } from 'react';
import TableList from '../table-list';
import { convertToDollar } from '../../utils/display';
import {
  SUMMARY_ANALYSIS_DISPLAY,
  SUMMARY_ANALYSIS_DISPLAY_FIELDS,
} from '../../lib/summary';
import { getOverallDataAnalysis } from '../../utils/analysis';

export function SummaryTableComponent({
  data,
  config,
  label,
  analysis = [],
  analysisDisplay,
  analysisDisplayFields,
  sumField,
  groupFields,
  latestFields,
  dateField,
  filterOptions,
}) {
  const { analyzedData, total, positive, negative } = useMemo(
    () =>
      getOverallDataAnalysis(data, analysis, filterOptions, {
        sumField,
        groupFields,
        latestFields,
        dateField,
        analysisDisplayFields,
      }),
    [data, filterOptions],
  );

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
      {analysisDisplay === SUMMARY_ANALYSIS_DISPLAY.POSITIVE_NEGATIVE_TOTAL ? (
        <>
          <hr />
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
        </>
      ) : null}
    </SpaceBetween>
  );
}
