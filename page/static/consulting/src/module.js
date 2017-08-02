define(function(require, exports, module) {
	$.root_ = $('body');
	var _domain = "/didiweb/";
	var _tel = getParams('TEL');
	var auditMessage = false, _dropLoad;
	module.exports = {
		init : function() {
			this._bingBtn();
			this._bindUI();
			this._loadContent();
		},
		_bingBtn : function() {
			$('.bszn_btn a').prop('href',
					'../../../business/index.html?page=bszn&TEL=' + _tel);
			$('.flfg_btn a').prop('href',
					'../../../business/index.html?page=flfg&TEL=' + _tel);
		},
		_bindUI : function() {
			$.root_.off('click', '.reply_btn').on(
					'click',
					'.reply_btn',
					function(actionobj) {
						var rowobj = $(this);
						var msgid = rowobj.data("msgid");
						$('.reply_content').show();
						var title = $('.number_msg_' + msgid).text();
						var admin_msg = $('.admin_msg_' + msgid).text();
						$('.reply_number_msg').text(title);
						$('span.msgid_msg').text(msgid);
						$('pre.flex').text(
								(admin_msg == "null" ? '' : admin_msg));
						actionobj.preventDefault();
						rowobj = null;
					})
			$.root_.off('click', '.cons_commit_btn').on('click',
					'.cons_commit_btn', function(e) {
						commitMsg();
					})
			$.root_.off('click', '.cons_cancel_btn').on('click',
					'.cons_cancel_btn', function(e) {
						$('.reply_content').hide();
					})
			$.root_.off('click', '.x-row-blocks').on('click', '.x-row-blocks',
					function(e) {
						var id = $(e.currentTarget).data("id");
						var scrollTop = document.body.scrollTop;// 保存点击前滚动条的位置
						window.onscroll = function() {
							document.body.scrollTop = scrollTop;// 赋值给滚动条的位置
						}
						getMsg(id);
						pageviewsCount(id);
						$('.cons_detail').show();
					})
			$.root_.off('click', '.go_back_btn').on('click', '.go_back_btn',
					function(e) {
						window.onscroll = function() {
							document.body.scrollTop = document.body.scrollTop; // 关闭后清除保存位置的值
						}
						// $('body,html').animate({ scrollTop: 0 }, 0);
						$('.cons_detail').hide();
					})
			$.root_.off('click', '.cons_send_btn').on('click',
					'.cons_send_btn', function(e) {
						if ($('.x-qtype').hasClass('x-qtype-top')) {
							$('.x-qtype').removeClass('x-qtype-top');
							$('.x-qtype').addClass('x-qtype-down');
						} else {
							$('.x-qtype').removeClass('x-qtype-down');
							$('.x-qtype').addClass('x-qtype-top');
						}
						$('.cons_send').hide();
						$('.cons_content').show();
					})
			$.root_.off('click', '.cons_cancel_btn').on('click',
					'.cons_cancel_btn', function(e) {
						if ($('.x-qtype').hasClass('x-qtype-down')) {
							$('.x-qtype').removeClass('x-qtype-down');
							$('.x-qtype').addClass('x-qtype-top');
						} else {
							$('.x-qtype').removeClass('x-qtype-top');
							$('.x-qtype').addClass('x-qtype-down');
						}
						$('.cons_content').hide();
						$('.cons_send').show();
					})
			$.root_.off('click', '.x-qtype-btn').on('click', '.x-qtype-btn',
					function(e) {
						if ($('.x-qtype').hasClass('x-qtype-show')) {
							$('.x-qtype').removeClass('x-qtype-show');
						} else {
							$('.x-qtype').addClass('x-qtype-show');
						}
					})
			$.root_.off('change', 'input[name="qtype"]').on(
					'change',
					'input[name="qtype"]',
					function(e) {
						localStorage.setItem("qtype_status", $(e.currentTarget)
								.is(':checked'));
						reload();
					})
		},
		_loadContent : function() {
			$('input[name="qtype"]').prop("checked",
					localStorage.getItem("qtype_status") == "true");
			// $('pre.flex_phone').text(_tel);
			load();
		}
	}

	function reload() {
		$('.list_content')
				.empty()
				.append(
						'<section class="list_content_panel" style="display:block"></section>');
		$(".page_no").val(1);
		load();
	}

	function load() {
		var qtype = localStorage.getItem("qtype_status") == "true";
		var tabLoadEnd = false;
		var tabLenght = 0;
		_dropLoad = $('.list_content')
				.dropload(
						{
							scrollArea : window,
							domUp : { // 上方DOM
								domClass : 'dropload-up',
								domRefresh : '<div class="dropload-refresh">↓下拉刷新</div>',
								domUpdate : '<div class="dropload-update">↑释放更新</div>',
								domLoad : '<div class="dropload-load"><span class="loading"></span>加载中...</div>'
							},
							domDown : {
								domClass : 'dropload-down',
								domRefresh : '<div class="dropload-refresh">上拉加载更多</div>',
								domLoad : '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
								domNoData : '<div class="dropload-noData">已无数据</div>'
							},
							loadUpFn : function(me) {
								window.location.reload();
							},
							loadDownFn : function(me) {
								$
										.ajax({
											url : _domain
													+ 'gms_consulting/getList.do',
											dataType : 'json',
											contentType : 'application/json',
											data : {
												page : $(".page_no").val(),
												pagesize : 3,
												u_phone : _tel,
												qtype : qtype,
												sortname : 'createdat',
												sortorder : 'DESC'
											},
											dataType : 'json',
											cache : false,
											success : function(data) {
												var list = data.Rows;
												if (list == null) {
													$(".page_no")
															.val(
																	parseInt($(
																			".page_no")
																			.val()) - 1);
												}
												;
												if (list.length == 0) {
													tabLoadEnd = true;
												}
												setTimeout(
														function() {
															if (tabLoadEnd) {
																me.resetload();
																me.lock();
																me.noData();
																me.resetload();
																return;
															}
															var result = '';
															var statusKey = {
																0 : "已提交",
																1 : "已屏蔽",
																2 : "已回复"
															}
															for (var i = 0; i < list.length; i++) {
																var obj = list[i];
																if (obj.status == 1)
																	continue;
																result += '<div class="content-block">'
																		+ '<a href="javascript:void(0);" data-id='
																		+ obj.id
																		+ ' class="x-row-blocks">'
																		+ '<div class="row">'
																		+ '<div class="col-xs-6 text-left"><span>'
																		+ obj.title
																		+ '</span></div>'
																		+ '<div class="col-xs-6 text-right"><span>浏览量：<span class="x-cons-pv">'
																		+ obj.pageviews
																		+ '</span></span></div>'
																		+ '</div><div class="row">'
																		+ '<div class="col-xs-12 text-left"><span>申请人: '
																		+ obj.username
																				.substring(
																						0,
																						1)
																		+ (obj.sex == 0 ? '先生'
																				: '女士')
																		+ '</span></div>'
																		+ '</div><div class="row">'
																		+ '<div class="col-xs-12 text-left"><span>来信：'
																		+ (obj.createdat ? obj.createdat
																				.substring(
																						0,
																						10)
																				: '')
																		+ '</span></div>'
																		+ '</div><div class="row">'
																		+ '<div class="col-xs-6 text-left"><span>'
																		+ (obj.repliedat ? ('回复：' + obj.repliedat
																				.substring(
																						0,
																						10))
																				: '')
																		+ '</span></div>'
																		+ '<div class="col-xs-6 text-right"><span>状态：'
																		+ statusKey[obj.status]
																		+ '</span></div>'
																		+ '</div></a></div>';
															}
															$(
																	'.list_content_panel')
																	.append(
																			result);
															tabLenght++;
															me.resetload();
														}, 200);
												$(".page_no").val(
														parseInt($(".page_no")
																.val()) + 1);
											},
											error : function() {
												loading = true;
												$(".page_no").val(
														parseInt($(".page_no")
																.val()) - 1);
												console.log("查询数据出错啦，请刷新再试");
											}
										});
							}
						});
	}

	function commitMsg() {
		var username = $('pre.flex_username').text();
		var phone = $('pre.flex_phone').text();
		var sex = $('input[name="sex"]:checked').val();
		var title = $('pre.flex_title').text();
		var content = $('pre.flex_content').text();
		var u_phone = _tel;
		if (username == '') {
			alert("姓名不能为空，请填写");
			return false;
		}

		var pattern = /^1[34578]\d{9}$/;
		if (!pattern.test(phone)) {
			alert("手机号码有误，请重新填写");
			return false;
		}

		if (title == '') {
			alert("标题不能为空，请填写");
			return false;
		}

		if (content == '') {
			alert("详细情况不能为空，请填写");
			return false;
		}

		$.ajax({
			type : 'POST',
			contentType : 'application/json',
			url : _domain + 'gms_consulting/save.do',
			dataType : 'json',
			data : JSON.stringify({
				username : username,
				phone : phone,
				u_phone : u_phone,
				sex : sex,
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
			url : _domain + 'gms_consulting/get.do',
			dataType : 'json',
			data : {
				id : id
			},
			success : function(data) {
				if (data.success) {
					var obj = data.data;
					var statusKey = {
						0 : "已提交",
						1 : "已受理",
						2 : "已回复"
					}
					$('.detail_title span').text(obj.title);
					$('.detail_status span').text(statusKey[obj.status]);
					if (obj.content) {
						$('.detail_content').parent().show(), $(
								'.detail_content').text(obj.content)
					} else {
						$('.detail_content').parent().hide()
					}
					;
					$('.detail_username span').text(
							obj.username.substring(0, 1)
									+ (obj.sex == 0 ? '先生' : '女士'));
					$('.detail_createdat span')
							.text(
									obj.createdat ? obj.createdat.substring(0,
											10) : '');
					if (obj.replycontent) {
						$('.detail_replycontent').parent().show(), $(
								'.detail_replycontent').text(obj.replycontent)
					} else {
						$('.detail_replycontent').parent().hide()
					}
					;
					$('.detail_repliedat span').text(
							obj.repliedat ? ('回复：' + obj.repliedat.substring(0,
									10)) : '');
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
			url : _domain + 'gms_consulting/pvCount.do',
			dataType : 'json',
			data : {
				id : id
			},
			success : function(data) {
				if (data.success) {
				}
			},
			error : function(e) {
				console.log(e);
			}
		});
	}

	// url传参数变化类别
	function getParams(fndname) {
		var url = location.search; // 一般的查询
		var query = url.substr(url.indexOf("?") + 1);
		var pairs = query.split("&"); // 在逗号处断开
		for (var i = 0; i < pairs.length; i++) {
			var pos = pairs[i].indexOf('='); // 查找name=value
			if (pos == -1)
				continue; // 如果没有找到就跳过
			var argname = pairs[i].substring(0, pos); // 提取name
			var value = pairs[i].substring(pos + 1); // 提取value
			if (argname == fndname)
				return value;
		}
	}

	/* 时间处理函数 参数 毫秒 */
	function toLocaleString(ms, date) {
		var utc = 8 * 60 * 60 * 1000;
		var dateTime = date ? date : new Date(ms - utc);
		function p(s) {
			return s < 10 ? '0' + s : s;
		}
		// 获取当前年
		var year = dateTime.getFullYear();
		// 获取当前月
		var month = dateTime.getMonth() + 1;
		// 获取当前日
		var date = dateTime.getDate();

		var h = dateTime.getHours(); // 获取当前小时数(0-23)
		var m = dateTime.getMinutes(); // 获取当前分钟数(0-59)
		var s = dateTime.getSeconds();

		var now = [ year, p(month), p(date) ].join('-') + " "
				+ [ p(h), p(m), p(s) ].join(':');
		return now;
	}
})