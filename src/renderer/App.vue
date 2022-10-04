<script setup lang="ts"></script>

<template>
  <router-view #="{ Component }">
    <component :is="Component" />
  </router-view>
</template>

<style></style>
