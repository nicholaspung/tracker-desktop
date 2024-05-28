/**
 *
 * @param {[string]} visibleContent
 * @returns {
 *  pageSize: number,
 *  visibleContent: [string]
 * }
 */
export const getDefaultPreferences = (visibleContent) => ({
  pageSize: 10,
  visibleContent,
});

export const transformVisibleContentOptionsForPreferences = (
  visibleContentOptions,
) => visibleContentOptions.map((el) => el.id);

/**
 * @param {
 *  [
 *      {
 *          id: string,
 *          label: string (optional),
 *          editable: boolean (optional)
 *      }
 *  ]
 * } visibleContent
 * @returns  {
 *  title: string,
 *  options: [
 *      {
 *          id: string,
 *          label: string,
 *          editable: boolean
 *      }
 *  ]
 * }
 */
export const getVisibleContentOptions = (visibleContentOptions) => ({
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
        return option;
      }),
    },
  ],
});
