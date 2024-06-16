import { DatePicker, FormField, Input } from '@cloudscape-design/components';
import { useState } from 'react';
import { SELECT_TYPES, TABLE_DISPLAY_TYPES } from '../lib/display';
import { convertToTitleCase } from '../utils/display';
import SelectWithData from './forms/selectWithData';
import { dateToDatePicker } from '../utils/date';
import { toOptions } from '../utils/misc';

export default function Forms({ columns, defaultData, setDataUpstream }) {
  const initialData = columns.reduce(
    (acc, curr) => {
      let value;
      const DEFAULT_VALUES = {
        [TABLE_DISPLAY_TYPES.DATE]: dateToDatePicker(),
        [TABLE_DISPLAY_TYPES.BADGE]:
          curr.selectType === SELECT_TYPES.MULTIPLE ? [] : '',
        [TABLE_DISPLAY_TYPES.DOLLAR]: '',
        [TABLE_DISPLAY_TYPES.TEXT]: '',
      };
      const returnData = (column, data, displayType) =>
        data && data[column.id] ? data[column.id] : DEFAULT_VALUES[displayType];
      switch (curr.type) {
        case TABLE_DISPLAY_TYPES.DATE:
          value = returnData(curr, defaultData, TABLE_DISPLAY_TYPES.DATE);
          break;
        case TABLE_DISPLAY_TYPES.BADGE:
          const badgeValue = returnData(
            curr,
            defaultData,
            TABLE_DISPLAY_TYPES.BADGE,
          );
          if ((Array.isArray(badgeValue) && badgeValue.length) || badgeValue) {
            value = toOptions(badgeValue);
          }
          break;
        case TABLE_DISPLAY_TYPES.DOLLAR:
        case TABLE_DISPLAY_TYPES.TEXT:
        default:
          value = returnData(curr, defaultData, TABLE_DISPLAY_TYPES.TEXT);
      }
      acc[curr.id] = value;
      return acc;
    },
    defaultData && defaultData.id ? { id: defaultData.id } : {},
  );

  const [data, setData] = useState(initialData);

  const onChange = async (el, detail, detailField) => {
    let dataForUpstream;
    await setData((prev) => {
      const result = { ...prev, [el.id]: detail[detailField] };
      dataForUpstream = result;
      return result;
    });
    await setDataUpstream(dataForUpstream);
  };

  return columns.map((el) => {
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
              onChange={({ detail }) => onChange(el, detail, 'value')}
              value={data[el.id]}
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
        return (
          <FormField key={el.id} label={convertToTitleCase(el.id)}>
            <Input
              type="text"
              placeholder="Type description here"
              value={data[el.id]}
              onChange={({ detail }) => onChange(el, detail, 'value')}
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
      default:
        return null;
    }
  });
}
