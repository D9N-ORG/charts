<template>
  <div class="container">
    <div class="title clearfix">
      <h2><i class="icon iconfont icon-icon-yuanxk"></i>基本信息</h2>
    </div>
    <div class="baseinfo">
      <el-form :model="user" label-width="120px">
        <el-form-item label="用户名">
          <el-input disabled v-model="user.name"></el-input>
        </el-form-item>
        <el-form-item label="电话">
          <el-input v-model="user.tel"></el-input>
        </el-form-item>
        <el-form-item label="邮箱">
          <el-input v-model="user.email"></el-input>
        </el-form-item>
        <el-form-item label="显示名">
          <el-input v-model="user.disName"></el-input>
        </el-form-item>
        <el-form-item label="性别">
          <el-radio-group v-model="sex">
            <el-radio :label=1>男</el-radio>
            <el-radio :label=0>女</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="备注">
          <el-input type="textarea" v-model="user.remark"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="save">保存</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script>
  import {mapGetters} from 'vuex'

  export default{
    name: 'userInfo',
    data(){
      return {
        sex: 1
      }
    },
    computed: {
      ...mapGetters({
        user: 'getUser',
      })
    },
    mounted(){
      this.init();
    },
    methods: {
      init(){
        this.sex = this.user.sex;
      },
      save(){
        this.user.sex = this.sex;
        this.api.post("/user/update", this.user).then((res) => {
          this.$message({
            showClose: true,
            message: res.status ? '保存成功' : '保存失败,请重新操作',
            type: res.status ? "success" : "error"
          });
          if (res.status)
            localStorage.setItem('currUser', JSON.stringify(this.user));
        });
      },
      reset(){

      }
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  .container {
    margin: 0 30px;
    .title {
      margin: 15px 0;
      height: 40px;
      line-height: 40px;
      border-bottom: 1px solid $gray2;
      box-shadow: 0 4px 6px -6px $darkGrey3;
      h2 {
        font-size: 18px;
        i {
          font-size: 20px;
          margin-right: 5px;
          color: $red;
        }
      }
    }
    .baseinfo {
    }
  }
</style>
