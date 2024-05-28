import { Flashbar } from '@cloudscape-design/components';
import { useState } from 'react';

export default function useFlashbar() {
  const [items, setItems] = useState([]);

  const generateFlashbarItems = ({
    content,
    id = 'info',
    type,
    header,
    dismissible = true,
  }) => ({
    header,
    type,
    dismissible,
    dismissLabel: 'Dismiss message',
    id: `${id}_${type}`,
    onDismiss: () => {
      setItems((prev) => {
        const prevCopy = [...prev];
        const index = prevCopy.findIndex((el) => el.id === `${id}_${type}`);
        prevCopy.splice(index, 1);
        return prevCopy;
      });
    },
    content,
  });

  function FlashbarComponent() {
    return <Flashbar items={items} />;
  }
  return {
    FlashbarComponent,
    setFlasbarItems: setItems,
    generateFlashbarItems,
  };
}
