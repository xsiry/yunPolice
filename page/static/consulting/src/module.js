define(function(require, exports, module) {
	$.root_ = $('body');
	var domain = "/didiweb/";
	var auditMessage = false, dropLoad;
	module.exports = {
		init : function() {
			this._bindUI();
			this._loadContent();
		},
		_bindUI : function() {
			$.root_.off('click', '.reply_btn').on('click', '.reply_btn', function(actionobj) {
				var rowobj = $(this);
				var msgid = rowobj.data("msgid");
				$('.reply_content').show();
				var title = $('.number_msg_' + msgid).text();
				var admin_msg = $('.admin_msg_' + msgid).text();
				$('.reply_number_msg').text(title);
				$('span.msgid_msg').text(msgid);
				$('pre.flex').text((admin_msg == "null" ? '': admin_msg));
				actionobj.preventDefault();
				rowobj = null;
			})
			$.root_.off('click', '.cons_commit_btn').on('click', '.cons_commit_btn', function(e) {
				commitMsg();
			})
			$.root_.off('click', '.cons_cancel_btn').on('click', '.cons_cancel_btn', function(e) {
				$('.reply_content').hide();
			})
			$.root_.off('click', '.x-row-blocks').on('click', '.x-row-blocks', function(e) {
				var id = $(e.currentTarget).data("id");
				var scrollTop = document.body.scrollTop;//保存点击前滚动条的位置
				window.onscroll=function(){
					document.body.scrollTop = scrollTop;//赋值给滚动条的位置
				}
				getMsg(id);
				pageviewsCount(id);
				$('.cons_detail').show();
			})
			$.root_.off('click', '.go_back_btn').on('click', '.go_back_btn', function(e) {
				window.onscroll=function(){
					document.body.scrollTop = document.body.scrollTop; //关闭后清除保存位置的值
				}
				// $('body,html').animate({ scrollTop: 0 }, 0);
				$('.cons_detail').hide();
			})
		},
		_loadContent : function() {
			load();
		}
	}

	function load() {
		var tabLoadEnd = false;
		var tabLenght = 0;
		dropLoad = $('.list_content').dropload({
			scrollArea: window,
			domUp : {                                                            // 上方DOM
        domClass   : 'dropload-up',
        domRefresh : '<div class="dropload-refresh">↓下拉刷新</div>',
        domUpdate  : '<div class="dropload-update">↑释放更新</div>',
        domLoad    : '<div class="dropload-load"><span class="loading"></span>加载中...</div>'
      },
			domDown: {
				domClass: 'dropload-down',
				domRefresh: '<div class="dropload-refresh">上拉加载更多</div>',
				domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
				domNoData: '<div class="dropload-noData">已无数据</div>'
			},
			loadUpFn: function(me) {
        window.location.reload();
      },
			loadDownFn: function(me) {
				$.ajax({
					url: domain + 'gms_consulting/getList.do',
					dataType: 'json',
					contentType: 'application/json',
					data: {
						page: $(".page_no").val(),
            pagesize: 3,
            sortname: 'createdat',
            sortorder: 'DESC'
					},
					dataType: 'json',
					cache: false,
					success: function(data) {
						var list = data.Rows;
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
							var statusKey = {0: "已提交", 1: "已受理", 2: "已回复"}
							for (var i = 0; i < list.length; i++) {
								var obj = list[i];
								result
										+= '<div class="content-block">'
										+  '<a href="javascript:void(0);" data-id='+ obj.id +' class="x-row-blocks">'
										+  '<div class="row">'
										+  '<div class="col-xs-6 text-left"><span>' + obj.title + '</span></div>'
										+  '<div class="col-xs-6 text-right"><span>浏览量：<span class="x-cons-pv">' + obj.pageviews + '</span></span></div>'
										+  '</div><div class="row">'
										+  '<div class="col-xs-12 text-left"><span>申请人: ' + obj.username + '</span></div>'
										+	'</div><div class="row">'
										+	'<div class="col-xs-12 text-left"><span>来信：' + (obj.createdat ? obj.createdat.substring(0,10) : '') + '</span></div>'
										+	'</div><div class="row">'
										+	'<div class="col-xs-6 text-left"><span>' + (obj.repliedat ? ('回复：' + obj.repliedat.substring(0,10)) : '') + '</span></div>'
										+	'<div class="col-xs-6 text-right"><span>状态：' + statusKey[obj.status] + '</span></div>'
										+ 	'</div></a></div>';
							}
							$('.list_content_panel').append(result);
							tabLenght ++;
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

	function commitMsg() {
		var username = $('pre.flex_username').text();
		var phone = $('pre.flex_phone').text();
		var title = $('pre.flex_title').text();
		var content = $('pre.flex_content').text();

		$.ajax({
			type : 'POST',
			contentType : 'application/json',
			url : domain + 'gms_consulting/save.do',
			dataType : 'json',
			data : JSON.stringify({
				username : username,
				phone : phone,
				title : title,
				content : content,
				createdat : toLocaleString('', new Date())
			}),
			success : function(data) {
				if (data) {
					window.location.reload();
				}
			},
			error : function(e) {
				console.log(e);
			}
		});
	}

	function getMsg(id) {
		$.ajax({
			type : 'GET',
			contentType : 'application/json',
			url : domain + 'gms_consulting/get.do',
			dataType : 'json',
			data : {
				id : id
			},
			success : function(data) {
				if (data.success) {
					var obj = data.data;
					var statusKey = {0: "已提交", 1: "已受理", 2: "已回复"}
					$('.detail_title span').text(obj.title);
					$('.detail_status span').text(statusKey[obj.status]);
					$('.detail_content span').text(obj.content);
					$('.detail_username span').text(obj.username);
					$('.detail_createdat span').text(obj.createdat ? obj.createdat.substring(0,10) : '');
					$('.detail_replycontent span').text(obj.replycontent ? ('反馈：' + obj.replycontent) : '');
					$('.detail_repliedat span').text(obj.repliedat ? ('回复：' + obj.repliedat.substring(0,10)) : '');
				}
			},
			error : function(e) {
				console.log(e);
			}
		});
	}

	// 统计浏览量
	function pageviewsCount(id) {
		$.ajax({
			type : 'GET',
			contentType : 'application/json',
			url : domain + 'gms_consulting/pvCount.do',
			dataType : 'json',
			data : {
				id : id
			},
			success : function(data) {
				if (data.success) {}
			},
			error : function(e) {
				console.log(e);
			}
		});
	}

	/* 时间处理函数 参数 毫秒 */
	function toLocaleString(ms, date) {
		var utc = 8*60*60*1000;
		var dateTime = date ? date : new Date(ms-utc);
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

		var now = [ year, p(month), p(date) ].join('-') + " " + [ p(h), p(m), p(s) ].join(':');
		return now;
	}
})