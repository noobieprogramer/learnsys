/* ==========================================================
 * yp: multiInput.jquery.js v20140501.2.5.5.9
 * ==========================================================
 * Copyright xiewu
 *
 * 多框输入插件
 * ========================================================== */

;+function( $ ) {
var
  // 简单对象扩展函数
  _$ = _$ || $

  , arrSplit = [190, 110, 186, 189] ///.;:-
  , KEYS = {
    TAB: 9
    , BACK: 8
    , CTRL: 17
    , V: 86
  }

  /**
   * add a clamp fn to the Number object
   * @extends Number
   * @return {Number} clamped value
   */
  Number.prototype.clamp = function(low, high) {
    return this < low ? low : this > high ? high : this;
  };

  function inputType(dom, conf) {
    this.dom = dom;
    this.type = 'inputType';
    this.domHidden = dom.find('[type=hidden]');
    this.domText = this.domHidden.siblings(':input');
    this.reg = conf.reg;
    this.split = conf.split;
    this.conf = conf;
    this.init();
  }
  inputType.prototype = {
    init: function() {
      var self = this
      self.view();
      self.bindEvent();
      return self;
    },
    view: function() {
      var self = this
      /// 显示默认值
      self.showVal();
      // 粘贴功能临时改变type
      self.domText.each(function() {
        this.dataset.type = this.type;
      })
      return self;
    },
    bindEvent: function() {
      var self = this
      self.domText.on({
        input: function() {
          var $this = $(this)
            , val = this.value
          // 粘贴功能
          if (val.indexOf(self.split) > -1) {
            var list = val.split(self.split)
              , i = list.length - 1
              , $dom
            while(i--) {
              val = list[i + 1];
              $dom = $this.nextAll().eq(i);
              $dom.length && self.checkVal(val, $dom);
            }
            val = list[i + 1];
          }
          self.checkVal(val, $this);
        },
        keydown: function(e) {
          if ($.inArray(e.which, arrSplit) > -1) {
            if(!this.value.length || window.getSelection().toString().length) {
              return false;
            }
          }
          if (e.which === KEYS.CTRL) {
            this.type = 'text';
          }
        },
        keyup: function(e) {///
          if (this.type !== this.dataset.type) this.type = this.dataset.type;///
          if (window.getSelection().toString()) return;///
          var val = this.value
          if (val.length) {
            var flag = false
            if (val.length >= self.conf.maxLength && $.inArray(e.which, [KEYS.TAB, KEYS.CTRL, KEYS.V]) == -1) {
              flag = true;
            } else if ($.inArray(e.which, arrSplit) > -1) {
              flag = true;
            }
            /// 左右方向键
            flag && _$(this).next('input').select();///
          } else {
            if (e.which == KEYS.BACK) {
              ///_$(this).prev('input').focus();
            }
          }
          ///self.saveVal();
        },
        click: function() {
          _$(this).select();///
        },
        blur: function() {
          self.saveVal();
        },
        /*mousewheel: function(e) {
          e.stopPropagation();
          e.preventDefault();
        }*/
      });
      self.conf.bindEvent && self.conf.bindEvent.call(self);///
      return self;
    },
    // 正则校验
    _checkVal: function(val) {
      var self = this
      return val.replace(self.reg, '');
    },
    // 检查并保存值到输入框
    checkVal: function(val, $dom) {
      var self = this
        , dom = $dom[0]
      val = self._checkVal(val);
      if (dom.type === 'number' || $dom.data('role') === 'number') {
        val = Number(val).clamp(dom.min, dom.max);
        $dom.val(val + '0');
      }
      $dom.val(val);
      return self;
    },
    // 获取上传框的值
    getVal: function() {
      var self = this
      return self.domHidden.val();
    },
    // 设置上传框的值
    setVal: function(val) {
      var self = this
      if (val !== self.domHidden[0].defaultValue) {
        self.domHidden.val(val);
        self.triggerEvent('change.' + self.type, self.dom);
      }
      return self;
    },
    // 设置输入框的值
    showVal: function(val) {
      var self = this
      val ? self.setVal(val) : val = self.getVal();
      $.each(val.split(self.split), function(i, val) {
        self.domText.eq(i).val(val);
      });
      return self;
    },
    // 检查并设置上传框的值
    saveVal: function() {
      var self = this
        , arrTmp = []
        , val
      self.domText.each(function() {
        val = this.value;
        if (!val) {
          arrTmp = [];
          return false;
        }
        arrTmp.push(val);
      });
      arrTmp.length && self.setVal(arrTmp.join(self.split));
      return self;
    },
    triggerEvent: function(type, dom) {
      var self = this
      dom.trigger({
        type: type,
        dom: dom,
        handle: self,
        value: self.getVal()
      }, self.getVal());
    }
  }

  $.fn.inputType = function(conf) {
    var handle = this.data("inputType");
    if (handle) return handle;
    var plus = $.fn.inputType[conf.type];
    conf = $.extend({}, $.fn.inputType.conf, plus.conf, conf);///只读
    this.each(function() {
      handle = new inputType(_$(this), conf);
      _$(this).data("inputType", handle);
    });
    return handle;///
  }
  $.fn.inputType.conf = {
    split: '.'
    , reg: /[\D]/g
    , maxLength: 3
    , bindEvent: null
  }

  // 扩展功能
  $.fn.inputType.ip = {
    conf: {
      split: '.'
      , maxLength: 3
    }
  }
  $.fn.inputType.time = {
    conf: {
      split: ':'
      , maxLength: 2
      , bindEvent: function() {
        var self = this;
        self.dom.on('click', 'i', self, function(e) {
          self = e.data;
          var val = (new Date()).format('hh:mm:ss');
          self.showVal(val);
        });
      }
    }
  }
}(jQuery);