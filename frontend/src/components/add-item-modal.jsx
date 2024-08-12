import {
  Box,
  Button,
  Header,
  SegmentedControl,
  SpaceBetween,
  Spinner,
} from '@cloudscape-design/components';
import { useEffect, useState } from 'react';
import Forms from './forms';
import { addData } from '../utils/data';
import useMyStore from '../store/useStore';
import { getStoreNamesFromConfigColumns } from '../utils/store';
import AddMultipleItems from './add-multiple-items';
import { INPUT_TYPES } from '../lib/forms';
import { toOptions } from '../utils/misc';

export default function AddItemModal({
  ModalComponent,
  label,
  setVisible,
  config,
}) {
  const storeValues = useMyStore((state) => {
    const storeNames = getStoreNamesFromConfigColumns(config);
    const result = {
      pb: state.pb,
      addItemToStore: state.addItemToStore,
      fetchPbRecordList: state.fetchPbRecordList,
    };
    storeNames.forEach((store) => {
      result[store] = state[store];
    });
    return result;
  });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(INPUT_TYPES.SINGLE);

  useEffect(() => {
    setLoading(false);
  }, []);

  const onSave = async () => {
    setLoading(true);
    if (selectedId === INPUT_TYPES.SINGLE) {
      try {
        await addData(storeValues.pb, config, {
          stores: storeValues,
          newData: data,
          addItemToStore: storeValues.addItemToStore,
        });
        setData(null);
        setLoading(false);
        setVisible(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    } else {
      const promises = data.map((el) => {
        const dataCopy = { ...el };
        // remove id field used to identify rows
        delete dataCopy.id;
        config.columns.forEach((column) => {
          if (column.selectType) {
            dataCopy[column.id] = toOptions(dataCopy[column.id]);
          }
        });
        return addData(storeValues.pb, config, {
          stores: storeValues,
          newData: dataCopy,
          addItemToStore: storeValues.addItemToStore,
        });
      });
      Promise.all(promises)
        .then(async () => {
          await setData(null);
          await setLoading(false);
          await storeValues.fetchPbRecordList(config);
          await setVisible(false);
        })
        .catch((err) => {
          console.error(err);
          setLoading(false);
        });
    }
  };

  return (
    <ModalComponent
      size={selectedId === INPUT_TYPES.SINGLE ? 'large' : 'max'}
      header={
        <Header
          actions={
            <SegmentedControl
              selectedId={selectedId}
              onChange={({ detail }) => setSelectedId(detail.selectedId)}
              label="Input method"
              options={[
                { text: 'Add single', id: INPUT_TYPES.SINGLE },
                { text: 'Add multiple', id: INPUT_TYPES.MULTIPLE },
                { text: 'Import multiple', id: INPUT_TYPES.IMPORT },
              ]}
            />
          }
        >
          {label}
        </Header>
      }
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
        {selectedId === INPUT_TYPES.SINGLE ? (
          <Forms config={config} setDataUpstream={setData} />
        ) : null}
        {selectedId === INPUT_TYPES.MULTIPLE ? (
          <AddMultipleItems
            type={INPUT_TYPES.MANUAL}
            label="Items"
            config={config}
            setDataUpstream={setData}
          />
        ) : null}
        {selectedId === INPUT_TYPES.IMPORT ? (
          <AddMultipleItems
            type={INPUT_TYPES.IMPORT}
            label="Imported items"
            config={config}
            setDataUpstream={setData}
          />
        ) : null}
      </SpaceBetween>
    </ModalComponent>
  );
}
