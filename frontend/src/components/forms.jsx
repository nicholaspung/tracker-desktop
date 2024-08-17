import {
  Autosuggest,
  DatePicker,
  FileUpload,
  FormField,
  Input,
} from '@cloudscape-design/components';
import { useState } from 'react';
import { SELECT_TYPES, TABLE_DISPLAY_TYPES } from '../lib/display';
import { convertToTitleCase } from '../utils/display';
import SelectWithData from './forms/selectWithData';
import {
  getAutoSuggestDataFromColumn,
  getInitialDataFormat,
  getStoreValueFromConfig,
} from '../utils/forms';
import useMyStore from '../store/useStore';
import { getStoreValuesFromConfig } from '../utils/store';
import { toOptions } from '../utils/misc';
import {
  cloudscapeDateToCorrectDateValue,
  pbDateToDisplay,
} from '../utils/date';

export default function Forms({ config, defaultData, setDataUpstream }) {
  const initialData = getInitialDataFormat(config.columns, defaultData);

  const storeValues = useMyStore((state) => {
    const result = {
      pb: state.pb,
      [config.collection]: state[config.collection],
      setDataInStore: state.setDataInStore,
      replaceItemInStore: state.replaceItemInStore,
      removeItemInStore: state.removeItemInStore,
    };
    return { ...result, ...getStoreValuesFromConfig(state, config) };
  });

  const [data, setData] = useState(initialData);

  const onChange = async (el, detail, detailField, changeFunc) => {
    let dataForUpstream;
    await setData((prev) => {
      const detailValue = detail[detailField];
      const result = { ...prev, [el.id]: detailValue };
      if (changeFunc === 'onSelect') {
        result[el.id] = detailValue.value;
      }
      if (changeFunc === 'onDate') {
        result[el.id] = cloudscapeDateToCorrectDateValue(detailValue);
      }
      if (detailValue.tags && detailValue.filteringTags) {
        result[el.id] = detailValue.value;
        detailValue.filteringTags.forEach((columnId, i) => {
          // assume autosuggestfields are always a selection until otherwise
          if (detailValue.tags[i].includes(', ')) {
            const newTagsValue = detailValue.tags[i]
              .split(', ')
              .filter((ele) => ele);
            result[columnId] = toOptions(newTagsValue);
          } else {
            result[columnId] = toOptions(detailValue.tags[i]);
          }
        });
      }
      dataForUpstream = result;
      return result;
    });
    await setDataUpstream(dataForUpstream);
  };

  return config.columns.map((el) => {
    switch (el.type) {
      case TABLE_DISPLAY_TYPES.DATE:
        return (
          <FormField
            key={el.id}
            label={convertToTitleCase(el.id)}
            constraintText="Use YYYY/MM/DD format."
          >
            <DatePicker
              placeholder="YYYY/MM/DD"
              openCalendarAriaLabel={(selectedDate) =>
                `Choose date${
                  selectedDate ? `, selected date is ${selectedDate}` : ''
                }`
              }
              onChange={({ detail }) => onChange(el, detail, 'value', 'onDate')}
              value={pbDateToDisplay(data[el.id])}
            />
          </FormField>
        );
      case TABLE_DISPLAY_TYPES.DOLLAR:
        return (
          <FormField key={el.id} label={convertToTitleCase(el.id)}>
            <Input
              type="number"
              placeholder="0"
              value={data[el.id]}
              onChange={({ detail }) => onChange(el, detail, 'value')}
            />
          </FormField>
        );
      case TABLE_DISPLAY_TYPES.TEXT:
        const storeValue = getStoreValueFromConfig(storeValues, config, el);
        const autoSuggestData = getAutoSuggestDataFromColumn(storeValue, el);
        return (
          <FormField key={el.id} label={convertToTitleCase(el.id)}>
            <Autosuggest
              autoFocus
              expandToViewport
              onChange={({ detail }) => onChange(el, detail, 'value')}
              onSelect={({ detail }) =>
                onChange(el, detail, 'selectedOption', 'onSelect')
              }
              value={data[el.id]}
              options={autoSuggestData}
              enteredTextLabel={(value) => `Use: "${value}"`}
              ariaLabel="Autosuggest example with suggestions"
              placeholder="Enter value"
              empty="No matches found"
            />
          </FormField>
        );
      case TABLE_DISPLAY_TYPES.BADGE:
        return (
          <SelectWithData
            element={el}
            key={el.id}
            value={data[el.id]}
            onChange={onChange}
          />
        );
      case TABLE_DISPLAY_TYPES.FILE:
        return (
          <FormField key={el.id} label={convertToTitleCase(el.id)}>
            <FileUpload
              onChange={({ detail }) => onChange(el, detail, 'value')}
              value={data[el.id]}
              i18nStrings={{
                uploadButtonText: (e) => (e ? 'Choose files' : 'Choose file'),
                dropzoneText: (e) =>
                  e ? 'Drop files to upload' : 'Drop file to upload',
                removeFileAriaLabel: (e) => `Remove file ${e + 1}`,
                limitShowFewer: 'Show fewer files',
                limitShowMore: 'Show more files',
                errorIconAriaLabel: 'Error',
              }}
              tokenLimit={3}
              constraintText={`File extensions accepted: ${el.fileTypes.join(
                ', ',
              )}`}
              multiple={el.selectType === SELECT_TYPES.MULTIPLE}
            />
          </FormField>
        );
      default:
        return null;
    }
  });
}
