define([{
  display: '标题',
  name: 'title',
  minWidth: 100,
  isSort: false,
  width: '25%'
}, {
  display: '类别',
  name: 'category',
  minWidth: 100,
  isSort: false,
  width: '10%'
}, {
  display: '作者',
  name: 'author',
  minWidth: 60,
  isSort: false,
  width: '5%'
}, {
  display: '文章来源',
  name: 'source',
  minWidth: 60,
  isSort: false,
  width: '20%'
}, {
    display: '发表时间',
    name: 'times',
    tyep: 'date',
    isSort: false,
    format: 'yyyy-mm-dd HH:mm:ss',
    minWidth: 100,
    width: '10%'
}, {
    display: '置顶',
    name: 'top',
    width: '5%',
    isSort: false,
    render: function(rowdata, rowindex, value) {
      return value == 1 ? '是' : '否';
    }
}, {
  display: '图片',
  name: 'imgs',
  minWidth: 60,
  width: '5%',
  render: function(rowdata, rowindex, value) {
    var imgLabel = "";
    var imgs = rowdata.imgs.split(';');
    $.each(imgs, function(i, url) {
      if (url != "") imgLabel += '<img style="margin-right:10px;width: 50px;height: 28px;" src="' + url + '">';
    })
    return imgLabel;
  }
}, {
  display: '操作',
  isSort: false,
  minWidth: 200,
  width: '20%',
  name: 'Apply',
  render: function(rowdata, rowindex, value) {
    var h = "";
    h += "<button type='button' data-rowid='" + rowindex + "' data-id='" + rowdata.id + "' data-top='" + rowdata.top + "' data-name='" + rowdata.title + "' class='btn btn-outline btn-primary btn-xs row-btn row_btn_top'>" + (rowdata.top == 1 ? '取消置顶' : '置顶') + "</button> ";
    h += "<button type='button' data-rowid='" + rowindex + "' data-name='" + rowdata.title + "' class='btn btn-outline btn-info btn-xs row-btn row_btn_preview'>预览</button> ";
    h += "<button type='button' data-id='" + rowdata.id + "' class='btn btn-outline btn-warning btn-xs row-btn row_btn_edit'>修改</button> ";
    h += "<button type='button' data-id='" + rowdata.id + "' data-name='" + rowdata.title + "' class='btn btn-outline btn-danger btn-xs row-btn row_btn_del'>删除</button> ";
    return h;
  }
}])
