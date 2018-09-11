<template>
  <div class="navbar">
    <div class="logo">
      <router-link to="/"><i class="icon iconfont icon-icp-acitve-spline"></i><span>charts</span></router-link>
    </div>
    <span class="title">{{options.title}}</span>
    <div class="operate">
      <a v-if="options.isShowPublish" class="publish" @click="save"><i class="icon iconfont icon-fabu"/>发布</a>
    </div>
  </div>
</template>

<script>

  export default{
    name: 'HeaderBar',
    props: ['options'],
    data(){
      return {}
    },
    methods: {
      save: function () {
        this.$emit("handleCli");
      }
    }
  }

</script>

<style scoped lang="scss" rel="stylesheet/scss">

  .navbar {
    width: 100%;
    height: 50px;
    line-height: 50px;
    border: none;
    border-bottom: 1px solid $darkGrey2;
    background-color: $darkGrey;
    color: $white;
    position: fixed;
    z-index: 1;

    .logo {
      float: left;
      width: 155px;
      i{
        font-size: 26px;
        margin:0 5px 0 10px;
        color: #00c1de;
        font-weight: bold;
      }
      a{
        color:#fff;
        font-size: 16px;
        font-family: fantasy;
        span{
          vertical-align: 3px;
        }
      }
    }
    .title {
      line-height: 50px;
      font-size: 16px;
    }

    .operate {
      float: right;

      .publish {
        float: right;
        margin-left: 1px;
        width: 100px;
        height: 100%;
        line-height: 50px;
        font-size: 14px;
        display: inline-block;
        text-align: center;
        background-color: $red;
        cursor: pointer;
        color: $white;
        text-decoration: none;

        &:hover {
          background-color: $red2;
        }
        i {
          margin-right: 5px;
        }
      }
    }
  }

</style>
