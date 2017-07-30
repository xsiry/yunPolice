define([{
  display: '标题',
  name: 'title',
  minWidth: 50,
  isSort: false,
  width: '15%'
}, {
  display: '申请人',
  name: 'username',
  minWidth: 80,
  isSort: false,
  width: '10%'
}, {
  display: '性别',
  name: 'sex',
  minWidth: 50,
  isSort: false,
  width: '5%',
  render: function(rowdata, rowindex, value) {
    return value==0? '男': '女';
  }
}, {
  display: '申请人电话',
  name: 'phone',
  minWidth: 60,
  isSort: false,
  width: '10%'
}, {
  display: '申请时间',
  name: 'createdat',
  type: "date",
  format: 'yyyy-mm-dd HH:mm:ss',
  minWidth: 150,
  isSort: false,
  width: '10%',
  render: function(rowdata, rowindex, value) {
    return value? value.substring(0, value.length-2): '';
  }
}, {
  display: '浏览量',
  name: 'pageviews',
  minWidth: 60,
  isSort: false,
  width: '5%'
}, {
  display: '回复人',
  name: 'replyperson',
  minWidth: 60,
  isSort: false,
  width: '10%'
}, {
  display: '回复时间',
  name: 'repliedat',
  minWidth: 150,
  type: "date",
  format: 'yyyy-mm-dd HH:mm:ss',
  isSort: false,
  width: '10%',
  render: function(rowdata, rowindex, value) {
    return value? value.substring(0, value.length-2): '';
  }
}, {
    display: '状态',
    name: 'status',
    width: '5%',
    isSort: false,
    render: function(rowdata, rowindex, value) {
      var key = {0:'已提交', 1:'已屏蔽' ,2:'已回复'}
      return key[value];
    }
}, {
  display: '操作',
  isSort: false,
  minWidth: 100,
  width: '15%',
  name: 'Apply',
  render: function(rowdata, rowindex, value) {
    var h = "";
    h += "<button type='button' data-id='" + rowdata.id + "' data-reviewed=" + (rowdata.reviewed==1?true:false) + " data-rowid='" + rowindex + "' data-name='" + rowdata.title + "' class='btn btn-outline btn-primary btn-xs row-btn " + (rowdata.reviewed==1?"disabled":"") + " row_btn_reviewed'>"+ (rowdata.reviewed==0?'审核': '已审核') +"</button> ";
    h += "<button type='button' data-rowid='" + rowindex + "' data-name='" + rowdata.title + "' class='btn btn-outline btn-info btn-xs row-btn row_btn_preview'>"+ (rowdata.replycontent?'修改':'回复') +"</button> ";
    h += "<button type='button' data-reply=" + (rowdata.replycontent?true:false) + " data-status=" + (rowdata.status == 1 ? true:false) + " data-id='" + rowdata.id + "' data-name='" + rowdata.title + "' class='btn btn-outline btn-danger btn-xs row-btn row_btn_hide'>"+(rowdata.status == 1 ? '取消屏蔽':'屏蔽')+"</button> ";
    return h;
  }
}])
