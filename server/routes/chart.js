let Chart = require("../models/chart.js");
var Common = require("../public/common");

module.exports = app => {

  app.post("/chart/add", function (req, res, next) {

    var _chart = req.body;
    Chart.create(_chart, function (error, doc) {
      Common.callReturn(res, error, doc);
    });
  }),

    app.get('/chart/detailPage', function (req, res, next) {

      var _id = req.query.id;
      Chart.findById(_id, function (error, doc) {
        res.render('index', {code: doc.code.js});
      })
    }),

    app.get('/chart/getBase64', function (req, res, next) {

      var _id = req.query.id;
      Chart.findById(_id,"base64", function (error, doc) {
        Common.callReturn(res, error, doc);
      })
    }),

    app.post("/chart/update", function (req, res, next) {

      var _chart = req.body;
      Chart.findByIdAndUpdate(_chart._id, _chart, function (error, doc) {
        Common.callReturn(res, error, doc);
      });
    }),

    app.post("/chart/del", function (req, res, next) {

      var _chart = req.body;
      Chart.remove(_chart, function (error, doc) {
        Common.callReturn(res, error, doc);
      });
    }),

    app.get("/chart/list", function (req, res, next) {
      res.json({status: "0", result: ""});
      return;
    }),

    app.get('/chart/findById', function (req, res, next) {

      var _id = req.query.id;
      Chart.findById(_id)
        .populate({path: 'chartType'})
        .populate({path: 'project'})
        .exec(function (error, doc) {
          Common.callReturn(res, error, doc);
        });
    }),
    app.post('/chart/count', function (req, res, next) {

      var _params = req.body;
      if (_params.keyword != undefined) {
        const reg = new RegExp(_params.keyword, 'i') //不区分大小写
        _params = {
          $or: [ //多条件，数组
            {name: {$regex: reg}},
            {"category": {$regex: reg}}
          ]
        };
      }
      Chart.count(_params, function (error, doc) {
        Common.callReturn(res, error, doc);
      })
    }),
    app.post('/chart/find', function (req, res, next) {

      var _params = req.body.chart;
      if (_params.keyword != undefined) {
        const reg = new RegExp(_params.keyword, 'i') //不区分大小写
        _params = {
          $or: [ //多条件，数组
            {name: {$regex: reg}},
            {"category": {$regex: reg}}
          ]
        };
      }
      var _pageIndex = req.body.pageIndex || 0, _pageSize = req.body.pageSize || 10;
      Chart.find(_params, "name project category chartType user createDate updateDate remark")
        .skip(_pageIndex * _pageSize)
        .limit(_pageSize)
        .sort({'createDate': -1})
        .populate({path: 'project'})
        .populate({path: 'user'})
        .exec(function (error, doc) {
          Common.callReturn(res, error, doc);
        })
    }),
    app.post('/chart/findBack', function (req, res, next) {  //备份

      var _params = req.body.chart;
      if (_params.keyword != undefined) {
        const reg = new RegExp(_params.keyword, 'i') //不区分大小写
        _params = {
          $or: [ //多条件，数组
            {name: {$regex: reg}},
            {"project.name": {$regex: reg}},
            {"category": {$regex: reg}},
            {"chartType.name": {$regex: reg}},
            {"user.name": {$regex: reg}},
            {"user.disName": {$regex: reg}}
          ]
        };
      }
      var _pageIndex = req.body.pageIndex || 0, _pageSize = req.body.pageSize || 10;
      Chart.find(_params, "name project category chartType user base64 createDate updateDate remark")
        .skip(_pageIndex * _pageSize)
        .limit(_pageSize)
        .sort({'createDate': -1})
        .populate({path: 'chartType'})
        .populate({path: 'project'})
        .populate({path: 'user'})
        .exec(function (error, doc) {
          Common.callReturn(res, error, doc);
        })
    })
}
