<template>
  <div>
    <DraggableModal
      v-model:visible="syncModelState.isShowModel"
      title="批量同步数据和结构"
      width="800px"
    >
      <template #footer>
        <a-button type="dashed" danger @click="compareInfo">比对</a-button>
        <a-button
          key="back"
          @click="
            () => {
              syncModelState.isShowModel = false;
              syncModelState.treeData = [];
            }
          "
          >取消</a-button
        >
        <a-button type="primary" @click="sendSyncRequest">确定</a-button>
      </template>
      <a-tabs v-model:activeKey="syncModelState.activeKey">
        <a-tab-pane key="1" tab="基本信息" class="sync_content">
          <div class="form-box">
            <label for="conn_list">
              <span class="text">源连接:</span>
              <a-select
                name="conn_list"
                ref="select"
                v-model:value="dbStore.currentOperatoeConnInfo.connection_name"
                disabled
                style="width: 300px; padding-top: 5px !important"
                :options="[dbStore.currentOperatoeConnInfo]"
              >
              </a-select>
            </label>
            <label for="conn_list">
              <span class="text">目标连接:</span>
              <a-select
                name="conn_list"
                ref="select"
                v-model:value="syncModelState.aimConnName"
                style="width: 300px; padding-top: 5px !important"
                :options="selectOptions"
              ></a-select>
            </label>
            <label for="isForceUpdate">
              <span class="text">强制更新:</span>
              <a-radio-group
                v-model:value="syncModelState.isForceUpdate"
                name="isForceUpdate"
                class="force-update-box"
              >
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </label>
            <label for="isSyncTableData">
              <span class="text">同步数据:</span>
              <a-radio-group
                v-model:value="syncModelState.isSyncTableData"
                name="isSyncTableData"
                class="force-update-box"
              >
                <a-radio :value="true">是</a-radio>
                <a-radio :value="false">否</a-radio>
              </a-radio-group>
            </label>
          </div>
        </a-tab-pane>
        <a-tab-pane key="2" tab="对比详情" force-render class="sync_content">
          <Tree
            :tree-data="syncModelState.treeData"
            @check="getCheckList"
            :forceUpdate="syncModelState.isForceUpdate"
          ></Tree>
        </a-tab-pane>
      </a-tabs>
    </DraggableModal>
  </div>
</template>

<script setup lang="ts">
  import { message as $message } from 'ant-design-vue';
  import { DraggableModal } from '../../../../components/draggable-modal/index';
  import { useDbStore } from '../../../../store/modules/db';
  import { computed, onMounted, reactive, ref, watch } from 'vue';
  import Tree from '../../../../components/tree/index.vue';
  import { compareDbSynclist } from '../../../../api/system';
  import { formatCheckedNodes } from '../../../../utils/tool';
  import { sendSyncDbRequest } from '../../../../api/database/index';

  const syncModelState = reactive({
    isShowModel: false,
    aimConnName: '',
    isForceUpdate: true,
    isSyncTableData: false,
    activeKey: '1',
    treeData: [],
    syncList: [],
  });

  const dbStore = useDbStore();

  onMounted(() => {});

  const selectOptions = computed(() =>
    dbStore.connectionList.map((item) => ({
      value: item.connection_name,
      label: item.connection_name,
    })),
  );

  watch(
    () => syncModelState.isShowModel,
    (val) => {
      if (!val) return;
      syncModelState.aimConnName = dbStore.connectionList[0].connection_name;
    },
  );

  /**
   * 比对同步的库
   */
  const compareInfo = async () => {
    const orginConnInfo = dbStore.currentOperatoeConnInfo;
    const aimConnInfo = dbStore.getConnectionInfoByConnName(syncModelState.aimConnName);

    // 发送比对请求
    syncModelState.treeData = await compareDbSynclist(
      orginConnInfo,
      aimConnInfo,
      dbStore.selectDbTreeNode,
    );

    // 跳转到对比详情
    syncModelState.activeKey = '2';
  };

  /**
   * 同步请求
   */
  const sendSyncRequest = () => {
    const orginConnInfo = dbStore.currentOperatoeConnInfo;
    const aimConnInfo = dbStore.getConnectionInfoByConnName(syncModelState.aimConnName);
    // 清空对比树
    // syncModelState.treeData = [];

    // 添加任务队列
    // 发送同步请求
    const res = sendSyncDbRequest({
      dbTreeList: syncModelState.syncList.length
        ? syncModelState.syncList
        : dbStore.selectDbTreeNode,
      aimConnInfo,
      orginConnInfo,
      isSyncTableData: syncModelState.isSyncTableData,
      isForceUpdate: syncModelState.isForceUpdate,
    });

    console.log(res);
  };

  /**
   * 获取checkedlist 列表
   */
  const getCheckList = (key: string, nodes: any) => {
    // 选中集合
    let checkList = nodes.checkedNodes.sort((pre: any, next: any) => (pre.key < next.key ? -1 : 1));
    // 格式化 and 同步到 store
    syncModelState.syncList = formatCheckedNodes(checkList, dbStore);
  };

  defineExpose({ syncModelState });
</script>

<style scoped lang="less">
  @import './index.less';
</style>
