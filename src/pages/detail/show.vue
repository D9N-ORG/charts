<template>
  <div id="output">
  </div>
</template>
<script>

  export default{
    name: 'showChart',
    props: ["chart", "flag"],
    data(){
      return {}
    },
    mounted(){
      this.init();
    },
    methods: {
      init(){
        this.loadChart();
      },
      loadChart(){

        if (!this.chart.code) return;
        var ifr = document.createElement("iframe");
        ifr.setAttribute("frameborder", "0");
        ifr.setAttribute("id", 'ifr');
        document.getElementById("output").innerHTML = "";
        document.getElementById("output").appendChild(ifr);

        var ifrw = (ifr.contentWindow) ? ifr.contentWindow : (ifr.contentDocument.document) ? ifr.contentDocument.document : ifr.contentDocument;
        ifrw.document.open();
        ifrw.document.write(this.chart.code);

        var that = this;
        ifrw.onload = function () {
          if (!that.chart) return;
          setTimeout(function () {
            if (that.chart.category == "Echarts") {
              var canvasDom = ifrw.document.getElementsByTagName("canvas")[0];
              if (!canvasDom)return;
              that.chart.base64 = canvasDom.toDataURL('image/png'); //转换图片为dataURL
            }
            else {
              var svgDom = ifrw.document.getElementsByTagName("svg")[0];
              if (!svgDom) return;
              var s = new XMLSerializer().serializeToString(svgDom);
              that.chart.base64 = 'data:image/svg+xml;base64,' + window.btoa(s);
            }
          }, 500);
        }
        ifrw.document.close();
      },
    },
    watch: {
      flag: function (val, oldVal) {
        this.loadChart();
      }
    }
  }
</script>

<style scoped lang="scss" rel="stylesheet/scss">
  #output {
    position: absolute;
    width: 100%;
    height: 98%;
  }
</style>
