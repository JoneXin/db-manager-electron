<template>
  <div>
    <a-modal v-model:visible="menuModelState.isShowEditModel" title="编辑连接">
      <template #footer>
        <a-button type="dashed" danger @click="testConnect">测试连接</a-button>
        <a-button key="back" @click="() => (menuModelState.isShowEditModel = false)">取消</a-button>
        <a-button type="primary" @click="sendEditRequest">确定</a-button>
      </template>
      <div class="form-box">
        <label for="conn_name">
          <span class="text">连接名:</span>
          <a-input
            name="conn_name"
            v-model:value="menuModelState.connConf.connection_name"
            placeholder="连接名"
          />
        </label>
        <label for="host">
          <span class="text">主机:</span>
          <a-input name="host" v-model:value="menuModelState.connConf.host" placeholder="主机" />
        </label>
        <label for="host">
          <span class="text">端口:</span>
          <a-input name="host" v-model:value="menuModelState.connConf.port" placeholder="端口" />
        </label>
        <label for="host">
          <span class="text">用户名:</span>
          <a-input name="host" v-model:value="menuModelState.connConf.user" placeholder="用户名" />
        </label>
        <label for="host">
          <span class="text">密码:</span>
          <a-input
            name="host"
            v-model:value="menuModelState.connConf.password"
            placeholder="密码"
          />
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
  const menuModelState = reactive({
    isShowEditModel: false,
    connConf: {
      connection_name: '',
      host: '',
      user: 'root',
      port: '3306',
      password: '',
      uid: 0,
    } as UpdateConnectionConf,
    isUpdate: false,
  });
  const dbStore = useDbStore();

  onMounted(() => {});

  const sendEditRequest = async () => {
    try {
      console.log(menuModelState.isUpdate);
      // 更新
      if (menuModelState.isUpdate) {
        await dbStore.updateConnection(menuModelState.connConf);
        menuModelState.isShowEditModel = false;
        return $message.success('编辑成功!');
      }
      // 新增
      let newConf = Object.assign({}, menuModelState.connConf);
      Object.prototype.hasOwnProperty.call(newConf, 'uid') && delete newConf.uid;
      await dbStore.newConnection(newConf);
      $message.success('新增成功!');
      menuModelState.isShowEditModel = false;
    } catch (error) {
      $message.error('操作失败');
    }
  };
  /**
   * 测试连接
   */
  const testConnect = async () => {
    try {
      $message.loading({ content: '测试连接中', key: 1, duration: 7 });
      await dbStore.testConnection(menuModelState.connConf);
      $message.success({ content: '连接成功', key: 1, duration: 2 });
    } catch (error) {
      $message.error({ content: '连接失败', key: 1, duration: 2 });
    }
  };

  watch(
    () => dbStore.currentOperatoeConnInfo,
    (value) => {
      menuModelState.connConf = value;
    },
  );

  defineExpose({ menuModelState });
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
