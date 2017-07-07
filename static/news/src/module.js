define(function(require, exports, module) {
  $.root_ = $('body');
  module.exports = {
    init: function() {
      this._bindUI();
      this._loopImages();
      this._loadContent();
    },
    _bindUI: function() {
      $.root_.off('click', '.msg_details_btn').on('click', '.msg_details_btn', function(actionobj) {
        var rowobj = $(this);
        var infoid = rowobj.data("infoid");
        actionobj.preventDefault();
        rowobj = null;
      })
      $.root_.off('click', '.go_back_btn').on('click', '.go_back_btn', function(actionobj) {
        actionobj.preventDefault();
        rowobj = null;
      })
    },
    _loopImages: function() {
      loopImages();
    },
    _loadContent: function() {
      // load();
    }
  }

  function load() {
    var tabLoadEnd = false;
    var tabLenght = 0;
    $('.notice_content').dropload({
      scrollArea: window,
      domDown: {
        domClass: 'dropload-down',
        domRefresh: '<div class="dropload-refresh">上拉加载更多</div>',
        domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
        domNoData: '<div class="dropload-noData">已无数据</div>'
      },
      loadDownFn: function(me) {
        $.ajax({
          url: 'infoDelivery.json',
          dataType: 'json',
          contentType: 'application/json',
          data: {
            pageNo: $(".page_no").val()
          },
          dataType: 'json',
          cache: false,
          success: function(data) {
            var list = data.list;
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
                result
                  += '' + '<div class="x_act content-block content-block-m content-block_' + obj.infoid + ' ' + (obj.wxread == 0 ? '' : 'c-b') + '">' + '<h3 class="notice_title' + obj.infoid + '">' + obj.idtitle + '</h3>' + '<p class="idcontent_' + obj.infoid + ' ' + (obj.wxread == 0 ? '' : 'c-b') + '">' + obj.idcontent.replace(/<[^>]+>/g, "").substring(0, 50) + ((obj.idcontent.replace(/<[^>]+>/g, "").length >= 50) ? '……' : '') + '</p>' + '<div class="notice_content' + obj.infoid + '" style="display:none;">' + obj.idcontent + '</div>' + '<div class="content-bottom"><span class="notice_time' + obj.infoid + '">' + toLocaleString(obj.createtime) + '</span>' + '<span class="pull-right"><a herf="javascript(0);" class="msg_details_btn msg_details_btn_' + obj.infoid + '" data-infoid= ' + obj.infoid + ' ><i class="icon_lg">' + (obj.wxread == 0 ? '<svg class="svg_icon" viewBox="0 0 1024 1024"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#view_detail_svg"></use></svg>' : '<svg class="svg_icon" viewBox="0 0 1024 1024"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#view_detailed_svg"></use></svg>') + '</i></a></span>' + '</div></div>';
              }
              $('.notice_content_panel').append(result);
              tabLenght++;
              me.resetload();
            }, 200);
            $(".page_no").val(parseInt($(".page_no").val()) + 1);
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

  // function notice_detail(infoid) {
  //   $.ajax({
  //     type: 'GET',
  //     contentType: 'application/json',
  //     url: 'infoDeliveryRead.json',
  //     dataType: 'json',
  //     data: {
  //       infoid: infoid
  //     },
  //     success: function(data) {
  //       $('.msg_details_btn_' + infoid).html('<svg class="svg_icon" viewBox="0 0 1024 1024"><use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#view_detailed_svg"></use></svg>');
  //     },
  //     error: function(e) {
  //       console.log(e);
  //     }
  //   });
  // }

  // 顶部图片轮播
  function loopImages() {
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

})
