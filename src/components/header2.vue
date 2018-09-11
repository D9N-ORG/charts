<template>
  <div class="navbar">
    <div class="logo">
      <router-link to="/"><i class="icon iconfont icon-icp-acitve-spline"></i><span>charts</span></router-link>
    </div>
    <ul>
      <li v-for="menu in menus" :class="[menu.flag==currMenu.flag?'active':'']">
        <router-link :to="menu.url"><i :class="['icon','iconfont',menu.icon]"></i>{{menu.name}}</router-link>
      </li>
    </ul>
    <div class="block-bar-right">
      <div class="search">
        <Search></Search>
      </div>
      <div class="operation" v-if="!isLogin">
        <div class="user"><i @click="login" class="icon iconfont icon-icon"></i></div>
      </div>

      <div class="operation" v-if="isLogin" style="width:60px;">
        <div class="user"><i class="icon iconfont icon-icon"></i><i class="icon iconfont icon-sanjiaoxing-down"></i>
        </div>
        <div class="item">
          <div class="usercenter">
            <router-link to="/user">个人中心</router-link>
          </div>
          <div class="edit" @click="exit">退出</div>
        </div>
      </div>

    </div>

  </div>
</template>

<script>

  import {mapGetters} from 'vuex'
  import Search from './search.vue'

  export default{
    name: 'HeaderBar',
    computed: {
      ...mapGetters({
        currMenu: 'getCurrMenu',
        menus: 'getMenus',
        isLogin: 'getIsLogin'
      })
    },
    components: {
      Search
    },
    data(){
      return {}
    },
    mounted(){
      this.init();
    },
    methods: {
      init: function () {

      },
      login: function () {
        this.$store.dispatch("setLoginDialogState", true);
      },
      exit: function () {
        localStorage.removeItem('currUser');
        this.$router.push('/')
        this.$store.dispatch("setMenus", false);
        this.$store.dispatch("setUser", null);
      }
    }
  }

</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .operation {
    width: 80px !important;
    .user {
      height: 50px;
      position: relative;
      .icon-icon {
        margin-right: 15px;
      }
      .icon-sanjiaoxing-down {
        position: absolute;
        right: 15px;
        font-size: 12px !important;
      }
    }
    .item {
      display: none;
      width: 80px;
      border-radius: 0 0 5px 5px;
      box-shadow: 0px 2px 6px 0px #f2f2f2;
      overflow: hidden;
      .usercenter, .edit {
        height: 40px;
        line-height: 40px;
        background: #373d41;
        color: rgba(255, 255, 255, 0.5);
        a {
          color: rgba(255, 255, 255, 0.5);
        }
      }
      a:hover, .edit:hover {
        color: $white;
      }
    }
  }

  .operation:hover {
    .item {
      display: block;
    }
    i {
      color: $white !important;
    }
  }

  .navbar {
    width: 100%;
    height: 50px;
    line-height: 50px;
    border: none;
    background-color: $darkGrey;
    color: $white;
    position: fixed;
    top: 0;
    z-index: 1100;
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
    ul {
      display: inline-block;
      li {
        display: inline-block;
        padding: 0px 20px;
        position: relative;
        &:hover, &.active {
          background: $darkGrey3;
        }
        &:before {
          content: '';
          position: absolute;
          left: 50%;
          right: 50%;
          top: 0;
          background: $red;
          height: 4px;
          -webkit-transition-property: 'left, right';
          transition-property: 'left, right';
          -webkit-transition-duration: .3s;
          transition-duration: .3s;
          -webkit-transition-timing-function: ease-out;
          transition-timing-function: ease-out;
        }
        &:hover:before, &.active:before {
          left: 0;
          right: 0;
        }
        a {
          color: $white;
          display: block;
          width: 100%;
          height: 50px;
          i {
            margin-right: 5px;
          }
        }
      }
    }
    .block-bar-right {
      height: 100%;
      line-height: 100%;
      right: 15px;
      float: right;
      > div {
        display: inline-block;
        position: relative;
        color: $white;
        min-width: 60px;
        width: auto;
        height: 100%;
        line-height: 50px;
        text-align: center;
        float: left;
        cursor: pointer;
        i {
          color: rgba(255, 255, 255, .5);
          &:hover {
            color: $white;
          }
        }
      }
      .user {
        i {
          font-size: 24px;
        }
      }
      .search {
        margin-right: 10px;
      }
    }
  }

</style>
