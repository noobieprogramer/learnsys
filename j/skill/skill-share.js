yp.use(['kindeditor'], function(yp) {
  yp.ready(function() {
    var ui = {
      $ypShareBtnSubmit: $('#yp-share-btn-submit')
    };

    var oPage = {
      init: function() {
        this.view();
        this.listen();
      }
    , view: function() {
        window.editor = KindEditor.create('#editor_id');
      }
    , listen: function() {
        var self = this;
        // 发布分享
        ui.$ypShareBtnSubmit.on('click', function() {
          var $this = $(this)
            , $form = $this.closest('form');
          window.editor.sync();
          var notNull = $('#yp-share-title').val();
          if (notNull) {
            $form.ajaxSubmit().ajax.done(function(msg){
              if(msg.code == 0){
                alert('添加成功！');
                window.location.reload();
              }else{
                alert(msg.message);
              }

            });
          } else {
            $('#yp-share-title').focus();
          }
        });
      }
    };
    oPage.init();
  });
});