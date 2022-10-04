<template>
  <div class="content-box" ref="contentRef">
    <div class="operator-box">
      <a-button class="btn" @click="dbStore.queryBySql">查询</a-button>
      <a-button class="btn" @click="exportDataStruct">导出数据结构</a-button>
      <a-button class="btn" @click="syncDataStruct">批量同步数据结构</a-button>
      <a-button class="btn"  >批量按条件删除数据</a-button>
      <a-button class="btn" @click="batchDelete">批量清空数据</a-button>
      <a-button class="btn" @click="importDataBySql">从.sql导入</a-button>
    </div>
    <div class="detail-box" ref="leftDetailRef">
      <div class="left-detail">
        <router-view #="{ Component }"> <component :is="Component" /> </router-view
      ></div>
      <ResultContainer class="right-detail"></ResultContainer>
    </div>
    <SyncModel ref="syncModelRef"></SyncModel>
    <ExportModel ref="exportModelRef"></ExportModel>
<BatchDeleteModel ref="batchDeleteModelRef"></BatchDeleteModel>
    <FileSelectModel
      :isShowModel="sysStore.isShowPathSelectModel"
      @updateShowStatus="
        (val) => {
          sysStore.isShowPathSelectModel = val;
        }
      "
      @ok="(val) => sysStore.setSelectPath(val)"
      @getFileChildren="getFileChildren"
      @select="handleSelectFileTree"
      :initFileTreeData="state.fileTreeData"
      :selectInfo="state.selectInfo"
    ></FileSelectModel>
  </div>
</template>

<script setup lang="ts">
  import { useDbStore } from '../../../store/modules/db';
  import { useSystemStore } from '../../../store/modules/system';
  import SyncModel from './model/sync.model.vue';
  import ExportModel from './model/export.model.vue';
  import BatchDeleteModel from './model/batch.delete.model.vue';
  import { onMounted, reactive, ref } from 'vue';
  import ResultContainer from './result/index.vue';
  import FileSelectModel from '../../../components/model-file-tree/index.vue';
  import { getFileChilren, getFileDetail } from '../../../api/file';
  import { message as $message, TreeProps } from 'ant-design-vue';

  const state = reactive({
    isShowImportModel: false,
    fileTreeData: [],
    timmer: 0,
    selectInfo: {},
  });

  interface TreeListConf {
    root: number;
    path: string;
  }

  interface FilePathConf {
    name: string;
    type: number;
    path: string;
  }

  const contentRef = ref();
  const leftDetailRef = ref();
  const syncModelRef = ref();
  const exportModelRef = ref();
  const fileSelectModelRef = ref();
  const batchDeleteModelRef = ref();

  const dbStore = useDbStore();
  const sysStore = useSystemStore();

  onMounted(() => {
    getFileTreeList({ root: 1, path: '' });
    initEvents();
  });

  const initEvents = () => {};

  const querySql = () => {};

  /**
   * 同步数据结构
   */
  const syncDataStruct = () => {
    syncModelRef.value.syncModelState.isShowModel = true;
    syncModelRef.value.syncModelState.activeKey = '1';
  };

  /**
   * 批量清空数据
   */
  const batchDelete = () => {
    batchDeleteModelRef.value.batchDeleteState.isShowModel = true;
  }

  /**
   * 导出sql
   */
  const exportDataStruct = () => {
    exportModelRef.value.exportModelState.isShowModel = true;
  };

  /**
   * 导入.sql
   */
  const importDataBySql = () => {
    sysStore.showSelectPathModel();
  };

  const handleSelectPath = (path: string) => {};

  const getFileTreeList = async (param: TreeListConf) => {
    const data = await getFileChilren(param);

    state.fileTreeData = data.map((item: FilePathConf) => ({
      title: item.name,
      key: item.name + Math.random() * 10,
      isLeaf: item.type == 1 ? true : false,
      path: item.path,
      type: item.type,
    }));
  };

  const getFileChildren: TreeProps['loadData'] = async (treeNode) => {
    state.timmer && clearTimeout(state.timmer);
    state.timmer = setTimeout(async () => {
      let fileList = await getFileChilren({ path: treeNode.path, root: 0 });
      //@ts-ignore
      treeNode.dataRef.children = fileList.map((item: FilePathConf) => ({
        title: item.name,
        key: item.name + Math.random() * 10,
        isLeaf: item.type == 1 ? true : false,
        path: item.path,
        type: item.type,
      }));

      state.fileTreeData = [...state.fileTreeData];

      clearTimeout(state.timmer);
    }, 100);
  };

  /**
   *
   */
  const handleSelectFileTree = async (key: string, e: any) => {
    const { node } = e;

    let res = await getFileDetail(node.path);
    state.selectInfo = {
      ...res,
      key,
    };
  };
</script>

<style scoped lang="less">
  .content-box {
    height: 100%;
    padding: 10px;
    flex: 1;
    border-radius: 15px;
    box-shadow: 2px 2px 10px 2px rgba(128, 128, 128, 0.699);
    background-color: white;
    margin: 0 20px;
    > .operator-box {
      height: 50px;
      display: flex;
      flex-wrap: wrap;
      align-items: center;
      border-radius: 15px;
      // background-color: antiquewhite;
      box-shadow: 0px 0px 10px inset gray;
      button {
        margin-left: 20px;
        // margin-top: 30px;
      }
      .btn {
        color: whitesmoke;
        transition: all ease-in-out 0.2s;
        background: linear-gradient(135deg, #97abff, #123597);
        border-radius: 15px;
        border: none;
        &:hover {
          // box-shadow: 0px 0px 10px inset rgba(128, 128, 128, 0.39);
          scale: 1.1;
          color: #6be676;
        }
      }
      // border-radius: ;
    }
    > .detail-box {
      display: flex;
      margin-top: 10px;
      height: calc(100vh - 240px);
      // border: 1px solid;

      border-radius: 15px;
      > .left-detail {
        flex: 1;
        min-width: 300px;
        max-width: 600px;
        border-right: 1px solid rgba(128, 128, 128, 0.473);
        margin-right: 10px;
        box-shadow: 0px 0px 10px inset gray;
        border-radius: 15px;
      }
      > .right-detail {
        position: relative;
        height: 100%;
        width: 80%;
        max-width: 1000px;
        min-width: 200px;
        height: 450px;
        box-shadow: 0px 0px 10px inset gray;
        border-radius: 15px;

        > .divider {
          // position: absolute;
          // left: 0;
          // top: 0;
          // // height: 100%;
          // width: 2px;
          // background-color: red;
        }
      }
    }
  }

  .divder-hover {
    height: 100%;
    width: 2px;
    background-color: red;
    box-shadow: 0px 0px 15px red;
    cursor: e-resize;
  }
</style>
