<style scoped>
  /* comment here */
  .red {
    color: #f0f;
  }
</style>

<template>
    <div>
        <!-- comment here -->
        <h2 class="red">yzy {{msg}}</h2>
        <test></test>
    </div>
</template>

<script>
import Test from './test.vue';
// comment here
export default {
    components: { Test },
    data () {
        return {
            msg: 'Hello world!xx'
        }
    }
}
</script>
