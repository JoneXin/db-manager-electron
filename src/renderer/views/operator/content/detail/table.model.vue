<template>
  <div>
    <DraggableModal
      v-model:visible="tableCreaterModelState.isShowModel"
      title="新增表"
      width="900px"
    >
      <template #footer>
        <a-button key="back" @click="hideModel">取消</a-button>
        <a-button type="primary" @click="sendCreateRequest">确定</a-button>
      </template>

      <MysqlDynamicForm ref="tableInfoRef"></MysqlDynamicForm>
    </DraggableModal>
  </div>
</template>

<script setup lang="ts">
  import { message as $message } from 'ant-design-vue';
  import { useDbStore } from '../../../../store/modules/db';
  import { onMounted, reactive, ref, watch } from 'vue';
  import { UpdateConnectionConf } from '../../../../api/connection/model';
  import { DbCreateDetail } from '../../../../typings';
  import { createDatabase } from '../../../../api/database';
  import MysqlDynamicForm from '../../../../components/mysql-dynamic-form/index.vue';
  import { createTable } from '../../../../api/table';
  import { formartTableInfo } from '../../../../utils/tool';

  const tableCreaterModelState = reactive({
    isShowModel: false,
  });
  const dbStore = useDbStore();

  const tableInfoRef = ref();

  onMounted(() => {});

  const props = defineProps({
    isShowModel: {
      type: Boolean,
      default: false,
    },
    dbName: {
      type: String,
      default: '',
    },
  });

  const emit = defineEmits(['updateShowStatus', 'refresh']);

  watch(
    () => props.isShowModel,
    (val) => (tableCreaterModelState.isShowModel = val),
  );

  const hideModel = () => {
    tableCreaterModelState.isShowModel = false;
    emit('updateShowStatus', false);
  };

  // 创建表
  const sendCreateRequest = async () => {
    const tableColumesList = tableInfoRef.value.dynamicValidateForm.rows;
    const indexInfoList = tableInfoRef.value.IndexFrom.rows;
    const tableName = tableInfoRef.value.tableName;

    const formartedList = formartTableInfo(tableColumesList);

    try {
      //   await tableInfoRef.value.tableItemRef.value.validateFields();
      //   await tableInfoRef.value.indexRef.value.validateFields();
      console.log(props.dbName);

      await createTable(
        {
          tableInfo: formartedList,
          indexInfo: indexInfoList,
          tableName,
          dbName: props.dbName,
        },
        dbStore.currentOperatoeConnInfo,
      );
      hideModel();
      emit('refresh');
    } catch (_) {
      console.log(_);
    }
  };
</script>

<style scoped lang="less">
  .content {
    // max-height: 400px;
    overflow: scroll;
  }
  .form-box {
    > label {
      display: flex;
      margin: 10px;
      .text {
        width: 100px;
        height: 40px;
        line-height: 40px;
        text-align: right;
        padding-right: 15px;
      }
    }
  }
</style>
