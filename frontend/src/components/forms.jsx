import { DatePicker, FormField, Input } from '@cloudscape-design/components';
import { useState } from 'react';
import { SELECT_TYPES, TABLE_DISPLAY_TYPES } from '../lib/display';
import { convertToTitleCase } from '../utils/display';
import SelectWithData from './forms/selectWithData';
import { dateToDatePicker } from '../utils/date';

export default function Forms({ columns, defaultData }) {
  const initialData =
    defaultData ||
    columns.reduce((acc, curr) => {
      let value;
      switch (curr.type) {
        case TABLE_DISPLAY_TYPES.DATE:
          value = dateToDatePicker();
          break;
        case TABLE_DISPLAY_TYPES.BADGE:
          if (curr.selectType === SELECT_TYPES.MULTIPLE) {
            value = [];
          } else {
            value = '';
          }
          break;
        case TABLE_DISPLAY_TYPES.DOLLAR:
        case TABLE_DISPLAY_TYPES.TEXT:
        default:
          value = '';
      }
      acc[curr.id] = value;
      return acc;
    }, {});
  const [data, setData] = useState(initialData);

  const onChange = (el, detail, detailField) => {
    setData((prev) => ({ ...prev, [el.id]: detail[detailField] }));
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
