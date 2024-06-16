import {
  Box,
  Button,
  Container,
  Header,
  Icon,
  SpaceBetween,
} from '@cloudscape-design/components';
import Forms from '../forms';
import { deleteData, updateData } from '../../utils/data';

export default function EditTableItem({
  storeValues,
  config,
  selectedItem,
  clearSelection,
  editedData,
  setEditedData,
}) {
  const onDelete = async () => {
    await deleteData(storeValues.pb, config, {
      removeItemInStore: storeValues.removeItemInStore,
      id: editedData ? editedData.id : selectedItem.id,
    });
    await clearSelection();
  };

  const onUpdate = async () => {
    await updateData(storeValues.pb, config, {
      replaceItemInStore: storeValues.replaceItemInStore,
      updatedData: editedData,
      stores: storeValues,
    });
    await clearSelection();
  };

  return (
    <Container
      header={
        <Header
          actions={
            <Box float="right">
              <Button
                variant="icon"
                iconName="close"
                onClick={clearSelection}
              />
            </Box>
          }
          info={
            editedData &&
            editedData !== selectedItem && (
              <Icon name="edit" variant="disabled" />
            )
          }
        >
          Editing a finance log
        </Header>
      }
      footer={
        <Box float="right">
          <SpaceBetween size="xs" direction="horizontal">
            <Button variant="normal" onClick={clearSelection}>
              <Icon name="close" />
            </Button>
            <Button variant="normal" onClick={onDelete}>
              <Icon name="remove" />
            </Button>
            <Button variant="primary" onClick={onUpdate} disabled={!editedData}>
              Update
            </Button>
          </SpaceBetween>
        </Box>
      }
    >
      <Forms
        columns={config.columns}
        defaultData={selectedItem}
        setDataUpstream={setEditedData}
      />
    </Container>
  );
}
