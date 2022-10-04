<template>
  <div class="task-container">
    <div class="task-info">
      <slot name="info"></slot>
    </div>
    <div class="task-progress">
      <a-progress :percent="50" status="active" />
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
  .task-container {
    height: 80%;
    width: 300px;
    padding: 0 5px;
    box-shadow: 0px 0px 10px inset grey;
    .task-info {
      height: calc(100% - 20px);
    }
    .task-progress {
      height: 20px;
      width: 100%;
      //   background-color: aqua;
    }
  }
</style>
