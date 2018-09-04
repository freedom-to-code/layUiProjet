layui.config({
  version: '1535898708509' //为了更新 js 缓存，可忽略
});

layui.use(['laydate', 'laypage', 'layer', 'table', 'carousel', 'upload', 'element', 'slider'], function () {
  var laydate = layui.laydate //日期
    , laypage = layui.laypage //分页
    , layer = layui.layer //弹层
    , table = layui.table //表格
    , upload = layui.upload //上传
    , element = layui.element //元素操作
    , slider = layui.slider //滑块
  //初始化搜索栏
  laydate.render({
    elem: '#dateDtKpi', //指定元素
    value: new Date(new Date().getTime() - 3600 * 24 * 1000)
  });
  $('#searchBtn').click(function () {
    getData();
  });
  //执行一个 table 实例
  var getData = function (pageNum) {
    var page = pageNum || location.hash.replace('#!page=', '') || 1;
    var date = new Date(new Date().getTime() - 3600 * 24 * 1000);
    var preDay = date.getFullYear() + '-' + ('0' + (date.getMonth() + 1)).substr(-2) + '-' + ('0' + date.getDate()).substr(-2);
    var url = 'http://10.138.42.215:19805/common/inter?fresh=1&dataType=scy_wangge_mx_01&dateDtKpi=' + ($('#dateDtKpi').val() || preDay) + '&params=';
    url += 'page::' + page + ';;';
    url += 'trade_name::' + $('#trade_name').val() + ';;';//中心
    url += 'grid_micro_name::' + $('#grid_micro_name').val() + ';;';//小微名称
    url += 'wangge_wuxingfenji::' + ($('#fenji').val() || '') + '';//分级
    Common.sendFormData(
      //'../json/grid.json',
      url,
      {},
      function (data) {
        var tableData = data.scy_mendian_01;
        //转化为标准数据格式
        var newData = [];
        for (var p in tableData) {
          var col = tableData[p];
          for (var i = 0, l = col.length; i < l; i++) {
            if (!newData[i]) {
              newData[i] = {};
            }
            newData[i][p] = col[i];
          }
        }

        table.render({
          elem: '#gridList',
          width: 1400,
          height: 500,
          data: newData,
          title: '网格表',
          page: false, //开启分页
          request: {
            pageName: 'page'
          },
          cols: [
            [ //表头
              //{field: 'mendian_code', title: 'ID', width: 80, sort: false, fixed: 'left'},
              {
                field: 'grid_micro_code',
                title: '网格小微编码',
                rowspan: 2,
              },
              {
                field: 'grid_micro_name',
                title: '网格小微名称',
                rowspan: 2,
              },
              {
                field: 'trade_name',
                title: '中心名称',
                rowspan: 2,
              },
              {
                field: 'yj_shr_sj_sum',
                title: '零售',
                rowspan: 2,
              },
              {
                title: '网点',
                colspan: 2,
                align: 'center'
              },
              {
                field: 'chuyang_no',
                title: '触点',
                colspan: 2,
                align: 'center'
              },
              {
                title: '亮点',
                colspan: 2,
                align: 'center'
              },
              {
                field: 'wangge_wuxingfenji ',
                title: '五星评级',
                rowspan: 2,
              },
            ],
            [
              {
                field: 'wd_no',
                title: '网点个数',
              },
              {
                field: 'fgl',
                title: '覆盖率',
              },
              {
                field: 'cd_no',
                title: '触点个数',
              },
              {
                field: 'cdzb',
                title: '触点占比',
              },
              {
                field: 'ld_no',
                title: '亮点个数',
              },
              {
                field: 'ldzb',
                title: '亮点占比',
              },
            ]
          ]
        });
        laypage.render({
          elem: 'gridPage',//元素ID
          count: data['scy_mendian_count']['jilushu'][0],//数据总数
          limit: 10,
          groups: 10,
          curr: location.hash.replace('#!page=', ''),
          hash: 'page',
          jump: function (obj, first) {
            if (!first) {
              getData(obj.curr);
            }
          }
        });
      }
    );
  };
  //上来便请求数据
  getData();
});