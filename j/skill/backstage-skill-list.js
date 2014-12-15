yp.use(['webUploader', 'pagination', 'datetimepicker'], function(yp, WebUploader) {
  var WebUploader = WebUploader;
  yp.ready(function() {
    var ui = {
      $skillList: $('#yp-table-skill-list')
    , $btnEditSave: $('#yp-btn-edit-save')
    , $list: $('#fileList')
    };

    var oConfig = window.oPageConfig;
    var oPage = {
      init: function() {
        this.view();
        this.listen();
      }
    , view: function() {
        var self = this;
        $('#pagination').pagination(oConfig.oData.totalCounts, {
          num_edge_entries: 1, // 边缘页数
          num_display_entries: 4, // 主体页数
          callback: self.paginationCallback,
          items_per_page:10
        });
        $('#datetimepicker').datetimepicker({
          format: 'yyyy-mm-dd',
          language: 'zh-CN',
          pickDate: true,
          pickTime: false,
          inputMask: true,
          todayBtn: true,
          autoclose: true,
          minView: 2
        });
        window.uploader = WebUploader.create({
          auto: false
        , swf: '../lib/webUploader/js/Uploader.swf'
        , server: '/skill/upload'
        , pick: '#filePicker'
        , accept: {
            title: 'Images'
          , extensions: 'gif,jpg,jpeg,bmp,png'
          , mimeTypes: 'image/*'
          }
        });
      }
    , listen: function() {
        // 删除技能列表项
        ui.$skillList.on('click', '.js-btn-del', function() {
          var $this = $(this)
            , skillid = $this.closest('tr').data('skillid');
          confirm('确认删除该项吗？', function(result) {
            if (result) {
              yp.ajax(oConfig.oUrl.skill.get, {
                type: 'post'
              , data: { skillid: skillid }
              }).done(function(msg) {
                if (0 == msg.code) {
                  $this.closest('tr').fadeOut(300, function() {
                    $(this).remove();
                  });
                }
              })
            }
          });
        // 修改技能列表项
        }).on('click', '.js-btn-edit', function() {
          var $this = $(this)
            , skillid = $this.closest('tr').data('skillid');
          window.location.href = '/skill?skillid=' + skillid;
        });
        // 修改保存
        ui.$btnEditSave.on('click', function() {
          var $form = $(this).closest('form');
          var bNotNull = true;
          $form.find('input[type="text"]').each(function() {
            var $this = $(this);
            if (!$this.val()) {
              $this.focus();
              bNotNull = false;
              $form.find('.hide').removeClass('hide');
              return false;
            }
          });
          if (bNotNull) {
            uploader.request('start-upload');
            $form.ajaxSubmit().ajax.done(function(msg) {
              if (0 == msg.code) {
                alert('保存成功');
              }
            });
          }
        });
        // 取消图片
        ui.$list.on('click', '.btn-img-cancel', function() {
          var $this = $(this);
          $this.closest('.file-item').remove();
        });
        // 当有文件添加进来的时候
        uploader.on('fileQueued', function(file) {
          var thumbnailWidth = 100;
          var thumbnailHeight = 100;
          var $li = $(
                '<div id="' + file.id + '" class="file-item thumbnail">' +
                  '<a class="btn btn-img-cancel">X</a>' +
                  '<img>' +
                  '<div class="info">' + file.name + '</div>' +
                '</div>'
              );
          var $img = $li.find('img');
          ui.$list.find('.file-item').remove().end().append($li);
          // 创建缩略图
          uploader.makeThumb(file, function(error, src) {
            if (error) {
              $img.replaceWith('<span>不能预览</span>');
              return;
            }
            $img.attr('src', src);
          }, thumbnailWidth, thumbnailHeight);
        });
        // 文件上传过程中创建进度条实时显示。
        uploader.on('uploaderProgress', function(file, percentage) {
          var $li = $('#' + file.id)
            , $percent = $li.find('.progress span');

          if (!$percent.length) {
            $percent = $('<p class="progress"><span></span></p>').appendTo($li).find('span');
          }
          $percent.css('width', percentage * 100 + '%');
        });
        // 文件上传成功
        uploader.on('uploadSuccess', function(file, response) {
          $('#' + file.id).addClass('upload-state-done');
          console.log(response);
          $('#picurl').val(response.data);
        });
        // 文件上传失败
        uploader.on('uploadError', function(file) {
          var $li = $('#' + file.id)
            , $error = $li.find('.error');
          if (!$error.length) {
            $error = $('<div class="error"></div>').appendTo($li);
          }
          $error.text('上传失败');
        });
        // 完成上传完了
        uploader.on('uploadComplete', function(file) {
          $('#' + file.id).find('.progress').remove();
        });
      }
    , paginationCallback: function(page_index) {
        var html = '';
        yp.ajax(oConfig.oUrl.skill.get, {
          type: 'get'
        , dataType: 'json'
        , data: { page: page_index }
        }).done(function(msg) {
          if (0 == msg.code) {
            var list = msg.data.list;
            for (var i = 0; i < list.length; i++) {
              html += '<tr data-skillid="' + list[i].id + '">'
                  + '<td>' + list[i].skillname + '</td>'
                  + '<td><span class="skill-item-style">' + list[i].type + '</span></td>'
                  + '<td>' + list[i].availtime + '</td>'
                  + '<td>\
                      <a href="javascript:;" class="handle js-btn-edit">\
                        <span class="glyphicon glyphicon-pencil"></span>\
                      </a>\
                      <a href="javascript:;" class="handle js-btn-del">\
                        <span class="glyphicon glyphicon-remove"></span>\
                      </a>\
                    </td>'
                  + '</tr>';
            }
            ui.$skillList.find('tbody').empty().html(html);
          }
        });
      }
    };
    oPage.init();
  });
})
