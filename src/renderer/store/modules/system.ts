import { AceTips } from './../../typings';
import { defineStore } from 'pinia';
import { store } from '../../store';

interface SystemType {
  resultLoading: boolean;
  menuLoading: boolean;
  tipsList: Array<AceTips>;
  isShowPathSelectModel: boolean;
  selectPath: string;
}

export const useSystemStore = defineStore({
  id: 'system',
  state: (): SystemType => ({
    resultLoading: false,
    menuLoading: false,
    tipsList: [],
    isShowPathSelectModel: false,
    selectPath: '',
  }),
  getters: {},
  actions: {
    showResultLoading() {
      this.resultLoading = true;
    },
    hideResultLoading() {
      this.resultLoading = false;
    },
    showMenuLoading() {
      this.menuLoading = true;
    },
    hideMenuLoading() {
      this.menuLoading = false;
    },
    setSelectPath(path: string) {
      this.selectPath = path;
    },
    showSelectPathModel() {
      this.isShowPathSelectModel = true;
    },
    hideSelectPathModel() {
      this.isShowPathSelectModel = false;
    },
  },
});

export function useSystemStoreWithOut() {
  return useSystemStore(store);
}
