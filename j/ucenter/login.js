/* ==========================================================
 * login.js v20140721
 * ==========================================================
 * Copyright 麻凯倩
 *
 * 登录页面
 * ========================================================== */

yp.use(['bootstrap'], function() {
  yp.ready(function() {
    var ui = {};
    ui.$password = $('#password');
    ui.$login_form = $('#login-form');
    ui.$login_msg = $('#login-msg');

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
    , view: function() {
        var self = this;
      }
      /**
       * 绑定监听事件
       */
    , listen: function() {
        var self = this;

        /* 登录 */
        ui.$login_form.on('submit', function(e) {
          e.preventDefault();
          var judgePassword = ui.$password.val().length == 0;
          if (judgePassword) {
            ui.$login_msg.hide().fadeIn(500).addClass('msg-shake').html('口令不能为空');
          } else {
            ui.$login_form.ajaxSubmit().ajax.done(function(msg) {
              if (msg.code == 0) {
                ui.$login_msg.fadeIn(500).html(msg.message);
                window.location.href = msg.data;  //edited by shihua
              } else {
                ui.$login_msg.hide().fadeIn(500).addClass('msg-shake').html('用户不存在');
              }
            });
          }
        });
        /* 登录 end */

      }
    };
    oPage.init();
  });
});