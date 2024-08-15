import { useEffect, useState } from 'react';
import { useCollection } from '@cloudscape-design/collection-hooks';
import {
  Button,
  ColumnLayout,
  FileUpload,
  FormField,
  Header,
  Icon,
  Pagination,
  Select,
  SpaceBetween,
  Table,
  TextFilter,
} from '@cloudscape-design/components';
import Papa from 'papaparse';
import {
  getContentDisplayPreference,
  getDefaultPreferences,
} from '../utils/preferences';
import EmptyState from './empty-state';
import { getColumnDefinitionsForEdits } from '../utils/table';
import { getTextFilterCounterText } from '../utils/text-filter';
import { convertToTitleCase } from '../utils/display';
import Preferences from './preferences';
import useMyStore from '../store/useStore';
import { getInitialDataFormat } from '../utils/forms';
import { itemExists, toOptions } from '../utils/misc';
import { TABLE_DISPLAY_TYPES } from '../lib/display';
import { getStoreValuesFromConfig } from '../utils/store';
import { INPUT_TYPES } from '../lib/forms';

export default function AddMultipleItems({
  config,
  label,
  type,
  setDataUpstream,
  hideHeader,
  hidePagination,
  hidePreferences,
  hideFilter,
}) {
  const storeValues = useMyStore((state) => {
    const result = {
      pb: state.pb,
      [config.collection]: state[config.collection],
      setDataInStore: state.setDataInStore,
      replaceItemInStore: state.replaceItemInStore,
      removeItemInStore: state.removeItemInStore,
    };
    return { ...result, ...getStoreValuesFromConfig(state, config) };
  });

  const emptyValue = getInitialDataFormat([
    ...config.columns,
    { id: 'id', type: TABLE_DISPLAY_TYPES.ID },
  ]);
  const [addData, setAddData] = useState([emptyValue]);

  useEffect(() => {
    setDataUpstream(addData);
  }, []);
  const [preferences, setPreferences] = useState(
    getDefaultPreferences(config.columns),
  );

  const {
    items,
    actions,
    filteredItemsCount,
    collectionProps,
    filterProps,
    paginationProps,
  } = useCollection(addData, {
    filtering: {
      empty: <EmptyState title={`No ${label.toLowerCase()}`} />,
      noMatch: (
        <EmptyState
          title="No matches"
          action={
            <Button onClick={() => actions.setFiltering('')}>
              Clear filter
            </Button>
          }
        />
      ),
    },
    pagination: { pageSize: preferences.pageSize },
    sorting: {},
    selection: {},
  });

  const { selectedItems } = collectionProps;

  const onAddIcon = () => {
    setAddData([...addData, emptyValue]);
  };
  const onTrashIcon = () => {
    if (!itemExists(selectedItems)) return;

    setAddData((prev) =>
      prev.filter((el) => {
        if (selectedItems.find((ele) => ele.id === el.id)) {
          return false;
        }
        return true;
      }),
    );
  };

  const onSubmitEdit = async (item, column, newValue) => {
    const index = addData.findIndex((el) => el.id === item.id);
    const itemCopy = addData[index];
    try {
      const parsedValue = JSON.parse(newValue);
      if (typeof parsedValue === 'object') {
        Object.keys(parsedValue).forEach((key) => {
          if (key === column.id) {
            itemCopy[column.id] = parsedValue[key];
          } else if (parsedValue[key].includes(', ')) {
            const newTagsValue = parsedValue[key]
              .split(', ')
              .filter((ele) => ele)
              .sort();
            itemCopy[key] = newTagsValue;
          } else {
            itemCopy[key] = parsedValue[key];
          }
        });
      } else if (typeof parsedValue === 'number') {
        itemCopy[column.id] = newValue;
      }
    } catch (err) {
      // for multiple badges
      if (Array.isArray(newValue)) {
        if (newValue.length && typeof newValue[0] === 'object') {
          itemCopy[column.id] = newValue.map((el) => el.value);
        } else {
          itemCopy[column.id] = [];
        }
      } else {
        // for regular text and date
        itemCopy[column.id] = newValue;
      }
    }
    // for some reason, itemCopy is also written in addData, so no
    // need to update using setState

    await setDataUpstream(addData);
  };

  const [dataImported, setDataImported] = useState(false);
  const [fileUploadData, setFileUploadData] = useState([]);
  const [importedCsvHeaders, setImportedCsvHeaders] = useState([]);
  const [csvData, setCsvData] = useState([]);
  const [mappedColumnFields, setMappedColumnFields] = useState(
    config.columns.map((el) => ({ id: el.id })),
  );

  const csvParseToAPIFormat = async () => {
    const parsedCsvData = csvData.map((el) => {
      const result = {};
      mappedColumnFields.forEach((ele) => {
        result[ele.id] = el[ele.value];
      });
      result.id = crypto.randomUUID();
      return result;
    });
    setAddData(parsedCsvData);
    setDataImported(true);
    setDataUpstream(parsedCsvData);
  };

  useEffect(() => {
    if (itemExists(fileUploadData)) {
      Papa.parse(fileUploadData[0], {
        header: true,
        complete: async (results) => {
          setCsvData(results.data);
          const headers = toOptions(Object.keys(results.data[0]));
          setImportedCsvHeaders(headers);
        },
      });
    } else {
      setCsvData([]);
      setImportedCsvHeaders([]);
    }
  }, [fileUploadData]);

  const onMatchColumnToCsvHeaderField = (prev, selected, columnId) => {
    // functionality that adds disable to csvheaders after an item is selected
    const newImportedCsvHeaders = importedCsvHeaders.map((el) => {
      if (el.value === selected.value) {
        return { ...el, disabled: true };
      }
      if (prev && el.value === prev.value) {
        return { ...el, disabled: false };
      }
      return el;
    });
    setImportedCsvHeaders(newImportedCsvHeaders);
    // functionality that changes the mapped value after an item is selected
    const newMappedColumnFields = mappedColumnFields.map((el) => {
      if (el.id === columnId) {
        return { ...el, value: selected.value };
      }
      return el;
    });
    setMappedColumnFields(newMappedColumnFields);
  };

  const tableProps = {
    ...collectionProps,
    columnDefinitions: getColumnDefinitionsForEdits(
      {
        ...config,
        columns: [
          ...config.columns,
          { id: 'id', type: TABLE_DISPLAY_TYPES.TEXT },
        ],
      },
      storeValues,
    ),
    enableKeyboardNavigation: true,
    items,
    columnDisplay: preferences.contentDisplay,
    wrapLines: preferences.wrapLines,
    stripedRows: preferences.stripedRows,
    contentDensity: preferences.contentDensity,
    loadingText: 'Loading resources',
    variant: 'embedded',
    header: !hideHeader ? (
      <Header
        counter={`(${addData.length})`}
        actions={
          <SpaceBetween size="xs" direction="horizontal">
            <Button variant="primary" onClick={onAddIcon}>
              <Icon name="add-plus" />
            </Button>
            <Button onClick={onTrashIcon}>
              <Icon name="remove" />
            </Button>
            {dataImported ? (
              <Button
                onClick={() => {
                  setAddData([]);
                  setDataImported(false);
                  setDataUpstream([]);
                }}
              >
                Reset
              </Button>
            ) : null}
            <Button onClick={() => console.log(addData)}>Log</Button>
          </SpaceBetween>
        }
      >
        {label}
      </Header>
    ) : null,
    filter: !hideFilter ? (
      <TextFilter
        {...filterProps}
        countText={getTextFilterCounterText(Number(filteredItemsCount))}
        filteringAriaLabel={`Filter ${convertToTitleCase(label)}`}
        filteringPlaceholder="Search here"
      />
    ) : null,
    pagination: !hidePagination ? <Pagination {...paginationProps} /> : null,
    preferences: !hidePreferences ? (
      <Preferences
        preferences={preferences}
        setPreferences={setPreferences}
        contentDisplayPreference={getContentDisplayPreference(config.columns)}
        useWrapLinesPreference
        useStripedRowsPreference
      />
    ) : null,
    selectionType: 'multi',
    submitEdit: onSubmitEdit,
  };

  return type === INPUT_TYPES.MULTIPLE ? (
    <Table {...tableProps} />
  ) : (
    <>
      {!dataImported ? (
        <>
          <hr />
          <ColumnLayout columns={2}>
            <SpaceBetween size="xs" direction="vertical">
              <FormField label={`Import ${config.label} data`}>
                <FileUpload
                  onChange={({ detail }) => setFileUploadData(detail.value)}
                  value={fileUploadData}
                  i18nStrings={{
                    uploadButtonText: (e) =>
                      e ? 'Choose files' : 'Choose file',
                    dropzoneText: (e) =>
                      e ? 'Drop files to upload' : 'Drop file to upload',
                    removeFileAriaLabel: (e) => `Remove file ${e + 1}`,
                    limitShowFewer: 'Show fewer files',
                    limitShowMore: 'Show more files',
                    errorIconAriaLabel: 'Error',
                  }}
                  tokenLimit={3}
                  constraintText="Only .csv file is accepted"
                />
              </FormField>
              <Button variant="primary" onClick={csvParseToAPIFormat}>
                Parse file
              </Button>
            </SpaceBetween>
            {itemExists(importedCsvHeaders) ? (
              <SpaceBetween size="xs" direction="vertical">
                <Header variant="h3">Match column to CSV header field</Header>
                <SpaceBetween size="xs" direction="horizontal">
                  {config.columns.map((column, i) => (
                    <FormField
                      label={column.id}
                      description={column.type}
                      key={column.id}
                    >
                      <Select
                        selectedOption={
                          mappedColumnFields[i].value
                            ? toOptions(mappedColumnFields[i], 'value')
                            : null
                        }
                        options={importedCsvHeaders}
                        onChange={({ detail }) =>
                          onMatchColumnToCsvHeaderField(
                            mappedColumnFields[i].value
                              ? toOptions(mappedColumnFields[i], 'value')
                              : null,
                            detail.selectedOption,
                            column.id,
                          )
                        }
                      />
                    </FormField>
                  ))}
                </SpaceBetween>
              </SpaceBetween>
            ) : null}
          </ColumnLayout>
        </>
      ) : null}
      {dataImported ? <Table {...tableProps} /> : null}
    </>
  );
}
