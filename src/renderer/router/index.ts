import { type App as VueIncetance } from 'vue';
import { createRouter, createWebHashHistory, RouteRecordRaw } from 'vue-router';
import { routes } from './routerList';

export async function setupRouter(app: VueIncetance) {
  const router = createRouter({
    // process.env.BASE_URL
    history: createWebHashHistory(''),
    routes,
  });

  // 创建路由守卫

  // 挂载路由
  app.use(router);

  // 路由准备就绪后挂载APP实例
  await router.isReady();
}
