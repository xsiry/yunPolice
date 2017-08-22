define(function(require, exports, module) {
  $.root_ = $('div.ibox-content');
  var manager, g;
  var domain = "/";
  module.exports = {

    init: function() {
      datetimepickerInit();
      f_initGrid();
      this._configText();
      this._bindUI();
    },
    _configText() {
      $('div h5.mgmt_title').text('案件统计列表');
      $('div button font.mgmt_export_btn').text('导出');
      $('div input.name_search').prop('placeholder', '输入咨询标题');
      $('div button font.mgmt_search_btn').text('搜索');
    },
    _bindUI: function() {
      // bind .name_search_btn
      $.root_.on("click", '.search_btn', function(e) {
        manager.setOptions({
            parms: {
              startedat: $('#startedat').val()+':00',
              endedat: $('#endedat').val()+':59'
            }
        });
        // 将会覆盖设置表格对象属性时的parms属性

        // 查询时，设置为第一页！！
        manager.changePage("first");

        // 重新发起ajax请求，加载数据
        manager.loadData(true);
      })
        // bind .name_search
      $.root_.on("keypress", '.name_search', function(e) {
        if (e.which == "13") f_search();
      })
        // bind .name_search val.length is 0
      $.root_.on('input propertychange', '.name_search', function(e) {
        if ($('.name_search').val().length == 0) f_search();
      })
      $.root_.on("click", '.export_btn', function(e) {
        t_export();
      })
    }
  };

  // Helpers
  /*
	 * 生成Grid
	 */
  function f_initGrid() {
    var c = require('./columns');
    g = manager = $("div.listDiv").ligerGrid({
      columns: c,
      onSelectRow: function(rowdata, rowindex) {
        $("#txtrowindex").val(rowindex);
      },
      url: domain + 'case_statistics/getList.do',
      parms: {
        startedat: $('#startedat').val()+':00',
        endedat: $('#endedat').val()+':59'
      },
      method: "get",
      dataAction: 'server',
      usePager: true,
      enabledEdit: false,
      clickToEdit: false,
      width: '100%',
      height: '91%'
    });
  };

  /*
	 * 导出
	 */
  function t_export() {
    window.open(domain + 'case_statistics/xExport.do?startedat=' + $('#startedat').val()+ ':00&endedat=' + $('#endedat').val()+':59')
  }

  /*
	 * 搜索
	 */
  function f_search() {
    g.options.data = $.extend(true, {}, gridData);
    g.loadData(f_getWhere());
  };

  function f_getWhere() {
    if (!g) return null;
    var clause = function(rowdata, rowindex) {
      var key = $(".name_search").val();
      return rowdata.tit.indexOf(key) > -1;
    };
    return clause;
  };

  function datetimepickerInit() {
    var start = $("#startedat").datetimepicker({
      format: "yyyy-mm-dd hh:ii",
          autoclose: true,
          todayBtn: true,
          minuteStep: 1,
          language: 'zh-CN'
    });

    var end = $("#endedat").datetimepicker({
      format: "yyyy-mm-dd hh:ii",
          autoclose: true,
          todayBtn: true,
          minuteStep: 1,
          language: 'zh-CN'
    });

    $('#startedat').val(genNowDate(true));
    $('#endedat').val(genNowDate(false));

    start.on('changeDate', function(e){
      end.datetimepicker('setStartDate', e.date);
    });
    end.on('changeDate', function(e){
        start.datetimepicker('setEndDate', e.date);
    });
  }

    /* 获取当天时间 */
  function genNowDate(bool) {
    var dateTime = new Date();

    function p(s) {
      return s < 10 ? '0' + s : s;
    }
    // 获取当前年
    var year = dateTime.getFullYear();
    // 获取当前月
    var month = dateTime.getMonth() + 1;
    // 获取当前日
    var date = dateTime.getDate();
    var now = [year, p(month), (bool? '01':p(date))].join('-') + " " + (bool ? "00:00" : "23:59");
    return now;
  }


  function dateFactory(str, date, yearBool) {
    function p(s) {
      return s < 10 ? '0' + s : s;
    }

    var d = date ? date : string2date(str);
    // 获取当前年
    var year = d.getFullYear();
    // 获取当前月
    var month = d.getMonth() + 1;
    // 获取当前日
    var date = d.getDate();

    var h = d.getHours(); // 获取当前小时数(0-23)
    var m = d.getMinutes(); // 获取当前分钟数(0-59)
    var s = d.getSeconds();
    var mydatetime = yearBool ? [[year, p(month), p(date)], [p(h), p(m), p(s)]] : [p(month), p(date)];
    var now = yearBool ?  [mydatetime[0].join('-'),mydatetime[1].join('-')].join(' ') : mydatetime.join('-');
    return now;
  }

  function string2date(str) {
    return new Date(Date.parse(str.replace(/-/g, "/")) -24*60*60*1000);
  }
})
