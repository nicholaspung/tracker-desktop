/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import {
  Box,
  Button,
  Container,
  Icon,
  Modal,
  ProgressBar,
  SpaceBetween,
  Toggle,
} from '@cloudscape-design/components';
import { useState } from 'react';
import Habit from './habit';
import useMyStore from '../../store/useStore';
import { updateDaily } from '../../utils/tasks/api';
import { getCompletionPercentage } from '../../utils/tasks/daily';

export default function CalendarDay({
  day,
  colorClass,
  completion,
  month,
  dailies,
}) {
  const { pb, replaceItemInStore } = useMyStore((state) => ({
    pb: state.pb,
    replaceItemInStore: state.replaceItemInStore,
  }));

  const [visible, setVisible] = useState(false);
  const [edit, setEdit] = useState(false);

  const hasDailies = dailies && dailies.length;

  const onClose = () => {
    setVisible(false);
    setEdit(false);
  };

  return (
    <Container disableContentPaddings>
      <SpaceBetween direction="vertical" alignItems="center">
        <span>{day}</span>
        <div
          onClick={() => {
            if (hasDailies) {
              setVisible(true);
            }
          }}
          className={`w-8 h-8 my-1 rounded-full ${colorClass} hover:opacity-80 transition-opacity bg-blue-500 ${
            hasDailies ? 'cursor-pointer' : ''
          } flex items-center justify-center relative`}
        >
          {hasDailies ? (
            <>
              <span className="text-xs font-semibold text-white z-10">
                {dailies.filter((el) => el.completed).length}/{dailies.length}
              </span>
              <div
                className="absolute inset-0 bg-black bg-opacity-25 rounded-full"
                style={{
                  clipPath: `inset(${100 - completion}% 0 0 0 round 9999px)`,
                }}
              />
            </>
          ) : null}
        </div>
      </SpaceBetween>
      {hasDailies ? (
        <Modal
          onDismiss={onClose}
          visible={visible}
          header={`${month} ${day}`}
          footer={
            <Box float="right">
              <SpaceBetween direction="horizontal" size="l" alignItems="center">
                <Toggle
                  checked={edit}
                  onChange={({ detail }) => setEdit(detail.checked)}
                >
                  Edit
                </Toggle>
                <Button onClick={onClose}>Close</Button>
              </SpaceBetween>
            </Box>
          }
        >
          <ProgressBar value={getCompletionPercentage(dailies)} />
          <br />
          {dailies.map((daily, i) => (
            <Habit
              habits={dailies}
              habit={daily.expand.current_relation}
              i={i}
              key={daily.id}
              daily={daily}
              isDaily
              isCalendarDay
            >
              <Button
                variant={daily.completed ? 'primary' : 'normal'}
                onClick={() => updateDaily(pb, replaceItemInStore, daily)}
                disabled={!edit}
              >
                <Icon name="check" />
              </Button>
            </Habit>
          ))}
          <br />
        </Modal>
      ) : null}
    </Container>
  );
}
