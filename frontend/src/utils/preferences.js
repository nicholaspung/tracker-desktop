import { getColumnDisplay } from './table';

/**
 *
 * @param {string[]} visibleContent
 * @returns {{
 *  pageSize: number,
 *  visibleContent: string[]
 *  contentDisplay: {
 *    id: string,
 *    visible: boolean
 *  }[]
 * }}
 */
export const getDefaultPreferences = (visibleContent) => ({
  pageSize: 10,
  visibleContent,
  contentDisplay: getColumnDisplay(visibleContent),
  wrapLines: true,
  stripedRows: true,
  contentDensity: 'comfortable',
});

export const transformVisibleContentOptionsForPreferences = (
  visibleContentOptions,
) => visibleContentOptions.map((el) => el.id);

/**
 * @param {{
 *  id: string,
 *  label: string,
 *  editable?: boolean,
 *  alwaysVisible?: boolean
 * }[]} visibleContentOptions
 * @returns  {{
 *  title: string,
 *  options: {
 *    id: string,
 *    label: string,
 *    editable: boolean
 *  }[]
 * }}
 */
export const getVisibleContentPreference = (visibleContentOptions) => ({
  title: 'Select visible content',
  options: [
    {
      label: '',
      options: visibleContentOptions.map((el) => {
        const option = {
          id: el.id,
          label: el.label ? el.label : el.id,
        };
        if (Object.keys(el).find((ele) => ele === 'editable')) {
          option.editable = el.editable;
        }
        if (Object.keys(el).find((ele) => ele === 'alwaysVisible')) {
          option.alwaysVisible = el.alwaysVisible;
        }
        return option;
      }),
    },
  ],
});

/**
 *
 * @param {{id: string, label: string, alwaysVisible: boolean}} visibleContentOptions
 * @returns {{
 *  id: string,
 *  label: string,
 *  alwaysVisible: boolean
 * }[]}
 */
export const getContentDisplayPreference = (visibleContentOptions) =>
  getVisibleContentPreference(visibleContentOptions).options[0];
