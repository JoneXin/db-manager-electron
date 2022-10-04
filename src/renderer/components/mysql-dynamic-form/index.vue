<template>
  <div class="dynamic-form-container">
    <a-tabs v-model:activeKey="mysqlModelState.activeKey">
      <a-tab-pane key="1" tab="字段信息" class="sync_content">
        <div class="table-name">
          <a-form-item
            :name="[]"
            label="表名"
            :rules="{
              required: true,
              message: '缺少字段名',
            }"
          >
            <a-input v-model:value="tableName" />
          </a-form-item>
          <div class="add-item">
            <a-button type="dashed" block @click="addMysqlRow" style="margin-top: 10px">
              <PlusOutlined />
              新增字段
            </a-button>
          </div>
        </div>
        <div class="title">
          <p>字段名</p>
          <p>类型</p>
          <p>长度</p>
          <p>小数点</p>
          <p>不是Null</p>
          <p>虚拟</p>
          <p>键</p>
          <p>注释</p>
          <p style="width: 35px">操作</p>
        </div>
        <a-form ref="tableItemRef" name="dynamic_form_nest_item" :model="dynamicValidateForm">
          <div class="form-table">
            <div class="item" v-for="(rowConf, index) in dynamicValidateForm.rows">
              <a-form-item
                :name="[]"
                :rules="{
                  required: true,
                  message: '缺少字段名',
                }"
              >
                <a-input v-model:value="rowConf.key" />
              </a-form-item>
              <a-form-item :name="[]">
                <a-select
                  v-model:value="rowConf.type"
                  show-search
                  :options="
                    mysqlTypeOptions.map((v) => ({
                      value: v.value.toLocaleLowerCase(),
                    }))
                  "
                ></a-select>
              </a-form-item>
              <a-form-item :name="['length']">
                <a-input v-model:value="rowConf.length" />
              </a-form-item>
              <a-form-item :name="['decimalPoint']">
                <a-input v-model:value="rowConf.decimalPoint" />
              </a-form-item>
              <a-form-item :name="['isNull']">
                <a-select
                  v-model:value="rowConf.isNull"
                  show-search
                  :options="[{ value: '是' }, { value: '否' }]"
                ></a-select>
              </a-form-item>
              <a-form-item :name="['virtual']">
                <a-select
                  v-model:value="rowConf.virtual"
                  show-search
                  :options="[{ value: '是' }, { value: '否' }]"
                ></a-select>
              </a-form-item>
              <a-form-item :name="['primaryKey']">
                <a-select
                  v-model:value="rowConf.primaryKey"
                  show-search
                  :options="[{ value: '是' }, { value: '否' }]"
                ></a-select>
              </a-form-item>
              <a-form-item :name="['annotation']">
                <a-input v-model:value="rowConf.annotation" />
              </a-form-item>
              <i class="minus-row" @click="removeRow(rowConf)"
                ><img src="../../assets/icon/minus_table_row.svg" alt=""
              /></i>
            </div>
          </div>
        </a-form>
      </a-tab-pane>
      <a-tab-pane key="2" tab="索引信息" force-render class="sync_content2">
        <div class="add-item">
          <a-button
            type="dashed"
            block
            @click="addIndexRow"
            style="margin-bottom: 10px; width: 150px"
          >
            <PlusOutlined />
            新增索引
          </a-button>
        </div>
        <div class="title">
          <p>索引名称</p>
          <p>字段</p>
          <p>索引类型</p>
          <p>索引方法</p>
          <p>注释</p>
          <p style="width: 35px">操作</p>
        </div>
        <a-form ref="indexRef" name="dynamic_form_nest_item" :model="IndexFrom">
          <div class="form-table">
            <div class="item" v-for="(rowConf, index) in IndexFrom.rows">
              <a-form-item
                :name="[]"
                :rules="{
                  required: true,
                  message: '名称',
                }"
              >
                <a-input v-model:value="rowConf.key" />
              </a-form-item>

              <a-form-item :name="['columeKey']">
                <a-select
                  v-model:value="rowConf.columeKey"
                  mode="multiple"
                  show-search
                  :options="
                    dynamicValidateForm.rows.map((v) => ({
                      value: v.key,
                    }))
                  "
                ></a-select>
              </a-form-item>
              <a-form-item :name="[]">
                <a-select
                  v-model:value="rowConf.type"
                  show-search
                  :options="mysqlIndexType"
                ></a-select>
              </a-form-item>
              <a-form-item :name="['func']">
                <a-select
                  v-model:value="rowConf.func"
                  show-search
                  :options="mysqlIndexFunc"
                ></a-select>
              </a-form-item>

              <a-form-item :name="['annotation']">
                <a-input v-model:value="rowConf.annotation" />
              </a-form-item>
              <i class="minus-row" @click="removeIndexRow(rowConf)"
                ><img src="../../assets/icon/minus_table_row.svg" alt=""
              /></i>
            </div>
          </div>
        </a-form>
      </a-tab-pane>
    </a-tabs>
  </div>
