import {
  Box,
  Button,
  Header,
  SpaceBetween,
  Spinner,
} from '@cloudscape-design/components';
import { useState } from 'react';
import Forms from './forms';
import { addData } from '../utils/data';
import useMyStore from '../store/useStore';
import { getStoreNamesFromConfig } from '../utils/store';

export default function AddItemModal({
  ModalComponent,
  label,
  setVisible,
  config,
}) {
  const storeValues = useMyStore((state) => {
    const storeNames = getStoreNamesFromConfig(config);
    const result = { pb: state.pb, addItemToStore: state.addItemToStore };
    storeNames.forEach((store) => {
      result[store] = state[store];
    });
    return result;
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);

  const onSave = async () => {
    setLoading(true);
    await addData(storeValues.pb, config, {
      stores: storeValues,
      newData: data,
      addItemToStore: storeValues.addItemToStore,
    });
    setVisible(false);
  };

  return (
    <ModalComponent
      header={<Header>{label}</Header>}
      footer={
        <Box float="right">
          <SpaceBetween size="xs" direction="horizontal">
            <Button onClick={() => setVisible(false)}>Cancel</Button>
            <Button onClick={onSave} variant="primary">
              {loading ? <Spinner /> : 'Save'}
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <SpaceBetween size="xs" direction="vertical">
        <Forms columns={config.columns} setDataUpstream={setData} />
      </SpaceBetween>
    </ModalComponent>
  );
}
