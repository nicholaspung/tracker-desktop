import { Box, SpaceBetween } from '@cloudscape-design/components';

export default function EmptyState({ title, action }) {
  return (
    <Box margin={{ vertical: 'xs' }} textAlign="center" color="inherit">
      <SpaceBetween size="m">
        <b>{title}</b>
        {action && action}
      </SpaceBetween>
    </Box>
  );
}
