/* ==========================================================
 * skill-learn.js v20140722
 * ==========================================================
 * Copyright wangrubing
 *
 * 学习页面
 * ========================================================== */

yp.use(['jTip'], function(yp) {
  yp.ready(function() {
    var ui = {
      $addItem: $('#add-item')
    , $item: $('.form-group')
    , $btnNoteSave: $('#btn-note-save')
    , $btnClose: $('#yp-btn-close')
    , $shareCollect: $('#share-collect')
    , $btnShareEdit: $('#btn-share-edit')
    , $shareContent: $('#share-content')
    , $preHeight: $('#find-pre-height')
    , $fixNav: $('#fix-nav')
    , $waypoint: $('.section-waypoint')
    , $checkNote: $('#checknote')
    , $formComment: $('#form-comment')
    };

    var oConfig = window.oPageConfig;

    var oPage = {
      offsetTops: {}
    , init: function() {
        this.view();
        this.listen();
      }
    , view: function() {
        var self = this;
        var key;
        for (var i = 0, len = ui.$waypoint.length; i < len; i++) {
          key = ui.$waypoint.eq(i).attr('id');
          self.offsetTops[key] = ui.$waypoint.eq(i).offset().top;
        }
      }
    , listen: function() {
        var self = this;

        /*添加笔记*/
          //添加笔记项
          ui.$addItem.on('click', function() {
            var item = ui.$item.clone();
            $(this).before(item);
          });

          //提交笔记
          ui.$btnNoteSave.on('click', function() {
            // var str = $('#add-note-form').find('textarea[name="note[]"]').val();
            yp.ajax(oConfig.oUrl.note, {
              type: 'post'
            , dataType: 'json'
            , data: $('#add-note-form').serialize()
            }).done(function(msg) {
              if (0 == msg.code) {
                var html = '';
                for (var i = 0, len = msg.data.length; i < len; i++) {
                  html += '<p>' + msg.data[i] + '</p>';
                }
                ui.$checkNote.find('.modal-body').append(html);
              } else {
                alert(msg.message);
              }
            });
          });
        /*添加笔记 end */

        // 关闭表单时初始化
        ui.$btnClose.on('click', function() {
          var $form = $('#add-note-form');
          self.formInit($form);
        });

        // 文章收藏
        ui.$shareCollect.on('click', function() {
          var $this = $(this);
          var shareid = $this.data('shareid');
          yp.ajax(oConfig.oUrl.shareCollect, {
            type: 'post'
          , dataType: 'json'
          , data: {sid: shareid}
          }).done(function(msg) {
            if (0 == msg.code) {
              if (msg.data.isCollect == 1) {
                $this.html('<i class="glyphicon glyphicon-gift"></i> 取消收藏');
              }
              if (msg.data.isCollect == 0) {
                $this.html('<i class="glyphicon glyphicon-gift"></i> 收藏');
              }
            }
          });
        });

        // 文章编辑
        ui.$btnShareEdit.on('click', function() {
          var $editShareForm = $($('#edit-share').html());
          var preHeight = ui.$preHeight.outerHeight();
          $editShareForm.find('textarea').css('height', preHeight);
          ui.$shareContent.before($editShareForm).remove();
          $editShareForm.on('click', '#btn-share-save', function() {
            $editShareForm.submit();
          })
        });

        // fix-nav
        $(document).on('scroll', function() {
          var sTop = document.documentElement.scrollTop || document.body.scrollTop;
          if (sTop > 256) {
            ui.$fixNav.css('position','fixed').css('right', 20).css('top', 10);
          } else {
            ui.$fixNav.css('position','absolute').css('right', 0).css('top',0);
          }
          for (var item in self.offsetTops) {
            if (sTop+50 >= self.offsetTops[item]) {
              ui.$fixNav.find('li.active').removeClass('active');
              ui.$fixNav.find('a[href="#' + item + '"]').parent().addClass('active');
            }
          }
        });

        ui.$fixNav.on('click', 'a[href]', function(e) {
          e.preventDefault();  // 防止页面闪动
          var $this = $(this);
          var id = $this.attr('href').substr(1);
          var offsetTop = self.offsetTops[id];
          $('body').animate({scrollTop: offsetTop-50}, 600);
        });

        // 提交评论
        ui.$formComment.on('submit', function() {
          var $this = $(this);
          if (!$this.find('textarea[data-valid=required]').val()) {
            $this.find('.hide').removeClass('hide').addClass('show');
            return false;
          }
        });
      }
    //表单初始化
    , formInit: function($form) {
        var $formGroup = $form.find('.form-group');
        var len = $formGroup.length;
        $form.find('textarea').val('');
        for (var i = 1; i < len; i++) {
          $formGroup.eq(i).remove();
        }
      }
    };
    oPage.init();
  });
});