</template>

<script setup lang="ts">
  import { MinusCircleOutlined, PlusOutlined } from '@ant-design/icons-vue';
  import { reactive, ref, watch } from 'vue';
  import type { FormInstance } from 'ant-design-vue';
  import { MysqlColum, MysqlIndex } from '../../typings';
  import { mysqlTypeOptions, mysqlIndexType, mysqlIndexFunc } from './constant';

  const tableItemRef = ref<FormInstance>();
  const indexRef = ref<FormInstance>();

  const tableName = ref('');
  // 表字段form
  const dynamicValidateForm = reactive<{ rows: Array<MysqlColum> }>({
    rows: [] as Array<MysqlColum>,
  });

  // 索引字段form
  const IndexFrom = reactive<{ rows: Array<MysqlIndex> }>({
    rows: [] as Array<MysqlIndex>,
  });

  const mysqlModelState = reactive({
    activeKey: '1',
  });

  // 减
  const removeRow = (item: MysqlColum) => {
    let index = dynamicValidateForm.rows.indexOf(item);
    if (index !== -1) {
      dynamicValidateForm.rows.splice(index, 1);
    }
  };
  // index 减
  const removeIndexRow = (item: MysqlIndex) => {
    let index = IndexFrom.rows.indexOf(item);
    if (index !== -1) {
      IndexFrom.rows.splice(index, 1);
    }
  };

  // 加
  const addMysqlRow = () => {
    dynamicValidateForm.rows.push({
      key: '',
      type: '',
      length: 0,
      decimalPoint: 0,
      isNull: '否',
      virtual: '否',
      primaryKey: '否',
      annotation: '',
    });
  };

  // index 加
  const addIndexRow = () => {
    IndexFrom.rows.push({
      key: '',
      type: 'NORMAL',
      func: 'BTREE',
      columeKey: [''],
      annotation: '',
    });
  };

  defineExpose({ dynamicValidateForm, IndexFrom, tableItemRef, indexRef, tableName });
</script>

<style>
  .ant-form-item {
    /* height: 50px !important; */
  }
</style>
<style scoped lang="less">
  .dynamic-form-container {
    // height: 500px;
    // background-color: aquamarine;
    .table-name {
      // width: 200px;
      display: flex;
      align-items: center;
      > div {
        display: flex;
        align-items: center;

        // align-items: center;
        // width: 200px;
        input {
          width: 150px;
        }
      }
      .add-item {
        position: relative;
        top: -17px;
        left: 20px;
      }
    }
    .item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 10px;
    }
    .form-table {
      height: 400px;
      overflow: scroll;
      overflow-x: hidden;
    }
    .title {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding-left: 10px;
      height: 50px;
      background: linear-gradient(135deg, #f97794, #623aa2);
      color: white;
      > p {
        width: 100px;
        height: 100%;
        line-height: 50px;
        font-size: 15px;
        font-weight: 600;
        text-align: center;
      }
      > p:last-of-type {
        margin-right: 10px;
      }
    }

    .item {
      position: relative;
      // margin-top: 10px;
      padding-top: 25px;
      // background-color: rgb(16, 187, 82);
      height: 50px;
      align-items: center;
      .minus-row {
        position: relative;
        right: 0px;
        top: -12px;
        height: 30px;
        width: 30px;
        border-radius: 50%;
        transition: all ease-in-out 0.3s;
        > img {
          height: 100%;
          width: 100%;
        }
        &:hover {
          background-color: rgba(95, 158, 160, 0.527);
          scale: 1.1;
        }
      }
      > div {
        width: 90px;
      }
    }
    .sync_content2 {
      .item {
        > div {
          width: 150px;
        }
      }
    }
  }
</style>
