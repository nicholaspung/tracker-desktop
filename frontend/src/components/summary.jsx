import {
  Button,
  Container,
  Header,
  SpaceBetween,
} from '@cloudscape-design/components';
import { useState } from 'react';
import TableList from './table-list';
import { ALL_OPTION, toOptions } from '../utils/misc';
import { filterDataAccordingtoFilterOptions } from '../utils/analysis';
import useMyStore from '../store/useStore';
import { SUMMARY_FILTERS, SUMMARY_PIECES, TIME_FILTERS } from '../lib/summary';
import { getStoreNamesFromConfigFilters } from '../utils/store';
import { TimeFilter } from './summary/time-filter';
import { SelectFilter } from './summary/select-filter';
import { LAYOUT_PIECES } from '../lib/layout';
import { ColumnComponent } from './summary/column-component';
import MultiSelectFilter from './summary/multiselect-filter';
import { SummaryTableComponent } from './summary/summary-table-component';

export default function Summary({ config }) {
  const storeNames = getStoreNamesFromConfigFilters(config);
  const storeValues = useMyStore((state) => {
    const result = {
      pb: state.pb,
      data: state[config.collection],
      setDataInStore: state.setDataInStore,
    };
    storeNames.forEach((store) => {
      result[store] = state[store];
    });
    return result;
  });

  const INITIAL_FILTER_OPTIONS = config.filters.reduce((acc, curr) => {
    const { filter, id } = curr;
    if (filter === SUMMARY_FILTERS.TIME_FILTER) {
      return { ...acc, timeFilter: toOptions(TIME_FILTERS.MONTH) };
    }
    if (filter === SUMMARY_FILTERS.SELECTION_SINGLE) {
      return { ...acc, [id]: ALL_OPTION };
    }
    if (filter === SUMMARY_FILTERS.SELECTION_MULTIPLE) {
      return { ...acc, [id]: [ALL_OPTION] };
    }
    return acc;
  }, {});

  /**
   * @type {{
   *  timeFilter: { label: string, value: string },
   *  timeFrame: { Date range: string, Month: string, Year: { label: number, value: number } },
   *  x: { label: string, value: string } | { label: string, value: string }[]
   * }}
   */
  const [filterOptions, setFilterOptions] = useState(INITIAL_FILTER_OPTIONS);
  const [currentFilterOptions, setCurrentFilterOptions] = useState(
    INITIAL_FILTER_OPTIONS,
  );

  const onSaveFilter = () => {
    setCurrentFilterOptions(filterOptions);
  };
  const isSameFilter = () => {
    try {
      return (
        JSON.stringify(filterOptions) === JSON.stringify(currentFilterOptions)
      );
    } catch (err) {
      throw new Error('failed in parsing JSON data');
    }
  };

  const filteredData = filterDataAccordingtoFilterOptions(
    storeValues.data,
    config.filters,
    currentFilterOptions,
  );

  return (
    <Container
      header={
        <Header>{`Summary of ${config.label} according to filters`}</Header>
      }
    >
      <SpaceBetween size="xs" direction="vertical">
        <SpaceBetween size="xs" direction="horizontal">
          {config.filters.map((filter, i) => {
            if (filter.filter === SUMMARY_FILTERS.TIME_FILTER) {
              return (
                <TimeFilter
                  data={storeValues.data}
                  exclude={filter.exclude}
                  filterOptions={filterOptions}
                  setFilterOptions={setFilterOptions}
                  setCurrentFilterOptions={setCurrentFilterOptions}
                  key={`${i}${filter.filter}`}
                />
              );
            }
            if (filter.filter === SUMMARY_FILTERS.SELECTION_SINGLE) {
              return (
                <SelectFilter
                  label={filter.label}
                  data={storeValues[filter.store]}
                  optionField={filter.optionField}
                  id={filter.id}
                  initialValue={filterOptions[filter.id]}
                  setFilterOptions={setFilterOptions}
                  key={`${i}${filter.filter}`}
                />
              );
            }
            if (filter.filter === SUMMARY_FILTERS.SELECTION_MULTIPLE) {
              return (
                <MultiSelectFilter
                  label={filter.label}
                  data={storeValues[filter.store]}
                  optionField={filter.optionField}
                  id={filter.id}
                  initialValue={filterOptions[filter.id]}
                  setFilterOptions={setFilterOptions}
                  key={`${i}${filter.filter}`}
                />
              );
            }
            return null;
          })}
        </SpaceBetween>
        <Button
          onClick={onSaveFilter}
          variant="primary"
          disabled={isSameFilter()}
        >
          Save filters
        </Button>
        <hr />
        {config.components.map((component, i) => {
          if (component.layout) {
            if (component.layout === LAYOUT_PIECES.COLUMNS) {
              return (
                <ColumnComponent
                  columns={component.columns}
                  variant={component.variant}
                  pieces={component.pieces}
                  data={filteredData}
                  config={config}
                  filterOptions={currentFilterOptions}
                  key={`${i}${component.layout}`}
                />
              );
            }
            if (component.layout === LAYOUT_PIECES.HORIZONTAL_LINE) {
              return <hr key={`${i}${component.layout}`} />;
            }
          }
          if (component.piece) {
            if (component.piece === SUMMARY_PIECES.FULL_TABLE) {
              return (
                <TableList
                  data={filteredData}
                  config={component.config}
                  label={component.label}
                  variant="embedded"
                  analysis={component.analysis}
                  latestFields={component.latestFields}
                  key={`${i}${component.layout || component.piece}`}
                />
              );
            }
            if (component.piece === SUMMARY_PIECES.SUMMARY_TABLE) {
              return (
                <SummaryTableComponent
                  data={filteredData}
                  config={config}
                  label={component.label}
                  analysis={component.analysis}
                  analysisDisplay={component.analysisDisplay}
                  analysisDisplayFields={component.analysisDisplayFields}
                  sumField={component.sumField}
                  groupFields={component.groupFields}
                  latestFields={component.latestFields}
                  key={`${i}${component.piece}`}
                />
              );
            }
          }
          return null;
        })}
      </SpaceBetween>
    </Container>
  );
}
