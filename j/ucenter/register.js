/* ==========================================================
 * register.js v20140904
 * ==========================================================
 * Copyright 麻凯倩
 *
 * 增加成员页面
 * ========================================================== */

yp.use(['bootstrap'], function() {
  yp.ready(function() {
    var ui = {};
    var oConfig = window.oPageConfig;
    ui.$userData = $('#js-user-data');
    ui.$userMsg = $('#user-msg');
    ui.$userName = $('#user-name');
    ui.$userPsw = $('#user-password');

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
        /* 新增成员 */
        ui.$userData.on('submit', function(e) {
          e.preventDefault();
          ui.$userData.ajaxSubmit().ajax.done(function(msg) {
            if (msg.code == 0) {
              ui.$userMsg.hide().removeClass('alert-danger').addClass('alert-success msg-shake').fadeIn(500).html(msg.message);
            } else {
              ui.$userMsg.hide().removeClass('alert-success').addClass('alert-danger msg-shake').fadeIn(500).html(msg.message);
            }
          });
        });
        /* 新增成员 end */

        /* 密码和姓名同步 */
        // 控制pinyin.js库的输出
        function query() {
          var str = ui.$userName[0].value.trim();
          if (str == '') return;
          var arrRslt = makePy(str);
          // 转为小写
          arrRslt[0] = arrRslt[0].toLowerCase();
          var psw = arrRslt[0] + '123456';
          return psw;
        }
        // 输出密码
        ui.$userName.on('keyup', function() {
          ui.$userPsw.val(query());
        });
        /* 密码和姓名同步 end */
      }
    };
    oPage.init();
  });
});