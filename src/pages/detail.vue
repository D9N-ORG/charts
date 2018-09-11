<template>
  <div>
    <HeaderBar :options="header" @handleCli="save"></HeaderBar>
    <Splitter :margin="20" @resize="spResize">
      <div slot="left-pane">
        <div class="control-panel">
          <div class="left"></div>
          <div class="right">
            <el-dropdown trigger="click" :hide-on-click="false">
              <span class="el-dropdown-link">
                资源库<i class="el-icon-arrow-down el-icon--right"></i>
              </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item v-for="item in resource.staticLib" :key="item.name"><a @click="addResource(item.url)">{{item.url}}</a>
                </el-dropdown-item>
                <el-dropdown-item v-for="item in resource.dynamicLib" :key="item.name"><a
                  @click="addResource(resource.serverPath+item.url)">{{resource.serverPath}}{{item.url}}</a>
                </el-dropdown-item>
                <el-dropdown-item divided><a class="upfile" @click="uploadResource">上传文件</a></el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
            <a @click="run">运行</a>
          </div>
        </div>
        <codemirror ref="myCm"
                    :value="chart.code"
                    :options="cmOptions"
                    @ready="onCmReady"
                    @focus="onCmFocus"
                    @input="onCmCodeChange">
        </codemirror>
      </div>
      <div slot="right-pane">
        <ShowChart :chart="chart" :flag="flag"></ShowChart>
      </div>
    </Splitter>

    <el-dialog
      title="资源管理"
      :visible.sync="resource.dialogVisible"
      width="700px">
      <UploadPage :chart="chart" :fileList="resource.dynamicLib" @upFiles="upFiles"></UploadPage>
    </el-dialog>

  </div>
</template>

