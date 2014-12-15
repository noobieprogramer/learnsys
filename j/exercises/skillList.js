/* ==========================================================
 * skillList.js v20140724
 * ==========================================================
 * Copyright xiewu
 *
 * 习题模块公共js
 * ========================================================== */
yp.use(['mvvm, pagination'], function() {
  yp.ready(function() {
    var ui = yp.ui;
    ui.$pagination = $(".pagination");
    ui.$infoModal = $('#infoModal');
    ui.$datepicker = $('.js-datepicker');

    var oConfig = window.oPageConfig;

    var oPage = {
      // 初始化
      init: function() {
        this.view();
        this.listen();
      }
    , totalCounts: 0
    , searchParams: {}
      // 视图管理
    , view: function() {
        var self = this;

        /* 技能列表模块 */
        self.data = avalon.define('skillModel', function(vm) {
          vm.list = [];
          vm.infos = [];

          // 分类
          vm.types = oConfig.oData.types;
          vm.typesHash = {};
          for(var i = 0, len = oConfig.oData.types.length; i < len; i++) {
            vm.typesHash[oConfig.oData.types[i].id] = oConfig.oData.types[i];
          }

          // 时间段
          vm.timeScales = oConfig.oData.timeScales;
          vm.timeScalesHash = {};
          for(var i = 0, len = oConfig.oData.timeScales.length; i < len; i++) {
            vm.timeScalesHash[oConfig.oData.timeScales[i].id] = oConfig.oData.timeScales[i];
          }

          // 查看技能
          vm.fSee = function(one) {
            one.isSee = true;
            one.isAdd = false;
            one.isEdit = false;
            vm.infos = [one];
            self.fSee();
          };

          // 编辑技能
          vm.fEdit = function(one) {
            one.isEdit = true;
            one.isSee = false;
            one.isAdd = false;
            vm.infos = [one];
            self.fEdit();
          };

          // 添加技能
          vm.fAdd = function() {
            var one = oConfig.oData.defaultSkill;
            one.isAdd = true;
            one.isEdit = false;
            one.isSee = false;
            vm.infos = [one];
            self.fAdd();
          };

          // 删除技能
          vm.fDel = function(e, one) {
            self.fDel($(e.target).closest('tr'), one);
          };

          // 保存技能
          vm.fSave = function(e, one) {
            self.fSave($(e.target).closest('form'), one);
            return false;
          };

          // 分类下拉框
          vm.fChangeType = function(e, one) {
            one.type = $(e.target).val();
          };

          // 有效期下拉框
          vm.fChangeTime = function(e, one) {
            one.availtime = $(e.target).val();
          };
        });
        /* 技能列表模块 end */

        avalon.scan();
        self.fLoad();
      }
      // 事件绑定
    , listen: function() {
        var self = this;

      }
    // 加载数据
    , fLoad: function() {
        var self = this;
        yp.ajax(oConfig.oUrl.list, {type: 'post', data: self.searchParams})
          .done(function(msg) {
            if(msg.code == 0) {
              if(self.totalCounts != msg.data.pager.totalCounts) {
                self.totalCounts = msg.data.pager.totalCounts;
                self.fPagination();
              }
              self.fRenderList(msg.data.list);
            } else{
              alert(msg.message);
            }
          });
      }
    // 渲染列表信息
    , fRenderList: function(list) {
        var self = this
          , vm = self.data;
        for(var i = 0, len = list.length; i < len; i++) {
          list[i].isSee = false;
          list[i].isAdd = false;
          list[i].isEdit = false;
        }
        vm.list = list;
      }
    // 跟踪页码
    , fChangePage: function(page) {
        var self = oPage;
        self.searchParams.current = page;
        self.fLoad();
      }
    // 翻页
    , fPagination: function() {
        var self = this;

        // 翻页显示
        ui.$pagination.pagination(self.totalCounts, {
          num_edge_entries: 1, //边缘页数
          items_per_page: 10, // 一页显示数据条数
          num_display_entries: 3, //主体页数
          load_first_page: false,
          callback: self.fChangePage, // 回调函数
          current_page: self.searchParams.current, // 当前页
          prev_text: "«",
          next_text: "»"
        });
      }
    // 查看技能
    , fSee: function(one) {
        var self = this
          , vm = self.data;

        ui.$infoModal.modal();
      }
    // 编辑技能
    , fEdit: function(one) {
        var self = this
          , vm = self.data;

        ui.$infoModal.modal();
      }
    // 添加技能
    , fAdd: function() {
        var self = this
          , vm = self.data;

        ui.$infoModal.modal();
      }
    // 删除技能
    , fDel: function($tr, one) {
        var self = this
          , vm = self.data;
        bootbox.confirm('亲，你确定要删除此技能吗？', function(result){
          if(result) {
            yp.ajax(oConfig.oUrl.del, {type: 'post', data: {skillid: one.skillid}})
              .done(function(msg) {
                if(msg.code == 0) {
                  $tr.remove();
                } else{
                  alert(msg.message);
                }
              });
          }
        });
      }
    // 检查表单
    , fCheckForm: function($form) {
        var self = this
          , flag = true;

        $form.find('[data-valid]').each(function(i, e) {
          var $this = $(this)
            , cont = $this.val()
            , title = $this.attr('placeholder');
          if(self.fVerifyIsNull(cont)) {
            flag = false && flag;
            self.fShowHint('error', $this, title + '不能为空');
          } else{
            flag = true && flag;
            self.fShowHint('success', $this);
          }
        });
        return flag;
      }
    // 保存技能
    , fSave: function($form, info) {
        var self = this
          , vm = self.data;

        var url = '';
        if(info.isAdd) {
          url = oConfig.oUrl.add;
        } else{
          url = oConfig.oUrl.edit;
        }
        if(self.fCheckForm($form)) {
          $form.ajaxSubmit(url).ajax
               .done(function(msg) {
                if(msg.code == 0) {
                  if(info.isAdd) {
                    window.location.reload();
                  }
                  if(info.isEdit) {
                    info.skillname = msg.data.skillname;
                    info.type = msg.data.type;
                    info.availtime = msg.data.availtime;
                    ui.$infoModal.modal('hide');
                  }
                } else{
                  alert(msg.message);
                }
              });
        }
      }
    // 提示显示
    , fShowHint: function(type, $obj, hint) {
        var self = this;

        if ( type === 'success' ) {
          $obj.popover('hide');
        } else if ( type === 'error' ) {
          $obj.popover({
            placement: 'right'
          , container: '#infoModal'
          , title: ''
          , content: hint
          }).popover('show');
        }
      }
    // 去除空格
    , fTrimStr: function (cont){
        if(cont == null) {
          return cont;
        }
        return cont = cont.replace(/^\s+|\s+$/g,"");
      }
    // 验证是否为空
    , fVerifyIsNull:function (cont){
        var self = this;
        var flag = false;
        cont = self.fTrimStr(cont);//去掉空格
        if(!cont.length) {
          flag = true;
        }
        return flag;
      }
    };

    window.oPage = oPage;
    oPage.init();
  });
});