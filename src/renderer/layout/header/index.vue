<template>
  <div class="pageheader">
    <div class="icon-box">
      <div class="logo"><img src="../../assets/img/logo.png" alt="" /></div>
      <p><span>DB MANAGER</span></p>
    </div>
    <div class="menu-box-title">
      <p>A great management tools</p>
    </div>
  </div>
</template>

<script setup lang="ts"></script>

<style scoped lang="less">
  .pageheader {
    height: 65px;
    width: 99%;
    border-radius: 15px;
    margin: 0 auto;
    margin-top: 5px;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    box-shadow: 2px 2px 10px 2px rgba(128, 128, 128, 0.699);
    background: linear-gradient(135deg, #17ead9, #6078ea);
    > .icon-box {
      display: flex;
      height: 100%;
      width: 20%;
      max-width: 300px;
      min-width: 200px;
      justify-content: center;
      align-items: center;
      margin-left: 50px;
      .logo {
        height: 100%;
        width: 65px;
        // width: 100%;
        border-radius: 50%;
        // background-color: #364f6b;
        // border-radius: 50%;
        // background-color: #6078ea;
        display: flex;
        justify-content: center;
        align-items: center;
        box-shadow: 0px 0px 10px inset grey;

        > img {
          height: 80%;
          width: 80%;
        }
      }
      p {
        display: block;
        font-size: 20px;
        font-weight: 600;
        font-family: 'Franklin Gothic Medium', 'Arial Narrow', Arial, sans-serif;
        color: #364f6b;
        background-color: aliceblue;
        height: 85%;
        line-height: 55px;
        border-radius: 15px;
        box-sizing: border-box;
        margin: 15px;
        width: 200px;
        background-color: #0ce7e794;
        box-shadow: 0px 0px 10px inset grey;
        span {
          margin-left: 30px;
        }
      }
      // background-color: antiquewhite;

      // background-color: aqua;
    }
    > .menu-box-title {
      flex: 1;
      height: 100%;
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-right: 200px;
      p {
        font-size: 28px;
        font-weight: 600;
        font-family: 'Franklin Gothic Medium';
        color: blue;
      }
      // background-color: rgb(110, 64, 8);
    }
  }
</style>
