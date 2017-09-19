define(function(require, exports, module) {
  $.root_ = $('div.ibox-content');
  var manager, g;
  var _domain = "/";
  module.exports = {

    init: function() {
      this._configText();
      this._bindUI();
      this._initRadio();
    },
    _configText() {
      $('div h5.mgmt_title').text('案件流转');
    },
    _bindUI: function() {
      $.root_.on("click", '.submit_btn', function(e) {
        var status = $('input[name="status"]:checked').val();
        $.ajax({
          type : 'POST',
          contentType : 'application/json',
          url : _domain + 'case_circulation/update.do',
          data: JSON.stringify({
            id: 1,
            status: status
          }),
          dataType : 'json',
          success : function(data) {
            alert("提交成功！");
            console.log("已切换到"+ (status==0? '自动流转模式':'二级转处模式'));
          },
          error : function(e) {
            alert("提交失败！");
            console.log(e)
          }
        });
      })
    },
    _initRadio: function() {
      $.ajax({
        type : 'GET',
        contentType : 'application/json',
        url : _domain + 'case_circulation/get.do',
        dataType : 'json',
        success : function(data) {
          $('input[name="status"][value='+ parseInt(data.data.status) +']').attr("checked", "checked");
        },
        error : function(e) {
          console.log(e)
        }
      });
    }
  }
})
