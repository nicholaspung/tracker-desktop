import { FormField, Select } from '@cloudscape-design/components';
import { useEffect, useState } from 'react';
import { ALL_OPTION, toOptions } from '../../utils/misc';

export function SelectFilter({
  label,
  data,
  optionField,
  id,
  initialValue,
  setFilterOptions,
}) {
  const [selected, setSelected] = useState(initialValue);

  useEffect(() => {
    setFilterOptions((prev) => ({ ...prev, [id]: selected }));
  }, [selected]);

  return (
    <FormField label={label}>
      <Select
        selectedOption={selected}
        options={[ALL_OPTION, ...toOptions(data, optionField)]}
        onChange={({ detail }) => setSelected(detail.selectedOption)}
      />
    </FormField>
  );
}
