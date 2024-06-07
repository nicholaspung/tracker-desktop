import {
  Box,
  Button,
  Header,
  SpaceBetween,
} from '@cloudscape-design/components';
import useModal from '../hooks/useModal';
import Forms from './forms';

export default function AddItemButtonModal({ config, label }) {
  const { ModalComponent, setVisible } = useModal();

  return (
    <>
      <Button onClick={() => setVisible(true)}>{label}</Button>
      <ModalComponent
        header={<Header>{label}</Header>}
        footer={
          <Box float="right">
            <SpaceBetween size="xs" direction="horizontal">
              <Button onClick={() => setVisible(false)}>Cancel</Button>
              <Button variant="primary">Save</Button>
            </SpaceBetween>
          </Box>
        }
      >
        <SpaceBetween size="xs" direction="vertical">
          <Forms columns={config.columns} />
        </SpaceBetween>
      </ModalComponent>
    </>
  );
}
