define([{
  display: '标题',
  name: 'title',
  minWidth: 50,
  isSort: false,
  width: '15%',
  render: function(rowdata, rowindex, value) {
    return value&&value.length>20?(value.substring(0, 20)+'...'): value;
  }
}, {
  display: '申请人',
  name: 'username',
  minWidth: 40,
  isSort: false,
  width: '5%'
}, {
  display: '性别',
  name: 'sex',
  minWidth: 20,
  isSort: false,
  width: '5%',
  render: function(rowdata, rowindex, value) {
    var text = rowdata.status==3&&rowdata.reviewed==1&&!rowdata.replycontent? '' : (value==0? '男': '女')
    return text;
  }
}, {
    display: '账号电话',
    name: 'u_phone',
    minWidth: 60,
    isSort: false,
    width: '10%'
}, {
  display: '申请时间',
  name: 'createdat',
  type: "date",
  format: 'yyyy-mm-dd HH:mm:ss',
  minWidth: 120,
  isSort: false,
  width: '10%',
  render: function(rowdata, rowindex, value) {
    return value? value.substring(0, value.length-2): '';
  }
}, {
  display: '浏览量',
  name: 'pageviews',
  minWidth: 20,
  isSort: false,
  width: '5%'
}, {
  display: '回复人',
  name: 'replyperson',
  minWidth: 40,
  isSort: false,
  width: '5%'
}, {
  display: '回复时间',
  name: 'repliedat',
  minWidth: 120,
  type: "date",
  format: 'yyyy-mm-dd HH:mm:ss',
  isSort: false,
  width: '10%',
  render: function(rowdata, rowindex, value) {
    return value? value.substring(0, value.length-2): '';
  }
}, {
  display: '处理部门',
  name: 'job',
  minWidth: 50,
  isSort: false,
  width: '10%'
}, {
    display: '状态',
    name: 'status',
    width: '10%',
    isSort: false,
    render: function(rowdata, rowindex, value) {
      var key = {0:'已提交', 1:'处理中' ,2:'已回复(个人)', 3:'已回复(公开)', 4:'已处理'}
      return value==3&&!rowdata.username?'已发布':key[value];
    }
}, {
    display: '审核',
    name: 'reviewed',
    width: '5%',
    isSort: false,
    render: function(rowdata, rowindex, value) {
      var key = {0:'待审核', 1:'已审核'}
      return key[value];
    }
}, {
  display: '操作',
  isSort: false,
  minWidth: 50,
  width: '10%',
  name: 'Apply',
  render: function(rowdata, rowindex, value) {
    var h = "";
    // h += "<button type='button' data-id='" + rowdata.id + "' data-reviewed=" + (rowdata.reviewed==1?true:false) + " data-rowid='" + rowindex + "' data-name='" + rowdata.title + "' class='btn btn-outline btn-primary btn-xs row-btn " + (rowdata.reviewed==1?"disabled":"") + " row_btn_reviewed'>"+ (rowdata.reviewed==0?'个人可见': '所有可见') +"</button> ";
    h += "<button type='button' data-rowid='" + rowindex + "' data-name='" + rowdata.title + "' class='btn btn-outline btn-info btn-xs row-btn row_btn_preview'>"+ (rowdata.job&&rowdata.status==4&&rowdata.reviewed==0&&$('.x-tools>div').css('display')!='none'? '审核':(rowdata.status==3&&rowdata.reviewed==1&&rowdata.username==null?'修改':(rowdata.replycontent?'修改':'回复'))) +"</button> ";
     h += $('.x-role').val()=='超级管理员'? "<button type='button'  data-id='" + rowdata.id + "' data-title='" + rowdata.title + "' class='btn btn-outline btn-danger btn-xs row-btn row_btn_del'>删除</button> " : "";
    return h;
  }
}])
