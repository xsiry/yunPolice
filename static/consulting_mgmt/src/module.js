define(function(require, exports, module) {
  $.root_ = $('div.ibox-content');
  var manager, g;
  var domain = "/";
  module.exports = {

    init: function() {
      f_initGrid();
      this._configText();
      this._bindUI();
    },
    _configText() {
      $('div h5.mgmt_title').text('咨询列表');
      $('div button font.mgmt_new_btn').text('添加咨询');
      $('div input.name_search').prop('placeholder', '输入咨询标题');
      $('div button.name_search_btn').text('搜索');
    },
    _bindUI: function() {
      // bind .name_search_btn
      $.root_.on("click", '.name_search_btn', function(e) {
          f_search();
        })
        // bind .name_search
      $.root_.on("keypress", '.name_search', function(e) {
          if (e.which == "13") f_search();
        })
        // bind .name_search val.length is 0
      $.root_.on('input propertychange', '.name_search', function(e) {
          if ($('.name_search').val().length == 0) f_search();
        })
        // bind .v_mnt_new_modal_btn
      $.root_.on("click", '.new_modal_btn', function(e) {
        var fun = function(dialogRef) {
          initSummernote();
          newModalValidation();
        }
        newModal('添加咨询', fun);
      })

      $.root_.on("click", '.row_btn_preview', function(e) {
        var rowid = $(e.currentTarget).data('rowid');
        var row = manager.getRow(rowid);
        var fun = function(dialogRef) {
          $('.consulting_title h3').text(row.title);
          $('.consulting_username').text(row.username);
          $('.consulting_createdat').html(row.createdat);
          $('.consulting_content').text(row.content);
          $('.consulting_replycontent pre').text(row.replycontent);
        }
        previewModal(row.id, row.title, fun);
      })

      $.root_.on("click", '.row_btn_hide', function(e) {
        var id = $(e.currentTarget).data('id');
        var name = $(e.currentTarget).data('name');
        var status = $(e.currentTarget).data('status');
        var reply = $(e.currentTarget).data('reply');
        hideRow(id, name, status, reply);
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
      url: domain + 'gms_consulting/getList.do',
      method: "get",
      dataAction: 'server',
      usePager: true,
      enabledEdit: false,
      clickToEdit: false,
      width: '100%',
      height: '91%',
      sortName: 'createdat',
      sortOrder: 'DESC'
    });
  };

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

  function hideRow(id, name, status, reply) {
    swal({
      title: '确定'+ (status?'取消屏蔽':'屏蔽') + '?',
      text: (status?'取消屏蔽':'屏蔽') + '后，咨询《' + name + '》将'+ (status?'':'不') + '在客户端展示！',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then(function() {
      $.ajax({
        type : 'POST',
        contentType : 'application/json',
        url : domain + 'gms_consulting/update.do',
        data: JSON.stringify({
          id: id,
          status: (status?(reply?2:0):1)
        }),
        dataType : 'json',
        success : function(data) {
          if (data) {
            manager.reload();
            swal(
              (status?'取消屏蔽':'屏蔽') + '成功:)',
              '咨询《' + name + '》已'+(status?'取消':'被')+'屏蔽.',
              'success'
            )
          }else{
            swal(
              (status?'取消屏蔽':'屏蔽') + '失败!',
              '未知错误，请联系管理员或查看日志',
              'error'
            )
          }
        },
        error : function(e) {
          swal(
            (status?'取消屏蔽':'屏蔽') + '失败!',
            '未知错误，请联系管理员或查看日志',
            'error'
          )
        }
      });
    }, function(dismiss) {
      if (dismiss === 'cancel') {
        // swal(
        //   '已取消',
        //   '新闻《' + name + '》未删除 :)',
        //   'error'
        // )
      }
    })
  };

  function previewModal(id, title, onshowFun) {
    var modal = BootstrapDialog.show({
      id: 'previewModal',
      title: title,
      size:  'size-wide',
      message: $('<div></div>').load('apps/consulting_mgmt_preview.html'),
      cssClass: 'modal inmodal fade',
      buttons: [{
        icon: 'glyphicon glyphicon-check',
        label: '回复',
        cssClass: 'btn btn-primary',
        autospin: false,
        action: function(dialogRef) {
          $.ajax({
            type : 'POST',
            contentType : 'application/json',
            url : domain + 'gms_consulting/update.do',
            data: JSON.stringify({
              id: id,
              replycontent: $('.consulting_replycontent pre').text(),
              repliedat: dateFactory('', new Date(), true),
              status: 2
            }),
            dataType : 'json',
            success : function(data) {
              if (data) {
                $('#previewModalClose').click();
                g.loadData();
              }
            },
            error : function(e) {
              console.log(e)
            }
          })
      }
    }, {
        id: 'previewModalClose',
        label: '关闭',
        cssClass: 'btn btn-white',
        autospin: false,
        action: function(dialogRef) {
          dialogRef.close();
        }
      }],
      onshown: onshowFun
    });
  };

  /*
   * 添加验证
   */
  function newModalValidation() {
    $('#newModalForm').formValidation({
        autoFocus: true,
        locale: 'zh_CN',
        message: '该值无效，请重新输入',
        err: {
          container: 'tooltip'
        },
        icon: {
          valid: 'glyphicon glyphicon-ok',
          invalid: 'glyphicon glyphicon-remove',
          validating: 'glyphicon glyphicon-refresh'
        },
        fields: {
          title: {
            validators: {
              notEmpty: {}
            }
          },
          author: {
            validators: {
              notEmpty: {}
            }
          },
          source: {
            validators: {
              notEmpty: {}
            }
          }
        }
      })
      .on('success.form.fv', function(e) {
        // Prevent form submission
        e.preventDefault();

        // Get the form instance
        var $form = $(e.target);

        // Get the FormValidation instance
        var bv = $form.data('formValidation');

        // Use Ajax to submit form data
        var formVals = {times: dateFactory('', new Date(), true), content: $('div.summernote').summernote('code')};
        $.each($form.serializeArray(), function(i, o) {
          formVals[o.name] = o.value;
        });

        var url = formVals['id'] ? 'update.do' : 'save.do';

        $.ajax({
          type : 'POST',
          contentType : 'application/json',
          url : url,
          dataType : 'json',
          data : JSON.stringify(formVals),
          success : function(data) {
            var msg;
            manager.reload();
            toastr.options = {
                closeButton: true,
                progressBar: true,
                showMethod: 'slideDown',
                timeOut: 4000
            };
            if (data) {
                msg = "广告业务操作成功！";
                toastr.success(msg);
            } else {
                msg = "广告业务操作失败！";
                toastr.error(msg);
            };

            $('#newModalClose').click();
          },
          error : function(e) {
              console.log(e);
          }
        });
      });
  };

  function initSummernote() {
      $('.summernote').summernote({
          height: 300,
          focus: false,
          tabsize: 2,
          lang: 'zh-CN',
          dialogsInBody: true,
          disableDragAndDrop: true,
          placeholder: '请输入..',
          toolbar: [
              ['style', ['style']],
              ['font', ['bold', 'italic', 'underline', 'strikethrough', 'removeFormat', 'clear']],
              ['color', ['color']],
              ['para', ['ul', 'ol', 'paragraph']],
              ['font', ['height']],
              ['table', ['table']],
              ['insert', ['hr', 'link']], //, 'video', 'picture'
              ['view', ['fullscreen', 'codeview']],
              ['fontname', ['fontname']]
          ]
      });
  }

  function dateFactory(str, date, yearBool) {
    function p(s) {
      return s < 10 ? '0' + s : s;
    }

    var d = date ? date : string2date(str);
    //获取当前年
    var year = d.getFullYear();
    //获取当前月
    var month = d.getMonth() + 1;
    //获取当前日
    var date = d.getDate();

    var h = d.getHours(); //获取当前小时数(0-23)
    var m = d.getMinutes(); //获取当前分钟数(0-59)
    var s = d.getSeconds();
    var mydatetime = yearBool ? [[year, p(month), p(date)], [p(h), p(m), p(s)]] : [p(month), p(date)];
    var now = yearBool ?  [mydatetime[0].join('-'),mydatetime[1].join('-')].join(' ') : mydatetime.join('-');
    return now;
  }

  function string2date(str) {
    return new Date(Date.parse(str.replace(/-/g, "/")) -24*60*60*1000);
  }
})
