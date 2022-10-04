<template>
  <div
    ><DraggableModal v-model:visible="fileState.isShowModel" title="文件路径选择" width="700px">
      <div class="title">
        <p class="introduce"> 文件树目录</p>

        <div class="descriptor">
          <span>更新时间</span>
          <span>大小</span>
        </div>
      </div>
      <MenuEdit ref="fileItemRef">
        <template #menuOption>
          <p>重命名</p>
          <p>详情</p>
        </template>
      </MenuEdit>
      <div class="content">
        <a-tree
          checkable
          v-model:selectedKeys="fileState.selectedKeys"
          v-model:checkedKeys="fileState.checkedKeys"
          v-model:expandedKeys="fileState.expandedKeys"
          v-bind="omit(props)"
          @check="(key: string, nodes: any) => $emit('check', key, nodes)"
          @select="handleSelect"
          @rightClick="handShowOperator"
          :load-data="(treeNode: TreeNodeProps) => emit('getFileChildren', treeNode)"
          :tree-data="props.initFileTreeData"
        >
          <template #title="{ title, key, type }">
            <div class="nodes">
              <div class="name-info">
                <i class="icon_logo" v-if="type == 2"><img src="../../assets/icon/floder.svg" /></i>
                <i class="icon_logo" v-else><img src="../../assets/icon/file.svg" /></i>
                <span style="color: #cf770b">{{ title }}</span>
              </div>
              <div v-if="key == props.selectInfo.key" class="operate-box"
                ><span>{{
                  new Date(props.selectInfo.updateTime).toLocaleDateString() +
                  ' ' +
                  new Date(props.selectInfo.updateTime).toLocaleTimeString()
                }}</span>
                <span>{{
                  props.selectInfo.size < 1024
                    ? `${props.selectInfo.size} KB`
                    : props.selectInfo.size < 1024 * 1024
                    ? `${(props.selectInfo.size / 1024).toFixed(2)} MB`
                    : `${(props.selectInfo.size / (1024 * 1024)).toFixed(2)} GB`
                }}</span>
              </div>
            </div>
            <!-- <template v-else style="#1890ff">{{ title }}</template> -->
          </template>
        </a-tree>
      </div>
      <template #footer>
        <a-button
          key="back"
          @click="
            () => {
              fileState.isShowModel = false;
            }
          "
          >取消</a-button
        >

        <a-button
          type="primary"
          @click="
            () => {
              fileState.isShowModel = false;

              emit('ok', fileState.filePath);
            }
          "
          >确定</a-button
        >
      </template>
    </DraggableModal>
  </div>
</template>

<script setup lang="ts">
  import { ref, watch } from 'vue';
  import { defaultPathTreeData } from './constant';
  import { reactive } from 'vue';
  import { omit } from 'lodash-es';
  import DraggableModal from '../draggable-modal/index.vue';
  import { modalProps } from 'ant-design-vue/es/modal/Modal';
  import { TreeNodeProps } from 'ant-design-vue/lib/vc-tree';
  import MenuEdit from '../../components/right-menu/index.vue';

  interface FileTreeDataItem {
    title: string;
    key: string;
    type: number;
  }
  const fileState = reactive({
    isShowModel: false,
    filePath: '',
    selectedKeys: [],
    checkedKeys: [],
    expandedKeys: [],
  });
  const fileItemRef = ref();
  const emit = defineEmits([
    'getFileChildren',
    'updateShowStatus',
    'ok',
    'check',
    'select',
    'chekedKeys',
  ]);
  const props = defineProps({
    ...modalProps,
    getFileChildren: {
      type: Function,
      default: () => {},
    },
    initFileTreeData: {
      type: Array,
      default: [],
    },
    isShowModel: {
      type: Boolean,
      default: false,
    },
    getSelectPath: {
      type: Function,
      default: () => {},
    },
    updateShowStatus: {
      type: Function,
      default: () => {},
    },
    selectInfo: {
      type: Object,
      default: {},
    },
  });

  watch(
    () => props.isShowModel,
    (val) => (fileState.isShowModel = val),
  );

  watch(
    () => fileState.isShowModel,
    (val) => emit('updateShowStatus', val),
  );

  watch(
    () => fileState.checkedKeys,
    (val) => {
      emit('chekedKeys', val);
    },
  );

  const handleSelect = (key: string, e: any) => {
    emit('select', key, e);
    const { node } = e;
    if (node.isLeaf) {
      const parantNode = node.parent.node;
      return (fileState.filePath = parantNode.path);
    }
    fileState.filePath = node.path;
  };

  const handShowOperator = (e: any) => {
    fileItemRef.value.menuState.isShowEditBox = true;
    fileItemRef.value.menuState.left = e.event.pageX + 25;
    fileItemRef.value.menuState.top = e.event.pageY - 100;
  };
</script>

<style scoped lang="less">
  .title {
    height: 30px;
    line-height: 30px;
    display: flex;
    margin: 0 0 10px 0;
    color: #ff6565;
    justify-content: space-between;
    background: linear-gradient(135deg, #f7951e77, #72c5ef7a, #00a65083);
    > .introduce {
      font-weight: 600;
      margin-left: 40px;
      font-size: 16px;
    }
    > .descriptor {
      span {
        font-weight: 600;
        margin-right: 40px;
        font-size: 16px;
      }
    }
  }
  .content {
    max-height: 500px !important;
    overflow: scroll;

    .nodes {
      display: flex;
      justify-content: space-between;

      .name-info {
        img {
          height: 14px;
          width: 20px;
        }
      }
      > .operate-box {
        span {
          margin-right: 20px;
        }
      }
    }
  }
</style>
