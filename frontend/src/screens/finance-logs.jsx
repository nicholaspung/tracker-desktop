import { SpaceBetween, Tabs } from '@cloudscape-design/components';
import TableList from '../components/table-list';
import {
  CONFIG_FINANCES_CATEGORY,
  CONFIG_FINANCES_LOG,
  CONFIG_FINANCES_TAG,
} from '../lib/config';
import FinanceLogsSummary from './finance-logs-summary';
import { SELECT_TYPES } from '../lib/display';

export default function FinanceLogs() {
  return (
    <SpaceBetween size="xs" direction="vertical">
      <Tabs
        variant="container"
        tabs={[
          {
            label: 'Logs',
            id: 'logs',
            content: (
              <TableList
                config={CONFIG_FINANCES_LOG}
                label="All Finance Logs"
                variant="embedded"
                selectionType={SELECT_TYPES.SINGLE}
              />
            ),
          },
          {
            label: 'Categories',
            id: 'categories',
            content: (
              <TableList
                config={CONFIG_FINANCES_CATEGORY}
                label="All Finance Categories"
                variant="embedded"
                selectionType={SELECT_TYPES.SINGLE}
              />
            ),
          },
          {
            label: 'Tags',
            id: 'tags',
            content: (
              <TableList
                config={CONFIG_FINANCES_TAG}
                label="All Finance Tags"
                variant="embedded"
                selectionType={SELECT_TYPES.SINGLE}
              />
            ),
          },
        ]}
      />
      <FinanceLogsSummary />
    </SpaceBetween>
  );
}
