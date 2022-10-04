<template>
  <div class="result-container">
    <div class="tool-box">
      <a-button class="btn">保存</a-button>
    </div>
    <div class="result">
      <a-spin :spinning="systemStore.resultLoading">
        <a-table
          :columns="dbStore.currentSearchResultColum"
          :data-source="dbStore.currentSearchResult"
          :pagination="false"
          :scroll="{ y: 450 }"
          class="result-table"
          bordered
          @resizeColumn="resultState.handleResizeColumn"
        >
          <template #headerCell="{ column }">
            <p style="color: #d8770b; font-weight: 600">{{ column.title }}</p>
          </template>
          <template #bodyCell="{ column, record }">
            <a-input type="" name="" :value="record[column.title]" class="tableCell" />
          </template>
        </a-table>
        <div class="pagination">
          <a-pagination size="small" :total="50" show-size-changer show-quick-jumper />
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script setup lang="ts">
  import { useDbStore } from '../../../../store/modules/db';
  import { useSystemStore } from '../../../../store/modules/system';
  import { SmileOutlined, DownOutlined } from '@ant-design/icons-vue';
  import { computed, onMounted, reactive } from 'vue';

  const resultState = reactive({
    data: [{ uid: 1 }],
    currentPage: 1,
    handleResizeColumn: (w: any, col: { width: any }) => {
      col.width = w;
    },
  });

  const dbStore = useDbStore();
  const systemStore = useSystemStore();

  onMounted(() => {});
</script>

<style lang="less">
  .ant-table-tbody > tr > td {
    padding: 0 !important;
  }
</style>
<style scoped lang="less">
  .result-container {
    width: calc(100vw - 640px);
    height: 100% !important;
    padding: 15px;
    // height: calc(100vh - 240px) !important;
    .tool-box {
      display: flex;
      align-items: center;
      // padding: 10px;
      height: 50px;
      // background-color: #97abff;
      // border-bottom: 1px solid #83baee;
      background-color: white;
      box-shadow: 2px 2px 10px 2px rgba(128, 128, 128, 0.623);
      border-radius: 20px;
      margin-bottom: 10px;
      padding: 0 10px;
    }
    .result {
      height: calc(100% - 60px);
      width: 100%;
      overflow: scroll;
      border-radius: 15px;
      // padding: 10px;/
      box-sizing: border-box;
      // background-color: #97abff;
      .result-table {
        height: 87% !important;
      }
      .tableCell {
        height: 98%;
        width: 98%;
        border: none;
      }
      .pagination {
        display: flex;
        justify-content: flex-end;
        margin-top: 10px;
      }
    }
  }
  .btn {
    width: 100px;
    color: white !important;
    transition: all ease-in-out 0.2s;
    background: linear-gradient(135deg, #97abff, #123597);
    border-radius: 15px;
    border: none;
    span {
      color: white;
    }
    &:hover {
      // box-shadow: 0px 0px 10px inset rgba(128, 128, 128, 0.39);
      scale: 1.1;
      color: #6be676;
    }
  }
</style>
