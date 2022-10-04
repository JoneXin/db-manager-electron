<template>
  <div style="overflow: hidden; height: calc(100vh - 300px)">
    <MenuEdit
      ref="treeMenuRef"
      :defaulTrucateOption="true"
      @confirmDelete="confirmDelete"
      @confirmTrucate="confirmTrucate"
    >
      <template #menuOption>
        <p @click="exportTableData">导出数据</p>
        <p @click="exportTableStruct">导出格式</p>
        <p @click="newTable">新建表</p>
        <p @click="editeTable">编辑表</p>
        <p @click="toCommand">命令行</p>
        <p @click="refresh">刷新</p>
        <p @click="refresh">截断</p>
        <p @click="refresh">按条件截断表</p>
        <p @click="limtTrucate">按条件清空表</p>
      </template>
    </MenuEdit>
    <p class="title">DATABASE TREE:</p>
    <div class="detail-content" ref="detailContent">
      <a-spin :spinning="dbStore.loadingTree">
        <a-tree
          v-model:expandedKeys="treeState.expandedKeys"
          v-model:selectedKeys="treeState.selectedKeys"
          v-model:checkedKeys="treeState.checkedKeys"
          checkable
          :load-data="onLoadData"
          :tree-data="dbStore.treeData"
          @select="handleSelectTreeNode"
          @check="handCheckNodes"
          @rightClick="handShowOperator"
          style="margin-left: 20px"
        >
          <template #title="{ title, key }">
            <div class="nodes">
              <div class="name-info">
                <i class="icon_logo" v-if="!isNaN(Number(key))"
                  ><img src="../../../../assets/icon/db.svg"
                /></i>
                <i class="icon_logo" v-else><img src="../../../../assets/icon/table.svg" /></i>
                <span style="color: #cf770b">{{ title }}</span>
              </div>
              <div class="operate-box">
                <!-- <i><img src="../../../../assets/icon/delete_1.svg" alt="" /></i> -->
              </div>
            </div>
            <!-- <template v-else style="#1890ff">{{ title }}</template> -->
          </template>
        </a-tree>
      </a-spin>
    </div>
    <TableModel
      :is-show-model="treeState.isShowTableModel"
      @update-show-status="
        (val) => {
          treeState.isShowTableModel = val;
        }
      "
      :dbName="treeState.dbName"
      @refresh="refresh"
    ></TableModel>
  </div>
</template>

