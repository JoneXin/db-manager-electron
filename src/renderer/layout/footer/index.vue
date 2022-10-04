<template>

    <div class="pagefooter">
      <TaskBlock class="task"></TaskBlock>
      <TaskBlock class="task"></TaskBlock>
    </div>

</template>

<script setup lang="ts">
  
</script>

<style scoped lang="less">

    .pagefooter {
      height: 4.0625rem;
      width: 99%;
      display: flex;
      align-items: center;
      border-radius: .9375rem;
      margin: .625rem auto;
      box-sizing: border-box;
      box-shadow: .125rem .125rem .625rem .125rem rgba(128, 128, 128, 0.699);
      background-image: linear-gradient( 180deg, #eeff004a 10%, #58cffbe3 100%);
    }
    .task {
      margin-left: .625rem;
      border-radius: .9375rem;
      height: 80%;
      width: 300px;
      border: none;
      background-color: beige;
    }
  
</style>
