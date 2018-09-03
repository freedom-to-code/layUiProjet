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
    elem: '#dateDtKpi' //指定元素
  });
  $('#searchBtn').click(function () {
    var data = {
      trade_name: $('#trade_name').val(),
      mendian_name: $('#mendian_name').val(),
      grid_micro_name: $('#grid_micro_name').val(),
      dateDtKpi: $('#dateDtKpi').val()
    };
    getData(data);
  });
  //执行一个 table 实例
  var getData = function (data) {
    data = $.extend({
      dataType: 'scy_wangge_mx_01'
    }, data);
    Common.sendFormData(
      //'../json/store.json',
      'http://10.138.42.215:19805/common/inter',
      data,
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
          elem: '#storeList',
          width: 1400,
          height: 500,
          data: newData,
          title: '用户表',
          page: false, //开启分页
          request: {
            pageName: 'page'
          },
          //, toolbar: 'default' //开启工具栏，此处显示默认图标，可以自定义模板，详见文档
          //totalRow: true,//开启合计行
          cols: [
            [ //表头
              //{field: 'mendian_code', title: 'ID', width: 80, sort: false, fixed: 'left'},
              {
                field: 'mendian_code',
                title: '门店编码',
                rowspan: 2,
              },
              {
                field: 'mendian_name',
                title: '门店名称',
                rowspan: 2,
              },
              {
                field: 'trade_name',
                title: '中心名称',
                rowspan: 2,
              },
              {
                field: 'grid_micro_name',
                title: '网格小微名称',
                rowspan: 2,
              },
              /*{
                field: 'yj_shr_sj',
                title: '门店种类',
                rowspan: 2,
              },*/
              {
                field: 'yj_shr_sj',
                title: '月均零售',
                rowspan: 2,
              },
              {
                field: 'chuyang_no',
                title: '产品出样',
                rowspan: 2,
              },
              {
                title: '交互能力',
                colspan: 2,
                align: 'center'
              },
              {
                title: '全屋能力',
                colspan: 2,
                align: 'center'
              },
              {
                title: '模式输出',
                colspan: 2,
                align: 'center'
              },
              {
                field: 'fenji',
                title: '五星评级',
                colspan: 2,
              },
            ],
            [
              {
                field: 'xiaoshou_no',
                title: '销售团队',
              },
              {
                field: 'ruzhuxiaoqu',
                title: '入住小区',
              },
              {
                field: 'sheji_no',
                title: '设计团队',
              },
              {
                field: 'anzhuang_no',
                title: '安装团队',
              },
              {
                field: 'sfyms',
                title: '是否有模式',
              },
              {
                field: 'moshi_content',
                title: '模式内容',
              },
            ]
          ]
        });
        laypage.render({
          elem: 'storePage',//元素ID
          count: data['scy_mendian_count']['jilushu'][0],//数据总数
          limit: 10,
          groups: 10,
          curr: location.hash.replace('#!page=', ''),
          hash: 'page',
          jump: function (obj, first) {
            if (!first) {
              getData();
            }
          }
        });
      }
    );
  };
  //上来便请求数据
  getData();

  //将日期直接嵌套在指定容器中
  var dateIns = laydate.render({
    elem: '#laydateDemo'
    , position: 'static'
    , calendar: true //是否开启公历重要节日
    , mark: { //标记重要日子
      '0-10-14': '生日'
      , '2018-08-28': '新版'
      , '2018-10-08': '神秘'
    }
    , done: function (value, date, endDate) {
      if (date.year == 2017 && date.month == 11 && date.date == 30) {
        dateIns.hint('一不小心就月底了呢');
      }
    }
    , change: function (value, date, endDate) {
      layer.msg(value)
    }
  });

  //分页
  laypage.render({
    elem: 'pageDemo' //分页容器的id
    , count: 100 //总页数
    , skin: '#1E9FFF' //自定义选中色值
    //,skip: true //开启跳页
    , jump: function (obj, first) {
      if (!first) {
        layer.msg('第' + obj.curr + '页', {offset: 'b'});
      }
    }
  });

  //上传
  upload.render({
    elem: '#uploadDemo'
    , url: '' //上传接口
    , done: function (res) {
      console.log(res)
    }
  });

  slider.render({
    elem: '#sliderDemo'
    , input: true //输入框
  });

});