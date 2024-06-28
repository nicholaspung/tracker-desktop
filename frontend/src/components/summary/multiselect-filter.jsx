import { FormField, Multiselect } from '@cloudscape-design/components';
import { useEffect, useState } from 'react';
import { ALL_OPTION, toOptions } from '../../utils/misc';

export default function MultiSelectFilter({
  label,
  data,
  optionField,
  id,
  initialValue,
  setFilterOptions,
}) {
  const [selectedOptions, setSelectedOptions] = useState(initialValue);

  useEffect(() => {
    setFilterOptions((prev) => ({ ...prev, [id]: selectedOptions }));
  }, [selectedOptions]);

  const onChange = (options) => {
    if (!options.length) {
      setSelectedOptions([ALL_OPTION]);
    } else if (options.find((el) => el.value === ALL_OPTION.value)) {
      setSelectedOptions((prev) => {
        if (prev.find((el) => el.value === ALL_OPTION.value)) {
          return options.filter((el) => el.value !== ALL_OPTION.value);
        }
        return [ALL_OPTION];
      });
    } else {
      setSelectedOptions(options);
    }
  };

  return (
    <FormField label={label}>
      <Multiselect
        selectedOptions={selectedOptions}
        options={[ALL_OPTION, ...toOptions(data, optionField)]}
        onChange={({ detail }) => onChange(detail.selectedOptions)}
        placeholder="Choose options"
        expandToViewport
        tokenLimit={3}
      />
    </FormField>
  );
}
