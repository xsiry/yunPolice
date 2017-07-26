define([{
  display: '标题',
  name: 'title',
  minWidth: 100,
  isSort: false,
  width: '20%'
}, {
  display: '申请人',
  name: 'username',
  minWidth: 100,
  isSort: false,
  width: '15%'
}, {
  display: '申请人电话',
  name: 'phone',
  minWidth: 60,
  isSort: false,
  width: '10%'
}, {
  display: '申请时间',
  name: 'createdat',
  tyep: 'date',
  format: 'yyyy-mm-dd HH:mm:ss',
  minWidth: 100,
  isSort: false,
  width: '10%'
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
  width: '15%'
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
  minWidth: 200,
  width: '20%',
  name: 'Apply',
  render: function(rowdata, rowindex, value) {
    var h = "";
    h += "<button type='button' data-rowid='" + rowindex + "' data-name='" + rowdata.title + "' class='btn btn-outline btn-info btn-xs row-btn row_btn_preview'>"+ (rowdata.replycontent?'修改':'回复') +"</button> ";
    h += "<button type='button' data-reply=" + (rowdata.replycontent?true:false) + " data-status=" + (rowdata.status == 1 ? true:false) + " data-id='" + rowdata.id + "' data-name='" + rowdata.title + "' class='btn btn-outline btn-danger btn-xs row-btn row_btn_hide'>"+(rowdata.status == 1 ? '取消屏蔽':'屏蔽')+"</button> ";
    return h;
  }
}])
