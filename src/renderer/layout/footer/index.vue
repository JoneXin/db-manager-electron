<template>

    <div class="pagefooter">
        <!-- <TaskBlock class="task"></TaskBlock>
        <TaskBlock class="task"></TaskBlock> -->
        <p>A really freedom man, must be a restraint man</p>
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
      justify-content: center;
      border-radius: .9375rem;
      margin: .625rem auto;
      box-sizing: border-box;
      box-shadow: .125rem .125rem .625rem .125rem rgba(128, 128, 128, 0.699);
     background-color: rgba(1, 40, 68, 0.545);
    }
    p {
      font-size: 30px;
      font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
      color: white;
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
