define(function(require, exports, module) {
  $.root_ = $('div.ibox-content');
  var _type = getParams('type'); // type = 1:办事指南 2: 法律法规
  var _domain = "/didiweb/";
  var manager, g;
  module.exports = {

    init: function() {
      f_initGrid();
      this._configText();
      this._bindUI();
    },
    _configText() {
      $('div h5.mgmt_title').text((_type == 1 ? '办事指南': '法律法规') +'列表');
      $('div button font.mgmt_new_btn').text('添加'+ (_type == 1 ? '办事指南': '法律法规'));
      $('div input.name_search').prop('placeholder', '输入新闻标题');
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
        newModal('添加'+ (_type == 1 ? '办事指南': '法律法规'), fun);
      })

      $.root_.on("click", '.row_btn_preview', function(e) {
        var rowid = $(e.currentTarget).data('rowid');
        var fun = function(dialogRef) {
          var row = manager.getRow(rowid);
          $('.inst_title h3').text(row.title);
          if (row.remarks) {
            $('.inst_remarks span').text(row.remarks);
          }else {
            $('.inst_remarks').hide();
          }

          $('.inst_conten').html(row.content);
        }
        previewModal(name, fun);
      })

      // bind grid edit
      $.root_.on("click", '.row_btn_edit', function(e) {
        var id = $(e.currentTarget).data('id');
        editRow(id);
      })
      $.root_.on("click", '.row_btn_del', function(e) {
        var id = $(e.currentTarget).data('id');
        var name = $(e.currentTarget).data('name');
        delRow(id, name);
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
      url: _domain + 'instruction/getGirds.do',
      parms: { type: _type },
      method: "get",
      dataAction: 'server',
      usePager: true,
      enabledEdit: false,
      clickToEdit: false,
      width: '100%',
      height: '91%',
      sortName: 'created',
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

  /*
   * 功能操作
   */
  function editRow(id) {
    $.ajax({
      type : 'GET',
      url : _domain + 'instruction/get.do',
      dataType : 'json',
      data : {
        id: id
      },
      success : function(responseText) {
        if (responseText.success) {
          var fun = function() {
            initSummernote();
            newModalValidation();
            $.each(responseText.data, function(key, val) {
              $('#newModalForm input[name="'+ key +'"]').val(val);
              if (key == 'content') {
                $('div.summernote').summernote('code', val);
              }
            })
          }
          newModal('修改'+ (_type == 1 ? '办事指南': '法律法规'), fun);
        }
      },
      error : function(e) {
        console.log(e);
      }
    });
  };

  function delRow(id, name) {
    swal({
      title: '确定删除?',
      text: '删除后，'+ (_type == 1 ? '办事指南': '法律法规') +'《' + name + '》将无法恢复！',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: '删除',
      cancelButtonText: '取消'
    }).then(function() {
      $.ajax({
        type : 'POST',
        url : _domain + 'instruction/del/'+id+".do",
        dataType : 'json',
        success : function(data) {
          if (data) {
            manager.reload();
            swal(
              '删除成功:)',
              '指南《' + name + '》已被删除.',
              'success'
            )
          }else{
            swal(
              '删除失败!',
              '未知错误，请联系管理员或查看日志',
              'error'
            )
          }
        },
        error : function(e) {
          swal(
            '删除失败!',
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

  function newModal(title, onshowFun) {
    var modal = BootstrapDialog.show({
      id: 'newModal',
      title: title,
      size: 'size-wide',
      message: $('<div></div>').load('apps/instruction_mgmt_modal.html'),
      cssClass: 'modal inmodal fade',
      buttons: [{
        type: 'submit',
        icon: 'glyphicon glyphicon-check',
        label: '保存',
        cssClass: 'btn btn-primary',
        autospin: false,
        action: function(dialogRef) {
          $('#newModalForm').submit();
        }
      }, {
        id: 'newModalClose',
        label: '取消',
        cssClass: 'btn btn-white',
        autospin: false,
        action: function(dialogRef) {
          dialogRef.close();
        }
      }],
      onshown: onshowFun
    });
  };

  function previewModal(title, onshowFun) {
    var modal = BootstrapDialog.show({
      id: 'previewModal',
      title: title,
      size:  'size-wide',
      message: $('<div></div>').load('apps/instruction_mgmt_preview.html'),
      cssClass: 'modal inmodal fade',
      buttons: [{
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
          groupname: {
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
        var content = $('div.summernote').summernote('code');

        if (!content) {
          alert('内容不能为空');
          return;
        }
        // Use Ajax to submit form data
        var formVals = {created: dateFactory('', new Date(), true), content: content, type: _type};
        $.each($form.serializeArray(), function(i, o) {
          formVals[o.name] = o.value;
        });

        var url = formVals['id'] ? _domain + 'instruction/update.do' : _domain + 'instruction/save.do';

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
                msg = "操作成功！";
                toastr.success(msg);
            } else {
                msg = "操作失败！";
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
