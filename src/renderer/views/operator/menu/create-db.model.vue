<template>
  <div>
    <a-modal v-model:visible="dbCreaterModelState.isShowModel" title="新建数据库">
      <template #footer>
        <a-button key="back" @click="hideModel">取消</a-button>
        <a-button type="primary" @click="sendCreateRequest">确定</a-button>
      </template>
      <div class="form-box">
        <label for="database">
          <span class="text"><span style="color: red">*</span>数据库:</span>
          <a-input
            name="database"
            style="width: 400px"
            v-model:value="dbCreaterModelState.dbDetail.database"
            placeholder="数据库名称"
          />
        </label>
        <label for="encode">
          <span class="text">编码:</span>
          <a-select
            v-model:value="dbCreaterModelState.dbDetail.encode"
            size="large"
            style="width: 400px"
            :options="dbCreaterModelState.encodeOptions"
          ></a-select>
        </label>
        <label for="sortRules">
          <span class="text">排序规则:</span>
          <a-select
            v-model:value="dbCreaterModelState.dbDetail.sortRules"
            size="large"
            style="width: 400px"
            :options="dbCreaterModelState.sortRulesOptions"
          ></a-select>
        </label>
      </div>
    </a-modal>
  </div>
</template>

<script setup lang="ts">
  import { message as $message } from 'ant-design-vue';
  import { useDbStore } from '../../../store/modules/db';
  import { onMounted, reactive, ref, watch } from 'vue';
  import { UpdateConnectionConf } from '../../../api/connection/model';
  import { DbCreateDetail } from '../../../typings';
  import { createDatabase } from '../../../api/database';

  const dbCreaterModelState = reactive({
    isShowModel: false,
    dbDetail: {
      encode: 'utf8',
      sortRules: 'utf8_general_ci',
    } as DbCreateDetail,
    encodeOptions: [],
    sortRulesOptions: [],
  });
  const dbStore = useDbStore();

  onMounted(() => {});

  const props = defineProps({
    isShowModel: {
      type: Boolean,
      default: false,
    },
  });

  const emit = defineEmits(['updateShowStatus']);

  watch(
    () => props.isShowModel,
    (val) => (dbCreaterModelState.isShowModel = val),
  );

  const hideModel = () => {
    dbCreaterModelState.isShowModel = false;
    emit('updateShowStatus', false);
    dbCreaterModelState.dbDetail.database = '';
  };

  const validate = (): boolean => {
    const dbName = dbCreaterModelState.dbDetail.database;
    if (!dbName) {
      $message.warning('数据库名称忘记填了哟！亲');
      return false;
    }

    return true;
  };

  // 创建库
  const sendCreateRequest = async () => {
    if (!validate()) return;
    await createDatabase(dbCreaterModelState.dbDetail, dbStore.currentOperatoeConnInfo);
    await dbStore.getDatabasesList();
    hideModel();
  };
</script>

<style scoped lang="less">
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
