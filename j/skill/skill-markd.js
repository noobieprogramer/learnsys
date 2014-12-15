
yp.ready(function() {
  var ui = {
    $bsCover : $('.fContainer .bs-cover')
  , $bsRecover : $('.fContainer .bs-recover')
  , $btnSubmit: $('#yp-markd-submit')
  }
  var Page = {
  	init: function() {
      this.view();
      this.listen();
    }
  , view: function() {
      var editor = new Editor();
      editor.render();
    }
  , listen: function() {
      var self = this;
      ui.$btnSubmit.on('click', function() {
        var $this = $(this);
        var $form = $this.closest('form');
        if ($form.find('input').val() && $form.find('.wiki-content').text()) {
          $form.ajaxSubmit()
               .ajax.done(function(msg){
                  if(msg.code == 0){
                    alert('添加成功！');
                  }else{
                    alert(msg.message);
                  }
               });
        } else {
          $('.alert').fadeIn().removeClass('hide');
          $(document).scrollTop(0);
        }
      })
    }
  }
  Page.init();
});