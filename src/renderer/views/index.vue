<template>
  <div>
    <PageHeader></PageHeader>
    <Operator></Operator>
    <PageFooter></PageFooter
  ></div>
</template>

<script setup lang="ts">
  import PageHeader from '../layout/header/index.vue';
  import PageFooter from '../layout/footer';
  import Operator from './operator/index.vue';
</script>

<style lang="less">
  @import '../styles/index.less';
</style>