<script setup lang="ts">
  import { useDbStore } from '../../../../store/modules/db';
  import { computed, onMounted, reactive, ref, watch } from 'vue';
  import { showDatabases } from '../../../../api/database/index';
  import { TreeProps } from 'ant-design-vue/lib/tree/Tree';
  import { useSystemStore } from '../../../../store/modules/system';
  import MenuEdit from '../../../../components/right-menu/index.vue';
  import { number } from 'vue-types';
  import { formatCheckedNodes } from '../../../../utils/tool';
  import { useRouter } from 'vue-router';
  import { TreeNodeProps } from 'ant-design-vue/lib/vc-tree';
  import { EventDataNode } from 'ant-design-vue/lib/tree';
  import TableModel from './table.model.vue';
  import { getTableDetail } from '../../../../api/table';

  const treeState = reactive({
    expandedKeys: [],
    selectedKeys: [],
    checkedKeys: [],
    dbName: '',
    currentNode: {} as EventDataNode,
    isShowTableModel: false,
  });

  const dbStore = useDbStore();
  const systemStore = useSystemStore();
  const treeMenuRef = ref();
  const detailContent = ref();
  const router = useRouter();

  onMounted(() => {});

  /**
   * 加載數節點
   * @param treeNode
   */
  const onLoadData: TreeProps['loadData'] = async (treeNode) => {
    let tableList = await dbStore.getTableList(treeNode.title);

    //@ts-ignore
    treeNode.dataRef.children = tableList.map((item, index) => ({
      title: item,
      key: `${treeNode.key}-${index}`,
      isLeaf: true,
      disabled:
        treeNode.title == 'mysql' ||
        treeNode.title == 'sys' ||
        treeNode.title == 'performance_schema' ||
        treeNode.title == 'information_schema'
          ? true
          : false,
    }));
    dbStore.treeData = [...dbStore.treeData];
  };

  const relodTableList = async (treeNode: EventDataNode) => {
    let tableList = await dbStore.getTableList(treeNode.title);

    //@ts-ignore
    treeNode.children = tableList.map((item, index) => ({
      title: item,
      key: `${treeNode.key}-${index}`,
      isLeaf: true,
      disabled:
        treeNode.title == 'mysql' ||
        treeNode.title == 'sys' ||
        treeNode.title == 'performance_schema' ||
        treeNode.title == 'information_schema'
          ? true
          : false,
    }));
    dbStore.treeData = [...dbStore.treeData];
  };

  /**
   * 删除库和表
   */
  const confirmDelete = async () => {
    const { title } = treeState.currentNode;
    dbStore.loadingTree = true;
    if (treeState.currentNode.isLeaf) {
      const dbNode = treeState.currentNode.parent?.node;

      // 删库所在的表
      await dbStore.handleDel([
        {
          dbName: dbNode.title,
          delDb: false,
          tableList: [title],
        },
      ]);

      // 更新列表
      await relodTableList(dbNode);
      dbStore.loadingTree = false;
      return;
    }

    // 删库
    await dbStore.handleDel([
      {
        dbName: title,
        delDb: true,
        tableList: [],
      },
    ]);
    await dbStore.getDatabasesList();
    dbStore.loadingTree = false;
  };

  // 清空
  const confirmTrucate = async () => {
    const { title } = treeState.currentNode;
    dbStore.loadingTree = true;

    if (treeState.currentNode.isLeaf) {
      const dbNode = treeState.currentNode.parent?.node;

      // 清空所在的表数据
      await dbStore.handleTrucate([
        {
          dbName: dbNode.title,
          trucateDb: false,
          tableList: [title],
        },
      ]);
      // 手动触发默认查询
      await handleSelectTreeNode('', { node: treeState.currentNode });
      dbStore.loadingTree = false;
      return;
    }

    // 清空库下所表
    await dbStore.handleTrucate([
      {
        dbName: title,
        trucateDb: true,
        tableList: [],
      },
    ]);
    dbStore.loadingTree = false;
  };

  // 条件清空
  const limtTrucate = () => {};

  //刷新
  const refresh = async () => {
    dbStore.loadingTree = true;
    if (treeState.currentNode.isLeaf) {
      console.log(treeState.currentNode);

      await relodTableList(treeState.currentNode.parent?.node);
      dbStore.loadingTree = false;
      return;
    }
    await relodTableList(treeState.currentNode);
    dbStore.loadingTree = false;
    return;
  };

  // 跳转命令行，自带执行默认库
  const toCommand = () => {
    dbStore.setCurrentCommandb(treeState.dbName);
    router.push('/page/command');
  };

  /**
   * 点击选中tree 节点
   */
  const handleSelectTreeNode = async (selectedKeys: string, e: any) => {
    treeState.currentNode = e.node;
    setCurrenSelectDb(e.node.title);

    if (!e.node.isLeaf) return;
    const dbNode = e.node.parent.node;
    const tableNode = e.node;

    setCurrenSelectDb(dbNode.title);

    systemStore.showResultLoading();
    try {
      await dbStore.queryBySql(
        dbNode.title,
        `select * from ${dbNode.title}.${tableNode.title} limit 0, 100`,
      );
    } catch (error) {
      console.log(error);
    }
    systemStore.hideResultLoading();
  };

  // 当前选中db名
  const setCurrenSelectDb = (dbName: string) => {
    treeState.dbName = dbName;
    dbStore.setCurrentCommandb(''); // 清空db_store的数据
  };

  /**
   * 同步选择信息
   * @param key
   * @param nodes
   */
  const handCheckNodes = (key: string, nodes: any) => {
    // 选中集合
    let checkList = nodes.checkedNodes.sort((pre: any, next: any) => (pre.key < next.key ? -1 : 1));
    // 格式化 and 同步到 store
    dbStore.selectDbTreeNode = formatCheckedNodes(checkList, dbStore);
  };

  /**
   * 获取数据库节点列表
   */
  const getDbNodes = (nodes: any): Array<any> => {
    console.log(dbStore.treeData, '==');

    let rootNode = nodes.node;
    if (String(Number(rootNode.key)) !== 'NaN') return rootNode;

    while (1) {
      if (!rootNode.parent) return rootNode;
      rootNode = rootNode.parent.node;
    }
    return [];
  };

  /**
   * 显示右键菜单
   */
  const handShowOperator = (e: any) => {
    console.log(e.event.target);

    if (e.node.key != treeState.currentNode.key) return;

    // 动态调整菜单栏的位置
    const pos = e.event.target.getBoundingClientRect();
    console.log(window.innerHeight - pos.bottom);

    if (window.innerHeight - pos.bottom < 270) {
      treeMenuRef.value.menuState.isShowEditBox = true;
      treeMenuRef.value.menuState.left = e.event.pageX + 18;
      treeMenuRef.value.menuState.top = e.event.pageY - 340;
      return;
    }

    treeMenuRef.value.menuState.isShowEditBox = true;
    treeMenuRef.value.menuState.left = e.event.pageX + 20;
    treeMenuRef.value.menuState.top = e.event.pageY + 15;
  };

  /**
   * 导出数据
   */
  const exportTableData = () => {};
  /**
   * 导出数据结构
   */
  const exportTableStruct = () => {};

  const newTable = () => {
    treeState.isShowTableModel = true;
  };

  const editeTable = async () => {
    // 查询表结构 和索引信息
    await getTableDetail(
      {
        database: treeState.dbName,
        table: treeState.currentNode.title,
      },
      dbStore.currentOperatoeConnInfo,
    );
  };
</script>

<style scoped lang="less">
  .detail-content {
    padding: 20px;
    height: 100%;
    overflow: auto;

    .nodes {
      display: flex;
      justify-content: space-between;
      .name-info {
        display: flex;
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
      }
      .operate-box {
        display: flex;
        height: 100%;
        width: 100px;
        background-color: aquamarine;
        i {
          height: 100%;
          width: 18px;
          > img {
            height: 100%;
            width: 100%;
          }
        }
      }
    }
  }
  .title {
    margin: 15px 0 0px 45px;
    font-size: 18px;
    font-weight: 600;
    color: cadetblue;
  }
</style>
