/* ==========================================================
 * yp: config.js v20140616
 * ==========================================================
 * Copyright xiewu
 *
 * 全局配置模块
 * ========================================================== */
+function(win) {
  var api = win.oYpConfig

  // 调试模式控制器
  api.debug = false;

  // 公共函数配置
  api.fun = {
    // 模板函数正则
    formatSettings: {
      re: /\${([\s\S]+?)}/g
    }
  };

  // 模块加载配置
  api.mods = {
    // 模块列表
    // 可陪参数包括（js文件路径，css文件路径，shim依赖模块，jq方法名）
    modList: {
      'yp-ui': {
        js: '../yp/yp-ui'
      }
    , 'yp-mods': {
        js: '../yp/yp-mods'
      }
    , 'yp-loader': {
        js: '../yp/lib/yp-loader'
      }
    , 'yp-ip': {
        js: '../yp/lib/multiInput.jquery'
      }
    , 'yp-test': {
        js: '../yp/lib/yp-test'
      , shim: ['mock']
      }
    , 'mock': {
        js: '../yp/lib/mock'
      }
    , 'mvvm': {
        js: '../yp/lib/avalon.mobile'
      }
    , 'bootstrap': {
        js: [
          /*'//cdn.staticfile.org/twitter-bootstrap/3.1.1/js/bootstrap.min'
        ,*/ '../../dist/js/bootstrap'
        ]
      }
    , 'bootbox': {
        js: '../../dist/extend/bootbox'
      }
    , 'validation': {
        js: 'jquery-validation/dist/jquery.validate.min'
      }
    , 'formSubmit': {
        js: 'formSubmit'
      , shim: ['validation']
      }
    , 'datetimepicker': {
        js: '../../dist/extend/bootstrap-datetimepicker/js/bootstrap-datetimepicker.min'
      , css: ['../../dist/extend/bootstrap-datetimepicker/css/datetimepicker']
      }
      // datetimepicker的中文语言包，依赖于datetimepicker
    , 'datetimepickerCN': {
        js: '../../dist/extend/bootstrap-datetimepicker/js/locales/bootstrap-datetimepicker.zh-CN'
      , shim: ['datetimepicker']
      }
    , 'iscroll': {
        js: 'iscroll'
      }
    , 'mousewheel': {
        js: 'jquery.mousewheel.min'
      }
    , 'cookie': {
        js: 'cookie'
      }
    , 'jquery-ui': {
        js: 'jquery-ui/js/jquery-ui-1.9.2.custom.min'
      , css: ['jquery-ui/css/smoothness/jquery-ui-1.9.2.custom.min']
      , jq: ['datepicker', 'sortable']
      }
    , 'jqueryDatepicker': {
        js: 'jquery-ui-timepicker-addon/js/jquery.ui.datepicker'
      }
    , 'timepicker': {
        js: 'jquery-ui-timepicker-addon/js/jquery-ui-timepicker-addon'
      , css: ['jquery-ui-timepicker-addon/css/jquery-ui-timepicker-addon']
      , shim : ['jqueryDatepicker']
      }
    , 'plupload': {
        js: 'plupload/plupload.full.min'
      }
    , 'imagecropper' : {
        js : 'imagecropper/imagecropper'
      , css : ['imagecropper/jasny-bootstrap.min']
      }
    , 'kindeditor': {
        js: 'editor/kindeditor/kindeditor-min'
      , css: ['editor/kindeditor/themes/default/default']
      }
    , 'jTip': {
        js: 'jtip/js/jtip'
      , css: ['jTip/css/global']
      }
    , 'pagination': {
        js: 'pagination/jquery.pagination'
      , css: ['pagination/pagination']
      }
    , 'webUploader': {
        js: 'webUploader/js/webuploader'
      , css: ['webUploader/css/webuploader']
      }
    }
  };

  // 文件资源配置
  api.baseUrl = api.baseUrl || '../';
  api.loader = {
    require: {
      // 统一文件版本号（也可对特殊模块做单独配置）
      urlArgs: 'v=' + (api.ver || +new Date())
    , paths: {}
    , shim: {}
    , waitSeconds:60
    }
    // 默认加载列表
  , baseList: ['yp-loader', 'yp-ui', 'yp-mods', 'yp-test', 'bootstrap', 'bootbox', 'jquery-ui']
    // 表单异步提交默认参数
  , data_pre: ''
  };
  // 各类型文件目录配置
  api.loader.baseUrlList = {
    js: api.baseUrl + 'lib'
  , css: api.baseUrl + 'lib/'///
  , html: api.baseUrl + 'h/'
  };
  api.loader.require.baseUrl = api.loader.baseUrlList.js;
  api.loader.debug = api.debug || true;

}(this);