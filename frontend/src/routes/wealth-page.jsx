import {
  Button,
  Container,
  DatePicker,
  FormField,
  Header,
  Select,
  SpaceBetween,
} from '@cloudscape-design/components';
import { useState } from 'react';
import Layout from '../components/layout';
import useMyStore from '../store/useStore';
import { COLLECTION_NAMES } from '../lib/collections';
import {
  filterDataAccordingToPbDate,
  filterDataAccoringToField,
  getListData,
} from '../utils/data';
import useData from '../hooks/useData';
import TableList from '../components/table-list';
import {
  CONFIG_FINANCES_CATEGORY,
  CONFIG_FINANCES_LOG,
  CONFIG_FINANCES_TAG,
} from '../lib/config';
import { ALL_OPTION, toOptions } from '../utils/misc';
import { dateToDatePickerMonth } from '../utils/date';

export default function WealthPage() {
  const { pb, financesLog, setDataInStore, financesCategory, financesTag } =
    useMyStore((state) => ({
      pb: state.pb,
      financesLog: state[COLLECTION_NAMES.FINANCES_LOG],
      setDataInStore: state.setDataInStore,
      financesCategory: state[COLLECTION_NAMES.FINANCES_CATEGORY],
      financesTag: state[COLLECTION_NAMES.FINANCES_TAG],
    }));

  const getFinancesLog = async () => {
    getListData(
      pb,
      CONFIG_FINANCES_LOG.collection,
      CONFIG_FINANCES_LOG.columns,
      {
        prevData: financesLog,
        setData: setDataInStore,
      },
    );
  };
  const { isLoading: flIsLoading, refetch: flRefetch } =
    useData(getFinancesLog);

  const getFinancesCategory = async () => {
    getListData(
      pb,
      CONFIG_FINANCES_CATEGORY.collection,
      CONFIG_FINANCES_CATEGORY.columns,
      {
        prevData: financesCategory,
        setData: setDataInStore,
      },
    );
  };
  const { refetch: fcRefetch } = useData(getFinancesCategory);

  const getFinancesTag = async () => {
    getListData(
      pb,
      CONFIG_FINANCES_TAG.collection,
      CONFIG_FINANCES_TAG.columns,
      {
        prevData: financesTag,
        setData: setDataInStore,
      },
    );
  };
  const { refetch: ftRefetch } = useData(getFinancesTag);

  const [timeFrame, setTimeFrame] = useState(dateToDatePickerMonth());
  const [category, setCategory] = useState(ALL_OPTION);
  const [tag, setTag] = useState(ALL_OPTION);

  const initialFilterOptions = {
    timeFrame,
    category,
    tag,
  };
  const [filterOptions, setFilterOptions] = useState(initialFilterOptions);

  const dateFiltered = filterDataAccordingToPbDate(
    financesLog,
    new Date(filterOptions.timeFrame),
  );
  const categoryFiltered = filterDataAccoringToField(
    dateFiltered,
    'category',
    filterOptions.category,
  );
  const tagFiltered = filterDataAccoringToField(
    categoryFiltered,
    'tags',
    filterOptions.tag,
  );
  console.log(tagFiltered);

  const onResetFilter = () => {
    setFilterOptions(initialFilterOptions);
  };
  const onSaveFilter = () => {
    setFilterOptions({ timeFrame, category, tag });
  };
  const isSameFilter = () =>
    filterOptions.timeFrame === timeFrame &&
    filterOptions.category === category &&
    filterOptions.tag === tag;

  return (
    <Layout
      contentHeader={
        <Header
          variant="h1"
          description="All you need to keep track of your wealth."
        >
          Wealth
        </Header>
      }
    >
      <SpaceBetween size="xs" direction="vertical">
        <TableList
          data={financesLog}
          columns={CONFIG_FINANCES_LOG.columns}
          label="Finance Logs"
          isLoading={flIsLoading}
          refetch={flRefetch}
        />
        <Container
          header={<Header>Summary of Finance Logs according to filters</Header>}
        >
          <SpaceBetween size="xs" direction="vertical">
            <SpaceBetween size="xs" direction="horizontal">
              <FormField label="Select month">
                <DatePicker
                  granularity="month"
                  placeholder="YYYY/MM"
                  value={timeFrame}
                  onChange={({ detail }) => setTimeFrame(detail.value)}
                  isDateEnabled={(date) => date <= new Date()}
                  openCalendarAriaLabel={(selectedDate) =>
                    `Choose time period${
                      selectedDate ? `, selected period is ${selectedDate}` : ''
                    }`
                  }
                />
              </FormField>
              <FormField label="Select category">
                <Select
                  selectedOption={category}
                  options={[
                    ALL_OPTION,
                    ...toOptions(financesCategory, 'category'),
                  ]}
                  onLoadItems={fcRefetch}
                  onChange={({ detail }) => setCategory(detail.selectedOption)}
                />
              </FormField>
              <FormField label="Select tag">
                <Select
                  selectedOption={tag}
                  options={[ALL_OPTION, ...toOptions(financesTag, 'tag')]}
                  onLoadItems={ftRefetch}
                  onChange={({ detail }) => setTag(detail.selectedOption)}
                />
              </FormField>
            </SpaceBetween>
            <SpaceBetween size="xs" direction="horizontal">
              <Button onClick={onResetFilter} disabled={isSameFilter()}>
                Reset
              </Button>
              <Button
                onClick={onSaveFilter}
                variant="primary"
                disabled={isSameFilter()}
              >
                Save filters
              </Button>
            </SpaceBetween>
            <TableList
              data={tagFiltered}
              columns={CONFIG_FINANCES_LOG.columns}
              label="Finance Logs"
              hideHeader
              variant="embedded"
            />
          </SpaceBetween>
        </Container>
      </SpaceBetween>
    </Layout>
  );
}
