import { RouteRecordRaw } from 'vue-router';

export const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    name: 'Layout',
    redirect: '/page',
    component: () => import(/* webpackChunkName: "layout" */ '../layout/index.vue'),
    meta: {
      title: '首页',
    },
    children: [],
  },
  {
    path: '/page',
    name: 'page',
    component: () => import(/* webpackChunkName: "layout" */ '../views/index.vue'),
    meta: {
      title: '首页',
    },
    children: [
      {
        path: 'detail',
        name: 'detail',
        component: () =>
          import(/* webpackChunkName: "layout" */ '../views/operator/content/detail/index.vue'),
        meta: {
          title: '详情',
        },
      },
      {
        path: 'command',
        name: 'command',
        component: () =>
          import(/* webpackChunkName: "layout" */ '../views/operator/content/command/index.vue'),
        meta: {
          title: '命令行',
        },
      },
    ],
  },
];
