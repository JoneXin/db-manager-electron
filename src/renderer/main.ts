import { createApp, App as VueInstance } from 'vue';
import App from './App.vue';
import { setupRouter } from './router';
import { setupAntd } from './plugins';
import { setupStore } from './store';

function setupPlugins(app: VueInstance<Element>) {
  // antd
  setupAntd(app);
}

// main
(function setupApp() {
  const app = createApp(App);
  // 挂载插件
  setupPlugins(app);
  // vux
  setupStore(app);
  // router
  setupRouter(app);

  app.mount('#app');
})();
