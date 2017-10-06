<style scoped>
  .red {
    color: #f00;
  }
</style>

<template>
  <p class="red">msg '{{msg}}' from test component</p>
</template>

<script>
export default {
  data () {
    return {
      msg: 'xyz'
    }
  }
}
</script>
