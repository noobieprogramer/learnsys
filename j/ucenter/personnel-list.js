/* ==========================================================
 * personnel-list.js v20140722
 * ==========================================================
 * Copyright manchun
 *
 * 员工列表页
 * ========================================================== */
 yp.use([''], function() {
  yp.ready(function() {
    var ui = yp.ui;
    var oConfig = window.oPageConfig;
    var oPage = {
      // 初始化
      init: function() {
        this.view();
        this.listen();
      }
      // 视图管理
    , view: function() {
        var self = this;

        ui.$yp_list_table = $('#yp-presonnel-list-table');
        yp.ajax(oConfig.oUrl.getListInfo, {type: 'get', data: {uid: oConfig.oData.uid, permission: oConfig.oData.permission}})
          .done(function(msg) {
            var data = msg.data;
            var str = '';
            $.each(data, function(j, item) {
              var opetate = '<a title="查看" href="user/edit?uid='+item.id+'" class="btn-action glyphicons eye_open btn-info"><i></i></a> '
              if(0 == oConfig.oData.permission) {
                opetate = '<a title="编辑" href="user/edit?uid='+item.id+'" class="btn-action glyphicons pencil btn-success"><i></i></a> '
                          + '<a title="删除" href="javascript:;" class="btn-action glyphicons remove_2 btn-danger yp-btn-remove"><i></i></a>';
              }
              str += yp.format('<tr data-id="${uid}"><td>${name}</td><td>${phone}</td><td>${url}</td><td>${mail}</td><td class="center">'+ opetate +'</td></tr>'
                      , {uid: item.id, name: item.name, command: item.command, phone: item.phone, url: item.url, mail: item.mail});
            });
            ui.$yp_list_table.find('tbody').html(str);
         });
      }
      // 事件绑定
    , listen: function() {
        var self = this;

        // 删除
        ui.$yp_list_table.on('click','.yp-btn-remove', function(e) {
          var $this = $(this);
          var $parent = $this.closest('tr');
          var id = $parent.data('id');
          bootbox.confirm('确定要删除吗?', function(result){
            if(result){
              yp.ajax(oConfig.oUrl.delUser, {type: 'post', data: {uid: id}})
                .done(function(msg) {
                if(msg.code == 0) {
                  alert(msg.message);
                  ui.$yp_list_table.find($parent).remove();
                }else{
                  alert(msg.message);
                }
              })
            }
          });
        });
          
      }
    };
  oPage.init();
  });
});