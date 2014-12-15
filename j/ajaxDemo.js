/* ==========================================================
 * ajaxDemo.js v20140721
 * ==========================================================
 * Copyright xiewu
 *
 * 模拟ajaxdemo
 * ========================================================== */
// yp.use(['***'], function() {
  yp.ready(function() {
    var ui = yp.ui;
    var oConfig = window.oPageConfig;
    var oPage = {
      // 初始化
      init: function() {
        this.view();
        this.listen();
      }
      // 视图管理
    , view: function() {
        var self = this;
      }
      // 事件绑定
    , listen: function() {
        var self = this;

        // 发送***
        ui.$yp_btn_send = $('#yp-btn-send');
        ui.$yp_btn_send.on('click', function(e) {
          var $this = $(this);

          yp.ajax(oConfig.oUrl.send, {type: 'post', data: {}})
            .done(function(msg) {
            if(msg.code == 0) {
              alert(msg.message);
            }
          });
        });
      }
    };
  oPage.init();
  });
// });