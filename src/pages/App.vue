<template>
  <div>
    <HeaderBar></HeaderBar>
    <div class="content">
      <router-view/>
    </div>
  </div>
</template>

<script>

  import HeaderBar from '../components/header2'
  export default {
    name: 'pageApp',
    data(){
      return {}
    },
    computed: {},
    components: {HeaderBar},
    methods: {}
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .content{
    margin-top: 50px;
    width: 100%;
  }
</style>
