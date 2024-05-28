import { create } from 'zustand';
import Pocketbase from 'pocketbase';
import { STORE_NAMES } from '../lib/store';

const pb = new Pocketbase('http://127.0.0.1:8090');

const useMyStore = create((set) => ({
  pb,
  /**
   * [
   *  {
   *    collectionId: string,
   *    collectionName: string,
   *    collectionNames: []string,
   *    created: date string,
   *    description: string,
   *    id: string,
   *    name: string,
   *    selected: boolean,
   *    updated: date string
   *  }
   * ]
   */
  [STORE_NAMES.APPLICATIONS]: [],
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
