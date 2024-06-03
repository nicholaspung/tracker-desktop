import { create } from 'zustand';
import Pocketbase from 'pocketbase';
import { COLLECTION_NAMES } from '../lib/collections';

const pb = new Pocketbase('http://127.0.0.1:8090');

const useMyStore = create((set) => ({
  pb,
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
      if (!state[store]) {
        throw new Error('setDataInStore: store is not an existing store');
      }

      return { [store]: data };
    }),
  replaceItemInStore: (store, item) =>
    set((state) => {
      if (!state[store]) {
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
}));

export default useMyStore;
