<template>
    <div class="in-dev">
      <in-dev tips="正在开发，敬请期待～"></in-dev>
    </div>
</template>

<script>
  import inDev from '@/components/InDev'

  export default {
    data () {
      return {
        loading: true
      }
    },
    components: {
      inDev
    },
    created () {
    },
    mounted () {
    },
    methods: {
    }
  }
</script>

<style lang="scss">

</style>
