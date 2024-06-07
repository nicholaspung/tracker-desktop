import { Button } from '@cloudscape-design/components';
import useModal from '../hooks/useModal';
import AddItemModal from './add-item-modal';

export default function AddItemButtonModal({ config, label }) {
  const { ModalComponent, setVisible } = useModal();

  return (
    <>
      <Button onClick={() => setVisible(true)}>{label}</Button>
      <AddItemModal
        ModalComponent={ModalComponent}
        setVisible={setVisible}
        label={label}
        config={config}
      />
    </>
  );
}
