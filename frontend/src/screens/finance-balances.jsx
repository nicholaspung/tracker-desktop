import { SpaceBetween, Tabs } from '@cloudscape-design/components';
import TableList from '../components/table-list';
import {
  CONFIG_FINANCES_BALANCE,
  CONFIG_FINANCES_BALANCE_ACCOUNT_NAME,
  CONFIG_FINANCES_BALANCE_OWNER,
  CONFIG_FINANCES_BALANCE_TYPE,
} from '../lib/config';
import { SELECT_TYPES } from '../lib/display';

export default function FinanceBalances() {
  return (
    <SpaceBetween size="xs" direction="vertical">
      <Tabs
        variant="container"
        tabs={[
          {
            label: 'Balances',
            id: 'balances',
            content: (
              <TableList
                config={CONFIG_FINANCES_BALANCE}
                label="All Finance Balances"
                variant="embedded"
                selectionType={SELECT_TYPES.SINGLE}
              />
            ),
          },
          {
            label: 'Account Names',
            id: 'account_names',
            content: (
              <TableList
                config={CONFIG_FINANCES_BALANCE_ACCOUNT_NAME}
                label="All Finance Balance Account Names"
                variant="embedded"
                selectionType={SELECT_TYPES.SINGLE}
              />
            ),
          },
          {
            label: 'Owners',
            id: 'owners',
            content: (
              <TableList
                config={CONFIG_FINANCES_BALANCE_OWNER}
                label="All Finance Balance Owners"
                variant="embedded"
                selectionType={SELECT_TYPES.SINGLE}
              />
            ),
          },
          {
            label: 'Types',
            id: 'types',
            content: (
              <TableList
                config={CONFIG_FINANCES_BALANCE_TYPE}
                label="All Finance Balance Types"
                variant="embedded"
                selectionType={SELECT_TYPES.SINGLE}
              />
            ),
          },
        ]}
      />
    </SpaceBetween>
  );
}
