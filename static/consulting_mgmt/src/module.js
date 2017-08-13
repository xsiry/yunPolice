define(function(require, exports, module) {
  $.root_ = $('div.ibox-content');
  var manager, g;
  var _domain = "/didiweb/";
  module.exports = {

    init: function() {
      f_initGrid();
      this._configText();
      this._bindUI();
      initCombo();
      getAdmin();
    },
    _configText() {
      $('div h5.mgmt_title').text('咨询列表');
      $('div button font.mgmt_new_btn_text').text('新建常见问题');
      $('div button font.delivery_btn_text').text('推送');
      $('div input.name_search').prop('placeholder', '请输入问题标题');
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
        }
        newModal('','新建常见问题', fun);
      })

      $.root_.on("click", '.row_btn_preview', function(e) {
        var rowid = $(e.currentTarget).data('rowid');
        var title = $(e.currentTarget).text();
        var row = manager.getRow(rowid);
        if (row.status==3&&row.reviewed==1&&!row.replycontent&&!row.username) {
          var fun = function(dialogRef) {
            $('.consulting_title pre').text(row.title);
            $('.consulting_content pre').text(row.content);
          }
          newModal(row.id,'修改常见问题', fun);
        }else {
          var fun = function(dialogRef) {
        	  if ($('.x-role').val()!="超级管理员") $('.x-role-prem').hide();
            $('.consulting_title pre').text(row.title);
            $('.consulting_username').text(row.username);
            $('.consulting_createdat').html(row.createdat? row.createdat.substring(0, row.createdat.length-2): '');
            $('.consulting_content pre').text(row.content);
            $('.consulting_replycontent pre').text(row.replycontent);
            $('input[name="publicType"][value='+row.status+']').attr("checked",true);
          }
          previewModal(row.id, '问题'+title, fun);
        }
      })

      $.root_.on("click", '.row_btn_del', function(e) {
        var id = $(e.currentTarget).data('id');
        var title = $(e.currentTarget).data('title');
        delRow(id, title);
      })
      $.root_.on("click", '.row_btn_reviewed', function(e) {
        var id = $(e.currentTarget).data('id');
        var name = $(e.currentTarget).data('name');
        var reviewed = $(e.currentTarget).data('reviewed');
        reviewedRow(id, name, reviewed);
      })
      $.root_.on("click", '.delivery_btn', function(e) {
        deliverySend();
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
      url: _domain + 'gms_consulting/getList.do',
      method: "get",
      parms: {
    	  	qtype: 'all',
          search_text: encodeURIComponent($('.name_search').val()),
      },
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
    var gridparms = {
      qtype: 'searchAll',
      search_text: encodeURIComponent($('.name_search').val()),
      page:1,
      pagesize: g.options.pageSize,
      sortname:'createdat',
      sortorder:'DESC'
    };
    g.loadServerData(gridparms);
  };

  function delRow(id, title) {
    swal({
      title: '确定删除?',
      text: '删除后，咨询《' + title + '》将无法找回！',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then(function() {
      $.ajax({
        type : 'POST',
        contentType : 'application/json',
        url : _domain + 'gms_consulting/del/'+id+'.do',
        dataType : 'json',
        success : function(data) {
          if (data) {
            manager.reload();
            swal(
              '删除成功:)',
              '咨询《' + title + '》已删除.',
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
        // '已取消',
        // '《' + name + '》未删除 :)',
        // 'error'
        // )
      }
    })
  };

  function reviewedRow(id, title, reviewed) {
    if (reviewed) return;
    swal({
      title: '确定审核?',
      text: '审核后，咨询《' + title + '》将在客户端展示！',
      type: 'warning',
      showCancelButton: true,
      confirmButtonText: '确定',
      cancelButtonText: '取消'
    }).then(function() {
      $.ajax({
        type : 'POST',
        contentType : 'application/json',
        url : _domain + 'gms_consulting/update.do',
        data: JSON.stringify({
          id: id,
          reviewed: 1
        }),
        dataType : 'json',
        success : function(data) {
          if (data) {
            manager.reload();
            swal(
              '审核成功:)',
              '咨询《' + title + '》已通过审核.',
              'success'
            )
          }else{
            swal(
              '审核失败!',
              '未知错误，请联系管理员或查看日志',
              'error'
            )
          }
        },
        error : function(e) {
          swal(
            '审核失败!',
            '未知错误，请联系管理员或查看日志',
            'error'
          )
        }
      });
    }, function(dismiss) {
      if (dismiss === 'cancel') {
        // swal(
        // '已取消',
        // '《' + name + '》未删除 :)',
        // 'error'
        // )
      }
    })
  }

  function newModal(id, title, onshowFun) {
    var url = id == ''? 'save' : 'update';
    var modal = BootstrapDialog.show({
      id: 'newModal',
      title: title,
      size:  'size-wide',
      message: $('<div></div>').load('apps/consulting_mgmt_public.html'),
      cssClass: 'modal inmodal fade',
      buttons: [{
        icon: 'glyphicon glyphicon-check',
        label: '提交',
        cssClass: 'btn btn-primary',
        autospin: false,
        action: function(dialogRef) {
          var parms = {
                  title: $('#newModal .consulting_title pre').text(),
                  content: $('#newModal .consulting_content pre').text(),
                  replycontent: '',
                  status: 3,
                  reviewed: 1
                }
          if (id != '') parms['id'] = id;

          $.ajax({
            type : 'POST',
            contentType : 'application/json',
            url : _domain + 'gms_consulting/'+ url +'.do',
            data: JSON.stringify(parms),
            dataType : 'json',
            success : function(data) {
              if (data) {
                $('#newModalClose').click();
                g.loadData();
              }
            },
            error : function(e) {
              console.log(e)
            }
          })
      }
    }, {
        id: 'newModalClose',
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

  function previewModal(id, title, onshowFun) {
    var modal = BootstrapDialog.show({
      id: 'previewModal',
      title: title,
      size:  'size-wide',
      message: $('<div></div>').load('apps/consulting_mgmt_preview.html'),
      cssClass: 'modal inmodal fade',
      buttons: [{
        icon: 'glyphicon glyphicon-check',
        label: '提交',
        cssClass: 'btn btn-primary',
        autospin: false,
        action: function(dialogRef) {
          $.ajax({
            type : 'POST',
            contentType : 'application/json',
            url : _domain + 'gms_consulting/update.do',
            data: JSON.stringify({
              id: id,
              title: $('.consulting_title pre').text(),
              content: $('.consulting_content pre').text(),
              replycontent: $('.consulting_replycontent pre').text(),
              repliedat: dateFactory('', new Date(), true),
              status: $('input[name="publicType"]:checked').val(),
              reviewed: 1
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
          url : _domain + url,
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

  function deliverySend() {
    var job = $("select[name='jobs']").val();
    var row = g.getSelectedRow();

    if (!job) {
      alert('请选择部门');
      return;
    }
    if (!row) {
      alert('请选择一条记录');
      return;
    }
    if (row.status==3&&row.reviewed==1&&!row.replycontent&&!row.username) {
      alert('常见问题不能进行推送');
      return;
    }
    $.ajax({
      type : 'POST',
      contentType : 'application/json',
      url : _domain + "gms_consulting/update.do",
      dataType : 'json',
      data : JSON.stringify({
        id: row.id,
        job: job,
        status: 1
      }),
      success : function(data) {
        var msg = '';
        toastr.options = {
            closeButton: true,
            progressBar: true,
            showMethod: 'slideDown',
            timeOut: 4000
        };
        if (data) {
            msg = "操作成功！";
            toastr.success(msg);
            g.loadData();
        } else {
            msg = "操作失败！";
            toastr.error(msg);
        };
      },
      error : function(e) {
          msg = "操作失败！";
          toastr.error(msg);
          console.log(e);
      }
    });
  }

  /*
   * 初始化Combo
   */
  function initCombo(val) {
    $.ajax({
      type : 'GET',
      contentType : 'application/json',
      url : _domain + "x_sys_police/getList.do",
      dataType : 'json',
      success : function(data) {
        var sels = '<option value></option>';

        $.each(data.Rows, function(i, o) {
          var selected = o.police == val ? 'selected': '';
          sels += '<option value="'+ o.police +'" '+ selected +'>'+ o.police +'</option>';
        })

        $('.chosen-select').empty().append(sels);
        $('.chosen-select').chosen({});
      },
      error : function(e) {
          console.log(e);
      }
    });
  };

  /*
   * 获取管理员信息
   */
  function getAdmin() {
    $.ajax({
      type : 'GET',
      contentType : 'application/json',
      url : _domain + "x_sys_dic/getLoginUser.do",
      dataType : 'json',
      success : function(data) {
    	  	$('.x-role').val(data.data.roleName);
        if (data.data.roleName == "超级管理员") {
          $('.x-tools>div').show();
          $('.row_btn_del').show();
        }else {
          $('.x-tools>div').hide();
          $('.row_btn_del').hide();
        }
      },
      error : function(e) {
          console.log(e);
      }
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
              ['insert', ['hr', 'link']], // , 'video', 'picture'
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
