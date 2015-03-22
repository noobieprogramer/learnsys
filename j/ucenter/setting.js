yp.use(['bootstrap'], function() {
    yp.ready(function() {
        var ui = {};
        var oConfig = window.oPageConfig;
        ui.$use_info_link = $('.user-info-link');
        ui.$user_data = $('#user-data');
        ui.$user_name = $('#user-name');
        ui.$user_mail = $('#user-mail');
        ui.$user_phone = $('#user-phone');
        ui.$user_url = $('#user-url');
        ui.$user_permission_manager = $('#user-permission-manager');
        ui.$user_permission_normal = $('#user-permission-normal');
        ui.$user_msg = $('#user-msg');
        ui.$user_psw = $('#user-psw');
        ui.$psw_old = $('#psw-old');
        ui.$psw_new = $('#psw-new');
        ui.$psw_again = $('#psw-again');
        ui.$psw_msg = $('#psw-msg');
        ui.$user_skill = $('#user-skill');
        ui.$skill_name = $('.skill-name');
        ui.$normal_none = $('.normal-none');
        ui.$other_none = $('.other-none');
        ui.$my_data = $('#my-data');
        ui.$my_psw = $('#my-psw');
        ui.$skillList = $('#js-skill-list');

        var oPage = {
            /**
             * 初始化
             */
            init: function() {
                    this.view();
                    this.listen();
                }
                /**
                 * 视图显示
                 */
                ,
            view: function() {
                    var self = this;

                    /* 个人资料获取 */
                    yp.ajax(oConfig.oUrl.userGet, {
                            type: 'get',
                            data: {
                                uid: oConfig.oData.uid,
                                permission: oConfig.oData.permission
                            }
                        })
                        .done(function(msg) {
                            // 判页面能否编辑
                            if (oConfig.oData.permission != 0 && oConfig.oData.uid != msg.data.id) {
                                ui.$other_none.remove();
                                ui.$user_data.find('input').attr('disabled', 'disabled').css('cursor', 'default');
                            }
                            if (msg.code == 0) {
                                ui.$user_name.val(msg.data.name);
                                ui.$user_mail.val(msg.data.mail);
                                ui.$user_phone.val(msg.data.phone);
                                ui.$user_url.val(msg.data.url);
                                if (oConfig.oData.permission == 0) {
                                    ui.$user_permission_manager.attr('checked', true);
                                    if (oConfig.oData.uid != msg.data.uid) {
                                        ui.$user_psw.children(':first').remove();
                                    }
                                } else {
                                    ui.$user_permission_normal.attr('checked', true);
                                    ui.$normal_none.remove();
                                }
                            }
                        });
                    /* 个人资料获取  end*/

                    /* 个人技能获取 */
                    var $skillAccuracy;
                    var $skillContent = '';
                    yp.ajax(oConfig.oUrl.skillGet, {
                            type: 'get',
                            data: {
                                uid: oConfig.oData.uid
                            }
                        })
                        .done(function(msg) {
                            if (msg.code == 0) {
                                for (var i = 0; i < msg.data.length; i++) {
                                    $skillAccuracy = msg.data[i].accuracy * 100;
                                    $skillContent = '';
                                    $skillContent += '<li><div class="skill-name col-sm-3 control-label">' + msg.data[i].skillname + '</div><div class="skill-progress col-sm-9"><div class="progress"><div class="progress-bar" role="progressbar" aria-valuenow="' + $skillAccuracy + '" aria-valuemin="0" aria-valuemax="100" style="width:' + $skillAccuracy + '%;">' + $skillAccuracy + '%</div></div></div></li>';
                                    ui.$skillList.append($skillContent);
                                    if ($skillAccuracy < 60) {
                                        $('.progress-bar:last').addClass('progress-bar-danger');
                                    }
                                    if ($skillAccuracy >= 60 && $skillAccuracy < 80) {
                                        $('.progress-bar:last').addClass('progress-bar-info');
                                    }
                                    if ($skillAccuracy >= 80) {
                                        $('.progress-bar:last').addClass('progress-bar-success');
                                    }
                                }
                            }
                        });
                    /* 个人技能获取  end*/

                }
                /**
                 * 绑定监听事件
                 */
                ,
            listen: function() {
                var self = this;
                /* 导航查看个人资料 */
                // 查看自己的资料
                ui.$my_data.on('click', function() {
                    $('#my-tab a:first').tab('show');
                });
                // 修改自己的密码
                ui.$my_psw.on('click', function() {
                    $('#my-tab a:last').tab('show');
                });
                /* 导航查看个人资料 end */

                /* 个人资料修改 */
                ui.$user_data.on('submit', function(e) {
                    e.preventDefault();
                    // 定义各个表达式判定
                    var $judge_name_length = ui.$user_name.val().length >= 2 && ui.$user_name.val().length <= 5;
                    var $judge_mail_length = ui.$user_mail.val().length > 0;
                    var $judge_mail = (/^\w+([-+.]\w+)*@\w+([-.]\w+)*\.\w+([-.]\w+)*$/.test(ui.$user_mail.val()));
                    // 姓名判定
                    if (!$judge_name_length) {
                        ui.$user_msg.hide().removeClass('alert-success').addClass('alert-danger msg-shake').fadeIn(500).html('姓名只能取 2 — 5 个字符之间');
                    };
                    // 邮箱判定
                    if (!$judge_mail_length) {
                        ui.$user_msg.hide().removeClass('alert-success').addClass('alert-danger msg-shake').fadeIn(500).html('请输入邮箱');
                    }
                    if (!$judge_mail) {
                        ui.$user_msg.hide().removeClass('alert-success').addClass('alert-danger msg-shake').fadeIn(500).html('您输入的邮箱格式不正确');
                    }
                    if ($judge_name_length && $judge_mail_length && $judge_mail) {
                        ui.$user_data.ajaxSubmit().ajax.done(function(msg) {
                            if (msg.code == 0) {
                                ui.$user_msg.hide().removeClass('alert-danger msg-shake').addClass('alert-success').fadeIn(500).html('修改成功！');
                            }
                        });
                    }
                });
                /* 个人资料修改 end */

                /* 修改口令 */
                // 定义各个表达式判定
                ui.$user_psw.on('submit', function(e) {
                    e.preventDefault();
                    var $judge_psw_new = ui.$psw_new.val().length >= 3;
                    var $judge_psw_again = ui.$psw_again.val() == ui.$psw_new.val();
                    // 新口令判定
                    if (!$judge_psw_new) {
                        ui.$psw_msg.hide().removeClass('alert-success').addClass('alert-danger msg-shake').fadeIn(500).html('新口令长度必须在3位以上');
                    }
                    // 再次口令判定
                    if (!$judge_psw_again) {
                        ui.$psw_msg.hide().removeClass('alert-success').addClass('alert-danger msg-shake').fadeIn(500).html('两次口令不一致');
                    }
                    if ($judge_psw_new && $judge_psw_again) {
                        ui.$user_psw.ajaxSubmit().ajax.done(function(msg) {
                            if (msg.code == 0) {
                                ui.$psw_msg.hide().removeClass('alert-danger msg-shake').addClass('alert-success').fadeIn(500).html('修改成功');
                            } else {
                                ui.$psw_msg.hide().removeClass('alert-success').addClass('alert-danger msg-shake').fadeIn(500).html(msg.message);
                            }
                        });
                    }
                });
                /* 修改密码 end */
            }
        };
        oPage.init();
    });
});
