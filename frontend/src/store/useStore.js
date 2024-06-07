import { create } from 'zustand';
import Pocketbase from 'pocketbase';
import { Density, Mode } from '@cloudscape-design/global-styles';
import { COLLECTION_NAMES } from '../lib/collections';
import { densityOpts, modeOpts } from '../lib/theme';

const pb = new Pocketbase('http://127.0.0.1:8090');

const useMyStore = create((set) => ({
  HelpContent: () => {},
  pb,
  mode: modeOpts[Mode.Light],
  density: densityOpts[Density.Compact],
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
   *  category: {},
   *  tags: {}
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
        throw new Error('replaceItemInStore: data store is not an array');
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
}));

export default useMyStore;
