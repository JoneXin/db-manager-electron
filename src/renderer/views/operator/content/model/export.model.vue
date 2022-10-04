<template>
  <div>
    <DraggableModal v-model:visible="exportModelState.isShowModel" title="导出详情" width="600px">
      <template #footer>
        <a-button key="back" @click="() => (exportModelState.isShowModel = false)">取消</a-button>
        <a-button type="primary" @click="sendExportSqlRequest">确定</a-button>
      </template>
      <div class="form-box">
        <p class="tips"
          ><img src="../../../../assets/icon/tips.svg" alt="" /> 提示:
          多个不同库会按照库名做为文件名，会强制覆盖相同命名的文件，请悉知!</p
        >
        <label for="isExportTableData">
          <span class="text">导出数据:</span>
          <a-radio-group
            v-model:value="exportModelState.isExportTableData"
            name="isExportTableData"
            class="force-update-box"
          >
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </label>
        <label for="isExportTableOtherStruct">
          <span class="text">导出纯表结构:</span>
          <a-radio-group
            v-model:value="exportModelState.isExportPureStruct"
            name="isExportTableOtherStruct"
            class="force-update-box"
          >
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </label>
        <label for="isAutoCreateDb">
          <span class="text">自动建库:</span>
          <a-radio-group
            v-model:value="exportModelState.isAutoCreateDb"
            name="isAutoCreateDb"
            class="force-update-box"
          >
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </label>
        <label for="isForceUpdate">
          <span class="text">是否覆盖目标库:</span>
          <a-radio-group
            v-model:value="exportModelState.isForceUpdateDb"
            name="isForceUpdate"
            class="force-update-box"
          >
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </label>
        <label for="isForceUpdate">
          <span class="text">是否覆盖目标表:</span>
          <a-radio-group
            v-model:value="exportModelState.isForceUpdateTable"
            name="isForceUpdate"
            class="force-update-box"
          >
            <a-radio :value="true">是</a-radio>
            <a-radio :value="false">否</a-radio>
          </a-radio-group>
        </label>
        <label for="path">
          <span class="text">导出路径:</span>
          <a-radio-group
            v-model:value="exportModelState.isForceUpdateTable"
            name="path"
            class="force-update-box"
          >
            <a-button @click="() => sysStore.showSelectPathModel()">选择导出路径</a-button>
          </a-radio-group>
        </label>
        <span class="text-path">{{ sysStore.selectPath }}</span>
      </div>
    </DraggableModal>
  </div>
</template>

<script setup lang="ts">
  import { message as $message } from 'ant-design-vue';
  import { DraggableModal } from '../../../../components/draggable-modal/index';
  import { useDbStore } from '../../../../store/modules/db';
  import { useSystemStore } from '../../../../store/modules/system';
  import { computed, onMounted, reactive, ref, watch } from 'vue';
  import Tree from '../../../../components/tree/index.vue';
  import { compareDbSynclist } from '../../../../api/system';
  import { formatCheckedNodes } from '../../../../utils/tool';
  import { sendExportRequest } from '../../../../api/database/index';

  const dbStore = useDbStore();
  const sysStore = useSystemStore();

  const exportModelState = reactive({
    isShowModel: false,
    isExportTableData: false,
    isExportPureStruct: false,
    isAutoCreateDb: true,
    isForceUpdateDb: false,
    isForceUpdateTable: true,
  });

  /**
   * 导出选中的 数据库结构
   */
  const sendExportSqlRequest = async () => {
    const curConnInfo = dbStore.currentOperatoeConnInfo;
    // request
    await sendExportRequest({
      connInfo: curConnInfo,
      isExportTableData: exportModelState.isExportTableData,
      isExportPureStruct: exportModelState.isExportPureStruct,
      isAutoCreateDb: exportModelState.isAutoCreateDb,
      isForceUpdateDb: exportModelState.isForceUpdateDb,
      isForceUpdateTable: exportModelState.isForceUpdateTable,
      dbTreeList: dbStore.selectDbTreeNode,
      path: sysStore.selectPath,
    });

    $message.success('成功加入任务队列!');

    exportModelState.isShowModel = false;
  };

  const selectExportPath = () => {};

  defineExpose({ exportModelState });
</script>

<style scoped lang="less">
  @import './index.less';
  .form-box {
    text-align: center;
    .tips {
      color: red;

      img {
        height: 18px;
        width: 18px;
      }
    }
    .text-path {
      color: #dc6b82;
    }
  }
</style>
