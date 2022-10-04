<template>
  <div class="tree-container">
    <div class="nodes title_box">
      <p class="title">源库</p>
      <p class="transform">转换</p>
      <p class="aim_title">目标库</p>
    </div>
    <div class="line"></div>
    <a-tree
      v-bind="omit(props)"
      v-model:selectedKeys="treeState.selectedKeys"
      v-model:checkedKeys="treeState.checkedKeys"
      checkable
      defaultExpandAll
      :tree-data="props.treeData"
      @check="(key: string, nodes: any) => $emit('check', key, nodes)"
      style="margin-left: 20px; max-height: 600px; overflow: auto"
      class="tree-root"
    >
      <template #title="{ originName, key, aimName }">
        <div class="nodes">
          <i class="icon_logo" v-if="!isNaN(Number(key))"><img src="../../assets/icon/db.svg" /></i>
          <i class="icon_logo" v-else><img src="../../assets/icon/table.svg" /></i>
          <span class="title">{{ originName }}</span>
          <span class="icon">
            <img src="../../assets/icon/cover.svg" alt="" v-if="originName && aimName" />
            <img src="../../assets/icon/add.svg" alt="" v-else-if="originName && !aimName" />
            <img
              src="../../assets/icon/delete.svg"
              alt=""
              v-else-if="!originName && aimName && props.forceUpdate"
            />
          </span>
          <span class="aim_title">
            <i class="icon" v-if="!isNaN(Number(key))"><img src="../../assets/icon/db.svg" /></i>
            <i class="icon" v-else><img src="../../assets/icon/table.svg" /></i>
            {{ aimName }}</span
          >
        </div>
      </template>
    </a-tree>
  </div>
</template>

<script setup lang="ts">
  import { reactive, watch } from 'vue';
  import { omit } from 'lodash-es';
  import { modalProps } from 'ant-design-vue/es/modal/Modal';

  const treeState = reactive({
    expandedKeys: [],
    selectedKeys: [],
    checkedKeys: [],
  });

  const props = defineProps({
    ...modalProps,
    treeData: {
      default: [],
      type: Object,
    },
    forceUpdate: {
      default: true,
      type: Boolean,
    },
  });

  watch(
    () => props.treeData,
    (val) => {
      treeState.checkedKeys = val.map((item: any, index: number) => index);
    },
  );
</script>

<style>
  .ant-tree-treenode {
    width: 100%;
    display: flex;
  }
  .ant-tree-node-content-wrapper {
    flex: 1;
  }
</style>
<style scoped lang="less">
  .tree-container {
    // border: 1px solid;
    .nodes {
      width: 100%;
      display: flex;
      justify-content: flex-end;
      .icon_logo {
        height: 15px;
        width: 15px;
        margin-right: 5px;
        margin-top: 2px;
        > img {
          height: 100%;
          width: 100%;
        }
      }
      .icon {
        height: 20px;
        width: 25px;
        margin-top: 2px;
        // background-color: aqua;
        > img {
          height: 100%;
          width: 100%;
        }
      }
      .title {
        color: #cf770b;
        flex: 1;
      }
      .aim_title {
        display: flex;
        width: 250px;
        text-align: start;
        // background-color: red;
        margin-left: 60px;
        margin-right: 10px;
        color: brown;
        i {
          display: flex;
          align-items: center;
        }
        img {
          height: 15px;
          width: 15px;
        }
      }
    }
    .title_box {
      color: red;
      p {
        color: rgba(255, 0, 0, 0.603) !important;
        font-size: 18px;
        font-weight: 600;
      }
      .title {
        margin-left: 100px !important;
      }
      .transform {
        position: relative;
        left: -15px;
      }
    }
    .line {
      width: 100%;
      height: 1px;
      background-color: #cf770b;
      margin: 5px;
    }
  }
</style>
