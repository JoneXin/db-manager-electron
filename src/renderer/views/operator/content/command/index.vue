<template>
  <div style="height: 100%" class="editor-contaienr">
    <v-ace-editor
      v-model:value="dbStore.sql"
      @init="editorInit"
      lang="sql"
      theme="xcode"
      :options="{
        useWorker: true,
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        fontSize: 16,
      }"
      style="height: 100%; width: 100%"
    />
    <!-- <button @click="dasd">asd </button> -->
  </div>
</template>

<script setup lang="ts">
  import { onMounted, reactive, ref, watch } from 'vue';
  import { VAceEditor } from 'vue3-ace-editor';
  import ace from 'ace-builds';
  import modelSql from 'ace-builds/src-noconflict/mode-sql?url';
  import 'ace-builds/src-noconflict/theme-xcode';
  import 'ace-builds/src-noconflict/ext-language_tools';
  import languageTools from 'ace-builds/src-noconflict/ext-language_tools';
  import { useDbStore } from '../../../../store/modules/db';
  import { AceTips } from '../../../../typings';
  import { useSystemStore } from '../../../../store/modules/system';

  ace.config.setModuleUrl('ace/mode/sql', modelSql);
  const codeState = reactive({
    codeContent: '',
  });

  const dbStore = useDbStore();
  const sysStore = useSystemStore();

  const editorInit = (editor: any) => {
    console.log(1, editor);
  };

  const addTips = (data: Array<AceTips>) => {
    languageTools.addCompleter({
      getCompletions: function (
        editor: any,
        session: any,
        pos: any,
        prefix: any,
        callback: Function,
      ) {
        if (prefix.length === 0) {
          return callback(null, []);
        } else {
          return callback(null, data);
        }
      },
    });
  };

  watch(sysStore.tipsList, (val) => {
    addTips(val as Array<AceTips>);
  });
</script>
<style>
  .ace_editor {
    position: absolute;
    height: 95% !important;
    width: 90% !important;
  }
  .ace_autocomplete {
    height: 200px !important;
    width: 400px !important;
  }
</style>
<style scoped lang="less">
  .editor-contaienr {
    padding: 15px;
    position: relative;
    box-sizing: border-box;
  }
  .editor {
    box-sizing: border-box;
    height: 90%;
    width: 90%;
  }
</style>
