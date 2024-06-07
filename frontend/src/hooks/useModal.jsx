import { Modal } from '@cloudscape-design/components';
import { useState } from 'react';

export default function useModal() {
  const [visible, setVisible] = useState(false);

  function ModalComponent({ children, header, footer, size = 'large' }) {
    return (
      <Modal
        visible={visible}
        onDismiss={() => setVisible(false)}
        header={header}
        footer={footer}
        size={size}
      >
        {children}
      </Modal>
    );
  }

  return { ModalComponent, visible, setVisible };
}
