import { Badge, SpaceBetween } from '@cloudscape-design/components';
import { TABLE_DISPLAY_TYPES } from '../lib/display';
import { convertToTitleCase } from './display';

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
    cell: (item) => {
      switch (el.type) {
        case TABLE_DISPLAY_TYPES.DATE:
          return item[el.id].split(' ')[0];
        case TABLE_DISPLAY_TYPES.DOLLAR:
          return item[el.id].toLocaleString('en-US', {
            style: 'currency',
            currency: 'USD',
          });
        case TABLE_DISPLAY_TYPES.BADGE:
          if (Array.isArray(item[el.id])) {
            return (
              <SpaceBetween size="xs" direction="horizontal">
                {item[el.id].map((ele) => (
                  <Badge key={ele}>{ele}</Badge>
                ))}
              </SpaceBetween>
            );
          }
          return <Badge>{item[el.id]}</Badge>;
        case TABLE_DISPLAY_TYPES.TEXT:
        default:
          return item[el.id];
      }
    },
    sortingField: el.id,
  }));
