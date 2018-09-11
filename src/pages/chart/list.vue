<template>
  <div ref="div">
    <div class="chartItem" v-if="charts.length > 0" v-for="item in charts">
      <div class="img" @click="detail(item._id)">
        <img class="lazy" :ref="item._id" :id="item._id" v-lazy="lazyImg" src="/static/nopic.png"/>
      </div>
      <div class="ctx">
        <h3><a :title="item.name" @click="detail(item._id)">{{item.name}}</a></h3>
        <!--<span class="pro">{{item.project && item.project.name}}</span>-->
        <span class="item user" :title="item.user.disName || item.user.name" @click.stop="search(item.user)"><i
          class="icon iconfont icon-robot"></i>&nbsp;{{item.user.disName || item.user.name}}</span>
        <span :class="['item te-icon',item.category]" :title="item.category+'图表'"></span>
        <span class="item date" :title="item.createDate">{{getDateDiff(item.updateDate)}}</span>
      </div>
      <template v-if="isLogin && (item.user == user._id || (item.project && user._id == item.project.manager))">
        <div class="op edit edit-active" @click.stop="edit(item)">编辑</div>
        <div class="op cls cls-active" @click.stop="del(item._id)">删除</div>
      </template>
      <template v-else>
        <div class="op edit" title="无操作权限">编辑</div>
        <div class="op cls" title="无操作权限">删除</div>
      </template>
    </div>
  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  export  default{
    name: 'indexList',
    props: ["charts", "isChange"],
    data() {
      return {
        imgs: []
      }
    },
    computed: {
      ...mapGetters({
        user: 'getUser',
        isLogin: 'getIsLogin',
      })
    },
    mounted() {
    },
    methods: {
      lazyImg(el){

        this.imgs.push(el);
        this.loadImgs();
        window.onscroll = (() => this.loadImgs());
      },
      loadImgs(){

        let st = window.scrollY, ch = window.innerHeight, post;
        this.imgs.map((o, i) => {
          if (o) {
            let rect = o.getBoundingClientRect(), win = o.ownerDocument.defaultView;
            post = rect.top + win.pageYOffset - st;
            if (!!( o.offsetWidth || o.offsetHeight || o.getClientRects().length ) && (post >= 0 && post < ch)) {
              this.setBase64(o);
              this.imgs[i] = null;
            }
          }
        });
      },
      setBase64(ele){

        this.api.get("/chart/getBase64", {id: ele.getAttribute("id")}).then((res) => {
          ele.className += " loaded";
          if (res.status && res.result.base64) {
            ele.src = res.result.base64;
          } else {
            ele.src = "/static/nopic.png";
          }
        });
      },
      detail(_id){
        window.open("/detail/" + _id);
      },
      edit(_chart){
        this.$emit("editChart", _chart);
      },
      del(_id){
        this.api.post("/chart/del", {_id: _id}).then((res) => {
          this.$message({
            showClose: true,
            message: res.status ? '删除成功' : '删除失败',
            type: res.status ? "success" : "error"
          });
          if (res.status) this.$emit("delChart", true);
        });
      },
      search(_user){
        this.$router.push({path: '/chart/search', query: {u: _user._id}});
      },
      getDateDiff(dateTimeStamp) {
        if (typeof dateTimeStamp == "string")
          dateTimeStamp = this.getDate(dateTimeStamp);
        var minute = 1000 * 60;
        var hour = minute * 60;
        var day = hour * 24;
        var halfamonth = day * 15;
        var month = day * 30;
        var now = new Date().getTime();
        var diffValue = now - dateTimeStamp;
        var monthC = diffValue / month;
        var weekC = diffValue / (7 * day);
        var dayC = diffValue / day;
        var hourC = diffValue / hour;
        var minC = diffValue / minute;
        let result;
        if (monthC >= 1) {
          result = parseInt(monthC) + "个月前";
        }
        else if (weekC >= 1) {
          result = parseInt(weekC) + "周前";
        }
        else if (dayC >= 1) {
          result = parseInt(dayC) + "天前";
        }
        else if (hourC >= 1) {
          result = parseInt(hourC) + "个小时前";
        }
        else if (minC >= 1) {
          result = parseInt(minC) + "分钟前";
        } else
          result = "刚刚";
        return result;
      },
      getDate(strDate) {
        var str = strDate.toString();
        str = str.replace("/-/g", "/");
        str = str.replace("T", " ");
        return new Date(str).getTime();
      }
    },
    watch: {
      isChange(){
        this.imgs = [];
      }
    },
    directives: {
      lazy: {
        bind(el, binng){
          binng.value(el)
        }
      }
    }

  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  .chartItem {
    position: relative;
    width: 300px;
    height: 300px;
    border: 1px solid $gray2;
    float: left;
    margin-top: 20px;
    margin-left: 27px;
    background: $white;
    padding: 5px;
    border-radius: 5px;
    box-shadow: 0 0 15px -5px rgba(0, 0, 0, .3);
    transition: all .5s;
    overflow: hidden;

    &:hover {
      box-shadow: 0 0 10px rgba(0, 0, 0, .3);
    }
    .img {
      height: 230px;
      width: 100%;
      overflow: hidden;
      background: url("../../assets/img/nopic.png") no-repeat;
      background-size: 100% 100%;

      img {
        width: 100%;
        height: 100%;
        transition: transform .8s, opacity .8s;
        opacity: 0;
        will-change: transform;
        transform: scale(1.2);
        cursor: pointer;
      }
      .loaded {
        background: #e0eaf3;
        opacity: 1;
        transform: scale(1);
      }
      &:hover {
        img {
          transform: scale(1.1);
        }
      }
    }
    .ctx {
      padding: 5px 10px;
      h3 {
        margin: 7px 0;
        width: 100%;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        a {
          font-size: 16px;
          color: #777;
          font-weight: bold;
          &:hover {
            color: $red;
          }
        }

      }
      .pro {
        font-size: 12px;
        color: #aaa;
        width: 120px;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        display: inline-block;
      }
      .item {
        font-size: 12px;
        color: #aaa;
        display: inline-block;
        text-overflow: ellipsis;
        white-space: nowrap;
        overflow: hidden;
        line-height: 25px;
      }
      .user {
        width: 80px;
        cursor: pointer;
        i {
          font-size: 20px;
          float: left;
        }
        &:hover {
          color: $red;
          //text-decoration:underline;
        }
      }
      .date {
        float: right;
      }
      .te-icon {
        height: 23px;
        background: url(../../assets/img/chart-icon.png) no-repeat;
      }
      .Echarts {
        width: 20px;
      }
      .D3 {
        width: 20px;
        background-position-x: -25px;
      }
      .ThreeJS {
        width: 50px;
        background-position-x: -55px;
      }
    }
    .op {
      position: absolute;
      top: 15px;
      right: 10px;
      padding: 3px 10px;
      border-radius: 2px;
      cursor: text;
      transform: translateX(100px);
      transition: all .3s;
      background: $gray;
      color: $white;
    }
    .cls {
    }
    .cls-active {
      cursor: pointer;
      background: $red;
      color: #efefef;
    }
    .edit {
    }
    .edit-active {
      cursor: pointer;
      background: $darkGrey;
      color: #efefef;
    }
    &:hover {
      .edit {
        transform: translateX(-50px);
      }
      .edit-active {
        &:hover {
          background: $darkGrey2;
        }
      }
      .cls {
        transform: translateX(0px);
      }
      .cls-active {
        &:hover {
          background: $red2;
        }
      }
    }
  }
</style>
