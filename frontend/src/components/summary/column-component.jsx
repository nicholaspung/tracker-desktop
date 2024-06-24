import { ColumnLayout } from '@cloudscape-design/components';
import { SUMMARY_PIECES } from '../../lib/summary';
import { SummaryTableComponent } from './summary-table-component';
import BarChartComponent from './bar-chart-component';
import TableList from '../table-list';

export function ColumnComponent({
  columns,
  variant,
  pieces,
  data,
  config,
  filterOptions,
}) {
  return (
    <ColumnLayout columns={columns} variant={variant}>
      {pieces.map((piece, i) => {
        if (piece.piece === SUMMARY_PIECES.SUMMARY_TABLE) {
          return (
            <SummaryTableComponent
              data={data}
              config={config}
              label={piece.label}
              analysis={piece.analysis}
              sumField={piece.sumField}
              groupField={piece.groupField}
              key={`${i}${piece.piece}`}
            />
          );
        }
        if (piece.piece === SUMMARY_PIECES.SINGLE_BAR_CHART) {
          return (
            <BarChartComponent
              xTitle={piece.xTitle}
              yTitle={piece.yTitle}
              ariaLabel={piece.ariaLabel}
              data={data}
              popoverTitleField={piece.popoverTitleField}
              popoverValueField={piece.popoverValueField}
              filterOptions={filterOptions}
              analysis={piece.analysis}
              sumField={piece.sumField}
              groupField={piece.groupField}
              key={`${i}${piece.piece}`}
            />
          );
        }
        if (piece.piece === SUMMARY_PIECES.FULL_TABLE) {
          return (
            <TableList
              data={data}
              config={piece.config}
              label={piece.label}
              variant="embedded"
              key={`${i}${piece.piece}`}
            />
          );
        }
        return null;
      })}
    </ColumnLayout>
  );
}
