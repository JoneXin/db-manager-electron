<template>
  <div
    class="menu-edit"
    v-show="menuState.isShowEditBox"
    :style="{ left: menuState.left + 'px', top: menuState.top + 'px' }"
  >
    <slot name="menuOption" class="menu-item"></slot>
    <p v-if="props.defaulTrucateOption">
      <a-popconfirm
        placement="right"
        title="确定清空?"
        ok-text="清空"
        cancel-text="再想想"
        @confirm="
          () => {
            $emit('confirmTrucate');
            menuState.isShowEditBox = false;
          }
        "
        @cancel="
          () => {
            $emit('cancelTrucate');
            menuState.isShowEditBox = false;
          }
        "
      >
        <p id="del">{{ props.defaultTrucateText }}</p>
      </a-popconfirm>
    </p>
    <p v-if="props.defaultDelOption">
      <a-popconfirm
        placement="right"
        title="确定删除?"
        ok-text="删除"
        cancel-text="再想想"
        @confirm="
          () => {
            $emit('confirmDelete');
            menuState.isShowEditBox = false;
          }
        "
        @cancel="
          () => {
            $emit('cancelDelete');
            menuState.isShowEditBox = false;
          }
        "
      >
        <p id="del">{{ props.defaultDelText }}</p>
      </a-popconfirm>
    </p>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref, watch } from 'vue';

  const menuState = reactive({
    isShowEditBox: false,
    left: 0,
    top: 0,
  });

  const props = defineProps({
    defaultDelOption: {
      default: true,
      type: Boolean,
    },
    defaulTrucateOption: {
      default: false,
      type: Boolean,
    },
    defaultDelText: {
      default: '删除',
      type: String,
    },
    defaultTrucateText: {
      default: '清空',
      type: String,
    },
    hostSpecies: {
      default: null,
      required: true,
    },
    isShowEditBox: {
      default: true,
      type: Boolean,
      required: false,
    },
  });

  onMounted(() => {
    // 菜单消失
    document.addEventListener('click', (e: any) => {
      if (e.target.id != 'del') {
        menuState.isShowEditBox = false;
      }
    });
  });

  watch(
    () => props.isShowEditBox,
    (val) => {
      menuState.isShowEditBox = val;
    },
  );

  defineExpose({ menuState });
</script>

<style scoped lang="less">
  .menu-edit {
    position: absolute;
    z-index: 99999;
    top: 0;
    left: 0;
    // height: 200px;
    width: 100px;
    border-radius: 10px;
    border: 1px solid gold;
    background-color: #f8f8f8;
    cursor: pointer;
    p,
    :deep(p) {
      position: relative;
      height: 30px;
      width: 100%;
      text-align: center;
      line-height: 30px;
      border-bottom: 1px solid gold;
      transition: all ease-in-out 0.2s;
      font-size: 14px;
      &:last-of-type {
        border: none;
        border-bottom-right-radius: 10px;
        border-bottom-left-radius: 10px;
      }
      &:first-of-type {
        border-top-right-radius: 10px;
        border-top-left-radius: 10px;
      }
      &:hover {
        background-color: bisque;
      }
    }
  }
</style>
