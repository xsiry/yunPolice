define(function(require, exports, module) {
    $.root_ = $('body');
    var _domain = "/";
    var _tel = getParams('TEL');
    var _name = getParams('NAME');
    var _sex = getParams('SEX');
    var _search = false;
    var _qtype = 'public';
    var _tabLoadEnd = false;

    var auditMessage = false,
        _dropLoad;
    module.exports = {
        init: function() {
            this._bindUI();
            this._loadContent();
        },
        _bindUI: function() {
            $.root_.off('click', '.reply_btn').on('click', '.reply_btn', function(actionobj) {
                var rowobj = $(this);
                var msgid = rowobj.data("msgid");
                $('.reply_content').show();
                var title = $('.number_msg_' + msgid).text();
                var admin_msg = $('.admin_msg_' + msgid).text();
                $('.reply_number_msg').text(title);
                $('span.msgid_msg').text(msgid);
                $('pre.flex').text((admin_msg == "null" ? '' : admin_msg));
                actionobj.preventDefault();
                rowobj = null;
            })
            $.root_.off('click', '.cons_commit_btn').on('click', '.cons_commit_btn', function(e) {
                commitMsg();
            })
            $.root_.off('click', '.cons_cancel_btn').on('click', '.cons_cancel_btn', function(e) {
                $('.cons_content').hide();
            })
            $.root_.off('click', '.x-row-blocks').on('click', '.x-row-blocks', function(e) {
                var id = $(e.currentTarget).data("id");
                var scrollTop = document.body.scrollTop; // 保存点击前滚动条的位置
                window.onscroll = function() {
                    document.body.scrollTop = scrollTop; // 赋值给滚动条的位置
                }
                getMsg(id);
                pageviewsCount(id);
                $('.cons_detail').show();
            })
            $.root_.off('click', '.consulting_go_back_btn').on('click', '.consulting_go_back_btn', function(e) {
                window.onscroll = function() {
                    document.body.scrollTop = document.body.scrollTop; // 关闭后清除保存位置的值
                }
                // $('body,html').animate({ scrollTop: 0 }, 0);
                $('.cons_detail').hide();
            })
            $.root_.off('click', '.cons_send_btn').on('click', '.cons_send_btn', function(e) {
                $('.cons_send').hide();
                $('.cons_content').show();
            })
            $.root_.off('click', '.cons_cancel_btn').on('click', '.cons_cancel_btn', function(e) {
                $('.cons_content').hide();
                $('.cons_send').show();
            })
            $.root_.off('click', '.wtzx_tabs a').on('click', '.wtzx_tabs a', function(e) {
                var qtype = $(e.currentTarget).data("qtype");
                _qtype = qtype;
                $('.list_content section').prop('id', 'list_' + _qtype);
                $('.page_no').prop('id', 'page_no_' + _qtype);
                reload();
            })
            $.root_.off('click', '.search_btn').on('click', '.search_btn', function(e) {
                if ($('#x-search').val().length > 0) {
                    $('.canal_btn').show();
                    $('.wtzx_tabs a[data-qtype="search"]').trigger('click');
                    $('.wtzx_tabs').hide();
                    $('.x-zx-top').css('height', '60px');
                    $('.list_content').css('padding-top', '55px');
                }
            })
            $.root_.off('click', '.canal_btn').on('click', '.canal_btn', function(e) {
                $('.canal_btn').hide();
                $('#x-search').val('');
                if ($('.wtzx_tabs').css("display") == "none") {
                    $('.wtzx_tabs').show();
                    $('.wtzx_tabs a:eq(0)').trigger('click');
                    $('.x-zx-top').css('height', '100px');
                    $('.list_content').css('padding-top', '95px');
                }
            })
            $.root_.off('input propertychange', '#x-search').on('input propertychange', '#x-search', function(e) {
                if ($(e.currentTarget).val().length > 0) {
                    $('.canal_btn').show();
                } else {
                    $('.canal_btn').hide();
                    if ($('.wtzx_tabs').css("display") == "none") {
                        $('.wtzx_tabs').show();
                        $('.wtzx_tabs a:eq(0)').trigger('click');
                        $('.x-zx-top').css('height', '100px');
                        $('.list_content').css('padding-top', '95px');
                    }
                }
            })
        },
        _loadContent: function() {
            $('.list_content section').prop('id', 'list_' + _qtype);
            $('.page_no').prop('id', 'page_no_' + _qtype);
            load();
        }
    }

    function reload() {
        _tabLoadEnd = false;
        if (_dropLoad != null) {
            $('#page_no_' + _qtype).val(1);
            $('.list_content section').empty();
            _dropLoad.resetload();
            _dropLoad.unlock();
            _dropLoad.noData(false);
            _dropLoad.resetload();
            return;
        };
    }

    function load() {
        _dropLoad = $('.list_content')
            .dropload({
                scrollArea: window,
                domUp: { // 上方DOM
                    domClass: 'dropload-up',
                    domRefresh: '<div class="dropload-refresh">↓下拉刷新</div>',
                    domUpdate: '<div class="dropload-update">↑释放更新</div>',
                    domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>'
                },
                domDown: {
                    domClass: 'dropload-down',
                    domRefresh: '<div class="dropload-refresh">上拉加载更多</div>',
                    domLoad: '<div class="dropload-load"><span class="loading"></span>加载中...</div>',
                    domNoData: '<div class="dropload-noData">已无数据</div>'
                },
                loadUpFn: function(me) {
                    me.upInsertDOM = false;
                    me.$domUp.remove();
                    reload();
                },
                loadDownFn: function(me) {
                    $.ajax({
                        url: _domain + 'gms_consulting/getList.do',
                        dataType: 'json',
                        contentType: 'application/json',
                        data: {
                            page: $('#page_no_' + _qtype).val(),
                            pagesize: 8,
                            qtype: _qtype,
                            u_phone: _tel,
                            search_text: encodeURIComponent($('#x-search').val()),
                            sortname: 'createdat',
                            sortorder: 'DESC'
                        },
                        dataType: 'json',
                        cache: false,
                        success: function(data) {
                            if (data.success) {
                                var list = data.Rows;
                                var lqtype = data.qtype;
                                if (list == null) {
                                    $('#page_no_' + lqtype).val(parseInt($('#page_no_' + lqtype).val()) - 1);
                                };
                                if (list && list.length == 0) {
                                    _tabLoadEnd = true;
                                }
                                if (_tabLoadEnd) {
                                    me.resetload();
                                    me.lock();
                                    me.noData();
                                    me.resetload();
                                    return;
                                }
                                var result = '';
                                var statusKey = {
                                    0: "处理中",
                                    1: "处理中",
                                    2: "已回复",
                                    3: "已回复",
                                    4: "处理中"
                                }
                                for (var i = 0; i < list.length; i++) {
                                    var obj = list[i];
                                    var number = obj.pageviews ? parseInt(obj.pageviews) : 0;
                                    if ($('a[data-id='+ obj.id +']').length>0) continue;
                                    result += '<div class="content-block x-zx-row">' +
                                        '<a href="javascript:void(0);" data-id=' +
                                        obj.id +
                                        ' class="x-row-blocks">' +
                                        '<div class="row">' +
                                        '<div class="col-xs-'+(_qtype=='public'?'12':'8')+' text-left" style="text-overflow:ellipsis;white-space:nowrap; overflow:hidden;">' + obj.title +
                                        '</div>' +
                                        // '</div><div class="row">' +
                                        // '<div class="col-xs-12 text-left"><span>' +
                                        // (_qtype=='me'?('咨询人：' +obj.username.substring(0,1) +(obj.sex == 0 ? '先生' :'女士')):'') +
                                        // '</span></div>' +
                                        //'</div><div class="row">' +
                                        //(lqtype == 'me' && obj.createdat ? ('<div class="col-xs-8 text-left"><span>来&emsp;信：' + obj.createdat.substring(0, obj.createdat.length - 5) + '</span></div>') : '') +
                                        // '</span></div>' +
                                        // '</div><div class="row">' +
                                        // '<div class="col-xs-8 text-left"><span>' +
                                        // (_qtype=='me'&&obj.repliedat&&obj.reviewed==1 ? ('回&emsp;复：' + obj.repliedat.substring(0, obj.createdat.length-5)) : '') +
                                        (lqtype == 'me' ? (' <div class="col-xs-4 text-right"><span> 状态：' + statusKey[obj.status] + '</span></div>') : '') +
                                        //(_qtype=='public'?('<div class="col-xs-12"><div class="pull-right" style="width: 90px;"><span>浏览量:<span class="x-cons-pv">' + (number>999?'999+':number) +'</span></span></div></div>'):'')+
                                        '</div></a></div>';
                                }
                                $('#list_' + lqtype).append(result);
                                $('#page_no_' + lqtype).val(parseInt($('#page_no_' + lqtype).val()) + 1);
                                me.resetload();
                            } else {
                                loading = true;
                                $('#page_no_' + lqtype).val(parseInt($('#page_no_' + lqtype).val()) - 1);
                                alert("查询数据出错啦，请刷新再试");
                            }
                        },
                        error: function() {
                            loading = true;
                            $('#page_no_' + lqtype).val(parseInt($('#page_no_' + lqtype).val()) - 1);
                            alert("查询数据出错啦，请刷新再试");
                        }
                    });
                }
            });
    }

    function commitMsg() {
        var username = $('pre.flex_username').text();
        // var phone = $('pre.flex_phone').text();
        var sex = $('input[name="sex"]:checked').val();
        var title = $('pre.flex_title').text();
        var content = $('pre.flex_content').text();

        if (username == '') {
            $('pre.flex_username').focus();
            alert("姓名不能为空，请填写");
            return false;
        }

        // var pattern = /^1[34578]\d{9}$/;
        // if (!pattern.test(phone)) {
        //     alert("手机号码有误，请重新填写");
        //     return false;
        // }

        if (title == '') {
            $('pre.flex_title').focus();
            alert("咨询问题不能为空，请填写");
            return false;
        }

        if (content == '') {
            $('pre.flex_content').focus();
            alert("详细情况不能为空，请填写");
            return false;
        }
        $('.cons_msg_error span').text("");
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: _domain + 'gms_consulting/save.do',
            dataType: 'json',
            data: JSON.stringify({
                username: username,
                // phone: phone,
                u_phone: _tel,
                sex: parseInt(sex),
                title: title,
                content: content,
                createdat: toLocaleString('', new Date())
            }),
            success: function(data) {
                if (data) {
                    alert('咨询提交成功！');
                    // $('.cons_commit_btn').prop("disabled","disabled");
                    var fun = function() {
                        $('.x-qtype').removeClass('x-qtype-down');
                        $('.x-qtype').addClass('x-qtype-top');
                        $('.cons_send').show();
                        $('.wtzx_tabs a:eq(1)').trigger('click');
                        $('.cons_content').hide();
                        //重置表单
                        $('pre.flex_username').text('');
                        $('input[name="sex"][value=0]').prop("checked", true);
                        $('pre.flex_title').text('');
                        $('pre.flex_content').text('');
                        // $('.cons_commit_btn').text('提交咨询');
                        // $('.cons_commit_btn').removeProp("disabled");
                    }
                    setTimeout(fun, 200)
                } else {
                    alert("提交失败！请重新尝试！");
                }
            },
            error: function(e) {
                alert("提交失败！服务器错误")
                console.log(e);
            }
        });
    }

    function getMsg(id) {
        $('.detail_replycontent').text('');
        $.ajax({
            type: 'GET',
            contentType: 'application/json',
            url: _domain + 'gms_consulting/get.do',
            dataType: 'json',
            data: {
                id: id
            },
            success: function(data) {
                if (data.success) {
                    var obj = data.data;
                    var statusKey = {
                        0: "已提交",
                        1: "已受理",
                        2: "已回复"
                    }
                    var number = obj.pageviews ? parseInt(obj.pageviews) : 0;
                    $('.detail_title span').text(obj.title);
                    $('.detail_status span').text(statusKey[obj.status]);
                    if (obj.content) {
                        $('.detail_content').parent().show(), $('.detail_content').text(obj.content)
                    } else {
                        $('.detail_content').parent().hide()
                    };

                    $('.detail_username span').text((obj.username ? '咨询人：' + obj.username.substring(0, 1) : '') + (obj.sex == 0 ? '先生' : '女士'));
                    if (obj.status == 3 && _qtype=="public") { $('.detail_username span').text('点击量：' + (number > 9999 ? '9999+' : number)) };
                    $('.detail_createdat span').text(obj.createdat ? obj.createdat.substring(0, obj.createdat.length - 5) : '');
                    if (obj.replycontent && obj.reviewed == 1) {
                        $('.detail_replycontent').parent().show(), $('.cons_detail .row:nth-child(3)').css('border-bottom', '1px solid rgb(230, 230, 230)'), $('.detail_replycontent').text(obj.replycontent)
                    } else {
                        $('.detail_replycontent').parent().hide(), $('.cons_detail .row:nth-child(3)').css('border', 0);
                    };
                    $('.detail_repliedat span').text(obj.repliedat && obj.reviewed == 1 ? (obj.repliedat.substring(0, obj.repliedat.length - 5)) : '');
                }
            },
            error: function(e) {
                console.log(e);
            }
        });
    }

    // 统计浏览量
    function pageviewsCount(id) {
        $.ajax({
            type: 'POST',
            contentType: 'application/json',
            url: _domain + 'gms_consulting/pvCount/' + id + '.do',
            dataType: 'json',
            success: function(data) {
                if (data.success) {}
            },
            error: function(e) {
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

        var now = [year, p(month), p(date)].join('-') + " " + [p(h), p(m), p(s)].join(':');
        return now;
    }
})