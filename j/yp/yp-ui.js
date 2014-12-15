/* ==========================================================
 * yp: ui.js v20140616
 * ==========================================================
 * Copyright xiewu
 *
 * 全局UI模块
 * ========================================================== */
 
+function($, yp) {
var
  win = this
, exports = yp
, global = exports.global || {}
, ui = exports.ui || {}
  
  yp.mix(ui, {
    ///version: 'xxx',
    // 键位数组
    keyCode: {
      BACKSPACE: 8
    , COMMA: 188
    , DELETE: 46
    , DOWN: 40
    , END: 35
    , ENTER: 13
    , ESCAPE: 27
    , HOME: 36
    , LEFT: 37
    , NUMPAD_ADD: 107
    , NUMPAD_DECIMAL: 110
    , NUMPAD_DIVIDE: 111
    , NUMPAD_ENTER: 108
    , NUMPAD_MULTIPLY: 106
    , NUMPAD_SUBTRACT: 109
    , PAGE_DOWN: 34
    , PAGE_UP: 33
    , PERIOD: 190
    , RIGHT: 39
    , SPACE: 32
    , TAB: 9
    , UP: 3
    }
  });

  // 保存常用对象
  ui.$win = $(win);
  ui.$doc = $(document);
  ui.$body = $(document.body);
  ui.support = {};
  // 保存框架对象
  ui.$wrapper = $('#wrapper');
  ui.$menu = $('#menu');
  ui.$content = $('#content');

  // 对话框
  yp.each(['alert', 'confirm'], function(name) {
    ui[name] = function() {
      return window[name].apply(window, arguments);
    };
    window['_' + name] = window[name];///
  });

  // resize
  global.zIndex = 999;
  var resizeWindow = function() {
    global.width = ui.$win.width();
    global.height = ui.$win.height();
  }
  resizeWindow();
  $.sub('ui/resize.ui', function() {
    resizeWindow();
    $.pub('ui/main/resize');
  });

  // 添加菜单项
  ui.addMenuItem = function(id, content) {};
  ui.removeMenuItem = function(id) {};

  // loader
  // 监听全局ajax事件
  +function(ui) {
    var api = {
      init: function() {
        api.oMap = yp.mix({
          // 登陆超时跳转
          50001: function(msg) {
            var sUrl = msg.data
            if (typeof sUrl === 'string') {
              var sMsg = msg.message || msg.msg;
              var jumpTo = function() {
                location.href = sUrl;
              };
              if (sMsg) alert(sMsg, jumpTo);
              else jumpTo();
            }
          }
        }, window.oPageConfig && window.oPageConfig.oAjaxCodeMap);

        $.sub('loader/ajax/done.ui', function(e, msg) {
          if ($.isEmptyObject(msg)) {
            alert('数据接口返回为空对象，请检查');
            return false;
          }
          var fError = api.oMap[msg.code]
          if (fError) {
            fError(msg);
            return false;
          }
        });
      }
    };
    api.init();
    ui.oAjaxCode = api;
  }(ui);

  // loading模块
  +function() {
    var nDelay = 500
    ui.oLoading = {
      dom: $('<div class="yp-modal-backdrop"><div class="loading">加载中......</div></div>')
    , container: ui.$body
    , toggle: function(flag) {
        if (flag) this.dom.appendTo(this.container);
        else this.dom.remove();
      }
    };
    $.sub('loader/ajax/start.ui', function(e) {
      clearTimeout(ui.oLoading.timer);
      ui.oLoading.timer = setTimeout(function() {
        ui.oLoading.toggle(true);
      }, nDelay);
    });
    $.sub('loader/ajax/always.ui', function(e) {
      clearTimeout(ui.oLoading.timer);
      ui.oLoading.toggle(false);
    });
  }();

  // mods：监听插件加载
  // 监听自定义滚动条插件
  $.sub('mods/ready/slimScroll.ui', function(e, data) {
    // menu slim scroll max height
    var $slim_scroll_menu = ui.$menu.find('.slim-scroll')
      , menu_max_height = parseInt($slim_scroll_menu.attr('data-scroll-height'))
      , menu_real_max_height = parseInt(ui.$wrapper.height())
    
    $slim_scroll_menu.slimScroll({
      height: (menu_max_height < menu_real_max_height ? (menu_real_max_height - 20) : menu_max_height) + 'px'
    , allowPageScroll: true
    , railVisible: false
    , color: 'transparent'
    , railDraggable: $.fn.draggable ? true : false
    });
    
    // fixes weird bug when page loads and mouse over the sidebar (can't scroll)
    if (!Modernizr.touch)
      $slim_scroll_menu.trigger('mouseenter').trigger('mouseleave');
  });
  // 监听消息提示插件
  $.sub('mods/ready/bootbox.ui', function(e, data) {
    ui.alert = window.alert = bootbox.alert;
    ui.confirm = window.confirm = bootbox.confirm;
  });
  $.sub('mods/ready/notyfy.ui', function(e, data) {
    ui.notyfy = function(message, opts) {
      if (opts && opts.alert) {
        ui.alert(message);
        return false;
      }
      notyfy(yp.mix({
        text: message
      , type: 'success'
      , layout: 'top'
      , timeout: 2000
      }, opts));
    }
  });

  // sticky支持
  ui.support.sticky = $('<i style="position:sticky">').css('position') === 'sticky';

  // 监听错误消息
  $.sub('error/ui.ui', function(e, msg) {
    var e = $.Event('yp/ui/error/' + msg.code)
    yp.pub(e, msg.data);
    if (e.isDefaultPrevented()) return;
    alert(msg.message);
  });
  $.sub('error/sys.ui', function(e, msg) {
    yp.log(msg.message);
  });

  define( 'yp.global', [], function() { return global; } );
  define( 'yp.ui', [], function() { return ui; } );
}(jQuery, yp);

/**
 * 事件模块扩展
 */
+function($, yp) {
var
  win = this
, exports = yp
, ui = exports.ui
, event = exports.event

  // 监听窗口大小改变事件
  ui.$win.on('resize.ui.event', function() {
    $.pub('ui/resize');
  });

  // 监听页面初始化事件
  yp.ready(function() {
    $.pub('ui/update', ui.$content);
  });
  yp.sub('page/domCreate.ui.event', function(e, data) {
    $.pub('ui/update', data.target);
    return false;
  });
  ui.$doc.on('dom.create.ui.event', function(e) {
    $.pub('ui/update', e.target);
    return false;
  });

  // 监听侧边栏宽度变化
  ui.$menu.on('resizestop', function() {
    $.pub('ui/main/resize.ui.event');
  });
}(jQuery, yp);