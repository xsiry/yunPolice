define(function(require, exports, module) {
  $.root_ = $('body');
  var domain = "/";
  module.exports = {
    init: function() {
      this._bindUI();
      this._loopImages();
      this._loadContent();
    },
    _bindUI: function() {
    },
    _loopImages: function() {
      getloopImages();
    },
    _loadContent: function() {
      load();
      news_detail();
    }
  }

  function load() {
    var tabLoadEnd = false;
    var tabLenght = 0;
    $('.news_content').dropload({
      scrollArea: window,
      domUp : {                                                            // 上方DOM
        domClass   : 'dropload-up',
        domRefresh : '<div class="dropload-refresh">↓下拉刷新</div>',
        domUpdate  : '<div class="dropload-update">↑释放更新</div>',
        domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>'
      },
      domDown: {
        domClass: 'dropload-down',
        domRefresh: '<div class="dropload-refresh">上拉加载更多</div>',
        domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
        domNoData: '<div class="dropload-noData">已无数据</div>'
      },
      loadUpFn: function(me) {
        window.location.reload();
      },
      loadDownFn: function(me) {
        $.ajax({
          url: domain + 'news/getNews.do',
          dataType: 'json',
          contentType: 'application/json',
          data: {
            page: $(".page_no").val(),
            pagesize: 3,
            sortname: 'times',
            sortorder: 'DESC'
          },
          dataType: 'json',
          cache: false,
          success: function(data) {
            if (data.success) {
              var list = data.Rows;
              if (list == null) {
                $(".page_no").val(parseInt($(".page_no").val()) - 1);
              };
              if (list.length == 0) {
                tabLoadEnd = true;
              }
              setTimeout(function() {
                if (tabLoadEnd) {
                    me.resetload();
                    me.lock();
                    me.noData();
                    me.resetload();
                    return;
                }
                var result = '';
                for (var i = 0; i < list.length; i++) {
                    var obj = list[i];
                    var imgurl = obj.imgs.split(';')[0];
                    result
                        += '<div>'
                        + '<a href="javascript:void(0);" data-newsid='+ obj.id +' class="new_detail">'
                        + '<div class="' + (imgurl ? 'show' : '') + '"><img src="'+ imgurl +'" width="100%" height="100%"></div>'
                        + '<div>'
                        + '<p>' + (obj.title.length > 18?(obj.title.substring(0,18)+'...'): obj.title) + '</p>'
                        + '<span>'+ obj.times.substring(5,10) +' | <span>' + (obj.category || '其他') + '</span></span>'
                        + '</div></a></div>'
                }
                $('.news_content_panel').append(result);
                tabLenght++;
                me.resetload();
              }, 200);
              $(".page_no").val(parseInt($(".page_no").val()) + 1);
            }
          },
          error: function() {
            loading = true;
            $(".page_no").val(parseInt($(".page_no").val()) - 1);
            console.log("查询数据出错啦，请刷新再试");
          }
        });
      }
    });
  }

  function news_detail() {
	if (getParams('nd_id')) $('.go_back').hide();
    var id = getParams('nd_id') ? getParams('nd_id'):$('input[name="newsid"]').val();
    if (id && id != "undefined" && $('.news_detail')) {
      $.ajax({
        type: 'GET',
        url: domain + 'news/getNew.do',
        dataType: 'json',
        data : {
          id: id
        },
        success : function(responseText) {
          if (responseText.success) {
            var obj = responseText.data;
            $('.news_detail_block h1').text(obj.title);
            $('.news_detail_block .pages-date span:first-child').text(obj.source);
            $('.news_detail_block .pages-date span:last-child').text(obj.times.substring(0,10));
            var imgurl = obj.imgs.split(';')[0];
            $('.news_detail_block .pages_imgs').css('display', imgurl ? 'block' : 'none');
            $('.news_detail_block .pages_imgs img').prop('src', imgurl);
            $('.news_detail_block .pages_content').html(obj.content)
          }
        },
        error: function(e) {
          console.log(e);
        }
      });
    }
  }

  function getloopImages() {
      $.ajax({
          type: 'GET',
          url: domain + 'news/getListTop.do',
          dataType: 'json',
          success : function(responseText) {
              if (responseText.success) {
                  var list = responseText.list;
                  if (list.length > 0) {
                      var flicks = '';
                      var loopimgs = '';
                      $.each(list, function (i, o) {
                          flicks += '<a href="#"></a>';
                          loopimgs += '<li><a href="javascript:void(0);" data-newsid='+ o.id +' class="new_detail"><span>'
                              + '<img src="'+ o.imgs.split(';')[0] +'">'
                              + '<div class="img_title"><p>' + o.title + '</p>'
                              + '</div></span></a></li>';
                      });
                      $('div.main_visual .flicking_con').empty().append(flicks);
                      $('div.main_visual .main_image ul').empty().append(loopimgs);
                      $('div.main_visual').show();
                      loopImages();
                  }
              }
          },
          error: function(e) {
              console.log(e);
          }
      });
  }

  // 顶部图片轮播
  function loopImages() {
    clearInterval(timer);
    $(".main_visual").hover(function() {
      $("#btn_prev,#btn_next").fadeIn()
    }, function() {
      $("#btn_prev,#btn_next").fadeOut()
    });

    $dragBln = false;

    $(".main_image").touchSlider({
      flexible: true,
      speed: 200,
      btn_prev: $("#btn_prev"),
      btn_next: $("#btn_next"),
      paging: $(".flicking_con a"),
      counter: function(e) {
        $(".flicking_con a").removeClass("on").eq(e.current - 1).addClass("on");
      }
    });

    $(".main_image").bind("mousedown", function() {
      $dragBln = false;
    });

    $(".main_image").bind("dragstart", function() {
      $dragBln = true;
    });

    $(".main_image a").click(function() {
      if ($dragBln) {
        return false;
      }
    });

    timer = setInterval(function() {
      $("#btn_next").click();
    }, 5000);

    $(".main_visual").hover(function() {
      clearInterval(timer);
    }, function() {
      timer = setInterval(function() {
        $("#btn_next").click();
      }, 5000);
    });

    $(".main_image").bind("touchstart", function() {
      clearInterval(timer);
    }).bind("touchend", function() {
      timer = setInterval(function() {
        $("#btn_next").click();
      }, 5000);
    });
  }

  /* 时间处理函数 参数 毫秒 */
  function toLocaleString(ms) {
    var utc = 8 * 60 * 60 * 1000;
    var dateTime = new Date(ms - utc);

    function p(s) {
      return s < 10 ? '0' + s : s;
    }
    //获取当前年
    var year = dateTime.getFullYear();
    //获取当前月
    var month = dateTime.getMonth() + 1;
    //获取当前日
    var date = dateTime.getDate();

    var h = dateTime.getHours(); //获取当前小时数(0-23)
    var m = dateTime.getMinutes(); //获取当前分钟数(0-59)
    var s = dateTime.getSeconds();

    var now = [year, p(month), p(date)].join('-') + " " + [p(h), p(m), p(s)].join(':');
    return now;
  }

  // url传参数
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
})
