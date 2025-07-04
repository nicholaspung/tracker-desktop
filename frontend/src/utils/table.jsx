import {
  Autosuggest,
  Badge,
  DatePicker,
  Input,
  Link,
  Multiselect,
  Select,
  SpaceBetween,
} from '@cloudscape-design/components';
import { SELECT_TYPES, TABLE_DISPLAY_TYPES } from '../lib/display';
import {
  convertToDollar,
  convertToTitleCase,
  decimalToPercentage,
} from './display';
import { toOptions } from './misc';
import { SELECT_BOOL_OPTIONS } from '../lib/forms';
import { getAutoSuggestDataFromColumn, getStoreValueFromConfig } from './forms';
import { cloudscapeDateToCorrectDateValue, pbDateToDisplay } from './date';
import { POCKETBASE_URL } from '../lib/api';

/**
 *
 * @param {{
 *  id: string,
 *  visible?: boolean
 * }[]} columns
 * @returns {{
 *  id: string,
 *  visible: boolean
 * }[]}
 */
export const getColumnDisplay = (columns) =>
  columns.map((el) => ({
    id: el.id,
    visible: Object.keys(el).includes('visible') ? el.visible : true,
  }));

export const removeDuplicatesAccordingToFields = (store, storeFields) => {
  const items = new Set();

  store.forEach((item) => {
    const obj = {};
    storeFields.forEach((field) => {
      obj[field] = item[field];
    });
    if (!items.has(obj)) {
      items.add(JSON.stringify(obj));
    }
  });

  return Array.from(items).map((el) => JSON.parse(el));
};

// TABLE_DISPLAY_TYPES DONE
// DATE, TEXT does autosuggest, CURRENCY, BOOL, BADGE, NUMBER, PERCENTAGE, FILE
export const fieldEditorSelector = ({
  currentValue,
  setValue,
  column,
  storeValue,
}) => {
  if (column.type === TABLE_DISPLAY_TYPES.DATE) {
    return (
      <DatePicker
        onChange={({ detail }) =>
          setValue(cloudscapeDateToCorrectDateValue(detail.value), column)
        }
        value={pbDateToDisplay(currentValue)}
        openCalendarAriaLabel={(selectedDate) =>
          `Choose date${
            selectedDate ? `, selected date is ${selectedDate}` : ''
          }`
        }
        i18nStrings={{
          nextMonthAriaLabel: 'Next month',
          previousMonthAriaLabel: 'Previous month',
          todayAriaLabel: 'Today',
        }}
        placeholder="YYYY/MM/DD"
        expandToViewport
      />
    );
  }
  if (column.type === TABLE_DISPLAY_TYPES.AUTOSUGGEST) {
    const data = getAutoSuggestDataFromColumn(storeValue, column);
    return (
      <Autosuggest
        autoFocus
        expandToViewport
        onChange={({ detail }) => setValue(detail.value, column)}
        onSelect={({ detail }) => {
          if (detail.selectedOption) {
            const updatedValue = { [column.id]: detail.selectedOption.value };
            detail.selectedOption.filteringTags.forEach((col, index) => {
              updatedValue[col] = detail.selectedOption.tags[index];
            });
            setValue(JSON.stringify(updatedValue));
          }
        }}
        value={currentValue}
        options={data}
        enteredTextLabel={(value) => `Use: "${value}"`}
        ariaLabel="Autosuggest example with suggestions"
        placeholder="Enter value"
        empty="No matches found"
      />
    );
  }
  if (
    column.type === TABLE_DISPLAY_TYPES.DOLLAR ||
    column.type === TABLE_DISPLAY_TYPES.NUMBER ||
    column.type === TABLE_DISPLAY_TYPES.TEXT ||
    column.type === TABLE_DISPLAY_TYPES.PERCENTAGE
  ) {
    return (
      <Input
        onChange={({ detail }) => setValue(detail.value, column)}
        value={currentValue}
        type="number"
        placeholder="Enter number"
      />
    );
  }
  if (column.type === TABLE_DISPLAY_TYPES.BOOL) {
    return (
      <Select
        autoFocus
        expandToViewport
        selectedOption={
          SELECT_BOOL_OPTIONS.find((option) => option.value === currentValue) ??
          null
        }
        onChange={({ detail }) => setValue(detail.selectedOption.value, column)}
        options={SELECT_BOOL_OPTIONS}
        selectedAriaLabel="Selected"
      />
    );
  }
  if (column.type === TABLE_DISPLAY_TYPES.BADGE) {
    const data = toOptions(
      storeValue,
      column.storeField ? column.storeField : column.id,
    );
    if (column.selectType === SELECT_TYPES.SINGLE) {
      return (
        <Select
          autoFocus
          expandToViewport
          selectedOption={
            data.find((option) => option.value === currentValue) ?? null
          }
          onChange={({ detail }) =>
            setValue(detail.selectedOption.value, column)
          }
          options={data}
          selectedAriaLabel="Selected"
          placeholder="Choose option"
        />
      );
    }
    if (column.selectType === SELECT_TYPES.MULTIPLE) {
      let latestCurrentValue = currentValue;
      if (!currentValue) {
        latestCurrentValue = [];
      }
      if (typeof latestCurrentValue[0] !== 'object') {
        latestCurrentValue = latestCurrentValue.map((el) => ({
          label: el,
          value: el,
        }));
      }
      // note: when loading, this component portion won't render nicely because
      // multiselect component won't allow expandToViewport to work correctly
      return (
        <Multiselect
          autoFocus
          selectedOptions={latestCurrentValue}
          hideTokens
          expandToViewport
          keepOpen
          onChange={({ detail }) => setValue(detail.selectedOptions, column)}
          deselectAriaLabel={(e) => `Remove ${e.label}`}
          options={data}
          placeholder="Choose options"
          selectedAriaLabel="Selected"
        />
      );
    }
  }
  return null;
};

