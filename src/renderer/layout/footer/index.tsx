import { defineComponent } from 'vue';
import styles from './index.module.less';
import TaskBlock from '../../components/task-block/index.vue';
export default defineComponent({
  name: 'PageFooter',
  components: { TaskBlock },
  setup() {
    return () => (
      <>
        <div class={styles.pagefooter}>
          <TaskBlock class={styles.task}></TaskBlock>
          <TaskBlock class={styles.task}></TaskBlock>
        </div>
      </>
    );
  },
});
