import { FormField, Multiselect, Select } from '@cloudscape-design/components';
import { SELECT_TYPES } from '../../lib/display';
import { convertToTitleCase } from '../../utils/display';
import { toOptions } from '../../utils/misc';
import useMyStore from '../../store/useStore';

export default function SelectWithData({ element, value, onChange }) {
  const { data } = useMyStore((state) => ({
    data: state[element.store],
  }));

  if (element.selectType === SELECT_TYPES.SINGLE) {
    return (
      <FormField label={convertToTitleCase(element.id)}>
        <Select
          options={toOptions(data, element.storeField)}
          placeholder="Choose option"
          selectedOption={value}
          onChange={({ detail }) => onChange(element, detail, 'selectedOption')}
        />
      </FormField>
    );
  }
  return (
    <FormField label={convertToTitleCase(element.id)}>
      <Multiselect
        options={toOptions(data, element.storeField)}
        placeholder="Choose options"
        selectedOptions={value}
        onChange={({ detail }) => onChange(element, detail, 'selectedOptions')}
      />
    </FormField>
  );
}
