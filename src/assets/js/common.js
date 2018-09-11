export default {
  formatDate (date, fmt) {
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(RegExp.$1, (date.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    let o = {
      'M+': date.getMonth() + 1,
      'd+': date.getDate(),
      'h+': date.getHours(),
      'm+': date.getMinutes(),
      's+': date.getSeconds()
    };
    for (let k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        let str = o[k] + '';
        fmt = fmt.replace(RegExp.$1, (RegExp.$1.length === 1) ? str : padLeftZero(str));
      }
    }
    return fmt;
  },
  setChartTypes(vue){
    this.api.post("/chartType/find", {}).then((res) => {
      if (res.status)
        vue.$store.dispatch("setTypes", res.result);
    });
  },
  setProjects(vue, userId){
    vue.api.post("/project/findByUser", {pageSize: 100, userId: userId}).then((res) => {
      if (res.status)
        vue.$store.dispatch("setProjects", res.result);
    });
  },
  getUrlData(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
      return unescape(r[2]);
    return null;
  },
  setLoginStore(vue, _user){
    vue.$store.dispatch("setMenus", true);
    vue.$store.dispatch("setLoginDialogState", false);
    vue.$store.dispatch("setUser", _user);
    this.setProjects(vue, _user._id);
  },
  message(vue, type, msg){
    vue.$message({
      showClose: true,
      message: msg,
      type: type
    });
  }
}

function padLeftZero(str) {
  return ('00' + str).substr(str.length);
};
