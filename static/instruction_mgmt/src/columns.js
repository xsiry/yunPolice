define([{
  display: '标题',
  name: 'title',
  minWidth: 50,
  isSort: false,
  width: '20%'
}, {
	  display: '备注',
	  name: 'remarks',
	  minWidth: 60,
	  isSort: false,
	  width: '45%'
}, {
  display: '分组',
  name: 'groupname',
  minWidth: 80,
  isSort: false,
  width: '10%'
}, {
  display: '创建时间',
  name: 'created',
  type: "date",
  format: 'yyyy-mm-dd HH:mm:ss',
  minWidth: 150,
  isSort: false,
  width: '10%',
  render: function(rowdata, rowindex, value) {
    return value? value.substring(0, value.length-2): '';
  }
}, {
  display: '操作',
  isSort: false,
  minWidth: 100,
  width: '15%',
  name: 'Apply',
  render: function(rowdata, rowindex, value) {
    var h = "";
    h += "<button type='button' data-rowid='" + rowindex + "' data-name='" + rowdata.title + "' class='btn btn-outline btn-info btn-xs row-btn row_btn_preview'>预览</button> ";
    h += "<button type='button' data-id='" + rowdata.id + "' class='btn btn-outline btn-warning btn-xs row-btn row_btn_edit'>修改</button> ";
    h += "<button type='button' data-id='" + rowdata.id + "' data-name='" + rowdata.title + "' class='btn btn-outline btn-danger btn-xs row-btn row_btn_del'>删除</button> ";
    return h;
  }
}])
