import { Button } from '@cloudscape-design/components';
import { memo } from 'react';
import useModal from '../hooks/useModal';
import AddItemModal from './add-item-modal';

function AddItemButtonModal({ config, label, showMultiple = true }) {
  const { ModalComponent, setVisible } = useModal();

  return (
    <>
      <Button onClick={() => setVisible(true)}>{label}</Button>
      <AddItemModal
        ModalComponent={ModalComponent}
        setVisible={setVisible}
        label={label}
        config={config}
        showMultiple={showMultiple}
      />
    </>
  );
}

export default memo(AddItemButtonModal);
