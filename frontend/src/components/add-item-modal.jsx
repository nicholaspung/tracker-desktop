import {
  Box,
  Button,
  Flashbar,
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
import { itemExists, toOptions } from '../utils/misc';
import { createFlashbarItem, isPbClientError } from '../utils/flashbar';

export default function AddItemModal({
  ModalComponent,
  label,
  setVisible,
  config,
  showMultiple,
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
  const [errorData, setErrorData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedId, setSelectedId] = useState(INPUT_TYPES.SINGLE);
  const [flashbarItems, setFlashbarItems] = useState([]);

  useEffect(() => {
    setLoading(false);
  }, []);

  const createFlashbarItemWAction = (resultErrorData) => {
    // create a error notification
    const errorId = crypto.randomUUID();
    const newFlashbarItem = createFlashbarItem({
      id: errorId,
      type: 'error',
      dismissible: true,
      setFlashbarItems: () =>
        setFlashbarItems((prev) => {
          const prevCopy = [...prev];
          const filtered = prevCopy.filter((el) => el.id !== errorId);
          return filtered;
        }),
      content: (
        <>
          {resultErrorData.message}
          <pre style={{ textWrap: 'wrap' }}>
            {JSON.stringify(resultErrorData.data)}
          </pre>
        </>
      ),
      header: `Code: ${resultErrorData.status}`,
    });
    return newFlashbarItem;
  };

  const onSave = async () => {
    const flashbarItemsCopy = [...flashbarItems];
    const errorsData = [];
    setLoading(true);
    if (selectedId === INPUT_TYPES.SINGLE) {
      const result = await addData(storeValues.pb, config, {
        stores: storeValues,
        newData: data,
        addItemToStore: storeValues.addItemToStore,
      });
      if (isPbClientError(result)) {
        errorsData.push(data);
        flashbarItemsCopy.push(createFlashbarItemWAction(result));
      } else {
        setData(null);
        setVisible(false);
      }
    } else {
      for (let i = 0; i < data.length; i += 1) {
        const dataCopy = { ...data[i] };
        // remove id field used to identify rows
        delete dataCopy.id;
        config.columns.forEach((column) => {
          if (column.selectType) {
            dataCopy[column.id] = toOptions(dataCopy[column.id]);
          }
        });
        const result = await addData(storeValues.pb, config, {
          stores: storeValues,
          newData: dataCopy,
          addItemToStore: storeValues.addItemToStore,
        });
        if (isPbClientError(result)) {
          // adds errored data back in to redo
          errorsData.push(data[i]);
          // create a error notification
          flashbarItemsCopy.push(createFlashbarItemWAction(result));
        }
      }
    }
    if (itemExists(errorsData)) {
      await setFlashbarItems(flashbarItemsCopy);
      await setErrorData(errorsData);
    } else {
      await setData(null);
      await storeValues.fetchPbRecordList(config);
      await setVisible(false);
    }
    await setLoading(false);
  };

  const OPTIONS = [{ text: 'Add single', id: INPUT_TYPES.SINGLE }];
  if (showMultiple) {
    OPTIONS.push({ text: 'Add multiple', id: INPUT_TYPES.MULTIPLE });
    OPTIONS.push({ text: 'Import multiple', id: INPUT_TYPES.IMPORT });
  }

  return (
    <ModalComponent
      size={selectedId === INPUT_TYPES.SINGLE ? 'large' : 'max'}
      header={
        <Header
          actions={
            <SegmentedControl
              selectedId={selectedId}
              onChange={({ detail }) => {
                setSelectedId(detail.selectedId);
                setData(null);
              }}
              label="Input method"
              options={OPTIONS}
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
        <Flashbar items={flashbarItems} stackItems />
        {selectedId === INPUT_TYPES.SINGLE ? (
          <Forms config={config} setDataUpstream={setData} />
        ) : null}
        {showMultiple && selectedId === INPUT_TYPES.MULTIPLE ? (
          <AddMultipleItems
            type={INPUT_TYPES.MULTIPLE}
            label="Items"
            config={config}
            setDataUpstream={setData}
            dataSentDownstream={errorData}
          />
        ) : null}
        {showMultiple && selectedId === INPUT_TYPES.IMPORT ? (
          <AddMultipleItems
            type={INPUT_TYPES.IMPORT}
            label="Imported items"
            config={config}
            setDataUpstream={setData}
            dataSentDownstream={errorData}
          />
        ) : null}
      </SpaceBetween>
    </ModalComponent>
  );
}
