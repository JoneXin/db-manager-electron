<template>
  <div>
    <DraggableModal
      v-model:visible="batchDeleteState.isShowModel"
      title="请核对清空列表"
      width="600px"
    >
      <template #footer>
        <a-button key="back" @click="() => (batchDeleteState.isShowModel = false)">取消</a-button>
        <a-button type="primary" @click="sendBatchDeleteRequest">确定</a-button>
      </template>
      <div class="">
        <div v-for="item in dbStore.selectDbTreeNode" :key="item">
          <p style="margin-bottom: 5px"
            ><a-tag color="red">
              <template #icon>
                <img class="icon" src="../../../../assets/icon/db.svg" alt="" />
              </template>
              {{ formatTreeNodes(item).dbName }}:
            </a-tag></p
          >
          <a-tag color="success" v-for="table in formatTreeNodes(item).tableList" :key="table">
            <template #icon>
              <img class="icon" src="../../../../assets/icon/table.svg" alt="" />
            </template>
            {{ table }}
          </a-tag>
        </div>
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
  import { TrucateClearConf } from '../../../../typings';

  const dbStore = useDbStore();
  const sysStore = useSystemStore();

  const batchDeleteState = reactive({
    isShowModel: false,
  });

  /**
   * 导出选中的 数据库结构
   */
  const sendBatchDeleteRequest = async () => {

    const deleteItem: Array<TrucateClearConf> = dbStore.selectDbTreeNode.map((item) =>
      formatTreeNodes(item),
    );
    if (!deleteItem.length) return $message.warning("没有选择表！")
    batchDeleteState.isShowModel = false;
    dbStore.loadingTree = true;
    // 清空所在的表数据
    try {
      await dbStore.handleTrucate(deleteItem);
      $message.info('清空完成!');
    } catch (error) {
        $message.warning(JSON.stringify(error));
    }
    dbStore.loadingTree = false;
  };

  const formatTreeNodes = (dbNode: any): TrucateClearConf => {
    if (dbNode.children.length) {
      return {
        dbName: dbNode.name,
        tableList: dbNode.children.map((v: any) => v.name),
        trucateDb: false,
      };
    }

    return {
      dbName: dbNode.name,
      tableList: ['所有表'],
      trucateDb: true,
    };
  };

  defineExpose({ batchDeleteState });
</script>

<style scoped lang="less">
  @import './index.less';
  .icon {
    height: 10px !important;
    width: 10px !important;
  }
</style>
