/* ==========================================================
 * yp: mods.js v20140612
 * ==========================================================
 * Copyright xiewu
 *
 * 全局组件管理模块
 * ========================================================== */

+function($, yp) {
var
  win = this
, exports = yp
, config = exports.config
, ui = exports.ui

, api = {
    // 初始化
    init: function() {
      this.modList = config.mods.modList;
      this.css = config.mods.css;
      this.jq = config.mods.jq;
      this.update = {};
      this.updateList = {};
    }
    // 注册组件
  , addMods: function(mods) {
      mods = [].concat(mods);///
      yp.each(mods, function(name) {
        var mod = api.modList[name]
        if (!mod.isLoad) {
          mod.isLoad = true;
          $.pub('mods/init/css', [api.css[name], name]);
          $.pub('mods/init/jq', [api.jq[name], name]);
          $.pub('mods/ready/' + name, mod);
          $.pub('mods/init/update', [api.update[name], name, ui.$body]);
        }
      });
      return this;
    }
    // 初始化组件
  , updateAll: function(container) {
      var $container = $(container)
      yp.each(api.updateList, function(fUpdate) {
        fUpdate($container);
      });
    }
  };
  api.init();

  // 监听组件加载完成
  $.sub('loader/ready.mods', function(e, mod) {
    if (mod in api.modList) {
      api.addMods(mod);
    }
  });
  // 监听特殊类型注册
  // 用于自动加载css文件
  $.sub('mods/init/css', function(e, arr) {
    if (arr) {
      yp.each(arr, function(val) {
        yp.loader.loadCSS(val);
      });
    }
  });
  // 用于默认绑定jq事件
  $.sub('mods/init/jq', function(e, arr, key) {
    if (arr) {
      // 排除空对象的注册
      if (!arr.length) arr = [key];
      var limitFn = function(key) {
        yp.each(arr, function(name) {
          var _fn = $.fn[name]
          if (!_fn) {
            throw new Error('不存在$.fn.' + name + '的jquery方法');
          }
          $.fn[name] = function() {
            return this.length ? _fn.apply(this, arguments) : this;
          }
          $.fn[name].defaults = _fn.defaults && _fn.defaults;///
        });
      }
      limitFn(key);
    }
  });
  // 用于绑定动态插入的html内容
  $.sub('mods/init/update', function(e, fn, name, $container) {
    if (fn) {
      fn($container);
      api.updateList[name] = fn;
    }
  });

  // 框架功能初始化（不依赖文件加载触发，页面运行中可多次执行）
  // widget
  api.updateList.widget = function($container) {
    // collapsible widgets
    $container.find('.widget[data-toggle="collapse-widget"] .widget-body')
      .on('show', function() {
        $(this).parents('.widget:first').attr('data-collapse-closed', "false");
      })
      .on('hidden', function() {
        $(this).parents('.widget:first').attr('data-collapse-closed', "true");
      });
    
    $container.find('.widget[data-toggle="collapse-widget"]').each(function() {
      var $this = $(this)
      // append toggle button
      if (!$this.find('.collapse-toggle').length)
        $this.children('.widget-head').append('<span class="collapse-toggle"></span>');///
      
      // make the widget body collapsible
      $this.children('.widget-body').addClass('collapse');///
      
      // verify if the widget should be opened
      if ($this.attr('data-collapse-closed') !== "true")
        $this.find('.widget-body').addClass('in');
      
      // bind the toggle button
      $this.find('.collapse-toggle').off('click.mods').on('click.mods', function() {
        $(this).parents('.widget:first').children('.widget-body').collapse('toggle');
      });
    });

    // show/hide toggle buttons
    $container.find('[data-toggle="hide"]').click(function() {
      $($(this).attr('data-target')).toggleClass('hide');
      if ($(this).is('.scrollTarget') && !$($(this).attr('data-target')).is('.hide'))
        scrollTo($(this).attr('data-target'));
    });
  };
  // selectable tables
  api.updateList.table_selectable = function($container) {
    var sHeadCheckbox = 'thead th:first-child input:checkbox'
      , sBodyCheckbox = 'tbody td:first-child input:checkbox'
      , sBodyTr = 'tbody tr.selectable'
      , sCheckboxs = '.checkboxs'
      , $tables = $container.find(sCheckboxs)
      ///, $tables_radio = $container.find('.radioboxs')
      , $actions_page = $container.find('.checkboxs_actions')

    // 更新选中状态
    function toggleCheckbox($checkbox, flag) {
      $checkbox
        .prop('checked', flag)
        .parent()
        .toggleClass('checked', flag);
    }
    function toggleTr($tr, flag) {
      $tr.toggleClass('selected', flag);
    }
    function toggleActions($table, flag) {
      var actions = $table.attr('data-actions')
        , $actions = actions ? $(actions) : $actions_page
      $actions.toggle(flag);
    }
    function changeAfter($table, flagFirst) {
      var $checkboxAll = $table.find('tr.selectable td:first-child input:checkbox')
        , $checkboxAllChecked = $checkboxAll.filter(':checked')
        , flag1 = $checkboxAllChecked.length === $checkboxAll.length
        , flag2 = !!$checkboxAllChecked.length
      
      // 处理全选框
      if ((flagFirst && flag2 && flag1) || !flagFirst) {
        toggleCheckbox($table.find(sHeadCheckbox), flag1);
      }
      // 处理批量操作状态
      if ((flagFirst && flag2) || !flagFirst)
        toggleActions($table, flag2);
    };
    
    /* Table select / checkboxes utility */
    $tables.find(sHeadCheckbox).change(function() {
      var $this = $(this)
        , $table = $this.closest(sCheckboxs)
        , flag = $this.is(':checked')
      
      toggleCheckbox($table.find(sBodyCheckbox), flag);
      toggleTr($table.find(sBodyTr), flag);
      toggleActions($table, flag);
    });
    $tables.find('tbody').on('click', 'tr.selectable', function(e) {
      // 切换行选中状态
      var $tr = $(this)
        , $checkbox = $tr.find('td:first-child input:checkbox')
      
      if (e.target.nodeName == 'INPUT') {
        var flag = $checkbox.is(':checked')
        toggleTr($tr, flag);
      } else if (
          e.target.nodeName != 'TD'
        && e.target.nodeName != 'TR'
        && e.target.nodeName != 'DIV'
        ) {
        return true;
      } else {
        var flag = $checkbox.is(':checked')
        toggleCheckbox($checkbox, !flag);
        toggleTr($tr, !flag);
      }

      var $table = $tr.closest(sCheckboxs)
      changeAfter($table);
    });
    
    // 加载完成执行首次初始化
    changeAfter($tables, true);
  };

  // 自定义组件初始化（依赖文件加载触发，页面运行中可多次执行）
  /// scroll
  api.update.slimScroll = function($container) {
    /* Slim Scroll Widgets */
    $container.find('.widget-scroll').each(function() {
      var $this = $(this)
      $this.find('.widget-body >div').slimScroll({
        height: $this.attr('data-scroll-height')
      });
    });

    /* Other non-widget Slim Scroll areas */
    $container.find('.slim-scroll').each(function() {
      var $this = $(this)
      $this.slimScroll({
        height: $this.attr('data-scroll-height')
      , allowPageScroll: false
      , railDraggable: $.fn.draggable ? true : false
      });
    });
  };

  // bootstrap
  api.update.bootstrap = function($container) {
    // tooltips
    $container.find('[data-toggle="tooltip"]').tooltip();
    // popovers
    $container.find('[data-toggle="popover"]').popover();
  };
  /*
   * Bootstrap Extended
   */
  // dataTable
  api.update.dataTable = function($container) {
    $container.find('.dynamicTable').dataTable({
      'sPaginationType': 'bootstrap',
      'sDom': '<"row-fluid"<"span6"l><"span6"f>r>t<"row-fluid"<"span6"i><"span6"p>>',
      'oLanguage': {
        'sLengthMenu': '_MENU_ 记录 每页'
      }
    });
  };
  // UniformJS: Sexy form elements
  api.update.uniform = function($container) {
    $container
      .find('.uniformjs:not([data-init-yp])')
      .find('select, input, button, textarea')
      .uniform()
      .addClass('hasUniform');
  };
  // custom select for Bootstrap using dropdowns
  api.update.selectpicker = function($container) {
    $container
      .find('.selectpicker:not([data-init-yp])')
      .selectpicker();
  };
  // bootstrap-switch
  api.update.switch = function($container) {
    $container
      .find('.make-switch:not(.has-switch):not([data-init-yp])')
      .bootstrapSwitch();
  };
  api.update.switch3 = function($container) {
    $container
      .find('.make-switch3:not(.has-switch):not([data-init-yp])')
      .bootstrapSwitch()
      .addClass('has-switch');
  };
  // jquery-ui
  api.update['jquery-ui'] = function($container) {
    // datepicker
    var modName = 'jquery-ui'
      , oFunMap = api.modList[modName].oFunMap
      , fnList = api.modList[modName].fnList
    
    yp.each(fnList, function(name) {
      oFunMap[name]('.' + name, $container);
    });

    // sortable tables
    $container.find('.js-table-sortable').sortable({
      placeholder: 'ui-state-highlight',
      items: 'tbody tr',
      handle: '.js-sortable-handle',
      forcePlaceholderSize: true,
      helper: function(e, ui) {
        ui.children().each(function() {
          $(this).width($(this).width());
        });
        return ui;
      },
      start: function(event, ui) {
        if (typeof mainYScroller != 'undefined') mainYScroller.disable();
        ui.placeholder.html('<td colspan="' + $(this).find('tbody tr:first td').size() + '">&nbsp;</td>');
      },
      stop: function() { if (typeof mainYScroller != 'undefined') mainYScroller.enable(); }
    });
  };
  // sticky
  api.update.sticky = function($container) {
    if (!yp.ui.support.sticky) {
      var $sticky = $container.find('.sticky')
      setTimeout(function() {
        $sticky.filter(':visible').pin();
      });
      // 监听tab标签切换
      /*ui.$yp_tabList_user.eq(0).one('shown.scroll', function(e) {
        $sticky.pin();
      });*/
      $.sub('ui/main/resize', function() {
        $sticky.each(function() {///.filter(':visible')
          var width = $(this).parent().outerWidth()
          width && $sticky.width(width);
        });
      });
    }
  };
  // ip
  api.update['yp-ip'] = function($container) {
    $container.find('.ip').inputType({
      type: 'ip'
    });
  };

  // 监听文件加载完成（默认只在文件加载后触发一次，多用于全局事件绑定）
  // jquery-ui
  $.sub('mods/ready/jquery-ui', function(e, data) {
    var datePickerOption = {
      monthNames:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
    , monthNamesShort:['1月','2月','3月','4月','5月','6月','7月','8月','9月','10月','11月','12月']
    , dayNamesMin:['日','一','二','三','四','五','六']
    , dateFormat: 'yy-mm-dd'
    , changeMonth: true
    , changeYear: true
    , showOtherMonths: true
    };
    var datepicker = function(target, $container, option) {
      return $container.find(target).datepicker(yp.extend(datePickerOption, option));
    };
    var modName = 'jquery-ui';
    var oFunMap = api.modList[modName].oFunMap = {
      'js-datepicker': function(target, $container) {
        datepicker(target, $container);
      }
    , 'js-datepicker-inline': function(target, $container) {
        datepicker(target, $container, { inline: true });
      }
    , 'js-datepicker-two': function(target, $container) {
        datepicker(target, $container, {
          numberOfMonths: 2
        });
      }
    };
    oFunMap['js-dateRangeFrom'] = oFunMap['js-dateRangeTo'] = function(target, $container) {
      $(target).each(function() {
        var $this = $(this)
          , $target = $($this.attr('data-target'))
          , isDateRangeFrom = $this.hasClass('js-dateRangeFrom')
          , attrName1
          , attrName2
      
        if (isDateRangeFrom) {
          attrName1 = 'minDate';
          attrName2 = 'maxDate';
        } else {
          attrName1 = 'maxDate';
          attrName2 = 'minDate';
        }
        datepicker($this, $container, {
          ///defaultDate: '+1w'
          onClose: function( selectedDate ) {
            $target.datepicker( 'option', attrName1, selectedDate );
          }
        }).datepicker( 'option', attrName2, $target.val() );
      });
    };
    var fnList = api.modList[modName].fnList = Object.keys(oFunMap);

    // 图标focus
    ui.$doc
      .on('click', '.ui-datepicker-trigger', function() {
        $(this).prev('input').focus();
      })
      .on('focus'
        , String(fnList.map(function getAllTypeNotInited(name) {
            return '.' + name + ':not(.hasDatepicker)';
          }))
        , function() {
            var $this = $(this)
            yp.each(fnList, function(name) {
              if ($this.hasClass(name)) {
                oFunMap[name]($this, ui.$body);
                return false;
              }
            });
          });
  });
  // selectpicker
  $.sub('mods/ready/selectpicker', function(e, data) {
    yp.mix($.fn.selectpicker.defaults, {
      noneSelectedText: '请选择...'
    , noneResultsText: '没有匹配的数据'
    , countSelectedText: '{0} / {1} 选中'
    , maxOptionsText: ['最多只能选 {n} {var}', '最多只能选 {n} {var}', ['项', '项']]
    });
  });

  // 监听UI内容更新（常见动态插入html内容）
  $.sub('ui/update.mods', function(e, target) {
    // 模块自动初始化事件
    $.pub('mods/updateAll', target);
    api.updateAll(target);
  });

  /// 临时解决和mvvm的冲突
  api.updateList.mvvm = function($container) {
    var oSelectList = [
      '.uniformjs'
    , '.selectpicker'
    , '.make-switch'
    , '.make-switch3'
    ]
    $container.find('[ms-each],[ms-each-el],[ms-repeat],[ms-repeat-el]').each(function() {
      $(this).find(oSelectList.join(',')).attr('data-init-yp', '');
    });
  };
  $.sub('mods/updateAll.mods', function(e, target) {
    $(target).find('[data-init-yp]').removeAttr('data-init-yp');
  });

  exports.mods = api;
  define( 'yp.mods', [], function() { return api; } );
}(jQuery, yp);