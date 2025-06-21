import { create } from 'zustand';
import Pocketbase from 'pocketbase';
import { Density, Mode } from '@cloudscape-design/global-styles';
import { COLLECTION_NAMES } from '../lib/collections';
import { densityOpts, modeOpts } from '../lib/theme';
import { fetchPbRecordList } from '../utils/api';
import { pbRecordsToUseCollectionData, transformer } from '../utils/data';
import { POCKETBASE_URL } from '../lib/api';

const pb = new Pocketbase(POCKETBASE_URL);

const useMyStore = create((set) => ({
  HelpContent: null,
  pb,
  mode: modeOpts[Mode.Light],
  density: densityOpts[Density.Compact],
  flashbarItems: [],
  /**
   * @type {{
   *  collectionNames: string[],
   *  description: string,
   *  id: string,
   *  name: string,
   *  selected: boolean
   * }[]
   */
  [COLLECTION_NAMES.APPLICATIONS]: [],
  /**
   * @type {{
   *  date: string,
   *  amount: number,
   *  description: string,
   *  category: object,
   *  tags: object[]
   *  needs_review: boolean
   * }}
   */
  [COLLECTION_NAMES.FINANCES_LOG]: [],
  /**
   * @type {{
   *  category: string
   * }}
   */
  [COLLECTION_NAMES.FINANCES_CATEGORY]: [],
  /**
   * @type {{
   *  tag: string
   * }}
   */
  [COLLECTION_NAMES.FINANCES_TAG]: [],
  /**
   * @type {{
   *  date: string,
   *  amount: number,
   *  account_name: object,
   *  account_type: object,
   *  owner: object
   * }}
   */
  [COLLECTION_NAMES.FINANCES_BALANCE]: [],
  /**
   * @type {{
   *  name: string
   * }}
   */
  [COLLECTION_NAMES.FINANCES_BALANCE_ACCOUNT_NAME]: [],
  /**
   * @type {{
   *  name: string
   * }}
   */
  [COLLECTION_NAMES.FINANCES_BALANCE_OWNER]: [],
  /**
   * @type {{
   *  account_type: string,
   *  category: object
   * }}
   */
  [COLLECTION_NAMES.FINANCES_BALANCE_TYPE]: [],
  /**
   * @type {{
   *  date_uploaded: string,
   *  attachments: string[]
   * }}
   */
  [COLLECTION_NAMES.FINANCES_FILES]: [],
  /**
   * @type {{
   *  date: string,
   *  weight: number,
   *  unit: object,
   *  fat_mass: number,
   *  bone_mass: number,
   *  muscle_mass: number,
   *  hydration: number,
   *  comments: string,
   *  fat_mass_percentage: number,
   *  bone_mass_percentage: number,
   *  muscle_mass_percentage: number
   * }}
   */
  [COLLECTION_NAMES.HEALTH_WEIGHT_LOGS]: [],
  /**
   * @type {{
   *  type: string
   * }}
   */
  [COLLECTION_NAMES.HEALTH_MEASUREMENT_TYPE]: [],
  /**
   * @type {{
   *  date_uploaded: string,
   *  attachments: string[]
   * }}
   */
  [COLLECTION_NAMES.HEALTH_FILES]: [],
  /**
   * @type {{
   *  name: string,
   *  description: string,
   *  repeatSelection: select
   *  (repeatEveryXDay, repeatEveryWeekOnXDays, repeatEveryXDayOfMonth, repeatEveryYearOnXDayXMonth)
   *  repeatEveryXDay: number,
   *  repeatEveryWeekOnXDays: select (Sun, Mon, Tue, Wed, Thu, Fri, Sat)
   *  repeatEveryXDayOfMonth: number,
   *  repeatEveryYearOnXDay: number,
   *  repeatEveryYearOnXMonth: select (Jan, Feb, Mar, Apr, May, Jun, Jul, Aug, Sep, Oct, Nov, Dec)
   *  archived: boolean
   * }}
   */
  [COLLECTION_NAMES.HABITS]: [],
  /**
   * @type {{
   *  date: string,
   *  completed: boolean,
   *  current_relation: object,
   *  initial_habit: json
   * }}
   */
  [COLLECTION_NAMES.DAILIES]: [],
  /**
   * @type {{
   *  name: string,
   *  description: string
   * }}
   */
  [COLLECTION_NAMES.INVENTORY_CATEGORY]: [],
  /**
   * @type {{
   *  item: object,
   *  quantity: number,
   *  unit: object,
   *  location: object,
   *  expiration_date: string,
   *  notes: string
   * }}
   */
  [COLLECTION_NAMES.INVENTORY_ENTRY]: [],
  /**
   * @type {{
   *  name: string,
   *  description: string,
   *  category: object,
   *  default_location: object,
   *  default_unit: object,
   *  minimum_stock: number
   * }}
   */
  [COLLECTION_NAMES.INVENTORY_ITEM]: [],
  /**
   * @type {{
   *  name: string,
   *  description: string
   * }}
   */
  [COLLECTION_NAMES.INVENTORY_LOCATION]: [],
  /**
   * @type {{
   *  name: string,
   *  abbreviation: string
   * }}
   */
  [COLLECTION_NAMES.INVENTORY_UNIT]: [],
  setDataInStore: (store, data) =>
    set((state) => {
      if (!Object.keys(state).includes(store)) {
        throw new Error('setDataInStore: store is not an existing store');
      }

      return { [store]: data };
    }),
  replaceItemInStore: (store, item) =>
    set((state) => {
      if (!Object.keys(state).includes(store)) {
        throw new Error('replaceItemInStore: store is not an existing store');
      }

      const data = state[store];

      if (!Array.isArray(data)) {
        throw new Error('replaceItemInStore: data store is not an array');
      }

      const dataCopy = [...data];
      const index = data.findIndex((el) => el.id === item.id);
      dataCopy[index] = item;
      return { [store]: dataCopy };
    }),
  addItemToStore: (store, item) =>
    set((state) => {
      if (!Object.keys(state).includes(store)) {
        throw new Error('addItemToStore: store is not an existing store');
      }

      const data = state[store];

      if (!Array.isArray(data)) {
        throw new Error('addItemToStore: data store is not an array');
      }

      const newData = [item, ...data];
      return { [store]: newData };
    }),
  toggleDataStore: (store) =>
    set((state) => {
      if (!Object.keys(state).includes(store)) {
        throw new Error('toggleDataStore: store is not an existing store');
      }
      return { [store]: !state[store] };
    }),
  removeItemInStore: (store, id) =>
    set((state) => {
      if (!Object.keys(state).includes(store)) {
        throw new Error('removeItemInStore: store is not an existing store');
      }

      const data = state[store];

      if (!Array.isArray(data)) {
        throw new Error('removeItemInStore: data store is not an array');
      }

      const newData = data.filter((el) => el.id !== id);
      return { [store]: newData };
    }),
  fetchPbRecordList: (config) =>
    set(async (state) => {
      const result = await fetchPbRecordList(state.pb, {
        collectionName: config.collection,
        expandFields: Array.isArray(config.columns)
          ? config.columns
              .filter((el) => el.expandFields)
              .map((ele) => ele.expandFields)
          : undefined,
        sort: config.sort,
      });

      const transformedResult = pbRecordsToUseCollectionData(
        result,
        transformer,
        config,
      );

      state.setDataInStore(config.collection, transformedResult);
    }),
}));

export default useMyStore;
