const Path = require('path');
const vuePlugin = require('@vitejs/plugin-vue');
const vueJsx = require('@vitejs/plugin-vue-jsx');
const { defineConfig } = require('vite');
const Components = require('unplugin-vue-components/vite');
const { AntDesignVueResolver } = require('unplugin-vue-components/resolvers');

/**
 * https://vitejs.dev/config
 */
const config = defineConfig({
  root: Path.join(__dirname, 'src', 'renderer'),
  publicDir: 'assets',
  server: {
    port: 8080,
    // proxy: {
    //   '/api': {
    //     target: 'http://127.0.0.1:4545',
    //     changeOrigin: false,
    //   },
    // },
  },
  open: false,
  build: {
    outDir: Path.join(__dirname, 'build', 'renderer'),
    emptyOutDir: true,
  },
  plugins: [
    vuePlugin(),
    vueJsx({
      // options are passed on to @vue/babel-plugin-jsx
    }),
    Components({
      resolvers: [AntDesignVueResolver()],
    }),
  ],
});

module.exports = config;