const columnCell = (el, item) => {
  switch (el.type) {
    case TABLE_DISPLAY_TYPES.DATE:
      return pbDateToDisplay(item[el.id]);
    case TABLE_DISPLAY_TYPES.DOLLAR:
      return convertToDollar(item[el.id]);
    case TABLE_DISPLAY_TYPES.PERCENTAGE:
      return decimalToPercentage(item[el.id]);
    case TABLE_DISPLAY_TYPES.BADGE:
      if (Array.isArray(item[el.id])) {
        return (
          <SpaceBetween size="xs" direction="horizontal">
            {item[el.id].sort().map((ele) => (
              <Badge key={ele}>{ele}</Badge>
            ))}
          </SpaceBetween>
        );
      }
      return <Badge>{item[el.id]}</Badge>;
    case TABLE_DISPLAY_TYPES.FILE:
      const API_URL = `${POCKETBASE_URL}/api/files/${item.collectionId}/${item.id}/`;
      if (Array.isArray(item[el.id])) {
        return (
          <SpaceBetween size="xs" direction="horizontal">
            {item[el.id].sort().map((ele) => (
              <Link
                href={`${API_URL}${ele}?download=1`}
                variant="primary"
                key={ele}
              >
                {ele}
              </Link>
            ))}
          </SpaceBetween>
        );
      }
      const FILE_API_URL = `${API_URL}${item[el.id][0]}`;
      return (
        <Link href={`${FILE_API_URL}?download=1`} variant="primary">
          {item[el.id]}
        </Link>
      );
    case TABLE_DISPLAY_TYPES.TEXT:
    case TABLE_DISPLAY_TYPES.AUTOSUGGEST:
    case TABLE_DISPLAY_TYPES.NUMBER:
    default:
      return item[el.id];
  }
};

/**
 *
 * @param {{
 *  id: string
 * }[]} columns
 * @returns {{
 *  id: string,
 *  header: string,
 *  cell: function,
 *  sortingField: string
 * }[]}
 */
export const getColumnDefinitions = (columns) =>
  columns.map((el) => ({
    id: el.id,
    header: convertToTitleCase(el.id),
    cell: (item) => columnCell(el, item),
    sortingField: el.id,
  }));

/**
 *
 * @param {{
 *  id: string
 * }[]} columns
 * @returns {{
 *  id: string,
 *  header: string,
 *  cell: function,
 *  sortingField: string
 *  editConfig: function
 * }[]}
 */
export const getColumnDefinitionsForEdits = (config, storeValues) =>
  config.columns.map((el) => ({
    id: el.id,
    header: `${convertToTitleCase(el.id)}${el.required ? ' (Required)' : ''}`,
    cell: (item) => columnCell(el, item),
    sortingField: el.id,
    editConfig: {
      autoSuggestFields: el.autoSuggestFields ? el.autoSuggestFields : null,
      ariaLabel: convertToTitleCase(el.id),
      editIconAriaLabel: 'editable',
      errorIconAriaLabel: `${convertToTitleCase(el.id)} Error`,
      editingCell: (item, { currentValue, setValue }) => {
        const value = currentValue ?? (item[el.id] || '');
        const fieldEditorSelectorProps = {
          currentValue: value,
          setValue,
          column: el,
        };
        if (
          el.type === TABLE_DISPLAY_TYPES.AUTOSUGGEST ||
          el.type === TABLE_DISPLAY_TYPES.BADGE
        ) {
          fieldEditorSelectorProps.storeValue = getStoreValueFromConfig(
            storeValues,
            config,
            el,
          );
        }
        return fieldEditorSelector(fieldEditorSelectorProps);
      },
    },
  }));
