/*
* form表单验证及提交
* $.fn.formSubmit();
* <input class="validate" data-parent=".form-group" data-valid="required,number" name="name" />
* <input class="validate" data-parent=".form-group" data-valid="maxlength" data-maxlength="123" name="name" />
* <input class="validate" data-parent=".form-group" data-valid="range" data-maxlength="123,234" name="name" />
*/
+function ($) { "use strict";

  // data-valid所有可用值，以及默认提示信息
  jQuery.extend(jQuery.validator.messages, {
    required: "必选字段",
    remote: "请修正该字段",
    email: "请输入正确格式的电子邮件",
    url: "请输入合法的网址",
    date: "请输入合法的日期",
    dateISO: "请输入合法的日期 (ISO).",
    number: "请输入合法的数字",
    digits: "只能输入整数",
    creditcard: "请输入合法的信用卡号",
    equalTo: "请再次输入相同的值",
    accept: "请输入拥有合法后缀名的字符串",
    maxlength: jQuery.validator.format("请输入一个长度最多是 {0} 的字符串"),
    minlength: jQuery.validator.format("请输入一个长度最少是 {0} 的字符串"),
    rangelength: jQuery.validator.format("请输入一个长度介于 {0} 和 {1} 之间的字符串"),
    range: jQuery.validator.format("请输入一个介于 {0} 和 {1} 之间的值"),
    max: jQuery.validator.format("请输入一个最大为 {0} 的值"),
    min: jQuery.validator.format("请输入一个最小为 {0} 的值")
  });

  var FormSubmit = function(element, options){
    this.$element = $(element);
    this.options = options;
    this.init();
  };

  FormSubmit.DEFAULTS = {
    fRules: function(){ return false; } // 自定义提示信息
  , inputItem: '.validate'  // 指定需要绑定的控件
  , fMessage: function(){ return false; }  // 自定义提示信息
  , callback: ''  // 表单提交后的回调
  , ajaxSubmit: 'true'  // 默认是ajax提交
  , onAjaxSubmit: function(){} // ajax提交发生的回调
  , beforeAjaxSubmit: ''  // ajax提交前
  , formatFile: true  // 需要将file转成二进制字符串
  };

  FormSubmit.prototype = {
    $contorls: null
  , oValidate: null
  , init: function(){
      var opts = this.options;

      this.$contorls = this.$element.find(opts.inputItem);

      var rules = opts.fRules.call(this.$element, this.$contorls) || this.fRules()
        , messages = opts.fMessage.call(this.$element, this.$contorls);

      this.fValidate(rules, messages);
    }
  , fRules: function(){
      var self = this
        , $contorls = self.$contorls
        , rules = {};

      if(!$contorls.length){
        return false;
      }

      yp.each($contorls, function(control){
        var $control = $(control)
          , valid = $control.data('valid').split(',')
          , rule = {};
        yp.each(valid, function(i){
          switch(i){
            case 'maxlength':
            case 'minlength':
            case 'max':
            case 'min':
              rule[i] = $control.data(i);
              break;
            case 'rangelength':
            case 'range':
              rule[i] = $control.data(i).split(',');
              break;
            default:
              rule[i] = true;
              break;
          }
        });
        rules[$control.attr('name')] = rule;
      });

      return rules;
    }
  , fValidate: function(rules, messages){
      var self = this
        , opts = self.options
        , $form = self.$element
        , validOpt = {};

      rules && ( validOpt.rules = rules )
      messages && ( validOpt.messages = rules )
      validOpt.showErrors = function(map, list){
        $form.find('.error').remove();
        $form.find('.has-error').removeClass('has-error');
        yp.each(list, function(error, index) {
          var ee = $(error.element)
            , eep = ee.closest(ee.data('parent'));
          ee.closest('.form-group').addClass('has-error');
          eep.find('.error').remove();
          eep.append('<p class="error help-block col-md-9 pull-right"><span class="label label-danger">' + error.message + '</span></p>');
        });
      };
      validOpt.submitHandler = function(form){
        self.fSubmit();
      }

      self.oValidate = $form.validate(validOpt);
    }
  , fShowErrors: function(errors){
      this.oValidate.showErrors(errors);
    }
  , fSubmit: function(){
      var self = this
        , $form = self.$element
        , opts = self.options;

      if(!$form.data('formSubmit')){
        return false;
      }

      if( opts.beforeAjaxSubmit && !opts.beforeAjaxSubmit.call($form) ){
        return false;
      }
      if('true' == opts.ajaxSubmit){
        if($form.data('ajaxing')){
          return false;
        }
        var postData = new FormData($form[0]);

        // 如果有file类型的input，处理该数据
        var fileInputs = $form.find('[type="file"]:visible');
        if(fileInputs.length && opts.formatFile){
          fFormatFileData(fileInputs, 0);
        } else {
          fDoAjax();
        }
      } else {
        $form[0].submit();
      }

      function fFormatFileData(fileInputs, index){
        if(fileInputs.length == index){
          fDoAjax()
          return false;
        }
        var fileInput = fileInputs[index]
          , fileInputName = fileInput.name
          , file = fileInput.files[0]
          , fileInputName_name = '';
        var rex = /\[[0-9]*\]$/;
        // 如果是文件数组，则在"[]"之前添加'_name'
        // 否则，直接在input的name值后面添加'_name'
        if( fileInputName.match(rex) ){
          fileInputName_name = fileInputName.replace(rex, function(matched){
            return '_name' + matched;
          });
        } else {
          fileInputName_name = fileInputName + '_name';
        }
        if(!file){
          index++;
          fFormatFileData(fileInputs, index);
          return false;
        }

        // 读取文件内容
        var reader = new FileReader();
        reader.onload = function(e) {
          postData.append(fileInputName, e.target.result);
          postData.append(fileInputName_name, file.name);
          index++;
          fFormatFileData(fileInputs, index);
        }
        reader.readAsDataURL(file);
      }
      function fDoAjax(){
        opts.onAjaxSubmit.call($form);
        $form.data('ajaxing', true);
        yp.ajax($form.attr('action'), {
          type: "post"
        , dataType: 'JSON'
        , data: postData
        , processData: false
        , contentType: false
        }).done(function(data){
          $form.data('ajaxing', false);
          if(opts.callback){
            opts.callback.call($form, data);
          }
        });
      }
    }
  };

  var old = $.fn.formSubmit;

  $.fn.formSubmit = function(option, args){
    return this.each(function(){
      var $this = $(this)
        , data = $this.data('formSubmit')
        , options = $.extend({}, FormSubmit.DEFAULTS, $this.data(), typeof option == 'object' && option);

      if (!data) $this.data('formSubmit', (data = new FormSubmit(this, options)))
      if (typeof option == 'string') data[option](args)
    });
  }

  $.fn.formSubmit.Constructor = FormSubmit;

  $.fn.formSubmit.noConflict = function () {
    $.fn.formSubmit = old;
    return this;
  };

}(window.jQuery);