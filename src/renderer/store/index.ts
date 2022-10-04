import { createPinia } from 'pinia';
import type { App as VueInstance } from 'vue';

const store = createPinia();

export function setupStore(app: VueInstance<Element>) {
  app.use(store);
}

export { store };
