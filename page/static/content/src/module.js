define(function(require, exports, module) {
  $.root_ = $('body');
  module.exports = {
    init: function() {
      this._bindUI();
      this._main();
    },
    _main: function() {
      var page = getParams("page");
      loadURL('../apps/'+ page +'.html');
    },
    _bindUI: function() {
      $.root_.off('click', '.new_detail').on('click', '.new_detail', function(e) {
        var newsid = $(e.currentTarget).data("newsid");
        loadURL('../apps/news_detail.html', newsid);
        e.preventDefault();
        rowobj = null;
      })
      $.root_.off('click', '.go_back_btn').on('click', '.go_back_btn', function(e) {
        loadURL('../apps/news.html');
        e.preventDefault();
        rowobj = null;
      })
    }
  };


  // url传参数变化类别
  function getParams(fndname) {
    var url = location.search; //一般的查询
    var query = url.substr(url.indexOf("?") + 1);
    var pairs = query.split("&"); //在逗号处断开
    for (var i = 0; i < pairs.length; i++) {
        var pos = pairs[i].indexOf('='); //查找name=value
        if (pos == -1)
            continue; //如果没有找到就跳过
        var argname = pairs[i].substring(0, pos); //提取name
        var value = pairs[i].substring(pos + 1); //提取value
        if (argname == fndname)
            return value;
    }
  }

  function loadURL(a, newsid) {
    var b = $('div.content');
    $.ajax({
      "type": "GET",
      "url": a,
      "dataType": "html",
      "cache": !0,
      "beforeSend": function() {
        b.removeData().html(""),
          b.html('<div class="dropload-load"><div class="sk-folding-cube"><div class="sk-cube1 sk-cube"></div><div class="sk-cube2 sk-cube"></div><div class="sk-cube4 sk-cube"></div><div class="sk-cube3 sk-cube"></div></div></div>'),
          b[0] == $("#content")[0] && ($("body").find("> *").filter(":not(" + ignore_key_elms + ")").empty().remove(),
            drawBreadCrumb(),
            $("html").animate({
              "scrollTop": 0
            }, "fast"))
      },
      "success": function(a) {
        b.css({
            "opacity": "0.0"
          }).html(a).append('<input type="hidden" name="newsid" value="'+ newsid +'"/>').delay(50).animate({
            "opacity": "1.0"
          }, 300),
          a = null,
          b = null
      },
      "error": function(c, d, e) {
        b.html('<h4 class="ajax-loading-error"><i class="fa fa-warning txt-color-orangeDark"></i> Error requesting <span class="txt-color-red">' + a + "</span>: " + c.status + ' <span style="text-transform: capitalize;">' + e + "</span></h4>")
      },
      "async": !0
    })
  }
})
