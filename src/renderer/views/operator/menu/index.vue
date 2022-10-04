<template>
  <div class="menu-box">
    <div class="connection-box">
      <a-button
        @click="newConnection"
        class="new-conn-btn"
        style="color: #364f6b; border: 1px dashed #364f6b"
        >新建连接</a-button
      >
    </div>

    <div class="connection-list">
      <ul class="conn-list-box" ref="connRef">
        <a-spin :spinning="systemStore.menuLoading">
          <a-menu
            v-model:selectedKeys="menuState.selectConnKeys"
            style="width: 100%"
            mode="inline"
            @click="handleConnnDetail"
            :inline-collapsed="menuState.collapsed"
          >
            <a-menu-item
              :id="item.connection_name"
              :key="index"
              v-for="(item, index) in dbStore.connectionList"
              :title="item.connection_name"
            >
              <template #icon>
                <img src="../../../assets/icon/host.svg" alt="" style="height: 25px; width: 25px" />
              </template>
              {{ item.connection_name }}
            </a-menu-item>
          </a-menu>
        </a-spin>
      </ul>
      <div class="menu-edit" v-show="menuState.isShowEditBox" ref="menu_edit">
        <p @click="editConnection">编辑连接</p>
        <p
          @click="
            () => {
              menuState.isShowDbCreaterModel = true;
            }
          "
          >新建库</p
        >
        <p @click="refreShDbTree">刷新</p>
        <p>
          <a-popconfirm
            placement="right"
            title="确定删除?"
            ok-text="删除"
            cancel-text="再想想"
            @confirm="deleteConnection"
            @cancel="() => {}"
          >
            <p class="del" id="del">删除连接</p>
          </a-popconfirm>
        </p>
        <p @click="openCommandWindow">命令行</p>
      </div>
    </div>
    <MenuModel ref="menu_model"></MenuModel>
    <DbCreaterModel
      :isShowModel="menuState.isShowDbCreaterModel"
      @updateShowStatus="(show) => (menuState.isShowDbCreaterModel = show)"
    ></DbCreaterModel>
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref } from 'vue';
  import { useDbStore } from '../../../store/modules/db';
  import MenuModel from './munu.model.vue';
  import DbCreaterModel from './create-db.model.vue';
  import { useRouter } from 'vue-router';
  import { useSystemStore } from '../../../store/modules/system';

  const menuState = reactive({
    isShowEditBox: false,
    selectConnKeys: ['1'],
    collapsed: false,
    isShowDbCreaterModel: false,
  });

  const dbStore = useDbStore();
  const router = useRouter();
  const connRef = ref();
  const menu_model = ref();
  const menu_edit = ref();
  const systemStore = useSystemStore();

  onMounted(async () => {
    systemStore.showMenuLoading();
    await dbStore.getConnectionList();
    systemStore.hideMenuLoading();
    initEvent();
  });

  // 注册事件
  const initEvent = () => {
    // 右键事件
    connRef.value.addEventListener('contextmenu', (e: any) => {
      e.preventDefault();
      const conn_name = dbStore.currentOperatoeConnInfo.connection_name;

      // 只允许选中连接项执行右键菜单
      if (e.target.id != conn_name && e.target.parentNode.id != conn_name) return;
      console.log(e.target.className);

      if (e.target.className == 'ant-menu-title-content') {
        menuState.isShowEditBox = true;
        // 设置当前连接的信息
        dbStore.setCurrentOperatoeConnInfo(e.target.innerHTML);
        // 设置菜单位置
        menu_edit.value.style.left = e.pageX + 10 + 'px';
        menu_edit.value.style.top = e.pageY - 140 + 'px';
      }
    });
    // 菜单消失
    document.addEventListener('click', (e: any) => {
      if (e.target.id !== 'del') {
        menuState.isShowEditBox = false;
      }
    });
  };

  const toggleCollapsed = () => {
    menuState.collapsed = !menuState.collapsed;
  };

  /**
   * 点击连接详情页面
   * @param e
   */
  const handleConnnDetail = async (menuInfo: any) => {
    dbStore.setCurrentOperatoeConnInfo(menuInfo.item.title);
    await dbStore.getDatabasesList();
    router.push('/page/detail');
  };

  /**
   * new conn
   */
  const newConnection = () => {
    dbStore.clearCacheConnInfo();
    isShowModel(true, false);
  };

  /**
   *编辑连接
   */
  const editConnection = () => {
    isShowModel(true, true);
  };

  /**
   *删除连接
   */
  const deleteConnection = () => {
    dbStore.delConnection(dbStore.currentOperatoeConnInfo.uid);
  };

  /**
   * 命令行页面
   */
  const openCommandWindow = () => {
    dbStore.setCurrentCommandb(''); // 清空默认db
    router.push('/page/command');
  };

  /**
   * 处理moidel的展示
   * @param show
   */
  const isShowModel = (show: boolean, isUpdate: boolean) => {
    menu_model.value.menuModelState.isShowEditModel = show;
    menu_model.value.menuModelState.isUpdate = isUpdate;
  };

  /**
   * 创建行数据库
   */
  const newDatabase = () => {};

  /**
   *刷新db-tree
   */
  const refreShDbTree = async () => {
    await dbStore.getDatabasesList();
  };
</script>

<style scoped lang="less">
  .menu-box {
    height: 100%;
    // width: 20%;
    width: 300px;
    // max-width: 300px;
    // min-width: 200px;
    border-radius: 15px;
    margin-left: 10px;
    background-color: #ffffff;
    box-shadow: 2px 2px 10px 2px rgba(128, 128, 128, 0.699);
    border: 1px solid rgb(34, 36, 139);
    > .connection-box {
      height: 50px;
      padding: 10px;
      margin: 15px;
      box-sizing: border-box;
      border-radius: 15px;
      text-align: center;
      background-color: #f8f8f8;
      box-shadow: 0px 0px 10px inset gray;
      .new-conn-btn {
        background: linear-gradient(135deg, #97abff, #123597);
        border-radius: 15px;
        color: white !important;
        border: none !important;
        &:hover {
          border: 1px dashed red !important;
          box-shadow: 0px 0px 10px rgba(255, 0, 0, 0.233);
        }
      }
    }
    > .connection-list {
      position: relative;
      cursor: pointer;
      box-sizing: border-box;
      padding: 10px;
      margin: 15px;
      border-radius: 15px;
      box-shadow: 0px 0px 10px inset gray;
      > .title {
        font-size: 18px;
        font-weight: 600;
        margin-bottom: 20px;
        .icon {
          color: cadetblue;
          font-size: 18px;
        }
      }
      > .conn-list-box {
        font-size: 14px;
        height: calc(100vh - 350px);
        overflow: auto;
        font-family: '微软雅黑';
        .conn-list-item {
          display: flex;
          height: 40px;
          padding: 5px;
          // border-top: 1px solid red;
          border-bottom: none;
          transition: all ease-in-out 0.2s;
          > .logo {
            width: 30px;
            height: 100%;
            // background-color: aqua;
            img {
              height: 80%;
              width: 80%;
              margin-top: 3px;
              margin-left: 6px;
            }
          }
          p {
            flex: 1;
            line-height: 25px;
            font-size: 16px;
            font-weight: 600;
            color: #364f6b;
            .del {
              display: block;
              height: 100%;
              width: 100%;
            }
          }
          &:hover {
            background-color: #83baee;
          }
        }
        .conn-list-item:last-of-type {
          border-bottom: 1px solid rgba(95, 158, 160, 0.384);
        }
      }
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
        p {
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
    }
  }
</style>
