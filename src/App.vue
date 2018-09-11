<template>
  <div id="app">
    <router-view/>

    <el-dialog
      :visible.sync="loginDialogState"
      width="340px"
      :append-to-body="true"
      :lock-scroll="false"
      @close="close">
      <LoginDialog></LoginDialog>
    </el-dialog>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import LoginDialog from './pages/user/login'

  export default {
    name: 'app',
    data(){
      return {}
    },
    computed: {
      ...mapGetters({
        loginDialogState: 'getIsShowLoginDialog'
      })
    },
    components: {
      LoginDialog
    },
    mounted(){
      this.init();
    },
    methods: {
      init(){
      },
      close(){
        this.$store.dispatch("setLoginDialogState", false);
      }
    }
  }
</script>
