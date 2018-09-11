<template>
  <div>
    <div v-loading="loading" element-loading-text="拼命加载中....">
      <div id="container" class="navigation" v-if="nav.isShow">
        <a v-for="item in nav.items" :class="['projectItem',item._id==curr.navId?'active':'']" :title="item.name"
           @click="getCharts(item._id)">
          <i v-if="nav.type=='type'" :class="['icon','iconfont',item.icon]"></i>{{item.name}}
        </a>
      </div>
      <div :class="['right-container clearfix',nav.isShow?'mar-left180':'']">
        <ToolBar :options="toolbar" @handleAdd="addChart"></ToolBar>
        <ChartList :charts="curr.charts" :isChange="isChange" @editChart="editChart" @delChart="reloadCharts"></ChartList>
      </div>
    </div>

    <el-dialog
      :title="dialog.title"
      :visible.sync="dialog.visible"
      width="60%"
      :lock-scroll="false">
      <AddChart :chartTypes="nav.chartTypes" :chart="curr.chart"
                @reloadCharts="reloadCharts"></AddChart>
    </el-dialog>

  </div>
</template>

<script>
  import {mapGetters} from 'vuex'
  import PerfectScrollbar from 'perfect-scrollbar'
  import ToolBar from '../components/toolbar'
  import ChartList from './chart/list'
  import AddChart from './chart/addChart'
  import {Loading} from 'element-ui';
  export default{
    name: 'index',
    data(){
      return {
        loading: false,
        isChange: true,
        nav: {
          isShow: true,
          type: 'type',
          chartTypes: [],
          items: []
        },
        curr: {
          navId: '',
          typeId: '',
          proId: '',
          chart: {},
          charts: [],
        },
        dialog: {
          visible: false,
          title: ''
        },
        pagination: {
          scrollDisable: false,
          size: 50,
          index: 0,
          total: 0
        },
        toolbar: {
          isAdd: true,
          isShowRecordTotal: true,
          recordTotal: 0
        }
      }
    },
    computed: {
      ...mapGetters({
        user: 'getUser',
        projects: 'getProjects'
      })
    },
    components: {
      ChartList, AddChart, ToolBar
    },
    mounted(){

      this.nav.type = this.$route.params.type || 'type';
      this.$store.dispatch("setCurrMenu", {flag: "chart" + this.nav.type});
      let scrollbar = new PerfectScrollbar('#container', {wheelSpeed: 0.5});
      this.init();
      this.scrollEvent();
    },
    methods: {
      init(){

        if (this.nav.type == "search") {
          this.nav.isShow = false;
          this.getCharts();
        }
        this.getChartTypes();
        this.getProjects();
      },
      scrollEvent(){
        let that = this;
        window.addEventListener('scroll', function () {
          if (document.documentElement.scrollTop + window.innerHeight >= document.body.offsetHeight) {
            // 触发加载数据
            if (!that.pagination.scrollDisable) {
              that.pagination.scrollDisable = true;
              that.pagination.index++;
              that.loadCharts();
            }
          }
        });
      },
      getProjects(){

        if (this.projects.length > 0) {
          this.curr.proId = this.projects[0]._id;
          if (this.nav.type == "pro") {
            this.nav.items = this.projects;
            this.getCharts();
          }
        }
      },
      getChartTypes(){
        this.api.post("/chartType/find", {}).then((res) => {
          if (res.status) {
            this.nav.chartTypes = res.result;
            this.curr.typeId = this.nav.chartTypes[0]._id;
            if (this.nav.type == "type") {
              this.nav.items = this.nav.chartTypes;
              this.getCharts();
            }
          }
        });
      },
      getCharts(_id){

        if (_id) {
          this.curr.navId = _id;
          this.curr[this.nav.type == "pro" ? 'proId' : 'typeId'] = _id;
        } else {
          this.curr.navId = this.curr[this.nav.type == "pro" ? 'proId' : 'typeId'];
        }

        let _chart = this.getSearchParam();
        this.curr.charts = [];
        this.pagination.index = 0;
        this.pagination.scrollDisable = false;
        this.toolbar.recordTotal = 0;
        this.isChange = !this.isChange;
        this.api.post("/chart/count", _chart).then((res) => {
          if (res.status) {
            this.pagination.total = res.result;
            this.toolbar.recordTotal = res.result;
            this.loadCharts();
          }
        });
      },
      getSearchParam(){

        let params, query = this.$route.query;
        if (this.nav.type == "pro") {
          params = {project: this.curr.proId};
        } else if (this.nav.type == "type") {
          params = {chartType: this.curr.typeId};
        } else if (query.u) {
          params = {user: query.u};
        } else {  //搜索
          params = {keyword: query.q || ''};
        }
        return params;
      },
      loadCharts(){

        this.loading = true;
        let _chart = this.getSearchParam();
        let params = {
          pageIndex: this.pagination.index,
          pageSize: this.pagination.size,
          chart: _chart
        };
        this.api.post("/chart/find", params).then((res) => {
          if (res.status) {
            this.curr.charts.push(...res.result);
          }
          if ((this.pagination.index + 1) * this.pagination.size < this.pagination.total)
            this.pagination.scrollDisable = false;
          else
            this.pagination.scrollDisable = true;

          this.loading = false;
        });
      },
      addChart(){
        this.reset();
        this.dialog.title = "添加图表";
        this.dialog.visible = true;
      },
      editChart(_chart){
        this.curr.chart = {
          _id: _chart._id,
          name: _chart.name,
          project: _chart.project._id,
          category: _chart.category,
          chartType: _chart.chartType._id,
          remark: _chart.remark
        };
        this.dialog.title = "编辑图表";
        this.dialog.visible = true;
      },
      reloadCharts(isReload){
        this.dialog.visible = false;
        if (isReload)
          this.getCharts();
      },
      reset(){
        this.curr.chart = {
          name: '',
          project: this.curr.proId,
          category: 'Echarts',
          chartType: this.curr.typeId,
          remark: ''
        };
      }
    },
    watch: {
      $route(){
        this.nav.type = this.$route.params.type;
        this.nav.items = this.nav.type == "pro" ? this.projects : this.nav.chartTypes;
        this.nav.isShow = this.nav.type == "search" ? false : true;
        this.$store.dispatch("setCurrMenu", {flag: "chart" + this.nav.type});
        this.getCharts();
      },
      projects(){
        this.getProjects();
      },
      "nav.items": function () {
        const container = document.querySelector('#container');
        if (container) container.scrollTop = 0;
      }
    }
  }
</script>

<style scoped lang="scss">

  @import '../assets/css/chart.scss';

</style>