<script>

  import {mapGetters} from 'vuex'
  import {codemirror} from 'vue-codemirror'
  import 'codemirror/lib/codemirror.css'

  /**自动关闭<({**/
  import 'codemirror/addon/edit/closebrackets.js'
  /**折叠效果**/
  import 'codemirror/addon/fold/foldgutter.js'
  import 'codemirror/addon/fold/brace-fold.js'
  import 'codemirror/addon/fold/foldgutter.css'

  import 'codemirror/addon/selection/active-line'
  import 'codemirror/mode/javascript/javascript'
  import 'codemirror/mode/htmlmixed/htmlmixed'

  /**滚动条**/
  import 'codemirror/addon/scroll/simplescrollbars.js'
  import 'codemirror/addon/scroll/simplescrollbars.css'

  import 'codemirror/addon/hint/show-hint.css'
  import 'codemirror/addon/hint/show-hint.js'
  import 'codemirror/addon/hint/javascript-hint.js'

  import Splitter from '@rmp135/vue-splitter'

  import HeaderBar from '../components/header.vue'
  import UploadPage from './detail/upload.vue'
  import ShowChart from './detail/show.vue'

  export  default{
    name: 'detail',
    data(){
      return {
        id: '',
        chart: {
          name: '',
          project: '',
          category: '',
          chartType: '',
          code: '',
          base64: ''
        },
        flag: false,
        resource: {
          serverPath: 'http://localhost:8086',
          lib: {
            Echarts: [
              {name: 'jquery', url: "//cdn.bootcss.com/jquery/3.2.1/jquery.min.js"},
              {name: 'echarts-v3', url: '//echarts.baidu.com/examples/vendors/echarts/echarts.min.js'},
              {name: 'china', url: '//echarts.baidu.com/examples/vendors/echarts/map/js/china.js'},
              {name: 'world', url: '//echarts.baidu.com/examples/vendors/echarts/map/js/world.js'},
              {name: 'echarts-v2', url: '//cdn.bootcss.com/echarts/2.2.7/echarts-all.js'}],
            D3: [
              {name: 'jquery', url: "//cdn.bootcss.com/jquery/3.2.1/jquery.min.js"},
              {name: "d3-v3", url: "//d3js.org/d3.v3.min.js"},
              {name: "d3-v4", url: "//d3js.org/d3.v4.min.js"}],
            ThreeJS: []
          },
          staticLib: [],
          dynamicLib: [],
          dialogVisible: false
        },
        header: {
          title: '',
          isShowPublish: false
        },
        cmOptions: {
          tabSize: 4,
          styleActiveLine: true,
          lineNumbers: true,
          line: true,
          mode: {
            name: "htmlmixed",
            tags: {
              style: [["type", /^text\/(x-)?scss$/, "text/x-scss"],
                [null, null, "css"]],
              custom: [[null, null, "customMode"]]
            },
            globalVars: true
          },
          lineWrapping: false,    //CodeMirror是否应滚动或换行较长。默认为false（滚动）,
          scrollbarStyle: 'simple',  //overlay,simple ,nlll
          theme: 'default',
          autoCloseBrackets: true,
          foldGutter: true,
          gutters: ["CodeMirror-linenumbers", "CodeMirror-foldgutter"],
          extraKeys: {"Ctrl-Q": "autocomplete"}
        }
      }
    },
    computed: {
      ...mapGetters({
        user: 'getUser',
        isLogin: 'getIsLogin'
      })
    },
    components: {
      codemirror, Splitter, HeaderBar, UploadPage, ShowChart
    },
    mounted(){
      this.init();
      this.getResource();
    },
    methods: {
      init(){

        this.id = this.$route.params.id;
        this.api.get("/chart/findById", {id: this.id}).then((res) => {
          this.chart = res.result;
          this.header.title = this.chart.name;
          let category = this.chart.category || 'echarts';
          this.resource.staticLib = this.resource.lib[category];

          if (!this.chart.code) {
            this.api.get("/static/template-echarts.html").then((res) => {
              this.chart.code = res;
            });
          }

          if (this.isLogin && (this.chart.user == this.user._id || (this.chart.project && this.user._id == this.chart.project.manager)))
            this.header.isShowPublish = true;
        });
      },
      save(){
        if (!this.user) {
          this.$message({
            showClose: true,
            message: '登录过期，请重新登录',
            type: "error"
          });
          return;
        }
        if (!this.id) {
          this.$message({
            showClose: true,
            message: '未能获取到图表标识',
            type: "error"
          });
          return;
        }
        let chart = {
          _id: this.id,
          base64: this.chart.base64,
          code: this.chart.code
        };
        this.api.post("/chart/update", chart).then((res) => {

          this.$message({
            showClose: true,
            message: res.status ? '图表发布成功' : '图表发布失败',
            type: res.status ? "success" : "error"
          });
        });
      },
      spResize(){
        //this.flag = !this.flag
      },
      onCmReady(cm) {

      },
      onCmFocus(cm) {

      },
      onCmCodeChange(newCode) {
        this.chart.code = newCode;
        this.flag = !this.flag;
      },
      getResource(){
        this.api.post("/file/find", {chart: this.id}).then((res) => {
          this.resource.dynamicLib = res.result;
        });
      },
      upFiles(file){
        this.resource.dynamicLib.push(file);
      },
      uploadResource(){
        this.resource.dialogVisible = true;
      },
      run(){
        this.flag = !this.flag;
      },
      addResource(path){

        let template = "";
        if (/(\.json)/i.test(path)) {
          template = `<script>
  $.get('` + path + `', function(data) {
  });
<\/script>`;
        }
        else {
          template = `<script type='text/javascript' src='` + path + `'><\/script>`;
        }
        if (/(<script)/ig.test(this.chart.code))
          this.chart.code = this.chart.code.replace(/(<script)/i, template + '\n$1');
        else if (/(<\/body>)/ig.test(this.chart.code))
          this.chart.code = this.chart.code.replace(/(<\/body>)/i, '$1\n' + template);
        else
          this.chart.code += template;
      },
    }
  }
</script>
<style scoped lang="scss" rel="stylesheet/scss">
  .control-panel {
    height: 30px;
    line-height: 30px;
    width: 100%;
    background: #f7f7f7;
    border-bottom: 1px solid $gray5;
    .left {
      float: left;
    }
    .right {
      float: right;
      text-align: right;
      a {
        height: 100%;
        padding: 0px 12px;
        text-align: center;
        background-color: $red;
        display: inline-block;
        color: $white;
        text-decoration: none;
        cursor: pointer;
        &:hover {
          background-color: $red2;
        }
      }
    }
  }

  .upfile {
    background: $red;
    text-align: center;
    color: $white;
    &:hover {
      background: $red2;
    }
  }

  .chart {
    position: absolute;
    top: 0;
    bottom: 0;
    left: 0;
    right: 0;
  }
</style>
